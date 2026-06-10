/* Courses — curriculum mini-programs (index + form). */
(function () {
  window.Screens = window.Screens || {};
  const AUD = ['kids', 'adults', 'all-levels', 'black-belt'];

  window.Screens.coursesIndex = function () {
    const courses = Store.courses();
    const cards = courses.map(c =>
      '<div class="col-md-6 col-lg-4"><div class="card h-100"><div class="card-body">' +
        '<div class="d-flex justify-content-between align-items-start mb-2">' +
          '<h2 class="h6 mb-0">' + UI.esc(c.name) + '</h2>' + UI.audienceBadge(c.audience) + '</div>' +
        '<p class="text-muted small mb-2"><i class="bi bi-calendar3"></i> ' + c.weeks + ' weeks</p>' +
        (c.notes ? '<p class="small mb-0">' + UI.esc(c.notes) + '</p>' : '') +
      '</div><div class="card-footer bg-transparent">' +
        '<a href="#/courses/' + c.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i> Edit</a>' +
      '</div></div></div>').join('');
    const body = courses.length ? '<div class="row g-3">' + cards + '</div>'
      : '<div class="alert alert-info">No courses yet.</div>';
    return {
      html: UI.pageHeader('Courses',
        '<a href="#/courses/new" class="btn btn-primary"><i class="bi bi-plus-lg"></i> New course</a>') +
        '<p class="text-muted">Multi-week curriculum programs that group lesson material.</p>' + body
    };
  };

  window.Screens.courseForm = function (params) {
    const id = params.id ? parseInt(params.id, 10) : null;
    const c = id ? Store.course(id) : { name: '', weeks: 8, audience: 'all-levels', notes: '' };
    if (id && !c) return { html: '<div class="alert alert-warning">Course not found.</div>' };
    const audOpts = AUD.map(a => '<option value="' + a + '"' + (a === c.audience ? ' selected' : '') + '>' + a + '</option>').join('');

    const html = UI.pageHeader(id ? 'Edit course' : 'New course',
      '<a href="#/courses" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="cForm" class="card"><div class="card-body row g-3">' +
        '<div class="col-md-6"><label class="form-label">Name</label><input id="c_name" class="form-control" value="' + UI.esc(c.name) + '"></div>' +
        '<div class="col-md-3"><label class="form-label">Weeks</label><input id="c_weeks" type="number" class="form-control" value="' + c.weeks + '"></div>' +
        '<div class="col-md-3"><label class="form-label">Audience</label><select id="c_aud" class="form-select text-capitalize">' + audOpts + '</select></div>' +
        '<div class="col-12"><label class="form-label">Notes</label><textarea id="c_notes" class="form-control" rows="2">' + UI.esc(c.notes || '') + '</textarea></div>' +
      '</div><div class="card-footer"><button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button></div></form>';

    return {
      html: html,
      mount: function () {
        document.getElementById('cForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const data = {
            name: document.getElementById('c_name').value.trim() || 'Untitled course',
            weeks: parseInt(document.getElementById('c_weeks').value, 10) || 1,
            audience: document.getElementById('c_aud').value,
            notes: document.getElementById('c_notes').value.trim()
          };
          if (id) Store.updateCourse(id, data); else Store.addCourse(data);
          UI.toast('Course saved'); UI.nav('/courses');
        });
      }
    };
  };
})();
