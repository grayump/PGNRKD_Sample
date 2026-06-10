/* ============================================================
   UI — formatting, theme, toast, navigation, and the shared
   grading-eligibility calculation.
   ============================================================ */
(function () {
  // Fixed "today" so the demo's date math is stable regardless of the clock.
  const TODAY = '2026-06-09';

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const UI = {
    today() { return TODAY; },

    esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    money(cents) { return '$' + (cents / 100).toFixed(2); },

    fmtDate(iso) {
      if (!iso) return '—';
      const p = iso.split('-');
      return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
    },

    weekdayName(n) { return WEEKDAYS[n]; },
    weekdayShort(n) { return WEEKDAYS[n].slice(0, 3); },

    fmtPeriod(period) { // "2026-05" -> "May 2026"
      const p = period.split('-');
      return MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
    },

    age(dobISO) {
      if (!dobISO) return null;
      const t = TODAY.split('-').map(Number), d = dobISO.split('-').map(Number);
      let a = t[0] - d[0];
      if (t[1] < d[1] || (t[1] === d[1] && t[2] < d[2])) a--;
      return a;
    },

    monthsBetween(fromISO, toISO) {
      if (!fromISO) return 0;
      const f = fromISO.split('-').map(Number), t = (toISO || TODAY).split('-').map(Number);
      let m = (t[0] - f[0]) * 12 + (t[1] - f[1]);
      if (t[2] < f[2]) m--;
      return Math.max(0, m);
    },

    audienceBadge(tag) {
      if (!tag) return '';
      const map = { kids: 'bg-info', adults: 'bg-primary', 'all-levels': 'bg-secondary', 'black-belt': 'bg-dark' };
      return '<span class="badge ' + (map[tag] || 'bg-secondary') + '">' + UI.esc(tag) + '</span>';
    },

    rankBadge(rank) {
      if (!rank) return '<span class="text-muted">—</span>';
      return '<span class="badge bg-light text-dark border">' + UI.esc(rank.name) + '</span>';
    },

    // ---- Grading eligibility (shared by grading / home / member detail) ----
    eligibility(member) {
      const rank = Store.currentRank(member);
      const next = rank ? Store.nextRank(rank.id) : null;
      const total = rank ? rank.requirements.length : 0;
      const reqIds = rank ? rank.requirements.map(r => r.id) : [];
      const done = Store.progressFor(member.id).filter(id => reqIds.indexOf(id) !== -1).length;
      const months = UI.monthsBetween(member.promotedOn, TODAY);
      const attendance = Store.attendanceCredit(member.id, member.promotedOn);
      const reqMet = total > 0 && done >= total;
      const timeMet = rank ? months >= rank.minTimeInRankMonths : false;
      const attMet = rank ? attendance >= rank.minAttendanceCount : false;
      return {
        member, rank, next, total, done, months, attendance,
        reqMet, timeMet, attMet,
        minMonths: rank ? rank.minTimeInRankMonths : 0,
        minAtt: rank ? rank.minAttendanceCount : 0,
        eligible: !!next && reqMet && timeMet && attMet
      };
    },

    // ---- Theme ----
    setTheme(t) {
      localStorage.setItem('nrkd.theme', t);
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.setAttribute('data-bs-theme', t === 'dark' ? 'dark' : 'light');
      document.querySelectorAll('.theme-btn').forEach(b =>
        b.classList.toggle('active', b.getAttribute('data-theme') === t));
    },
    syncThemeButtons() {
      const t = localStorage.getItem('nrkd.theme') || 'normal';
      document.querySelectorAll('.theme-btn').forEach(b =>
        b.classList.toggle('active', b.getAttribute('data-theme') === t));
    },

    // ---- Navigation ----
    nav(hash) { window.location.hash = hash; },

    // ---- Toast ----
    toast(msg, type) {
      const host = document.getElementById('toastHost');
      if (!host) return;
      const bg = type === 'danger' ? 'text-bg-danger' : type === 'warning' ? 'text-bg-warning' : 'text-bg-success';
      const el = document.createElement('div');
      el.className = 'toast align-items-center border-0 ' + bg;
      el.setAttribute('role', 'status');
      el.innerHTML =
        '<div class="d-flex"><div class="toast-body">' + UI.esc(msg) + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
      host.appendChild(el);
      const t = new bootstrap.Toast(el, { delay: 2500 });
      t.show();
      el.addEventListener('hidden.bs.toast', () => el.remove());
    },

    // Page-header helper used by screens
    pageHeader(title, rightHtml) {
      return '<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">' +
        '<h1 class="h3 mb-0">' + UI.esc(title) + '</h1>' +
        '<div class="d-flex gap-2">' + (rightHtml || '') + '</div></div>';
    }
  };

  window.UI = UI;
})();
