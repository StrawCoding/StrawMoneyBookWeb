const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/wear-sync-epoch.service-BI9nNC3A.js","assets/vendor-sqlite-CnPD_Y5r.js","assets/app-membership-B14OsJVi.js","assets/app-i18n-DdPQkNTN.js","assets/vendor-DKubtjiE.js"])))=>i.map(i=>d[i]);
import{C as S,S as Un,d as Qr,_ as hn,a as wn,r as vn,D as En,F as ea}from"./vendor-sqlite-CnPD_Y5r.js";import{a as ta,g as un}from"./app-membership-B14OsJVi.js";import{t as p}from"./app-i18n-DdPQkNTN.js";import{S as ye}from"./vendor-DKubtjiE.js";const na="straw.recovery_backup.v1",ce="backups",ra=1,ln=40,re=Object.freeze({INDEXEDDB:"indexeddb",FILESYSTEM:"filesystem",TEST:"test"}),aa=new Set(Object.values(re));function ia(){return typeof indexedDB>"u"||!indexedDB?null:new Promise((e,t)=>{const n=indexedDB.open(na,ra);n.onerror=()=>t(n.error||new Error("indexedDB open failed")),n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(ce)||a.createObjectStore(ce,{keyPath:"backupId"})},n.onsuccess=()=>e(n.result)})}async function Gt(e){const t=await ia();if(!t)return null;try{return await e(t)}finally{try{t.close()}catch{}}}async function oa(e){return await Gt(async n=>(await new Promise((a,r)=>{const i=n.transaction(ce,"readwrite");i.oncomplete=()=>a(),i.onerror=()=>r(i.error||new Error("indexedDB put failed")),i.objectStore(ce).put(e)}),!0)).catch(()=>!1)===!0}async function kn(e){return Gt(async t=>new Promise((n,a)=>{const r=t.transaction(ce,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB get failed"));const i=r.objectStore(ce).get(e);i.onsuccess=()=>n(i.result||null),i.onerror=()=>a(i.error||new Error("indexedDB get failed"))})).catch(()=>null)}async function sa(){const e=await Gt(async t=>new Promise((n,a)=>{const r=t.transaction(ce,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB getAll failed"));const i=r.objectStore(ce).getAll();i.onsuccess=()=>n(Array.isArray(i.result)?i.result:[]),i.onerror=()=>a(i.error||new Error("indexedDB getAll failed"))})).catch(()=>null);return Array.isArray(e)?e:[]}function da(e){return`recovery_${String(e).replace(/[^\w.-]+/g,"_").slice(0,40)||"wipe"}_${Date.now()}_${Math.random().toString(36).slice(2,10)}`}function Xn(e){return typeof TextEncoder<"u"?new TextEncoder().encode(e).byteLength:String(e||"").length}function ca(e,t){if(!e||typeof e!="object")return null;const n=String(e.backupId||"").trim(),a=Number(e.byteLength)||0;return!n||!(a>0)?null:{backupId:n,purpose:String(e.purpose||"").trim(),at:String(e.at||"").trim(),byteLength:a,filename:String(e.filename||"").trim(),source:String(e.source||"").trim(),storage:String(t||e.storage||re.INDEXEDDB).trim(),hasPayload:!!e.jsonText}}function Fn(e){if(!e||typeof e!="object"||e.verified!==!0||!(Number(e.byteLength)>0)||!String(e.backupId||"").trim())return!1;const t=String(e.storage||"").trim();return!!aa.has(t)}async function _a(e={}){const t=String(e.purpose||"wipe").trim()||"wipe",n=e.data;if(!n||typeof n!="object")throw new Error("recovery backup export payload missing");let a="";try{a=JSON.stringify(n)}catch(d){throw new Error(`recovery backup serialize failed: ${d?.message||d}`)}const r=Xn(a);if(!(r>2))throw new Error("recovery backup payload empty");const i=da(t),o=new Date().toISOString(),s={backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,source:String(e.source||"").trim(),filename:String(e.filename||"").trim()};if(await oa(s)){const d=await kn(i);if(d?.backupId===i&&Number(d.byteLength)>0&&d.jsonText)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:re.INDEXEDDB,filename:s.filename}}if(typeof e.persistToFilesystem=="function")try{const d=await e.persistToFilesystem({backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,filename:s.filename,data:n});if(d?.verified===!0&&String(d.backupId||i)===i&&Number(d.byteLength||r)>0&&String(d.storage||"")===re.FILESYSTEM)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:re.FILESYSTEM,filename:s.filename,location:String(d.location||"").trim()}}catch{}throw new Error("recovery backup durable persist failed (memory is not durable proof)")}async function Ea(e){const t=String(e||"").trim();return t?kn(t):null}async function Od(e={}){const t=Math.max(1,Math.min(ln,Number(e.limit)||ln));let n=[];return n=await sa(),(Array.isArray(n)?n:[]).map(r=>ca(r,r?.storage||re.INDEXEDDB)).filter(Boolean).sort((r,i)=>String(i.at).localeCompare(String(r.at))).slice(0,t)}async function Rd(e){const t=await Ea(e),n=String(t?.jsonText||"");if(!t?.backupId||!(Number(t.byteLength)>0)||!n)throw new Error("recovery backup record missing or empty");return{backupId:t.backupId,purpose:String(t.purpose||""),at:String(t.at||""),byteLength:Number(t.byteLength)||Xn(n),filename:String(t.filename||`${t.backupId}.json`),jsonText:n}}async function Sd(e={}){const t=e.exportAllLedgersJson;if(typeof t!="function")throw new Error("recovery backup exporter missing");const n=String(e.purpose||"wipe").trim()||"wipe",a=String(e.filename||"").trim()||`strawmoneybook-recovery-before-${n}-${new Date().toISOString().replace(/[:.]/g,"-")}.json`,r=await t();let i=e.persistToFilesystem;!i&&typeof e.saveJsonFileToDevice=="function"&&(i=async({filename:s,data:c,backupId:d,byteLength:E})=>{const u=await e.saveJsonFileToDevice(s,c,{category:e.category||"recovery"});return u?.saved&&u.location?{verified:!0,backupId:d,byteLength:E,storage:re.FILESYSTEM,location:u.location}:null});const o=await _a({purpose:n,data:r,source:e.source,filename:a,persistToFilesystem:i});if(typeof e.saveJsonFileToDevice=="function"&&o.storage!==re.FILESYSTEM)try{const s=await e.saveJsonFileToDevice(a,r,{category:e.category||"recovery"});!(s?.saved&&s.location)&&typeof e.downloadJsonFile=="function"&&e.downloadJsonFile(a,r),s?.saved&&s.location&&typeof e.onDeviceSaved=="function"&&e.onDeviceSaved(s)}catch{if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}}else if(o.storage===re.FILESYSTEM&&typeof e.onDeviceSaved=="function")e.onDeviceSaved({saved:!0,location:o.location});else if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}if(!Fn(o))throw new Error("recovery backup proof invalid after persist");return o}const ua=`PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS ledgers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'TWD',
  timezone TEXT NOT NULL DEFAULT 'Asia/Taipei',
  color TEXT,
  icon TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS account_groups (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash','bank','ewallet','credit_card','other')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS accounts (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'asset' CHECK (account_type IN ('asset','liability')),
  account_kind TEXT NOT NULL DEFAULT 'cash' CHECK (account_kind IN ('cash','credit')),
  allow_negative INTEGER NOT NULL DEFAULT 0 CHECK (allow_negative IN (0,1)),
  opening_balance_minor INTEGER NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'TWD',
  icon TEXT DEFAULT 'fa-solid fa-wallet',
  credit_limit_minor INTEGER NOT NULL DEFAULT 0,
  repayment_reminder_day INTEGER CHECK (repayment_reminder_day IS NULL OR (repayment_reminder_day >= 1 AND repayment_reminder_day <= 31)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, group_id) REFERENCES account_groups(ledger_id, id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS category_groups (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('expense','income','both')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('expense','income','both')),
  icon TEXT DEFAULT 'fa-solid fa-tag',
  is_budgetable INTEGER NOT NULL DEFAULT 1 CHECK (is_budgetable IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, group_id) REFERENCES category_groups(ledger_id, id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS transactions (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense','income','adjustment','transfer')),
  transfer_group_id TEXT,
  account_id TEXT NOT NULL,
  peer_account_id TEXT,
  category_id TEXT,
  amount_minor INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  note TEXT,
  location TEXT,
  tags_json TEXT,
  origin_type TEXT NOT NULL DEFAULT 'manual' CHECK (origin_type IN ('manual','loan_payment','reimbursement','import','recurring','refund')),
  external_ref_id TEXT,
  idempotency_key TEXT,
  include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1)),
  include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, peer_account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE RESTRICT,
  CHECK (amount_minor IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS transaction_attachments (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  file_uri TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  checksum TEXT,
  created_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, transaction_id) REFERENCES transactions(ledger_id, id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS counterparties (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_json TEXT,
  note TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS loans (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  counterparty_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('lend','borrow')),
  principal_minor INTEGER NOT NULL CHECK (principal_minor > 0),
  interest_rule_json TEXT,
  start_date TEXT NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('active','partial','settled','void')),
  settled_at TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, counterparty_id) REFERENCES counterparties(ledger_id, id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS loan_payments (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  loan_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  principal_component_minor INTEGER,
  interest_component_minor INTEGER,
  generated_tx_id TEXT,
  generated_interest_tx_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, loan_id) REFERENCES loans(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, generated_tx_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reimbursements (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  counterparty_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft','submitted','in_review','approved','paid','rejected')),
  submitted_at TEXT,
  approved_at TEXT,
  paid_at TEXT,
  paid_tx_id TEXT,
  total_minor INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  idempotency_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, counterparty_id) REFERENCES counterparties(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, paid_tx_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reimbursement_items (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  reimbursement_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('transaction','manual','advance')),
  transaction_id TEXT,
  category_id TEXT,
  account_id TEXT,
  description TEXT,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  occurred_at TEXT NOT NULL,
  attachment_uri TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, reimbursement_id) REFERENCES reimbursements(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, transaction_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  month_key TEXT NOT NULL,
  name TEXT,
  include_transfers INTEGER NOT NULL DEFAULT 0 CHECK (include_transfers IN (0,1)),
  include_loan_repayments INTEGER NOT NULL DEFAULT 0 CHECK (include_loan_repayments IN (0,1)),
  include_reimbursed_expenses INTEGER NOT NULL DEFAULT 0 CHECK (include_reimbursed_expenses IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  UNIQUE (ledger_id, month_key)
);

CREATE TABLE IF NOT EXISTS budget_items (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  budget_id TEXT NOT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('category','group')),
  category_id TEXT,
  category_group_id TEXT,
  amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, budget_id) REFERENCES budgets(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, category_group_id) REFERENCES category_groups(ledger_id, id) ON DELETE RESTRICT,
  CHECK (
    (scope_type='category' AND category_id IS NOT NULL AND category_group_id IS NULL) OR
    (scope_type='group' AND category_id IS NULL AND category_group_id IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS app_settings (
  ledger_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, key),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deleted_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ledger_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  row_pk TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  deleted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_accounts_group ON accounts(ledger_id, group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_accounts_archived ON accounts(ledger_id, is_archived);

CREATE INDEX IF NOT EXISTS idx_categories_group ON categories(ledger_id, group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_archived ON categories(ledger_id, is_archived);

CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(ledger_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account_date ON transactions(ledger_id, account_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category_date ON transactions(ledger_id, category_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_transfer_group ON transactions(ledger_id, transfer_group_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_idempotency ON transactions(ledger_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(ledger_id, status, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_loan_payments_loan_date ON loan_payments(ledger_id, loan_id, paid_at DESC);

CREATE INDEX IF NOT EXISTS idx_reimburse_status ON reimbursements(ledger_id, status, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reimburse_idempotency ON reimbursements(ledger_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reimburse_items_claim ON reimbursement_items(ledger_id, reimbursement_id);

CREATE INDEX IF NOT EXISTS idx_budget_month ON budgets(ledger_id, month_key);
CREATE INDEX IF NOT EXISTS idx_budget_items_budget ON budget_items(ledger_id, budget_id, sort_order);
`,la=`ALTER TABLE transactions ADD COLUMN is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1));
ALTER TABLE transactions ADD COLUMN reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed'));
ALTER TABLE transactions ADD COLUMN reimbursed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);
`,Ta=`ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1));
ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1));

UPDATE transactions
SET include_in_budget = COALESCE(include_in_budget, 1),
    include_in_analysis = COALESCE(include_in_analysis, 1);

UPDATE transactions
SET include_in_budget = 0,
    include_in_analysis = 0
WHERE origin_type = 'reimbursement';
`,ma=`ALTER TABLE accounts ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-wallet';

ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-tag';
`,ga=`UPDATE accounts
SET icon = 'fa-solid fa-wallet'
WHERE icon IS NULL OR TRIM(icon) = '';

UPDATE categories
SET icon = CASE
  WHEN name LIKE '%飲食%' THEN 'fa-solid fa-utensils'
  WHEN kind = 'income' THEN 'fa-solid fa-sack-dollar'
  ELSE 'fa-solid fa-tag'
END
WHERE icon IS NULL OR TRIM(icon) = '';
`,La=`ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

UPDATE ledgers AS l
SET sort_order = (
  SELECT COUNT(*)
  FROM ledgers AS l2
  WHERE COALESCE(l2.created_at, '') < COALESCE(l.created_at, '')
     OR (
       COALESCE(l2.created_at, '') = COALESCE(l.created_at, '')
       AND l2.id <= l.id
     )
) - 1
WHERE l.deleted_at IS NULL;
`,Na=`-- Remove legacy sample transaction "飲食 300" if it is the only transaction in the ledger.
-- This avoids deleting real user data that may also be food expenses.
WITH single_tx_ledger AS (
  SELECT ledger_id
  FROM transactions
  WHERE deleted_at IS NULL
  GROUP BY ledger_id
  HAVING COUNT(*) = 1
),
sample_tx AS (
  SELECT t.ledger_id, t.id
  FROM transactions t
  LEFT JOIN categories c
    ON c.ledger_id = t.ledger_id
   AND c.id = t.category_id
  LEFT JOIN accounts a
    ON a.ledger_id = t.ledger_id
   AND a.id = t.account_id
  WHERE t.deleted_at IS NULL
    AND t.type = 'expense'
    AND t.amount_minor = -30000
    AND t.ledger_id IN (SELECT ledger_id FROM single_tx_ledger)
    AND (
      c.name IN ('飲食', '早餐')
      OR a.name = '錢包'
    )
)
UPDATE transactions
SET deleted_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE (ledger_id, id) IN (SELECT ledger_id, id FROM sample_tx);
`,pa=`CREATE TABLE IF NOT EXISTS bank_connections (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_connection_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked','error')),
  user_label TEXT,
  last_sync_at TEXT,
  sync_cursor TEXT,
  last_sync_status TEXT NOT NULL DEFAULT 'idle' CHECK (last_sync_status IN ('idle','ok','error')),
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  UNIQUE (ledger_id, provider, provider_connection_id)
);

CREATE TABLE IF NOT EXISTS bank_accounts (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  connection_id TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  account_mask TEXT,
  account_name TEXT NOT NULL,
  account_type TEXT,
  currency TEXT NOT NULL DEFAULT 'TWD',
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0,1)),
  user_label TEXT,
  mapped_account_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, connection_id) REFERENCES bank_connections(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, mapped_account_id) REFERENCES accounts(ledger_id, id) ON DELETE SET NULL,
  UNIQUE (ledger_id, connection_id, provider_account_id)
);

CREATE TABLE IF NOT EXISTS bank_transactions (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  connection_id TEXT NOT NULL,
  bank_account_id TEXT NOT NULL,
  provider_transaction_id TEXT NOT NULL,
  posted_at TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TWD',
  description TEXT,
  merchant TEXT,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('pending','posted','reversed')),
  seen_in_app INTEGER NOT NULL DEFAULT 0 CHECK (seen_in_app IN (0,1)),
  imported INTEGER NOT NULL DEFAULT 0 CHECK (imported IN (0,1)),
  imported_txn_id TEXT,
  raw_json TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, connection_id) REFERENCES bank_connections(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, bank_account_id) REFERENCES bank_accounts(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, imported_txn_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL,
  UNIQUE (ledger_id, bank_account_id, provider_transaction_id)
);

CREATE TABLE IF NOT EXISTS bank_sync_rules (
  ledger_id TEXT NOT NULL,
  connection_id TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'all' CHECK (direction IN ('all','income','expense')),
  exclude_keywords_json TEXT NOT NULL DEFAULT '[]',
  min_amount_minor INTEGER NOT NULL DEFAULT 0 CHECK (min_amount_minor >= 0),
  include_pending INTEGER NOT NULL DEFAULT 0 CHECK (include_pending IN (0,1)),
  lookback_days INTEGER NOT NULL DEFAULT 3 CHECK (lookback_days >= 0 AND lookback_days <= 30),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, connection_id),
  FOREIGN KEY (ledger_id, connection_id) REFERENCES bank_connections(ledger_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bank_connections_status
ON bank_connections(ledger_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_enabled
ON bank_accounts(ledger_id, connection_id, enabled, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_tx_posted_at
ON bank_transactions(ledger_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_tx_imported
ON bank_transactions(ledger_id, imported, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_tx_seen
ON bank_transactions(ledger_id, seen_in_app, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_bank_tx_status
ON bank_transactions(ledger_id, status, posted_at DESC);
`,fa=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
-- Composite child FKs use ON DELETE SET NULL / CASCADE; disabling foreign_keys is forbidden.
-- Detach nullable refs + backup/delete CASCADE children, rebuild parent, then restore.
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS transactions_new;
DROP TABLE IF EXISTS _mig009_bak_tx_att;
DROP TABLE IF EXISTS _mig009_bak_loan_gen;
DROP TABLE IF EXISTS _mig009_bak_reimb_paid;
DROP TABLE IF EXISTS _mig009_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig009_bak_bank_imported;

CREATE TABLE _mig009_bak_tx_att AS SELECT * FROM transaction_attachments;
CREATE TABLE _mig009_bak_loan_gen AS
  SELECT ledger_id, id, generated_tx_id FROM loan_payments WHERE generated_tx_id IS NOT NULL;
CREATE TABLE _mig009_bak_reimb_paid AS
  SELECT ledger_id, id, paid_tx_id FROM reimbursements WHERE paid_tx_id IS NOT NULL;
CREATE TABLE _mig009_bak_reimb_item_tx AS
  SELECT ledger_id, id, transaction_id FROM reimbursement_items WHERE transaction_id IS NOT NULL;
CREATE TABLE _mig009_bak_bank_imported AS
  SELECT ledger_id, id, imported_txn_id FROM bank_transactions WHERE imported_txn_id IS NOT NULL;

UPDATE loan_payments SET generated_tx_id = NULL WHERE generated_tx_id IS NOT NULL;
UPDATE reimbursements SET paid_tx_id = NULL WHERE paid_tx_id IS NOT NULL;
UPDATE reimbursement_items SET transaction_id = NULL WHERE transaction_id IS NOT NULL;
UPDATE bank_transactions SET imported_txn_id = NULL WHERE imported_txn_id IS NOT NULL;
DELETE FROM transaction_attachments;

CREATE TABLE IF NOT EXISTS transactions_new (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense','income','adjustment','transfer')),
  transfer_group_id TEXT,
  account_id TEXT NOT NULL,
  peer_account_id TEXT,
  category_id TEXT,
  amount_minor INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  note TEXT,
  location TEXT,
  tags_json TEXT,
  origin_type TEXT NOT NULL DEFAULT 'manual' CHECK (origin_type IN ('manual','loan_payment','reimbursement','import','recurring','refund')),
  external_ref_id TEXT,
  idempotency_key TEXT,
  include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1)),
  include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1)),
  reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed')),
  reimbursed_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, peer_account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE RESTRICT
);

INSERT INTO transactions_new (
  ledger_id,
  id,
  type,
  transfer_group_id,
  account_id,
  peer_account_id,
  category_id,
  amount_minor,
  occurred_at,
  note,
  location,
  tags_json,
  origin_type,
  external_ref_id,
  idempotency_key,
  include_in_budget,
  include_in_analysis,
  created_at,
  updated_at,
  deleted_at,
  is_reimbursable,
  reimbursement_state,
  reimbursed_at
)
SELECT
  ledger_id,
  id,
  type,
  transfer_group_id,
  account_id,
  peer_account_id,
  category_id,
  amount_minor,
  occurred_at,
  note,
  location,
  tags_json,
  origin_type,
  external_ref_id,
  idempotency_key,
  include_in_budget,
  include_in_analysis,
  created_at,
  updated_at,
  deleted_at,
  COALESCE(is_reimbursable, 0),
  COALESCE(reimbursement_state, 'none'),
  reimbursed_at
FROM transactions;

DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(ledger_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account_date ON transactions(ledger_id, account_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category_date ON transactions(ledger_id, category_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_transfer_group ON transactions(ledger_id, transfer_group_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_idempotency ON transactions(ledger_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);

INSERT INTO transaction_attachments SELECT * FROM _mig009_bak_tx_att;

UPDATE loan_payments
SET generated_tx_id = (
  SELECT b.generated_tx_id FROM _mig009_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig009_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
);

UPDATE reimbursements
SET paid_tx_id = (
  SELECT b.paid_tx_id FROM _mig009_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig009_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
);

UPDATE reimbursement_items
SET transaction_id = (
  SELECT b.transaction_id FROM _mig009_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig009_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
);

UPDATE bank_transactions
SET imported_txn_id = (
  SELECT b.imported_txn_id FROM _mig009_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig009_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
);

DROP TABLE IF EXISTS _mig009_bak_tx_att;
DROP TABLE IF EXISTS _mig009_bak_loan_gen;
DROP TABLE IF EXISTS _mig009_bak_reimb_paid;
DROP TABLE IF EXISTS _mig009_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig009_bak_bank_imported;

PRAGMA foreign_keys = ON;
`,Aa=`ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1 CHECK (include_in_assets IN (0,1));

UPDATE accounts
SET include_in_assets = COALESCE(include_in_assets, 1);
`,Oa=`CREATE TABLE IF NOT EXISTS reimbursement_advances (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  source_tx_id TEXT,
  amount_minor INTEGER NOT NULL DEFAULT 0,
  used_minor INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  received_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, source_tx_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reimbursement_advance_usages (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  advance_id TEXT NOT NULL,
  expense_tx_id TEXT NOT NULL,
  amount_minor INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, advance_id) REFERENCES reimbursement_advances(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, expense_tx_id) REFERENCES transactions(ledger_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reimbursement_advances_account
  ON reimbursement_advances(ledger_id, account_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_reimbursement_advances_active
  ON reimbursement_advances(ledger_id, deleted_at, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_reimbursement_advance_usages_expense
  ON reimbursement_advance_usages(ledger_id, expense_tx_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reimbursement_advance_usages_unique
  ON reimbursement_advance_usages(ledger_id, advance_id, expense_tx_id);
`,Ra=`ALTER TABLE reimbursement_items
  ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense'
  CHECK (entry_type IN ('expense', 'income'));
`,Sa=`ALTER TABLE budget_items
  ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed'
  CHECK (amount_mode IN ('fixed', 'daily_average'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none'
  CHECK (day_rule_unit IN ('none', 'weekday', 'monthday'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';
`,ba=`ALTER TABLE reimbursement_advances
  ADD COLUMN category_id TEXT;

CREATE INDEX IF NOT EXISTS idx_reimbursement_advances_category
  ON reimbursement_advances(ledger_id, category_id, received_at DESC);
`,ya=`CREATE TABLE IF NOT EXISTS savings_jars (
  ledger_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  goal_type TEXT NOT NULL DEFAULT 'open' CHECK (goal_type IN ('open','target')),
  target_amount_minor INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, account_id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE CASCADE,
  CHECK (
    (goal_type = 'open' AND target_amount_minor IS NULL) OR
    (goal_type = 'target' AND target_amount_minor IS NOT NULL AND target_amount_minor > 0)
  )
);

CREATE INDEX IF NOT EXISTS idx_savings_jars_ledger
  ON savings_jars(ledger_id, goal_type, updated_at DESC);
`,Da=`ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;
`,Ia=`ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';
ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;
`,Ca=`CREATE INDEX IF NOT EXISTS idx_deleted_log_lookup
ON deleted_log(ledger_id, table_name, row_pk, deleted_at DESC);

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_account_groups
AFTER DELETE ON account_groups
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'account_groups',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_accounts
AFTER DELETE ON accounts
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'accounts',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_category_groups
AFTER DELETE ON category_groups
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'category_groups',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_categories
AFTER DELETE ON categories
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'categories',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_transactions
AFTER DELETE ON transactions
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'transactions',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.occurred_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_transaction_attachments
AFTER DELETE ON transaction_attachments
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'transaction_attachments',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_counterparties
AFTER DELETE ON counterparties
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'counterparties',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_loans
AFTER DELETE ON loans
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'loans',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.settled_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_loan_payments
AFTER DELETE ON loan_payments
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'loan_payments',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.paid_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursement_advances
AFTER DELETE ON reimbursement_advances
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursement_advances',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.received_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursement_advance_usages
AFTER DELETE ON reimbursement_advance_usages
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursement_advance_usages',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursements
AFTER DELETE ON reimbursements
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursements',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.paid_at, OLD.approved_at, OLD.submitted_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursement_items
AFTER DELETE ON reimbursement_items
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursement_items',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.occurred_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_budgets
AFTER DELETE ON budgets
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'budgets',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_budget_items
AFTER DELETE ON budget_items
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'budget_items',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_savings_jars
AFTER DELETE ON savings_jars
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'savings_jars',
    OLD.account_id,
    json_object('account_id', OLD.account_id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_bank_connections
AFTER DELETE ON bank_connections
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'bank_connections',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.last_sync_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_bank_accounts
AFTER DELETE ON bank_accounts
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'bank_accounts',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_bank_transactions
AFTER DELETE ON bank_transactions
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'bank_transactions',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.last_seen_at, OLD.posted_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_bank_sync_rules
AFTER DELETE ON bank_sync_rules
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'bank_sync_rules',
    OLD.connection_id,
    json_object('connection_id', OLD.connection_id),
    COALESCE(OLD.updated_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_app_settings
AFTER DELETE ON app_settings
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'app_settings',
    OLD.key,
    json_object('key', OLD.key),
    COALESCE(OLD.updated_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;
`,Ua=`ALTER TABLE bank_transactions ADD COLUMN transaction_type TEXT;
ALTER TABLE bank_transactions ADD COLUMN note TEXT;
ALTER TABLE bank_transactions ADD COLUMN summary TEXT;
ALTER TABLE bank_transactions ADD COLUMN balance_minor INTEGER;
`,ha=`ALTER TABLE reimbursement_items RENAME TO reimbursement_items__old_source_type;

CREATE TABLE reimbursement_items (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  reimbursement_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('transaction','manual','advance')),
  transaction_id TEXT,
  entry_type TEXT NOT NULL DEFAULT 'expense' CHECK (entry_type IN ('expense', 'income')),
  category_id TEXT,
  account_id TEXT,
  description TEXT,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  occurred_at TEXT NOT NULL,
  attachment_uri TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, reimbursement_id) REFERENCES reimbursements(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, transaction_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE SET NULL
);

INSERT INTO reimbursement_items (
  ledger_id,
  id,
  reimbursement_id,
  source_type,
  transaction_id,
  entry_type,
  category_id,
  account_id,
  description,
  amount_minor,
  occurred_at,
  attachment_uri,
  created_at,
  updated_at
)
SELECT
  ledger_id,
  id,
  reimbursement_id,
  source_type,
  transaction_id,
  entry_type,
  category_id,
  account_id,
  description,
  amount_minor,
  occurred_at,
  attachment_uri,
  created_at,
  updated_at
FROM reimbursement_items__old_source_type;

DROP TABLE reimbursement_items__old_source_type;

CREATE INDEX IF NOT EXISTS idx_reimburse_items_claim ON reimbursement_items(ledger_id, reimbursement_id);
`,wa=`ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_savings_jars_auto_save
  ON savings_jars(ledger_id, auto_save_paused, updated_at DESC);
`,va=`ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE budgets ADD COLUMN budget_save_total_target_account_id TEXT;
ALTER TABLE budgets ADD COLUMN budget_save_total_source_account_id TEXT;

ALTER TABLE budget_items ADD COLUMN budget_save_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE budget_items ADD COLUMN budget_save_target_account_id TEXT;
ALTER TABLE budget_items ADD COLUMN budget_save_source_account_id TEXT;

CREATE TABLE IF NOT EXISTS budget_save_settlements (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('budget_item_day', 'budget_item_month', 'budget_total_month')),
  scope_ref_id TEXT NOT NULL,
  period_key TEXT NOT NULL,
  source_account_id TEXT,
  target_account_id TEXT,
  settled_amount_minor INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('settled', 'skipped_no_surplus', 'invalid_config', 'conflict', 'failed')),
  transfer_group_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  UNIQUE (ledger_id, scope_type, scope_ref_id, period_key),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_budget_save_settlements_scope
  ON budget_save_settlements(ledger_id, scope_type, scope_ref_id, period_key);

CREATE INDEX IF NOT EXISTS idx_budget_save_settlements_updated
  ON budget_save_settlements(ledger_id, updated_at DESC);
`,ka=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
-- Composite child FKs use ON DELETE SET NULL / CASCADE; disabling foreign_keys is forbidden.
-- Detach nullable refs + backup/delete CASCADE children, rebuild parent, then restore.
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS transactions_new;
DROP TABLE IF EXISTS _mig026_bak_tx_att;
DROP TABLE IF EXISTS _mig026_bak_adv_usage;
DROP TABLE IF EXISTS _mig026_bak_loan_gen;
DROP TABLE IF EXISTS _mig026_bak_reimb_paid;
DROP TABLE IF EXISTS _mig026_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig026_bak_bank_imported;
DROP TABLE IF EXISTS _mig026_bak_adv_source;

CREATE TABLE _mig026_bak_tx_att AS SELECT * FROM transaction_attachments;
CREATE TABLE _mig026_bak_adv_usage AS SELECT * FROM reimbursement_advance_usages;
CREATE TABLE _mig026_bak_loan_gen AS
  SELECT ledger_id, id, generated_tx_id FROM loan_payments WHERE generated_tx_id IS NOT NULL;
CREATE TABLE _mig026_bak_reimb_paid AS
  SELECT ledger_id, id, paid_tx_id FROM reimbursements WHERE paid_tx_id IS NOT NULL;
CREATE TABLE _mig026_bak_reimb_item_tx AS
  SELECT ledger_id, id, transaction_id FROM reimbursement_items WHERE transaction_id IS NOT NULL;
CREATE TABLE _mig026_bak_bank_imported AS
  SELECT ledger_id, id, imported_txn_id FROM bank_transactions WHERE imported_txn_id IS NOT NULL;
CREATE TABLE _mig026_bak_adv_source AS
  SELECT ledger_id, id, source_tx_id FROM reimbursement_advances WHERE source_tx_id IS NOT NULL;

UPDATE loan_payments SET generated_tx_id = NULL WHERE generated_tx_id IS NOT NULL;
UPDATE reimbursements SET paid_tx_id = NULL WHERE paid_tx_id IS NOT NULL;
UPDATE reimbursement_items SET transaction_id = NULL WHERE transaction_id IS NOT NULL;
UPDATE bank_transactions SET imported_txn_id = NULL WHERE imported_txn_id IS NOT NULL;
UPDATE reimbursement_advances SET source_tx_id = NULL WHERE source_tx_id IS NOT NULL;
DELETE FROM reimbursement_advance_usages;
DELETE FROM transaction_attachments;

CREATE TABLE IF NOT EXISTS transactions_new (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense','income','adjustment','transfer')),
  transfer_group_id TEXT,
  account_id TEXT NOT NULL,
  peer_account_id TEXT,
  category_id TEXT,
  amount_minor INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  note TEXT,
  location TEXT,
  tags_json TEXT,
  origin_type TEXT NOT NULL DEFAULT 'manual' CHECK (origin_type IN ('manual','loan_payment','reimbursement','import','recurring','refund')),
  external_ref_id TEXT,
  idempotency_key TEXT,
  include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1)),
  include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1)),
  reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed')),
  reimbursed_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, peer_account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE RESTRICT
);

INSERT INTO transactions_new (
  ledger_id,
  id,
  type,
  transfer_group_id,
  account_id,
  peer_account_id,
  category_id,
  amount_minor,
  occurred_at,
  note,
  location,
  tags_json,
  origin_type,
  external_ref_id,
  idempotency_key,
  include_in_budget,
  include_in_analysis,
  created_at,
  updated_at,
  deleted_at,
  is_reimbursable,
  reimbursement_state,
  reimbursed_at
)
SELECT
  ledger_id,
  id,
  type,
  transfer_group_id,
  account_id,
  peer_account_id,
  category_id,
  amount_minor,
  occurred_at,
  note,
  location,
  tags_json,
  origin_type,
  external_ref_id,
  idempotency_key,
  include_in_budget,
  include_in_analysis,
  created_at,
  updated_at,
  deleted_at,
  COALESCE(is_reimbursable, 0),
  COALESCE(reimbursement_state, 'none'),
  reimbursed_at
FROM transactions;

DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(ledger_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account_date ON transactions(ledger_id, account_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category_date ON transactions(ledger_id, category_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_transfer_group ON transactions(ledger_id, transfer_group_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_idempotency ON transactions(ledger_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);

INSERT INTO transaction_attachments SELECT * FROM _mig026_bak_tx_att;
INSERT INTO reimbursement_advance_usages SELECT * FROM _mig026_bak_adv_usage;

UPDATE loan_payments
SET generated_tx_id = (
  SELECT b.generated_tx_id FROM _mig026_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig026_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
);

UPDATE reimbursements
SET paid_tx_id = (
  SELECT b.paid_tx_id FROM _mig026_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig026_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
);

UPDATE reimbursement_items
SET transaction_id = (
  SELECT b.transaction_id FROM _mig026_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig026_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
);

UPDATE bank_transactions
SET imported_txn_id = (
  SELECT b.imported_txn_id FROM _mig026_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig026_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
);

UPDATE reimbursement_advances
SET source_tx_id = (
  SELECT b.source_tx_id FROM _mig026_bak_adv_source b
  WHERE b.ledger_id = reimbursement_advances.ledger_id AND b.id = reimbursement_advances.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig026_bak_adv_source b
  WHERE b.ledger_id = reimbursement_advances.ledger_id AND b.id = reimbursement_advances.id
);

DROP TABLE IF EXISTS _mig026_bak_tx_att;
DROP TABLE IF EXISTS _mig026_bak_adv_usage;
DROP TABLE IF EXISTS _mig026_bak_loan_gen;
DROP TABLE IF EXISTS _mig026_bak_reimb_paid;
DROP TABLE IF EXISTS _mig026_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig026_bak_bank_imported;
DROP TABLE IF EXISTS _mig026_bak_adv_source;

PRAGMA foreign_keys = ON;
`,Xa=`ALTER TABLE reimbursement_advances ADD COLUMN return_amount_minor INTEGER;
`,Fa=`ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1 CHECK (include_in_group_statistics IN (0,1));

UPDATE accounts
SET include_in_group_statistics = COALESCE(include_in_group_statistics, 1);
`,Ma=`DROP TABLE IF EXISTS invoice_carrier_invoices;

DROP TABLE IF EXISTS invoice_carrier_connections;

DELETE FROM app_settings
WHERE key LIKE 'invoice_carrier.%'
   OR key LIKE 'einvoice.%';
`,Ba=`CREATE TABLE IF NOT EXISTS einvoice_credentials (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  platform  TEXT    NOT NULL DEFAULT 'einvoice',
  encrypted_account  TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  iv        TEXT    NOT NULL,
  password_iv TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS einvoice_invoice_imports (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT    NOT NULL UNIQUE,
  amount         REAL    NOT NULL,
  invoice_date   INTEGER NOT NULL,
  merchant_name  TEXT,
  carrier_name   TEXT,
  transaction_id TEXT,
  imported_at    INTEGER NOT NULL
);
`,xa=`ALTER TABLE einvoice_credentials ADD COLUMN password_iv TEXT NOT NULL DEFAULT '';
`,Ga=`CREATE TABLE IF NOT EXISTS budget_containers (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  budget_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount_minor INTEGER NOT NULL DEFAULT 0,
  budget_save_enabled INTEGER NOT NULL DEFAULT 0,
  budget_save_target_account_id TEXT,
  budget_save_source_account_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, budget_id) REFERENCES budgets(ledger_id, id) ON DELETE CASCADE
);

ALTER TABLE budget_items ADD COLUMN budget_container_id TEXT;

CREATE INDEX IF NOT EXISTS idx_budget_containers_budget
  ON budget_containers(ledger_id, budget_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_budget_items_container
  ON budget_items(ledger_id, budget_container_id);
`,Pa=`ALTER TABLE categories ADD COLUMN default_include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_analysis IN (0,1));
ALTER TABLE categories ADD COLUMN default_include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_budget IN (0,1));
ALTER TABLE categories ADD COLUMN default_is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (default_is_reimbursable IN (0,1));
`,ja=`ALTER TABLE transactions ADD COLUMN reimburse_target_minor INTEGER;
`,Ha=`CREATE TABLE IF NOT EXISTS einvoice_sync_config (
  id TEXT PRIMARY KEY,
  ledger_id TEXT,
  auto_sync_enabled INTEGER NOT NULL DEFAULT 0,
  lookback_days INTEGER NOT NULL DEFAULT 7,
  default_account_id TEXT,
  default_category_id TEXT,
  last_sync_at INTEGER,
  last_sync_status TEXT NOT NULL DEFAULT 'idle',
  last_error TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS einvoice_pending_invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  amount REAL NOT NULL,
  invoice_date INTEGER NOT NULL,
  merchant_name TEXT,
  carrier_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scraped_at INTEGER NOT NULL,
  source_sync_run_id TEXT
);

CREATE TABLE IF NOT EXISTS einvoice_sync_runs (
  id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  fetched_count INTEGER NOT NULL DEFAULT 0,
  new_pending_count INTEGER NOT NULL DEFAULT 0,
  error_code TEXT,
  error_message TEXT
);
`,Ka=`ALTER TABLE budget_containers ADD COLUMN period_mode TEXT NOT NULL DEFAULT 'monthly';
`,Ya=`ALTER TABLE ledgers ADD COLUMN budget_period_mode TEXT NOT NULL DEFAULT 'calendar_month';
ALTER TABLE ledgers ADD COLUMN budget_pay_day INTEGER NOT NULL DEFAULT 1;

ALTER TABLE budgets ADD COLUMN period_key TEXT;
ALTER TABLE budgets ADD COLUMN period_start_date TEXT;
ALTER TABLE budgets ADD COLUMN period_end_date TEXT;
ALTER TABLE budgets ADD COLUMN period_mode TEXT NOT NULL DEFAULT 'calendar_month';

UPDATE budgets
SET period_key = month_key,
    period_start_date = month_key || '-01',
    period_end_date = date(month_key || '-01', '+1 month', '-1 day'),
    period_mode = 'calendar_month'
WHERE period_key IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_budget_period_key
  ON budgets(ledger_id, period_key)
  WHERE deleted_at IS NULL AND period_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_budget_period_dates
  ON budgets(ledger_id, period_start_date, period_end_date);
`,Wa=`-- SMB-277: per-transaction editor attribution for shared ledgers
ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;
`,$a=`CREATE TABLE IF NOT EXISTS securities (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  market TEXT NOT NULL DEFAULT 'TW',
  asset_class TEXT NOT NULL DEFAULT 'stock' CHECK (asset_class IN ('stock', 'etf')),
  currency_code TEXT NOT NULL DEFAULT 'TWD',
  include_in_assets INTEGER NOT NULL DEFAULT 1,
  manual_price_minor INTEGER NOT NULL DEFAULT 0,
  manual_price_at TEXT,
  price_source TEXT NOT NULL DEFAULT 'manual',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_securities_ledger_active
  ON securities(ledger_id, is_archived, deleted_at, sort_order, updated_at DESC);

CREATE TABLE IF NOT EXISTS security_transactions (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  security_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  occurred_at TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_minor INTEGER NOT NULL CHECK (price_minor >= 0),
  fee_minor INTEGER NOT NULL DEFAULT 0 CHECK (fee_minor >= 0),
  cash_account_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, security_id) REFERENCES securities(ledger_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_security_transactions_security
  ON security_transactions(ledger_id, security_id, deleted_at, occurred_at DESC);
`,qa=`-- smb300 securities v2 P1: settlement portfolio, settle_at / status, funds mode fields.
-- Migration strategy for legacy MVP rows (041):
--   - Existing buy/sell keep type/qty/price/fee; settlement_status='confirmed', settle_at=occurred_at
--   - record_mode='position'; principal/proceeds backfilled from notional±fee
--   - cash_*_tx_id NULL (MVP never wrote cash legs; new confirms create legs)
--   - securities.settlement_account_id NULL until user assigns; confirm requires it
PRAGMA foreign_keys = ON;

ALTER TABLE accounts ADD COLUMN is_settlement INTEGER NOT NULL DEFAULT 0 CHECK (is_settlement IN (0, 1));

ALTER TABLE securities ADD COLUMN settlement_account_id TEXT;

ALTER TABLE categories ADD COLUMN system_key TEXT;

DROP TABLE IF EXISTS security_transactions_new;

CREATE TABLE security_transactions_new (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  security_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  occurred_at TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  price_minor INTEGER NOT NULL DEFAULT 0 CHECK (price_minor >= 0),
  fee_minor INTEGER NOT NULL DEFAULT 0 CHECK (fee_minor >= 0),
  fee_mode TEXT NOT NULL DEFAULT 'into_cost' CHECK (fee_mode IN ('into_cost', 'from_proceeds')),
  record_mode TEXT NOT NULL DEFAULT 'position' CHECK (record_mode IN ('position', 'funds')),
  principal_minor INTEGER NOT NULL DEFAULT 0 CHECK (principal_minor >= 0),
  proceeds_minor INTEGER NOT NULL DEFAULT 0 CHECK (proceeds_minor >= 0),
  settle_at TEXT,
  settlement_status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (settlement_status IN ('scheduled', 'confirmed', 'cancelled')),
  confirmed_at TEXT,
  cash_account_id TEXT,
  cash_principal_tx_id TEXT,
  cash_pnl_tx_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, security_id) REFERENCES securities(ledger_id, id) ON DELETE CASCADE
);

INSERT INTO security_transactions_new (
  ledger_id, id, security_id, type, occurred_at, quantity, price_minor, fee_minor,
  fee_mode, record_mode, principal_minor, proceeds_minor, settle_at, settlement_status,
  confirmed_at, cash_account_id, cash_principal_tx_id, cash_pnl_tx_id, note,
  created_at, updated_at, deleted_at
)
SELECT
  ledger_id,
  id,
  security_id,
  type,
  occurred_at,
  quantity,
  price_minor,
  fee_minor,
  'into_cost',
  'position',
  CASE
    WHEN type = 'buy' THEN (quantity * price_minor) + fee_minor
    ELSE CASE
      WHEN (quantity * price_minor) > fee_minor THEN (quantity * price_minor) - fee_minor
      ELSE 0
    END
  END,
  CASE
    WHEN type = 'sell' THEN
      CASE
        WHEN (quantity * price_minor) > fee_minor THEN (quantity * price_minor) - fee_minor
        ELSE 0
      END
    ELSE 0
  END,
  occurred_at,
  'confirmed',
  occurred_at,
  cash_account_id,
  NULL,
  NULL,
  note,
  created_at,
  updated_at,
  deleted_at
FROM security_transactions;

DROP TABLE security_transactions;
ALTER TABLE security_transactions_new RENAME TO security_transactions;

CREATE INDEX IF NOT EXISTS idx_security_transactions_security
  ON security_transactions(ledger_id, security_id, deleted_at, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_transactions_settle_due
  ON security_transactions(ledger_id, settlement_status, settle_at, deleted_at);

CREATE INDEX IF NOT EXISTS idx_securities_settlement_account
  ON securities(ledger_id, settlement_account_id, deleted_at);

CREATE INDEX IF NOT EXISTS idx_accounts_is_settlement
  ON accounts(ledger_id, is_settlement, deleted_at);

CREATE INDEX IF NOT EXISTS idx_categories_system_key
  ON categories(ledger_id, system_key, deleted_at);
`,za=`-- smb301 credit card system P0 (v1.1 hard contracts)
PRAGMA foreign_keys = ON;

-- Credit profile on accounts
ALTER TABLE accounts ADD COLUMN statement_close_day INTEGER
  CHECK (statement_close_day IS NULL OR (statement_close_day >= 1 AND statement_close_day <= 31));
ALTER TABLE accounts ADD COLUMN payment_due_day INTEGER
  CHECK (payment_due_day IS NULL OR (payment_due_day >= 1 AND payment_due_day <= 31));
ALTER TABLE accounts ADD COLUMN card_last4 TEXT;
ALTER TABLE accounts ADD COLUMN issuer TEXT;

-- posted_at is the ONLY field used to assign statement_id (occurred_at = budget/calendar)
ALTER TABLE transactions ADD COLUMN posted_at TEXT;
UPDATE transactions SET posted_at = occurred_at WHERE posted_at IS NULL OR posted_at = '';

-- Auto-defaults for existing credit / credit_card accounts
UPDATE accounts
SET statement_close_day = COALESCE(
      statement_close_day,
      CASE
        WHEN repayment_reminder_day IS NOT NULL AND repayment_reminder_day BETWEEN 1 AND 31
          THEN repayment_reminder_day
        ELSE 25
      END
    ),
    payment_due_day = COALESCE(
      payment_due_day,
      CASE
        WHEN repayment_reminder_day IS NOT NULL AND repayment_reminder_day BETWEEN 1 AND 31
          THEN repayment_reminder_day
        ELSE 15
      END
    ),
    updated_at = COALESCE(updated_at, strftime('%Y-%m-%dT%H:%M:%f','now'))
WHERE deleted_at IS NULL
  AND (
    account_kind = 'credit'
    OR LOWER(COALESCE(name, '')) LIKE '%credit%'
    OR LOWER(COALESCE(name, '')) LIKE '%信用卡%'
  );

UPDATE accounts
SET account_kind = 'credit',
    account_type = CASE WHEN account_type = 'asset' THEN 'liability' ELSE account_type END,
    allow_negative = 1,
    updated_at = COALESCE(updated_at, strftime('%Y-%m-%dT%H:%M:%f','now'))
WHERE deleted_at IS NULL
  AND account_kind != 'credit'
  AND group_id IN (
    SELECT id FROM account_groups
    WHERE type = 'credit_card' AND deleted_at IS NULL
  );

UPDATE accounts
SET statement_close_day = COALESCE(statement_close_day, 25),
    payment_due_day = COALESCE(payment_due_day, COALESCE(repayment_reminder_day, 15)),
    updated_at = COALESCE(updated_at, strftime('%Y-%m-%dT%H:%M:%f','now'))
WHERE deleted_at IS NULL AND account_kind = 'credit';

CREATE TABLE IF NOT EXISTS credit_statements (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  period_start_inclusive TEXT NOT NULL,
  period_end_exclusive TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  closing_balance_minor INTEGER,
  due_on TEXT,
  closed_at TEXT,
  closing_hash TEXT,
  close_token TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  UNIQUE (ledger_id, account_id, period_start_inclusive),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_statements_one_open
  ON credit_statements(ledger_id, account_id)
  WHERE status = 'open' AND deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_statements_close_token
  ON credit_statements(ledger_id, id, close_token)
  WHERE close_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_credit_statements_account_period
  ON credit_statements(ledger_id, account_id, period_start_inclusive DESC);

CREATE TABLE IF NOT EXISTS credit_repayments (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  source_account_id TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  paid_at TEXT NOT NULL,
  transfer_group_id TEXT,
  idempotency_key TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  UNIQUE (ledger_id, idempotency_key),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, source_account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_credit_repayments_account
  ON credit_repayments(ledger_id, account_id, paid_at DESC);

CREATE TABLE IF NOT EXISTS credit_repayment_allocations (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  repayment_id TEXT NOT NULL,
  statement_id TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  UNIQUE (ledger_id, repayment_id, statement_id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, repayment_id) REFERENCES credit_repayments(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, statement_id) REFERENCES credit_statements(ledger_id, id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_credit_alloc_statement
  ON credit_repayment_allocations(ledger_id, statement_id);

CREATE TABLE IF NOT EXISTS transaction_postings (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'expense_accrual', 'card_liability', 'cash_transfer', 'fee', 'adjustment', 'reversal'
  )),
  account_id TEXT,
  category_id TEXT,
  amount_minor INTEGER NOT NULL,
  statement_id TEXT,
  include_in_budget INTEGER NOT NULL DEFAULT 0 CHECK (include_in_budget IN (0, 1)),
  include_in_analysis INTEGER NOT NULL DEFAULT 0 CHECK (include_in_analysis IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, transaction_id) REFERENCES transactions(ledger_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tx_postings_tx
  ON transaction_postings(ledger_id, transaction_id);
CREATE INDEX IF NOT EXISTS idx_tx_postings_statement
  ON transaction_postings(ledger_id, statement_id, role);
CREATE INDEX IF NOT EXISTS idx_tx_posted_at
  ON transactions(ledger_id, posted_at DESC);
`,Va=`-- Sell against a specific buy lot (1:1). Remaining qty/principal are derived.
PRAGMA foreign_keys = ON;

ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;

CREATE INDEX IF NOT EXISTS idx_security_transactions_source_buy
  ON security_transactions(ledger_id, source_buy_tx_id, deleted_at);
`,Ja=`-- Wear OS Stage A: origin_type=wear CHECK, durable wear_applied identity, syncEpoch.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS wear_sync_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  sync_epoch TEXT NOT NULL,
  snapshot_revision INTEGER NOT NULL DEFAULT 0,
  ledger_revision INTEGER NOT NULL DEFAULT 0,
  catalog_revision INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO wear_sync_state (id, sync_epoch, snapshot_revision, ledger_revision, catalog_revision, updated_at)
VALUES (1, lower(hex(randomblob(16))), 0, 0, 0, strftime('%Y-%m-%dT%H:%M:%f','now'));

CREATE TABLE IF NOT EXISTS wear_applied (
  idempotency_key TEXT PRIMARY KEY,
  ledger_id TEXT NOT NULL,
  tx_id TEXT NOT NULL,
  applied_at TEXT NOT NULL,
  FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_wear_applied_ledger_tx
  ON wear_applied(ledger_id, tx_id);

-- Rebuild transactions CHECK to allow origin_type='wear'. Child FKs detached then restored (smb296: keep FK ON).
DROP TABLE IF EXISTS transactions_new;
DROP TABLE IF EXISTS _mig045_bak_tx_att;
DROP TABLE IF EXISTS _mig045_bak_tx_post;
DROP TABLE IF EXISTS _mig045_bak_adv_usage;
DROP TABLE IF EXISTS _mig045_bak_loan_gen;
DROP TABLE IF EXISTS _mig045_bak_reimb_paid;
DROP TABLE IF EXISTS _mig045_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig045_bak_bank_imported;
DROP TABLE IF EXISTS _mig045_bak_adv_source;

CREATE TABLE _mig045_bak_tx_att AS SELECT * FROM transaction_attachments;
CREATE TABLE _mig045_bak_tx_post AS SELECT * FROM transaction_postings;
CREATE TABLE _mig045_bak_adv_usage AS SELECT * FROM reimbursement_advance_usages;
CREATE TABLE _mig045_bak_loan_gen AS
  SELECT ledger_id, id, generated_tx_id FROM loan_payments WHERE generated_tx_id IS NOT NULL;
CREATE TABLE _mig045_bak_reimb_paid AS
  SELECT ledger_id, id, paid_tx_id FROM reimbursements WHERE paid_tx_id IS NOT NULL;
CREATE TABLE _mig045_bak_reimb_item_tx AS
  SELECT ledger_id, id, transaction_id FROM reimbursement_items WHERE transaction_id IS NOT NULL;
CREATE TABLE _mig045_bak_bank_imported AS
  SELECT ledger_id, id, imported_txn_id FROM bank_transactions WHERE imported_txn_id IS NOT NULL;
CREATE TABLE _mig045_bak_adv_source AS
  SELECT ledger_id, id, source_tx_id FROM reimbursement_advances WHERE source_tx_id IS NOT NULL;

UPDATE loan_payments SET generated_tx_id = NULL WHERE generated_tx_id IS NOT NULL;
UPDATE reimbursements SET paid_tx_id = NULL WHERE paid_tx_id IS NOT NULL;
UPDATE reimbursement_items SET transaction_id = NULL WHERE transaction_id IS NOT NULL;
UPDATE bank_transactions SET imported_txn_id = NULL WHERE imported_txn_id IS NOT NULL;
UPDATE reimbursement_advances SET source_tx_id = NULL WHERE source_tx_id IS NOT NULL;
DELETE FROM reimbursement_advance_usages;
DELETE FROM transaction_attachments;
DELETE FROM transaction_postings;

CREATE TABLE transactions_new (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense','income','adjustment','transfer')),
  transfer_group_id TEXT,
  account_id TEXT NOT NULL,
  peer_account_id TEXT,
  category_id TEXT,
  amount_minor INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  note TEXT,
  location TEXT,
  tags_json TEXT,
  origin_type TEXT NOT NULL DEFAULT 'manual' CHECK (origin_type IN ('manual','loan_payment','reimbursement','import','recurring','refund','wear')),
  external_ref_id TEXT,
  idempotency_key TEXT,
  include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1)),
  include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1)),
  reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed')),
  reimbursed_at TEXT,
  reimburse_target_minor INTEGER,
  created_by_user_id TEXT,
  created_by_display_name TEXT,
  updated_by_user_id TEXT,
  updated_by_display_name TEXT,
  posted_at TEXT,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, peer_account_id) REFERENCES accounts(ledger_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (ledger_id, category_id) REFERENCES categories(ledger_id, id) ON DELETE RESTRICT
);

INSERT INTO transactions_new (
  ledger_id, id, type, transfer_group_id, account_id, peer_account_id, category_id,
  amount_minor, occurred_at, note, location, tags_json, origin_type, external_ref_id,
  idempotency_key, include_in_budget, include_in_analysis, created_at, updated_at, deleted_at,
  is_reimbursable, reimbursement_state, reimbursed_at, reimburse_target_minor,
  created_by_user_id, created_by_display_name, updated_by_user_id, updated_by_display_name, posted_at
)
SELECT
  ledger_id, id, type, transfer_group_id, account_id, peer_account_id, category_id,
  amount_minor, occurred_at, note, location, tags_json, origin_type, external_ref_id,
  idempotency_key, include_in_budget, include_in_analysis, created_at, updated_at, deleted_at,
  is_reimbursable, reimbursement_state, reimbursed_at, reimburse_target_minor,
  created_by_user_id, created_by_display_name, updated_by_user_id, updated_by_display_name, posted_at
FROM transactions;

DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(ledger_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_account_date ON transactions(ledger_id, account_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_category_date ON transactions(ledger_id, category_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_transfer_group ON transactions(ledger_id, transfer_group_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tx_idempotency ON transactions(ledger_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tx_posted_at ON transactions(ledger_id, posted_at DESC);

INSERT INTO transaction_attachments SELECT * FROM _mig045_bak_tx_att;
INSERT INTO transaction_postings SELECT * FROM _mig045_bak_tx_post;
INSERT INTO reimbursement_advance_usages SELECT * FROM _mig045_bak_adv_usage;

UPDATE loan_payments
SET generated_tx_id = (
  SELECT b.generated_tx_id FROM _mig045_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig045_bak_loan_gen b
  WHERE b.ledger_id = loan_payments.ledger_id AND b.id = loan_payments.id
);

UPDATE reimbursements
SET paid_tx_id = (
  SELECT b.paid_tx_id FROM _mig045_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig045_bak_reimb_paid b
  WHERE b.ledger_id = reimbursements.ledger_id AND b.id = reimbursements.id
);

UPDATE reimbursement_items
SET transaction_id = (
  SELECT b.transaction_id FROM _mig045_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig045_bak_reimb_item_tx b
  WHERE b.ledger_id = reimbursement_items.ledger_id AND b.id = reimbursement_items.id
);

UPDATE bank_transactions
SET imported_txn_id = (
  SELECT b.imported_txn_id FROM _mig045_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig045_bak_bank_imported b
  WHERE b.ledger_id = bank_transactions.ledger_id AND b.id = bank_transactions.id
);

UPDATE reimbursement_advances
SET source_tx_id = (
  SELECT b.source_tx_id FROM _mig045_bak_adv_source b
  WHERE b.ledger_id = reimbursement_advances.ledger_id AND b.id = reimbursement_advances.id
)
WHERE EXISTS (
  SELECT 1 FROM _mig045_bak_adv_source b
  WHERE b.ledger_id = reimbursement_advances.ledger_id AND b.id = reimbursement_advances.id
);

DROP TABLE IF EXISTS _mig045_bak_tx_att;
DROP TABLE IF EXISTS _mig045_bak_tx_post;
DROP TABLE IF EXISTS _mig045_bak_adv_usage;
DROP TABLE IF EXISTS _mig045_bak_loan_gen;
DROP TABLE IF EXISTS _mig045_bak_reimb_paid;
DROP TABLE IF EXISTS _mig045_bak_reimb_item_tx;
DROP TABLE IF EXISTS _mig045_bak_bank_imported;
DROP TABLE IF EXISTS _mig045_bak_adv_source;

-- Revision bumps at the SQLite layer so Vue, native Wear engine, and restore stay aligned.
CREATE TRIGGER IF NOT EXISTS trg_wear_rev_tx_ai
AFTER INSERT ON transactions
BEGIN
  UPDATE wear_sync_state
     SET snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_tx_au
AFTER UPDATE ON transactions
BEGIN
  UPDATE wear_sync_state
     SET snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_account_ai
AFTER INSERT ON accounts
BEGIN
  UPDATE wear_sync_state
     SET catalog_revision = catalog_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_account_au
AFTER UPDATE ON accounts
BEGIN
  UPDATE wear_sync_state
     SET catalog_revision = catalog_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_category_ai
AFTER INSERT ON categories
BEGIN
  UPDATE wear_sync_state
     SET catalog_revision = catalog_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_category_au
AFTER UPDATE ON categories
BEGIN
  UPDATE wear_sync_state
     SET catalog_revision = catalog_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_ledger_ai
AFTER INSERT ON ledgers
BEGIN
  UPDATE wear_sync_state
     SET ledger_revision = ledger_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS trg_wear_rev_ledger_au
AFTER UPDATE ON ledgers
BEGIN
  UPDATE wear_sync_state
     SET ledger_revision = ledger_revision + 1,
         snapshot_revision = snapshot_revision + 1,
         updated_at = strftime('%Y-%m-%dT%H:%M:%f','now')
   WHERE id = 1;
END;
`,Za=`-- Migration 046 — bank sync Architecture B account checkpoints
-- Account-level watermark / status (v1.1.1)
ALTER TABLE bank_accounts ADD COLUMN last_success_sync_at TEXT;
ALTER TABLE bank_accounts ADD COLUMN sync_cursor TEXT;
ALTER TABLE bank_accounts ADD COLUMN last_sync_status TEXT NOT NULL DEFAULT 'idle';
ALTER TABLE bank_accounts ADD COLUMN last_error TEXT;

-- Connection aggregate + opt-in auto-import
ALTER TABLE bank_connections ADD COLUMN last_attempt_at TEXT;
ALTER TABLE bank_connections ADD COLUMN last_full_success_at TEXT;
ALTER TABLE bank_connections ADD COLUMN auto_import_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bank_transactions ADD COLUMN identity_scheme TEXT;

-- Best-effort backfill: copy connection last_sync_at onto enabled accounts
UPDATE bank_accounts
SET last_success_sync_at = (
  SELECT c.last_sync_at FROM bank_connections c
  WHERE c.ledger_id = bank_accounts.ledger_id
    AND c.id = bank_accounts.connection_id
    AND c.deleted_at IS NULL
  LIMIT 1
)
WHERE IFNULL(last_success_sync_at, '') = ''
  AND enabled = 1
  AND deleted_at IS NULL;

UPDATE bank_connections
SET last_full_success_at = last_sync_at
WHERE IFNULL(last_full_success_at, '') = ''
  AND IFNULL(last_sync_at, '') != ''
  AND deleted_at IS NULL;
`,Qa=`-- Migration 047: restore deleted_log triggers lost by rebuild-by-rename
-- (026 / 045 DROP TABLE transactions) and cover SNAPSHOT_TABLE_ORDER tables
-- added after 018 that never received trg_deleted_log_*.
-- CREATE TRIGGER IF NOT EXISTS is idempotent for already-patched databases.

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_transactions
AFTER DELETE ON transactions
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'transactions',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.occurred_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_transaction_postings
AFTER DELETE ON transaction_postings
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'transaction_postings',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_budget_save_settlements
AFTER DELETE ON budget_save_settlements
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'budget_save_settlements',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_budget_containers
AFTER DELETE ON budget_containers
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'budget_containers',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_securities
AFTER DELETE ON securities
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'securities',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_security_transactions
AFTER DELETE ON security_transactions
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'security_transactions',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.occurred_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_credit_statements
AFTER DELETE ON credit_statements
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'credit_statements',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_credit_repayments
AFTER DELETE ON credit_repayments
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'credit_repayments',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.paid_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_credit_repayment_allocations
AFTER DELETE ON credit_repayment_allocations
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'credit_repayment_allocations',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.deleted_at, OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;
`,ei=`-- Migration 048: soft-delete postings when parent transaction is soft-deleted.
-- FK ON DELETE CASCADE never fires for app-level deleted_at (DB-002 / DB-014).

DROP TRIGGER IF EXISTS trg_tx_soft_delete_postings;
CREATE TRIGGER trg_tx_soft_delete_postings
AFTER UPDATE OF deleted_at ON transactions
WHEN OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL
BEGIN
  UPDATE transaction_postings
     SET deleted_at = NEW.deleted_at,
         updated_at = COALESCE(NEW.updated_at, NEW.deleted_at)
   WHERE ledger_id = NEW.ledger_id
     AND transaction_id = NEW.id
     AND deleted_at IS NULL;
END;

DROP TRIGGER IF EXISTS trg_tx_soft_restore_postings;
CREATE TRIGGER trg_tx_soft_restore_postings
AFTER UPDATE OF deleted_at ON transactions
WHEN OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL
BEGIN
  UPDATE transaction_postings
     SET deleted_at = NULL,
         updated_at = COALESCE(NEW.updated_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
   WHERE ledger_id = NEW.ledger_id
     AND transaction_id = NEW.id
     AND deleted_at IS NOT NULL;
END;

UPDATE transaction_postings
   SET deleted_at = (
         SELECT t.deleted_at
           FROM transactions t
          WHERE t.ledger_id = transaction_postings.ledger_id
            AND t.id = transaction_postings.transaction_id
            AND t.deleted_at IS NOT NULL
       ),
       updated_at = COALESCE(updated_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
 WHERE deleted_at IS NULL
   AND EXISTS (
         SELECT 1
           FROM transactions t
          WHERE t.ledger_id = transaction_postings.ledger_id
            AND t.id = transaction_postings.transaction_id
            AND t.deleted_at IS NOT NULL
       );
`,ti=`ALTER TABLE budget_containers ADD COLUMN surplus_mode TEXT NOT NULL DEFAULT 'roll';

UPDATE budget_containers
SET surplus_mode = 'save'
WHERE budget_save_enabled = 1;
`,ni=`ALTER TABLE reimbursements ADD COLUMN paid_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE reimbursement_items ADD COLUMN settled_minor INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS reimbursement_payments (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  reimbursement_id TEXT NOT NULL,
  account_id TEXT,
  paid_at TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  generated_tx_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, reimbursement_id) REFERENCES reimbursements(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, account_id) REFERENCES accounts(ledger_id, id) ON DELETE SET NULL,
  FOREIGN KEY (ledger_id, generated_tx_id) REFERENCES transactions(ledger_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reimbursement_payment_allocations (
  ledger_id TEXT NOT NULL,
  id TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (ledger_id, id),
  FOREIGN KEY (ledger_id, payment_id) REFERENCES reimbursement_payments(ledger_id, id) ON DELETE CASCADE,
  FOREIGN KEY (ledger_id, item_id) REFERENCES reimbursement_items(ledger_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reim_payments_claim
  ON reimbursement_payments(ledger_id, reimbursement_id, paid_at);
CREATE INDEX IF NOT EXISTS idx_reim_pay_alloc_payment
  ON reimbursement_payment_allocations(ledger_id, payment_id);

UPDATE reimbursement_items
SET settled_minor = amount_minor
WHERE reimbursement_id IN (
  SELECT id FROM reimbursements WHERE status = 'paid' AND deleted_at IS NULL
)
AND settled_minor = 0;

UPDATE reimbursements
SET paid_minor = total_minor
WHERE status = 'paid'
  AND deleted_at IS NULL
  AND paid_minor = 0
  AND total_minor > 0;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursement_payments
AFTER DELETE ON reimbursement_payments
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursement_payments',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.paid_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_deleted_log_reimbursement_payment_allocations
AFTER DELETE ON reimbursement_payment_allocations
BEGIN
  INSERT INTO deleted_log (ledger_id, table_name, row_pk, payload_json, deleted_at)
  VALUES (
    OLD.ledger_id,
    'reimbursement_payment_allocations',
    OLD.id,
    json_object('id', OLD.id),
    COALESCE(OLD.updated_at, OLD.created_at, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
END;
`;function ri(e){const t=[];let n="",a="",r="",i=!1,o=!1,s=!1,c=!1,d="";const E=()=>{if(!a)return;const T=a.toUpperCase();T==="TRIGGER"&&n.toUpperCase().includes("CREATE")&&(i=!0),r=T,a=""},u=()=>{const T=n.trim();T&&t.push(T),n="",a="",r="",i=!1,o=!1,s=!1,c=!1,d=""};for(let T=0;T<e.length;T+=1){const g=e[T],L=e[T+1];if(o){g===`
`?(s||(n+=g),o=!1,s=!1):s||(n+=g);continue}if(c){n+=g,g==="*"&&L==="/"&&(n+=L,T+=1,c=!1);continue}if(d){n+=g,g===d&&(d==="'"&&L==="'"?(n+=L,T+=1):d="");continue}if(g==="-"&&L==="-"){n+=g,n+=L,T+=1,E(),o=!0,s=!1;continue}if(g==="#"){E(),o=!0,s=!0;continue}if(g==="/"&&L==="*"){n+=g,n+=L,T+=1,E(),c=!0;continue}if(n+=g,g==="'"||g==='"'||g==="`"){E(),d=g;continue}/[A-Za-z0-9_]/.test(g)?a+=g:E(),g===";"&&(!i||r==="END")&&u()}return E(),u(),t}function Pt(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("duplicate column name")||t.includes("already exists")||t.includes("duplicate index name")}function ai(e){return ri(e).map(t=>({statement:t,values:[]}))}async function Te(e,t){await e.executeSet([{statement:t,values:[]}])}function ii(e){return`mig_sp_${e}`}function oi(e){return typeof e?.beginTransaction=="function"}function si(e){return/^\s*ALTER\s+TABLE\b/i.test(String(e??""))}async function di(e,t){for(const n of t)try{await e.executeSet([n])}catch(a){if(!Pt(a))throw a}}async function ci(e,t){let n=!1;try{await Te(e,"BEGIN;"),n=!0}catch{}try{for(let a=0;a<t.length;a+=1){const r=t[a],i=si(r.statement),o=ii(a);i&&await Te(e,`SAVEPOINT ${o};`);try{await e.executeSet([r]),i&&await Te(e,`RELEASE ${o};`)}catch(s){if(i){try{await Te(e,`ROLLBACK TO ${o};`)}catch{}try{await Te(e,`RELEASE ${o};`)}catch{}}if(!Pt(s))throw s}}n&&await Te(e,"COMMIT;")}catch(a){if(n)try{await Te(e,"ROLLBACK;")}catch{}throw a}}async function _i(e,t){const n=ai(t);if(n.length){if(oi(e)){await di(e,n);return}await ci(e,n)}}const Ei=Object.freeze([20,21,22,27,29]);function ui(e){const t=new Set(Ei),n=[...new Set((e??[]).map(a=>Number(a?.version)).filter(a=>t.has(a)))].sort((a,r)=>a-r);if(n.length>0)throw new Error(`Do NOT reuse reserved migration versions ${n.join(", ")} — existing devices would skip the new SQL.`)}const li="APP_DOWNGRADE_BLOCKED",Mn="data_floor_app_version",Bn="data_floor_schema_version",jt="straw.data_floor.v1";function xn(){return String(ta?.version).trim()}function Tn(e){const t=String(e??"").trim().replace(/^v/i,"").match(/\d+/g);return t?.length?t.map(n=>Number.parseInt(String(n),10)).map(n=>Number.isFinite(n)?Math.max(0,n):0):[]}function ht(e,t){const n=Tn(e),a=Tn(t),r=Math.max(n.length,a.length,3);for(let i=0;i<r;i+=1){const o=Number(n[i]??0),s=Number(a[i]??0);if(o>s)return 1;if(o<s)return-1}return 0}function Ti(e={}){const t=String(e.reason??"unknown").trim()||"unknown",n=String(e.floorAppVersion??"").trim(),a=String(e.currentAppVersion??"").trim(),r=Number(e.floorSchemaVersion??0),i=Number(e.knownSchemaMax??0);let o="偵測到本機資料曾由較新版本寫入。為避免資料回損，已阻止此舊版開啟帳本。請改安裝相同或更新的版本。";t==="schema_ahead"?o=`本機資料庫 schema（${r}）高於此 App 支援上限（${i}）。為避免資料回損，已阻止開啟。請改安裝較新版本。`:t==="app_version_ahead"&&n&&a&&(o=`本機資料曾由 App ${n} 寫入，目前版本為 ${a}。為避免資料回損，已阻止開啟。請改安裝 ${n} 或更新版本。`);const s=new Error(o);return s.code=li,s.i18nKey="app.downgrade_blocked",s.reason=t,s.floorAppVersion=n||null,s.currentAppVersion=a||null,s.floorSchemaVersion=Number.isFinite(r)?r:null,s.knownSchemaMax=Number.isFinite(i)?i:null,s.recoverable=!1,s.silentWipeBlocked=!0,s}function Ht(){try{return globalThis.localStorage??null}catch{return null}}function Gn(){const e=Ht();if(!e)return{appVersion:"",schemaVersion:0};try{const t=e.getItem(jt);if(!t)return{appVersion:"",schemaVersion:0};const n=JSON.parse(t);return{appVersion:String(n?.appVersion??"").trim(),schemaVersion:Number.parseInt(String(n?.schemaVersion??"0"),10)||0}}catch{return{appVersion:"",schemaVersion:0}}}function mi({appVersion:e,schemaVersion:t}={}){const n=Ht();if(!n)return;const a=String(e??"").trim(),r=Number.parseInt(String(t??"0"),10)||0,i=Gn(),o=a&&(!i.appVersion||ht(a,i.appVersion)>0)?a:i.appVersion,s=Math.max(i.schemaVersion||0,r||0);try{n.setItem(jt,JSON.stringify({appVersion:o,schemaVersion:s,updatedAt:new Date().toISOString()}))}catch{}}function gi(){const e=Ht();if(e)try{e.removeItem(jt)}catch{}}function Li({knownSchemaMax:e,dbMaxSchemaVersion:t=0,floorSchemaVersion:n=0,prefsSchemaVersion:a=0,floorAppVersion:r="",prefsAppVersion:i="",currentAppVersion:o=""}={}){const s=Number(e??0)||0,c=Number(t??0)||0,d=Math.max(Number(n??0)||0,Number(a??0)||0,c);if(s>0&&d>s)return{reason:"schema_ahead",floorSchemaVersion:d,knownSchemaMax:s,currentAppVersion:o,floorAppVersion:r||i||""};const E=(()=>{const T=String(r??"").trim(),g=String(i??"").trim();return T&&g?ht(T,g)>=0?T:g:T||g})(),u=String(o??"").trim();return E&&u&&ht(u,E)<0?{reason:"app_version_ahead",floorAppVersion:E,currentAppVersion:u,floorSchemaVersion:d,knownSchemaMax:s}:null}function Ni(e={}){const t=Li(e);if(t)throw Ti(t)}const Kt=[{version:1,name:"init_schema",sql:ua},{version:2,name:"transaction_reimbursement_flags",sql:la},{version:3,name:"transaction_budget_analysis_flags",sql:Ta},{version:4,name:"account_category_icons",sql:ma},{version:5,name:"default_icons_backfill",sql:ga},{version:6,name:"ledger_sort_order",sql:La},{version:7,name:"remove_default_sample_transaction",sql:Na},{version:8,name:"bank_sync",sql:pa},{version:9,name:"allow_zero_amount_transaction",sql:fa},{version:10,name:"account_include_in_assets",sql:Aa},{version:11,name:"reimbursement_advances",sql:Oa},{version:12,name:"reimbursement_item_entry_type",sql:Ra},{version:13,name:"budget_item_daily_rules",sql:Sa},{version:14,name:"reimbursement_advance_category",sql:ba},{version:15,name:"savings_jars",sql:ya},{version:16,name:"loan_payment_interest_tx",sql:Da},{version:17,name:"account_credit_profile",sql:Ia},{version:18,name:"shared_sync_deleted_log",sql:Ca},{version:19,name:"bank_transaction_metadata",sql:Ua},{version:23,name:"reimbursement_item_advance_source",sql:ha},{version:24,name:"savings_jars_auto_save",sql:wa},{version:25,name:"budget_save",sql:va},{version:26,name:"transaction_origin_type_refund",sql:ka},{version:28,name:"advance_return_amount",sql:Xa},{version:30,name:"account_group_statistics",sql:Fa},{version:31,name:"remove_invoice_carrier",sql:Ma},{version:32,name:"einvoice_import",sql:Ba},{version:33,name:"einvoice_credential_password_iv",sql:xa},{version:34,name:"budget_containers",sql:Ga},{version:35,name:"category_default_flags",sql:Pa},{version:36,name:"transaction_reimburse_target",sql:ja},{version:37,name:"einvoice_carrier_sync",sql:Ha},{version:38,name:"budget_container_period_mode",sql:Ka},{version:39,name:"budget_pay_cycle",sql:Ya},{version:40,name:"transaction_editor_attribution",sql:Wa},{version:41,name:"securities",sql:$a},{version:42,name:"securities_settlement_v2",sql:qa},{version:43,name:"credit_card_system_p0",sql:za},{version:44,name:"security_sell_source_buy",sql:Va},{version:45,name:"wear_companion",sql:Ja},{version:46,name:"bank_sync_account_checkpoints",sql:Za},{version:47,name:"restore_deleted_log_triggers",sql:Qa},{version:48,name:"soft_delete_transaction_postings",sql:ei},{version:49,name:"budget_container_surplus_mode",sql:ti},{version:50,name:"claim_sheet_payments",sql:ni}];ui(Kt);function Pn(){return Kt.reduce((e,t)=>Math.max(e,Number(t.version)||0),0)}const mn="legacy_schema_patched_v1",pi={ledgers:["ALTER TABLE ledgers ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE ledgers ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Taipei';","ALTER TABLE ledgers ADD COLUMN color TEXT;","ALTER TABLE ledgers ADD COLUMN icon TEXT;","ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN created_at TEXT;","ALTER TABLE ledgers ADD COLUMN updated_at TEXT;","ALTER TABLE ledgers ADD COLUMN deleted_at TEXT;"],account_groups:["ALTER TABLE account_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE account_groups ADD COLUMN created_at TEXT;","ALTER TABLE account_groups ADD COLUMN updated_at TEXT;"],accounts:["ALTER TABLE accounts ADD COLUMN group_id TEXT;","ALTER TABLE accounts ADD COLUMN account_type TEXT NOT NULL DEFAULT 'asset';","ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';","ALTER TABLE accounts ADD COLUMN allow_negative INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN opening_balance_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE accounts ADD COLUMN icon TEXT;","ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;","ALTER TABLE accounts ADD COLUMN statement_close_day INTEGER;","ALTER TABLE accounts ADD COLUMN payment_due_day INTEGER;","ALTER TABLE accounts ADD COLUMN card_last4 TEXT;","ALTER TABLE accounts ADD COLUMN issuer TEXT;","ALTER TABLE accounts ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN deleted_at TEXT;","ALTER TABLE accounts ADD COLUMN created_at TEXT;","ALTER TABLE accounts ADD COLUMN updated_at TEXT;"],category_groups:["ALTER TABLE category_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE category_groups ADD COLUMN created_at TEXT;","ALTER TABLE category_groups ADD COLUMN updated_at TEXT;"],categories:["ALTER TABLE categories ADD COLUMN group_id TEXT;","ALTER TABLE categories ADD COLUMN kind TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE categories ADD COLUMN icon TEXT;","ALTER TABLE categories ADD COLUMN is_budgetable INTEGER NOT NULL DEFAULT 1;","ALTER TABLE categories ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN deleted_at TEXT;","ALTER TABLE categories ADD COLUMN created_at TEXT;","ALTER TABLE categories ADD COLUMN updated_at TEXT;"],transactions:["ALTER TABLE transactions ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE transactions ADD COLUMN transfer_group_id TEXT;","ALTER TABLE transactions ADD COLUMN account_id TEXT;","ALTER TABLE transactions ADD COLUMN peer_account_id TEXT;","ALTER TABLE transactions ADD COLUMN category_id TEXT;","ALTER TABLE transactions ADD COLUMN amount_minor INTEGER;","ALTER TABLE transactions ADD COLUMN occurred_at TEXT;","ALTER TABLE transactions ADD COLUMN posted_at TEXT;","ALTER TABLE transactions ADD COLUMN note TEXT;","ALTER TABLE transactions ADD COLUMN location TEXT;","ALTER TABLE transactions ADD COLUMN tags_json TEXT;","ALTER TABLE transactions ADD COLUMN origin_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE transactions ADD COLUMN external_ref_id TEXT;","ALTER TABLE transactions ADD COLUMN idempotency_key TEXT;","ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN deleted_at TEXT;","ALTER TABLE transactions ADD COLUMN created_at TEXT;","ALTER TABLE transactions ADD COLUMN updated_at TEXT;","ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;"],transaction_attachments:["ALTER TABLE transaction_attachments ADD COLUMN file_uri TEXT;","ALTER TABLE transaction_attachments ADD COLUMN mime_type TEXT;","ALTER TABLE transaction_attachments ADD COLUMN file_size INTEGER;","ALTER TABLE transaction_attachments ADD COLUMN checksum TEXT;","ALTER TABLE transaction_attachments ADD COLUMN created_at TEXT;"],counterparties:["ALTER TABLE counterparties ADD COLUMN contact_json TEXT;","ALTER TABLE counterparties ADD COLUMN note TEXT;","ALTER TABLE counterparties ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE counterparties ADD COLUMN created_at TEXT;","ALTER TABLE counterparties ADD COLUMN updated_at TEXT;"],loans:["ALTER TABLE loans ADD COLUMN counterparty_id TEXT;","ALTER TABLE loans ADD COLUMN direction TEXT NOT NULL DEFAULT 'lend';","ALTER TABLE loans ADD COLUMN principal_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE loans ADD COLUMN interest_rule_json TEXT;","ALTER TABLE loans ADD COLUMN start_date TEXT;","ALTER TABLE loans ADD COLUMN due_date TEXT;","ALTER TABLE loans ADD COLUMN status TEXT NOT NULL DEFAULT 'active';","ALTER TABLE loans ADD COLUMN settled_at TEXT;","ALTER TABLE loans ADD COLUMN note TEXT;","ALTER TABLE loans ADD COLUMN created_at TEXT;","ALTER TABLE loans ADD COLUMN updated_at TEXT;","ALTER TABLE loans ADD COLUMN deleted_at TEXT;"],loan_payments:["ALTER TABLE loan_payments ADD COLUMN loan_id TEXT;","ALTER TABLE loan_payments ADD COLUMN account_id TEXT;","ALTER TABLE loan_payments ADD COLUMN paid_at TEXT;","ALTER TABLE loan_payments ADD COLUMN amount_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN principal_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN interest_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN generated_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN note TEXT;","ALTER TABLE loan_payments ADD COLUMN created_at TEXT;","ALTER TABLE loan_payments ADD COLUMN updated_at TEXT;"],reimbursements:["ALTER TABLE reimbursements ADD COLUMN title TEXT;","ALTER TABLE reimbursements ADD COLUMN counterparty_id TEXT;","ALTER TABLE reimbursements ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';","ALTER TABLE reimbursements ADD COLUMN submitted_at TEXT;","ALTER TABLE reimbursements ADD COLUMN approved_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_tx_id TEXT;","ALTER TABLE reimbursements ADD COLUMN total_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE reimbursements ADD COLUMN note TEXT;","ALTER TABLE reimbursements ADD COLUMN idempotency_key TEXT;","ALTER TABLE reimbursements ADD COLUMN created_at TEXT;","ALTER TABLE reimbursements ADD COLUMN updated_at TEXT;","ALTER TABLE reimbursements ADD COLUMN deleted_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_minor INTEGER NOT NULL DEFAULT 0;"],reimbursement_items:["ALTER TABLE reimbursement_items ADD COLUMN source_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE reimbursement_items ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE reimbursement_items ADD COLUMN transaction_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN category_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN account_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN description TEXT;","ALTER TABLE reimbursement_items ADD COLUMN amount_minor INTEGER;","ALTER TABLE reimbursement_items ADD COLUMN occurred_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN attachment_uri TEXT;","ALTER TABLE reimbursement_items ADD COLUMN created_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN updated_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN settled_minor INTEGER NOT NULL DEFAULT 0;"],reimbursement_advances:["ALTER TABLE reimbursement_advances ADD COLUMN category_id TEXT;"],budgets:["ALTER TABLE budgets ADD COLUMN name TEXT;","ALTER TABLE budgets ADD COLUMN include_transfers INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_loan_repayments INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_reimbursed_expenses INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_target_account_id TEXT;","ALTER TABLE budgets ADD COLUMN budget_save_total_source_account_id TEXT;","ALTER TABLE budgets ADD COLUMN created_at TEXT;","ALTER TABLE budgets ADD COLUMN updated_at TEXT;","ALTER TABLE budgets ADD COLUMN deleted_at TEXT;"],budget_items:["ALTER TABLE budget_items ADD COLUMN scope_type TEXT NOT NULL DEFAULT 'category';","ALTER TABLE budget_items ADD COLUMN category_id TEXT;","ALTER TABLE budget_items ADD COLUMN category_group_id TEXT;","ALTER TABLE budget_items ADD COLUMN amount_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed';","ALTER TABLE budget_items ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none';","ALTER TABLE budget_items ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';","ALTER TABLE budget_items ADD COLUMN budget_save_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN budget_save_target_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN budget_save_source_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN created_at TEXT;","ALTER TABLE budget_items ADD COLUMN updated_at TEXT;"],savings_jars:["ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;"],app_settings:["ALTER TABLE app_settings ADD COLUMN value_json TEXT;","ALTER TABLE app_settings ADD COLUMN updated_at TEXT;"],deleted_log:["ALTER TABLE deleted_log ADD COLUMN payload_json TEXT;","ALTER TABLE deleted_log ADD COLUMN deleted_at TEXT;"],security_transactions:["ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;"]};async function te(e,t){return!!(await e.query(`SELECT 1 AS ok
     FROM sqlite_master
     WHERE type = 'table'
       AND name = ?
     LIMIT 1;`,[t]))?.values?.length}async function fi(e,t,n){if(await te(e,t))for(const a of n)try{await e.execute(a)}catch(r){if(!Pt(r))throw r}}async function Ai(e){for(const[n,a]of Object.entries(pi))await fi(e,n,a);const t="strftime('%Y-%m-%dT%H:%M:%fZ','now')";await te(e,"transactions")&&(await e.execute(`UPDATE transactions
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t});`),await e.execute(`UPDATE transactions
       SET occurred_at = COALESCE(occurred_at, created_at, updated_at, ${t}),
           amount_minor = COALESCE(amount_minor, 0),
           origin_type = COALESCE(origin_type, 'manual'),
           include_in_budget = COALESCE(include_in_budget, 1),
           include_in_analysis = COALESCE(include_in_analysis, 1);`),await e.execute(`UPDATE transactions
       SET include_in_budget = 0,
           include_in_analysis = 0
       WHERE origin_type = 'reimbursement';`)),await te(e,"budgets")&&await e.execute(`UPDATE budgets
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           include_transfers = COALESCE(include_transfers, 0),
           include_loan_repayments = COALESCE(include_loan_repayments, 0),
           include_reimbursed_expenses = COALESCE(include_reimbursed_expenses, 0),
           budget_save_total_enabled = COALESCE(budget_save_total_enabled, 0);`),await te(e,"budget_items")&&await e.execute(`UPDATE budget_items
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           amount_minor = COALESCE(amount_minor, 0),
           amount_mode = COALESCE(amount_mode, 'fixed'),
           day_rule_unit = COALESCE(day_rule_unit, 'none'),
           day_rule_values_json = COALESCE(day_rule_values_json, '[]'),
           budget_save_enabled = COALESCE(budget_save_enabled, 0);`),await te(e,"accounts")&&await e.execute(`UPDATE accounts
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           opening_balance_minor = COALESCE(opening_balance_minor, 0),
           account_type = COALESCE(account_type, 'asset'),
           allow_negative = COALESCE(allow_negative, 0),
           include_in_assets = COALESCE(include_in_assets, 1),
           include_in_group_statistics = COALESCE(include_in_group_statistics, 1),
           currency_code = COALESCE(currency_code, 'TWD'),
           is_archived = COALESCE(is_archived, 0);`),await te(e,"ledgers")&&await e.execute(`UPDATE ledgers
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           is_archived = COALESCE(is_archived, 0),
           currency_code = COALESCE(currency_code, 'TWD'),
           timezone = COALESCE(timezone, 'Asia/Taipei');`),await te(e,"categories")&&await e.execute(`UPDATE categories
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           kind = COALESCE(kind, 'expense'),
           is_budgetable = COALESCE(is_budgetable, 1),
           is_archived = COALESCE(is_archived, 0);`),await te(e,"app_settings")&&await e.execute(`UPDATE app_settings
       SET value_json = COALESCE(value_json, '{}'),
           updated_at = COALESCE(updated_at, ${t});`),await te(e,"savings_jars")&&await e.execute(`UPDATE savings_jars
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           auto_save_paused = COALESCE(auto_save_paused, 0);`)}async function Oi(e){await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `)}async function wt(e,t){const n=await e.query(`SELECT value
     FROM schema_meta
     WHERE key = ?
     LIMIT 1;`,[t]);return String(n?.values?.[0]?.value??"")}async function vt(e,t,n){await e.run(`INSERT INTO schema_meta (key, value, updated_at)
     VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = excluded.updated_at;`,[t,String(n??"")])}async function jn(e){try{const t=await e.query("SELECT MAX(version) AS max_version FROM schema_migrations;");return Number.parseInt(String(t?.values?.[0]?.max_version??"0"),10)||0}catch{return 0}}async function Ri(e){const t=Pn(),n=await jn(e),a=await wt(e,Mn).catch(()=>""),r=await wt(e,Bn).catch(()=>""),i=Number.parseInt(String(r||"0"),10)||0,o=Gn();Ni({knownSchemaMax:t,dbMaxSchemaVersion:n,floorSchemaVersion:i,prefsSchemaVersion:o.schemaVersion,floorAppVersion:a,prefsAppVersion:o.appVersion,currentAppVersion:xn()})}async function Si(e){const t=Pn(),n=await jn(e),a=Math.max(t,n),r=xn();r&&await vt(e,Mn,r),await vt(e,Bn,String(a)),mi({appVersion:r,schemaVersion:a})}async function bi(e){await Oi(e),await wt(e,mn).then(r=>r==="1").catch(()=>!1)||(await Ai(e),await vt(e,mn,"1")),await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `),await Ri(e);const n=await e.query("SELECT version FROM schema_migrations ORDER BY version ASC;"),a=new Set((n?.values??[]).map(r=>r.version));for(const r of Kt)a.has(r.version)||(await _i(e,r.sql),await e.run("INSERT INTO schema_migrations (version, name) VALUES (?, ?);",[r.version,r.name]));await Si(e)}let yi=1,nt=null;function Di(){const e=yi++;return{id:`txctx_${e}_${Date.now().toString(36)}`,token:`tok_${e}_${Math.random().toString(36).slice(2,10)}`,depth:0,status:"open"}}function Hn(){return nt}async function Ii(e,t){const n=nt;nt=e;try{return await t()}finally{nt=n}}class Ci{constructor(){this._tail=Promise.resolve(),this._pending=0}get pendingCount(){return this._pending}enqueue(t){this._pending+=1;const n=this._tail.then(()=>t());return this._tail=n.then(()=>{this._pending=Math.max(0,this._pending-1)},()=>{this._pending=Math.max(0,this._pending-1)}),n}}const Ui=new Ci,hi="/app/assets".replace(/\/{2,}/g,"/");let ke=null,Rt=null;async function wi(){if(!customElements.get("jeep-sqlite")){if(Rt||(Rt=(async()=>{try{await Qr(window)}catch(e){console.warn("[sqlite] loader registration failed, fallback to esm bundle",e),await hn(()=>import("./vendor-sqlite-CnPD_Y5r.js").then(t=>t.j),[])}})()),await Rt,!customElements.get("jeep-sqlite"))throw new Error("jeep-sqlite custom element registration failed");await customElements.whenDefined("jeep-sqlite")}}async function vi(){if(S.getPlatform()==="web")return ke||(ke=(async()=>{await wi();const e=document.querySelector("jeep-sqlite")??document.createElement("jeep-sqlite");e.setAttribute("wasm-path",hi),e.parentElement||document.body.appendChild(e),await Promise.resolve(),await new Un(wn).initWebStore()})().catch(e=>{throw ke=null,e}),ke)}const ki=Object.freeze({USER_RESET_ALL:"user_reset_all",USER_IMPORT_JSON:"user_import_json",USER_RESTORE_GOOGLE_BACKUP:"user_restore_google_backup",USER_RESTORE_WEBDAV_BACKUP:"user_restore_webdav_backup",USER_RESTORE_LOCAL_RECOVERY:"user_restore_local_recovery"}),Xi="LOCAL_DB_INTEGRITY",Fi="EMPTY_REMOTE_REPLACE_BLOCKED",Mi="DATA_WIPE_DENIED",Kn="straw.data_wipe_audit.v1",Yt=40,Bi=new Set(Object.values(ki));function St(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機資料庫無法安全開啟。系統不會自動清空帳本；請從備份／Google Drive／匯入還原，或至資料管理明確重設。",r=new Error(a);if(r.code=Xi,r.i18nKey=t.i18nKey||"app.local_db_integrity",r.originalMessage=n,r.recoverable=!1,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function bd(e={}){const t=Number(e.localTransactionCount??0),n=Number(e.remoteTransactionCount??0),a=String(e.message??"").trim()||`遠端帳本快照交易數（${n}）為空，但本機仍有 ${t} 筆交易；已阻止覆蓋以避免 silent wipe。請改用合併同步、從備份還原，或在確認後以匯入／重設路徑處理。`,r=new Error(a);return r.code=Fi,r.i18nKey=e.i18nKey||"settings_google_sync.error.empty_remote_replace_blocked",r.localTransactionCount=t,r.remoteTransactionCount=n,r.silentWipeBlocked=!0,r}function xi(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!Bi.has(t)||!n){const r=new Error("本機資料清空被拒絕：缺少使用者確認或合法 wipe 理由。FK／migration／bootstrap 不得靜默 wipe。");throw r.code=Mi,r.i18nKey="sqlite.error.data_wipe_denied",r.silentWipeBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function Gi(){if(typeof localStorage>"u")return[];try{const e=localStorage.getItem(Kn),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function Pi(e){if(!(typeof localStorage>"u"))try{localStorage.setItem(Kn,JSON.stringify(e.slice(0,Yt)))}catch{}}function ji(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),confirmed:e.confirmed===!0,note:String(e.note??"").slice(0,240)},n=[t,...Gi()].slice(0,Yt);return Pi(n),typeof console<"u"&&typeof console.info=="function"&&console.info("[data-wipe-audit]",t),t}const Wt="RECOVERY_BACKUP_REQUIRED";function bt(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機 recovery 備份建立失敗，已中止清空本機資料。請先手動匯出備份後再重試還原／匯入／重設。",r=new Error(a);if(r.code=Wt,r.i18nKey=t.i18nKey||"settings_data.toast.recovery_backup_required",r.source=String(t.source??"").trim(),r.originalMessage=n,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}async function Hi(e,t={}){if(typeof e!="function")throw bt(new Error("recovery backup creator missing"),t);let n;try{n=await e()}catch(a){throw a?.code===Wt?a:bt(a,t)}if(!Fn(n))throw bt(new Error("recovery backup proof missing or unverified (download-only / memory are not durable)"),t);return n}async function Ki({createRecoveryBackup:e,wipeFn:t,source:n,i18nKey:a}={}){const r=await Hi(e,{source:n,i18nKey:a});if(typeof t!="function")throw new Error("wipe function missing after recovery backup");return await t(),r}function yd(e){const t=e?.tables?.transactions;return Array.isArray(t)?t.filter(n=>!n?.deleted_at).length:0}const Yi=Object.freeze({USER_EXPLICIT:"user_explicit_repair",USER_IMPORT_JSON:"user_import_integrity_repair",USER_RESTORE_BACKUP:"user_restore_integrity_repair"}),Wi=new Set(Object.values(Yi)),Yn="straw.ledger_integrity_scan.v1",gn="straw.ledger_repair_audit.v1",$i="LEDGER_REPAIR_DENIED";function Dd(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!Wi.has(t)||!n){const r=new Error("帳本修復被拒絕：缺少使用者確認。啟動／migration／orphan prune 不得靜默改寫帳本語意。");throw r.code=$i,r.i18nKey="sqlite.error.ledger_repair_denied",r.silentRewriteBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function Id(e={}){const t={at:String(e.at??new Date().toISOString()),ledgerId:String(e.ledgerId??""),issueCount:Number(e.issueCount??0)||0,autoRepaired:e.autoRepaired===!0,issues:e.issues&&typeof e.issues=="object"?e.issues:{}};if(typeof localStorage<"u")try{localStorage.setItem(Yn,JSON.stringify(t))}catch{}return t}function Cd(){if(typeof localStorage>"u")return null;try{const e=localStorage.getItem(Yn);return e?JSON.parse(e):null}catch{return null}}function Ud(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),ledgerId:String(e.ledgerId??""),confirmed:e.confirmed===!0,fixedCount:Number(e.fixedCount??0)||0};if(typeof localStorage<"u")try{const n=JSON.parse(localStorage.getItem(gn)||"[]"),a=Array.isArray(n)?n:[];localStorage.setItem(gn,JSON.stringify([t,...a].slice(0,Yt)))}catch{}return typeof console<"u"&&typeof console.info=="function"&&console.info("[ledger-repair-audit]",t),t}const qi=Object.freeze(["transaction_attachments","loan_payments","reimbursement_payment_allocations","reimbursement_payments","reimbursement_advance_usages","reimbursement_advances","reimbursement_items","reimbursements","budget_save_settlements","budget_items","budget_containers","budgets","loans","bank_transactions","bank_sync_rules","bank_accounts","bank_connections","credit_repayment_allocations","credit_repayments","transaction_postings","credit_statements","wear_applied","transactions","security_transactions","securities","savings_jars","accounts","account_groups","categories","category_groups","counterparties","app_settings","deleted_log"]),zi=Object.freeze([...qi.filter(e=>e!=="deleted_log"),"deleted_log","wear_sync_state","ledgers"]),$t="SQLITE_CONSTRAINT_FOREIGNKEY",Wn=1811,$n=/foreign\s*key|SQLITE_CONSTRAINT_FOREIGNKEY|\b1811\b/i;function qn(e){if(!e)return!1;if(e?.code===$t||Number(e?.numericCode??e?.resultCode??e?.errno)===Wn)return!0;const t=String(e?.message??e??"");return/unique\s*constraint/i.test(t)&&!/foreign\s*key/i.test(t)?!1:/foreign\s*key/i.test(t)||/SQLITE_CONSTRAINT_FOREIGNKEY/i.test(t)||/\b1811\b/.test(t)||/constraint\s*failed/i.test(t)&&/FOREIGN KEY/i.test(t)?!0:$n.test(t)}function zn(e=""){const t=String(e??"").trim();return t&&!$n.test(t)?t:"資料關聯不一致（外鍵約束）。請重試同步／匯入，或先修復本機資料後再操作。"}function Vi(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||zn(n),r=new Error(a);if(r.code=$t,r.numericCode=Wn,r.i18nKey=t.i18nKey||"sqlite.error.foreign_key_constraint",r.recoverable=t.recoverable!==!1,r.originalMessage=n,e&&typeof e=="object")try{r.cause=e}catch{}return r}function Vn(e,t={}){throw!qn(e)||e?.code===$t&&e?.i18nKey?e:Vi(e,t)}function hd(e){return qn(e)?zn(e?.message).slice(0,240):String(e?.message??e??"同步失敗").slice(0,240)}const Ne="straw_money_book",Ln=1,W=new Un(wn);let F=null,ge=null,Pe=Ne;function Ji(e){const t=String(e??"").trim();if(!t)return!1;const n=t.toUpperCase();return!(!(n.startsWith("INSERT")||n.startsWith("UPDATE")||n.startsWith("DELETE")||n.startsWith("REPLACE"))||n.includes("APP_SETTINGS"))}function Jn(){if(!(typeof window>"u"||typeof window.dispatchEvent!="function")){if(typeof CustomEvent=="function"){window.dispatchEvent(new CustomEvent("app:data-mutated"));return}window.dispatchEvent(new Event("app:data-mutated"))}}async function Zn(){S.getPlatform()==="web"&&await W.saveToStore(Pe)}function ne(e){if(typeof e=="string"&&e.trim())return e;const t=e?.message;if(typeof t=="string"&&t.trim())return t;try{const n=JSON.stringify(e);if(n&&n!=="{}")return n}catch{}return"unknown sqlite error"}function Zi(e){const t=ne(e).toLowerCase();return/foreign\s*key|\b1811\b|sqlite_constraint_foreignkey/.test(t)?!1:t.includes("datatype mismatch")||t.includes("no such column")||t.includes("no such table")||t.includes("code20")||t.includes("code 20")}function Qi(e){const t=ne(e).toLowerCase();return t.includes("capacitorsqliteplugin: null")||t==="null"}function eo(e){return ne(e).toLowerCase().includes("no such table")}async function to(){S.getPlatform()==="web"&&await vi()}async function qt(){try{await W.closeAllConnections()}catch{}}async function Qn(e){await e.query("PRAGMA foreign_keys = ON;"),await e.query("PRAGMA busy_timeout = 5000;")}async function it(e=Pe){if((await W.isConnection(e,!1)).result)try{F=await W.retrieveConnection(e,!1)}catch{await qt(),F=await W.createConnection(e,!1,"no-encryption",Ln,!1)}else F=await W.createConnection(e,!1,"no-encryption",Ln,!1);return await F.open(),await Qn(F),await bi(F),Pe=e,F}async function no(e=Pe){if(F){try{await F.close()}catch{}F=null}if((await W.isConnection(e,!1)).result){const n=await W.retrieveConnection(e,!1);try{await n.close()}catch{}try{await W.closeConnection(e,!1)}catch{}}await qt();try{return await W.deleteDatabase(e,!1),it(e)}catch(n){const a=await it(e);try{await Qn(a);for(const r of zi)try{await a.run(`DELETE FROM ${r};`)}catch(i){eo(i)||Vn(i)}}catch(r){const i=ne(n),o=ne(r);throw new Error(`[sqlite] reset fallback failed; delete: ${i}; wipe: ${o}`)}return a}}async function ro(e={}){const t=xi(e);ji({reason:t.reason,source:t.source,confirmed:!0,note:String(e.note??"").slice(0,240)}),gi(),ge=null,Pe=Ne;const n=await no(Ne);try{const{rotateWearSyncEpoch:a}=await hn(async()=>{const{rotateWearSyncEpoch:r}=await import("./wear-sync-epoch.service-BI9nNC3A.js");return{rotateWearSyncEpoch:r}},__vite__mapDeps([0,1,2,3,4]));await a()}catch{}return n}async function er(){return F||ge||(ge=(async()=>{const e=S.getPlatform();try{return await to(),await it(Ne)}catch(t){if(e==="android"&&Qi(t))try{return console.warn("[sqlite] plugin null on primary open — retrying primary (recovery empty-db fallback disabled)"),await qt(),F=null,await it(Ne)}catch(n){ge=null;let a=!1;try{a=!!(await W.isDatabase(Ne,!1))?.result}catch{a=!1}throw St(n,{message:a?`[sqlite:${e}] plugin null: primary DB file exists but cannot open (empty recovery fallback disabled): ${ne(n)}`:`[sqlite:${e}] plugin null on primary open (empty recovery fallback disabled): ${ne(n)}`})}throw ge=null,Zi(t)?St(t,{message:`[sqlite:${e}] schema integrity error (no silent wipe): ${ne(t)}`}):St(t,{message:`[sqlite:${e}] ${ne(t)}`})}})(),ge)}async function je(){return F||await er(),F}let Fe=!1;function ao(){const e=Hn();return!!(e&&e.depth>0&&e.status==="open")}async function Tt(e,t=[]){const n=await je();try{const a=ao(),r=await n.run(e,t,!a);return Ji(e)&&(a?Fe=!0:(await Zn(),Jn())),r}catch(a){Vn(a)}}async function $(e,t=[]){return(await je()).query(e,t)}async function io(e){const t=Hn();if(t&&t.status==="open"){t.depth+=1;try{const n=await je();return await e(n,t)}finally{t.depth=Math.max(0,t.depth-1)}}return Ui.enqueue(async()=>{const n=Di();n.depth=1,Fe=!1;const a=await je();await a.beginTransaction();try{const r=await Ii(n,async()=>e(a,n));return n.status="committing",await a.commitTransaction(),n.status="committed",Fe&&(await Zn(),Jn()),Fe=!1,r}catch(r){n.status="rolling_back";try{await a.rollbackTransaction()}catch{}throw n.status="rolled_back",Fe=!1,r}finally{n.depth=0}})}const wd=Object.freeze(Object.defineProperty({__proto__:null,PRIMARY_DB_NAME:Ne,getDatabase:je,initDatabase:er,query:$,resetDatabase:ro,run:Tt,withTransaction:io},Symbol.toStringTag,{value:"Module"}));function vd(e=""){const t=Date.now().toString(36),n=Math.random().toString(36).slice(2,10);return e?`${e}_${t}_${n}`:`${t}_${n}`}function tr(){return new Date().toISOString()}function kd(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0");return`${n}-${a}`}function Xd(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${n}-${a}-${r}`}function Fd(e){if(!e)throw new Error("ledgerId is required")}function oo(e){return e?.values??[]}function so(e){return oo(e)[0]??null}async function nr(e,t){const n=await $(`SELECT value_json
     FROM app_settings
     WHERE ledger_id = ? AND key = ?
     LIMIT 1;`,[e,t]),a=so(n);if(!a)return null;try{return JSON.parse(a.value_json)}catch{return null}}async function ot(e,t,n){await Tt(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,t,JSON.stringify(n),tr()])}async function co(e,t){await Tt(`DELETE FROM app_settings
     WHERE ledger_id = ? AND key = ?;`,[e,t])}async function _o(e){const t=await $(`SELECT key, value_json, updated_at
     FROM app_settings
     WHERE ledger_id = ?;`,[e]);return Array.isArray(t?.values)?t.values:[]}async function Eo(e,t={}){await Tt(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,String(t?.key??"").trim(),String(t?.value_json??"null"),String(t?.updated_at??"").trim()||tr()])}const Md=Object.freeze(Object.defineProperty({__proto__:null,getSetting:nr,listAppSettingRows:_o,removeSetting:co,setSetting:ot,upsertAppSettingRow:Eo},Symbol.toStringTag,{value:"Module"}));function He(e){const t=Number(e);if(!Number.isFinite(t))throw new Error("amountMinor 必須為有效數字");return Math.round(t)}function Bd(e){return Math.abs(He(e))}function xd(e){const t=He(e);return t===0?0:-t}function Gd(e){const t=Number(e);if(!Number.isInteger(t)||t<0)throw new Error("amountMinor 必須為大於或等於 0 的數字");return t}function Pd(e){const t=Number(e);if(!Number.isInteger(t)||t<=0)throw new Error("amountMinor 必須為大於 0 的數字");return t}function jd(e){const t=Number(e);if(!Number.isFinite(t)||t===0)throw new Error("adjustment amountMinor 不能為 0");return t}function uo(e){return He(e??0)}function Hd(e=[]){const t=Array.isArray(e)?e:[];let n=0;for(const a of t){const r=Math.round(Number(a?.remaining_minor??a?.remainingMinor??0));!Number.isFinite(r)||r<=0||(n+=r)}return n}function lo(e,t){return He(e??0)+He(t??0)}function rr(e="rt",t="rc"){return`(
        ${e}.origin_type = 'refund'
        OR ${t}.name = '退款'
        OR ${e}.note LIKE '退款：%'
        OR ${e}.note LIKE '退款:%'
      )`}function To(e="t"){return`EXISTS (
    SELECT 1
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND ${rr("rt","rc")}
  )`}function mo(e="t"){return`COALESCE((
    SELECT SUM(ABS(rt.amount_minor))
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND ${rr("rt","rc")}
  ), 0)`}const go={BASE_URL:"/app/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_BANK_SYNC_ENABLE_UNSUPPORTED_REAL_PROVIDERS:"true",VITE_BANK_SYNC_FEATURE_ENABLED:"true",VITE_EINVOICE_CLIENT_SHARED_KEY:"bdf6d030f54e8b6da78d5b457f6987206493812e7ae7a8139dbbdadf603ef7c0",VITE_GOOGLE_OAUTH_CLIENT_SHARED_KEY:"6e492bbe47f72176ac0b731d452ff88426a3f7c93f550e7ca6ac415d2e1cd683",VITE_GOOGLE_USE_SERVER_AUTH_CODE:"true",VITE_GOOGLE_WEB_CLIENT_ID:"110585924943-419l5kajjdao1c7jktsg64v4k64qh5o0.apps.googleusercontent.com",VITE_PRIVACY_POLICY_URL:"https://www.strawmb.com/privacy-policy",VITE_WEB_HASH_ROUTER:"true"},Lo=["VITE_GOOGLE_WEB_CLIENT_ID","VITE_GOOGLE_OAUTH_CLIENT_ID","VITE_GOOGLE_CLIENT_ID"];function ar(){for(const e of Lo){const t=String(go[e]??"").trim();if(t)return t}return""}function kt(){return p("common.missing_google_web_client_id","缺少 Google Web Client ID（請設定 VITE_GOOGLE_WEB_CLIENT_ID）")}const No="https://www.googleapis.com/auth/drive.appdata",po=["email","profile",No],zt="straw.google.oauth.token_cache.v1",fo=60*1e3,rt=120*1e3,ir=20*1e3,Ao=8*1e3,Oo=3300,Ro=rt+ir+15*1e3,yt="Google 登入逾時，請重試",So="Google 授權交換逾時，請檢查網路後重試",or="https://api.strawmb.com",bo=Do("true"),Vt=Io(),Nn=Co(),pn=dr(void 0,"/api/google/oauth/exchange"),fn=dr(void 0,"/api/google/oauth/refresh"),An="6e492bbe47f72176ac0b731d452ff88426a3f7c93f550e7ca6ac415d2e1cd683".trim();let On="",st="",Ke="",ae="",de=0,z="",G=null,Oe=null,Qe=0,et=!1;const yo="GOOGLE_REAUTH_REQUIRED",Rn="Google 登入成功但未取得長效 refresh token，無法用於自動備份";function Do(e){const t=String(e).trim().toLowerCase();return t==="1"||t==="true"||t==="yes"||t==="on"}function Ye(){return Vt?Ke!=="online":!1}function sr(){if(!Vt)throw new Error("Google 自動備份需要長效授權，但目前未啟用 server auth code flow");Ke==="online"&&(Ke="",st="",gt())}function Io(){if(!bo)return!1;if(!S.isNativePlatform())return!0;const e="".trim(),t="".trim(),n="".trim(),a=Le(t)&&Le(n),r=Le(e);return a||r||Le(or)?!0:(console.warn("[google-auth] VITE_GOOGLE_USE_SERVER_AUTH_CODE=true but no explicit Google OAuth backend is configured for native runtime; fallback to online mode."),!1)}function Le(e){return/^https?:\/\//i.test(String(e??"").trim())}function Co(){const e="".trim();return Le(e)?e.replace(/\/+$/,""):or}function Uo(){if(S.isNativePlatform()||Le("".trim()))return!0;if(typeof window<"u"){const e=String(window.location?.origin??"").trim();if(/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(e))return!1}return!0}function dr(e,t){const n="".trim()||String(t??"").trim();if(!n)return"";if(Le(n)||!n.startsWith("/")||!Uo())return n;try{return new URL(n,`${Nn}/`).toString()}catch{return`${Nn}${n}`}}function Dt(e,t,n){let a=0;const r=new Promise((i,o)=>{a=globalThis.setTimeout(()=>{o(new Error(n))},t)});return Promise.race([e,r]).finally(()=>{a&&globalThis.clearTimeout(a)})}async function cr(e,t,n,a){const r=typeof AbortController=="function"?new AbortController:null;let i=0;r&&Number.isFinite(n)&&n>0&&(i=globalThis.setTimeout(()=>{r.abort()},n));try{return await fetch(e,{...t??{},...r?{signal:r.signal}:{}})}catch(o){throw r?.signal?.aborted?new Error(a):o}finally{i&&globalThis.clearTimeout(i)}}function ho(){if(!S.isNativePlatform())throw new Error("Google 備份僅支援 App 裝置")}function We(e){return e?typeof e=="string"?e:String(e.token??"").trim():""}function _e(e){const t=e&&typeof e=="object"?e:{};return{email:String(t.email??"").trim(),name:String(t.name??"").trim(),imageUrl:String(t.imageUrl??t.picture??"").trim()}}function _r(){return!ae||!Number.isFinite(de)||de<=0?!1:Date.now()+fo<de}function Jt(){return typeof localStorage<"u"}function he(){if(!Jt())return;const e={accessToken:ae,accessTokenExpiresAtMs:de,refreshToken:z,profile:G,mode:Er()};try{localStorage.setItem(zt,JSON.stringify(e))}catch{}}function wo(){if(Jt())try{const e=localStorage.getItem(zt);if(!e)return;const t=JSON.parse(e);if(!t||typeof t!="object")return;ae=We(t.accessToken),z=String(t.refreshToken??"").trim(),de=Math.max(0,Number(t.accessTokenExpiresAtMs??0)||0),G=_e(t.profile)}catch{}}function vo(){if(Jt())try{localStorage.removeItem(zt)}catch{}}function mt({accessToken:e,refreshToken:t,expiresInSec:n,expiresAtMs:a}={}){typeof e=="string"&&(ae=e.trim()),typeof t=="string"&&(z=t.trim());const r=Number(a);if(Number.isFinite(r)&&r>0)de=r;else{const i=Number(n);de=Number.isFinite(i)&&i>0?Date.now()+i*1e3:0}he()}function gt({keepRefreshToken:e=!1}={}){ae="",de=0,e||(z=""),e?he():vo()}function ko(){return"".trim()}function Xo(){return ar()}function Er(){return Ye()?"offline":"online"}function ur(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("account reauth failed")||t.includes("[16]")}function Fo(e){const t=[],n=String(e?.code??e?.errorCode??"").trim(),a=String(e?.status??"").trim(),r=String(e?.name??"").trim(),i=String(e?.message??e??"").trim();return n&&t.push(`code=${n}`),a&&t.push(`status=${a}`),r&&r!=="Error"&&t.push(`name=${r}`),i&&t.push(`raw=${i}`),t}function Se(e,t){const n=Fo(t);return n.length?`${e}（${n.join(" | ")}）`:e}function be(e){if(ur(e))return new Error(Se("Google 需要重新授權，請再試一次；若仍失敗請先在裝置 Google 帳號中移除本 App 授權後重登。",e));const t=String(e?.message??"").trim(),n=t.toLowerCase();return n.includes("missing_google_oauth_env")||n.includes("google_exchange_004")||n.includes("google_refresh_004")||n.includes("google_oauth_client_secret")||n.includes("invalid_client")||n.includes("client secret is invalid")?new Error(Se("Google 自動備份後端設定錯誤，請通知管理員檢查 Google OAuth client / secret 設定。",e)):n.includes("invalid_grant")||n.includes("redirect_uri_mismatch")||n.includes("code was already redeemed")?new Error(Se("Google 授權碼已失效或無法交換，請到自動備份頁重新登入 Google。",e)):new Error(Se(t||"Google 登入失敗",e))}function at(e="Google 需要重新授權，請到自動備份頁重新登入 Google。",t=null){const n=new Error(Se(e,t));return n.code=yo,n}function lr(e){const t=e&&typeof e=="object"?e:{},n=We(t.accessToken??t.access_token);if(!n)throw new Error("後端未回傳 access token");const a=t.refreshToken??t.refresh_token,r=typeof a=="string"?a.trim():"",i=Number(t.expiresIn??t.expires_in??0),o=Number.isFinite(i)&&i>0?i:0,s=Number(t.accessTokenExpiresAtMs??t.access_token_expires_at_ms??t.expiresAtMs??0),c=Number.isFinite(s)&&s>0?s:0,d=_e(t.profile),E=_e(t),u=d.email||d.name||d.imageUrl?d:E;return t.idToken??t.id_token,{accessToken:n,refreshToken:r,expiresInSec:o,expiresAtMs:c,profile:u}}async function Tr(e,t){const n={"Content-Type":"application/json"};An&&(n["X-Straw-Client-Key"]=An);let a;try{a=await cr(e,{method:"POST",headers:n,body:JSON.stringify(t??{})},ir,So)}catch(o){throw new Error(Se(`Google OAuth 請求失敗（url=${e}）`,o))}const r=await a.text();let i=null;if(r)try{i=JSON.parse(r)}catch{i=null}if(!a.ok){const o=String(i?.message??i?.error_description??r??i?.error??"").trim(),s=String(i?.errorNumber??"").trim(),c=s?`（errorNumber=${s}）`:"";throw new Error(`${o||`HTTP ${a.status}`}${c}（url=${e}）`)}if(!i||typeof i!="object")throw new Error(`後端回應格式錯誤（url=${e}）`);return i}async function mr(e){if(!e)return null;try{const t=await cr("https://openidconnect.googleapis.com/v1/userinfo",{method:"GET",headers:{Authorization:`Bearer ${e}`}},Ao,"Google 使用者資料讀取逾時");if(!t.ok)return null;const n=await t.json(),a=_e(n);return!a.email&&!a.name&&!a.imageUrl?null:a}catch{return null}}async function Mo(e){const t=String(e??"").trim();if(!t)throw new Error("Google 登入成功但未取得 server auth code");if(!pn)throw new Error("缺少 Google OAuth 後端交換端點（請設定 VITE_GOOGLE_OAUTH_EXCHANGE_URL）");const n=await Tr(pn,{serverAuthCode:t});return console.info("[google-auth] exchangeServerAuthCode success"),lr(n)}async function Bo(e){const t=String(e??"").trim();if(!t)throw at("Google 授權已失效，請到自動備份頁重新登入 Google。");if(!fn)throw new Error("缺少 Google OAuth 後端 refresh 端點（請設定 VITE_GOOGLE_OAUTH_REFRESH_URL）");const n=await Tr(fn,{refreshToken:t});return n?.accessToken??n?.access_token,lr(n)}async function It(e={}){const t=String(e.preferredEmail??e.loginHint??"").trim(),n={scopes:po,...e};return delete n.preferredEmail,t&&!n.loginHint&&(n.loginHint=t),ye.login({provider:"google",options:n})}function xo(e=""){Ke!=="online"&&(Ke="online",st="",gt(),e&&console.warn("[google-auth] switch to online mode fallback",e))}function Go(e){return _e({email:e?.profile?.email||"",name:e?.profile?.name||"",imageUrl:e?.profile?.imageUrl||""})}function gr(e){const t=e&&typeof e=="object"?e:{},n=Number(t.expiresAtMs??t.expires_at_ms??t.expireTimeMs??t.expirationTimeMs??0);if(Number.isFinite(n)&&n>Date.now()){const r=Math.floor((n-Date.now())/1e3);if(r>0)return r}const a=Number(t.expiresIn??t.expires_in??t.expires??0);return Number.isFinite(a)&&a>0?a:Oo}async function Po(){if(!(await ye.isLoggedIn({provider:"google"}))?.isLoggedIn)return"";const t=await ye.getAuthorizationCode({provider:"google"}),n=We(t?.accessToken);if(!n)return"";mt({accessToken:n,refreshToken:"",expiresInSec:gr(t)});const a=_e(t?.profile);return(a.email||a.name||a.imageUrl)&&(G=a,he()),ae}function Sn(e){const t=We(e?.accessToken);if(!t)throw new Error("Google 登入成功但未取得 access token");return mt({accessToken:t,refreshToken:"",expiresInSec:gr(e)}),G=Go(e),he(),{accessToken:t,profile:G}}async function Xt(){ho();const e=Xo();if(!e)throw new Error(kt());const t=Er();if(On===e&&st===t)return;const n={webClientId:e,mode:t},a=ko();a&&(n.iOSClientId=a),t==="offline"&&(n.iOSServerClientId=e),await ye.initialize({google:n}),On=e,st=t}async function Ft(e={}){const t=!!e?.requireRefreshToken;if(Oe){const a=Date.now()-Qe;if(a>=0&&a<Ro){if(!t||et)return Oe;console.warn("[google-auth] refresh-token sign-in cannot reuse an online-only sign-in promise")}else console.warn("[google-auth] stale sign-in promise detected, forcing a fresh login attempt",{elapsedMs:a});Oe=null,Qe=0,et=!1}Qe=Date.now(),et=t;const n=(async()=>{t&&sr(),await Xt();let a;try{a=await Dt(It({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,style:Ye()?"standard":"bottom",preferredEmail:e.preferredEmail}),rt,yt)}catch(r){if(ur(r)){try{await ye.logout({provider:"google"})}catch{}try{a=await Dt(It({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),rt,yt)}catch(i){throw be(new Error(`首次登入失敗：${String(r?.message??r)}；重試仍失敗：${String(i?.message??i)}`))}}else throw be(r)}if(a.provider!=="google")throw new Error("Google 登入失敗，請重試");if(Ye())try{if(a.result?.responseType!=="offline")throw new Error("Google 登入成功但未取得 server auth code");const r=await Mo(a.result.serverAuthCode),i=r.accessToken;if(t&&!r.refreshToken)throw new Error(Rn);const o=r.refreshToken||z,s=r.profile,c=s.email||s.name||s.imageUrl?s:await mr(i);return mt({accessToken:i,refreshToken:o,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),G=_e(c),he(),{accessToken:ae,profile:G}}catch(r){if(t)throw be(r);console.warn("[google-auth] offline auth flow failed, fallback to online mode",r),xo(String(r?.message??r)),await Xt();let i=a;if((i.result?.responseType!=="online"||!We(i.result?.accessToken))&&(i=await Dt(It({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),rt,yt)),i.result?.responseType!=="online")throw be(r);return Sn(i.result)}if(t)throw new Error(Rn);if(a.result?.responseType!=="online")throw new Error("Google 登入失敗，請重試");return Sn(a.result)})();Oe=n;try{return await n}finally{Oe===n&&(Oe=null,Qe=0,et=!1)}}async function we(e={}){const t=!!e?.requireRefreshToken;if(t&&sr(),_r()&&(!t||z))return ae;const n=e?.interactive!==!1,a=String(e?.preferredEmail??"").trim();if(Ye()){if(z)try{const r=await Bo(z);if(mt({accessToken:r.accessToken,refreshToken:r.refreshToken||z,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),!G?.email){const i=r.profile.email||r.profile.name||r.profile.imageUrl?r.profile:await mr(r.accessToken);i&&(G=_e(i),he())}return ae}catch(r){console.warn("[google-auth] backend refresh failed",r)}if(n)try{return(await Ft({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw be(r)}throw at()}await Xt();try{const r=await Po();if(r)return r}catch(r){if(!n)throw console.warn("[google-auth] background token fetch failed",r),at(void 0,r);console.warn("[google-auth] silent token fetch before interactive sign-in failed",r)}if(n)try{return(await Ft({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw be(r)}throw at()}async function Lr(e={}){const t=e?.interactive!==!1;return gt({keepRefreshToken:Ye()}),we({interactive:t,requireRefreshToken:!!e?.requireRefreshToken})}async function jo(){try{await ye.logout({provider:"google"})}catch(e){if(!Vt||!String(e?.message??"").toLowerCase().includes("offline mode"))throw e}finally{gt(),G=null}}function De(){return G}function Nr(){const e=G&&typeof G=="object"?G:{};return!!(z||_r()||e.email||e.name||e.imageUrl)}wo();const Ho=vn("FileOpener"),Ko="StrawMoneyBook",pr=["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","reimbursement_payments","reimbursement_payment_allocations","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],Yo=/(password|token|secret|authorization|client[_-]?key)/i,Wo=/^(?:bank_sync\.credentials\.[^.]+|backup\.webdav\.credentials)$/i,Mt="【附加項目】";function $o(e){if(e==null)return"";const t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?`"${t.replaceAll('"','""')}"`:t}function $e(e,t=null){const n=Array.isArray(t)&&t.length?t:Object.keys(e[0]??{});if(!n.length)return"";const a=[n.join(",")];for(const r of e)a.push(n.map(i=>$o(r[i])).join(","));return a.join(`\r
`)}function dt(e){if(Array.isArray(e))return e.map(n=>dt(n));if(!e||typeof e!="object")return e;const t={};for(const[n,a]of Object.entries(e))t[n]=Yo.test(n)?"":dt(a);return t}function qo(e){if(!e||typeof e!="object")return e;const t=String(e.key??"").trim();if(Wo.test(t))return null;try{const n=JSON.parse(String(e.value_json??"null"));return!n||typeof n!="object"?e:t==="backup.webdav"?{...e,value_json:JSON.stringify({...dt(n),connected:!1,autoEnabled:!1,dataChangeAutoEnabled:!1,password:"",lastError:""})}:{...e,value_json:JSON.stringify(dt(n))}}catch{return e}}function fr(e){const t=String(e??"").split(`
`).map(n=>n.trim()).find(n=>n.startsWith(Mt));return t?t.slice(Mt.length).trim():""}function Ar(e){return String(e??"").split(`
`).map(t=>t.trim()).filter(t=>t&&!t.startsWith(Mt)).join(`
`)}function zo(e){const[t,n]=String(e??"").split("-").map(i=>Number(i)),a=new Date(t,n-1,1,0,0,0),r=new Date(t,n,1,0,0,0);return{startUtc:a.toISOString(),endUtc:r.toISOString()}}function Vo(e){const t=Number(e),n=new Date(t,0,1,0,0,0),a=new Date(t+1,0,1,0,0,0);return{startUtc:n.toISOString(),endUtc:a.toISOString()}}function Jo(e){const[t,n,a]=String(e??"").split("-").map(o=>Number(o)),r=new Date(t,n-1,a,0,0,0),i=new Date(t,n-1,a+1,0,0,0);return{startUtc:r.toISOString(),endUtc:i.toISOString()}}function Zo(e,t){const[n,a,r]=String(e??"").split("-").map(E=>Number(E)),[i,o,s]=String(t??"").split("-").map(E=>Number(E)),c=new Date(n,a-1,r,0,0,0),d=new Date(i,o-1,s+1,0,0,0);return{startUtc:c.toISOString(),endUtc:d.toISOString()}}function Or(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0"),o=String(e.getSeconds()).padStart(2,"0");return`${t}-${n}-${a}_${r}${i}${o}`}function Bt(e,t="ledger"){const n=String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"");return n?Array.from(n).slice(0,40).join(""):t}function Qo(e,t={}){return e==="year"?Vo(t.yearKey):e==="month"?zo(t.monthKey):e==="day"?Jo(t.dayKey):e==="custom"?Zo(t.startDate,t.endDate):{startUtc:null,endUtc:null}}const es=["類型","記帳時間","交易帳戶","交易帳本","貨幣符號","交易金額","當期帳戶餘額","一級分類","二級分類","交易標籤","備註","附加項目","退款&轉銷","收回","歸還","匯率"],ts=es.filter(e=>e!=="交易標籤");function bn(e){const t=String(e??"").trim();return t?t.split(/\s*(?:-->|->|→|＞)\s*/g).map(n=>n.trim()).filter(Boolean):[]}function ns(e,t){const n=bn(e),a=bn(t),r=n[0]||a[0]||"";let i="";return a.length>1?i=a.slice(1).join(" / "):a.length===1?i=a[0]:n.length>1&&(i=n.slice(1).join(" / ")),{primary:r,secondary:i}}async function Lt(e,t){const a=(await $(`SELECT * FROM ${t} WHERE ledger_id = ?;`,[e]))?.values??[];return t!=="app_settings"?a:a.map(r=>qo(r)).filter(Boolean)}async function Rr(){const e=await $("SELECT MAX(version) AS version FROM schema_migrations;");return Number(e?.values?.[0]?.version??0)}async function rs(e,t=null){const n=!!t,a=n?`SELECT
         a.id AS account_id,
         a.opening_balance_minor + COALESCE(SUM(t.amount_minor), 0) AS balance_minor
       FROM accounts a
       LEFT JOIN transactions t
         ON t.ledger_id = a.ledger_id
        AND t.account_id = a.id
        AND t.deleted_at IS NULL
        AND t.occurred_at < ?
       WHERE a.ledger_id = ?
       GROUP BY a.id, a.opening_balance_minor;`:`SELECT
         a.id AS account_id,
         a.opening_balance_minor AS balance_minor
       FROM accounts a
       WHERE a.ledger_id = ?
       GROUP BY a.id, a.opening_balance_minor;`,i=(n?await $(a,[t,e]):await $(a,[e]))?.values??[],o=new Map;for(const s of i)o.set(String(s.account_id),uo(s.balance_minor));return o}async function Kd(e){const t={schema_version:0,exported_at:new Date().toISOString(),ledger_id:e,tables:{}};t.schema_version=await Rr();const n=await $("SELECT * FROM ledgers WHERE id = ?;",[e]);t.tables.ledgers=n?.values??[];for(const a of pr)t.tables[a]=await Lt(e,a);return t}async function Sr(){const e={schema_version:await Rr(),exported_at:new Date().toISOString(),backup_scope:"all_ledgers",ledgers:[]},n=(await $("SELECT * FROM ledgers WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC, id ASC;"))?.values??[];for(const a of n){const r=a?.id;if(!r)continue;const i={schema_version:e.schema_version,exported_at:e.exported_at,ledger_id:r,tables:{ledgers:[a]}};for(const o of pr)i.tables[o]=await Lt(r,o);e.ledgers.push(i)}return e}async function Yd(e){const n=((await $(`SELECT *
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
     ORDER BY occurred_at DESC, created_at DESC;`,[e]))?.values??[]).map(r=>({...r,note_without_addon:Ar(r.note),addon_items:fr(r.note)})),a=n.length?Object.keys(n[0]):["ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","is_reimbursable","reimbursement_state","reimbursed_at","note_without_addon","addon_items","created_at","updated_at","deleted_at"];return $e(n,a)}async function Wd(e){const t=await Lt(e,"accounts");return $e(t)}async function $d(e){const t=await Lt(e,"categories");return $e(t)}function as(e){return e==="expense"?"支出":e==="income"?"收入":e==="transfer"?"轉帳":"調整"}function is(e){if(Array.isArray(e))return e.map(n=>String(n??"").trim()).filter(Boolean).join("、");const t=String(e??"").trim();if(!t)return"";try{const n=JSON.parse(t);if(Array.isArray(n))return n.map(a=>String(a??"").trim()).filter(Boolean).join("、")}catch{}return t}function os(e,t){const n=[],a=[];for(const r of e){const i=Number(r.amount_minor??0)/100,o=String(r.account_id??""),s=lo(t.get(o),r.amount_minor);t.set(o,s);const c=s/100,d=ns(r.category_group_name,r.category_name),E=fr(r.note),u={類型:as(r.type),記帳時間:r.occurred_at??"",交易帳戶:r.account_name??"",交易帳本:r.ledger_name??"",貨幣符號:r.currency_code??"TWD",交易金額:String(i),當期帳戶餘額:String(c),一級分類:d.primary,二級分類:d.secondary,備註:Ar(r.note),附加項目:E,"退款&轉銷":"",收回:"",歸還:"",匯率:"1"};n.push(u),a.push({...u,交易標籤:is(r.tags_json)})}return{csvRows:n,excelRows:a}}async function ss(e,t={}){const n=["all","year","month","day","custom"].includes(t.mode)?t.mode:"all",{startUtc:a,endUtc:r}=Qo(n,t),i=await rs(e,a),o=[e];let s="";a&&r&&(s=" AND t.occurred_at >= ? AND t.occurred_at < ?",o.push(a,r));const d=(await $(`SELECT
       t.type,
       t.account_id,
       t.category_id,
       t.include_in_analysis,
       CASE WHEN ${To("t")} THEN 1 ELSE 0 END AS has_refund_link,
       ${mo("t")} AS refund_deducted_minor,
       t.occurred_at,
       t.note,
       t.tags_json,
       t.origin_type,
       t.amount_minor,
       a.name AS account_name,
       a.icon AS account_icon,
       a.currency_code,
       l.name AS ledger_name,
       cg.name AS category_group_name,
       c.name AS category_name,
       c.icon AS category_icon
     FROM transactions t
     LEFT JOIN accounts a
       ON a.ledger_id = t.ledger_id
      AND a.id = t.account_id
     LEFT JOIN ledgers l
       ON l.id = t.ledger_id
     LEFT JOIN categories c
       ON c.ledger_id = t.ledger_id
      AND c.id = t.category_id
     LEFT JOIN category_groups cg
       ON cg.ledger_id = c.ledger_id
      AND cg.id = c.group_id
     WHERE t.ledger_id = ?
       AND t.deleted_at IS NULL
       ${s}
     ORDER BY t.occurred_at ASC, t.created_at ASC;`,o))?.values??[],{csvRows:E,excelRows:u}=os(d,i),T=E[0]?.交易帳本||d[0]?.ledger_name||"ledger";return{mode:n,ledgerName:T,rowCount:E.length,csvRows:E,excelRows:u,records:d}}async function qd(e,t={}){const n=await ss(e,t),r=`${Bt(n.ledgerName)}_transactions_${n.mode}_${Or()}.csv`,i=$e(n.csvRows,ts);return{filename:r,csvText:i,rowCount:n.rowCount}}function tt(e){const t=Number(e??0)/100;return Number.isFinite(t)?t.toFixed(2).replace(/\.00$/,"").replace(/(\.\d)0$/,"$1"):"0"}function ds(e){const t=String(e??"").trim();return{active:"進行中",partial:"部分完成",settled:"已結清",void:"完成"}[t]??t}function cs(e){return e==="borrow"?"借入":"借出"}const _s=["狀態","借貸方向","對象名稱","開始日期","到期日","建立入帳帳戶","本金","預設利息","已收 / 已還","剩餘","備註"];function Es(e=[]){return(e??[]).map(t=>({狀態:ds(t?.status),借貸方向:cs(t?.direction),對象名稱:String(t?.counterparty_name??"").trim()||"未命名對象",開始日期:String(t?.start_date??t?.setup_occurred_at??"").trim(),到期日:String(t?.due_date??"").trim(),建立入帳帳戶:String(t?.setup_account_name??"").trim(),本金:tt(t?.principal_minor),預設利息:tt(t?.preset_interest_minor),"已收 / 已還":tt(t?.paid_minor),剩餘:tt(t?.remaining_minor),備註:String(t?.note??"").trim()}))}function zd(e,t={}){const n=Bt(t.ledgerName??"loans"),a=Bt(t.scopeName??""),r=t.tab==="borrow"?"borrow":"lend",i=t.showFinished?"finished":"active",o=Or(t.now instanceof Date?t.now:new Date),s=Es(e),c=a?`_${a}`:"";return{filename:`${n}_loans${c}_${r}_${i}_${o}.csv`,csvText:$e(s,_s),rowCount:s.length}}function Vd(e,t){const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"});br(e,n)}function Jd(e,t){const n=new Blob([`\uFEFF${t}`],{type:"text/csv;charset=utf-8"});br(e,n)}function Zd(e){const t=new Blob([`\uFEFF${e}`],{type:"text/csv;charset=utf-8"});return URL.createObjectURL(t)}function Qd(e){const t=e instanceof Blob?e:new Blob([e],{type:"application/pdf"});return URL.createObjectURL(t)}function ec(e){e&&URL.revokeObjectURL(e)}function us(e,t){if(!e)return;const n=document.createElement("a");n.href=e,n.download=t,document.body.appendChild(n),n.click(),n.remove()}function tc(e){const t=String(e??"").trim();if(!t||typeof window>"u"||typeof document>"u")return!1;const n=t.startsWith("blob:")||t.startsWith("data:"),a=/^file:\/\//i.test(t)||/^content:\/\//i.test(t)||t.startsWith("/");if(S.isNativePlatform()){if(n)return!1;if(a)return Ho.openFile({uri:t}).catch(i=>{console.warn("[file-opener] failed to open exported file",i)}),!0;try{return window.location.assign(t),!0}catch{}}const r=()=>{const i=document.createElement("a");return i.href=t,i.target="_blank",i.rel="noopener noreferrer",document.body.appendChild(i),i.click(),i.remove(),!0};try{if(window.open(t,"_blank","noopener,noreferrer"))return!0}catch{}try{return r()}catch{try{return window.location.assign(t),!0}catch{return!1}}}function br(e,t){const n=URL.createObjectURL(t);us(n,e),URL.revokeObjectURL(n)}function yr(e){const t=new TextEncoder().encode(e),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}function ls(e){const t=e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e??[]),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}async function Zt(e,t,n={}){if(!S.isNativePlatform())return{saved:!1,reason:"not-native"};const a=Ts(e),r=ms(n.category,"exports"),i=`${Ko}/${r}/${a}`,o=`Documents/${i}`,s=[{directory:En.Documents,path:i,location:o},{directory:En.ExternalStorage,path:o,location:o}].filter(d=>!!d.directory);let c=null;for(const d of s)try{const E=await ea.writeFile({path:d.path,data:t,directory:d.directory,recursive:!0});return{saved:!0,uri:E?.uri??"",openUrl:E?.uri?S.convertFileSrc(E.uri):"",filename:a,location:d.location}}catch(E){c=E}return{saved:!1,reason:c?.message??"write-failed"}}function Ts(e){const t=String(e??"").trim(),n=`export_${Date.now()}.csv`;if(!t)return n;const i=(t.includes(".")?t:`${t}.csv`).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").slice(0,80);return i||n}function ms(e,t="exports"){return String(e??"").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").toLowerCase()||t}async function nc(e,t,n={}){const a=JSON.stringify(t,null,2),r=yr(a);return Zt(e,r,n)}async function rc(e,t,n={}){const a=yr(`\uFEFF${t}`);return Zt(e,a,n)}async function ac(e,t,n={}){const a=t instanceof Blob?await t.arrayBuffer():t,r=ls(a);return Zt(e,r,n)}function Dr(e){return Math.max(1,Number(e??24)||24)}function gs(e,t=Date.now()){if(!e?.connected||!e?.autoEnabled)return!1;const n=String(e?.lastBackupAt??"").trim();if(!n)return!0;const a=Date.parse(n);if(!Number.isFinite(a))return!0;const r=Dr(e?.intervalHours)*60*60*1e3;return t-a>=r}const Ie="https://www.googleapis.com/drive/v3/files",Ir="https://www.googleapis.com/upload/drive/v3/files";function ue(e,t={}){const n=Ls(t);return delete n.Authorization,delete n.authorization,{...n,Authorization:`Bearer ${e}`}}function Ls(e){return e?Array.isArray(e)?Object.fromEntries(e):typeof e.entries=="function"?Object.fromEntries(Array.from(e.entries())):typeof e=="object"?{...e}:{}:{}}async function pe(e,t,n,a){const r=await fetch(n,a);if(r.status!==401||typeof t!="function")return r;const i=await t();return fetch(n,{...a,headers:ue(i,a?.headers??{})})}function fe(e,t){return e.ok?e:e.text().then(n=>{throw new Error(`${t}：${n||e.status}`)})}function Ns(e,t){const n=`strawmoneybook_${Math.random().toString(16).slice(2)}`,a=`\r
--${n}\r
`,r=`\r
--${n}--`;return{body:new Blob([a,`Content-Type: application/json; charset=UTF-8\r
\r
`,JSON.stringify(e),a,`Content-Type: application/json; charset=UTF-8\r
\r
`,t,r]),contentType:`multipart/related; boundary=${n}`}}async function ps(e,t,n){const a=encodeURIComponent(`name='${n}' and 'appDataFolder' in parents and trashed=false`),r=encodeURIComponent("files(id,name,modifiedTime,size)"),i=`${Ie}?spaces=appDataFolder&q=${a}&fields=${r}&orderBy=modifiedTime desc`,o=await pe(e,t,i,{method:"GET",headers:ue(e)});await fe(o,"讀取 Google 備份清單失敗");const s=await o.json();return Array.isArray(s?.files)?s.files:[]}async function fs(e,t,n){const a=`${Ie}/${encodeURIComponent(n)}`,r=await pe(e,t,a,{method:"DELETE",headers:ue(e)});await fe(r,"刪除重複備份失敗")}async function As(e,t,n,a){const r={name:n,parents:["appDataFolder"]},{body:i,contentType:o}=Ns(r,a),s=await pe(e,t,`${Ir}?uploadType=multipart&fields=id,name,modifiedTime`,{method:"POST",headers:ue(e,{"Content-Type":o}),body:i});return await fe(s,"建立 Google 備份失敗"),s.json()}async function Os(e,t,n,a){const r=await pe(e,t,`${Ir}/${encodeURIComponent(n)}?uploadType=media`,{method:"PATCH",headers:ue(e,{"Content-Type":"application/json; charset=UTF-8"}),body:a});await fe(r,"更新 Google 備份失敗")}async function Rs({accessToken:e,reauth:t,filename:n,jsonText:a}){let r=e;const i=typeof t=="function"?async()=>{const d=await t();return r=String(d??"").trim()||r,r}:null,o=await ps(r,i,n),s=o[0]||null;if(s?.id){await Os(r,i,s.id,a);for(const d of o.slice(1))d?.id&&await fs(r,i,d.id);return{fileId:s.id,filename:n,modifiedTime:new Date().toISOString(),created:!1}}const c=await As(r,i,n,a);return{fileId:String(c?.id??""),filename:String(c?.name??n),modifiedTime:String(c?.modifiedTime??new Date().toISOString()),created:!0}}async function Cr({accessToken:e,reauth:t,pageSize:n=100}={}){const a=[];let r="";const i=Math.min(1e3,Math.max(1,Number(n)||100)),o=encodeURIComponent("nextPageToken,files(id,name,modifiedTime,size)");do{let s=`${Ie}?spaces=appDataFolder&fields=${o}&orderBy=modifiedTime desc&pageSize=${i}`;r&&(s+=`&pageToken=${encodeURIComponent(r)}`);const c=await pe(e,t,s,{method:"GET",headers:ue(e)});await fe(c,"讀取 Google 備份清單失敗");const d=await c.json(),E=Array.isArray(d?.files)?d.files:[];a.push(...E),r=String(d?.nextPageToken??"").trim()}while(r);return a}async function Ss({accessToken:e,reauth:t,fileId:n,pageSize:a=200}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=[];let o="";const s=Math.min(1e3,Math.max(1,Number(a)||200)),c=encodeURIComponent("nextPageToken,revisions(id,modifiedTime,size,keepForever)");do{let d=`${Ie}/${encodeURIComponent(r)}/revisions?fields=${c}&pageSize=${s}`;o&&(d+=`&pageToken=${encodeURIComponent(o)}`);const E=await pe(e,t,d,{method:"GET",headers:ue(e)});await fe(E,"讀取 Google Drive 檔案版本失敗");const u=await E.json(),T=Array.isArray(u?.revisions)?u.revisions:[];i.push(...T),o=String(u?.nextPageToken??"").trim()}while(o);return i.map(d=>({id:String(d?.id??"").trim(),modifiedTime:String(d?.modifiedTime??"").trim(),size:d?.size!=null?String(d.size):"",keepForever:!!d?.keepForever})).filter(d=>d.id).sort((d,E)=>String(E.modifiedTime).localeCompare(String(d.modifiedTime)))}async function Ur({accessToken:e,reauth:t,fileId:n,revisionId:a}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=String(a??"").trim(),o=i?`${Ie}/${encodeURIComponent(r)}/revisions/${encodeURIComponent(i)}?alt=media`:`${Ie}/${encodeURIComponent(r)}?alt=media`,s=await pe(e,t,o,{method:"GET",headers:ue(e)});return await fe(s,"下載 Google 備份失敗"),s.text()}function hr(e){const t=e?.deleted_at;return t==null?!1:String(t).trim()!==""}function bs(e){const t=String(e??"").trim();if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})/);if(n)return`${n[1]}-${n[2]}`;const a=Date.parse(t);if(!Number.isFinite(a))return"";const r=new Date(a);if(Number.isNaN(r.getTime()))return"";const i=r.getUTCFullYear(),o=String(r.getUTCMonth()+1).padStart(2,"0");return`${i}-${o}`}function ys(e){return!e||typeof e!="object"?[]:Array.isArray(e.ledgers)&&e.backup_scope==="all_ledgers"?e.ledgers.filter(t=>t&&typeof t=="object"):e.tables&&typeof e.tables=="object"?[e]:[]}function Ds(e){const t=Array.isArray(e?.tables?.ledgers)?e.tables.ledgers:[],n=t.find(i=>i&&!hr(i))||t[0],a=String(n?.name??e?.ledger_name??"").trim();return a||String(e?.ledger_id??n?.id??"").trim()||""}function Is(e){const t=Array.isArray(e?.tables?.transactions)?e.tables.transactions:[];let n=0;const a=Object.create(null);for(const r of t){if(!r||typeof r!="object"||hr(r))continue;n+=1;const i=bs(r.occurred_at);i&&(a[i]=(a[i]||0)+1)}return{count:n,monthDistribution:a}}function Cs(...e){const t=Object.create(null);for(const n of e)if(!(!n||typeof n!="object"))for(const[a,r]of Object.entries(n))t[a]=(t[a]||0)+Number(r||0);return t}function Me(e){const t={ok:!1,parseError:"",backupScope:"",exportedAt:"",ledgerNames:[],ledgerCount:0,transactionCount:0,monthDistribution:{},months:[],earliestMonth:"",latestMonth:""};if(!e||typeof e!="object")return{...t,parseError:"invalid_payload"};const n=ys(e);if(!n.length)return{...t,parseError:"missing_ledgers",backupScope:String(e.backup_scope??"").trim(),exportedAt:String(e.exported_at??"").trim()};const a=[];let r=0,i=Object.create(null);for(const s of n){const c=Ds(s);c&&a.push(c);const d=Is(s);r+=d.count,i=Cs(i,d.monthDistribution)}const o=Object.keys(i).sort();return{ok:!0,parseError:"",backupScope:String(e.backup_scope??(n.length>1?"all_ledgers":"single")).trim(),exportedAt:String(e.exported_at??"").trim(),ledgerNames:a,ledgerCount:n.length,transactionCount:r,monthDistribution:i,months:o,earliestMonth:o[0]||"",latestMonth:o[o.length-1]||""}}function wr(e){const t=String(e??"");if(!t.trim())return Me(null);try{return Me(JSON.parse(t))}catch{return{...Me(null),parseError:"json_parse_error"}}}function Us(e,t,n={}){const a=e&&typeof e=="object"?e:{},r=t&&typeof t=="object"?t:{},i=String(n.remoteModifiedAt??a.exportedAt??"").trim(),o=String(n.localModifiedAt??r.exportedAt??"").trim();let s="unknown";const c=Date.parse(i),d=Date.parse(o);Number.isFinite(c)&&Number.isFinite(d)&&(c<d-1e3?s="older":c>d+1e3?s="newer":s="same");const E=Array.isArray(a.months)?a.months:[],u=Array.isArray(r.months)?r.months:[],T=new Set(E),g=new Set(u),L=u.filter(D=>!T.has(D)),M=E.filter(D=>!g.has(D));let A="unknown";!a.ok&&!r.ok?A="unknown":!E.length&&!u.length||!L.length&&!M.length?A="equal":!L.length&&M.length?A="remote_wider":L.length&&!M.length?A="remote_narrower":E.length&&u.length?A="overlapping":A="disjoint";const P=Number(r.transactionCount??0)||0,Z=Number(a.transactionCount??0)||0,ie=!!(a.ok&&r.ok&&(L.length>0||P>0&&Z<P));return{ageRelation:s,coverage:A,monthsOnlyInLocal:L,monthsOnlyInRemote:M,localTxCount:P,remoteTxCount:Z,warnIncompleteRemote:ie,warnOlderRemote:s==="older",warnNewerRemote:s==="newer"}}function ic(e,{limit:t=8}={}){const n=Object.entries(e||{}).sort(([i],[o])=>i.localeCompare(o));if(!n.length)return"";const a=n.slice(0,Math.max(1,t)).map(([i,o])=>`${i}:${o}`),r=n.length-a.length;return r>0?`${a.join(", ")} (+${r})`:a.join(", ")}const hs=["ledgers","account_groups","accounts","category_groups","categories","transactions","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","reimbursement_payments","reimbursement_payment_allocations","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],ws=Object.freeze({app_settings:"key",bank_sync_rules:"connection_id",savings_jars:"account_id"});function w(e){return JSON.parse(JSON.stringify(e??null))}function l(e){return String(e??"").trim()}function Ee(e){if(e==null||e==="")return Number.NaN;if(e instanceof Date){const a=e.getTime();return Number.isFinite(a)?a:Number.NaN}if(typeof e=="number")return Number.isFinite(e)?Math.abs(e)<1e11?Math.round(e*1e3):Math.round(e):Number.NaN;const t=l(e);if(!t)return Number.NaN;if(/^-?\d+(\.\d+)?$/.test(t))return Ee(Number(t));const n=Date.parse(t);return Number.isFinite(n)?n:Number.NaN}function ct(e){const t=Ee(e);return Number.isFinite(t)?new Date(t).toISOString():""}function m(e,t){const n=e?.tables?.[t];return Array.isArray(n)?n.map(a=>w(a)):[]}function Qt(e,t){const n=hs.filter(r=>r!=="deleted_log"),a=new Set;for(const r of[e,t]){const i=r?.tables&&typeof r.tables=="object"?Object.keys(r.tables):[];for(const o of i){const s=l(o);!s||s==="deleted_log"||n.includes(s)||a.add(s)}}return[...n,...Array.from(a).sort((r,i)=>r.localeCompare(i))]}function R(e,t,n=0){const a=ws[e];if(a){const i=l(t?.[a]);if(i)return i}const r=l(t?.id);return r||`__row_${e}_${n}_${JSON.stringify(t??{})}`}function j(e){const t=[e?.deleted_at,e?.updated_at,e?.occurred_at,e?.posted_at,e?.paid_at,e?.received_at,e?.submitted_at,e?.approved_at,e?.settled_at,e?.last_seen_at,e?.first_seen_at,e?.last_sync_at,e?.created_at];for(const n of t){const a=Ee(n);if(Number.isFinite(a))return a}return 0}function qe(e,t){return[...t].sort((n,a)=>{const r=R(e,n),i=R(e,a),o=r.localeCompare(i);if(o!==0)return o;const s=j(n)-j(a);return s!==0?s:JSON.stringify(n).localeCompare(JSON.stringify(a))})}function en(e){return[...e].sort((t,n)=>{const a=l(t?.table_name),r=l(n?.table_name),i=a.localeCompare(r);if(i!==0)return i;const o=l(t?.row_pk),s=l(n?.row_pk),c=o.localeCompare(s);if(c!==0)return c;const d=j(t)-j(n);return d!==0?d:JSON.stringify(t).localeCompare(JSON.stringify(n))})}function N(e=[],t="id"){return new Set(e.map(n=>l(n?.[t])).filter(Boolean))}function me(e,t=[],n=new Set){let a=e;for(const r of t){const i=l(a?.[r]);i&&!n.has(i)&&(a={...a,[r]:null})}return a}const b=Object.freeze({created_at:"1970-01-01T00:00:00.000Z",updated_at:"1970-01-01T00:00:00.000Z"});function y(e,t,n,a){const r=N(e[t]),i=[];for(const o of n){const s=l(o);!s||r.has(s)||(i.push(a(s)),r.add(s))}return i.length===0?0:(e[t]=qe(t,[...m({tables:e},t),...i]),i.length)}function O(e,t){const n=new Set;for(const a of e){const r=l(a?.[t]);r&&n.add(r)}return n}function vs(e,t,n="system_fk_preserve_accounts"){return t.synthesizedAccountGroups+=y(e,"account_groups",[n],a=>({id:a,name:p("snapshot.preserve_group","資料保全群組"),type:"other",sort_order:9999,is_archived:1,...b})),n}function ee(e,t,n){if(!n?.length)return 0;const a=vs(e,t);return y(e,"accounts",n,r=>({id:r,group_id:a,name:p("snapshot.preserve_account","資料保全帳戶"),account_type:"asset",account_kind:"cash",allow_negative:1,opening_balance_minor:0,currency_code:"TWD",include_in_assets:0,include_in_group_statistics:0,sort_order:9999,is_archived:1,...b}))}function Ct(e,t,n){if(!n?.length)return 0;const a="system_fk_preserve_categories";return t.synthesizedCategoryGroups+=y(e,"category_groups",[a],r=>({id:r,name:p("snapshot.preserve_category_group","資料保全分類群組"),type:"expense",sort_order:9999,is_archived:1,...b})),y(e,"categories",n,r=>({id:r,group_id:a,name:p("snapshot.preserve_category","資料保全分類"),type:"expense",sort_order:9999,is_archived:1,...b}))}function ks(e){const t={...e},n={synthesizedAccountGroups:0,synthesizedAccounts:0,synthesizedCategoryGroups:0,synthesizedCategories:0,synthesizedCounterparties:0,synthesizedBudgets:0,synthesizedBankConnections:0,synthesizedLoans:0,nulledOptionalRefs:0,droppedChildRows:0},a=m({tables:t},"accounts");n.synthesizedAccountGroups+=y(t,"account_groups",O(a,"group_id"),_=>({id:_,name:p("snapshot.preserve_group","資料保全群組"),type:"other",sort_order:9999,is_archived:1,...b})),t.accounts=a;let r=N(t.accounts);const i=m({tables:t},"categories");n.synthesizedCategoryGroups+=y(t,"category_groups",O(i,"group_id"),_=>({id:_,name:p("snapshot.preserve_category_group","資料保全分類群組"),type:"expense",sort_order:9999,is_archived:1,...b})),t.categories=i;let o=N(t.categories);const s=m({tables:t},"transactions"),c=[...O(s,"account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ee(t,n,c),r=N(t.accounts);const d=[...O(s,"peer_account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ee(t,n,d),r=N(t.accounts);const E=[...O(s,"category_id")].filter(_=>!o.has(_));n.synthesizedCategories+=Ct(t,n,E),o=N(t.categories),t.transactions=s;const u=N(t.transactions);t.transaction_attachments=m({tables:t},"transaction_attachments");const T=m({tables:t},"loans");n.synthesizedCounterparties+=y(t,"counterparties",O(T,"counterparty_id"),_=>({id:_,name:p("snapshot.preserve_counterparty","資料保全往來對象"),...b})),t.loans=T;let g=N(t.loans);const L=m({tables:t},"loan_payments"),M=[...O(L,"loan_id")].filter(_=>!g.has(_));n.synthesizedLoans+=y(t,"loans",M,_=>({id:_,counterparty_id:null,principal_minor:0,status:"active",...b})),g=N(t.loans),n.synthesizedAccounts+=ee(t,n,[...O(L,"account_id")].filter(_=>!r.has(_))),r=N(t.accounts),t.loan_payments=L.map(_=>me(_,["generated_tx_id","generated_interest_tx_id"],u));const A=m({tables:t},"reimbursement_advances");n.synthesizedAccounts+=ee(t,n,[...O(A,"account_id")].filter(_=>!r.has(_))),r=N(t.accounts),t.reimbursement_advances=A.map(_=>me(_,["source_tx_id"],u));const P=N(t.reimbursement_advances),Z=m({tables:t},"reimbursement_advance_usages"),ie=[...O(Z,"advance_id")].filter(_=>!P.has(_));if(ie.length>0){const _="system_fk_preserve_advance_account";n.synthesizedAccounts+=ee(t,n,[_]),r=N(t.accounts),y(t,"reimbursement_advances",ie,k=>({id:k,account_id:_,amount_minor:0,...b}))}t.reimbursement_advance_usages=Z.map(_=>{const k=l(_?.expense_tx_id),B=me(_,["expense_tx_id"],u);return k&&!l(B?.expense_tx_id)&&(n.nulledOptionalRefs+=1),B});const ve=m({tables:t},"reimbursements");n.synthesizedCounterparties+=y(t,"counterparties",O(ve,"counterparty_id"),_=>({id:_,name:p("snapshot.preserve_counterparty","資料保全往來對象"),...b})),t.reimbursements=ve.map(_=>{const k=l(_?.paid_tx_id),B=me(_,["paid_tx_id"],u);return k&&!l(B?.paid_tx_id)&&(n.nulledOptionalRefs+=1),B});let q=N(t.reimbursements);const D=m({tables:t},"reimbursement_items"),h=[...O(D,"reimbursement_id")].filter(_=>!q.has(_));y(t,"reimbursements",h,_=>({id:_,title:p("snapshot.preserve_claim","資料保全請款"),status:"open",total_minor:0,...b})),n.synthesizedAccounts+=ee(t,n,[...O(D,"account_id")].filter(_=>!r.has(_))),r=N(t.accounts),n.synthesizedCategories+=Ct(t,n,[...O(D,"category_id")].filter(_=>!o.has(_))),o=N(t.categories),t.reimbursement_items=D.map(_=>{const k=l(_?.transaction_id),B=me(_,["transaction_id"],u);return k&&!l(B?.transaction_id)&&(n.nulledOptionalRefs+=1),B});const v=m({tables:t},"reimbursement_payments"),K=[...O(v,"reimbursement_id")].filter(_=>!q.has(_));y(t,"reimbursements",K,_=>({id:_,title:p("snapshot.preserve_claim","資料保全請款"),status:"open",total_minor:0,paid_minor:0,...b})),q=N(t.reimbursements),n.synthesizedAccounts+=ee(t,n,[...O(v,"account_id")].filter(_=>!r.has(_))),r=N(t.accounts),t.reimbursement_payments=v.map(_=>{const k=l(_?.generated_tx_id),B=me(_,["generated_tx_id"],u);return k&&!l(B?.generated_tx_id)&&(n.nulledOptionalRefs+=1),B});let Y=N(t.reimbursement_payments);const oe=N(t.reimbursement_items),se=m({tables:t},"reimbursement_payment_allocations"),le=[...O(se,"payment_id")].filter(_=>!Y.has(_)),Ae=[...q][0]||"system_fk_preserve_reimbursement";le.length&&!q.has(Ae)&&(y(t,"reimbursements",[Ae],_=>({id:_,title:p("snapshot.preserve_claim","資料保全請款"),status:"open",total_minor:0,paid_minor:0,...b})),q=N(t.reimbursements)),y(t,"reimbursement_payments",le,_=>({id:_,reimbursement_id:Ae,paid_at:"1970-01-01T00:00:00.000Z",amount_minor:1,...b})),Y=N(t.reimbursement_payments);const Yr=[...O(se,"item_id")].filter(_=>!oe.has(_));y(t,"reimbursement_items",Yr,_=>({id:_,reimbursement_id:Ae,source_type:"manual",entry_type:"expense",amount_minor:0,occurred_at:"1970-01-01T00:00:00.000Z",...b})),t.reimbursement_payment_allocations=se;const Wr=m({tables:t},"budgets");t.budgets=Wr;let Je=N(t.budgets);const on=m({tables:t},"budget_containers"),$r=[...O(on,"budget_id")].filter(_=>!Je.has(_));n.synthesizedBudgets+=y(t,"budgets",$r,_=>({id:_,month_key:"1970-01",...b})),Je=N(t.budgets),t.budget_containers=on;const Ze=m({tables:t},"budget_items"),qr=[...O(Ze,"budget_id")].filter(_=>!Je.has(_));n.synthesizedBudgets+=y(t,"budgets",qr,_=>({id:_,month_key:"1970-01",...b})),Je=N(t.budgets),n.synthesizedCategories+=Ct(t,n,Ze.filter(_=>l(_?.scope_type)==="category").map(_=>l(_?.category_id)).filter(_=>_&&!o.has(_))),o=N(t.categories),n.synthesizedCategoryGroups+=y(t,"category_groups",Ze.filter(_=>l(_?.scope_type)==="group").map(_=>l(_?.category_group_id)).filter(_=>_&&!N(t.category_groups).has(_)),_=>({id:_,name:p("snapshot.preserve_category_group","資料保全分類群組"),type:"expense",sort_order:9999,is_archived:1,...b})),t.budget_items=Ze;const sn=m({tables:t},"savings_jars");n.synthesizedAccounts+=ee(t,n,[...O(sn,"account_id")].filter(_=>!r.has(_))),r=N(t.accounts),t.savings_jars=sn;const zr=m({tables:t},"bank_connections");t.bank_connections=zr;let Q=N(t.bank_connections);const At=m({tables:t},"bank_accounts"),Vr=[...O(At,"connection_id")].filter(_=>!Q.has(_));n.synthesizedBankConnections+=y(t,"bank_connections",Vr,_=>({id:_,provider:"fk_preserve",display_name:p("snapshot.preserve_bank_connection","資料保全銀行連線"),...b})),Q=N(t.bank_connections),n.synthesizedAccounts+=ee(t,n,[...O(At,"mapped_account_id")].filter(_=>!r.has(_))),r=N(t.accounts),t.bank_accounts=At;let dn=N(t.bank_accounts);const Ot=m({tables:t},"bank_transactions"),Jr=[...O(Ot,"connection_id")].filter(_=>!Q.has(_));n.synthesizedBankConnections+=y(t,"bank_connections",Jr,_=>({id:_,provider:"fk_preserve",display_name:p("snapshot.preserve_bank_connection","資料保全銀行連線"),...b})),Q=N(t.bank_connections);const cn=[...O(Ot,"bank_account_id")].filter(_=>!dn.has(_));if(cn.length>0){const _=[...Q][0]||"system_fk_preserve_bank_connection";[...Q].length||(n.synthesizedBankConnections+=y(t,"bank_connections",[_],k=>({id:k,provider:"fk_preserve",display_name:p("snapshot.preserve_bank_connection","資料保全銀行連線"),...b})),Q=N(t.bank_connections)),y(t,"bank_accounts",cn,k=>({id:k,connection_id:[...Q][0],display_name:p("snapshot.preserve_bank_account","資料保全銀行帳戶"),...b})),dn=N(t.bank_accounts)}t.bank_transactions=Ot.map(_=>{const k=l(_?.imported_txn_id),B=me(_,["imported_txn_id"],u);return k&&!l(B?.imported_txn_id)&&(n.nulledOptionalRefs+=1),B});const _n=m({tables:t},"bank_sync_rules"),Zr=[...O(_n,"connection_id")].filter(_=>!Q.has(_));return n.synthesizedBankConnections+=y(t,"bank_connections",Zr,_=>({id:_,provider:"fk_preserve",display_name:p("snapshot.preserve_bank_connection","資料保全銀行連線"),...b})),t.bank_sync_rules=_n,n.droppedChildRows=0,t.__fk_preserve_report=n,t}function Xs(e){try{const t=JSON.parse(String(e?.payload_json??"{}"));return t&&typeof t=="object"?t:null}catch{return null}}function Fs(e=[]){let t=0;for(const n of e)t=Math.max(t,j(n));return t}function Ms(e,t){const n={...e},a=(r,i,o)=>{const s=l(i);if(!s||N(n[r]).has(s))return;const d=`${r}::${s}`,E=t.get(d);if(!E)return;const u=Ee(E.deleted_at),T=Fs(o);if(!Number.isFinite(u)||!(T>u))return;const g=Xs(E);if(!g)return;const L={...w(g),id:s,updated_at:ct(g.updated_at)||ct(T)||new Date().toISOString()};n[r]=qe(r,[...m({tables:n},r),L]),t.delete(d)};for(const r of m({tables:n},"transactions"))a("accounts",r?.account_id,[r]),a("accounts",r?.peer_account_id,[r]),a("categories",r?.category_id,[r]);for(const r of m({tables:n},"accounts"))a("account_groups",r?.group_id,[r,...m({tables:n},"transactions").filter(i=>l(i?.account_id)===l(r?.id)||l(i?.peer_account_id)===l(r?.id))]);for(const r of m({tables:n},"categories"))a("category_groups",r?.group_id,[r,...m({tables:n},"transactions").filter(i=>l(i?.category_id)===l(r?.id))]);return n}function Bs(e){if(!e||typeof e!="object")return null;const t=l(e.table_name),n=l(e.row_pk);if(!t||!n)return null;const a=ct(e.deleted_at||e.updated_at||e.created_at)||new Date().toISOString();return{...w(e),table_name:t,row_pk:n,payload_json:String(e?.payload_json??"{}"),deleted_at:a}}function tn(e=[]){const t=new Map;for(const n of e){const a=Bs(n);if(!a)continue;const r=`${a.table_name}::${a.row_pk}`,i=Ee(a.deleted_at),o=t.get(r),s=Ee(o?.deleted_at);(!o||i>=s)&&t.set(r,a)}return t}function Re(e,t){return JSON.stringify(e)===JSON.stringify(t)}function xs(e,t,n="remote"){return vr(e,t,n).row}function Ce(e,t){return`${e}::${t}`}function vr(e,t,n="remote"){if(!e&&!t)return{row:null,source:"none"};if(!e)return{row:w(t),source:"remote"};if(!t)return{row:w(e),source:"local"};if(Re(e,t))return{row:w(e),source:"same"};const a=j(e),r=j(t);if(a>r)return{row:w(e),source:"local"};if(r>a)return{row:w(t),source:"remote"};const i=n==="local"?"local":"remote";return{row:w(i==="local"?e:t),source:i}}function xt(e,t,n){for(const[a,r]of m({tables:e},t).entries())if(R(t,r,a)===n)return r;return null}function X(e,t,n,a,r){const i=l(n);if(!i||!a||!r)return;const o=`${t}::${i}`;e.has(o)||e.set(o,{type:t,unitKey:i,members:[]});const s=e.get(o);s.members.some(c=>c.tableName===a&&c.rowKey===r)||s.members.push({tableName:a,rowKey:r})}function Gs(e,t){const n=new Map;for(const a of[e,t])for(const r of m({tables:a},"transactions")){const i=l(r?.transfer_group_id);if(!i)continue;const o=R("transactions",r);X(n,"transfer_group",i,"transactions",o)}for(const a of[e,t])for(const r of m({tables:a},"loan_payments")){const i=l(r?.id)||R("loan_payments",r);X(n,"loan_payment_bundle",i,"loan_payments",R("loan_payments",r));for(const o of[r?.generated_tx_id,r?.generated_interest_tx_id]){const s=l(o);if(!s)continue;const c=m({tables:a},"transactions").find(d=>l(d?.id)===s);c&&X(n,"loan_payment_bundle",i,"transactions",R("transactions",c))}}for(const a of[e,t])for(const r of m({tables:a},"reimbursements")){const i=l(r?.id);if(!i)continue;X(n,"reimbursement_bundle",i,"reimbursements",R("reimbursements",r));for(const s of m({tables:a},"reimbursement_items"))l(s?.reimbursement_id)===i&&X(n,"reimbursement_bundle",i,"reimbursement_items",R("reimbursement_items",s));const o=new Set;for(const s of m({tables:a},"reimbursement_payments"))l(s?.reimbursement_id)===i&&(o.add(l(s?.id)),X(n,"reimbursement_bundle",i,"reimbursement_payments",R("reimbursement_payments",s)));for(const s of m({tables:a},"reimbursement_payment_allocations"))o.has(l(s?.payment_id))&&X(n,"reimbursement_bundle",i,"reimbursement_payment_allocations",R("reimbursement_payment_allocations",s))}for(const a of[e,t])for(const r of m({tables:a},"reimbursement_advances")){const i=l(r?.id);if(i){X(n,"advance_bundle",i,"reimbursement_advances",R("reimbursement_advances",r));for(const o of m({tables:a},"reimbursement_advance_usages"))l(o?.advance_id)===i&&X(n,"advance_bundle",i,"reimbursement_advance_usages",R("reimbursement_advance_usages",o))}}for(const a of[e,t])for(const r of m({tables:a},"credit_statements")){const i=l(r?.account_id);if(!i)continue;const o=i;X(n,"credit_card_bundle",o,"credit_statements",R("credit_statements",r));const s=m({tables:a},"accounts").find(d=>l(d?.id)===i);s&&X(n,"credit_card_bundle",o,"accounts",R("accounts",s));for(const d of m({tables:a},"credit_repayments")){if(l(d?.account_id)!==i)continue;X(n,"credit_card_bundle",o,"credit_repayments",R("credit_repayments",d));const E=l(d?.id);for(const u of m({tables:a},"credit_repayment_allocations"))l(u?.repayment_id)===E&&X(n,"credit_card_bundle",o,"credit_repayment_allocations",R("credit_repayment_allocations",u))}const c=l(r?.id);for(const d of m({tables:a},"transaction_postings")){if(l(d?.statement_id)!==c)continue;X(n,"credit_card_bundle",o,"transaction_postings",R("transaction_postings",d));const E=l(d?.transaction_id);if(!E)continue;const u=m({tables:a},"transactions").find(T=>l(T?.id)===E);u&&X(n,"credit_card_bundle",o,"transactions",R("transactions",u))}}return Array.from(n.values())}function Ps(e,t,n,a){let r=0,i=0;for(const o of e.members){const s=xt(t,o.tableName,o.rowKey),c=xt(n,o.tableName,o.rowKey);s&&(r=Math.max(r,j(s))),c&&(i=Math.max(i,j(c)))}return r>i?"local":i>r?"remote":a==="local"?"local":"remote"}function js(e,t,n,a){const r=(e[t]??[]).filter((i,o)=>R(t,i,o)!==n);a&&r.push(w(a)),e[t]=qe(t,r)}function kr({mergedTables:e,rowDecisions:t,localTables:n,remoteTables:a,prefer:r}){const i=[],o={...e};for(const s of Gs(n,a)){const c=new Set;for(const u of s.members){const T=t.get(Ce(u.tableName,u.rowKey));(T?.source==="local"||T?.source==="remote")&&c.add(T.source)}if(c.size<2)continue;const d=Ps(s,n,a,r);i.push({tableName:s.members[0]?.tableName??"",rowKey:s.unitKey,conflictType:s.type,unitKey:s.unitKey,resolution:d});const E=d==="local"?n:a;for(const u of s.members){const T=xt(E,u.tableName,u.rowKey);js(o,u.tableName,u.rowKey,T),t.set(Ce(u.tableName,u.rowKey),{source:T?d:"none",row:T?w(T):null})}}return{conflicts:i,mergedTables:o}}function Xr(e,t,n){const a=[];for(const[r,i]of t.entries()){const o=`${e}::${r}`,s=n.get(o),c=j(i),d=Ee(s?.deleted_at);s&&Number.isFinite(d)&&d>=c||(s&&c>d&&n.delete(o),a.push(i))}return qe(e,a)}function Hs(e,t,n={}){const a=n?.prefer==="local"?"local":"remote",r=Qt(e,t),i=tn([...m(e,"deleted_log"),...m(t,"deleted_log")]),o={},s=new Map;for(const d of r){const E=new Map;for(const[u,T]of m(e,d).entries()){const g=R(d,T,u),L=w(T);E.set(g,L),s.set(Ce(d,g),{source:"local",row:L})}for(const[u,T]of m(t,d).entries()){const g=R(d,T,u),L=vr(E.get(g),T,a);L.row?E.set(g,L.row):E.delete(g),s.set(Ce(d,g),L)}o[d]=Xr(d,E,i)}o.deleted_log=en(Array.from(i.values()));const c=kr({mergedTables:o,rowDecisions:s,localTables:e.tables,remoteTables:t.tables,prefer:a});return{mergedTables:c.mergedTables,conflicts:c.conflicts}}function V(e){const t=w(e);if(!t||typeof t!="object")return{schema_version:null,ledger_id:"",exported_at:"",tables:{}};const n=Qt(t,null),a=tn(m(t,"deleted_log")),r={};for(const d of n){const E=new Map;for(const[T,g]of m(t,d).entries()){const L=R(d,g,T),M=E.get(L);E.set(L,xs(M,g,"remote"))}const u=[];for(const[T,g]of E.entries()){const L=`${d}::${T}`,M=a.get(L),A=j(g),P=Ee(M?.deleted_at);M&&Number.isFinite(P)&&P>=A||(M&&A>P&&a.delete(L),u.push(g))}r[d]=qe(d,u)}const i=Ms(r,a),o=ks(i),s=o.__fk_preserve_report||null;delete o.__fk_preserve_report,o.deleted_log=en(Array.from(a.values()));const c={schema_version:t.schema_version??null,ledger_id:l(t.ledger_id),exported_at:ct(t.exported_at),tables:o};return s&&(c.fk_preserve_report=s),c}function Ks(e){return V(e)}function oc(e,t,n={}){const a=V(e),r=V(t),i=l(a.ledger_id||r.ledger_id);if(a.ledger_id&&r.ledger_id&&a.ledger_id!==r.ledger_id)throw new Error(p("leftover.shared.snapshot_ledger_mismatch","共同帳本快照 ledger_id 不一致，無法合併"));const{mergedTables:o,conflicts:s}=Hs(a,r,n),c=V({schema_version:r.schema_version??a.schema_version??null,ledger_id:i,exported_at:new Date().toISOString(),tables:o});return n?.detectConflicts?{mergedSnapshot:c,conflicts:s,hasConflicts:s.length>0}:c}function sc(e,t,n,a={}){const r=V(e),i=V(t),o=V(n),s=l(i.ledger_id||o.ledger_id||r.ledger_id);if(i.ledger_id&&o.ledger_id&&i.ledger_id!==o.ledger_id)throw new Error(p("leftover.shared.snapshot_ledger_mismatch","共同帳本快照 ledger_id 不一致，無法合併"));const c=a?.prefer==="local"?"local":"remote",d=Qt(i,o),E=tn([...m(r,"deleted_log"),...m(i,"deleted_log"),...m(o,"deleted_log")]),u={},T=[],g=new Map;for(const A of d){const P=new Map;for(const[D,h]of m(r,A).entries())P.set(R(A,h,D),w(h));const Z=new Map;for(const[D,h]of m(i,A).entries())Z.set(R(A,h,D),w(h));const ie=new Map;for(const[D,h]of m(o,A).entries())ie.set(R(A,h,D),w(h));const ve=new Set([...P.keys(),...Z.keys(),...ie.keys()]),q=new Map;for(const D of ve){const h=P.get(D)??null,v=Z.get(D)??null,K=ie.get(D)??null;let Y=null,oe="same";if(Re(v,h))Y=K,oe=K&&!Re(K,h)?"remote":"same";else if(Re(K,h))Y=v,oe=v&&!Re(v,h)?"local":"same";else if(Re(v,K))Y=v,oe="same";else{const se=j(v),le=j(K);if(se!==le){const Ae=le>se;Y=c==="local"?se>=le?v:K:le>=se?K:v,oe=Ae?"remote":"local"}else Y=c==="local"?v:K,oe=c;T.push({tableName:A,rowKey:D,baseRow:h,localRow:v,remoteRow:K,chosenRow:Y,resolution:c})}if(!Y){g.set(Ce(A,D),{source:"none",row:null});continue}q.set(D,Y),g.set(Ce(A,D),{source:oe,row:Y})}u[A]=Xr(A,q,E)}u.deleted_log=en(Array.from(E.values()));const L=kr({mergedTables:u,rowDecisions:g,localTables:i.tables,remoteTables:o.tables,prefer:c});return T.push(...L.conflicts),{mergedSnapshot:V({schema_version:o.schema_version??i.schema_version??r.schema_version??null,ledger_id:s,exported_at:new Date().toISOString(),tables:L.mergedTables}),conflicts:T,hasConflicts:T.length>0}}function dc(e=[],t={}){const n=t?.prefer==="local"?"local":"remote",a=l(t?.mergeMode)||"unknown",r=Array.isArray(e)?e:[];return{mergeMode:a,prefer:n,conflictCount:r.length,conflicts:r.map(i=>({tableName:l(i?.tableName),rowKey:l(i?.rowKey),conflictType:l(i?.conflictType)||"row",unitKey:l(i?.unitKey),resolution:l(i?.resolution)||n})),recordedAt:new Date().toISOString()}}function cc(e,t){const n=V(e),a=V(t),r={schema_version:n.schema_version??null,ledger_id:n.ledger_id,tables:n.tables},i={schema_version:a.schema_version??null,ledger_id:a.ledger_id,tables:a.tables};return JSON.stringify(r)===JSON.stringify(i)}const Ys=Object.freeze(["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","reimbursement_payments","reimbursement_payment_allocations","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"]);function f(...e){return Object.freeze(new Set(e))}function I(e){const t={};for(const[n,a]of Object.entries(e))t[n]=Object.freeze([...a]);return Object.freeze(t)}const Ws=Object.freeze({account_groups:{columns:f("ledger_id","id","name","type","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","type","created_at","updated_at"]),enums:I({type:["cash","bank","ewallet","credit_card","other"]})},accounts:{columns:f("ledger_id","id","group_id","name","account_type","account_kind","allow_negative","opening_balance_minor","currency_code","icon","credit_limit_minor","repayment_reminder_day","statement_close_day","payment_due_day","card_last4","issuer","sort_order","is_archived","created_at","updated_at","deleted_at","include_in_assets","include_in_group_statistics","is_settlement"),required:Object.freeze(["id","group_id","name","created_at","updated_at"]),enums:I({account_type:["asset","liability"],account_kind:["cash","credit"]})},category_groups:{columns:f("ledger_id","id","name","kind","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},categories:{columns:f("ledger_id","id","group_id","name","kind","icon","is_budgetable","sort_order","is_archived","created_at","updated_at","deleted_at","default_include_in_analysis","default_include_in_budget","default_is_reimbursable","system_key"),required:Object.freeze(["id","group_id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},transactions:{columns:f("ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","posted_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at","is_reimbursable","reimbursement_state","reimbursed_at","reimburse_target_minor","created_by_user_id","created_by_display_name","updated_by_user_id","updated_by_display_name"),required:Object.freeze(["id","type","account_id","amount_minor","occurred_at","created_at","updated_at"]),enums:I({type:["expense","income","adjustment","transfer"],origin_type:["manual","loan_payment","reimbursement","import","recurring","refund","wear"],reimbursement_state:["none","pending","reimbursed"]})},wear_applied:{columns:f("idempotency_key","ledger_id","tx_id","applied_at"),required:Object.freeze(["idempotency_key","ledger_id","tx_id","applied_at"])},transaction_attachments:{columns:f("ledger_id","id","transaction_id","file_uri","mime_type","file_size","checksum","created_at"),required:Object.freeze(["id","transaction_id","file_uri","mime_type","file_size","created_at"])},counterparties:{columns:f("ledger_id","id","name","contact_json","note","is_archived","created_at","updated_at"),required:Object.freeze(["id","name","created_at","updated_at"])},loans:{columns:f("ledger_id","id","counterparty_id","direction","principal_minor","interest_rule_json","start_date","due_date","status","settled_at","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","counterparty_id","direction","principal_minor","start_date","status","created_at","updated_at"]),enums:I({direction:["lend","borrow"],status:["active","partial","settled","void"]})},loan_payments:{columns:f("ledger_id","id","loan_id","account_id","paid_at","amount_minor","principal_component_minor","interest_component_minor","generated_tx_id","generated_interest_tx_id","note","created_at","updated_at"),required:Object.freeze(["id","loan_id","account_id","paid_at","amount_minor","created_at","updated_at"])},reimbursement_advances:{columns:f("ledger_id","id","account_id","source_tx_id","amount_minor","used_minor","note","received_at","created_at","updated_at","deleted_at","category_id","return_amount_minor"),required:Object.freeze(["id","account_id","received_at","created_at","updated_at"])},reimbursement_advance_usages:{columns:f("ledger_id","id","advance_id","expense_tx_id","amount_minor","created_at","updated_at"),required:Object.freeze(["id","advance_id","expense_tx_id","created_at","updated_at"])},reimbursements:{columns:f("ledger_id","id","title","counterparty_id","status","submitted_at","approved_at","paid_at","paid_tx_id","total_minor","paid_minor","note","idempotency_key","created_at","updated_at","deleted_at"),required:Object.freeze(["id","title","status","created_at","updated_at"]),enums:I({status:["draft","submitted","in_review","approved","paid","rejected"]})},reimbursement_items:{columns:f("ledger_id","id","reimbursement_id","source_type","transaction_id","category_id","account_id","description","amount_minor","settled_minor","occurred_at","attachment_uri","created_at","updated_at","entry_type"),required:Object.freeze(["id","reimbursement_id","source_type","amount_minor","occurred_at","created_at","updated_at"]),enums:I({source_type:["transaction","manual","advance"],entry_type:["expense","income"]})},reimbursement_payments:{columns:f("ledger_id","id","reimbursement_id","account_id","paid_at","amount_minor","generated_tx_id","note","created_at","updated_at"),required:Object.freeze(["id","reimbursement_id","paid_at","amount_minor","created_at","updated_at"])},reimbursement_payment_allocations:{columns:f("ledger_id","id","payment_id","item_id","amount_minor","created_at","updated_at"),required:Object.freeze(["id","payment_id","item_id","amount_minor","created_at","updated_at"])},budget_save_settlements:{columns:f("ledger_id","id","scope_type","scope_ref_id","period_key","source_account_id","target_account_id","settled_amount_minor","status","transfer_group_id","last_error","created_at","updated_at"),required:Object.freeze(["id","scope_type","scope_ref_id","period_key","status","created_at","updated_at"]),enums:I({scope_type:["budget_item_day","budget_item_month","budget_total_month"],status:["settled","skipped_no_surplus","invalid_config","conflict","failed"]})},budgets:{columns:f("ledger_id","id","month_key","name","include_transfers","include_loan_repayments","include_reimbursed_expenses","created_at","updated_at","deleted_at","budget_save_total_enabled","budget_save_total_target_account_id","budget_save_total_source_account_id","period_key","period_start_date","period_end_date","period_mode"),required:Object.freeze(["id","month_key","created_at","updated_at"])},budget_containers:{columns:f("ledger_id","id","budget_id","name","amount_minor","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","sort_order","created_at","updated_at","period_mode","surplus_mode"),required:Object.freeze(["id","budget_id","name","created_at","updated_at"]),enums:I({surplus_mode:["roll","save"]})},budget_items:{columns:f("ledger_id","id","budget_id","scope_type","category_id","category_group_id","amount_minor","sort_order","created_at","updated_at","amount_mode","day_rule_unit","day_rule_values_json","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","budget_container_id"),required:Object.freeze(["id","budget_id","scope_type","amount_minor","created_at","updated_at"]),enums:I({scope_type:["category","group"],amount_mode:["fixed","daily_average"],day_rule_unit:["none","weekday","monthday"]})},savings_jars:{columns:f("ledger_id","account_id","goal_type","target_amount_minor","created_at","updated_at","auto_save_source_account_id","auto_save_amount_minor","auto_save_interval_value","auto_save_interval_unit","auto_save_start_date","auto_save_charge_day","auto_save_paused"),required:Object.freeze(["account_id","created_at","updated_at"]),enums:I({goal_type:["open","target"]})},securities:{columns:f("ledger_id","id","symbol","name","market","asset_class","currency_code","include_in_assets","manual_price_minor","manual_price_at","price_source","sort_order","is_archived","settlement_account_id","created_at","updated_at","deleted_at"),required:Object.freeze(["id","symbol","name","created_at","updated_at"]),enums:I({asset_class:["stock","etf"]})},security_transactions:{columns:f("ledger_id","id","security_id","type","occurred_at","quantity","price_minor","fee_minor","fee_mode","record_mode","principal_minor","proceeds_minor","settle_at","settlement_status","confirmed_at","cash_account_id","cash_principal_tx_id","cash_pnl_tx_id","source_buy_tx_id","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","security_id","type","occurred_at","quantity","price_minor","created_at","updated_at"]),enums:I({type:["buy","sell"],fee_mode:["into_cost","from_proceeds"],record_mode:["position","funds"],settlement_status:["scheduled","confirmed","cancelled"]})},credit_statements:{columns:f("ledger_id","id","account_id","period_start_inclusive","period_end_exclusive","status","closing_balance_minor","due_on","closed_at","closing_hash","close_token","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","period_start_inclusive","period_end_exclusive","status","created_at","updated_at"]),enums:I({status:["open","closed"]})},credit_repayments:{columns:f("ledger_id","id","account_id","source_account_id","amount_minor","paid_at","transfer_group_id","idempotency_key","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","source_account_id","amount_minor","paid_at","idempotency_key","created_at","updated_at"])},credit_repayment_allocations:{columns:f("ledger_id","id","repayment_id","statement_id","amount_minor","created_at","updated_at","deleted_at"),required:Object.freeze(["id","repayment_id","statement_id","amount_minor","created_at","updated_at"])},transaction_postings:{columns:f("ledger_id","id","transaction_id","role","account_id","category_id","amount_minor","statement_id","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at"),required:Object.freeze(["id","transaction_id","role","amount_minor","created_at","updated_at"]),enums:I({role:["expense_accrual","card_liability","cash_transfer","fee","adjustment","reversal"]})},bank_connections:{columns:f("ledger_id","id","provider","provider_connection_id","status","user_label","last_sync_at","sync_cursor","last_sync_status","last_error","last_attempt_at","last_full_success_at","auto_import_enabled","created_at","updated_at","deleted_at"),required:Object.freeze(["id","provider","provider_connection_id","created_at","updated_at"]),enums:I({status:["active","revoked","error"],last_sync_status:["idle","ok","error"]})},bank_accounts:{columns:f("ledger_id","id","connection_id","provider_account_id","account_mask","account_name","account_type","currency","enabled","user_label","mapped_account_id","last_success_sync_at","sync_cursor","last_sync_status","last_error","created_at","updated_at","deleted_at"),required:Object.freeze(["id","connection_id","provider_account_id","account_name","created_at","updated_at"]),enums:I({last_sync_status:["idle","ok","error"]})},bank_transactions:{columns:f("ledger_id","id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","currency","description","merchant","status","seen_in_app","imported","imported_txn_id","raw_json","first_seen_at","last_seen_at","created_at","updated_at","transaction_type","note","summary","balance_minor","identity_scheme"),required:Object.freeze(["id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","first_seen_at","last_seen_at","created_at","updated_at"]),enums:I({status:["pending","posted","reversed"]})},bank_sync_rules:{columns:f("ledger_id","connection_id","direction","exclude_keywords_json","min_amount_minor","include_pending","lookback_days","updated_at"),required:Object.freeze(["connection_id","updated_at"]),enums:I({direction:["all","income","expense"]})},app_settings:{columns:f("ledger_id","key","value_json","updated_at"),required:Object.freeze(["key","value_json","updated_at"])},deleted_log:{columns:f("id","ledger_id","table_name","row_pk","payload_json","deleted_at"),required:Object.freeze(["table_name","row_pk","payload_json","deleted_at"])}});function Fr(e,t){const n=String(e??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n))throw new Error(`表 ${t} 欄位名稱不合法：${n}`);return n}function $s(e,t){const n=Object.keys(t).map(o=>Fr(o,e));if(!n.length)throw new Error(`表 ${e} 缺少欄位資料`);const a=n.map(()=>"?").join(", "),r=`INSERT INTO ${e} (${n.join(", ")}) VALUES (${a});`,i=n.map(o=>t[o]);return{sql:r,values:i}}function Mr(e){return e==null||e===""}function qs(e,t,n){const a=t?.enums;if(!(!a||typeof a!="object"))for(const[r,i]of Object.entries(a)){if(!(r in n)||Mr(n[r]))continue;const o=n[r];if(!i.includes(o))throw new Error(`表 ${e} 欄位 ${r} 值不符合約束：${o}`)}}function zs(e){const t=e?.tables&&typeof e.tables=="object"?e.tables:{};for(const n of Ys){const a=Array.isArray(t[n])?t[n]:[],r=Ws[n];if(!r)throw new Error(`表 ${n} 缺少匯入 schema 合約`);for(let i=0;i<a.length;i+=1){const o=a[i];if(!o||typeof o!="object"||Array.isArray(o))throw new Error(`表 ${n} 第 ${i+1} 筆資料格式無效`);const s={...o,ledger_id:o.ledger_id||"gate_ledger_probe"};n==="deleted_log"&&delete s.id;const c=Object.keys(s);if(!c.length)throw new Error(`表 ${n} 缺少欄位資料`);for(const d of c)if(Fr(d,n),!r.columns.has(d))throw new Error(`表 ${n} 含不存在的欄位：${d}`);for(const d of r.required)if(Mr(s[d]))throw new Error(`表 ${n} 缺少必要欄位：${d}`);qs(n,r,s),$s(n,s)}}}function Vs(e){try{return JSON.parse(String(e??""))}catch{throw new Error("JSON 格式錯誤")}}function Js(e){const t=e?.ledger_id??e?.tables?.ledgers?.[0]?.id;if(!t)throw new Error("JSON 缺少 ledger_id");const n=e?.tables?.ledgers?.find(a=>a.id===t)??e?.tables?.ledgers?.[0];if(!n)throw new Error("JSON 缺少 ledgers 資料");return{sourceLedgerId:t,ledgerRow:n}}function yn(e){const t=Ks(e);return Js(t),zs(t),t}function Zs(e){const t=Vs(e),n=Array.isArray(t?.ledgers)?t.ledgers:null;if(!n||t?.backup_scope!=="all_ledgers")return yn(t),{mode:"single",ledgerCount:1};if(!n.length)throw new Error("JSON 缺少可匯入的帳本資料");for(const a of n)yn(a);return{mode:"all_ledgers",ledgerCount:n.length}}const Br="DRIVE_RESTORE_PREVIEW_REQUIRED",Nt="DRIVE_RESTORE_NOT_IMPORTABLE",Qs="DRIVE_RESTORE_IMPORT_FAILED_RESTORED";function Ut(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"還原前必須完成可匯入的備份預覽。預覽失敗或內容無法解析時，禁止進入清空本機流程。",r=new Error(a);return r.code=Br,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.preview_required",r.originalMessage=n,r.silentWipeBlocked=!0,r}function J(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.parseError??"").trim(),r=String(t.message??"").trim()||`選定的 Drive 檔／舊版無法匯入（${a||n||"invalid_backup"}）。已中止，不清空本機。`,i=new Error(r);return i.code=Nt,i.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.not_importable",i.parseError=a||n,i.originalMessage=n,i.silentWipeBlocked=!0,i}function ed(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||`雲端備份匯入失敗（${n||"import_failed"}）。已從本機 durable recovery 回滾，本機資料未清空。`,r=new Error(a);if(r.code=Qs,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.import_failed_restored",r.originalMessage=n,r.localDataRestoredFromRecovery=!0,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function nn(e,t={}){const n=String(e??"");if(!n.trim())throw J(new Error("empty_json"),{...t,parseError:"empty_json"});const a=wr(n);if(!a.ok)throw J(new Error(a.parseError||"invalid_backup"),{...t,parseError:a.parseError||"invalid_backup"});try{Zs(n)}catch(r){throw r?.code===Nt?r:J(r,{...t,parseError:String(r?.message??"importer_structure_rejected").trim()||"importer_structure_rejected"})}return a}function rn(e,t={}){if(!e||typeof e!="object")throw Ut(new Error("preview_missing"),t);if(!String(e.jsonText??"").trim())throw Ut(new Error("preview_json_missing"),t);try{nn(e.jsonText,t)}catch(n){throw n?.code===Nt?Ut(n,{...t,message:n.message}):n}return e}function _c(e){try{return rn(e),!0}catch{return!1}}function Ec(e){try{return rn(e),""}catch(t){return String(t?.message??t??"").trim()}}async function td({createRecoveryBackup:e,wipeFn:t,importFn:n,restoreFromRecovery:a,source:r,i18nKey:i}={}){if(typeof n!="function")throw J(new Error("import_missing"),{parseError:"import_missing"});const o=await Ki({createRecoveryBackup:e,wipeFn:t,source:r,i18nKey:i});try{return{imported:await n(),recoveryProof:o}}catch(s){if(typeof a!="function")throw J(s,{parseError:"import_failed_after_wipe_no_rollback",message:`備份匯入失敗且無法回滾（缺少 restoreFromRecovery）：${String(s?.message??s??"").trim()||"import_failed"}`});try{await t()}catch(c){const d=J(s,{parseError:"import_failed_partial_clear_failed",message:`備份匯入失敗，且清除部分匯入殘留亦失敗：${String(c?.message??c??"").trim()||"partial_clear_failed"}`});throw d.localDataRestoredFromRecovery=!1,d.clearError=c,d}try{await a(o)}catch(c){const d=J(s,{parseError:"import_failed_rollback_failed",message:`備份匯入失敗，且 durable recovery 回滾亦失敗：${String(c?.message??c??"").trim()||"rollback_failed"}`});throw d.localDataRestoredFromRecovery=!1,d.rollbackError=c,d}throw ed(s)}}async function uc({preview:e,downloadBackup:t,createRecoveryBackup:n,wipeFn:a,importBackupJson:r,restoreFromRecovery:i,source:o,i18nKey:s}={}){if(rn(e,{i18nKey:"settings_auto_backup.drive_browser.preview_required"}),typeof t!="function")throw J(new Error("download_missing"),{parseError:"download_missing"});if(typeof r!="function")throw J(new Error("import_missing"),{parseError:"import_missing"});let c;try{c=await t()}catch(u){throw u?.code===Nt||u?.code===Br||u?.code===Wt?u:J(u,{parseError:"download_failed",message:`下載 Drive 備份失敗，已中止不清空本機：${String(u?.message??u??"").trim()||"download_failed"}`})}nn(c?.jsonText,{i18nKey:"settings_auto_backup.drive_browser.not_importable"});const{imported:d,recoveryProof:E}=await td({createRecoveryBackup:n,wipeFn:a,importFn:()=>r(c.jsonText),restoreFromRecovery:i,source:o,i18nKey:s});return{backup:c,imported:d,recoveryProof:E}}const _t="backup.google_drive",Be="StrawMoneyBook_all_ledgers.json",U=(e,t,n)=>p(e,t,n);function nd(){return{connected:!1,accountEmail:"",accountName:"",accountImageUrl:"",autoEnabled:!1,dataChangeAutoEnabled:!1,intervalHours:24,lastBackupFilename:"",lastBackupAt:"",lastBackupStatus:"idle",lastError:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:""}}function Et(e){const t=nd();return!e||typeof e!="object"?t:{...t,...e,connected:!!e.connected,accountEmail:String(e.accountEmail??"").trim(),accountName:String(e.accountName??"").trim(),accountImageUrl:String(e.accountImageUrl??"").trim(),autoEnabled:!!e.autoEnabled,dataChangeAutoEnabled:!!e.dataChangeAutoEnabled,intervalHours:Dr(e.intervalHours),lastBackupFilename:String(e.lastBackupFilename??"").trim(),lastBackupAt:String(e.lastBackupAt??""),lastBackupStatus:String(e.lastBackupStatus??"idle"),lastError:String(e.lastError??""),lastAutoCheckAt:String(e.lastAutoCheckAt??""),lastAutoCheckStatus:String(e.lastAutoCheckStatus??"idle"),lastAutoCheckReason:String(e.lastAutoCheckReason??"")}}function H(e){if(!e)throw new Error(U("settings_auto_backup.error.missing_ledger_id"))}function an(){if(!S.isNativePlatform())throw new Error(U("settings_auto_backup.error.google.native_only"))}function rd(e){return!Array.isArray(e)||!e.length?null:e.find(n=>String(n?.name??"")===Be)??e[0]}function Dn(e){return{id:String(e?.id??"").trim(),name:String(e?.name??"").trim(),modifiedTime:String(e?.modifiedTime??"").trim(),size:e?.size!=null?String(e.size):""}}function In(e){const t=String(e??"").trim();return t===Be?"all_ledgers":/^StrawMoneyBook_sync_.+\.json$/i.test(t)?"ledger_sync":/\.json$/i.test(t)?"other_json":"other"}function pt(){if(typeof window>"u")return null;const e=window.__SMB_DRIVE_APPDATA_MOCK__;return e&&typeof e=="object"?e:null}async function ft(e,t={}){H(e),an();const n=t?.interactiveAuth!==!1,a=()=>Lr({interactive:n,requireRefreshToken:!0}),r=await ze(e);if(!r.connected)throw new Error(U("settings_auto_backup.error.google.connect_required"));return{accessToken:await we({interactive:n,requireRefreshToken:!0}),reauthHandler:a,state:r}}function ad(e){return!e||typeof e!="object"?!1:!!(e.email||e.name||e.imageUrl)}function xe(e){return{email:String(e?.email??"").trim(),name:String(e?.name??"").trim(),imageUrl:String(e?.imageUrl??"").trim()}}function xr(e,t){const n={};return t.email&&t.email!==e.accountEmail&&(n.accountEmail=t.email),t.name&&t.name!==e.accountName&&(n.accountName=t.name),t.imageUrl&&t.imageUrl!==e.accountImageUrl&&(n.accountImageUrl=t.imageUrl),n}function Ge(e){return String(e??"").trim().toLowerCase()}function ut(e={}){return{connected:!0,lastError:"",lastBackupStatus:"idle",...e}}function id(e,t){const n=ut({accountEmail:t.email,accountName:t.name,accountImageUrl:t.imageUrl});return e?.lastAutoCheckReason==="reauth_required"&&(n.lastAutoCheckAt="",n.lastAutoCheckStatus="idle",n.lastAutoCheckReason=""),n}function Gr(e,t){const n=Ge(e?.accountEmail),a=Ge(t?.email);return!n||!a?!1:n!==a}async function od(e,t){if(!t.connected)return t;const n=xe(De());if(Gr(t,n)){const i=Et({...t,connected:!1,lastError:""});return await ot(e,_t,i),i}const a=xr(t,n);if(!Object.keys(a).length)return t;const r=Et({...t,...a});return await ot(e,_t,r),r}async function Pr(e=""){const t=Ge(e);let n=!1;try{await we({interactive:!1,requireRefreshToken:!0}),n=!0}catch{n=!1}let a=xe(De());if(t&&Ge(a.email)&&Ge(a.email)!==t&&(n=!1,a=xe({})),!n){const r=await Ft({preferredEmail:t||e,requireRefreshToken:!0});a=xe(r?.profile??De())}return a}function sd(e){return S.isNativePlatform()||Nr()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function dd(e){return Nr()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function cd(e){return!e||typeof e!="object"?!1:!!(e.connected||e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function _d(){return(Array.isArray(un()?.user?.auth_providers)?un().user.auth_providers:[]).some(t=>String(t?.provider??"").trim()==="google")}function Ed(e,t={}){return!t?.allowInteractiveWhenGoogleLinked||!cd(e)?!1:_d()}async function ud(e,t){if(!S.isNativePlatform()||!sd(t))return t;let n="";try{n=String(await we({interactive:!1,requireRefreshToken:!0})??"").trim()}catch{return t}if(!n)return t;const a=xe(De());if(Gr(t,a))return C(e,{connected:!1,lastError:""});const r=xr(t,a),i=ut(r);return t.connected&&!Object.keys(r).length&&!t.lastError?t:!t.connected||ad(a)?C(e,i):C(e,ut())}async function C(e,t){const n=await ze(e),a=Et({...n,...t});return await ot(e,_t,a),a}function ld(e){return e.connected?e.autoEnabled?typeof navigator<"u"&&navigator.onLine===!1?"offline":gs(e)?"":"not_due":"auto_disabled":e.lastError?"connect_restore_failed":"not_connected"}async function ze(e){H(e);const t=await nr(e,_t),n=Et(t);return od(e,n)}async function jr(e,t={}){H(e);const n=!!t.allowInteractive,a=await ze(e),r=await ud(e,a),i=String(r.accountEmail||a.accountEmail||"").trim(),o=dd(r)||Ed(r,t);if(!n||!o)return r;if(r.connected)try{return await we({interactive:!1,preferredEmail:i,requireRefreshToken:!0}),r}catch{}try{const s=await Pr(i);return C(e,ut({accountEmail:s.email,accountName:s.name,accountImageUrl:s.imageUrl}))}catch(s){const c=String(s?.message??s??"").trim();return C(e,{lastError:c||U("settings_auto_backup.error.google_connect_failed")})}}async function lc(e,t={}){return H(e),C(e,t)}async function Tc(e){H(e),an();const t=await ze(e),n=await Pr(t.accountEmail);return C(e,id(t,n))}async function mc(e){H(e);try{await jo()}catch(t){console.warn("[google-backup] sign out failed",t)}return C(e,{connected:!1,autoEnabled:!1,accountEmail:"",accountName:"",accountImageUrl:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:"",lastError:""})}async function Hr(e,t={}){H(e),an();const n=t?.interactiveAuth!==!1,a=()=>Lr({interactive:n,requireRefreshToken:!0});if(!(await ze(e)).connected)throw new Error(U("settings_auto_backup.error.google.connect_required"));const i=await we({interactive:n,requireRefreshToken:!0}),o=await Sr(),s=JSON.stringify(o,null,2),c=new Date().toISOString(),d=await Rs({accessToken:i,reauth:a,filename:Be,jsonText:s}),E=await C(e,{lastBackupFilename:d.filename||Be,lastBackupAt:d.modifiedTime||c,lastBackupStatus:"ok",lastError:""});return{filename:E.lastBackupFilename||Be,lastBackupAt:E.lastBackupAt||c}}async function gc(e,t={}){H(e);const n=pt();if(n&&typeof n.restorePreferred=="function")return n.restorePreferred({ledgerId:e,options:t});const{accessToken:a,reauthHandler:r}=await ft(e,t),i=await Cr({accessToken:a,reauth:r}),o=rd(i);if(!o?.id)throw new Error(U("settings_auto_backup.error.google.restore_file_missing"));const s=await Ur({accessToken:a,reauth:r,fileId:o.id});return{filename:String(o.name??""),modifiedTime:String(o.modifiedTime??""),fileId:String(o.id??""),revisionId:"",jsonText:s}}async function Lc(e,t={}){H(e);const n=pt();if(n&&typeof n.listFiles=="function"){const o=await n.listFiles({ledgerId:e,options:t});return(Array.isArray(o)?o:[]).map(s=>{const c=Dn(s);return{...c,kind:String(s?.kind??In(c.name))}})}const{accessToken:a,reauthHandler:r}=await ft(e,t);return(await Cr({accessToken:a,reauth:r})).map(o=>{const s=Dn(o);return{...s,kind:In(s.name)}})}async function Nc(e,t,n={}){H(e);const a=String(t??"").trim();if(!a)throw new Error(U("settings_auto_backup.error.google.restore_file_missing"));const r=pt();if(r&&typeof r.listRevisions=="function"){const s=await r.listRevisions({ledgerId:e,fileId:a,options:n});return Array.isArray(s)?s:[]}const{accessToken:i,reauthHandler:o}=await ft(e,n);return Ss({accessToken:i,reauth:o,fileId:a})}async function Td(e,t={},n={}){H(e);const a=String(t?.fileId??"").trim(),r=String(t?.revisionId??"").trim();if(!a)throw new Error(U("settings_auto_backup.error.google.restore_file_missing"));const i=pt();if(i&&typeof i.download=="function"){const d=await i.download({ledgerId:e,fileId:a,revisionId:r,options:n});return{fileId:a,revisionId:r,filename:String(d?.filename??t?.filename??""),modifiedTime:String(d?.modifiedTime??t?.modifiedTime??""),jsonText:String(d?.jsonText??"")}}const{accessToken:o,reauthHandler:s}=await ft(e,n),c=await Ur({accessToken:o,reauth:s,fileId:a,revisionId:r||void 0});return{fileId:a,revisionId:r,filename:String(t?.filename??""),modifiedTime:String(t?.modifiedTime??""),jsonText:c}}async function md(e,t={},n={}){const a=await Td(e,t,n),r=wr(a.jsonText);let i=Me(null),o="";try{const c=await Sr();i=Me(c),o=String(c?.exported_at??"").trim()}catch(c){console.warn("[google-backup] local summary failed",c)}const s=Us(r,i,{remoteModifiedAt:a.modifiedTime||r.exportedAt,localModifiedAt:o||i.exportedAt});return{...a,remoteSummary:r,localSummary:i,comparison:s}}async function pc(e,t={},n={}){const a=await md(e,t,n);if(!a.jsonText)throw new Error(U("settings_auto_backup.error.google.restore_file_missing"));return nn(a.jsonText),{filename:a.filename,modifiedTime:a.modifiedTime,fileId:a.fileId,revisionId:a.revisionId,jsonText:a.jsonText,remoteSummary:a.remoteSummary,localSummary:a.localSummary,comparison:a.comparison}}async function fc(e){H(e);const t=new Date().toISOString();if(!S.isNativePlatform())return await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await jr(e),a=ld(n);if(a){const r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:U("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}try{const r=De();return r?.email&&!n.accountEmail&&await C(e,{accountEmail:r.email,accountName:r.name||"",accountImageUrl:r.imageUrl||""}),await Hr(e,{interactiveAuth:!1}),await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"backup_completed"}),{status:"completed",skipped:!1,reason:"backup_completed",checkedAt:t}}catch(r){const i=String(r?.code??"")==="GOOGLE_REAUTH_REQUIRED",o=String(r?.message??r??"").trim(),s=o?U("settings_auto_backup.error.detail_suffix",{detail:o}):"";return await C(e,{lastBackupStatus:"error",lastError:i?U("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:s}):o||U("settings_auto_backup.error.google.auto_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:i?"reauth_required":"backup_failed",...i?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:i?"reauth_required":"backup_failed",checkedAt:t}}}async function Ac(e){H(e);const t=new Date().toISOString();if(!S.isNativePlatform())return await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await jr(e);if(!n.connected||!n.autoEnabled||!n.dataChangeAutoEnabled){const a=n.connected?n.autoEnabled?"data_change_disabled":"auto_disabled":n.lastError?"connect_restore_failed":"not_connected",r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:U("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}if(typeof navigator<"u"&&navigator.onLine===!1)return await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"offline"}),{status:"skipped",skipped:!0,reason:"offline",checkedAt:t};try{const a=De();return a?.email&&!n.accountEmail&&await C(e,{accountEmail:a.email,accountName:a.name||"",accountImageUrl:a.imageUrl||""}),await Hr(e,{interactiveAuth:!1}),await C(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"data_change_backup_completed"}),{status:"completed",skipped:!1,reason:"data_change_backup_completed",checkedAt:t}}catch(a){const r=String(a?.code??"")==="GOOGLE_REAUTH_REQUIRED",i=String(a?.message??a??"").trim(),o=i?U("settings_auto_backup.error.detail_suffix",{detail:i}):"";return await C(e,{lastBackupStatus:"error",lastError:r?U("settings_auto_backup.error.google.data_change_backup_reauth_required",{detailSuffix:o}):i||U("settings_auto_backup.error.google.data_change_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:r?"reauth_required":"backup_failed",...r?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:r?"reauth_required":"backup_failed",checkedAt:t}}}const Cn="https://accounts.google.com/gsi/client",Ue=ar(),Kr=vn("GoogleIdentity");let Xe=null;function x(e,t="google_identity_error"){const n=new Error(String(e??"").trim()||"Google identity error");return n.code=t,n}function lt(){return globalThis.google?.accounts?.id??null}function Ve(){return S.getPlatform()==="web"}function Oc(){return Ue?Ve()?!0:S.isNativePlatform()&&S.getPlatform()==="android":!1}function Rc(){return Ue?Ve()||S.isNativePlatform()&&S.getPlatform()==="android"?"":S.isNativePlatform()?p("common.google_android_only","目前僅支援 Android App 的 Google 登入"):kt():kt()}async function gd(){if(!Ve())throw x(p("common.web_gis_browser_only","Web GIS 僅支援瀏覽器環境"),"google_identity_web_only");return Xe||(Xe=new Promise((e,t)=>{const n=document.querySelector(`script[src="${Cn}"]`);if(n){n.addEventListener("load",()=>e(),{once:!0}),n.addEventListener("error",()=>t(x(p("common.gis_load_failed","Google Identity Services 載入失敗"),"google_gis_load_failed")),{once:!0}),lt()&&e();return}const a=document.createElement("script");a.src=Cn,a.async=!0,a.defer=!0,a.onload=()=>e(),a.onerror=()=>t(x(p("common.gis_load_failed","Google Identity Services 載入失敗"),"google_gis_load_failed")),document.head.appendChild(a)}).finally(()=>{lt()||(Xe=null)}),Xe)}function Ld(e){const t=String(e?.message??e??"").trim()||p("settings_account.google_login_failed","Google 登入失敗"),n=String(e?.code??"").trim();return x(t,n||"google_identity_native_failed")}async function Sc({nonce:e}={}){if(!S.isNativePlatform()||S.getPlatform()!=="android")throw x(p("leftover.google.credential_manager_android_only","Credential Manager 僅支援 Android App"),"google_identity_android_only");if(!Ue)throw x(p("common.missing_google_web_client_id","缺少 Google Web Client ID（請設定 VITE_GOOGLE_WEB_CLIENT_ID）"),"google_client_id_missing");if(!e)throw x(p("leftover.google.missing_nonce","缺少 Google nonce"),"google_nonce_required");try{const t=await Kr.signIn({serverClientId:Ue,nonce:String(e).trim(),filterByAuthorizedAccounts:!1});return{idToken:String(t?.idToken??"").trim(),displayName:String(t?.displayName??"").trim(),email:String(t?.email??"").trim(),avatarUrl:String(t?.avatarUrl??"").trim()}}catch(t){throw Ld(t)}}async function bc(e,{nonce:t,text:n="signin_with",theme:a="outline",shape:r="pill",size:i="large",width:o=280,onCredential:s=null,onError:c=null}={}){if(!e)throw x(p("leftover.google.missing_button_container","缺少 Google 按鈕容器"),"google_button_container_missing");if(!Ve())throw x(p("leftover.google.gis_button_web_only","Google GIS 按鈕僅支援 Web"),"google_identity_web_only");if(!Ue)throw x(p("common.missing_google_web_client_id","缺少 Google Web Client ID（請設定 VITE_GOOGLE_WEB_CLIENT_ID）"),"google_client_id_missing");if(!t)throw x(p("leftover.google.missing_nonce","缺少 Google nonce"),"google_nonce_required");await gd();const d=lt();if(!d)throw x(p("leftover.google.gis_not_ready","Google Identity Services 尚未就緒"),"google_gis_not_ready");e.innerHTML="",d.initialize({client_id:Ue,nonce:String(t).trim(),ux_mode:"popup",cancel_on_tap_outside:!0,callback:E=>{const u=String(E?.credential??"").trim();if(!u){const T=x(p("leftover.google.missing_id_token","Google 未回傳 ID token"),"google_id_token_missing");typeof c=="function"&&c(T);return}typeof s=="function"&&s({idToken:u,selectBy:String(E?.select_by??"").trim()})},error_callback:E=>{typeof c=="function"&&c(x(String(E?.type??p("settings_account.google_login_failed","Google 登入失敗")),"google_gis_error"))}}),d.renderButton(e,{type:"standard",theme:a,text:n,shape:r,size:i,logo_alignment:"left",width:o})}async function yc(){if(Ve()){lt()?.disableAutoSelect?.();return}if(S.isNativePlatform()&&S.getPlatform()==="android")try{await Kr.clearCredentialState()}catch{}}export{sc as $,Id as A,Xt as B,we as C,er as D,li as E,St as F,co as G,Dr as H,Sr as I,gs as J,Ac as K,qi as L,fc as M,Hr as N,Zs as O,Ks as P,Js as Q,Ys as R,$s as S,Vn as T,Kd as U,hd as V,Ea as W,_a as X,Hi as Y,cc as Z,dc as _,oo as a,zd as a$,oc as a0,Nr as a1,Fi as a2,Ft as a3,Cr as a4,Rs as a5,Ur as a6,De as a7,Lr as a8,yd as a9,$d as aA,Jd as aB,Rd as aC,Ki as aD,ro as aE,ki as aF,Wt as aG,nn as aH,td as aI,Nt as aJ,Qs as aK,Sd as aL,Lc as aM,md as aN,_c as aO,Nc as aP,rn as aQ,uc as aR,pc as aS,Br as aT,Ec as aU,ic as aV,Tc as aW,mc as aX,lc as aY,ze as aZ,gc as a_,bd as aa,_o as ab,Eo as ac,vi as ad,jr as ae,ec as af,ss as ag,ac as ah,Qd as ai,us as aj,tc as ak,qd as al,rc as am,Zd as an,Xd as ao,Sc as ap,yc as aq,bc as ar,Oc as as,Rc as at,Cd as au,Or as av,nc as aw,Vd as ax,Yd as ay,Wd as az,Fd as b,wd as b0,Md as b1,vd as c,uo as d,Bd as e,so as f,nr as g,He as h,qn as i,To as j,mo as k,Od as l,kd as m,tr as n,Pd as o,Hd as p,$ as q,Tt as r,ot as s,Gd as t,xd as u,jd as v,io as w,Dd as x,Yi as y,Ud as z};
