/* Attendance — pick a date + slot, then tick the roster. */
(function () {
  window.Screens = window.Screens || {};

  function weekdayOf(iso) { const p = iso.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay(); }

  window.Screens.attendanceIndex = function (params) {
    const date = (params.query && params.query.date) || UI.today();
    const wd = weekdayOf(date);
    const slots = Store.slots().filter(s => s.weekday === wd);

    const list = slots.length
      ? '<div class="list-group">' + slots.map(s => {
          const n = Store.attendees(date, s.id).length;
          return '<a href="#/attendance/session?date=' + date + '&slot=' + s.id + '" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">' +
            '<span><strong>' + UI.esc(s.name) + '</strong> <span class="text-muted small">' + s.start + '–' + s.end + '</span> ' + UI.audienceBadge(s.audience) + '</span>' +
            '<span class="badge bg-primary rounded-pill">' + n + ' present</span></a>';
        }).join('') + '</div>'
      : '<div class="alert alert-info">No classes scheduled on ' + UI.weekdayName(wd) + '. Pick another date.</div>';

    return {
      html: UI.pageHeader('Attendance', '') +
        '<div class="row g-2 align-items-end mb-3"><div class="col-auto">' +
          '<label class="form-label small">Class date</label>' +
          '<input type="date" id="attDate" class="form-control" value="' + date + '"></div>' +
          '<div class="col-auto pb-1 text-muted">' + UI.weekdayName(wd) + '</div></div>' +
        list,
      mount: function () {
        document.getElementById('attDate').addEventListener('change', function (e) {
          UI.nav('/attendance?date=' + e.target.value);
        });
      }
    };
  };

  window.Screens.attendanceSession = function (params) {
    const date = params.query.date, slotId = parseInt(params.query.slot, 10);
    const slot = Store.slot(slotId);
    if (!slot || !date) return { html: '<div class="alert alert-warning">Session not found. <a href="#/attendance">Back</a>.</div>' };

    const present = Store.attendees(date, slotId).slice();
    const members = Store.members(false);

    // Today's plan from the active session plan, if assigned.
    const active = Store.sessionPlans().filter(p => p.active)[0];
    let planCard = '';
    if (active) {
      const lpId = Store.getAssignment(active.id, date, slotId);
      const lp = lpId ? Store.lessonPlan(lpId) : null;
      if (lp) {
        planCard = '<div class="card mb-3 border-primary"><div class="card-header text-primary fw-semibold">' +
          '<i class="bi bi-journal-text"></i> Today\'s plan — ' + UI.esc(lp.name) + ' ' + UI.audienceBadge(lp.audience) + '</div>' +
          '<div class="card-body p-0"><table class="table table-sm mb-0"><tbody>' +
          (lp.segments || []).map(s =>
            '<tr><td class="text-muted" style="width:2.5rem">' + s.pos + '</td><td style="width:120px">' + UI.esc(s.label) + '</td>' +
            '<td style="width:70px">' + s.min + ' min</td><td class="text-muted small">' + UI.esc(s.notes || '') + '</td></tr>').join('') +
          '</tbody></table></div></div>';
      }
    }

    const roster = members.map(m => {
      const checked = present.indexOf(m.id) !== -1;
      return '<label class="list-group-item d-flex align-items-center">' +
        '<input type="checkbox" class="form-check-input me-3 att-check" value="' + m.id + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="flex-grow-1">' + UI.esc(Store.sortName(m)) + '</span>' +
        (m.junior ? '<span class="badge bg-secondary">Junior</span>' : '') + '</label>';
    }).join('');

    const html =
      '<div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2"><div>' +
        '<h1 class="h3 mb-0">' + UI.esc(slot.name) + '</h1>' +
        '<div class="text-muted">' + UI.weekdayName(weekdayOf(date)) + ' ' + UI.fmtDate(date) + ' · ' + slot.start + '–' + slot.end + ' · ' + UI.esc(slot.audience) + '</div>' +
      '</div><a href="#/attendance?date=' + date + '" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back</a></div>' +
      planCard +
      '<div class="d-flex gap-2 mb-3">' +
        '<button type="button" class="btn btn-sm btn-outline-secondary" id="markAll"><i class="bi bi-check-all"></i> Mark all</button>' +
        '<button type="button" class="btn btn-sm btn-outline-secondary" id="clearAll"><i class="bi bi-x"></i> Clear all</button>' +
        '<span class="ms-auto text-muted small align-self-center"><span id="cnt">' + present.length + '</span> selected</span></div>' +
      '<div class="list-group mb-3">' + roster + '</div>' +
      '<button class="btn btn-primary" id="saveAtt"><i class="bi bi-check-lg"></i> Save attendance</button>';

    return {
      html: html,
      mount: function () {
        const checks = function () { return Array.prototype.slice.call(document.querySelectorAll('.att-check')); };
        function updateCount() { document.getElementById('cnt').textContent = checks().filter(c => c.checked).length; }
        checks().forEach(c => c.addEventListener('change', updateCount));
        document.getElementById('markAll').onclick = function () { checks().forEach(c => c.checked = true); updateCount(); };
        document.getElementById('clearAll').onclick = function () { checks().forEach(c => c.checked = false); updateCount(); };
        document.getElementById('saveAtt').onclick = function () {
          const ids = checks().filter(c => c.checked).map(c => parseInt(c.value, 10));
          Store.setAttendees(date, slotId, ids);
          UI.toast(ids.length + ' attendees saved');
          UI.nav('/attendance?date=' + date);
        };
      }
    };
  };
})();
