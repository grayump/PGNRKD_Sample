/* Lesson plans — template library (filter, duplicate) + segment editor. */
(function () {
  window.Screens = window.Screens || {};
  const AUD = ['kids', 'adults', 'all-levels', 'black-belt'];
  const LABELS = ['Warm-up', 'Kihon', 'Kata', 'Kumite', 'Cool-down', 'Conditioning', 'Free'];

  function totalMin(p) { return (p.segments || []).reduce((n, s) => n + (s.min || 0), 0); }

  window.Screens.lessonPlansIndex = function (params) {
    const filter = (params.query && params.query.audience) || 'all';
    let plans = Store.lessonPlans();
    if (filter !== 'all') plans = plans.filter(p => p.audience === filter);

    const filterBtns = ['all'].concat(AUD).map(a =>
      '<a href="#/lessonplans' + (a === 'all' ? '' : '?audience=' + a) + '" class="btn btn-sm ' +
      (filter === a ? 'btn-secondary' : 'btn-outline-secondary') + ' text-capitalize">' + a + '</a>').join(' ');

    const cards = plans.map(p =>
      '<div class="col-md-6 col-lg-4"><div class="card h-100">' +
        '<div class="card-body">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<h2 class="h6 mb-0">' + UI.esc(p.name) + '</h2>' + UI.audienceBadge(p.audience) + '</div>' +
          '<p class="text-muted small mb-2">' + (p.segments || []).length + ' segments · ' + totalMin(p) + ' min</p>' +
          (p.notes ? '<p class="small mb-0">' + UI.esc(p.notes) + '</p>' : '') +
        '</div>' +
        '<div class="card-footer bg-transparent d-flex gap-2">' +
          '<a href="#/lessonplans/' + p.id + '" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i> Edit</a>' +
          '<button class="btn btn-sm btn-outline-secondary dup-btn" data-id="' + p.id + '"><i class="bi bi-files"></i> Duplicate</button>' +
        '</div></div></div>').join('');

    const body = plans.length ? '<div class="row g-3">' + cards + '</div>'
      : '<div class="alert alert-info">No lesson plans for this filter.</div>';

    return {
      html: UI.pageHeader('Lesson Plans',
        '<a href="#/lessonplans/new" class="btn btn-primary"><i class="bi bi-plus-lg"></i> New plan</a>') +
        '<div class="mb-3">' + filterBtns + '</div>' + body,
      mount: function () {
        document.querySelectorAll('.dup-btn').forEach(b => b.onclick = function () {
          const c = Store.duplicateLessonPlan(parseInt(b.getAttribute('data-id'), 10));
          UI.toast('Duplicated'); UI.nav('/lessonplans/' + c.id);
        });
      }
    };
  };

  window.Screens.lessonPlanForm = function (params) {
    const id = params.id ? parseInt(params.id, 10) : null;
    const src = id ? Store.lessonPlan(id) : null;
    if (id && !src) return { html: '<div class="alert alert-warning">Lesson plan not found.</div>' };
    // Working copy of segments held in the closure.
    const segs = src ? JSON.parse(JSON.stringify(src.segments || [])) : [{ pos: 1, label: 'Warm-up', min: 10, notes: '' }];
    const base = src || { name: '', audience: 'all-levels', notes: '' };

    const audOpts = AUD.map(a => '<option value="' + a + '"' + (a === base.audience ? ' selected' : '') + '>' + a + '</option>').join('');

    const html = UI.pageHeader(id ? 'Edit lesson plan' : 'New lesson plan',
      '<a href="#/lessonplans" class="btn btn-outline-secondary">Cancel</a>') +
      '<form id="lpForm" class="card"><div class="card-body">' +
        '<div class="row g-3 mb-3">' +
          '<div class="col-md-6"><label class="form-label">Name</label><input id="lp_name" class="form-control" value="' + UI.esc(base.name) + '"></div>' +
          '<div class="col-md-3"><label class="form-label">Audience</label><select id="lp_aud" class="form-select text-capitalize">' + audOpts + '</select></div>' +
          '<div class="col-12"><label class="form-label">Overview / notes</label><textarea id="lp_notes" class="form-control" rows="2">' + UI.esc(base.notes || '') + '</textarea></div>' +
        '</div>' +
        '<h2 class="h6">Segments</h2>' +
        '<div id="segList" class="vstack gap-2 mb-2"></div>' +
        '<button type="button" class="btn btn-sm btn-outline-secondary" id="addSeg"><i class="bi bi-plus-lg"></i> Add segment</button>' +
        '<div class="text-muted small mt-2">Total: <span id="segTotal">0</span> min</div>' +
      '</div><div class="card-footer"><button class="btn btn-primary"><i class="bi bi-check-lg"></i> Save</button></div></form>';

    function segRow(s, i) {
      const labelOpts = LABELS.map(l => '<option' + (l === s.label ? ' selected' : '') + '>' + l + '</option>').join('');
      return '<div class="row g-2 align-items-center seg-row">' +
        '<div class="col-4 col-md-3"><select class="form-select form-select-sm seg-label">' + labelOpts + '</select></div>' +
        '<div class="col-3 col-md-2"><div class="input-group input-group-sm"><input type="number" class="form-control seg-min" value="' + (s.min || 0) + '"><span class="input-group-text">min</span></div></div>' +
        '<div class="col-4 col-md-6"><input class="form-control form-control-sm seg-notes" placeholder="Notes" value="' + UI.esc(s.notes || '') + '"></div>' +
        '<div class="col-1 text-end"><button type="button" class="btn btn-sm btn-outline-danger seg-del" data-i="' + i + '"><i class="bi bi-x"></i></button></div>' +
      '</div>';
    }

    return {
      html: html,
      mount: function () {
        const listEl = document.getElementById('segList');
        function gatherToWorking() {
          const rows = listEl.querySelectorAll('.seg-row');
          const out = [];
          rows.forEach((r, i) => out.push({
            pos: i + 1,
            label: r.querySelector('.seg-label').value,
            min: parseInt(r.querySelector('.seg-min').value, 10) || 0,
            notes: r.querySelector('.seg-notes').value
          }));
          return out;
        }
        function renderSegs() {
          listEl.innerHTML = segs.map(segRow).join('');
          updateTotal();
          listEl.querySelectorAll('.seg-del').forEach(b => b.onclick = function () {
            segs.splice(0, segs.length, ...gatherToWorking());
            segs.splice(parseInt(b.getAttribute('data-i'), 10), 1);
            renderSegs();
          });
          listEl.querySelectorAll('.seg-min').forEach(inp => inp.oninput = updateTotal);
        }
        function updateTotal() {
          let t = 0; listEl.querySelectorAll('.seg-min').forEach(i => t += parseInt(i.value, 10) || 0);
          document.getElementById('segTotal').textContent = t;
        }
        renderSegs();
        document.getElementById('addSeg').onclick = function () {
          segs.splice(0, segs.length, ...gatherToWorking());
          segs.push({ pos: segs.length + 1, label: 'Kihon', min: 10, notes: '' });
          renderSegs();
        };
        document.getElementById('lpForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const data = {
            name: document.getElementById('lp_name').value.trim() || 'Untitled plan',
            audience: document.getElementById('lp_aud').value,
            notes: document.getElementById('lp_notes').value.trim(),
            segments: gatherToWorking()
          };
          if (id) { Store.updateLessonPlan(id, data); } else { Store.addLessonPlan(data); }
          UI.toast('Lesson plan saved'); UI.nav('/lessonplans');
        });
      }
    };
  };
})();
