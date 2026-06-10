/* Home — hero + a small dashboard so the landing screen feels alive. */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.home = function () {
    const period = UI.today().slice(0, 7); // "2026-06"
    const active = Store.members(false);
    const memberCount = active.length;
    const owing = active.filter(m => !m.sensei && !Store.isPaid(m.id, period));
    const ready = active.filter(m => UI.eligibility(m).eligible);

    function statCard(value, label, icon, href, tone) {
      return '<div class="col-6 col-lg-3">' +
        '<a href="' + href + '" class="text-decoration-none">' +
        '<div class="card h-100 shadow-sm">' +
          '<div class="card-body text-center">' +
            '<div class="display-6 fw-bold text-' + tone + '">' + value + '</div>' +
            '<div class="text-muted small"><i class="bi ' + icon + ' me-1"></i>' + label + '</div>' +
          '</div></div></a></div>';
    }

    const html =
      '<div class="row align-items-center g-5 mb-2">' +
        '<div class="col-lg-6 text-center">' +
          '<img src="images/crest-normal.gif" class="crest crest-normal crest-hero mb-3" alt="NRKD Crest" />' +
          '<img src="images/crest-light.png" class="crest crest-light crest-hero mb-3" alt="NRKD Crest" />' +
          '<img src="images/crest-gray-silver.png" class="crest crest-dark crest-hero mb-3" alt="NRKD Crest" />' +
          '<h1 class="display-6 fw-bold mt-2">NRKD Chito-Ryu</h1>' +
          '<p class="lead mb-1">Traditional Karate — Chito-Ryu Style</p>' +
          '<p class="text-muted mb-4">Club management portal for instructors and administrators.</p>' +
          '<div class="d-flex flex-wrap justify-content-center gap-2">' +
            '<a href="#/members" class="btn btn-outline-secondary"><i class="bi bi-people-fill me-1"></i> Members</a>' +
            '<a href="#/attendance" class="btn btn-outline-secondary"><i class="bi bi-clipboard-check me-1"></i> Attendance</a>' +
            '<a href="#/curriculum" class="btn btn-outline-secondary"><i class="bi bi-journal-text me-1"></i> Curriculum</a>' +
            '<a href="#/grading" class="btn btn-outline-secondary"><i class="bi bi-award me-1"></i> Grading</a>' +
          '</div>' +
        '</div>' +
        '<div class="col-lg-6 text-center d-none d-lg-block">' +
          '<img src="images/karate-character.png" class="img-fluid rounded shadow" ' +
            'style="max-height:420px;object-fit:cover" alt="Karate practitioner" />' +
        '</div>' +
      '</div>' +
      '<hr class="my-4">' +
      '<h2 class="h5 mb-3">At a glance</h2>' +
      '<div class="row g-3">' +
        statCard(memberCount, 'Active members', 'bi-people', '#/members', 'primary') +
        statCard(ready.length, 'Ready to grade', 'bi-award', '#/grading', 'success') +
        statCard(owing.length, 'Owing dues (' + UI.fmtPeriod(period) + ')', 'bi-cash-coin', '#/payments', (owing.length ? 'danger' : 'success')) +
        statCard(Store.slots().length, 'Weekly classes', 'bi-calendar-week', '#/classslots', 'secondary') +
      '</div>';
    return { html: html };
  };
})();
