// ---- Storage keys / image sizing ----
const STORAGE_KEY = "ministryPointsStateV1";
const STAFF_MODE_KEY = "ministryStaffModeV1";
const STAFF_USER_KEY = "ministryStaffUserV1";
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
if (!state.adminLog) state.adminLog = [];
if (!state.visits) state.visits = [];
if (!state.volunteers) state.volunteers = [];
if (!state.events) state.events = [];
if (!state.staffTodosGlobal) state.staffTodosGlobal = [];
if (!state.staffUsers) state.staffUsers = [];
if (!state.donors) state.donors = [];
if (!state.documents) state.documents = [];
if (!state.resources) state.resources = DEFAULT_RESOURCES.map((entry) => ({ ...entry }));
ensureStarterStaffAccount();
let didLegacyTodoMigration = false;
state.people = (state.people || []).map((person) => ({
  ...person,
  home: person.home || person.address || "",
  residenceTag: person.residenceTag || "Homeless",
  email: person.email || "",
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
let currentStaffUser =
  state.staffUsers.find((entry) => entry.id === sessionStorage.getItem(STAFF_USER_KEY)) ||
  null;

// ---- Element references ----
const elements = {
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
  exportData: document.querySelector("#export-data"),
  importData: document.querySelector("#import-data"),
  redeemForm: document.querySelector("#redeem-form"),
  redeemError: document.querySelector("#redeem-error"),
  redeemButton: document.querySelector("#redeem-button"),
  redeemPoints: document.querySelector("#redeem-points"),
  peopleList: document.querySelector("#people-list"),
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
  staffLogs: document.querySelector("#staff-logs"),
  staffActions: document.querySelector("#staff-actions"),
  adminTable: document.querySelector("#admin-table"),
  undoSection: document.querySelector("#undo-section"),
  addTaskToggle: document.querySelector("#add-task-toggle"),
  addTaskForm: document.querySelector("#add-task-form"),
  addTaskName: document.querySelector("#add-task-name"),
  addTaskPoints: document.querySelector("#add-task-points"),
  addTaskError: document.querySelector("#add-task-error"),
  addTaskCancel: document.querySelector("#add-task-cancel"),
  addTaskSave: document.querySelector("#add-task-save"),
  summaryMembers: document.querySelector("#summary-members"),
  summaryItems: document.querySelector("#summary-items"),
  summaryCategory: document.querySelector("#summary-category"),
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
  staffLoginModal: document.querySelector("#staff-login-modal"),
  staffLoginForm: document.querySelector("#staff-login-form"),
  staffLoginUsername: document.querySelector("#staff-login-username"),
  staffLoginPassword: document.querySelector("#staff-login-password"),
  staffLoginError: document.querySelector("#staff-login-error"),
  staffLoginCancel: document.querySelector("#staff-login-cancel"),
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
if (didLegacyTodoMigration) {
  saveState();
}

if (elements.staffToggle) {
  elements.staffToggle.addEventListener("click", () => {
    if (staffMode) {
      setStaffMode(false, null);
      return;
    }
    openStaffLogin();
  });
}

if (elements.undoLast) {
  elements.undoLast.addEventListener("click", () => {
    const confirmed = confirm("Undo the most recent action?");
    if (!confirmed) return;
    const entry = state.activity[0];
    if (!entry) return;
    const person = state.people.find((p) => p.id === entry.personId);
    if (person) {
      if (Number.isFinite(entry.before)) {
        person.points = entry.before;
      } else {
        person.points = Math.max(0, person.points - entry.delta);
      }
    }
    const noteLabel = entry.note || entry.type;
    state.activity.unshift({
      id: crypto.randomUUID(),
      personId: entry.personId || "",
      type: "undo",
      delta: 0,
      before: person ? person.points : null,
      after: person ? person.points : null,
      note: `Undid: ${noteLabel}`,
      timestamp: new Date().toISOString(),
    });
    saveState();
    renderAll();
  });
}

if (elements.exportLogs) {
  elements.exportLogs.addEventListener("click", () => {
    // Build a single CSV with activity, member summary, top tasks, and admin actions.
    const rows = [
      ["Staff Mode Required", "Yes"],
      [
        "Date",
        "Member",
        "Type",
        "Points Change",
        "Points Before",
        "Points After",
        "Note (Preview)",
        "Note (Full)",
        "Updated By",
        "",
        "Member Summary",
        "Total Points",
        "",
        "Top Tasks (Last 30 Days)",
        "Frequency",
        "",
        "Admin Actions",
        "Actor",
        "Status",
        "Time",
        "",
        "Sign-In Sheet",
        "Residence Tag",
      ],
    ];

    const summary = state.people.map((person) => [
      `${person.firstName} ${person.lastName}`,
      String(person.points),
    ]);

    const topTasks = getTopTasks(30);
    const adminLog = state.adminLog || [];
    const maxRows = Math.max(
      state.activity.length,
      summary.length,
      topTasks.length,
      adminLog.length
    );

    for (let i = 0; i < maxRows; i += 1) {
      const entry = state.activity[i];
      if (entry) {
        const person = state.people.find((p) => p.id === entry.personId);
        const name = person ? `${person.firstName} ${person.lastName}` : "Unknown";
        const when = new Date(entry.timestamp).toLocaleString();
        const fullNote = entry.note || "";
        const preview =
          fullNote.length > 80 ? `${fullNote.slice(0, 77)}...` : fullNote;
        const row = [
          when,
          name,
          entry.type,
          String(entry.delta),
          String(Number.isFinite(entry.before) ? entry.before : ""),
          String(Number.isFinite(entry.after) ? entry.after : ""),
          preview,
          fullNote,
          entry.actor || "",
          "",
        ];
        rows.push(row);
      } else {
        rows.push(["", "", "", "", "", "", "", "", "", ""]);
      }

      const summaryRow = summary[i];
      if (summaryRow) {
        rows[rows.length - 1].push(summaryRow[0], summaryRow[1]);
      } else {
        rows[rows.length - 1].push("", "");
      }

      rows[rows.length - 1].push("");

      const taskRow = topTasks[i];
      if (taskRow) {
        rows[rows.length - 1].push(taskRow.label, String(taskRow.count));
      } else {
        rows[rows.length - 1].push("", "");
      }

      rows[rows.length - 1].push("");

      const adminRow = adminLog[i];
      if (adminRow) {
        rows[rows.length - 1].push(
          adminRow.detail || adminRow.type || "Admin action",
          adminRow.actor || "",
          adminRow.status || "Success",
          new Date(adminRow.timestamp).toLocaleString()
        );
      } else {
        rows[rows.length - 1].push("", "", "", "");
      }

      const personRow = state.people[i];
      if (personRow) {
        rows[rows.length - 1].push(
          "",
          `${personRow.firstName} ${personRow.lastName}`,
          personRow.residenceTag || ""
        );
      } else {
        rows[rows.length - 1].push("", "", "");
      }
    }

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const safe = String(value ?? "").replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ministry-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    logAdminAction("Export", "Exported logs CSV");
  });
}

if (elements.exportData) {
  elements.exportData.addEventListener("click", () => {
    // JSON backup of the entire state.
    const payload = {
      exportedAt: new Date().toISOString(),
      state,
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ministry-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

if (elements.importData) {
  elements.importData.addEventListener("click", () => {
    // Restore state from a JSON backup file.
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
        state.people = parsed.state.people || [];
        state.items = parsed.state.items || defaultItems.map((item) => ({ ...item }));
        state.customItems = parsed.state.customItems || [];
        state.customTasks = parsed.state.customTasks || [];
        state.adminLog = parsed.state.adminLog || [];
        state.activity = parsed.state.activity || [];
        state.visits = parsed.state.visits || [];
        state.volunteers = parsed.state.volunteers || [];
        state.donors = parsed.state.donors || [];
        state.documents = parsed.state.documents || [];
        state.events = parsed.state.events || [];
        state.resources = parsed.state.resources || DEFAULT_RESOURCES.map((entry) => ({ ...entry }));
        state.staffTodosGlobal = parsed.state.staffTodosGlobal || [];
        state.staffUsers = parsed.state.staffUsers || state.staffUsers;
        state.people = state.people.map((person) => ({
          ...person,
          home: person.home || person.address || "",
          residenceTag: person.residenceTag || "Homeless",
          email: person.email || "",
          staffTodos: Array.isArray(person.staffTodos) ? person.staffTodos : [],
        }));
        state.activity = state.activity.map((entry) => ({
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
        saveState();
        renderAll();
      } catch (error) {
        alert("Unable to restore backup.");
      }
    });
    input.click();
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
    } else {
      state.staffTodosGlobal.unshift({
        id: crypto.randomUUID(),
        title,
        done: false,
        ownerId: currentStaffUser ? currentStaffUser.id : null,
      });
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
  state.activity = state.activity.slice(0, 50);
  saveState();
}

function renderAll() {
  renderMemberTagFilter();
  renderCalendar();
  renderPeople();
  renderItems();
  renderActivity();
  renderStats();
  renderSummary();
  renderStaffTaskBoard();
  renderVolunteers();
  renderDonors();
  renderDocuments();
  renderResources();
  renderEvents();
  renderStaffUsers();
  renderRedeemPoints();
  renderAdminLog();
  hydrateSelects();
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
    .filter(({ link, section }) => {
      if (!section || link.hidden) return false;
      if (section.hidden) return false;
      const hiddenAncestor = section.closest("[hidden]");
      return !hiddenAncestor;
    });
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
  saveState();
}

function refreshAfterPointsChange() {
  renderPeople();
  renderActivity();
  renderStats();
  renderSummary();
  hydrateSelects();
  updateRedeemTotal();
  updateRedeemGroupCounts();
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
    ethanAccount.password = "2019";
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
    const detailStack = document.createElement("div");
    detailStack.className = "member-card__details-stack";
    info.append(avatar, infoText, detailStack);

    let actions = null;
    if (staffMode) {
      actions = document.createElement("div");
      actions.className = "person__actions";
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn small danger";
      removeButton.textContent = "Remove Member";
      removeButton.addEventListener("click", () => {
        const confirmed = confirm(
          `Remove ${person.firstName} ${person.lastName}? This cannot be undone.`
        );
        if (!confirmed) return;
        state.people = state.people.filter((entry) => entry.id !== person.id);
        state.activity = state.activity.filter((entry) => entry.personId !== person.id);
        state.visits = state.visits.filter((entry) => entry.personId !== person.id);
        logAdminAction(
          "Member Removed",
          `Removed ${person.firstName} ${person.lastName}`
        );
        saveState();
        renderAll();
      });
      actions.append(removeButton);
    }

    const visitButton = document.createElement("button");
    visitButton.type = "button";
    visitButton.className = "btn small secondary";
    visitButton.textContent = "Log Visit";
    visitButton.addEventListener("click", () => {
      logVisit(person.id);
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
        row.textContent = `${index + 1}. ${when.toLocaleString()}`;
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
      if (pendingPhoto !== null) {
        person.profilePhoto = pendingPhoto;
        if (!person.profilePhoto) {
          delete person.profilePhoto;
        }
        pendingPhoto = null;
      }
      saveState();
      setEditing(false);
      reopenProfileId = person.id;
      renderAll();
    });

    actionsRow.append(editButton, cancelButton, saveButton);
    profileList.append(actionsRow);
    profileDetails.append(profileList);

    if (actions) {
      actions.append(visitButton);
      card.append(info, actions);
    } else {
      const visitWrap = document.createElement("div");
      visitWrap.className = "person__actions";
      visitWrap.append(visitButton);
      card.append(info, visitWrap);
    }
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
    } else {
      state.customTasks.push({
        id: `custom-${crypto.randomUUID()}`,
        label: name,
        points,
      });
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
  elements.addTaskForm.reset();
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
  const groups = ITEM_GROUPS.map((group) => ({
    label: group.label,
    items: [...group.items],
  }));

  if (state.customItems && state.customItems.length > 0) {
    state.customItems.forEach((item) => {
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
      input.disabled = !staffMode;
      input.addEventListener("change", () => {
        if (!staffMode) return;
        const nextValue = Number(input.value);
        item.cost = Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
        saveState();
        renderAll();
      });

      row.append(name, input);
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

  if (state.activity.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No activity yet.</div><div>0</div>";
    elements.activityTable.append(empty);
    return;
  }

  const recent = state.activity.slice(0, 5);
  const rest = state.activity.slice(5);

  const renderEntryRow = (entry) => {
    const person = state.people.find((p) => p.id === entry.personId);
    const name = person
      ? `${person.firstName} ${person.lastName}`
      : "Unknown";
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

  if (!state.adminLog || state.adminLog.length === 0) {
    const empty = document.createElement("div");
    empty.className = "table__row";
    empty.innerHTML = "<div>No admin actions yet.</div><div>-</div><div>-</div>";
    elements.adminTable.append(empty);
    return;
  }

  state.adminLog.slice(0, 20).forEach((entry) => {
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
}

function renderSummary() {
  if (!elements.summaryMembers || !elements.summaryItems || !elements.summaryCategory) {
    return;
  }
  const start = new Date();
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
    if (staffMode) {
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
        saveState();
        resetDonorForm();
        renderDonors();
      });
      actionWrap.append(edit, remove);
      donation.append(actionWrap);
    }
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
    if (staffMode) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn small danger";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        state.documents = state.documents.filter((entry) => entry.id !== documentItem.id);
        saveState();
        renderDocuments();
      });
      actions.append(remove);
    }
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
    if (staffMode) {
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
    }
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
    if (staffMode) {
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
        saveState();
        renderResources();
      });
      actions.append(edit, remove);
      details.append(actions);
    }
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
  header.innerHTML = "<div>Staff Account</div><div>Username</div>";
  elements.staffUserList.append(header);
  state.staffUsers.forEach((user) => {
    const row = document.createElement("div");
    row.className = "table__row";
    row.innerHTML = `<div>${user.displayName}</div><div>${user.username}</div>`;
    elements.staffUserList.append(row);
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
  state.adminLog = state.adminLog.slice(0, 100);
  saveState();
  renderAdminLog();
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
  if (elements.staffStatus) {
    elements.staffStatus.textContent = staffMode
      ? currentStaffUser
        ? currentStaffUser.displayName
        : "On"
      : "Off";
  }
  setStaffOnlyVisibility();
  if (!staffMode) {
    closeStaffOnlyDetails();
    closeStaffForms();
  }
  if (elements.undoSection) {
    elements.undoSection.classList.toggle("span-2", staffMode);
  }
}

function setStaffOnlyVisibility() {
  const staffOnly = document.querySelectorAll(".staff-only");
  staffOnly.forEach((element) => {
    element.hidden = !staffMode;
  });
}

function closeStaffForms() {
  if (elements.addTaskForm) {
    elements.addTaskForm.classList.remove("show");
    elements.addTaskForm.style.display = "none";
    setError(elements.addTaskError, "");
  }
  if (elements.addItemForm) {
    elements.addItemForm.classList.remove("show");
    elements.addItemForm.style.display = "none";
    setError(elements.addItemError, "");
  }
}

function closeStaffOnlyDetails() {
  if (!elements.staffLogs) return;
  const details = elements.staffLogs.querySelectorAll("details");
  details.forEach((entry) => {
    entry.open = false;
  });
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
  if (!elements.staffLoginForm || !elements.staffLoginModal) return;
  elements.staffLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.staffLoginForm);
    const username = normalizeLabel(formData.get("username"));
    const password = String(formData.get("password") || "").trim();
    const match = state.staffUsers.find(
      (entry) => entry.username === username && entry.password === password
    );
    if (!match) {
      setError(elements.staffLoginError, "Invalid username or password.");
      logAdminAction("Staff Login", `Denied login for ${username || "unknown"}`, "Denied");
      return;
    }
    setError(elements.staffLoginError, "");
    closeStaffLogin();
    setStaffMode(true, match);
    logAdminAction("Staff Login", `Signed in as ${match.displayName}`);
  });
  if (elements.staffLoginCancel) {
    elements.staffLoginCancel.addEventListener("click", () => {
      closeStaffLogin();
    });
  }
  if (elements.staffLoginModal) {
    elements.staffLoginModal.addEventListener("click", (event) => {
      if (event.target && event.target.dataset.closeLogin === "true") {
        closeStaffLogin();
      }
    });
  }
}

function openStaffLogin() {
  if (!elements.staffLoginModal) return;
  elements.staffLoginModal.hidden = false;
  elements.staffLoginModal.style.display = "grid";
  setError(elements.staffLoginError, "");
  if (elements.staffLoginForm) {
    elements.staffLoginForm.reset();
  }
  if (elements.staffLoginUsername) {
    elements.staffLoginUsername.focus();
  }
}

function closeStaffLogin() {
  if (!elements.staffLoginModal) return;
  elements.staffLoginModal.hidden = true;
  elements.staffLoginModal.style.display = "none";
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
  renderRedeemPoints();

  elements.redeemItems.innerHTML = "";

  getGroupedItems().forEach((group) => {
    const details = document.createElement("details");
    details.open = false;

    const summary = document.createElement("summary");
    summary.textContent = group.label;
    summary.dataset.baseLabel = group.label;
    details.append(summary);

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
      qty.disabled = true;
      qty.className = "redeem-qty";
      qty.dataset.itemName = item.name;
      qty.setAttribute("aria-label", `Quantity to redeem for ${item.name}`);

      const qtyWrap = document.createElement("label");
      qtyWrap.className = "redeem-qty-wrap";
      const qtyLabel = document.createElement("span");
      qtyLabel.className = "redeem-qty-label";
      qtyLabel.textContent = "Qty";
      qtyWrap.append(qtyLabel, qty);

      checkbox.addEventListener("change", () => {
        qty.disabled = !checkbox.checked;
        if (!checkbox.checked) qty.value = "1";
        updateRedeemTotal();
        updateRedeemGroupCounts();
      });

      qty.addEventListener("input", () => {
        updateRedeemTotal();
        updateRedeemGroupCounts();
      });

      label.append(checkbox, text);
      row.append(label, qtyWrap);
      details.append(row);
    });

    elements.redeemItems.append(details);
  });
}

function hydrateTasks() {
  if (!elements.taskButtons) return;
  elements.taskButtons.innerHTML = "";
  const tasks = getAllTasks();
  const visible = tasks.slice(0, 5);
  const hidden = tasks.slice(5);

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
      refreshAfterPointsChange();
    });

    leftGroup.append(button, status);

    if (staffMode && task.id) {
      const actionGroup = document.createElement("div");
      actionGroup.className = "task-actions";
      if (String(task.id).startsWith("custom-")) {
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "btn small secondary";
        edit.textContent = "Edit";
        edit.addEventListener("click", () => {
          openTaskEditor(task);
        });
        actionGroup.append(edit);
      }
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn small danger";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        const confirmed = confirm(`Remove task "${task.label}"?`);
        if (!confirmed) return;
        if (String(task.id).startsWith("custom-")) {
          state.customTasks = state.customTasks.filter((entry) => entry.id !== task.id);
        }
        if (!state.hiddenTasks.includes(task.id)) {
          state.hiddenTasks.push(task.id);
        }
        saveState();
        hydrateTasks();
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
    input.disabled = true;
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

















