/* Grading eligibility — computed live from curriculum progress,
   time-in-rank, and attendance credit. */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.grading = function () {
    const rows = Store.members(false)
      .map(UI.eligibility)
      .filter(e => e.next); // exclude top-rank members
    const eligible = rows.filter(e => e.eligible);
    const not = rows.filter(e => !e.eligible);

    function mark(ok) {
      return '<i class="bi ' + (ok ? 'bi-check-circle text-success' : 'bi-x-circle text-danger') + '"></i> ';
    }
    function nameCell(e) {
      return '<a href="#/members/' + e.member.id + '">' + UI.esc(Store.fullName(e.member)) + '</a>' +
        (e.member.junior ? ' <span class="badge bg-secondary small">Junior</span>' : '');
    }

    function eligibleRow(e) {
      return '<tr><td>' + nameCell(e) + '</td>' +
        '<td>' + UI.esc(e.next.name) + '</td>' +
        '<td class="text-success">' + mark(true) + e.done + ' / ' + e.total + '</td>' +
        '<td class="text-success">' + mark(true) + e.months + ' mo</td>' +
        '<td class="text-success">' + mark(true) + e.attendance + '</td>' +
        '<td class="text-end"><button class="btn btn-sm btn-success promote-btn" data-id="' + e.member.id + '" data-rank="' + e.next.id + '">' +
          '<i class="bi bi-arrow-up-circle"></i> Promote</button></td></tr>';
    }
    function notRow(e) {
      return '<tr><td>' + nameCell(e) + '</td>' +
        '<td>' + UI.esc(e.next.name) + '</td>' +
        '<td>' + mark(e.reqMet) + e.done + ' / ' + e.total + '</td>' +
        '<td>' + mark(e.timeMet) + e.months + ' / ' + e.minMonths + ' mo</td>' +
        '<td>' + mark(e.attMet) + e.attendance + ' / ' + e.minAtt + '</td>' +
        '<td class="text-end"><a href="#/curriculum/member/' + e.member.id + '" class="btn btn-sm btn-outline-secondary">Progress</a></td></tr>';
    }

    const head = '<thead class="table-light"><tr><th>Member</th><th>Training for</th>' +
      '<th>Requirements</th><th>Time in rank</th><th>Attendance</th><th></th></tr></thead>';

    const eligibleCard = eligible.length
      ? '<div class="card border-success mb-4"><div class="card-header bg-success text-white fw-semibold">' +
          '<i class="bi bi-check-circle"></i> Ready for grading (' + eligible.length + ')</div>' +
          '<div class="card-body p-0"><table class="table mb-0">' + head +
          '<tbody>' + eligible.map(eligibleRow).join('') + '</tbody></table></div></div>'
      : '<div class="alert alert-secondary mb-4">No members are currently eligible for grading.</div>';

    const notCard = not.length
      ? '<div class="card"><div class="card-header fw-semibold">Not yet eligible (' + not.length + ')</div>' +
          '<div class="card-body p-0"><table class="table mb-0">' + head +
          '<tbody>' + not.map(notRow).join('') + '</tbody></table></div></div>'
      : '';

    return {
      html: UI.pageHeader('Grading Eligibility', '') + eligibleCard + notCard,
      mount: function () {
        document.querySelectorAll('.promote-btn').forEach(btn => {
          btn.onclick = function () {
            const mid = parseInt(btn.getAttribute('data-id'), 10);
            const rid = parseInt(btn.getAttribute('data-rank'), 10);
            const rank = Store.rank(rid);
            if (confirm('Promote ' + Store.fullName(Store.member(mid)) + ' to ' + rank.name + '?')) {
              Store.addPromotion(mid, rid, UI.today());
              UI.toast('Promoted to ' + rank.name);
              Router.render();
            }
          };
        });
      }
    };
  };
})();
