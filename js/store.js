/* ============================================================
   Store — in-memory state mirrored to localStorage.
   Seeded from window.DB; "Reset demo data" restores the seed.
   ============================================================ */
(function () {
  const STATE_KEY = 'nrkd.state';
  const AUTH_KEY = 'nrkd.auth';

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  let S;
  try {
    const saved = localStorage.getItem(STATE_KEY);
    S = saved ? JSON.parse(saved) : clone(window.DB);
  } catch (e) {
    S = clone(window.DB);
  }

  function save() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(S)); } catch (e) { /* ignore quota */ }
  }
  function nextId(arr) { return arr.reduce((m, x) => Math.max(m, x.id), 0) + 1; }

  const Store = {
    get state() { return S; },

    reset() {
      S = clone(window.DB);
      localStorage.removeItem(STATE_KEY);
      save();
    },

    // ---- Auth (any non-empty password works) ----
    isLoggedIn() { return localStorage.getItem(AUTH_KEY) === '1'; },
    login() { localStorage.setItem(AUTH_KEY, '1'); },
    logout() { localStorage.removeItem(AUTH_KEY); },

    // ---- Ranks ----
    ranks() { return S.ranks.slice().sort((a, b) => a.order - b.order); },
    rank(id) { return S.ranks.find(r => r.id === id) || null; },
    nextRank(rankId) {
      const r = this.rank(rankId);
      if (!r) return null;
      return S.ranks.filter(x => x.order === r.order + 1)[0] || null;
    },

    // ---- Members ----
    members(includeArchived) {
      return S.members
        .filter(m => includeArchived ? m.archived : !m.archived)
        .sort((a, b) => (a.family + a.given).localeCompare(b.family + b.given));
    },
    member(id) { return S.members.find(m => m.id === id) || null; },
    currentRank(member) { return member ? this.rank(member.rankId) : null; },
    fullName(m) { return (m.given + ' ' + m.family).trim(); },
    sortName(m) { return (m.family + ', ' + m.given).replace(/^,\s*/, ''); },
    addMember(data) {
      const m = Object.assign({ id: nextId(S.members), archived: false }, data);
      S.members.push(m); save(); return m;
    },
    updateMember(id, data) {
      const m = this.member(id); if (m) { Object.assign(m, data); save(); } return m;
    },
    setArchived(id, val) {
      const m = this.member(id); if (m) { m.archived = val; save(); } return m;
    },

    // ---- Promotions ----
    promotionsForMember(id) {
      return S.promotions.filter(p => p.memberId === id).sort((a, b) => b.date.localeCompare(a.date));
    },
    addPromotion(memberId, rankId, date) {
      const p = { id: nextId(S.promotions), memberId, rankId, date };
      S.promotions.push(p);
      const m = this.member(memberId);
      if (m) { m.rankId = rankId; m.promotedOn = date; }
      save(); return p;
    },

    // ---- Requirement progress ----
    progressFor(memberId) { return S.progress[memberId] || []; },
    isSignedOff(memberId, reqId) { return this.progressFor(memberId).indexOf(reqId) !== -1; },
    toggleRequirement(memberId, reqId) {
      const list = S.progress[memberId] || (S.progress[memberId] = []);
      const i = list.indexOf(reqId);
      if (i === -1) list.push(reqId); else list.splice(i, 1);
      save();
      return i === -1;
    },

    // ---- Class slots ----
    slots() { return S.slots.slice().sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start)); },
    slot(id) { return S.slots.find(s => s.id === id) || null; },
    addSlot(data) { const s = Object.assign({ id: nextId(S.slots) }, data); S.slots.push(s); save(); return s; },
    updateSlot(id, data) { const s = this.slot(id); if (s) { Object.assign(s, data); save(); } return s; },

    // ---- Lesson plans ----
    lessonPlans() { return S.lessonPlans.slice(); },
    lessonPlan(id) { return S.lessonPlans.find(l => l.id === id) || null; },
    addLessonPlan(data) {
      const l = Object.assign({ id: nextId(S.lessonPlans), segments: [] }, data);
      S.lessonPlans.push(l); save(); return l;
    },
    updateLessonPlan(id, data) { const l = this.lessonPlan(id); if (l) { Object.assign(l, data); save(); } return l; },
    duplicateLessonPlan(id) {
      const src = this.lessonPlan(id); if (!src) return null;
      const copy = clone(src); copy.id = nextId(S.lessonPlans); copy.name = src.name + ' (copy)';
      S.lessonPlans.push(copy); save(); return copy;
    },

    // ---- Session plans ----
    sessionPlans() { return S.sessionPlans.slice(); },
    sessionPlan(id) { return S.sessionPlans.find(p => p.id === id) || null; },
    addSessionPlan(data) { const p = Object.assign({ id: nextId(S.sessionPlans), active: false }, data); S.sessionPlans.push(p); save(); return p; },
    setActiveSession(id) { S.sessionPlans.forEach(p => p.active = (p.id === id)); save(); },
    assignmentKey(planId, dateISO, slotId) { return planId + '|' + dateISO + '|' + slotId; },
    getAssignment(planId, dateISO, slotId) { return S.sessionAssignments[this.assignmentKey(planId, dateISO, slotId)] || null; },
    setAssignment(planId, dateISO, slotId, lessonPlanId) {
      const k = this.assignmentKey(planId, dateISO, slotId);
      if (lessonPlanId) S.sessionAssignments[k] = lessonPlanId; else delete S.sessionAssignments[k];
      save();
    },

    // ---- Payments ----
    DUES_CENTS() { return S.DUES_CENTS; },
    payments() { return S.payments.slice(); },
    paymentsForMember(id) { return S.payments.filter(p => p.memberId === id).sort((a, b) => b.period.localeCompare(a.period)); },
    addPayment(data) { const p = Object.assign({ id: nextId(S.payments) }, data); S.payments.push(p); save(); return p; },
    isPaid(memberId, period) { return S.payments.some(p => p.memberId === memberId && p.period === period); },

    // ---- Attendance ----
    attKey(dateISO, slotId) { return dateISO + '|' + slotId; },
    attendees(dateISO, slotId) { return S.attendance[this.attKey(dateISO, slotId)] || []; },
    setAttendees(dateISO, slotId, memberIds) { S.attendance[this.attKey(dateISO, slotId)] = memberIds.slice(); save(); },
    attendanceCount(memberId) {
      let n = 0;
      Object.keys(S.attendance).forEach(k => { if (S.attendance[k].indexOf(memberId) !== -1) n++; });
      return n;
    },
    attendanceSince(memberId, sinceISO) {
      let n = 0;
      Object.keys(S.attendance).forEach(k => {
        const dateISO = k.split('|')[0];
        if (dateISO >= sinceISO && S.attendance[k].indexOf(memberId) !== -1) n++;
      });
      return n;
    },
    // Attendance credited toward the next grading: seeded baseline +
    // any live session ticks dated on/after the member's last promotion.
    attendanceCredit(memberId, sinceISO) {
      const base = (S.attendedSincePromotion && S.attendedSincePromotion[memberId]) || 0;
      return base + this.attendanceSince(memberId, sinceISO);
    },

    // ---- Courses ----
    courses() { return S.courses.slice(); },
    course(id) { return S.courses.find(c => c.id === id) || null; },
    addCourse(data) { const c = Object.assign({ id: nextId(S.courses) }, data); S.courses.push(c); save(); return c; },
    updateCourse(id, data) { const c = this.course(id); if (c) { Object.assign(c, data); save(); } return c; }
  };

  window.Store = Store;
})();
