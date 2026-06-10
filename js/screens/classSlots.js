/* Class schedule — weekly recurring slots, with add/edit. */
(function () {
  window.Screens = window.Screens || {};
  const AUD = ['kids', 'adults', 'all-levels', 'black-belt'];

  window.Screens.classSlots = function (params) {
    const q = params.query || {};
    if (q.new === '1' || q.edit) return form(q.edit ? parseInt(q.edit, 10) : null);
    return list();
  };

  function timeRange(s) { return s.start + '–' + s.end; }

  function list() {
    const slots = Store.slots();
    const rows = slots.map(s =>
      '<tr><td>' + UI.weekdayName(s.weekday) + '</td><td>' + UI.esc(s.name) + '</td>' +
      '<td>' + timeRange(s) + '</td><td>' + UI.audienceBadge(s.audience) + '</td>' +
      '<td class="text-end"><a href="#/classslots?edit=' + s.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i> Edit</a></td></tr>'
    ).join('');
    const body = slots.length
      ? '<div class="card"><div class="card-body p-0"><table class="table mb-0 align-middle">' +
          '<thead class="table-light"><tr><th>Day</th><th>Class</th><th>Time</th><th>Audience</th><th></th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table></div></div>'
      : '<div class="alert alert-info">No class slots yet.</div>';
    return {
      html: UI.pageHeader('Class Schedule',
        '<a href="#/classslots?new=1" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add class</a>') +
        '<p class="text-muted">The dojo\'s weekly cadence. Drives which dates need lesson plans and where attendance is recorded.</p>' + body
    };
  }

  function form(id) {
    const s = id ? Store.slot(id) : { name: '', weekday: 1, start: '18:00', end: '19:00', audience: 'all-levels' };
    if (id && !s) return { html: '<div class="alert alert-warning">Slot not found.</div>' };
    const dayOpts = [1, 2, 3, 4, 5, 6, 0].map(d =>
      '<option value="' + d + '"' + (d === s.weekday ? ' selected' : '') + '>' + UI.weekdayName(d) + '</option>').join('');
    const audOpts = AUD.map(a => '<option value="' + a + '"' + (a === s.audience ? ' selected' : '') + '>' + a + '</option>').join('');

    const html = UI.pageHeader(id ? 'Edit class slot' : 'Add class slot',
      '<a href="#/classslots" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="slotForm" class="card"><div class="card-body row g-3">' +
        '<div class="col-md-6"><label class="form-label">Class name</label><input id="s_name" class="form-control" value="' + UI.esc(s.name) + '"></div>' +
        '<div class="col-md-3"><label class="form-label">Weekday</label><select id="s_day" class="form-select">' + dayOpts + '</select></div>' +
        '<div class="col-md-3"><label class="form-label">Audience</label><select id="s_aud" class="form-select text-capitalize">' + audOpts + '</select></div>' +
        '<div class="col-md-3"><label class="form-label">Start</label><input id="s_start" type="time" class="form-control" value="' + s.start + '"></div>' +
        '<div class="col-md-3"><label class="form-label">End</label><input id="s_end" type="time" class="form-control" value="' + s.end + '"></div>' +
      '</div><div class="card-footer"><button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button></div></form>';

    return {
      html: html,
      mount: function () {
        document.getElementById('slotForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const data = {
            name: document.getElementById('s_name').value.trim() || 'Class',
            weekday: parseInt(document.getElementById('s_day').value, 10),
            start: document.getElementById('s_start').value,
            end: document.getElementById('s_end').value,
            audience: document.getElementById('s_aud').value
          };
          if (id) Store.updateSlot(id, data); else Store.addSlot(data);
          UI.toast('Class slot saved');
          UI.nav('/classslots');
        });
      }
    };
  }
})();
