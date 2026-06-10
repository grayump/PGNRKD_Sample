/* Export snapshot — mock only (no real file is produced). */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.export = function () {
    const counts = {
      members: Store.members(false).length,
      slots: Store.slots().length,
      lessons: Store.lessonPlans().length,
      ranks: Store.ranks().length
    };
    const html = UI.pageHeader('Export snapshot', '') +
      '<div class="card"><div class="card-body">' +
        '<p>Create a read-only snapshot of the club data to load on the mobile companion app.</p>' +
        '<ul class="text-muted small">' +
          '<li>' + counts.members + ' members</li>' +
          '<li>' + counts.slots + ' class slots</li>' +
          '<li>' + counts.lessons + ' lesson plans</li>' +
          '<li>' + counts.ranks + ' ranks &amp; curriculum</li>' +
        '</ul>' +
        '<button class="btn btn-primary" id="snapBtn"><i class="bi bi-download"></i> Generate snapshot</button>' +
        '<p class="text-muted small mt-3 mb-0"><i class="bi bi-info-circle"></i> Prototype: this is a mock — no file is actually produced.</p>' +
      '</div></div>';
    return {
      html: html,
      mount: function () {
        document.getElementById('snapBtn').onclick = function () { UI.toast('Snapshot ready (demo)'); };
      }
    };
  };
})();
