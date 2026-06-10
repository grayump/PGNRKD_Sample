/* Curriculum — rank ladder, per-rank syllabus, per-member checklist. */
(function () {
  window.Screens = window.Screens || {};

  window.Screens.curriculumIndex = function () {
    const ranks = Store.ranks();
    const memberOpts = '<option value="">Jump to a member\'s checklist…</option>' +
      Store.members(false).map(m => '<option value="' + m.id + '">' + UI.esc(Store.sortName(m)) + '</option>').join('');

    const rows = ranks.map(r =>
      '<tr><td>' + UI.esc(r.name) + (r.colorDisplay ? ' <small class="text-muted">' + UI.esc(r.colorDisplay) + '</small>' : '') + '</td>' +
      '<td><span class="badge bg-secondary text-uppercase">' + UI.esc(r.category) + '</span></td>' +
      '<td>' + (r.juniorStripes > 0 ? r.juniorStripes : '—') + '</td>' +
      '<td>' + (r.requirements.length ? '<span class="badge bg-primary">' + r.requirements.length + '</span>' : '<span class="text-muted small">none</span>') + '</td>' +
      '<td>' + (r.minTimeInRankMonths > 0 ? r.minTimeInRankMonths : '—') + '</td>' +
      '<td>' + (r.minAttendanceCount > 0 ? r.minAttendanceCount : '—') + '</td>' +
      '<td class="text-end"><a href="#/curriculum/rank/' + r.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-list-ul"></i> Requirements</a></td></tr>'
    ).join('');

    return {
      html: UI.pageHeader('Ranks & Curriculum', '') +
        '<p class="text-muted">Per-rank syllabus from the Northern Rockies Karate-do examination requirements. Click a rank to view its syllabus.</p>' +
        '<div class="mb-3" style="max-width:360px"><select id="memberJump" class="form-select">' + memberOpts + '</select></div>' +
        '<div class="card"><div class="card-body p-0"><table class="table mb-0 align-middle">' +
        '<thead class="table-light"><tr><th>Rank</th><th>Category</th><th>Jr stripes</th><th>Requirements</th><th>Min mo.</th><th>Min att.</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div>',
      mount: function () {
        document.getElementById('memberJump').addEventListener('change', function (e) {
          if (e.target.value) UI.nav('/curriculum/member/' + e.target.value);
        });
      }
    };
  };

  window.Screens.curriculumRank = function (params) {
    const r = Store.rank(parseInt(params.id, 10));
    if (!r) return { html: '<div class="alert alert-warning">Rank not found.</div>' };
    const items = r.requirements.length
      ? '<ol class="list-group list-group-numbered">' + r.requirements.map(req =>
          '<li class="list-group-item">' + UI.esc(req.label) + '</li>').join('') + '</ol>'
      : '<div class="alert alert-info">No specific requirements recorded for this rank.</div>';

    return {
      html: UI.pageHeader(r.name + ' — syllabus',
        '<a href="#/curriculum" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> All ranks</a>') +
        '<p class="text-muted small">' +
          'Category: <span class="text-uppercase">' + UI.esc(r.category) + '</span>' +
          (r.minTimeInRankMonths ? ' · Min time in rank: ' + r.minTimeInRankMonths + ' months' : '') +
          (r.minAttendanceCount ? ' · Min attendance: ' + r.minAttendanceCount + ' sessions' : '') + '</p>' +
        items
    };
  };

  window.Screens.curriculumMember = function (params) {
    const m = Store.member(parseInt(params.id, 10));
    if (!m) return { html: '<div class="alert alert-warning">Member not found.</div>' };
    const rank = Store.currentRank(m);
    const elig = UI.eligibility(m);

    const memberOpts = Store.members(false).map(x =>
      '<option value="' + x.id + '"' + (x.id === m.id ? ' selected' : '') + '>' + UI.esc(Store.sortName(x)) + '</option>').join('');

    const checklist = rank && rank.requirements.length
      ? '<div class="list-group">' + rank.requirements.map(req => {
          const on = Store.isSignedOff(m.id, req.id);
          return '<label class="list-group-item d-flex align-items-center">' +
            '<input type="checkbox" class="form-check-input me-3 req-check" data-req="' + req.id + '"' + (on ? ' checked' : '') + '>' +
            '<span class="' + (on ? 'text-decoration-line-through text-muted' : '') + '">' + UI.esc(req.label) + '</span></label>';
        }).join('') + '</div>'
      : '<div class="alert alert-info">No requirements to track at this rank.</div>';

    const summary =
      '<div class="alert ' + (elig.eligible ? 'alert-success' : 'alert-secondary') + ' d-flex justify-content-between align-items-center">' +
        '<span>Progress toward ' + (elig.next ? UI.esc(elig.next.name) : 'next rank') + ': <strong id="progCount">' + elig.done + ' / ' + elig.total + '</strong> requirements' +
        (elig.next ? ' · ' + elig.months + '/' + elig.minMonths + ' mo · ' + elig.attendance + '/' + elig.minAtt + ' att.' : '') + '</span>' +
        (elig.eligible ? '<span class="badge bg-success">Ready to grade</span>' : '') + '</div>';

    return {
      html: UI.pageHeader('Curriculum — ' + Store.fullName(m),
        '<a href="#/members/' + m.id + '" class="btn btn-outline-secondary"><i class="bi bi-person"></i> Member</a>') +
        '<div class="row g-2 align-items-center mb-3"><div class="col-auto text-muted small">Current rank:</div>' +
          '<div class="col-auto">' + UI.rankBadge(rank) + '</div>' +
          '<div class="col-auto ms-auto" style="max-width:260px"><select id="memberSwitch" class="form-select form-select-sm">' + memberOpts + '</select></div></div>' +
        summary + checklist,
      mount: function () {
        document.getElementById('memberSwitch').addEventListener('change', function (e) {
          UI.nav('/curriculum/member/' + e.target.value);
        });
        document.querySelectorAll('.req-check').forEach(c => c.onclick = function () {
          Store.toggleRequirement(m.id, c.getAttribute('data-req'));
          Router.render(); // refresh progress + grading-derived state
        });
      }
    };
  };
})();
