// main.js — logika DompetKita: state, rute hash, penyimpanan lokal, dan aksi pengguna.
// Semua data tinggal di localStorage peramban; tidak ada panggilan jaringan.
import {
  FAMILY, MONTHS, CATEGORIES, SEED_TRANSACTIONS, SEED_GOALS, MONTHLY_SAVING_TARGET,
} from './data.js';
import {
  formatRp, monthLabel, esc, catById,
  viewDashboard, viewTransactions, viewBudget, viewGoals, viewReport,
  drawDonut, drawBars,
} from './views.js';

const STORAGE_KEY = 'dompetkita-v1';
const viewEl = document.getElementById('view');

// ---------- state ----------
function freshState() {
  return {
    month: '2026-11',
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return freshState();
    return {
      month: MONTHS.includes(parsed.month) ? parsed.month : '2026-11',
      transactions: parsed.transactions,
      budgets: { ...freshState().budgets, ...(parsed.budgets || {}) },
      goals: parsed.goals,
    };
  } catch {
    return freshState();
  }
}

let state = loadState();
let query = '';
let filterCat = '';
let filterKind = '';
let editingId = null;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh / tidak tersedia: situs tetap jalan untuk sesi ini.
  }
}

// ---------- model ----------
function monthIndex(ym) { return MONTHS.indexOf(ym); }

function txsFor(month) {
  return state.transactions.filter((t) => t.date.startsWith(month));
}

function sums(txs) {
  let income = 0, spent = 0;
  for (const t of txs) {
    if (t.kind === 'pemasukan') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, balance: income - spent };
}

function byCategory(month) {
  const txs = txsFor(month);
  return CATEGORIES.map((cat) => {
    const spent = txs
      .filter((t) => t.kind === 'pengeluaran' && t.category === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    const budget = state.budgets[cat.id] ?? cat.budget;
    return { cat, spent, budget, pct: budget > 0 ? (spent / budget) * 100 : 0 };
  });
}

function byCategoryMap(month) {
  const out = {};
  for (const c of byCategory(month)) out[c.cat.id] = c.spent;
  return out;
}

function buildModel() {
  const month = state.month;
  const txs = txsFor(month);
  const { income, spent, balance } = sums(txs);
  const idx = monthIndex(month);
  const prevMonth = idx > 0 ? MONTHS[idx - 1] : month;
  const prev = sums(txsFor(prevMonth));
  const filtered = txs
    .filter((t) => (filterKind ? t.kind === filterKind : true))
    .filter((t) => (filterCat ? t.category === filterCat : true))
    .filter((t) => (query ? (t.note + ' ' + t.category).toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const byCat = byCategory(month);
  const biggest = byCat.slice().sort((a, b) => b.spent - a.spent)[0];
  const insights = [
    {
      title: 'Kategori terbesar bulan ini',
      body: biggest && biggest.spent > 0
        ? esc(biggest.cat.label) + ' menyerap ' + formatRp(biggest.spent) + ' (' +
          Math.round((biggest.spent / Math.max(1, spent)) * 100) + '% dari semua pengeluaran).'
        : 'Belum ada pengeluaran tercatat bulan ini.',
    },
    {
      title: 'Dibanding bulan lalu',
      body: spent > prev.spent
        ? 'Pengeluaran naik ' + formatRp(spent - prev.spent) + ' dari ' + monthLabel(prevMonth) +
          '. Cek kategori Belanja Harian dan Makan di Luar.'
        : 'Pengeluaran turun ' + formatRp(prev.spent - spent) + ' dari ' + monthLabel(prevMonth) +
          '. Keluarga Mahesa makin hemat — pertahankan!',
    },
    {
      title: 'Tabungan bulan ini',
      body: 'Sisa uang ' + formatRp(balance) + ' — target tabungan ' + formatRp(MONTHLY_SAVING_TARGET) +
        ' per bulan ' + (balance >= MONTHLY_SAVING_TARGET ? 'tercapai.' : 'belum tercapai; sisihkan di awal gajian.'),
    },
  ];
  return {
    month, prevMonth, canPrev: idx > 0, canNext: idx < MONTHS.length - 1,
    txs, filtered, income, spent, balance,
    savingRate: income > 0 ? balance / income : 0,
    byCat, prevByCat: byCategoryMap(prevMonth),
    goals: state.goals,
    editing: editingId ? state.transactions.find((t) => t.id === editingId) || null : null,
    query, filterCat, filterKind,
    insights,
    months: MONTHS.map((m) => ({ month: m, ...sums(txsFor(m)) })),
  };
}

// ---------- routing ----------
function route() {
  const hash = (location.hash || '#/').replace(/^#\/?/, '');
  const name = hash.split('/')[0] || '';
  const model = buildModel();
  let html = '';
  if (name === 'transaksi') html = viewTransactions(model);
  else if (name === 'anggaran') html = viewBudget(model);
  else if (name === 'tujuan') html = viewGoals(model);
  else if (name === 'laporan') html = viewReport(model);
  else html = viewDashboard(model);
  viewEl.innerHTML = html;
  document.title = ({
    '': 'DompetKita — Anggaran Rumah Tangga Keluarga Mahesa',
    transaksi: 'Transaksi — DompetKita',
    anggaran: 'Anggaran Bulanan — DompetKita',
    tujuan: 'Tabungan & Tujuan — DompetKita',
    laporan: 'Laporan Keuangan — DompetKita',
  })[name] || 'DompetKita';
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', (a.dataset.route || '') === name);
  });
  const donut = document.getElementById('donut');
  if (donut) drawDonut(donut, model.byCat.filter((c) => c.spent > 0));
  const bars = document.getElementById('bars');
  if (bars) drawBars(bars, model.months);
  const q = document.getElementById('q');
  if (q) q.addEventListener('input', (e) => { query = e.target.value; renderKeepingFocus('q', e.target.selectionStart); });
  const cf = document.getElementById('f-cat-filter');
  if (cf) cf.addEventListener('change', (e) => { filterCat = e.target.value; route(); });
  const kf = document.getElementById('f-kind-filter');
  if (kf) kf.addEventListener('change', (e) => { filterKind = e.target.value; route(); });
  const form = document.getElementById('tx-form');
  if (form) form.addEventListener('submit', submitTxForm);
}

function renderKeepingFocus(id, pos) {
  route();
  const el = document.getElementById(id);
  if (el) { el.focus(); el.setSelectionRange(pos, pos); }
}

// ---------- aksi ----------
function submitTxForm(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const date = String(fd.get('date') || '');
  const kind = fd.get('kind') === 'pemasukan' ? 'pemasukan' : 'pengeluaran';
  const category = String(fd.get('category') || 'lainnya');
  const note = String(fd.get('note') || '').trim();
  const amount = Math.max(0, Math.round(Number(fd.get('amount')) || 0));
  if (!date || !note || amount <= 0) return;
  if (editingId) {
    const t = state.transactions.find((x) => x.id === editingId);
    if (t) { t.date = date; t.kind = kind; t.category = category; t.note = note; t.amount = amount; }
    editingId = null;
  } else {
    state.transactions.push({
      id: 't-user-' + Date.now().toString(36) + Math.floor(Math.random() * 1000),
      date, kind, category, note, amount,
    });
  }
  // Pindah ke bulan transaksi bila masih dalam rentang yang tersedia.
  if (MONTHS.includes(date.slice(0, 7))) state.month = date.slice(0, 7);
  saveState();
  route();
}

function onClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'prev-month' || action === 'next-month') {
    const idx = monthIndex(state.month);
    const next = MONTHS[action === 'prev-month' ? idx - 1 : idx + 1];
    if (next) { state.month = next; saveState(); route(); }
  } else if (action === 'del-tx') {
    const t = state.transactions.find((x) => x.id === id);
    if (t && confirm('Hapus transaksi "' + t.note + '" (' + formatRp(t.amount) + ')?')) {
      state.transactions = state.transactions.filter((x) => x.id !== id);
      saveState();
      route();
    }
  } else if (action === 'edit-tx') {
    editingId = id;
    route();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (action === 'cancel-edit') {
    editingId = null;
    route();
  } else if (action === 'save-budget') {
    const input = document.querySelector('[data-budget-for="' + id + '"]');
    const value = Math.max(0, Math.round(Number(input && input.value) || 0));
    if (value > 0) {
      state.budgets[id] = value;
      saveState();
      route();
    }
  } else if (action === 'add-goal') {
    const input = document.querySelector('[data-goal-for="' + id + '"]');
    const value = Math.max(0, Math.round(Number(input && input.value) || 0));
    const goal = state.goals.find((g) => g.id === id);
    if (goal && value > 0) {
      goal.saved += value;
      saveState();
      route();
    } else if (input) {
      input.focus();
    }
  }
}

document.addEventListener('click', onClick);
window.addEventListener('hashchange', () => { editingId = null; route(); });
route();
console.log('DompetKita siap — ' + FAMILY.name + ', ' + FAMILY.city);
