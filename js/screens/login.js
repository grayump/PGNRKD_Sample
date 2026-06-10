/* Sign-in gate (demo — any username/password works). */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.login = function (params) {
    const next = (params && params.query && params.query.next) || '/';
    const html =
      '<div class="row justify-content-center mt-4 mt-md-5">' +
        '<div class="col-md-5">' +
          '<div class="card shadow-sm">' +
            '<div class="card-body p-4">' +
              '<div class="text-center mb-3">' +
                '<img src="images/crest-normal.gif" class="crest crest-normal" style="height:48px" alt="" />' +
                '<img src="images/crest-light.png" class="crest crest-light" style="height:48px" alt="" />' +
                '<img src="images/crest-gray-silver.png" class="crest crest-dark" style="height:48px" alt="" />' +
              '</div>' +
              '<h1 class="h4 mb-3 text-center">Sign in to NRKD Chito-ryu</h1>' +
              '<form id="loginForm">' +
                '<div class="mb-3"><label class="form-label">Username</label>' +
                  '<input class="form-control" id="u" value="sensei" autofocus></div>' +
                '<div class="mb-3"><label class="form-label">Password</label>' +
                  '<input type="password" class="form-control" id="p" value="demo"></div>' +
                '<button type="submit" class="btn btn-primary w-100">Sign in</button>' +
              '</form>' +
              '<p class="text-muted small text-center mt-3 mb-0">Demo: any username/password works.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    return {
      html: html,
      mount: function () {
        document.getElementById('loginForm').addEventListener('submit', function (e) {
          e.preventDefault();
          Store.login();
          UI.nav(next && next !== '/login' ? next : '/');
        });
      }
    };
  };
})();
