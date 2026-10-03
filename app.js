// ---- Storage keys / image sizing ----
const STORAGE_KEY = "ministryPointsStateV1";
const STAFF_MODE_KEY = "ministryStaffModeV1";
const STAFF_USER_KEY = "ministryStaffUserV1";
const SAFETY_BACKUP_KEY = "ministrySafetyBackupsV1";
const REMOTE_STATE_ID = "lighthouse-ministry-hub";
const REMOTE_SAVE_DEBOUNCE_MS = 900;
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
  "Studio Apartment",
  "Temp Housing",
  "Shelter",
  "With Family",
  "Own Home",
  "Other",
];
const DEFAULT_SETTINGS = {
  organizationName: "Community Outreach Program", // neutral default for independent demos
  hubName: "Lighthouse Ministry Hub",
  subtitle:
    "A calm, organized command center for member care, resources, events, volunteers, and ministry activity.",
};

const SUPABASE_SETTINGS = window.LIGHTHOUSE_SUPABASE_CONFIG || {};
const HAS_SUPABASE_SETTINGS = Boolean(
  SUPABASE_SETTINGS.url && SUPABASE_SETTINGS.anonKey
);
const supabaseClient =
  HAS_SUPABASE_SETTINGS &&
  window.supabase &&
  typeof window.supabase.createClient === "function"
    ? window.supabase.createClient(SUPABASE_SETTINGS.url, SUPABASE_SETTINGS.anonKey)
    : null;
let currentSupabaseUser = null;
let remoteStateLoaded = false;
let remoteSaveTimer = null;
let remoteSaveInFlight = false;
let remoteSaveQueued = false;
let isApplyingRemoteState = false;

function isSupabaseMode() {
  return HAS_SUPABASE_SETTINGS;
}

function isSupabaseReady() {
  return Boolean(supabaseClient);
}

function isLocalAppHost() {
  return (
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function isLocalPasswordMode() {
  return !isSupabaseMode() && isLocalAppHost();
}

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
    id: "resource-riverbend-emergency-shelter",
    name: "Riverbend Emergency Shelter",
    category: "Housing & Emergency Assistance",
    services:
      "Overnight shelter, showers, laundry, and case management intake.",
    address: "100 Sample Avenue",
    phone: "5550150000",
    email: "info1@example.org",
    website: "https://example.org/resources/1",
    dropoff:
      "Call ahead. Housing & emergency assistance requests are posted weekly.",
    photo: "",
  },
  {
    id: "resource-harborlight-food-pantry",
    name: "Harborlight Food Pantry",
    category: "Food & Community Support",
    services:
      "Weekly food boxes, fresh produce, and infant formula when available.",
    address: "250 Sample Boulevard",
    phone: "5550150019",
    email: "info2@example.org",
    website: "https://example.org/resources/2",
    dropoff:
      "Call ahead. Food support requests are posted weekly.",
    photo: "",
  },
  {
    id: "resource-cornerstone-housing-partners",
    name: "Cornerstone Housing Partners",
    category: "Housing",
    services:
      "Transitional housing applications, tenant support, and rental assistance referrals.",
    address: "18 Sample Court",
    phone: "5550150038",
    email: "info3@example.org",
    website: "https://example.org/resources/3",
    dropoff:
      "Call ahead. Housing support requests are posted weekly.",
    photo: "",
  },
  {
    id: "resource-brightpath-community-clinic",
    name: "Brightpath Community Clinic",
    category: "Health Services",
    services:
      "Walk-in clinic, prescriptions assistance, and behavioral health referrals.",
    address: "77 Sample Road",
    phone: "5550150057",
    email: "info4@example.org",
    website: "https://example.org/resources/4",
    dropoff:
      "Call ahead. Health services requests are posted weekly.",
    photo: "",
  },
  {
    id: "resource-new-day-workforce-center",
    name: "New Day Workforce Center",
    category: "Employment",
    services:
      "Resume help, interview coaching, and job placement referrals.",
    address: "402 Sample Parkway",
    phone: "5550150076",
    email: "info5@example.org",
    website: "https://example.org/resources/5",
    dropoff:
      "Call ahead. Employment services requests are posted weekly.",
    photo: "",
  },
  {
    id: "resource-open-door-legal-aid",
    name: "Open Door Legal Aid",
    category: "Legal",
    services:
      "Free consultations for benefits appeals, ID replacement, and housing issues.",
    address: "9 Sample Lane",
    phone: "5550150095",
    email: "info6@example.org",
    website: "https://example.org/resources/6",
    dropoff:
      "Call ahead. Legal aid requests are posted weekly.",
    photo: "",
  },
];

// ---- State bootstrap ----
const state = loadState();
// Older or hand-authored state payloads may omit whole collections. Default them
// here so a missing array can never take down the first render.
if (!Array.isArray(state.people)) state.people = [];
if (!Array.isArray(state.items)) state.items = defaultItems.map((item) => ({ ...item }));
if (!Array.isArray(state.activity)) state.activity = [];
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

let staffMode = isLocalPasswordMode() && sessionStorage.getItem(STAFF_MODE_KEY) === "true";
let dailyRefreshTimer = null;
let dailyRefreshInterval = null;
let reopenProfileId = null;
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let editingTaskId = null;
let editingStaffTodoId = null;
let editingVolunteerId = null;
let editingDonorId = null;
let editingResourceId = null;
let pendingSensitiveAction = null;
let logSearchTerm = "";
let logTypeFilter = "";
let logRangeFilter = "";
let adminLogSearchTerm = "";
let selectedCheckinMemberId = "";
let taskRemoveMode = false;
let currentStaffUser =
  isLocalPasswordMode() &&
  state.staffUsers.find((entry) => entry.id === sessionStorage.getItem(STAFF_USER_KEY)) ||
  null;

// ---- App shell routing tables (declared before the first render) ----
const APP_ROUTES = [
  "dashboard",
  "members",
  "member-profile",
  "check-in",
  "rewards",
  "calendar",
  "resources",
  "reports",
  "admin",
];

const APP_ROUTE_TITLES = {
  dashboard: "Dashboard",
  members: "Members",
  "member-profile": "Member Profile",
  "check-in": "Member Check-In",
  rewards: "Points & Rewards",
  calendar: "Calendar & Tasks",
  resources: "Community Resources",
  reports: "Reports",
  admin: "Admin",
};

// Which sidebar entry should light up for each page.
const APP_NAV_ROUTES = {
  dashboard: "dashboard",
  members: "members",
  "member-profile": "members",
  "check-in": "check-in",
  rewards: "rewards",
  calendar: "calendar",
  resources: "resources",
  reports: "reports",
  admin: "admin",
};

let currentRoute = { page: "dashboard", memberId: "" };
// Declared above the first renderAll() call so render-time reads never hit the TDZ.
let lastPresetKey = "";
let lastCheckinResult = null;
let checkinSubmitting = false;
let pendingAward = null;
let rewardsToastMessage = "";
let rewardsToastTimer = null;

// ---- Element references ----
const elements = {
  quickBackup: document.querySelector("#quick-backup"),
  quickReport: document.querySelector("#quick-report"),
  dashboardAlerts: document.querySelector("#dashboard-alerts"),
  dashboardFollowups: document.querySelector("#dashboard-followups"),
  dashboardEvents: document.querySelector("#dashboard-events"),
  dashboardActivity: document.querySelector("#dashboard-activity"),
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
  checkinSearch: document.querySelector("#checkin-search"),
  checkinNote: document.querySelector("#checkin-note"),
  checkinConfirm: document.querySelector("#checkin-confirm"),
  checkinResult: document.querySelector("#checkin-result"),
  checkinRedeemLink: document.querySelector("#checkin-redeem-link"),
  inactiveMembersList: document.querySelector("#inactive-members-list"),
  memberTagFilter: document.querySelector("#member-tag-filter"),
  memberSort: document.querySelector("#member-sort"),
  printSignin: document.querySelector("#print-signin"),
  itemsTable: document.querySelector("#items-table"),
  activityTable: document.querySelector("#activity-table"),
  peopleSelects: document.querySelectorAll("select[name='personId']"),
  redeemItems: document.querySelector("#redeem-items"),
  redeemSearch: document.querySelector("#redeem-search"),
  redeemCart: document.querySelector("#redeem-cart"),
  redeemConfirm: document.querySelector("#redeem-confirm"),
  awardBalance: document.querySelector("#award-balance"),
  awardConfirm: document.querySelector("#award-confirm"),
  rewardsHistory: document.querySelector("#rewards-history"),
  rewardsToast: document.querySelector("#rewards-toast"),
  memberSearch: document.querySelector("#member-search"),
  memberCount: document.querySelector("#member-count"),
  memberClearFilters: document.querySelector("#member-clear-filters"),
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
  resourceCount: document.querySelector("#resource-count"),
  staffTaskDue: document.querySelector("#staff-task-due"),
  reportRange: document.querySelector("#report-range"),
  reportType: document.querySelector("#report-type"),
  reportResults: document.querySelector("#report-results"),
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
  calendarView: document.querySelector("#calendar-view"),
  calendarNav: document.querySelector("#calendar-nav"),
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
  gateLoginSubmit: document.querySelector("#gate-login-submit"),
  pageMain: document.querySelector("#page-main"),
  confirmModal: document.querySelector("#confirm-modal"),
  confirmModalTitle: document.querySelector("#confirm-modal-title"),
  confirmModalMessage: document.querySelector("#confirm-modal-message"),
  confirmModalDetails: document.querySelector("#confirm-modal-details"),
  confirmModalCancel: document.querySelector("#confirm-modal-cancel"),
  confirmModalAccept: document.querySelector("#confirm-modal-accept"),
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
  appShell: document.querySelector("#app-shell"),
  appSidebar: document.querySelector("#app-sidebar"),
  appScrim: document.querySelector("#app-scrim"),
  appMenuToggle: document.querySelector("#app-menu-toggle"),
  appPageTitle: document.querySelector("#app-page-title"),
  kpiServedToday: document.querySelector("#kpi-served-today"),
  kpiCheckInsWeek: document.querySelector("#kpi-checkins-week"),
  kpiRedeemedWeek: document.querySelector("#kpi-redeemed-week"),
  kpiFollowUpsDue: document.querySelector("#kpi-followups-due"),
  kpiFollowUpsCard: document.querySelector("#kpi-followups-card"),
  appUserAvatar: document.querySelector(".app-user__avatar"),
  memberProfileTitle: document.querySelector("#member-profile-title"),
  memberProfileRoot: document.querySelector("#member-profile-root"),
};

// ---- Initial render / bindings ----
renderAll();
scheduleDailySummaryRefresh();
setDefaultDateJoined();
attachPhoneSanitizer();
attachMemberSearch();
attachRedeemPointsListener();
attachRewardsPanels();
attachMemberPhotoPicker();
attachVolunteerPhotoPicker();
attachDocumentPicker();
attachResourcePhotoPicker();
attachMemberFilters();
attachStaffLogin();
attachVolunteerSort();
attachCalendarControls();
attachResourceSearch();
attachRouter();
attachSensitiveConfirmation();
ensureDailySafetyBackup();
renderBackupStatus();
initializeSupabaseSession();
if (didLegacyTodoMigration) {
  saveState();
}

if (elements.staffToggle) {
  elements.staffToggle.addEventListener("click", async () => {
    if (isSupabaseMode()) {
      await signOutSupabaseStaff();
      return;
    }
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
    lastCheckinResult = null;
    hideCheckinConfirm();
    renderCheckin();
  });
}

if (elements.checkinSearch) {
  elements.checkinSearch.addEventListener("input", () => {
    lastCheckinResult = null;
    hideCheckinConfirm();
    renderCheckin();
  });
}

if (elements.checkinNote) {
  elements.checkinNote.addEventListener("input", () => {
    hideCheckinConfirm();
  });
}

if (elements.checkinLogVisit) {
  elements.checkinLogVisit.addEventListener("click", () => {
    if (!getPendingCheckinMember()) return;
    showCheckinConfirm();
  });
}

if (elements.checkinConfirm) {
  elements.checkinConfirm.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-checkin-confirm")) {
      confirmCheckin();
    } else if (button.hasAttribute("data-checkin-cancel")) {
      hideCheckinConfirm();
    }
  });
}

if (elements.checkinResult) {
  elements.checkinResult.addEventListener("click", (event) => {
    const button = event.target.closest("[data-checkin-again]");
    if (!button) return;
    lastCheckinResult = null;
    hideCheckinConfirm();
    if (elements.checkinSearch) elements.checkinSearch.value = "";
    renderCheckin();
    if (elements.checkinSearch) elements.checkinSearch.focus();
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

function getRemoteStatePayload() {
  const payload = cloneStateForBackup();
  payload.staffUsers = [];
  return payload;
}

function queueRemoteStateSave() {
  if (!isSupabaseReady() || !staffMode || !remoteStateLoaded || isApplyingRemoteState) return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(() => {
    saveRemoteStateNow();
  }, REMOTE_SAVE_DEBOUNCE_MS);
}

async function saveRemoteStateNow(options = {}) {
  const force = Boolean(options.force);
  if (!isSupabaseReady() || (!staffMode && !force) || !currentSupabaseUser) return;
  if (remoteSaveInFlight) {
    remoteSaveQueued = true;
    return;
  }
  remoteSaveInFlight = true;
  try {
    const { error } = await supabaseClient.from("ministry_app_state").upsert({
      id: REMOTE_STATE_ID,
      state: getRemoteStatePayload(),
      updated_by: currentSupabaseUser.id,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (error) {
    console.error("Unable to save shared Supabase state", error);
    if (elements.backupStatus) {
      elements.backupStatus.textContent =
        "Shared save failed. Export a JSON backup before closing this browser.";
    }
  } finally {
    remoteSaveInFlight = false;
    if (remoteSaveQueued) {
      remoteSaveQueued = false;
      queueRemoteStateSave();
    }
  }
}

async function loadRemoteStateAfterSignIn() {
  if (!isSupabaseReady() || !currentSupabaseUser) return;
  const { data, error } = await supabaseClient
    .from("ministry_app_state")
    .select("state")
    .eq("id", REMOTE_STATE_ID)
    .maybeSingle();
  if (error) throw error;

  remoteStateLoaded = true;
  if (data && data.state) {
    isApplyingRemoteState = true;
    try {
      applyImportedState(data.state);
    } finally {
      isApplyingRemoteState = false;
    }
    saveState();
    renderAll();
    return;
  }

  await saveRemoteStateNow({ force: true });
}

async function getSupabaseStaffUser(user) {
  const { data, error } = await supabaseClient
    .from("ministry_staff")
    .select("display_name,is_active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data || !data.is_active) {
    throw new Error("This account is not approved for the Lighthouse Ministry Hub.");
  }
  return {
    id: user.id,
    displayName: data.display_name || user.email || "Staff",
    username: user.email || user.id,
    isSupabaseUser: true,
  };
}

async function initializeSupabaseSession() {
  if (!isSupabaseMode()) {
    if (!isLocalPasswordMode()) {
      setError(
        elements.gateLoginError,
        "Supabase is not configured for this deployed site. Add the Supabase URL and anon key before using it online."
      );
    }
    return;
  }
  if (!isSupabaseReady()) {
    setError(
      elements.gateLoginError,
      "Supabase is configured, but the Supabase library did not load."
    );
    return;
  }
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (!data.session || !data.session.user) return;
    currentSupabaseUser = data.session.user;
    const staffUser = await getSupabaseStaffUser(currentSupabaseUser);
    await loadRemoteStateAfterSignIn();
    setStaffMode(true, staffUser);
  } catch (error) {
    console.error("Unable to restore Supabase session", error);
    await supabaseClient.auth.signOut();
    setStaffMode(false, null);
    setError(elements.gateLoginError, error.message || "Please sign in again.");
  }
}

async function signOutSupabaseStaff() {
  if (isSupabaseReady()) {
    await saveRemoteStateNow();
    await supabaseClient.auth.signOut();
  }
  currentSupabaseUser = null;
  remoteStateLoaded = false;
  setStaffMode(false, null);
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
  state.staffUsers = isLocalPasswordMode() ? importedState.staffUsers || state.staffUsers : [];
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

  showAwardConfirm({ personId, points, type: "award", reason: note, source: "form" });
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

  const person = state.people.find((entry) => entry.id === personId);
  const balanceBefore = person ? Number(person.points) || 0 : 0;
  askConfirm({
    title: "Remove Points",
    message: "This subtracts points from the member balance and is written to the activity log.",
    details: [
      person ? `${person.firstName} ${person.lastName}` : "Selected member",
      `Balance: ${balanceBefore} → ${Math.max(0, balanceBefore - points)} points`,
      `Reason: ${note}`,
    ].join("\n"),
    confirmLabel: `Remove ${points} pt${points === 1 ? "" : "s"}`,
    onConfirm: () => {
      adjustPoints(personId, -points, "remove", note);
      elements.removeForm.reset();
      renderAll();
    },
  });
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
  });
}

if (elements.staffUserForm) {
  elements.staffUserForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isLocalPasswordMode()) {
      setError(
        elements.staffUserError,
        "Staff accounts are managed in Supabase Authentication."
      );
      return;
    }
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
    const dueDate = elements.staffTaskDue ? elements.staffTaskDue.value : "";
    if (editingStaffTodoId) {
      const todo = state.staffTodosGlobal.find((entry) => entry.id === editingStaffTodoId);
      if (todo) {
        todo.title = title;
        todo.dueDate = dueDate;
      }
      logAdminAction("Staff Reminder Updated", `Updated staff reminder "${title}"`);
    } else {
      state.staffTodosGlobal.unshift({
        id: crypto.randomUUID(),
        title,
        dueDate,
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
  buildRedeemConfirm();
});

if (elements.redeemSearch) {
  elements.redeemSearch.addEventListener("input", () => {
    applyRedeemFilter();
  });
}

if (elements.reportRange) {
  elements.reportRange.addEventListener("change", renderReports);
}

if (elements.reportType) {
  elements.reportType.addEventListener("change", renderReports);
}

if (elements.redeemConfirm) {
  elements.redeemConfirm.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-redeem-do")) {
      confirmRedeem();
    } else if (button.hasAttribute("data-redeem-cancel")) {
      hideConfirmPanel(elements.redeemConfirm);
    }
  });
}

if (elements.awardConfirm) {
  elements.awardConfirm.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-award-do")) {
      confirmAward();
    } else if (button.hasAttribute("data-award-cancel")) {
      pendingAward = null;
      hideConfirmPanel(elements.awardConfirm);
    }
  });
}

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
  renderDashboardStats();
  renderDashboardHome();
  renderSummary();
  renderLogControls();
  renderStaffTaskBoard();
  renderVolunteers();
  renderDonors();
  renderDocuments();
  renderResources();
  renderStaffUsers();
  renderRestoreControls();
  renderRedeemPoints();
  renderAdminLog();
  renderBackupStatus();
  hydrateTasks();
  updateRedeemTotal();
  updateRedeemGroupCounts();
  renderRewardsHistory();
  renderRewardsToast();
  updateAwardBalance();
  renderReports();
  updateStaffVisibility();
  applyRoute();
}

// ---- Hash router: app shell page navigation ----
function parseRouteFromHash() {
  const raw = String(window.location.hash || "").replace(/^#\/?/, "").trim();
  if (!raw) return { page: "dashboard", memberId: "" };
  const segments = raw.split("/").filter(Boolean);
  const head = segments[0];
  if (head === "members" && segments[1]) {
    return { page: "member-profile", memberId: decodeURIComponent(segments[1]) };
  }
  if (APP_ROUTES.includes(head)) {
    const focusId = segments[1] ? decodeURIComponent(segments[1]) : "";
    return { page: head, memberId: focusId };
  }
  return { page: "dashboard", memberId: "" };
}

function openAppDrawer() {
  if (!elements.appShell) return;
  elements.appShell.classList.add("is-drawer-open");
  if (elements.appScrim) elements.appScrim.hidden = false;
  if (elements.appMenuToggle) elements.appMenuToggle.setAttribute("aria-expanded", "true");
}

function closeAppDrawer(options = {}) {
  if (!elements.appShell) return;
  const wasOpen = elements.appShell.classList.contains("is-drawer-open");
  elements.appShell.classList.remove("is-drawer-open");
  if (elements.appScrim) elements.appScrim.hidden = true;
  if (elements.appMenuToggle) elements.appMenuToggle.setAttribute("aria-expanded", "false");
  if (wasOpen && options.restoreFocus && elements.appMenuToggle) {
    elements.appMenuToggle.focus();
  }
}

function toggleAppDrawer() {
  if (!elements.appShell) return;
  if (elements.appShell.classList.contains("is-drawer-open")) {
    closeAppDrawer();
  } else {
    openAppDrawer();
  }
}

function applyRoute(options = {}) {
  const shouldScroll = Boolean(options.scroll);
  const route = parseRouteFromHash();
  currentRoute = route;

  document.querySelectorAll("[data-page]").forEach((pageElement) => {
    pageElement.hidden = pageElement.dataset.page !== route.page;
  });

  const navKey = APP_NAV_ROUTES[route.page] || "dashboard";
  document.querySelectorAll(".app-nav__link").forEach((link) => {
    const isActive = link.dataset.route === navKey;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const title = APP_ROUTE_TITLES[route.page] || "Dashboard";
  if (elements.appPageTitle) elements.appPageTitle.textContent = title;
  document.title = `${title} - Lighthouse Ministry Hub`;

  if (route.page === "member-profile") {
    renderMemberProfile(route.memberId);
  } else if (route.page === "check-in" || route.page === "rewards") {
    applyMemberPreset(route);
  }

  closeAppDrawer();

  if (shouldScroll) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  if (options.focusHeading && elements.appPageTitle) {
    try {
      elements.appPageTitle.focus({ preventScroll: true });
    } catch (error) {
      elements.appPageTitle.focus();
    }
  }
}

function attachRouter() {
  if (!window.location.hash) {
    try {
      window.history.replaceState(null, "", "#/dashboard");
    } catch (error) {
      window.location.hash = "#/dashboard";
    }
  }
  window.addEventListener("hashchange", () => applyRoute({ scroll: true, focusHeading: true }));

  if (elements.appMenuToggle) {
    elements.appMenuToggle.addEventListener("click", toggleAppDrawer);
  }
  if (elements.appScrim) {
    elements.appScrim.addEventListener("click", closeAppDrawer);
  }
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (getTopOpenModal()) return;
    closeAppDrawer({ restoreFocus: true });
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeAppDrawer();
  });

  applyRoute();
}


function applyMemberPreset(route) {
  const memberId = route.memberId;
  if (!memberId) {
    lastPresetKey = "";
    return;
  }
  const key = `${route.page}:${memberId}`;
  if (key === lastPresetKey) return;
  const person = (state.people || []).find((entry) => entry.id === memberId);
  if (!person) return;
  lastPresetKey = key;

  const selects = document.querySelectorAll(
    '#checkin-member, #redeem-form select[name="personId"], #task-form select[name="personId"], #award-form select[name="personId"]'
  );
  selects.forEach((select) => {
    const option = Array.from(select.options).find((entry) => entry.value === memberId);
    if (!option) return;
    select.value = memberId;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function buildProfileEmpty(message) {
  const empty = document.createElement("p");
  empty.className = "hint";
  empty.textContent = message;
  return empty;
}

function renderMemberProfile(memberId) {
  const root = elements.memberProfileRoot;
  if (!root) return;
  root.innerHTML = "";

  const person = state.people.find((entry) => entry.id === memberId);
  if (!person) {
    if (elements.memberProfileTitle) elements.memberProfileTitle.textContent = "Member Profile";
    const missing = document.createElement("div");
    missing.className = "profile-missing";
    const title = document.createElement("p");
    title.className = "empty-state__title";
    title.textContent = "Member not found";
    const copy = document.createElement("p");
    copy.className = "hint";
    copy.textContent =
      "This member may have been removed. Return to the directory to choose another member.";
    const back = document.createElement("a");
    back.className = "btn secondary";
    back.href = "#/members";
    back.textContent = "Back to Members";
    missing.append(title, copy, back);
    root.append(missing);
    return;
  }

  const fullName = `${person.firstName} ${person.lastName}`;
  if (elements.memberProfileTitle) elements.memberProfileTitle.textContent = fullName;

  const points = Number(person.points) || 0;
  const visits = getVisitEntriesForPerson(person.id);
  const lastVisit = getLastVisitTimestamp(person.id);
  const activityEntries = state.activity
    .filter((entry) => entry.personId === person.id)
    .slice()
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const header = document.createElement("div");
  header.className = "profile-header";

  const avatar = document.createElement("div");
  avatar.className = "profile-header__avatar";
  if (person.profilePhoto) {
    const img = document.createElement("img");
    img.src = person.profilePhoto;
    img.alt = fullName;
    avatar.append(img);
  } else {
    avatar.textContent = getInitials(person.firstName, person.lastName);
  }

  const identity = document.createElement("div");
  identity.className = "profile-header__identity";
  const nameEl = document.createElement("h3");
  nameEl.className = "profile-header__name";
  nameEl.textContent = fullName;

  const badges = document.createElement("div");
  badges.className = "member-badges";
  const tagBadge = document.createElement("span");
  tagBadge.className = "member-badge member-badge--neutral";
  tagBadge.textContent = person.residenceTag || "No tag";
  badges.append(tagBadge);
  if (person.followUpNeeded) {
    const followBadge = document.createElement("span");
    followBadge.className = "member-badge";
    followBadge.textContent = person.followUpNote
      ? `Needs Follow-Up: ${person.followUpNote}`
      : "Needs Follow-Up";
    badges.append(followBadge);
  }

  const meta = document.createElement("p");
  meta.className = "hint";
  meta.textContent = `${visits.length} visit${visits.length === 1 ? "" : "s"} logged${
    lastVisit ? ` • Last visit ${new Date(lastVisit).toLocaleDateString()}` : " • No visits yet"
  }`;

  identity.append(nameEl, badges, meta);

  const actions = document.createElement("div");
  actions.className = "profile-header__actions";
  const createActionLink = (href, label) => {
    const link = document.createElement("a");
    link.className = "btn secondary small";
    link.href = href;
    link.textContent = label;
    return link;
  };
  const memberLink = encodeURIComponent(person.id);
  actions.append(
    createActionLink("#/members", "Back to Members"),
    createActionLink(`#/check-in/${memberLink}`, "Check In"),
    createActionLink(`#/rewards/${memberLink}`, "Award / Redeem")
  );

  header.append(avatar, identity, actions);
  root.append(header);

  const stats = document.createElement("div");
  stats.className = "profile-stats";
  [
    { label: "Current Points", value: String(points) },
    { label: "Visits Logged", value: String(visits.length) },
    {
      label: "Last Visit",
      value: lastVisit ? new Date(lastVisit).toLocaleDateString() : "None yet",
    },
    { label: "Point Activity", value: String(activityEntries.length) },
  ].forEach((definition) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    const label = document.createElement("span");
    label.className = "stat-card__label";
    label.textContent = definition.label;
    const value = document.createElement("strong");
    value.className = "stat-card__value";
    value.textContent = definition.value;
    card.append(label, value);
    stats.append(card);
  });
  root.append(stats);

  const historyCard = document.createElement("section");
  historyCard.className = "profile-panel";
  const historyHeader = document.createElement("div");
  historyHeader.className = "profile-panel__header";
  historyHeader.innerHTML = "<h3>Point History</h3>";
  historyCard.append(historyHeader);

  if (activityEntries.length === 0) {
    historyCard.append(buildProfileEmpty("No point activity has been recorded yet."));
  } else {
    const table = document.createElement("div");
    table.className = "table profile-ledger";
    const headerRow = document.createElement("div");
    headerRow.className = "table__row header";
    headerRow.innerHTML =
      "<div>Date</div><div>Action</div><div>Amount</div><div>Balance</div>";
    table.append(headerRow);

    activityEntries.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "table__row";

      const dateCell = document.createElement("div");
      dateCell.textContent = new Date(entry.timestamp).toLocaleString();

      const actionCell = document.createElement("div");
      actionCell.textContent = entry.note || entry.type || "Activity";
      const metaLine = document.createElement("span");
      metaLine.className = "hint";
      metaLine.textContent = [entry.type, entry.actor].filter(Boolean).join(" • ");
      actionCell.append(document.createElement("br"), metaLine);

      const delta = Number(entry.delta);
      const amountCell = document.createElement("div");
      const amount = document.createElement("span");
      const isDebit = Number.isFinite(delta) && delta < 0;
      amount.className = `ledger-amount ${isDebit ? "ledger-amount--down" : "ledger-amount--up"}`;
      amount.textContent = Number.isFinite(delta)
        ? `${delta > 0 ? "+" : ""}${delta}`
        : "—";
      amountCell.append(amount);

      const balanceCell = document.createElement("div");
      balanceCell.textContent = Number.isFinite(Number(entry.after))
        ? String(Number(entry.after))
        : "—";

      row.append(dateCell, actionCell, amountCell, balanceCell);
      table.append(row);
    });

    historyCard.append(table);
  }
  root.append(historyCard);

  const visitCard = document.createElement("section");
  visitCard.className = "profile-panel";
  const visitHeader = document.createElement("div");
  visitHeader.className = "profile-panel__header";
  visitHeader.innerHTML = "<h3>Visit History</h3>";
  visitCard.append(visitHeader);
  if (visits.length === 0) {
    visitCard.append(buildProfileEmpty("No visits logged yet. Use Check-In to log the first one."));
  } else {
    const list = document.createElement("ul");
    list.className = "profile-visit-list";
    visits.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${new Date(entry.timestamp).toLocaleString()} — ${
        entry.actor || "Unknown Staff"
      }`;
      list.append(item);
    });
    visitCard.append(list);
  }
  root.append(visitCard);

  const contactCard = document.createElement("section");
  contactCard.className = "profile-panel";
  const contactHeader = document.createElement("div");
  contactHeader.className = "profile-panel__header";
  contactHeader.innerHTML = "<h3>Contact &amp; Details</h3>";
  contactCard.append(contactHeader);
  const details = document.createElement("div");
  details.className = "profile-details";
  [
    ["Home / Housing", person.home || "Not recorded"],
    ["Phone", person.phone || "Not recorded"],
    ["Email", person.email || "Not recorded"],
    ["Emergency Contact", person.emergencyContactName || "Not recorded"],
    ["Emergency Phone", person.emergencyContactPhone || "Not recorded"],
    ["Notes", person.memberNotes || "None"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "profile-detail";
    const labelEl = document.createElement("span");
    labelEl.className = "profile-detail__label";
    labelEl.textContent = label;
    const valueEl = document.createElement("span");
    valueEl.className = "profile-detail__value";
    valueEl.textContent = String(value);
    row.append(labelEl, valueEl);
    details.append(row);
  });
  contactCard.append(details);
  root.append(contactCard);
}

function logVisit(personId, note) {
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;
  const cleanNote = String(note || "").trim();
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
    note: cleanNote || "Visit logged",
    actor: getCurrentActorName(),
    timestamp: new Date().toISOString(),
  });
  state.activity = state.activity.slice(0, MAX_ACTIVITY_LOG_ENTRIES);
  saveState();
}

function getRecentVisitForPerson(personId, withinMs = 60000) {
  const cutoff = Date.now() - withinMs;
  return (state.visits || []).find(
    (entry) => entry.personId === personId && Date.parse(entry.timestamp) >= cutoff
  );
}

function getCheckinMatches() {
  const searchTerm = elements.checkinSearch ? normalizeLabel(elements.checkinSearch.value) : "";
  return (state.people || []).filter((person) => {
    if (!searchTerm) return true;
    return (
      normalizeLabel(`${person.firstName} ${person.lastName}`).includes(searchTerm) ||
      normalizeLabel(person.residenceTag || "").includes(searchTerm) ||
      normalizeLabel(person.home || "").includes(searchTerm)
    );
  });
}

function applyCheckinFilter() {
  const matches = getCheckinMatches();
  if (!elements.checkinMember) return matches;
  const previous = elements.checkinMember.value || selectedCheckinMemberId;
  elements.checkinMember.innerHTML = "";
  matches.forEach((person) => {
    const option = document.createElement("option");
    option.value = person.id;
    option.textContent = `${person.firstName} ${person.lastName}`;
    elements.checkinMember.append(option);
  });
  const keep = matches.find((person) => person.id === previous) || matches[0];
  if (keep) {
    elements.checkinMember.value = keep.id;
    selectedCheckinMemberId = keep.id;
  }
  return matches;
}

function getPendingCheckinMember() {
  const personId = elements.checkinMember ? elements.checkinMember.value : "";
  return (state.people || []).find((person) => person.id === personId) || null;
}

function hideCheckinConfirm() {
  if (!elements.checkinConfirm) return;
  elements.checkinConfirm.hidden = true;
  elements.checkinConfirm.innerHTML = "";
}

function renderCheckinWarning(message) {
  if (!elements.checkinConfirm) return;
  const warning = elements.checkinConfirm.querySelector("[data-checkin-warning]");
  if (!warning) return;
  warning.textContent = message;
  warning.hidden = false;
}

function showCheckinConfirm() {
  if (!elements.checkinConfirm) return;
  const person = getPendingCheckinMember();
  if (!person) return;
  const note = elements.checkinNote ? elements.checkinNote.value.trim() : "";
  const visits = getVisitEntriesForPerson(person.id);
  const lastVisit = visits[0] ? new Date(visits[0].timestamp).toLocaleString() : "No visits yet";
  const duplicate = getRecentVisitForPerson(person.id);
  const row = (label, value) =>
    `<div class="checkin-confirm__row"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;

  elements.checkinConfirm.innerHTML = `
    <p class="checkin-confirm__title">Confirm check-in</p>
    ${row("Member", escapeHtml(`${person.firstName} ${person.lastName}`))}
    ${row("Points", escapeHtml(String(Number(person.points) || 0)))}
    ${row("Last visit", escapeHtml(lastVisit))}
    ${row(
      "Follow-up",
      escapeHtml(person.followUpNeeded ? person.followUpNote || "Flagged" : "Not flagged")
    )}
    ${row("Visit note", note ? escapeHtml(note) : "None")}
    <div class="form-actions compact">
      <button type="button" class="btn primary" data-checkin-confirm${
        duplicate ? " disabled" : ""
      }>Confirm Check-In</button>
      <button type="button" class="btn secondary" data-checkin-cancel>Cancel</button>
    </div>
    <p class="error" data-checkin-warning hidden></p>
  `;
  elements.checkinConfirm.hidden = false;
  if (duplicate) {
    renderCheckinWarning(
      `${person.firstName} ${person.lastName} was already checked in within the last minute. Cancel to avoid a duplicate visit.`
    );
  }
  const confirmButton = elements.checkinConfirm.querySelector("[data-checkin-confirm]");
  if (confirmButton && !duplicate) confirmButton.focus();
}

function confirmCheckin() {
  if (checkinSubmitting) return;
  const person = getPendingCheckinMember();
  if (!person) return;
  if (getRecentVisitForPerson(person.id)) {
    renderCheckinWarning(
      `${person.firstName} ${person.lastName} was already checked in within the last minute.`
    );
    return;
  }
  checkinSubmitting = true;
  const note = elements.checkinNote ? elements.checkinNote.value.trim() : "";
  logVisit(person.id, note);
  selectedCheckinMemberId = person.id;
  lastCheckinResult = {
    personId: person.id,
    name: `${person.firstName} ${person.lastName}`,
    note,
    timestamp: new Date().toISOString(),
  };
  if (elements.checkinNote) elements.checkinNote.value = "";
  hideCheckinConfirm();
  checkinSubmitting = false;
  renderAll();
}

function renderCheckinResult() {
  if (!elements.checkinResult) return;
  if (!lastCheckinResult) {
    elements.checkinResult.innerHTML = "";
    elements.checkinResult.hidden = true;
    return;
  }
  const { personId, name, note, timestamp } = lastCheckinResult;
  elements.checkinResult.hidden = false;
  elements.checkinResult.innerHTML = `
    <p class="checkin-result__title">Checked in: ${escapeHtml(name)}</p>
    <p class="hint">${escapeHtml(new Date(timestamp).toLocaleTimeString())}${
    note ? ` &middot; Note: ${escapeHtml(note)}` : " &middot; No note added"
  }</p>
    <div class="form-actions compact">
      <a class="btn small primary" href="#/members/${encodeURIComponent(personId)}">Open Profile</a>
      <button type="button" class="btn small secondary" data-checkin-again>Check In Another Member</button>
    </div>
  `;
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
  if (!isLocalPasswordMode()) {
    state.staffUsers = [];
    return;
  }
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
    const eventTime = eventDateTime(eventItem.date);
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

function renderDashboardHome() {
  if (elements.dashboardFollowups) {
    const followUps = (state.people || []).filter((person) => person.followUpNeeded);
    if (!followUps.length) {
      elements.dashboardFollowups.innerHTML =
        "<p class='hint'>No follow-ups flagged. Members you mark during check-in appear here.</p>";
    } else {
      elements.dashboardFollowups.innerHTML = followUps
        .slice(0, 6)
        .map((person) => {
          const lastVisit = getLastVisitTimestamp(person.id);
          const meta = lastVisit
            ? `Last visit ${formatLogDate(lastVisit)}`
            : "No visits logged yet";
          return `
            <a class="person__entry person__entry--link" href="#/members/${encodeURIComponent(person.id)}">
              <strong>${escapeHtml(`${person.firstName} ${person.lastName}`)}</strong><br />
              <span class="hint">${escapeHtml(meta)}</span>
            </a>
          `;
        })
        .join("");
      if (followUps.length > 6) {
        elements.dashboardFollowups.insertAdjacentHTML(
          "beforeend",
          `<p class="hint">+${followUps.length - 6} more flagged.</p>`
        );
      }
    }
  }

  if (elements.dashboardEvents) {
    const upcoming = getUpcomingEvents(14).sort(
      (a, b) => eventDateTime(a.date) - eventDateTime(b.date)
    );
    if (!upcoming.length) {
      elements.dashboardEvents.innerHTML =
        "<p class='hint'>No events in the next two weeks. Add one on the Calendar page.</p>";
    } else {
      elements.dashboardEvents.innerHTML = upcoming
        .slice(0, 5)
        .map((eventItem) => {
          const detail = eventItem.description ? escapeHtml(eventItem.description) : "Event";
          return `
            <div class="person__entry">
              <strong>${escapeHtml(eventItem.title)}</strong><br />
              <span class="hint">${escapeHtml(formatEventDate(eventItem.date))} &middot; ${detail}</span>
            </div>
          `;
        })
        .join("");
    }
  }

  if (elements.dashboardActivity) {
    const recent = (state.activity || [])
      .slice()
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, 8);
    if (!recent.length) {
      elements.dashboardActivity.innerHTML =
        "<p class='hint'>No activity recorded yet. Check-ins and point changes show up here.</p>";
    } else {
      elements.dashboardActivity.innerHTML = recent
        .map((entry) => {
          const personName = entry.personId ? getPersonName(entry.personId) : "Unknown";
          const delta = Number.isFinite(entry.delta) ? entry.delta : null;
          const deltaLabel = delta === null ? "" : `${delta > 0 ? "+" : ""}${delta} pts`;
          const deltaClass =
            delta === null ? "" : delta >= 0 ? " ledger-amount--up" : " ledger-amount--down";
          const label = entry.note || titleCase(entry.type || "activity");
          const deltaHtml = deltaLabel
            ? ` &middot; <span class="ledger-amount${deltaClass}">${escapeHtml(deltaLabel)}</span>`
            : "";
          return `
            <div class="person__entry">
              <strong>${escapeHtml(personName)}</strong><br />
              <span class="hint">${escapeHtml(label)}${deltaHtml} &middot; ${escapeHtml(
            formatLogDate(entry.timestamp)
          )}</span>
            </div>
          `;
        })
        .join("");
    }
  }
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

  const filtersActive = Boolean(searchTerm) || Boolean(activeTag);
  if (elements.memberCount) {
    const total = state.people.length;
    const filterParts = [];
    if (searchTerm) filterParts.push(`matching "${elements.memberSearch.value.trim()}"`);
    if (activeTag) filterParts.push(`tagged ${activeTag}`);
    elements.memberCount.textContent =
      total === 0
        ? "No members yet. Add your first member with the form above."
        : `Showing ${visiblePeople.length} of ${total} member${total === 1 ? "" : "s"}${
            filterParts.length ? ` (${filterParts.join(", ")})` : ""
          }.`;
  }
  if (elements.memberClearFilters) {
    elements.memberClearFilters.hidden = !filtersActive;
  }

  if (visiblePeople.length === 0) {
    elements.peopleList.innerHTML =
      state.people.length === 0
        ? "<p class='hint'>No members yet. Use the Add Member form above to start your roster.</p>"
        : "<p class='hint'>No members match those filters. Clear the search or tag filter to see everyone again.</p>";
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
      <div class="person__name">${escapeHtml(`${person.firstName} ${person.lastName}`)}</div>
      <div class="person__points">${Number(person.points) || 0} points</div>
      <div class="person__meta">${escapeHtml(person.residenceTag || "No tag")}${person.home ? ` | ${escapeHtml(person.home)}` : ""}</div>
      <div class="person__meta">Visits: ${visitCount}${lastVisit ? ` | Last: ${escapeHtml(new Date(lastVisit).toLocaleDateString())}` : ""}</div>
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
    const profileLink = document.createElement("a");
    profileLink.className = "btn small primary";
    profileLink.href = `#/members/${encodeURIComponent(person.id)}`;
    profileLink.textContent = "Open Profile";
    actions.prepend(profileLink);

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
        askConfirm({
          title: "Hide Reward Item",
          message: "Hidden items disappear from the redeem list for everyone.",
          details: item.name || "Unnamed item",
          confirmLabel: "Hide Item",
          onConfirm: () => {
            if (!state.hiddenItems.includes(item.name)) {
              state.hiddenItems.push(item.name);
            }
            logAdminAction("Item Hidden", `Hid item ${item.name}`);
            saveState();
            renderAll();
          },
        });
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
      <strong>${escapeHtml(name)}</strong><br />
      <span class="hint">${escapeHtml(detail)}</span>
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

// Start of the trailing 7-day window used by the dashboard tiles.
function getWeeklyWindowStart(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function computeDashboardMetrics() {
  const servedToday = getTodayVisits().memberIds.size;
  const weekStart = getWeeklyWindowStart(7);

  let checkInsThisWeek = 0;
  (state.visits || []).forEach((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (Number.isFinite(timestamp) && timestamp >= weekStart) checkInsThisWeek += 1;
  });

  let itemsRedeemedThisWeek = 0;
  (state.activity || []).forEach((entry) => {
    if (entry.type !== "redeem") return;
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp) || timestamp < weekStart) return;
    parseRedeemNote(entry.note || "").forEach((item) => {
      const quantity = Number(item.quantity);
      if (Number.isFinite(quantity) && quantity > 0) itemsRedeemedThisWeek += quantity;
    });
  });

  const followUpsDue = (state.people || []).filter((person) => person.followUpNeeded).length;

  return { servedToday, checkInsThisWeek, itemsRedeemedThisWeek, followUpsDue };
}

function renderDashboardStats() {
  const metrics = computeDashboardMetrics();
  const setValue = (target, value) => {
    if (target) target.textContent = String(value);
  };
  setValue(elements.kpiServedToday, metrics.servedToday);
  setValue(elements.kpiCheckInsWeek, metrics.checkInsThisWeek);
  setValue(elements.kpiRedeemedWeek, metrics.itemsRedeemedThisWeek);
  setValue(elements.kpiFollowUpsDue, metrics.followUpsDue);
  if (elements.kpiFollowUpsCard) {
    elements.kpiFollowUpsCard.classList.toggle("stat-card--attention", metrics.followUpsDue > 0);
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
    status.innerHTML = `<strong>${escapeHtml(entry.actor || "Unknown Staff")}</strong><br /><span class="hint">${escapeHtml(entry.status || "Success")}</span>`;
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
  renderCheckinResult();
  if (!state.people.length) {
    elements.checkinSummary.innerHTML = "<p class='hint'>Add a member before using check-in.</p>";
    elements.checkinHistory.innerHTML = "<p class='hint'>No member selected.</p>";
    return;
  }
  const matches = applyCheckinFilter();
  if (elements.checkinFollowupToggle) {
    elements.checkinFollowupToggle.disabled = matches.length === 0;
  }
  if (!matches.length) {
    elements.checkinSummary.innerHTML =
      "<p class='hint'>No members match that search. Clear the search box to see everyone.</p>";
    elements.checkinHistory.innerHTML = "<p class='hint'>No member selected.</p>";
    return;
  }
  if (selectedCheckinMemberId && matches.some((person) => person.id === selectedCheckinMemberId)) {
    elements.checkinMember.value = selectedCheckinMemberId;
  }
  const personId = elements.checkinMember.value || matches[0].id;
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
  if (elements.checkinRedeemLink) {
    elements.checkinRedeemLink.href = `#/rewards/${encodeURIComponent(person.id)}`;
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

// Event dates are stored as plain YYYY-MM-DD strings. `new Date("2026-10-04")`
// parses that as UTC midnight, which renders as the previous day for anyone
// behind UTC, so date-only values are parsed as local dates here.
function parseDateOnly(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function eventDateTime(value) {
  const parsed = parseDateOnly(value);
  return parsed ? parsed.getTime() : Number.NaN;
}

function formatEventDate(value) {
  const parsed = parseDateOnly(value);
  return parsed ? parsed.toLocaleDateString() : "No date";
}

function getEventsForMonth(monthDate) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  return (state.events || [])
    .filter((eventItem) => {
      const date = parseDateOnly(eventItem.date);
      return date !== null && date >= start && date <= end;
    })
    .sort((a, b) => eventDateTime(a.date) - eventDateTime(b.date));
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
    const parsedDate = parseDateOnly(eventItem.date);
    if (!parsedDate) return;
    const day = parsedDate.getDate();
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
    const dayEvents = byDay[day] || [];
    if (dayEvents.length > 0) {
      cell.classList.add("calendar-day--busy");
      const busyNote = document.createElement("span");
      busyNote.className = "sr-only";
      busyNote.textContent = `${dayEvents.length} scheduled item${
        dayEvents.length === 1 ? "" : "s"
      }`;
      cell.append(busyNote);
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
      popoverDate.textContent = formatEventDate(eventItem.date);

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

  const view = elements.calendarView ? elements.calendarView.value : "month";
  const showGrid = view === "month";
  elements.calendarGrid.hidden = !showGrid;
  if (elements.calendarNav) elements.calendarNav.hidden = !showGrid;
  renderEvents();
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueTime = (todo) => {
    const parsed = Date.parse(todo.dueDate || "");
    return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
  };
  todos.sort((a, b) => {
    if (Boolean(a.done) !== Boolean(b.done)) return a.done ? 1 : -1;
    return dueTime(a) - dueTime(b);
  });
  todos.forEach((todo) => {
    const row = document.createElement("div");
    row.className = "todo-row";
    if (todo.done) row.classList.add("todo-row--done");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(todo.done);
    checkbox.setAttribute("aria-label", `Mark "${todo.title}" ${todo.done ? "not done" : "done"}`);
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      logAdminAction(
        "Staff Reminder Updated",
        `${todo.done ? "Completed" : "Reopened"} staff reminder "${todo.title}"`
      );
      saveState();
      renderStaffTaskBoard();
    });
    const text = document.createElement("span");
    text.textContent = todo.title;
    const status = document.createElement("span");
    status.className = "todo-status";
    if (todo.done) {
      status.textContent = "Done";
      status.classList.add("todo-status--done");
    } else if (todo.dueDate) {
      const due = Date.parse(todo.dueDate);
      if (Number.isFinite(due)) {
        const days = Math.round((due - today.getTime()) / 86400000);
        if (days < 0) {
          const late = Math.abs(days);
          status.textContent = `Overdue by ${late} day${late === 1 ? "" : "s"}`;
          status.classList.add("todo-status--overdue");
        } else if (days === 0) {
          status.textContent = "Due today";
          status.classList.add("todo-status--soon");
        } else if (days === 1) {
          status.textContent = "Due tomorrow";
          status.classList.add("todo-status--soon");
        } else {
          status.textContent = `Due ${new Date(due).toLocaleDateString()}`;
        }
      }
    }
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
      if (elements.staffTaskDue) elements.staffTaskDue.value = todo.dueDate || "";
      if (elements.staffTaskSave) elements.staffTaskSave.textContent = "Update Task";
      if (elements.staffTaskCancel) elements.staffTaskCancel.hidden = false;
      if (elements.staffTaskInput) elements.staffTaskInput.focus();
    });
    remove.addEventListener("click", () => {
      askConfirm({
        title: "Remove Staff Reminder",
        message: "This deletes the reminder from the shared staff task board.",
        details: todo.title || "Untitled reminder",
        confirmLabel: "Remove Reminder",
        onConfirm: () => {
          state.staffTodosGlobal = state.staffTodosGlobal.filter((entry) => entry.id !== todo.id);
          logAdminAction("Staff Reminder Removed", `Removed staff reminder "${todo.title}"`);
          saveState();
          resetStaffTodoForm();
          renderStaffTaskBoard();
        },
      });
    });
    row.append(checkbox, text, status, edit, remove);
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
      askConfirm({
        title: "Remove Donor",
        message: "This deletes the donor record from this hub.",
        details: donor.name || "Unnamed donor",
        confirmLabel: "Remove Donor",
        onConfirm: () => {
          state.donors = state.donors.filter((entry) => entry.id !== donor.id);
          logAdminAction("Donor Removed", `Removed donor ${donor.name}`);
          saveState();
          resetDonorForm();
          renderDonors();
        },
      });
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
      const documentLabel = documentItem.title || documentItem.fileName || "Untitled";
      askConfirm({
        title: "Remove Document",
        message: "This deletes the uploaded document from this hub.",
        details: documentLabel,
        confirmLabel: "Remove Document",
        onConfirm: () => {
          state.documents = state.documents.filter((entry) => entry.id !== documentItem.id);
          logAdminAction("Document Removed", `Removed document ${documentLabel}`);
          saveState();
          renderDocuments();
        },
      });
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
      ? `<img src="${escapeHtml(volunteer.profilePhoto)}" alt="${escapeHtml(volunteer.name)}" />`
      : getInitials(volunteer.name, "");
    info.innerHTML = `
      <div class="person__avatar volunteer-avatar">${avatarContent}</div>
      <div>
        <div class="person__name">${escapeHtml(volunteer.name)}</div>
        <div class="person__meta">${escapeHtml(volunteer.role || "Volunteer")} | Areas: ${escapeHtml(volunteer.areas || "Unassigned")}</div>
        <div class="person__meta">Ministry Safe: ${escapeHtml(volunteer.ministrySafe || "No")} | Times Served: ${Number(volunteer.serviceCount) || 0}</div>
        <div class="person__meta">${escapeHtml(formatPhone(volunteer.phone) || "No phone")}${volunteer.email ? ` | ${escapeHtml(volunteer.email)}` : ""}</div>
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
      askConfirm({
        title: "Remove Volunteer",
        message: "This deletes the volunteer record from this hub.",
        details: volunteer.name || "Unnamed volunteer",
        confirmLabel: "Remove Volunteer",
        onConfirm: () => {
          state.volunteers = state.volunteers.filter((entry) => entry.id !== volunteer.id);
          logAdminAction("Volunteer Removed", `Removed volunteer ${volunteer.name}`);
          saveState();
          resetVolunteerForm();
          renderVolunteers();
        },
      });
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
    .sort((a, b) => {
      const byCategory = (a.category || "").localeCompare(b.category || "");
      if (byCategory !== 0) return byCategory;
      return (a.name || "").localeCompare(b.name || "");
    });
  if (elements.resourceCount) {
    const total = (state.resources || []).length;
    elements.resourceCount.textContent =
      total === 0
        ? "No resources saved yet. Use Add Resource to build the list."
        : `Showing ${resources.length} of ${total} resource${total === 1 ? "" : "s"}${
            searchTerm ? ` matching "${elements.resourceSearch.value.trim()}"` : ""
          }.`;
  }
  if (resources.length === 0) {
    elements.resourceList.innerHTML =
      (state.resources || []).length === 0
        ? "<p class='hint'>No resources yet. Use Add Resource to build the list.</p>"
        : "<p class='hint'>No resources match that search. Clear the search box to see them all.</p>";
    return;
  }
  let lastCategory = "";
  resources.forEach((resource) => {
    const category = resource.category || "Uncategorized";
    if (category !== lastCategory) {
      const heading = document.createElement("h3");
      heading.className = "resource-group__title";
      heading.textContent = category;
      elements.resourceList.append(heading);
      lastCategory = category;
    }
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
      askConfirm({
        title: "Remove Resource",
        message: "This deletes the resource from the community resource list.",
        details: resource.name || "Unnamed resource",
        confirmLabel: "Remove Resource",
        onConfirm: () => {
          state.resources = state.resources.filter((entry) => entry.id !== resource.id);
          logAdminAction("Resource Removed", `Removed resource ${resource.name}`);
          saveState();
          renderResources();
        },
      });
    });
    actions.append(edit, remove);
    details.append(actions);
    body.append(details);
    card.append(body);
    elements.resourceList.append(card);
  });
}

function getEventsForView(view) {
  const sorted = [...(state.events || [])]
    .filter((entry) => Number.isFinite(eventDateTime(entry.date)))
    .sort((a, b) => eventDateTime(a.date) - eventDateTime(b.date));
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (view === "today") {
    return sorted.filter((entry) => {
      const date = parseDateOnly(entry.date);
      if (!date) return false;
      date.setHours(0, 0, 0, 0);
      return date.getTime() === startOfToday.getTime();
    });
  }
  if (view === "upcoming") {
    const end = new Date(startOfToday);
    end.setDate(end.getDate() + 30);
    return sorted.filter((entry) => {
      const date = eventDateTime(entry.date);
      return date >= startOfToday.getTime() && date <= end.getTime();
    });
  }
  return getEventsForMonth(calendarMonth);
}

function renderEvents() {
  if (!elements.calendarEvents) return;
  elements.calendarEvents.innerHTML = "";
  const view = elements.calendarView ? elements.calendarView.value : "month";
  const events = getEventsForView(view);
  if (events.length === 0) {
    const message =
      view === "today"
        ? "Nothing scheduled today."
        : view === "upcoming"
        ? "No events in the next 30 days. Add one below."
        : "No events in this month. Add one below.";
    elements.calendarEvents.innerHTML = `<p class='hint'>${message}</p>`;
    return;
  }

  const todayKey = new Date().toDateString();
  events.forEach((eventItem) => {
    const details = document.createElement("details");
    details.className = "event-card";
    const summary = document.createElement("summary");
    const parsedEventDate = parseDateOnly(eventItem.date);
    const isToday = parsedEventDate !== null && parsedEventDate.toDateString() === todayKey;
    if (isToday) details.classList.add("event-card--today");
    summary.textContent = `${eventItem.title} | ${formatEventDate(eventItem.date)}${
      isToday ? " (Today)" : ""
    }`;
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
      askConfirm({
        title: "Remove Event",
        message: "This deletes the event from the calendar and the upcoming events list.",
        details: `${eventItem.title || "Untitled event"} · ${formatEventDate(eventItem.date)}`,
        confirmLabel: "Remove Event",
        onConfirm: () => {
          state.events = state.events.filter((entry) => entry.id !== eventItem.id);
          logAdminAction("Event Removed", `Removed event ${eventItem.title}`);
          saveState();
          renderCalendar();
          renderEvents();
        },
      });
    });
    list.append(removeButton);
    details.append(list);
    elements.calendarEvents.append(details);
  });
}

function renderStaffUsers() {
  if (!elements.staffUserList) return;
  elements.staffUserList.innerHTML = "";
  if (!isLocalPasswordMode()) {
    const row = document.createElement("div");
    row.className = "table__row";
    row.innerHTML =
      "<div>Staff accounts are managed in Supabase Authentication.</div><div>Use the Supabase dashboard to add or remove staff users.</div><div>-</div>";
    elements.staffUserList.append(row);
    if (elements.staffUserForm) {
      elements.staffUserForm.querySelectorAll("input, button").forEach((control) => {
        control.disabled = true;
      });
    }
    return;
  }
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
  const staffLabel = staffMode
    ? currentStaffUser
      ? currentStaffUser.displayName
      : "On"
    : "Off";
  if (elements.staffStatus) {
    elements.staffStatus.textContent = staffLabel;
  }
  if (elements.appUserAvatar) {
    elements.appUserAvatar.textContent = (staffLabel.trim()[0] || "S").toUpperCase();
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

async function handleStaffLoginSubmit(form, errorElement) {
  const formData = new FormData(form);
  const username = isSupabaseMode()
    ? String(formData.get("username") || "").trim().toLowerCase()
    : normalizeLabel(formData.get("username"));
  const password = String(formData.get("password") || "").trim();
  if (isSupabaseMode()) {
    if (!isSupabaseReady()) {
      setError(errorElement, "Supabase is configured, but the Supabase library did not load.");
      return;
    }
    if (!username || !password) {
      setError(errorElement, "Enter your staff email and password.");
      return;
    }
    setError(errorElement, "Signing in...");
    setSubmitBusy(form, true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: username,
        password,
      });
      if (error) throw error;
      currentSupabaseUser = data.user;
      const staffUser = await getSupabaseStaffUser(data.user);
      await loadRemoteStateAfterSignIn();
      setError(errorElement, "");
      setStaffMode(true, staffUser);
      logAdminAction("Staff Login", `Signed in as ${staffUser.displayName}`);
      form.reset();
    } catch (error) {
      await supabaseClient.auth.signOut();
      currentSupabaseUser = null;
      setError(errorElement, error.message || "Invalid staff email or password.");
    } finally {
      setSubmitBusy(form, false);
    }
    return;
  }
  if (!isLocalPasswordMode()) {
    setError(
      errorElement,
      "Supabase is not configured for this deployed site. Add the Supabase URL and anon key first."
    );
    return;
  }
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
  if (isLocalPasswordMode()) {
    sessionStorage.setItem(STAFF_MODE_KEY, staffMode ? "true" : "false");
  }
  if (currentStaffUser && isLocalPasswordMode()) {
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
  if (elements.memberClearFilters) {
    elements.memberClearFilters.addEventListener("click", () => {
      if (elements.memberSearch) elements.memberSearch.value = "";
      if (elements.memberTagFilter) elements.memberTagFilter.value = "";
      if (elements.memberSort) elements.memberSort.value = "name";
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
  if (elements.calendarView) {
    elements.calendarView.addEventListener("change", () => {
      renderCalendar();
    });
  }
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
    elements.gateLoginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleStaffLoginSubmit(elements.gateLoginForm, elements.gateLoginError);
    });
  }
}

/* ---------- Phase 8: accessible dialogs (focus trap, Escape, focus return) ---------- */

const MODAL_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

const openModalStack = [];
const modalCloseHooks = new Map();
let modalReturnFocus = null;
let pendingConfirmAction = null;
let sensitiveSubmitting = false;

function setSubmitBusy(form, busy) {
  if (!form) return;
  form.setAttribute("aria-busy", busy ? "true" : "false");
  form.classList.toggle("is-busy", Boolean(busy));
  form.querySelectorAll("button[type='submit']").forEach((button) => {
    button.disabled = Boolean(busy);
  });
}

function getModalFocusable(modal) {
  if (!modal) return [];
  return Array.from(modal.querySelectorAll(MODAL_FOCUSABLE_SELECTOR)).filter(
    (node) => !node.hidden && node.offsetParent !== null
  );
}

function getTopOpenModal() {
  return openModalStack.length ? openModalStack[openModalStack.length - 1] : null;
}

function handleModalKeydown(event) {
  const modal = getTopOpenModal();
  if (!modal) return;
  if (event.key === "Escape") {
    event.preventDefault();
    if (modal === elements.sensitiveModal) {
      closeSensitiveConfirmation();
    } else {
      closeModalDialog(modal);
    }
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = getModalFocusable(modal);
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  const inside = modal.contains(active);
  if (event.shiftKey) {
    if (!inside || active === first) {
      event.preventDefault();
      last.focus();
    }
    return;
  }
  if (!inside || active === last) {
    event.preventDefault();
    first.focus();
  }
}

function openModalDialog(modal, options = {}) {
  if (!modal || openModalStack.includes(modal)) return;
  modalReturnFocus = document.activeElement;
  if (typeof options.onClose === "function") {
    modalCloseHooks.set(modal, options.onClose);
  }
  modal.hidden = false;
  openModalStack.push(modal);
  document.addEventListener("keydown", handleModalKeydown, true);
  const focusable = getModalFocusable(modal);
  const target =
    options.initialFocus || focusable[0] || modal.querySelector(".sensitive-modal__panel");
  if (target && typeof target.focus === "function") {
    try {
      target.focus();
    } catch (error) {
      // Ignore focus failures; the dialog is still usable with a mouse.
    }
  }
}

function restoreModalFocus() {
  const previous = modalReturnFocus;
  modalReturnFocus = null;
  const fallback = elements.appPageTitle || elements.pageMain;
  const target =
    previous && document.contains(previous) && previous.offsetParent !== null
      ? previous
      : fallback;
  if (target && typeof target.focus === "function") {
    try {
      target.focus({ preventScroll: true });
    } catch (error) {
      target.focus();
    }
  }
}

function closeModalDialog(modal) {
  if (!modal) return;
  modal.hidden = true;
  const index = openModalStack.indexOf(modal);
  if (index >= 0) openModalStack.splice(index, 1);
  if (!openModalStack.length) {
    document.removeEventListener("keydown", handleModalKeydown, true);
  }
  const hook = modalCloseHooks.get(modal);
  if (hook) {
    modalCloseHooks.delete(modal);
    hook();
  }
  restoreModalFocus();
}

function askConfirm(config = {}) {
  if (!elements.confirmModal || !elements.confirmModalAccept) {
    if (typeof config.onConfirm === "function") config.onConfirm();
    return;
  }
  pendingConfirmAction = config;
  if (elements.confirmModalTitle) {
    elements.confirmModalTitle.textContent = config.title || "Confirm Action";
  }
  if (elements.confirmModalMessage) {
    elements.confirmModalMessage.textContent =
      config.message || "This change is recorded in the admin log.";
  }
  if (elements.confirmModalDetails) {
    elements.confirmModalDetails.textContent = config.details || "";
    elements.confirmModalDetails.hidden = !config.details;
  }
  elements.confirmModalAccept.textContent = config.confirmLabel || "Confirm";
  elements.confirmModalAccept.className =
    config.tone === "primary" ? "btn primary" : "btn danger";
  openModalDialog(elements.confirmModal, {
    initialFocus: elements.confirmModalCancel,
    onClose: () => {
      pendingConfirmAction = null;
    },
  });
}

function settleFocusAfterMutation() {
  const active = document.activeElement;
  const stillUsable =
    active && active !== document.body && document.contains(active) && active.getClientRects().length > 0;
  if (stillUsable) return;
  const fallback = elements.appPageTitle || elements.pageMain;
  if (fallback && typeof fallback.focus === "function") {
    try {
      fallback.focus({ preventScroll: true });
    } catch (error) {
      fallback.focus();
    }
  }
}

function runPendingConfirm() {
  const action = pendingConfirmAction;
  pendingConfirmAction = null;
  closeModalDialog(elements.confirmModal);
  if (action && typeof action.onConfirm === "function") action.onConfirm();
  // Rows are re-rendered by the action, so the trigger may be gone; land focus
  // somewhere predictable instead of dropping it on <body>.
  settleFocusAfterMutation();
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
  openModalDialog(elements.sensitiveModal, {
    initialFocus: needsNewPassword ? elements.sensitiveNewPassword : elements.sensitiveUsername,
    onClose: () => {
      pendingSensitiveAction = null;
    },
  });
  if (elements.sensitiveUsername) {
    elements.sensitiveUsername.setAttribute("aria-describedby", "sensitive-message");
  }
  if (elements.sensitivePassword) {
    elements.sensitivePassword.setAttribute("aria-describedby", "sensitive-message");
  }
}

function closeSensitiveConfirmation() {
  closeModalDialog(elements.sensitiveModal);
}

function attachSensitiveConfirmation() {
  if (!elements.sensitiveForm) return;
  elements.sensitiveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (sensitiveSubmitting) return;
    sensitiveSubmitting = true;
    setSubmitBusy(elements.sensitiveForm, true);
    handleSensitiveSubmit().finally(() => {
      sensitiveSubmitting = false;
      setSubmitBusy(elements.sensitiveForm, false);
    });
  });

async function handleSensitiveSubmit() {
    if (!pendingSensitiveAction) return;
    const formData = new FormData(elements.sensitiveForm);
    const username = isSupabaseMode()
      ? String(formData.get("username") || "").trim().toLowerCase()
      : normalizeLabel(formData.get("username"));
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
    if (isSupabaseMode()) {
      if (!isSupabaseReady()) {
        setError(elements.sensitiveError, "Supabase is configured, but the Supabase library did not load.");
        return;
      }
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: username,
          password,
        });
        if (error) throw error;
        currentSupabaseUser = data.user;
        const confirmingStaffUser = await getSupabaseStaffUser(data.user);
        const action = pendingSensitiveAction;
        closeSensitiveConfirmation();
        setStaffMode(true, confirmingStaffUser);
        if (action.backupReason && !createSafetyBackup(action.backupReason)) return;
        action.onConfirm({ confirmedBy: confirmingStaffUser, newPassword });
        settleFocusAfterMutation();
      } catch (error) {
        setError(elements.sensitiveError, error.message || "Invalid staff email or password.");
        logAdminAction(
          "Protected Action",
          `Denied protected action: ${pendingSensitiveAction.title || "Unknown action"}`,
          "Denied"
        );
      }
      return;
    }
    if (!isLocalPasswordMode()) {
      setError(
        elements.sensitiveError,
        "Supabase is not configured for this deployed site."
      );
      return;
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
    settleFocusAfterMutation();
}

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
  attachConfirmDialog();
}

function attachConfirmDialog() {
  if (elements.confirmModalAccept) {
    elements.confirmModalAccept.addEventListener("click", runPendingConfirm);
  }
  const dismiss = () => closeModalDialog(elements.confirmModal);
  if (elements.confirmModalCancel) {
    elements.confirmModalCancel.addEventListener("click", dismiss);
  }
  if (elements.confirmModal) {
    elements.confirmModal.addEventListener("click", (event) => {
      if (event.target && event.target.dataset.closeConfirm === "true") dismiss();
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
    parts.push(`Date: ${formatEventDate(eventItem.date)}`);
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
        <h1>Lighthouse Community Resource List</h1>
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
      showAwardConfirm({
        personId,
        points: selectedTask.points,
        type: "task",
        reason: selectedTask.label,
        source: "task",
      });
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
  applyRedeemFilter();
  updateRedeemCart();
  if (!elements.redeemButton) return;
  const selections = getRedeemSelections();
  const total = selections.reduce(
    (sum, entry) => sum + entry.item.cost * entry.quantity,
    0
  );
  elements.redeemButton.textContent = `Redeem (${total} pts)`;
}

function applyRedeemFilter() {
  if (!elements.redeemItems) return;
  const term = elements.redeemSearch ? normalizeLabel(elements.redeemSearch.value) : "";
  elements.redeemItems.querySelectorAll("details").forEach((group) => {
    let visible = 0;
    group.querySelectorAll(".redeem-row").forEach((row) => {
      if (row.classList.contains("redeem-row--header")) return;
      const matches = !term || normalizeLabel(row.textContent || "").includes(term);
      row.hidden = !matches;
      if (matches) visible += 1;
    });
    group.hidden = visible === 0;
  });
}

function getSelectedRedeemPerson() {
  if (!elements.redeemForm) return null;
  const select = elements.redeemForm.querySelector("select[name='personId']");
  if (!select) return null;
  return state.people.find((entry) => entry.id === select.value) || null;
}

function updateRedeemCart() {
  if (!elements.redeemCart) return;
  const person = getSelectedRedeemPerson();
  const selections = getRedeemSelections();
  if (!selections.length) {
    elements.redeemCart.innerHTML =
      "<p class='hint'>Select items to preview the total and the remaining balance.</p>";
    return;
  }
  const total = selections.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);
  const balance = person ? Number(person.points) || 0 : 0;
  const remaining = balance - total;
  const short = remaining < 0;
  elements.redeemCart.innerHTML = `
    <div class="redeem-cart__lines">
      ${selections
        .map(
          (entry) =>
            `<span>${escapeHtml(`${entry.quantity} x ${entry.item.name}`)} — ${
              entry.item.cost * entry.quantity
            } pts</span>`
        )
        .join("")}
    </div>
    ${buildConfirmRow("Total", `${total} pts`)}
    ${buildConfirmRow("Balance after", `${remaining} pts`)}${
      short
        ? `<p class="error">Not enough points. ${escapeHtml(
            person ? person.firstName : "This member"
          )} has ${balance}.</p>`
        : ""
    }
  `;
}

function buildConfirmRow(label, value) {
  return `<div class="confirm-panel__row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(
    String(value)
  )}</strong></div>`;
}

function hideConfirmPanel(panel) {
  if (!panel) return;
  panel.hidden = true;
  panel.innerHTML = "";
}

function updateAwardBalance() {
  if (!elements.awardBalance || !elements.taskForm) return;
  const select = elements.taskForm.querySelector("select[name='personId']");
  const person = select ? state.people.find((entry) => entry.id === select.value) : null;
  elements.awardBalance.textContent = person
    ? `Current balance: ${Number(person.points) || 0} points.`
    : "";
}

function showAwardConfirm(config) {
  if (!elements.awardConfirm) return;
  const person = state.people.find((entry) => entry.id === config.personId);
  const amount = Number(config.points);
  if (!person || !Number.isFinite(amount) || amount <= 0) return;
  const before = Number(person.points) || 0;
  const after = Math.max(0, before + amount);
  pendingAward = {
    personId: person.id,
    points: amount,
    type: config.type,
    note: config.reason,
    source: config.source,
  };
  elements.awardConfirm.innerHTML = `
    <p class="confirm-panel__title">Confirm award</p>
    ${buildConfirmRow("Member", `${person.firstName} ${person.lastName}`)}
    ${buildConfirmRow("Reason", config.reason)}
    ${buildConfirmRow("Points", `+${amount}`)}
    ${buildConfirmRow("Balance", `${before} → ${after}`)}
    <div class="form-actions compact">
      <button type="button" class="btn primary" data-award-do>Confirm Award</button>
      <button type="button" class="btn secondary" data-award-cancel>Cancel</button>
    </div>
  `;
  elements.awardConfirm.hidden = false;
  const button = elements.awardConfirm.querySelector("[data-award-do]");
  if (button) button.focus();
}

function confirmAward() {
  if (!pendingAward) return;
  const { personId, points, type, note, source } = pendingAward;
  const person = state.people.find((entry) => entry.id === personId);
  if (!person) return;
  adjustPoints(personId, points, type, note);
  if (source === "form" && elements.awardForm) elements.awardForm.reset();
  pendingAward = null;
  hideConfirmPanel(elements.awardConfirm);
  showRewardsToast(
    `Awarded ${points} point${points === 1 ? "" : "s"} to ${person.firstName} ${person.lastName} for ${note}.`
  );
  renderAll();
}

function buildRedeemConfirm() {
  if (!elements.redeemConfirm) return;
  const person = getSelectedRedeemPerson();
  if (!person) return;
  const selections = getRedeemSelections();
  if (!selections.length) {
    setError(elements.redeemError, "Select at least one item.");
    return;
  }
  const totalCost = selections.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);
  const balance = Number(person.points) || 0;
  if (totalCost > balance) {
    setError(elements.redeemError, `Not enough points. Needed ${totalCost}, have ${balance}.`);
    return;
  }
  setError(elements.redeemError, "");
  elements.redeemConfirm.innerHTML = `
    <p class="confirm-panel__title">Confirm redemption</p>
    ${buildConfirmRow("Member", `${person.firstName} ${person.lastName}`)}
    <div class="redeem-cart__lines">
      ${selections
        .map((entry) => `<span>${escapeHtml(`${entry.quantity} x ${entry.item.name}`)}</span>`)
        .join("")}
    </div>
    ${buildConfirmRow("Total cost", `${totalCost} pts`)}
    ${buildConfirmRow("Balance", `${balance} → ${Math.max(0, balance - totalCost)}`)}
    <div class="form-actions compact">
      <button type="button" class="btn primary" data-redeem-do>Confirm Redemption</button>
      <button type="button" class="btn secondary" data-redeem-cancel>Cancel</button>
    </div>
  `;
  elements.redeemConfirm.hidden = false;
  const button = elements.redeemConfirm.querySelector("[data-redeem-do]");
  if (button) button.focus();
}

function confirmRedeem() {
  const person = getSelectedRedeemPerson();
  if (!person) return;
  const selections = getRedeemSelections();
  if (!selections.length) {
    hideConfirmPanel(elements.redeemConfirm);
    return;
  }
  const totalCost = selections.reduce((sum, entry) => sum + entry.item.cost * entry.quantity, 0);
  const balance = Number(person.points) || 0;
  if (totalCost > balance) {
    setError(elements.redeemError, `Not enough points. Needed ${totalCost}, have ${balance}.`);
    hideConfirmPanel(elements.redeemConfirm);
    return;
  }
  const note = selections.map((entry) => `${entry.quantity} x ${entry.item.name}`).join("; ");
  adjustPoints(person.id, -totalCost, "redeem", note);
  resetRedeemSelections();
  hideConfirmPanel(elements.redeemConfirm);
  showRewardsToast(
    `Redeemed ${totalCost} point${totalCost === 1 ? "" : "s"} for ${person.firstName} ${
      person.lastName
    } (${note}).`
  );
  renderAll();
}

function showRewardsToast(message) {
  rewardsToastMessage = message;
  renderRewardsToast();
  if (rewardsToastTimer) clearTimeout(rewardsToastTimer);
  rewardsToastTimer = setTimeout(() => {
    rewardsToastMessage = "";
    renderRewardsToast();
  }, 5000);
}

function renderRewardsToast() {
  if (!elements.rewardsToast) return;
  elements.rewardsToast.hidden = !rewardsToastMessage;
  elements.rewardsToast.textContent = rewardsToastMessage;
}

function reportTypeLabel(type) {
  const labels = {
    visit: "Check-ins",
    task: "Task awards",
    award: "Custom awards",
    remove: "Deductions",
    redeem: "Redemptions",
  };
  return labels[type] || titleCase(type || "activity");
}

function renderReports() {
  if (!elements.reportResults) return;
  const rangeValue = elements.reportRange ? elements.reportRange.value : "30";
  const typeValue = elements.reportType ? elements.reportType.value : "all";
  const cutoff =
    rangeValue === "all" ? null : Date.now() - Number(rangeValue) * 24 * 60 * 60 * 1000;

  const inRange = (entry) => {
    const timestamp = Date.parse(entry.timestamp);
    if (!Number.isFinite(timestamp)) return false;
    return cutoff === null || timestamp >= cutoff;
  };

  const visits = (state.visits || []).filter(inRange);
  const activity = (state.activity || []).filter(inRange);
  const servedIds = new Set(visits.map((entry) => entry.personId).filter(Boolean));
  const awards = activity.filter((entry) => Number(entry.delta) > 0);
  const redemptions = activity.filter((entry) => entry.type === "redeem");
  const pointsAwarded = awards.reduce((sum, entry) => sum + (Number(entry.delta) || 0), 0);
  const pointsRedeemed = redemptions.reduce(
    (sum, entry) => sum + Math.abs(Number(entry.delta) || 0),
    0
  );
  const followUps = (state.people || []).filter((person) => person.followUpNeeded).length;

  const rangeLabel = rangeValue === "all" ? "all time" : `the last ${rangeValue} days`;
  const cards = [
    { label: "Check-Ins", value: visits.length },
    { label: "Members Served", value: servedIds.size },
    { label: "Points Awarded", value: pointsAwarded },
    { label: "Points Redeemed", value: pointsRedeemed },
    { label: "Redemptions", value: redemptions.length },
    { label: "Follow-Ups Flagged", value: followUps },
  ];

  const filtered = (typeValue === "all" ? activity : activity.filter((entry) => entry.type === typeValue))
    .slice()
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const shown = filtered.slice(0, 40);

  elements.reportResults.innerHTML = `
    <p class="hint">Showing ${escapeHtml(rangeLabel)}${
    typeValue === "all" ? "" : ` &middot; ${escapeHtml(reportTypeLabel(typeValue))}`
  }. Follow-up count reflects the current roster, not the selected range.</p>
    <div class="kpi-row report-kpis">
      ${cards
        .map(
          (card) => `
        <div class="stat-card">
          <span class="stat-card__label">${escapeHtml(card.label)}</span>
          <strong class="stat-card__value">${escapeHtml(String(card.value))}</strong>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="report-table">
      <div class="report-table__row report-table__row--header">
        <div>Date</div><div>Member</div><div>Action</div><div>Points</div><div>Balance</div>
      </div>
      ${
        shown.length
          ? shown
              .map((entry) => {
                const person = state.people.find(
                  (candidate) => candidate.id === entry.personId
                );
                const name = person ? `${person.firstName} ${person.lastName}` : "Unknown";
                const delta = Number(entry.delta) || 0;
                const deltaClass = delta >= 0 ? "ledger-amount--up" : "ledger-amount--down";
                return `
          <div class="report-table__row">
            <div>${escapeHtml(formatLogDate(entry.timestamp))}</div>
            <div>${escapeHtml(name)}</div>
            <div>${escapeHtml(entry.note || titleCase(entry.type || "activity"))}<br /><span class="hint">by ${escapeHtml(
                  entry.actor || "Unknown"
                )}</span></div>
            <div><span class="ledger-amount ${deltaClass}">${
                  delta > 0 ? "+" : ""
                }${delta}</span></div>
            <div>${escapeHtml(Number.isFinite(entry.after) ? String(entry.after) : "-")}</div>
          </div>
        `;
              })
              .join("")
          : "<div class='report-table__row'><div>No entries in this range.</div><div>-</div><div>-</div><div>-</div><div>-</div></div>"
      }
    </div>
    ${
      filtered.length > shown.length
        ? `<p class="hint">Showing the ${shown.length} most recent of ${filtered.length} matching entries. Use the export buttons for the full log.</p>`
        : ""
    }
  `;
}

function renderRewardsHistory() {
  if (!elements.rewardsHistory) return;
  const entries = (state.activity || [])
    .filter((entry) => Number.isFinite(entry.delta) && entry.delta !== 0)
    .slice(0, 12);
  if (!entries.length) {
    elements.rewardsHistory.innerHTML = "<p class='hint'>No point changes recorded yet.</p>";
    return;
  }
  elements.rewardsHistory.innerHTML = entries
    .map((entry) => {
      const person = state.people.find((candidate) => candidate.id === entry.personId);
      const name = person ? `${person.firstName} ${person.lastName}` : "Unknown";
      const deltaClass = entry.delta >= 0 ? "ledger-amount--up" : "ledger-amount--down";
      const label = entry.note || titleCase(entry.type || "activity");
      return `
        <div class="person__entry">
          <strong>${escapeHtml(name)}</strong><br />
          <span class="hint">${escapeHtml(label)} &middot; <span class="ledger-amount ${deltaClass}">${
        entry.delta > 0 ? "+" : ""
      }${entry.delta}</span> &middot; balance ${escapeHtml(String(entry.after))} &middot; ${escapeHtml(
        formatLogDate(entry.timestamp)
      )}</span>
        </div>
      `;
    })
    .join("");
}

function attachRewardsPanels() {
  if (elements.taskForm) {
    const select = elements.taskForm.querySelector("select[name='personId']");
    if (select) select.addEventListener("change", updateAwardBalance);
  }
  updateAwardBalance();
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

function getErrorFields(target, field) {
  if (field) return [field];
  const ids = String((target.dataset && target.dataset.errorFor) || "")
    .split(/[,\s]+/)
    .filter(Boolean);
  return ids.map((id) => document.getElementById(id)).filter(Boolean);
}

function addDescribedBy(control, id) {
  if (!control || !id) return;
  const described = String(control.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean);
  if (described.includes(id)) return;
  described.push(id);
  control.setAttribute("aria-describedby", described.join(" "));
}

function removeDescribedBy(control, id) {
  if (!control || !id) return;
  const described = String(control.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((entry) => entry !== id);
  if (described.length) {
    control.setAttribute("aria-describedby", described.join(" "));
  } else {
    control.removeAttribute("aria-describedby");
  }
}

function setError(target, message, field) {
  if (!target) return;
  const fields = getErrorFields(target, field);
  if (!message) {
    target.hidden = true;
    target.textContent = "";
    fields.forEach((control) => {
      control.removeAttribute("aria-invalid");
      removeDescribedBy(control, target.id);
    });
    return;
  }
  target.hidden = false;
  target.textContent = message;
  fields.forEach((control) => {
    control.setAttribute("aria-invalid", "true");
    addDescribedBy(control, target.id);
  });
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
    queueRemoteStateSave();
  } catch (error) {
    alert(
      "Unable to save. The photo may be too large for storage. Try a smaller image."
    );
  }
}

















