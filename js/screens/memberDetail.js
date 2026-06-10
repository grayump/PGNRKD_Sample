/* Member detail — profile + attendance / dues / rank history / curriculum links. */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.memberDetail = function (params) {
    const m = Store.member(parseInt(params.id, 10));
    if (!m) return { html: '<div class="alert alert-warning">Member not found. <a href="#/members">Back</a>.</div>' };

    const rank = Store.currentRank(m);
    const elig = UI.eligibility(m);
    const promos = Store.promotionsForMember(m.id);
    const pays = Store.paymentsForMember(m.id);
    const age = UI.age(m.dob);

    function field(label, value) {
      return '<dt class="col-sm-4 text-muted small">' + label + '</dt>' +
             '<dd class="col-sm-8">' + (value ? UI.esc(value) : '<span class="text-muted">—</span>') + '</dd>';
    }

    const contact = '<dl class="row mb-0">' +
      field('Date of birth', m.dob ? UI.fmtDate(m.dob) + (age != null ? ' (age ' + age + ')' : '') : '') +
      field('Phone', m.phone) + field('Email', m.email) + field('Address', m.address) +
      field('Emergency', m.emergency) +
      (m.junior ? field('Guardian', (m.guardianName || '') + (m.guardianPhone ? ' · ' + m.guardianPhone : '')) : '') +
      field('Joined', UI.fmtDate(m.join)) +
      field('Medical', m.medical) +
    '</dl>';

    const eligBadge = elig.eligible
      ? '<span class="badge bg-success">Ready to grade</span>'
      : (elig.next ? '<span class="badge bg-secondary">Training for ' + UI.esc(elig.next.name) + '</span>' : '<span class="badge bg-dark">Top rank</span>');

    const gradeCard =
      '<div class="card mb-3"><div class="card-header fw-semibold">Grading progress</div>' +
        '<div class="card-body">' +
          '<p class="mb-2">Current rank: ' + UI.rankBadge(rank) + ' ' + eligBadge + '</p>' +
          (elig.next ?
            '<ul class="list-unstyled small mb-2">' +
              metric('Requirements', elig.done + ' / ' + elig.total, elig.reqMet) +
              metric('Time in rank', elig.months + ' / ' + elig.minMonths + ' mo', elig.timeMet) +
              metric('Attendance', elig.attendance + ' / ' + elig.minAtt, elig.attMet) +
            '</ul>' : '') +
          '<a href="#/curriculum/member/' + m.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-check2-square"></i> Curriculum checklist</a> ' +
          '<a href="#/promotions/new?member=' + m.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-arrow-up-circle"></i> Promote</a>' +
        '</div></div>';

    function metric(label, val, ok) {
      return '<li><i class="bi ' + (ok ? 'bi-check-circle text-success' : 'bi-dash-circle text-muted') + ' me-1"></i>' +
        label + ': ' + val + '</li>';
    }

    const promoCard =
      '<div class="card mb-3"><div class="card-header fw-semibold">Rank history</div>' +
        (promos.length ?
          '<ul class="list-group list-group-flush">' + promos.map(p =>
            '<li class="list-group-item d-flex justify-content-between"><span>' + UI.esc(Store.rank(p.rankId).name) + '</span>' +
            '<span class="text-muted small">' + UI.fmtDate(p.date) + '</span></li>').join('') + '</ul>'
          : '<div class="card-body text-muted small">No promotions recorded.</div>') +
      '</div>';

    const payCard =
      '<div class="card mb-3"><div class="card-header d-flex justify-content-between fw-semibold">' +
        '<span>Dues</span><a href="#/payments/' + m.id + '" class="small">History</a></div>' +
        '<div class="card-body">' +
          '<p class="mb-1">Attendance recorded: <strong>' + Store.attendanceCount(m.id) + '</strong> sessions</p>' +
          (pays.length ? '<p class="mb-0 small text-muted">Last payment: ' + UI.fmtPeriod(pays[0].period) + ' (' + UI.money(pays[0].amount) + ')</p>'
            : '<p class="mb-0 small text-danger">No payments on record.</p>') +
        '</div></div>';

    const right =
      '<a href="#/members/' + m.id + '/edit" class="btn btn-outline-secondary"><i class="bi bi-pencil"></i> Edit</a>' +
      (m.archived
        ? '<button class="btn btn-outline-success" id="unarchiveBtn"><i class="bi bi-arrow-counterclockwise"></i> Restore</button>'
        : '<button class="btn btn-outline-danger" id="archiveBtn"><i class="bi bi-archive"></i> Archive</button>') +
      '<a href="#/members" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Back</a>';

    const html =
      UI.pageHeader(Store.fullName(m), right) +
      '<div class="row g-3"><div class="col-lg-6">' +
        '<div class="card mb-3"><div class="card-header fw-semibold">Profile</div><div class="card-body">' + contact + '</div></div>' +
      '</div><div class="col-lg-6">' + gradeCard + payCard + promoCard + '</div></div>';

    return {
      html: html,
      mount: function () {
        const a = document.getElementById('archiveBtn');
        if (a) a.onclick = function () { Store.setArchived(m.id, true); UI.toast('Member archived'); UI.nav('/members'); };
        const u = document.getElementById('unarchiveBtn');
        if (u) u.onclick = function () { Store.setArchived(m.id, false); UI.toast('Member restored'); UI.nav('/members'); };
      }
    };
  };
})();
