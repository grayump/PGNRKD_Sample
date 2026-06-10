/* Member create / edit form. */
(function () {
  window.Screens = window.Screens || {};
  window.Screens.memberForm = function (params) {
    const id = params.id ? parseInt(params.id, 10) : null;
    const editing = !!id;
    const m = editing ? Store.member(id) : null;
    if (editing && !m) return { html: '<div class="alert alert-warning">Member not found.</div>' };
    const v = m || { given: '', family: '', dob: '', phone: '', email: '', address: '', emergency: '',
      junior: false, sensei: false, guardianName: '', guardianPhone: '', guardianEmail: '',
      join: UI.today(), medical: '', rankId: 1, duesPlan: 'single' };

    function input(id, label, val, type, col) {
      return '<div class="' + (col || 'col-md-6') + '"><label class="form-label">' + label + '</label>' +
        '<input id="' + id + '" type="' + (type || 'text') + '" class="form-control" value="' + UI.esc(val || '') + '"></div>';
    }
    const rankOpts = Store.ranks().map(r =>
      '<option value="' + r.id + '"' + (r.id === v.rankId ? ' selected' : '') + '>' + UI.esc(r.name) + '</option>').join('');
    const duesOpts = [['single', 'Single'], ['family_two', 'Family (2)'], ['family_additional', 'Family (additional)']]
      .map(o => '<option value="' + o[0] + '"' + (v.duesPlan === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('');

    const html =
      UI.pageHeader(editing ? 'Edit member' : 'Add member',
        '<a href="' + (editing ? '#/members/' + id : '#/members') + '" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="memberForm" class="card"><div class="card-body"><div class="row g-3">' +
        input('f_given', 'Given name', v.given) +
        input('f_family', 'Family name', v.family) +
        input('f_dob', 'Date of birth', v.dob, 'date') +
        input('f_join', 'Join date', v.join, 'date') +
        input('f_phone', 'Phone', v.phone) +
        input('f_email', 'Email', v.email, 'email') +
        input('f_address', 'Address', v.address, 'text', 'col-12') +
        input('f_emergency', 'Emergency contact', v.emergency, 'text', 'col-12') +
        '<div class="col-md-6"><label class="form-label">Current rank</label><select id="f_rank" class="form-select">' + rankOpts + '</select></div>' +
        '<div class="col-md-6"><label class="form-label">Dues plan</label><select id="f_dues" class="form-select">' + duesOpts + '</select></div>' +
        '<div class="col-12"><div class="form-check form-check-inline">' +
          '<input class="form-check-input" type="checkbox" id="f_junior"' + (v.junior ? ' checked' : '') + '>' +
          '<label class="form-check-label" for="f_junior">Junior</label></div>' +
          '<div class="form-check form-check-inline">' +
          '<input class="form-check-input" type="checkbox" id="f_sensei"' + (v.sensei ? ' checked' : '') + '>' +
          '<label class="form-check-label" for="f_sensei">Sensei</label></div></div>' +
        '<div class="col-12" id="guardianBlock"><div class="row g-3">' +
          input('f_gname', 'Guardian name', v.guardianName, 'text', 'col-md-4') +
          input('f_gphone', 'Guardian phone', v.guardianPhone, 'text', 'col-md-4') +
          input('f_gemail', 'Guardian email', v.guardianEmail, 'email', 'col-md-4') +
        '</div></div>' +
        '<div class="col-12"><label class="form-label">Medical notes</label>' +
          '<textarea id="f_medical" class="form-control" rows="2">' + UI.esc(v.medical || '') + '</textarea></div>' +
      '</div></div>' +
      '<div class="card-footer"><button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button></div>' +
      '</form>';

    return {
      html: html,
      mount: function () {
        const junior = document.getElementById('f_junior');
        const gblock = document.getElementById('guardianBlock');
        function syncGuardian() { gblock.style.display = junior.checked ? '' : 'none'; }
        junior.addEventListener('change', syncGuardian); syncGuardian();

        document.getElementById('memberForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const data = {
            given: val('f_given'), family: val('f_family'), dob: val('f_dob'),
            phone: val('f_phone'), email: val('f_email'), address: val('f_address'),
            emergency: val('f_emergency'), join: val('f_join'),
            junior: junior.checked, sensei: document.getElementById('f_sensei').checked,
            guardianName: val('f_gname'), guardianPhone: val('f_gphone'), guardianEmail: val('f_gemail'),
            rankId: parseInt(val('f_rank'), 10), duesPlan: val('f_dues'), medical: val('f_medical')
          };
          if (!data.given || !data.family) { UI.toast('Name is required', 'danger'); return; }
          if (editing) { Store.updateMember(id, data); UI.toast('Member updated'); UI.nav('/members/' + id); }
          else { data.promotedOn = data.join; const nm = Store.addMember(data); UI.toast('Member added'); UI.nav('/members/' + nm.id); }
        });
        function val(x) { return document.getElementById(x).value.trim(); }
      }
    };
  };
})();
