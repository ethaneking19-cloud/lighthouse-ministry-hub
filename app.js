// ---- Storage keys / image sizing ----
const STORAGE_KEY = "ministryPointsStateV1";
const STAFF_MODE_KEY = "ministryStaffModeV1";
const STAFF_USER_KEY = "ministryStaffUserV1";
const SAFETY_BACKUP_KEY = "ministrySafetyBackupsV1";
const MAX_SAFETY_BACKUPS = 3;
const MAX_ACTIVITY_LOG_ENTRIES = 1000;
const MAX_ADMIN_LOG_ENTRIES = 1000;
const MAX_PROFILE_PHOTO_BYTES = 3 * 1024 * 1024;
const TARGET_PROFILE_PHOTO_BYTES = 600 * 1024;
const PROFILE_PHOTO_MAX_DIMENSION = 512;
const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;
const SUPPORTED_DOCUMENT_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp,.txt,.md,.json,.xml,.csv,.tsv,.xlsx,.xls,.docx";
const DEFAULT_RESIDENCE_TAGS = [
  "Homeless",
  "Studio 45",
  "Temp Housing",
  "Shelter",
  "With Family",
  "Own Home",
  "Other",
];
const DEFAULT_SETTINGS = {
  organizationName: "Englewood Baptist Church",
  hubName: "Lighthouse Ministry Hub",
  subtitle:
    "A calm, organized command center for member care, resources, events, volunteers, and ministry activity.",
};

// ---- Default tasks & items ----
const TASKS = [
  { id: "clean-closet", label: "Clean closet", points: 5 },
  { id: "organize-supplies", label: "Organize supplies", points: 5 },
  { id: "pass-out-fliers", label: "Pass out fliers", points: 10 },
  { id: "sort-donations", label: "Sort donations", points: 10 },
  { id: "clean-bathrooms", label: "Clean bathrooms/trashes", points: 15 },
];

const ITEM_GROUPS = [
  {
    label: "Food Items",
    items: [
      "Sandwich Crackers",
      "Granola Bars",
      "Trail Mix",
      "Pudding",
      "Apple Sauce",
      "Oatmeal",
      "Canned Goods",
      "Peanut Butter",
      "Jelly",
      "Candy Chicken",
      "Canned Tuna",
    ],
  },
  {
    label: "Clothes",
    items: [
      "Socks",
      "Underwear",
      "Undergarments",
      "Belt",
      "Shirts",
      "Pants",
      "Shoes",
    ],
  },
  {
    label: "Hygiene items",
    items: [
      "Toothbrush",
      "Small Shampoo",
      "Smal Bodywash",
      "Small Conditioner",
      "Toothpaste",
      "Bar of Soap",
    ],
  },
];

const defaultItems = [
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

const DEFAULT_RESOURCES = [
  {
    id: "resource-arm",
    name: "Area Relief Ministries",
    category: "Housing & Emergency Assistance",
    services:
      "Homeless and housing services, emergency assistance, transitional support, and employment-focused help.",
    address: "108 South Church Street, Jackson, TN 38301",
    phone: "7314239257",
    email: "",
    website: "https://www.areareliefministries.org/",
    dropoff:
      "Call ahead or use the website to ask about donations, partner support, and available assistance.",
    photo: "",
  },
  {
    id: "resource-rifa",
    name: "RIFA",
    category: "Food & Community Support",
    services:
      "Food assistance, community support, outreach help, and local volunteer/donation opportunities.",
    address: "133 Airways Boulevard, Jackson, TN 38301",
    phone: "",
    email: "",
    website: "https://rifajackson.org/",
    dropoff:
      "Use the website for donation and volunteer information, including current drop-off needs.",
    photo: "",
  },
  {
    id: "resource-jha",
    name: "Jackson Housing Authority",
    category: "Housing",
    services:
      "Public housing support, housing information, and local housing-related assistance.",
    address: "",
    phone: "",
    email: "",
    website: "https://www.jacksonha.com/",
    dropoff: "Housing-focused resource. Check website or call for appointments and intake information.",
    photo: "",
  },
  {
    id: "resource-dream-center",
    name: "Dream Center Jackson",
    category: "Ministry & Outreach",
    services:
      "Community outreach, service programs, local support ministries, and volunteer-driven help.",
    address: "",
    phone: "",
    email: "",
    website: "https://dreamcenterjackson.com/contact-us/",
    dropoff: "Use contact page for outreach details, volunteer needs, and current ministry opportunities.",
    photo: "",
  },
  {
    id: "resource-salvation-army",
    name: "The Salvation Army - Jackson",
    category: "Emergency Assistance",
    services:
      "Emergency help and community support listed through the city housing resource guide and Salvation Army contacts.",
    address: "",
    phone: "",
    email: "",
    website: "https://www.jacksontn.gov/UserFiles/Servers/Server_16361603/File/Residents/Love%20Your%20Block/Housing_Resource_Guide_Updated.pdf",
    dropoff: "Use the housing resource guide for updated local contact and service details.",
    photo: "",
  },
  {
    id: "resource-st-brigid",
    name: "St. Brigid Food Pantry",
    category: "Food Pantry",
    services:
      "Food pantry support for individuals and families in need.",
    address: "",
    phone: "",
    email: "",
    website: "https://www.orthodoxjackson.com/Food-Pantry",
    dropoff: "See pantry page for current food needs and pantry support information.",
    photo: "",
  },
];

// ---- State bootstrap ----
const state = loadState();
if (!state.customItems) state.customItems = [];
if (!state.customTasks) state.customTasks = [];
if (!state.hiddenTasks) state.hiddenTasks = [];
if (!state.hiddenItems) state.hiddenItems = [];
if (!state.adminLog) state.adminLog = [];
if (!state.visits) state.visits = [];
if (!state.volunteers) state.volunteers = [];
if (!state.events) state.events = [];
if (!state.staffTodosGlobal) state.staffTodosGlobal = [];
if (!state.staffUsers) state.staffUsers = [];
if (!state.donors) state.donors = [];
if (!state.documents) state.documents = [];
if (!state.resources) state.resources = DEFAULT_RESOURCES.map((entry) => ({ ...entry }));
if (!state.lastSafetyBackupAt) state.lastSafetyBackupAt = "";
state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
ensureStarterStaffAccount();
let didLegacyTodoMigration = false;
state.people = (state.people || []).map((person) => ({
  ...person,
  home: person.home || person.address || "",
  residenceTag: person.residenceTag || "Homeless",
  email: person.email || "",
  followUpNeeded: Boolean(person.followUpNeeded),
  followUpNote: person.followUpNote || "",
  staffTodos: Array.isArray(person.staffTodos)
    ? person.staffTodos.map((todo) => ({
        ...todo,
        ownerId: todo.ownerId || null,
      }))
    : [],
}));
state.people.forEach((person) => {
  if (!Array.isArray(person.staffTodos) || person.staffTodos.length === 0) return;
  person.staffTodos.forEach((todo) => {
    state.staffTodosGlobal.push({
      id: todo.id || crypto.randomUUID(),
      title: `${person.firstName} ${person.lastName}: ${todo.title}`,
      done: Boolean(todo.done),
      ownerId: todo.ownerId || null,
    });
  });
  person.staffTodos = [];
  didLegacyTodoMigration = true;
});
state.volunteers = (state.volunteers || []).map((volunteer) => ({
  ...volunteer,
  profilePhoto: volunteer.profilePhoto || "",
}));
state.donors = (state.donors || []).map((donor) => ({
  ...donor,
  email: donor.email || "",
  phone: donor.phone || "",
  donation: donor.donation || "",
}));
state.documents = (state.documents || []).map((documentItem) => ({
  ...documentItem,
  category: documentItem.category || "",
}));
state.events = (state.events || []).map((eventItem) => ({
  ...eventItem,
  description: eventItem.description || "",
}));
state.resources = (state.resources || DEFAULT_RESOURCES).map((resource) => ({
  ...resource,
  email: resource.email || "",
  phone: resource.phone || "",
  website: resource.website || "",
  photo: resource.photo || "",
}));
state.activity = (state.activity || []).map((entry) => ({
  ...entry,
  actor: entry.actor || "Unknown Staff",
}));
state.visits = (state.visits || []).map((entry) => ({
  ...entry,
  actor: entry.actor || "Unknown Staff",
}));
state.adminLog = (state.adminLog || []).map((entry) => ({
  ...entry,
  actor: entry.actor || "Unknown Staff",
}));

let staffMode = sessionStorage.getItem(STAFF_MODE_KEY) === "true";
let dailyRefreshTimer = null;
let dailyRefreshInterval = null;
let reopenProfileId = null;
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let editingTaskId = null;
let editingStaffTodoId = null;
let editingVolunteerId = null;
let editingDonorId = null;
let editingResourceId = null;
let pageGuideFrame = null;
let pendingSensitiveAction = null;
let logSearchTerm = "";
let logTypeFilter = "";
let logRangeFilter = "";
let adminLogSearchTerm = "";
let selectedCheckinMemberId = "";
let taskRemoveMode = false;
let currentStaffUser =
  state.staffUsers.find((entry) => entry.id === sessionStorage.getItem(STAFF_USER_KEY)) ||
  null;

// ---- Element references ----
const elements = {
  quickBackup: document.querySelector("#quick-backup"),
  quickReport: document.querySelector("#quick-report"),
  dashboardAlerts: document.querySelector("#dashboard-alerts"),
  personForm: document.querySelector("#person-form"),
  calendarGrid: document.querySelector("#calendar-grid"),
  calendarEvents: document.querySelector("#calendar-events"),
  calendarTitle: document.querySelector("#calendar-title"),
  calendarPrev: document.querySelector("#calendar-prev"),
  calendarNext: document.querySelector("#calendar-next"),
  awardForm: document.querySelector("#award-form"),
  awardNote: document.querySelector("#award-note"),
  awardNoteError: document.querySelector("#award-note-error"),
  taskForm: document.querySelector("#task-form"),
  taskButtons: document.querySelector("#task-buttons"),
  taskError: document.querySelector("#task-error"),
  removeForm: document.querySelector("#remove-form"),
  removeNote: document.querySelector("#remove-note"),
  removeNoteError: document.querySelector("#remove-note-error"),
  undoLast: document.querySelector("#undo-last"),
  exportLogs: document.querySelector("#export-logs"),
  printLogs: document.querySelector("#print-logs"),
  exportData: document.querySelector("#export-data"),
  importData: document.querySelector("#import-data"),
  restoreSafetyBackup: document.querySelector("#restore-safety-backup"),
  backupStatus: document.querySelector("#backup-status"),
  logCountActivity: document.querySelector("#log-count-activity"),
  logCountAdmin: document.querySelector("#log-count-admin"),
  logCountBackups: document.querySelector("#log-count-backups"),
  logSearch: document.querySelector("#log-search"),
  logTypeFilter: document.querySelector("#log-type-filter"),
  logRangeFilter: document.querySelector("#log-range-filter"),
  logFilterStatus: document.querySelector("#log-filter-status"),
  adminLogSearch: document.querySelector("#admin-log-search"),
  redeemForm: document.querySelector("#redeem-form"),
  redeemError: document.querySelector("#redeem-error"),
  redeemButton: document.querySelector("#redeem-button"),
  redeemPoints: document.querySelector("#redeem-points"),
  peopleList: document.querySelector("#people-list"),
  checkinForm: document.querySelector("#checkin-form"),
  checkinMember: document.querySelector("#checkin-member"),
  checkinSummary: document.querySelector("#checkin-summary"),
  checkinHistory: document.querySelector("#checkin-history"),
  checkinLogVisit: document.querySelector("#checkin-log-visit"),
  checkinFollowupToggle: document.querySelector("#checkin-followup-toggle"),
  inactiveMembersList: document.querySelector("#inactive-members-list"),
  memberTagFilter: document.querySelector("#member-tag-filter"),
  memberSort: document.querySelector("#member-sort"),
  printSignin: document.querySelector("#print-signin"),
  itemsTable: document.querySelector("#items-table"),
  activityTable: document.querySelector("#activity-table"),
  peopleSelects: document.querySelectorAll("select[name='personId']"),
  redeemItems: document.querySelector("#redeem-items"),
  memberSearch: document.querySelector("#member-search"),
  statPeople: document.querySelector("#stat-people"),
  statDate: document.querySelector("#stat-date"),
  statAverage: document.querySelector("#stat-average"),
  addItemToggle: document.querySelector("#add-item-toggle"),
  addItemForm: document.querySelector("#add-item-form"),
  addItemCancel: document.querySelector("#add-item-cancel"),
  addItemName: document.querySelector("#add-item-name"),
  addItemPoints: document.querySelector("#add-item-points"),
  addItemGroup: document.querySelector("#add-item-group"),
  addItemError: document.querySelector("#add-item-error"),
  staffToggle: document.querySelector("#staff-toggle"),
  staffStatus: document.querySelector("#staff-status"),
  adminTable: document.querySelector("#admin-table"),
  addTaskToggle: document.querySelector("#add-task-toggle"),
  removeTaskToggle: document.querySelector("#remove-task-toggle"),
  addTaskForm: document.querySelector("#add-task-form"),
  addTaskName: document.querySelector("#add-task-name"),
  addTaskPoints: document.querySelector("#add-task-points"),
  addTaskError: document.querySelector("#add-task-error"),
  addTaskCancel: document.querySelector("#add-task-cancel"),
  addTaskSave: document.querySelector("#add-task-save"),
  summaryMembers: document.querySelector("#summary-members"),
  summaryItems: document.querySelector("#summary-items"),
  summaryCategory: document.querySelector("#summary-category"),
  printReport: document.querySelector("#print-report"),
  memberDateJoined: document.querySelector("#member-date-joined"),
  memberPhone: document.querySelector("#member-phone"),
  memberPhoto: document.querySelector("#member-photo"),
  memberPhotoName: document.querySelector("#member-photo-name"),
  memberPhotoError: document.querySelector("#member-photo-error"),
  staffTaskList: document.querySelector("#staff-task-list"),
  staffTaskForm: document.querySelector("#staff-task-form"),
  staffTaskInput: document.querySelector("#staff-task-input"),
  staffTaskSave: document.querySelector("#staff-task-save"),
  staffTaskCancel: document.querySelector("#staff-task-cancel"),
  volunteerForm: document.querySelector("#volunteer-form"),
  volunteerList: document.querySelector("#volunteer-list"),
  volunteerSort: document.querySelector("#volunteer-sort"),
  volunteerPhoto: document.querySelector("#volunteer-photo"),
  volunteerPhotoName: document.querySelector("#volunteer-photo-name"),
  volunteerSave: document.querySelector("#volunteer-save"),
  volunteerCancel: document.querySelector("#volunteer-cancel"),
  donorForm: document.querySelector("#donor-form"),
  donorList: document.querySelector("#donor-list"),
  donorSave: document.querySelector("#donor-save"),
  donorCancel: document.querySelector("#donor-cancel"),
  documentForm: document.querySelector("#document-form"),
  documentList: document.querySelector("#document-list"),
  documentFile: document.querySelector("#document-file"),
  documentFileName: document.querySelector("#document-file-name"),
  documentError: document.querySelector("#document-error"),
  resourceSearch: document.querySelector("#resource-search"),
  resourceForm: document.querySelector("#resource-form"),
  resourceList: document.querySelector("#resource-list"),
  addResourceToggle: document.querySelector("#add-resource-toggle"),
  resourceCancel: document.querySelector("#resource-cancel"),
  resourceSave: document.querySelector("#resource-save"),
  resourceName: document.querySelector("#resource-name"),
  resourceCategory: document.querySelector("#resource-category"),
  resourcePhone: document.querySelector("#resource-phone"),
  resourceAddress: document.querySelector("#resource-address"),
  resourceEmail: document.querySelector("#resource-email"),
  resourceWebsite: document.querySelector("#resource-website"),
  resourceServices: document.querySelector("#resource-services"),
  resourceDropoff: document.querySelector("#resource-dropoff"),
  resourcePhoto: document.querySelector("#resource-photo"),
  resourcePhotoName: document.querySelector("#resource-photo-name"),
  resourceError: document.querySelector("#resource-error"),
  printResources: document.querySelector("#print-resources"),
  eventForm: document.querySelector("#event-form"),
  eventList: document.querySelector("#event-list"),
  staffUserForm: document.querySelector("#staff-user-form"),
  staffUserList: document.querySelector("#staff-user-list"),
  staffUserError: document.querySelector("#staff-user-error"),
  settingsForm: document.querySelector("#settings-form"),
  settingsOrgName: document.querySelector("#settings-org-name"),
  settingsHubName: document.querySelector("#settings-hub-name"),
  settingsSubtitle: document.querySelector("#settings-subtitle"),
  settingsStatus: document.querySelector("#settings-status"),
  restoreTaskList: document.querySelector("#restore-task-list"),
  restoreItemList: document.querySelector("#restore-item-list"),
  loginGate: document.querySelector("#login-gate"),
  gateLoginForm: document.querySelector("#gate-login-form"),
  gateLoginError: document.querySelector("#gate-login-error"),
  sensitiveModal: document.querySelector("#sensitive-modal"),
  sensitiveForm: document.querySelector("#sensitive-form"),
  sensitiveTitle: document.querySelector("#sensitive-title"),
  sensitiveMessage: document.querySelector("#sensitive-message"),
  sensitiveUsername: document.querySelector("#sensitive-username"),
  sensitivePassword: document.querySelector("#sensitive-password"),
  sensitiveNewPasswordFields: document.querySelector("#sensitive-new-password-fields"),
  sensitiveNewPassword: document.querySelector("#sensitive-new-password"),
  sensitiveConfirmPassword: document.querySelector("#sensitive-confirm-password"),
  sensitiveError: document.querySelector("#sensitive-error"),
  sensitiveSubmit: document.querySelector("#sensitive-submit"),
  sensitiveCancel: document.querySelector("#sensitive-cancel"),
};

// ---- Initial render / bindings ----
renderAll();
scheduleDailySummaryRefresh();
setDefaultDateJoined();
attachPhoneSanitizer();
attachMemberSearch();
attachRedeemPointsListener();
attachMemberPhotoPicker();
attachVolunteerPhotoPicker();
attachDocumentPicker();
attachResourcePhotoPicker();
attachMemberFilters();
attachStaffLogin();
attachVolunteerSort();
attachCalendarControls();
attachResourceSearch();
attachPageGuideSpy();
attachSensitiveConfirmation();
ensureDailySafetyBackup();
renderBackupStatus();
if (didLegacyTodoMigration) {
  saveState();
}

if (elements.staffToggle) {
  elements.staffToggle.addEventListener("click", () => {
    setStaffMode(false, null);
  });
}

if (elements.undoLast) {
  elements.undoLast.addEventListener("click", () => {
    const entry = state.activity[0];
    if (!entry) return;
    const noteLabel = entry.note || entry.type;
    requestSensitiveConfirmation({
      title: "Undo Last Action",
      message:
        "This will reverse the most recent point change. Enter staff credentials to continue.",
      actionLabel: "Undo Action",
      backupReason: "Before undoing latest activity",
      onConfirm: ({ confirmedBy }) => {
        const person = state.people.find((p) => p.id === entry.personId);
        if (person) {
          if (Number.isFinite(entry.before)) {
            person.points = entry.before;
          } else {
            person.points = Math.max(0, person.points - entry.delta);
          }
        }
        state.activity.unshift({
          id: crypto.randomUUID(),
          personId: entry.personId || "",
          type: "undo",
          delta: 0,
          before: person ? person.points : null,
          after: person ? person.points : null,
          note: `Undid: ${noteLabel}`,
          actor: confirmedBy.displayName || confirmedBy.username,
          timestamp: new Date().toISOString(),
        });
        state.activity = state.activity.slice(0, MAX_ACTIVITY_LOG_ENTRIES);
        logAdminAction(
          "Undo",
          `Undid activity: ${noteLabel} after confirmation by ${
            confirmedBy.displayName || confirmedBy.username
          }`
        );
        saveState();
        renderAll();
      }
    });
  });
}

if (elements.exportLogs) {
  elements.exportLogs.addEventListener("click", () => {
    exportLogsWorkbook();
  });
}

if (elements.printLogs) {
  elements.printLogs.addEventListener("click", () => {
    printLogsReport();
  });
}

if (elements.logSearch) {
  elements.logSearch.addEventListener("input", () => {
    logSearchTerm = elements.logSearch.value.trim().toLowerCase();
    renderActivity();
  });
}

if (elements.logTypeFilter) {
  elements.logTypeFilter.addEventListener("change", () => {
    logTypeFilter = elements.logTypeFilter.value;
    renderActivity();
  });
}

if (elements.logRangeFilter) {
  elements.logRangeFilter.addEventListener("change", () => {
    logRangeFilter = elements.logRangeFilter.value;
    renderActivity();
  });
}

if (elements.adminLogSearch) {
  elements.adminLogSearch.addEventListener("input", () => {
    adminLogSearchTerm = elements.adminLogSearch.value.trim().toLowerCase();
    renderAdminLog();
  });
}

if (elements.quickBackup) {
  elements.quickBackup.addEventListener("click", () => {
    if (elements.exportData) elements.exportData.click();
  });
}

if (elements.quickReport) {
  elements.quickReport.addEventListener("click", () => {
    printWeeklyReport();
  });
}

if (elements.checkinMember) {
  elements.checkinMember.addEventListener("change", () => {
    selectedCheckinMemberId = elements.checkinMember.value;
    renderCheckin();
  });
}

if (elements.checkinLogVisit) {
  elements.checkinLogVisit.addEventListener("click", () => {
    const personId = elements.checkinMember ? elements.checkinMember.value : "";
    if (!personId) return;
    logVisit(personId);
    selectedCheckinMemberId = personId;
    renderAll();
  });
}

if (elements.checkinFollowupToggle) {
  elements.checkinFollowupToggle.addEventListener("click", () => {
    const personId = elements.checkinMember ? elements.checkinMember.value : "";
    const person = state.people.find((entry) => entry.id === personId);
    if (!person) return;
    person.followUpNeeded = !person.followUpNeeded;
    if (person.followUpNeeded && !person.followUpNote) {
      person.followUpNote = "Needs staff follow-up";
    }
    logAdminAction(
      "Follow-Up Updated",
      `${person.followUpNeeded ? "Marked" : "Cleared"} follow-up for ${person.firstName} ${person.lastName}`
    );
    saveState();
    selectedCheckinMemberId = personId;
    renderAll();
  });
}

function cloneStateForBackup() {
  return JSON.parse(JSON.stringify(state));
}

function buildBackupPayload(reason) {
  return {
    exportedAt: new Date().toISOString(),
    reason,
    state: cloneStateForBackup(),
  };
}

function downloadBackupPayload(payload, prefix = "ministry-backup") {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  downloadBlobFile(
    `${prefix}-${new Date(payload.exportedAt).toISOString().slice(0, 10)}.json`,
    blob
  );
}

function downloadBlobFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getSafetyBackups() {
  try {
    const raw = localStorage.getItem(SAFETY_BACKUP_KEY);
    const backups = raw ? JSON.parse(raw) : [];
    return Array.isArray(backups) ? backups : [];
  } catch (error) {
    return [];
  }
}

function createSafetyBackup(reason, options = {}) {
  const payload = buildBackupPayload(reason);
  const entry = {
    id: crypto.randomUUID(),
    exportedAt: payload.exportedAt,
    reason,
    payload,
  };
  const backups = [entry, ...getSafetyBackups()].slice(0, MAX_SAFETY_BACKUPS);
  try {
    localStorage.setItem(SAFETY_BACKUP_KEY, JSON.stringify(backups));
    state.lastSafetyBackupAt = entry.exportedAt;
    if (!options.silent) saveState();
    renderBackupStatus();
    return entry;
  } catch (error) {
    if (!options.silent) {
      alert(
        "Unable to save the automatic safety backup. Please use Backup Data (JSON) before continuing."
      );
    }
    return null;
  }
}

function ensureDailySafetyBackup() {
  const latest = getSafetyBackups()[0];
  const today = new Date().toISOString().slice(0, 10);
  if (latest && String(latest.exportedAt || "").slice(0, 10) === today) return;
  createSafetyBackup("Daily automatic safety snapshot", { silent: true });
}

function getLatestSafetyBackup() {
  return getSafetyBackups()[0] || null;
}

function renderBackupStatus() {
  const backups = getSafetyBackups();
  if (elements.logCountActivity) elements.logCountActivity.textContent = String(state.activity.length);
  if (elements.logCountAdmin) elements.logCountAdmin.textContent = String(state.adminLog.length);
  if (elements.logCountBackups) elements.logCountBackups.textContent = String(backups.length);
  if (!elements.backupStatus) return;
  const latest = getLatestSafetyBackup();
  if (!latest) {
    elements.backupStatus.textContent =
      "Latest safety backup: none yet. Use Backup Data (JSON) before major changes.";
    return;
  }
  elements.backupStatus.textContent = `Latest safety backup: ${new Date(
    latest.exportedAt
  ).toLocaleString()} (${latest.reason || "Automatic snapshot"})`;
}

function renderLogControls() {
  if (!elements.logTypeFilter) return;
  const current = elements.logTypeFilter.value;
  const types = [...new Set((state.activity || []).map((entry) => entry.type).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  elements.logTypeFilter.innerHTML = '<option value="">All Activity Types</option>';
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = titleCase(type);
    elements.logTypeFilter.append(option);
  });
  elements.logTypeFilter.value = types.includes(current) ? current : "";
  logTypeFilter = elements.logTypeFilter.value;
}

function applyImportedState(importedState) {
  state.people = importedState.people || [];
  state.items = importedState.items || defaultItems.map((item) => ({ ...item }));
  state.customItems = importedState.customItems || [];
  state.customTasks = importedState.customTasks || [];
  state.hiddenTasks = importedState.hiddenTasks || [];
  state.hiddenItems = importedState.hiddenItems || [];
  state.settings = { ...DEFAULT_SETTINGS, ...(importedState.settings || {}) };
  state.adminLog = importedState.adminLog || [];
  state.activity = importedState.activity || [];
  state.visits = importedState.visits || [];
  state.volunteers = importedState.volunteers || [];
  state.donors = importedState.donors || [];
  state.documents = importedState.documents || [];
  state.events = importedState.events || [];
  state.resources = importedState.resources || DEFAULT_RESOURCES.map((entry) => ({ ...entry }));
  state.staffTodosGlobal = importedState.staffTodosGlobal || [];
  state.staffUsers = importedState.staffUsers || state.staffUsers;
  state.lastSafetyBackupAt = importedState.lastSafetyBackupAt || state.lastSafetyBackupAt || "";
  state.people = state.people.map((person) => ({
    ...person,
    home: person.home || person.address || "",
    residenceTag: person.residenceTag || "Homeless",
    email: person.email || "",
    followUpNeeded: Boolean(person.followUpNeeded),
    followUpNote: person.followUpNote || "",
    staffTodos: Array.isArray(person.staffTodos) ? person.staffTodos : [],
  }));
  state.activity = state.activity.map((entry) => ({
    ...entry,
    actor: entry.actor || "Unknown Staff",
  }));
  state.visits = state.visits.map((entry) => ({
    ...entry,
    actor: entry.actor || "Unknown Staff",
  }));
  state.volunteers = state.volunteers.map((volunteer) => ({
    ...volunteer,
    profilePhoto: volunteer.profilePhoto || "",
  }));
  state.donors = state.donors.map((donor) => ({
    ...donor,
    email: donor.email || "",
    phone: donor.phone || "",
    donation: donor.donation || "",
  }));
  state.documents = state.documents.map((documentItem) => ({
    ...documentItem,
    category: documentItem.category || "",
  }));
  state.resources = state.resources.map((resource) => ({
    ...resource,
    email: resource.email || "",
    phone: resource.phone || "",
    website: resource.website || "",
    photo: resource.photo || "",
  }));
  state.adminLog = state.adminLog.map((entry) => ({
    ...entry,
    actor: entry.actor || "Unknown Staff",
  }));
  ensureStarterStaffAccount();
}

if (elements.exportData) {
  elements.exportData.addEventListener("click", () => {
    const payload = buildBackupPayload("Manual full backup export");
    downloadBackupPayload(payload);
    state.lastSafetyBackupAt = payload.exportedAt;
    saveState();
    renderBackupStatus();
    logAdminAction("Backup Exported", "Exported full backup JSON");
  });
}

if (elements.restoreSafetyBackup) {
  elements.restoreSafetyBackup.addEventListener("click", () => {
    const latest = getLatestSafetyBackup();
    if (!latest || !latest.payload || !latest.payload.state) {
      alert("No safety backup is available to restore.");
      return;
    }
    requestSensitiveConfirmation({
      title: "Restore Safety Backup",
      message:
        "This will replace the current app data with the latest safety backup. Enter staff credentials to continue.",
      actionLabel: "Restore Backup",
      backupReason: "Before restoring latest safety backup",
      onConfirm: () => {
        applyImportedState(latest.payload.state);
        logAdminAction(
          "Safety Backup Restored",
          `Restored safety backup from ${new Date(latest.exportedAt).toLocaleString()}`
        );
        saveState();
        renderAll();
      },
    });
  });
}

if (elements.importData) {
  elements.importData.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        if (!parsed || !parsed.state) {
          alert("Invalid backup file.");
          return;
        }
        requestSensitiveConfirmation({
          title: "Restore Data Backup",
          message:
            "This will replace the current app data with the selected backup file. Enter staff credentials to continue.",
          actionLabel: "Restore Data",
          backupReason: "Before manual backup restore",
          onConfirm: ({ confirmedBy }) => {
            applyImportedState(parsed.state);
            logAdminAction(
              "Backup Restored",
              `Restored backup from ${file.name || "selected file"} after confirmation by ${
                confirmedBy.displayName || confirmedBy.username
              }`
            );
            saveState();
            renderAll();
          },
        });
      } catch (error) {
        alert("Unable to restore backup.");
      }
    });
    input.click();
  });
}

if (elements.settingsForm) {
  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.settings = {
      organizationName: elements.settingsOrgName.value.trim() || DEFAULT_SETTINGS.organizationName,
      hubName: elements.settingsHubName.value.trim() || DEFAULT_SETTINGS.hubName,
      subtitle: elements.settingsSubtitle.value.trim() || DEFAULT_SETTINGS.subtitle,
    };
    logAdminAction("Settings Updated", "Updated dashboard organization settings");
    saveState();
    renderAll();
    if (elements.settingsStatus) {
      elements.settingsStatus.textContent = "Settings saved.";
    }
  });
}

const toggleAddItemForm = (show) => {
  if (!elements.addItemForm) return;
  elements.addItemForm.classList.toggle("show", show);
  elements.addItemForm.style.display = show ? "grid" : "none";
  if (show) {
    hydrateAddItemGroups();
  }
};

if (elements.addItemToggle) {
  elements.addItemToggle.addEventListener("click", () => {
    const isOpen = elements.addItemForm && elements.addItemForm.classList.contains("show");
    toggleAddItemForm(!isOpen);
  });
}

if (elements.addItemCancel) {
  elements.addItemCancel.addEventListener("click", () => {
    toggleAddItemForm(false);
  });
}

if (elements.addItemForm) {
  elements.addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.addItemName.value.trim();
    const points = Number(elements.addItemPoints.value);
    const group = elements.addItemGroup.value;

    if (!name) {
      setError(elements.addItemError, "Please enter an item name.");
      return;
    }

    const normalizedName = name.toLowerCase();
    const exists = state.items.some(
      (item) => item.name.toLowerCase() === normalizedName
    );
    if (exists) {
      const foundGroup = findItemGroup(normalizedName);
      const suffix = foundGroup ? ` and is located in the ${foundGroup} list.` : ".";
      setError(elements.addItemError, `That item already exists${suffix}`);
      return;
    }

    if (!Number.isFinite(points) || points < 0) {
      setError(elements.addItemError, "Please enter a valid points value.");
      return;
    }

    setError(elements.addItemError, "");
    state.items.push({ name, cost: points });
    state.customItems.push({ name, cost: points, group });
    saveState();
    elements.addItemForm.reset();
    toggleAddItemForm(false);
    renderAll();
  });
}

elements.personForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(elements.personForm);
  const firstName = formData.get("firstName").trim();
  const lastName = formData.get("lastName").trim();
  const startingPoints = Number(formData.get("startingPoints"));
  const dateJoined = formData.get("dateJoined");
  const home = formData.get("home").trim();
  const residenceTag = formData.get("residenceTag").trim() || "Homeless";
  const phone = sanitizePhone(formData.get("phone"));
  const email = formData.get("email").trim();
  const emergencyContactName = formData.get("emergencyContactName").trim();
  const emergencyContactPhone = sanitizePhone(formData.get("emergencyContactPhone"));
  const emergencyContactAddress = formData.get("emergencyContactAddress").trim();
  const memberNotes = formData.get("memberNotes").trim();
  if (!firstName || !lastName) return;
  let profilePhoto = "";
  const photoFile = formData.get("profilePhoto");
  if (photoFile && photoFile.size > 0) {
    try {
      // Compress the image to keep storage safe and fast.
      profilePhoto = await readAndCompressImage(photoFile);
    } catch (error) {
      showMemberPhotoError(
        "Photo too large to save. Please choose a smaller image."
      );
      profilePhoto = "";
      return;
    }
  }
  showMemberPhotoError("");

  const newId = crypto.randomUUID();
  state.people.push({
    id: newId,
    firstName,
    lastName,
    points: Number.isFinite(startingPoints) && startingPoints >= 0 ? startingPoints : 0,
    dateJoined: dateJoined || "",
    home,
    residenceTag,
    phone,
    email,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactAddress,
    memberNotes,
    profilePhoto,
    followUpNeeded: false,
    followUpNote: "",
    staffTodos: [],
  });
  state.activity.unshift({
    id: crypto.randomUUID(),
    personId: newId,
    type: "member",
    delta: 0,
    before: 0,
    after: Number.isFinite(startingPoints) && startingPoints >= 0 ? startingPoints : 0,
    note: "Member added",
    actor: getCurrentActorName(),
    timestamp: new Date().toISOString(),
  });
  logAdminAction("Member Added", `Added ${firstName} ${lastName}`);
  saveState();
  elements.personForm.reset();
  if (elements.memberPhotoName) {
    elements.memberPhotoName.textContent = "";
  }
  showMemberPhotoError("");
  setDefaultDateJoined();
  renderAll();
});

elements.awardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.awardForm);
  const personId = formData.get("personId");
  const points = Number(formData.get("points"));
  const note = formData.get("note").trim();
  if (!note) {
    setError(elements.awardNoteError, "Note is required.");
    return;
  }
  setError(elements.awardNoteError, "");
  if (!personId || !Number.isFinite(points) || points <= 0) return;

  adjustPoints(personId, points, "award", note);
  elements.awardForm.reset();
  renderAll();
});

elements.removeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.removeForm);
  const personId = formData.get("personId");
  const points = Number(formData.get("points"));
  const note = formData.get("note").trim();
  if (!note) {
    setError(elements.removeNoteError, "Note is required.");
    return;
  }
  setError(elements.removeNoteError, "");
  if (!personId || !Number.isFinite(points) || points <= 0) return;

  adjustPoints(personId, -points, "remove", note);
  elements.removeForm.reset();
  renderAll();
});

if (elements.volunteerForm) {
  elements.volunteerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.volunteerForm);
    let profilePhoto =
      editingVolunteerId &&
      state.volunteers.find((entry) => entry.id === editingVolunteerId)
        ? state.volunteers.find((entry) => entry.id === editingVolunteerId).profilePhoto || ""
        : "";
    const photoFile = formData.get("profilePhoto");
    if (photoFile && photoFile.size > 0) {
      try {
        profilePhoto = await readAndCompressImage(photoFile);
      } catch (error) {
        profilePhoto = "";
      }
    }
    const payload = {
      name: formData.get("name").trim(),
      areas: formData.get("areas").trim(),
      role: formData.get("role").trim(),
      ministrySafe: formData.get("ministrySafe"),
      serviceCount: Number(formData.get("serviceCount")) || 0,
      phone: sanitizePhone(formData.get("phone")),
      email: formData.get("email").trim(),
      profilePhoto,
    };
    if (editingVolunteerId) {
      const volunteer = state.volunteers.find((entry) => entry.id === editingVolunteerId);
      if (volunteer) Object.assign(volunteer, payload);
      logAdminAction("Volunteer Updated", `Updated volunteer ${payload.name}`);
    } else {
      state.volunteers.unshift({
        id: crypto.randomUUID(),
        ...payload,
      });
      logAdminAction("Volunteer Added", `Added volunteer ${payload.name}`);
    }
    saveState();
    resetVolunteerForm();
    renderVolunteers();
  });
}

if (elements.volunteerCancel) {
  elements.volunteerCancel.addEventListener("click", () => {
    resetVolunteerForm();
  });
}

if (elements.eventForm) {
  elements.eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.eventForm);
    const checklist = String(formData.get("checklist") || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((title) => ({
        id: crypto.randomUUID(),
        title,
        done: false,
      }));
    state.events.push({
      id: crypto.randomUUID(),
      title: formData.get("title").trim(),
      date: formData.get("date"),
      description: formData.get("description").trim(),
      checklist,
    });
    logAdminAction("Event Added", `Added event ${formData.get("title").trim()}`);
    saveState();
    elements.eventForm.reset();
    renderCalendar();
    renderEvents();
  });
}

if (elements.staffUserForm) {
  elements.staffUserForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.staffUserForm);
    const username = normalizeLabel(formData.get("username"));
    if (state.staffUsers.some((entry) => entry.username === username)) {
      setError(elements.staffUserError, "That username already exists.");
      return;
    }
    createSafetyBackup(`Before adding staff account ${username}`, { silent: true });
    state.staffUsers.push({
      id: crypto.randomUUID(),
      displayName: formData.get("displayName").trim(),
      username,
      password: formData.get("password").trim(),
    });
    setError(elements.staffUserError, "");
    logAdminAction("Staff Account Added", `Added staff account ${username}`);
    saveState();
    elements.staffUserForm.reset();
    renderStaffUsers();
  });
}

if (elements.staffTaskForm) {
  elements.staffTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = elements.staffTaskInput ? elements.staffTaskInput.value.trim() : "";
    if (!title) return;
    if (editingStaffTodoId) {
      const todo = state.staffTodosGlobal.find((entry) => entry.id === editingStaffTodoId);
      if (todo) todo.title = title;
      logAdminAction("Staff Reminder Updated", `Updated staff reminder "${title}"`);
    } else {
      state.staffTodosGlobal.unshift({
        id: crypto.randomUUID(),
        title,
        done: false,
        ownerId: currentStaffUser ? currentStaffUser.id : null,
        actor: getCurrentActorName(),
      });
      logAdminAction("Staff Reminder Added", `Added staff reminder "${title}"`);
    }
    saveState();
    resetStaffTodoForm();
    renderStaffTaskBoard();
  });
}

if (elements.staffTaskCancel) {
  elements.staffTaskCancel.addEventListener("click", () => {
    resetStaffTodoForm();
  });
}

if (elements.donorForm) {
  elements.donorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.donorForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: sanitizePhone(formData.get("phone")),
      email: String(formData.get("email") || "").trim(),
      donation: String(formData.get("donation") || "").trim(),
    };
    if (!payload.name || !payload.donation) return;
    if (editingDonorId) {
      const donor = state.donors.find((entry) => entry.id === editingDonorId);
      if (donor) Object.assign(donor, payload);
      logAdminAction("Donor Updated", `Updated donor ${payload.name}`);
    } else {
      state.donors.unshift({
        id: crypto.randomUUID(),
        ...payload,
      });
      logAdminAction("Donor Added", `Added donor ${payload.name}`);
    }
    saveState();
    resetDonorForm();
    renderDonors();
  });
}

if (elements.donorCancel) {
  elements.donorCancel.addEventListener("click", () => {
    resetDonorForm();
  });
}

if (elements.documentForm) {
  elements.documentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.documentForm);
    const file = formData.get("documentFile");
    if (!file || !file.name) {
      setError(elements.documentError, "Please choose a document.");
      return;
    }
    if (!isSupportedDocumentFile(file)) {
      setError(
        elements.documentError,
        "Supported files are PDF, images, text files, Excel files, and DOCX."
      );
      return;
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setError(elements.documentError, "Document is too large to store. Please use a smaller file.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    state.documents.unshift({
      id: crypto.randomUUID(),
      title: String(formData.get("title") || "").trim() || file.name,
      category: String(formData.get("category") || "").trim(),
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      dataUrl,
      uploadedAt: new Date().toISOString(),
    });
    logAdminAction("Document Uploaded", `Uploaded document ${file.name}`);
    setError(elements.documentError, "");
    saveState();
    elements.documentForm.reset();
    if (elements.documentFileName) elements.documentFileName.textContent = "";
    renderDocuments();
  });
}

const toggleResourceForm = (show) => {
  if (!elements.resourceForm) return;
  elements.resourceForm.classList.toggle("show", show);
  elements.resourceForm.style.display = show ? "grid" : "none";
};

if (elements.addResourceToggle) {
  elements.addResourceToggle.addEventListener("click", () => {
    const isOpen = elements.resourceForm && elements.resourceForm.classList.contains("show");
    if (isOpen) {
      resetResourceForm();
      toggleResourceForm(false);
      return;
    }
    editingResourceId = null;
    resetResourceForm();
    toggleResourceForm(true);
  });
}

if (elements.resourceCancel) {
  elements.resourceCancel.addEventListener("click", () => {
    resetResourceForm();
    toggleResourceForm(false);
  });
}

if (elements.resourceForm) {
  elements.resourceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.resourceForm);
    let photo = "";
    if (editingResourceId) {
      const existing = state.resources.find((entry) => entry.id === editingResourceId);
      photo = existing ? existing.photo || "" : "";
    }
    const file = formData.get("photo");
    if (file && file.size > 0) {
      try {
        photo = await readAndCompressImage(file);
      } catch (error) {
        setError(elements.resourceError, "Resource photo is too large. Please choose a smaller image.");
        return;
      }
    }
    const payload = {
      name: String(formData.get("name") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      phone: sanitizePhone(formData.get("phone")),
      address: String(formData.get("address") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      services: String(formData.get("services") || "").trim(),
      dropoff: String(formData.get("dropoff") || "").trim(),
      photo,
    };
    if (!payload.name || !payload.category || !payload.services) {
      setError(elements.resourceError, "Please fill in the name, category, and services.");
      return;
    }
    if (editingResourceId) {
      const resource = state.resources.find((entry) => entry.id === editingResourceId);
      if (resource) Object.assign(resource, payload);
      logAdminAction("Resource Updated", `Updated resource ${payload.name}`);
    } else {
      state.resources.unshift({
        id: `resource-${crypto.randomUUID()}`,
        ...payload,
      });
      logAdminAction("Resource Added", `Added resource ${payload.name}`);
    }
    setError(elements.resourceError, "");
    saveState();
    resetResourceForm();
    toggleResourceForm(false);
    renderResources();
  });
}

if (elements.printResources) {
  elements.printResources.addEventListener("click", () => {
    printResources();
  });
}

if (elements.printReport) {
  elements.printReport.addEventListener("click", () => {
    printWeeklyReport();
  });
}

elements.redeemForm.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (event.target && event.target.tagName === "BUTTON") return;
  event.preventDefault();
  if (elements.redeemButton) {
    elements.redeemButton.focus();
  }
});

elements.redeemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(elements.redeemForm);
  const personId = formData.get("personId");
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;

  const selections = getRedeemSelections();
  if (selections.length === 0) {
    setError(elements.redeemError, "Select at least one item.");
    return;
  }

  const totalCost = selections.reduce(
    (sum, entry) => sum + entry.item.cost * entry.quantity,
    0
  );

  if (totalCost > person.points) {
    setError(
      elements.redeemError,
      `Not enough points. Needed ${totalCost}, have ${person.points}.`
    );
    return;
  }

  setError(elements.redeemError, "");
  const note = selections
    .map((entry) => `${entry.quantity} x ${entry.item.name}`)
    .join("; ");

  adjustPoints(personId, -totalCost, "redeem", note);
  resetRedeemSelections();
  renderAll();
});

function adjustPoints(personId, delta, type, note) {
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;
  const before = person.points;
  const after = Math.max(0, person.points + delta);
  person.points = after;
  state.activity.unshift({
    id: crypto.randomUUID(),
    personId,
    type,
    delta,
    before,
    after,
    note,
    actor: getCurrentActorName(),
    timestamp: new Date().toISOString(),
  });
  state.activity = state.activity.slice(0, MAX_ACTIVITY_LOG_ENTRIES);
  saveState();
}

function renderAll() {
  renderSettings();
  renderBranding();
  renderDashboardAlerts();
  renderMemberTagFilter();
  hydrateSelects();
  renderCalendar();
  renderPeople();
  renderCheckin();
  renderInactiveMembers();
  renderItems();
  renderActivity();
  renderStats();
  renderSummary();
  renderLogControls();
  renderStaffTaskBoard();
  renderVolunteers();
  renderDonors();
  renderDocuments();
  renderResources();
  renderEvents();
  renderStaffUsers();
  renderRestoreControls();
  renderRedeemPoints();
  renderAdminLog();
  renderBackupStatus();
  hydrateTasks();
  updateRedeemTotal();
  updateRedeemGroupCounts();
  updateStaffVisibility();
  queuePageGuideUpdate();
}

function getPageGuideEntries() {
  return Array.from(document.querySelectorAll(".page-guide__link"))
    .map((link) => {
      const sectionId = (link.getAttribute("href") || "").replace(/^#/, "");
      const section = sectionId ? document.getElementById(sectionId) : null;
      return { link, section };
    })
    .filter(({ section }) => Boolean(section));
}

function updatePageGuideHighlight() {
  const entries = getPageGuideEntries();
  if (entries.length === 0) return;
  const anchorLine = Math.min(window.innerHeight * 0.28, 220);
  let activeId = entries[0].section.id;
  let bestFuture = null;

  entries.forEach(({ section }) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= anchorLine) {
      activeId = section.id;
      bestFuture = null;
      return;
    }
    if (!bestFuture || rect.top < bestFuture.top) {
      bestFuture = { id: section.id, top: rect.top };
    }
  });

  if (bestFuture && entries[0].section.getBoundingClientRect().top > anchorLine) {
    activeId = bestFuture.id;
  }

  entries.forEach(({ link, section }) => {
    const isActive = section.id === activeId;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "location" : "false");
  });
}

function syncPageGuideScroll() {
  const guide = document.querySelector(".page-guide");
  if (!guide) return;
  const maxGuideScroll = guide.scrollHeight - guide.clientHeight;
  if (maxGuideScroll <= 0) {
    guide.scrollTop = 0;
    return;
  }

  const doc = document.documentElement;
  const maxPageScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / maxPageScroll, 0), 1);
  guide.scrollTop = maxGuideScroll * progress;
}

function queuePageGuideUpdate() {
  if (pageGuideFrame) cancelAnimationFrame(pageGuideFrame);
  pageGuideFrame = requestAnimationFrame(() => {
    pageGuideFrame = null;
    updatePageGuideHighlight();
    syncPageGuideScroll();
  });
}

function attachPageGuideSpy() {
  if (!document.querySelector(".page-guide__link")) return;
  window.addEventListener("scroll", queuePageGuideUpdate, { passive: true });
  window.addEventListener("resize", queuePageGuideUpdate);
  queuePageGuideUpdate();
}

function logVisit(personId) {
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;
  state.visits.unshift({
    id: crypto.randomUUID(),
    personId,
    actor: getCurrentActorName(),
    timestamp: new Date().toISOString(),
  });
  state.activity.unshift({
    id: crypto.randomUUID(),
    personId,
    type: "visit",
    delta: 0,
    before: person.points,
    after: person.points,
    note: "Visit logged",
    actor: getCurrentActorName(),
    timestamp: new Date().toISOString(),
  });
  state.activity = state.activity.slice(0, MAX_ACTIVITY_LOG_ENTRIES);
  saveState();
}

function refreshAfterPointsChange() {
  renderAll();
}

function getTopTasks(days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const counts = {};
  state.activity.forEach((entry) => {
    if (entry.type !== "task") return;
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < cutoff) return;
    const label = entry.note || "Task";
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getVisitEntriesForPerson(personId) {
  return (state.visits || [])
    .filter((entry) => entry.personId === personId)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

function ensureStarterStaffAccount() {
  const normalizedTarget = normalizeLabel("Ethan");
  const ethanAccount = state.staffUsers.find(
    (entry) => normalizeLabel(entry.username) === normalizedTarget
  );

  if (ethanAccount) {
    ethanAccount.displayName = "Ethan";
    ethanAccount.username = normalizedTarget;
    if (!ethanAccount.password) {
      ethanAccount.password = "2019";
    }
    return;
  }

  if (
    state.staffUsers.length === 1 &&
    normalizeLabel(state.staffUsers[0].username) === "admin" &&
    String(state.staffUsers[0].password || "") === "lighthouse"
  ) {
    state.staffUsers[0].displayName = "Ethan";
    state.staffUsers[0].username = normalizedTarget;
    state.staffUsers[0].password = "2019";
    return;
  }

  state.staffUsers.unshift({
    id: crypto.randomUUID(),
    displayName: "Ethan",
    username: normalizedTarget,
    password: "2019",
  });
}

function getVisitCount(personId) {
  return getVisitEntriesForPerson(personId).length;
}

function getLastVisitTimestamp(personId) {
  const entry = getVisitEntriesForPerson(personId)[0];
  return entry ? entry.timestamp : "";
}

function getResidenceTagOptions() {
  const found = new Set(DEFAULT_RESIDENCE_TAGS);
  state.people.forEach((person) => {
    if (person.residenceTag) found.add(person.residenceTag);
  });
  return [...found];
}

function getSettings() {
  state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  return state.settings;
}

function renderBranding() {
  const settings = getSettings();
  document.title = settings.hubName || DEFAULT_SETTINGS.hubName;
  document.querySelectorAll(".eyebrow").forEach((entry) => {
    if (entry.closest(".sensitive-modal")) return;
    entry.textContent = settings.organizationName;
  });
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) heroTitle.textContent = settings.hubName;
  const gateTitle = document.querySelector(".login-gate h1");
  if (gateTitle) gateTitle.textContent = settings.hubName;
  const heroSubtitle = document.querySelector(".hero .subhead");
  if (heroSubtitle) heroSubtitle.textContent = settings.subtitle;
}

function renderSettings() {
  if (!elements.settingsForm) return;
  const settings = getSettings();
  if (elements.settingsOrgName) elements.settingsOrgName.value = settings.organizationName;
  if (elements.settingsHubName) elements.settingsHubName.value = settings.hubName;
  if (elements.settingsSubtitle) elements.settingsSubtitle.value = settings.subtitle;
}

function getInactiveMembers(days = 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return (state.people || [])
    .filter((person) => {
      const lastVisit = Date.parse(getLastVisitTimestamp(person.id));
      return !Number.isFinite(lastVisit) || lastVisit < cutoff;
    })
    .sort((a, b) => {
      const aLast = Date.parse(getLastVisitTimestamp(a.id) || 0);
      const bLast = Date.parse(getLastVisitTimestamp(b.id) || 0);
      return aLast - bLast;
    });
}

function getUpcomingEvents(days = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + days);
  return (state.events || []).filter((eventItem) => {
    const eventTime = Date.parse(eventItem.date);
    return Number.isFinite(eventTime) && eventTime >= today.getTime() && eventTime <= end.getTime();
  });
}

function renderDashboardAlerts() {
  if (!elements.dashboardAlerts) return;
  const alerts = [];
  const latestBackup = getLatestSafetyBackup();
  const today = new Date().toISOString().slice(0, 10);
  if (!latestBackup || String(latestBackup.exportedAt || "").slice(0, 10) !== today) {
    alerts.push({
      title: "No safety backup today",
      detail: "Use Backup Data before major changes or restores.",
      type: "warning",
    });
  }
  const followUps = (state.people || []).filter((person) => person.followUpNeeded);
  if (followUps.length) {
    alerts.push({
      title: `${followUps.length} member${followUps.length === 1 ? "" : "s"} need follow-up`,
      detail: followUps.slice(0, 3).map((person) => `${person.firstName} ${person.lastName}`).join(", "),
      type: "warning",
    });
  }
  const inactive = getInactiveMembers(30);
  if (inactive.length) {
    alerts.push({
      title: `${inactive.length} inactive member${inactive.length === 1 ? "" : "s"}`,
      detail: "No visits logged in the last 30 days.",
    });
  }
  const upcoming = getUpcomingEvents(7);
  if (upcoming.length) {
    alerts.push({
      title: `${upcoming.length} event${upcoming.length === 1 ? "" : "s"} this week`,
      detail: upcoming.slice(0, 2).map((eventItem) => eventItem.title).join(", "),
    });
  }
  if (!alerts.length) {
    alerts.push({
      title: "Everything looks current",
      detail: "Backups, visits, follow-ups, and events are in good shape.",
    });
  }
  elements.dashboardAlerts.innerHTML = alerts
    .map(
      (alert) => `
        <div class="alert-card ${alert.type || ""}">
          <div><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.detail)}</span></div>
        </div>
      `
    )
    .join("");
}

function renderPeople() {
  const searchTerm = elements.memberSearch
    ? normalizeLabel(elements.memberSearch.value)
    : "";
  const activeTag = elements.memberTagFilter ? elements.memberTagFilter.value : "";
  const sortMode = elements.memberSort ? elements.memberSort.value : "name";
  elements.peopleList.innerHTML = "";
  const visiblePeople = state.people
    .filter((person) => {
      const fullName = normalizeLabel(`${person.firstName} ${person.lastName}`);
      const tag = normalizeLabel(person.residenceTag || "");
      const home = normalizeLabel(person.home || "");
      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchTerm) ||
        tag.includes(searchTerm) ||
        home.includes(searchTerm);
      const matchesTag = !activeTag || person.residenceTag === activeTag;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
    if (sortMode === "visits") {
        const visitDifference = getVisitCount(b.id) - getVisitCount(a.id);
        if (visitDifference !== 0) return visitDifference;
        return (
          Date.parse(getLastVisitTimestamp(b.id) || 0) -
          Date.parse(getLastVisitTimestamp(a.id) || 0)
        );
      }
      if (sortMode === "recent") {
        return Date.parse(getLastVisitTimestamp(b.id) || 0) - Date.parse(getLastVisitTimestamp(a.id) || 0);
      }
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });

  if (visiblePeople.length === 0) {
    elements.peopleList.innerHTML =
      "<p class='hint'>No matching members found.</p>";
    return;
  }

  const createMemberCard = (person) => {
    const card = document.createElement("div");
    card.className = "person member-card";

    const info = document.createElement("div");
    info.className = "person__info";
    const avatar = document.createElement("div");
    avatar.className = "person__avatar";
    if (person.profilePhoto) {
      const img = document.createElement("img");
      img.src = person.profilePhoto;
      img.alt = `${person.firstName} ${person.lastName}`;
      avatar.append(img);
    } else {
      avatar.textContent = getInitials(person.firstName, person.lastName);
    }
    const infoText = document.createElement("div");
    infoText.className = "person__copy";
    const visitCount = getVisitCount(person.id);
    const lastVisit = getLastVisitTimestamp(person.id);
    infoText.innerHTML = `
      <div class="person__name">${person.firstName} ${person.lastName}</div>
      <div class="person__points">${person.points} points</div>
      <div class="person__meta">${person.residenceTag || "No tag"}${person.home ? ` | ${person.home}` : ""}</div>
      <div class="person__meta">Visits: ${visitCount}${lastVisit ? ` | Last: ${new Date(lastVisit).toLocaleDateString()}` : ""}</div>
    `;
    if (person.followUpNeeded) {
      const badges = document.createElement("div");
      badges.className = "member-badges";
      badges.innerHTML = `<span class="member-badge">Needs Follow-Up${person.followUpNote ? `: ${escapeHtml(person.followUpNote)}` : ""}</span>`;
      infoText.append(badges);
    }
    const detailStack = document.createElement("div");
    detailStack.className = "member-card__details-stack";
    info.append(avatar, infoText, detailStack);

    const actions = document.createElement("div");
    actions.className = "person__actions";
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn small danger";
    removeButton.textContent = "Remove Member";
    removeButton.addEventListener("click", () => {
      requestSensitiveConfirmation({
        title: "Remove Member",
        message: `Enter staff credentials to permanently remove ${person.firstName} ${person.lastName}. A safety backup will be saved first.`,
        actionLabel: "Remove Member",
        backupReason: `Before removing member ${person.firstName} ${person.lastName}`,
        onConfirm: ({ confirmedBy }) => {
          state.people = state.people.filter((entry) => entry.id !== person.id);
          state.activity = state.activity.filter((entry) => entry.personId !== person.id);
          state.visits = state.visits.filter((entry) => entry.personId !== person.id);
          logAdminAction(
            "Member Removed",
            `Removed ${person.firstName} ${person.lastName} after confirmation by ${
              confirmedBy.displayName || confirmedBy.username
            }`
          );
          saveState();
          renderAll();
        },
      });
    });
    actions.append(removeButton);

    const visitButton = document.createElement("button");
    visitButton.type = "button";
    visitButton.className = "btn small secondary";
    visitButton.textContent = "Log Visit";
    visitButton.addEventListener("click", () => {
      logVisit(person.id);
      renderAll();
    });

    const followUpButton = document.createElement("button");
    followUpButton.type = "button";
    followUpButton.className = person.followUpNeeded ? "btn small accent" : "btn small secondary";
    followUpButton.textContent = person.followUpNeeded ? "Clear Follow-Up" : "Needs Follow-Up";
    followUpButton.addEventListener("click", () => {
      person.followUpNeeded = !person.followUpNeeded;
      if (person.followUpNeeded && !person.followUpNote) {
        person.followUpNote = "Needs staff follow-up";
      }
      logAdminAction(
        "Follow-Up Updated",
        `${person.followUpNeeded ? "Marked" : "Cleared"} follow-up for ${person.firstName} ${person.lastName}`
      );
      saveState();
      renderAll();
    });

    const activityDetails = document.createElement("details");
    activityDetails.className = "person__details";

    const summary = document.createElement("summary");
    summary.textContent = "View Activity";
    activityDetails.append(summary);

    const activityList = document.createElement("div");
    activityList.className = "person__activity";

    const entries = state.activity.filter(
      (entry) => entry.personId === person.id && entry.type !== "visit"
    );
    if (entries.length === 0) {
      activityList.innerHTML = "<p class='hint'>No activity yet for this person.</p>";
    } else {
      entries.forEach((entry) => {
        const when = new Date(entry.timestamp);
        const fromTo =
          Number.isFinite(entry.before) && Number.isFinite(entry.after)
            ? `from ${entry.before} to ${entry.after}`
            : "";
        const detailParts = [entry.note || entry.type];
        if (fromTo) detailParts.push(fromTo);
        if (entry.actor) detailParts.push(`by ${entry.actor}`);
        detailParts.push(when.toLocaleString());
        const detail = detailParts.join(" - ");

        const row = document.createElement("div");
        row.className = "person__entry";
        row.textContent = detail;
        activityList.append(row);
      });
    }

    activityDetails.append(activityList);

    const visitDetails = document.createElement("details");
    visitDetails.className = "person__details";
    const visitSummary = document.createElement("summary");
    visitSummary.textContent = "Previous Visits";
    visitDetails.append(visitSummary);
    const visitList = document.createElement("div");
    visitList.className = "person__activity";
    const visitEntries = getVisitEntriesForPerson(person.id);
    if (visitEntries.length === 0) {
      visitList.innerHTML = "<p class='hint'>No visits logged yet.</p>";
    } else {
      visitEntries.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "person__entry";
        const when = new Date(entry.timestamp);
        row.textContent = `${index + 1}. ${when.toLocaleString()} by ${
          entry.actor || "Unknown Staff"
        }`;
        visitList.append(row);
      });
    }
    visitDetails.append(visitList);

    const profileDetails = document.createElement("details");
    profileDetails.className = "person__details profile";
    const profileSummary = document.createElement("summary");
    profileSummary.textContent = "View Profile";
    profileDetails.append(profileSummary);
    if (reopenProfileId === person.id) {
      profileDetails.open = true;
      reopenProfileId = null;
    }

    const profileList = document.createElement("div");
    profileList.className = "person__activity profile-sheet";

    const initials = getInitials(person.firstName, person.lastName);
    const photoRow = document.createElement("div");
    photoRow.className = "profile-row profile-photo-row";
    const photoLabel = document.createElement("div");
    photoLabel.className = "profile-label";
    photoLabel.textContent = "Profile Photo";
    const photoContent = document.createElement("div");
    photoContent.className = "profile-photo-wrap";
    const photoPreview = document.createElement("div");
    photoPreview.className = "profile-photo-preview";
    const photoInput = document.createElement("input");
    photoInput.type = "file";
    photoInput.accept = "image/*";
    photoInput.className = "profile-photo-input";
    photoInput.disabled = true;
    photoInput.id = `profile-photo-${person.id}`;
    const choosePhotoButton = document.createElement("button");
    choosePhotoButton.type = "button";
    choosePhotoButton.className = "btn small secondary";
    choosePhotoButton.textContent = "Choose Photo";
    const photoName = document.createElement("span");
    photoName.className = "hint";
    const photoError = document.createElement("div");
    photoError.className = "error form-error";
    photoError.hidden = true;
    const removePhotoButton = document.createElement("button");
    removePhotoButton.type = "button";
    removePhotoButton.className = "btn small danger";
    removePhotoButton.textContent = "Remove";
    removePhotoButton.hidden = true;
    const photoActions = document.createElement("div");
    photoActions.className = "profile-photo-actions";
    photoActions.append(photoInput, choosePhotoButton, removePhotoButton, photoName);
    photoContent.append(photoPreview, photoActions, photoError);
    photoRow.append(photoLabel, photoContent);
    profileList.append(photoRow);

    const setPhotoPreview = (source) => {
      photoPreview.innerHTML = "";
      if (source) {
        const img = document.createElement("img");
        img.className = "profile-photo";
        img.src = source;
        img.alt = `${person.firstName} ${person.lastName}`;
        photoPreview.append(img);
        return;
      }
      const placeholder = document.createElement("div");
      placeholder.className = "profile-photo placeholder";
      placeholder.textContent = initials;
      photoPreview.append(placeholder);
    };

    setPhotoPreview(person.profilePhoto);

    const createSectionTitle = (title) => {
      const section = document.createElement("div");
      section.className = "profile-section-title";
      section.textContent = title;
      profileList.append(section);
    };

    const createField = (label, value, type, options) => {
      const row = document.createElement("div");
      row.className = "profile-row";
      const labelEl = document.createElement("div");
      labelEl.className = "profile-label";
      labelEl.textContent = label;
      const input = document.createElement("input");
      input.className = "profile-input";
      input.type = type || "text";
      if (options && options.inputMode) input.inputMode = options.inputMode;
      if (options && options.pattern) input.pattern = options.pattern;
      if (options && options.maxLength) input.maxLength = options.maxLength;
      if (options && options.sanitize === "phone") {
        input.addEventListener("input", () => {
          input.value = sanitizePhone(input.value);
        });
      }
      input.value = value || "";
      input.disabled = true;
      row.append(labelEl, input);
      profileList.append(row);
      return input;
    };

    const createSelectField = (label, value, options) => {
      const row = document.createElement("div");
      row.className = "profile-row";
      const labelEl = document.createElement("div");
      labelEl.className = "profile-label";
      labelEl.textContent = label;
      const select = document.createElement("select");
      select.className = "profile-input";
      options.forEach((entry) => {
        const option = document.createElement("option");
        option.value = entry;
        option.textContent = entry;
        select.append(option);
      });
      if (value && !options.includes(value)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.append(option);
      }
      select.value = value || options[0] || "";
      select.disabled = true;
      row.append(labelEl, select);
      profileList.append(row);
      return select;
    };

    createSectionTitle("Personal Information");
    const inputs = {
      dateJoined: createField("Date Joined", person.dateJoined, "date"),
      home: createField("Home", person.home),
      residenceTag: createSelectField(
        "Residence Tag",
        person.residenceTag,
        getResidenceTagOptions()
      ),
    };

    createSectionTitle("Contact Information");
    Object.assign(inputs, {
      phone: createField("Phone", person.phone, "tel", {
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 15,
        sanitize: "phone",
      }),
      email: createField("Email", person.email, "email"),
    });

    createSectionTitle("Emergency Contact");
    Object.assign(inputs, {
      emergencyContactName: createField(
        "Emergency Contact Name",
        person.emergencyContactName
      ),
      emergencyContactPhone: createField(
        "Emergency Contact Phone",
        person.emergencyContactPhone,
        "tel",
        {
          inputMode: "numeric",
          pattern: "[0-9]*",
          maxLength: 15,
          sanitize: "phone",
        }
      ),
      emergencyContactAddress: createField(
        "Emergency Contact Address",
        person.emergencyContactAddress
      ),
    });

    createSectionTitle("Notes");
    Object.assign(inputs, {
      memberNotes: createField("Notes", person.memberNotes),
      followUpNote: createField("Follow-Up Note", person.followUpNote),
    });

    const actionsRow = document.createElement("div");
    actionsRow.className = "profile-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn small secondary";
    editButton.textContent = "Edit";
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "btn small primary";
    saveButton.textContent = "Save";
    saveButton.hidden = true;
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn small secondary";
    cancelButton.textContent = "Cancel";
    cancelButton.hidden = true;

    let pendingPhoto = null;
    let isEditing = false;

    const setEditing = (editing) => {
      isEditing = editing;
      Object.values(inputs).forEach((input) => {
        input.disabled = !editing;
      });
      photoInput.disabled = !editing;
      choosePhotoButton.disabled = !editing;
      removePhotoButton.hidden = !editing;
      editButton.hidden = editing;
      saveButton.hidden = !editing;
      cancelButton.hidden = !editing;
    };

    const original = {};
    const captureOriginal = () => {
      original.dateJoined = inputs.dateJoined.value;
      original.home = inputs.home.value;
      original.residenceTag = inputs.residenceTag.value;
      original.phone = inputs.phone.value;
      original.email = inputs.email.value;
      original.emergencyContactName = inputs.emergencyContactName.value;
      original.emergencyContactPhone = inputs.emergencyContactPhone.value;
      original.emergencyContactAddress = inputs.emergencyContactAddress.value;
      original.memberNotes = inputs.memberNotes.value;
      original.followUpNote = inputs.followUpNote.value;
      original.profilePhoto = person.profilePhoto || "";
    };

    const restoreOriginal = () => {
      inputs.dateJoined.value = original.dateJoined || "";
      inputs.home.value = original.home || "";
      inputs.residenceTag.value = original.residenceTag || "";
      inputs.phone.value = original.phone || "";
      inputs.email.value = original.email || "";
      inputs.emergencyContactName.value = original.emergencyContactName || "";
      inputs.emergencyContactPhone.value = original.emergencyContactPhone || "";
      inputs.emergencyContactAddress.value = original.emergencyContactAddress || "";
      inputs.memberNotes.value = original.memberNotes || "";
      inputs.followUpNote.value = original.followUpNote || "";
      pendingPhoto = null;
      photoInput.value = "";
      photoName.textContent = "";
      photoError.textContent = "";
      photoError.hidden = true;
      setPhotoPreview(original.profilePhoto || "");
    };

    editButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      captureOriginal();
      setEditing(true);
    });

    cancelButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      restoreOriginal();
      setEditing(false);
    });

    photoInput.addEventListener("change", async () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      photoError.textContent = "";
      photoError.hidden = true;
      try {
        const dataUrl = await readAndCompressImage(file);
        pendingPhoto = dataUrl;
        photoName.textContent = file.name || "";
        setPhotoPreview(dataUrl);
      } catch (error) {
        photoError.textContent =
          "Photo too large to save. Please choose a smaller image.";
        photoError.hidden = false;
        pendingPhoto = null;
        photoInput.value = "";
        photoName.textContent = "";
        setPhotoPreview(person.profilePhoto || "");
      }
    });

    choosePhotoButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEditing) {
        captureOriginal();
        setEditing(true);
      }
      photoInput.click();
    });

    removePhotoButton.addEventListener("click", () => {
      pendingPhoto = "";
      photoInput.value = "";
      photoName.textContent = "";
      photoError.textContent = "";
      photoError.hidden = true;
      setPhotoPreview("");
    });

    saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      person.dateJoined = inputs.dateJoined.value || "";
      person.home = inputs.home.value.trim();
      person.residenceTag = inputs.residenceTag.value.trim() || "Homeless";
      person.phone = sanitizePhone(inputs.phone.value);
      person.email = inputs.email.value.trim();
      person.emergencyContactName = inputs.emergencyContactName.value.trim();
      person.emergencyContactPhone = sanitizePhone(inputs.emergencyContactPhone.value);
      person.emergencyContactAddress = inputs.emergencyContactAddress.value.trim();
      person.memberNotes = inputs.memberNotes.value.trim();
      person.followUpNote = inputs.followUpNote.value.trim();
      person.followUpNeeded = Boolean(person.followUpNeeded || person.followUpNote);
      if (pendingPhoto !== null) {
        person.profilePhoto = pendingPhoto;
        if (!person.profilePhoto) {
          delete person.profilePhoto;
        }
        pendingPhoto = null;
      }
      logAdminAction(
        "Member Profile Updated",
        `Updated profile for ${person.firstName} ${person.lastName}`
      );
      saveState();
      setEditing(false);
      reopenProfileId = person.id;
      renderAll();
    });

    actionsRow.append(editButton, cancelButton, saveButton);
    profileList.append(actionsRow);
    profileDetails.append(profileList);

    actions.append(visitButton, followUpButton);
    card.append(info, actions);
    detailStack.append(profileDetails, activityDetails, visitDetails);

    return card;
  };

  const featuredPeople = visiblePeople.slice(0, 3);
  const remainingPeople = visiblePeople.slice(3);

  featuredPeople.forEach((person) => {
    elements.peopleList.append(createMemberCard(person));
  });

  if (remainingPeople.length > 0) {
    const details = document.createElement("details");
    details.className = "activity-details";

    const summary = document.createElement("summary");
    summary.textContent = `Show ${remainingPeople.length} more members`;
    details.append(summary);

    remainingPeople.forEach((person) => {
      details.append(createMemberCard(person));
    });

    elements.peopleList.append(details);
  }
}

if (elements.addTaskToggle) {
  elements.addTaskToggle.addEventListener("click", () => {
    taskRemoveMode = false;
    updateTaskRemoveMode();
    if (!elements.addTaskForm) return;
    const isOpen = elements.addTaskForm.classList.contains("show");
    if (isOpen) {
      closeTaskEditor();
      return;
    }
    openTaskEditor();
  });
}

if (elements.addTaskCancel) {
  elements.addTaskCancel.addEventListener("click", () => {
    closeTaskEditor();
  });
}

if (elements.addTaskForm) {
  elements.addTaskForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
}

if (elements.addTaskSave) {
  elements.addTaskSave.addEventListener("click", () => {
    const name = elements.addTaskName.value.trim();
    const points = Number(elements.addTaskPoints.value);

    if (!name) {
      setError(elements.addTaskError, "Please enter a task name.");
      return;
    }
    if (!Number.isFinite(points) || points <= 0) {
      setError(elements.addTaskError, "Please enter a valid points value.");
      return;
    }

    const normalized = normalizeLabel(name);
    const existing = getAllTasks().some(
      (task) => normalizeLabel(task.label) === normalized && task.id !== editingTaskId
    );
    if (existing) {
      setError(elements.addTaskError, "That task already exists.");
      return;
    }

    setError(elements.addTaskError, "");
    if (editingTaskId) {
      const existingTask = state.customTasks.find((entry) => entry.id === editingTaskId);
      if (existingTask) {
        existingTask.label = name;
        existingTask.points = points;
      }
      logAdminAction("Task Updated", `Updated task ${name} (${points} pts)`);
    } else {
      state.customTasks.push({
        id: `custom-${crypto.randomUUID()}`,
        label: name,
        points,
      });
      logAdminAction("Task Added", `Added task ${name} (${points} pts)`);
    }
    saveState();
    closeTaskEditor();
    renderAll();
  });
}

function openTaskEditor(task) {
  if (!elements.addTaskForm) return;
  editingTaskId = task ? task.id : null;
  elements.addTaskForm.classList.add("show");
  elements.addTaskForm.style.display = "grid";
  setError(elements.addTaskError, "");
  if (elements.addTaskName) {
    elements.addTaskName.value = task ? task.label : "";
  }
  if (elements.addTaskPoints) {
    elements.addTaskPoints.value = task ? String(task.points) : "";
  }
  if (elements.addTaskSave) {
    elements.addTaskSave.textContent = task ? "Update Task" : "Save Task";
  }
}

function closeTaskEditor() {
  if (!elements.addTaskForm) return;
  editingTaskId = null;
  if (typeof elements.addTaskForm.reset === "function") {
    elements.addTaskForm.reset();
  } else {
    if (elements.addTaskName) elements.addTaskName.value = "";
    if (elements.addTaskPoints) elements.addTaskPoints.value = "";
  }
  elements.addTaskForm.classList.remove("show");
  elements.addTaskForm.style.display = "none";
  setError(elements.addTaskError, "");
  if (elements.addTaskSave) {
    elements.addTaskSave.textContent = "Save Task";
  }
}

function getAllTasks() {
  const hidden = new Set(state.hiddenTasks || []);
  const defaults = TASKS.filter((task) => !hidden.has(task.id));
  const customs = (state.customTasks || []).filter((task) => !hidden.has(task.id));
  if (customs.length === 0) return defaults;
  return [...defaults, ...customs];
}

function getAllTasksIncludingHidden() {
  return [...TASKS, ...(state.customTasks || [])];
}

function normalizeLabel(value) {
  if (!value) return "";
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function sanitizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function attachMemberPhotoPicker() {
  if (!elements.memberPhoto) return;
  elements.memberPhoto.addEventListener("change", () => {
    const file = elements.memberPhoto.files && elements.memberPhoto.files[0];
    if (elements.memberPhotoName) {
      elements.memberPhotoName.textContent = file ? file.name : "";
    }
    showMemberPhotoError("");
  });
}

function attachVolunteerPhotoPicker() {
  if (!elements.volunteerPhoto) return;
  elements.volunteerPhoto.addEventListener("change", () => {
    const file = elements.volunteerPhoto.files && elements.volunteerPhoto.files[0];
    if (elements.volunteerPhotoName) {
      elements.volunteerPhotoName.textContent = file ? file.name : "";
    }
  });
}

function attachDocumentPicker() {
  if (!elements.documentFile) return;
  elements.documentFile.setAttribute("accept", SUPPORTED_DOCUMENT_ACCEPT);
  elements.documentFile.addEventListener("change", () => {
    const file = elements.documentFile.files && elements.documentFile.files[0];
    if (elements.documentFileName) {
      elements.documentFileName.textContent = file ? file.name : "";
    }
    setError(elements.documentError, "");
  });
}

function attachResourcePhotoPicker() {
  if (!elements.resourcePhoto) return;
  elements.resourcePhoto.addEventListener("change", () => {
    const file = elements.resourcePhoto.files && elements.resourcePhoto.files[0];
    if (elements.resourcePhotoName) {
      elements.resourcePhotoName.textContent = file ? file.name : "";
    }
    setError(elements.resourceError, "");
  });
}

function attachResourceSearch() {
  if (!elements.resourceSearch) return;
  elements.resourceSearch.addEventListener("input", () => {
    renderResources();
  });
}

function showMemberPhotoError(message) {
  setError(elements.memberPhotoError, message);
}

function resetStaffTodoForm() {
  editingStaffTodoId = null;
  if (elements.staffTaskForm) elements.staffTaskForm.reset();
  if (elements.staffTaskSave) elements.staffTaskSave.textContent = "Add Task";
  if (elements.staffTaskCancel) elements.staffTaskCancel.hidden = true;
}

function populateVolunteerForm(volunteer) {
  if (!elements.volunteerForm || !volunteer) return;
  editingVolunteerId = volunteer.id;
  elements.volunteerForm.elements.name.value = volunteer.name || "";
  elements.volunteerForm.elements.areas.value = volunteer.areas || "";
  elements.volunteerForm.elements.role.value = volunteer.role || "";
  elements.volunteerForm.elements.ministrySafe.value = volunteer.ministrySafe || "Yes";
  elements.volunteerForm.elements.serviceCount.value = String(Number(volunteer.serviceCount) || 0);
  elements.volunteerForm.elements.phone.value = volunteer.phone || "";
  elements.volunteerForm.elements.email.value = volunteer.email || "";
  if (elements.volunteerSave) elements.volunteerSave.textContent = "Update Volunteer";
  if (elements.volunteerCancel) elements.volunteerCancel.hidden = false;
  if (elements.volunteerPhotoName) elements.volunteerPhotoName.textContent = "";
}

function resetVolunteerForm() {
  editingVolunteerId = null;
  if (elements.volunteerForm) elements.volunteerForm.reset();
  if (elements.volunteerPhotoName) elements.volunteerPhotoName.textContent = "";
  if (elements.volunteerSave) elements.volunteerSave.textContent = "Add Volunteer";
  if (elements.volunteerCancel) elements.volunteerCancel.hidden = true;
}

function populateDonorForm(donor) {
  if (!elements.donorForm || !donor) return;
  editingDonorId = donor.id;
  elements.donorForm.elements.name.value = donor.name || "";
  elements.donorForm.elements.phone.value = donor.phone || "";
  elements.donorForm.elements.email.value = donor.email || "";
  elements.donorForm.elements.donation.value = donor.donation || "";
  if (elements.donorSave) elements.donorSave.textContent = "Update Donor";
  if (elements.donorCancel) elements.donorCancel.hidden = false;
}

function resetDonorForm() {
  editingDonorId = null;
  if (elements.donorForm) elements.donorForm.reset();
  if (elements.donorSave) elements.donorSave.textContent = "Add Donor";
  if (elements.donorCancel) elements.donorCancel.hidden = true;
}

function populateResourceForm(resource) {
  if (!elements.resourceForm || !resource) return;
  editingResourceId = resource.id;
  toggleResourceForm(true);
  elements.resourceName.value = resource.name || "";
  elements.resourceCategory.value = resource.category || "";
  elements.resourcePhone.value = resource.phone || "";
  elements.resourceAddress.value = resource.address || "";
  elements.resourceEmail.value = resource.email || "";
  elements.resourceWebsite.value = resource.website || "";
  elements.resourceServices.value = resource.services || "";
  elements.resourceDropoff.value = resource.dropoff || "";
  if (elements.resourcePhotoName) elements.resourcePhotoName.textContent = "";
  if (elements.resourceSave) elements.resourceSave.textContent = "Update Resource";
}

function resetResourceForm() {
  editingResourceId = null;
  if (elements.resourceForm) elements.resourceForm.reset();
  if (elements.resourcePhotoName) elements.resourcePhotoName.textContent = "";
  if (elements.resourceSave) elements.resourceSave.textContent = "Save Resource";
  setError(elements.resourceError, "");
}

function getInitials(firstName, lastName) {
  const first = String(firstName || "").trim();
  const last = String(lastName || "").trim();
  const firstInitial = first ? first[0] : "";
  const lastInitial = last ? last[0] : "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  return initials || "?";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    image.src = url;
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Resize + compress profile photos so they fit in local storage.
async function readAndCompressImage(file) {
  if (!file) return "";
  if (file.size <= TARGET_PROFILE_PHOTO_BYTES) {
    return readFileAsDataUrl(file);
  }

  const image = await readImageElement(file);
  const scale = Math.min(
    PROFILE_PHOTO_MAX_DIMENSION / image.width,
    PROFILE_PHOTO_MAX_DIMENSION / image.height,
    1
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.9;
  let blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );

  while (blob && blob.size > TARGET_PROFILE_PHOTO_BYTES && quality > 0.5) {
    quality -= 0.1;
    blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
  }

  if (!blob || blob.size > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error("Compressed image too large");
  }

  return blobToDataUrl(blob);
}

function findItemGroup(normalizedName) {
  // Check custom items first so user-added groups are always accurate.
  if (state.customItems && state.customItems.length > 0) {
    const customMatch = state.customItems.find(
      (item) => item.name.toLowerCase() === normalizedName
    );
    if (customMatch && customMatch.group) return customMatch.group;
  }

  // Fall back to the default item groups.
  for (const group of ITEM_GROUPS) {
    if (group.items.some((itemName) => itemName.toLowerCase() === normalizedName)) {
      return group.label;
    }
  }

  return "";
}

function getGroupedItems() {
  const hiddenItems = new Set(state.hiddenItems || []);
  const groups = ITEM_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.filter((itemName) => !hiddenItems.has(itemName)),
  }));

  if (state.customItems && state.customItems.length > 0) {
    state.customItems.forEach((item) => {
      if (hiddenItems.has(item.name)) return;
      const target = groups.find((group) => group.label === item.group) || groups[0];
      if (!target.items.includes(item.name)) {
        target.items.push(item.name);
      }
    });
  }

  return groups;
}

function renderItems() {
  elements.itemsTable.innerHTML = "";
  getGroupedItems().forEach((group) => {
    const details = document.createElement("details");
    details.open = false;

    const summary = document.createElement("summary");
    summary.textContent = group.label;
    details.append(summary);

    const header = document.createElement("div");
    header.className = "table__row header";
    header.innerHTML = "<div>Item</div><div>Points</div>";
    details.append(header);

    group.items.forEach((itemName) => {
      const item = state.items.find((entry) => entry.name === itemName);
      if (!item) return;

      const row = document.createElement("div");
      row.className = "table__row";
      const name = document.createElement("div");
      name.textContent = item.name;

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = item.cost;
      input.addEventListener("change", () => {
        const previousValue = item.cost;
        const nextValue = Number(input.value);
        item.cost = Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
        logAdminAction(
          "Item Points Updated",
          `Changed ${item.name} from ${previousValue} pts to ${item.cost} pts`
        );
        saveState();
        renderAll();
      });

      const controls = document.createElement("div");
      controls.className = "inline-actions";
      const hide = document.createElement("button");
      hide.type = "button";
      hide.className = "btn small danger";
      hide.textContent = "Hide";
      hide.addEventListener("click", () => {
        if (!state.hiddenItems.includes(item.name)) {
          state.hiddenItems.push(item.name);
        }
        logAdminAction("Item Hidden", `Hid item ${item.name}`);
        saveState();
        renderAll();
      });
      controls.append(input, hide);

      row.append(name, controls);
      details.append(row);
    });

    elements.itemsTable.append(details);
  });
}

function renderActivity() {
  elements.activityTable.innerHTML = "";
  const header = document.createElement("div");
  header.className = "table__row header";
  header.innerHTML = "<div>Activity</div><div>Points</div>";
  elements.activityTable.append(header);

  const cutoff = logRangeFilter
    ? Date.now() - Number(logRangeFilter) * 24 * 60 * 60 * 1000
    : null;
  const entries = (state.activity || []).filter((entry) => {
    if (logTypeFilter && entry.type !== logTypeFilter) return false;
    const timestamp = Date.parse(entry.timestamp);
    if (cutoff && (!Number.isFinite(timestamp) || timestamp < cutoff)) return false;
    if (!logSearchTerm) return true;
    const personName = entry.personId ? getPersonName(entry.personId) : "Unknown";
    const haystack = [
      personName,
      entry.type,
      entry.note,
      entry.actor,
      entry.delta,
      Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(logSearchTerm);
  });

  if (elements.logFilterStatus) {
    const filters = [];
    if (logSearchTerm) filters.push(`matching "${elements.logSearch.value.trim()}"`);
    if (logTypeFilter) filters.push(titleCase(logTypeFilter));
    if (logRangeFilter) filters.push(`last ${logRangeFilter} days`);
    elements.logFilterStatus.textContent = `Showing ${entries.length} of ${
      state.activity.length
    } activity logs${filters.length ? ` (${filters.join(", ")})` : ""}.`;
  }

  if (state.activity.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No activity yet.</div><div>0</div>";
    elements.activityTable.append(empty);
    return;
  }

  if (entries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No activity matches those filters.</div><div>-</div>";
    elements.activityTable.append(empty);
    return;
  }

  const recent = entries.slice(0, 8);
  const rest = entries.slice(8);

  const renderEntryRow = (entry) => {
    const person = state.people.find((p) => p.id === entry.personId);
    const name = person ? `${person.firstName} ${person.lastName}` : "Unknown";
    const when = new Date(entry.timestamp);
    const row = document.createElement("div");
    row.className = "table__row";
    const left = document.createElement("div");
    const fromTo =
      Number.isFinite(entry.before) && Number.isFinite(entry.after)
        ? `from ${entry.before} to ${entry.after}`
        : "";
    const detailParts = [entry.note || entry.type];
    if (fromTo) detailParts.push(fromTo);
    if (entry.actor) detailParts.push(`by ${entry.actor}`);
    detailParts.push(when.toLocaleString());
    const detail = detailParts.join(" - ");
    left.innerHTML = `
      <strong>${name}</strong><br />
      <span class="hint">${detail}</span>
    `;
    const right = document.createElement("div");
    const sign = entry.delta >= 0 ? "+" : "";
    right.textContent = `${sign}${entry.delta}`;
    row.append(left, right);
    return row;
  };

  recent.forEach((entry) => {
    elements.activityTable.append(renderEntryRow(entry));
  });

  if (rest.length > 0) {
    const details = document.createElement("details");
    details.className = "activity-details";

    const summary = document.createElement("summary");
    summary.textContent = `Show ${rest.length} more`;
    details.append(summary);

    rest.forEach((entry) => {
      details.append(renderEntryRow(entry));
    });

    elements.activityTable.append(details);
  }
}

function renderStats() {
  elements.statPeople.textContent = String(state.people.length);
  const totalPoints = state.people.reduce((sum, person) => sum + person.points, 0);
  const average = state.people.length > 0 ? Math.round(totalPoints / state.people.length) : 0;
  if (elements.statAverage) {
    elements.statAverage.textContent = String(average);
  }
  if (elements.statDate) {
    elements.statDate.textContent = new Date().toLocaleDateString();
  }
}

function renderAdminLog() {
  if (!elements.adminTable) return;
  elements.adminTable.innerHTML = "";
  const header = document.createElement("div");
  header.className = "table__row header";
  header.innerHTML = "<div>Action</div><div>By / Status</div><div>Time</div>";
  elements.adminTable.append(header);

  const adminEntries = (state.adminLog || []).filter((entry) => {
    if (!adminLogSearchTerm) return true;
    const haystack = [
      entry.type,
      entry.detail,
      entry.actor,
      entry.status,
      formatLogDate(entry.timestamp),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(adminLogSearchTerm);
  });

  if (!state.adminLog || state.adminLog.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No admin actions yet.</div><div>-</div><div>-</div>";
    elements.adminTable.append(empty);
    return;
  }

  if (adminEntries.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No admin actions match that search.</div><div>-</div><div>-</div>";
    elements.adminTable.append(empty);
    return;
  }

  adminEntries.slice(0, 50).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "table__row";
    const left = document.createElement("div");
    left.textContent = entry.detail || entry.type || "Admin action";
    const status = document.createElement("div");
    status.innerHTML = `<strong>${entry.actor || "Unknown Staff"}</strong><br /><span class="hint">${entry.status || "Success"}</span>`;
    const right = document.createElement("div");
    right.textContent = new Date(entry.timestamp).toLocaleString();
    row.append(left, status, right);
    elements.adminTable.append(row);
  });

  if (adminEntries.length > 50) {
    const footer = document.createElement("div");
    footer.className = "table__row";
    footer.innerHTML = `<div>Showing newest 50 matching admin actions. Export logs for all ${adminEntries.length}.</div><div>-</div><div>-</div>`;
    elements.adminTable.append(footer);
  }
}

function renderCheckin() {
  if (!elements.checkinMember || !elements.checkinSummary || !elements.checkinHistory) return;
  if (!state.people.length) {
    elements.checkinSummary.innerHTML = "<p class='hint'>Add a member before using check-in.</p>";
    elements.checkinHistory.innerHTML = "<p class='hint'>No member selected.</p>";
    return;
  }
  if (selectedCheckinMemberId && state.people.some((person) => person.id === selectedCheckinMemberId)) {
    elements.checkinMember.value = selectedCheckinMemberId;
  }
  const personId = elements.checkinMember.value || state.people[0].id;
  selectedCheckinMemberId = personId;
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;
  const visits = getVisitEntriesForPerson(person.id);
  const lastVisit = visits[0] ? new Date(visits[0].timestamp).toLocaleString() : "No visits yet";
  elements.checkinSummary.innerHTML = `
    <div class="checkin-stat"><strong>${escapeHtml(`${person.firstName} ${person.lastName}`)}</strong><br />${person.points || 0} points</div>
    <div class="checkin-stat"><strong>Last Visit</strong><br />${escapeHtml(lastVisit)}</div>
    <div class="checkin-stat"><strong>Follow-Up</strong><br />${person.followUpNeeded ? escapeHtml(person.followUpNote || "Needed") : "Not flagged"}</div>
  `;
  if (elements.checkinFollowupToggle) {
    elements.checkinFollowupToggle.textContent = person.followUpNeeded
      ? "Clear Follow-Up"
      : "Mark Follow-Up";
  }
  const recentActivity = (state.activity || [])
    .filter((entry) => entry.personId === person.id)
    .slice(0, 6);
  elements.checkinHistory.innerHTML = `
    <h3>Recent History</h3>
    ${
      recentActivity.length
        ? recentActivity
            .map(
              (entry) =>
                `<div class="person__entry"><strong>${escapeHtml(entry.note || entry.type)}</strong><br /><span class="hint">${formatLogDate(entry.timestamp)}${entry.actor ? ` by ${escapeHtml(entry.actor)}` : ""}</span></div>`
            )
            .join("")
        : "<p class='hint'>No recent activity for this member.</p>"
    }
  `;
}

function renderInactiveMembers() {
  if (!elements.inactiveMembersList) return;
  const inactive = getInactiveMembers(30);
  if (!inactive.length) {
    elements.inactiveMembersList.innerHTML = "<p class='hint'>No inactive members right now.</p>";
    return;
  }
  elements.inactiveMembersList.innerHTML = inactive
    .slice(0, 20)
    .map((person) => {
      const lastVisit = getLastVisitTimestamp(person.id);
      return `
        <div class="person__entry">
          <strong>${escapeHtml(`${person.firstName} ${person.lastName}`)}</strong><br />
          <span class="hint">${lastVisit ? `Last visit: ${formatLogDate(lastVisit)}` : "No visits logged"}</span>
        </div>
      `;
    })
    .join("");
}

function renderRestoreControls() {
  if (elements.restoreTaskList) {
    const hiddenTasks = getAllTasksIncludingHidden().filter((task) =>
      (state.hiddenTasks || []).includes(task.id)
    );
    elements.restoreTaskList.innerHTML = hiddenTasks.length
      ? hiddenTasks
          .map(
            (task) => `
              <button class="btn small secondary" type="button" data-restore-task="${escapeHtml(task.id)}">
                Restore ${escapeHtml(task.label)}
              </button>
            `
          )
          .join("")
      : "<p class='hint'>No hidden tasks.</p>";
    elements.restoreTaskList.querySelectorAll("[data-restore-task]").forEach((button) => {
      button.addEventListener("click", () => {
        const taskId = button.getAttribute("data-restore-task");
        state.hiddenTasks = (state.hiddenTasks || []).filter((id) => id !== taskId);
        logAdminAction("Task Restored", `Restored task ${taskId}`);
        saveState();
        renderAll();
      });
    });
  }
  if (elements.restoreItemList) {
    const hiddenItems = (state.hiddenItems || []).filter((name) =>
      state.items.some((item) => item.name === name)
    );
    elements.restoreItemList.innerHTML = hiddenItems.length
      ? hiddenItems
          .map(
            (name) => `
              <button class="btn small secondary" type="button" data-restore-item="${escapeHtml(name)}">
                Restore ${escapeHtml(name)}
              </button>
            `
          )
          .join("")
      : "<p class='hint'>No hidden items.</p>";
    elements.restoreItemList.querySelectorAll("[data-restore-item]").forEach((button) => {
      button.addEventListener("click", () => {
        const itemName = button.getAttribute("data-restore-item");
        state.hiddenItems = (state.hiddenItems || []).filter((name) => name !== itemName);
        logAdminAction("Item Restored", `Restored item ${itemName}`);
        saveState();
        renderAll();
      });
    });
  }
}

function formatLogDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPersonName(personId) {
  const person = state.people.find((entry) => entry.id === personId);
  return person ? `${person.firstName} ${person.lastName}`.trim() : "Unknown";
}

function buildLogExportTables() {
  const latestBackup = getLatestSafetyBackup();
  const activity = (state.activity || []).map((entry) => [
    formatLogDate(entry.timestamp),
    entry.personId ? getPersonName(entry.personId) : "",
    entry.type || "",
    Number.isFinite(entry.delta) ? entry.delta : "",
    Number.isFinite(entry.before) ? entry.before : "",
    Number.isFinite(entry.after) ? entry.after : "",
    entry.note || "",
    entry.actor || "",
  ]);
  const adminActions = (state.adminLog || []).map((entry) => [
    formatLogDate(entry.timestamp),
    entry.type || "",
    entry.detail || "",
    entry.actor || "",
    entry.status || "Success",
  ]);
  const memberSummary = (state.people || []).map((person) => {
    const lastVisit = getLastVisitTimestamp(person.id);
    return [
      `${person.firstName} ${person.lastName}`.trim(),
      person.points || 0,
      person.residenceTag || "",
      person.home || person.address || "",
      formatPhone(person.phone) || "",
      person.email || "",
      getVisitCount(person.id),
      lastVisit ? formatLogDate(lastVisit) : "",
    ];
  });
  const redeemedItems = [];
  (state.activity || []).forEach((entry) => {
    if (entry.type !== "redeem") return;
    parseRedeemNote(entry.note || "").forEach((item) => {
      redeemedItems.push([
        formatLogDate(entry.timestamp),
        entry.personId ? getPersonName(entry.personId) : "",
        item.name,
        item.quantity,
        findItemGroup(item.name.toLowerCase()) || "Other",
        Math.abs(Number(entry.delta) || 0),
        entry.actor || "",
      ]);
    });
  });
  const topTasks = getTopTasks(30).map((task) => [task.label, task.count]);
  const signInRows = (state.people || []).map((person) => [
    `${person.firstName} ${person.lastName}`.trim(),
    person.residenceTag || "",
    formatPhone(person.phone) || "",
    "",
    "",
  ]);

  return {
    overview: [
      ["Lighthouse Ministry Hub - Logs Export"],
      ["Generated", formatLogDate(new Date().toISOString())],
      ["Members", state.people.length],
      ["Activity Entries", state.activity.length],
      ["Admin Actions", state.adminLog.length],
      [
        "Latest Safety Backup",
        latestBackup
          ? `${formatLogDate(latestBackup.exportedAt)} (${latestBackup.reason || "Snapshot"})`
          : "None",
      ],
    ],
    activity: [
      [
        "Date / Time",
        "Member",
        "Action Type",
        "Points Change",
        "Before",
        "After",
        "Note",
        "Updated By",
      ],
      ...activity,
    ],
    adminActions: [["Date / Time", "Action", "Detail", "Actor", "Status"], ...adminActions],
    memberSummary: [
      [
        "Member",
        "Points",
        "Residence Tag",
        "Address / Home",
        "Phone",
        "Email",
        "Visits",
        "Last Visit",
      ],
      ...memberSummary,
    ],
    redeemedItems: [
      ["Date / Time", "Member", "Item", "Quantity", "Category", "Points Used", "Updated By"],
      ...redeemedItems,
    ],
    topTasks: [["Task", "Times Awarded - Last 30 Days"], ...topTasks],
    signInSheet: [["Member", "Residence Tag", "Phone", "Signature", "Notes"], ...signInRows],
  };
}

function makeWorksheet(rows, widths) {
  const sheet = window.XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = widths.map((width) => ({ wch: width }));
  const maxColumns = Math.max(1, ...rows.map((row) => row.length));
  sheet["!autofilter"] = {
    ref: window.XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: Math.max(0, rows.length - 1), c: maxColumns - 1 },
    }),
  };
  return sheet;
}

function exportLogsWorkbook() {
  if (!window.XLSX || !window.XLSX.utils || !window.XLSX.writeFile) {
    exportLogsHtmlWorkbook();
    return;
  }
  const tables = buildLogExportTables();
  const workbook = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.overview, [32, 55]),
    "Overview"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.activity, [22, 24, 16, 14, 10, 10, 52, 18]),
    "Activity Log"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.adminActions, [22, 22, 58, 18, 14]),
    "Admin Actions"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.memberSummary, [26, 10, 18, 32, 16, 28, 10, 22]),
    "Member Summary"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.redeemedItems, [22, 26, 26, 10, 18, 12, 18]),
    "Redeemed Items"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.topTasks, [34, 18]),
    "Top Tasks"
  );
  window.XLSX.utils.book_append_sheet(
    workbook,
    makeWorksheet(tables.signInSheet, [28, 18, 16, 22, 32]),
    "Sign-In Sheet"
  );
  window.XLSX.writeFile(
    workbook,
    `lighthouse-logs-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
  logAdminAction("Export", "Exported organized Excel logs workbook");
}

function logsTableHtml(title, rows, emptyMessage, options = {}) {
  const headings = rows[0] || [];
  const bodyRows = rows.slice(1);
  const visibleRows = options.limit ? bodyRows.slice(0, options.limit) : bodyRows;
  const hiddenCount = options.limit ? Math.max(0, bodyRows.length - visibleRows.length) : 0;
  return `
    <h2>${escapeHtml(title)}</h2>
    ${
      hiddenCount
        ? `<p class="section-note">Showing the newest ${visibleRows.length} of ${bodyRows.length} rows. Export to Excel for the full log.</p>`
        : ""
    }
    <table>
      <thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join("")}</tr></thead>
      <tbody>${tableRowsHtml(visibleRows, emptyMessage, Math.max(1, headings.length))}</tbody>
    </table>
  `;
}

function buildLogsReportHtml(options = {}) {
  const tables = buildLogExportTables();
  const latestBackup = getLatestSafetyBackup();
  const fullReport = options.full === true;
  return `
    <!doctype html>
    <html>
      <head>
        <title>Lighthouse Logs Report</title>
        <style>
          body { font-family: Georgia, "Times New Roman", serif; color: #173226; padding: 32px; background: #fffdf8; }
          h1 { margin: 0 0 4px; font-size: 34px; }
          h2 { margin: 30px 0 10px; border-bottom: 2px solid #d7b676; padding-bottom: 8px; color: #173226; }
          .meta, .section-note { color: #6d5b46; margin-top: 0; }
          .overview { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 22px 0; }
          .metric { border: 1px solid #dfd2bd; border-radius: 14px; padding: 14px; background: #fff6e6; }
          .metric span { display: block; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #6d5b46; }
          .metric strong { display: block; margin-top: 4px; font-size: 24px; color: #19743a; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; background: #ffffff; }
          th, td { border: 1px solid #dfd2bd; padding: 9px; text-align: left; vertical-align: top; }
          th { background: #173226; color: #fffaf0; font-weight: 700; }
          tr:nth-child(even) td { background: #fffaf2; }
          @media print {
            body { padding: 18px; background: #ffffff; }
            .overview { grid-template-columns: repeat(2, 1fr); }
            h2 { break-after: avoid; }
            table { break-inside: auto; }
            tr { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Lighthouse Logs Report</h1>
        <p class="meta">
          Generated ${formatLogDate(new Date().toISOString())}
          ${fullReport ? " | Complete export" : " | Print summary"}
        </p>
        <div class="overview">
          <div class="metric"><span>Members</span><strong>${state.people.length}</strong></div>
          <div class="metric"><span>Activity Entries</span><strong>${state.activity.length}</strong></div>
          <div class="metric"><span>Admin Actions</span><strong>${state.adminLog.length}</strong></div>
          <div class="metric"><span>Latest Safety Backup</span><strong>${
            latestBackup ? formatLogDate(latestBackup.exportedAt) : "None"
          }</strong></div>
        </div>
        ${logsTableHtml(
          fullReport ? "Activity Log" : "Recent Activity",
          tables.activity,
          "No activity logged yet.",
          fullReport ? {} : { limit: 25 }
        )}
        ${logsTableHtml(
          fullReport ? "Admin Actions" : "Recent Admin Actions",
          tables.adminActions,
          "No admin actions logged yet.",
          fullReport ? {} : { limit: 20 }
        )}
        ${logsTableHtml("Redeemed Items", tables.redeemedItems, "No redeemed items logged yet.", fullReport ? {} : { limit: 30 })}
        ${logsTableHtml("Top Tasks", tables.topTasks, "No task awards logged yet.", fullReport ? {} : { limit: 10 })}
        ${
          fullReport
            ? `${logsTableHtml("Member Summary", tables.memberSummary, "No members found.")}
               ${logsTableHtml("Sign-In Sheet", tables.signInSheet, "No members found.")}`
            : ""
        }
      </body>
    </html>
  `;
}

function exportLogsHtmlWorkbook() {
  const html = buildLogsReportHtml({ full: true });
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  downloadBlobFile(
    `lighthouse-logs-report-${new Date().toISOString().slice(0, 10)}.xls`,
    blob
  );
  logAdminAction("Export", "Exported formatted Excel-compatible logs report");
}

function renderSummary() {
  if (!elements.summaryMembers || !elements.summaryItems || !elements.summaryCategory) {
    return;
  }
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  const startTime = start.getTime();
  const membersServed = new Set();
  let itemsRedeemed = 0;
  const categoryCounts = {};

  const visitSummary = getTodayVisits();
  visitSummary.memberIds.forEach((id) => membersServed.add(id));

  state.activity.forEach((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < startTime) return;
    if (entry.personId) membersServed.add(entry.personId);
    if (entry.type !== "redeem") return;
    const parsedItems = parseRedeemNote(entry.note || "");
    parsedItems.forEach((item) => {
      itemsRedeemed += item.quantity;
      const group = findItemGroup(item.name.toLowerCase());
      const label = group || "Other";
      categoryCounts[label] = (categoryCounts[label] || 0) + item.quantity;
    });
  });

  let topCategory = "-";
  let bestCount = 0;
  Object.entries(categoryCounts).forEach(([label, count]) => {
    if (count <= bestCount) return;
    bestCount = count;
    topCategory = label;
  });

  elements.summaryMembers.textContent = String(membersServed.size);
  elements.summaryItems.textContent = String(itemsRedeemed);
  elements.summaryCategory.textContent = topCategory;
}

function renderMemberTagFilter() {
  if (!elements.memberTagFilter) return;
  const current = elements.memberTagFilter.value;
  elements.memberTagFilter.innerHTML = '<option value="">All Tags</option>';
  getResidenceTagOptions().forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    elements.memberTagFilter.append(option);
  });
  if (current) {
    elements.memberTagFilter.value = current;
  }
}

function getEventsForMonth(monthDate) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  return (state.events || [])
    .filter((eventItem) => {
      const date = new Date(eventItem.date);
      return date >= start && date <= end;
    })
    .sort((a, b) => Date.parse(a.date || 0) - Date.parse(b.date || 0));
}

function renderCalendar() {
  if (!elements.calendarGrid || !elements.calendarTitle || !elements.calendarEvents) return;
  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const startDay = monthStart.getDay();
  const totalDays = monthEnd.getDate();
  const events = getEventsForMonth(calendarMonth);
  const byDay = {};
  events.forEach((eventItem) => {
    const day = new Date(eventItem.date).getDate();
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(eventItem);
  });

  elements.calendarTitle.textContent = monthStart.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
  elements.calendarGrid.innerHTML = "";
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((label) => {
    const header = document.createElement("div");
    header.className = "calendar-day calendar-day--header";
    header.textContent = label;
    elements.calendarGrid.append(header);
  });

  for (let i = 0; i < startDay; i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-day calendar-day--empty";
    elements.calendarGrid.append(empty);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    const isToday =
      day === new Date().getDate() &&
      calendarMonth.getMonth() === new Date().getMonth() &&
      calendarMonth.getFullYear() === new Date().getFullYear();
    const isWeekend = (startDay + day - 1) % 7 === 0 || (startDay + day - 1) % 7 === 6;
    if (isToday) {
      cell.classList.add("calendar-day--today");
    }
    if (isWeekend) {
      cell.classList.add("calendar-day--weekend");
    }
    if ((byDay[day] || []).length > 0) {
      cell.classList.add("calendar-day--busy");
    }
    const number = document.createElement("div");
    number.className = "calendar-date";
    number.textContent = String(day);
    cell.append(number);
    (byDay[day] || []).slice(0, 2).forEach((eventItem) => {
      const wrap = document.createElement("div");
      wrap.className = "calendar-event-wrap";

      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "calendar-event";
      badge.textContent = eventItem.title;
      badge.setAttribute("aria-label", buildEventTooltip(eventItem));

      const popover = document.createElement("div");
      popover.className = "calendar-popover";

      const popoverTitle = document.createElement("div");
      popoverTitle.className = "calendar-popover__title";
      popoverTitle.textContent = eventItem.title;

      const popoverDate = document.createElement("div");
      popoverDate.className = "calendar-popover__date";
      popoverDate.textContent = new Date(eventItem.date).toLocaleDateString();

      const popoverDescription = document.createElement("div");
      popoverDescription.className = "calendar-popover__description";
      popoverDescription.textContent = eventItem.description || "No description added.";

      const checklist = document.createElement("div");
      checklist.className = "calendar-popover__checklist";
      if (Array.isArray(eventItem.checklist) && eventItem.checklist.length > 0) {
        eventItem.checklist.forEach((entry) => {
          const checklistRow = document.createElement("label");
          checklistRow.className = "calendar-checklist-row";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = Boolean(entry.done);
          checkbox.addEventListener("change", () => {
            entry.done = checkbox.checked;
            logAdminAction(
              "Event Checklist Updated",
              `${entry.done ? "Completed" : "Reopened"} "${entry.title}" for ${eventItem.title}`
            );
            saveState();
            renderEvents();
          });
          const text = document.createElement("span");
          text.textContent = entry.title;
          checklistRow.append(checkbox, text);
          checklist.append(checklistRow);
        });
      } else {
        const empty = document.createElement("div");
        empty.className = "calendar-popover__empty";
        empty.textContent = "No checklist items.";
        checklist.append(empty);
      }

      popover.append(popoverTitle, popoverDate, popoverDescription, checklist);
      wrap.append(badge, popover);
      cell.append(wrap);
    });
    if ((byDay[day] || []).length > 2) {
      const more = document.createElement("div");
      more.className = "calendar-more";
      more.textContent = `+${byDay[day].length - 2} more`;
      cell.append(more);
    }
    elements.calendarGrid.append(cell);
  }

  elements.calendarEvents.innerHTML = "";
}

function renderStaffTaskBoard() {
  if (!elements.staffTaskList) return;
  elements.staffTaskList.innerHTML = "";
  const todos = (state.staffTodosGlobal || []).filter(
    (todo) => !todo.ownerId || (currentStaffUser && todo.ownerId === currentStaffUser.id)
  );
  if (todos.length === 0) {
    elements.staffTaskList.innerHTML = "<p class='hint'>No staff reminders yet.</p>";
    return;
  }
  todos.forEach((todo) => {
    const row = document.createElement("div");
    row.className = "todo-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(todo.done);
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      logAdminAction(
        "Staff Reminder Updated",
        `${todo.done ? "Completed" : "Reopened"} staff reminder "${todo.title}"`
      );
      saveState();
    });
    const text = document.createElement("span");
    text.textContent = todo.title;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn small danger";
    remove.textContent = "Remove";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn small secondary";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      editingStaffTodoId = todo.id;
      if (elements.staffTaskInput) elements.staffTaskInput.value = todo.title;
      if (elements.staffTaskSave) elements.staffTaskSave.textContent = "Update Task";
      if (elements.staffTaskCancel) elements.staffTaskCancel.hidden = false;
      if (elements.staffTaskInput) elements.staffTaskInput.focus();
    });
    remove.addEventListener("click", () => {
      state.staffTodosGlobal = state.staffTodosGlobal.filter((entry) => entry.id !== todo.id);
      logAdminAction("Staff Reminder Removed", `Removed staff reminder "${todo.title}"`);
      saveState();
      resetStaffTodoForm();
      renderStaffTaskBoard();
    });
    row.append(checkbox, text, edit, remove);
    elements.staffTaskList.append(row);
  });
}

function renderDonors() {
  if (!elements.donorList) return;
  elements.donorList.innerHTML = "";
  const header = document.createElement("div");
  header.className = "table__row header";
  header.innerHTML = "<div>Donor</div><div>Contact</div><div>Donation</div>";
  elements.donorList.append(header);
  if (!state.donors || state.donors.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No donors added yet.</div><div>-</div><div>-</div>";
    elements.donorList.append(empty);
    return;
  }
  state.donors.forEach((donor) => {
    const row = document.createElement("div");
    row.className = "table__row";
    const name = document.createElement("div");
    name.innerHTML = `<strong>${escapeHtml(donor.name)}</strong>`;
    const contact = document.createElement("div");
    contact.innerHTML = `${escapeHtml(formatPhone(donor.phone) || "No phone")}<br /><span class="hint">${escapeHtml(donor.email || "No email")}</span>`;
    const donation = document.createElement("div");
    donation.innerHTML = `${escapeHtml(donor.donation)}<br />`;
    const actionWrap = document.createElement("div");
    actionWrap.className = "inline-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn small secondary";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      populateDonorForm(donor);
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn small danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.donors = state.donors.filter((entry) => entry.id !== donor.id);
      logAdminAction("Donor Removed", `Removed donor ${donor.name}`);
      saveState();
      resetDonorForm();
      renderDonors();
    });
    actionWrap.append(edit, remove);
    donation.append(actionWrap);
    row.append(name, contact, donation);
    elements.donorList.append(row);
  });
}

function renderDocuments() {
  if (!elements.documentList) return;
  elements.documentList.innerHTML = "";
  const header = document.createElement("div");
  header.className = "table__row header";
  header.innerHTML = "<div>Document</div><div>Category</div><div>Actions</div>";
  elements.documentList.append(header);
  if (!state.documents || state.documents.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No documents uploaded yet.</div><div>-</div><div>-</div>";
    elements.documentList.append(empty);
    return;
  }
  state.documents.forEach((documentItem) => {
    const row = document.createElement("div");
    row.className = "table__row";
    const info = document.createElement("div");
    info.innerHTML = `<strong>${escapeHtml(documentItem.title)}</strong><br /><span class="hint">${escapeHtml(documentItem.fileName || "")}</span>`;
    const category = document.createElement("div");
    category.textContent = documentItem.category || "General";
    const actions = document.createElement("div");
    actions.className = "inline-actions";
    const view = document.createElement("button");
    view.type = "button";
    view.className = "btn small secondary";
    view.textContent = "View";
    view.addEventListener("click", () => {
      viewDocument(documentItem);
    });
    const download = document.createElement("button");
    download.type = "button";
    download.className = "btn small primary";
    download.textContent = "Download";
    download.addEventListener("click", () => {
      downloadDataUrl(documentItem.fileName || documentItem.title, documentItem.dataUrl);
    });
    actions.append(view, download);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn small danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      state.documents = state.documents.filter((entry) => entry.id !== documentItem.id);
      logAdminAction(
        "Document Removed",
        `Removed document ${documentItem.title || documentItem.fileName || "Untitled"}`
      );
      saveState();
      renderDocuments();
    });
    actions.append(remove);
    row.append(info, category, actions);
    elements.documentList.append(row);
  });
}

function renderVolunteers() {
  if (!elements.volunteerList) return;
  elements.volunteerList.innerHTML = "";
  const sortMode = elements.volunteerSort ? elements.volunteerSort.value : "name";
  const volunteers = [...(state.volunteers || [])].sort((a, b) => {
    if (sortMode === "regular") {
      return (Number(b.serviceCount) || 0) - (Number(a.serviceCount) || 0);
    }
    return (a.name || "").localeCompare(b.name || "");
  });

  if (volunteers.length === 0) {
    elements.volunteerList.innerHTML = "<p class='hint'>No volunteers added yet.</p>";
    return;
  }

  const createVolunteerCard = (volunteer) => {
    const card = document.createElement("div");
    card.className = "person volunteer-card";
    const info = document.createElement("div");
    info.className = "person__info";
    const avatarContent = volunteer.profilePhoto
      ? `<img src="${volunteer.profilePhoto}" alt="${escapeHtml(volunteer.name)}" />`
      : getInitials(volunteer.name, "");
    info.innerHTML = `
      <div class="person__avatar volunteer-avatar">${avatarContent}</div>
      <div>
        <div class="person__name">${volunteer.name}</div>
        <div class="person__meta">${volunteer.role || "Volunteer"} | Areas: ${volunteer.areas || "Unassigned"}</div>
        <div class="person__meta">Ministry Safe: ${volunteer.ministrySafe || "No"} | Times Served: ${Number(volunteer.serviceCount) || 0}</div>
        <div class="person__meta">${volunteer.phone || "No phone"}${volunteer.email ? ` | ${volunteer.email}` : ""}</div>
      </div>
    `;
    card.append(info);
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn small secondary";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      populateVolunteerForm(volunteer);
    });
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn small danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      state.volunteers = state.volunteers.filter((entry) => entry.id !== volunteer.id);
      logAdminAction("Volunteer Removed", `Removed volunteer ${volunteer.name}`);
      saveState();
      resetVolunteerForm();
      renderVolunteers();
    });
    const actionWrap = document.createElement("div");
    actionWrap.className = "person__actions";
    actionWrap.append(editButton, removeButton);
    card.append(actionWrap);
    return card;
  };

  const featuredVolunteers = volunteers.slice(0, 3);
  const remainingVolunteers = volunteers.slice(3);

  featuredVolunteers.forEach((volunteer) => {
    elements.volunteerList.append(createVolunteerCard(volunteer));
  });

  if (remainingVolunteers.length > 0) {
    const details = document.createElement("details");
    details.className = "activity-details";
    const summary = document.createElement("summary");
    summary.textContent = `Show ${remainingVolunteers.length} more volunteers`;
    details.append(summary);
    remainingVolunteers.forEach((volunteer) => {
      details.append(createVolunteerCard(volunteer));
    });
    elements.volunteerList.append(details);
  }
}

function renderResources() {
  if (!elements.resourceList) return;
  elements.resourceList.innerHTML = "";
  const searchTerm = elements.resourceSearch ? normalizeLabel(elements.resourceSearch.value) : "";
  const resources = [...(state.resources || [])]
    .filter((resource) => {
      if (!searchTerm) return true;
      const haystack = normalizeLabel(
        `${resource.name} ${resource.category} ${resource.services} ${resource.address} ${resource.dropoff}`
      );
      return haystack.includes(searchTerm);
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  if (resources.length === 0) {
    elements.resourceList.innerHTML = "<p class='hint'>No matching resources found.</p>";
    return;
  }
  resources.forEach((resource) => {
    const card = document.createElement("details");
    card.className = "resource-card";
    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="resource-card__summary">
        <div>
          <strong>${escapeHtml(resource.name)}</strong>
          <div class="person__meta">${escapeHtml(resource.category)}</div>
        </div>
        <div class="person__meta">${escapeHtml(formatPhone(resource.phone) || "")}</div>
      </div>
    `;
    card.append(summary);
    const body = document.createElement("div");
    body.className = "resource-card__body";
    if (resource.photo) {
      const image = document.createElement("img");
      image.src = resource.photo;
      image.alt = resource.name;
      image.className = "resource-photo";
      body.append(image);
    }
    const details = document.createElement("div");
    details.className = "resource-card__details";
    details.innerHTML = `
      <div class="person__entry"><strong>Services:</strong> ${escapeHtml(resource.services)}</div>
      <div class="person__entry"><strong>Address:</strong> ${escapeHtml(resource.address || "Not listed")}</div>
      <div class="person__entry"><strong>Phone:</strong> ${escapeHtml(formatPhone(resource.phone) || "Not listed")}</div>
      <div class="person__entry"><strong>Email:</strong> ${escapeHtml(resource.email || "Not listed")}</div>
      <div class="person__entry"><strong>Website:</strong> ${
        resource.website
          ? `<a href="${escapeHtml(resource.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.website)}</a>`
          : "Not listed"
      }</div>
      <div class="person__entry"><strong>Drop-Off / Notes:</strong> ${escapeHtml(resource.dropoff || "None listed")}</div>
    `;
    const actions = document.createElement("div");
    actions.className = "inline-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn small secondary";
    edit.textContent = "Edit";
    edit.addEventListener("click", (event) => {
      event.preventDefault();
      populateResourceForm(resource);
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn small danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      state.resources = state.resources.filter((entry) => entry.id !== resource.id);
      logAdminAction("Resource Removed", `Removed resource ${resource.name}`);
      saveState();
      renderResources();
    });
    actions.append(edit, remove);
    details.append(actions);
    body.append(details);
    card.append(body);
    elements.resourceList.append(card);
  });
}

function renderEvents() {
  if (!elements.eventList) return;
  elements.eventList.innerHTML = "";
  const events = [...(state.events || [])].sort(
    (a, b) => Date.parse(a.date || 0) - Date.parse(b.date || 0)
  );
  if (events.length === 0) {
    elements.eventList.innerHTML = "<p class='hint'>No upcoming events yet.</p>";
    return;
  }

  events.forEach((eventItem) => {
    const details = document.createElement("details");
    details.className = "event-card";
    const summary = document.createElement("summary");
    summary.textContent = `${eventItem.title} | ${new Date(eventItem.date).toLocaleDateString()}`;
    summary.title = buildEventTooltip(eventItem);
    details.append(summary);
    const list = document.createElement("div");
    list.className = "person__activity";
    if (eventItem.description) {
      const description = document.createElement("div");
      description.className = "person__entry";
      description.textContent = eventItem.description;
      list.append(description);
    }
    (eventItem.checklist || []).forEach((entry) => {
      const row = document.createElement("label");
      row.className = "todo-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(entry.done);
      checkbox.addEventListener("change", () => {
        entry.done = checkbox.checked;
        logAdminAction(
          "Event Checklist Updated",
          `${entry.done ? "Completed" : "Reopened"} "${entry.title}" for ${eventItem.title}`
        );
        saveState();
      });
      const text = document.createElement("span");
      text.textContent = entry.title;
      row.append(checkbox, text);
      list.append(row);
    });
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn small danger";
    removeButton.textContent = "Remove Event";
    removeButton.addEventListener("click", () => {
      state.events = state.events.filter((entry) => entry.id !== eventItem.id);
      logAdminAction("Event Removed", `Removed event ${eventItem.title}`);
      saveState();
      renderCalendar();
      renderEvents();
    });
    list.append(removeButton);
    details.append(list);
    elements.eventList.append(details);
  });
}

function renderStaffUsers() {
  if (!elements.staffUserList) return;
  elements.staffUserList.innerHTML = "";
  const header = document.createElement("div");
  header.className = "table__row header";
  header.innerHTML = "<div>Staff Account</div><div>Username</div><div>Actions</div>";
  elements.staffUserList.append(header);
  state.staffUsers.forEach((user) => {
    const row = document.createElement("div");
    row.className = "table__row";
    const displayName = document.createElement("div");
    displayName.textContent = user.displayName;
    const username = document.createElement("div");
    username.textContent = user.username;
    const actions = document.createElement("div");
    actions.className = "inline-actions";
    const changePassword = document.createElement("button");
    changePassword.type = "button";
    changePassword.className = "btn small secondary";
    changePassword.textContent = "Change Password";
    changePassword.addEventListener("click", () => {
      requestSensitiveConfirmation({
        title: "Change Staff Password",
        message: `Enter staff credentials and the new password for ${user.displayName}. A safety backup will be saved first.`,
        actionLabel: "Change Password",
        backupReason: `Before changing password for staff account ${user.username}`,
        requiresNewPassword: true,
        onConfirm: ({ confirmedBy, newPassword }) => {
          user.password = newPassword;
          logAdminAction(
            "Staff Password Changed",
            `Changed password for ${user.username} after confirmation by ${
              confirmedBy.displayName || confirmedBy.username
            }`
          );
          saveState();
          renderStaffUsers();
        },
      });
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn small danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      if (state.staffUsers.length <= 1) {
        alert("You must keep at least one staff account.");
        return;
      }
      if (currentStaffUser && currentStaffUser.id === user.id) {
        alert("You cannot delete the account that is currently signed in.");
        return;
      }
      requestSensitiveConfirmation({
        title: "Delete Staff Account",
        message: `Enter staff credentials to delete ${user.displayName}'s staff account. A safety backup will be saved first.`,
        actionLabel: "Delete Staff",
        backupReason: `Before deleting staff account ${user.username}`,
        onConfirm: ({ confirmedBy }) => {
          state.staffUsers = state.staffUsers.filter((entry) => entry.id !== user.id);
          logAdminAction(
            "Staff Account Deleted",
            `Deleted staff account ${user.username} after confirmation by ${
              confirmedBy.displayName || confirmedBy.username
            }`
          );
          saveState();
          renderStaffUsers();
        },
      });
    });
    actions.append(changePassword, remove);
    row.append(displayName, username, actions);
    elements.staffUserList.append(row);
  });
}

if (elements.removeTaskToggle) {
  elements.removeTaskToggle.addEventListener("click", () => {
    taskRemoveMode = !taskRemoveMode;
    if (taskRemoveMode) {
      closeTaskEditor();
    }
    updateTaskRemoveMode();
  });
}

function getTodayVisits() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const startTime = start.getTime();
  const memberIds = new Set();
  (state.visits || []).forEach((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < startTime) return;
    if (entry.personId) memberIds.add(entry.personId);
  });
  return { memberIds };
}

function scheduleDailySummaryRefresh() {
  if (dailyRefreshTimer) clearTimeout(dailyRefreshTimer);
  if (dailyRefreshInterval) clearInterval(dailyRefreshInterval);

  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  dailyRefreshTimer = setTimeout(() => {
    renderAll();
    dailyRefreshInterval = setInterval(() => {
      renderAll();
    }, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
}

function logAdminAction(type, detail, status) {
  state.adminLog.unshift({
    id: crypto.randomUUID(),
    type,
    detail,
    actor: getCurrentActorName(),
    status: status || "Success",
    timestamp: new Date().toISOString(),
  });
  state.adminLog = state.adminLog.slice(0, MAX_ADMIN_LOG_ENTRIES);
  saveState();
  renderAdminLog();
  renderBackupStatus();
}

function parseRedeemNote(note) {
  if (!note) return [];
  return note
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(\d+)\s*x\s*(.+)$/i);
      if (!match) return null;
      return { quantity: Number(match[1]), name: match[2].trim() };
    })
    .filter((entry) => entry && Number.isFinite(entry.quantity) && entry.quantity > 0);
}

function updateStaffVisibility() {
  updateLoginGate();
  if (elements.staffStatus) {
    elements.staffStatus.textContent = staffMode
      ? currentStaffUser
        ? currentStaffUser.displayName
        : "On"
      : "Off";
  }
  if (elements.staffToggle) {
    elements.staffToggle.textContent = "Sign Out";
  }
}

function updateLoginGate() {
  document.body.classList.toggle("is-locked", !staffMode);
  if (elements.loginGate) {
    elements.loginGate.hidden = staffMode;
  }
  const appPage = document.querySelector(".page");
  if (appPage) {
    appPage.hidden = !staffMode;
  }
}

function handleStaffLoginSubmit(form, errorElement) {
  const formData = new FormData(form);
  const username = normalizeLabel(formData.get("username"));
  const password = String(formData.get("password") || "").trim();
  const match = state.staffUsers.find(
    (entry) => entry.username === username && entry.password === password
  );
  if (!match) {
    setError(errorElement, "Invalid username or password.");
    logAdminAction("Staff Login", `Denied login for ${username || "unknown"}`, "Denied");
    return;
  }
  setError(errorElement, "");
  setStaffMode(true, match);
  logAdminAction("Staff Login", `Signed in as ${match.displayName}`);
}

function setStaffMode(enabled, user) {
  staffMode = Boolean(enabled);
  currentStaffUser = staffMode ? user || currentStaffUser : null;
  sessionStorage.setItem(STAFF_MODE_KEY, staffMode ? "true" : "false");
  if (currentStaffUser) {
    sessionStorage.setItem(STAFF_USER_KEY, currentStaffUser.id);
  } else {
    sessionStorage.removeItem(STAFF_USER_KEY);
  }
  renderAll();
}

function setDefaultDateJoined() {
  if (!elements.memberDateJoined) return;
  if (elements.memberDateJoined.value) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  elements.memberDateJoined.value = `${yyyy}-${mm}-${dd}`;
}

function attachPhoneSanitizer() {
  if (!elements.memberPhone) return;
  elements.memberPhone.addEventListener("input", () => {
    elements.memberPhone.value = sanitizePhone(elements.memberPhone.value);
  });
}

function attachMemberSearch() {
  if (!elements.memberSearch) return;
  elements.memberSearch.addEventListener("input", () => {
    renderPeople();
  });
}

function attachMemberFilters() {
  if (elements.memberTagFilter) {
    elements.memberTagFilter.addEventListener("change", () => {
      renderPeople();
    });
  }
  if (elements.memberSort) {
    elements.memberSort.addEventListener("change", () => {
      renderPeople();
    });
  }
  if (elements.printSignin) {
    elements.printSignin.addEventListener("click", () => {
      printSigninSheet();
    });
  }
}

function attachRedeemPointsListener() {
  if (!elements.redeemForm) return;
  const select = elements.redeemForm.querySelector("select[name='personId']");
  if (!select) return;
  select.addEventListener("change", () => {
    renderRedeemPoints();
  });
}

function attachVolunteerSort() {
  if (!elements.volunteerSort) return;
  elements.volunteerSort.addEventListener("change", () => {
    renderVolunteers();
  });
}

function attachCalendarControls() {
  if (elements.calendarPrev) {
    elements.calendarPrev.addEventListener("click", () => {
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
      renderCalendar();
    });
  }
  if (elements.calendarNext) {
    elements.calendarNext.addEventListener("click", () => {
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
      renderCalendar();
    });
  }
}

function attachStaffLogin() {
  if (elements.gateLoginForm) {
    elements.gateLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleStaffLoginSubmit(elements.gateLoginForm, elements.gateLoginError);
    });
  }
}

function requestSensitiveConfirmation(config) {
  if (!elements.sensitiveModal || !elements.sensitiveForm) {
    if (config.backupReason && !createSafetyBackup(config.backupReason)) return;
    config.onConfirm({ confirmedBy: currentStaffUser });
    return;
  }
  pendingSensitiveAction = config;
  elements.sensitiveTitle.textContent = config.title || "Confirm Staff Login";
  elements.sensitiveMessage.textContent =
    config.message || "Enter a staff username and password to continue.";
  elements.sensitiveSubmit.textContent = config.actionLabel || "Confirm";
  const needsNewPassword = Boolean(config.requiresNewPassword);
  if (elements.sensitiveNewPasswordFields) {
    elements.sensitiveNewPasswordFields.hidden = !needsNewPassword;
  }
  if (elements.sensitiveNewPassword) {
    elements.sensitiveNewPassword.required = needsNewPassword;
  }
  if (elements.sensitiveConfirmPassword) {
    elements.sensitiveConfirmPassword.required = needsNewPassword;
  }
  setError(elements.sensitiveError, "");
  elements.sensitiveForm.reset();
  elements.sensitiveModal.hidden = false;
  if (elements.sensitiveUsername) elements.sensitiveUsername.focus();
}

function closeSensitiveConfirmation() {
  pendingSensitiveAction = null;
  if (!elements.sensitiveModal) return;
  elements.sensitiveModal.hidden = true;
}

function attachSensitiveConfirmation() {
  if (!elements.sensitiveForm) return;
  elements.sensitiveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!pendingSensitiveAction) return;
    const formData = new FormData(elements.sensitiveForm);
    const username = normalizeLabel(formData.get("username"));
    const password = String(formData.get("password") || "").trim();
    const newPassword = String(formData.get("newPassword") || "").trim();
    const confirmPassword = String(formData.get("confirmPassword") || "").trim();
    if (pendingSensitiveAction.requiresNewPassword) {
      if (!newPassword) {
        setError(elements.sensitiveError, "Enter a new password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(elements.sensitiveError, "New passwords do not match.");
        return;
      }
    }
    const match = state.staffUsers.find(
      (entry) => entry.username === username && entry.password === password
    );
    if (!match) {
      setError(elements.sensitiveError, "Invalid username or password.");
      logAdminAction(
        "Protected Action",
        `Denied protected action: ${pendingSensitiveAction.title || "Unknown action"}`,
        "Denied"
      );
      return;
    }
    const action = pendingSensitiveAction;
    closeSensitiveConfirmation();
    if (action.backupReason && !createSafetyBackup(action.backupReason)) return;
    action.onConfirm({ confirmedBy: match, newPassword });
  });
  if (elements.sensitiveCancel) {
    elements.sensitiveCancel.addEventListener("click", closeSensitiveConfirmation);
  }
  if (elements.sensitiveModal) {
    elements.sensitiveModal.addEventListener("click", (event) => {
      if (event.target && event.target.dataset.closeSensitive === "true") {
        closeSensitiveConfirmation();
      }
    });
  }
}

function getCurrentActorName() {
  if (currentStaffUser && currentStaffUser.displayName) return currentStaffUser.displayName;
  return "Staff";
}

function buildEventTooltip(eventItem) {
  const parts = [];
  if (eventItem.title) parts.push(eventItem.title);
  if (eventItem.date) {
    parts.push(`Date: ${new Date(eventItem.date).toLocaleDateString()}`);
  }
  if (eventItem.description) {
    parts.push(`Description: ${eventItem.description}`);
  }
  if (Array.isArray(eventItem.checklist) && eventItem.checklist.length > 0) {
    parts.push(
      `Checklist: ${eventItem.checklist.map((entry) => entry.title).join(", ")}`
    );
  }
  return parts.join("\n");
}

function formatPhone(value) {
  const digits = sanitizePhone(value);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

function downloadDataUrl(filename, dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename || "download";
  document.body.append(link);
  link.click();
  link.remove();
}

function decodeDocumentText(dataUrl) {
  const payload = (dataUrl || "").split(",")[1] || "";
  if (!payload) return "";
  try {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch (error) {
    try {
      return atob(payload);
    } catch (fallbackError) {
      return "";
    }
  }
}

function dataUrlToArrayBuffer(dataUrl) {
  const payload = (dataUrl || "").split(",")[1] || "";
  const binary = atob(payload);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer;
}

function isDocxDocument(documentItem) {
  const mimeType = (documentItem?.mimeType || "").toLowerCase();
  const fileName = (documentItem?.fileName || "").toLowerCase();
  return (
    mimeType.includes("wordprocessingml") ||
    /\.docx$/.test(fileName)
  );
}

function isSpreadsheetDocument(documentItem) {
  const mimeType = (documentItem?.mimeType || "").toLowerCase();
  const fileName = (documentItem?.fileName || "").toLowerCase();
  return (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("csv") ||
    mimeType.includes("tab-separated-values") ||
    /\.xlsx?$/.test(fileName) ||
    /\.csv$/.test(fileName) ||
    /\.tsv$/.test(fileName)
  );
}

function isWordProcessingDocument(documentItem) {
  const mimeType = (documentItem?.mimeType || "").toLowerCase();
  const fileName = (documentItem?.fileName || "").toLowerCase();
  return (
    mimeType.includes("msword") ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("opendocument.text") ||
    mimeType.includes("rtf") ||
    /\.docx?$/.test(fileName) ||
    /\.odt$/.test(fileName) ||
    /\.rtf$/.test(fileName)
  );
}

function isSupportedDocumentFile(file) {
  if (!file || !file.name) return false;
  const name = file.name.toLowerCase();
  return /\.(pdf|png|jpe?g|gif|webp|bmp|txt|md|json|xml|csv|tsv|xlsx?|docx)$/.test(name);
}

function looksLikeReadableText(content) {
  const sample = String(content || "").slice(0, 4000);
  if (!sample) return true;
  let suspicious = 0;
  for (const char of sample) {
    const code = char.charCodeAt(0);
    const isCommonWhitespace = code === 9 || code === 10 || code === 13;
    const isPrintable = code >= 32 && code <= 126;
    const isExtendedReadable = code >= 160;
    if (!isCommonWhitespace && !isPrintable && !isExtendedReadable) {
      suspicious += 1;
    }
  }
  return suspicious / sample.length < 0.08;
}

function sanitizePreviewHtml(html) {
  const doc = document.implementation.createHTMLDocument("preview");
  doc.body.innerHTML = String(html || "");
  doc.querySelectorAll("script, iframe, object, embed, form").forEach((node) => {
    node.remove();
  });
  doc.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value || "";
      if (name.startsWith("on")) {
        node.removeAttribute(attribute.name);
      }
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(value)) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return doc.body.innerHTML;
}

function getSpreadsheetColumnLabel(index) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

function buildSpreadsheetTable(rows, limitNotice = "") {
  const safeRows = Array.isArray(rows) ? rows : [];
  const columnCount = Math.max(
    safeRows.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0),
    1
  );
  const headerCells = Array.from({ length: columnCount }, (_, index) => {
    return `<th>${getSpreadsheetColumnLabel(index)}</th>`;
  }).join("");
  const bodyRows = safeRows.length
    ? safeRows
        .map((row, rowIndex) => {
          const cells = Array.from({ length: columnCount }, (_, columnIndex) => {
            return `<td>${escapeHtml(row?.[columnIndex] ?? "")}</td>`;
          }).join("");
          return `<tr><th>${rowIndex + 1}</th>${cells}</tr>`;
        })
        .join("")
    : `<tr><th>1</th><td class="empty">No visible cells in this sheet.</td></tr>`;
  return `
    <div class="document-preview__sheet-table-wrap">
      ${limitNotice ? `<p class="document-preview__sheet-note">${escapeHtml(limitNotice)}</p>` : ""}
      <table class="document-preview__sheet-table">
        <thead>
          <tr><th></th>${headerCells}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  `;
}

function buildSpreadsheetPreview(documentItem) {
  if (!window.XLSX || typeof window.XLSX.read !== "function") {
    return `
      <div class="document-preview__message">
        <h2>Spreadsheet preview unavailable</h2>
        <p>The spreadsheet viewer did not load, so this file cannot be previewed yet.</p>
        <p>You can still download the file below and open it in Excel.</p>
      </div>
    `;
  }

  try {
    const base64 = (documentItem.dataUrl || "").split(",")[1] || "";
    const workbook = window.XLSX.read(base64, { type: "base64" });
    const sheetNames = workbook.SheetNames || [];
    if (sheetNames.length === 0) {
      throw new Error("No sheets found.");
    }

    const sheetTabs = [];
    const sheetPanes = [];
    sheetNames.forEach((sheetName, index) => {
      const sheet = workbook.Sheets[sheetName];
      const allRows = window.XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: true,
      });
      const maxRows = 120;
      const limitedRows = allRows.slice(0, maxRows).map((row) => {
        if (!Array.isArray(row)) return [row ?? ""];
        return row.slice(0, 24);
      });
      const wasTrimmed =
        allRows.length > maxRows ||
        limitedRows.some((row, rowIndex) => (allRows[rowIndex] || []).length > 24);
      const limitNotice = wasTrimmed
        ? "Preview trimmed to the first 120 rows and 24 columns for readability."
        : "";
      const activeClass = index === 0 ? " active" : "";
      const paneId = `sheet-${index}`;
      sheetTabs.push(
        `<button type="button" class="document-preview__sheet-tab${activeClass}" data-sheet-target="${paneId}">${escapeHtml(sheetName)}</button>`
      );
      sheetPanes.push(
        `<section class="document-preview__sheet-pane${activeClass}" id="${paneId}">${buildSpreadsheetTable(
          limitedRows,
          limitNotice
        )}</section>`
      );
    });

    return `
      <div class="document-preview__sheets">
        <div class="document-preview__sheet-tabs">${sheetTabs.join("")}</div>
        ${sheetPanes.join("")}
      </div>
    `;
  } catch (error) {
    return `
      <div class="document-preview__message">
        <h2>Spreadsheet preview unavailable</h2>
        <p>This spreadsheet could not be rendered as a browser preview.</p>
        <p>You can still download it below and open it in Excel.</p>
      </div>
    `;
  }
}

async function buildDocxPreview(documentItem) {
  if (!window.mammoth || typeof window.mammoth.convertToHtml !== "function") {
    return `
      <div class="document-preview__message">
        <h2>DOCX preview unavailable</h2>
        <p>The Word document viewer did not load, so this file cannot be previewed yet.</p>
        <p>You can still download it below and open it in Word.</p>
      </div>
    `;
  }

  try {
    const result = await window.mammoth.convertToHtml(
      { arrayBuffer: dataUrlToArrayBuffer(documentItem.dataUrl) },
      { externalFileAccess: false }
    );
    const notices = Array.isArray(result.messages)
      ? result.messages
          .map((message) => escapeHtml(message.message || ""))
          .filter(Boolean)
          .map((message) => `<li>${message}</li>`)
          .join("")
      : "";
    return `
      <div class="document-preview__docx">
        <article class="document-preview__docx-body">
          ${sanitizePreviewHtml(result.value || "<p>No visible content found in this document.</p>")}
        </article>
        ${notices ? `<div class="document-preview__docx-notes"><h3>Conversion notes</h3><ul>${notices}</ul></div>` : ""}
      </div>
    `;
  } catch (error) {
    return `
      <div class="document-preview__message">
        <h2>DOCX preview unavailable</h2>
        <p>This Word document could not be rendered as a browser preview.</p>
        <p>You can still download it below and open it in Word.</p>
      </div>
    `;
  }
}

function getDocumentPreviewShell(documentTitle, documentName, documentDataUrl, previewMarkup) {
  return `
    <html>
      <head>
        <title>${documentTitle}</title>
        <style>
          :root {
            color-scheme: light;
          }
          body {
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            background: linear-gradient(180deg, #fffaf1 0%, #f6ead7 100%);
            color: #2e241c;
          }
          .document-preview {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .document-preview__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 18px 22px;
            border-bottom: 1px solid rgba(176, 124, 52, 0.22);
            background: rgba(255, 248, 238, 0.96);
            position: sticky;
            top: 0;
          }
          .document-preview__title {
            min-width: 0;
          }
          .document-preview__title h1 {
            margin: 0;
            font-size: 1.3rem;
          }
          .document-preview__title p {
            margin: 6px 0 0;
            color: #765941;
            word-break: break-word;
          }
          .document-preview__actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .document-preview__button {
            border: none;
            border-radius: 999px;
            background: #19743a;
            color: #fff;
            padding: 10px 18px;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .document-preview__button.secondary {
            background: #fff;
            color: #2e241c;
            border: 1px solid rgba(176, 124, 52, 0.45);
          }
          .document-preview__body {
            flex: 1;
            padding: 22px;
            display: flex;
          }
          .document-preview__frame,
          .document-preview__text,
          .document-preview__image-wrap,
          .document-preview__message,
          .document-preview__sheets,
          .document-preview__docx {
            width: 100%;
            background: #fff;
            border-radius: 22px;
            box-shadow: 0 18px 38px rgba(87, 56, 24, 0.12);
            border: 1px solid rgba(176, 124, 52, 0.18);
          }
          .document-preview__frame {
            min-height: calc(100vh - 132px);
          }
          .document-preview__text {
            margin: 0;
            padding: 24px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-word;
            font-family: "Courier New", monospace;
            line-height: 1.5;
          }
          .document-preview__image-wrap {
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .document-preview__image {
            max-width: 100%;
            max-height: calc(100vh - 180px);
            border-radius: 18px;
            box-shadow: 0 10px 24px rgba(87, 56, 24, 0.16);
          }
          .document-preview__message {
            padding: 28px;
            box-sizing: border-box;
          }
          .document-preview__message h2 {
            margin-top: 0;
          }
          .document-preview__sheets {
            padding: 18px;
            box-sizing: border-box;
            overflow: hidden;
          }
          .document-preview__sheet-tabs {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-bottom: 16px;
          }
          .document-preview__sheet-tab {
            border: 1px solid rgba(176, 124, 52, 0.3);
            background: #fff7ea;
            color: #5b452f;
            border-radius: 999px;
            padding: 8px 14px;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
          }
          .document-preview__sheet-tab.active {
            background: #19743a;
            color: #fff;
            border-color: #19743a;
          }
          .document-preview__sheet-pane {
            display: none;
          }
          .document-preview__sheet-pane.active {
            display: block;
          }
          .document-preview__sheet-table-wrap {
            overflow: auto;
            border: 1px solid rgba(176, 124, 52, 0.18);
            border-radius: 18px;
          }
          .document-preview__sheet-note {
            margin: 0;
            padding: 12px 14px;
            background: #fff3df;
            border-bottom: 1px solid rgba(176, 124, 52, 0.18);
            color: #765941;
            font-size: 0.96rem;
          }
          .document-preview__sheet-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 720px;
          }
          .document-preview__sheet-table th,
          .document-preview__sheet-table td {
            border: 1px solid rgba(176, 124, 52, 0.12);
            padding: 10px 12px;
            vertical-align: top;
            text-align: left;
          }
          .document-preview__sheet-table thead th,
          .document-preview__sheet-table tbody th {
            background: #f8ecda;
            font-weight: 700;
            position: sticky;
          }
          .document-preview__sheet-table thead th {
            top: 0;
            z-index: 2;
          }
          .document-preview__sheet-table tbody th {
            left: 0;
            z-index: 1;
          }
          .document-preview__sheet-table td.empty {
            color: #765941;
            font-style: italic;
          }
          .document-preview__docx {
            padding: 28px;
            box-sizing: border-box;
            overflow: auto;
          }
          .document-preview__docx-body {
            max-width: 860px;
            margin: 0 auto;
            line-height: 1.7;
            font-size: 1.05rem;
          }
          .document-preview__docx-body h1,
          .document-preview__docx-body h2,
          .document-preview__docx-body h3 {
            line-height: 1.2;
            margin-top: 1.4em;
          }
          .document-preview__docx-body table {
            width: 100%;
            border-collapse: collapse;
            margin: 18px 0;
          }
          .document-preview__docx-body th,
          .document-preview__docx-body td {
            border: 1px solid rgba(176, 124, 52, 0.2);
            padding: 10px 12px;
            text-align: left;
          }
          .document-preview__docx-body img {
            max-width: 100%;
            height: auto;
          }
          .document-preview__docx-notes {
            max-width: 860px;
            margin: 22px auto 0;
            padding: 18px 20px;
            border-radius: 18px;
            background: #fff4e4;
            border: 1px solid rgba(176, 124, 52, 0.2);
          }
          .document-preview__docx-notes h3 {
            margin-top: 0;
          }
          @media (max-width: 720px) {
            .document-preview__header {
              flex-direction: column;
              align-items: stretch;
            }
            .document-preview__actions {
              width: 100%;
            }
            .document-preview__button {
              flex: 1 1 auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="document-preview">
          <div class="document-preview__header">
            <div class="document-preview__title">
              <h1>${documentTitle}</h1>
              <p>${documentName}</p>
            </div>
            <div class="document-preview__actions">
              <a class="document-preview__button" href="${documentDataUrl}" download="${documentName}">Download Document</a>
              <button class="document-preview__button secondary" type="button" onclick="window.print()">Print</button>
            </div>
          </div>
          <div class="document-preview__body">
            ${previewMarkup}
          </div>
        </div>
        <script>
          const tabs = Array.from(document.querySelectorAll(".document-preview__sheet-tab"));
          const panes = Array.from(document.querySelectorAll(".document-preview__sheet-pane"));
          tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
              const target = tab.getAttribute("data-sheet-target");
              tabs.forEach((item) => item.classList.toggle("active", item === tab));
              panes.forEach((pane) => pane.classList.toggle("active", pane.id === target));
            });
          });
        </script>
      </body>
    </html>
  `;
}

async function viewDocument(documentItem) {
  if (!documentItem || !documentItem.dataUrl) return;
  const previewWindow = window.open("", "_blank", "width=1000,height=800");
  if (!previewWindow) {
    downloadDataUrl(
      documentItem.fileName || documentItem.title || "document",
      documentItem.dataUrl
    );
    return;
  }

  const mimeType = (
    documentItem.mimeType ||
    documentItem.dataUrl.match(/^data:([^;]+)/)?.[1] ||
    ""
  ).toLowerCase();
  const documentTitle = escapeHtml(documentItem.title || "Document");
  const documentName = escapeHtml(
    documentItem.fileName || documentItem.title || "document"
  );
  previewWindow.document.write(`
    <html>
      <head>
        <title>${documentTitle}</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Georgia, "Times New Roman", serif;
            background: linear-gradient(180deg, #fffaf1 0%, #f6ead7 100%);
            color: #2e241c;
          }
          .document-loading {
            padding: 28px 34px;
            border-radius: 22px;
            background: #fff;
            border: 1px solid rgba(176, 124, 52, 0.18);
            box-shadow: 0 18px 38px rgba(87, 56, 24, 0.12);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="document-loading">
          <h2>Loading preview...</h2>
          <p>${documentName}</p>
        </div>
      </body>
    </html>
  `);
  previewWindow.document.close();

  let previewMarkup = `
    <div class="document-preview__message">
      <h2>Preview not available</h2>
      <p>This file type cannot be shown directly in the browser here yet.</p>
      <p>Use the download button below to open it in Word, Excel, or another app on this computer.</p>
    </div>
  `;

  if (isDocxDocument(documentItem)) {
    previewMarkup = await buildDocxPreview(documentItem);
  } else if (isSpreadsheetDocument(documentItem)) {
    previewMarkup = buildSpreadsheetPreview(documentItem);
  } else if (mimeType.startsWith("image/")) {
    previewMarkup = `
      <div class="document-preview__image-wrap">
        <img class="document-preview__image" src="${documentItem.dataUrl}" alt="${documentTitle}" />
      </div>
    `;
  } else if (mimeType === "application/pdf") {
    previewMarkup = `
      <iframe
        class="document-preview__frame"
        src="${documentItem.dataUrl}"
        title="${documentTitle}"
      ></iframe>
    `;
  } else if (
    !isWordProcessingDocument(documentItem) &&
    (
      mimeType.startsWith("text/") ||
      mimeType.includes("json") ||
      mimeType.includes("xml")
    )
  ) {
    const decodedText = decodeDocumentText(documentItem.dataUrl);
    if (looksLikeReadableText(decodedText)) {
    previewMarkup = `
        <pre class="document-preview__text">${escapeHtml(decodedText)}</pre>
    `;
    }
  }

  if (previewWindow.closed) return;
  previewWindow.document.open();
  previewWindow.document.write(
    getDocumentPreviewShell(documentTitle, documentName, documentItem.dataUrl, previewMarkup)
  );
  previewWindow.document.close();
}

function printSigninSheet() {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  const memberRows = state.people
    .map(
      (person) => `
        <tr>
          <td>${person.firstName} ${person.lastName}</td>
          <td>${person.residenceTag || ""}</td>
          <td></td>
          <td></td>
        </tr>
      `
    )
    .join("");
  const volunteerRows = (state.volunteers || [])
    .map(
      (volunteer) => `
        <tr>
          <td>${volunteer.name || ""}</td>
          <td>${volunteer.role || "Volunteer"}</td>
          <td>${volunteer.areas || ""}</td>
          <td></td>
          <td></td>
        </tr>
      `
    )
    .join("");
  printWindow.document.write(`
    <html>
      <head>
        <title>Sign-In Sheets</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { margin-bottom: 8px; }
          h2 { margin: 28px 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #999; padding: 10px; text-align: left; }
          th { background: #f4eadc; }
        </style>
      </head>
      <body>
        <h1>Lighthouse Sign-In Sheets</h1>
        <p>${new Date().toLocaleDateString()}</p>
        <h2>Member Sign-In</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Residence Tag</th><th>Signed In</th><th>Notes</th></tr>
          </thead>
          <tbody>${memberRows}</tbody>
        </table>
        <h2>Volunteer Sign-In</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Role</th><th>Areas</th><th>Signed In</th><th>Notes</th></tr>
          </thead>
          <tbody>${volunteerRows || "<tr><td colspan='5'>No volunteers added yet.</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  logAdminAction("Sign-In Sheet", "Printed combined member and volunteer sign-in sheets");
}

function printResources() {
  const resources = [...(state.resources || [])].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (!printWindow) return;
  const rows = resources
    .map(
      (resource) => `
        <tr>
          <td>${escapeHtml(resource.name)}</td>
          <td>${escapeHtml(resource.category || "")}</td>
          <td>${escapeHtml(resource.services || "")}</td>
          <td>${escapeHtml(resource.address || "")}</td>
          <td>${escapeHtml(formatPhone(resource.phone) || "")}</td>
          <td>${escapeHtml(resource.website || "")}</td>
          <td>${escapeHtml(resource.dropoff || "")}</td>
        </tr>
      `
    )
    .join("");
  printWindow.document.write(`
    <html>
      <head>
        <title>Community Resource List</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #999; padding: 10px; text-align: left; vertical-align: top; }
          th { background: #f4eadc; }
        </style>
      </head>
      <body>
        <h1>Jackson Community Resource List</h1>
        <p>${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Services</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Drop-Off / Notes</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function printWeeklyReport() {
  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (!printWindow) return;
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);
  const sinceTime = since.getTime();
  const served = new Set();
  const categoryCounts = {};
  let pointsAwarded = 0;
  let pointsRedeemed = 0;
  let itemsRedeemed = 0;

  (state.visits || []).forEach((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (Number.isFinite(timestamp) && timestamp >= sinceTime && entry.personId) {
      served.add(entry.personId);
    }
  });

  (state.activity || []).forEach((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < sinceTime) return;
    if (entry.personId) served.add(entry.personId);
    if (entry.delta > 0) pointsAwarded += entry.delta;
    if (entry.delta < 0) pointsRedeemed += Math.abs(entry.delta);
    if (entry.type !== "redeem") return;
    parseRedeemNote(entry.note || "").forEach((item) => {
      itemsRedeemed += item.quantity;
      const label = findItemGroup(item.name.toLowerCase()) || "Other";
      categoryCounts[label] = (categoryCounts[label] || 0) + item.quantity;
    });
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const newMembers = (state.people || []).filter((person) => {
    const joined = Date.parse(person.dateJoined);
    return Number.isFinite(joined) && joined >= sinceTime;
  });
  const topTasks = getTopTasks(7).slice(0, 5);
  const followUpMembers = (state.people || []).filter((person) => person.followUpNeeded);
  const inactiveMembers = getInactiveMembers(30);
  const adminActions = (state.adminLog || []).filter((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    return Number.isFinite(timestamp) && timestamp >= sinceTime;
  });
  const categoryMax = Math.max(1, ...topCategories.map((entry) => entry[1]));
  const rows = [
    ["Members served", served.size],
    ["Visits logged", (state.visits || []).filter((entry) => Date.parse(entry.timestamp) >= sinceTime).length],
    ["New members", newMembers.length],
    ["Items redeemed", itemsRedeemed],
    ["Points awarded", pointsAwarded],
    ["Points redeemed", pointsRedeemed],
    ["Members needing follow-up", followUpMembers.length],
    ["Inactive members", inactiveMembers.length],
  ];
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Lighthouse Weekly Report</title>
        <style>
          body { font-family: Georgia, serif; color: #173226; padding: 32px; }
          h1 { margin-bottom: 4px; font-size: 34px; }
          h2 { margin-top: 28px; border-bottom: 2px solid #d7b676; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #dfd2bd; padding: 10px; text-align: left; }
          th { background: #173226; color: #fffaf0; }
          .meta { color: #6d5b46; }
          .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .metric { border: 1px solid #dfd2bd; border-radius: 14px; padding: 14px; background: #fff6e6; }
          .metric span { display: block; color: #6d5b46; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
          .metric strong { display: block; color: #19743a; font-size: 26px; margin-top: 4px; }
          .bar { height: 11px; border-radius: 999px; background: #e8d8bd; overflow: hidden; }
          .bar span { display: block; height: 100%; background: #19743a; }
        </style>
      </head>
      <body>
        <h1>Lighthouse Ministry Weekly Report</h1>
        <p class="meta">${since.toLocaleDateString()} - ${new Date().toLocaleDateString()}</p>
        <div class="metric-grid">
          <div class="metric"><span>Members Served</span><strong>${served.size}</strong></div>
          <div class="metric"><span>Items Redeemed</span><strong>${itemsRedeemed}</strong></div>
          <div class="metric"><span>Points Awarded</span><strong>${pointsAwarded}</strong></div>
          <div class="metric"><span>Follow-Ups</span><strong>${followUpMembers.length}</strong></div>
        </div>
        <h2>Snapshot</h2>
        <table><tbody>${rows
          .map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`)
          .join("")}</tbody></table>
        <h2>Top Redeemed Categories</h2>
        <table>
          <thead><tr><th>Category</th><th>Quantity</th></tr></thead>
          <tbody>${
            topCategories.length
              ? topCategories
                  .map(([label, count]) => `<tr><td>${escapeHtml(label)}<div class="bar"><span style="width:${Math.round((count / categoryMax) * 100)}%"></span></div></td><td>${count}</td></tr>`)
                  .join("")
              : "<tr><td colspan='2'>No redemptions this week.</td></tr>"
          }</tbody>
        </table>
        <h2>Top Point Tasks</h2>
        <table>
          <thead><tr><th>Task</th><th>Times Awarded</th></tr></thead>
          <tbody>${
            topTasks.length
              ? topTasks
                  .map((task) => `<tr><td>${escapeHtml(task.label)}</td><td>${task.count}</td></tr>`)
                  .join("")
              : "<tr><td colspan='2'>No task awards this week.</td></tr>"
          }</tbody>
        </table>
        <h2>New Members</h2>
        <table>
          <thead><tr><th>Name</th><th>Date Joined</th><th>Tag</th></tr></thead>
          <tbody>${
            newMembers.length
              ? newMembers
                  .map(
                    (person) =>
                      `<tr><td>${escapeHtml(`${person.firstName} ${person.lastName}`)}</td><td>${escapeHtml(
                        person.dateJoined || ""
                      )}</td><td>${escapeHtml(person.residenceTag || "")}</td></tr>`
                  )
                  .join("")
              : "<tr><td colspan='3'>No new members this week.</td></tr>"
          }</tbody>
        </table>
        <h2>Follow-Up List</h2>
        <table>
          <thead><tr><th>Name</th><th>Note</th><th>Last Visit</th></tr></thead>
          <tbody>${
            followUpMembers.length
              ? followUpMembers
                  .map(
                    (person) =>
                      `<tr><td>${escapeHtml(`${person.firstName} ${person.lastName}`)}</td><td>${escapeHtml(
                        person.followUpNote || "Needs follow-up"
                      )}</td><td>${escapeHtml(
                        getLastVisitTimestamp(person.id)
                          ? new Date(getLastVisitTimestamp(person.id)).toLocaleDateString()
                          : "No visits"
                      )}</td></tr>`
                  )
                  .join("")
              : "<tr><td colspan='3'>No members currently marked for follow-up.</td></tr>"
          }</tbody>
        </table>
        <h2>Admin Actions This Week</h2>
        <table>
          <thead><tr><th>Action</th><th>Actor</th><th>Time</th></tr></thead>
          <tbody>${
            adminActions.length
              ? adminActions
                  .slice(0, 20)
                  .map(
                    (entry) =>
                      `<tr><td>${escapeHtml(entry.detail || entry.type)}</td><td>${escapeHtml(
                        entry.actor || "Unknown Staff"
                      )}</td><td>${escapeHtml(formatLogDate(entry.timestamp))}</td></tr>`
                  )
                  .join("")
              : "<tr><td colspan='3'>No admin actions this week.</td></tr>"
          }</tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  logAdminAction("Weekly Report", "Printed weekly ministry report");
}

function tableRowsHtml(rows, emptyMessage, columns) {
  if (!rows.length) return `<tr><td colspan="${columns}">${emptyMessage}</td></tr>`;
  return rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(String(cell ?? ""))}</td>`)
          .join("")}</tr>`
    )
    .join("");
}

function printLogsReport() {
  const printWindow = window.open("", "_blank", "width=1100,height=850");
  if (!printWindow) return;
  printWindow.document.write(buildLogsReportHtml({ full: false }));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  logAdminAction("Logs Report", "Printed logs report");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hydrateSelects() {
  elements.peopleSelects.forEach((select) => {
    const current = select.value;
    select.innerHTML = "";
    state.people.forEach((person) => {
      const option = document.createElement("option");
      option.value = person.id;
      option.textContent = `${person.firstName} ${person.lastName}`;
      select.append(option);
    });
    if (current) {
      select.value = current;
    }
  });
  if (
    elements.checkinMember &&
    selectedCheckinMemberId &&
    state.people.some((person) => person.id === selectedCheckinMemberId)
  ) {
    elements.checkinMember.value = selectedCheckinMemberId;
  }
  renderRedeemPoints();

  elements.redeemItems.innerHTML = "";

  getGroupedItems().forEach((group) => {
    const details = document.createElement("details");
    details.open = false;

    const summary = document.createElement("summary");
    summary.textContent = group.label;
    summary.dataset.baseLabel = group.label;
    details.append(summary);

    const rowHeader = document.createElement("div");
    rowHeader.className = "redeem-row redeem-row--header";
    rowHeader.innerHTML = "<div>Item</div><div>Quantity</div>";
    details.append(rowHeader);

    group.items.forEach((itemName) => {
      const item = state.items.find((entry) => entry.name === itemName);
      if (!item) return;

      const row = document.createElement("div");
      row.className = "redeem-row";

      const label = document.createElement("label");
      label.className = "redeem-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.itemName = item.name;

      const text = document.createElement("span");
      text.textContent = `${item.name} (${item.cost} pts)`;

      const qty = document.createElement("input");
      qty.type = "number";
      qty.min = "1";
      qty.value = "1";
      qty.disabled = false;
      qty.className = "redeem-qty";
      qty.dataset.itemName = item.name;
      qty.setAttribute("aria-label", `Quantity to redeem for ${item.name}`);

      checkbox.addEventListener("change", () => {
        if (!checkbox.checked) qty.value = "1";
        updateRedeemTotal();
        updateRedeemGroupCounts();
      });

      qty.addEventListener("input", () => {
        updateRedeemTotal();
        updateRedeemGroupCounts();
      });

      label.append(checkbox, text);
      row.append(label, qty);
      details.append(row);
    });

    elements.redeemItems.append(details);
  });
}

function hydrateTasks() {
  if (!elements.taskButtons) return;
  elements.taskButtons.innerHTML = "";
  const tasks = getAllTasks();
  const visible = tasks.slice(0, 12);
  const hidden = tasks.slice(12);

  const renderTaskRow = (task) => {
    const row = document.createElement("div");
    row.className = "task-row";

    const leftGroup = document.createElement("div");
    leftGroup.className = "task-left";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn small primary";
    button.textContent = `${task.label} (${task.points} pts)`;
    button.dataset.taskId = task.id;

    const status = document.createElement("span");
    status.className = "task-status";

    const statusButton = document.createElement("span");
    statusButton.className = "btn small primary";
    statusButton.textContent = "Points awarded";
    status.append(statusButton);

    button.addEventListener("click", () => {
      const personSelect = elements.taskForm.querySelector("select[name='personId']");
      const personId = personSelect ? personSelect.value : "";
      const taskId = button.dataset.taskId;
      const selectedTask = getAllTasks().find((entry) => entry.id === taskId);
      if (!personId || !selectedTask) {
        setError(elements.taskError, "Select a person first.");
        return;
      }
      setError(elements.taskError, "");
      adjustPoints(personId, selectedTask.points, "task", selectedTask.label);
      status.classList.remove("show");
      status.classList.remove("fade");
      void status.offsetWidth;
      status.classList.add("show");
      setTimeout(() => {
        status.classList.add("fade");
      }, 1200);
      setTimeout(refreshAfterPointsChange, 650);
    });

    leftGroup.append(button, status);

    if (task.id) {
      const actionGroup = document.createElement("div");
      actionGroup.className = "task-actions";
      if (String(task.id).startsWith("custom-")) {
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn small secondary task-edit-action";
        edit.textContent = "Edit";
        edit.addEventListener("click", () => {
          openTaskEditor(task);
        });
        actionGroup.append(edit);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn small danger task-remove-action";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        requestSensitiveConfirmation({
          title: "Remove Task",
          message: `Enter staff credentials to remove "${task.label}" from the award task list.`,
          actionLabel: "Remove Task",
          backupReason: `Before removing task ${task.label}`,
          onConfirm: ({ confirmedBy }) => {
            if (!state.hiddenTasks.includes(task.id)) {
              state.hiddenTasks.push(task.id);
            }
            logAdminAction(
              "Task Removed",
              `Removed task ${task.label} after confirmation by ${
                confirmedBy.displayName || confirmedBy.username
              }`
            );
            saveState();
            hydrateTasks();
          },
        });
      });
      actionGroup.append(remove);
      row.append(leftGroup, actionGroup);
    } else {
      row.append(leftGroup);
    }
    return row;
  };

  visible.forEach((task) => {
    elements.taskButtons.append(renderTaskRow(task));
  });

  if (hidden.length > 0) {
    const details = document.createElement("details");
    details.className = "task-details";
    const summary = document.createElement("summary");
    summary.textContent = `Show ${hidden.length} more`;
    details.append(summary);
    hidden.forEach((task) => {
      details.append(renderTaskRow(task));
    });
    elements.taskButtons.append(details);
  }
  updateTaskRemoveMode();
}

function updateTaskRemoveMode() {
  if (elements.removeTaskToggle) {
    elements.removeTaskToggle.classList.toggle("danger", taskRemoveMode);
    elements.removeTaskToggle.classList.toggle("secondary", !taskRemoveMode);
    elements.removeTaskToggle.setAttribute("aria-pressed", String(taskRemoveMode));
  }
  if (elements.taskButtons) {
    elements.taskButtons.classList.toggle("task-buttons--remove-mode", taskRemoveMode);
  }
}

function renderRedeemPoints() {
  if (!elements.redeemPoints || !elements.redeemForm) return;
  const personSelect = elements.redeemForm.querySelector("select[name='personId']");
  if (!personSelect) return;
  const personId = personSelect.value;
  const person = state.people.find((entry) => entry.id === personId);
  elements.redeemPoints.textContent = person
    ? `Current points: ${person.points}`
    : "";
}

function getRedeemSelections() {
  const selections = [];
  const checkboxes = elements.redeemItems.querySelectorAll(
    "input[type='checkbox']"
  );

  checkboxes.forEach((checkbox) => {
    if (!checkbox.checked) return;
    const name = checkbox.dataset.itemName;
    const qtyInput = elements.redeemItems.querySelector(
      `input.redeem-qty[data-item-name="${name}"]`
    );
    const quantity = qtyInput ? Number(qtyInput.value) : 0;
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    const item = state.items.find((entry) => entry.name === name);
    if (!item) return;
    selections.push({ item, quantity });
  });

  return selections;
}

function resetRedeemSelections() {
  const checkboxes = elements.redeemItems.querySelectorAll(
    "input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  const qtyInputs = elements.redeemItems.querySelectorAll("input.redeem-qty");
  qtyInputs.forEach((input) => {
    input.value = "1";
    input.disabled = false;
  });
  updateRedeemTotal();
}

function updateRedeemTotal() {
  if (!elements.redeemButton) return;
  const selections = getRedeemSelections();
  const total = selections.reduce(
    (sum, entry) => sum + entry.item.cost * entry.quantity,
    0
  );
  elements.redeemButton.textContent = `Redeem (${total} pts)`;
}

function updateRedeemGroupCounts() {
  const groups = elements.redeemItems.querySelectorAll("details");
  groups.forEach((group) => {
    const summary = group.querySelector("summary");
    if (!summary) return;
    const baseLabel = summary.dataset.baseLabel || summary.textContent;
    const checked = group.querySelectorAll("input[type='checkbox']:checked");
    let totalQty = 0;
    checked.forEach((checkbox) => {
      const name = checkbox.dataset.itemName;
      const qtyInput = group.querySelector(
        `input.redeem-qty[data-item-name="${name}"]`
      );
      const qty = qtyInput ? Number(qtyInput.value) : 0;
      if (Number.isFinite(qty) && qty > 0) totalQty += qty;
    });
    const countLabel = totalQty === 1 ? "1 item" : `${totalQty} items`;
    summary.textContent = totalQty > 0 ? `${baseLabel} (${countLabel})` : baseLabel;
  });
}

function hydrateAddItemGroups() {
  if (!elements.addItemGroup) return;
  elements.addItemGroup.innerHTML = "";
  ITEM_GROUPS.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.label;
    option.textContent = group.label;
    elements.addItemGroup.append(option);
  });
}

function setError(target, message) {
  if (!target) return;
  if (!message) {
    target.hidden = true;
    target.textContent = "";
    return;
  }
  target.hidden = false;
  target.textContent = message;
}

if (elements.awardNote) {
  elements.awardNote.addEventListener("input", () => {
    setError(elements.awardNoteError, "");
  });
}

if (elements.removeNote) {
  elements.removeNote.addEventListener("input", () => {
    setError(elements.removeNoteError, "");
  });
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Unable to load stored state", error);
    }
  }
  return {
    people: [],
    items: defaultItems.map((item) => ({ ...item })),
    customItems: [],
    customTasks: [],
    hiddenTasks: [],
    hiddenItems: [],
    settings: { ...DEFAULT_SETTINGS },
    adminLog: [],
    activity: [],
    visits: [],
    volunteers: [],
    donors: [],
    documents: [],
    events: [],
    resources: DEFAULT_RESOURCES.map((entry) => ({ ...entry })),
    staffTodosGlobal: [],
    staffUsers: [],
    lastSafetyBackupAt: "",
  };
}

function saveState() {
  try {
    // Local storage can fail if photos are too large.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    alert(
      "Unable to save. The photo may be too large for storage. Try a smaller image."
    );
  }
}

















