/* ============================================================
   Router — hash-based, no server config needed (GitHub Pages
   friendly). Maps "#/path" to a screen function that returns
   { html, mount? }. Guards routes behind a demo login.
   ============================================================ */
(function () {
  const S = window.Screens || {};

  // route pattern -> screen function. ":x" captures a param.
  const routes = [
    ['/', S.home],
    ['/login', S.login],
    ['/members', S.membersList],
    ['/members/new', S.memberForm],
    ['/members/:id/edit', S.memberForm],
    ['/members/:id', S.memberDetail],
    ['/grading', S.grading],
    ['/payments', S.paymentsIndex],
    ['/payments/:id', S.paymentsMember],
    ['/promotions', S.promotionsIndex],
    ['/promotions/new', S.promotionForm],
    ['/classslots', S.classSlots],
    ['/sessionplans', S.sessionPlansIndex],
    ['/sessionplans/:id', S.sessionPlanView],
    ['/lessonplans', S.lessonPlansIndex],
    ['/lessonplans/new', S.lessonPlanForm],
    ['/lessonplans/:id', S.lessonPlanForm],
    ['/courses', S.coursesIndex],
    ['/courses/new', S.courseForm],
    ['/courses/:id', S.courseForm],
    ['/attendance', S.attendanceIndex],
    ['/attendance/session', S.attendanceSession],
    ['/curriculum', S.curriculumIndex],
    ['/curriculum/rank/:id', S.curriculumRank],
    ['/curriculum/member/:id', S.curriculumMember],
    ['/export', S.export]
  ];

  function parseQuery(qs) {
    const out = {};
    (qs || '').split('&').forEach(pair => {
      if (!pair) return;
      const kv = pair.split('=');
      out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
    return out;
  }

  function match(path) {
    const segs = path.split('/').filter(Boolean);
    for (const [pattern, fn] of routes) {
      if (!fn) continue;
      const pSegs = pattern.split('/').filter(Boolean);
      if (pSegs.length !== segs.length) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < pSegs.length; i++) {
        if (pSegs[i][0] === ':') params[pSegs[i].slice(1)] = decodeURIComponent(segs[i]);
        else if (pSegs[i] !== segs[i]) { ok = false; break; }
      }
      if (ok) return { fn, params };
    }
    return null;
  }

  function setActiveNav(path) {
    const first = '/' + (path.split('/').filter(Boolean)[0] || '');
    document.querySelectorAll('#nrkdNav .nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('#nrkdNav .nav-link[data-route]').forEach(l => {
      if (l.getAttribute('data-route') === first || (first === '/' && l.getAttribute('data-route') === '/')) {
        l.classList.add('active');
      }
    });
    // Highlight the dropdown parent the current section belongs to.
    const members = ['/members', '/grading', '/payments', '/promotions'];
    const classes = ['/classslots', '/sessionplans', '/lessonplans', '/courses'];
    const toggles = document.querySelectorAll('#nrkdNav .nav-item.dropdown > .nav-link');
    if (toggles[0]) toggles[0].classList.toggle('active', members.indexOf(first) !== -1);
    if (toggles[1]) toggles[1].classList.toggle('active', classes.indexOf(first) !== -1);
  }

  function renderLoginArea() {
    const host = document.getElementById('loginArea');
    if (!host) return;
    if (Store.isLoggedIn()) {
      host.innerHTML = '<li class="nav-item"><a class="nav-link" href="#" id="logoutLink">' +
        '<i class="bi bi-box-arrow-right"></i> Sign out</a></li>';
      document.getElementById('logoutLink').onclick = function (e) {
        e.preventDefault(); Store.logout(); UI.nav('/login');
      };
    } else {
      host.innerHTML = '';
    }
  }

  function render() {
    let raw = window.location.hash.replace(/^#/, '') || '/';
    const qIdx = raw.indexOf('?');
    const query = qIdx === -1 ? {} : parseQuery(raw.slice(qIdx + 1));
    const path = qIdx === -1 ? raw : raw.slice(0, qIdx);
    if (path[0] !== '/') { UI.nav('/'); return; }

    const app = document.getElementById('app');

    // Auth gate — everything except /login requires demo sign-in.
    if (!Store.isLoggedIn() && path !== '/login') {
      renderLoginArea();
      const res = S.login({ query: { next: raw } });
      app.innerHTML = res.html;
      if (res.mount) res.mount();
      return;
    }

    const m = match(path);
    renderLoginArea();
    setActiveNav(path);

    if (!m) {
      app.innerHTML = '<div class="alert alert-warning">Screen not found. <a href="#/">Go home</a>.</div>';
      return;
    }
    const params = Object.assign({}, m.params, { query });
    let res;
    try {
      res = m.fn(params);
    } catch (err) {
      app.innerHTML = '<div class="alert alert-danger">Something went wrong rendering this screen.</div>';
      console.error(err);
      return;
    }
    app.innerHTML = res.html;
    if (res.mount) res.mount();
    window.scrollTo(0, 0);
  }

  function init() {
    UI.syncThemeButtons();
    const reset = document.getElementById('resetDemo');
    if (reset) reset.onclick = function (e) {
      e.preventDefault();
      if (confirm('Reset all demo data back to the sample set?')) {
        Store.reset();
        UI.toast('Demo data reset');
        render();
      }
    };
    window.addEventListener('hashchange', render);
    render();
  }

  // Exposed so screens can re-render in place after mutating state
  // (navigating to the same hash does not fire hashchange).
  window.Router = { render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
