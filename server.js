const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const STATIC_DIR = path.resolve(__dirname);
app.use(express.static(STATIC_DIR));

function findDbFile() {
  const files = fs.readdirSync(STATIC_DIR);
  const dbs = files.filter(f => f.toLowerCase().endsWith('.db'));
  if (dbs.length === 0) return null;
  // Prefer a file that likely is the waste forecast DB, else pick first .db file
  const prefer = dbs.find(f => f.toLowerCase().includes('waste_forecast')) || dbs[0];
  return path.join(STATIC_DIR, prefer);
}

const DB_PATH = process.env.DB_PATH && fs.existsSync(process.env.DB_PATH) ? process.env.DB_PATH : findDbFile();
let db = null;
if (DB_PATH) {
  console.log('Attempting to open DB at:', DB_PATH);
  db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('SQLite open error:', err && err.message ? err.message : err);
    } else {
      console.log('Opened DB:', DB_PATH);
    }
  });
}

app.get('/api/dbinfo', (req, res) => {
  if (!DB_PATH) return res.json({ ok: false, error: 'No .db file found in site directory' });
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true, db: path.basename(DB_PATH), tables: rows.map(r => r.name) });
  });
});

app.get('/api/query', (req, res) => {
  const table = req.query.table;
  if (!table) return res.status(400).json({ ok: false, error: 'table query param required' });
  if (!DB_PATH) return res.status(400).json({ ok: false, error: 'No DB available' });
  // simple, return all rows (limit to 20000)
  const q = `SELECT * FROM ${table} LIMIT 20000`;
  db.all(q, (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true, table, rows });
  });
});

// Smart /api/data that tries to return structured JSON similar to data.js
app.get('/api/data', async (req, res) => {
  try {
    // Wrap entire handler to catch unexpected errors and log them
  // Provide server-side filtered and pre-aggregated data for the dashboard.
  // Accepts query params: year, month, month_no, barangay, wasteType, dataType
  const q = {
    year: req.query.year || 'All',
    month: req.query.month || 'All',
    month_no: req.query.month_no || 'All',
    barangay: req.query.barangay || 'All',
    wasteType: req.query.wasteType || req.query.waste_type || 'All',
    dataType: req.query.dataType || req.query.data_type || 'All'
  };

  // If DB not available try to return parsed data.js (unfiltered) with a notice
  if (!DB_PATH) {
    const dataJs = path.join(STATIC_DIR, 'data.js');
    if (fs.existsSync(dataJs)) {
      const txt = fs.readFileSync(dataJs, 'utf8');
      const m = txt.match(/const\s+WASTE_DATA\s*=\s*(\{[\s\S]*\})\s*;?/m);
      if (m && m[1]) {
        try {
          const fn = new Function('return ' + m[1]);
          const obj = fn();
          return res.json({ ok: true, source: 'data.js', filters: q, data: obj });
        } catch (e) {
          return res.status(500).json({ ok: false, error: 'Failed to parse data.js', detail: e.message });
        }
      }
    }
    return res.status(404).json({ ok: false, error: 'No DB and no data.js found' });
  }

  // helper: normalize string for comparisons
  const normalize = (v) => (v === null || v === undefined) ? '' : String(v).trim().toLowerCase();

  // load known tables if present
  const tables = await new Promise((resolve) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
      if (err) return resolve([]);
      resolve(rows.map(r => r.name));
    });
  });

  // helper to run SQL queries with params
  const dbAll = (sql, params=[]) => new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows || [])));

  // Build WHERE clause from provided filters (use exact column names from your DB)
  const whereParts = [];
  const paramsArr = [];
  if (q.year && q.year !== 'All') { whereParts.push('year = ?'); paramsArr.push(Number(q.year)); }
  if (q.month_no && q.month_no !== 'All') { whereParts.push('month_no = ?'); paramsArr.push(Number(q.month_no)); }
  else if (q.month && q.month !== 'All') { whereParts.push('month = ?'); paramsArr.push(q.month); }
  if (q.barangay && q.barangay !== 'All') { whereParts.push('barangay = ?'); paramsArr.push(q.barangay); }
  if (q.wasteType && q.wasteType !== 'All') { whereParts.push('waste_type = ?'); paramsArr.push(q.wasteType); }
  const whereSql = whereParts.length ? ('WHERE ' + whereParts.join(' AND ')) : '';

  // Queries using SUM(weight_kg)
  const monthly_q = `SELECT year, month, month_no, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY year, month_no, month ORDER BY year, month_no`;
  const monthly_by_brgy_q = `SELECT barangay, year, month, month_no, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY barangay, year, month_no, month ORDER BY year, month_no, barangay`;
  const by_type_yearly_q = `SELECT waste_type AS waste_type, year, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY waste_type, year ORDER BY year`;
  const waste_type_summary_q = `SELECT waste_type AS type, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY waste_type ORDER BY total DESC`;
  const barangay_yearly_q = `SELECT barangay, year, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY barangay, year ORDER BY year`;
  const table_rows_q = ((q.barangay && q.barangay !== 'All') || (q.month && q.month !== 'All') || (q.year && q.year !== 'All'))
    ? `SELECT year, month, month_no, barangay, waste_type, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY year, month_no, barangay, waste_type, month ORDER BY year, month_no, barangay`
    : monthly_q;

  // meta queries (distinct lists)
  const meta_years_q = `SELECT DISTINCT year FROM waste_records ORDER BY year`;
  const meta_months_q = `SELECT DISTINCT month, month_no FROM waste_records ORDER BY month_no`;
  const meta_barangays_q = `SELECT DISTINCT barangay FROM waste_records ORDER BY barangay`;
  const meta_wtypes_q = `SELECT DISTINCT waste_type FROM waste_records ORDER BY waste_type`;

  // execute queries in parallel
  let [monthly_rows, monthly_by_brgy_rows, by_type_yearly_rows, waste_type_summary_rows, barangay_yearly_rows, table_rows, meta_years, meta_months, meta_barangays, meta_wtypes] = await Promise.all([
    dbAll(monthly_q, paramsArr),
    dbAll(monthly_by_brgy_q, paramsArr),
    dbAll(by_type_yearly_q, paramsArr),
    dbAll(waste_type_summary_q, paramsArr),
    dbAll(barangay_yearly_q, paramsArr),
    dbAll(table_rows_q, paramsArr),
    dbAll(meta_years_q),
    dbAll(meta_months_q),
    dbAll(meta_barangays_q),
    dbAll(meta_wtypes_q)
  ]).catch(e => { console.error('SQL error', e); return [[],[],[],[],[],[],[],[],[],[]]; });

  // normalize results
  const monthly = (monthly_rows || []).map(r => ({ year: r.year, month: r.month, month_no: r.month_no, total: Number(r.total || 0) }));
  const monthlyByBrgy = (monthly_by_brgy_rows || []).map(r => ({ barangay: r.barangay, year: r.year, month: r.month, month_no: r.month_no, total: Number(r.total || 0) }));
  const byTypeYearly = (by_type_yearly_rows || []).map(r => ({ waste_type: r.waste_type, year: r.year, total: Number(r.total||0) }));
  const wasteTypeSummary = (waste_type_summary_rows || []).map(r => ({ type: r.type, total: Number(r.total||0) }));
  const barangayYearly = (barangay_yearly_rows || []).map(r => ({ barangay: r.barangay, year: r.year, total: Number(r.total||0) }));
  const tableRowsSql = (table_rows || []).map(r => ({ year: r.year, month: r.month, month_no: r.month_no, barangay: r.barangay, waste_type: r.waste_type, total: Number(r.total||0) }));

  // kpis
  const totalsByYearRows = await dbAll(`SELECT year, SUM(weight_kg) AS total FROM waste_records ${whereSql} GROUP BY year ORDER BY year`, paramsArr).catch(() => []);
  const totalsByYear = {};
  (totalsByYearRows || []).forEach(r => { totalsByYear[r.year] = Number(r.total || 0); });
  const kpis = { totals_by_year: totalsByYear, total_selected: Object.values(totalsByYear).reduce((s,v)=>s+v,0) };

  // anomalies: none in this DB (placeholder)
  const anomaliesSql = [];

  // meta assembly
  const meta = {
    years: (meta_years || []).map(r => r.year),
    months: (meta_months || []).map(r => ({ month: r.month, month_no: r.month_no })),
    barangays: (meta_barangays || []).map(r => r.barangay),
    waste_types: (meta_wtypes || []).map(r => r.waste_type)
  };

  // SQL aggregation produced `monthly`, `monthlyByBrgy`, `byTypeYearly`, `wasteTypeSummary`, `barangayYearly`, `tableRowsSql`, `kpis`, `anomaliesFiltered`, and `meta` above.
  // Map them to the variable names expected later in the handler.
  const monthly_data = monthly || [];
  const monthly_by_barangay = monthlyByBrgy || [];
  const by_type_yearly = byTypeYearly || [];
  const waste_type_summary = wasteTypeSummary || [];
  const barangay_yearly = barangayYearly || [];
  const barangay_comparison = barangayYearly || [];
  const anomalies = anomaliesSql || [];
  const kpis_table = [];
  const meta_rows = [];

  // apply filters in JS using normalization (robust to column name differences)
  const filters = q;

  const filterRows = (rows, rowFilter) => {
    return (rows || []).filter(r => {
      // generic year/month/barangay filtering
      if (filters.year && filters.year !== 'All' && String(r.year) !== String(filters.year)) return false;
      if (filters.month && filters.month !== 'All' && String(r.month) !== String(filters.month)) return false;
      if (filters.month_no && filters.month_no !== 'All' && String(r.month_no) !== String(filters.month_no)) return false;
      if (filters.barangay && filters.barangay !== 'All') {
        const b = (r.barangay !== undefined) ? r.barangay : (r.brgy !== undefined ? r.brgy : '');
        if (normalize(b) !== normalize(filters.barangay)) return false;
      }
      if (filters.wasteType && filters.wasteType !== 'All') {
        const t = (r.waste_type !== undefined) ? r.waste_type : (r.type !== undefined ? r.type : r.wasteType !== undefined ? r.wasteType : '');
        if (normalize(t) !== normalize(filters.wasteType)) return false;
      }
      if (typeof rowFilter === 'function') return rowFilter(r);
      return true;
    });
  };

  const monthlyFiltered = filterRows(monthly).sort((a,b) => (a.year - b.year) || ( (a.month_no||0) - (b.month_no||0) ));
  const monthlyByBrgyFiltered = filterRows(monthlyByBrgy).sort((a,b) => (a.year - b.year) || ((a.month_no||0) - (b.month_no||0)));

  // waste type summaries: try by_type_yearly when year selected, else waste_type_summary
  let wasteTypeSummaryFinal = [];
  if (filters.year && filters.year !== 'All') {
    wasteTypeSummaryFinal = filterRows(by_type_yearly).map(r => ({ type: r.waste_type || r.type, total: Number(r.total || 0), year: r.year }));
  } else {
    wasteTypeSummaryFinal = (waste_type_summary || []).map(r => ({ type: r.type || r.waste_type, total: Number(r.total || 0) }));
  }

  // barangay totals
  let barangayTotals = [];
  if (filters.year && filters.year !== 'All') barangayTotals = filterRows(barangay_yearly).map(r => ({ barangay: r.barangay, total: Number(r.total || 0), year: r.year }));
  else barangayTotals = (barangay_comparison || []).map(r => ({ barangay: r.barangay, total: Number((r.y2025||0) + (r.y2026||0)), raw: r }));

  // table rows: use filtered monthly data
  let tableRows = [];
  if ((filters.barangay && filters.barangay !== 'All') || (filters.month && filters.month !== 'All') || (filters.year && filters.year !== 'All')) {
    tableRows = monthlyByBrgyFiltered.map(r => ({ year: r.year, month: r.month, month_no: r.month_no, barangay: r.barangay, total: Number(r.total || 0) }));
  } else {
    tableRows = monthlyFiltered.map(r => ({ year: r.year, month: r.month, month_no: r.month_no, total: Number(r.total || 0), expected: r.expected !== undefined ? Number(r.expected) : undefined }));
  }

  // augment SQL-computed KPIs with monthlyFiltered-derived stats
  try {
    // totals_by_year and total_selected were computed earlier in `kpis`
    // add last/prev month, monthly change, next_month_prediction, total_2025/2026, highest barangay
    const totalsFromKpis = kpis.totals_by_year || {};
    if ((monthlyFiltered || []).length >= 1) {
      const last = monthlyFiltered[monthlyFiltered.length-1];
      kpis.last_month = { year: last.year, month: last.month, total: Number(last.total||0) };
    }
    if ((monthlyFiltered || []).length >= 2) {
      const last = monthlyFiltered[monthlyFiltered.length-1];
      const prev = monthlyFiltered[monthlyFiltered.length-2];
      kpis.prev_month = { year: prev.year, month: prev.month, total: Number(prev.total||0) };
      const prevVal = Number(prev.total || 0);
      kpis.monthly_change_pct = prevVal === 0 ? null : Number((((Number(last.total||0) - prevVal) / prevVal) * 100).toFixed(1));
    }
    if (totalsFromKpis[2025]) kpis.total_2025 = totalsFromKpis[2025];
    if (totalsFromKpis[2026]) kpis.total_2026 = totalsFromKpis[2026];

    const expectedVals = (monthlyFiltered || []).filter(r=>r.expected!==undefined).map(r=>Number(r.expected));
    if (expectedVals.length) kpis.next_month_prediction = expectedVals[expectedVals.length-1];
    else if ((monthlyFiltered || []).length) {
      const avg = (monthlyFiltered || []).reduce((s,r)=>s+Number(r.total||0),0)/(monthlyFiltered || []).length;
      kpis.next_month_prediction = Math.round(avg*10)/10;
    }

    if (barangayTotals && barangayTotals.length) {
      const sorted = barangayTotals.slice().sort((a,b)=>b.total - a.total);
      kpis.highest_barangay = sorted[0].barangay;
    }
  } catch (e) {
    // ignore calculation errors
  }

  // anomalies filtered
  const anomaliesFiltered = filterRows(anomalies).map(a => ({ year: a.year, month: a.month, month_no: a.month_no, current: a.current, previous: a.previous, change_pct: a.change_pct, status: a.status }));

  // build meta information (years, barangays, waste types) - augment existing `meta`
  try {
    meta.years = Array.from(new Set((monthly || []).map(r => r.year))).sort();
    meta.barangays = Array.from(new Set((monthlyByBrgy || []).map(r => r.barangay))).sort();
    meta.waste_types = Array.from(new Set(((by_type_yearly || []).map(r => r.waste_type)).concat((waste_type_summary || []).map(r=>r.type)).filter(Boolean))).sort();
  } catch (e) { }

  const result = {
    ok: true,
    source: path.basename(DB_PATH),
    filters,
    data: {
      monthly_data: monthlyFiltered,
      monthly_by_barangay: monthlyByBrgyFiltered,
      waste_type_summary: wasteTypeSummaryFinal,
      barangay_yearly: barangayTotals,
      table_rows: tableRows,
      anomalies: anomaliesFiltered,
      kpis,
      meta
    }
  };

  res.json(result);
  } catch (err) {
    console.error('/api/data handler error:', err && err.stack ? err.stack : err);
    res.status(500).json({ ok: false, error: 'Internal server error', detail: err && err.message ? err.message : String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running. Static files served from ${STATIC_DIR}. API: /api/data`);
  if (!DB_PATH) console.log('No .db file found. API will attempt to serve data.js if available.');
});
