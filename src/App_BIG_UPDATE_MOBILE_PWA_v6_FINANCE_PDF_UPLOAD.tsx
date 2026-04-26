// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";



const AVERIO_MOBILE_CSS = `
  html,
  body,
  #root {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    background: #f4f7fb !important;
  }

  *, *::before, *::after {
    box-sizing: border-box !important;
  }

  @media (max-width: 760px) {
    html,
    body {
      position: relative !important;
      overscroll-behavior-x: none !important;
    }

    #root {
      display: block !important;
      min-height: 100dvh !important;
      overflow-x: hidden !important;
    }

    #root > div {
      width: 100vw !important;
      max-width: 100vw !important;
      min-width: 0 !important;
      margin: 0 !important;
      padding: calc(16px + env(safe-area-inset-top)) 14px calc(90px + env(safe-area-inset-bottom)) !important;
      overflow-x: hidden !important;
    }

    #root main,
    #root section,
    #root article,
    #root form,
    #root div {
      max-width: 100% !important;
    }

    #root h1 {
      font-size: 28px !important;
      line-height: 1.05 !important;
      letter-spacing: -0.04em !important;
      color: #111827 !important;
    }

    #root h2 {
      font-size: 22px !important;
      line-height: 1.15 !important;
    }

    #root p {
      font-size: 15px !important;
      line-height: 1.45 !important;
    }

    #root div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }

    #root div[style*="repeat(4"],
    #root div[style*="repeat(3"] {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #root button {
      min-height: 44px !important;
      font-size: 15px !important;
      white-space: normal !important;
      touch-action: manipulation !important;
    }

    #root input,
    #root select,
    #root textarea {
      width: 100% !important;
      max-width: 100% !important;
      font-size: 16px !important;
      min-height: 46px !important;
    }

    #root textarea {
      min-height: 96px !important;
    }

    #root [style*="overflow-x"] {
      -webkit-overflow-scrolling: touch !important;
    }

    #root [style*="minmax(180px"],
    #root [style*="minmax(220px"],
    #root [style*="minmax(240px"],
    #root [style*="minmax(260px"],
    #root [style*="minmax(280px"],
    #root [style*="minmax(320px"] {
      grid-template-columns: 1fr !important;
    }
  }

  .averio-mobile-nav { display: none; }
  .averio-mobile-top-actions { display: none; }

  @media (max-width: 760px) {
    body { background: #f6f8fc !important; }
    #root > div { padding: calc(12px + env(safe-area-inset-top)) 12px calc(106px + env(safe-area-inset-bottom)) !important; }
    .averio-desktop-tabs { display: none !important; }
    .averio-desktop-backup-actions { display: none !important; }
    .averio-mobile-top-actions { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin: 10px 0 14px 0 !important; }
    .averio-mobile-nav { position: fixed !important; left: 10px !important; right: 10px !important; bottom: calc(10px + env(safe-area-inset-bottom)) !important; z-index: 9999 !important; display: flex !important; align-items: center !important; gap: 7px !important; padding: 8px !important; border-radius: 22px !important; background: rgba(255,255,255,0.95) !important; border: 1px solid rgba(148,163,184,0.35) !important; box-shadow: 0 18px 50px rgba(15,23,42,0.22) !important; backdrop-filter: blur(18px) !important; -webkit-backdrop-filter: blur(18px) !important; overflow-x: auto !important; overflow-y: hidden !important; scrollbar-width: none !important; -webkit-overflow-scrolling: touch !important; }
    .averio-mobile-nav::-webkit-scrollbar { display: none !important; }
    .averio-mobile-nav button { flex: 0 0 78px !important; min-width: 78px !important; min-height: 54px !important; border-radius: 16px !important; padding: 6px 4px !important; font-size: 10.5px !important; line-height: 1.12 !important; font-weight: 800 !important; border: 1px solid transparent !important; background: transparent !important; color: #64748b !important; white-space: nowrap !important; }
    .averio-mobile-nav button[data-active="true"] { background: #312e81 !important; color: #fff !important; box-shadow: 0 10px 24px rgba(49,46,129,0.24) !important; }
    .averio-mobile-nav span { display: block !important; font-size: 17px !important; margin-bottom: 2px !important; }
    #root div[style*="grid-template-columns: repeat(auto-fit, minmax(180px"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    #root div[style*="grid-template-columns: repeat(auto-fit, minmax(220px"], #root div[style*="grid-template-columns: repeat(auto-fit, minmax(240px"], #root div[style*="grid-template-columns: repeat(auto-fit, minmax(260px"], #root div[style*="grid-template-columns: repeat(auto-fit, minmax(280px"], #root div[style*="grid-template-columns: repeat(auto-fit, minmax(320px"] { grid-template-columns: 1fr !important; }
    #root [style*="padding: 34px"], #root [style*="padding: 30px"], #root [style*="padding: 28px"] { padding: 16px !important; }
  }

`;

function injectAverioMobileCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("averio-mobile-css")) return;
  const style = document.createElement("style");
  style.id = "averio-mobile-css";
  style.textContent = AVERIO_MOBILE_CSS;
  document.head.appendChild(style);
}

injectAverioMobileCss();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase Umgebungsvariablen fehlen. Bitte .env prüfen.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

const COMPANY_PROFILE = {
  name: "Averio Propery Services",
  legalName: "Averio Propery Services",
  street: "Lichtenberger Straße 40",
  zip: "10243",
  city: "Berlin",
  email: "info@averio-property.de",
  phone: "",
  website: "",
};

type TabKey = "dashboard" | "customers" | "properties" | "offers" | "operations" | "invoices" | "finance" | "leads";

type Customer = {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  created_at: string;
  updated_at: string;
};

type OfferItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type Offer = {
  id: string;
  user_id: string;
  customer_id: string;
  title: string;
  items: OfferItem[];
  status?: "draft" | "final";
  created_at: string;
  updated_at: string;
};

type OfferDraftPayload = {
  draftOfferId: string | null;
  selectedCustomerId: string;
  offerTitle: string;
  offerItems: OfferItem[];
  templateForm: TemplateForm;
  lastSavedAt: string | null;
  syncPending: boolean;
};

type BackupSnapshot = {
  id: string;
  exportedAt: string;
  source: "auto" | "manual";
  appVersion: string;
  userId: string | null;
  company: typeof COMPANY_PROFILE;
  customers: Customer[];
  offers: Offer[];
  invoices: Invoice[];
  transactions: Transaction[];
  serviceTemplates: ServiceTemplate[];
  properties: PropertyRecord[];
  jobs: JobRecord[];
  jobUpdates: JobUpdateRecord[];
  leads: LeadRecord[];
};

type Invoice = {
  id: string;
  user_id: string;
  invoice_number: string;
  offer_id: string;
  customer_id: string;
  items: OfferItem[];
  total: number;
  issued_at: string;
  due_date: string;
  status: "open" | "paid";
  created_at: string;
  updated_at: string;
};

type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  booking_date: string;
  invoice_id?: string | null;
  source: "manual" | "invoice_auto";
  created_at: string;
  updated_at: string;
};

type ServiceTemplate = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
};


type PropertyRecord = {
  id: string;
  customer_id: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  units: number;
  access_notes: string;
  service_scope: string;
  status: "active" | "paused" | "archive";
  created_at: string;
  updated_at: string;
};

type JobRecord = {
  id: string;
  property_id: string;
  customer_id: string;
  source_offer_id?: string | null;
  title: string;
  description: string;
  category: "betreuung" | "turnover" | "reinigung" | "reparatur" | "koordination" | "sonstiges";
  priority: "low" | "medium" | "high";
  status: "open" | "planned" | "in_progress" | "done";
  scheduled_for: string;
  recurrence: "once" | "weekly" | "monthly" | "after_checkout";
  assignee: string;
  created_at: string;
  updated_at: string;
};

type JobUpdateRecord = {
  id: string;
  job_id: string;
  kind: "note" | "visit" | "issue" | "done";
  note: string;
  photo_urls: string[];
  created_at: string;
};

type LeadRecord = {
  id: string;
  source: "website" | "email" | "phone" | "manual";
  name: string;
  company: string;
  email: string;
  phone: string;
  property_type: string;
  location: string;
  status: "new" | "qualified" | "offered" | "won" | "lost";
  notes: string;
  created_at: string;
};

type PropertyForm = {
  customerId: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  units: string;
  accessNotes: string;
  serviceScope: string;
};

type JobForm = {
  propertyId: string;
  customerId: string;
  title: string;
  description: string;
  category: JobRecord["category"];
  priority: JobRecord["priority"];
  status: JobRecord["status"];
  scheduledFor: string;
  recurrence: JobRecord["recurrence"];
  assignee: string;
};

type JobUpdateForm = {
  jobId: string;
  kind: JobUpdateRecord["kind"];
  note: string;
  photoUrls: string;
  localPhotoUrls: string[];
};

type LeadForm = {
  source: LeadRecord["source"];
  name: string;
  company: string;
  email: string;
  phone: string;
  propertyType: string;
  location: string;
  status: LeadRecord["status"];
  notes: string;
};

type CustomerForm = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
};

type TransactionForm = {
  type: "income" | "expense";
  title: string;
  amount: string;
  date: string;
};

type TemplateForm = {
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

const EMPTY_CUSTOMER_FORM: CustomerForm = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  street: "",
  zip: "",
  city: "",
};

const EMPTY_TEMPLATE_FORM: TemplateForm = {
  name: "",
  description: "",
  quantity: "1",
  unitPrice: "",
};

const EMPTY_PROPERTY_FORM: PropertyForm = {
  customerId: "",
  name: "",
  street: "",
  zip: "",
  city: "",
  units: "1",
  accessNotes: "",
  serviceScope: "",
};

const EMPTY_JOB_FORM: JobForm = {
  propertyId: "",
  customerId: "",
  title: "",
  description: "",
  category: "betreuung",
  priority: "medium",
  status: "open",
  scheduledFor: getTodayDate(),
  recurrence: "once",
  assignee: "",
};

const EMPTY_JOB_UPDATE_FORM: JobUpdateForm = {
  jobId: "",
  kind: "note",
  note: "",
  photoUrls: "",
  localPhotoUrls: [],
};

const EMPTY_LEAD_FORM: LeadForm = {
  source: "website",
  name: "",
  company: "",
  email: "",
  phone: "",
  propertyType: "",
  location: "Berlin",
  status: "new",
  notes: "",
};

const LEAD_STATUS_OPTIONS: Array<{ value: LeadRecord["status"]; label: string }> = [
  { value: "new", label: "Neu" },
  { value: "qualified", label: "Qualifiziert" },
  { value: "offered", label: "Angebot gesendet" },
  { value: "won", label: "Gewonnen" },
  { value: "lost", label: "Verloren" },
];

const LEAD_STATUS_TRANSITIONS: Record<LeadRecord["status"], LeadRecord["status"][]> = {
  new: ["qualified", "lost"],
  qualified: ["offered", "lost"],
  offered: ["won", "lost"],
  won: [],
  lost: [],
};

const makeId = () => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Fallback fuer Safari/iPhone oder unsichere lokale Netzwerk-URLs
  }

  return "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
};

const FINANCE_DOCUMENT_BUCKET = "finance-documents";

type FinanceDocument = {
  transactionId: string;
  name: string;
  path: string;
  createdAt?: string;
};

const sanitizeFinanceFileName = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "") || "beleg.pdf";

const createEmptyOfferItems = (): OfferItem[] => [
  {
    id: makeId(),
    description: "",
    quantity: 1,
    unitPrice: 0,
  },
];

const OFFER_DRAFT_STORAGE_KEY = "offer_editor_draft_v2";
const OFFER_DRAFT_SELECTED_CUSTOMER_KEY = "draft_offer_customer_id";
const OFFER_DRAFT_TEMPLATE_FORM_KEY = "draft_template_form";
const OFFER_DRAFT_SERVER_ID_KEY = "draft_offer_server_id";
const OFFER_DRAFT_LAST_SAVED_KEY = "draft_offer_last_saved_at";
const DRAFT_AUTOSAVE_DELAY_MS = 1200;
const CURRENT_BACKUP_STORAGE_KEY = "averio_backup_current_v1";
const BACKUP_HISTORY_STORAGE_KEY = "averio_backup_history_v1";

function formatDateForInput(date: Date) {
  return date.toISOString().split("T")[0];
}

const EMPTY_TRANSACTION_FORM: TransactionForm = {
  type: "income",
  title: "",
  amount: "",
  date: formatDateForInput(new Date()),
};

function formatCurrency(value: number) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function formatDateGerman(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("de-DE");
}

function addDays(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
}

function startOfWeek(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return formatDateForInput(date);
}

function getWeekDates(dateString: string) {
  const monday = startOfWeek(dateString);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

function getWeekdayLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", { weekday: "short" });
}

function getTodayDate() {
  return formatDateForInput(new Date());
}


function normalizePropertyRecord(input: Partial<PropertyRecord>): PropertyRecord {
  const now = new Date().toISOString();
  return {
    id: input.id ?? makeId(),
    customer_id: input.customer_id ?? "",
    name: input.name ?? "",
    street: input.street ?? "",
    zip: input.zip ?? "",
    city: input.city ?? "",
    units: typeof input.units === "number" ? input.units : Math.max(1, Number(input.units ?? 1) || 1),
    access_notes: input.access_notes ?? "",
    service_scope: input.service_scope ?? "",
    status: (input.status as PropertyRecord["status"]) ?? "active",
    created_at: input.created_at ?? now,
    updated_at: input.updated_at ?? input.created_at ?? now,
  };
}

function normalizeJobRecord(input: Partial<JobRecord>): JobRecord {
  const now = new Date().toISOString();
  return {
    id: input.id ?? makeId(),
    property_id: input.property_id ?? "",
    customer_id: input.customer_id ?? "",
    source_offer_id: input.source_offer_id ?? null,
    title: input.title ?? "",
    description: input.description ?? "",
    category: (input.category as JobRecord["category"]) ?? "betreuung",
    priority: (input.priority as JobRecord["priority"]) ?? "medium",
    status: (input.status as JobRecord["status"]) ?? "open",
    scheduled_for: input.scheduled_for ?? getTodayDate(),
    recurrence: (input.recurrence as JobRecord["recurrence"]) ?? "once",
    assignee: input.assignee ?? "",
    created_at: input.created_at ?? now,
    updated_at: input.updated_at ?? input.created_at ?? now,
  };
}

function normalizeJobUpdateRecord(input: Partial<JobUpdateRecord>): JobUpdateRecord {
  const now = new Date().toISOString();
  return {
    id: input.id ?? makeId(),
    job_id: input.job_id ?? "",
    kind: (input.kind as JobUpdateRecord["kind"]) ?? "note",
    note: input.note ?? "",
    photo_urls: Array.isArray(input.photo_urls) ? input.photo_urls.filter(Boolean) : [],
    created_at: input.created_at ?? now,
  };
}

function normalizeLeadRecord(input: Partial<LeadRecord>): LeadRecord {
  const now = new Date().toISOString();
  return {
    id: input.id ?? makeId(),
    source: (input.source as LeadRecord["source"]) ?? "manual",
    name: input.name ?? "",
    company: input.company ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
    property_type: input.property_type ?? "",
    location: input.location ?? "",
    status: (input.status as LeadRecord["status"]) ?? "new",
    notes: input.notes ?? "",
    created_at: input.created_at ?? now,
  };
}

function parseNumberInput(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function saveDraft<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadDraft<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function downloadJsonFile(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function clearDraft(key: string) {
  localStorage.removeItem(key);
}

function hasMeaningfulOfferDraft(payload: {
  selectedCustomerId: string;
  offerTitle: string;
  offerItems: OfferItem[];
  templateForm?: TemplateForm;
}) {
  const hasCustomer = payload.selectedCustomerId.trim().length > 0;
  const hasTitle = payload.offerTitle.trim().length > 0;
  const hasItems = payload.offerItems.some(
    (item) => item.description.trim() || Number(item.quantity) > 0 || Number(item.unitPrice) > 0
  );
  const hasTemplateDraft = payload.templateForm
    ? Boolean(
        payload.templateForm.name.trim() ||
          payload.templateForm.description.trim() ||
          payload.templateForm.quantity.trim() !== "1" ||
          payload.templateForm.unitPrice.trim()
      )
    : false;

  return hasCustomer || hasTitle || hasItems || hasTemplateDraft;
}

function isOfferStatusColumnError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const message = "message" in error ? String((error as { message?: string }).message ?? "") : "";
  const details = "details" in error ? String((error as { details?: string }).details ?? "") : "";
  const combined = `${message} ${details}`.toLowerCase();
  return combined.includes("status") && (combined.includes("column") || combined.includes("schema cache"));
}

function normalizeOffer(offer: Offer): Offer {
  return {
    ...offer,
    items: Array.isArray(offer.items) ? offer.items : [],
  };
}

function normalizeInvoice(invoice: Invoice): Invoice {
  return {
    ...invoice,
    items: Array.isArray(invoice.items) ? invoice.items : [],
    total: Number(invoice.total),
  };
}

function normalizeTransaction(transaction: Transaction): Transaction {
  return {
    ...transaction,
    amount: Number(transaction.amount),
  };
}

function normalizeTemplate(template: ServiceTemplate): ServiceTemplate {
  return {
    ...template,
    quantity: Number(template.quantity),
    unit_price: Number(template.unit_price),
  };
}

function ActionButton({
  children,
  onClick,
  style,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style: React.CSSProperties;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>([]);
  const [properties, setProperties] = useState<PropertyRecord[]>(() =>
    loadDraft<Partial<PropertyRecord>[]>("averio_properties_v1", []).map(normalizePropertyRecord)
  );
  const [jobs, setJobs] = useState<JobRecord[]>(() =>
    loadDraft<Partial<JobRecord>[]>("averio_jobs_v1", []).map(normalizeJobRecord)
  );
  const [jobUpdates, setJobUpdates] = useState<JobUpdateRecord[]>(() =>
    loadDraft<Partial<JobUpdateRecord>[]>("averio_job_updates_v1", []).map(normalizeJobUpdateRecord)
  );
  const [leads, setLeads] = useState<LeadRecord[]>(() =>
    loadDraft<Partial<LeadRecord>[]>("averio_leads_v1", []).map(normalizeLeadRecord)
  );

  const [loadingData, setLoadingData] = useState(true);
  const [appError, setAppError] = useState("");

  const [customerForm, setCustomerForm] = useState<CustomerForm>(() =>
    loadDraft<CustomerForm>("draft_customer_form", EMPTY_CUSTOMER_FORM)
  );
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(() =>
    loadDraft<string>(OFFER_DRAFT_SELECTED_CUSTOMER_KEY, "")
  );

  const [offerTitle, setOfferTitle] = useState(() =>
    loadDraft<string>("draft_offer_title", "")
  );
  const [offerItems, setOfferItems] = useState<OfferItem[]>(() =>
    loadDraft<OfferItem[]>("draft_offer_items", createEmptyOfferItems())
  );

  const [transactionForm, setTransactionForm] = useState<TransactionForm>(() =>
    loadDraft<TransactionForm>("draft_transaction_form", EMPTY_TRANSACTION_FORM)
  );
  const [transactionReceiptFile, setTransactionReceiptFile] = useState<File | null>(null);
  const [financeDocuments, setFinanceDocuments] = useState<Record<string, FinanceDocument[]>>({});
  const [financeStorageMessage, setFinanceStorageMessage] = useState("");

  const [templateForm, setTemplateForm] = useState<TemplateForm>(() =>
    loadDraft<TemplateForm>(OFFER_DRAFT_TEMPLATE_FORM_KEY, EMPTY_TEMPLATE_FORM)
  );
  const [currentDraftOfferId, setCurrentDraftOfferId] = useState<string | null>(() =>
    loadDraft<string | null>(OFFER_DRAFT_SERVER_ID_KEY, null)
  );
  const [draftLastSavedAt, setDraftLastSavedAt] = useState<string | null>(() =>
    loadDraft<string | null>(OFFER_DRAFT_LAST_SAVED_KEY, null)
  );
  const [draftSyncStatus, setDraftSyncStatus] = useState<
    "idle" | "saving" | "saved" | "local-only" | "error"
  >("idle");
  const [draftSyncMessage, setDraftSyncMessage] = useState("");
  const [draftSchemaAvailable, setDraftSchemaAvailable] = useState(true);
  const [draftRecoveryChecked, setDraftRecoveryChecked] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useState<string | null>(() => {
    const snapshot = loadDraft<BackupSnapshot | null>(CURRENT_BACKUP_STORAGE_KEY, null);
    return snapshot?.exportedAt ?? null;
  });
  const [backupHistoryCount, setBackupHistoryCount] = useState<number>(() =>
    loadDraft<BackupSnapshot[]>(BACKUP_HISTORY_STORAGE_KEY, []).length
  );
  const [propertyForm, setPropertyForm] = useState<PropertyForm>(() =>
    loadDraft<PropertyForm>("draft_property_form", EMPTY_PROPERTY_FORM)
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() =>
    loadDraft<string>("averio_selected_property_id", "")
  );
  const [jobForm, setJobForm] = useState<JobForm>(() =>
    loadDraft<JobForm>("draft_job_form", EMPTY_JOB_FORM)
  );
  const [jobUpdateForm, setJobUpdateForm] = useState<JobUpdateForm>(() => {
    const draft = loadDraft<Partial<JobUpdateForm>>("draft_job_update_form", EMPTY_JOB_UPDATE_FORM);
    return {
      ...EMPTY_JOB_UPDATE_FORM,
      ...draft,
      localPhotoUrls: Array.isArray(draft?.localPhotoUrls) ? draft.localPhotoUrls.filter(Boolean) : [],
    };
  });
  const [calendarFocusDate, setCalendarFocusDate] = useState<string>(() =>
    loadDraft<string>("averio_calendar_focus_date", getTodayDate())
  );
  const [leadForm, setLeadForm] = useState<LeadForm>(() =>
    loadDraft<LeadForm>("draft_lead_form", EMPTY_LEAD_FORM)
  );
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadRecord["status"] | "all">("all");
  const [leadStatusBusyId, setLeadStatusBusyId] = useState<string | null>(null);
  const [leadDeleteTarget, setLeadDeleteTarget] = useState<LeadRecord | null>(null);
  const [leadDeleteBusy, setLeadDeleteBusy] = useState(false);

  const buildBackupSnapshot = useCallback(
    (source: "auto" | "manual" = "auto"): BackupSnapshot => ({
      id: makeId(),
      exportedAt: new Date().toISOString(),
      source,
      appVersion: "averio-app-backup-v2",
      userId: session?.user?.id ?? null,
      company: COMPANY_PROFILE,
      customers,
      offers,
      invoices,
      transactions,
      serviceTemplates,
      properties,
      jobs,
      jobUpdates,
      leads,
    }),
    [customers, invoices, offers, serviceTemplates, properties, jobs, jobUpdates, leads, session?.user?.id, transactions]
  );

  const persistBackupSnapshot = useCallback((snapshot: BackupSnapshot) => {
    saveDraft(CURRENT_BACKUP_STORAGE_KEY, snapshot);
    const history = loadDraft<BackupSnapshot[]>(BACKUP_HISTORY_STORAGE_KEY, []);
    const snapshotDay = snapshot.exportedAt.slice(0, 10);
    const nextHistory = [
      snapshot,
      ...history.filter((entry) => entry.exportedAt.slice(0, 10) !== snapshotDay),
    ].slice(0, 7);

    saveDraft(BACKUP_HISTORY_STORAGE_KEY, nextHistory);
    setLastBackupAt(snapshot.exportedAt);
    setBackupHistoryCount(nextHistory.length);
  }, []);

  const exportFullBackup = useCallback(() => {
    const snapshot = buildBackupSnapshot("manual");
    persistBackupSnapshot(snapshot);
    const fileDate = snapshot.exportedAt.replace(/[:.]/g, "-");
    downloadJsonFile(`averio-backup-${fileDate}.json`, snapshot);
  }, [buildBackupSnapshot, persistBackupSnapshot]);

  const downloadLatestLocalBackup = useCallback(() => {
    const snapshot = loadDraft<BackupSnapshot | null>(CURRENT_BACKUP_STORAGE_KEY, null);
    if (!snapshot) {
      window.alert("Es ist noch kein lokales Voll-Backup vorhanden.");
      return;
    }

    const fileDate = snapshot.exportedAt.replace(/[:.]/g, "-");
    downloadJsonFile(`averio-backup-lokal-${fileDate}.json`, snapshot);
  }, []);

  useEffect(() => {
    saveDraft("draft_customer_form", customerForm);
  }, [customerForm]);

  useEffect(() => {
    saveDraft("draft_offer_title", offerTitle);
  }, [offerTitle]);

  useEffect(() => {
    saveDraft("draft_offer_items", offerItems);
  }, [offerItems]);

  useEffect(() => {
    saveDraft(OFFER_DRAFT_SELECTED_CUSTOMER_KEY, selectedCustomerId);
  }, [selectedCustomerId]);

  useEffect(() => {
    saveDraft(OFFER_DRAFT_TEMPLATE_FORM_KEY, templateForm);
  }, [templateForm]);

  useEffect(() => {
    saveDraft(OFFER_DRAFT_SERVER_ID_KEY, currentDraftOfferId);
  }, [currentDraftOfferId]);

  useEffect(() => {
    saveDraft(OFFER_DRAFT_LAST_SAVED_KEY, draftLastSavedAt);
  }, [draftLastSavedAt]);

  useEffect(() => {
    saveDraft<OfferDraftPayload>(OFFER_DRAFT_STORAGE_KEY, {
      draftOfferId: currentDraftOfferId,
      selectedCustomerId,
      offerTitle,
      offerItems,
      templateForm,
      lastSavedAt: draftLastSavedAt,
      syncPending: draftSyncStatus === "local-only" || draftSyncStatus === "saving",
    });
  }, [
    currentDraftOfferId,
    selectedCustomerId,
    offerTitle,
    offerItems,
    templateForm,
    draftLastSavedAt,
    draftSyncStatus,
  ]);

  useEffect(() => {
    saveDraft("draft_transaction_form", transactionForm);
  }, [transactionForm]);

  useEffect(() => {
    saveDraft("draft_property_form", propertyForm);
  }, [propertyForm]);

  useEffect(() => {
    saveDraft("draft_job_form", jobForm);
  }, [jobForm]);

  useEffect(() => {
    saveDraft("averio_selected_property_id", selectedPropertyId);
  }, [selectedPropertyId]);

  useEffect(() => {
    saveDraft("draft_job_update_form", jobUpdateForm);
  }, [jobUpdateForm]);

  useEffect(() => {
    saveDraft("averio_calendar_focus_date", calendarFocusDate);
  }, [calendarFocusDate]);

  useEffect(() => {
    saveDraft("draft_lead_form", leadForm);
  }, [leadForm]);

  useEffect(() => {
    saveDraft("averio_properties_v1", properties);
  }, [properties]);

  useEffect(() => {
    saveDraft("averio_jobs_v1", jobs);
  }, [jobs]);

  useEffect(() => {
    saveDraft("averio_job_updates_v1", jobUpdates);
  }, [jobUpdates]);

  useEffect(() => {
    saveDraft("averio_leads_v1", leads);
  }, [leads]);

  useEffect(() => {
    if (!authReady || !session?.user?.id || loadingData) return;
    const snapshot = buildBackupSnapshot("auto");
    persistBackupSnapshot(snapshot);
  }, [
    authReady,
    buildBackupSnapshot,
    loadingData,
    persistBackupSnapshot,
    session?.user?.id,
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadFinanceDocuments = useCallback(async (userId: string) => {
    setFinanceStorageMessage("");

    try {
      const { data, error } = await supabase.storage
        .from(FINANCE_DOCUMENT_BUCKET)
        .list(userId, {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        setFinanceDocuments({});
        setFinanceStorageMessage(
          "PDF-Belege sind vorbereitet. Bitte in Supabase Storage einen Bucket finance-documents anlegen und Policies fuer Upload/Lesen aktivieren."
        );
        return;
      }

      const grouped: Record<string, FinanceDocument[]> = {};
      (data ?? []).forEach((file) => {
        if (!file.name.toLowerCase().endsWith(".pdf")) return;
        const parts = file.name.split("__");
        const transactionId = parts.shift() || "";
        if (!transactionId) return;
        const displayName = parts.length > 1 ? parts.slice(1).join("__") : file.name;
        grouped[transactionId] = [
          ...(grouped[transactionId] ?? []),
          {
            transactionId,
            name: displayName,
            path: `${userId}/${file.name}`,
            createdAt: file.created_at,
          },
        ];
      });

      setFinanceDocuments(grouped);
    } catch (error) {
      setFinanceDocuments({});
      setFinanceStorageMessage(
        error instanceof Error ? error.message : "PDF-Belege konnten nicht geladen werden."
      );
    }
  }, []);

  const uploadFinanceDocument = useCallback(
    async (transactionId: string, file: File) => {
      if (!session?.user?.id) return;

      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        alert("Bitte nur PDF-Dateien hochladen.");
        return;
      }

      if (file.size > 12 * 1024 * 1024) {
        alert("Die PDF ist zu gross. Bitte maximal 12 MB hochladen.");
        return;
      }

      const safeName = sanitizeFinanceFileName(file.name);
      const path = `${session.user.id}/${transactionId}__${Date.now()}__${safeName}`;

      const { error } = await supabase.storage
        .from(FINANCE_DOCUMENT_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        setFinanceStorageMessage(
          "PDF konnte nicht hochgeladen werden. Bitte pruefe den Supabase Storage Bucket finance-documents und die Policies."
        );
        throw error;
      }

      await loadFinanceDocuments(session.user.id);
    },
    [loadFinanceDocuments, session]
  );

  const openFinanceDocument = async (document: FinanceDocument) => {
    const { data, error } = await supabase.storage
      .from(FINANCE_DOCUMENT_BUCKET)
      .createSignedUrl(document.path, 60 * 10);

    if (error || !data?.signedUrl) {
      alert(error?.message ?? "PDF konnte nicht geoeffnet werden.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleExistingTransactionPdfUpload = async (transactionId: string, file?: File | null) => {
    if (!file) return;

    try {
      await uploadFinanceDocument(transactionId, file);
      alert("PDF-Beleg wurde hochgeladen.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "PDF konnte nicht hochgeladen werden.");
    }
  };

  const reloadAll = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoadingData(true);
    setAppError("");

    try {
      const userId = session.user.id;

      const [customersRes, offersRes, invoicesRes, transactionsRes, templatesRes, leadsRes] =
        await Promise.all([
          supabase
            .from("customers")
            .select("*")
            .eq("user_id", userId)
            .order("company_name", { ascending: true }),

          supabase
            .from("offers")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),

          supabase
            .from("invoices")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),

          supabase
            .from("transactions")
            .select("*")
            .eq("user_id", userId)
            .order("booking_date", { ascending: false })
            .order("created_at", { ascending: false }),

          supabase
            .from("service_templates")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),

          supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (customersRes.error) throw customersRes.error;
      if (offersRes.error) throw offersRes.error;
      if (invoicesRes.error) throw invoicesRes.error;
      if (transactionsRes.error) throw transactionsRes.error;
      if (templatesRes.error) throw templatesRes.error;
      if (leadsRes.error) throw leadsRes.error;

      setCustomers(customersRes.data ?? []);
      setOffers((offersRes.data ?? []).map((item) => normalizeOffer(item as Offer)));
      setInvoices((invoicesRes.data ?? []).map((item) => normalizeInvoice(item as Invoice)));
      setTransactions(
        (transactionsRes.data ?? []).map((item) =>
          normalizeTransaction(item as Transaction)
        )
      );
      await loadFinanceDocuments(userId);
      setServiceTemplates(
        (templatesRes.data ?? []).map((item) =>
          normalizeTemplate(item as ServiceTemplate)
        )
      );
      setLeads((leadsRes.data ?? []).map((item) => normalizeLeadRecord(item as Partial<LeadRecord>)));
    } catch (error) {
      setAppError(error instanceof Error ? error.message : "Daten konnten nicht geladen werden.");
    } finally {
      setLoadingData(false);
    }
  }, [loadFinanceDocuments, session]);

  const applyOfferDraftPayload = useCallback((payload: OfferDraftPayload) => {
    setCurrentDraftOfferId(payload.draftOfferId ?? null);
    setSelectedCustomerId(payload.selectedCustomerId ?? "");
    setOfferTitle(payload.offerTitle ?? "");
    setOfferItems(payload.offerItems?.length ? payload.offerItems : createEmptyOfferItems());
    setTemplateForm(payload.templateForm ?? EMPTY_TEMPLATE_FORM);
    setDraftLastSavedAt(payload.lastSavedAt ?? null);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      void reloadAll();
    } else {
      setCustomers([]);
      setOffers([]);
      setInvoices([]);
      setTransactions([]);
      setServiceTemplates([]);
      setLoadingData(false);
    }
  }, [session, reloadAll]);

  useEffect(() => {
    if (!session?.user?.id || draftRecoveryChecked) return;

    const restoreServerDraft = async () => {
      try {
        const { data, error } = await supabase
          .from("offers")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("status", "draft")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          if (isOfferStatusColumnError(error)) {
            setDraftSchemaAvailable(false);
            setDraftSyncStatus("local-only");
            setDraftSyncMessage(
              "Server-Drafts sind noch nicht aktiv. Bitte zuerst die SQL-Migration für offers.status ausführen."
            );
            setDraftRecoveryChecked(true);
            return;
          }

          throw error;
        }

        setDraftSchemaAvailable(true);

        if (!data) {
          setDraftRecoveryChecked(true);
          return;
        }

        const serverDraft = normalizeOffer(data as Offer);
        const localDraft = loadDraft<OfferDraftPayload | null>(OFFER_DRAFT_STORAGE_KEY, null);
        const localHasDraft =
          !!localDraft &&
          hasMeaningfulOfferDraft({
            selectedCustomerId: localDraft.selectedCustomerId,
            offerTitle: localDraft.offerTitle,
            offerItems: localDraft.offerItems,
            templateForm: localDraft.templateForm,
          });

        const shouldUseServer = !localHasDraft
          ? true
          : window.confirm(
              "Es wurde ein serverseitiger Angebotsentwurf gefunden. Möchtest du ihn statt des lokalen Entwurfs wiederherstellen?"
            );

        if (shouldUseServer) {
          applyOfferDraftPayload({
            draftOfferId: serverDraft.id,
            selectedCustomerId: serverDraft.customer_id,
            offerTitle: serverDraft.title,
            offerItems: serverDraft.items?.length ? serverDraft.items : createEmptyOfferItems(),
            templateForm: localDraft?.templateForm ?? EMPTY_TEMPLATE_FORM,
            lastSavedAt: serverDraft.updated_at,
            syncPending: false,
          });
          setDraftSyncStatus("saved");
          setDraftSyncMessage("Server-Entwurf wiederhergestellt.");
        }
      } catch (error) {
        setDraftSyncStatus("error");
        setDraftSyncMessage(
          error instanceof Error
            ? error.message
            : "Server-Entwurf konnte nicht geprüft werden."
        );
      } finally {
        setDraftRecoveryChecked(true);
      }
    };

    void restoreServerDraft();
  }, [applyOfferDraftPayload, draftRecoveryChecked, session]);

  const persistOfferDraftToServer = useCallback(async () => {
    if (!session?.user?.id || !draftSchemaAvailable) return;

    const payload: OfferDraftPayload = {
      draftOfferId: currentDraftOfferId,
      selectedCustomerId,
      offerTitle,
      offerItems,
      templateForm,
      lastSavedAt: draftLastSavedAt,
      syncPending: false,
    };

    if (
      !hasMeaningfulOfferDraft({
        selectedCustomerId: payload.selectedCustomerId,
        offerTitle: payload.offerTitle,
        offerItems: payload.offerItems,
        templateForm: payload.templateForm,
      })
    ) {
      return;
    }

    const cleanedItems = payload.offerItems
      .map((item) => ({
        ...item,
        description: item.description.trim(),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
      }))
      .filter((item) => item.description || item.quantity > 0 || item.unitPrice > 0);

    const isServerDraftReady =
      Boolean(payload.selectedCustomerId) &&
      payload.offerTitle.trim().length > 0 &&
      cleanedItems.length > 0;

    if (!isServerDraftReady) {
      setDraftSyncStatus("local-only");
      setDraftSyncMessage(
        "Entwurf lokal gesichert. Server-Speicherung startet automatisch, sobald Kunde, Titel und mindestens eine Position vorhanden sind."
      );
      return;
    }

    setDraftSyncStatus("saving");
    setDraftSyncMessage("Entwurf wird gesichert …");

    try {
      if (payload.draftOfferId) {
        const { error } = await supabase
          .from("offers")
          .update({
            customer_id: payload.selectedCustomerId,
            title: payload.offerTitle.trim(),
            items: cleanedItems,
            status: "draft",
          })
          .eq("id", payload.draftOfferId)
          .eq("user_id", session.user.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("offers")
          .insert({
            user_id: session.user.id,
            customer_id: payload.selectedCustomerId,
            title: payload.offerTitle.trim(),
            items: cleanedItems,
            status: "draft",
          })
          .select("id, updated_at")
          .single();

        if (error) throw error;
        setCurrentDraftOfferId(data.id);
        setDraftLastSavedAt(data.updated_at ?? new Date().toISOString());
      }

      setDraftLastSavedAt(new Date().toISOString());
      setDraftSyncStatus("saved");
      setDraftSyncMessage("Entwurf in Supabase gesichert.");
    } catch (error) {
      if (isOfferStatusColumnError(error)) {
        setDraftSchemaAvailable(false);
        setDraftSyncStatus("local-only");
        setDraftSyncMessage(
          "Lokaler Entwurf gesichert. Für Server-Drafts fehlt noch die Spalte offers.status."
        );
        return;
      }

      const message = error instanceof Error ? error.message : String(error ?? "");
      const isBadRequest = /400|bad request|null value|violates|invalid input|row-level security|permission/i.test(message);

      setDraftSyncStatus("local-only");
      setDraftSyncMessage(
        isBadRequest
          ? "Entwurf lokal gesichert. Die Server-Speicherung wird erst genutzt, wenn das Supabase-Schema vollständig passt."
          : "Supabase aktuell nicht erreichbar – Entwurf bleibt lokal auf diesem Gerät gespeichert."
      );
    }
  }, [
    currentDraftOfferId,
    selectedCustomerId,
    offerTitle,
    offerItems,
    templateForm,
    draftLastSavedAt,
    session,
    draftSchemaAvailable,
  ]);

  useEffect(() => {
    if (!session?.user?.id || !draftRecoveryChecked) return;

    if (
      !hasMeaningfulOfferDraft({
        selectedCustomerId,
        offerTitle,
        offerItems,
        templateForm,
      })
    ) {
      return;
    }

    if (!draftSchemaAvailable) {
      return;
    }

    const timer = window.setTimeout(() => {
      void persistOfferDraftToServer();
    }, DRAFT_AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [
    selectedCustomerId,
    offerTitle,
    offerItems,
    templateForm,
    session,
    draftRecoveryChecked,
    persistOfferDraftToServer,
    draftSchemaAvailable,
  ]);

  const filteredCustomers = useMemo(() => {
    const term = customerSearch.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((customer) => {
      const haystack = [
        customer.company_name,
        customer.contact_person,
        customer.email,
        customer.phone,
        customer.city,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [customers, customerSearch]);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

  const offerPreviewTotal = useMemo(() => {
    return offerItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [offerItems]);

  const finalizedOffers = useMemo(
    () => offers.filter((offer) => (offer.status ?? "final") !== "draft"),
    [offers]
  );

  const draftOffers = useMemo(
    () => offers.filter((offer) => offer.status === "draft"),
    [offers]
  );

  const openInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "open"),
    [invoices]
  );

  const openInvoiceTotal = useMemo(() => {
    return openInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  }, [openInvoices]);

  const overdueInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "open" && !!invoice.due_date && invoice.due_date < getTodayDate()),
    [invoices]
  );

  const overdueInvoiceTotal = useMemo(() => {
    return overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  }, [overdueInvoices]);

  const incomeTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.type === "income"),
    [transactions]
  );

  const expenseTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.type === "expense"),
    [transactions]
  );

  const totalIncome = useMemo(() => {
    return incomeTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [incomeTransactions]);

  const totalExpense = useMemo(() => {
    return expenseTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [expenseTransactions]);

  const profit = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const paidThisMonth = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return incomeTransactions
      .filter((transaction) => transaction.booking_date?.slice(0, 7) === currentMonth)
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  }, [incomeTransactions]);

  const sortedIncomeTransactions = useMemo(() => {
    return [...incomeTransactions].sort((a, b) => b.booking_date.localeCompare(a.booking_date));
  }, [incomeTransactions]);

  const sortedExpenseTransactions = useMemo(() => {
    return [...expenseTransactions].sort((a, b) => b.booking_date.localeCompare(a.booking_date));
  }, [expenseTransactions]);

  const activeProperties = useMemo(
    () => properties.filter((property) => property.status === "active"),
    [properties]
  );

  const openJobs = useMemo(
    () => jobs.filter((job) => job.status !== "done"),
    [jobs]
  );

  const plannedJobsThisWeek = useMemo(() => {
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 7);
    return jobs.filter((job) => {
      if (!job.scheduled_for) return false;
      const scheduled = new Date(job.scheduled_for);
      return scheduled >= now && scheduled <= end && job.status !== "done";
    });
  }, [jobs]);

  const upcomingJobs = useMemo(
    () => plannedJobsThisWeek
      .slice()
      .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for)),
    [plannedJobsThisWeek]
  );

  const openLeads = useMemo(
    () => leads.filter((lead) => !["won", "lost"].includes(lead.status)),
    [leads]
  );

  const selectedPropertyRecord = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? properties[0] ?? null,
    [properties, selectedPropertyId]
  );

  const selectedPropertyJobs = useMemo(
    () => selectedPropertyRecord ? jobs.filter((job) => job.property_id === selectedPropertyRecord.id) : [],
    [jobs, selectedPropertyRecord]
  );

  const selectedPropertyUpdates = useMemo(
    () => selectedPropertyRecord
      ? jobUpdates.filter((update) => selectedPropertyJobs.some((job) => job.id === update.job_id))
      : [],
    [jobUpdates, selectedPropertyJobs, selectedPropertyRecord]
  );

  const selectedPropertyInvoices = useMemo(
    () => selectedPropertyRecord
      ? invoices.filter((invoice) => invoice.customer_id === selectedPropertyRecord.customer_id)
      : [],
    [invoices, selectedPropertyRecord]
  );

  const selectedPropertyOpenJobs = useMemo(
    () => selectedPropertyJobs.filter((job) => job.status !== "done"),
    [selectedPropertyJobs]
  );

  const selectedPropertyNextJobs = useMemo(
    () => [...selectedPropertyJobs]
      .filter((job) => job.scheduled_for)
      .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for))
      .slice(0, 4),
    [selectedPropertyJobs]
  );

  const jobsByDate = useMemo(() => {
    const weekStart = startOfWeek(calendarFocusDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const dayJobs = jobs
        .filter((job) => job.scheduled_for === date)
        .sort((a, b) => {
          const statusOrder = { in_progress: 0, planned: 1, open: 2, done: 3 } as const;
          const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
          return statusOrder[a.status] - statusOrder[b.status] || priorityOrder[a.priority] - priorityOrder[b.priority] || a.title.localeCompare(b.title);
        });
      return { date, jobs: dayJobs };
    });
  }, [calendarFocusDate, jobs]);

  const recentPhotoUpdates = useMemo(
    () => jobUpdates.filter((update) => Array.isArray(update.photo_urls) && update.photo_urls.length > 0).slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 24),
    [jobUpdates]
  );

  const latestJobUpdatesByJobId = useMemo(() => {
    const map = new Map<string, JobUpdateRecord>();
    [...jobUpdates]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .forEach((entry) => {
        if (!map.has(entry.job_id)) map.set(entry.job_id, entry);
      });
    return map;
  }, [jobUpdates]);

  const nextInvoiceNumber = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearInvoices = invoices.filter((invoice) =>
      invoice.invoice_number.startsWith(`${currentYear}-`)
    );
    const nextNumber = yearInvoices.length + 1;
    return `${currentYear}-${String(nextNumber).padStart(4, "0")}`;
  }, [invoices]);

  const getCustomerDisplayName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.company_name : "Unbekannter Kunde";
  };

  const getPropertyDisplayName = (propertyId: string) => {
    const property = properties.find((item) => item.id === propertyId);
    return property ? property.name : "Objekt nicht gewählt";
  };

  const getJobStatusLabel = (status: JobRecord["status"]) => ({
    open: "Offen",
    planned: "Geplant",
    in_progress: "In Arbeit",
    done: "Erledigt",
  }[status]);

  const getPriorityLabel = (priority: JobRecord["priority"]) => ({
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch",
  }[priority]);

  const getLeadStatusLabel = (status: LeadRecord["status"]) => ({
    new: "Neu",
    qualified: "Qualifiziert",
    offered: "Angebot gesendet",
    won: "Gewonnen",
    lost: "Verloren",
  }[status]);

  const getLeadStatusTone = (status: LeadRecord["status"]) => {
    if (status === "won") return styles.badgePaid;
    if (status === "lost") return styles.badgeOpen;
    if (status === "qualified") return { ...styles.badgeNeutral, background: "#eef6ff", color: "#175cd3" };
    if (status === "offered") return { ...styles.badgeNeutral, background: "#f5f3ff", color: "#6941c6" };
    return styles.badgeNeutral;
  };

  const getNextLeadStatuses = (status: LeadRecord["status"]) => LEAD_STATUS_TRANSITIONS[status] ?? [];

  const getOfferTotal = (offer: Offer) => {
    return offer.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handlePropertyFormChange = (field: keyof PropertyForm, value: string) => {
    setPropertyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobFormChange = (field: keyof JobForm, value: string) => {
    setJobForm((prev) => ({ ...prev, [field]: value } as JobForm));
  };

  const handleJobUpdateFormChange = (field: keyof JobUpdateForm, value: string) => {
    setJobUpdateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobUpdatePhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const nextUrls = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
            reader.onerror = () => reject(new Error("Foto konnte nicht gelesen werden."));
            reader.readAsDataURL(file);
          })
      )
    );

    setJobUpdateForm((prev) => ({
      ...prev,
      localPhotoUrls: [...(Array.isArray(prev.localPhotoUrls) ? prev.localPhotoUrls : []), ...nextUrls.filter(Boolean)],
    }));
  };

  const handleLeadFormChange = (field: keyof LeadForm, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value } as LeadForm));
  };

  const handleCustomerFormChange = (field: keyof CustomerForm, value: string) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransactionFormChange = (field: keyof TransactionForm, value: string) => {
    setTransactionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateFormChange = (field: keyof TemplateForm, value: string) => {
    setTemplateForm((prev) => ({ ...prev, [field]: value }));
  };

  const clearOfferDraftStorage = useCallback(() => {
    clearDraft(OFFER_DRAFT_STORAGE_KEY);
    clearDraft("draft_offer_title");
    clearDraft("draft_offer_items");
    clearDraft(OFFER_DRAFT_SELECTED_CUSTOMER_KEY);
    clearDraft(OFFER_DRAFT_TEMPLATE_FORM_KEY);
    clearDraft(OFFER_DRAFT_SERVER_ID_KEY);
    clearDraft(OFFER_DRAFT_LAST_SAVED_KEY);
  }, []);

  const resetCustomerForm = () => {
    setCustomerForm(EMPTY_CUSTOMER_FORM);
    setEditingCustomerId(null);
    clearDraft("draft_customer_form");
  };

  const resetTemplateForm = () => {
    setTemplateForm(EMPTY_TEMPLATE_FORM);
    clearDraft(OFFER_DRAFT_TEMPLATE_FORM_KEY);
  };

  const resetOfferDraft = useCallback(() => {
    setOfferTitle("");
    setOfferItems(createEmptyOfferItems());
    setSelectedCustomerId("");
    setTemplateForm(EMPTY_TEMPLATE_FORM);
    setCurrentDraftOfferId(null);
    setDraftLastSavedAt(null);
    setDraftSyncStatus("idle");
    setDraftSyncMessage("");
    clearOfferDraftStorage();
  }, [clearOfferDraftStorage]);

  const resetTransactionForm = () => {
    const resetValue = {
      type: "income" as const,
      title: "",
      amount: "",
      date: getTodayDate(),
    };
    setTransactionForm(resetValue);
    setTransactionReceiptFile(null);
    clearDraft("draft_transaction_form");
  };

  const resetPropertyForm = () => {
    setPropertyForm(EMPTY_PROPERTY_FORM);
    clearDraft("draft_property_form");
  };

  const resetJobForm = () => {
    setJobForm(EMPTY_JOB_FORM);
    clearDraft("draft_job_form");
  };

  const resetJobUpdateForm = () => {
    setJobUpdateForm(EMPTY_JOB_UPDATE_FORM);
    clearDraft("draft_job_update_form");
  };

  const resetLeadForm = () => {
    setLeadForm(EMPTY_LEAD_FORM);
    clearDraft("draft_lead_form");
  };

  const saveProperty = () => {
    if (!propertyForm.customerId) {
      window.alert("Bitte zuerst einen Kunden für das Objekt auswählen.");
      return;
    }

    const name = propertyForm.name.trim();
    if (!name) {
      window.alert("Bitte einen Objektnamen eingeben.");
      return;
    }

    const now = new Date().toISOString();
    const nextProperty: PropertyRecord = {
      id: makeId(),
      customer_id: propertyForm.customerId,
      name,
      street: propertyForm.street.trim(),
      zip: propertyForm.zip.trim(),
      city: propertyForm.city.trim(),
      units: Math.max(1, Number.parseInt(propertyForm.units || "1", 10) || 1),
      access_notes: propertyForm.accessNotes.trim(),
      service_scope: propertyForm.serviceScope.trim(),
      status: "active",
      created_at: now,
      updated_at: now,
    };

    setProperties((prev) => [nextProperty, ...prev]);
    setSelectedPropertyId(nextProperty.id);
    resetPropertyForm();
    setActiveTab("properties");
  };

  const deleteProperty = (propertyId: string) => {
    const linkedJobs = jobs.some((job) => job.property_id === propertyId);
    const confirmed = window.confirm(
      linkedJobs
        ? "Dieses Objekt hat verknüpfte Aufträge. Wirklich Objekt und zugehörige Aufträge löschen?"
        : "Dieses Objekt wirklich löschen?"
    );
    if (!confirmed) return;

    const jobIdsToRemove = jobs.filter((job) => job.property_id === propertyId).map((job) => job.id);
    setProperties((prev) => prev.filter((property) => property.id !== propertyId));
    if (jobIdsToRemove.length > 0) {
      setJobs((prev) => prev.filter((job) => job.property_id !== propertyId));
      setJobUpdates((prev) => prev.filter((update) => !jobIdsToRemove.includes(update.job_id)));
    }
  };

  const saveJob = () => {
    if (!jobForm.propertyId) {
      window.alert("Bitte zuerst ein Objekt auswählen.");
      return;
    }

    const title = jobForm.title.trim();
    if (!title) {
      window.alert("Bitte einen Auftragstitel eingeben.");
      return;
    }

    const now = new Date().toISOString();
    const nextJob: JobRecord = {
      id: makeId(),
      property_id: jobForm.propertyId,
      customer_id: jobForm.customerId,
      source_offer_id: null,
      title,
      description: jobForm.description.trim(),
      category: jobForm.category,
      priority: jobForm.priority,
      status: jobForm.status,
      scheduled_for: jobForm.scheduledFor || getTodayDate(),
      recurrence: jobForm.recurrence,
      assignee: jobForm.assignee.trim(),
      created_at: now,
      updated_at: now,
    };

    setJobs((prev) => [nextJob, ...prev]);
    resetJobForm();
  };

  const updateJobStatus = (jobId: string, status: JobRecord["status"]) => {
    const now = new Date().toISOString();
    setJobs((prev) => prev.map((job) => {
      if (job.id !== jobId) return job;
      if (status !== "done") return { ...job, status, updated_at: now };
      const nextScheduledFor = job.recurrence === "weekly"
        ? addDays(job.scheduled_for, 7)
        : job.recurrence === "monthly"
          ? addDays(job.scheduled_for, 30)
          : job.recurrence === "after_checkout"
            ? addDays(job.scheduled_for, 3)
            : job.scheduled_for;
      return {
        ...job,
        status,
        scheduled_for: job.recurrence === "once" ? job.scheduled_for : nextScheduledFor,
        updated_at: now,
      };
    }));
  };

  const deleteJob = (jobId: string) => {
    const confirmed = window.confirm("Diesen Auftrag wirklich löschen?");
    if (!confirmed) return;
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
    setJobUpdates((prev) => prev.filter((update) => update.job_id !== jobId));
  };

  const saveJobUpdate = () => {
    if (!jobUpdateForm.jobId) {
      window.alert("Bitte zuerst einen Auftrag auswählen.");
      return;
    }

    const note = jobUpdateForm.note.trim();
    if (!note) {
      window.alert("Bitte eine Notiz oder Dokumentation eingeben.");
      return;
    }

    const now = new Date().toISOString();
    const nextUpdate: JobUpdateRecord = {
      id: makeId(),
      job_id: jobUpdateForm.jobId,
      kind: jobUpdateForm.kind,
      note,
      photo_urls: [
        ...jobUpdateForm.photoUrls
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean),
        ...(Array.isArray(jobUpdateForm.localPhotoUrls) ? jobUpdateForm.localPhotoUrls : []),
      ],
      created_at: now,
    };

    setJobUpdates((prev) => [nextUpdate, ...prev]);
    if (jobUpdateForm.kind === "done") {
      updateJobStatus(jobUpdateForm.jobId, "done");
    }
    resetJobUpdateForm();
  };

  const saveLead = async () => {
    const company = leadForm.company.trim();
    const name = leadForm.name.trim();
    if (!company && !name) {
      window.alert("Bitte mindestens Firma oder Ansprechpartner eingeben.");
      return;
    }

    const nextLead: LeadRecord = {
      id: makeId(),
      source: leadForm.source,
      name,
      company,
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      property_type: leadForm.propertyType.trim(),
      location: leadForm.location.trim(),
      status: leadForm.status,
      notes: leadForm.notes.trim(),
      created_at: new Date().toISOString(),
    };

    if (session?.user?.id) {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          user_id: session.user.id,
          source: nextLead.source,
          name: nextLead.name,
          company: nextLead.company,
          email: nextLead.email,
          phone: nextLead.phone,
          property_type: nextLead.property_type,
          location: nextLead.location,
          status: nextLead.status,
          notes: nextLead.notes,
        })
        .select()
        .single();

      if (error) {
        console.error("Lead konnte nicht in Supabase gespeichert werden:", error);
        window.alert("Lead konnte nicht gespeichert werden.");
        return;
      }

      setLeads((prev) => [normalizeLeadRecord(data as Partial<LeadRecord>), ...prev]);
    } else {
      setLeads((prev) => [nextLead, ...prev]);
    }

    resetLeadForm();
  };

  const advanceLeadStatus = async (leadId: string, status: LeadRecord["status"]) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead || currentLead.status === status) return;

    const allowedStatuses = getNextLeadStatuses(currentLead.status);
    if (!allowedStatuses.includes(status)) {
      window.alert("Dieser Statuswechsel ist in der Pipeline nicht vorgesehen.");
      return;
    }

    const previous = leads;
    setLeadStatusBusyId(leadId);
    setLeads((prev) => prev.map((lead) => lead.id === leadId ? { ...lead, status } : lead));

    try {
      if (session?.user?.id) {
        const { error } = await supabase
          .from("leads")
          .update({ status })
          .eq("id", leadId);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Lead-Status konnte nicht aktualisiert werden:", error);
      setLeads(previous);
      window.alert(error instanceof Error ? error.message : "Lead-Status konnte nicht aktualisiert werden.");
    } finally {
      setLeadStatusBusyId((current) => current === leadId ? null : current);
    }
  };

  const requestLeadDelete = (lead: LeadRecord) => {
    setLeadDeleteTarget(lead);
  };

  const closeLeadDeleteModal = () => {
    if (leadDeleteBusy) return;
    setLeadDeleteTarget(null);
  };

  const confirmLeadDelete = async () => {
    if (!leadDeleteTarget) return;

    const leadId = leadDeleteTarget.id;
    const previous = leads;
    setLeadDeleteBusy(true);
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));

    try {
      if (session?.user?.id) {
        const { error } = await supabase
          .from("leads")
          .delete()
          .eq("id", leadId);

        if (error) throw error;
      }

      setLeadDeleteTarget(null);
    } catch (error) {
      console.error("Lead konnte nicht gelöscht werden:", error);
      setLeads(previous);
      window.alert(error instanceof Error ? error.message : "Lead konnte nicht gelöscht werden.");
    } finally {
      setLeadDeleteBusy(false);
    }
  };

  const convertLeadToCustomerAndProperty = async (lead: LeadRecord) => {
    const targetCustomerName = (lead.company || lead.name).trim();
    if (!targetCustomerName) {
      window.alert("Der Lead enthält keine Firma oder keinen Namen für die Überführung.");
      return;
    }

    try {
      let customerId = "";
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("customers")
          .insert({
            user_id: session.user.id,
            company_name: targetCustomerName,
            contact_person: lead.name.trim(),
            email: lead.email.trim(),
            phone: lead.phone.trim(),
            street: "",
            zip: "",
            city: lead.location.trim(),
          })
          .select()
          .single();

        if (error) throw error;
        customerId = data.id;
        setCustomers((prev) => [data as Customer, ...prev]);
      } else {
        const fallbackCustomer: Customer = {
          id: makeId(),
          user_id: "local",
          company_name: targetCustomerName,
          contact_person: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          street: "",
          zip: "",
          city: lead.location.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        customerId = fallbackCustomer.id;
        setCustomers((prev) => [fallbackCustomer, ...prev]);
      }

      let createdPropertyId = "";
      if (customerId) {
        const now = new Date().toISOString();
        const nextProperty: PropertyRecord = {
          id: makeId(),
          customer_id: customerId,
          name: lead.location?.trim() ? `Objekt · ${lead.location.trim()}` : `Objekt · ${targetCustomerName}`,
          street: "",
          zip: "",
          city: lead.location.trim(),
          units: 1,
          access_notes: "",
          service_scope: lead.notes.trim(),
          status: "active",
          created_at: now,
          updated_at: now,
        };
        createdPropertyId = nextProperty.id;
        setProperties((prev) => [nextProperty, ...prev]);
      }

      setLeads((prev) => prev.map((entry) => entry.id === lead.id ? { ...entry, status: "won" } : entry));
      setSelectedCustomerId(customerId);
      if (createdPropertyId) setSelectedPropertyId(createdPropertyId);
      setActiveTab(createdPropertyId ? "properties" : "customers");
      window.alert("Lead erfolgreich in Kunde und Objekt überführt.");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Lead konnte nicht überführt werden.");
    }
  };

  const openPropertyWorkspace = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setActiveTab("properties");
  };

  const startOfferForCustomer = (customerId: string, presetTitle?: string) => {
    setSelectedCustomerId(customerId);
    if (presetTitle) {
      setOfferTitle((prev) => (prev.trim().length > 0 ? prev : presetTitle));
    }
    setActiveTab("offers");
  };

  const startOfferForProperty = (property: PropertyRecord) => {
    setSelectedPropertyId(property.id);
    setSelectedCustomerId(property.customer_id);
    setOfferTitle(`${property.name} · Angebot`);
    setActiveTab("offers");
  };

  const inferJobCategoryFromOffer = (offer: Offer): JobRecord["category"] => {
    const haystack = `${offer.title} ${offer.items.map((item) => item.description).join(" ")}`.toLowerCase();
    if (haystack.includes("turnover")) return "turnover";
    if (haystack.includes("reinigung")) return "reinigung";
    if (haystack.includes("reparatur")) return "reparatur";
    if (haystack.includes("koordination")) return "koordination";
    if (haystack.includes("betreuung")) return "betreuung";
    return "sonstiges";
  };

  const createJobFromOffer = (offer: Offer) => {
    const matchingProperties = properties.filter((property) => property.customer_id === offer.customer_id);
    const preferredProperty = matchingProperties.find((property) => property.id === selectedPropertyId) ?? matchingProperties[0];

    if (!preferredProperty) {
      setPropertyForm((prev) => ({
        ...prev,
        customerId: offer.customer_id,
        name: prev.name || `${getCustomerDisplayName(offer.customer_id)} · Objekt`,
        serviceScope: prev.serviceScope || offer.items.map((item) => item.description).join(", "),
      }));
      setActiveTab("properties");
      window.alert("Für diesen Kunden existiert noch kein Objekt. Ich habe dir die Objektmaske dafür vorbereitet.");
      return;
    }

    setSelectedPropertyId(preferredProperty.id);
    setJobForm({
      ...EMPTY_JOB_FORM,
      propertyId: preferredProperty.id,
      customerId: offer.customer_id,
      title: offer.title,
      description: offer.items.map((item) => `${item.quantity} × ${item.description}`).join("\n"),
      category: inferJobCategoryFromOffer(offer),
      priority: "medium",
      status: "planned",
      scheduledFor: getTodayDate(),
      recurrence: "once",
      assignee: "",
    });
    setActiveTab("operations");
  };

  const prepareInvoiceFromJob = (job: JobRecord) => {
    if (job.source_offer_id) {
      const linkedOffer = offers.find((offer) => offer.id === job.source_offer_id);
      if (linkedOffer) {
        void createInvoiceFromOffer(linkedOffer);
        return;
      }
    }

    setSelectedCustomerId(job.customer_id);
    setOfferTitle(`${job.title} · Rechnungsgrundlage`);
    setOfferItems([
      {
        id: makeId(),
        description: job.description || job.title,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
    setActiveTab("offers");
    window.alert("Für diesen Auftrag gibt es noch kein verknüpftes Angebot. Ich habe dir eine Rechnungsgrundlage im Angebotsbereich vorbereitet.");
  };

  const handleAuthSubmit = async () => {
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        alert("Registrierung erfolgreich. Bitte E-Mail-Bestätigung prüfen, falls aktiviert.");
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  const saveCustomer = async () => {
    if (!session?.user?.id) return;

    const companyName = customerForm.companyName.trim();

    if (!companyName) {
      alert("Bitte mindestens einen Firmennamen eingeben.");
      return;
    }

    const normalizedName = companyName.toLowerCase();

    const alreadyExists = customers.some(
      (customer) =>
        customer.company_name.toLowerCase() === normalizedName &&
        customer.id !== editingCustomerId
    );

    if (alreadyExists) {
      alert("Ein Kunde mit diesem Firmennamen existiert bereits.");
      return;
    }

    try {
      if (editingCustomerId) {
        const { error } = await supabase
          .from("customers")
          .update({
            company_name: companyName,
            contact_person: customerForm.contactPerson.trim(),
            email: customerForm.email.trim(),
            phone: customerForm.phone.trim(),
            street: customerForm.street.trim(),
            zip: customerForm.zip.trim(),
            city: customerForm.city.trim(),
          })
          .eq("id", editingCustomerId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert({
          user_id: session.user.id,
          company_name: companyName,
          contact_person: customerForm.contactPerson.trim(),
          email: customerForm.email.trim(),
          phone: customerForm.phone.trim(),
          street: customerForm.street.trim(),
          zip: customerForm.zip.trim(),
          city: customerForm.city.trim(),
        });

        if (error) throw error;
      }

      resetCustomerForm();
      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Kunde konnte nicht gespeichert werden.");
    }
  };

  const saveServiceTemplate = async () => {
    if (!session?.user?.id) return;

    const name = templateForm.name.trim();
    const description = templateForm.description.trim();
    const quantity = parseNumberInput(templateForm.quantity);
    const unitPrice = parseNumberInput(templateForm.unitPrice);

    if (!name) {
      alert("Bitte einen Vorlagen-Namen eingeben.");
      return;
    }

    if (!description) {
      alert("Bitte eine Leistungsbeschreibung eingeben.");
      return;
    }

    if (quantity <= 0 || unitPrice <= 0) {
      alert("Bitte gültige Menge und gültigen Preis eingeben.");
      return;
    }

    try {
      const { error } = await supabase.from("service_templates").insert({
        user_id: session.user.id,
        name,
        description,
        quantity,
        unit_price: unitPrice,
      });

      if (error) throw error;

      resetTemplateForm();
      await reloadAll();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Leistungsvorlage konnte nicht gespeichert werden."
      );
    }
  };

  const deleteServiceTemplate = async (templateId: string) => {
    const confirmed = window.confirm("Diese Leistungsvorlage wirklich löschen?");
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("service_templates").delete().eq("id", templateId);
      if (error) throw error;
      await reloadAll();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Leistungsvorlage konnte nicht gelöscht werden."
      );
    }
  };

  const editCustomer = (customer: Customer) => {
    setCustomerForm({
      companyName: customer.company_name,
      contactPerson: customer.contact_person,
      email: customer.email,
      phone: customer.phone,
      street: customer.street,
      zip: customer.zip,
      city: customer.city,
    });
    setEditingCustomerId(customer.id);
    setActiveTab("customers");
  };

  const deleteCustomer = async (customerId: string) => {
    const hasOffers = offers.some((offer) => offer.customer_id === customerId);
    const hasInvoices = invoices.some((invoice) => invoice.customer_id === customerId);

    if (hasOffers || hasInvoices) {
      const confirmed = window.confirm(
        "Dieser Kunde hat bereits Angebote oder Rechnungen. Wirklich alles löschen?"
      );
      if (!confirmed) return;
    }

    try {
      const { error } = await supabase.from("customers").delete().eq("id", customerId);
      if (error) throw error;

      if (selectedCustomerId === customerId) setSelectedCustomerId("");
      if (editingCustomerId === customerId) resetCustomerForm();

      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Kunde konnte nicht gelöscht werden.");
    }
  };

  const updateOfferItem = (
    itemId: string,
    field: "description" | "quantity" | "unitPrice",
    value: string
  ) => {
    setOfferItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        if (field === "description") {
          return { ...item, description: value };
        }

        const parsed = parseNumberInput(value);

        if (field === "quantity") {
          return { ...item, quantity: parsed };
        }

        return { ...item, unitPrice: parsed };
      })
    );
  };

  const addOfferItem = () => {
    setOfferItems((prev) => [
      ...prev,
      {
        id: makeId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeOfferItem = (itemId: string) => {
    if (offerItems.length === 1) {
      alert("Mindestens eine Position muss bleiben.");
      return;
    }

    setOfferItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const addTemplateToOffer = (template: ServiceTemplate) => {
    const newItem: OfferItem = {
      id: makeId(),
      description: template.description,
      quantity: Number(template.quantity),
      unitPrice: Number(template.unit_price),
    };

    setOfferItems((prev) => [...prev, newItem]);
  };

  const addOffer = async () => {
    if (!session?.user?.id) return;

    if (!selectedCustomerId) {
      alert("Bitte zuerst einen Kunden auswählen.");
      return;
    }

    const trimmedTitle = offerTitle.trim();
    if (!trimmedTitle) {
      alert("Bitte einen Angebots-Titel eingeben.");
      return;
    }

    const cleanedItems = offerItems
      .map((item) => ({
        ...item,
        description: item.description.trim(),
      }))
      .filter(
        (item) =>
          item.description !== "" && item.quantity > 0 && item.unitPrice > 0
      );

    if (cleanedItems.length === 0) {
      alert("Bitte mindestens eine gültige Position eintragen.");
      return;
    }

    try {
      const { error } = await supabase.from("offers").insert({
        user_id: session.user.id,
        customer_id: selectedCustomerId,
        title: trimmedTitle,
        items: cleanedItems,
      });

      if (error) throw error;

      resetOfferDraft();
      setActiveTab("offers");
      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Angebot konnte nicht gespeichert werden.");
    }
  };

  const deleteOffer = async (offerId: string) => {
    const hasInvoice = invoices.some((invoice) => invoice.offer_id === offerId);

    if (hasInvoice) {
      const confirmed = window.confirm(
        "Zu diesem Angebot gibt es bereits eine Rechnung. Angebot und Rechnung wirklich löschen?"
      );
      if (!confirmed) return;
    }

    try {
      const { error } = await supabase.from("offers").delete().eq("id", offerId);
      if (error) throw error;

      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Angebot konnte nicht gelöscht werden.");
    }
  };

  const createInvoiceFromOffer = async (offer: Offer) => {
    if (!session?.user?.id) return;

    const alreadyExists = invoices.some((invoice) => invoice.offer_id === offer.id);

    if (alreadyExists) {
      alert("Zu diesem Angebot existiert bereits eine Rechnung.");
      return;
    }

    const total = offer.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const issuedAt = getTodayDate();

    try {
      const { error } = await supabase.from("invoices").insert({
        user_id: session.user.id,
        invoice_number: nextInvoiceNumber,
        offer_id: offer.id,
        customer_id: offer.customer_id,
        items: offer.items,
        total: Number(total.toFixed(2)),
        issued_at: issuedAt,
        due_date: addDays(issuedAt, 14),
        status: "open",
      });

      if (error) throw error;

      setActiveTab("invoices");
      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Rechnung konnte nicht erstellt werden.");
    }
  };

  const markInvoiceAsPaid = async (invoice: Invoice) => {
    try {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", invoice.id);

      if (invoiceError) throw invoiceError;

      const { data: existingTransaction, error: existingTransactionError } = await supabase
        .from("transactions")
        .select("id")
        .eq("invoice_id", invoice.id)
        .eq("source", "invoice_auto")
        .maybeSingle();

      if (existingTransactionError) throw existingTransactionError;

      if (!existingTransaction) {
        const { error: transactionInsertError } = await supabase.from("transactions").insert({
          user_id: invoice.user_id,
          type: "income",
          title: `Rechnung ${invoice.invoice_number}`,
          amount: Number(invoice.total),
          booking_date: invoice.issued_at,
          invoice_id: invoice.id,
          source: "invoice_auto",
        });

        if (transactionInsertError) throw transactionInsertError;
      }

      await reloadAll();
    } catch (error) {
      console.error("Fehler beim Bezahlt-Markieren:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Rechnung konnte nicht als bezahlt markiert werden."
      );
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
      if (error) throw error;

      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Rechnung konnte nicht gelöscht werden.");
    }
  };

  const addManualTransaction = async () => {
    if (!session?.user?.id) return;

    const title = transactionForm.title.trim();
    const amount = parseNumberInput(transactionForm.amount);
    const date = transactionForm.date;

    if (!title) {
      alert("Bitte einen Titel eingeben.");
      return;
    }

    if (amount <= 0) {
      alert("Bitte einen gültigen Betrag eingeben.");
      return;
    }

    if (!date) {
      alert("Bitte ein Datum auswählen.");
      return;
    }

    try {
      const transactionId = makeId();

      const { error } = await supabase.from("transactions").insert({
        id: transactionId,
        user_id: session.user.id,
        type: transactionForm.type,
        title,
        amount: Number(amount.toFixed(2)),
        booking_date: date,
        source: "manual",
      });

      if (error) throw error;

      if (transactionReceiptFile) {
        await uploadFinanceDocument(transactionId, transactionReceiptFile);
      }

      resetTransactionForm();
      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Buchung konnte nicht gespeichert werden.");
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId)
        .eq("source", "manual");

      if (error) throw error;

      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Buchung konnte nicht gelöscht werden.");
    }
  };

const escapeHtml = (value: string | number | null | undefined) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const getOfferDocumentNumber = (offer: Offer) => {
  const year = new Date(offer.created_at || Date.now()).getFullYear();
  return `ANG-${year}-${offer.id.slice(0, 6).toUpperCase()}`;
};

const buildCustomerHtml = (customer?: Customer) => {
  if (!customer) {
    return `<div class="party-line"><strong>Unbekannter Kunde</strong></div>`;
  }

  return `
    <div class="party-line"><strong>${escapeHtml(customer.company_name)}</strong></div>
    ${customer.contact_person ? `<div class="party-line">${escapeHtml(customer.contact_person)}</div>` : ""}
    ${customer.street ? `<div class="party-line">${escapeHtml(customer.street)}</div>` : ""}
    ${customer.zip || customer.city ? `<div class="party-line">${escapeHtml(`${customer.zip || ""} ${customer.city || ""}`.trim())}</div>` : ""}
    ${customer.email ? `<div class="party-line">${escapeHtml(customer.email)}</div>` : ""}
    ${customer.phone ? `<div class="party-line">${escapeHtml(customer.phone)}</div>` : ""}
  `;
};

const buildRowsHtml = (items: OfferItem[]) => {
  return items
    .map((item, index) => {
      const lineTotal = Number(item.quantity) * Number(item.unitPrice);
      return `
        <tr>
          <td class="col-pos">${index + 1}.</td>
          <td class="col-description">${escapeHtml(item.description)}</td>
          <td class="right">${escapeHtml(item.quantity)}</td>
          <td class="right">${escapeHtml(formatCurrency(item.unitPrice))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(lineTotal))}</td>
        </tr>
      `;
    })
    .join("");
};

const printDocumentBase = ({
  title,
  documentType,
  documentNumber,
  documentDate,
  dueDate,
  customerHtml,
  intro,
  rowsHtml,
  total,
  footerHint,
}: {
  title: string;
  documentType: string;
  documentNumber: string;
  documentDate: string;
  dueDate?: string;
  customerHtml: string;
  intro: string;
  rowsHtml: string;
  total: string;
  footerHint: string;
}) => {
  const printWindow = window.open("", "_blank", "width=1200,height=900");

  if (!printWindow) {
    alert("Druckfenster konnte nicht geöffnet werden.");
    return;
  }

  const safeTitle = escapeHtml(title);
  const safeDocumentType = escapeHtml(documentType);
  const safeDocumentNumber = escapeHtml(documentNumber);
  const safeDocumentDate = escapeHtml(documentDate);
  const safeDueDate = dueDate ? escapeHtml(dueDate) : "";
  const safeIntro = escapeHtml(intro);
  const safeTotal = escapeHtml(total);
  const safeFooterHint = escapeHtml(footerHint);
  const documentNumberLabel = safeDocumentType === "Rechnung" ? "Rechnungsnummer" : "Angebotsnummer";

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${safeTitle}</title>
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: #f3f4f6;
            color: #1f2937;
            font-family: Inter, Arial, Helvetica, sans-serif;
          }

          body {
            padding: 28px;
          }

          .sheet {
            max-width: 920px;
            margin: 0 auto;
            background: #ffffff;
            padding: 58px 58px 46px;
            box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
          }

          .brand {
            margin-bottom: 34px;
          }

          .brand-name {
            font-size: 31px;
            line-height: 1.02;
            font-weight: 700;
            letter-spacing: -0.04em;
            color: #111827;
            margin-bottom: 10px;
          }

          .brand-meta {
            font-size: 13px;
            line-height: 1.75;
            color: #4b5563;
          }

          .document-head {
            margin-bottom: 34px;
          }

          .document-type {
            margin: 0;
            font-size: 26px;
            line-height: 1.15;
            font-weight: 600;
            letter-spacing: -0.03em;
            color: #111827;
          }

          .document-subline {
            margin-top: 10px;
            font-size: 13px;
            color: #6b7280;
            letter-spacing: 0.01em;
          }

          .document-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 290px;
            gap: 46px;
            align-items: start;
            margin-bottom: 34px;
          }

          .section-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #6b7280;
            font-weight: 700;
            margin-bottom: 11px;
          }

          .party-line {
            font-size: 14px;
            line-height: 1.7;
            color: #1f2937;
          }

          .doc-facts {
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #e5e7eb;
            padding: 10px 0;
          }

          .doc-fact {
            display: grid;
            grid-template-columns: 124px 1fr;
            gap: 12px;
            padding: 7px 0;
            font-size: 14px;
            line-height: 1.5;
          }

          .doc-fact-label {
            color: #4b5563;
            font-weight: 600;
          }

          .doc-fact-value {
            color: #111827;
            font-weight: 500;
          }

          .intro {
            margin: 0 0 26px;
            max-width: 760px;
            font-size: 15px;
            line-height: 1.85;
            color: #374151;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead th {
            text-align: left;
            padding: 12px 8px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.03em;
            color: #374151;
            border-top: 1px solid #cfd4dc;
            border-bottom: 1px solid #cfd4dc;
          }

          tbody td {
            padding: 13px 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
          }

          .col-pos {
            width: 56px;
            color: #6b7280;
          }

          .col-description {
            width: 48%;
          }

          .right {
            text-align: right;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }

          .summary-wrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 18px;
          }

          .summary-box {
            width: 308px;
          }

          .summary-row,
          .summary-total {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding: 8px 0;
            font-variant-numeric: tabular-nums;
          }

          .summary-row {
            font-size: 14px;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
          }

          .summary-total {
            margin-top: 3px;
            padding-top: 12px;
            border-top: 1px solid #9ca3af;
            font-size: 16px;
            font-weight: 700;
            color: #111827;
          }

          .note {
            margin-top: 36px;
            max-width: 760px;
            font-size: 14px;
            line-height: 1.85;
            color: #374151;
          }

          .footer {
            margin-top: 44px;
            padding-top: 16px;
            border-top: 1px solid #d1d5db;
            font-size: 12px;
            line-height: 1.75;
            color: #6b7280;
          }

          @page {
            size: A4;
            margin: 14mm;
          }

          @media print {
            html, body {
              background: #ffffff;
            }

            body {
              padding: 0;
            }

            .sheet {
              max-width: none;
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <section class="brand">
            <div class="brand-name">${escapeHtml(COMPANY_PROFILE.name)}</div>
            <div class="brand-meta">
              ${escapeHtml(COMPANY_PROFILE.street)}<br />
              ${escapeHtml(`${COMPANY_PROFILE.zip} ${COMPANY_PROFILE.city}`)}<br />
              ${escapeHtml(COMPANY_PROFILE.email)}
            </div>
          </section>

          <section class="document-head">
            <h1 class="document-type">${safeDocumentType}</h1>
            <div class="document-subline">${documentNumberLabel}: ${safeDocumentNumber}</div>
          </section>

          <section class="document-grid">
            <div>
              <div class="section-label">Empfänger</div>
              ${customerHtml}
            </div>

            <div>
              <div class="section-label">Dokumentdaten</div>
              <div class="doc-facts">
                <div class="doc-fact">
                  <div class="doc-fact-label">${documentNumberLabel}</div>
                  <div class="doc-fact-value">${safeDocumentNumber}</div>
                </div>
                <div class="doc-fact">
                  <div class="doc-fact-label">Datum</div>
                  <div class="doc-fact-value">${safeDocumentDate}</div>
                </div>
                ${safeDueDate ? `
                <div class="doc-fact">
                  <div class="doc-fact-label">Fälligkeit</div>
                  <div class="doc-fact-value">${safeDueDate}</div>
                </div>` : ""}
              </div>
            </div>
          </section>

          <p class="intro">${safeIntro}</p>

          <table>
            <thead>
              <tr>
                <th class="col-pos">Pos.</th>
                <th class="col-description">Beschreibung</th>
                <th class="right">Menge</th>
                <th class="right">Einzelpreis</th>
                <th class="right">Gesamtpreis</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="summary-wrap">
            <div class="summary-box">
              <div class="summary-row">
                <span>Zwischensumme</span>
                <span>${safeTotal}</span>
              </div>
              <div class="summary-total">
                <span>Gesamtbetrag</span>
                <span>${safeTotal}</span>
              </div>
            </div>
          </div>

          <div class="note">${safeFooterHint}</div>

          <div class="footer">
            ${escapeHtml(COMPANY_PROFILE.name)} · ${escapeHtml(COMPANY_PROFILE.street)} · ${escapeHtml(`${COMPANY_PROFILE.zip} ${COMPANY_PROFILE.city}`)} · ${escapeHtml(COMPANY_PROFILE.email)}
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

  const printOffer = (offer: Offer) => {
    const customer = customers.find((c) => c.id === offer.customer_id);
    const total = getOfferTotal(offer);

    printDocumentBase({
      title: `Angebot - ${offer.title}`,
      documentType: "Angebot",
      documentNumber: getOfferDocumentNumber(offer),
      documentDate: formatDateGerman(offer.created_at),
      customerHtml: buildCustomerHtml(customer),
      intro:
        "Vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen folgendes Angebot für die nachstehend aufgeführten Leistungen.",
      rowsHtml: buildRowsHtml(offer.items),
      total: formatCurrency(total),
      footerHint:
        "Dieses Angebot basiert auf dem aktuell abgestimmten Leistungsumfang. Bei Rückfragen oder Änderungswünschen stehen wir Ihnen gerne zur Verfügung.",
    });
  };

  const printInvoice = (invoice: Invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);

    printDocumentBase({
      title: `Rechnung ${invoice.invoice_number}`,
      documentType: "Rechnung",
      documentNumber: invoice.invoice_number,
      documentDate: formatDateGerman(invoice.issued_at),
      dueDate: formatDateGerman(invoice.due_date),
      customerHtml: buildCustomerHtml(customer),
      intro:
        "Hiermit berechnen wir Ihnen die nachfolgend aufgeführten Leistungen. Vielen Dank für Ihr Vertrauen und die angenehme Zusammenarbeit.",
      rowsHtml: buildRowsHtml(invoice.items),
      total: formatCurrency(Number(invoice.total)),
      footerHint:
        invoice.status === "paid"
          ? "Der Rechnungsbetrag wurde bereits als bezahlt markiert. Vielen Dank."
          : `Bitte begleichen Sie den offenen Betrag bis spätestens ${formatDateGerman(invoice.due_date)}.`,
    });
  };

  const resetAllData = async () => {
    const confirmed = window.confirm(
      "Wirklich alle Kunden, Angebote, Rechnungen und Finanzen löschen?"
    );
    if (!confirmed || !session?.user?.id) return;

    try {
      const userId = session.user.id;

      const { error: transactionsError } = await supabase
        .from("transactions")
        .delete()
        .eq("user_id", userId);
      if (transactionsError) throw transactionsError;

      const { error: invoicesError } = await supabase
        .from("invoices")
        .delete()
        .eq("user_id", userId);
      if (invoicesError) throw invoicesError;

      const { error: offersError } = await supabase
        .from("offers")
        .delete()
        .eq("user_id", userId);
      if (offersError) throw offersError;

      const { error: customersError } = await supabase
        .from("customers")
        .delete()
        .eq("user_id", userId);
      if (customersError) throw customersError;

      const { error: templatesError } = await supabase
        .from("service_templates")
        .delete()
        .eq("user_id", userId);
      if (templatesError) throw templatesError;

      setSelectedCustomerId("");
      resetCustomerForm();
      resetOfferDraft();
      resetTransactionForm();
      resetTemplateForm();

      await reloadAll();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Daten konnten nicht gelöscht werden.");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, rgba(119, 91, 255, 0.16) 0%, rgba(79, 70, 229, 0.08) 18%, rgba(255,255,255,0) 40%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.16) 0%, rgba(14, 165, 233, 0.08) 20%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #f4f7fb 0%, #eef2f7 100%)",
      padding: "16px",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#111827",
    } as const,
    container: {
      maxWidth: "1180px",
      margin: "0 auto",
    } as const,
    header: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr)",
      justifyItems: "start",
      gap: "12px",
      marginBottom: "12px",
      textAlign: "left" as const,
    },
    title: {
      margin: 0,
      fontSize: "28px",
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      fontWeight: 800,
    } as const,
    subtitle: {
      margin: "6px 0 0 0",
      color: "#5b6474",
      fontSize: "14px",
      maxWidth: "680px",
      lineHeight: 1.6,
      textAlign: "left" as const,
    } as const,
    brandBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 10px",
      borderRadius: "999px",
      background: "#eef2ff",
      border: "1px solid #dbe3ff",
      color: "#3730a3",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      boxShadow: "none",
    } as const,
    glowPill: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#ffffff",
      border: "1px solid #d7deea",
      color: "#312e81",
      fontSize: "12px",
      fontWeight: 600,
      boxShadow: "none",
    } as const,
    softPill: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#ffffff",
      border: "1px solid rgba(148, 163, 184, 0.18)",
      color: "#334155",
      fontSize: "12px",
      fontWeight: 600,
    } as const,
    topGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "12px",
      marginBottom: "14px",
    } as const,
    financeTopGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "12px",
      marginBottom: "14px",
    } as const,
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "12px",
    } as const,
    statCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "14px",
      boxShadow: "none",
    } as const,
    statLabel: {
      margin: 0,
      color: "#5b6474",
      fontSize: "14px",
    } as const,
    statValue: {
      margin: "6px 0 0 0",
      fontSize: "24px",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    } as const,
    tabs: {
      display: "flex",
      gap: "8px",
      marginBottom: "12px",
      flexWrap: "wrap" as const,
    },
    tabButton: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "1px solid #d7deea",
      background: "rgba(255,255,255,0.85)",
      cursor: "pointer",
      fontWeight: 700,
      color: "#1f2937",
      boxShadow: "none",
    } as const,
    activeTabButton: {
      padding: "9px 12px",
      borderRadius: "10px",
      border: "1px solid #312e81",
      background: "#312e81",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: "none",
    } as const,
    layoutTwoCol: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gap: "16px",
      alignItems: "start",
    } as const,
    card: {
      background: "#ffffff",
      backdropFilter: "none",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "16px",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
    } as const,
    cardTitle: {
      margin: "0 0 14px 0",
      fontSize: "20px",
      letterSpacing: "-0.02em",
    } as const,
    sectionTitle: {
      margin: "0 0 10px 0",
      fontSize: "16px",
    } as const,
    input: {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "12px",
      border: "1px solid #d6deea",
      boxSizing: "border-box" as const,
      fontSize: "14px",
      background: "#ffffff",
      outline: "none",
    },
    row: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap" as const,
    },
    stack: {
      display: "grid",
      gap: "12px",
    } as const,
    buttonPrimary: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "none",
      background: "#312e81",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: 700,
      boxShadow: "none",
    } as const,
    buttonAccent: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "1px solid rgba(59, 130, 246, 0.24)",
      background: "#2563eb",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: 800,
      boxShadow: "none",
    } as const,
    buttonSecondary: {
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid #d7deea",
      background: "#ffffff",
      cursor: "pointer",
      color: "#111827",
      fontWeight: 600,
    } as const,
    buttonGhost: {
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid rgba(99, 102, 241, 0.18)",
      background: "rgba(238, 242, 255, 0.9)",
      cursor: "pointer",
      color: "#3730a3",
      fontWeight: 700,
    } as const,
    buttonDanger: {
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid #f3b2b2",
      background: "#fff5f5",
      color: "#b42318",
      cursor: "pointer",
      fontWeight: 600,
    } as const,
    smallLabel: {
      display: "block",
      marginBottom: "7px",
      fontWeight: 700,
      fontSize: "13px",
      color: "#475467",
    } as const,
    mutedBox: {
      padding: "14px",
      borderRadius: "14px",
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
    } as const,
    customerDetailsBox: {
      padding: "16px",
      borderRadius: "16px",
      background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
      border: "1px solid #e6ebf2",
      lineHeight: 1.75,
      boxShadow: "none",
    } as const,
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      padding: "12px 14px",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      background: "#fafcff",
    } as const,
    contentGrid: {
      display: "grid",
      gap: "16px",
    } as const,
    templateGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "12px",
    } as const,
    templateButton: {
      textAlign: "left" as const,
      padding: "16px",
      borderRadius: "16px",
      border: "1px solid #d9e2f0",
      background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,248,255,1) 100%)",
      cursor: "pointer",
      minHeight: "96px",
      boxShadow: "none",
    } as const,
    offerItemCard: {
      padding: "16px",
      border: "1px solid #e6ebf2",
      borderRadius: "16px",
      background: "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)",
      boxShadow: "none",
    } as const,
    offerItemGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 2.2fr) 120px 150px auto",
      gap: "12px",
      alignItems: "end",
    } as const,
    totalBox: {
      padding: "16px 18px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
      border: "1px solid rgba(99, 102, 241, 0.28)",
      fontSize: "20px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      textAlign: "left" as const,
      color: "#ffffff",
      boxShadow: "none",
    } as const,
    bigList: {
      display: "grid",
      gap: "12px",
    } as const,
    entityCard: {
      border: "1px solid #e6ebf2",
      borderRadius: "18px",
      padding: "16px",
      background: "#ffffff",
      boxShadow: "none",
    } as const,
    entityHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      alignItems: "flex-start",
      flexWrap: "wrap" as const,
      width: "100%",
      marginBottom: "12px",
    } as const,
    tableWrap: {
      overflowX: "auto" as const,
      width: "100%",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      background: "#ffffff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      minWidth: "640px",
    },
    th: {
      textAlign: "left" as const,
      padding: "12px",
      background: "#f8fafc",
      borderBottom: "1px solid #e5e7eb",
      fontSize: "14px",
      color: "#344054",
    },
    td: {
      padding: "14px",
      borderBottom: "1px solid #edf2f7",
      fontSize: "14px",
    },
    badgeOpen: {
      display: "inline-block",
      padding: "7px 12px",
      borderRadius: "999px",
      background: "#fef3c7",
      color: "#92400e",
      fontWeight: 700,
      fontSize: "12px",
    } as const,
    badgePaid: {
      display: "inline-block",
      padding: "7px 12px",
      borderRadius: "999px",
      background: "#dcfce7",
      color: "#166534",
      fontWeight: 700,
      fontSize: "12px",
    } as const,
    badgeNeutral: {
      display: "inline-block",
      padding: "7px 12px",
      borderRadius: "999px",
      background: "#e5e7eb",
      color: "#374151",
      fontWeight: 700,
      fontSize: "12px",
    } as const,
    heroBox: {
      padding: "16px 18px",
      borderRadius: "16px",
      background: "#f8fafc",
      color: "#111827",
      marginBottom: "16px",
      boxShadow: "none",
    } as const,
    helperText: {
      color: "#5b6474",
      fontSize: "12px",
      lineHeight: 1.55,
      marginTop: "4px",
    } as const,

    pageStack: {
      display: "grid",
      gap: "16px",
    } as const,
    calendarTopBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "16px",
      flexWrap: "wrap" as const,
    } as const,
    calendarToolbar: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap" as const,
      justifyContent: "flex-end",
    } as const,
    calendarSummaryBar: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "8px",
      marginTop: "12px",
      marginBottom: "12px",
    } as const,
    calendarSummaryItem: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "10px 12px",
    } as const,
    calendarSummaryLabel: {
      fontSize: "12px",
      color: "#667085",
      marginBottom: "6px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      fontWeight: 700,
    } as const,
    calendarSummaryValue: {
      fontSize: "18px",
      color: "#101828",
      fontWeight: 700,
      lineHeight: 1.3,
    } as const,
    calendarGrid: {
      display: "grid",
      gap: "8px",
      alignItems: "start",
    } as const,
    calendarDayCard: {
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "12px",
      background: "#ffffff",
      minHeight: "auto",
      boxShadow: "none",
    } as const,
    calendarDayHeader: {
      display: "grid",
      gridTemplateColumns: "140px minmax(0, 1fr) auto",
      alignItems: "center",
      gap: "12px",
    } as const,
    calendarDayHeaderRight: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      flexWrap: "wrap" as const,
      justifyContent: "flex-end",
    } as const,
    calendarDayLabel: {
      fontSize: "11px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.12em",
      color: "#98a2b3",
      fontWeight: 800,
      marginBottom: "4px",
    } as const,
    calendarDayDate: {
      fontSize: "16px",
      fontWeight: 800,
      color: "#101828",
    } as const,
    calendarTodayBadge: {
      padding: "5px 10px",
      borderRadius: "999px",
      background: "#e0e7ff",
      color: "#3730a3",
      fontSize: "12px",
      fontWeight: 700,
    } as const,
    calendarCountBadge: {
      minWidth: "32px",
      height: "32px",
      borderRadius: "999px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#eef2f6",
      color: "#344054",
      fontSize: "13px",
      fontWeight: 800,
      padding: "0 10px",
    } as const,
    calendarJobsList: {
      display: "grid",
      gap: "6px",
      marginTop: "0",
    } as const,
    calendarEmpty: {
      color: "#98a2b3",
      fontSize: "13px",
      padding: "4px 0",
      borderRadius: "0",
      background: "transparent",
      border: "none",
    } as const,
    calendarJobItem: {
      padding: "10px 12px",
      borderRadius: "10px",
      background: "#f9fafb",
      border: "1px solid #eef2f6",
      color: "#1f2937",
      fontSize: "13px",
      lineHeight: 1.45,
    } as const,
    calendarJobTopRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      alignItems: "flex-start",
      marginBottom: "6px",
    } as const,
    calendarJobTitle: {
      fontWeight: 700,
      fontSize: "14px",
      color: "#111827",
      lineHeight: 1.4,
    } as const,
    calendarJobMeta: {
      color: "#667085",
      fontSize: "13px",
    } as const,
    calendarJobMetaRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap" as const,
      marginTop: "10px",
    } as const,
    calendarMetaPill: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 9px",
      borderRadius: "999px",
      background: "#ffffff",
      border: "1px solid #e4e7ec",
      color: "#475467",
      fontSize: "12px",
      fontWeight: 600,
    } as const,
    photoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      gap: "12px",
    } as const,
    photoThumbWrap: {
      position: "relative" as const,
    },
    photoThumbLink: {
      display: "block",
      borderRadius: "14px",
      overflow: "hidden",
      border: "1px solid #dbe3ef",
      background: "#ffffff",
      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
    } as const,
    photoThumb: {
      width: "100%",
      height: "110px",
      objectFit: "cover" as const,
      display: "block",
      borderRadius: "14px",
    } as const,
    photoRemoveButton: {
      position: "absolute" as const,
      top: "8px",
      right: "8px",
      width: "28px",
      height: "28px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,0.9)",
      background: "rgba(15, 23, 42, 0.82)",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: 800,
      lineHeight: 1,
      boxShadow: "0 8px 16px rgba(15, 23, 42, 0.22)",
    } as const,
    templateManagerBox: {
      padding: "18px",
      borderRadius: "18px",
      background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      border: "1px solid #e5e7eb",
    } as const,
  };

  useEffect(() => {
    if (!properties.length) {
      if (selectedPropertyId) setSelectedPropertyId("");
      return;
    }

    if (!selectedPropertyId || !properties.some((property) => property.id === selectedPropertyId)) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  const renderStatCard = (label: string, value: string | number) => (
    <div style={styles.statCard}>
      <div style={{ width: "28px", height: "3px", borderRadius: "999px", background: "#6366f1" }} />
      <p style={{ ...styles.statLabel, marginTop: "10px" }}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );

  const renderCustomerSummary = () => (
    <div style={styles.customerDetailsBox}>
      <strong>Aktiv ausgewählt:</strong>
      <div style={{ marginTop: "8px" }}>
        {selectedCustomer ? (
          <>
            <div>
              <strong>{selectedCustomer.company_name}</strong>
            </div>
            {selectedCustomer.contact_person && <div>{selectedCustomer.contact_person}</div>}
            {selectedCustomer.street && <div>{selectedCustomer.street}</div>}
            {(selectedCustomer.zip || selectedCustomer.city) && (
              <div>
                {selectedCustomer.zip} {selectedCustomer.city}
              </div>
            )}
            {selectedCustomer.email && <div>E-Mail: {selectedCustomer.email}</div>}
            {selectedCustomer.phone && <div>Telefon: {selectedCustomer.phone}</div>}
          </>
        ) : (
          <div>Keiner</div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={{ ...styles.contentGrid, minWidth: 0 }}>
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Schnellübersicht</h2>
        <div style={styles.topGrid}>
          {renderStatCard("Kunden", customers.length)}
          {renderStatCard("Angebote", offers.length)}
          {renderStatCard("Offene Rechnungen", formatCurrency(openInvoiceTotal))}
          {renderStatCard("Gewinn", formatCurrency(profit))}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Cashflow & offene Posten</h2>
        <div style={styles.financeTopGrid}>
          {renderStatCard("Offene Summe", formatCurrency(openInvoiceTotal))}
          {renderStatCard("Überfällig", formatCurrency(overdueInvoiceTotal))}
          {renderStatCard("Bezahlt diesen Monat", formatCurrency(paidThisMonth))}
        </div>
        <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
          {overdueInvoices.slice(0, 3).map((invoice) => (
            <div key={invoice.id} style={styles.listItem}>
              <div>
                <strong>{invoice.invoice_number}</strong>
                <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                  {getCustomerDisplayName(invoice.customer_id)} · fällig seit {formatDateGerman(invoice.due_date)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{formatCurrency(Number(invoice.total))}</div>
                <span style={styles.badgeOpen}>Überfällig</span>
              </div>
            </div>
          ))}
          {overdueInvoices.length === 0 ? <div style={styles.mutedBox}>Aktuell keine überfälligen Rechnungen.</div> : null}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Objektfokus</h2>
        {selectedPropertyRecord ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <div style={{ ...styles.mutedBox, background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(236, 242, 255, 0.92) 100%)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", fontWeight: 800 }}>Aktives Objekt</div>
                  <div style={{ marginTop: "8px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em" }}>{selectedPropertyRecord.name}</div>
                  <div style={{ marginTop: "6px", color: "#475467" }}>{[selectedPropertyRecord.street, `${selectedPropertyRecord.zip} ${selectedPropertyRecord.city}`.trim()].filter(Boolean).join(", ")}</div>
                </div>
                <div style={{ display: "grid", gap: "10px", minWidth: "220px" }}>
                  <span style={styles.badgeNeutral}>{selectedPropertyOpenJobs.length} offene Aufträge</span>
                  <span style={styles.badgeNeutral}>{selectedPropertyUpdates.length} Updates dokumentiert</span>
                  <span style={styles.badgeNeutral}>{selectedPropertyInvoices.length} Rechnungen beim Kunden</span>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {selectedPropertyNextJobs.slice(0, 3).map((job) => (
                <div key={job.id} style={styles.listItem}>
                  <div>
                    <strong>{job.title}</strong>
                    <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{formatDateGerman(job.scheduled_for)} · {getJobStatusLabel(job.status)}</div>
                  </div>
                  <span style={job.priority === "high" ? styles.badgeOpen : styles.badgeNeutral}>{getPriorityLabel(job.priority)}</span>
                </div>
              ))}
              {selectedPropertyNextJobs.length === 0 ? <div style={styles.mutedBox}>Für dieses Objekt sind noch keine Einsätze geplant.</div> : null}
            </div>
          </div>
        ) : (
          <div style={styles.mutedBox}>Noch kein Objekt vorhanden.</div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Workflow-Nächste Schritte</h2>
        <div style={styles.bigList}>
          <div style={styles.listItem}>
            <div>
              <strong>Leads qualifizieren</strong>
              <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{openLeads.length} offene Leads warten auf Einordnung oder Überführung.</div>
            </div>
            <ActionButton onClick={() => setActiveTab("leads")} style={styles.buttonPrimary}>Zu Leads</ActionButton>
          </div>
          <div style={styles.listItem}>
            <div>
              <strong>Angebote weiterverarbeiten</strong>
              <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{finalizedOffers.length} finale Angebote können in Aufträge oder Rechnungen überführt werden.</div>
            </div>
            <ActionButton onClick={() => setActiveTab("offers")} style={styles.buttonPrimary}>Zu Angeboten</ActionButton>
          </div>
          <div style={styles.listItem}>
            <div>
              <strong>Einsätze steuern</strong>
              <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{upcomingJobs.length} kommende Einsätze stehen in den nächsten 7 Tagen an.</div>
            </div>
            <ActionButton onClick={() => setActiveTab("operations")} style={styles.buttonPrimary}>Zum Einsatzplan</ActionButton>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Letzte Angebote</h2>
        {offers.length === 0 ? (
          <p>Noch keine Angebote vorhanden.</p>
        ) : (
          <div style={styles.bigList}>
            {finalizedOffers.slice(0, 3).map((offer) => (
              <div key={offer.id} style={styles.listItem}>
                <div>
                  <strong>{offer.title}</strong>
                  <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                    {getCustomerDisplayName(offer.customer_id)} · {formatDateGerman(offer.created_at)}
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>{formatCurrency(getOfferTotal(offer))}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Operations</h2>
        <div style={styles.financeTopGrid}>
          {renderStatCard("Objekte aktiv", activeProperties.length)}
          {renderStatCard("Offene Aufträge", openJobs.length)}
          {renderStatCard("Leads offen", openLeads.length)}
        </div>
        <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
          {plannedJobsThisWeek.slice(0, 3).map((job) => (
            <div key={job.id} style={styles.listItem}>
              <div>
                <strong>{job.title}</strong>
                <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                  {getPropertyDisplayName(job.property_id)} · {formatDateGerman(job.scheduled_for)}
                </div>
              </div>
              <span style={job.priority === "high" ? styles.badgeOpen : styles.badgeNeutral}>
                {getPriorityLabel(job.priority)}
              </span>
            </div>
          ))}
          {plannedJobsThisWeek.length === 0 ? (
            <div style={styles.mutedBox}>Keine geplanten Einsätze in den nächsten 7 Tagen.</div>
          ) : null}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Datensicherung</h2>
        <div style={{ ...styles.row, justifyContent: "space-between", alignItems: "stretch" }}>
          <div style={{ ...styles.mutedBox, flex: 1, minWidth: "320px", background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(238,242,255,0.9) 100%)", boxShadow: "0 16px 34px rgba(79, 70, 229, 0.08)" }}>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6366f1", fontWeight: 800 }}>Lokale Sicherheit</div>
            <div style={{ marginTop: "8px", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Voll-Backup aktiv
            </div>
            <div style={{ marginTop: "10px", color: "#475467", lineHeight: 1.7 }}>
              Bei jeder relevanten Datenänderung wird ein vollständiger Snapshot lokal gesichert. Zusätzlich bleibt dein Angebotseditor laufend als Draft erhalten.
            </div>
            <div style={{ marginTop: "12px", color: "#475467", fontSize: "14px" }}>
              Lokale Historie: <strong>{backupHistoryCount}</strong> Snapshot{backupHistoryCount === 1 ? "" : "s"}
            </div>
            {lastBackupAt ? (
              <div style={{ marginTop: "6px", color: "#475467", fontSize: "14px" }}>
                Letzte Sicherung: <strong>{formatDateGerman(lastBackupAt)}</strong> · {new Date(lastBackupAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
              </div>
            ) : null}
          </div>

          <div style={{ ...styles.stack, minWidth: "260px", flex: "0 0 280px" }}>
            <ActionButton onClick={exportFullBackup} style={styles.buttonAccent}>
              JSON-Backup exportieren
            </ActionButton>
            <ActionButton onClick={downloadLatestLocalBackup} style={styles.buttonSecondary}>
              Letzten lokalen Snapshot laden
            </ActionButton>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCustomers = () => (
    <div style={styles.layoutTwoCol}>
      <section style={styles.card}>
        <div style={styles.heroBox}>
          <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "8px" }}>
            Kundenverwaltung
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, lineHeight: 1.05 }}>
            {editingCustomerId ? "Kunde bearbeiten" : "Neuen Kunden anlegen"}
          </div>
        </div>

        <div style={styles.stack}>
          <div>
            <label style={styles.smallLabel}>Firmenname *</label>
            <input
              value={customerForm.companyName}
              onChange={(e) => handleCustomerFormChange("companyName", e.target.value)}
              placeholder="z. B. Müller GmbH"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.smallLabel}>Ansprechpartner</label>
            <input
              value={customerForm.contactPerson}
              onChange={(e) => handleCustomerFormChange("contactPerson", e.target.value)}
              placeholder="Max Müller"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.smallLabel}>E-Mail</label>
            <input
              value={customerForm.email}
              onChange={(e) => handleCustomerFormChange("email", e.target.value)}
              placeholder="kunde@firma.de"
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.smallLabel}>Telefon</label>
            <input
              value={customerForm.phone}
              onChange={(e) => handleCustomerFormChange("phone", e.target.value)}
              placeholder="+49 ..."
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.smallLabel}>Straße / Hausnummer</label>
            <input
              value={customerForm.street}
              onChange={(e) => handleCustomerFormChange("street", e.target.value)}
              placeholder="Musterstraße 1"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>PLZ</label>
              <input
                value={customerForm.zip}
                onChange={(e) => handleCustomerFormChange("zip", e.target.value)}
                placeholder="12345"
                style={styles.input}
              />
            </div>

            <div style={{ flex: 2 }}>
              <label style={styles.smallLabel}>Ort</label>
              <input
                value={customerForm.city}
                onChange={(e) => handleCustomerFormChange("city", e.target.value)}
                placeholder="Berlin"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <ActionButton onClick={saveCustomer} style={styles.buttonPrimary}>
              {editingCustomerId ? "Änderungen speichern" : "Kunde speichern"}
            </ActionButton>
            <ActionButton onClick={resetCustomerForm} style={styles.buttonSecondary}>
              Zurücksetzen
            </ActionButton>
          </div>

          <div>
            <label style={styles.smallLabel}>Kunde suchen</label>
            <input
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder='z. B. "müller", "berlin", "mail"'
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.smallLabel}>Kunde auswählen</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={styles.input}
            >
              <option value="">Bitte Kunden auswählen</option>
              {filteredCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.company_name}
                </option>
              ))}
            </select>
          </div>

          {renderCustomerSummary()}
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Kundenliste</h2>

        {customers.length === 0 ? (
          <p>Noch keine Kunden vorhanden.</p>
        ) : (
          <div style={styles.stack}>
            {customers.map((customer) => (
              <div key={customer.id} style={styles.listItem}>
                <div>
                  <div style={{ fontWeight: 700 }}>{customer.company_name}</div>
                  <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                    {customer.contact_person || "Kein Ansprechpartner"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    {customer.email || "Keine E-Mail"} {customer.phone ? `· ${customer.phone}` : ""}
                  </div>
                </div>

                <div style={styles.row}>
                  <ActionButton
                    onClick={() => startOfferForCustomer(customer.id, `${customer.company_name} · Angebot`)}
                    style={styles.buttonPrimary}
                  >
                    Angebot erstellen
                  </ActionButton>
                  <ActionButton
                    onClick={() => { setPropertyForm((prev) => ({ ...EMPTY_PROPERTY_FORM, customerId: customer.id, name: `${customer.company_name} · Objekt`, street: customer.street, zip: customer.zip, city: customer.city })); setActiveTab("properties"); }}
                    style={styles.buttonGhost}
                  >
                    Objekt anlegen
                  </ActionButton>
                  <ActionButton
                    onClick={() => editCustomer(customer)}
                    style={styles.buttonSecondary}
                  >
                    Bearbeiten
                  </ActionButton>
                  <ActionButton
                    onClick={() => deleteCustomer(customer.id)}
                    style={styles.buttonDanger}
                  >
                    Löschen
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderOffers = () => (
    <div style={{ display: "grid", gap: "24px" }}>
      <div style={styles.contentGrid}>
        <section style={styles.card}>
          <div style={styles.heroBox}>
            <div style={{ fontSize: "12px", opacity: 1, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
              Angebote & Leistungen
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
              Angebot erstellen
            </div>
            <div style={{ marginTop: "10px", color: "#475467", fontSize: "14px", lineHeight: 1.7, maxWidth: "560px" }}>
              Erstelle Angebote mit sauberem Leistungsaufbau, gesicherten Entwürfen und klarer Angebotsliste für die Weiterverarbeitung zu Rechnungen.
            </div>
          </div>

          <div style={styles.stack}>
            <div
              style={{
                border: "1px solid #e6ebf2",
                borderRadius: "18px",
                padding: "16px 18px",
                background: "#fcfdff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#5b6474", fontWeight: 700 }}>
                    Entwurfssicherung
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "14px", color: "#1f2937" }}>
                    {draftSyncMessage || "Änderungen werden automatisch lokal und – wenn verfügbar – in Supabase gesichert."}
                  </div>
                  {draftLastSavedAt ? (
                    <div style={{ marginTop: "6px", fontSize: "13px", color: "#667085" }}>
                      Zuletzt gesichert: {formatDateGerman(draftLastSavedAt)} {new Date(draftLastSavedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  ) : null}
                </div>
                <div style={{ alignSelf: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 700,
                      background:
                        draftSyncStatus === "saved"
                          ? "#ecfdf3"
                          : draftSyncStatus === "local-only"
                            ? "#fff7ed"
                            : draftSyncStatus === "error"
                              ? "#fef2f2"
                              : "#eff6ff",
                      color:
                        draftSyncStatus === "saved"
                          ? "#027a48"
                          : draftSyncStatus === "local-only"
                            ? "#b54708"
                            : draftSyncStatus === "error"
                              ? "#b42318"
                              : "#175cd3",
                    }}
                  >
                    {draftSyncStatus === "saved"
                      ? "Server + lokal"
                      : draftSyncStatus === "local-only"
                        ? "Nur lokal"
                        : draftSyncStatus === "error"
                          ? "Prüfen"
                          : "Autosave aktiv"}
                  </span>
                </div>
              </div>
              {!draftSchemaAvailable ? (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#5b6474", lineHeight: 1.6 }}>
                  Für serverseitige Entwürfe bitte in Supabase ausführen: <code>alter table offers add column if not exists status text default 'final';</code>
                </div>
              ) : null}
              {draftOffers.length > 0 ? (
                <div style={{ marginTop: "12px", fontSize: "13px", color: "#667085" }}>
                  Serverseitige Entwürfe vorhanden: <strong>{draftOffers.length}</strong>
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: "12px",
              }}
            >
              <div style={styles.customerDetailsBox}>
                <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#5b6474", fontWeight: 700, marginBottom: "10px" }}>
                  Kunde auswählen
                </div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  style={{ ...styles.input, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">Kunde auswählen</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #e8edf5" }}>
                  {selectedCustomer ? (
                    <>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>
                        {selectedCustomer.company_name}
                      </div>
                      {selectedCustomer.contact_person && <div>{selectedCustomer.contact_person}</div>}
                      {selectedCustomer.street && <div>{selectedCustomer.street}</div>}
                      {(selectedCustomer.zip || selectedCustomer.city) && (
                        <div>
                          {selectedCustomer.zip} {selectedCustomer.city}
                        </div>
                      )}
                      {selectedCustomer.email && <div>E-Mail: {selectedCustomer.email}</div>}
                      {selectedCustomer.phone && <div>Telefon: {selectedCustomer.phone}</div>}
                    </>
                  ) : (
                    <div style={{ color: "#667085" }}>Wähle hier direkt den Kunden für das Angebot aus.</div>
                  )}
                </div>
              </div>

              <div style={{ ...styles.customerDetailsBox, display: "grid", alignContent: "start", gap: "14px" }}>
                <div>
                  <label style={styles.smallLabel}>Angebots-Titel</label>
                  <input
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="z. B. Betreuung Ferienwohnung Mai"
                    style={styles.input}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <div style={{ padding: "14px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #e8edf5" }}>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#667085", fontWeight: 700 }}>Positionen</div>
                    <div style={{ marginTop: "8px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em" }}>{offerItems.length}</div>
                  </div>
                  <div style={{ padding: "14px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #e8edf5" }}>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#667085", fontWeight: 700 }}>Entwurfssumme</div>
                    <div style={{ marginTop: "8px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.03em" }}>{formatCurrency(offerPreviewTotal)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.templateManagerBox}>
              <h3 style={styles.sectionTitle}>Neue Leistungsvorlage speichern</h3>
              <div style={styles.helperText}>
                Hier legst du wiederverwendbare Leistungsbausteine an, die du später mit einem Klick in Angebote übernehmen kannst.
              </div>

              <div style={{ ...styles.stack, marginTop: "14px" }}>
                <div>
                  <label style={styles.smallLabel}>Vorlagen-Name</label>
                  <input
                    value={templateForm.name}
                    onChange={(e) => handleTemplateFormChange("name", e.target.value)}
                    placeholder="z. B. Kleinreparaturen"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.smallLabel}>Leistungsbeschreibung</label>
                  <input
                    value={templateForm.description}
                    onChange={(e) => handleTemplateFormChange("description", e.target.value)}
                    placeholder="z. B. Kleinreparaturen vor Ort"
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Standard-Menge</label>
                    <input
                      value={templateForm.quantity}
                      onChange={(e) => handleTemplateFormChange("quantity", e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Standard-Preis</label>
                    <input
                      value={templateForm.unitPrice}
                      onChange={(e) => handleTemplateFormChange("unitPrice", e.target.value)}
                      placeholder="0,00"
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <ActionButton onClick={saveServiceTemplate} style={styles.buttonPrimary}>
                    Leistungsvorlage speichern
                  </ActionButton>
                  <ActionButton onClick={resetTemplateForm} style={styles.buttonSecondary}>
                    Leeren
                  </ActionButton>
                </div>
              </div>
            </div>

            <div>
              <h3 style={styles.sectionTitle}>Gespeicherte Leistungsvorlagen</h3>

              {serviceTemplates.length === 0 ? (
                <div style={styles.mutedBox}>Noch keine Leistungsvorlagen vorhanden.</div>
              ) : (
                <div style={styles.templateGrid}>
                  {serviceTemplates.map((template) => (
                    <div key={template.id} style={styles.templateButton}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                        <div>
                          <strong>{template.name}</strong>
                          <div
                            style={{
                              marginTop: "6px",
                              color: "#5b6474",
                              fontSize: "13px",
                              lineHeight: 1.55,
                            }}
                          >
                            {template.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px", color: "#475467", fontSize: "13px" }}>
                        Menge: {template.quantity} · Preis: {formatCurrency(template.unit_price)}
                      </div>

                      <div style={{ ...styles.row, marginTop: "14px", justifyContent: "center" }}>
                        <ActionButton
                          onClick={() => addTemplateToOffer(template)}
                          style={styles.buttonPrimary}
                        >
                          In Angebot übernehmen
                        </ActionButton>
                        <ActionButton
                          onClick={() => deleteServiceTemplate(template.id)}
                          style={styles.buttonDanger}
                        >
                          Löschen
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 style={styles.sectionTitle}>Positionen im Angebot</h3>

              <div style={styles.stack}>
                {offerItems.map((item, index) => {
                  const lineTotal = item.quantity * item.unitPrice;

                  return (
                    <div key={item.id} style={styles.offerItemCard}>
                      <div style={styles.offerItemGrid}>
                        <div>
                          <label style={styles.smallLabel}>Beschreibung</label>
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateOfferItem(item.id, "description", e.target.value)
                            }
                            placeholder={`Position ${index + 1}`}
                            style={styles.input}
                          />
                        </div>

                        <div>
                          <label style={styles.smallLabel}>Menge</label>
                          <input
                            value={String(item.quantity)}
                            onChange={(e) =>
                              updateOfferItem(item.id, "quantity", e.target.value)
                            }
                            style={styles.input}
                          />
                        </div>

                        <div>
                          <label style={styles.smallLabel}>Einzelpreis</label>
                          <input
                            value={String(item.unitPrice)}
                            onChange={(e) =>
                              updateOfferItem(item.id, "unitPrice", e.target.value)
                            }
                            style={styles.input}
                          />
                        </div>

                        <ActionButton
                          onClick={() => removeOfferItem(item.id)}
                          style={styles.buttonSecondary}
                        >
                          Entfernen
                        </ActionButton>
                      </div>

                      <div style={{ marginTop: "12px", color: "#475467" }}>
                        Positionssumme: <strong>{formatCurrency(lineTotal)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.row}>
              <ActionButton onClick={addOfferItem} style={styles.buttonSecondary}>
                Weitere Position anlegen
              </ActionButton>
              <ActionButton onClick={resetOfferDraft} style={styles.buttonSecondary}>
                Entwurf leeren
              </ActionButton>
              <ActionButton onClick={addOffer} style={styles.buttonPrimary}>
                Angebot final speichern
              </ActionButton>
            </div>

            <div style={styles.totalBox}>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.72, marginBottom: "8px" }}>Angebotssumme</div>
              <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em" }}>{formatCurrency(offerPreviewTotal)}</div>
            </div>
          </div>
        </section>
      </div>

      <section style={{ ...styles.card, minWidth: 0, overflow: "hidden" }}>
        <h2 style={styles.cardTitle}>Angebotsliste</h2>

        {finalizedOffers.length === 0 ? (
          <p>Noch keine final gespeicherten Angebote vorhanden.</p>
        ) : (
          <div style={styles.bigList}>
            {finalizedOffers.map((offer) => (
              <div key={offer.id} style={styles.entityCard}>
                <div style={styles.entityHeader}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>{offer.title}</h3>
                    <div style={{ color: "#4b5563", fontSize: "14px" }}>
                      Kunde: <strong>{getCustomerDisplayName(offer.customer_id)}</strong>
                    </div>
                    <div style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>
                      Erstellt am: {formatDateGerman(offer.created_at)}
                    </div>
                  </div>

                  <div style={{ ...styles.row, justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                    <ActionButton
                      onClick={() => printOffer(offer)}
                      style={styles.buttonSecondary}
                    >
                      PDF / Drucken
                    </ActionButton>
                    <ActionButton
                      onClick={() => createInvoiceFromOffer(offer)}
                      style={styles.buttonPrimary}
                    >
                      Rechnung erstellen
                    </ActionButton>
                    <ActionButton
                      onClick={() => createJobFromOffer(offer)}
                      style={styles.buttonSecondary}
                    >
                      Auftrag anlegen
                    </ActionButton>
                    <ActionButton
                      onClick={() => {
                        const property = properties.find((entry) => entry.customer_id === offer.customer_id);
                        if (property) {
                          openPropertyWorkspace(property.id);
                        } else {
                          setPropertyForm((prev) => ({ ...EMPTY_PROPERTY_FORM, customerId: offer.customer_id, name: `${getCustomerDisplayName(offer.customer_id)} · Objekt` }));
                          setActiveTab("properties");
                        }
                      }}
                      style={styles.buttonGhost}
                    >
                      Objekt öffnen
                    </ActionButton>
                    <ActionButton
                      onClick={() => deleteOffer(offer.id)}
                      style={styles.buttonDanger}
                    >
                      Löschen
                    </ActionButton>
                  </div>
                </div>

                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Beschreibung</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>Menge</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>Einzelpreis</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>Summe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offer.items.map((item) => (
                        <tr key={item.id}>
                          <td style={styles.td}>{item.description}</td>
                          <td style={{ ...styles.td, textAlign: "right" }}>{item.quantity}</td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    marginTop: "14px",
                    textAlign: "right",
                    fontWeight: 800,
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Gesamt: {formatCurrency(getOfferTotal(offer))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderProperties = () => (
    <div style={styles.pageStack}>
      <div style={styles.layoutTwoCol}>
        <section style={styles.card}>
          <div style={styles.heroBox}>
            <div style={{ fontSize: "12px", opacity: 1, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Objekte & Betreuung</div>
            <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em" }}>Objekt anlegen</div>
            <div style={{ marginTop: "10px", color: "#475467", fontSize: "14px", lineHeight: 1.7, maxWidth: "560px" }}>Verknüpfe Kunden mit echten Objekten, hinterlege Zugangshinweise und halte Betreuungsumfang sauber strukturiert fest.</div>
          </div>

          <div style={styles.stack}>
            <div>
              <label style={styles.smallLabel}>Kunde</label>
              <select value={propertyForm.customerId} onChange={(e) => handlePropertyFormChange("customerId", e.target.value)} style={styles.input}>
                <option value="">Bitte Kunden auswählen</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.company_name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.smallLabel}>Objektname</label>
              <input value={propertyForm.name} onChange={(e) => handlePropertyFormChange("name", e.target.value)} placeholder="z. B. Apartment Warschauer Straße" style={styles.input} />
            </div>
            <div>
              <label style={styles.smallLabel}>Straße</label>
              <input value={propertyForm.street} onChange={(e) => handlePropertyFormChange("street", e.target.value)} placeholder="Straße / Hausnummer" style={styles.input} />
            </div>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.smallLabel}>PLZ</label>
                <input value={propertyForm.zip} onChange={(e) => handlePropertyFormChange("zip", e.target.value)} style={styles.input} />
              </div>
              <div style={{ flex: 2 }}>
                <label style={styles.smallLabel}>Stadt</label>
                <input value={propertyForm.city} onChange={(e) => handlePropertyFormChange("city", e.target.value)} style={styles.input} />
              </div>
              <div style={{ width: "120px" }}>
                <label style={styles.smallLabel}>Einheiten</label>
                <input value={propertyForm.units} onChange={(e) => handlePropertyFormChange("units", e.target.value)} style={styles.input} />
              </div>
            </div>
            <div>
              <label style={styles.smallLabel}>Zugang / Hinweise</label>
              <textarea value={propertyForm.accessNotes} onChange={(e) => handlePropertyFormChange("accessNotes", e.target.value)} placeholder="Schlüssel, Zugang, Ansprechpartner vor Ort" style={{ ...styles.input, minHeight: "96px" }} />
            </div>
            <div>
              <label style={styles.smallLabel}>Betreuungsumfang</label>
              <textarea value={propertyForm.serviceScope} onChange={(e) => handlePropertyFormChange("serviceScope", e.target.value)} placeholder="z. B. Turnover, Reinigung, Kleinreparaturen, Dienstleistersteuerung" style={{ ...styles.input, minHeight: "96px" }} />
            </div>
            <div style={styles.row}>
              <ActionButton onClick={saveProperty} style={styles.buttonPrimary}>Objekt speichern</ActionButton>
              <ActionButton onClick={resetPropertyForm} style={styles.buttonSecondary}>Leeren</ActionButton>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <h2 style={styles.cardTitle}>Objektakte</h2>
              <div style={styles.helperText}>Zentrale Übersicht für laufende Betreuung, Einsätze und Abrechnung.</div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              {selectedPropertyRecord ? <ActionButton onClick={() => startOfferForProperty(selectedPropertyRecord)} style={styles.buttonPrimary}>Angebot vorbereiten</ActionButton> : null}
              {selectedPropertyRecord ? <ActionButton onClick={() => { setActiveTab("operations"); setJobForm((prev) => ({ ...EMPTY_JOB_FORM, propertyId: selectedPropertyRecord.id, customerId: selectedPropertyRecord.customer_id, title: `${selectedPropertyRecord.name} · Einsatz`, scheduledFor: getTodayDate() })); }} style={styles.buttonGhost}>Auftrag vorbereiten</ActionButton> : null}
              <div style={{ minWidth: "260px" }}>
              <select value={selectedPropertyRecord?.id ?? ""} onChange={(e) => setSelectedPropertyId(e.target.value)} style={styles.input}>
                {properties.length === 0 ? <option value="">Noch keine Objekte</option> : null}
                {properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
              </select>
            </div>
          </div>
        </div>

          {selectedPropertyRecord ? (
            <div style={{ display: "grid", gap: "16px", marginTop: "18px" }}>
              <div style={{ ...styles.mutedBox, background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(237, 242, 255, 0.94) 100%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", fontWeight: 800 }}>Objektübersicht</div>
                    <div style={{ marginTop: "8px", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em" }}>{selectedPropertyRecord.name}</div>
                    <div style={{ marginTop: "6px", color: "#475467" }}>{getCustomerDisplayName(selectedPropertyRecord.customer_id)}</div>
                    <div style={{ marginTop: "6px", color: "#475467" }}>{[selectedPropertyRecord.street, `${selectedPropertyRecord.zip} ${selectedPropertyRecord.city}`.trim()].filter(Boolean).join(", ")}</div>
                  </div>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <span style={styles.badgeNeutral}>{selectedPropertyOpenJobs.length} offene Aufträge</span>
                    <span style={styles.badgeNeutral}>{selectedPropertyInvoices.length} Rechnungen beim Kunden</span>
                    <span style={styles.badgeNeutral}>{selectedPropertyUpdates.length} dokumentierte Updates</span>
                  </div>
                </div>
              </div>

              <div style={styles.financeTopGrid}>
                {renderStatCard("Einheiten", selectedPropertyRecord.units)}
                {renderStatCard("Offene Einsätze", selectedPropertyOpenJobs.length)}
                {renderStatCard("Letzte Aktivität", selectedPropertyUpdates[0] ? formatDateGerman(selectedPropertyUpdates[0].created_at) : "–")}
              </div>

              {selectedPropertyRecord.access_notes ? <div style={styles.mutedBox}><strong>Zugang / Hinweise</strong><div style={{ marginTop: "8px", color: "#475467", lineHeight: 1.7 }}>{selectedPropertyRecord.access_notes}</div></div> : null}
              {selectedPropertyRecord.service_scope ? <div style={styles.mutedBox}><strong>Leistungsbild</strong><div style={{ marginTop: "8px", color: "#475467", lineHeight: 1.7 }}>{selectedPropertyRecord.service_scope}</div></div> : null}

              <div style={{ display: "grid", gap: "12px" }}>
                <h3 style={styles.sectionTitle}>Nächste Einsätze</h3>
                {selectedPropertyNextJobs.length === 0 ? <div style={styles.mutedBox}>Noch keine Einsätze geplant.</div> : selectedPropertyNextJobs.map((job) => (
                  <div key={job.id} style={styles.listItem}>
                    <div>
                      <strong>{job.title}</strong>
                      <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>{formatDateGerman(job.scheduled_for)} · {getJobStatusLabel(job.status)}</div>
                    </div>
                    <span style={job.priority === "high" ? styles.badgeOpen : styles.badgeNeutral}>{getPriorityLabel(job.priority)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <h3 style={styles.sectionTitle}>Rechnungen zum Kunden</h3>
                {selectedPropertyInvoices.length === 0 ? <div style={styles.mutedBox}>Noch keine Rechnungen vorhanden.</div> : selectedPropertyInvoices.slice(0, 4).map((invoice) => (
                  <div key={invoice.id} style={styles.listItem}>
                    <div>
                      <strong>{invoice.invoice_number}</strong>
                      <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Fällig bis {formatDateGerman(invoice.due_date)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>{formatCurrency(Number(invoice.total))}</div>
                      <span style={invoice.status === "paid" ? styles.badgePaid : invoice.due_date < getTodayDate() ? styles.badgeOpen : styles.badgeNeutral}>{invoice.status === "paid" ? "Bezahlt" : invoice.due_date < getTodayDate() ? "Überfällig" : "Offen"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "18px" }} className="muted"><div style={styles.mutedBox}>Noch keine Objekte angelegt.</div></div>
          )}
        </section>
      </div>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Objektbestand</h2>
        {properties.length === 0 ? <p>Noch keine Objekte angelegt.</p> : (
          <div style={styles.bigList}>
            {properties.map((property) => (
              <div key={property.id} style={styles.entityCard}>
                <div style={styles.entityHeader}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>{property.name}</h3>
                    <div style={{ color: "#4b5563", fontSize: "14px" }}>{getCustomerDisplayName(property.customer_id)}</div>
                    <div style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>{[property.street, `${property.zip} ${property.city}`.trim()].filter(Boolean).join(", ")}</div>
                    <div style={{ marginTop: "8px" }}><span style={styles.badgeNeutral}>{property.units} Einheit{property.units === 1 ? "" : "en"}</span></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", color: "#667085" }}>{openJobs.filter((job) => job.property_id === property.id).length} offene Aufträge</div>
                    <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
                      <ActionButton onClick={() => setSelectedPropertyId(property.id)} style={styles.buttonSecondary}>Objektakte öffnen</ActionButton>
                      <ActionButton onClick={() => { setActiveTab("operations"); setJobForm((prev) => ({ ...EMPTY_JOB_FORM, propertyId: property.id, customerId: property.customer_id, title: `${property.name} · Betreuung`, scheduledFor: getTodayDate() })); }} style={styles.buttonGhost}>Auftrag vorbereiten</ActionButton>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "14px" }}>
                  <ActionButton onClick={() => deleteProperty(property.id)} style={styles.buttonDanger}>Objekt löschen</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderOperations = () => {
    const currentWeekJobs = jobsByDate.flatMap((entry) => entry.jobs);
    const openWeekJobs = currentWeekJobs.filter((job) => job.status !== "done").length;
    const doneWeekJobs = currentWeekJobs.filter((job) => job.status === "done").length;
    const populatedDays = jobsByDate.filter((entry) => entry.jobs.length > 0).length;

    return (
    <div style={styles.pageStack}>
      <section style={styles.card}>
        <div style={styles.calendarTopBar}>
          <div>
            <h2 style={styles.cardTitle}>Einsatzkalender</h2>
            <div style={styles.helperText}>Ruhige Agenda-Ansicht für die Einsatzplanung dieser Woche.</div>
          </div>
          <div style={styles.calendarToolbar}>
            <ActionButton onClick={() => setCalendarFocusDate(addDays(calendarFocusDate, -7))} style={styles.buttonSecondary}>← Vorige Woche</ActionButton>
            <ActionButton onClick={() => setCalendarFocusDate(getTodayDate())} style={styles.buttonGhost}>Heute</ActionButton>
            <ActionButton onClick={() => setCalendarFocusDate(addDays(calendarFocusDate, 7))} style={styles.buttonSecondary}>Nächste Woche →</ActionButton>
          </div>
        </div>

        <div style={styles.calendarSummaryBar}>
          <div style={styles.calendarSummaryItem}>
            <div style={styles.calendarSummaryLabel}>Woche</div>
            <div style={styles.calendarSummaryValue}>
              {formatDateGerman(jobsByDate[0]?.date || calendarFocusDate)} – {formatDateGerman(jobsByDate[jobsByDate.length - 1]?.date || calendarFocusDate)}
            </div>
          </div>
          <div style={styles.calendarSummaryItem}>
            <div style={styles.calendarSummaryLabel}>Geplante Einsätze</div>
            <div style={styles.calendarSummaryValue}>{currentWeekJobs.length}</div>
          </div>
          <div style={styles.calendarSummaryItem}>
            <div style={styles.calendarSummaryLabel}>Offen / in Arbeit</div>
            <div style={styles.calendarSummaryValue}>{openWeekJobs}</div>
          </div>
          <div style={styles.calendarSummaryItem}>
            <div style={styles.calendarSummaryLabel}>Tage mit Einsätzen</div>
            <div style={styles.calendarSummaryValue}>{populatedDays} / {jobsByDate.length}</div>
          </div>
          <div style={styles.calendarSummaryItem}>
            <div style={styles.calendarSummaryLabel}>Erledigt</div>
            <div style={styles.calendarSummaryValue}>{doneWeekJobs}</div>
          </div>
        </div>

        <div style={styles.calendarGrid}>
          {jobsByDate.map((entry) => {
            const isToday = entry.date === getTodayDate();

            return (
              <div key={entry.date} style={{ ...styles.calendarDayCard, borderColor: isToday ? "#a5b4fc" : "#e5e7eb", background: isToday ? "#f8faff" : "#ffffff" }}>
                <div style={styles.calendarDayHeader}>
                  <div>
                    <div style={styles.calendarDayLabel}>{getWeekdayLabel(entry.date)}</div>
                    <div style={styles.calendarDayDate}>{formatDateGerman(entry.date)}</div>
                  </div>

                  <div style={styles.calendarJobsList}>
                    {entry.jobs.length === 0 ? (
                      <div style={styles.calendarEmpty}>Keine Einsätze geplant</div>
                    ) : entry.jobs.map((job) => (
                      <div key={job.id} style={styles.calendarJobItem}>
                        <div style={styles.calendarJobTopRow}>
                          <div>
                            <div style={styles.calendarJobTitle}>{job.title}</div>
                            <div style={styles.calendarJobMeta}>{getPropertyDisplayName(job.property_id)}</div>
                          </div>
                          <span style={job.status === "done" ? styles.badgePaid : job.priority === "high" ? styles.badgeOpen : styles.badgeNeutral}>{getJobStatusLabel(job.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.calendarDayHeaderRight}>
                    {isToday ? <span style={styles.calendarTodayBadge}>Heute</span> : null}
                    <span style={styles.calendarCountBadge}>{entry.jobs.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div style={styles.layoutTwoCol}>
      <section style={styles.card}>
        <div style={styles.heroBox}>
          <div style={{ fontSize: "12px", opacity: 1, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Aufträge & Einsatzplanung</div>
          <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em" }}>Auftrag anlegen</div>
          <div style={{ marginTop: "10px", color: "#475467", fontSize: "14px", lineHeight: 1.7, maxWidth: "560px" }}>Plane operative Einsätze, setze Prioritäten und dokumentiere sauber, was vor Ort erledigt wurde.</div>
        </div>
        <div style={styles.stack}>
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>Objekt</label>
              <select value={jobForm.propertyId} onChange={(e) => { const property = properties.find((item) => item.id === e.target.value); setJobForm((prev) => ({ ...prev, propertyId: e.target.value, customerId: property?.customer_id ?? prev.customerId })); }} style={styles.input}>
                <option value="">Bitte Objekt auswählen</option>
                {properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
              </select>
            </div>
            <div style={{ width: "170px" }}>
              <label style={styles.smallLabel}>Kategorie</label>
              <select value={jobForm.category} onChange={(e) => handleJobFormChange("category", e.target.value)} style={styles.input}>
                <option value="betreuung">Betreuung</option>
                <option value="turnover">Turnover</option>
                <option value="reinigung">Reinigung</option>
                <option value="reparatur">Kleinreparatur</option>
                <option value="koordination">Koordination</option>
                <option value="sonstiges">Sonstiges</option>
              </select>
            </div>
          </div>
          <div>
            <label style={styles.smallLabel}>Auftragstitel</label>
            <input value={jobForm.title} onChange={(e) => handleJobFormChange("title", e.target.value)} placeholder="z. B. Turnover Donnerstag" style={styles.input} />
          </div>
          <div>
            <label style={styles.smallLabel}>Beschreibung</label>
            <textarea value={jobForm.description} onChange={(e) => handleJobFormChange("description", e.target.value)} placeholder="Leistungsumfang, Hinweise, offene Punkte" style={{ ...styles.input, minHeight: "110px" }} />
          </div>
          <div style={styles.row}>
            <div style={{ width: "170px" }}>
              <label style={styles.smallLabel}>Priorität</label>
              <select value={jobForm.priority} onChange={(e) => handleJobFormChange("priority", e.target.value)} style={styles.input}>
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>
            <div style={{ width: "190px" }}>
              <label style={styles.smallLabel}>Status</label>
              <select value={jobForm.status} onChange={(e) => handleJobFormChange("status", e.target.value)} style={styles.input}>
                <option value="open">Offen</option>
                <option value="planned">Geplant</option>
                <option value="in_progress">In Arbeit</option>
                <option value="done">Erledigt</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>Einsatzdatum</label>
              <input type="date" value={jobForm.scheduledFor} onChange={(e) => handleJobFormChange("scheduledFor", e.target.value)} style={styles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>Wiederholung</label>
              <select value={jobForm.recurrence} onChange={(e) => handleJobFormChange("recurrence", e.target.value)} style={styles.input}>
                <option value="once">Einmalig</option>
                <option value="weekly">Wöchentlich</option>
                <option value="monthly">Monatlich</option>
                <option value="after_checkout">Nach Check-out</option>
              </select>
            </div>
          </div>
          <div>
            <label style={styles.smallLabel}>Verantwortlich / Dienstleister</label>
            <input value={jobForm.assignee} onChange={(e) => handleJobFormChange("assignee", e.target.value)} placeholder="z. B. intern, Reinigungsteam, Hausmeister" style={styles.input} />
          </div>
          <div style={styles.row}>
            <ActionButton onClick={saveJob} style={styles.buttonPrimary}>Auftrag speichern</ActionButton>
            <ActionButton onClick={resetJobForm} style={styles.buttonSecondary}>Leeren</ActionButton>
          </div>

          <div style={{ ...styles.templateManagerBox, marginTop: "6px" }}>
            <h3 style={styles.sectionTitle}>Update / Dokumentation erfassen</h3>
            <div style={styles.helperText}>Erfasse kurze Notizen, Vor-Ort-Besuche, erledigte Arbeiten oder Links zu Fotos.</div>
            <div style={{ ...styles.stack, marginTop: "14px" }}>
              <div>
                <label style={styles.smallLabel}>Auftrag</label>
                <select value={jobUpdateForm.jobId} onChange={(e) => handleJobUpdateFormChange("jobId", e.target.value)} style={styles.input}>
                  <option value="">Bitte Auftrag auswählen</option>
                  {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                </select>
              </div>
              <div style={styles.row}>
                <div style={{ width: "180px" }}>
                  <label style={styles.smallLabel}>Typ</label>
                  <select value={jobUpdateForm.kind} onChange={(e) => handleJobUpdateFormChange("kind", e.target.value)} style={styles.input}>
                    <option value="note">Notiz</option>
                    <option value="visit">Vor-Ort-Besuch</option>
                    <option value="issue">Problem / Mangel</option>
                    <option value="done">Erledigt</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.smallLabel}>Foto-Links</label>
                  <textarea value={jobUpdateForm.photoUrls} onChange={(e) => handleJobUpdateFormChange("photoUrls", e.target.value)} placeholder="optional, mehrere Links mit Komma oder Zeilenumbruch" style={{ ...styles.input, minHeight: "84px" }} />
                </div>
              </div>
              <div>
                <label style={styles.smallLabel}>Fotos direkt anhängen</label>
                <input type="file" accept="image/*" multiple onChange={(e) => { void handleJobUpdatePhotoFiles(e.target.files); e.currentTarget.value = ""; }} style={styles.input} />
                {(Array.isArray(jobUpdateForm.localPhotoUrls) ? jobUpdateForm.localPhotoUrls : []).length > 0 ? (
                  <div style={styles.photoGrid}>
                    {(Array.isArray(jobUpdateForm.localPhotoUrls) ? jobUpdateForm.localPhotoUrls : []).map((url, index) => (
                      <div key={url + index} style={styles.photoThumbWrap}>
                        <img src={url} alt={`Dokumentation ${index + 1}`} style={styles.photoThumb} />
                        <button type="button" onClick={() => setJobUpdateForm((prev) => ({ ...prev, localPhotoUrls: (Array.isArray(prev.localPhotoUrls) ? prev.localPhotoUrls : []).filter((_, itemIndex) => itemIndex !== index) }))} style={styles.photoRemoveButton}>×</button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <label style={styles.smallLabel}>Notiz</label>
                <textarea value={jobUpdateForm.note} onChange={(e) => handleJobUpdateFormChange("note", e.target.value)} placeholder="z. B. Turnover abgeschlossen, Schlüssel übergeben, Mangel dokumentiert" style={{ ...styles.input, minHeight: "100px" }} />
              </div>
              <div style={styles.row}>
                <ActionButton onClick={saveJobUpdate} style={styles.buttonPrimary}>Update speichern</ActionButton>
                <ActionButton onClick={resetJobUpdateForm} style={styles.buttonSecondary}>Leeren</ActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Auftragsboard</h2>
        {jobs.length === 0 ? <p>Noch keine Aufträge vorhanden.</p> : (
          <div style={styles.bigList}>
            {jobs.map((job) => {
              const latestUpdate = latestJobUpdatesByJobId.get(job.id);
              return (
                <div key={job.id} style={styles.entityCard}>
                  <div style={styles.entityHeader}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>{job.title}</h3>
                      <div style={{ color: "#4b5563", fontSize: "14px" }}>{getPropertyDisplayName(job.property_id)} · {formatDateGerman(job.scheduled_for)}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                        <span style={job.status === "done" ? styles.badgePaid : job.priority === "high" ? styles.badgeOpen : styles.badgeNeutral}>{getJobStatusLabel(job.status)}</span>
                        <span style={styles.badgeNeutral}>{getPriorityLabel(job.priority)}</span>
                        <span style={styles.badgeNeutral}>{job.recurrence === "once" ? "Einmalig" : job.recurrence === "weekly" ? "Wöchentlich" : job.recurrence === "monthly" ? "Monatlich" : "Nach Check-out"}</span>
                      </div>
                    </div>
                    <div style={{ ...styles.row, justifyContent: "flex-end" }}>
                      <ActionButton onClick={() => openPropertyWorkspace(job.property_id)} style={styles.buttonGhost}>Objektakte</ActionButton>
                      <ActionButton onClick={() => prepareInvoiceFromJob(job)} style={styles.buttonSecondary}>Rechnung vorbereiten</ActionButton>
                      <ActionButton onClick={() => updateJobStatus(job.id, "planned")} style={styles.buttonSecondary}>Geplant</ActionButton>
                      <ActionButton onClick={() => updateJobStatus(job.id, "in_progress")} style={styles.buttonSecondary}>In Arbeit</ActionButton>
                      <ActionButton onClick={() => updateJobStatus(job.id, "done")} style={styles.buttonPrimary}>Erledigt</ActionButton>
                      <ActionButton onClick={() => deleteJob(job.id)} style={styles.buttonDanger}>Löschen</ActionButton>
                    </div>
                  </div>
                  {job.description ? <div style={{ ...styles.mutedBox, marginTop: "14px", color: "#475467", lineHeight: 1.7 }}>{job.description}</div> : null}
                  {latestUpdate ? <div style={{ ...styles.mutedBox, marginTop: "14px" }}><strong>Letztes Update</strong><div style={{ marginTop: "8px", color: "#475467", lineHeight: 1.7 }}>{latestUpdate.note}</div><div style={{ marginTop: "8px", color: "#667085", fontSize: "13px" }}>{formatDateGerman(latestUpdate.created_at)} · {latestUpdate.kind}</div>{Array.isArray(latestUpdate.photo_urls) && latestUpdate.photo_urls.length > 0 ? <div style={{ ...styles.photoGrid, marginTop: "14px" }}>{latestUpdate.photo_urls.map((url, index) => <a key={url + index} href={url} target="_blank" rel="noreferrer" style={styles.photoThumbLink}><img src={url} alt={`Dokumentation ${index + 1}`} style={styles.photoThumb} /></a>)}</div> : null}</div> : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
      </div>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Foto-Dokumentation</h2>
        <div style={styles.helperText}>Die letzten Bildnachweise aus Einsätzen, Turnovern und Vor-Ort-Updates.</div>
        {recentPhotoUpdates.length === 0 ? <p style={{ marginTop: "16px" }}>Noch keine Fotos dokumentiert.</p> : (
          <div style={{ ...styles.bigList, marginTop: "18px" }}>
            {recentPhotoUpdates.map((update) => {
              const job = jobs.find((entry) => entry.id === update.job_id);
              return (
                <div key={update.id} style={styles.entityCard}>
                  <div style={styles.entityHeader}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "20px" }}>{job?.title ?? "Auftrag"}</h3>
                      <div style={{ color: "#667085", fontSize: "13px", marginTop: "6px" }}>{formatDateGerman(update.created_at)} · {update.kind}</div>
                    </div>
                    <span style={styles.badgeNeutral}>{Array.isArray(update.photo_urls) ? update.photo_urls.length : 0} Foto{(Array.isArray(update.photo_urls) ? update.photo_urls.length : 0) === 1 ? "" : "s"}</span>
                  </div>
                  <div style={{ marginTop: "12px", color: "#475467", lineHeight: 1.7 }}>{update.note}</div>
                  <div style={{ ...styles.photoGrid, marginTop: "14px" }}>
                    {(Array.isArray(update.photo_urls) ? update.photo_urls : []).map((url, index) => (
                      <a key={url + index} href={url} target="_blank" rel="noreferrer" style={styles.photoThumbLink}>
                        <img src={url} alt={`Dokumentation ${index + 1}`} style={styles.photoThumb} />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
  };

  const renderLeads = () => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    const leadsByStatus = {
      new: safeLeads.filter((lead) => lead.status === "new").length,
      qualified: safeLeads.filter((lead) => lead.status === "qualified").length,
      offered: safeLeads.filter((lead) => lead.status === "offered").length,
      won: safeLeads.filter((lead) => lead.status === "won").length,
      lost: safeLeads.filter((lead) => lead.status === "lost").length,
    };

    const normalizedQuery = leadSearch.trim().toLowerCase();
    const filteredLeads = safeLeads.filter((lead) => {
      if (leadStatusFilter !== "all" && lead.status !== leadStatusFilter) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        lead.company,
        lead.name,
        lead.email,
        lead.phone,
        lead.location,
        lead.property_type,
        lead.notes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    return (
      <>
        <div style={styles.pageStack}>
          <section style={styles.card}>
            <div style={styles.heroBox}>
              <div style={{ fontSize: "12px", opacity: 1, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>Anfragen & Website-Leads</div>
              <div style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em" }}>Lead-Cockpit</div>
              <div style={{ marginTop: "10px", color: "#475467", fontSize: "14px", lineHeight: 1.7, maxWidth: "640px" }}>Alle Website-Anfragen, E-Mail-Leads und manuell erfassten Chancen laufen hier zusammen. Von hier aus qualifizierst du Leads, bereitest Kunden vor und führst sie direkt in Angebote und Objekte über.</div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}><span style={styles.statLabel}>Alle Leads</span><strong style={styles.statValue}>{safeLeads.length}</strong></div>
              <div style={styles.statCard}><span style={styles.statLabel}>Neu</span><strong style={styles.statValue}>{leadsByStatus.new}</strong></div>
              <div style={styles.statCard}><span style={styles.statLabel}>Qualifiziert</span><strong style={styles.statValue}>{leadsByStatus.qualified}</strong></div>
              <div style={styles.statCard}><span style={styles.statLabel}>Angebot gesendet</span><strong style={styles.statValue}>{leadsByStatus.offered}</strong></div>
              <div style={styles.statCard}><span style={styles.statLabel}>Gewonnen</span><strong style={styles.statValue}>{leadsByStatus.won}</strong></div>
            </div>
          </section>

          <div style={styles.layoutTwoCol}>
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Lead erfassen</h2>
              <div style={styles.stack}>
                <div style={styles.row}>
                  <div style={{ width: "180px" }}>
                    <label style={styles.smallLabel}>Quelle</label>
                    <select value={leadForm.source} onChange={(e) => handleLeadFormChange("source", e.target.value)} style={styles.input}>
                      <option value="website">Website</option>
                      <option value="email">E-Mail</option>
                      <option value="phone">Telefon</option>
                      <option value="manual">Manuell</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Status</label>
                    <select value={leadForm.status} onChange={(e) => handleLeadFormChange("status", e.target.value)} style={styles.input}>
                      {LEAD_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Name</label>
                    <input value={leadForm.name} onChange={(e) => handleLeadFormChange("name", e.target.value)} placeholder="Ansprechpartner" style={styles.input} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Firma</label>
                    <input value={leadForm.company} onChange={(e) => handleLeadFormChange("company", e.target.value)} placeholder="Eigentümer / Betreiber / Verwaltung" style={styles.input} />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>E-Mail</label>
                    <input value={leadForm.email} onChange={(e) => handleLeadFormChange("email", e.target.value)} style={styles.input} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Telefon</label>
                    <input value={leadForm.phone} onChange={(e) => handleLeadFormChange("phone", e.target.value)} style={styles.input} />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Objektart</label>
                    <input value={leadForm.propertyType} onChange={(e) => handleLeadFormChange("propertyType", e.target.value)} placeholder="z. B. Ferienwohnung" style={styles.input} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.smallLabel}>Standort</label>
                    <input value={leadForm.location} onChange={(e) => handleLeadFormChange("location", e.target.value)} placeholder="z. B. Berlin Friedrichshain" style={styles.input} />
                  </div>
                </div>
                <div>
                  <label style={styles.smallLabel}>Bedarf / Notiz</label>
                  <textarea value={leadForm.notes} onChange={(e) => handleLeadFormChange("notes", e.target.value)} placeholder="Kurzbeschreibung der Anfrage, gewünschte Leistungen, Häufigkeit" style={{ ...styles.input, minHeight: "120px" }} />
                </div>
                <div style={styles.row}>
                  <ActionButton onClick={saveLead} style={styles.buttonPrimary}>Lead speichern</ActionButton>
                  <ActionButton onClick={resetLeadForm} style={styles.buttonSecondary}>Leeren</ActionButton>
                </div>
              </div>
            </section>

            <section style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <h2 style={styles.cardTitle}>Lead-Pipeline</h2>
                  <div style={{ color: "#475467", fontSize: "14px", marginTop: "-4px" }}>Suche, Filter und ein geführter Status-Workflow halten den Tab stabil und schneller bedienbar.</div>
                </div>
                <div style={{ color: "#475467", fontSize: "14px", fontWeight: 600 }}>
                  {filteredLeads.length} von {safeLeads.length} Leads sichtbar
                </div>
              </div>

              <div style={{ ...styles.row, marginBottom: "18px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <label style={styles.smallLabel}>Suche</label>
                  <input
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Suche nach Name, Firma, E-Mail, Telefon, Ort ..."
                    style={styles.input}
                  />
                </div>
                <div style={{ width: "240px" }}>
                  <label style={styles.smallLabel}>Status-Filter</label>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as LeadRecord["status"] | "all")}
                    style={styles.input}
                  >
                    <option value="all">Alle Status</option>
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div style={styles.mutedBox}>
                  {safeLeads.length === 0 ? "Noch keine Leads vorhanden." : "Für den aktuellen Filter wurden keine Leads gefunden."}
                </div>
              ) : (
                <div style={styles.bigList}>
                  {filteredLeads.map((lead) => {
                    const nextStatuses = getNextLeadStatuses(lead.status);
                    const isBusy = leadStatusBusyId === lead.id;
                    const leadTitle = lead.company || lead.name || "Unbenannter Lead";

                    return (
                      <div key={lead.id} style={{ ...styles.entityCard, gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                          <div>
                            <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>{leadTitle}</h3>
                            <div style={{ color: "#4b5563", fontSize: "14px" }}>{lead.name || "Kein Ansprechpartner"}</div>
                            <div style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>{lead.email || "Keine E-Mail"}{lead.phone ? ` · ${lead.phone}` : ""}</div>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <span style={styles.badgeNeutral}>{lead.source}</span>
                            <span style={getLeadStatusTone(lead.status)}>{getLeadStatusLabel(lead.status)}</span>
                            {lead.property_type ? <span style={styles.badgeNeutral}>{lead.property_type}</span> : null}
                            {lead.location ? <span style={styles.badgeNeutral}>{lead.location}</span> : null}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                          <div style={styles.mutedBox}><strong>Quelle</strong><div style={{ marginTop: "6px" }}>{lead.source}</div></div>
                          <div style={styles.mutedBox}><strong>Status</strong><div style={{ marginTop: "6px" }}>{getLeadStatusLabel(lead.status)}</div></div>
                          <div style={styles.mutedBox}><strong>Kontakt</strong><div style={{ marginTop: "6px" }}>{lead.email || "-"}</div><div>{lead.phone || "-"}</div></div>
                          <div style={styles.mutedBox}><strong>Eingang</strong><div style={{ marginTop: "6px" }}>{formatDateGerman(lead.created_at)}</div></div>
                        </div>

                        <div style={{ ...styles.mutedBox, color: "#475467", lineHeight: 1.7 }}>
                          <strong style={{ display: "block", marginBottom: "6px" }}>Anfrage / Bedarf</strong>
                          {lead.notes || "Keine zusätzliche Beschreibung vorhanden."}
                        </div>

                        <div style={{ ...styles.mutedBox, display: "grid", gap: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                            <div>
                              <strong>Nächster Schritt</strong>
                              <div style={{ color: "#475467", fontSize: "14px", marginTop: "4px" }}>
                                {nextStatuses.length > 0 ? "Statuswechsel nur entlang der Pipeline." : "Lead ist in einem Endstatus angekommen."}
                              </div>
                            </div>
                            {isBusy ? <span style={styles.badgeNeutral}>Status wird gespeichert ...</span> : null}
                          </div>

                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                            <select
                              value=""
                              onChange={(e) => {
                                const nextStatus = e.target.value as LeadRecord["status"];
                                if (nextStatus) advanceLeadStatus(lead.id, nextStatus);
                              }}
                              style={{ ...styles.input, maxWidth: "280px", background: "#fff" }}
                              disabled={nextStatuses.length === 0 || isBusy}
                            >
                              <option value="">Status ändern ...</option>
                              {nextStatuses.map((status) => (
                                <option key={status} value={status}>{getLeadStatusLabel(status)}</option>
                              ))}
                            </select>

                            <ActionButton
                              onClick={() => {
                                setCustomerForm({
                                  companyName: lead.company || lead.name,
                                  contactPerson: lead.name,
                                  email: lead.email,
                                  phone: lead.phone,
                                  street: "",
                                  zip: "",
                                  city: lead.location,
                                });
                                setActiveTab("customers");
                              }}
                              style={styles.buttonGhost}
                            >
                              Kunde vorbereiten
                            </ActionButton>
                            <ActionButton onClick={() => convertLeadToCustomerAndProperty(lead)} style={styles.buttonPrimary}>
                              In Kunde überführen
                            </ActionButton>
                            <ActionButton onClick={() => requestLeadDelete(lead)} style={styles.buttonDanger}>
                              Löschen
                            </ActionButton>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        {leadDeleteTarget ? (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                background: "#ffffff",
                borderRadius: "24px",
                padding: "16px",
                boxShadow: "0 30px 80px rgba(15, 23, 42, 0.25)",
                display: "grid",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b42318", marginBottom: "10px" }}>
                  Lead löschen
                </div>
                <h3 style={{ margin: 0, fontSize: "24px" }}>
                  Wirklich „{leadDeleteTarget.company || leadDeleteTarget.name || "diesen Lead"}“ löschen?
                </h3>
                <p style={{ margin: "12px 0 0 0", color: "#475467", lineHeight: 1.7 }}>
                  Der Lead wird aus der Oberfläche entfernt und — falls vorhanden — auch in Supabase gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
              </div>

              <div style={{ ...styles.mutedBox, color: "#475467" }}>
                <strong>Kontakt</strong>
                <div style={{ marginTop: "6px" }}>{leadDeleteTarget.email || "Keine E-Mail"}{leadDeleteTarget.phone ? ` · ${leadDeleteTarget.phone}` : ""}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
                <ActionButton onClick={closeLeadDeleteModal} style={styles.buttonSecondary} disabled={leadDeleteBusy}>
                  Abbrechen
                </ActionButton>
                <ActionButton onClick={confirmLeadDelete} style={styles.buttonDanger} disabled={leadDeleteBusy}>
                  {leadDeleteBusy ? "Lösche ..." : "Endgültig löschen"}
                </ActionButton>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };

  const renderInvoices = () => (
    <section style={styles.card}>
      <h2 style={styles.cardTitle}>Rechnungen</h2>

      <div style={{ marginBottom: "14px", color: "#4b5563" }}>
        Nächste Rechnungsnummer: <strong>{nextInvoiceNumber}</strong>
      </div>

      {invoices.length === 0 ? (
        <p>Noch keine Rechnungen vorhanden.</p>
      ) : (
        <div style={styles.bigList}>
          {invoices.map((invoice) => (
            <div key={invoice.id} style={styles.entityCard}>
              <div style={styles.entityHeader}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>
                    Rechnung {invoice.invoice_number}
                  </h3>
                  <div style={{ color: "#4b5563", fontSize: "14px" }}>
                    Kunde: <strong>{getCustomerDisplayName(invoice.customer_id)}</strong>
                  </div>
                  <div style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>
                    Rechnungsdatum: {formatDateGerman(invoice.issued_at)}
                  </div>
                  <div style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>
                    Fälligkeitsdatum: {formatDateGerman(invoice.due_date)}
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {invoice.status === "paid" ? (
                      <span style={styles.badgePaid}>Bezahlt</span>
                    ) : (
                      <span style={styles.badgeOpen}>Offen</span>
                    )}
                  </div>
                </div>

                <div style={styles.row}>
                  {invoice.status === "open" && (
                    <ActionButton
                      onClick={() => markInvoiceAsPaid(invoice)}
                      style={styles.buttonPrimary}
                    >
                      Als bezahlt markieren
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={() => printInvoice(invoice)}
                    style={styles.buttonSecondary}
                  >
                    PDF / Drucken
                  </ActionButton>
                  <ActionButton
                    onClick={() => deleteInvoice(invoice.id)}
                    style={styles.buttonDanger}
                  >
                    Löschen
                  </ActionButton>
                </div>
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Beschreibung</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Menge</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Einzelpreis</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Summe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td style={styles.td}>{item.description}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>{item.quantity}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  textAlign: "right",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                Gesamt: {formatCurrency(Number(invoice.total))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderFinance = () => (
    <div style={styles.layoutTwoCol}>
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Finanzen</h2>

        <div style={styles.financeTopGrid}>
          {renderStatCard("Gesamteinnahmen", formatCurrency(totalIncome))}
          {renderStatCard("Gesamtausgaben", formatCurrency(totalExpense))}
          {renderStatCard("Gewinn", formatCurrency(profit))}
        </div>

        <div style={{ ...styles.financeTopGrid, marginTop: "14px" }}>
          {renderStatCard("Offene Summe", formatCurrency(openInvoiceTotal))}
          {renderStatCard("Überfällige Summe", formatCurrency(overdueInvoiceTotal))}
          {renderStatCard("Bezahlt diesen Monat", formatCurrency(paidThisMonth))}
        </div>

        <div style={{ ...styles.mutedBox, marginTop: "18px" }}>
          <strong>Offene Posten</strong>
          <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
            {openInvoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} style={styles.listItem}>
                <div>
                  <strong>{invoice.invoice_number}</strong>
                  <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                    {getCustomerDisplayName(invoice.customer_id)} · fällig bis {formatDateGerman(invoice.due_date)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(Number(invoice.total))}</div>
                  <span style={invoice.due_date < getTodayDate() ? styles.badgeOpen : styles.badgeNeutral}>{invoice.due_date < getTodayDate() ? "Überfällig" : "Offen"}</span>
                </div>
              </div>
            ))}
            {openInvoices.length === 0 ? <div style={{ color: "#475467" }}>Keine offenen Rechnungen vorhanden.</div> : null}
          </div>
        </div>

        <div style={styles.stack}>
          <div style={styles.mutedBox}>
            <strong>Automatische Einnahmen</strong>
            <div style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.6 }}>
              Sobald eine Rechnung auf <strong>bezahlt</strong> gesetzt wird, erzeugt die App automatisch einen Einnahme-Eintrag.
            </div>
          </div>

          <div>
            <h3 style={styles.sectionTitle}>Manuelle Buchung hinzufügen</h3>
          </div>

          <div>
            <label style={styles.smallLabel}>Typ</label>
            <select
              value={transactionForm.type}
              onChange={(e) =>
                handleTransactionFormChange(
                  "type",
                  e.target.value as "income" | "expense"
                )
              }
              style={styles.input}
            >
              <option value="income">Einnahme</option>
              <option value="expense">Ausgabe</option>
            </select>
          </div>

          <div>
            <label style={styles.smallLabel}>Titel</label>
            <input
              value={transactionForm.title}
              onChange={(e) => handleTransactionFormChange("title", e.target.value)}
              placeholder="z. B. Büromaterial oder Barzahlung"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>Betrag</label>
              <input
                value={transactionForm.amount}
                onChange={(e) => handleTransactionFormChange("amount", e.target.value)}
                placeholder="0,00"
                style={styles.input}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.smallLabel}>Datum</label>
              <input
                type="date"
                value={transactionForm.date}
                onChange={(e) => handleTransactionFormChange("date", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.mutedBox}>
            <strong>PDF-Beleg optional</strong>
            <div style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.5 }}>
              Lade z. B. Quittungen, Eingangsrechnungen oder Zahlungsnachweise als PDF hoch.
            </div>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setTransactionReceiptFile(e.currentTarget.files?.[0] ?? null)}
              style={{ ...styles.input, marginTop: "10px", padding: "12px" }}
            />
            {transactionReceiptFile ? (
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#334155" }}>
                Ausgewaehlt: <strong>{transactionReceiptFile.name}</strong>
              </div>
            ) : null}
          </div>

          {financeStorageMessage ? (
            <div style={{ ...styles.mutedBox, borderColor: "#f59e0b", color: "#92400e" }}>
              {financeStorageMessage}
            </div>
          ) : null}

          <div style={styles.row}>
            <ActionButton onClick={addManualTransaction} style={styles.buttonPrimary}>
              Buchung speichern
            </ActionButton>
            <ActionButton onClick={resetTransactionForm} style={styles.buttonSecondary}>
              Zurücksetzen
            </ActionButton>
          </div>
        </div>
      </section>

      <div style={styles.contentGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Einnahmen</h2>

          {sortedIncomeTransactions.length === 0 ? (
            <p>Noch keine Einnahmen vorhanden.</p>
          ) : (
            <div style={styles.bigList}>
              {sortedIncomeTransactions.map((transaction) => (
                <div key={transaction.id} style={styles.entityCard}>
                  <div style={styles.entityHeader}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0" }}>{transaction.title}</h3>
                      <div style={{ color: "#4b5563", fontSize: "14px" }}>
                        Datum: {formatDateGerman(transaction.booking_date)}
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        {transaction.invoice_id ? (
                          <span style={styles.badgeNeutral}>Automatisch aus Rechnung</span>
                        ) : (
                          <span style={styles.badgePaid}>Manuell</span>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "18px" }}>
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                      {!transaction.invoice_id && (
                        <div style={{ marginTop: "10px" }}>
                          <ActionButton
                            onClick={() => deleteTransaction(transaction.id)}
                            style={styles.buttonDanger}
                          >
                            Löschen
                          </ActionButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Ausgaben</h2>

          {sortedExpenseTransactions.length === 0 ? (
            <p>Noch keine Ausgaben vorhanden.</p>
          ) : (
            <div style={styles.bigList}>
              {sortedExpenseTransactions.map((transaction) => (
                <div key={transaction.id} style={styles.entityCard}>
                  <div style={styles.entityHeader}>
                    <div>
                      <h3 style={{ margin: "0 0 6px 0" }}>{transaction.title}</h3>
                      <div style={{ color: "#4b5563", fontSize: "14px" }}>
                        Datum: {formatDateGerman(transaction.booking_date)}
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <span style={styles.badgeOpen}>Ausgabe</span>
                      </div>

                      <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                        {(financeDocuments[transaction.id] ?? []).length > 0 ? (
                          (financeDocuments[transaction.id] ?? []).map((document) => (
                            <button
                              key={document.path}
                              type="button"
                              onClick={() => openFinanceDocument(document)}
                              style={{
                                border: "1px solid #dbe3ef",
                                background: "#f8fafc",
                                borderRadius: "12px",
                                padding: "10px 12px",
                                textAlign: "left",
                                color: "#1e293b",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              PDF oeffnen · {document.name}
                            </button>
                          ))
                        ) : (
                          <span style={{ color: "#64748b", fontSize: "14px" }}>Noch kein PDF-Beleg hinterlegt.</span>
                        )}

                        <label style={{ ...styles.buttonSecondary, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          PDF hochladen
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            style={{ display: "none" }}
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              event.currentTarget.value = "";
                              handleExistingTransactionPdfUpload(transaction.id, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: "18px" }}>
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <ActionButton
                          onClick={() => deleteTransaction(transaction.id)}
                          style={styles.buttonDanger}
                        >
                          Löschen
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );

  if (!authReady) {
    return (
      <div style={{ minHeight: "100vh", padding: 24, background: "#f4f7fb" }}>
        Lade Anmeldung...
      </div>
    );
  }

  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(119, 91, 255, 0.16) 0%, rgba(79, 70, 229, 0.08) 18%, rgba(255,255,255,0) 40%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.16) 0%, rgba(14, 165, 233, 0.08) 20%, rgba(255,255,255,0) 42%), linear-gradient(180deg, #f4f7fb 0%, #eef2f7 100%)",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 460,
            margin: "80px auto",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 28,
            fontFamily: "Inter, Arial, sans-serif",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#3730a3",
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            Averio Login
          </div>

          <h1 style={{ marginTop: 0, fontSize: 48, lineHeight: 1.02 }}>
            {authMode === "login" ? "Anmelden" : "Registrieren"}
          </h1>

          <p style={{ color: "#5b6474", margin: "0 0 18px 0", lineHeight: 1.6 }}>
            Melde dich an, um Kunden, Angebote, Rechnungen und Finanzen sicher in Supabase zu verwalten.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <input
              type="email"
              placeholder="E-Mail"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              style={{ padding: 14, borderRadius: 14, border: "1px solid #d1d5db" }}
            />

            <input
              type="password"
              placeholder="Passwort"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              style={{ padding: 14, borderRadius: 14, border: "1px solid #d1d5db" }}
            />

            <ActionButton
              onClick={handleAuthSubmit}
              style={{
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(17, 24, 39, 0.18)",
              }}
              disabled={authLoading}
            >
              {authLoading
                ? "Bitte warten..."
                : authMode === "login"
                ? "Einloggen"
                : "Konto anlegen"}
            </ActionButton>

            <ActionButton
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              style={{
                padding: "14px",
                borderRadius: "14px",
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Wechsel zu {authMode === "login" ? "Registrieren" : "Login"}
            </ActionButton>

            {authError ? <div style={{ color: "#b91c1c" }}>{authError}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.brandBadge}>Property Service Studio</div>
            <h1 style={styles.title}>{COMPANY_PROFILE.name}</h1>
            <p style={styles.subtitle}>
              Zentrale Übersicht für Kunden, Aufträge, Rechnungen und Leads – reduziert, klarer und mit mehr Fokus auf die wichtigsten Aktionen.
            </p>
            <div style={{ ...styles.row, marginTop: "14px" }}>
              <span style={styles.glowPill}>Draft Autosave aktiv</span>
              {lastBackupAt ? (
                <span style={styles.softPill}>
                  Letztes Voll-Backup {formatDateGerman(lastBackupAt)} · {new Date(lastBackupAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                </span>
              ) : null}
            </div>
          </div>

          <div className="averio-desktop-backup-actions" style={{ ...styles.row, justifyContent: "flex-start" }}>
            <ActionButton onClick={exportFullBackup} style={styles.buttonAccent}>
              Backup exportieren
            </ActionButton>
            <ActionButton onClick={downloadLatestLocalBackup} style={styles.buttonSecondary}>
              Letztes Backup laden
            </ActionButton>
            <ActionButton onClick={resetAllData} style={styles.buttonSecondary}>
              Alle Daten zurücksetzen
            </ActionButton>
            <ActionButton onClick={signOut} style={styles.buttonSecondary}>
              Logout
            </ActionButton>
          </div>
        </div>

        <div className="averio-mobile-top-actions">
          <ActionButton onClick={exportFullBackup} style={styles.buttonAccent}>Backup</ActionButton>
          <ActionButton onClick={downloadLatestLocalBackup} style={styles.buttonSecondary}>Backup laden</ActionButton>
          <ActionButton onClick={resetAllData} style={styles.buttonSecondary}>Reset</ActionButton>
          <ActionButton onClick={signOut} style={styles.buttonSecondary}>Logout</ActionButton>
        </div>

        {appError && (
          <div
            style={{
              marginBottom: 20,
              padding: 14,
              borderRadius: 16,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
            }}
          >
            {appError}
          </div>
        )}

        {loadingData ? (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Daten werden geladen...</h2>
          </section>
        ) : (
          <>
            <div style={styles.topGrid}>
              {renderStatCard("Kunden", customers.length)}
              {renderStatCard("Angebote", offers.length)}
              {renderStatCard("Offene Rechnungen", formatCurrency(openInvoiceTotal))}
              {renderStatCard("Gewinn", formatCurrency(profit))}
            </div>

            <div className="averio-desktop-tabs" style={styles.tabs}>
              <button
                onClick={() => setActiveTab("dashboard")}
                style={activeTab === "dashboard" ? styles.activeTabButton : styles.tabButton}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                style={activeTab === "customers" ? styles.activeTabButton : styles.tabButton}
              >
                Kunden
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                style={activeTab === "properties" ? styles.activeTabButton : styles.tabButton}
              >
                Objekte
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                style={activeTab === "offers" ? styles.activeTabButton : styles.tabButton}
              >
                Angebote
              </button>
              <button
                onClick={() => setActiveTab("operations")}
                style={activeTab === "operations" ? styles.activeTabButton : styles.tabButton}
              >
                Aufträge
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                style={activeTab === "invoices" ? styles.activeTabButton : styles.tabButton}
              >
                Rechnungen
              </button>
              <button
                onClick={() => setActiveTab("finance")}
                style={activeTab === "finance" ? styles.activeTabButton : styles.tabButton}
              >
                Finanzen
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                style={activeTab === "leads" ? styles.activeTabButton : styles.tabButton}
              >
                Leads
              </button>
            </div>

            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "customers" && renderCustomers()}
            {activeTab === "properties" && renderProperties()}
            {activeTab === "offers" && renderOffers()}
            {activeTab === "operations" && renderOperations()}
            {activeTab === "invoices" && renderInvoices()}
            {activeTab === "finance" && renderFinance()}
            {activeTab === "leads" && renderLeads()}
          </>
        )}
      </div>
    </div>

    <nav className="averio-mobile-nav" aria-label="Mobile Hauptnavigation">
      {[
        { key: "dashboard", icon: "⌂", label: "Home" },
        { key: "customers", icon: "👤", label: "Kunden" },
        { key: "properties", icon: "🏠", label: "Objekte" },
        { key: "offers", icon: "€", label: "Angebote" },
        { key: "operations", icon: "✓", label: "Aufträge" },
        { key: "invoices", icon: "□", label: "Rechnungen" },
        { key: "finance", icon: "↗", label: "Finanzen" },
        { key: "leads", icon: "◆", label: "Leads" },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          data-active={activeTab === item.key}
          onClick={() => setActiveTab(item.key as TabKey)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
    </>
  );
}

export default App;