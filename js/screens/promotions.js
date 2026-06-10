/* Promotions — full history + record-a-promotion form. */
(function () {
  window.Screens = window.Screens || {};

  window.Screens.promotionsIndex = function () {
    const all = Store.state.promotions.slice().sort((a, b) => b.date.localeCompare(a.date));
    const rows = all.map(p => {
      const m = Store.member(p.memberId);
      return '<tr><td><a href="#/members/' + p.memberId + '">' + UI.esc(m ? Store.fullName(m) : '#' + p.memberId) + '</a></td>' +
        '<td>' + UI.rankBadge(Store.rank(p.rankId)) + '</td><td class="text-muted small">' + UI.fmtDate(p.date) + '</td></tr>';
    }).join('');
    const body = all.length
      ? '<div class="card"><div class="card-body p-0"><table class="table mb-0 align-middle">' +
          '<thead class="table-light"><tr><th>Member</th><th>Promoted to</th><th>Date</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table></div></div>'
      : '<div class="alert alert-info">No promotions recorded.</div>';
    return {
      html: UI.pageHeader('Promotions',
        '<a href="#/promotions/new" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Record promotion</a>') + body
    };
  };

  window.Screens.promotionForm = function (params) {
    const preMember = params.query && params.query.member ? parseInt(params.query.member, 10) : null;
    const memberOpts = Store.members(false).map(m =>
      '<option value="' + m.id + '"' + (m.id === preMember ? ' selected' : '') + '>' + UI.esc(Store.sortName(m)) + '</option>').join('');
    const rankOpts = Store.ranks().map(r => '<option value="' + r.id + '">' + UI.esc(r.name) + '</option>').join('');

    const html = UI.pageHeader('Record promotion',
      '<a href="#/promotions" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="promoForm" class="card"><div class="card-body row g-3">' +
        '<div class="col-md-5"><label class="form-label">Member</label><select id="pr_member" class="form-select">' + memberOpts + '</select></div>' +
        '<div class="col-md-4"><label class="form-label">New rank</label><select id="pr_rank" class="form-select">' + rankOpts + '</select></div>' +
        '<div class="col-md-3"><label class="form-label">Date</label><input id="pr_date" type="date" class="form-control" value="' + UI.today() + '"></div>' +
      '</div><div class="card-footer"><button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button></div></form>';

    return {
      html: html,
      mount: function () {
        const sel = document.getElementById('pr_member');
        const rankSel = document.getElementById('pr_rank');
        function syncRank() {
          const m = Store.member(parseInt(sel.value, 10));
          const next = m ? Store.nextRank(m.rankId) : null;
          if (next) rankSel.value = String(next.id);
        }
        sel.addEventListener('change', syncRank); syncRank();
        document.getElementById('promoForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const mid = parseInt(sel.value, 10), rid = parseInt(rankSel.value, 10);
          Store.addPromotion(mid, rid, document.getElementById('pr_date').value);
          UI.toast('Promotion recorded');
          UI.nav('/members/' + mid);
        });
      }
    };
  };
})();
