const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/wear-sync-epoch.service-Bt2vJMNn.js","assets/vendor-sqlite-DKEMZiEb.js","assets/app-membership-DfDUGj4J.js","assets/app-i18n-BtVubweK.js","assets/vendor-CkjNk_C8.js"])))=>i.map(i=>d[i]);
import{C as A,S as Rn,d as Yr,_ as bn,a as Dn,r as yn,D as an,F as Wr}from"./vendor-sqlite-DKEMZiEb.js";import{a as $r,g as on}from"./app-membership-DfDUGj4J.js";import{t as In}from"./app-i18n-BtVubweK.js";import{S as Se}from"./vendor-CkjNk_C8.js";const qr="straw.recovery_backup.v1",se="backups",zr=1,sn=40,te=Object.freeze({INDEXEDDB:"indexeddb",FILESYSTEM:"filesystem",TEST:"test"}),Vr=new Set(Object.values(te));function Jr(){return typeof indexedDB>"u"||!indexedDB?null:new Promise((e,t)=>{const n=indexedDB.open(qr,zr);n.onerror=()=>t(n.error||new Error("indexedDB open failed")),n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(se)||a.createObjectStore(se,{keyPath:"backupId"})},n.onsuccess=()=>e(n.result)})}async function Mt(e){const t=await Jr();if(!t)return null;try{return await e(t)}finally{try{t.close()}catch{}}}async function Zr(e){return await Mt(async n=>(await new Promise((a,r)=>{const i=n.transaction(se,"readwrite");i.oncomplete=()=>a(),i.onerror=()=>r(i.error||new Error("indexedDB put failed")),i.objectStore(se).put(e)}),!0)).catch(()=>!1)===!0}async function Cn(e){return Mt(async t=>new Promise((n,a)=>{const r=t.transaction(se,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB get failed"));const i=r.objectStore(se).get(e);i.onsuccess=()=>n(i.result||null),i.onerror=()=>a(i.error||new Error("indexedDB get failed"))})).catch(()=>null)}async function Qr(){const e=await Mt(async t=>new Promise((n,a)=>{const r=t.transaction(se,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB getAll failed"));const i=r.objectStore(se).getAll();i.onsuccess=()=>n(Array.isArray(i.result)?i.result:[]),i.onerror=()=>a(i.error||new Error("indexedDB getAll failed"))})).catch(()=>null);return Array.isArray(e)?e:[]}function ea(e){return`recovery_${String(e).replace(/[^\w.-]+/g,"_").slice(0,40)||"wipe"}_${Date.now()}_${Math.random().toString(36).slice(2,10)}`}function Un(e){return typeof TextEncoder<"u"?new TextEncoder().encode(e).byteLength:String(e||"").length}function ta(e,t){if(!e||typeof e!="object")return null;const n=String(e.backupId||"").trim(),a=Number(e.byteLength)||0;return!n||!(a>0)?null:{backupId:n,purpose:String(e.purpose||"").trim(),at:String(e.at||"").trim(),byteLength:a,filename:String(e.filename||"").trim(),source:String(e.source||"").trim(),storage:String(t||e.storage||te.INDEXEDDB).trim(),hasPayload:!!e.jsonText}}function hn(e){if(!e||typeof e!="object"||e.verified!==!0||!(Number(e.byteLength)>0)||!String(e.backupId||"").trim())return!1;const t=String(e.storage||"").trim();return!!Vr.has(t)}async function na(e={}){const t=String(e.purpose||"wipe").trim()||"wipe",n=e.data;if(!n||typeof n!="object")throw new Error("recovery backup export payload missing");let a="";try{a=JSON.stringify(n)}catch(d){throw new Error(`recovery backup serialize failed: ${d?.message||d}`)}const r=Un(a);if(!(r>2))throw new Error("recovery backup payload empty");const i=ea(t),o=new Date().toISOString(),s={backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,source:String(e.source||"").trim(),filename:String(e.filename||"").trim()};if(await Zr(s)){const d=await Cn(i);if(d?.backupId===i&&Number(d.byteLength)>0&&d.jsonText)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:te.INDEXEDDB,filename:s.filename}}if(typeof e.persistToFilesystem=="function")try{const d=await e.persistToFilesystem({backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,filename:s.filename,data:n});if(d?.verified===!0&&String(d.backupId||i)===i&&Number(d.byteLength||r)>0&&String(d.storage||"")===te.FILESYSTEM)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:te.FILESYSTEM,filename:s.filename,location:String(d.location||"").trim()}}catch{}throw new Error("recovery backup durable persist failed (memory is not durable proof)")}async function ra(e){const t=String(e||"").trim();return t?Cn(t):null}async function ud(e={}){const t=Math.max(1,Math.min(sn,Number(e.limit)||sn));let n=[];return n=await Qr(),(Array.isArray(n)?n:[]).map(r=>ta(r,r?.storage||te.INDEXEDDB)).filter(Boolean).sort((r,i)=>String(i.at).localeCompare(String(r.at))).slice(0,t)}async function ld(e){const t=await ra(e),n=String(t?.jsonText||"");if(!t?.backupId||!(Number(t.byteLength)>0)||!n)throw new Error("recovery backup record missing or empty");return{backupId:t.backupId,purpose:String(t.purpose||""),at:String(t.at||""),byteLength:Number(t.byteLength)||Un(n),filename:String(t.filename||`${t.backupId}.json`),jsonText:n}}async function Td(e={}){const t=e.exportAllLedgersJson;if(typeof t!="function")throw new Error("recovery backup exporter missing");const n=String(e.purpose||"wipe").trim()||"wipe",a=String(e.filename||"").trim()||`strawmoneybook-recovery-before-${n}-${new Date().toISOString().replace(/[:.]/g,"-")}.json`,r=await t();let i=e.persistToFilesystem;!i&&typeof e.saveJsonFileToDevice=="function"&&(i=async({filename:s,data:c,backupId:d,byteLength:E})=>{const u=await e.saveJsonFileToDevice(s,c,{category:e.category||"recovery"});return u?.saved&&u.location?{verified:!0,backupId:d,byteLength:E,storage:te.FILESYSTEM,location:u.location}:null});const o=await na({purpose:n,data:r,source:e.source,filename:a,persistToFilesystem:i});if(typeof e.saveJsonFileToDevice=="function"&&o.storage!==te.FILESYSTEM)try{const s=await e.saveJsonFileToDevice(a,r,{category:e.category||"recovery"});!(s?.saved&&s.location)&&typeof e.downloadJsonFile=="function"&&e.downloadJsonFile(a,r),s?.saved&&s.location&&typeof e.onDeviceSaved=="function"&&e.onDeviceSaved(s)}catch{if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}}else if(o.storage===te.FILESYSTEM&&typeof e.onDeviceSaved=="function")e.onDeviceSaved({saved:!0,location:o.location});else if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}if(!hn(o))throw new Error("recovery backup proof invalid after persist");return o}const aa=`PRAGMA foreign_keys = ON;

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
`,ia=`ALTER TABLE transactions ADD COLUMN is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1));
ALTER TABLE transactions ADD COLUMN reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed'));
ALTER TABLE transactions ADD COLUMN reimbursed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);
`,oa=`ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1));
ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1));

UPDATE transactions
SET include_in_budget = COALESCE(include_in_budget, 1),
    include_in_analysis = COALESCE(include_in_analysis, 1);

UPDATE transactions
SET include_in_budget = 0,
    include_in_analysis = 0
WHERE origin_type = 'reimbursement';
`,sa=`ALTER TABLE accounts ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-wallet';

ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-tag';
`,da=`UPDATE accounts
SET icon = 'fa-solid fa-wallet'
WHERE icon IS NULL OR TRIM(icon) = '';

UPDATE categories
SET icon = CASE
  WHEN name LIKE '%飲食%' THEN 'fa-solid fa-utensils'
  WHEN kind = 'income' THEN 'fa-solid fa-sack-dollar'
  ELSE 'fa-solid fa-tag'
END
WHERE icon IS NULL OR TRIM(icon) = '';
`,ca=`ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

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
`,_a=`-- Remove legacy sample transaction "飲食 300" if it is the only transaction in the ledger.
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
`,Ea=`CREATE TABLE IF NOT EXISTS bank_connections (
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
`,ua=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
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
`,la=`ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1 CHECK (include_in_assets IN (0,1));

UPDATE accounts
SET include_in_assets = COALESCE(include_in_assets, 1);
`,Ta=`CREATE TABLE IF NOT EXISTS reimbursement_advances (
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
`,ma=`ALTER TABLE reimbursement_items
  ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense'
  CHECK (entry_type IN ('expense', 'income'));
`,ga=`ALTER TABLE budget_items
  ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed'
  CHECK (amount_mode IN ('fixed', 'daily_average'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none'
  CHECK (day_rule_unit IN ('none', 'weekday', 'monthday'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';
`,La=`ALTER TABLE reimbursement_advances
  ADD COLUMN category_id TEXT;

CREATE INDEX IF NOT EXISTS idx_reimbursement_advances_category
  ON reimbursement_advances(ledger_id, category_id, received_at DESC);
`,Na=`CREATE TABLE IF NOT EXISTS savings_jars (
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
`,pa=`ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;
`,fa=`ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';
ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;
`,Aa=`CREATE INDEX IF NOT EXISTS idx_deleted_log_lookup
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
`,Oa=`ALTER TABLE bank_transactions ADD COLUMN transaction_type TEXT;
ALTER TABLE bank_transactions ADD COLUMN note TEXT;
ALTER TABLE bank_transactions ADD COLUMN summary TEXT;
ALTER TABLE bank_transactions ADD COLUMN balance_minor INTEGER;
`,Sa=`ALTER TABLE reimbursement_items RENAME TO reimbursement_items__old_source_type;

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
`,Ra=`ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_savings_jars_auto_save
  ON savings_jars(ledger_id, auto_save_paused, updated_at DESC);
`,ba=`ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;
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
`,Da=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
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
`,ya=`ALTER TABLE reimbursement_advances ADD COLUMN return_amount_minor INTEGER;
`,Ia=`ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1 CHECK (include_in_group_statistics IN (0,1));

UPDATE accounts
SET include_in_group_statistics = COALESCE(include_in_group_statistics, 1);
`,Ca=`DROP TABLE IF EXISTS invoice_carrier_invoices;

DROP TABLE IF EXISTS invoice_carrier_connections;

DELETE FROM app_settings
WHERE key LIKE 'invoice_carrier.%'
   OR key LIKE 'einvoice.%';
`,Ua=`CREATE TABLE IF NOT EXISTS einvoice_credentials (
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
`,ha=`ALTER TABLE einvoice_credentials ADD COLUMN password_iv TEXT NOT NULL DEFAULT '';
`,wa=`CREATE TABLE IF NOT EXISTS budget_containers (
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
`,ka=`ALTER TABLE categories ADD COLUMN default_include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_analysis IN (0,1));
ALTER TABLE categories ADD COLUMN default_include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_budget IN (0,1));
ALTER TABLE categories ADD COLUMN default_is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (default_is_reimbursable IN (0,1));
`,va=`ALTER TABLE transactions ADD COLUMN reimburse_target_minor INTEGER;
`,Xa=`CREATE TABLE IF NOT EXISTS einvoice_sync_config (
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
`,Fa=`ALTER TABLE budget_containers ADD COLUMN period_mode TEXT NOT NULL DEFAULT 'monthly';
`,Ma=`ALTER TABLE ledgers ADD COLUMN budget_period_mode TEXT NOT NULL DEFAULT 'calendar_month';
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
`,Ba=`-- SMB-277: per-transaction editor attribution for shared ledgers
ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;
`,xa=`CREATE TABLE IF NOT EXISTS securities (
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
`,Ga=`-- smb300 securities v2 P1: settlement portfolio, settle_at / status, funds mode fields.
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
`,Pa=`-- smb301 credit card system P0 (v1.1 hard contracts)
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
`,ja=`-- Sell against a specific buy lot (1:1). Remaining qty/principal are derived.
PRAGMA foreign_keys = ON;

ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;

CREATE INDEX IF NOT EXISTS idx_security_transactions_source_buy
  ON security_transactions(ledger_id, source_buy_tx_id, deleted_at);
`,Ha=`-- Wear OS Stage A: origin_type=wear CHECK, durable wear_applied identity, syncEpoch.
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
`,Ka=`-- Migration 046 — bank sync Architecture B account checkpoints
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
`,Ya=`-- Migration 047: restore deleted_log triggers lost by rebuild-by-rename
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
`,Wa=`-- Migration 048: soft-delete postings when parent transaction is soft-deleted.
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
`;function $a(e){const t=[];let n="",a="",r="",i=!1,o=!1,s=!1,c=!1,d="";const E=()=>{if(!a)return;const T=a.toUpperCase();T==="TRIGGER"&&n.toUpperCase().includes("CREATE")&&(i=!0),r=T,a=""},u=()=>{const T=n.trim();T&&t.push(T),n="",a="",r="",i=!1,o=!1,s=!1,c=!1,d=""};for(let T=0;T<e.length;T+=1){const m=e[T],L=e[T+1];if(o){m===`
`?(s||(n+=m),o=!1,s=!1):s||(n+=m);continue}if(c){n+=m,m==="*"&&L==="/"&&(n+=L,T+=1,c=!1);continue}if(d){n+=m,m===d&&(d==="'"&&L==="'"?(n+=L,T+=1):d="");continue}if(m==="-"&&L==="-"){n+=m,n+=L,T+=1,E(),o=!0,s=!1;continue}if(m==="#"){E(),o=!0,s=!0;continue}if(m==="/"&&L==="*"){n+=m,n+=L,T+=1,E(),c=!0;continue}if(n+=m,m==="'"||m==='"'||m==="`"){E(),d=m;continue}/[A-Za-z0-9_]/.test(m)?a+=m:E(),m===";"&&(!i||r==="END")&&u()}return E(),u(),t}function Bt(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("duplicate column name")||t.includes("already exists")||t.includes("duplicate index name")}function qa(e){return $a(e).map(t=>({statement:t,values:[]}))}async function Ee(e,t){await e.executeSet([{statement:t,values:[]}])}function za(e){return`mig_sp_${e}`}function Va(e){return typeof e?.beginTransaction=="function"}function Ja(e){return/^\s*ALTER\s+TABLE\b/i.test(String(e??""))}async function Za(e,t){for(const n of t)try{await e.executeSet([n])}catch(a){if(!Bt(a))throw a}}async function Qa(e,t){let n=!1;try{await Ee(e,"BEGIN;"),n=!0}catch{}try{for(let a=0;a<t.length;a+=1){const r=t[a],i=Ja(r.statement),o=za(a);i&&await Ee(e,`SAVEPOINT ${o};`);try{await e.executeSet([r]),i&&await Ee(e,`RELEASE ${o};`)}catch(s){if(i){try{await Ee(e,`ROLLBACK TO ${o};`)}catch{}try{await Ee(e,`RELEASE ${o};`)}catch{}}if(!Bt(s))throw s}}n&&await Ee(e,"COMMIT;")}catch(a){if(n)try{await Ee(e,"ROLLBACK;")}catch{}throw a}}async function ei(e,t){const n=qa(t);if(n.length){if(Va(e)){await Za(e,n);return}await Qa(e,n)}}const ti=Object.freeze([20,21,22,27,29]);function ni(e){const t=new Set(ti),n=[...new Set((e??[]).map(a=>Number(a?.version)).filter(a=>t.has(a)))].sort((a,r)=>a-r);if(n.length>0)throw new Error(`Do NOT reuse reserved migration versions ${n.join(", ")} — existing devices would skip the new SQL.`)}const ri="APP_DOWNGRADE_BLOCKED",wn="data_floor_app_version",kn="data_floor_schema_version",xt="straw.data_floor.v1";function vn(){return String($r?.version).trim()}function dn(e){const t=String(e??"").trim().replace(/^v/i,"").match(/\d+/g);return t?.length?t.map(n=>Number.parseInt(String(n),10)).map(n=>Number.isFinite(n)?Math.max(0,n):0):[]}function It(e,t){const n=dn(e),a=dn(t),r=Math.max(n.length,a.length,3);for(let i=0;i<r;i+=1){const o=Number(n[i]??0),s=Number(a[i]??0);if(o>s)return 1;if(o<s)return-1}return 0}function ai(e={}){const t=String(e.reason??"unknown").trim()||"unknown",n=String(e.floorAppVersion??"").trim(),a=String(e.currentAppVersion??"").trim(),r=Number(e.floorSchemaVersion??0),i=Number(e.knownSchemaMax??0);let o="偵測到本機資料曾由較新版本寫入。為避免資料回損，已阻止此舊版開啟帳本。請改安裝相同或更新的版本。";t==="schema_ahead"?o=`本機資料庫 schema（${r}）高於此 App 支援上限（${i}）。為避免資料回損，已阻止開啟。請改安裝較新版本。`:t==="app_version_ahead"&&n&&a&&(o=`本機資料曾由 App ${n} 寫入，目前版本為 ${a}。為避免資料回損，已阻止開啟。請改安裝 ${n} 或更新版本。`);const s=new Error(o);return s.code=ri,s.i18nKey="app.downgrade_blocked",s.reason=t,s.floorAppVersion=n||null,s.currentAppVersion=a||null,s.floorSchemaVersion=Number.isFinite(r)?r:null,s.knownSchemaMax=Number.isFinite(i)?i:null,s.recoverable=!1,s.silentWipeBlocked=!0,s}function Gt(){try{return globalThis.localStorage??null}catch{return null}}function Xn(){const e=Gt();if(!e)return{appVersion:"",schemaVersion:0};try{const t=e.getItem(xt);if(!t)return{appVersion:"",schemaVersion:0};const n=JSON.parse(t);return{appVersion:String(n?.appVersion??"").trim(),schemaVersion:Number.parseInt(String(n?.schemaVersion??"0"),10)||0}}catch{return{appVersion:"",schemaVersion:0}}}function ii({appVersion:e,schemaVersion:t}={}){const n=Gt();if(!n)return;const a=String(e??"").trim(),r=Number.parseInt(String(t??"0"),10)||0,i=Xn(),o=a&&(!i.appVersion||It(a,i.appVersion)>0)?a:i.appVersion,s=Math.max(i.schemaVersion||0,r||0);try{n.setItem(xt,JSON.stringify({appVersion:o,schemaVersion:s,updatedAt:new Date().toISOString()}))}catch{}}function oi(){const e=Gt();if(e)try{e.removeItem(xt)}catch{}}function si({knownSchemaMax:e,dbMaxSchemaVersion:t=0,floorSchemaVersion:n=0,prefsSchemaVersion:a=0,floorAppVersion:r="",prefsAppVersion:i="",currentAppVersion:o=""}={}){const s=Number(e??0)||0,c=Number(t??0)||0,d=Math.max(Number(n??0)||0,Number(a??0)||0,c);if(s>0&&d>s)return{reason:"schema_ahead",floorSchemaVersion:d,knownSchemaMax:s,currentAppVersion:o,floorAppVersion:r||i||""};const E=(()=>{const T=String(r??"").trim(),m=String(i??"").trim();return T&&m?It(T,m)>=0?T:m:T||m})(),u=String(o??"").trim();return E&&u&&It(u,E)<0?{reason:"app_version_ahead",floorAppVersion:E,currentAppVersion:u,floorSchemaVersion:d,knownSchemaMax:s}:null}function di(e={}){const t=si(e);if(t)throw ai(t)}const Pt=[{version:1,name:"init_schema",sql:aa},{version:2,name:"transaction_reimbursement_flags",sql:ia},{version:3,name:"transaction_budget_analysis_flags",sql:oa},{version:4,name:"account_category_icons",sql:sa},{version:5,name:"default_icons_backfill",sql:da},{version:6,name:"ledger_sort_order",sql:ca},{version:7,name:"remove_default_sample_transaction",sql:_a},{version:8,name:"bank_sync",sql:Ea},{version:9,name:"allow_zero_amount_transaction",sql:ua},{version:10,name:"account_include_in_assets",sql:la},{version:11,name:"reimbursement_advances",sql:Ta},{version:12,name:"reimbursement_item_entry_type",sql:ma},{version:13,name:"budget_item_daily_rules",sql:ga},{version:14,name:"reimbursement_advance_category",sql:La},{version:15,name:"savings_jars",sql:Na},{version:16,name:"loan_payment_interest_tx",sql:pa},{version:17,name:"account_credit_profile",sql:fa},{version:18,name:"shared_sync_deleted_log",sql:Aa},{version:19,name:"bank_transaction_metadata",sql:Oa},{version:23,name:"reimbursement_item_advance_source",sql:Sa},{version:24,name:"savings_jars_auto_save",sql:Ra},{version:25,name:"budget_save",sql:ba},{version:26,name:"transaction_origin_type_refund",sql:Da},{version:28,name:"advance_return_amount",sql:ya},{version:30,name:"account_group_statistics",sql:Ia},{version:31,name:"remove_invoice_carrier",sql:Ca},{version:32,name:"einvoice_import",sql:Ua},{version:33,name:"einvoice_credential_password_iv",sql:ha},{version:34,name:"budget_containers",sql:wa},{version:35,name:"category_default_flags",sql:ka},{version:36,name:"transaction_reimburse_target",sql:va},{version:37,name:"einvoice_carrier_sync",sql:Xa},{version:38,name:"budget_container_period_mode",sql:Fa},{version:39,name:"budget_pay_cycle",sql:Ma},{version:40,name:"transaction_editor_attribution",sql:Ba},{version:41,name:"securities",sql:xa},{version:42,name:"securities_settlement_v2",sql:Ga},{version:43,name:"credit_card_system_p0",sql:Pa},{version:44,name:"security_sell_source_buy",sql:ja},{version:45,name:"wear_companion",sql:Ha},{version:46,name:"bank_sync_account_checkpoints",sql:Ka},{version:47,name:"restore_deleted_log_triggers",sql:Ya},{version:48,name:"soft_delete_transaction_postings",sql:Wa}];ni(Pt);function Fn(){return Pt.reduce((e,t)=>Math.max(e,Number(t.version)||0),0)}const cn="legacy_schema_patched_v1",ci={ledgers:["ALTER TABLE ledgers ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE ledgers ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Taipei';","ALTER TABLE ledgers ADD COLUMN color TEXT;","ALTER TABLE ledgers ADD COLUMN icon TEXT;","ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN created_at TEXT;","ALTER TABLE ledgers ADD COLUMN updated_at TEXT;","ALTER TABLE ledgers ADD COLUMN deleted_at TEXT;"],account_groups:["ALTER TABLE account_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE account_groups ADD COLUMN created_at TEXT;","ALTER TABLE account_groups ADD COLUMN updated_at TEXT;"],accounts:["ALTER TABLE accounts ADD COLUMN group_id TEXT;","ALTER TABLE accounts ADD COLUMN account_type TEXT NOT NULL DEFAULT 'asset';","ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';","ALTER TABLE accounts ADD COLUMN allow_negative INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN opening_balance_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE accounts ADD COLUMN icon TEXT;","ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;","ALTER TABLE accounts ADD COLUMN statement_close_day INTEGER;","ALTER TABLE accounts ADD COLUMN payment_due_day INTEGER;","ALTER TABLE accounts ADD COLUMN card_last4 TEXT;","ALTER TABLE accounts ADD COLUMN issuer TEXT;","ALTER TABLE accounts ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN deleted_at TEXT;","ALTER TABLE accounts ADD COLUMN created_at TEXT;","ALTER TABLE accounts ADD COLUMN updated_at TEXT;"],category_groups:["ALTER TABLE category_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE category_groups ADD COLUMN created_at TEXT;","ALTER TABLE category_groups ADD COLUMN updated_at TEXT;"],categories:["ALTER TABLE categories ADD COLUMN group_id TEXT;","ALTER TABLE categories ADD COLUMN kind TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE categories ADD COLUMN icon TEXT;","ALTER TABLE categories ADD COLUMN is_budgetable INTEGER NOT NULL DEFAULT 1;","ALTER TABLE categories ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN deleted_at TEXT;","ALTER TABLE categories ADD COLUMN created_at TEXT;","ALTER TABLE categories ADD COLUMN updated_at TEXT;"],transactions:["ALTER TABLE transactions ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE transactions ADD COLUMN transfer_group_id TEXT;","ALTER TABLE transactions ADD COLUMN account_id TEXT;","ALTER TABLE transactions ADD COLUMN peer_account_id TEXT;","ALTER TABLE transactions ADD COLUMN category_id TEXT;","ALTER TABLE transactions ADD COLUMN amount_minor INTEGER;","ALTER TABLE transactions ADD COLUMN occurred_at TEXT;","ALTER TABLE transactions ADD COLUMN posted_at TEXT;","ALTER TABLE transactions ADD COLUMN note TEXT;","ALTER TABLE transactions ADD COLUMN location TEXT;","ALTER TABLE transactions ADD COLUMN tags_json TEXT;","ALTER TABLE transactions ADD COLUMN origin_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE transactions ADD COLUMN external_ref_id TEXT;","ALTER TABLE transactions ADD COLUMN idempotency_key TEXT;","ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN deleted_at TEXT;","ALTER TABLE transactions ADD COLUMN created_at TEXT;","ALTER TABLE transactions ADD COLUMN updated_at TEXT;","ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;"],transaction_attachments:["ALTER TABLE transaction_attachments ADD COLUMN file_uri TEXT;","ALTER TABLE transaction_attachments ADD COLUMN mime_type TEXT;","ALTER TABLE transaction_attachments ADD COLUMN file_size INTEGER;","ALTER TABLE transaction_attachments ADD COLUMN checksum TEXT;","ALTER TABLE transaction_attachments ADD COLUMN created_at TEXT;"],counterparties:["ALTER TABLE counterparties ADD COLUMN contact_json TEXT;","ALTER TABLE counterparties ADD COLUMN note TEXT;","ALTER TABLE counterparties ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE counterparties ADD COLUMN created_at TEXT;","ALTER TABLE counterparties ADD COLUMN updated_at TEXT;"],loans:["ALTER TABLE loans ADD COLUMN counterparty_id TEXT;","ALTER TABLE loans ADD COLUMN direction TEXT NOT NULL DEFAULT 'lend';","ALTER TABLE loans ADD COLUMN principal_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE loans ADD COLUMN interest_rule_json TEXT;","ALTER TABLE loans ADD COLUMN start_date TEXT;","ALTER TABLE loans ADD COLUMN due_date TEXT;","ALTER TABLE loans ADD COLUMN status TEXT NOT NULL DEFAULT 'active';","ALTER TABLE loans ADD COLUMN settled_at TEXT;","ALTER TABLE loans ADD COLUMN note TEXT;","ALTER TABLE loans ADD COLUMN created_at TEXT;","ALTER TABLE loans ADD COLUMN updated_at TEXT;","ALTER TABLE loans ADD COLUMN deleted_at TEXT;"],loan_payments:["ALTER TABLE loan_payments ADD COLUMN loan_id TEXT;","ALTER TABLE loan_payments ADD COLUMN account_id TEXT;","ALTER TABLE loan_payments ADD COLUMN paid_at TEXT;","ALTER TABLE loan_payments ADD COLUMN amount_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN principal_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN interest_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN generated_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN note TEXT;","ALTER TABLE loan_payments ADD COLUMN created_at TEXT;","ALTER TABLE loan_payments ADD COLUMN updated_at TEXT;"],reimbursements:["ALTER TABLE reimbursements ADD COLUMN title TEXT;","ALTER TABLE reimbursements ADD COLUMN counterparty_id TEXT;","ALTER TABLE reimbursements ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';","ALTER TABLE reimbursements ADD COLUMN submitted_at TEXT;","ALTER TABLE reimbursements ADD COLUMN approved_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_tx_id TEXT;","ALTER TABLE reimbursements ADD COLUMN total_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE reimbursements ADD COLUMN note TEXT;","ALTER TABLE reimbursements ADD COLUMN idempotency_key TEXT;","ALTER TABLE reimbursements ADD COLUMN created_at TEXT;","ALTER TABLE reimbursements ADD COLUMN updated_at TEXT;","ALTER TABLE reimbursements ADD COLUMN deleted_at TEXT;"],reimbursement_items:["ALTER TABLE reimbursement_items ADD COLUMN source_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE reimbursement_items ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE reimbursement_items ADD COLUMN transaction_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN category_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN account_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN description TEXT;","ALTER TABLE reimbursement_items ADD COLUMN amount_minor INTEGER;","ALTER TABLE reimbursement_items ADD COLUMN occurred_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN attachment_uri TEXT;","ALTER TABLE reimbursement_items ADD COLUMN created_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN updated_at TEXT;"],reimbursement_advances:["ALTER TABLE reimbursement_advances ADD COLUMN category_id TEXT;"],budgets:["ALTER TABLE budgets ADD COLUMN name TEXT;","ALTER TABLE budgets ADD COLUMN include_transfers INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_loan_repayments INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_reimbursed_expenses INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_target_account_id TEXT;","ALTER TABLE budgets ADD COLUMN budget_save_total_source_account_id TEXT;","ALTER TABLE budgets ADD COLUMN created_at TEXT;","ALTER TABLE budgets ADD COLUMN updated_at TEXT;","ALTER TABLE budgets ADD COLUMN deleted_at TEXT;"],budget_items:["ALTER TABLE budget_items ADD COLUMN scope_type TEXT NOT NULL DEFAULT 'category';","ALTER TABLE budget_items ADD COLUMN category_id TEXT;","ALTER TABLE budget_items ADD COLUMN category_group_id TEXT;","ALTER TABLE budget_items ADD COLUMN amount_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed';","ALTER TABLE budget_items ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none';","ALTER TABLE budget_items ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';","ALTER TABLE budget_items ADD COLUMN budget_save_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN budget_save_target_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN budget_save_source_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN created_at TEXT;","ALTER TABLE budget_items ADD COLUMN updated_at TEXT;"],savings_jars:["ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;"],app_settings:["ALTER TABLE app_settings ADD COLUMN value_json TEXT;","ALTER TABLE app_settings ADD COLUMN updated_at TEXT;"],deleted_log:["ALTER TABLE deleted_log ADD COLUMN payload_json TEXT;","ALTER TABLE deleted_log ADD COLUMN deleted_at TEXT;"],security_transactions:["ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;"]};async function Q(e,t){return!!(await e.query(`SELECT 1 AS ok
     FROM sqlite_master
     WHERE type = 'table'
       AND name = ?
     LIMIT 1;`,[t]))?.values?.length}async function _i(e,t,n){if(await Q(e,t))for(const a of n)try{await e.execute(a)}catch(r){if(!Bt(r))throw r}}async function Ei(e){for(const[n,a]of Object.entries(ci))await _i(e,n,a);const t="strftime('%Y-%m-%dT%H:%M:%fZ','now')";await Q(e,"transactions")&&(await e.execute(`UPDATE transactions
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t});`),await e.execute(`UPDATE transactions
       SET occurred_at = COALESCE(occurred_at, created_at, updated_at, ${t}),
           amount_minor = COALESCE(amount_minor, 0),
           origin_type = COALESCE(origin_type, 'manual'),
           include_in_budget = COALESCE(include_in_budget, 1),
           include_in_analysis = COALESCE(include_in_analysis, 1);`),await e.execute(`UPDATE transactions
       SET include_in_budget = 0,
           include_in_analysis = 0
       WHERE origin_type = 'reimbursement';`)),await Q(e,"budgets")&&await e.execute(`UPDATE budgets
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           include_transfers = COALESCE(include_transfers, 0),
           include_loan_repayments = COALESCE(include_loan_repayments, 0),
           include_reimbursed_expenses = COALESCE(include_reimbursed_expenses, 0),
           budget_save_total_enabled = COALESCE(budget_save_total_enabled, 0);`),await Q(e,"budget_items")&&await e.execute(`UPDATE budget_items
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           amount_minor = COALESCE(amount_minor, 0),
           amount_mode = COALESCE(amount_mode, 'fixed'),
           day_rule_unit = COALESCE(day_rule_unit, 'none'),
           day_rule_values_json = COALESCE(day_rule_values_json, '[]'),
           budget_save_enabled = COALESCE(budget_save_enabled, 0);`),await Q(e,"accounts")&&await e.execute(`UPDATE accounts
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           opening_balance_minor = COALESCE(opening_balance_minor, 0),
           account_type = COALESCE(account_type, 'asset'),
           allow_negative = COALESCE(allow_negative, 0),
           include_in_assets = COALESCE(include_in_assets, 1),
           include_in_group_statistics = COALESCE(include_in_group_statistics, 1),
           currency_code = COALESCE(currency_code, 'TWD'),
           is_archived = COALESCE(is_archived, 0);`),await Q(e,"ledgers")&&await e.execute(`UPDATE ledgers
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           is_archived = COALESCE(is_archived, 0),
           currency_code = COALESCE(currency_code, 'TWD'),
           timezone = COALESCE(timezone, 'Asia/Taipei');`),await Q(e,"categories")&&await e.execute(`UPDATE categories
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           kind = COALESCE(kind, 'expense'),
           is_budgetable = COALESCE(is_budgetable, 1),
           is_archived = COALESCE(is_archived, 0);`),await Q(e,"app_settings")&&await e.execute(`UPDATE app_settings
       SET value_json = COALESCE(value_json, '{}'),
           updated_at = COALESCE(updated_at, ${t});`),await Q(e,"savings_jars")&&await e.execute(`UPDATE savings_jars
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           auto_save_paused = COALESCE(auto_save_paused, 0);`)}async function ui(e){await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `)}async function Ct(e,t){const n=await e.query(`SELECT value
     FROM schema_meta
     WHERE key = ?
     LIMIT 1;`,[t]);return String(n?.values?.[0]?.value??"")}async function Ut(e,t,n){await e.run(`INSERT INTO schema_meta (key, value, updated_at)
     VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = excluded.updated_at;`,[t,String(n??"")])}async function Mn(e){try{const t=await e.query("SELECT MAX(version) AS max_version FROM schema_migrations;");return Number.parseInt(String(t?.values?.[0]?.max_version??"0"),10)||0}catch{return 0}}async function li(e){const t=Fn(),n=await Mn(e),a=await Ct(e,wn).catch(()=>""),r=await Ct(e,kn).catch(()=>""),i=Number.parseInt(String(r||"0"),10)||0,o=Xn();di({knownSchemaMax:t,dbMaxSchemaVersion:n,floorSchemaVersion:i,prefsSchemaVersion:o.schemaVersion,floorAppVersion:a,prefsAppVersion:o.appVersion,currentAppVersion:vn()})}async function Ti(e){const t=Fn(),n=await Mn(e),a=Math.max(t,n),r=vn();r&&await Ut(e,wn,r),await Ut(e,kn,String(a)),ii({appVersion:r,schemaVersion:a})}async function mi(e){await ui(e),await Ct(e,cn).then(r=>r==="1").catch(()=>!1)||(await Ei(e),await Ut(e,cn,"1")),await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `),await li(e);const n=await e.query("SELECT version FROM schema_migrations ORDER BY version ASC;"),a=new Set((n?.values??[]).map(r=>r.version));for(const r of Pt)a.has(r.version)||(await ei(e,r.sql),await e.run("INSERT INTO schema_migrations (version, name) VALUES (?, ?);",[r.version,r.name]));await Ti(e)}let gi=1,Qe=null;function Li(){const e=gi++;return{id:`txctx_${e}_${Date.now().toString(36)}`,token:`tok_${e}_${Math.random().toString(36).slice(2,10)}`,depth:0,status:"open"}}function Bn(){return Qe}async function Ni(e,t){const n=Qe;Qe=e;try{return await t()}finally{Qe=n}}class pi{constructor(){this._tail=Promise.resolve(),this._pending=0}get pendingCount(){return this._pending}enqueue(t){this._pending+=1;const n=this._tail.then(()=>t());return this._tail=n.then(()=>{this._pending=Math.max(0,this._pending-1)},()=>{this._pending=Math.max(0,this._pending-1)}),n}}const fi=new pi,Ai="/app/assets".replace(/\/{2,}/g,"/");let we=null,ft=null;async function Oi(){if(!customElements.get("jeep-sqlite")){if(ft||(ft=(async()=>{try{await Yr(window)}catch(e){console.warn("[sqlite] loader registration failed, fallback to esm bundle",e),await bn(()=>import("./vendor-sqlite-DKEMZiEb.js").then(t=>t.j),[])}})()),await ft,!customElements.get("jeep-sqlite"))throw new Error("jeep-sqlite custom element registration failed");await customElements.whenDefined("jeep-sqlite")}}async function Si(){if(A.getPlatform()==="web")return we||(we=(async()=>{await Oi();const e=document.querySelector("jeep-sqlite")??document.createElement("jeep-sqlite");e.setAttribute("wasm-path",Ai),e.parentElement||document.body.appendChild(e),await Promise.resolve(),await new Rn(Dn).initWebStore()})().catch(e=>{throw we=null,e}),we)}const Ri=Object.freeze({USER_RESET_ALL:"user_reset_all",USER_IMPORT_JSON:"user_import_json",USER_RESTORE_GOOGLE_BACKUP:"user_restore_google_backup",USER_RESTORE_WEBDAV_BACKUP:"user_restore_webdav_backup",USER_RESTORE_LOCAL_RECOVERY:"user_restore_local_recovery"}),bi="LOCAL_DB_INTEGRITY",Di="EMPTY_REMOTE_REPLACE_BLOCKED",yi="DATA_WIPE_DENIED",xn="straw.data_wipe_audit.v1",jt=40,Ii=new Set(Object.values(Ri));function At(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機資料庫無法安全開啟。系統不會自動清空帳本；請從備份／Google Drive／匯入還原，或至資料管理明確重設。",r=new Error(a);if(r.code=bi,r.i18nKey=t.i18nKey||"app.local_db_integrity",r.originalMessage=n,r.recoverable=!1,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function md(e={}){const t=Number(e.localTransactionCount??0),n=Number(e.remoteTransactionCount??0),a=String(e.message??"").trim()||`遠端帳本快照交易數（${n}）為空，但本機仍有 ${t} 筆交易；已阻止覆蓋以避免 silent wipe。請改用合併同步、從備份還原，或在確認後以匯入／重設路徑處理。`,r=new Error(a);return r.code=Di,r.i18nKey=e.i18nKey||"settings_google_sync.error.empty_remote_replace_blocked",r.localTransactionCount=t,r.remoteTransactionCount=n,r.silentWipeBlocked=!0,r}function Ci(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!Ii.has(t)||!n){const r=new Error("本機資料清空被拒絕：缺少使用者確認或合法 wipe 理由。FK／migration／bootstrap 不得靜默 wipe。");throw r.code=yi,r.i18nKey="sqlite.error.data_wipe_denied",r.silentWipeBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function Ui(){if(typeof localStorage>"u")return[];try{const e=localStorage.getItem(xn),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function hi(e){if(!(typeof localStorage>"u"))try{localStorage.setItem(xn,JSON.stringify(e.slice(0,jt)))}catch{}}function wi(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),confirmed:e.confirmed===!0,note:String(e.note??"").slice(0,240)},n=[t,...Ui()].slice(0,jt);return hi(n),typeof console<"u"&&typeof console.info=="function"&&console.info("[data-wipe-audit]",t),t}const Ht="RECOVERY_BACKUP_REQUIRED";function Ot(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機 recovery 備份建立失敗，已中止清空本機資料。請先手動匯出備份後再重試還原／匯入／重設。",r=new Error(a);if(r.code=Ht,r.i18nKey=t.i18nKey||"settings_data.toast.recovery_backup_required",r.source=String(t.source??"").trim(),r.originalMessage=n,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}async function ki(e,t={}){if(typeof e!="function")throw Ot(new Error("recovery backup creator missing"),t);let n;try{n=await e()}catch(a){throw a?.code===Ht?a:Ot(a,t)}if(!hn(n))throw Ot(new Error("recovery backup proof missing or unverified (download-only / memory are not durable)"),t);return n}async function vi({createRecoveryBackup:e,wipeFn:t,source:n,i18nKey:a}={}){const r=await ki(e,{source:n,i18nKey:a});if(typeof t!="function")throw new Error("wipe function missing after recovery backup");return await t(),r}function gd(e){const t=e?.tables?.transactions;return Array.isArray(t)?t.filter(n=>!n?.deleted_at).length:0}const Xi=Object.freeze({USER_EXPLICIT:"user_explicit_repair",USER_IMPORT_JSON:"user_import_integrity_repair",USER_RESTORE_BACKUP:"user_restore_integrity_repair"}),Fi=new Set(Object.values(Xi)),Gn="straw.ledger_integrity_scan.v1",_n="straw.ledger_repair_audit.v1",Mi="LEDGER_REPAIR_DENIED";function Ld(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!Fi.has(t)||!n){const r=new Error("帳本修復被拒絕：缺少使用者確認。啟動／migration／orphan prune 不得靜默改寫帳本語意。");throw r.code=Mi,r.i18nKey="sqlite.error.ledger_repair_denied",r.silentRewriteBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function Nd(e={}){const t={at:String(e.at??new Date().toISOString()),ledgerId:String(e.ledgerId??""),issueCount:Number(e.issueCount??0)||0,autoRepaired:e.autoRepaired===!0,issues:e.issues&&typeof e.issues=="object"?e.issues:{}};if(typeof localStorage<"u")try{localStorage.setItem(Gn,JSON.stringify(t))}catch{}return t}function pd(){if(typeof localStorage>"u")return null;try{const e=localStorage.getItem(Gn);return e?JSON.parse(e):null}catch{return null}}function fd(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),ledgerId:String(e.ledgerId??""),confirmed:e.confirmed===!0,fixedCount:Number(e.fixedCount??0)||0};if(typeof localStorage<"u")try{const n=JSON.parse(localStorage.getItem(_n)||"[]"),a=Array.isArray(n)?n:[];localStorage.setItem(_n,JSON.stringify([t,...a].slice(0,jt)))}catch{}return typeof console<"u"&&typeof console.info=="function"&&console.info("[ledger-repair-audit]",t),t}const Bi=Object.freeze(["transaction_attachments","loan_payments","reimbursement_advance_usages","reimbursement_advances","reimbursement_items","reimbursements","budget_save_settlements","budget_items","budget_containers","budgets","loans","bank_transactions","bank_sync_rules","bank_accounts","bank_connections","credit_repayment_allocations","credit_repayments","transaction_postings","credit_statements","wear_applied","transactions","security_transactions","securities","savings_jars","accounts","account_groups","categories","category_groups","counterparties","app_settings","deleted_log"]),xi=Object.freeze([...Bi.filter(e=>e!=="deleted_log"),"deleted_log","wear_sync_state","ledgers"]),Kt="SQLITE_CONSTRAINT_FOREIGNKEY",Pn=1811,jn=/foreign\s*key|SQLITE_CONSTRAINT_FOREIGNKEY|\b1811\b/i;function Hn(e){if(!e)return!1;if(e?.code===Kt||Number(e?.numericCode??e?.resultCode??e?.errno)===Pn)return!0;const t=String(e?.message??e??"");return/unique\s*constraint/i.test(t)&&!/foreign\s*key/i.test(t)?!1:/foreign\s*key/i.test(t)||/SQLITE_CONSTRAINT_FOREIGNKEY/i.test(t)||/\b1811\b/.test(t)||/constraint\s*failed/i.test(t)&&/FOREIGN KEY/i.test(t)?!0:jn.test(t)}function Kn(e=""){const t=String(e??"").trim();return t&&!jn.test(t)?t:"資料關聯不一致（外鍵約束）。請重試同步／匯入，或先修復本機資料後再操作。"}function Gi(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||Kn(n),r=new Error(a);if(r.code=Kt,r.numericCode=Pn,r.i18nKey=t.i18nKey||"sqlite.error.foreign_key_constraint",r.recoverable=t.recoverable!==!1,r.originalMessage=n,e&&typeof e=="object")try{r.cause=e}catch{}return r}function Yn(e,t={}){throw!Hn(e)||e?.code===Kt&&e?.i18nKey?e:Gi(e,t)}function Ad(e){return Hn(e)?Kn(e?.message).slice(0,240):String(e?.message??e??"同步失敗").slice(0,240)}const Te="straw_money_book",En=1,Y=new Rn(Dn);let k=null,ue=null,xe=Te;function Pi(e){const t=String(e??"").trim();if(!t)return!1;const n=t.toUpperCase();return!(!(n.startsWith("INSERT")||n.startsWith("UPDATE")||n.startsWith("DELETE")||n.startsWith("REPLACE"))||n.includes("APP_SETTINGS"))}function Wn(){if(!(typeof window>"u"||typeof window.dispatchEvent!="function")){if(typeof CustomEvent=="function"){window.dispatchEvent(new CustomEvent("app:data-mutated"));return}window.dispatchEvent(new Event("app:data-mutated"))}}async function $n(){A.getPlatform()==="web"&&await Y.saveToStore(xe)}function ee(e){if(typeof e=="string"&&e.trim())return e;const t=e?.message;if(typeof t=="string"&&t.trim())return t;try{const n=JSON.stringify(e);if(n&&n!=="{}")return n}catch{}return"unknown sqlite error"}function ji(e){const t=ee(e).toLowerCase();return/foreign\s*key|\b1811\b|sqlite_constraint_foreignkey/.test(t)?!1:t.includes("datatype mismatch")||t.includes("no such column")||t.includes("no such table")||t.includes("code20")||t.includes("code 20")}function Hi(e){const t=ee(e).toLowerCase();return t.includes("capacitorsqliteplugin: null")||t==="null"}function Ki(e){return ee(e).toLowerCase().includes("no such table")}async function Yi(){A.getPlatform()==="web"&&await Si()}async function Yt(){try{await Y.closeAllConnections()}catch{}}async function qn(e){await e.query("PRAGMA foreign_keys = ON;"),await e.query("PRAGMA busy_timeout = 5000;")}async function nt(e=xe){if((await Y.isConnection(e,!1)).result)try{k=await Y.retrieveConnection(e,!1)}catch{await Yt(),k=await Y.createConnection(e,!1,"no-encryption",En,!1)}else k=await Y.createConnection(e,!1,"no-encryption",En,!1);return await k.open(),await qn(k),await mi(k),xe=e,k}async function Wi(e=xe){if(k){try{await k.close()}catch{}k=null}if((await Y.isConnection(e,!1)).result){const n=await Y.retrieveConnection(e,!1);try{await n.close()}catch{}try{await Y.closeConnection(e,!1)}catch{}}await Yt();try{return await Y.deleteDatabase(e,!1),nt(e)}catch(n){const a=await nt(e);try{await qn(a);for(const r of xi)try{await a.run(`DELETE FROM ${r};`)}catch(i){Ki(i)||Yn(i)}}catch(r){const i=ee(n),o=ee(r);throw new Error(`[sqlite] reset fallback failed; delete: ${i}; wipe: ${o}`)}return a}}async function $i(e={}){const t=Ci(e);wi({reason:t.reason,source:t.source,confirmed:!0,note:String(e.note??"").slice(0,240)}),oi(),ue=null,xe=Te;const n=await Wi(Te);try{const{rotateWearSyncEpoch:a}=await bn(async()=>{const{rotateWearSyncEpoch:r}=await import("./wear-sync-epoch.service-Bt2vJMNn.js");return{rotateWearSyncEpoch:r}},__vite__mapDeps([0,1,2,3,4]));await a()}catch{}return n}async function zn(){return k||ue||(ue=(async()=>{const e=A.getPlatform();try{return await Yi(),await nt(Te)}catch(t){if(e==="android"&&Hi(t))try{return console.warn("[sqlite] plugin null on primary open — retrying primary (recovery empty-db fallback disabled)"),await Yt(),k=null,await nt(Te)}catch(n){ue=null;let a=!1;try{a=!!(await Y.isDatabase(Te,!1))?.result}catch{a=!1}throw At(n,{message:a?`[sqlite:${e}] plugin null: primary DB file exists but cannot open (empty recovery fallback disabled): ${ee(n)}`:`[sqlite:${e}] plugin null on primary open (empty recovery fallback disabled): ${ee(n)}`})}throw ue=null,ji(t)?At(t,{message:`[sqlite:${e}] schema integrity error (no silent wipe): ${ee(t)}`}):At(t,{message:`[sqlite:${e}] ${ee(t)}`})}})(),ue)}async function Ge(){return k||await zn(),k}let ve=!1;function qi(){const e=Bn();return!!(e&&e.depth>0&&e.status==="open")}async function Et(e,t=[]){const n=await Ge();try{const a=qi(),r=await n.run(e,t,!a);return Pi(e)&&(a?ve=!0:(await $n(),Wn())),r}catch(a){Yn(a)}}async function W(e,t=[]){return(await Ge()).query(e,t)}async function zi(e){const t=Bn();if(t&&t.status==="open"){t.depth+=1;try{const n=await Ge();return await e(n,t)}finally{t.depth=Math.max(0,t.depth-1)}}return fi.enqueue(async()=>{const n=Li();n.depth=1,ve=!1;const a=await Ge();await a.beginTransaction();try{const r=await Ni(n,async()=>e(a,n));return n.status="committing",await a.commitTransaction(),n.status="committed",ve&&(await $n(),Wn()),ve=!1,r}catch(r){n.status="rolling_back";try{await a.rollbackTransaction()}catch{}throw n.status="rolled_back",ve=!1,r}finally{n.depth=0}})}const Od=Object.freeze(Object.defineProperty({__proto__:null,PRIMARY_DB_NAME:Te,getDatabase:Ge,initDatabase:zn,query:W,resetDatabase:$i,run:Et,withTransaction:zi},Symbol.toStringTag,{value:"Module"}));function Sd(e=""){const t=Date.now().toString(36),n=Math.random().toString(36).slice(2,10);return e?`${e}_${t}_${n}`:`${t}_${n}`}function Vn(){return new Date().toISOString()}function Rd(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0");return`${n}-${a}`}function bd(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${n}-${a}-${r}`}function Dd(e){if(!e)throw new Error("ledgerId is required")}function Vi(e){return e?.values??[]}function Ji(e){return Vi(e)[0]??null}async function Jn(e,t){const n=await W(`SELECT value_json
     FROM app_settings
     WHERE ledger_id = ? AND key = ?
     LIMIT 1;`,[e,t]),a=Ji(n);if(!a)return null;try{return JSON.parse(a.value_json)}catch{return null}}async function rt(e,t,n){await Et(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,t,JSON.stringify(n),Vn()])}async function Zi(e,t){await Et(`DELETE FROM app_settings
     WHERE ledger_id = ? AND key = ?;`,[e,t])}async function Qi(e){const t=await W(`SELECT key, value_json, updated_at
     FROM app_settings
     WHERE ledger_id = ?;`,[e]);return Array.isArray(t?.values)?t.values:[]}async function eo(e,t={}){await Et(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,String(t?.key??"").trim(),String(t?.value_json??"null"),String(t?.updated_at??"").trim()||Vn()])}const yd=Object.freeze(Object.defineProperty({__proto__:null,getSetting:Jn,listAppSettingRows:Qi,removeSetting:Zi,setSetting:rt,upsertAppSettingRow:eo},Symbol.toStringTag,{value:"Module"}));function Pe(e){const t=Number(e);if(!Number.isFinite(t))throw new Error("amountMinor 必須為有效數字");return Math.round(t)}function Id(e){return Math.abs(Pe(e))}function Cd(e){const t=Pe(e);return t===0?0:-t}function Ud(e){const t=Number(e);if(!Number.isInteger(t)||t<0)throw new Error("amountMinor 必須為大於或等於 0 的數字");return t}function hd(e){const t=Number(e);if(!Number.isInteger(t)||t<=0)throw new Error("amountMinor 必須為大於 0 的數字");return t}function wd(e){const t=Number(e);if(!Number.isFinite(t)||t===0)throw new Error("adjustment amountMinor 不能為 0");return t}function to(e){return Pe(e??0)}function kd(e=[]){const t=Array.isArray(e)?e:[];let n=0;for(const a of t){const r=Math.round(Number(a?.remaining_minor??a?.remainingMinor??0));!Number.isFinite(r)||r<=0||(n+=r)}return n}function no(e,t){return Pe(e??0)+Pe(t??0)}function Zn(e="rt",t="rc"){return`(
        ${e}.origin_type = 'refund'
        OR ${t}.name = '退款'
        OR ${e}.note LIKE '退款：%'
        OR ${e}.note LIKE '退款:%'
      )`}function ro(e="t"){return`EXISTS (
    SELECT 1
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND ${Zn("rt","rc")}
  )`}function ao(e="t"){return`COALESCE((
    SELECT SUM(ABS(rt.amount_minor))
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND ${Zn("rt","rc")}
  ), 0)`}const io={BASE_URL:"/app/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_BANK_SYNC_ENABLE_UNSUPPORTED_REAL_PROVIDERS:"true",VITE_BANK_SYNC_FEATURE_ENABLED:"true",VITE_EINVOICE_CLIENT_SHARED_KEY:"bdf6d030f54e8b6da78d5b457f6987206493812e7ae7a8139dbbdadf603ef7c0",VITE_GOOGLE_OAUTH_CLIENT_SHARED_KEY:"6e492bbe47f72176ac0b731d452ff88426a3f7c93f550e7ca6ac415d2e1cd683",VITE_GOOGLE_USE_SERVER_AUTH_CODE:"true",VITE_GOOGLE_WEB_CLIENT_ID:"110585924943-419l5kajjdao1c7jktsg64v4k64qh5o0.apps.googleusercontent.com",VITE_PRIVACY_POLICY_URL:"https://www.strawmb.com/privacy-policy",VITE_WEB_HASH_ROUTER:"true"},oo=["VITE_GOOGLE_WEB_CLIENT_ID","VITE_GOOGLE_OAUTH_CLIENT_ID","VITE_GOOGLE_CLIENT_ID"];function Qn(){for(const e of oo){const t=String(io[e]??"").trim();if(t)return t}return""}function ht(){return In("settings_account.google_client_id_missing","缺少 Google Web Client ID（請設定 VITE_GOOGLE_WEB_CLIENT_ID）")}const so="https://www.googleapis.com/auth/drive.appdata",co=["email","profile",so],Wt="straw.google.oauth.token_cache.v1",_o=60*1e3,et=120*1e3,er=20*1e3,Eo=8*1e3,uo=3300,lo=et+er+15*1e3,St="Google 登入逾時，請重試",To="Google 授權交換逾時，請檢查網路後重試",tr="https://api.strawmb.com",mo=Lo("true"),$t=No(),un=po(),ln=rr(void 0,"/api/google/oauth/exchange"),Tn=rr(void 0,"/api/google/oauth/refresh"),mn="6e492bbe47f72176ac0b731d452ff88426a3f7c93f550e7ca6ac415d2e1cd683".trim();let gn="",at="",je="",ne="",oe=0,$="",F=null,Ne=null,Ve=0,Je=!1;const go="GOOGLE_REAUTH_REQUIRED",Ln="Google 登入成功但未取得長效 refresh token，無法用於自動備份";function Lo(e){const t=String(e).trim().toLowerCase();return t==="1"||t==="true"||t==="yes"||t==="on"}function He(){return $t?je!=="online":!1}function nr(){if(!$t)throw new Error("Google 自動備份需要長效授權，但目前未啟用 server auth code flow");je==="online"&&(je="",at="",lt())}function No(){if(!mo)return!1;if(!A.isNativePlatform())return!0;const e="".trim(),t="".trim(),n="".trim(),a=le(t)&&le(n),r=le(e);return a||r||le(tr)?!0:(console.warn("[google-auth] VITE_GOOGLE_USE_SERVER_AUTH_CODE=true but no explicit Google OAuth backend is configured for native runtime; fallback to online mode."),!1)}function le(e){return/^https?:\/\//i.test(String(e??"").trim())}function po(){const e="".trim();return le(e)?e.replace(/\/+$/,""):tr}function fo(){if(A.isNativePlatform()||le("".trim()))return!0;if(typeof window<"u"){const e=String(window.location?.origin??"").trim();if(/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(e))return!1}return!0}function rr(e,t){const n="".trim()||String(t??"").trim();if(!n)return"";if(le(n)||!n.startsWith("/")||!fo())return n;try{return new URL(n,`${un}/`).toString()}catch{return`${un}${n}`}}function Rt(e,t,n){let a=0;const r=new Promise((i,o)=>{a=globalThis.setTimeout(()=>{o(new Error(n))},t)});return Promise.race([e,r]).finally(()=>{a&&globalThis.clearTimeout(a)})}async function ar(e,t,n,a){const r=typeof AbortController=="function"?new AbortController:null;let i=0;r&&Number.isFinite(n)&&n>0&&(i=globalThis.setTimeout(()=>{r.abort()},n));try{return await fetch(e,{...t??{},...r?{signal:r.signal}:{}})}catch(o){throw r?.signal?.aborted?new Error(a):o}finally{i&&globalThis.clearTimeout(i)}}function Ao(){if(!A.isNativePlatform())throw new Error("Google 備份僅支援 App 裝置")}function Ke(e){return e?typeof e=="string"?e:String(e.token??"").trim():""}function de(e){const t=e&&typeof e=="object"?e:{};return{email:String(t.email??"").trim(),name:String(t.name??"").trim(),imageUrl:String(t.imageUrl??t.picture??"").trim()}}function ir(){return!ne||!Number.isFinite(oe)||oe<=0?!1:Date.now()+_o<oe}function qt(){return typeof localStorage<"u"}function Ie(){if(!qt())return;const e={accessToken:ne,accessTokenExpiresAtMs:oe,refreshToken:$,profile:F,mode:or()};try{localStorage.setItem(Wt,JSON.stringify(e))}catch{}}function Oo(){if(qt())try{const e=localStorage.getItem(Wt);if(!e)return;const t=JSON.parse(e);if(!t||typeof t!="object")return;ne=Ke(t.accessToken),$=String(t.refreshToken??"").trim(),oe=Math.max(0,Number(t.accessTokenExpiresAtMs??0)||0),F=de(t.profile)}catch{}}function So(){if(qt())try{localStorage.removeItem(Wt)}catch{}}function ut({accessToken:e,refreshToken:t,expiresInSec:n,expiresAtMs:a}={}){typeof e=="string"&&(ne=e.trim()),typeof t=="string"&&($=t.trim());const r=Number(a);if(Number.isFinite(r)&&r>0)oe=r;else{const i=Number(n);oe=Number.isFinite(i)&&i>0?Date.now()+i*1e3:0}Ie()}function lt({keepRefreshToken:e=!1}={}){ne="",oe=0,e||($=""),e?Ie():So()}function Ro(){return"".trim()}function bo(){return Qn()}function or(){return He()?"offline":"online"}function sr(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("account reauth failed")||t.includes("[16]")}function Do(e){const t=[],n=String(e?.code??e?.errorCode??"").trim(),a=String(e?.status??"").trim(),r=String(e?.name??"").trim(),i=String(e?.message??e??"").trim();return n&&t.push(`code=${n}`),a&&t.push(`status=${a}`),r&&r!=="Error"&&t.push(`name=${r}`),i&&t.push(`raw=${i}`),t}function Ae(e,t){const n=Do(t);return n.length?`${e}（${n.join(" | ")}）`:e}function Oe(e){if(sr(e))return new Error(Ae("Google 需要重新授權，請再試一次；若仍失敗請先在裝置 Google 帳號中移除本 App 授權後重登。",e));const t=String(e?.message??"").trim(),n=t.toLowerCase();return n.includes("missing_google_oauth_env")||n.includes("google_exchange_004")||n.includes("google_refresh_004")||n.includes("google_oauth_client_secret")||n.includes("invalid_client")||n.includes("client secret is invalid")?new Error(Ae("Google 自動備份後端設定錯誤，請通知管理員檢查 Google OAuth client / secret 設定。",e)):n.includes("invalid_grant")||n.includes("redirect_uri_mismatch")||n.includes("code was already redeemed")?new Error(Ae("Google 授權碼已失效或無法交換，請到自動備份頁重新登入 Google。",e)):new Error(Ae(t||"Google 登入失敗",e))}function tt(e="Google 需要重新授權，請到自動備份頁重新登入 Google。",t=null){const n=new Error(Ae(e,t));return n.code=go,n}function dr(e){const t=e&&typeof e=="object"?e:{},n=Ke(t.accessToken??t.access_token);if(!n)throw new Error("後端未回傳 access token");const a=t.refreshToken??t.refresh_token,r=typeof a=="string"?a.trim():"",i=Number(t.expiresIn??t.expires_in??0),o=Number.isFinite(i)&&i>0?i:0,s=Number(t.accessTokenExpiresAtMs??t.access_token_expires_at_ms??t.expiresAtMs??0),c=Number.isFinite(s)&&s>0?s:0,d=de(t.profile),E=de(t),u=d.email||d.name||d.imageUrl?d:E;return t.idToken??t.id_token,{accessToken:n,refreshToken:r,expiresInSec:o,expiresAtMs:c,profile:u}}async function cr(e,t){const n={"Content-Type":"application/json"};mn&&(n["X-Straw-Client-Key"]=mn);let a;try{a=await ar(e,{method:"POST",headers:n,body:JSON.stringify(t??{})},er,To)}catch(o){throw new Error(Ae(`Google OAuth 請求失敗（url=${e}）`,o))}const r=await a.text();let i=null;if(r)try{i=JSON.parse(r)}catch{i=null}if(!a.ok){const o=String(i?.message??i?.error_description??r??i?.error??"").trim(),s=String(i?.errorNumber??"").trim(),c=s?`（errorNumber=${s}）`:"";throw new Error(`${o||`HTTP ${a.status}`}${c}（url=${e}）`)}if(!i||typeof i!="object")throw new Error(`後端回應格式錯誤（url=${e}）`);return i}async function _r(e){if(!e)return null;try{const t=await ar("https://openidconnect.googleapis.com/v1/userinfo",{method:"GET",headers:{Authorization:`Bearer ${e}`}},Eo,"Google 使用者資料讀取逾時");if(!t.ok)return null;const n=await t.json(),a=de(n);return!a.email&&!a.name&&!a.imageUrl?null:a}catch{return null}}async function yo(e){const t=String(e??"").trim();if(!t)throw new Error("Google 登入成功但未取得 server auth code");if(!ln)throw new Error("缺少 Google OAuth 後端交換端點（請設定 VITE_GOOGLE_OAUTH_EXCHANGE_URL）");const n=await cr(ln,{serverAuthCode:t});return console.info("[google-auth] exchangeServerAuthCode success"),dr(n)}async function Io(e){const t=String(e??"").trim();if(!t)throw tt("Google 授權已失效，請到自動備份頁重新登入 Google。");if(!Tn)throw new Error("缺少 Google OAuth 後端 refresh 端點（請設定 VITE_GOOGLE_OAUTH_REFRESH_URL）");const n=await cr(Tn,{refreshToken:t});return n?.accessToken??n?.access_token,dr(n)}async function bt(e={}){const t=String(e.preferredEmail??e.loginHint??"").trim(),n={scopes:co,...e};return delete n.preferredEmail,t&&!n.loginHint&&(n.loginHint=t),Se.login({provider:"google",options:n})}function Co(e=""){je!=="online"&&(je="online",at="",lt(),e&&console.warn("[google-auth] switch to online mode fallback",e))}function Uo(e){return de({email:e?.profile?.email||"",name:e?.profile?.name||"",imageUrl:e?.profile?.imageUrl||""})}function Er(e){const t=e&&typeof e=="object"?e:{},n=Number(t.expiresAtMs??t.expires_at_ms??t.expireTimeMs??t.expirationTimeMs??0);if(Number.isFinite(n)&&n>Date.now()){const r=Math.floor((n-Date.now())/1e3);if(r>0)return r}const a=Number(t.expiresIn??t.expires_in??t.expires??0);return Number.isFinite(a)&&a>0?a:uo}async function ho(){if(!(await Se.isLoggedIn({provider:"google"}))?.isLoggedIn)return"";const t=await Se.getAuthorizationCode({provider:"google"}),n=Ke(t?.accessToken);if(!n)return"";ut({accessToken:n,refreshToken:"",expiresInSec:Er(t)});const a=de(t?.profile);return(a.email||a.name||a.imageUrl)&&(F=a,Ie()),ne}function Nn(e){const t=Ke(e?.accessToken);if(!t)throw new Error("Google 登入成功但未取得 access token");return ut({accessToken:t,refreshToken:"",expiresInSec:Er(e)}),F=Uo(e),Ie(),{accessToken:t,profile:F}}async function wt(){Ao();const e=bo();if(!e)throw new Error(ht());const t=or();if(gn===e&&at===t)return;const n={webClientId:e,mode:t},a=Ro();a&&(n.iOSClientId=a),t==="offline"&&(n.iOSServerClientId=e),await Se.initialize({google:n}),gn=e,at=t}async function kt(e={}){const t=!!e?.requireRefreshToken;if(Ne){const a=Date.now()-Ve;if(a>=0&&a<lo){if(!t||Je)return Ne;console.warn("[google-auth] refresh-token sign-in cannot reuse an online-only sign-in promise")}else console.warn("[google-auth] stale sign-in promise detected, forcing a fresh login attempt",{elapsedMs:a});Ne=null,Ve=0,Je=!1}Ve=Date.now(),Je=t;const n=(async()=>{t&&nr(),await wt();let a;try{a=await Rt(bt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,style:He()?"standard":"bottom",preferredEmail:e.preferredEmail}),et,St)}catch(r){if(sr(r)){try{await Se.logout({provider:"google"})}catch{}try{a=await Rt(bt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),et,St)}catch(i){throw Oe(new Error(`首次登入失敗：${String(r?.message??r)}；重試仍失敗：${String(i?.message??i)}`))}}else throw Oe(r)}if(a.provider!=="google")throw new Error("Google 登入失敗，請重試");if(He())try{if(a.result?.responseType!=="offline")throw new Error("Google 登入成功但未取得 server auth code");const r=await yo(a.result.serverAuthCode),i=r.accessToken;if(t&&!r.refreshToken)throw new Error(Ln);const o=r.refreshToken||$,s=r.profile,c=s.email||s.name||s.imageUrl?s:await _r(i);return ut({accessToken:i,refreshToken:o,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),F=de(c),Ie(),{accessToken:ne,profile:F}}catch(r){if(t)throw Oe(r);console.warn("[google-auth] offline auth flow failed, fallback to online mode",r),Co(String(r?.message??r)),await wt();let i=a;if((i.result?.responseType!=="online"||!Ke(i.result?.accessToken))&&(i=await Rt(bt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),et,St)),i.result?.responseType!=="online")throw Oe(r);return Nn(i.result)}if(t)throw new Error(Ln);if(a.result?.responseType!=="online")throw new Error("Google 登入失敗，請重試");return Nn(a.result)})();Ne=n;try{return await n}finally{Ne===n&&(Ne=null,Ve=0,Je=!1)}}async function Ce(e={}){const t=!!e?.requireRefreshToken;if(t&&nr(),ir()&&(!t||$))return ne;const n=e?.interactive!==!1,a=String(e?.preferredEmail??"").trim();if(He()){if($)try{const r=await Io($);if(ut({accessToken:r.accessToken,refreshToken:r.refreshToken||$,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),!F?.email){const i=r.profile.email||r.profile.name||r.profile.imageUrl?r.profile:await _r(r.accessToken);i&&(F=de(i),Ie())}return ne}catch(r){console.warn("[google-auth] backend refresh failed",r)}if(n)try{return(await kt({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw Oe(r)}throw tt()}await wt();try{const r=await ho();if(r)return r}catch(r){if(!n)throw console.warn("[google-auth] background token fetch failed",r),tt(void 0,r);console.warn("[google-auth] silent token fetch before interactive sign-in failed",r)}if(n)try{return(await kt({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw Oe(r)}throw tt()}async function ur(e={}){const t=e?.interactive!==!1;return lt({keepRefreshToken:He()}),Ce({interactive:t,requireRefreshToken:!!e?.requireRefreshToken})}async function wo(){try{await Se.logout({provider:"google"})}catch(e){if(!$t||!String(e?.message??"").toLowerCase().includes("offline mode"))throw e}finally{lt(),F=null}}function Re(){return F}function lr(){const e=F&&typeof F=="object"?F:{};return!!($||ir()||e.email||e.name||e.imageUrl)}Oo();const ko=yn("FileOpener"),vo="StrawMoneyBook",Tr=["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],Xo=/(password|token|secret|authorization|client[_-]?key)/i,Fo=/^(?:bank_sync\.credentials\.[^.]+|backup\.webdav\.credentials)$/i,vt="【附加項目】";function Mo(e){if(e==null)return"";const t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?`"${t.replaceAll('"','""')}"`:t}function Ye(e,t=null){const n=Array.isArray(t)&&t.length?t:Object.keys(e[0]??{});if(!n.length)return"";const a=[n.join(",")];for(const r of e)a.push(n.map(i=>Mo(r[i])).join(","));return a.join(`\r
`)}function it(e){if(Array.isArray(e))return e.map(n=>it(n));if(!e||typeof e!="object")return e;const t={};for(const[n,a]of Object.entries(e))t[n]=Xo.test(n)?"":it(a);return t}function Bo(e){if(!e||typeof e!="object")return e;const t=String(e.key??"").trim();if(Fo.test(t))return null;try{const n=JSON.parse(String(e.value_json??"null"));return!n||typeof n!="object"?e:t==="backup.webdav"?{...e,value_json:JSON.stringify({...it(n),connected:!1,autoEnabled:!1,dataChangeAutoEnabled:!1,password:"",lastError:""})}:{...e,value_json:JSON.stringify(it(n))}}catch{return e}}function mr(e){const t=String(e??"").split(`
`).map(n=>n.trim()).find(n=>n.startsWith(vt));return t?t.slice(vt.length).trim():""}function gr(e){return String(e??"").split(`
`).map(t=>t.trim()).filter(t=>t&&!t.startsWith(vt)).join(`
`)}function xo(e){const[t,n]=String(e??"").split("-").map(i=>Number(i)),a=new Date(t,n-1,1,0,0,0),r=new Date(t,n,1,0,0,0);return{startUtc:a.toISOString(),endUtc:r.toISOString()}}function Go(e){const t=Number(e),n=new Date(t,0,1,0,0,0),a=new Date(t+1,0,1,0,0,0);return{startUtc:n.toISOString(),endUtc:a.toISOString()}}function Po(e){const[t,n,a]=String(e??"").split("-").map(o=>Number(o)),r=new Date(t,n-1,a,0,0,0),i=new Date(t,n-1,a+1,0,0,0);return{startUtc:r.toISOString(),endUtc:i.toISOString()}}function jo(e,t){const[n,a,r]=String(e??"").split("-").map(E=>Number(E)),[i,o,s]=String(t??"").split("-").map(E=>Number(E)),c=new Date(n,a-1,r,0,0,0),d=new Date(i,o-1,s+1,0,0,0);return{startUtc:c.toISOString(),endUtc:d.toISOString()}}function Lr(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0"),o=String(e.getSeconds()).padStart(2,"0");return`${t}-${n}-${a}_${r}${i}${o}`}function Xt(e,t="ledger"){const n=String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"");return n?Array.from(n).slice(0,40).join(""):t}function Ho(e,t={}){return e==="year"?Go(t.yearKey):e==="month"?xo(t.monthKey):e==="day"?Po(t.dayKey):e==="custom"?jo(t.startDate,t.endDate):{startUtc:null,endUtc:null}}const Ko=["類型","記帳時間","交易帳戶","交易帳本","貨幣符號","交易金額","當期帳戶餘額","一級分類","二級分類","交易標籤","備註","附加項目","退款&轉銷","收回","歸還","匯率"],Yo=Ko.filter(e=>e!=="交易標籤");function pn(e){const t=String(e??"").trim();return t?t.split(/\s*(?:-->|->|→|＞)\s*/g).map(n=>n.trim()).filter(Boolean):[]}function Wo(e,t){const n=pn(e),a=pn(t),r=n[0]||a[0]||"";let i="";return a.length>1?i=a.slice(1).join(" / "):a.length===1?i=a[0]:n.length>1&&(i=n.slice(1).join(" / ")),{primary:r,secondary:i}}async function Tt(e,t){const a=(await W(`SELECT * FROM ${t} WHERE ledger_id = ?;`,[e]))?.values??[];return t!=="app_settings"?a:a.map(r=>Bo(r)).filter(Boolean)}async function Nr(){const e=await W("SELECT MAX(version) AS version FROM schema_migrations;");return Number(e?.values?.[0]?.version??0)}async function $o(e,t=null){const n=!!t,a=n?`SELECT
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
       GROUP BY a.id, a.opening_balance_minor;`,i=(n?await W(a,[t,e]):await W(a,[e]))?.values??[],o=new Map;for(const s of i)o.set(String(s.account_id),to(s.balance_minor));return o}async function vd(e){const t={schema_version:0,exported_at:new Date().toISOString(),ledger_id:e,tables:{}};t.schema_version=await Nr();const n=await W("SELECT * FROM ledgers WHERE id = ?;",[e]);t.tables.ledgers=n?.values??[];for(const a of Tr)t.tables[a]=await Tt(e,a);return t}async function pr(){const e={schema_version:await Nr(),exported_at:new Date().toISOString(),backup_scope:"all_ledgers",ledgers:[]},n=(await W("SELECT * FROM ledgers WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC, id ASC;"))?.values??[];for(const a of n){const r=a?.id;if(!r)continue;const i={schema_version:e.schema_version,exported_at:e.exported_at,ledger_id:r,tables:{ledgers:[a]}};for(const o of Tr)i.tables[o]=await Tt(r,o);e.ledgers.push(i)}return e}async function Xd(e){const n=((await W(`SELECT *
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
     ORDER BY occurred_at DESC, created_at DESC;`,[e]))?.values??[]).map(r=>({...r,note_without_addon:gr(r.note),addon_items:mr(r.note)})),a=n.length?Object.keys(n[0]):["ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","is_reimbursable","reimbursement_state","reimbursed_at","note_without_addon","addon_items","created_at","updated_at","deleted_at"];return Ye(n,a)}async function Fd(e){const t=await Tt(e,"accounts");return Ye(t)}async function Md(e){const t=await Tt(e,"categories");return Ye(t)}function qo(e){return e==="expense"?"支出":e==="income"?"收入":e==="transfer"?"轉帳":"調整"}function zo(e){if(Array.isArray(e))return e.map(n=>String(n??"").trim()).filter(Boolean).join("、");const t=String(e??"").trim();if(!t)return"";try{const n=JSON.parse(t);if(Array.isArray(n))return n.map(a=>String(a??"").trim()).filter(Boolean).join("、")}catch{}return t}function Vo(e,t){const n=[],a=[];for(const r of e){const i=Number(r.amount_minor??0)/100,o=String(r.account_id??""),s=no(t.get(o),r.amount_minor);t.set(o,s);const c=s/100,d=Wo(r.category_group_name,r.category_name),E=mr(r.note),u={類型:qo(r.type),記帳時間:r.occurred_at??"",交易帳戶:r.account_name??"",交易帳本:r.ledger_name??"",貨幣符號:r.currency_code??"TWD",交易金額:String(i),當期帳戶餘額:String(c),一級分類:d.primary,二級分類:d.secondary,備註:gr(r.note),附加項目:E,"退款&轉銷":"",收回:"",歸還:"",匯率:"1"};n.push(u),a.push({...u,交易標籤:zo(r.tags_json)})}return{csvRows:n,excelRows:a}}async function Jo(e,t={}){const n=["all","year","month","day","custom"].includes(t.mode)?t.mode:"all",{startUtc:a,endUtc:r}=Ho(n,t),i=await $o(e,a),o=[e];let s="";a&&r&&(s=" AND t.occurred_at >= ? AND t.occurred_at < ?",o.push(a,r));const d=(await W(`SELECT
       t.type,
       t.account_id,
       t.category_id,
       t.include_in_analysis,
       CASE WHEN ${ro("t")} THEN 1 ELSE 0 END AS has_refund_link,
       ${ao("t")} AS refund_deducted_minor,
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
     ORDER BY t.occurred_at ASC, t.created_at ASC;`,o))?.values??[],{csvRows:E,excelRows:u}=Vo(d,i),T=E[0]?.交易帳本||d[0]?.ledger_name||"ledger";return{mode:n,ledgerName:T,rowCount:E.length,csvRows:E,excelRows:u,records:d}}async function Bd(e,t={}){const n=await Jo(e,t),r=`${Xt(n.ledgerName)}_transactions_${n.mode}_${Lr()}.csv`,i=Ye(n.csvRows,Yo);return{filename:r,csvText:i,rowCount:n.rowCount}}function Ze(e){const t=Number(e??0)/100;return Number.isFinite(t)?t.toFixed(2).replace(/\.00$/,"").replace(/(\.\d)0$/,"$1"):"0"}function Zo(e){const t=String(e??"").trim();return{active:"進行中",partial:"部分完成",settled:"已結清",void:"完成"}[t]??t}function Qo(e){return e==="borrow"?"借入":"借出"}const es=["狀態","借貸方向","對象名稱","開始日期","到期日","建立入帳帳戶","本金","預設利息","已收 / 已還","剩餘","備註"];function ts(e=[]){return(e??[]).map(t=>({狀態:Zo(t?.status),借貸方向:Qo(t?.direction),對象名稱:String(t?.counterparty_name??"").trim()||"未命名對象",開始日期:String(t?.start_date??t?.setup_occurred_at??"").trim(),到期日:String(t?.due_date??"").trim(),建立入帳帳戶:String(t?.setup_account_name??"").trim(),本金:Ze(t?.principal_minor),預設利息:Ze(t?.preset_interest_minor),"已收 / 已還":Ze(t?.paid_minor),剩餘:Ze(t?.remaining_minor),備註:String(t?.note??"").trim()}))}function xd(e,t={}){const n=Xt(t.ledgerName??"loans"),a=Xt(t.scopeName??""),r=t.tab==="borrow"?"borrow":"lend",i=t.showFinished?"finished":"active",o=Lr(t.now instanceof Date?t.now:new Date),s=ts(e),c=a?`_${a}`:"";return{filename:`${n}_loans${c}_${r}_${i}_${o}.csv`,csvText:Ye(s,es),rowCount:s.length}}function Gd(e,t){const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"});fr(e,n)}function Pd(e,t){const n=new Blob([`\uFEFF${t}`],{type:"text/csv;charset=utf-8"});fr(e,n)}function jd(e){const t=new Blob([`\uFEFF${e}`],{type:"text/csv;charset=utf-8"});return URL.createObjectURL(t)}function Hd(e){const t=e instanceof Blob?e:new Blob([e],{type:"application/pdf"});return URL.createObjectURL(t)}function Kd(e){e&&URL.revokeObjectURL(e)}function ns(e,t){if(!e)return;const n=document.createElement("a");n.href=e,n.download=t,document.body.appendChild(n),n.click(),n.remove()}function Yd(e){const t=String(e??"").trim();if(!t||typeof window>"u"||typeof document>"u")return!1;const n=t.startsWith("blob:")||t.startsWith("data:"),a=/^file:\/\//i.test(t)||/^content:\/\//i.test(t)||t.startsWith("/");if(A.isNativePlatform()){if(n)return!1;if(a)return ko.openFile({uri:t}).catch(i=>{console.warn("[file-opener] failed to open exported file",i)}),!0;try{return window.location.assign(t),!0}catch{}}const r=()=>{const i=document.createElement("a");return i.href=t,i.target="_blank",i.rel="noopener noreferrer",document.body.appendChild(i),i.click(),i.remove(),!0};try{if(window.open(t,"_blank","noopener,noreferrer"))return!0}catch{}try{return r()}catch{try{return window.location.assign(t),!0}catch{return!1}}}function fr(e,t){const n=URL.createObjectURL(t);ns(n,e),URL.revokeObjectURL(n)}function Ar(e){const t=new TextEncoder().encode(e),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}function rs(e){const t=e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e??[]),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}async function zt(e,t,n={}){if(!A.isNativePlatform())return{saved:!1,reason:"not-native"};const a=as(e),r=is(n.category,"exports"),i=`${vo}/${r}/${a}`,o=`Documents/${i}`,s=[{directory:an.Documents,path:i,location:o},{directory:an.ExternalStorage,path:o,location:o}].filter(d=>!!d.directory);let c=null;for(const d of s)try{const E=await Wr.writeFile({path:d.path,data:t,directory:d.directory,recursive:!0});return{saved:!0,uri:E?.uri??"",openUrl:E?.uri?A.convertFileSrc(E.uri):"",filename:a,location:d.location}}catch(E){c=E}return{saved:!1,reason:c?.message??"write-failed"}}function as(e){const t=String(e??"").trim(),n=`export_${Date.now()}.csv`;if(!t)return n;const i=(t.includes(".")?t:`${t}.csv`).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").slice(0,80);return i||n}function is(e,t="exports"){return String(e??"").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").toLowerCase()||t}async function Wd(e,t,n={}){const a=JSON.stringify(t,null,2),r=Ar(a);return zt(e,r,n)}async function $d(e,t,n={}){const a=Ar(`\uFEFF${t}`);return zt(e,a,n)}async function qd(e,t,n={}){const a=t instanceof Blob?await t.arrayBuffer():t,r=rs(a);return zt(e,r,n)}function Or(e){return Math.max(1,Number(e??24)||24)}function os(e,t=Date.now()){if(!e?.connected||!e?.autoEnabled)return!1;const n=String(e?.lastBackupAt??"").trim();if(!n)return!0;const a=Date.parse(n);if(!Number.isFinite(a))return!0;const r=Or(e?.intervalHours)*60*60*1e3;return t-a>=r}const be="https://www.googleapis.com/drive/v3/files",Sr="https://www.googleapis.com/upload/drive/v3/files";function _e(e,t={}){const n=ss(t);return delete n.Authorization,delete n.authorization,{...n,Authorization:`Bearer ${e}`}}function ss(e){return e?Array.isArray(e)?Object.fromEntries(e):typeof e.entries=="function"?Object.fromEntries(Array.from(e.entries())):typeof e=="object"?{...e}:{}:{}}async function me(e,t,n,a){const r=await fetch(n,a);if(r.status!==401||typeof t!="function")return r;const i=await t();return fetch(n,{...a,headers:_e(i,a?.headers??{})})}function ge(e,t){return e.ok?e:e.text().then(n=>{throw new Error(`${t}：${n||e.status}`)})}function ds(e,t){const n=`strawmoneybook_${Math.random().toString(16).slice(2)}`,a=`\r
--${n}\r
`,r=`\r
--${n}--`;return{body:new Blob([a,`Content-Type: application/json; charset=UTF-8\r
\r
`,JSON.stringify(e),a,`Content-Type: application/json; charset=UTF-8\r
\r
`,t,r]),contentType:`multipart/related; boundary=${n}`}}async function cs(e,t,n){const a=encodeURIComponent(`name='${n}' and 'appDataFolder' in parents and trashed=false`),r=encodeURIComponent("files(id,name,modifiedTime,size)"),i=`${be}?spaces=appDataFolder&q=${a}&fields=${r}&orderBy=modifiedTime desc`,o=await me(e,t,i,{method:"GET",headers:_e(e)});await ge(o,"讀取 Google 備份清單失敗");const s=await o.json();return Array.isArray(s?.files)?s.files:[]}async function _s(e,t,n){const a=`${be}/${encodeURIComponent(n)}`,r=await me(e,t,a,{method:"DELETE",headers:_e(e)});await ge(r,"刪除重複備份失敗")}async function Es(e,t,n,a){const r={name:n,parents:["appDataFolder"]},{body:i,contentType:o}=ds(r,a),s=await me(e,t,`${Sr}?uploadType=multipart&fields=id,name,modifiedTime`,{method:"POST",headers:_e(e,{"Content-Type":o}),body:i});return await ge(s,"建立 Google 備份失敗"),s.json()}async function us(e,t,n,a){const r=await me(e,t,`${Sr}/${encodeURIComponent(n)}?uploadType=media`,{method:"PATCH",headers:_e(e,{"Content-Type":"application/json; charset=UTF-8"}),body:a});await ge(r,"更新 Google 備份失敗")}async function ls({accessToken:e,reauth:t,filename:n,jsonText:a}){let r=e;const i=typeof t=="function"?async()=>{const d=await t();return r=String(d??"").trim()||r,r}:null,o=await cs(r,i,n),s=o[0]||null;if(s?.id){await us(r,i,s.id,a);for(const d of o.slice(1))d?.id&&await _s(r,i,d.id);return{fileId:s.id,filename:n,modifiedTime:new Date().toISOString(),created:!1}}const c=await Es(r,i,n,a);return{fileId:String(c?.id??""),filename:String(c?.name??n),modifiedTime:String(c?.modifiedTime??new Date().toISOString()),created:!0}}async function Rr({accessToken:e,reauth:t,pageSize:n=100}={}){const a=[];let r="";const i=Math.min(1e3,Math.max(1,Number(n)||100)),o=encodeURIComponent("nextPageToken,files(id,name,modifiedTime,size)");do{let s=`${be}?spaces=appDataFolder&fields=${o}&orderBy=modifiedTime desc&pageSize=${i}`;r&&(s+=`&pageToken=${encodeURIComponent(r)}`);const c=await me(e,t,s,{method:"GET",headers:_e(e)});await ge(c,"讀取 Google 備份清單失敗");const d=await c.json(),E=Array.isArray(d?.files)?d.files:[];a.push(...E),r=String(d?.nextPageToken??"").trim()}while(r);return a}async function Ts({accessToken:e,reauth:t,fileId:n,pageSize:a=200}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=[];let o="";const s=Math.min(1e3,Math.max(1,Number(a)||200)),c=encodeURIComponent("nextPageToken,revisions(id,modifiedTime,size,keepForever)");do{let d=`${be}/${encodeURIComponent(r)}/revisions?fields=${c}&pageSize=${s}`;o&&(d+=`&pageToken=${encodeURIComponent(o)}`);const E=await me(e,t,d,{method:"GET",headers:_e(e)});await ge(E,"讀取 Google Drive 檔案版本失敗");const u=await E.json(),T=Array.isArray(u?.revisions)?u.revisions:[];i.push(...T),o=String(u?.nextPageToken??"").trim()}while(o);return i.map(d=>({id:String(d?.id??"").trim(),modifiedTime:String(d?.modifiedTime??"").trim(),size:d?.size!=null?String(d.size):"",keepForever:!!d?.keepForever})).filter(d=>d.id).sort((d,E)=>String(E.modifiedTime).localeCompare(String(d.modifiedTime)))}async function br({accessToken:e,reauth:t,fileId:n,revisionId:a}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=String(a??"").trim(),o=i?`${be}/${encodeURIComponent(r)}/revisions/${encodeURIComponent(i)}?alt=media`:`${be}/${encodeURIComponent(r)}?alt=media`,s=await me(e,t,o,{method:"GET",headers:_e(e)});return await ge(s,"下載 Google 備份失敗"),s.text()}function Dr(e){const t=e?.deleted_at;return t==null?!1:String(t).trim()!==""}function ms(e){const t=String(e??"").trim();if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})/);if(n)return`${n[1]}-${n[2]}`;const a=Date.parse(t);if(!Number.isFinite(a))return"";const r=new Date(a);if(Number.isNaN(r.getTime()))return"";const i=r.getUTCFullYear(),o=String(r.getUTCMonth()+1).padStart(2,"0");return`${i}-${o}`}function gs(e){return!e||typeof e!="object"?[]:Array.isArray(e.ledgers)&&e.backup_scope==="all_ledgers"?e.ledgers.filter(t=>t&&typeof t=="object"):e.tables&&typeof e.tables=="object"?[e]:[]}function Ls(e){const t=Array.isArray(e?.tables?.ledgers)?e.tables.ledgers:[],n=t.find(i=>i&&!Dr(i))||t[0],a=String(n?.name??e?.ledger_name??"").trim();return a||String(e?.ledger_id??n?.id??"").trim()||""}function Ns(e){const t=Array.isArray(e?.tables?.transactions)?e.tables.transactions:[];let n=0;const a=Object.create(null);for(const r of t){if(!r||typeof r!="object"||Dr(r))continue;n+=1;const i=ms(r.occurred_at);i&&(a[i]=(a[i]||0)+1)}return{count:n,monthDistribution:a}}function ps(...e){const t=Object.create(null);for(const n of e)if(!(!n||typeof n!="object"))for(const[a,r]of Object.entries(n))t[a]=(t[a]||0)+Number(r||0);return t}function Xe(e){const t={ok:!1,parseError:"",backupScope:"",exportedAt:"",ledgerNames:[],ledgerCount:0,transactionCount:0,monthDistribution:{},months:[],earliestMonth:"",latestMonth:""};if(!e||typeof e!="object")return{...t,parseError:"invalid_payload"};const n=gs(e);if(!n.length)return{...t,parseError:"missing_ledgers",backupScope:String(e.backup_scope??"").trim(),exportedAt:String(e.exported_at??"").trim()};const a=[];let r=0,i=Object.create(null);for(const s of n){const c=Ls(s);c&&a.push(c);const d=Ns(s);r+=d.count,i=ps(i,d.monthDistribution)}const o=Object.keys(i).sort();return{ok:!0,parseError:"",backupScope:String(e.backup_scope??(n.length>1?"all_ledgers":"single")).trim(),exportedAt:String(e.exported_at??"").trim(),ledgerNames:a,ledgerCount:n.length,transactionCount:r,monthDistribution:i,months:o,earliestMonth:o[0]||"",latestMonth:o[o.length-1]||""}}function yr(e){const t=String(e??"");if(!t.trim())return Xe(null);try{return Xe(JSON.parse(t))}catch{return{...Xe(null),parseError:"json_parse_error"}}}function fs(e,t,n={}){const a=e&&typeof e=="object"?e:{},r=t&&typeof t=="object"?t:{},i=String(n.remoteModifiedAt??a.exportedAt??"").trim(),o=String(n.localModifiedAt??r.exportedAt??"").trim();let s="unknown";const c=Date.parse(i),d=Date.parse(o);Number.isFinite(c)&&Number.isFinite(d)&&(c<d-1e3?s="older":c>d+1e3?s="newer":s="same");const E=Array.isArray(a.months)?a.months:[],u=Array.isArray(r.months)?r.months:[],T=new Set(E),m=new Set(u),L=u.filter(S=>!T.has(S)),v=E.filter(S=>!m.has(S));let f="unknown";!a.ok&&!r.ok?f="unknown":!E.length&&!u.length||!L.length&&!v.length?f="equal":!L.length&&v.length?f="remote_wider":L.length&&!v.length?f="remote_narrower":E.length&&u.length?f="overlapping":f="disjoint";const M=Number(r.transactionCount??0)||0,V=Number(a.transactionCount??0)||0,re=!!(a.ok&&r.ok&&(L.length>0||M>0&&V<M));return{ageRelation:s,coverage:f,monthsOnlyInLocal:L,monthsOnlyInRemote:v,localTxCount:M,remoteTxCount:V,warnIncompleteRemote:re,warnOlderRemote:s==="older",warnNewerRemote:s==="newer"}}function zd(e,{limit:t=8}={}){const n=Object.entries(e||{}).sort(([i],[o])=>i.localeCompare(o));if(!n.length)return"";const a=n.slice(0,Math.max(1,t)).map(([i,o])=>`${i}:${o}`),r=n.length-a.length;return r>0?`${a.join(", ")} (+${r})`:a.join(", ")}const As=["ledgers","account_groups","accounts","category_groups","categories","transactions","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],Os=Object.freeze({app_settings:"key",bank_sync_rules:"connection_id",savings_jars:"account_id"});function h(e){return JSON.parse(JSON.stringify(e??null))}function l(e){return String(e??"").trim()}function ce(e){if(e==null||e==="")return Number.NaN;if(e instanceof Date){const a=e.getTime();return Number.isFinite(a)?a:Number.NaN}if(typeof e=="number")return Number.isFinite(e)?Math.abs(e)<1e11?Math.round(e*1e3):Math.round(e):Number.NaN;const t=l(e);if(!t)return Number.NaN;if(/^-?\d+(\.\d+)?$/.test(t))return ce(Number(t));const n=Date.parse(t);return Number.isFinite(n)?n:Number.NaN}function ot(e){const t=ce(e);return Number.isFinite(t)?new Date(t).toISOString():""}function g(e,t){const n=e?.tables?.[t];return Array.isArray(n)?n.map(a=>h(a)):[]}function Vt(e,t){const n=As.filter(r=>r!=="deleted_log"),a=new Set;for(const r of[e,t]){const i=r?.tables&&typeof r.tables=="object"?Object.keys(r.tables):[];for(const o of i){const s=l(o);!s||s==="deleted_log"||n.includes(s)||a.add(s)}}return[...n,...Array.from(a).sort((r,i)=>r.localeCompare(i))]}function O(e,t,n=0){const a=Os[e];if(a){const i=l(t?.[a]);if(i)return i}const r=l(t?.id);return r||`__row_${e}_${n}_${JSON.stringify(t??{})}`}function P(e){const t=[e?.deleted_at,e?.updated_at,e?.occurred_at,e?.posted_at,e?.paid_at,e?.received_at,e?.submitted_at,e?.approved_at,e?.settled_at,e?.last_seen_at,e?.first_seen_at,e?.last_sync_at,e?.created_at];for(const n of t){const a=ce(n);if(Number.isFinite(a))return a}return 0}function We(e,t){return[...t].sort((n,a)=>{const r=O(e,n),i=O(e,a),o=r.localeCompare(i);if(o!==0)return o;const s=P(n)-P(a);return s!==0?s:JSON.stringify(n).localeCompare(JSON.stringify(a))})}function Jt(e){return[...e].sort((t,n)=>{const a=l(t?.table_name),r=l(n?.table_name),i=a.localeCompare(r);if(i!==0)return i;const o=l(t?.row_pk),s=l(n?.row_pk),c=o.localeCompare(s);if(c!==0)return c;const d=P(t)-P(n);return d!==0?d:JSON.stringify(t).localeCompare(JSON.stringify(n))})}function p(e=[],t="id"){return new Set(e.map(n=>l(n?.[t])).filter(Boolean))}function pe(e,t=[],n=new Set){let a=e;for(const r of t){const i=l(a?.[r]);i&&!n.has(i)&&(a={...a,[r]:null})}return a}const D=Object.freeze({created_at:"1970-01-01T00:00:00.000Z",updated_at:"1970-01-01T00:00:00.000Z"});function y(e,t,n,a){const r=p(e[t]),i=[];for(const o of n){const s=l(o);!s||r.has(s)||(i.push(a(s)),r.add(s))}return i.length===0?0:(e[t]=We(t,[...g({tables:e},t),...i]),i.length)}function R(e,t){const n=new Set;for(const a of e){const r=l(a?.[t]);r&&n.add(r)}return n}function Ss(e,t,n="system_fk_preserve_accounts"){return t.synthesizedAccountGroups+=y(e,"account_groups",[n],a=>({id:a,name:"資料保全群組",type:"other",sort_order:9999,is_archived:1,...D})),n}function ie(e,t,n){if(!n?.length)return 0;const a=Ss(e,t);return y(e,"accounts",n,r=>({id:r,group_id:a,name:"資料保全帳戶",account_type:"asset",account_kind:"cash",allow_negative:1,opening_balance_minor:0,currency_code:"TWD",include_in_assets:0,include_in_group_statistics:0,sort_order:9999,is_archived:1,...D}))}function Dt(e,t,n){if(!n?.length)return 0;const a="system_fk_preserve_categories";return t.synthesizedCategoryGroups+=y(e,"category_groups",[a],r=>({id:r,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...D})),y(e,"categories",n,r=>({id:r,group_id:a,name:"資料保全分類",type:"expense",sort_order:9999,is_archived:1,...D}))}function Rs(e){const t={...e},n={synthesizedAccountGroups:0,synthesizedAccounts:0,synthesizedCategoryGroups:0,synthesizedCategories:0,synthesizedCounterparties:0,synthesizedBudgets:0,synthesizedBankConnections:0,synthesizedLoans:0,nulledOptionalRefs:0,droppedChildRows:0},a=g({tables:t},"accounts");n.synthesizedAccountGroups+=y(t,"account_groups",R(a,"group_id"),_=>({id:_,name:"資料保全群組",type:"other",sort_order:9999,is_archived:1,...D})),t.accounts=a;let r=p(t.accounts);const i=g({tables:t},"categories");n.synthesizedCategoryGroups+=y(t,"category_groups",R(i,"group_id"),_=>({id:_,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...D})),t.categories=i;let o=p(t.categories);const s=g({tables:t},"transactions"),c=[...R(s,"account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ie(t,n,c),r=p(t.accounts);const d=[...R(s,"peer_account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ie(t,n,d),r=p(t.accounts);const E=[...R(s,"category_id")].filter(_=>!o.has(_));n.synthesizedCategories+=Dt(t,n,E),o=p(t.categories),t.transactions=s;const u=p(t.transactions);t.transaction_attachments=g({tables:t},"transaction_attachments");const T=g({tables:t},"loans");n.synthesizedCounterparties+=y(t,"counterparties",R(T,"counterparty_id"),_=>({id:_,name:"資料保全往來對象",...D})),t.loans=T;let m=p(t.loans);const L=g({tables:t},"loan_payments"),v=[...R(L,"loan_id")].filter(_=>!m.has(_));n.synthesizedLoans+=y(t,"loans",v,_=>({id:_,counterparty_id:null,principal_minor:0,status:"active",...D})),m=p(t.loans),n.synthesizedAccounts+=ie(t,n,[...R(L,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.loan_payments=L.map(_=>pe(_,["generated_tx_id","generated_interest_tx_id"],u));const f=g({tables:t},"reimbursement_advances");n.synthesizedAccounts+=ie(t,n,[...R(f,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.reimbursement_advances=f.map(_=>pe(_,["source_tx_id"],u));const M=p(t.reimbursement_advances),V=g({tables:t},"reimbursement_advance_usages"),re=[...R(V,"advance_id")].filter(_=>!M.has(_));if(re.length>0){const _="system_fk_preserve_advance_account";n.synthesizedAccounts+=ie(t,n,[_]),r=p(t.accounts),y(t,"reimbursement_advances",re,x=>({id:x,account_id:_,amount_minor:0,...D}))}t.reimbursement_advance_usages=V.map(_=>{const x=l(_?.expense_tx_id),K=pe(_,["expense_tx_id"],u);return x&&!l(K?.expense_tx_id)&&(n.nulledOptionalRefs+=1),K});const Ue=g({tables:t},"reimbursements");n.synthesizedCounterparties+=y(t,"counterparties",R(Ue,"counterparty_id"),_=>({id:_,name:"資料保全往來對象",...D})),t.reimbursements=Ue.map(_=>{const x=l(_?.paid_tx_id),K=pe(_,["paid_tx_id"],u);return x&&!l(K?.paid_tx_id)&&(n.nulledOptionalRefs+=1),K});const he=p(t.reimbursements),S=g({tables:t},"reimbursement_items"),U=[...R(S,"reimbursement_id")].filter(_=>!he.has(_));y(t,"reimbursements",U,_=>({id:_,title:"資料保全請款",status:"open",total_minor:0,...D})),n.synthesizedAccounts+=ie(t,n,[...R(S,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),n.synthesizedCategories+=Dt(t,n,[...R(S,"category_id")].filter(_=>!o.has(_))),o=p(t.categories),t.reimbursement_items=S.map(_=>{const x=l(_?.transaction_id),K=pe(_,["transaction_id"],u);return x&&!l(K?.transaction_id)&&(n.nulledOptionalRefs+=1),K});const B=g({tables:t},"budgets");t.budgets=B;let w=p(t.budgets);const H=g({tables:t},"budget_containers"),ae=[...R(H,"budget_id")].filter(_=>!w.has(_));n.synthesizedBudgets+=y(t,"budgets",ae,_=>({id:_,month_key:"1970-01",...D})),w=p(t.budgets),t.budget_containers=H;const J=g({tables:t},"budget_items"),Le=[...R(J,"budget_id")].filter(_=>!w.has(_));n.synthesizedBudgets+=y(t,"budgets",Le,_=>({id:_,month_key:"1970-01",...D})),w=p(t.budgets),n.synthesizedCategories+=Dt(t,n,J.filter(_=>l(_?.scope_type)==="category").map(_=>l(_?.category_id)).filter(_=>_&&!o.has(_))),o=p(t.categories),n.synthesizedCategoryGroups+=y(t,"category_groups",J.filter(_=>l(_?.scope_type)==="group").map(_=>l(_?.category_group_id)).filter(_=>_&&!p(t.category_groups).has(_)),_=>({id:_,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...D})),t.budget_items=J;const ze=g({tables:t},"savings_jars");n.synthesizedAccounts+=ie(t,n,[...R(ze,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.savings_jars=ze;const Pr=g({tables:t},"bank_connections");t.bank_connections=Pr;let Z=p(t.bank_connections);const Nt=g({tables:t},"bank_accounts"),jr=[...R(Nt,"connection_id")].filter(_=>!Z.has(_));n.synthesizedBankConnections+=y(t,"bank_connections",jr,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...D})),Z=p(t.bank_connections),n.synthesizedAccounts+=ie(t,n,[...R(Nt,"mapped_account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.bank_accounts=Nt;let tn=p(t.bank_accounts);const pt=g({tables:t},"bank_transactions"),Hr=[...R(pt,"connection_id")].filter(_=>!Z.has(_));n.synthesizedBankConnections+=y(t,"bank_connections",Hr,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...D})),Z=p(t.bank_connections);const nn=[...R(pt,"bank_account_id")].filter(_=>!tn.has(_));if(nn.length>0){const _=[...Z][0]||"system_fk_preserve_bank_connection";[...Z].length||(n.synthesizedBankConnections+=y(t,"bank_connections",[_],x=>({id:x,provider:"fk_preserve",display_name:"資料保全銀行連線",...D})),Z=p(t.bank_connections)),y(t,"bank_accounts",nn,x=>({id:x,connection_id:[...Z][0],display_name:"資料保全銀行帳戶",...D})),tn=p(t.bank_accounts)}t.bank_transactions=pt.map(_=>{const x=l(_?.imported_txn_id),K=pe(_,["imported_txn_id"],u);return x&&!l(K?.imported_txn_id)&&(n.nulledOptionalRefs+=1),K});const rn=g({tables:t},"bank_sync_rules"),Kr=[...R(rn,"connection_id")].filter(_=>!Z.has(_));return n.synthesizedBankConnections+=y(t,"bank_connections",Kr,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...D})),t.bank_sync_rules=rn,n.droppedChildRows=0,t.__fk_preserve_report=n,t}function bs(e){try{const t=JSON.parse(String(e?.payload_json??"{}"));return t&&typeof t=="object"?t:null}catch{return null}}function Ds(e=[]){let t=0;for(const n of e)t=Math.max(t,P(n));return t}function ys(e,t){const n={...e},a=(r,i,o)=>{const s=l(i);if(!s||p(n[r]).has(s))return;const d=`${r}::${s}`,E=t.get(d);if(!E)return;const u=ce(E.deleted_at),T=Ds(o);if(!Number.isFinite(u)||!(T>u))return;const m=bs(E);if(!m)return;const L={...h(m),id:s,updated_at:ot(m.updated_at)||ot(T)||new Date().toISOString()};n[r]=We(r,[...g({tables:n},r),L]),t.delete(d)};for(const r of g({tables:n},"transactions"))a("accounts",r?.account_id,[r]),a("accounts",r?.peer_account_id,[r]),a("categories",r?.category_id,[r]);for(const r of g({tables:n},"accounts"))a("account_groups",r?.group_id,[r,...g({tables:n},"transactions").filter(i=>l(i?.account_id)===l(r?.id)||l(i?.peer_account_id)===l(r?.id))]);for(const r of g({tables:n},"categories"))a("category_groups",r?.group_id,[r,...g({tables:n},"transactions").filter(i=>l(i?.category_id)===l(r?.id))]);return n}function Is(e){if(!e||typeof e!="object")return null;const t=l(e.table_name),n=l(e.row_pk);if(!t||!n)return null;const a=ot(e.deleted_at||e.updated_at||e.created_at)||new Date().toISOString();return{...h(e),table_name:t,row_pk:n,payload_json:String(e?.payload_json??"{}"),deleted_at:a}}function Zt(e=[]){const t=new Map;for(const n of e){const a=Is(n);if(!a)continue;const r=`${a.table_name}::${a.row_pk}`,i=ce(a.deleted_at),o=t.get(r),s=ce(o?.deleted_at);(!o||i>=s)&&t.set(r,a)}return t}function fe(e,t){return JSON.stringify(e)===JSON.stringify(t)}function Cs(e,t,n="remote"){return Ir(e,t,n).row}function De(e,t){return`${e}::${t}`}function Ir(e,t,n="remote"){if(!e&&!t)return{row:null,source:"none"};if(!e)return{row:h(t),source:"remote"};if(!t)return{row:h(e),source:"local"};if(fe(e,t))return{row:h(e),source:"same"};const a=P(e),r=P(t);if(a>r)return{row:h(e),source:"local"};if(r>a)return{row:h(t),source:"remote"};const i=n==="local"?"local":"remote";return{row:h(i==="local"?e:t),source:i}}function Ft(e,t,n){for(const[a,r]of g({tables:e},t).entries())if(O(t,r,a)===n)return r;return null}function G(e,t,n,a,r){const i=l(n);if(!i||!a||!r)return;const o=`${t}::${i}`;e.has(o)||e.set(o,{type:t,unitKey:i,members:[]});const s=e.get(o);s.members.some(c=>c.tableName===a&&c.rowKey===r)||s.members.push({tableName:a,rowKey:r})}function Us(e,t){const n=new Map;for(const a of[e,t])for(const r of g({tables:a},"transactions")){const i=l(r?.transfer_group_id);if(!i)continue;const o=O("transactions",r);G(n,"transfer_group",i,"transactions",o)}for(const a of[e,t])for(const r of g({tables:a},"loan_payments")){const i=l(r?.id)||O("loan_payments",r);G(n,"loan_payment_bundle",i,"loan_payments",O("loan_payments",r));for(const o of[r?.generated_tx_id,r?.generated_interest_tx_id]){const s=l(o);if(!s)continue;const c=g({tables:a},"transactions").find(d=>l(d?.id)===s);c&&G(n,"loan_payment_bundle",i,"transactions",O("transactions",c))}}for(const a of[e,t])for(const r of g({tables:a},"reimbursements")){const i=l(r?.id);if(i){G(n,"reimbursement_bundle",i,"reimbursements",O("reimbursements",r));for(const o of g({tables:a},"reimbursement_items"))l(o?.reimbursement_id)===i&&G(n,"reimbursement_bundle",i,"reimbursement_items",O("reimbursement_items",o))}}for(const a of[e,t])for(const r of g({tables:a},"reimbursement_advances")){const i=l(r?.id);if(i){G(n,"advance_bundle",i,"reimbursement_advances",O("reimbursement_advances",r));for(const o of g({tables:a},"reimbursement_advance_usages"))l(o?.advance_id)===i&&G(n,"advance_bundle",i,"reimbursement_advance_usages",O("reimbursement_advance_usages",o))}}for(const a of[e,t])for(const r of g({tables:a},"credit_statements")){const i=l(r?.account_id);if(!i)continue;const o=i;G(n,"credit_card_bundle",o,"credit_statements",O("credit_statements",r));const s=g({tables:a},"accounts").find(d=>l(d?.id)===i);s&&G(n,"credit_card_bundle",o,"accounts",O("accounts",s));for(const d of g({tables:a},"credit_repayments")){if(l(d?.account_id)!==i)continue;G(n,"credit_card_bundle",o,"credit_repayments",O("credit_repayments",d));const E=l(d?.id);for(const u of g({tables:a},"credit_repayment_allocations"))l(u?.repayment_id)===E&&G(n,"credit_card_bundle",o,"credit_repayment_allocations",O("credit_repayment_allocations",u))}const c=l(r?.id);for(const d of g({tables:a},"transaction_postings")){if(l(d?.statement_id)!==c)continue;G(n,"credit_card_bundle",o,"transaction_postings",O("transaction_postings",d));const E=l(d?.transaction_id);if(!E)continue;const u=g({tables:a},"transactions").find(T=>l(T?.id)===E);u&&G(n,"credit_card_bundle",o,"transactions",O("transactions",u))}}return Array.from(n.values())}function hs(e,t,n,a){let r=0,i=0;for(const o of e.members){const s=Ft(t,o.tableName,o.rowKey),c=Ft(n,o.tableName,o.rowKey);s&&(r=Math.max(r,P(s))),c&&(i=Math.max(i,P(c)))}return r>i?"local":i>r?"remote":a==="local"?"local":"remote"}function ws(e,t,n,a){const r=(e[t]??[]).filter((i,o)=>O(t,i,o)!==n);a&&r.push(h(a)),e[t]=We(t,r)}function Cr({mergedTables:e,rowDecisions:t,localTables:n,remoteTables:a,prefer:r}){const i=[],o={...e};for(const s of Us(n,a)){const c=new Set;for(const u of s.members){const T=t.get(De(u.tableName,u.rowKey));(T?.source==="local"||T?.source==="remote")&&c.add(T.source)}if(c.size<2)continue;const d=hs(s,n,a,r);i.push({tableName:s.members[0]?.tableName??"",rowKey:s.unitKey,conflictType:s.type,unitKey:s.unitKey,resolution:d});const E=d==="local"?n:a;for(const u of s.members){const T=Ft(E,u.tableName,u.rowKey);ws(o,u.tableName,u.rowKey,T),t.set(De(u.tableName,u.rowKey),{source:T?d:"none",row:T?h(T):null})}}return{conflicts:i,mergedTables:o}}function Ur(e,t,n){const a=[];for(const[r,i]of t.entries()){const o=`${e}::${r}`,s=n.get(o),c=P(i),d=ce(s?.deleted_at);s&&Number.isFinite(d)&&d>=c||(s&&c>d&&n.delete(o),a.push(i))}return We(e,a)}function ks(e,t,n={}){const a=n?.prefer==="local"?"local":"remote",r=Vt(e,t),i=Zt([...g(e,"deleted_log"),...g(t,"deleted_log")]),o={},s=new Map;for(const d of r){const E=new Map;for(const[u,T]of g(e,d).entries()){const m=O(d,T,u),L=h(T);E.set(m,L),s.set(De(d,m),{source:"local",row:L})}for(const[u,T]of g(t,d).entries()){const m=O(d,T,u),L=Ir(E.get(m),T,a);L.row?E.set(m,L.row):E.delete(m),s.set(De(d,m),L)}o[d]=Ur(d,E,i)}o.deleted_log=Jt(Array.from(i.values()));const c=Cr({mergedTables:o,rowDecisions:s,localTables:e.tables,remoteTables:t.tables,prefer:a});return{mergedTables:c.mergedTables,conflicts:c.conflicts}}function q(e){const t=h(e);if(!t||typeof t!="object")return{schema_version:null,ledger_id:"",exported_at:"",tables:{}};const n=Vt(t,null),a=Zt(g(t,"deleted_log")),r={};for(const d of n){const E=new Map;for(const[T,m]of g(t,d).entries()){const L=O(d,m,T),v=E.get(L);E.set(L,Cs(v,m,"remote"))}const u=[];for(const[T,m]of E.entries()){const L=`${d}::${T}`,v=a.get(L),f=P(m),M=ce(v?.deleted_at);v&&Number.isFinite(M)&&M>=f||(v&&f>M&&a.delete(L),u.push(m))}r[d]=We(d,u)}const i=ys(r,a),o=Rs(i),s=o.__fk_preserve_report||null;delete o.__fk_preserve_report,o.deleted_log=Jt(Array.from(a.values()));const c={schema_version:t.schema_version??null,ledger_id:l(t.ledger_id),exported_at:ot(t.exported_at),tables:o};return s&&(c.fk_preserve_report=s),c}function vs(e){return q(e)}function Vd(e,t,n={}){const a=q(e),r=q(t),i=l(a.ledger_id||r.ledger_id);if(a.ledger_id&&r.ledger_id&&a.ledger_id!==r.ledger_id)throw new Error("共同帳本快照 ledger_id 不一致，無法合併");const{mergedTables:o,conflicts:s}=ks(a,r,n),c=q({schema_version:r.schema_version??a.schema_version??null,ledger_id:i,exported_at:new Date().toISOString(),tables:o});return n?.detectConflicts?{mergedSnapshot:c,conflicts:s,hasConflicts:s.length>0}:c}function Jd(e,t,n,a={}){const r=q(e),i=q(t),o=q(n),s=l(i.ledger_id||o.ledger_id||r.ledger_id);if(i.ledger_id&&o.ledger_id&&i.ledger_id!==o.ledger_id)throw new Error("共同帳本快照 ledger_id 不一致，無法合併");const c=a?.prefer==="local"?"local":"remote",d=Vt(i,o),E=Zt([...g(r,"deleted_log"),...g(i,"deleted_log"),...g(o,"deleted_log")]),u={},T=[],m=new Map;for(const f of d){const M=new Map;for(const[S,U]of g(r,f).entries())M.set(O(f,U,S),h(U));const V=new Map;for(const[S,U]of g(i,f).entries())V.set(O(f,U,S),h(U));const re=new Map;for(const[S,U]of g(o,f).entries())re.set(O(f,U,S),h(U));const Ue=new Set([...M.keys(),...V.keys(),...re.keys()]),he=new Map;for(const S of Ue){const U=M.get(S)??null,B=V.get(S)??null,w=re.get(S)??null;let H=null,ae="same";if(fe(B,U))H=w,ae=w&&!fe(w,U)?"remote":"same";else if(fe(w,U))H=B,ae=B&&!fe(B,U)?"local":"same";else if(fe(B,w))H=B,ae="same";else{const J=P(B),Le=P(w);if(J!==Le){const ze=Le>J;H=c==="local"?J>=Le?B:w:Le>=J?w:B,ae=ze?"remote":"local"}else H=c==="local"?B:w,ae=c;T.push({tableName:f,rowKey:S,baseRow:U,localRow:B,remoteRow:w,chosenRow:H,resolution:c})}if(!H){m.set(De(f,S),{source:"none",row:null});continue}he.set(S,H),m.set(De(f,S),{source:ae,row:H})}u[f]=Ur(f,he,E)}u.deleted_log=Jt(Array.from(E.values()));const L=Cr({mergedTables:u,rowDecisions:m,localTables:i.tables,remoteTables:o.tables,prefer:c});return T.push(...L.conflicts),{mergedSnapshot:q({schema_version:o.schema_version??i.schema_version??r.schema_version??null,ledger_id:s,exported_at:new Date().toISOString(),tables:L.mergedTables}),conflicts:T,hasConflicts:T.length>0}}function Zd(e=[],t={}){const n=t?.prefer==="local"?"local":"remote",a=l(t?.mergeMode)||"unknown",r=Array.isArray(e)?e:[];return{mergeMode:a,prefer:n,conflictCount:r.length,conflicts:r.map(i=>({tableName:l(i?.tableName),rowKey:l(i?.rowKey),conflictType:l(i?.conflictType)||"row",unitKey:l(i?.unitKey),resolution:l(i?.resolution)||n})),recordedAt:new Date().toISOString()}}function Qd(e,t){const n=q(e),a=q(t),r={schema_version:n.schema_version??null,ledger_id:n.ledger_id,tables:n.tables},i={schema_version:a.schema_version??null,ledger_id:a.ledger_id,tables:a.tables};return JSON.stringify(r)===JSON.stringify(i)}const Xs=Object.freeze(["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"]);function N(...e){return Object.freeze(new Set(e))}function I(e){const t={};for(const[n,a]of Object.entries(e))t[n]=Object.freeze([...a]);return Object.freeze(t)}const Fs=Object.freeze({account_groups:{columns:N("ledger_id","id","name","type","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","type","created_at","updated_at"]),enums:I({type:["cash","bank","ewallet","credit_card","other"]})},accounts:{columns:N("ledger_id","id","group_id","name","account_type","account_kind","allow_negative","opening_balance_minor","currency_code","icon","credit_limit_minor","repayment_reminder_day","statement_close_day","payment_due_day","card_last4","issuer","sort_order","is_archived","created_at","updated_at","deleted_at","include_in_assets","include_in_group_statistics","is_settlement"),required:Object.freeze(["id","group_id","name","created_at","updated_at"]),enums:I({account_type:["asset","liability"],account_kind:["cash","credit"]})},category_groups:{columns:N("ledger_id","id","name","kind","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},categories:{columns:N("ledger_id","id","group_id","name","kind","icon","is_budgetable","sort_order","is_archived","created_at","updated_at","deleted_at","default_include_in_analysis","default_include_in_budget","default_is_reimbursable","system_key"),required:Object.freeze(["id","group_id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},transactions:{columns:N("ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","posted_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at","is_reimbursable","reimbursement_state","reimbursed_at","reimburse_target_minor","created_by_user_id","created_by_display_name","updated_by_user_id","updated_by_display_name"),required:Object.freeze(["id","type","account_id","amount_minor","occurred_at","created_at","updated_at"]),enums:I({type:["expense","income","adjustment","transfer"],origin_type:["manual","loan_payment","reimbursement","import","recurring","refund","wear"],reimbursement_state:["none","pending","reimbursed"]})},wear_applied:{columns:N("idempotency_key","ledger_id","tx_id","applied_at"),required:Object.freeze(["idempotency_key","ledger_id","tx_id","applied_at"])},transaction_attachments:{columns:N("ledger_id","id","transaction_id","file_uri","mime_type","file_size","checksum","created_at"),required:Object.freeze(["id","transaction_id","file_uri","mime_type","file_size","created_at"])},counterparties:{columns:N("ledger_id","id","name","contact_json","note","is_archived","created_at","updated_at"),required:Object.freeze(["id","name","created_at","updated_at"])},loans:{columns:N("ledger_id","id","counterparty_id","direction","principal_minor","interest_rule_json","start_date","due_date","status","settled_at","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","counterparty_id","direction","principal_minor","start_date","status","created_at","updated_at"]),enums:I({direction:["lend","borrow"],status:["active","partial","settled","void"]})},loan_payments:{columns:N("ledger_id","id","loan_id","account_id","paid_at","amount_minor","principal_component_minor","interest_component_minor","generated_tx_id","generated_interest_tx_id","note","created_at","updated_at"),required:Object.freeze(["id","loan_id","account_id","paid_at","amount_minor","created_at","updated_at"])},reimbursement_advances:{columns:N("ledger_id","id","account_id","source_tx_id","amount_minor","used_minor","note","received_at","created_at","updated_at","deleted_at","category_id","return_amount_minor"),required:Object.freeze(["id","account_id","received_at","created_at","updated_at"])},reimbursement_advance_usages:{columns:N("ledger_id","id","advance_id","expense_tx_id","amount_minor","created_at","updated_at"),required:Object.freeze(["id","advance_id","expense_tx_id","created_at","updated_at"])},reimbursements:{columns:N("ledger_id","id","title","counterparty_id","status","submitted_at","approved_at","paid_at","paid_tx_id","total_minor","note","idempotency_key","created_at","updated_at","deleted_at"),required:Object.freeze(["id","title","status","created_at","updated_at"]),enums:I({status:["draft","submitted","in_review","approved","paid","rejected"]})},reimbursement_items:{columns:N("ledger_id","id","reimbursement_id","source_type","transaction_id","category_id","account_id","description","amount_minor","occurred_at","attachment_uri","created_at","updated_at","entry_type"),required:Object.freeze(["id","reimbursement_id","source_type","amount_minor","occurred_at","created_at","updated_at"]),enums:I({source_type:["transaction","manual","advance"],entry_type:["expense","income"]})},budget_save_settlements:{columns:N("ledger_id","id","scope_type","scope_ref_id","period_key","source_account_id","target_account_id","settled_amount_minor","status","transfer_group_id","last_error","created_at","updated_at"),required:Object.freeze(["id","scope_type","scope_ref_id","period_key","status","created_at","updated_at"]),enums:I({scope_type:["budget_item_day","budget_item_month","budget_total_month"],status:["settled","skipped_no_surplus","invalid_config","conflict","failed"]})},budgets:{columns:N("ledger_id","id","month_key","name","include_transfers","include_loan_repayments","include_reimbursed_expenses","created_at","updated_at","deleted_at","budget_save_total_enabled","budget_save_total_target_account_id","budget_save_total_source_account_id","period_key","period_start_date","period_end_date","period_mode"),required:Object.freeze(["id","month_key","created_at","updated_at"])},budget_containers:{columns:N("ledger_id","id","budget_id","name","amount_minor","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","sort_order","created_at","updated_at","period_mode"),required:Object.freeze(["id","budget_id","name","created_at","updated_at"])},budget_items:{columns:N("ledger_id","id","budget_id","scope_type","category_id","category_group_id","amount_minor","sort_order","created_at","updated_at","amount_mode","day_rule_unit","day_rule_values_json","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","budget_container_id"),required:Object.freeze(["id","budget_id","scope_type","amount_minor","created_at","updated_at"]),enums:I({scope_type:["category","group"],amount_mode:["fixed","daily_average"],day_rule_unit:["none","weekday","monthday"]})},savings_jars:{columns:N("ledger_id","account_id","goal_type","target_amount_minor","created_at","updated_at","auto_save_source_account_id","auto_save_amount_minor","auto_save_interval_value","auto_save_interval_unit","auto_save_start_date","auto_save_charge_day","auto_save_paused"),required:Object.freeze(["account_id","created_at","updated_at"]),enums:I({goal_type:["open","target"]})},securities:{columns:N("ledger_id","id","symbol","name","market","asset_class","currency_code","include_in_assets","manual_price_minor","manual_price_at","price_source","sort_order","is_archived","settlement_account_id","created_at","updated_at","deleted_at"),required:Object.freeze(["id","symbol","name","created_at","updated_at"]),enums:I({asset_class:["stock","etf"]})},security_transactions:{columns:N("ledger_id","id","security_id","type","occurred_at","quantity","price_minor","fee_minor","fee_mode","record_mode","principal_minor","proceeds_minor","settle_at","settlement_status","confirmed_at","cash_account_id","cash_principal_tx_id","cash_pnl_tx_id","source_buy_tx_id","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","security_id","type","occurred_at","quantity","price_minor","created_at","updated_at"]),enums:I({type:["buy","sell"],fee_mode:["into_cost","from_proceeds"],record_mode:["position","funds"],settlement_status:["scheduled","confirmed","cancelled"]})},credit_statements:{columns:N("ledger_id","id","account_id","period_start_inclusive","period_end_exclusive","status","closing_balance_minor","due_on","closed_at","closing_hash","close_token","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","period_start_inclusive","period_end_exclusive","status","created_at","updated_at"]),enums:I({status:["open","closed"]})},credit_repayments:{columns:N("ledger_id","id","account_id","source_account_id","amount_minor","paid_at","transfer_group_id","idempotency_key","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","source_account_id","amount_minor","paid_at","idempotency_key","created_at","updated_at"])},credit_repayment_allocations:{columns:N("ledger_id","id","repayment_id","statement_id","amount_minor","created_at","updated_at","deleted_at"),required:Object.freeze(["id","repayment_id","statement_id","amount_minor","created_at","updated_at"])},transaction_postings:{columns:N("ledger_id","id","transaction_id","role","account_id","category_id","amount_minor","statement_id","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at"),required:Object.freeze(["id","transaction_id","role","amount_minor","created_at","updated_at"]),enums:I({role:["expense_accrual","card_liability","cash_transfer","fee","adjustment","reversal"]})},bank_connections:{columns:N("ledger_id","id","provider","provider_connection_id","status","user_label","last_sync_at","sync_cursor","last_sync_status","last_error","created_at","updated_at","deleted_at"),required:Object.freeze(["id","provider","provider_connection_id","created_at","updated_at"]),enums:I({status:["active","revoked","error"],last_sync_status:["idle","ok","error"]})},bank_accounts:{columns:N("ledger_id","id","connection_id","provider_account_id","account_mask","account_name","account_type","currency","enabled","user_label","mapped_account_id","created_at","updated_at","deleted_at"),required:Object.freeze(["id","connection_id","provider_account_id","account_name","created_at","updated_at"])},bank_transactions:{columns:N("ledger_id","id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","currency","description","merchant","status","seen_in_app","imported","imported_txn_id","raw_json","first_seen_at","last_seen_at","created_at","updated_at","transaction_type","note","summary","balance_minor"),required:Object.freeze(["id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","first_seen_at","last_seen_at","created_at","updated_at"]),enums:I({status:["pending","posted","reversed"]})},bank_sync_rules:{columns:N("ledger_id","connection_id","direction","exclude_keywords_json","min_amount_minor","include_pending","lookback_days","updated_at"),required:Object.freeze(["connection_id","updated_at"]),enums:I({direction:["all","income","expense"]})},app_settings:{columns:N("ledger_id","key","value_json","updated_at"),required:Object.freeze(["key","value_json","updated_at"])},deleted_log:{columns:N("id","ledger_id","table_name","row_pk","payload_json","deleted_at"),required:Object.freeze(["table_name","row_pk","payload_json","deleted_at"])}});function hr(e,t){const n=String(e??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n))throw new Error(`表 ${t} 欄位名稱不合法：${n}`);return n}function Ms(e,t){const n=Object.keys(t).map(o=>hr(o,e));if(!n.length)throw new Error(`表 ${e} 缺少欄位資料`);const a=n.map(()=>"?").join(", "),r=`INSERT INTO ${e} (${n.join(", ")}) VALUES (${a});`,i=n.map(o=>t[o]);return{sql:r,values:i}}function wr(e){return e==null||e===""}function Bs(e,t,n){const a=t?.enums;if(!(!a||typeof a!="object"))for(const[r,i]of Object.entries(a)){if(!(r in n)||wr(n[r]))continue;const o=n[r];if(!i.includes(o))throw new Error(`表 ${e} 欄位 ${r} 值不符合約束：${o}`)}}function xs(e){const t=e?.tables&&typeof e.tables=="object"?e.tables:{};for(const n of Xs){const a=Array.isArray(t[n])?t[n]:[],r=Fs[n];if(!r)throw new Error(`表 ${n} 缺少匯入 schema 合約`);for(let i=0;i<a.length;i+=1){const o=a[i];if(!o||typeof o!="object"||Array.isArray(o))throw new Error(`表 ${n} 第 ${i+1} 筆資料格式無效`);const s={...o,ledger_id:o.ledger_id||"gate_ledger_probe"};n==="deleted_log"&&delete s.id;const c=Object.keys(s);if(!c.length)throw new Error(`表 ${n} 缺少欄位資料`);for(const d of c)if(hr(d,n),!r.columns.has(d))throw new Error(`表 ${n} 含不存在的欄位：${d}`);for(const d of r.required)if(wr(s[d]))throw new Error(`表 ${n} 缺少必要欄位：${d}`);Bs(n,r,s),Ms(n,s)}}}function Gs(e){try{return JSON.parse(String(e??""))}catch{throw new Error("JSON 格式錯誤")}}function Ps(e){const t=e?.ledger_id??e?.tables?.ledgers?.[0]?.id;if(!t)throw new Error("JSON 缺少 ledger_id");const n=e?.tables?.ledgers?.find(a=>a.id===t)??e?.tables?.ledgers?.[0];if(!n)throw new Error("JSON 缺少 ledgers 資料");return{sourceLedgerId:t,ledgerRow:n}}function fn(e){const t=vs(e);return Ps(t),xs(t),t}function js(e){const t=Gs(e),n=Array.isArray(t?.ledgers)?t.ledgers:null;if(!n||t?.backup_scope!=="all_ledgers")return fn(t),{mode:"single",ledgerCount:1};if(!n.length)throw new Error("JSON 缺少可匯入的帳本資料");for(const a of n)fn(a);return{mode:"all_ledgers",ledgerCount:n.length}}const kr="DRIVE_RESTORE_PREVIEW_REQUIRED",mt="DRIVE_RESTORE_NOT_IMPORTABLE",Hs="DRIVE_RESTORE_IMPORT_FAILED_RESTORED";function yt(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"還原前必須完成可匯入的備份預覽。預覽失敗或內容無法解析時，禁止進入清空本機流程。",r=new Error(a);return r.code=kr,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.preview_required",r.originalMessage=n,r.silentWipeBlocked=!0,r}function z(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.parseError??"").trim(),r=String(t.message??"").trim()||`選定的 Drive 檔／舊版無法匯入（${a||n||"invalid_backup"}）。已中止，不清空本機。`,i=new Error(r);return i.code=mt,i.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.not_importable",i.parseError=a||n,i.originalMessage=n,i.silentWipeBlocked=!0,i}function Ks(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||`雲端備份匯入失敗（${n||"import_failed"}）。已從本機 durable recovery 回滾，本機資料未清空。`,r=new Error(a);if(r.code=Hs,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.import_failed_restored",r.originalMessage=n,r.localDataRestoredFromRecovery=!0,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function Qt(e,t={}){const n=String(e??"");if(!n.trim())throw z(new Error("empty_json"),{...t,parseError:"empty_json"});const a=yr(n);if(!a.ok)throw z(new Error(a.parseError||"invalid_backup"),{...t,parseError:a.parseError||"invalid_backup"});try{js(n)}catch(r){throw r?.code===mt?r:z(r,{...t,parseError:String(r?.message??"importer_structure_rejected").trim()||"importer_structure_rejected"})}return a}function vr(e,t={}){if(!e||typeof e!="object")throw yt(new Error("preview_missing"),t);if(!String(e.jsonText??"").trim())throw yt(new Error("preview_json_missing"),t);try{Qt(e.jsonText,t)}catch(n){throw n?.code===mt?yt(n,{...t,message:n.message}):n}return e}function ec(e){try{return vr(e),!0}catch{return!1}}async function Ys({createRecoveryBackup:e,wipeFn:t,importFn:n,restoreFromRecovery:a,source:r,i18nKey:i}={}){if(typeof n!="function")throw z(new Error("import_missing"),{parseError:"import_missing"});const o=await vi({createRecoveryBackup:e,wipeFn:t,source:r,i18nKey:i});try{return{imported:await n(),recoveryProof:o}}catch(s){if(typeof a!="function")throw z(s,{parseError:"import_failed_after_wipe_no_rollback",message:`備份匯入失敗且無法回滾（缺少 restoreFromRecovery）：${String(s?.message??s??"").trim()||"import_failed"}`});try{await t()}catch(c){const d=z(s,{parseError:"import_failed_partial_clear_failed",message:`備份匯入失敗，且清除部分匯入殘留亦失敗：${String(c?.message??c??"").trim()||"partial_clear_failed"}`});throw d.localDataRestoredFromRecovery=!1,d.clearError=c,d}try{await a(o)}catch(c){const d=z(s,{parseError:"import_failed_rollback_failed",message:`備份匯入失敗，且 durable recovery 回滾亦失敗：${String(c?.message??c??"").trim()||"rollback_failed"}`});throw d.localDataRestoredFromRecovery=!1,d.rollbackError=c,d}throw Ks(s)}}async function tc({preview:e,downloadBackup:t,createRecoveryBackup:n,wipeFn:a,importBackupJson:r,restoreFromRecovery:i,source:o,i18nKey:s}={}){if(vr(e,{i18nKey:"settings_auto_backup.drive_browser.preview_required"}),typeof t!="function")throw z(new Error("download_missing"),{parseError:"download_missing"});if(typeof r!="function")throw z(new Error("import_missing"),{parseError:"import_missing"});let c;try{c=await t()}catch(u){throw u?.code===mt||u?.code===kr||u?.code===Ht?u:z(u,{parseError:"download_failed",message:`下載 Drive 備份失敗，已中止不清空本機：${String(u?.message??u??"").trim()||"download_failed"}`})}Qt(c?.jsonText,{i18nKey:"settings_auto_backup.drive_browser.not_importable"});const{imported:d,recoveryProof:E}=await Ys({createRecoveryBackup:n,wipeFn:a,importFn:()=>r(c.jsonText),restoreFromRecovery:i,source:o,i18nKey:s});return{backup:c,imported:d,recoveryProof:E}}const st="backup.google_drive",Fe="StrawMoneyBook_all_ledgers.json",C=(e,t,n)=>In(e,t,n);function Ws(){return{connected:!1,accountEmail:"",accountName:"",accountImageUrl:"",autoEnabled:!1,dataChangeAutoEnabled:!1,intervalHours:24,lastBackupFilename:"",lastBackupAt:"",lastBackupStatus:"idle",lastError:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:""}}function dt(e){const t=Ws();return!e||typeof e!="object"?t:{...t,...e,connected:!!e.connected,accountEmail:String(e.accountEmail??"").trim(),accountName:String(e.accountName??"").trim(),accountImageUrl:String(e.accountImageUrl??"").trim(),autoEnabled:!!e.autoEnabled,dataChangeAutoEnabled:!!e.dataChangeAutoEnabled,intervalHours:Or(e.intervalHours),lastBackupFilename:String(e.lastBackupFilename??"").trim(),lastBackupAt:String(e.lastBackupAt??""),lastBackupStatus:String(e.lastBackupStatus??"idle"),lastError:String(e.lastError??""),lastAutoCheckAt:String(e.lastAutoCheckAt??""),lastAutoCheckStatus:String(e.lastAutoCheckStatus??"idle"),lastAutoCheckReason:String(e.lastAutoCheckReason??"")}}function j(e){if(!e)throw new Error(C("settings_auto_backup.error.missing_ledger_id"))}function en(){if(!A.isNativePlatform())throw new Error(C("settings_auto_backup.error.google.native_only"))}function $s(e){return!Array.isArray(e)||!e.length?null:e.find(n=>String(n?.name??"")===Fe)??e[0]}function An(e){return{id:String(e?.id??"").trim(),name:String(e?.name??"").trim(),modifiedTime:String(e?.modifiedTime??"").trim(),size:e?.size!=null?String(e.size):""}}function On(e){const t=String(e??"").trim();return t===Fe?"all_ledgers":/^StrawMoneyBook_sync_.+\.json$/i.test(t)?"ledger_sync":/\.json$/i.test(t)?"other_json":"other"}function gt(){if(typeof window>"u")return null;const e=window.__SMB_DRIVE_APPDATA_MOCK__;return e&&typeof e=="object"?e:null}async function Lt(e,t={}){j(e),en();const n=t?.interactiveAuth!==!1,a=()=>ur({interactive:n,requireRefreshToken:!0}),r=await $e(e);if(!r.connected)throw new Error(C("settings_auto_backup.error.google.connect_required"));return{accessToken:await Ce({interactive:n,requireRefreshToken:!0}),reauthHandler:a,state:r}}function qs(e){return!e||typeof e!="object"?!1:!!(e.email||e.name||e.imageUrl)}function Me(e){return{email:String(e?.email??"").trim(),name:String(e?.name??"").trim(),imageUrl:String(e?.imageUrl??"").trim()}}function Xr(e,t){const n={};return t.email&&t.email!==e.accountEmail&&(n.accountEmail=t.email),t.name&&t.name!==e.accountName&&(n.accountName=t.name),t.imageUrl&&t.imageUrl!==e.accountImageUrl&&(n.accountImageUrl=t.imageUrl),n}function Be(e){return String(e??"").trim().toLowerCase()}function ct(e={}){return{connected:!0,lastError:"",lastBackupStatus:"idle",...e}}function zs(e,t){const n=ct({accountEmail:t.email,accountName:t.name,accountImageUrl:t.imageUrl});return e?.lastAutoCheckReason==="reauth_required"&&(n.lastAutoCheckAt="",n.lastAutoCheckStatus="idle",n.lastAutoCheckReason=""),n}function Fr(e,t){const n=Be(e?.accountEmail),a=Be(t?.email);return!n||!a?!1:n!==a}async function Vs(e,t){if(!t.connected)return t;const n=Me(Re());if(Fr(t,n)){const i=dt({...t,connected:!1,lastError:""});return await rt(e,st,i),i}const a=Xr(t,n);if(!Object.keys(a).length)return t;const r=dt({...t,...a});return await rt(e,st,r),r}async function Mr(e=""){const t=Be(e);let n=!1;try{await Ce({interactive:!1,requireRefreshToken:!0}),n=!0}catch{n=!1}let a=Me(Re());if(t&&Be(a.email)&&Be(a.email)!==t&&(n=!1,a=Me({})),!n){const r=await kt({preferredEmail:t||e,requireRefreshToken:!0});a=Me(r?.profile??Re())}return a}function Js(e){return A.isNativePlatform()||lr()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function Zs(e){return lr()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function Qs(e){return!e||typeof e!="object"?!1:!!(e.connected||e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function ed(){return(Array.isArray(on()?.user?.auth_providers)?on().user.auth_providers:[]).some(t=>String(t?.provider??"").trim()==="google")}function td(e,t={}){return!t?.allowInteractiveWhenGoogleLinked||!Qs(e)?!1:ed()}async function nd(e,t){if(!A.isNativePlatform()||!Js(t))return t;let n="";try{n=String(await Ce({interactive:!1,requireRefreshToken:!0})??"").trim()}catch{return t}if(!n)return t;const a=Me(Re());if(Fr(t,a))return b(e,{connected:!1,lastError:""});const r=Xr(t,a),i=ct(r);return t.connected&&!Object.keys(r).length&&!t.lastError?t:!t.connected||qs(a)?b(e,i):b(e,ct())}async function b(e,t){const n=await $e(e),a=dt({...n,...t});return await rt(e,st,a),a}function rd(e){return e.connected?e.autoEnabled?typeof navigator<"u"&&navigator.onLine===!1?"offline":os(e)?"":"not_due":"auto_disabled":e.lastError?"connect_restore_failed":"not_connected"}async function $e(e){j(e);const t=await Jn(e,st),n=dt(t);return Vs(e,n)}async function Br(e,t={}){j(e);const n=!!t.allowInteractive,a=await $e(e),r=await nd(e,a),i=String(r.accountEmail||a.accountEmail||"").trim(),o=Zs(r)||td(r,t);if(!n||!o)return r;if(r.connected)try{return await Ce({interactive:!1,preferredEmail:i,requireRefreshToken:!0}),r}catch{}try{const s=await Mr(i);return b(e,ct({accountEmail:s.email,accountName:s.name,accountImageUrl:s.imageUrl}))}catch(s){const c=String(s?.message??s??"").trim();return b(e,{lastError:c||C("settings_auto_backup.error.google_connect_failed")})}}async function nc(e,t={}){return j(e),b(e,t)}async function rc(e){j(e),en();const t=await $e(e),n=await Mr(t.accountEmail);return b(e,zs(t,n))}async function ac(e){j(e);try{await wo()}catch(t){console.warn("[google-backup] sign out failed",t)}return b(e,{connected:!1,autoEnabled:!1,accountEmail:"",accountName:"",accountImageUrl:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:"",lastError:""})}async function xr(e,t={}){j(e),en();const n=t?.interactiveAuth!==!1,a=()=>ur({interactive:n,requireRefreshToken:!0});if(!(await $e(e)).connected)throw new Error(C("settings_auto_backup.error.google.connect_required"));const i=await Ce({interactive:n,requireRefreshToken:!0}),o=await pr(),s=JSON.stringify(o,null,2),c=new Date().toISOString(),d=await ls({accessToken:i,reauth:a,filename:Fe,jsonText:s}),E=await b(e,{lastBackupFilename:d.filename||Fe,lastBackupAt:d.modifiedTime||c,lastBackupStatus:"ok",lastError:""});return{filename:E.lastBackupFilename||Fe,lastBackupAt:E.lastBackupAt||c}}async function ic(e,t={}){j(e);const n=gt();if(n&&typeof n.restorePreferred=="function")return n.restorePreferred({ledgerId:e,options:t});const{accessToken:a,reauthHandler:r}=await Lt(e,t),i=await Rr({accessToken:a,reauth:r}),o=$s(i);if(!o?.id)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const s=await br({accessToken:a,reauth:r,fileId:o.id});return{filename:String(o.name??""),modifiedTime:String(o.modifiedTime??""),fileId:String(o.id??""),revisionId:"",jsonText:s}}async function oc(e,t={}){j(e);const n=gt();if(n&&typeof n.listFiles=="function"){const o=await n.listFiles({ledgerId:e,options:t});return(Array.isArray(o)?o:[]).map(s=>{const c=An(s);return{...c,kind:String(s?.kind??On(c.name))}})}const{accessToken:a,reauthHandler:r}=await Lt(e,t);return(await Rr({accessToken:a,reauth:r})).map(o=>{const s=An(o);return{...s,kind:On(s.name)}})}async function sc(e,t,n={}){j(e);const a=String(t??"").trim();if(!a)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const r=gt();if(r&&typeof r.listRevisions=="function"){const s=await r.listRevisions({ledgerId:e,fileId:a,options:n});return Array.isArray(s)?s:[]}const{accessToken:i,reauthHandler:o}=await Lt(e,n);return Ts({accessToken:i,reauth:o,fileId:a})}async function ad(e,t={},n={}){j(e);const a=String(t?.fileId??"").trim(),r=String(t?.revisionId??"").trim();if(!a)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const i=gt();if(i&&typeof i.download=="function"){const d=await i.download({ledgerId:e,fileId:a,revisionId:r,options:n});return{fileId:a,revisionId:r,filename:String(d?.filename??t?.filename??""),modifiedTime:String(d?.modifiedTime??t?.modifiedTime??""),jsonText:String(d?.jsonText??"")}}const{accessToken:o,reauthHandler:s}=await Lt(e,n),c=await br({accessToken:o,reauth:s,fileId:a,revisionId:r||void 0});return{fileId:a,revisionId:r,filename:String(t?.filename??""),modifiedTime:String(t?.modifiedTime??""),jsonText:c}}async function id(e,t={},n={}){const a=await ad(e,t,n),r=yr(a.jsonText);let i=Xe(null),o="";try{const c=await pr();i=Xe(c),o=String(c?.exported_at??"").trim()}catch(c){console.warn("[google-backup] local summary failed",c)}const s=fs(r,i,{remoteModifiedAt:a.modifiedTime||r.exportedAt,localModifiedAt:o||i.exportedAt});return{...a,remoteSummary:r,localSummary:i,comparison:s}}async function dc(e,t={},n={}){const a=await id(e,t,n);if(!a.jsonText)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));return Qt(a.jsonText),{filename:a.filename,modifiedTime:a.modifiedTime,fileId:a.fileId,revisionId:a.revisionId,jsonText:a.jsonText,remoteSummary:a.remoteSummary,localSummary:a.localSummary,comparison:a.comparison}}async function cc(e){j(e);const t=new Date().toISOString();if(!A.isNativePlatform())return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await Br(e),a=rd(n);if(a){const r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}try{const r=Re();return r?.email&&!n.accountEmail&&await b(e,{accountEmail:r.email,accountName:r.name||"",accountImageUrl:r.imageUrl||""}),await xr(e,{interactiveAuth:!1}),await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"backup_completed"}),{status:"completed",skipped:!1,reason:"backup_completed",checkedAt:t}}catch(r){const i=String(r?.code??"")==="GOOGLE_REAUTH_REQUIRED",o=String(r?.message??r??"").trim(),s=o?C("settings_auto_backup.error.detail_suffix",{detail:o}):"";return await b(e,{lastBackupStatus:"error",lastError:i?C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:s}):o||C("settings_auto_backup.error.google.auto_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:i?"reauth_required":"backup_failed",...i?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:i?"reauth_required":"backup_failed",checkedAt:t}}}async function _c(e){j(e);const t=new Date().toISOString();if(!A.isNativePlatform())return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await Br(e);if(!n.connected||!n.autoEnabled||!n.dataChangeAutoEnabled){const a=n.connected?n.autoEnabled?"data_change_disabled":"auto_disabled":n.lastError?"connect_restore_failed":"not_connected",r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}if(typeof navigator<"u"&&navigator.onLine===!1)return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"offline"}),{status:"skipped",skipped:!0,reason:"offline",checkedAt:t};try{const a=Re();return a?.email&&!n.accountEmail&&await b(e,{accountEmail:a.email,accountName:a.name||"",accountImageUrl:a.imageUrl||""}),await xr(e,{interactiveAuth:!1}),await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"data_change_backup_completed"}),{status:"completed",skipped:!1,reason:"data_change_backup_completed",checkedAt:t}}catch(a){const r=String(a?.code??"")==="GOOGLE_REAUTH_REQUIRED",i=String(a?.message??a??"").trim(),o=i?C("settings_auto_backup.error.detail_suffix",{detail:i}):"";return await b(e,{lastBackupStatus:"error",lastError:r?C("settings_auto_backup.error.google.data_change_backup_reauth_required",{detailSuffix:o}):i||C("settings_auto_backup.error.google.data_change_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:r?"reauth_required":"backup_failed",...r?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:r?"reauth_required":"backup_failed",checkedAt:t}}}const Sn="https://accounts.google.com/gsi/client",ye=Qn(),Gr=yn("GoogleIdentity");let ke=null;function X(e,t="google_identity_error"){const n=new Error(String(e??"").trim()||"Google identity error");return n.code=t,n}function _t(){return globalThis.google?.accounts?.id??null}function qe(){return A.getPlatform()==="web"}function Ec(){return ye?qe()?!0:A.isNativePlatform()&&A.getPlatform()==="android":!1}function uc(){return ye?qe()||A.isNativePlatform()&&A.getPlatform()==="android"?"":A.isNativePlatform()?"目前僅支援 Android App 的 Google 登入":ht():ht()}async function od(){if(!qe())throw X("Web GIS 僅支援瀏覽器環境","google_identity_web_only");return ke||(ke=new Promise((e,t)=>{const n=document.querySelector(`script[src="${Sn}"]`);if(n){n.addEventListener("load",()=>e(),{once:!0}),n.addEventListener("error",()=>t(X("Google Identity Services 載入失敗","google_gis_load_failed")),{once:!0}),_t()&&e();return}const a=document.createElement("script");a.src=Sn,a.async=!0,a.defer=!0,a.onload=()=>e(),a.onerror=()=>t(X("Google Identity Services 載入失敗","google_gis_load_failed")),document.head.appendChild(a)}).finally(()=>{_t()||(ke=null)}),ke)}function sd(e){const t=String(e?.message??e??"").trim()||"Google 登入失敗",n=String(e?.code??"").trim();return X(t,n||"google_identity_native_failed")}async function lc({nonce:e}={}){if(!A.isNativePlatform()||A.getPlatform()!=="android")throw X("Credential Manager 僅支援 Android App","google_identity_android_only");if(!ye)throw X("缺少 Google Web Client ID","google_client_id_missing");if(!e)throw X("缺少 Google nonce","google_nonce_required");try{const t=await Gr.signIn({serverClientId:ye,nonce:String(e).trim(),filterByAuthorizedAccounts:!1});return{idToken:String(t?.idToken??"").trim(),displayName:String(t?.displayName??"").trim(),email:String(t?.email??"").trim(),avatarUrl:String(t?.avatarUrl??"").trim()}}catch(t){throw sd(t)}}async function Tc(e,{nonce:t,text:n="signin_with",theme:a="outline",shape:r="pill",size:i="large",width:o=280,onCredential:s=null,onError:c=null}={}){if(!e)throw X("缺少 Google 按鈕容器","google_button_container_missing");if(!qe())throw X("Google GIS 按鈕僅支援 Web","google_identity_web_only");if(!ye)throw X("缺少 Google Web Client ID","google_client_id_missing");if(!t)throw X("缺少 Google nonce","google_nonce_required");await od();const d=_t();if(!d)throw X("Google Identity Services 尚未就緒","google_gis_not_ready");e.innerHTML="",d.initialize({client_id:ye,nonce:String(t).trim(),ux_mode:"popup",cancel_on_tap_outside:!0,callback:E=>{const u=String(E?.credential??"").trim();if(!u){const T=X("Google 未回傳 ID token","google_id_token_missing");typeof c=="function"&&c(T);return}typeof s=="function"&&s({idToken:u,selectBy:String(E?.select_by??"").trim()})},error_callback:E=>{typeof c=="function"&&c(X(String(E?.type??"Google 登入失敗"),"google_gis_error"))}}),d.renderButton(e,{type:"standard",theme:a,text:n,shape:r,size:i,logo_alignment:"left",width:o})}async function mc(){if(qe()){_t()?.disableAutoSelect?.();return}if(A.isNativePlatform()&&A.getPlatform()==="android")try{await Gr.clearCredentialState()}catch{}}export{Jd as $,Nd as A,wt as B,Ce as C,zn as D,ri as E,At as F,Zi as G,Or as H,pr as I,os as J,_c as K,Bi as L,cc as M,xr as N,js as O,vs as P,Ps as Q,Xs as R,Ms as S,Yn as T,vd as U,Ad as V,ra as W,na as X,ki as Y,Qd as Z,Zd as _,Vi as a,Od as a$,Vd as a0,lr as a1,Di as a2,kt as a3,Rr as a4,ls as a5,br as a6,Re as a7,ur as a8,gd as a9,Md as aA,Pd as aB,ld as aC,vi as aD,$i as aE,Ri as aF,Ht as aG,Qt as aH,Ys as aI,mt as aJ,Hs as aK,Td as aL,oc as aM,id as aN,ec as aO,sc as aP,vr as aQ,tc as aR,dc as aS,kr as aT,zd as aU,rc as aV,ac as aW,nc as aX,$e as aY,ic as aZ,xd as a_,md as aa,Qi as ab,eo as ac,Si as ad,Br as ae,Kd as af,Jo as ag,qd as ah,Hd as ai,ns as aj,Yd as ak,Bd as al,$d as am,jd as an,bd as ao,lc as ap,mc as aq,Tc as ar,Ec as as,uc as at,pd as au,Lr as av,Wd as aw,Gd as ax,Xd as ay,Fd as az,Dd as b,yd as b0,Sd as c,to as d,Id as e,Ji as f,Jn as g,Pe as h,Hn as i,ro as j,ao as k,ud as l,Rd as m,Vn as n,hd as o,kd as p,W as q,Et as r,rt as s,Ud as t,Cd as u,wd as v,zi as w,Ld as x,Xi as y,fd as z};
