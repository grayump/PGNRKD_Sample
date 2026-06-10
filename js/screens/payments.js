/* Dues / payments — outstanding dashboard + per-member history. */
(function () {
  window.Screens = window.Screens || {};
  const DUES = function () { return Store.DUES_CENTS(); };

  window.Screens.paymentsIndex = function () {
    const period = UI.today().slice(0, 7);
    const members = Store.members(false).filter(m => !m.sensei);
    const owing = members.filter(m => !Store.isPaid(m.id, period));

    const owingCard =
      '<div class="card mb-4 ' + (owing.length ? 'border-danger' : 'border-success') + '">' +
        '<div class="card-header fw-semibold ' + (owing.length ? 'text-danger' : 'text-success') + '">' +
          '<i class="bi bi-cash-coin"></i> Outstanding dues — ' + UI.fmtPeriod(period) +
          ' (' + owing.length + ')</div>' +
        (owing.length
          ? '<div class="card-body p-0"><table class="table mb-0 align-middle"><tbody>' +
              owing.map(m =>
                '<tr><td><a href="#/payments/' + m.id + '">' + UI.esc(Store.sortName(m)) + '</a></td>' +
                '<td class="text-muted small">' + UI.money(DUES()) + ' due</td>' +
                '<td class="text-end"><button class="btn btn-sm btn-primary record-btn" data-id="' + m.id + '">' +
                  '<i class="bi bi-check-lg"></i> Mark paid</button></td></tr>').join('') +
            '</tbody></table></div>'
          : '<div class="card-body text-success mb-0">All dues collected for ' + UI.fmtPeriod(period) + '. 🎉</div>') +
      '</div>';

    const allRows = members.map(m => {
      const last = Store.paymentsForMember(m.id)[0];
      const paid = Store.isPaid(m.id, period);
      return '<tr><td><a href="#/payments/' + m.id + '" class="text-decoration-none">' + UI.esc(Store.sortName(m)) + '</a></td>' +
        '<td>' + (paid ? '<span class="badge bg-success">Paid</span>' : '<span class="badge bg-secondary">Unpaid</span>') + '</td>' +
        '<td class="text-muted small">' + (last ? UI.fmtPeriod(last.period) + ' · ' + UI.money(last.amount) : '—') + '</td></tr>';
    }).join('');

    const allCard = '<div class="card"><div class="card-header fw-semibold">All members — ' + UI.fmtPeriod(period) + '</div>' +
      '<div class="card-body p-0"><table class="table mb-0 align-middle">' +
      '<thead class="table-light"><tr><th>Member</th><th>This month</th><th>Last payment</th></tr></thead>' +
      '<tbody>' + allRows + '</tbody></table></div></div>';

    return {
      html: UI.pageHeader('Dues', '') + owingCard + allCard,
      mount: function () {
        document.querySelectorAll('.record-btn').forEach(b => {
          b.onclick = function () {
            Store.addPayment({ memberId: parseInt(b.getAttribute('data-id'), 10), amount: DUES(), period: period, method: 'cash', date: UI.today() });
            UI.toast('Payment recorded');
            Router.render();
          };
        });
      }
    };
  };

  window.Screens.paymentsMember = function (params) {
    const m = Store.member(parseInt(params.id, 10));
    if (!m) return { html: '<div class="alert alert-warning">Member not found.</div>' };
    const pays = Store.paymentsForMember(m.id);

    const periodOpts = (function () {
      const out = []; const t = UI.today().split('-').map(Number);
      for (let i = 0; i < 12; i++) {
        let mo = t[1] - i, yr = t[0];
        while (mo <= 0) { mo += 12; yr--; }
        const p = yr + '-' + String(mo).padStart(2, '0');
        out.push('<option value="' + p + '">' + UI.fmtPeriod(p) + '</option>');
      }
      return out.join('');
    })();

    const history = pays.length
      ? '<table class="table align-middle"><thead class="table-light"><tr><th>Period</th><th>Amount</th><th>Method</th><th>Date paid</th></tr></thead><tbody>' +
        pays.map(p => '<tr><td>' + UI.fmtPeriod(p.period) + '</td><td>' + UI.money(p.amount) + '</td>' +
          '<td class="text-capitalize">' + UI.esc(p.method) + '</td><td class="text-muted small">' + UI.fmtDate(p.date) + '</td></tr>').join('') +
        '</tbody></table>'
      : '<div class="alert alert-info">No payments recorded yet.</div>';

    const form =
      '<div class="card mb-4"><div class="card-header fw-semibold">Record a payment</div><div class="card-body">' +
        '<form id="payForm" class="row g-2 align-items-end">' +
          '<div class="col-md-4"><label class="form-label small">Period</label><select id="p_period" class="form-select">' + periodOpts + '</select></div>' +
          '<div class="col-md-3"><label class="form-label small">Amount ($)</label><input id="p_amount" type="number" step="0.01" class="form-control" value="' + (DUES() / 100).toFixed(2) + '"></div>' +
          '<div class="col-md-3"><label class="form-label small">Method</label><select id="p_method" class="form-select">' +
            '<option value="cash">Cash</option><option value="bank">Bank</option><option value="other">Other</option></select></div>' +
          '<div class="col-md-2"><button class="btn btn-primary w-100">Add</button></div>' +
        '</form></div></div>';

    return {
      html: UI.pageHeader('Dues — ' + Store.fullName(m),
        '<a href="#/members/' + m.id + '" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Member</a>') +
        form + history,
      mount: function () {
        document.getElementById('payForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const cents = Math.round(parseFloat(document.getElementById('p_amount').value || '0') * 100);
          Store.addPayment({ memberId: m.id, amount: cents, period: document.getElementById('p_period').value, method: document.getElementById('p_method').value, date: UI.today() });
          UI.toast('Payment recorded');
          Router.render();
        });
      }
    };
  };
})();
