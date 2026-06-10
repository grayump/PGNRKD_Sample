/* Members list — search, active/archived toggle, add. */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.membersList = function (params) {
    const archived = !!(params && params.query && params.query.archived === '1');
    const members = Store.members(archived);

    function row(m) {
      const rank = Store.currentRank(m);
      const badges =
        (m.sensei ? '<span class="badge bg-primary ms-1">Sensei</span>' : '') +
        (m.junior ? '<span class="badge bg-secondary ms-1">Junior</span>' : '');
      return '<tr data-name="' + UI.esc((m.given + ' ' + m.family).toLowerCase()) + '">' +
        '<td><a href="#/members/' + m.id + '" class="text-decoration-none">' + UI.esc(Store.sortName(m)) + '</a>' + badges + '</td>' +
        '<td>' + UI.rankBadge(rank) + (rank && rank.colorDisplay ? ' <small class="text-muted">' + UI.esc(rank.colorDisplay) + '</small>' : '') + '</td>' +
        '<td>' + UI.fmtDate(m.join) + '</td>' +
        '<td class="text-end"><a href="#/members/' + m.id + '/edit" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i> Edit</a></td>' +
      '</tr>';
    }

    const right = archived
      ? '<a href="#/members" class="btn btn-outline-secondary"><i class="bi bi-people"></i> Active</a>'
      : '<a href="#/members?archived=1" class="btn btn-outline-secondary"><i class="bi bi-archive"></i> Archived</a>' +
        '<a href="#/members/new" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add member</a>';

    let body;
    if (!members.length) {
      body = '<div class="alert alert-info">' + (archived ? 'No archived members.' :
        'No members yet. <a href="#/members/new" class="alert-link">Add the first one.</a>') + '</div>';
    } else {
      body =
        '<input id="memberSearch" class="form-control mb-3" placeholder="Search by name…" autocomplete="off">' +
        '<div class="table-responsive"><table class="table table-hover align-middle">' +
          '<thead><tr><th>Name</th><th>Rank</th><th>Joined</th><th class="text-end"></th></tr></thead>' +
          '<tbody id="memberRows">' + members.map(row).join('') + '</tbody>' +
        '</table></div>';
    }

    return {
      html: UI.pageHeader(archived ? 'Archived members' : 'Members', right) + body,
      mount: function () {
        const search = document.getElementById('memberSearch');
        if (!search) return;
        search.addEventListener('input', function () {
          const q = search.value.trim().toLowerCase();
          document.querySelectorAll('#memberRows tr').forEach(tr => {
            tr.style.display = tr.getAttribute('data-name').indexOf(q) !== -1 ? '' : 'none';
          });
        });
      }
    };
  };
})();
