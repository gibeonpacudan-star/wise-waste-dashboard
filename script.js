// Shared JavaScript for Waste Forecast Dashboard

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('show');
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});

// Data-driven lists (populated from data.js when available)
let wasteTypes = [];
let barangays = [];

// Color palette matching screenshots
const chartColors = {
  biodegradable: '#3b82f6',
  recyclable: '#6366f1',
  recyclableResidual: '#f97316',
  residual: '#a855f7',
  residualBio: '#ec4899',
  special: '#22c55e',
  blue: '#3b82f6',
  darkBlue: '#1e40af',
  gray: '#6b7280'
};

// Utility to format numbers
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(2);
}

// Format kg helper (keeps compatibility with data.js formatKg)
function formatKg(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (n >= 1000000) return (n/1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n/1000).toFixed(2) + 'K';
  return n.toFixed(1);
}

// Centralized dashboard loader and filter system
const Dashboard = {
  filters: { year: 'All', month: 'All', month_no: 'All', barangay: 'All', wasteType: 'All', dataType: 'All' },
  charts: {},
  tableSort: { key: 'year', dir: 'desc' },
  init() {
    // serverData holds the last-known server-provided dataset (mapped shape)
    this.serverData = null;
    if (typeof WASTE_DATA !== 'undefined') {
      // map existing embedded/server-provided WASTE_DATA to our mapped shape
      this.serverData = {
        monthly: WASTE_DATA.monthly_data || [],
        wasteTypeSummary: WASTE_DATA.waste_type_summary || [],
        barangayTotals: WASTE_DATA.barangay_yearly || [],
        tableRows: WASTE_DATA.table_rows || [],
        meta: WASTE_DATA.meta || {},
        kpis: WASTE_DATA.kpis || {},
        raw: WASTE_DATA
      };
      wasteTypes = (this.serverData.meta && this.serverData.meta.waste_types) ? this.serverData.meta.waste_types.slice() : [];
      barangays = (this.serverData.meta && this.serverData.meta.barangays) ? this.serverData.meta.barangays.slice() : [];
    }

    // populate any filter selects present on page
    this.populateSelect('filterBarangay', ['All'].concat(barangays));
    this.populateSelect('filterWasteType', ['All'].concat(wasteTypes));

    // years from meta or monthly_data
    let years = [];
    if (this.serverData && this.serverData.meta && this.serverData.meta.years) years = this.serverData.meta.years.map(String);
    else if (this.serverData && this.serverData.monthly) years = Array.from(new Set(this.serverData.monthly.map(m => String(m.year))));
    this.populateSelect('filterYear', ['All'].concat(years));

    // months
    let months = [];
    if (this.serverData && this.serverData.monthly) months = Array.from(new Set(this.serverData.monthly.map(m => m.month)));
    this.populateSelect('filterMonth', ['All'].concat(months));

    // attach listeners
    ['filterBarangay','filterWasteType','filterYear','filterMonth'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', (e) => {
        const val = e.target.value;
        if (id === 'filterMonth') {
          this.filters.month = val;
          // derive month_no when possible using meta.months (preferred) or fallback to monthly data
          let found = null;
          if (this.serverData && this.serverData.meta && Array.isArray(this.serverData.meta.months)) {
            found = this.serverData.meta.months.find(m => String(m.month) === String(val) || String(m.month).toLowerCase() === String(val).toLowerCase());
            if (found && found.month_no !== undefined) this.filters.month_no = Number(found.month_no);
            else this.filters.month_no = 'All';
          } else {
            const sourceMonthly = (this.serverData && this.serverData.monthly) ? this.serverData.monthly : (typeof WASTE_DATA !== 'undefined' ? (WASTE_DATA.monthly_data || []) : []);
            found = (sourceMonthly || []).find(m => String(m.month) === String(val) || String(m.month).toLowerCase() === String(val).toLowerCase());
            this.filters.month_no = found ? found.month_no : 'All';
          }
        } else if (id === 'filterYear') {
          this.filters.year = val;
        } else if (id === 'filterBarangay') {
          this.filters.barangay = val;
        } else if (id === 'filterWasteType') {
          this.filters.wasteType = val;
        }
        // refresh dependent options (e.g., months available for selected year)
        this.refreshFilterOptions();
        this.emitUpdate();
      });
    });

    // Reset button if present
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) resetBtn.addEventListener('click', () => { this.resetFilters(); });

    // refresh dependent options then initial update
    this.refreshFilterOptions();
    this.emitUpdate();
  },
  destroyChart(name, canvasEl) {
    try {
      if (this.charts && this.charts[name]) { try { this.charts[name].destroy(); } catch(e){} delete this.charts[name]; }
      if (typeof Chart !== 'undefined' && canvasEl) {
        try { const existing = Chart.getChart(canvasEl); if (existing) existing.destroy(); } catch(e){}
      }
    } catch (e) { /* ignore */ }
  },
  resetFilters() {
    this.filters = { year: 'All', month: 'All', month_no: 'All', barangay: 'All', wasteType: 'All', dataType: 'All' };
    // repopulate selects based on full data
    const src = this.serverData || (typeof WASTE_DATA !== 'undefined' ? WASTE_DATA : null);
    this.populateSelect('filterYear', ['All'].concat((src && src.meta && src.meta.years) ? src.meta.years.map(String) : Array.from(new Set(((src && src.monthly) || (src && src.monthly_data) || []).map(m=>String(m.year))))));
    this.populateSelect('filterBarangay', ['All'].concat((src && src.meta && src.meta.barangays) ? src.meta.barangays : []));
    this.populateSelect('filterWasteType', ['All'].concat((src && src.meta && src.meta.waste_types) ? src.meta.waste_types : []));
    this.populateSelect('filterMonth', ['All'].concat(Array.from(new Set(((src && src.monthly) || (src && src.monthly_data) || []).map(m=>m.month)))));
    // set DOM selects to All
    ['filterYear','filterMonth','filterBarangay','filterWasteType'].forEach(id => { const e = document.getElementById(id); if (e) e.value = 'All'; });
    this.emitUpdate();
  },

  refreshFilterOptions() {
    // Refresh dependent filter options based on currently selected broader filters
    const f = this.filters;
    const src = this.serverData || (typeof WASTE_DATA !== 'undefined' ? WASTE_DATA : null);
    if (!src) return;
    // Years
    const monthlySrc = src.monthly || src.monthly_data || [];
    const monthlyByBrgySrc = src.monthly_by_barangay || src.monthlyByBrgy || src.monthly_by_brgy || [];
    const years = Array.from(new Set((monthlySrc||[]).filter(r=> (f.barangay==='All' || (monthlyByBrgySrc||[]).some(x=>x.barangay===f.barangay && x.year===r.year))).map(m=>String(m.year))));
    if (years.length) this.populateSelect('filterYear', ['All'].concat(years));

    // Months available for selected year
    let months = (monthlySrc||[]).filter(m => (f.year==='All' || String(m.year) === String(f.year))).map(m => m.month);
    months = Array.from(new Set(months));
    this.populateSelect('filterMonth', ['All'].concat(months));

    // Barangays available for selected year/month
    let barangays = (monthlyByBrgySrc||[]).filter(r => (f.year==='All' || String(r.year) === String(f.year)) && (f.month==='All' || r.month === f.month)).map(r => r.barangay);
    barangays = Array.from(new Set(barangays));
    if (barangays.length) this.populateSelect('filterBarangay', ['All'].concat(barangays));

    // Waste types available for selected year
    const byTypeYearly = src.by_type_yearly || src.byTypeYearly || src.by_type_yearly_rows || [];
    let types = (byTypeYearly||[]).filter(r => (f.year==='All' || String(r.year) === String(f.year))).map(r => r.waste_type || r.type);
    if ((!types || types.length === 0) && src.waste_type_summary) types = (src.waste_type_summary || []).map(r=>r.type);
    types = Array.from(new Set(types));
    if (types.length) this.populateSelect('filterWasteType', ['All'].concat(types));
  },
  populateSelect(id, values) {
    const el = document.getElementById(id);
    if (!el) return;
    // clear existing options and re-add; preserve the current Dashboard filter selection when possible
    const currentMap = { filterYear: 'year', filterMonth: 'month', filterBarangay: 'barangay', filterWasteType: 'wasteType' };
    const selectedValue = (this.filters && currentMap[id]) ? this.filters[currentMap[id]] : null;
    // Ensure the selectedValue remains in the options so the select doesn't reset to 'All'
    let vals = Array.isArray(values) ? values.slice() : [];
    if (selectedValue !== null && selectedValue !== undefined && !vals.some(v => String(v) === String(selectedValue))) {
      // insert selectedValue after 'All' if All is first, else at front
      if (vals.length && String(vals[0]).toLowerCase() === 'all') vals.splice(1, 0, selectedValue);
      else vals.unshift(selectedValue);
    }
    el.innerHTML = '';
    vals.forEach(v => {
      const opt = document.createElement('option'); opt.value = v; opt.textContent = v; if (selectedValue !== null && String(v) === String(selectedValue)) opt.selected = true; el.appendChild(opt);
    });
    // ensure the DOM select reflects the selected value if present in options
    if (selectedValue !== null && Array.from(el.options).some(o => String(o.value) === String(selectedValue))) el.value = selectedValue;
  },
  emitUpdate() {
    // Request server-side filtered data and then update UI components
    this.fetchServerData(this.filters).then(filtered => {
      // keep latest serverData for populating selects and other references
      this.serverData = this.serverData || {};
      if (filtered && filtered.meta) this.serverData.meta = filtered.meta;
      if (filtered && filtered.monthly) this.serverData.monthly = filtered.monthly;
      if (filtered && filtered.barangayTotals) this.serverData.barangayTotals = filtered.barangayTotals;
      if (filtered && filtered.wasteTypeSummary) this.serverData.wasteTypeSummary = filtered.wasteTypeSummary;
      if (filtered && filtered.raw) this.serverData.raw = filtered.raw;

      this.updateKPIs(filtered);
      this.updateCharts(filtered);
      // anomaly detection must run before tables so tables show anomaly results when specific month selected
      const anomalies = this.updateAnomalies(filtered);
      filtered.anomaliesComputed = anomalies;
      this.updateTables(filtered);
      this.updateActiveFilters(this.filters);
    }).catch(err => {
      console.error('Failed to fetch filtered data from server', err);
      // Show an error overlay with option to use embedded data.js explicitly (offline mode)
      const e = document.getElementById('dashboard-loading') || document.createElement('div');
      e.id = 'dashboard-loading';
      e.style.position = 'fixed'; e.style.left = 0; e.style.top = 0; e.style.right = 0; e.style.bottom = 0; e.style.display = 'flex'; e.style.alignItems = 'center'; e.style.justifyContent = 'center'; e.style.background = 'rgba(0,0,0,0.55)'; e.style.zIndex = 9999;
      const msg = document.createElement('div');
      msg.style.background = '#111'; msg.style.color = '#fff'; msg.style.padding = '18px'; msg.style.borderRadius = '8px'; msg.style.boxShadow = '0 6px 24px rgba(0,0,0,0.5)'; msg.style.maxWidth = '720px'; msg.style.width = '100%';
      const title = document.createElement('div'); title.style.fontWeight = '600'; title.style.marginBottom = '8px'; title.textContent = 'Unable to load filtered dashboard data from /api/data';
      const detail = document.createElement('pre'); detail.style.whiteSpace = 'pre-wrap'; detail.style.maxHeight = '220px'; detail.style.overflow = 'auto'; detail.style.background = 'transparent'; detail.style.border = 'none'; detail.style.color = '#ddd'; detail.textContent = String(err && err.message ? err.message : err);
      const btnRow = document.createElement('div'); btnRow.style.marginTop = '12px';
      const useEmbedded = document.createElement('button'); useEmbedded.textContent = 'Use embedded data (offline mode)'; useEmbedded.style.marginRight = '8px'; useEmbedded.style.padding = '8px 12px'; useEmbedded.style.cursor = 'pointer';
      useEmbedded.addEventListener('click', () => { this.useEmbeddedData(); });
      const dismiss = document.createElement('button'); dismiss.textContent = 'Dismiss'; dismiss.style.padding = '8px 12px'; dismiss.style.cursor = 'pointer';
      dismiss.addEventListener('click', () => { const el = document.getElementById('dashboard-loading'); if (el) el.remove(); });
      btnRow.appendChild(useEmbedded); btnRow.appendChild(dismiss);
      msg.appendChild(title); msg.appendChild(detail); msg.appendChild(btnRow);
      e.innerHTML = ''; e.appendChild(msg);
      if (!document.getElementById('dashboard-loading')) document.body.appendChild(e);
    });
  },

  updateAnomalies(filtered) {
    // Return an array of anomaly objects computed from filtered.raw or filtered.tableRows
    const f = this.filters || {};
    const raw = filtered.raw || {};
    const monthlyByBrgy = raw.monthly_by_barangay || filtered.raw && filtered.raw.monthly_by_barangay || (raw.monthlyByBrgy || []);
    const results = [];

    // Helper: compute mean and std
    const stats = (arr) => {
      if (!arr || arr.length === 0) return null;
      const n = arr.length; const sum = arr.reduce((s,v)=>s+v,0); const mean = sum/n;
      const variance = arr.reduce((s,v)=>s+Math.pow(v-mean,2),0)/n; const std = Math.sqrt(variance);
      return { mean, std, n };
    };

    // Specific selection: barangay, year, month selected
    if (f.barangay && f.barangay !== 'All' && f.year && f.year !== 'All' && f.month && f.month !== 'All') {
      // find the actual value for that barangay/year/month
      const actualRow = (monthlyByBrgy || []).find(r => String(r.barangay) === String(f.barangay) && String(r.year) === String(f.year) && String(r.month) === String(f.month));
      const actual = actualRow ? Number(actualRow.total||0) : null;
      // baseline: same barangay and same month across other years
      const baselineRows = (monthlyByBrgy || []).filter(r => String(r.barangay) === String(f.barangay) && String(r.month) === String(f.month) && String(r.year) !== String(f.year)).map(r => Number(r.total||0));
      if (!actual && actual !== 0) return [{ status: 'INSUFFICIENT DATA' }];
      if (!baselineRows || baselineRows.length < 2) {
        // insufficient same-month history, fallback to same-barangay overall monthly mean
        const fallback = (monthlyByBrgy || []).filter(r => String(r.barangay) === String(f.barangay) && String(r.year) !== String(f.year)).map(r => Number(r.total||0));
        if (!fallback || fallback.length < 2) return [{ status: 'INSUFFICIENT DATA' }];
        const s = stats(fallback);
        const dev = s.mean === 0 ? null : ((actual - s.mean)/s.mean)*100;
        const isAnom = (dev !== null) && (Math.abs(dev) > 50 || (s.std && Math.abs(actual - s.mean) > 2*s.std));
        return [{ barangay: f.barangay, year: f.year, month: f.month, actual, baseline: s.mean, deviation_pct: dev !== null ? Math.round(dev*10)/10 : null, status: isAnom ? 'ANOMALY' : 'NORMAL' }];
      }
      const s = stats(baselineRows);
      const dev = s.mean === 0 ? null : ((actual - s.mean)/s.mean)*100;
      const isAnom = (dev !== null) && (Math.abs(dev) > 50 || (s.std && Math.abs(actual - s.mean) > 2*s.std));
      return [{ barangay: f.barangay, year: f.year, month: f.month, actual, baseline: s.mean, deviation_pct: dev !== null ? Math.round(dev*10)/10 : null, status: isAnom ? 'ANOMALY' : 'NORMAL' }];
    }

    // General scan: for each barangay/month pair in monthlyByBrgy, compare to its baseline across years
    const groups = {};
    (monthlyByBrgy || []).forEach(r => {
      const key = r.barangay + '|' + r.month;
      groups[key] = groups[key] || [];
      groups[key].push({ year: r.year, total: Number(r.total||0) });
    });
    Object.keys(groups).forEach(k => {
      const parts = k.split('|'); const b = parts[0]; const m = parts[1];
      const arr = groups[k].map(x=>x.total);
      if (arr.length < 3) return; // skip low-sample groups
      const s = stats(arr);
      // detect outliers in the group's years
      groups[k].forEach(entry => {
        const dev = s.mean === 0 ? null : ((entry.total - s.mean)/s.mean)*100;
        const isAnom = (dev !== null) && (Math.abs(dev) > 50 || (s.std && Math.abs(entry.total - s.mean) > 2*s.std));
        if (isAnom) results.push({ barangay: b, month: m, year: entry.year, actual: entry.total, baseline: s.mean, deviation_pct: dev !== null ? Math.round(dev*10)/10 : null, status: 'ANOMALY' });
      });
    });

    return results;
  },
  useEmbeddedData() {
    // Explicit user action to use embedded data.js. This is not a silent fallback.
    if (typeof WASTE_DATA === 'undefined') {
      console.error('No embedded WASTE_DATA available to use offline.');
      alert('No embedded data available. Start the server or provide the database.');
      return;
    }
    // Clear any existing error overlay
    const el = document.getElementById('dashboard-loading'); if (el) el.remove();
    // Replace Dashboard filters and re-init using embedded data
    try {
      window.WASTE_DATA = window.WASTE_DATA || WASTE_DATA;
      this.filters = { year: 'All', month: 'All', month_no: 'All', barangay: 'All', wasteType: 'All', dataType: 'All' };
      this.refreshFilterOptions();
      this.emitUpdate();
    } catch (e) {
      console.error('Failed to initialize offline data:', e);
      alert('Failed to initialize embedded data. See console for details.');
    }
  },
  updateActiveFilters(filters) {
    const el = document.getElementById('activeFilters');
    if (!el) return;
    const parts = [];
    Object.keys(filters).forEach(k => { parts.push(k + ': ' + (filters[k] === 'All' ? 'All' : filters[k])); });
    el.textContent = parts.join(' | ');
  },
  async fetchServerData(filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(k => { if (filters[k] !== undefined && filters[k] !== null) params.set(k, filters[k]); });
    const url = '/api/data?' + params.toString();
    const resp = await fetch(url);
    if (!resp.ok) {
      const txt = await resp.text();
      console.error('API ERROR:', resp.status, txt);
      throw new Error('API error ' + resp.status + ': ' + txt);
    }
    const j = await resp.json();
    // Map server response to expected client-side structure; include raw server payload
    const d = j.data || j;
    const mapped = {
      monthly: d.monthly_data || [],
      wasteTypeSummary: d.waste_type_summary || [],
      barangayTotals: d.barangay_yearly || [],
      tableRows: d.table_rows || [],
      filters: filters,
      meta: d.meta || {},
      kpis: d.kpis || {},
      raw: d
    };
    return mapped;
  },
  getFilteredDataset() {
    // produce a consistent filtered dataset object from WASTE_DATA and current filters
    const f = this.filters;
    if (typeof WASTE_DATA === 'undefined') return { error: 'No WASTE_DATA available' };

    // Filter monthly_data (aggregated per month)
    let monthly = (WASTE_DATA.monthly_data || []).filter(r => {
      if (f.year !== 'All' && String(r.year) !== String(f.year)) return false;
      if (f.month !== 'All' && r.month !== f.month) return false;
      return true;
    });

    // If barangay filter is set, compute monthly aggregates from monthly_by_barangay
    if (f.barangay && f.barangay !== 'All') {
      const by = (WASTE_DATA.monthly_by_barangay || []).filter(r => r.barangay === f.barangay && (f.year === 'All' || String(r.year) === String(f.year)) && (f.month === 'All' || r.month === f.month));
      // aggregate to monthly entries
      const map = {};
      by.forEach(r => {
        const key = r.year + '|' + r.month_no + '|' + r.month;
        if (!map[key]) map[key] = { year: r.year, month: r.month, month_no: r.month_no, total: 0 };
        map[key].total += r.total;
      });
      monthly = Object.values(map).sort((a,b) => a.year - b.year || a.month_no - b.month_no);
    }

    // For waste type breakdown use by_type_yearly when year filter applied, else use waste_type_summary
    let wasteTypeSummary = [];
    if (f.year !== 'All') {
      wasteTypeSummary = (WASTE_DATA.by_type_yearly || []).filter(r => String(r.year) === String(f.year)).map(r => ({ type: r.waste_type, total: r.total }));
    } else {
      wasteTypeSummary = (WASTE_DATA.waste_type_summary || []).map(r => ({ type: r.type, total: r.total }));
    }

    // Barangay totals for selected year
    let barangayTotals = [];
    if (f.year !== 'All') barangayTotals = (WASTE_DATA.barangay_yearly || []).filter(r => String(r.year) === String(f.year)).map(r => ({ barangay: r.barangay, total: r.total }));
    else barangayTotals = (WASTE_DATA.barangay_comparison || []).map(r => ({ barangay: r.barangay, total: (r.y2025||0) + (r.y2026||0) }));

    // Table rows: prefer monthly_by_barangay for granular view when no wasteType filter
    let tableRows = [];
    if (f.barangay !== 'All' || f.month !== 'All' || f.year !== 'All') {
      tableRows = (WASTE_DATA.monthly_by_barangay || []).filter(r => {
        if (f.barangay !== 'All' && r.barangay !== f.barangay) return false;
        if (f.year !== 'All' && String(r.year) !== String(f.year)) return false;
        if (f.month !== 'All' && r.month !== f.month) return false;
        return true;
      }).map(r => ({ year: r.year, month: r.month, barangay: r.barangay, total: r.total }));
    } else {
      // default to monthly_data rows
      tableRows = (WASTE_DATA.monthly_data || []).map(r => ({ year: r.year, month: r.month, total: r.total, expected: r.expected }));
    }

    return { monthly, wasteTypeSummary, barangayTotals, tableRows, filters: f, meta: WASTE_DATA.meta, kpis: WASTE_DATA.kpis };
  },
  updateForecast(filtered) {
    // Update forecast KPI elements if present. Use real forecast data where available; otherwise indicate insufficient data.
    const predEl = document.getElementById('kpi-pred-2026');
    const nextEl = document.getElementById('kpi-next-month');
    // If filtered contains monthly expected values, use them for next-month prediction
    const monthly = filtered.monthly || [];
    if (monthly.length > 0) {
      // Use last monthly expected if present
      const last = monthly[monthly.length-1];
      if (last.expected !== undefined && nextEl) nextEl.textContent = formatNumber(last.expected);
      else if (filtered.kpis && filtered.kpis.next_month_prediction && nextEl) nextEl.textContent = formatNumber(filtered.kpis.next_month_prediction);
    } else {
      if (filtered.kpis && filtered.kpis.next_month_prediction && nextEl) nextEl.textContent = formatNumber(filtered.kpis.next_month_prediction);
      else if (nextEl) nextEl.textContent = 'Insufficient data';
    }
    if (predEl) {
      if (filtered.kpis && (filtered.kpis.pred_2026_annual || filtered.kpis.pred_2026_annual === 0)) predEl.textContent = formatNumber(filtered.kpis.pred_2026_annual);
      else predEl.textContent = 'Insufficient data';
    }
  },
  updateKPIs(filtered) {
    if (filtered.error) return;
    const k = filtered.kpis || {};
    // Update known KPI fields if elements exist
    const setIf = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setIf('kpi-total-2025', (k.total_2025 || k.total_2025 === 0) ? formatNumber(k.total_2025) : '—');
    setIf('kpi-total-2026', (k.total_2026 || k.total_2026 === 0) ? formatNumber(k.total_2026) : '—');
    setIf('kpi-pred-2026', (k.pred_2026_annual || k.pred_2026_annual === 0) ? formatNumber(k.pred_2026_annual) : '—');
    setIf('kpi-next-month', (k.next_month_prediction || k.next_month_prediction === 0) ? formatNumber(k.next_month_prediction) : '—');

    // Growth % (2026 vs 2025)
    let growthPct = null;
    if ((k.total_2025 || k.total_2025 === 0) && (k.total_2026 || k.total_2026 === 0)) {
      if (Number(k.total_2025) === 0) growthPct = null;
      else growthPct = ((Number(k.total_2026) - Number(k.total_2025)) / Number(k.total_2025)) * 100;
    }
    setIf('kpi-growth', (growthPct !== null && growthPct !== undefined) ? (Math.round(growthPct*10)/10) + '%' : '—');

    // Yearly Trend Status based on growthPct
    const yt = document.getElementById('kpi-yearly-trend');
    if (yt) {
      let ystatus = 'NEUTRAL';
      if (growthPct !== null && growthPct !== undefined) {
        if (growthPct > 0) ystatus = 'RISING';
        else if (growthPct < 0) ystatus = 'FALLING';
      }
      yt.textContent = ystatus;
      yt.className = 'kpi-value ' + (ystatus === 'RISING' ? 'positive' : ystatus === 'FALLING' ? 'negative' : 'neutral');
    }
    // also update other possible yearly status element ids
    const yStatusAlt = document.getElementById('yearlyStatus');
    if (yStatusAlt) {
      const ystatus2 = (growthPct !== null && growthPct !== undefined) ? (growthPct > 0 ? 'RISING' : growthPct < 0 ? 'FALLING' : 'NEUTRAL') : 'N/A';
      yStatusAlt.textContent = ystatus2;
      yStatusAlt.style.color = ystatus2 === 'RISING' ? '#22c55e' : ystatus2 === 'FALLING' ? '#ef4444' : '#3b82f6';
    }

    // Monthly Trend based on monthly_change_pct
    const mt = document.getElementById('kpi-monthly-trend');
    let mstatus = 'NEUTRAL';
    if (k.monthly_change_pct !== undefined && k.monthly_change_pct !== null) {
      if (k.monthly_change_pct > 0) mstatus = 'RISING';
      else if (k.monthly_change_pct < 0) mstatus = 'FALLING';
    }
    if (mt) { mt.textContent = mstatus; mt.className = 'kpi-value ' + (mstatus === 'RISING' ? 'positive' : mstatus === 'FALLING' ? 'negative' : 'neutral'); }
    // update alternate monthly status element id used on anomaly page
    const mStatusAlt = document.getElementById('monthlyStatus');
    if (mStatusAlt) {
      const mstatus2 = (k.monthly_change_pct !== undefined && k.monthly_change_pct !== null) ? (k.monthly_change_pct > 0 ? 'RISING' : k.monthly_change_pct < 0 ? 'FALLING' : 'NEUTRAL') : 'N/A';
      mStatusAlt.textContent = mstatus2;
      mStatusAlt.style.color = mstatus2 === 'RISING' ? '#22c55e' : mstatus2 === 'FALLING' ? '#ef4444' : '#3b82f6';
    }

    const mc = document.getElementById('kpi-monthly-change'); if (mc) mc.textContent = (k.monthly_change_pct !== undefined && k.monthly_change_pct !== null) ? (Math.round(k.monthly_change_pct*10)/10) + '%' : '—';
    // Highest barangay: prefer computing from filtered.barangayTotals to ensure correctness
    const hb = document.getElementById('kpi-highest-brgy');
    let highest = null;
    if (filtered.barangayTotals && filtered.barangayTotals.length) {
      const sorted = filtered.barangayTotals.slice().sort((a,b)=>b.total - a.total);
      highest = sorted[0].barangay;
    } else if (k.highest_barangay) highest = k.highest_barangay;
    if (hb) hb.textContent = highest || '';
  },
  updateCharts(filtered) {
    if (filtered.error) return;
    const hasMonthly = (filtered.monthly || []).length > 0;
    // Waste Type Bar / Donut (labels and datasets depend on available breakdown)
    const typeData = filtered.wasteTypeSummary || [];
    const colors = ['#3b82f6', '#6366f1', '#f97316', '#a855f7', '#ec4899', '#22c55e', '#6b7280'];
    // Bar chart
    const barCtx = document.getElementById('wasteTypeBarChart');
    if (barCtx && typeof Chart !== 'undefined') {
      if (!typeData || typeData.length === 0) {
        // no data: destroy chart if exists
        this.destroyChart('wasteBar', barCtx);
      } else if (!this.charts.wasteBar) {
        this.destroyChart('wasteBar', barCtx);
        this.charts.wasteBar = new Chart(barCtx, { type: 'bar', data: { labels: typeData.map(t=>t.type), datasets: [{ label: 'Total kg', data: typeData.map(t=>t.total), backgroundColor: colors, borderRadius: 4 }] }, options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => formatKg(v) } } } } });
      } else {
        this.charts.wasteBar.data.labels = typeData.map(t=>t.type);
        this.charts.wasteBar.data.datasets[0].data = typeData.map(t=>t.total);
        this.charts.wasteBar.update();
      }
    }

    // Historical Forecast line chart
    const histCtx = document.getElementById('historicalForecastChart');
    if (histCtx && typeof Chart !== 'undefined') {
      const monthly = filtered.monthly || [];
      const labels = monthly.map(m => m.month + ' ' + m.year);
      const actual = monthly.map(m => m.total);
      const expected = monthly.map(m => (m.expected !== undefined ? m.expected : null));
      if (!this.charts.hist) {
        this.destroyChart('hist', histCtx);
        this.charts.hist = new Chart(histCtx, { type: 'line', data: { labels, datasets: [ { label: 'Actual Waste', data: actual, borderColor: '#3b82f6', tension:0.3, pointRadius:3 }, { label: 'Expected', data: expected, borderColor: '#6366f1', borderDash:[5,5], tension:0.3, pointRadius:2 } ] }, options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:true,position:'top'}}, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => formatKg(v) } } } } });
      } else {
        this.charts.hist.data.labels = labels;
        this.charts.hist.data.datasets[0].data = actual;
        this.charts.hist.data.datasets[1].data = expected;
        this.charts.hist.update();
      }
    }

    // Update forecast KPIs after charts
    this.updateForecast(filtered);

    // Donut chart
    const donutCtx = document.getElementById('wasteTypeDonut');
    if (donutCtx && typeof Chart !== 'undefined') {
      const labels = typeData.map(t=>t.type);
      const data = typeData.map(t=>t.total);
      if (!data || data.length === 0) {
        this.destroyChart('donut', donutCtx);
        const legendEl = document.getElementById('donutLegend'); if (legendEl) legendEl.innerHTML = '';
      } else if (!this.charts.donut) {
        this.destroyChart('donut', donutCtx);
        this.charts.donut = new Chart(donutCtx, { type: 'doughnut', data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth:0 }] }, options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'60%' } });
      } else {
        this.charts.donut.data.labels = labels;
        this.charts.donut.data.datasets[0].data = data;
        this.charts.donut.update();
      }
      // legend update
      const legendEl = document.getElementById('donutLegend'); if (legendEl) {
        legendEl.innerHTML = '';
        const total = data.reduce((s,a)=>s+a,0);
        typeData.forEach((t,i)=>{ const pct = total?((t.total/total)*100).toFixed(1):0; legendEl.innerHTML += '<div class="legend-item"><span class="legend-color" style="background:' + colors[i%colors.length] + '"></span> ' + t.type + ' ' + pct + '%</div>'; });
      }
    }

    // Waste by Barangay chart (assumes barangayTotals)
    const brgyCtx = document.getElementById('barangayChart');
    if (brgyCtx && typeof Chart !== 'undefined') {
      const labels = (filtered.barangayTotals || []).map(b => b.barangay);
      const data = (filtered.barangayTotals || []).map(b => b.total);
      if (!data || data.length === 0) {
        this.destroyChart('brgy', brgyCtx);
      } else if (!this.charts.brgy) {
        this.destroyChart('brgy', brgyCtx);
        this.charts.brgy = new Chart(brgyCtx, { type: 'bar', data: { labels, datasets: [{ label:'Total kg', data, backgroundColor: '#3b82f6' }] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => formatKg(v) } } } } });
      } else {
        this.charts.brgy.data.labels = labels; this.charts.brgy.data.datasets[0].data = data; this.charts.brgy.update();
      }
    }

    // Compare page: barangayCompareChart (2025 vs 2026)
    const cmpCtx = document.getElementById('barangayCompareChart');
    if (cmpCtx && typeof Chart !== 'undefined') {
      // try to use server-provided comparison table first
      let cmp = (filtered.raw && filtered.raw.barangay_comparison) ? filtered.raw.barangay_comparison : null;
      if (!cmp && filtered.raw && filtered.raw.barangay_yearly) {
        // build comparison from barangay_yearly entries
        const map = {};
        (filtered.raw.barangay_yearly || []).forEach(r => {
          const b = r.barangay || r.Barangay;
          map[b] = map[b] || { barangay: b, y2025: 0, y2026: 0 };
          if (r.year === 2025) map[b].y2025 = Number(r.total || 0);
          if (r.year === 2026) map[b].y2026 = Number(r.total || 0);
        });
        cmp = Object.values(map);
      }
      if (!cmp || cmp.length === 0) {
        this.destroyChart('cmp', cmpCtx);
      } else {
        let labels = cmp.map(c => c.barangay);
        let data2025 = cmp.map(c => Number(c.y2025 || 0));
        let data2026 = cmp.map(c => Number(c.y2026 || 0));
        if (this.charts.cmp) {
          this.charts.cmp.data.labels = labels;
          this.charts.cmp.data.datasets[0].data = data2025;
          this.charts.cmp.data.datasets[1].data = data2026;
          this.charts.cmp.update();
        } else {
          this.destroyChart('cmp', cmpCtx);
          this.charts.cmp = new Chart(cmpCtx, { type: 'bar', data: { labels, datasets: [ { label: '2025 Total Waste', data: data2025, backgroundColor: '#3b82f6', borderRadius: 3 }, { label: '2026 Total Waste', data: data2026, backgroundColor: '#1e3a8a', borderRadius: 3 } ] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { beginAtZero: true, ticks: { callback: v => formatKg(v) } } } } });
        }
      }
    }

    // Compare donut
    const cmpDonut = document.getElementById('compareDonut');
    if (cmpDonut && typeof Chart !== 'undefined') {
      const typeData = filtered.wasteTypeSummary || (filtered.raw && filtered.raw.waste_type_summary) || [];
      const labels = typeData.map(t=>t.type);
      const data = typeData.map(t=>t.total);
      if (!data || data.length === 0) {
        this.destroyChart('cmpDonut', cmpDonut);
      } else if (!this.charts.cmpDonut) {
        this.destroyChart('cmpDonut', cmpDonut);
        this.charts.cmpDonut = new Chart(cmpDonut, { type:'doughnut', data:{ labels, datasets:[{ data, backgroundColor:['#3b82f6','#6366f1','#f97316','#a855f7','#ec4899','#22c55e','#6b7280'] }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'55%' } });
      } else { this.charts.cmpDonut.data.labels = labels; this.charts.cmpDonut.data.datasets[0].data = data; this.charts.cmpDonut.update(); }
    }

    // Monthly trend compare
    const mtCtx = document.getElementById('monthlyTrendChart');
    if (mtCtx && typeof Chart !== 'undefined') {
      const monthly = filtered.monthly || [];
      const months = [...new Set(monthly.map(m => m.month))];
      const m2025 = monthly.filter(m => m.year === 2025).map(m => m.total);
      const m2026 = monthly.filter(m => m.year === 2026).map(m => m.total);
      if (!m2025.length && !m2026.length) {
        this.destroyChart('mtrend', mtCtx);
      } else if (!this.charts.mtrend) {
        this.destroyChart('mtrend', mtCtx);
        this.charts.mtrend = new Chart(mtCtx, { type:'line', data: { labels: months, datasets: [ { label:'2025', data: m2025, borderColor:'#3b82f6', tension:0.2, pointRadius:2 }, { label:'2026', data: m2026, borderColor:'#6366f1', tension:0.2, pointRadius:2 } ] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, ticks:{ callback: v => formatKg(v) } } } } });
      } else {
        this.charts.mtrend.data.labels = months;
        this.charts.mtrend.data.datasets[0].data = m2025;
        this.charts.mtrend.data.datasets[1].data = m2026;
        this.charts.mtrend.update();
      }
    }
  },
  updateTables(filtered) {
    if (filtered.error) return;
    // update monthly table if present
    const tbody = document.getElementById('monthlyTableBody');
    const tableTotal = document.getElementById('tableTotal');
    if (tbody) {
      let rows = filtered.tableRows.slice();
      // apply search filter
      const searchEl = document.getElementById('tableSearch');
      const q = searchEl && searchEl.value ? searchEl.value.trim().toLowerCase() : '';
      if (q) rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q));
      // apply sorting
      const s = this.tableSort || { key: 'year', dir: 'desc' };
      rows.sort((a,b)=>{
        const ka = a[s.key] || 0; const kb = b[s.key] || 0;
        if (typeof ka === 'number' && typeof kb === 'number') return s.dir === 'asc' ? ka - kb : kb - ka;
        return s.dir === 'asc' ? String(ka).localeCompare(String(kb)) : String(kb).localeCompare(String(ka));
      });

      tbody.innerHTML = '';
      let sum = 0;
        if (rows.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No data available for the selected filters</td></tr>';
        } else {
      rows.forEach(r => {
        sum += r.total || 0;
        if (r.expected !== undefined) tbody.innerHTML += `<tr><td>${r.year}</td><td>${r.month}</td><td>${(r.total||0).toLocaleString(undefined,{maximumFractionDigits:1})}</td><td>${(r.expected||'').toLocaleString? (r.expected||'').toLocaleString(undefined,{maximumFractionDigits:1}) : r.expected||''}</td></tr>`;
        else tbody.innerHTML += `<tr><td>${r.year||''}</td><td>${r.month||''}</td><td>${(r.total||0).toLocaleString(undefined,{maximumFractionDigits:1})}</td><td></td></tr>`;
      });
        }
      if (tableTotal) tableTotal.innerHTML = '<strong>' + sum.toLocaleString(undefined,{maximumFractionDigits:1}) + '</strong>';
    }
    // Anomaly table updates (if present)
    const anomalyBody = document.getElementById('anomalyTableBody');
    if (anomalyBody) {
      const anomaliesSrc = filtered.anomaliesComputed || (filtered.raw && filtered.raw.anomalies) ? (filtered.anomaliesComputed || filtered.raw.anomalies) : (filtered.anomalies || []);
      const anomalies = (anomaliesSrc || []).filter(a => {
        if (filtered.filters.year && filtered.filters.year !== 'All' && a.year && String(a.year) !== String(filtered.filters.year)) return false;
        if (filtered.filters.month && filtered.filters.month !== 'All' && a.month && a.month !== filtered.filters.month) return false;
        if (filtered.filters.barangay && filtered.filters.barangay !== 'All' && a.barangay && a.barangay !== filtered.filters.barangay) return false;
        return true;
      });
      anomalyBody.innerHTML = '';
      if (!anomalies || anomalies.length === 0) {
        anomalyBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No anomalies detected</td></tr>';
        const card = document.getElementById('anomalyStatusCard'); if (card) { card.textContent = 'NO ANOMALY DETECTED'; card.className = 'anomaly-status none'; }
      } else if (anomalies.length === 1 && anomalies[0].status === 'INSUFFICIENT DATA') {
        anomalyBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">INSUFFICIENT DATA</td></tr>';
        const card = document.getElementById('anomalyStatusCard'); if (card) { card.textContent = 'INSUFFICIENT DATA'; card.className = 'anomaly-status none'; }
      } else {
        anomalies.forEach(a => {
          const color = a.status && a.status.indexOf('ANOMALY') !== -1 ? '#ef4444' : '#22c55e';
          const year = a.year || '';
          const month = a.month || '';
          const barangay = a.barangay || '';
          const actual = (a.actual !== undefined && a.actual !== null) ? Number(a.actual).toLocaleString(undefined,{maximumFractionDigits:1}) : (a.current !== undefined ? Number(a.current).toLocaleString() : '');
          const baseline = (a.baseline !== undefined && a.baseline !== null) ? Number(a.baseline).toLocaleString(undefined,{maximumFractionDigits:1}) : (a.previous !== undefined ? Number(a.previous).toLocaleString() : '');
          const dev = (a.deviation_pct !== undefined && a.deviation_pct !== null) ? ((a.deviation_pct>0?'+':'') + a.deviation_pct + '%') : (a.change_pct !== undefined ? ((a.change_pct>0?'+':'')+a.change_pct+'%') : '');
          anomalyBody.innerHTML += '<tr><td>' + year + '</td><td>' + month + '</td><td>' + barangay + '</td><td>' + actual + '</td><td>' + baseline + '</td><td style="color:' + color + '">' + dev + '</td><td style="color:' + color + '">' + (a.status || '') + '</td></tr>';
        });
        const top = anomalies[0];
        const card = document.getElementById('anomalyStatusCard'); if (card) { card.textContent = top.status || ''; card.style.color = top.status && top.status.indexOf('ANOMALY') !== -1 ? '#ef4444' : '#22c55e'; }
        const detail = document.getElementById('anomalyDetail'); if (detail) detail.textContent = (top.month ? top.month + ' ' : '') + (top.year || '') + ' — ' + (top.deviation_pct !== undefined ? ((top.deviation_pct>0?'+':'')+top.deviation_pct+'%') : '');
      }
    }
  }
  ,
  setTableSort(key) {
    if (this.tableSort.key === key) this.tableSort.dir = this.tableSort.dir === 'asc' ? 'desc' : 'asc';
    else { this.tableSort.key = key; this.tableSort.dir = 'desc'; }
    this.emitUpdate();
  }
};

// Initialize dashboard once DOM is ready
// Try to load API data first, then initialize Dashboard. If API not available, fall back to embedded `data.js`.
document.addEventListener('DOMContentLoaded', async () => {
  // show loading overlay
  const showLoading = () => {
    if (document.getElementById('dashboard-loading')) return;
    const d = document.createElement('div'); d.id = 'dashboard-loading';
    d.style.position = 'fixed'; d.style.left = 0; d.style.top = 0; d.style.right = 0; d.style.bottom = 0; d.style.display = 'flex'; d.style.alignItems = 'center'; d.style.justifyContent = 'center'; d.style.background = 'rgba(0,0,0,0.35)'; d.style.zIndex = 9999; d.innerHTML = '<div style="background:#111;color:#fff;padding:12px 18px;border-radius:6px;box-shadow:0 6px 24px rgba(0,0,0,0.5)">Loading data...</div>';
    document.body.appendChild(d);
  };
  const hideLoading = () => { const e = document.getElementById('dashboard-loading'); if (e) e.remove(); };

  showLoading();
  try {
    const resp = await fetch('/api/data');
    if (resp.ok) {
      const j = await resp.json();
      if (j && j.ok && j.data) {
        // prefer server-provided structured object; map to WASTE_DATA if nested
        if (j.data.WASTE_DATA) window.WASTE_DATA = j.data.WASTE_DATA;
        else window.WASTE_DATA = j.data;
        console.log('Loaded data from /api/data (source:', j.source || j.data.source || 'db', ')');
      }
    } else {
      console.warn('/api/data not available, using embedded data.js if present');
    }
  } catch (e) {
    console.warn('Failed to fetch /api/data — continuing with embedded data.js if present', e.message);
  } finally {
    hideLoading();
  }

  try {
    Dashboard.init();
  } catch (err) {
    console.error('Dashboard init error', err);
  }
});

// Contact form handler
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const message = form.message.value;

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Simulate submission
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    alert(`Thank you, ${name}! Your message has been received. We will contact you at ${email} soon.`);
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 1000);
}

// Initialize contact form if present
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
});

// Chart.js defaults for dark theme
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#aaaaaa';
  Chart.defaults.borderColor = '#333';
  Chart.defaults.plugins.legend.labels.color = '#ffffff';
}