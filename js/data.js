/* ============================================================
   SEED DATA — immutable starting point for the prototype.
   Store deep-clones this on first load; "Reset demo data"
   restores it. Curriculum content transcribed from the
   Northern Rockies Karate-do EXAMINATION REQUIREMENTS sheet.
   ============================================================ */
(function () {
  // Helper: build requirement objects with stable ids for a rank.
  function reqs(key, items) {
    return items.map(function (label, i) {
      return { id: key + '-r' + (i + 1), label: label };
    });
  }

  // ---- Ranks (ordered ladder, white -> black) ----
  // Each rank's requirements are the syllabus to grade OUT of that rank
  // (i.e. the PDF column "<this rank> - <next rank>").
  const ranks = [
    {
      id: 1, order: 1, name: 'White', colorDisplay: 'White', category: 'kyu',
      juniorStripes: 4, minTimeInRankMonths: 2, minAttendanceCount: 12,
      requirements: reqs('white', [
        'Kihon Dosa Ichi (Basic Movements 1)',
        'Kihon Dosa Ni (Basic Movements 2)',
        'Sei Ken No Migi / Hidari (punches to the right and left)',
        'Zenshin Kotai (move forward and backward)',
        'Empi No Kata (Elbow Strike Form)',
        '4 Geri — Mae, Yoko, Mawashi (full pivot kicking top of instep) and Ushiro',
        'Kumite: Kizami Zuki, Gyaku Zuki, Kizami / Gyaku combination',
        'Ability to tie belt'
      ])
    },
    {
      id: 2, order: 2, name: 'White / Black Stripe', colorDisplay: 'White·Black', category: 'kyu',
      juniorStripes: 2, minTimeInRankMonths: 3, minAttendanceCount: 16,
      requirements: reqs('wbstripe', [
        'Kihon Kata Ichi (Basic Kata 1)',
        'Kihon Wari',
        'Shi Ho Kata',
        'Ni Ju Shichi Te Waza (27 Hand Techniques)',
        'Ukemi: Yoko, Ushiro, and Zenpo Kaiten',
        'Te Hodoki 1–3',
        'Kumite: Chase Punch, Mawashi Geri, Ura Mawashi Geri, Throw from Chase Punch'
      ])
    },
    {
      id: 3, order: 3, name: 'Yellow', colorDisplay: 'Yellow', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 3, minAttendanceCount: 20,
      requirements: reqs('yellow', [
        'Kihon Dosa San (Basic Movements 3)',
        'Kihon Kata Ni (Basic Kata 2)',
        'Shi Ho Hai (to pay tribute to the four directions)',
        'Ni Sei Shi Dai (24 greater)',
        'Ni Sei Shi Bunkai 1–6',
        'Ukemi: Zenpo kaiten with straight leg, mae ukemi',
        'Tai Sabaki as a kata',
        'Bo Kihon Ichi',
        'Jiyu Kumite: Sen, Go No Sen, and Sen No Sen'
      ])
    },
    {
      id: 4, order: 4, name: 'Orange', colorDisplay: 'Orange', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 4, minAttendanceCount: 24,
      requirements: reqs('orange', [
        'Kihon Dosa Yon (Basic Form 4)',
        'Kihon Kata San (Basic Kata 3)',
        'Taisabaki — with a partner as a Bunkai',
        'Rohai Sho',
        'Ni Sei Shi Bunkai 7–11',
        'Ukemi: Koho Kaiten, Zenpo Kaiten under a belt',
        'Shi Ho Hai Kata with Bo',
        'Jiyu Kumite: Uraken, front and rear leg sweeps'
      ])
    },
    {
      id: 5, order: 5, name: 'Green', colorDisplay: 'Green', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 6, minAttendanceCount: 30,
      requirements: reqs('green', [
        'Seisan',
        'Sequence of Bassai',
        'Ni Sei Shi Bunkai 1–11',
        'Tehodoki No Waza 1–7',
        'Bi Kihon Ni',
        'Ukemi: Kaiten Guruma, Mae Ukemi Ni',
        'Jiyu Kumite: Hard and Soft Checking, use of different distances',
        'Kata Bunkai: 2 motions from Seisan and Rohai Sho'
      ])
    },
    {
      id: 6, order: 6, name: 'Green / Black Stripe', colorDisplay: 'Green·Black', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 6, minAttendanceCount: 36,
      requirements: reqs('gbstripe', [
        'Bassai',
        'Rohai Dai',
        'Ni Sei Shi Bunkai Left Side',
        'Juni Ho',
        'Jiyu Kumite: Attack Offline, Cornering Opponent, Escape being Cornered',
        'Kata Bunkai: 2 motions from Bassai and new part of Rohai Dai'
      ])
    },
    {
      id: 7, order: 7, name: 'Blue', colorDisplay: 'Blue', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 9, minAttendanceCount: 45,
      requirements: reqs('blue', [
        'Sakagawa No Kon / Shushi No Sho',
        'Hen Shu Ho 1–5',
        'Kihon Dosa San / Yon Speed Kata',
        'Ukemi: Zenpo slow dive, Zenpo through two belts, Zenpo on floor',
        'Sequence of Sanshiryu',
        'Sequence of Annan',
        'Jiyu Kumite: Attacking opponent who is cutting; attack, retract, immediately attack',
        'Kata Bunkai: 2 motions from Bassai'
      ])
    },
    {
      id: 8, order: 8, name: 'Brown', colorDisplay: 'Brown', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 12, minAttendanceCount: 60,
      requirements: reqs('brown', [
        'Sanshiryu',
        'Chinto',
        'Sakagawa No Kon',
        'Hen Shu Ho 5–10',
        'Kumi Bo',
        'Jiyu Kumite: score on break or throw, adjusting distance, fake kicks',
        'Kata Bunkai: 2 motions from Chinto and Sanshiryu',
        'Teach an Intermediate Level Class',
        'In-class written exam'
      ])
    },
    {
      id: 9, order: 9, name: 'Brown / Black Stripe', colorDisplay: 'Brown·Black', category: 'kyu',
      juniorStripes: 0, minTimeInRankMonths: 12, minAttendanceCount: 70,
      requirements: reqs('bbstripe', [
        'Review of all previous kata and bunkai',
        'Refine teaching of an Intermediate Level Class',
        'Demonstrate terminology from Harpe Sensei’s booklet'
      ])
    },
    {
      id: 10, order: 10, name: 'Black (Shodan)', colorDisplay: 'Black', category: 'dan',
      juniorStripes: 0, minTimeInRankMonths: 0, minAttendanceCount: 0,
      requirements: reqs('black', [
        'Any or all of previous as per Soke or Taneda Sensei’s request'
      ])
    }
  ];

  // ---- Members ----
  const members = [
    { id: 1, given: 'David',   family: 'Harpe',     dob: '1972-04-02', phone: '403-555-0101', email: 'david.harpe@example.com', address: '12 Dojo Rd, Cranbrook', emergency: 'Karen Harpe · 403-555-0190', join: '2008-09-01', junior: false, sensei: true,  rankId: 10, promotedOn: '2015-06-20', duesPlan: 'single', medical: '' },
    { id: 2, given: 'Sarah',   family: 'Chen',      dob: '1995-11-15', phone: '403-555-0102', email: 'sarah.chen@example.com',  address: '88 Maple Ave, Cranbrook', emergency: 'Wei Chen · 403-555-0192', join: '2019-02-10', junior: false, sensei: false, rankId: 8,  promotedOn: '2024-11-01', duesPlan: 'single', medical: '' },
    { id: 3, given: 'Michael', family: 'Thompson',  dob: '1988-06-30', phone: '403-555-0103', email: 'mike.t@example.com',      address: '5 Pine St, Kimberley',   emergency: 'Lisa Thompson · 403-555-0193', join: '2020-01-20', junior: false, sensei: false, rankId: 7,  promotedOn: '2025-09-15', duesPlan: 'single', medical: 'Mild asthma — inhaler in bag.' },
    { id: 4, given: 'Emily',   family: 'Rodriguez', dob: '2001-03-12', phone: '403-555-0104', email: 'emily.r@example.com',     address: '210 Oak Cres, Cranbrook',emergency: 'Maria Rodriguez · 403-555-0194', join: '2021-05-05', junior: false, sensei: false, rankId: 5,  promotedOn: '2025-01-12', duesPlan: 'single', medical: '' },
    { id: 5, given: 'James',   family: 'Wilson',    dob: '1999-08-22', phone: '403-555-0105', email: 'jwilson@example.com',     address: '17 Birch Way, Cranbrook',emergency: 'Tom Wilson · 403-555-0195', join: '2022-09-12', junior: false, sensei: false, rankId: 4,  promotedOn: '2026-03-01', duesPlan: 'single', medical: '' },
    { id: 6, given: 'Olivia',  family: 'Martin',    dob: '2014-07-09', phone: '',            email: '',                        address: '44 Cedar Dr, Cranbrook', emergency: '', join: '2023-09-08', junior: true,  sensei: false, rankId: 3,  promotedOn: '2025-11-20', duesPlan: 'family_two', medical: '', guardianName: 'Rachel Martin', guardianPhone: '403-555-0196', guardianEmail: 'rachel.martin@example.com' },
    { id: 7, given: 'Liam',    family: 'Nguyen',    dob: '2015-12-01', phone: '',            email: '',                        address: '9 Spruce Pl, Cranbrook', emergency: '', join: '2024-01-15', junior: true,  sensei: false, rankId: 2,  promotedOn: '2026-02-10', duesPlan: 'single', medical: 'Peanut allergy.', guardianName: 'Henry Nguyen', guardianPhone: '403-555-0197', guardianEmail: 'h.nguyen@example.com' },
    { id: 8, given: 'Ava',     family: 'Patel',     dob: '2016-05-18', phone: '',            email: '',                        address: '44 Cedar Dr, Cranbrook', emergency: '', join: '2025-09-10', junior: true,  sensei: false, rankId: 1,  promotedOn: '2025-09-10', duesPlan: 'family_additional', medical: '', guardianName: 'Priya Patel', guardianPhone: '403-555-0198', guardianEmail: 'priya.patel@example.com' },
    { id: 9, given: 'Noah',    family: 'Kim',       dob: '1992-02-28', phone: '403-555-0109', email: 'noah.kim@example.com',    address: '300 Elm St, Kimberley',  emergency: 'Grace Kim · 403-555-0199', join: '2021-03-22', junior: false, sensei: false, rankId: 6,  promotedOn: '2025-10-05', duesPlan: 'single', medical: '' },
    { id: 10, given: 'Sophia', family: 'Brown',     dob: '1990-10-10', phone: '403-555-0110', email: 'sophia.brown@example.com',address: '76 Willow Rd, Cranbrook',emergency: 'Mark Brown · 403-555-0200', join: '2025-10-01', junior: false, sensei: false, rankId: 1,  promotedOn: '2025-10-01', duesPlan: 'single', medical: '' }
  ];

  // ---- Promotion history (memberId, rankId, date) ----
  const promotions = [
    { id: 1, memberId: 2, rankId: 8, date: '2024-11-01' },
    { id: 2, memberId: 2, rankId: 7, date: '2023-10-14' },
    { id: 3, memberId: 3, rankId: 7, date: '2025-09-15' },
    { id: 4, memberId: 4, rankId: 5, date: '2025-01-12' },
    { id: 5, memberId: 9, rankId: 6, date: '2025-10-05' },
    { id: 6, memberId: 6, rankId: 3, date: '2025-11-20' },
    { id: 7, memberId: 5, rankId: 4, date: '2026-03-01' }
  ];

  // ---- Requirement progress: which requirement ids each member has signed off.
  //      Keyed by memberId -> array of requirement ids.
  //      Sarah (Brown) is nearly done -> eligible; others partial.
  const progress = {
    2: ['brown-r1','brown-r2','brown-r3','brown-r4','brown-r5','brown-r6','brown-r7','brown-r8','brown-r9'], // all Brown done
    3: ['blue-r1','blue-r2','blue-r3','blue-r4'],                                                            // Blue partial
    4: ['green-r1','green-r2','green-r3','green-r4','green-r5'],                                              // Green partial
    9: ['gbstripe-r1','gbstripe-r2','gbstripe-r3','gbstripe-r4','gbstripe-r5','gbstripe-r6'],                // all G/B done
    6: ['yellow-r1','yellow-r2','yellow-r3']                                                                 // Yellow partial
  };

  // ---- Class slots (weekly). weekday: 0=Sun .. 6=Sat ----
  const slots = [
    { id: 1, name: 'Little Dragons',      weekday: 1, start: '17:00', end: '17:45', audience: 'kids' },
    { id: 2, name: 'Juniors',             weekday: 3, start: '17:00', end: '18:00', audience: 'kids' },
    { id: 3, name: 'Adults',              weekday: 1, start: '18:00', end: '19:30', audience: 'adults' },
    { id: 4, name: 'Adults',              weekday: 3, start: '18:00', end: '19:30', audience: 'adults' },
    { id: 5, name: 'Black Belt / Advanced', weekday: 6, start: '10:00', end: '11:30', audience: 'black-belt' }
  ];

  // ---- Lesson plans (template library) ----
  const lessonPlans = [
    { id: 1, name: 'Kids — Kihon & Games', audience: 'kids', notes: 'High energy; keep transitions short.', segments: [
      { pos: 1, label: 'Warm-up', min: 10, notes: 'Tag game + stretching' },
      { pos: 2, label: 'Kihon',   min: 15, notes: 'Kihon Dosa Ichi, focus on stance' },
      { pos: 3, label: 'Kata',    min: 10, notes: 'Empi No Kata walkthrough' },
      { pos: 4, label: 'Free',    min: 5,  notes: 'Belt-tying practice' },
      { pos: 5, label: 'Cool-down', min: 5, notes: 'Bow out, Showa' }
    ]},
    { id: 2, name: 'Adults — Kata Focus (Seisan)', audience: 'adults', notes: 'Detail work on Seisan; pair bunkai.', segments: [
      { pos: 1, label: 'Warm-up',     min: 10, notes: 'Joint mobility' },
      { pos: 2, label: 'Kihon',       min: 15, notes: 'Ni Sei Shi Dai lines' },
      { pos: 3, label: 'Kata',        min: 25, notes: 'Seisan — section by section' },
      { pos: 4, label: 'Kumite',      min: 15, notes: 'Hard/soft checking drills' },
      { pos: 5, label: 'Conditioning', min: 10, notes: 'Core + grip' }
    ]},
    { id: 3, name: 'All Levels — Kumite Drills', audience: 'all-levels', notes: 'Mixed ranks; scale intensity.', segments: [
      { pos: 1, label: 'Warm-up', min: 10, notes: 'Footwork ladder' },
      { pos: 2, label: 'Kumite',  min: 30, notes: 'Sen / Go No Sen / Sen No Sen rotations' },
      { pos: 3, label: 'Cool-down', min: 10, notes: 'Partner stretches' }
    ]},
    { id: 4, name: 'Black Belt — Bunkai Deep Dive', audience: 'black-belt', notes: 'Application detail; record video.', segments: [
      { pos: 1, label: 'Warm-up', min: 10, notes: 'Self-led' },
      { pos: 2, label: 'Kata',    min: 20, notes: 'Bassai + Rohai Dai' },
      { pos: 3, label: 'Kumite',  min: 30, notes: 'Cornering / escaping drills' },
      { pos: 4, label: 'Free',    min: 20, notes: 'Open bunkai exploration' }
    ]}
  ];

  // ---- Session plan (date range; the table-view assembly) ----
  const sessionPlans = [
    { id: 1, name: 'Spring Term 2026', start: '2026-05-04', end: '2026-07-25', active: true },
    { id: 2, name: 'Winter Term 2026', start: '2026-01-06', end: '2026-03-28', active: false }
  ];
  // Assignments keyed "<planId>|<dateISO>|<slotId>" -> lessonPlanId
  const sessionAssignments = {
    '1|2026-05-04|1': 1, '1|2026-05-04|3': 2,
    '1|2026-05-06|2': 1, '1|2026-05-06|4': 3,
    '1|2026-05-09|5': 4,
    '1|2026-05-11|1': 1, '1|2026-05-11|3': 2
  };

  // ---- Payments (cents). period like "2026-05" ----
  const DUES = 6000; // $60.00 / month
  const payments = [
    { id: 1, memberId: 2, amount: 6000, period: '2026-04', method: 'bank', date: '2026-04-02' },
    { id: 2, memberId: 2, amount: 6000, period: '2026-05', method: 'bank', date: '2026-05-01' },
    { id: 3, memberId: 3, amount: 6000, period: '2026-04', method: 'cash', date: '2026-04-05' },
    { id: 4, memberId: 4, amount: 6000, period: '2026-05', method: 'cash', date: '2026-05-03' },
    { id: 5, memberId: 9, amount: 6000, period: '2026-04', method: 'bank', date: '2026-04-01' },
    { id: 6, memberId: 9, amount: 6000, period: '2026-05', method: 'bank', date: '2026-05-02' },
    { id: 7, memberId: 6, amount: 4500, period: '2026-05', method: 'cash', date: '2026-05-04' },
    // A couple already paid the current month so the dashboard shows a mix.
    { id: 8, memberId: 2, amount: 6000, period: '2026-06', method: 'bank', date: '2026-06-01' },
    { id: 9, memberId: 9, amount: 6000, period: '2026-06', method: 'bank', date: '2026-06-02' }
    // Other members left unpaid for the current month on purpose.
  ];

  // ---- Attendance: keyed "<dateISO>|<slotId>" -> array of memberIds ----
  const attendance = {
    '2026-06-01|3': [2, 3, 4, 9],
    '2026-06-01|1': [6, 7, 8],
    '2026-06-03|4': [2, 4, 5, 10],
    '2026-06-06|5': [1, 2, 9]
  };

  // ---- Attendance-since-last-promotion baseline (memberId -> count).
  //      Used by the grading eligibility metric so thresholds are
  //      meaningful without seeding hundreds of session records.
  //      Live attendance ticks add to this baseline. ----
  const attendedSincePromotion = {
    1: 95, 2: 64, 3: 8, 4: 22, 5: 6, 6: 14, 7: 9, 8: 5, 9: 41, 10: 4
  };

  // ---- Courses (curriculum mini-programs) ----
  const courses = [
    { id: 1, name: 'Beginner Foundations', weeks: 8, audience: 'all-levels', notes: 'Stances, etiquette, Kihon Dosa Ichi/Ni, belt tying.' },
    { id: 2, name: 'Kata Pathway: White → Green', weeks: 12, audience: 'kids', notes: 'Empi No Kata through Rohai Sho.' },
    { id: 3, name: 'Kumite Fundamentals', weeks: 6, audience: 'adults', notes: 'Distance, timing, Sen / Go No Sen / Sen No Sen.' }
  ];

  window.DB = {
    DUES_CENTS: DUES,
    ranks, members, promotions, progress, slots,
    lessonPlans, sessionPlans, sessionAssignments,
    payments, attendance, attendedSincePromotion, courses
  };
})();
