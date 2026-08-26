const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function findDbFile(dir) {
  const files = fs.readdirSync(dir);
  const dbs = files.filter(f => f.toLowerCase().endsWith('.db'));
  if (dbs.length === 0) return null;
  return path.join(dir, dbs.find(f => f.toLowerCase().includes('waste_forecast')) || dbs[0]);
}

const DB = findDbFile(__dirname);
if (!DB) {
  console.error('No .db file found in', __dirname);
  process.exit(1);
}

const db = new sqlite3.Database(DB, sqlite3.OPEN_READONLY, (err) => {
  if (err) { console.error('Failed to open DB:', err); process.exit(1); }
});

function run(sql, params=[]) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}

async function inspectTable(table, sampleLimit=20) {
  const info = { table };
  try {
    const pragma = await run(`PRAGMA table_info(${table})`);
    info.schema = pragma; // array of {cid,name,type,notnull,dflt_value,pk}
  } catch (e) {
    info.schema = null; info.error = String(e.message || e);
  }
  try {
    const cnt = await run(`SELECT COUNT(*) AS count FROM ${table}`);
    info.count = (cnt && cnt[0] && cnt[0].count !== undefined) ? cnt[0].count : null;
  } catch (e) {
    info.count = null;
  }
  try {
    const rows = await run(`SELECT * FROM ${table} LIMIT ${sampleLimit}`);
    info.sample = rows;
  } catch (e) {
    info.sample = [];
  }

  // Attempt to infer useful fields from sample rows
  info.inferred = [];
  const sample = info.sample || [];
  for (const r of sample) {
    const rec = { raw: r };
    // infer year
    if (r.year !== undefined) rec.inferred_year = r.year;
    else {
      const dateCandidates = ['date','recorded_at','timestamp','created_at','dt','datetime'];
      let found = null;
      for (const c of dateCandidates) if (r[c]) { found = r[c]; rec._date_source = c; break; }
      if (found) {
        const d = new Date(found);
        if (!isNaN(d)) rec.inferred_year = d.getFullYear();
        else {
          const m = String(found).match(/(20\d{2})/);
          if (m) rec.inferred_year = Number(m[1]);
        }
      }
    }
    // infer month / month_no
    if (r.month !== undefined) rec.inferred_month = r.month;
    if (r.month_no !== undefined || r.month_number !== undefined) rec.inferred_month_no = r.month_no || r.month_number;
    if (!rec.inferred_month && !rec.inferred_month_no && rec._date_source) {
      const d = new Date(r[rec._date_source]); if (!isNaN(d)) { rec.inferred_month_no = d.getMonth()+1; rec.inferred_month = d.toLocaleString('en-us',{month:'long'}); }
    }
    // infer barangay
    const brgyCandidates = ['barangay','brgy','barangay_name','brgy_name','bname','name'];
    for (const c of brgyCandidates) if (r[c]) { rec.inferred_barangay = r[c]; break; }
    // infer waste type
    const wtCandidates = ['waste_type','type','wtype','waste','waste_type_name'];
    for (const c of wtCandidates) if (r[c]) { rec.inferred_waste_type = r[c]; break; }
    // infer weight/amount
    const amtCandidates = ['total','weight','kg','amount','value','waste_kg'];
    for (const c of amtCandidates) if (r[c] !== undefined && r[c] !== null) { rec.inferred_amount = r[c]; break; }
    // fallback: find first numeric-like field
    if (rec.inferred_amount === undefined) {
      for (const k of Object.keys(r)) { const v = r[k]; if (typeof v === 'number') { rec.inferred_amount = v; rec.inferred_amount_field = k; break; } if (!isNaN(Number(v)) && String(v).trim() !== '') { rec.inferred_amount = Number(v); rec.inferred_amount_field = k; break; } }
    }
    info.inferred.push(rec);
  }

  return info;
}

async function main() {
  try {
    const tables = ['waste_records','waste_types','barangays','yearly_totals'];
    const out = { db: path.basename(DB), files: tables, results: {} };
    for (const t of tables) {
      out.results[t] = await inspectTable(t, t === 'waste_records' ? 10 : 20);
    }
    console.log(JSON.stringify(out, null, 2));
  } catch (e) {
    console.error('Error inspecting DB:', e);
  } finally {
    db.close();
  }
}

main();
