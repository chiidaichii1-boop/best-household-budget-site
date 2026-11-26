// views.js — semua tampilan DompetKita, dirender dari model yang disiapkan main.js.
// Tidak ada data yang diambil dari jaringan: semua angka berasal dari state lokal.
import { CATEGORIES, BILLS, TIPS, MONTHLY_SAVING_TARGET } from './data.js';

export function formatRp(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return MONTH_NAMES[m - 1] + ' ' + y;
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

export function catById(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: id, icon: '•', color: '#64748b' };
}

function monthNav(month, canPrev, canNext) {
  return '<div class="month-nav">' +
    '<button class="btn" data-action="prev-month" ' + (canPrev ? '' : 'disabled') + '>‹ Bulan lalu</button>' +
    '<span class="month-label">' + monthLabel(month) + '</span>' +
    '<button class="btn" data-action="next-month" ' + (canNext ? '' : 'disabled') + '>Bulan depan ›</button>' +
    '</div>';
}

function txRow(t, showDate) {
  const cat = catById(t.category);
  const isIn = t.kind === 'pemasukan';
  return '<tr>' +
    (showDate ? '<td>' + esc(t.date.slice(8)) + ' ' + esc(monthLabel(t.date.slice(0, 7)).split(' ')[0]) + '</td>' : '') +
    '<td>' + esc(t.note) + '</td>' +
    '<td class="hide-m"><span class="tag">' + cat.icon + ' ' + esc(cat.label) + '</span></td>' +
    '<td><span class="tag ' + (isIn ? 'in' : 'out') + '">' + (isIn ? 'Masuk' : 'Keluar') + '</span></td>' +
    '<td class="num ' + (isIn ? 'pos' : 'neg') + '">' + (isIn ? '+' : '−') + formatRp(t.amount) + '</td>' +
    '<td class="num"><button class="btn small" data-action="edit-tx" data-id="' + esc(t.id) + '">Ubah</button> ' +
    '<button class="btn small warn" data-action="del-tx" data-id="' + esc(t.id) + '">Hapus</button></td>' +
    '</tr>';
}

// ---------- Beranda ----------
export function viewDashboard(m) {
  const recent = m.txs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const donutData = m.byCat.filter((c) => c.spent > 0);
  const legend = donutData.map((c) =>
    '<li><span class="dot" style="background:' + c.cat.color + '"></span>' +
    esc(c.cat.label) + '<span class="amt">' + formatRp(c.spent) + '</span></li>').join('');
  const bills = BILLS.map((b) => {
    const paid = m.txs.some((t) => t.kind === 'pengeluaran' && t.category === b.category &&
      t.note.toLowerCase().includes(b.label.split(' ')[0].toLowerCase()) && t.amount === b.amount);
    return '<tr><td>' + esc(b.label) + '</td><td class="hide-m">Tiap tgl ' + b.dueDay + '</td>' +
      '<td class="num">' + formatRp(b.amount) + '</td>' +
      '<td>' + (paid ? '<span class="tag in">Lunas</span>' : '<span class="tag out">Belum dibayar</span>') + '</td></tr>';
  }).join('');
  const budgetTop = m.byCat.slice().sort((a, b) => b.pct - a.pct).slice(0, 4).map((c) =>
    '<div class="budget-row"><div class="budget-top"><b>' + c.cat.icon + ' ' + esc(c.cat.label) + '</b>' +
    '<span class="amt">' + formatRp(c.spent) + ' / ' + formatRp(c.budget) + '</span></div>' +
    '<div class="bar"><i class="' + (c.pct >= 100 ? 'over' : c.pct >= 80 ? 'warnfill' : '') +
    '" style="width:' + Math.min(100, c.pct) + '%"></i></div>' +
    '<div class="meta"><span>' + Math.round(c.pct) + '% dari anggaran</span>' +
    '<span>' + (c.budget - c.spent >= 0 ? 'Sisa ' + formatRp(c.budget - c.spent) : 'Lebih ' + formatRp(c.spent - c.budget)) + '</span></div></div>'
  ).join('');

  return '<div class="page-head"><div><p class="kicker">Ringkasan keluarga</p>' +
    '<h1>Halo, Keluarga Mahesa 👋</h1>' +
    '<p>Ini kondisi keuangan rumah tangga bulan ' + monthLabel(m.month) + '.</p></div>' +
    monthNav(m.month, m.canPrev, m.canNext) + '</div>' +
    '<section class="cards">' +
    '<div class="card"><h2>Pemasukan</h2><div class="big pos">' + formatRp(m.income) + '</div>' +
    '<div class="sub">Gaji + usaha sampingan</div></div>' +
    '<div class="card"><h2>Pengeluaran</h2><div class="big neg">' + formatRp(m.spent) + '</div>' +
    '<div class="sub">' + m.txs.filter((t) => t.kind === 'pengeluaran').length + ' transaksi bulan ini</div></div>' +
    '<div class="card accent"><h2>Sisa Uang</h2><div class="big">' + formatRp(m.balance) + '</div>' +
    '<div class="sub">Pemasukan dikurangi pengeluaran</div></div>' +
    '<div class="card"><h2>Tingkat Tabungan</h2><div class="big">' + Math.round(m.savingRate * 100) + '%</div>' +
    '<div class="sub">Target: ' + formatRp(MONTHLY_SAVING_TARGET) + ' / bulan</div></div>' +
    '</section>' +
    '<div class="grid-2"><section class="panel"><h2>Pengeluaran per Kategori</h2>' +
    '<p class="hint">Ke mana uang keluarga pergi bulan ini.</p>' +
    '<div class="chart-wrap"><canvas class="chart" id="donut" width="220" height="220" role="img" ' +
    'aria-label="Diagram lingkaran pengeluaran per kategori"></canvas>' +
    '<ul class="legend" style="flex:1;min-width:220px">' + legend + '</ul></div></section>' +
    '<section class="panel"><div class="panel-head"><h2>Transaksi Terakhir</h2>' +
    '<a href="#/transaksi">Lihat semua →</a></div>' +
    '<p class="hint">Enam transaksi terbaru bulan ini.</p>' +
    '<table><thead><tr><th>Keterangan</th><th>Jenis</th><th class="num">Jumlah</th></tr></thead><tbody>' +
    recent.map((t) => '<tr><td>' + esc(t.note) + '<br><small style="color:var(--muted)">' + esc(t.date) + ' · ' +
      esc(catById(t.category).label) + '</small></td>' +
      '<td><span class="tag ' + (t.kind === 'pemasukan' ? 'in' : 'out') + '">' +
      (t.kind === 'pemasukan' ? 'Masuk' : 'Keluar') + '</span></td>' +
      '<td class="num ' + (t.kind === 'pemasukan' ? 'pos' : 'neg') + '">' +
      (t.kind === 'pemasukan' ? '+' : '−') + formatRp(t.amount) + '</td></tr>').join('') +
    '</tbody></table></section></div>' +
    '<div class="grid-2 equal"><section class="panel"><div class="panel-head"><h2>Anggaran Terpakai</h2>' +
    '<a href="#/anggaran">Atur anggaran →</a></div>' +
    '<p class="hint">Kategori dengan pemakaian anggaran terbesar.</p>' + budgetTop + '</section>' +
    '<section class="panel"><h2>Tagihan Rutin</h2>' +
    '<p class="hint">Tagihan yang jatuh tempo setiap bulan.</p>' +
    '<table><thead><tr><th>Tagihan</th><th class="hide-m">Jatuh tempo</th><th class="num">Jumlah</th><th>Status</th></tr></thead><tbody>' +
    bills + '</tbody></table>' +
    '<div class="tip" style="margin-top:16px"><b>💡 Tips bulan ini:</b> ' + esc(TIPS[1]) + '</div>' +
    '</section></div>';
}

// ---------- Transaksi ----------
export function viewTransactions(m) {
  const cats = CATEGORIES.map((c) => '<option value="' + c.id + '"' +
    (m.filterCat === c.id ? ' selected' : '') + '>' + esc(c.label) + '</option>').join('');
  const rows = m.filtered.map((t) => txRow(t, true)).join('');
  const edit = m.editing;
  return '<div class="page-head"><div><p class="kicker">Semua pemasukan &amp; pengeluaran</p>' +
    '<h1>Transaksi</h1><p>' + m.filtered.length + ' dari ' + m.txs.length +
    ' transaksi bulan ' + monthLabel(m.month) + '.</p></div>' + monthNav(m.month, m.canPrev, m.canNext) + '</div>' +
    '<section class="panel"><h2>' + (edit ? 'Ubah Transaksi' : 'Tambah Transaksi') + '</h2>' +
    '<p class="hint">Catat pemasukan atau pengeluaran baru — langsung tersimpan di perangkat Anda.</p>' +
    '<form class="add-form" id="tx-form">' +
    '<div><label for="f-date">Tanggal</label><input id="f-date" name="date" type="date" required value="' +
    esc(edit ? edit.date : m.month + '-26') + '"></div>' +
    '<div><label for="f-kind">Jenis</label><select id="f-kind" name="kind">' +
    '<option value="pengeluaran"' + (edit && edit.kind === 'pengeluaran' ? ' selected' : '') + '>Pengeluaran</option>' +
    '<option value="pemasukan"' + (edit && edit.kind === 'pemasukan' ? ' selected' : '') + '>Pemasukan</option></select></div>' +
    '<div><label for="f-cat">Kategori</label><select id="f-cat" name="category">' +
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (edit && edit.category === c.id ? ' selected' : '') + '>' +
      esc(c.label) + '</option>').join('') +
    '<option value="gaji-mahesa"' + (edit && edit.category === 'gaji-mahesa' ? ' selected' : '') + '>Gaji Mahesa</option>' +
    '<option value="gaji-ratna"' + (edit && edit.category === 'gaji-ratna' ? ' selected' : '') + '>Gaji Ratna</option>' +
    '<option value="usaha-sampingan"' + (edit && edit.category === 'usaha-sampingan' ? ' selected' : '') + '>Usaha sampingan</option>' +
    '</select></div>' +
    '<div><label for="f-amount">Jumlah (Rp)</label><input id="f-amount" name="amount" type="number" min="1000" step="1000" required placeholder="cth. 250000" value="' +
    esc(edit ? edit.amount : '') + '"></div>' +
    '<div class="full"><label for="f-note">Keterangan</label><input id="f-note" name="note" type="text" required maxlength="120" placeholder="cth. Belanja mingguan Pasar Batang" value="' +
    esc(edit ? edit.note : '') + '"></div>' +
    '<div class="full"><button class="btn primary" type="submit">' + (edit ? 'Simpan Perubahan' : '＋ Tambah Transaksi') + '</button> ' +
    (edit ? '<button class="btn" type="button" data-action="cancel-edit">Batal</button>' : '') + '</div>' +
    '</form></section>' +
    '<section class="panel"><h2>Daftar Transaksi</h2>' +
    '<div class="toolbar"><div class="field grow"><label for="q">Cari keterangan</label>' +
    '<input id="q" type="search" placeholder="cth. pasar, listrik, SPP…" value="' + esc(m.query) + '"></div>' +
    '<div class="field"><label for="f-cat-filter">Kategori</label><select id="f-cat-filter">' +
    '<option value="">Semua kategori</option>' + cats + '</select></div>' +
    '<div class="field"><label for="f-kind-filter">Jenis</label><select id="f-kind-filter">' +
    '<option value="">Semua</option>' +
    '<option value="pemasukan"' + (m.filterKind === 'pemasukan' ? ' selected' : '') + '>Pemasukan</option>' +
    '<option value="pengeluaran"' + (m.filterKind === 'pengeluaran' ? ' selected' : '') + '>Pengeluaran</option></select></div></div>' +
    (rows ? '<table><thead><tr><th>Tgl</th><th>Keterangan</th><th class="hide-m">Kategori</th><th>Jenis</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>' +
      rows + '</tbody></table>'
      : '<p class="empty">Tidak ada transaksi yang cocok dengan pencarian Anda.</p>') +
    '<p class="hint" style="margin-top:12px">Total pemasukan: <b class="pos">' + formatRp(m.income) +
    '</b> · Total pengeluaran: <b class="neg">' + formatRp(m.spent) + '</b></p></section>';
}

// ---------- Anggaran ----------
export function viewBudget(m) {
  const rows = m.byCat.map((c) => {
    const remaining = c.budget - c.spent;
    const status = c.pct >= 100 ? '<span class="tag out">Melebihi anggaran</span>'
      : c.pct >= 80 ? '<span class="tag">Hampir habis</span>'
      : '<span class="tag in">Aman</span>';
    return '<div class="budget-row"><div class="budget-top"><b>' + c.cat.icon + ' ' + esc(c.cat.label) + '</b>' +
      '<span class="amt">' + formatRp(c.spent) + ' dari ' + formatRp(c.budget) + '</span></div>' +
      '<div class="bar"><i class="' + (c.pct >= 100 ? 'over' : c.pct >= 80 ? 'warnfill' : '') +
      '" style="width:' + Math.min(100, c.pct) + '%"></i></div>' +
      '<div class="meta"><span>' + Math.round(c.pct) + '% terpakai · ' +
      (remaining >= 0 ? 'sisa ' + formatRp(remaining) : 'lebih ' + formatRp(-remaining)) + '</span>' + status + '</div>' +
      '<div style="margin-top:8px;display:flex;gap:8px;align-items:center">' +
      '<label style="margin:0;font-weight:400" for="b-' + c.cat.id + '">Ubah batas bulanan (Rp)</label>' +
      '<input id="b-' + c.cat.id + '" type="number" min="0" step="50000" value="' + c.budget +
      '" style="max-width:170px" data-budget-for="' + c.cat.id + '">' +
      '<button class="btn small" data-action="save-budget" data-id="' + c.cat.id + '">Simpan</button></div></div>';
  }).join('');
  const totalBudget = m.byCat.reduce((s, c) => s + c.budget, 0);
  return '<div class="page-head"><div><p class="kicker">Batas belanja tiap kategori</p>' +
    '<h1>Anggaran Bulanan</h1><p>Atur batas belanja tiap kategori untuk bulan ' +
    monthLabel(m.month) + '.</p></div>' + monthNav(m.month, m.canPrev, m.canNext) + '</div>' +
    '<section class="cards"><div class="card"><h2>Total Anggaran</h2><div class="big">' +
    formatRp(totalBudget) + '</div><div class="sub">Batas semua kategori</div></div>' +
    '<div class="card"><h2>Terpakai</h2><div class="big neg">' + formatRp(m.spent) + '</div>' +
    '<div class="sub">' + Math.round((m.spent / totalBudget) * 100) + '% dari total anggaran</div></div>' +
    '<div class="card accent"><h2>Sisa Anggaran</h2><div class="big">' + formatRp(totalBudget - m.spent) + '</div>' +
    '<div class="sub">Masih bisa dibelanjakan bulan ini</div></div></section>' +
    '<section class="panel"><h2>Anggaran per Kategori</h2>' +
    '<p class="hint">Ubah batas bulanan kapan saja — perubahan langsung tersimpan.</p>' + rows + '</section>' +
    '<div class="tip"><b>💡 Cara memakai anggaran:</b> tentukan batas tiap kategori di awal bulan, ' +
    'catat setiap pengeluaran, dan cek halaman ini tiap minggu. Kategori yang melewati 80% akan ditandai “Hampir habis”.</div>';
}

// ---------- Tabungan / Tujuan ----------
export function viewGoals(m) {
  const totalSaved = m.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = m.goals.reduce((s, g) => s + g.target, 0);
  const cards = m.goals.map((g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    return '<div class="goal"><div class="goal-top"><b>🎯 ' + esc(g.name) + '</b>' +
      '<span>' + formatRp(g.saved) + ' / ' + formatRp(g.target) + '</span></div>' +
      '<p>' + esc(g.note) + '</p>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="meta">' + pct + '% tercapai · kurang ' + formatRp(Math.max(0, g.target - g.saved)) + '</div>' +
      '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
      '<input type="number" min="10000" step="10000" placeholder="Tambah tabungan (Rp)" ' +
      'style="max-width:220px" data-goal-for="' + esc(g.id) + '" aria-label="Jumlah tambahan untuk ' + esc(g.name) + '">' +
      '<button class="btn primary small" data-action="add-goal" data-id="' + esc(g.id) + '">＋ Tambah Tabungan</button></div></div>';
  }).join('');
  return '<div class="page-head"><div><p class="kicker">Dana masa depan keluarga</p>' +
    '<h1>Tabungan &amp; Tujuan</h1><p>Empat tujuan tabungan keluarga, dipantau tiap bulan.</p></div></div>' +
    '<section class="cards"><div class="card"><h2>Total Terkumpul</h2><div class="big">' +
    formatRp(totalSaved) + '</div><div class="sub">Dari semua tujuan</div></div>' +
    '<div class="card"><h2>Total Target</h2><div class="big">' + formatRp(totalTarget) + '</div>' +
    '<div class="sub">' + Math.round((totalSaved / totalTarget) * 100) + '% tercapai</div></div>' +
    '<div class="card accent"><h2>Target Tabungan / Bulan</h2><div class="big">' +
    formatRp(MONTHLY_SAVING_TARGET) + '</div><div class="sub">Disetor di awal gajian</div></div></section>' +
    '<section class="panel"><h2>Tujuan Tabungan</h2>' +
    '<p class="hint">Tambahkan setoran kapan saja — progres langsung terhitung.</p>' + cards + '</section>' +
    '<div class="tip"><b>💡 Tips menabung:</b> ' + esc(TIPS[3]) + '</div>';
}

// ---------- Laporan ----------
export function viewReport(m) {
  const rows = m.byCat.map((c) => {
    const prev = m.prevByCat[c.cat.id] || 0;
    const diff = c.spent - prev;
    const diffTxt = prev === 0 ? '—' : (diff > 0 ? '▲ +' : '▼ −') + formatRp(Math.abs(diff));
    return '<tr><td>' + c.cat.icon + ' ' + esc(c.cat.label) + '</td>' +
      '<td class="num">' + formatRp(c.spent) + '</td><td class="num">' + formatRp(prev) + '</td>' +
      '<td class="num ' + (diff > 0 ? 'neg' : diff < 0 ? 'pos' : '') + '">' + diffTxt + '</td></tr>';
  }).join('');
  return '<div class="page-head"><div><p class="kicker">Perbandingan antar bulan</p>' +
    '<h1>Laporan Keuangan</h1><p>Bagaimana keuangan keluarga berubah dari bulan ke bulan.</p></div>' +
    monthNav(m.month, m.canPrev, m.canNext) + '</div>' +
    '<section class="panel"><h2>Pemasukan vs Pengeluaran — 3 Bulan Terakhir</h2>' +
    '<p class="hint">Batang hijau: pemasukan. Batang merah: pengeluaran.</p>' +
    '<canvas class="chart" id="bars" width="960" height="300" role="img" ' +
    'aria-label="Diagram batang pemasukan dan pengeluaran tiga bulan terakhir"></canvas></section>' +
    '<div class="grid-2"><section class="panel"><h2>Per Kategori: Bulan Ini vs Bulan Lalu</h2>' +
    '<p class="hint">Bulan lalu: ' + monthLabel(m.prevMonth) + '.</p>' +
    '<table><thead><tr><th>Kategori</th><th class="num">Bulan ini</th><th class="num">Bulan lalu</th><th class="num">Selisih</th></tr></thead><tbody>' +
    rows + '</tbody></table></section>' +
    '<section class="panel"><h2>Yang Bisa Dipetik</h2>' +
    '<p class="hint">Catatan otomatis dari data keluarga.</p>' +
    m.insights.map((s) => '<div class="insight"><b>' + esc(s.title) + '</b>' + esc(s.body) + '</div>').join('') +
    '<div class="tip" style="margin-top:14px"><b>💡 Tips:</b> ' + esc(TIPS[0]) + '</div>' +
    '</section></div>';
}

// ---------- Gambar (canvas polos, tanpa pustaka) ----------
export function drawDonut(canvas, items) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const total = items.reduce((s, it) => s + it.spent, 0) || 1;
  const cx = 110, cy = 110, r = 88, inner = 56;
  let start = -Math.PI / 2;
  for (const it of items) {
    const frac = it.spent / total;
    const end = start + frac * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = it.cat.color;
    ctx.fill();
    start = end;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#1c1917';
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Total', cx, cy - 8);
  ctx.font = '800 17px system-ui, sans-serif';
  ctx.fillText(formatRp(total).replace('Rp ', 'Rp'), cx, cy + 14);
}

export function drawBars(canvas, months) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const padL = 70, padB = 34, padT = 18, padR = 14;
  const maxV = Math.max(...months.flatMap((mo) => [mo.income, mo.spent]), 1);
  const chartW = W - padL - padR, chartH = H - padT - padB;
  ctx.clearRect(0, 0, W, H);
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillStyle = '#78716c';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (maxV * i) / 4;
    const y = padT + chartH - (chartH * i) / 4;
    ctx.fillText('Rp ' + (v / 1000000).toFixed(1) + ' jt', padL - 8, y + 4);
    ctx.strokeStyle = '#e7e5e4';
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
  }
  const groupW = chartW / months.length;
  const barW = Math.min(56, groupW / 3.4);
  months.forEach((mo, i) => {
    const gx = padL + i * groupW + groupW / 2;
    const hIn = (mo.income / maxV) * chartH;
    const hOut = (mo.spent / maxV) * chartH;
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(gx - barW - 4, padT + chartH - hIn, barW, hIn);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(gx + 4, padT + chartH - hOut, barW, hOut);
    ctx.fillStyle = '#1c1917';
    ctx.textAlign = 'center';
    ctx.font = '700 13px system-ui, sans-serif';
    ctx.fillText(monthLabel(mo.month).replace(' 2026', ''), gx, H - 10);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#0f766e';
    ctx.fillText((mo.income / 1000000).toFixed(1) + ' jt', gx - barW / 2 - 4, padT + chartH - hIn - 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillText((mo.spent / 1000000).toFixed(1) + ' jt', gx + barW / 2 + 4, padT + chartH - hOut - 6);
  });
}
