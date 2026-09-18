// Generates a fictional Lighthouse Ministry Hub sample roster for class demos.
//
// All names, phones, emails, and addresses are invented. Nothing here comes from
// a real person or organization. Re-run this any time to refresh the dates:
//
//   node sample-data/generate-sample-data.mjs
//
// Output: sample-data/sample-roster-backup.json

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(HERE, "sample-roster-backup.json");

// ---- Deterministic randomness so regenerating keeps the same roster ----
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(20260918);
const randInt = (min, max) => min + Math.floor(random() * (max - min + 1));
const pick = (list) => list[Math.floor(random() * list.length)];
const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const NOW = new Date();
function iso(daysAgo, hour = 10, minute = 0) {
  const date = new Date(NOW);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}
function dateOnly(daysFromNow) {
  const date = new Date(NOW);
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

// ---- Reference data copied from the app defaults ----
const TASKS = [
  { id: "clean-closet", label: "Clean closet", points: 5 },
  { id: "organize-supplies", label: "Organize supplies", points: 5 },
  { id: "pass-out-fliers", label: "Pass out fliers", points: 10 },
  { id: "sort-donations", label: "Sort donations", points: 10 },
  { id: "clean-bathrooms", label: "Clean bathrooms/trashes", points: 15 },
];

const ITEMS = [
  { name: "Sandwich Crackers", cost: 1 },
  { name: "Granola Bars", cost: 1 },
  { name: "Trail Mix", cost: 1 },
  { name: "Pudding", cost: 1 },
  { name: "Apple Sauce", cost: 1 },
  { name: "Oatmeal", cost: 1 },
  { name: "Toothbrush", cost: 1 },
  { name: "Canned Goods", cost: 2 },
  { name: "Peanut Butter", cost: 2 },
  { name: "Jelly", cost: 2 },
  { name: "Candy Chicken", cost: 2 },
  { name: "Canned Tuna", cost: 2 },
  { name: "Socks", cost: 2 },
  { name: "Underwear", cost: 2 },
  { name: "Undergarments", cost: 2 },
  { name: "Belt", cost: 2 },
  { name: "Small Shampoo", cost: 2 },
  { name: "Smal Bodywash", cost: 2 },
  { name: "Small Conditioner", cost: 2 },
  { name: "Toothpaste", cost: 2 },
  { name: "Bar of Soap", cost: 2 },
  { name: "Shirts", cost: 3 },
  { name: "Pants", cost: 4 },
  { name: "Shoes", cost: 5 },
];

const STAFF = ["Ethan King", "Dana Whitfield", "Marcus Bell", "Priya Raman"];
const TAG_CYCLE = [
  "Temp Housing",
  "Shelter",
  "Homeless",
  "With Family",
  "Own Home",
  "Temp Housing",
  "Other",
];

// ---- Fictional member roster ----
const MEMBERS = [
  ["Andre", "Whitfield", 168],
  ["Naomi", "Sterling", 154],
  ["Caleb", "Ortiz", 141],
  ["Denise", "Hartley", 132],
  ["Elijah", "Barnes", 121],
  ["Farrah", "Nkemelu", 112],
  ["Gerald", "Simmons", 103],
  ["Hannah", "Pike", 96],
  ["Isaiah", "Coleman", 88],
  ["Jasmine", "Reyes", 82],
  ["Kevin", "Duval", 76],
  ["Lena", "Petrova", 70],
  ["Marcus", "Ellison", 64],
  ["Nadia", "Farouk", 58],
  ["Omar", "Haddad", 52],
  ["Paula", "Kensington", 47],
  ["Quentin", "Blake", 41],
  ["Rosa", "Villanueva", 36],
  ["Samuel", "Adeyemi", 30],
  ["Tanya", "Brooks", 26],
  ["Victor", "Nguyen", 22],
  ["Wanda", "Fitzgerald", 18],
  ["Xavier", "Landry", 13],
  ["Yolanda", "Pearson", 9],
  ["Zachary", "Mills", 6],
  ["Alina", "Castellanos", 3],
];

const HOMES = [
  "Maple Court Apartments, Unit 4",
  "Riverbend Shelter, bed 12",
  "Cornerstone Transitional Housing",
  "Staying with sister, Oak Hill",
  "Fairview Studios, Unit 7",
  "Harbor Light Shelter",
  "Independent living, Birch Street",
  "Lakeview Family Center",
];

const MEMBER_NOTES = [
  "Prefers morning appointments",
  "Needs gluten-free pantry items",
  "Working with a housing case manager",
  "Shirt size L, shoe size 10",
  "Interested in volunteer hours",
  "Requested help with resume",
  "Has a service animal",
  "Prefers text reminders",
  "Cold weather gear needed",
];

const FOLLOW_UP_NOTES = [
  "Missed two scheduled visits",
  "Asked about job placement help",
  "Needs follow-up on housing paperwork",
  "Requested prayer and a check-in call",
  "Referred to pantry, confirm receipt",
];

const people = [];
const visits = [];
const activity = [];
let personSeq = 0;
let recordSeq = 0;
const nextId = (prefix) => `sample-${prefix}-${String((recordSeq += 1)).padStart(4, "0")}`;

MEMBERS.forEach(([firstName, lastName, joinDaysAgo], index) => {
  personSeq += 1;
  const id = `sample-person-${String(personSeq).padStart(2, "0")}`;
  const phone = `55501${String(10000 + personSeq * 7).slice(-5)}`;
  const email = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z.]/g, "") + "@example.org";
  const residenceTag = TAG_CYCLE[index % TAG_CYCLE.length];
  // A few newer or quieter members have no visits yet so the inactive list shows work.
  const isQuiet = index % 7 === 6;
  const visitCount = isQuiet ? 0 : randInt(1, 7);
  const awardCount = isQuiet ? randInt(0, 1) : randInt(2, 9);
  const needsFollowUp = index % 6 === 4;

  const person = {
    id,
    firstName,
    lastName,
    points: 0,
    dateJoined: iso(joinDaysAgo, 9, 30).slice(0, 10),
    home: isQuiet ? "" : pick(HOMES),
    residenceTag,
    phone,
    email,
    emergencyContactName: `${pick(["Marta", "Dwight", "Sofia", "Reginald", "Ana"])} ${lastName}`,
    emergencyContactPhone: `55501${String(20000 + personSeq * 11).slice(-5)}`,
    emergencyContactAddress: `${randInt(10, 240)} Sample Street, Unit ${randInt(1, 24)}`,
    memberNotes: pick(MEMBER_NOTES),
    profilePhoto: "",
    followUpNeeded: needsFollowUp,
    followUpNote: needsFollowUp ? pick(FOLLOW_UP_NOTES) : "",
    staffTodos: [],
  };

  // Build a chronological timeline of this member's records.
  const oldestDay = Math.max(joinDaysAgo - 2, 2);
  const visitDays = [];
  for (let i = 0; i < visitCount; i += 1) {
    visitDays.push(randInt(1, oldestDay));
  }
  const awardDays = [];
  for (let i = 0; i < awardCount; i += 1) {
    awardDays.push(randInt(1, oldestDay));
  }
  // Guarantee recent activity for the weekly summary.
  if (index < 6 && !isQuiet) visitDays.push(randInt(1, 6));
  if (index === 1) awardDays.push(randInt(1, 5));

  const timeline = [
    ...visitDays.map((day) => ({ kind: "visit", day })),
    ...awardDays.map((day) => ({ kind: "award", day })),
  ].sort((a, b) => b.day - a.day);

  let balance = 0;
  activity.push({
    id: nextId("activity"),
    personId: id,
    type: "member",
    delta: 0,
    before: 0,
    after: 0,
    note: "Member added",
    actor: pick(STAFF),
    timestamp: iso(joinDaysAgo, 9, 30),
  });

  timeline.forEach((entry, position) => {
    const actor = pick(STAFF);
    if (entry.kind === "visit") {
      const timestamp = iso(entry.day, 10 + randInt(0, 6), pick([0, 15, 30, 45]));
      visits.push({ id: nextId("visit"), personId: id, actor, timestamp });
      activity.push({
        id: nextId("activity"),
        personId: id,
        type: "visit",
        delta: 0,
        before: balance,
        after: balance,
        note: "Visit logged",
        actor,
        timestamp,
      });
      return;
    }

    const task = pick(TASKS);
    balance += task.points;
    activity.push({
      id: nextId("activity"),
      personId: id,
      type: "task",
      delta: task.points,
      before: balance - task.points,
      after: balance,
      note: task.label,
      actor,
      timestamp: iso(entry.day, 11 + randInt(0, 5), pick([0, 20, 40])),
    });

    // Occasionally spend points, but only when the balance allows it.
    const shouldRedeem = position > 0 && balance >= 9 && random() < 0.35;
    if (shouldRedeem) {
      const picks = [];
      let spent = 0;
      const budget = Math.min(balance, randInt(4, 12));
      for (let i = 0; i < 4; i += 1) {
        const item = pick(ITEMS);
        if (spent + item.cost > budget) continue;
        const existing = picks.find((row) => row.item.name === item.name);
        if (existing) existing.quantity += 1;
        else picks.push({ item, quantity: 1 });
        spent += item.cost;
      }
      if (picks.length > 0) {
        const note = picks.map((row) => `${row.quantity} x ${row.item.name}`).join("; ");
        const before = balance;
        balance -= spent;
        activity.push({
          id: nextId("activity"),
          personId: id,
          type: "redeem",
          delta: -spent,
          before,
          after: balance,
          note,
          actor: pick(STAFF),
          timestamp: iso(Math.max(entry.day - 1, 1), 13, 30),
        });
      }
    }
  });

  // A couple of documented point removals so the corrections log has content.
  if (index === 3 || index === 11) {
    const before = balance;
    balance = Math.max(0, balance - 5);
    activity.push({
      id: nextId("activity"),
      personId: id,
      type: "remove",
      delta: -(before - balance),
      before,
      after: balance,
      note: "Duplicate award corrected by staff",
      actor: pick(STAFF),
      timestamp: iso(randInt(2, 20), 15, 10),
    });
  }

  person.points = balance;
  people.push(person);
});

activity.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
visits.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

// ---- Volunteers ----
const volunteerSeed = [
  ["Ruth Callahan", "Meals, greeting table", "Team lead", "Yes", 42],
  ["Devon Marsh", "Transportation", "Driver coordinator", "Yes", 31],
  ["Ivy Sanderson", "Clothing closet", "Coordinator", "Yes", 24],
  ["Terrence Boyd", "Facilities, setup", "", "Yes", 19],
  ["Miriam Osei", "Intake paperwork", "Assistant lead", "No", 12],
  ["Grant Holloway", "Donation sorting", "", "Yes", 9],
];
const volunteers = volunteerSeed.map(([name, areas, role, ministrySafe, serviceCount], i) => ({
  id: `sample-volunteer-${String(i + 1).padStart(2, "0")}`,
  name,
  areas,
  role,
  ministrySafe,
  serviceCount,
  phone: `55501${String(30000 + i * 13).slice(-5)}`,
  email: `${name.split(" ")[0].toLowerCase()}@example.org`,
  profilePhoto: "",
}));

// ---- Donors ----
const donorSeed = [
  ["Corner Bakery Collective", "Bread, pastries, and sandwich supplies"],
  ["Nora Feldspar", "Winter coats and blankets"],
  ["Harborline Grocers", "Canned goods and pantry staples"],
  ["The Peters Family", "Gift cards for emergency needs"],
  ["Brightwater Dental", "Hygiene kits and toothbrushes"],
];
const donors = donorSeed.map(([name, donation], i) => ({
  id: `sample-donor-${String(i + 1).padStart(2, "0")}`,
  name,
  phone: `55501${String(40000 + i * 17).slice(-5)}`,
  email: `contact${i + 1}@example.org`,
  donation,
}));

// ---- Community resources (fictional, location-neutral) ----
const resourceSeed = [
  [
    "Riverbend Emergency Shelter",
    "Housing & Emergency Assistance",
    "Overnight shelter, showers, laundry, and case management intake.",
    "100 Sample Avenue",
    "Housing & emergency assistance",
  ],
  [
    "Harborlight Food Pantry",
    "Food & Community Support",
    "Weekly food boxes, fresh produce, and infant formula when available.",
    "250 Sample Boulevard",
    "Food support",
  ],
  [
    "Cornerstone Housing Partners",
    "Housing",
    "Transitional housing applications, tenant support, and rental assistance referrals.",
    "18 Sample Court",
    "Housing support",
  ],
  [
    "Brightpath Community Clinic",
    "Health Services",
    "Walk-in clinic, prescriptions assistance, and behavioral health referrals.",
    "77 Sample Road",
    "Health services",
  ],
  [
    "New Day Workforce Center",
    "Employment",
    "Resume help, interview coaching, and job placement referrals.",
    "402 Sample Parkway",
    "Employment services",
  ],
  [
    "Open Door Legal Aid",
    "Legal",
    "Free consultations for benefits appeals, ID replacement, and housing issues.",
    "9 Sample Lane",
    "Legal aid",
  ],
];
const resources = resourceSeed.map(([name, category, services, address, dropoff], i) => ({
  id: `sample-resource-${String(i + 1).padStart(2, "0")}`,
  name,
  category,
  services,
  address,
  phone: `55501${String(50000 + i * 19).slice(-5)}`,
  email: `info${i + 1}@example.org`,
  website: `https://example.org/resources/${i + 1}`,
  dropoff: `Call ahead. ${dropoff} requests are posted weekly.`,
  photo: "",
}));

// ---- Events ----
const events = [
  {
    title: "Community Meal Night",
    date: dateOnly(2),
    description: "Shared meal, prayer cards, and volunteer sign-ups.",
    checklist: ["Set up tables", "Warm food", "Prayer cards", "Clean up"],
    done: [true, true, false, false],
  },
  {
    title: "Winter Coat Distribution",
    date: dateOnly(9),
    description: "Coat and blanket giveaway for members and neighbors.",
    checklist: ["Sort coats by size", "Set up racks", "Volunteer briefing"],
    done: [true, false, false],
  },
  {
    title: "Volunteer Training",
    date: dateOnly(16),
    description: "Ministry Safe refresher and intake procedure walkthrough.",
    checklist: ["Print handouts", "Room reservation", "Sign-in sheet"],
    done: [false, false, false],
  },
  {
    title: "Resource Fair",
    date: dateOnly(-6),
    description: "Partner organizations shared services with members.",
    checklist: ["Confirm partners", "Print resource list", "Snacks"],
    done: [true, true, true],
  },
].map((event, i) => ({
  id: `sample-event-${String(i + 1).padStart(2, "0")}`,
  title: event.title,
  date: event.date,
  description: event.description,
  checklist: event.checklist.map((title, index) => ({
    id: `sample-checklist-${i + 1}-${index + 1}`,
    title,
    done: Boolean(event.done[index]),
  })),
}));

// ---- Staff to-do list ----
const staffTodosGlobal = [
  "Call members with no visit in 30 days",
  "Restock hygiene kits",
  "Follow up on coat distribution volunteers",
  "Print weekly summary for staff meeting",
  "Update resource list with new pantry hours",
  "Review safety backup before demo",
].map((title, i) => ({
  id: `sample-todo-${String(i + 1).padStart(2, "0")}`,
  title,
  done: i > 3,
  ownerId: null,
  actor: STAFF[0],
}));

// ---- Documents (small text files stored as data URLs) ----
const documents = [
  {
    title: "Sample Intake Checklist",
    category: "Intake",
    fileName: "sample-intake-checklist.txt",
    body: "Sample intake checklist\n\n1. Collect name and contact preferences\n2. Review housing and follow-up notes\n3. Explain the point and item program\n4. Log the visit in Lighthouse Ministry Hub\n",
  },
  {
    title: "Volunteer Shift Notes",
    category: "Volunteers",
    fileName: "sample-volunteer-notes.txt",
    body: "Sample volunteer shift notes\n\n- Greeting table covered 9:00-11:00\n- Two new volunteers shadowed intake\n- Restock request submitted for socks and soap\n",
  },
].map((doc, i) => ({
  id: `sample-document-${String(i + 1).padStart(2, "0")}`,
  title: doc.title,
  category: doc.category,
  fileName: doc.fileName,
  mimeType: "text/plain",
  dataUrl: `data:text/plain;base64,${Buffer.from(doc.body, "utf8").toString("base64")}`,
  uploadedAt: iso(randInt(3, 40), 14, 5),
}));

// ---- Admin activity log (includes denied attempts) ----
const adminLogSeed = [
  ["Settings Updated", "Updated dashboard organization settings", "Success", 40],
  ["Member Added", `Added ${MEMBERS[0][0]} ${MEMBERS[0][1]}`, "Success", 39],
  ["Backup Exported", "Exported full backup JSON", "Success", 30],
  ["Task Added", "Added task Organize supplies (5 pts)", "Success", 24],
  ["Item Updated", "Changed point cost for Socks to 2 pts", "Success", 19],
  ["Staff Sign-In Denied", "Failed sign-in attempt for unknown staff account", "Denied", 12],
  ["Restore Data Backup", "Restore attempt rejected by staff confirmation", "Denied", 8],
  ["Document Uploaded", "Uploaded document sample-volunteer-notes.txt", "Success", 6],
  ["Volunteer Added", "Added volunteer Grant Holloway", "Success", 4],
  ["Safety Backup Created", "Automatic safety backup before item cost change", "Success", 3],
  ["Points Removed", "Removed 5 points for duplicate award correction", "Success", 2],
  ["Weekly Report Printed", "Printed weekly ministry snapshot", "Success", 1],
];
const adminLog = adminLogSeed.map(([type, detail, status, daysAgo], i) => ({
  id: `sample-adminlog-${String(i + 1).padStart(2, "0")}`,
  type,
  detail,
  actor: pick(STAFF),
  status,
  timestamp: iso(daysAgo, 16, i * 3),
}));

// ---- Assemble the backup payload ----
const state = {
  people,
  customItems: [
    { name: "Winter Gloves", cost: 2, group: "Clothes" },
    { name: "Reusable Water Bottle", cost: 3, group: "Hygiene items" },
    { name: "Instant Soup Cup", cost: 1, group: "Food Items" },
  ],
  customTasks: [
    { id: "custom-sample-1", label: "Sort clothing donations", points: 10 },
    { id: "custom-sample-2", label: "Help with meal setup", points: 10 },
    { id: "custom-sample-3", label: "Write encouragement cards", points: 5 },
  ],
  hiddenTasks: [],
  hiddenItems: [],
  settings: {
    organizationName: "Community Outreach Program",
    hubName: "Lighthouse Ministry Hub",
    subtitle:
      "A calm, organized command center for member care, resources, events, volunteers, and ministry activity.",
  },
  adminLog,
  activity,
  visits,
  volunteers,
  donors,
  documents,
  events,
  resources,
  staffTodosGlobal,
  staffUsers: [],
  lastSafetyBackupAt: iso(1, 8, 45),
};

const payload = {
  exportedAt: NOW.toISOString(),
  reason: "Class demonstration sample roster (all records are fictional)",
  state,
};

mkdirSync(HERE, { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const visitCount = visits.length;
const redeemCount = activity.filter((entry) => entry.type === "redeem").length;
console.log(`Wrote ${OUTPUT}`);
console.log(
  `  ${people.length} members, ${visitCount} visits, ${activity.length} activity entries, ${redeemCount} redemptions`
);
console.log(
  `  ${volunteers.length} volunteers, ${donors.length} donors, ${documents.length} documents, ${events.length} events, ${resources.length} resources`
);
console.log(`  People with follow-up flagged: ${people.filter((p) => p.followUpNeeded).length}`);
