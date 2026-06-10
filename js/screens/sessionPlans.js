/* Session plans — list + the table-view assembly (dates × slots). */
(function () {
  window.Screens = window.Screens || {};

  function parseISO(iso) { const p = iso.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function toISO(d) { return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); }

  window.Screens.sessionPlansIndex = function (params) {
    if (params.query && params.query.new === '1') return newForm();
    const plans = Store.sessionPlans();
    const rows = plans.map(p =>
      '<tr><td><a href="#/sessionplans/' + p.id + '" class="text-decoration-none fw-semibold">' + UI.esc(p.name) + '</a>' +
        (p.active ? ' <span class="badge bg-success">Active</span>' : '') + '</td>' +
      '<td class="text-muted small">' + UI.fmtDate(p.start) + ' → ' + UI.fmtDate(p.end) + '</td>' +
      '<td class="text-end">' +
        (p.active ? '' : '<button class="btn btn-sm btn-outline-secondary set-active" data-id="' + p.id + '">Set active</button> ') +
        '<a href="#/sessionplans/' + p.id + '" class="btn btn-sm btn-outline-secondary">Open</a></td></tr>'
    ).join('');
    return {
      html: UI.pageHeader('Session Plans',
        '<a href="#/sessionplans?new=1" class="btn btn-primary"><i class="bi bi-plus-lg"></i> New session</a>') +
        '<p class="text-muted">A session plan assembles lesson plans across a date range. One is active at a time.</p>' +
        '<div class="card"><div class="card-body p-0"><table class="table mb-0 align-middle">' +
        '<thead class="table-light"><tr><th>Name</th><th>Range</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>',
      mount: function () {
        document.querySelectorAll('.set-active').forEach(b => b.onclick = function () {
          Store.setActiveSession(parseInt(b.getAttribute('data-id'), 10));
          UI.toast('Active session updated'); Router.render();
        });
      }
    };
  };

  function newForm() {
    const html = UI.pageHeader('New session plan',
      '<a href="#/sessionplans" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="spForm" class="card"><div class="card-body row g-3">' +
        '<div class="col-md-6"><label class="form-label">Name</label><input id="sp_name" class="form-control" placeholder="e.g. Autumn Term 2026"></div>' +
        '<div class="col-md-3"><label class="form-label">Start</label><input id="sp_start" type="date" class="form-control" value="' + UI.today() + '"></div>' +
        '<div class="col-md-3"><label class="form-label">End</label><input id="sp_end" type="date" class="form-control"></div>' +
      '</div><div class="card-footer"><button class="btn btn-primary">Create</button></div></form>';
    return {
      html: html,
      mount: function () {
        document.getElementById('spForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const name = document.getElementById('sp_name').value.trim() || 'New session';
          const start = document.getElementById('sp_start').value;
          const end = document.getElementById('sp_end').value || start;
          const p = Store.addSessionPlan({ name: name, start: start, end: end });
          UI.toast('Session created'); UI.nav('/sessionplans/' + p.id);
        });
      }
    };
  }

  window.Screens.sessionPlanView = function (params) {
    const plan = Store.sessionPlan(parseInt(params.id, 10));
    if (!plan) return { html: '<div class="alert alert-warning">Session plan not found.</div>' };
    const slots = Store.slots();
    const lessons = Store.lessonPlans();

    // Build the list of class days within the range.
    const days = [];
    let d = parseISO(plan.start); const end = parseISO(plan.end);
    let guard = 0;
    while (d <= end && guard++ < 400) {
      const wd = d.getUTCDay();
      if (slots.some(s => s.weekday === wd)) days.push({ iso: toISO(d), wd: wd });
      d = new Date(d.getTime() + 86400000);
    }

    function cell(dayIso, slot, wd) {
      if (slot.weekday !== wd) return '<td class="text-center text-muted">—</td>';
      const current = Store.getAssignment(plan.id, dayIso, slot.id);
      const opts = ['<option value="">— none —</option>'].concat(lessons.map(l =>
        '<option value="' + l.id + '"' + (current === l.id ? ' selected' : '') + '>' + UI.esc(l.name) + '</option>')).join('');
      return '<td class="session-cell"><select class="form-select form-select-sm assign" ' +
        'data-date="' + dayIso + '" data-slot="' + slot.id + '">' + opts + '</select></td>';
    }

    const header = '<tr><th style="width:120px">Date</th>' +
      slots.map(s => '<th>' + UI.esc(s.name) + '<br><small class="text-muted fw-normal">' + UI.weekdayShort(s.weekday) + ' ' + s.start + '</small></th>').join('') + '</tr>';

    const bodyRows = days.map(day =>
      '<tr><td class="text-nowrap small"><span class="text-muted">' + UI.weekdayShort(day.wd) + '</span> ' +
        UI.fmtDate(day.iso).replace(/ \d{4}$/, '') + '</td>' +
        slots.map(s => cell(day.iso, s, day.wd)).join('') + '</tr>').join('');

    const grid = days.length
      ? '<div class="card"><div class="card-header fw-semibold">Lesson plan grid</div><div class="card-body p-0">' +
          '<div class="table-responsive"><table class="table table-sm table-bordered mb-0 align-middle" style="min-width:600px">' +
          '<thead class="table-light">' + header + '</thead><tbody>' + bodyRows + '</tbody></table></div></div></div>'
      : '<div class="alert alert-info">No class days fall within this date range.</div>';

    return {
      html: UI.pageHeader(plan.name + (plan.active ? '  ' : ''),
        '<a href="#/sessionplans" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> All sessions</a>') +
        '<p class="text-muted small">' + UI.fmtDate(plan.start) + ' → ' + UI.fmtDate(plan.end) +
          (plan.active ? ' · <span class="badge bg-success">Active</span>' : '') +
          ' · Assign a lesson plan to each class. Changes save automatically.</p>' + grid,
      mount: function () {
        document.querySelectorAll('.assign').forEach(sel => sel.onchange = function () {
          const lp = sel.value ? parseInt(sel.value, 10) : null;
          Store.setAssignment(plan.id, sel.getAttribute('data-date'), parseInt(sel.getAttribute('data-slot'), 10), lp);
          UI.toast('Saved');
        });
      }
    };
  };
})();
