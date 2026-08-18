const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/wear-sync-epoch.service-CjOapVHP.js","assets/vendor-sqlite-DKEMZiEb.js","assets/app-membership-DA28kzVh.js","assets/app-i18n-DMQMgWtW.js","assets/vendor-CkjNk_C8.js"])))=>i.map(i=>d[i]);
import{C as A,S as An,d as jr,_ as On,a as Sn,r as Rn,D as tn,F as Kr}from"./vendor-sqlite-DKEMZiEb.js";import{a as Hr,g as nn}from"./app-membership-DA28kzVh.js";import{t as bn}from"./app-i18n-DMQMgWtW.js";import{S as Oe}from"./vendor-CkjNk_C8.js";const Yr="straw.recovery_backup.v1",se="backups",Wr=1,rn=40,te=Object.freeze({INDEXEDDB:"indexeddb",FILESYSTEM:"filesystem",TEST:"test"}),$r=new Set(Object.values(te));function qr(){return typeof indexedDB>"u"||!indexedDB?null:new Promise((e,t)=>{const n=indexedDB.open(Yr,Wr);n.onerror=()=>t(n.error||new Error("indexedDB open failed")),n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(se)||a.createObjectStore(se,{keyPath:"backupId"})},n.onsuccess=()=>e(n.result)})}async function Ft(e){const t=await qr();if(!t)return null;try{return await e(t)}finally{try{t.close()}catch{}}}async function zr(e){return await Ft(async n=>(await new Promise((a,r)=>{const i=n.transaction(se,"readwrite");i.oncomplete=()=>a(),i.onerror=()=>r(i.error||new Error("indexedDB put failed")),i.objectStore(se).put(e)}),!0)).catch(()=>!1)===!0}async function yn(e){return Ft(async t=>new Promise((n,a)=>{const r=t.transaction(se,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB get failed"));const i=r.objectStore(se).get(e);i.onsuccess=()=>n(i.result||null),i.onerror=()=>a(i.error||new Error("indexedDB get failed"))})).catch(()=>null)}async function Vr(){const e=await Ft(async t=>new Promise((n,a)=>{const r=t.transaction(se,"readonly");r.onerror=()=>a(r.error||new Error("indexedDB getAll failed"));const i=r.objectStore(se).getAll();i.onsuccess=()=>n(Array.isArray(i.result)?i.result:[]),i.onerror=()=>a(i.error||new Error("indexedDB getAll failed"))})).catch(()=>null);return Array.isArray(e)?e:[]}function Jr(e){return`recovery_${String(e).replace(/[^\w.-]+/g,"_").slice(0,40)||"wipe"}_${Date.now()}_${Math.random().toString(36).slice(2,10)}`}function Dn(e){return typeof TextEncoder<"u"?new TextEncoder().encode(e).byteLength:String(e||"").length}function Qr(e,t){if(!e||typeof e!="object")return null;const n=String(e.backupId||"").trim(),a=Number(e.byteLength)||0;return!n||!(a>0)?null:{backupId:n,purpose:String(e.purpose||"").trim(),at:String(e.at||"").trim(),byteLength:a,filename:String(e.filename||"").trim(),source:String(e.source||"").trim(),storage:String(t||e.storage||te.INDEXEDDB).trim(),hasPayload:!!e.jsonText}}function In(e){if(!e||typeof e!="object"||e.verified!==!0||!(Number(e.byteLength)>0)||!String(e.backupId||"").trim())return!1;const t=String(e.storage||"").trim();return!!$r.has(t)}async function Zr(e={}){const t=String(e.purpose||"wipe").trim()||"wipe",n=e.data;if(!n||typeof n!="object")throw new Error("recovery backup export payload missing");let a="";try{a=JSON.stringify(n)}catch(c){throw new Error(`recovery backup serialize failed: ${c?.message||c}`)}const r=Dn(a);if(!(r>2))throw new Error("recovery backup payload empty");const i=Jr(t),o=new Date().toISOString(),s={backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,source:String(e.source||"").trim(),filename:String(e.filename||"").trim()};if(await zr(s)){const c=await yn(i);if(c?.backupId===i&&Number(c.byteLength)>0&&c.jsonText)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:te.INDEXEDDB,filename:s.filename}}if(typeof e.persistToFilesystem=="function")try{const c=await e.persistToFilesystem({backupId:i,purpose:t,at:o,byteLength:r,jsonText:a,filename:s.filename,data:n});if(c?.verified===!0&&String(c.backupId||i)===i&&Number(c.byteLength||r)>0&&String(c.storage||"")===te.FILESYSTEM)return{verified:!0,backupId:i,purpose:t,at:o,byteLength:r,storage:te.FILESYSTEM,filename:s.filename,location:String(c.location||"").trim()}}catch{}throw new Error("recovery backup durable persist failed (memory is not durable proof)")}async function ea(e){const t=String(e||"").trim();return t?yn(t):null}async function ec(e={}){const t=Math.max(1,Math.min(rn,Number(e.limit)||rn));let n=[];return n=await Vr(),(Array.isArray(n)?n:[]).map(r=>Qr(r,r?.storage||te.INDEXEDDB)).filter(Boolean).sort((r,i)=>String(i.at).localeCompare(String(r.at))).slice(0,t)}async function tc(e){const t=await ea(e),n=String(t?.jsonText||"");if(!t?.backupId||!(Number(t.byteLength)>0)||!n)throw new Error("recovery backup record missing or empty");return{backupId:t.backupId,purpose:String(t.purpose||""),at:String(t.at||""),byteLength:Number(t.byteLength)||Dn(n),filename:String(t.filename||`${t.backupId}.json`),jsonText:n}}async function nc(e={}){const t=e.exportAllLedgersJson;if(typeof t!="function")throw new Error("recovery backup exporter missing");const n=String(e.purpose||"wipe").trim()||"wipe",a=String(e.filename||"").trim()||`strawmoneybook-recovery-before-${n}-${new Date().toISOString().replace(/[:.]/g,"-")}.json`,r=await t();let i=e.persistToFilesystem;!i&&typeof e.saveJsonFileToDevice=="function"&&(i=async({filename:s,data:d,backupId:c,byteLength:E})=>{const u=await e.saveJsonFileToDevice(s,d,{category:e.category||"recovery"});return u?.saved&&u.location?{verified:!0,backupId:c,byteLength:E,storage:te.FILESYSTEM,location:u.location}:null});const o=await Zr({purpose:n,data:r,source:e.source,filename:a,persistToFilesystem:i});if(typeof e.saveJsonFileToDevice=="function"&&o.storage!==te.FILESYSTEM)try{const s=await e.saveJsonFileToDevice(a,r,{category:e.category||"recovery"});!(s?.saved&&s.location)&&typeof e.downloadJsonFile=="function"&&e.downloadJsonFile(a,r),s?.saved&&s.location&&typeof e.onDeviceSaved=="function"&&e.onDeviceSaved(s)}catch{if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}}else if(o.storage===te.FILESYSTEM&&typeof e.onDeviceSaved=="function")e.onDeviceSaved({saved:!0,location:o.location});else if(typeof e.downloadJsonFile=="function")try{e.downloadJsonFile(a,r)}catch{}if(!In(o))throw new Error("recovery backup proof invalid after persist");return o}const ta=`PRAGMA foreign_keys = ON;

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
`,na=`ALTER TABLE transactions ADD COLUMN is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (is_reimbursable IN (0,1));
ALTER TABLE transactions ADD COLUMN reimbursement_state TEXT NOT NULL DEFAULT 'none' CHECK (reimbursement_state IN ('none','pending','reimbursed'));
ALTER TABLE transactions ADD COLUMN reimbursed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_tx_reimbursement_state ON transactions(ledger_id, is_reimbursable, reimbursement_state, occurred_at DESC);
`,ra=`ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (include_in_budget IN (0,1));
ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (include_in_analysis IN (0,1));

UPDATE transactions
SET include_in_budget = COALESCE(include_in_budget, 1),
    include_in_analysis = COALESCE(include_in_analysis, 1);

UPDATE transactions
SET include_in_budget = 0,
    include_in_analysis = 0
WHERE origin_type = 'reimbursement';
`,aa=`ALTER TABLE accounts ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-wallet';

ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT 'fa-solid fa-tag';
`,ia=`UPDATE accounts
SET icon = 'fa-solid fa-wallet'
WHERE icon IS NULL OR TRIM(icon) = '';

UPDATE categories
SET icon = CASE
  WHEN name LIKE '%飲食%' THEN 'fa-solid fa-utensils'
  WHEN kind = 'income' THEN 'fa-solid fa-sack-dollar'
  ELSE 'fa-solid fa-tag'
END
WHERE icon IS NULL OR TRIM(icon) = '';
`,oa=`ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

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
`,sa=`-- Remove legacy sample transaction "飲食 300" if it is the only transaction in the ledger.
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
`,ca=`CREATE TABLE IF NOT EXISTS bank_connections (
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
`,da=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
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
`,_a=`ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1 CHECK (include_in_assets IN (0,1));

UPDATE accounts
SET include_in_assets = COALESCE(include_in_assets, 1);
`,Ea=`CREATE TABLE IF NOT EXISTS reimbursement_advances (
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
`,ua=`ALTER TABLE reimbursement_items
  ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense'
  CHECK (entry_type IN ('expense', 'income'));
`,la=`ALTER TABLE budget_items
  ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed'
  CHECK (amount_mode IN ('fixed', 'daily_average'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none'
  CHECK (day_rule_unit IN ('none', 'weekday', 'monthday'));

ALTER TABLE budget_items
  ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';
`,Ta=`ALTER TABLE reimbursement_advances
  ADD COLUMN category_id TEXT;

CREATE INDEX IF NOT EXISTS idx_reimbursement_advances_category
  ON reimbursement_advances(ledger_id, category_id, received_at DESC);
`,ma=`CREATE TABLE IF NOT EXISTS savings_jars (
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
`,ga=`ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;
`,La=`ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';
ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;
`,Na=`CREATE INDEX IF NOT EXISTS idx_deleted_log_lookup
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
`,pa=`ALTER TABLE bank_transactions ADD COLUMN transaction_type TEXT;
ALTER TABLE bank_transactions ADD COLUMN note TEXT;
ALTER TABLE bank_transactions ADD COLUMN summary TEXT;
ALTER TABLE bank_transactions ADD COLUMN balance_minor INTEGER;
`,fa=`ALTER TABLE reimbursement_items RENAME TO reimbursement_items__old_source_type;

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
`,Aa=`ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;
ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;
ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_savings_jars_auto_save
  ON savings_jars(ledger_id, auto_save_paused, updated_at DESC);
`,Oa=`ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;
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
`,Sa=`-- smb296: rebuild transactions under PRAGMA foreign_keys=ON.
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
`,Ra=`ALTER TABLE reimbursement_advances ADD COLUMN return_amount_minor INTEGER;
`,ba=`ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1 CHECK (include_in_group_statistics IN (0,1));

UPDATE accounts
SET include_in_group_statistics = COALESCE(include_in_group_statistics, 1);
`,ya=`DROP TABLE IF EXISTS invoice_carrier_invoices;

DROP TABLE IF EXISTS invoice_carrier_connections;

DELETE FROM app_settings
WHERE key LIKE 'invoice_carrier.%'
   OR key LIKE 'einvoice.%';
`,Da=`CREATE TABLE IF NOT EXISTS einvoice_credentials (
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
`,Ia=`ALTER TABLE einvoice_credentials ADD COLUMN password_iv TEXT NOT NULL DEFAULT '';
`,Ca=`CREATE TABLE IF NOT EXISTS budget_containers (
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
`,Ua=`ALTER TABLE categories ADD COLUMN default_include_in_analysis INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_analysis IN (0,1));
ALTER TABLE categories ADD COLUMN default_include_in_budget INTEGER NOT NULL DEFAULT 1 CHECK (default_include_in_budget IN (0,1));
ALTER TABLE categories ADD COLUMN default_is_reimbursable INTEGER NOT NULL DEFAULT 0 CHECK (default_is_reimbursable IN (0,1));
`,ha=`ALTER TABLE transactions ADD COLUMN reimburse_target_minor INTEGER;
`,wa=`CREATE TABLE IF NOT EXISTS einvoice_sync_config (
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
`,ka=`ALTER TABLE budget_containers ADD COLUMN period_mode TEXT NOT NULL DEFAULT 'monthly';
`,va=`ALTER TABLE ledgers ADD COLUMN budget_period_mode TEXT NOT NULL DEFAULT 'calendar_month';
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
`,Xa=`-- SMB-277: per-transaction editor attribution for shared ledgers
ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;
ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;
`,Fa=`CREATE TABLE IF NOT EXISTS securities (
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
`,Ma=`-- smb300 securities v2 P1: settlement portfolio, settle_at / status, funds mode fields.
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
`,xa=`-- smb301 credit card system P0 (v1.1 hard contracts)
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
`,Ba=`-- Sell against a specific buy lot (1:1). Remaining qty/principal are derived.
PRAGMA foreign_keys = ON;

ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;

CREATE INDEX IF NOT EXISTS idx_security_transactions_source_buy
  ON security_transactions(ledger_id, source_buy_tx_id, deleted_at);
`,Ga=`-- Wear OS Stage A: origin_type=wear CHECK, durable wear_applied identity, syncEpoch.
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
`,Pa=`-- Migration 046 — bank sync Architecture B account checkpoints
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
`;function ja(e){const t=[];let n="",a="",r="",i=!1,o=!1,s=!1,d=!1,c="";const E=()=>{if(!a)return;const T=a.toUpperCase();T==="TRIGGER"&&n.toUpperCase().includes("CREATE")&&(i=!0),r=T,a=""},u=()=>{const T=n.trim();T&&t.push(T),n="",a="",r="",i=!1,o=!1,s=!1,d=!1,c=""};for(let T=0;T<e.length;T+=1){const m=e[T],L=e[T+1];if(o){m===`
`?(s||(n+=m),o=!1,s=!1):s||(n+=m);continue}if(d){n+=m,m==="*"&&L==="/"&&(n+=L,T+=1,d=!1);continue}if(c){n+=m,m===c&&(c==="'"&&L==="'"?(n+=L,T+=1):c="");continue}if(m==="-"&&L==="-"){n+=m,n+=L,T+=1,E(),o=!0,s=!1;continue}if(m==="#"){E(),o=!0,s=!0;continue}if(m==="/"&&L==="*"){n+=m,n+=L,T+=1,E(),d=!0;continue}if(n+=m,m==="'"||m==='"'||m==="`"){E(),c=m;continue}/[A-Za-z0-9_]/.test(m)?a+=m:E(),m===";"&&(!i||r==="END")&&u()}return E(),u(),t}function Cn(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("duplicate column name")||t.includes("already exists")||t.includes("duplicate index name")}function Ka(e){return ja(e).map(t=>({statement:t,values:[]}))}async function Ha(e,t){const n=Ka(t);for(const a of n)try{await e.executeSet([a])}catch(r){if(!Cn(r))throw r}}const Ya="APP_DOWNGRADE_BLOCKED",Un="data_floor_app_version",hn="data_floor_schema_version",Mt="straw.data_floor.v1";function wn(){return String(Hr?.version).trim()}function an(e){const t=String(e??"").trim().replace(/^v/i,"").match(/\d+/g);return t?.length?t.map(n=>Number.parseInt(String(n),10)).map(n=>Number.isFinite(n)?Math.max(0,n):0):[]}function Dt(e,t){const n=an(e),a=an(t),r=Math.max(n.length,a.length,3);for(let i=0;i<r;i+=1){const o=Number(n[i]??0),s=Number(a[i]??0);if(o>s)return 1;if(o<s)return-1}return 0}function Wa(e={}){const t=String(e.reason??"unknown").trim()||"unknown",n=String(e.floorAppVersion??"").trim(),a=String(e.currentAppVersion??"").trim(),r=Number(e.floorSchemaVersion??0),i=Number(e.knownSchemaMax??0);let o="偵測到本機資料曾由較新版本寫入。為避免資料回損，已阻止此舊版開啟帳本。請改安裝相同或更新的版本。";t==="schema_ahead"?o=`本機資料庫 schema（${r}）高於此 App 支援上限（${i}）。為避免資料回損，已阻止開啟。請改安裝較新版本。`:t==="app_version_ahead"&&n&&a&&(o=`本機資料曾由 App ${n} 寫入，目前版本為 ${a}。為避免資料回損，已阻止開啟。請改安裝 ${n} 或更新版本。`);const s=new Error(o);return s.code=Ya,s.i18nKey="app.downgrade_blocked",s.reason=t,s.floorAppVersion=n||null,s.currentAppVersion=a||null,s.floorSchemaVersion=Number.isFinite(r)?r:null,s.knownSchemaMax=Number.isFinite(i)?i:null,s.recoverable=!1,s.silentWipeBlocked=!0,s}function xt(){try{return globalThis.localStorage??null}catch{return null}}function kn(){const e=xt();if(!e)return{appVersion:"",schemaVersion:0};try{const t=e.getItem(Mt);if(!t)return{appVersion:"",schemaVersion:0};const n=JSON.parse(t);return{appVersion:String(n?.appVersion??"").trim(),schemaVersion:Number.parseInt(String(n?.schemaVersion??"0"),10)||0}}catch{return{appVersion:"",schemaVersion:0}}}function $a({appVersion:e,schemaVersion:t}={}){const n=xt();if(!n)return;const a=String(e??"").trim(),r=Number.parseInt(String(t??"0"),10)||0,i=kn(),o=a&&(!i.appVersion||Dt(a,i.appVersion)>0)?a:i.appVersion,s=Math.max(i.schemaVersion||0,r||0);try{n.setItem(Mt,JSON.stringify({appVersion:o,schemaVersion:s,updatedAt:new Date().toISOString()}))}catch{}}function qa(){const e=xt();if(e)try{e.removeItem(Mt)}catch{}}function za({knownSchemaMax:e,dbMaxSchemaVersion:t=0,floorSchemaVersion:n=0,prefsSchemaVersion:a=0,floorAppVersion:r="",prefsAppVersion:i="",currentAppVersion:o=""}={}){const s=Number(e??0)||0,d=Number(t??0)||0,c=Math.max(Number(n??0)||0,Number(a??0)||0,d);if(s>0&&c>s)return{reason:"schema_ahead",floorSchemaVersion:c,knownSchemaMax:s,currentAppVersion:o,floorAppVersion:r||i||""};const E=(()=>{const T=String(r??"").trim(),m=String(i??"").trim();return T&&m?Dt(T,m)>=0?T:m:T||m})(),u=String(o??"").trim();return E&&u&&Dt(u,E)<0?{reason:"app_version_ahead",floorAppVersion:E,currentAppVersion:u,floorSchemaVersion:c,knownSchemaMax:s}:null}function Va(e={}){const t=za(e);if(t)throw Wa(t)}const vn=[{version:1,name:"init_schema",sql:ta},{version:2,name:"transaction_reimbursement_flags",sql:na},{version:3,name:"transaction_budget_analysis_flags",sql:ra},{version:4,name:"account_category_icons",sql:aa},{version:5,name:"default_icons_backfill",sql:ia},{version:6,name:"ledger_sort_order",sql:oa},{version:7,name:"remove_default_sample_transaction",sql:sa},{version:8,name:"bank_sync",sql:ca},{version:9,name:"allow_zero_amount_transaction",sql:da},{version:10,name:"account_include_in_assets",sql:_a},{version:11,name:"reimbursement_advances",sql:Ea},{version:12,name:"reimbursement_item_entry_type",sql:ua},{version:13,name:"budget_item_daily_rules",sql:la},{version:14,name:"reimbursement_advance_category",sql:Ta},{version:15,name:"savings_jars",sql:ma},{version:16,name:"loan_payment_interest_tx",sql:ga},{version:17,name:"account_credit_profile",sql:La},{version:18,name:"shared_sync_deleted_log",sql:Na},{version:19,name:"bank_transaction_metadata",sql:pa},{version:23,name:"reimbursement_item_advance_source",sql:fa},{version:24,name:"savings_jars_auto_save",sql:Aa},{version:25,name:"budget_save",sql:Oa},{version:26,name:"transaction_origin_type_refund",sql:Sa},{version:28,name:"advance_return_amount",sql:Ra},{version:30,name:"account_group_statistics",sql:ba},{version:31,name:"remove_invoice_carrier",sql:ya},{version:32,name:"einvoice_import",sql:Da},{version:33,name:"einvoice_credential_password_iv",sql:Ia},{version:34,name:"budget_containers",sql:Ca},{version:35,name:"category_default_flags",sql:Ua},{version:36,name:"transaction_reimburse_target",sql:ha},{version:37,name:"einvoice_carrier_sync",sql:wa},{version:38,name:"budget_container_period_mode",sql:ka},{version:39,name:"budget_pay_cycle",sql:va},{version:40,name:"transaction_editor_attribution",sql:Xa},{version:41,name:"securities",sql:Fa},{version:42,name:"securities_settlement_v2",sql:Ma},{version:43,name:"credit_card_system_p0",sql:xa},{version:44,name:"security_sell_source_buy",sql:Ba},{version:45,name:"wear_companion",sql:Ga},{version:46,name:"bank_sync_account_checkpoints",sql:Pa}];function Xn(){return vn.reduce((e,t)=>Math.max(e,Number(t.version)||0),0)}const on="legacy_schema_patched_v1",Ja={ledgers:["ALTER TABLE ledgers ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE ledgers ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Taipei';","ALTER TABLE ledgers ADD COLUMN color TEXT;","ALTER TABLE ledgers ADD COLUMN icon TEXT;","ALTER TABLE ledgers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE ledgers ADD COLUMN created_at TEXT;","ALTER TABLE ledgers ADD COLUMN updated_at TEXT;","ALTER TABLE ledgers ADD COLUMN deleted_at TEXT;"],account_groups:["ALTER TABLE account_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE account_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE account_groups ADD COLUMN created_at TEXT;","ALTER TABLE account_groups ADD COLUMN updated_at TEXT;"],accounts:["ALTER TABLE accounts ADD COLUMN group_id TEXT;","ALTER TABLE accounts ADD COLUMN account_type TEXT NOT NULL DEFAULT 'asset';","ALTER TABLE accounts ADD COLUMN account_kind TEXT NOT NULL DEFAULT 'cash';","ALTER TABLE accounts ADD COLUMN allow_negative INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN include_in_assets INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN include_in_group_statistics INTEGER NOT NULL DEFAULT 1;","ALTER TABLE accounts ADD COLUMN opening_balance_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'TWD';","ALTER TABLE accounts ADD COLUMN icon TEXT;","ALTER TABLE accounts ADD COLUMN credit_limit_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN repayment_reminder_day INTEGER;","ALTER TABLE accounts ADD COLUMN statement_close_day INTEGER;","ALTER TABLE accounts ADD COLUMN payment_due_day INTEGER;","ALTER TABLE accounts ADD COLUMN card_last4 TEXT;","ALTER TABLE accounts ADD COLUMN issuer TEXT;","ALTER TABLE accounts ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE accounts ADD COLUMN deleted_at TEXT;","ALTER TABLE accounts ADD COLUMN created_at TEXT;","ALTER TABLE accounts ADD COLUMN updated_at TEXT;"],category_groups:["ALTER TABLE category_groups ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE category_groups ADD COLUMN deleted_at TEXT;","ALTER TABLE category_groups ADD COLUMN created_at TEXT;","ALTER TABLE category_groups ADD COLUMN updated_at TEXT;"],categories:["ALTER TABLE categories ADD COLUMN group_id TEXT;","ALTER TABLE categories ADD COLUMN kind TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE categories ADD COLUMN icon TEXT;","ALTER TABLE categories ADD COLUMN is_budgetable INTEGER NOT NULL DEFAULT 1;","ALTER TABLE categories ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE categories ADD COLUMN deleted_at TEXT;","ALTER TABLE categories ADD COLUMN created_at TEXT;","ALTER TABLE categories ADD COLUMN updated_at TEXT;"],transactions:["ALTER TABLE transactions ADD COLUMN type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE transactions ADD COLUMN transfer_group_id TEXT;","ALTER TABLE transactions ADD COLUMN account_id TEXT;","ALTER TABLE transactions ADD COLUMN peer_account_id TEXT;","ALTER TABLE transactions ADD COLUMN category_id TEXT;","ALTER TABLE transactions ADD COLUMN amount_minor INTEGER;","ALTER TABLE transactions ADD COLUMN occurred_at TEXT;","ALTER TABLE transactions ADD COLUMN posted_at TEXT;","ALTER TABLE transactions ADD COLUMN note TEXT;","ALTER TABLE transactions ADD COLUMN location TEXT;","ALTER TABLE transactions ADD COLUMN tags_json TEXT;","ALTER TABLE transactions ADD COLUMN origin_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE transactions ADD COLUMN external_ref_id TEXT;","ALTER TABLE transactions ADD COLUMN idempotency_key TEXT;","ALTER TABLE transactions ADD COLUMN include_in_budget INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN include_in_analysis INTEGER NOT NULL DEFAULT 1;","ALTER TABLE transactions ADD COLUMN deleted_at TEXT;","ALTER TABLE transactions ADD COLUMN created_at TEXT;","ALTER TABLE transactions ADD COLUMN updated_at TEXT;","ALTER TABLE transactions ADD COLUMN created_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN created_by_display_name TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_user_id TEXT;","ALTER TABLE transactions ADD COLUMN updated_by_display_name TEXT;"],transaction_attachments:["ALTER TABLE transaction_attachments ADD COLUMN file_uri TEXT;","ALTER TABLE transaction_attachments ADD COLUMN mime_type TEXT;","ALTER TABLE transaction_attachments ADD COLUMN file_size INTEGER;","ALTER TABLE transaction_attachments ADD COLUMN checksum TEXT;","ALTER TABLE transaction_attachments ADD COLUMN created_at TEXT;"],counterparties:["ALTER TABLE counterparties ADD COLUMN contact_json TEXT;","ALTER TABLE counterparties ADD COLUMN note TEXT;","ALTER TABLE counterparties ADD COLUMN is_archived INTEGER NOT NULL DEFAULT 0;","ALTER TABLE counterparties ADD COLUMN created_at TEXT;","ALTER TABLE counterparties ADD COLUMN updated_at TEXT;"],loans:["ALTER TABLE loans ADD COLUMN counterparty_id TEXT;","ALTER TABLE loans ADD COLUMN direction TEXT NOT NULL DEFAULT 'lend';","ALTER TABLE loans ADD COLUMN principal_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE loans ADD COLUMN interest_rule_json TEXT;","ALTER TABLE loans ADD COLUMN start_date TEXT;","ALTER TABLE loans ADD COLUMN due_date TEXT;","ALTER TABLE loans ADD COLUMN status TEXT NOT NULL DEFAULT 'active';","ALTER TABLE loans ADD COLUMN settled_at TEXT;","ALTER TABLE loans ADD COLUMN note TEXT;","ALTER TABLE loans ADD COLUMN created_at TEXT;","ALTER TABLE loans ADD COLUMN updated_at TEXT;","ALTER TABLE loans ADD COLUMN deleted_at TEXT;"],loan_payments:["ALTER TABLE loan_payments ADD COLUMN loan_id TEXT;","ALTER TABLE loan_payments ADD COLUMN account_id TEXT;","ALTER TABLE loan_payments ADD COLUMN paid_at TEXT;","ALTER TABLE loan_payments ADD COLUMN amount_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN principal_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN interest_component_minor INTEGER;","ALTER TABLE loan_payments ADD COLUMN generated_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN generated_interest_tx_id TEXT;","ALTER TABLE loan_payments ADD COLUMN note TEXT;","ALTER TABLE loan_payments ADD COLUMN created_at TEXT;","ALTER TABLE loan_payments ADD COLUMN updated_at TEXT;"],reimbursements:["ALTER TABLE reimbursements ADD COLUMN title TEXT;","ALTER TABLE reimbursements ADD COLUMN counterparty_id TEXT;","ALTER TABLE reimbursements ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';","ALTER TABLE reimbursements ADD COLUMN submitted_at TEXT;","ALTER TABLE reimbursements ADD COLUMN approved_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_at TEXT;","ALTER TABLE reimbursements ADD COLUMN paid_tx_id TEXT;","ALTER TABLE reimbursements ADD COLUMN total_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE reimbursements ADD COLUMN note TEXT;","ALTER TABLE reimbursements ADD COLUMN idempotency_key TEXT;","ALTER TABLE reimbursements ADD COLUMN created_at TEXT;","ALTER TABLE reimbursements ADD COLUMN updated_at TEXT;","ALTER TABLE reimbursements ADD COLUMN deleted_at TEXT;"],reimbursement_items:["ALTER TABLE reimbursement_items ADD COLUMN source_type TEXT NOT NULL DEFAULT 'manual';","ALTER TABLE reimbursement_items ADD COLUMN entry_type TEXT NOT NULL DEFAULT 'expense';","ALTER TABLE reimbursement_items ADD COLUMN transaction_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN category_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN account_id TEXT;","ALTER TABLE reimbursement_items ADD COLUMN description TEXT;","ALTER TABLE reimbursement_items ADD COLUMN amount_minor INTEGER;","ALTER TABLE reimbursement_items ADD COLUMN occurred_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN attachment_uri TEXT;","ALTER TABLE reimbursement_items ADD COLUMN created_at TEXT;","ALTER TABLE reimbursement_items ADD COLUMN updated_at TEXT;"],reimbursement_advances:["ALTER TABLE reimbursement_advances ADD COLUMN category_id TEXT;"],budgets:["ALTER TABLE budgets ADD COLUMN name TEXT;","ALTER TABLE budgets ADD COLUMN include_transfers INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_loan_repayments INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN include_reimbursed_expenses INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budgets ADD COLUMN budget_save_total_target_account_id TEXT;","ALTER TABLE budgets ADD COLUMN budget_save_total_source_account_id TEXT;","ALTER TABLE budgets ADD COLUMN created_at TEXT;","ALTER TABLE budgets ADD COLUMN updated_at TEXT;","ALTER TABLE budgets ADD COLUMN deleted_at TEXT;"],budget_items:["ALTER TABLE budget_items ADD COLUMN scope_type TEXT NOT NULL DEFAULT 'category';","ALTER TABLE budget_items ADD COLUMN category_id TEXT;","ALTER TABLE budget_items ADD COLUMN category_group_id TEXT;","ALTER TABLE budget_items ADD COLUMN amount_minor INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN amount_mode TEXT NOT NULL DEFAULT 'fixed';","ALTER TABLE budget_items ADD COLUMN day_rule_unit TEXT NOT NULL DEFAULT 'none';","ALTER TABLE budget_items ADD COLUMN day_rule_values_json TEXT NOT NULL DEFAULT '[]';","ALTER TABLE budget_items ADD COLUMN budget_save_enabled INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN budget_save_target_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN budget_save_source_account_id TEXT;","ALTER TABLE budget_items ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;","ALTER TABLE budget_items ADD COLUMN created_at TEXT;","ALTER TABLE budget_items ADD COLUMN updated_at TEXT;"],savings_jars:["ALTER TABLE savings_jars ADD COLUMN auto_save_source_account_id TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_amount_minor INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_value INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_interval_unit TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_start_date TEXT;","ALTER TABLE savings_jars ADD COLUMN auto_save_charge_day INTEGER;","ALTER TABLE savings_jars ADD COLUMN auto_save_paused INTEGER NOT NULL DEFAULT 0;"],app_settings:["ALTER TABLE app_settings ADD COLUMN value_json TEXT;","ALTER TABLE app_settings ADD COLUMN updated_at TEXT;"],deleted_log:["ALTER TABLE deleted_log ADD COLUMN payload_json TEXT;","ALTER TABLE deleted_log ADD COLUMN deleted_at TEXT;"],security_transactions:["ALTER TABLE security_transactions ADD COLUMN source_buy_tx_id TEXT;"]};async function Z(e,t){return!!(await e.query(`SELECT 1 AS ok
     FROM sqlite_master
     WHERE type = 'table'
       AND name = ?
     LIMIT 1;`,[t]))?.values?.length}async function Qa(e,t,n){if(await Z(e,t))for(const a of n)try{await e.execute(a)}catch(r){if(!Cn(r))throw r}}async function Za(e){for(const[n,a]of Object.entries(Ja))await Qa(e,n,a);const t="strftime('%Y-%m-%dT%H:%M:%fZ','now')";await Z(e,"transactions")&&(await e.execute(`UPDATE transactions
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t});`),await e.execute(`UPDATE transactions
       SET occurred_at = COALESCE(occurred_at, created_at, updated_at, ${t}),
           amount_minor = COALESCE(amount_minor, 0),
           origin_type = COALESCE(origin_type, 'manual'),
           include_in_budget = COALESCE(include_in_budget, 1),
           include_in_analysis = COALESCE(include_in_analysis, 1);`),await e.execute(`UPDATE transactions
       SET include_in_budget = 0,
           include_in_analysis = 0
       WHERE origin_type = 'reimbursement';`)),await Z(e,"budgets")&&await e.execute(`UPDATE budgets
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           include_transfers = COALESCE(include_transfers, 0),
           include_loan_repayments = COALESCE(include_loan_repayments, 0),
           include_reimbursed_expenses = COALESCE(include_reimbursed_expenses, 0),
           budget_save_total_enabled = COALESCE(budget_save_total_enabled, 0);`),await Z(e,"budget_items")&&await e.execute(`UPDATE budget_items
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           amount_minor = COALESCE(amount_minor, 0),
           amount_mode = COALESCE(amount_mode, 'fixed'),
           day_rule_unit = COALESCE(day_rule_unit, 'none'),
           day_rule_values_json = COALESCE(day_rule_values_json, '[]'),
           budget_save_enabled = COALESCE(budget_save_enabled, 0);`),await Z(e,"accounts")&&await e.execute(`UPDATE accounts
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           opening_balance_minor = COALESCE(opening_balance_minor, 0),
           account_type = COALESCE(account_type, 'asset'),
           allow_negative = COALESCE(allow_negative, 0),
           include_in_assets = COALESCE(include_in_assets, 1),
           include_in_group_statistics = COALESCE(include_in_group_statistics, 1),
           currency_code = COALESCE(currency_code, 'TWD'),
           is_archived = COALESCE(is_archived, 0);`),await Z(e,"ledgers")&&await e.execute(`UPDATE ledgers
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           is_archived = COALESCE(is_archived, 0),
           currency_code = COALESCE(currency_code, 'TWD'),
           timezone = COALESCE(timezone, 'Asia/Taipei');`),await Z(e,"categories")&&await e.execute(`UPDATE categories
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           sort_order = COALESCE(sort_order, 0),
           kind = COALESCE(kind, 'expense'),
           is_budgetable = COALESCE(is_budgetable, 1),
           is_archived = COALESCE(is_archived, 0);`),await Z(e,"app_settings")&&await e.execute(`UPDATE app_settings
       SET value_json = COALESCE(value_json, '{}'),
           updated_at = COALESCE(updated_at, ${t});`),await Z(e,"savings_jars")&&await e.execute(`UPDATE savings_jars
       SET created_at = COALESCE(created_at, ${t}),
           updated_at = COALESCE(updated_at, created_at, ${t}),
           auto_save_paused = COALESCE(auto_save_paused, 0);`)}async function ei(e){await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `)}async function It(e,t){const n=await e.query(`SELECT value
     FROM schema_meta
     WHERE key = ?
     LIMIT 1;`,[t]);return String(n?.values?.[0]?.value??"")}async function Ct(e,t,n){await e.run(`INSERT INTO schema_meta (key, value, updated_at)
     VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = excluded.updated_at;`,[t,String(n??"")])}async function Fn(e){try{const t=await e.query("SELECT MAX(version) AS max_version FROM schema_migrations;");return Number.parseInt(String(t?.values?.[0]?.max_version??"0"),10)||0}catch{return 0}}async function ti(e){const t=Xn(),n=await Fn(e),a=await It(e,Un).catch(()=>""),r=await It(e,hn).catch(()=>""),i=Number.parseInt(String(r||"0"),10)||0,o=kn();Va({knownSchemaMax:t,dbMaxSchemaVersion:n,floorSchemaVersion:i,prefsSchemaVersion:o.schemaVersion,floorAppVersion:a,prefsAppVersion:o.appVersion,currentAppVersion:wn()})}async function ni(e){const t=Xn(),n=await Fn(e),a=Math.max(t,n),r=wn();r&&await Ct(e,Un,r),await Ct(e,hn,String(a)),$a({appVersion:r,schemaVersion:a})}async function ri(e){await ei(e),await It(e,on).then(r=>r==="1").catch(()=>!1)||(await Za(e),await Ct(e,on,"1")),await e.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `),await ti(e);const n=await e.query("SELECT version FROM schema_migrations ORDER BY version ASC;"),a=new Set((n?.values??[]).map(r=>r.version));for(const r of vn)a.has(r.version)||(await Ha(e,r.sql),await e.run("INSERT INTO schema_migrations (version, name) VALUES (?, ?);",[r.version,r.name]));await ni(e)}let ai=1,Qe=null;function ii(){const e=ai++;return{id:`txctx_${e}_${Date.now().toString(36)}`,token:`tok_${e}_${Math.random().toString(36).slice(2,10)}`,depth:0,status:"open"}}function Mn(){return Qe}async function oi(e,t){const n=Qe;Qe=e;try{return await t()}finally{Qe=n}}class si{constructor(){this._tail=Promise.resolve(),this._pending=0}get pendingCount(){return this._pending}enqueue(t){this._pending+=1;const n=this._tail.then(()=>t());return this._tail=n.then(()=>{this._pending=Math.max(0,this._pending-1)},()=>{this._pending=Math.max(0,this._pending-1)}),n}}const ci=new si,di="/app/assets".replace(/\/{2,}/g,"/");let he=null,pt=null;async function _i(){if(!customElements.get("jeep-sqlite")){if(pt||(pt=(async()=>{try{await jr(window)}catch(e){console.warn("[sqlite] loader registration failed, fallback to esm bundle",e),await On(()=>import("./vendor-sqlite-DKEMZiEb.js").then(t=>t.j),[])}})()),await pt,!customElements.get("jeep-sqlite"))throw new Error("jeep-sqlite custom element registration failed");await customElements.whenDefined("jeep-sqlite")}}async function Ei(){if(A.getPlatform()==="web")return he||(he=(async()=>{await _i();const e=document.querySelector("jeep-sqlite")??document.createElement("jeep-sqlite");e.setAttribute("wasm-path",di),e.parentElement||document.body.appendChild(e),await Promise.resolve(),await new An(Sn).initWebStore()})().catch(e=>{throw he=null,e}),he)}const ui=Object.freeze({USER_RESET_ALL:"user_reset_all",USER_IMPORT_JSON:"user_import_json",USER_RESTORE_GOOGLE_BACKUP:"user_restore_google_backup",USER_RESTORE_WEBDAV_BACKUP:"user_restore_webdav_backup",USER_RESTORE_LOCAL_RECOVERY:"user_restore_local_recovery"}),li="LOCAL_DB_INTEGRITY",Ti="EMPTY_REMOTE_REPLACE_BLOCKED",mi="DATA_WIPE_DENIED",xn="straw.data_wipe_audit.v1",Bt=40,gi=new Set(Object.values(ui));function ft(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機資料庫無法安全開啟。系統不會自動清空帳本；請從備份／Google Drive／匯入還原，或至資料管理明確重設。",r=new Error(a);if(r.code=li,r.i18nKey=t.i18nKey||"app.local_db_integrity",r.originalMessage=n,r.recoverable=!1,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function rc(e={}){const t=Number(e.localTransactionCount??0),n=Number(e.remoteTransactionCount??0),a=String(e.message??"").trim()||`遠端帳本快照交易數（${n}）為空，但本機仍有 ${t} 筆交易；已阻止覆蓋以避免 silent wipe。請改用合併同步、從備份還原，或在確認後以匯入／重設路徑處理。`,r=new Error(a);return r.code=Ti,r.i18nKey=e.i18nKey||"settings_google_sync.error.empty_remote_replace_blocked",r.localTransactionCount=t,r.remoteTransactionCount=n,r.silentWipeBlocked=!0,r}function Li(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!gi.has(t)||!n){const r=new Error("本機資料清空被拒絕：缺少使用者確認或合法 wipe 理由。FK／migration／bootstrap 不得靜默 wipe。");throw r.code=mi,r.i18nKey="sqlite.error.data_wipe_denied",r.silentWipeBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function Ni(){if(typeof localStorage>"u")return[];try{const e=localStorage.getItem(xn),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function pi(e){if(!(typeof localStorage>"u"))try{localStorage.setItem(xn,JSON.stringify(e.slice(0,Bt)))}catch{}}function fi(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),confirmed:e.confirmed===!0,note:String(e.note??"").slice(0,240)},n=[t,...Ni()].slice(0,Bt);return pi(n),typeof console<"u"&&typeof console.info=="function"&&console.info("[data-wipe-audit]",t),t}const Gt="RECOVERY_BACKUP_REQUIRED";function At(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"本機 recovery 備份建立失敗，已中止清空本機資料。請先手動匯出備份後再重試還原／匯入／重設。",r=new Error(a);if(r.code=Gt,r.i18nKey=t.i18nKey||"settings_data.toast.recovery_backup_required",r.source=String(t.source??"").trim(),r.originalMessage=n,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}async function Ai(e,t={}){if(typeof e!="function")throw At(new Error("recovery backup creator missing"),t);let n;try{n=await e()}catch(a){throw a?.code===Gt?a:At(a,t)}if(!In(n))throw At(new Error("recovery backup proof missing or unverified (download-only / memory are not durable)"),t);return n}async function Oi({createRecoveryBackup:e,wipeFn:t,source:n,i18nKey:a}={}){const r=await Ai(e,{source:n,i18nKey:a});if(typeof t!="function")throw new Error("wipe function missing after recovery backup");return await t(),r}function ac(e){const t=e?.tables?.transactions;return Array.isArray(t)?t.filter(n=>!n?.deleted_at).length:0}const Si=Object.freeze({USER_EXPLICIT:"user_explicit_repair",USER_IMPORT_JSON:"user_import_integrity_repair",USER_RESTORE_BACKUP:"user_restore_integrity_repair"}),Ri=new Set(Object.values(Si)),Bn="straw.ledger_integrity_scan.v1",sn="straw.ledger_repair_audit.v1",bi="LEDGER_REPAIR_DENIED";function ic(e={}){const t=String(e.reason??"").trim(),n=String(e.source??"").trim();if(!(e.confirmed===!0)||!Ri.has(t)||!n){const r=new Error("帳本修復被拒絕：缺少使用者確認。啟動／migration／orphan prune 不得靜默改寫帳本語意。");throw r.code=bi,r.i18nKey="sqlite.error.ledger_repair_denied",r.silentRewriteBlocked=!0,r}return{reason:t,source:n,confirmed:!0}}function oc(e={}){const t={at:String(e.at??new Date().toISOString()),ledgerId:String(e.ledgerId??""),issueCount:Number(e.issueCount??0)||0,autoRepaired:e.autoRepaired===!0,issues:e.issues&&typeof e.issues=="object"?e.issues:{}};if(typeof localStorage<"u")try{localStorage.setItem(Bn,JSON.stringify(t))}catch{}return t}function sc(){if(typeof localStorage>"u")return null;try{const e=localStorage.getItem(Bn);return e?JSON.parse(e):null}catch{return null}}function cc(e={}){const t={at:String(e.at??new Date().toISOString()),reason:String(e.reason??""),source:String(e.source??""),ledgerId:String(e.ledgerId??""),confirmed:e.confirmed===!0,fixedCount:Number(e.fixedCount??0)||0};if(typeof localStorage<"u")try{const n=JSON.parse(localStorage.getItem(sn)||"[]"),a=Array.isArray(n)?n:[];localStorage.setItem(sn,JSON.stringify([t,...a].slice(0,Bt)))}catch{}return typeof console<"u"&&typeof console.info=="function"&&console.info("[ledger-repair-audit]",t),t}const yi=Object.freeze(["transaction_attachments","loan_payments","reimbursement_advance_usages","reimbursement_advances","reimbursement_items","reimbursements","budget_save_settlements","budget_items","budget_containers","budgets","loans","bank_transactions","bank_sync_rules","bank_accounts","bank_connections","credit_repayment_allocations","credit_repayments","transaction_postings","credit_statements","wear_applied","transactions","security_transactions","securities","savings_jars","accounts","account_groups","categories","category_groups","counterparties","app_settings","deleted_log"]),Di=Object.freeze([...yi.filter(e=>e!=="deleted_log"),"deleted_log","wear_sync_state","ledgers"]),Pt="SQLITE_CONSTRAINT_FOREIGNKEY",Gn=1811,Pn=/foreign\s*key|SQLITE_CONSTRAINT_FOREIGNKEY|\b1811\b/i;function jn(e){if(!e)return!1;if(e?.code===Pt||Number(e?.numericCode??e?.resultCode??e?.errno)===Gn)return!0;const t=String(e?.message??e??"");return/unique\s*constraint/i.test(t)&&!/foreign\s*key/i.test(t)?!1:/foreign\s*key/i.test(t)||/SQLITE_CONSTRAINT_FOREIGNKEY/i.test(t)||/\b1811\b/.test(t)||/constraint\s*failed/i.test(t)&&/FOREIGN KEY/i.test(t)?!0:Pn.test(t)}function Kn(e=""){const t=String(e??"").trim();return t&&!Pn.test(t)?t:"資料關聯不一致（外鍵約束）。請重試同步／匯入，或先修復本機資料後再操作。"}function Ii(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||Kn(n),r=new Error(a);if(r.code=Pt,r.numericCode=Gn,r.i18nKey=t.i18nKey||"sqlite.error.foreign_key_constraint",r.recoverable=t.recoverable!==!1,r.originalMessage=n,e&&typeof e=="object")try{r.cause=e}catch{}return r}function Hn(e,t={}){throw!jn(e)||e?.code===Pt&&e?.i18nKey?e:Ii(e,t)}function dc(e){return jn(e)?Kn(e?.message).slice(0,240):String(e?.message??e??"同步失敗").slice(0,240)}const ue="straw_money_book",cn=1,Y=new An(Sn);let k=null,Ee=null,xe=ue;function Ci(e){const t=String(e??"").trim();if(!t)return!1;const n=t.toUpperCase();return!(!(n.startsWith("INSERT")||n.startsWith("UPDATE")||n.startsWith("DELETE")||n.startsWith("REPLACE"))||n.includes("APP_SETTINGS"))}function Yn(){if(!(typeof window>"u"||typeof window.dispatchEvent!="function")){if(typeof CustomEvent=="function"){window.dispatchEvent(new CustomEvent("app:data-mutated"));return}window.dispatchEvent(new Event("app:data-mutated"))}}async function Wn(){A.getPlatform()==="web"&&await Y.saveToStore(xe)}function ee(e){if(typeof e=="string"&&e.trim())return e;const t=e?.message;if(typeof t=="string"&&t.trim())return t;try{const n=JSON.stringify(e);if(n&&n!=="{}")return n}catch{}return"unknown sqlite error"}function Ui(e){const t=ee(e).toLowerCase();return/foreign\s*key|\b1811\b|sqlite_constraint_foreignkey/.test(t)?!1:t.includes("datatype mismatch")||t.includes("no such column")||t.includes("no such table")||t.includes("code20")||t.includes("code 20")}function hi(e){const t=ee(e).toLowerCase();return t.includes("capacitorsqliteplugin: null")||t==="null"}function wi(e){return ee(e).toLowerCase().includes("no such table")}async function ki(){A.getPlatform()==="web"&&await Ei()}async function jt(){try{await Y.closeAllConnections()}catch{}}async function tt(e=xe){if((await Y.isConnection(e,!1)).result)try{k=await Y.retrieveConnection(e,!1)}catch{await jt(),k=await Y.createConnection(e,!1,"no-encryption",cn,!1)}else k=await Y.createConnection(e,!1,"no-encryption",cn,!1);return await k.open(),await k.execute("PRAGMA foreign_keys = ON;"),await ri(k),xe=e,k}async function vi(e=xe){if(k){try{await k.close()}catch{}k=null}if((await Y.isConnection(e,!1)).result){const n=await Y.retrieveConnection(e,!1);try{await n.close()}catch{}try{await Y.closeConnection(e,!1)}catch{}}await jt();try{return await Y.deleteDatabase(e,!1),tt(e)}catch(n){const a=await tt(e);try{await a.execute("PRAGMA foreign_keys = ON;");for(const r of Di)try{await a.run(`DELETE FROM ${r};`)}catch(i){wi(i)||Hn(i)}}catch(r){const i=ee(n),o=ee(r);throw new Error(`[sqlite] reset fallback failed; delete: ${i}; wipe: ${o}`)}return a}}async function Xi(e={}){const t=Li(e);fi({reason:t.reason,source:t.source,confirmed:!0,note:String(e.note??"").slice(0,240)}),qa(),Ee=null,xe=ue;const n=await vi(ue);try{const{rotateWearSyncEpoch:a}=await On(async()=>{const{rotateWearSyncEpoch:r}=await import("./wear-sync-epoch.service-CjOapVHP.js");return{rotateWearSyncEpoch:r}},__vite__mapDeps([0,1,2,3,4]));await a()}catch{}return n}async function $n(){return k||Ee||(Ee=(async()=>{const e=A.getPlatform();try{return await ki(),await tt(ue)}catch(t){if(e==="android"&&hi(t))try{return console.warn("[sqlite] plugin null on primary open — retrying primary (recovery empty-db fallback disabled)"),await jt(),k=null,await tt(ue)}catch(n){Ee=null;let a=!1;try{a=!!(await Y.isDatabase(ue,!1))?.result}catch{a=!1}throw ft(n,{message:a?`[sqlite:${e}] plugin null: primary DB file exists but cannot open (empty recovery fallback disabled): ${ee(n)}`:`[sqlite:${e}] plugin null on primary open (empty recovery fallback disabled): ${ee(n)}`})}throw Ee=null,Ui(t)?ft(t,{message:`[sqlite:${e}] schema integrity error (no silent wipe): ${ee(t)}`}):ft(t,{message:`[sqlite:${e}] ${ee(t)}`})}})(),Ee)}async function Be(){return k||await $n(),k}let ke=!1;function Fi(){const e=Mn();return!!(e&&e.depth>0&&e.status==="open")}async function _t(e,t=[]){const n=await Be();try{const a=Fi(),r=await n.run(e,t,!a);return Ci(e)&&(a?ke=!0:(await Wn(),Yn())),r}catch(a){Hn(a)}}async function W(e,t=[]){return(await Be()).query(e,t)}async function Mi(e){const t=Mn();if(t&&t.status==="open"){t.depth+=1;try{const n=await Be();return await e(n,t)}finally{t.depth=Math.max(0,t.depth-1)}}return ci.enqueue(async()=>{const n=ii();n.depth=1,ke=!1;const a=await Be();await a.beginTransaction();try{const r=await oi(n,async()=>e(a,n));return n.status="committing",await a.commitTransaction(),n.status="committed",ke&&(await Wn(),Yn()),ke=!1,r}catch(r){n.status="rolling_back";try{await a.rollbackTransaction()}catch{}throw n.status="rolled_back",ke=!1,r}finally{n.depth=0}})}const _c=Object.freeze(Object.defineProperty({__proto__:null,PRIMARY_DB_NAME:ue,getDatabase:Be,initDatabase:$n,query:W,resetDatabase:Xi,run:_t,withTransaction:Mi},Symbol.toStringTag,{value:"Module"}));function Ec(e=""){const t=Date.now().toString(36),n=Math.random().toString(36).slice(2,10);return e?`${e}_${t}_${n}`:`${t}_${n}`}function qn(){return new Date().toISOString()}function uc(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0");return`${n}-${a}`}function lc(e=new Date){const t=typeof e=="string"?new Date(e):e,n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${n}-${a}-${r}`}function Tc(e){if(!e)throw new Error("ledgerId is required")}function xi(e){return e?.values??[]}function Bi(e){return xi(e)[0]??null}async function zn(e,t){const n=await W(`SELECT value_json
     FROM app_settings
     WHERE ledger_id = ? AND key = ?
     LIMIT 1;`,[e,t]),a=Bi(n);if(!a)return null;try{return JSON.parse(a.value_json)}catch{return null}}async function nt(e,t,n){await _t(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,t,JSON.stringify(n),qn()])}async function Gi(e,t){await _t(`DELETE FROM app_settings
     WHERE ledger_id = ? AND key = ?;`,[e,t])}async function Pi(e){const t=await W(`SELECT key, value_json, updated_at
     FROM app_settings
     WHERE ledger_id = ?;`,[e]);return Array.isArray(t?.values)?t.values:[]}async function ji(e,t={}){await _t(`INSERT INTO app_settings (ledger_id, key, value_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(ledger_id, key)
     DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at;`,[e,String(t?.key??"").trim(),String(t?.value_json??"null"),String(t?.updated_at??"").trim()||qn()])}const mc=Object.freeze(Object.defineProperty({__proto__:null,getSetting:zn,listAppSettingRows:Pi,removeSetting:Gi,setSetting:nt,upsertAppSettingRow:ji},Symbol.toStringTag,{value:"Module"}));function Ge(e){const t=Number(e);if(!Number.isFinite(t))throw new Error("amountMinor 必須為有效數字");return Math.round(t)}function gc(e){return Math.abs(Ge(e))}function Lc(e){const t=Ge(e);return t===0?0:-t}function Nc(e){const t=Number(e);if(!Number.isInteger(t)||t<0)throw new Error("amountMinor 必須為大於或等於 0 的數字");return t}function pc(e){const t=Number(e);if(!Number.isInteger(t)||t<=0)throw new Error("amountMinor 必須為大於 0 的數字");return t}function fc(e){const t=Number(e);if(!Number.isFinite(t)||t===0)throw new Error("adjustment amountMinor 不能為 0");return t}function Ki(e){return Ge(e??0)}function Ac(e=[]){const t=Array.isArray(e)?e:[];let n=0;for(const a of t){const r=Math.round(Number(a?.remaining_minor??a?.remainingMinor??0));!Number.isFinite(r)||r<=0||(n+=r)}return n}function Hi(e,t){return Ge(e??0)+Ge(t??0)}const Yi={BASE_URL:"/app/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_BANK_SYNC_ENABLE_UNSUPPORTED_REAL_PROVIDERS:"true",VITE_BANK_SYNC_FEATURE_ENABLED:"true",VITE_EINVOICE_CLIENT_SHARED_KEY:"bdf6d030f54e8b6da78d5b457f6987206493812e7ae7a8139dbbdadf603ef7c0",VITE_GOOGLE_USE_SERVER_AUTH_CODE:"true",VITE_GOOGLE_WEB_CLIENT_ID:"110585924943-419l5kajjdao1c7jktsg64v4k64qh5o0.apps.googleusercontent.com",VITE_PRIVACY_POLICY_URL:"https://www.strawmb.com/privacy-policy",VITE_WEB_HASH_ROUTER:"true"},Wi=["VITE_GOOGLE_WEB_CLIENT_ID","VITE_GOOGLE_OAUTH_CLIENT_ID","VITE_GOOGLE_CLIENT_ID"];function Vn(){for(const e of Wi){const t=String(Yi[e]??"").trim();if(t)return t}return""}function Ut(){return bn("settings_account.google_client_id_missing","缺少 Google Web Client ID（請設定 VITE_GOOGLE_WEB_CLIENT_ID）")}const $i="https://www.googleapis.com/auth/drive.appdata",qi=["email","profile",$i],Kt="straw.google.oauth.token_cache.v1",zi=60*1e3,Ze=120*1e3,Jn=20*1e3,Vi=8*1e3,Ji=3300,Qi=Ze+Jn+15*1e3,Ot="Google 登入逾時，請重試",Zi="Google 授權交換逾時，請檢查網路後重試",Qn="https://api.strawmb.com",eo=no("true"),Ht=ro(),dn=ao(),_n=er(void 0,"/api/google/oauth/exchange"),En=er(void 0,"/api/google/oauth/refresh"),un="".trim();let ln="",rt="",Pe="",ne="",oe=0,$="",F=null,ge=null,ze=0,Ve=!1;const to="GOOGLE_REAUTH_REQUIRED",Tn="Google 登入成功但未取得長效 refresh token，無法用於自動備份";function no(e){const t=String(e).trim().toLowerCase();return t==="1"||t==="true"||t==="yes"||t==="on"}function je(){return Ht?Pe!=="online":!1}function Zn(){if(!Ht)throw new Error("Google 自動備份需要長效授權，但目前未啟用 server auth code flow");Pe==="online"&&(Pe="",rt="",ut())}function ro(){if(!eo)return!1;if(!A.isNativePlatform())return!0;const e="".trim(),t="".trim(),n="".trim(),a=pe(t)&&pe(n),r=pe(e);return a||r||pe(Qn)?!0:(console.warn("[google-auth] VITE_GOOGLE_USE_SERVER_AUTH_CODE=true but no explicit Google OAuth backend is configured for native runtime; fallback to online mode."),!1)}function pe(e){return/^https?:\/\//i.test(String(e??"").trim())}function ao(){const e="".trim();return pe(e)?e.replace(/\/+$/,""):Qn}function io(){if(A.isNativePlatform())return!0;if(typeof window<"u"){const e=String(window.location?.origin??"").trim();if(/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(e))return!1}return!0}function er(e,t){const n="".trim()||String(t??"").trim();if(!n)return"";if(pe(n)||!n.startsWith("/")||!io())return n;try{return new URL(n,`${dn}/`).toString()}catch{return`${dn}${n}`}}function St(e,t,n){let a=0;const r=new Promise((i,o)=>{a=globalThis.setTimeout(()=>{o(new Error(n))},t)});return Promise.race([e,r]).finally(()=>{a&&globalThis.clearTimeout(a)})}async function tr(e,t,n,a){const r=typeof AbortController=="function"?new AbortController:null;let i=0;r&&Number.isFinite(n)&&n>0&&(i=globalThis.setTimeout(()=>{r.abort()},n));try{return await fetch(e,{...t??{},...r?{signal:r.signal}:{}})}catch(o){throw r?.signal?.aborted?new Error(a):o}finally{i&&globalThis.clearTimeout(i)}}function oo(){if(!A.isNativePlatform())throw new Error("Google 備份僅支援 App 裝置")}function Ke(e){return e?typeof e=="string"?e:String(e.token??"").trim():""}function ce(e){const t=e&&typeof e=="object"?e:{};return{email:String(t.email??"").trim(),name:String(t.name??"").trim(),imageUrl:String(t.imageUrl??t.picture??"").trim()}}function nr(){return!ne||!Number.isFinite(oe)||oe<=0?!1:Date.now()+zi<oe}function Yt(){return typeof localStorage<"u"}function De(){if(!Yt())return;const e={accessToken:ne,accessTokenExpiresAtMs:oe,refreshToken:$,profile:F,mode:rr()};try{localStorage.setItem(Kt,JSON.stringify(e))}catch{}}function so(){if(Yt())try{const e=localStorage.getItem(Kt);if(!e)return;const t=JSON.parse(e);if(!t||typeof t!="object")return;ne=Ke(t.accessToken),$=String(t.refreshToken??"").trim(),oe=Math.max(0,Number(t.accessTokenExpiresAtMs??0)||0),F=ce(t.profile)}catch{}}function co(){if(Yt())try{localStorage.removeItem(Kt)}catch{}}function Et({accessToken:e,refreshToken:t,expiresInSec:n,expiresAtMs:a}={}){typeof e=="string"&&(ne=e.trim()),typeof t=="string"&&($=t.trim());const r=Number(a);if(Number.isFinite(r)&&r>0)oe=r;else{const i=Number(n);oe=Number.isFinite(i)&&i>0?Date.now()+i*1e3:0}De()}function ut({keepRefreshToken:e=!1}={}){ne="",oe=0,e||($=""),e?De():co()}function _o(){return"".trim()}function Eo(){return Vn()}function rr(){return je()?"offline":"online"}function ar(e){const t=String(e?.message??e??"").toLowerCase();return t.includes("account reauth failed")||t.includes("[16]")}function uo(e){const t=[],n=String(e?.code??e?.errorCode??"").trim(),a=String(e?.status??"").trim(),r=String(e?.name??"").trim(),i=String(e?.message??e??"").trim();return n&&t.push(`code=${n}`),a&&t.push(`status=${a}`),r&&r!=="Error"&&t.push(`name=${r}`),i&&t.push(`raw=${i}`),t}function fe(e,t){const n=uo(t);return n.length?`${e}（${n.join(" | ")}）`:e}function Ae(e){if(ar(e))return new Error(fe("Google 需要重新授權，請再試一次；若仍失敗請先在裝置 Google 帳號中移除本 App 授權後重登。",e));const t=String(e?.message??"").trim(),n=t.toLowerCase();return n.includes("missing_google_oauth_env")||n.includes("google_exchange_004")||n.includes("google_refresh_004")||n.includes("google_oauth_client_secret")||n.includes("invalid_client")||n.includes("client secret is invalid")?new Error(fe("Google 自動備份後端設定錯誤，請通知管理員檢查 Google OAuth client / secret 設定。",e)):n.includes("invalid_grant")||n.includes("redirect_uri_mismatch")||n.includes("code was already redeemed")?new Error(fe("Google 授權碼已失效或無法交換，請到自動備份頁重新登入 Google。",e)):new Error(fe(t||"Google 登入失敗",e))}function et(e="Google 需要重新授權，請到自動備份頁重新登入 Google。",t=null){const n=new Error(fe(e,t));return n.code=to,n}function ir(e){const t=e&&typeof e=="object"?e:{},n=Ke(t.accessToken??t.access_token);if(!n)throw new Error("後端未回傳 access token");const a=t.refreshToken??t.refresh_token,r=typeof a=="string"?a.trim():"",i=Number(t.expiresIn??t.expires_in??0),o=Number.isFinite(i)&&i>0?i:0,s=Number(t.accessTokenExpiresAtMs??t.access_token_expires_at_ms??t.expiresAtMs??0),d=Number.isFinite(s)&&s>0?s:0,c=ce(t.profile),E=ce(t),u=c.email||c.name||c.imageUrl?c:E;return t.idToken??t.id_token,{accessToken:n,refreshToken:r,expiresInSec:o,expiresAtMs:d,profile:u}}async function or(e,t){const n={"Content-Type":"application/json"};un&&(n["X-Straw-Client-Key"]=un);let a;try{a=await tr(e,{method:"POST",headers:n,body:JSON.stringify(t??{})},Jn,Zi)}catch(o){throw new Error(fe(`Google OAuth 請求失敗（url=${e}）`,o))}const r=await a.text();let i=null;if(r)try{i=JSON.parse(r)}catch{i=null}if(!a.ok){const o=String(i?.message??i?.error_description??r??i?.error??"").trim(),s=String(i?.errorNumber??"").trim(),d=s?`（errorNumber=${s}）`:"";throw new Error(`${o||`HTTP ${a.status}`}${d}（url=${e}）`)}if(!i||typeof i!="object")throw new Error(`後端回應格式錯誤（url=${e}）`);return i}async function sr(e){if(!e)return null;try{const t=await tr("https://openidconnect.googleapis.com/v1/userinfo",{method:"GET",headers:{Authorization:`Bearer ${e}`}},Vi,"Google 使用者資料讀取逾時");if(!t.ok)return null;const n=await t.json(),a=ce(n);return!a.email&&!a.name&&!a.imageUrl?null:a}catch{return null}}async function lo(e){const t=String(e??"").trim();if(!t)throw new Error("Google 登入成功但未取得 server auth code");if(!_n)throw new Error("缺少 Google OAuth 後端交換端點（請設定 VITE_GOOGLE_OAUTH_EXCHANGE_URL）");const n=await or(_n,{serverAuthCode:t});return console.info("[google-auth] exchangeServerAuthCode success"),ir(n)}async function To(e){const t=String(e??"").trim();if(!t)throw et("Google 授權已失效，請到自動備份頁重新登入 Google。");if(!En)throw new Error("缺少 Google OAuth 後端 refresh 端點（請設定 VITE_GOOGLE_OAUTH_REFRESH_URL）");const n=await or(En,{refreshToken:t});return n?.accessToken??n?.access_token,ir(n)}async function Rt(e={}){const t=String(e.preferredEmail??e.loginHint??"").trim(),n={scopes:qi,...e};return delete n.preferredEmail,t&&!n.loginHint&&(n.loginHint=t),Oe.login({provider:"google",options:n})}function mo(e=""){Pe!=="online"&&(Pe="online",rt="",ut(),e&&console.warn("[google-auth] switch to online mode fallback",e))}function go(e){return ce({email:e?.profile?.email||"",name:e?.profile?.name||"",imageUrl:e?.profile?.imageUrl||""})}function cr(e){const t=e&&typeof e=="object"?e:{},n=Number(t.expiresAtMs??t.expires_at_ms??t.expireTimeMs??t.expirationTimeMs??0);if(Number.isFinite(n)&&n>Date.now()){const r=Math.floor((n-Date.now())/1e3);if(r>0)return r}const a=Number(t.expiresIn??t.expires_in??t.expires??0);return Number.isFinite(a)&&a>0?a:Ji}async function Lo(){if(!(await Oe.isLoggedIn({provider:"google"}))?.isLoggedIn)return"";const t=await Oe.getAuthorizationCode({provider:"google"}),n=Ke(t?.accessToken);if(!n)return"";Et({accessToken:n,refreshToken:"",expiresInSec:cr(t)});const a=ce(t?.profile);return(a.email||a.name||a.imageUrl)&&(F=a,De()),ne}function mn(e){const t=Ke(e?.accessToken);if(!t)throw new Error("Google 登入成功但未取得 access token");return Et({accessToken:t,refreshToken:"",expiresInSec:cr(e)}),F=go(e),De(),{accessToken:t,profile:F}}async function ht(){oo();const e=Eo();if(!e)throw new Error(Ut());const t=rr();if(ln===e&&rt===t)return;const n={webClientId:e,mode:t},a=_o();a&&(n.iOSClientId=a),t==="offline"&&(n.iOSServerClientId=e),await Oe.initialize({google:n}),ln=e,rt=t}async function wt(e={}){const t=!!e?.requireRefreshToken;if(ge){const a=Date.now()-ze;if(a>=0&&a<Qi){if(!t||Ve)return ge;console.warn("[google-auth] refresh-token sign-in cannot reuse an online-only sign-in promise")}else console.warn("[google-auth] stale sign-in promise detected, forcing a fresh login attempt",{elapsedMs:a});ge=null,ze=0,Ve=!1}ze=Date.now(),Ve=t;const n=(async()=>{t&&Zn(),await ht();let a;try{a=await St(Rt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,style:je()?"standard":"bottom",preferredEmail:e.preferredEmail}),Ze,Ot)}catch(r){if(ar(r)){try{await Oe.logout({provider:"google"})}catch{}try{a=await St(Rt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),Ze,Ot)}catch(i){throw Ae(new Error(`首次登入失敗：${String(r?.message??r)}；重試仍失敗：${String(i?.message??i)}`))}}else throw Ae(r)}if(a.provider!=="google")throw new Error("Google 登入失敗，請重試");if(je())try{if(a.result?.responseType!=="offline")throw new Error("Google 登入成功但未取得 server auth code");const r=await lo(a.result.serverAuthCode),i=r.accessToken;if(t&&!r.refreshToken)throw new Error(Tn);const o=r.refreshToken||$,s=r.profile,d=s.email||s.name||s.imageUrl?s:await sr(i);return Et({accessToken:i,refreshToken:o,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),F=ce(d),De(),{accessToken:ne,profile:F}}catch(r){if(t)throw Ae(r);console.warn("[google-auth] offline auth flow failed, fallback to online mode",r),mo(String(r?.message??r)),await ht();let i=a;if((i.result?.responseType!=="online"||!Ke(i.result?.accessToken))&&(i=await St(Rt({forceRefreshToken:!0,filterByAuthorizedAccounts:!1,forcePrompt:!0,style:"standard",preferredEmail:e.preferredEmail}),Ze,Ot)),i.result?.responseType!=="online")throw Ae(r);return mn(i.result)}if(t)throw new Error(Tn);if(a.result?.responseType!=="online")throw new Error("Google 登入失敗，請重試");return mn(a.result)})();ge=n;try{return await n}finally{ge===n&&(ge=null,ze=0,Ve=!1)}}async function Ie(e={}){const t=!!e?.requireRefreshToken;if(t&&Zn(),nr()&&(!t||$))return ne;const n=e?.interactive!==!1,a=String(e?.preferredEmail??"").trim();if(je()){if($)try{const r=await To($);if(Et({accessToken:r.accessToken,refreshToken:r.refreshToken||$,expiresInSec:r.expiresInSec,expiresAtMs:r.expiresAtMs}),!F?.email){const i=r.profile.email||r.profile.name||r.profile.imageUrl?r.profile:await sr(r.accessToken);i&&(F=ce(i),De())}return ne}catch(r){console.warn("[google-auth] backend refresh failed",r)}if(n)try{return(await wt({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw Ae(r)}throw et()}await ht();try{const r=await Lo();if(r)return r}catch(r){if(!n)throw console.warn("[google-auth] background token fetch failed",r),et(void 0,r);console.warn("[google-auth] silent token fetch before interactive sign-in failed",r)}if(n)try{return(await wt({preferredEmail:a,requireRefreshToken:t})).accessToken}catch(r){throw Ae(r)}throw et()}async function dr(e={}){const t=e?.interactive!==!1;return ut({keepRefreshToken:je()}),Ie({interactive:t,requireRefreshToken:!!e?.requireRefreshToken})}async function No(){try{await Oe.logout({provider:"google"})}catch(e){if(!Ht||!String(e?.message??"").toLowerCase().includes("offline mode"))throw e}finally{ut(),F=null}}function Se(){return F}function _r(){const e=F&&typeof F=="object"?F:{};return!!($||nr()||e.email||e.name||e.imageUrl)}so();const po=Rn("FileOpener"),fo="StrawMoneyBook",Er=["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],Ao=/(password|token|secret|authorization|client[_-]?key)/i,Oo=/^(?:bank_sync\.credentials\.[^.]+|backup\.webdav\.credentials)$/i,kt="【附加項目】";function So(e){if(e==null)return"";const t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?`"${t.replaceAll('"','""')}"`:t}function He(e,t=null){const n=Array.isArray(t)&&t.length?t:Object.keys(e[0]??{});if(!n.length)return"";const a=[n.join(",")];for(const r of e)a.push(n.map(i=>So(r[i])).join(","));return a.join(`\r
`)}function at(e){if(Array.isArray(e))return e.map(n=>at(n));if(!e||typeof e!="object")return e;const t={};for(const[n,a]of Object.entries(e))t[n]=Ao.test(n)?"":at(a);return t}function Ro(e){if(!e||typeof e!="object")return e;const t=String(e.key??"").trim();if(Oo.test(t))return null;try{const n=JSON.parse(String(e.value_json??"null"));return!n||typeof n!="object"?e:t==="backup.webdav"?{...e,value_json:JSON.stringify({...at(n),connected:!1,autoEnabled:!1,dataChangeAutoEnabled:!1,password:"",lastError:""})}:{...e,value_json:JSON.stringify(at(n))}}catch{return e}}function ur(e){const t=String(e??"").split(`
`).map(n=>n.trim()).find(n=>n.startsWith(kt));return t?t.slice(kt.length).trim():""}function lr(e){return String(e??"").split(`
`).map(t=>t.trim()).filter(t=>t&&!t.startsWith(kt)).join(`
`)}function bo(e){const[t,n]=String(e??"").split("-").map(i=>Number(i)),a=new Date(t,n-1,1,0,0,0),r=new Date(t,n,1,0,0,0);return{startUtc:a.toISOString(),endUtc:r.toISOString()}}function yo(e){const t=Number(e),n=new Date(t,0,1,0,0,0),a=new Date(t+1,0,1,0,0,0);return{startUtc:n.toISOString(),endUtc:a.toISOString()}}function Do(e){const[t,n,a]=String(e??"").split("-").map(o=>Number(o)),r=new Date(t,n-1,a,0,0,0),i=new Date(t,n-1,a+1,0,0,0);return{startUtc:r.toISOString(),endUtc:i.toISOString()}}function Io(e,t){const[n,a,r]=String(e??"").split("-").map(E=>Number(E)),[i,o,s]=String(t??"").split("-").map(E=>Number(E)),d=new Date(n,a-1,r,0,0,0),c=new Date(i,o-1,s+1,0,0,0);return{startUtc:d.toISOString(),endUtc:c.toISOString()}}function Tr(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),i=String(e.getMinutes()).padStart(2,"0"),o=String(e.getSeconds()).padStart(2,"0");return`${t}-${n}-${a}_${r}${i}${o}`}function vt(e,t="ledger"){const n=String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"");return n?Array.from(n).slice(0,40).join(""):t}function Co(e,t={}){return e==="year"?yo(t.yearKey):e==="month"?bo(t.monthKey):e==="day"?Do(t.dayKey):e==="custom"?Io(t.startDate,t.endDate):{startUtc:null,endUtc:null}}const Uo=["類型","記帳時間","交易帳戶","交易帳本","貨幣符號","交易金額","當期帳戶餘額","一級分類","二級分類","交易標籤","備註","附加項目","退款&轉銷","收回","歸還","匯率"],ho=Uo.filter(e=>e!=="交易標籤");function gn(e){const t=String(e??"").trim();return t?t.split(/\s*(?:-->|->|→|＞)\s*/g).map(n=>n.trim()).filter(Boolean):[]}function wo(e,t){const n=gn(e),a=gn(t),r=n[0]||a[0]||"";let i="";return a.length>1?i=a.slice(1).join(" / "):a.length===1?i=a[0]:n.length>1&&(i=n.slice(1).join(" / ")),{primary:r,secondary:i}}async function lt(e,t){const a=(await W(`SELECT * FROM ${t} WHERE ledger_id = ?;`,[e]))?.values??[];return t!=="app_settings"?a:a.map(r=>Ro(r)).filter(Boolean)}async function mr(){const e=await W("SELECT MAX(version) AS version FROM schema_migrations;");return Number(e?.values?.[0]?.version??0)}async function ko(e,t=null){const n=!!t,a=n?`SELECT
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
       GROUP BY a.id, a.opening_balance_minor;`,i=(n?await W(a,[t,e]):await W(a,[e]))?.values??[],o=new Map;for(const s of i)o.set(String(s.account_id),Ki(s.balance_minor));return o}async function Oc(e){const t={schema_version:0,exported_at:new Date().toISOString(),ledger_id:e,tables:{}};t.schema_version=await mr();const n=await W("SELECT * FROM ledgers WHERE id = ?;",[e]);t.tables.ledgers=n?.values??[];for(const a of Er)t.tables[a]=await lt(e,a);return t}async function gr(){const e={schema_version:await mr(),exported_at:new Date().toISOString(),backup_scope:"all_ledgers",ledgers:[]},n=(await W("SELECT * FROM ledgers WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC, id ASC;"))?.values??[];for(const a of n){const r=a?.id;if(!r)continue;const i={schema_version:e.schema_version,exported_at:e.exported_at,ledger_id:r,tables:{ledgers:[a]}};for(const o of Er)i.tables[o]=await lt(r,o);e.ledgers.push(i)}return e}async function Sc(e){const n=((await W(`SELECT *
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
     ORDER BY occurred_at DESC, created_at DESC;`,[e]))?.values??[]).map(r=>({...r,note_without_addon:lr(r.note),addon_items:ur(r.note)})),a=n.length?Object.keys(n[0]):["ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","is_reimbursable","reimbursement_state","reimbursed_at","note_without_addon","addon_items","created_at","updated_at","deleted_at"];return He(n,a)}async function Rc(e){const t=await lt(e,"accounts");return He(t)}async function bc(e){const t=await lt(e,"categories");return He(t)}function vo(e){return e==="expense"?"支出":e==="income"?"收入":e==="transfer"?"轉帳":"調整"}function Xo(e){if(Array.isArray(e))return e.map(n=>String(n??"").trim()).filter(Boolean).join("、");const t=String(e??"").trim();if(!t)return"";try{const n=JSON.parse(t);if(Array.isArray(n))return n.map(a=>String(a??"").trim()).filter(Boolean).join("、")}catch{}return t}function Fo(e,t){const n=[],a=[];for(const r of e){const i=Number(r.amount_minor??0)/100,o=String(r.account_id??""),s=Hi(t.get(o),r.amount_minor);t.set(o,s);const d=s/100,c=wo(r.category_group_name,r.category_name),E=ur(r.note),u={類型:vo(r.type),記帳時間:r.occurred_at??"",交易帳戶:r.account_name??"",交易帳本:r.ledger_name??"",貨幣符號:r.currency_code??"TWD",交易金額:String(i),當期帳戶餘額:String(d),一級分類:c.primary,二級分類:c.secondary,備註:lr(r.note),附加項目:E,"退款&轉銷":"",收回:"",歸還:"",匯率:"1"};n.push(u),a.push({...u,交易標籤:Xo(r.tags_json)})}return{csvRows:n,excelRows:a}}function Mo(e="t"){return`EXISTS (
    SELECT 1
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND (
        rt.origin_type = 'refund'
        OR rc.name = '退款'
        OR rt.note LIKE '退款：%'
        OR rt.note LIKE '退款:%'
      )
  )`}function xo(e="t"){return`COALESCE((
    SELECT SUM(ABS(rt.amount_minor))
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${e}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${e}.id
      AND (
        rt.origin_type = 'refund'
        OR rc.name = '退款'
        OR rt.note LIKE '退款：%'
        OR rt.note LIKE '退款:%'
      )
  ), 0)`}async function Bo(e,t={}){const n=["all","year","month","day","custom"].includes(t.mode)?t.mode:"all",{startUtc:a,endUtc:r}=Co(n,t),i=await ko(e,a),o=[e];let s="";a&&r&&(s=" AND t.occurred_at >= ? AND t.occurred_at < ?",o.push(a,r));const c=(await W(`SELECT
       t.type,
       t.account_id,
       t.category_id,
       t.include_in_analysis,
       CASE WHEN ${Mo("t")} THEN 1 ELSE 0 END AS has_refund_link,
       ${xo("t")} AS refund_deducted_minor,
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
     ORDER BY t.occurred_at ASC, t.created_at ASC;`,o))?.values??[],{csvRows:E,excelRows:u}=Fo(c,i),T=E[0]?.交易帳本||c[0]?.ledger_name||"ledger";return{mode:n,ledgerName:T,rowCount:E.length,csvRows:E,excelRows:u,records:c}}async function yc(e,t={}){const n=await Bo(e,t),r=`${vt(n.ledgerName)}_transactions_${n.mode}_${Tr()}.csv`,i=He(n.csvRows,ho);return{filename:r,csvText:i,rowCount:n.rowCount}}function Je(e){const t=Number(e??0)/100;return Number.isFinite(t)?t.toFixed(2).replace(/\.00$/,"").replace(/(\.\d)0$/,"$1"):"0"}function Go(e){const t=String(e??"").trim();return{active:"進行中",partial:"部分完成",settled:"已結清",void:"完成"}[t]??t}function Po(e){return e==="borrow"?"借入":"借出"}const jo=["狀態","借貸方向","對象名稱","開始日期","到期日","建立入帳帳戶","本金","預設利息","已收 / 已還","剩餘","備註"];function Ko(e=[]){return(e??[]).map(t=>({狀態:Go(t?.status),借貸方向:Po(t?.direction),對象名稱:String(t?.counterparty_name??"").trim()||"未命名對象",開始日期:String(t?.start_date??t?.setup_occurred_at??"").trim(),到期日:String(t?.due_date??"").trim(),建立入帳帳戶:String(t?.setup_account_name??"").trim(),本金:Je(t?.principal_minor),預設利息:Je(t?.preset_interest_minor),"已收 / 已還":Je(t?.paid_minor),剩餘:Je(t?.remaining_minor),備註:String(t?.note??"").trim()}))}function Dc(e,t={}){const n=vt(t.ledgerName??"loans"),a=vt(t.scopeName??""),r=t.tab==="borrow"?"borrow":"lend",i=t.showFinished?"finished":"active",o=Tr(t.now instanceof Date?t.now:new Date),s=Ko(e),d=a?`_${a}`:"";return{filename:`${n}_loans${d}_${r}_${i}_${o}.csv`,csvText:He(s,jo),rowCount:s.length}}function Ic(e,t){const n=new Blob([JSON.stringify(t,null,2)],{type:"application/json"});Lr(e,n)}function Cc(e,t){const n=new Blob([`\uFEFF${t}`],{type:"text/csv;charset=utf-8"});Lr(e,n)}function Uc(e){const t=new Blob([`\uFEFF${e}`],{type:"text/csv;charset=utf-8"});return URL.createObjectURL(t)}function hc(e){const t=e instanceof Blob?e:new Blob([e],{type:"application/pdf"});return URL.createObjectURL(t)}function wc(e){e&&URL.revokeObjectURL(e)}function Ho(e,t){if(!e)return;const n=document.createElement("a");n.href=e,n.download=t,document.body.appendChild(n),n.click(),n.remove()}function kc(e){const t=String(e??"").trim();if(!t||typeof window>"u"||typeof document>"u")return!1;const n=t.startsWith("blob:")||t.startsWith("data:"),a=/^file:\/\//i.test(t)||/^content:\/\//i.test(t)||t.startsWith("/");if(A.isNativePlatform()){if(n)return!1;if(a)return po.openFile({uri:t}).catch(i=>{console.warn("[file-opener] failed to open exported file",i)}),!0;try{return window.location.assign(t),!0}catch{}}const r=()=>{const i=document.createElement("a");return i.href=t,i.target="_blank",i.rel="noopener noreferrer",document.body.appendChild(i),i.click(),i.remove(),!0};try{if(window.open(t,"_blank","noopener,noreferrer"))return!0}catch{}try{return r()}catch{try{return window.location.assign(t),!0}catch{return!1}}}function Lr(e,t){const n=URL.createObjectURL(t);Ho(n,e),URL.revokeObjectURL(n)}function Nr(e){const t=new TextEncoder().encode(e),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}function Yo(e){const t=e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e??[]),n=32768;let a="";for(let r=0;r<t.length;r+=n)a+=String.fromCharCode(...t.subarray(r,r+n));return btoa(a)}async function Wt(e,t,n={}){if(!A.isNativePlatform())return{saved:!1,reason:"not-native"};const a=Wo(e),r=$o(n.category,"exports"),i=`${fo}/${r}/${a}`,o=`Documents/${i}`,s=[{directory:tn.Documents,path:i,location:o},{directory:tn.ExternalStorage,path:o,location:o}].filter(c=>!!c.directory);let d=null;for(const c of s)try{const E=await Kr.writeFile({path:c.path,data:t,directory:c.directory,recursive:!0});return{saved:!0,uri:E?.uri??"",openUrl:E?.uri?A.convertFileSrc(E.uri):"",filename:a,location:c.location}}catch(E){d=E}return{saved:!1,reason:d?.message??"write-failed"}}function Wo(e){const t=String(e??"").trim(),n=`export_${Date.now()}.csv`;if(!t)return n;const i=(t.includes(".")?t:`${t}.csv`).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").slice(0,80);return i||n}function $o(e,t="exports"){return String(e??"").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"").toLowerCase()||t}async function vc(e,t,n={}){const a=JSON.stringify(t,null,2),r=Nr(a);return Wt(e,r,n)}async function Xc(e,t,n={}){const a=Nr(`\uFEFF${t}`);return Wt(e,a,n)}async function Fc(e,t,n={}){const a=t instanceof Blob?await t.arrayBuffer():t,r=Yo(a);return Wt(e,r,n)}function pr(e){return Math.max(1,Number(e??24)||24)}function qo(e,t=Date.now()){if(!e?.connected||!e?.autoEnabled)return!1;const n=String(e?.lastBackupAt??"").trim();if(!n)return!0;const a=Date.parse(n);if(!Number.isFinite(a))return!0;const r=pr(e?.intervalHours)*60*60*1e3;return t-a>=r}const Re="https://www.googleapis.com/drive/v3/files",fr="https://www.googleapis.com/upload/drive/v3/files";function _e(e,t={}){const n=zo(t);return delete n.Authorization,delete n.authorization,{...n,Authorization:`Bearer ${e}`}}function zo(e){return e?Array.isArray(e)?Object.fromEntries(e):typeof e.entries=="function"?Object.fromEntries(Array.from(e.entries())):typeof e=="object"?{...e}:{}:{}}async function le(e,t,n,a){const r=await fetch(n,a);if(r.status!==401||typeof t!="function")return r;const i=await t();return fetch(n,{...a,headers:_e(i,a?.headers??{})})}function Te(e,t){return e.ok?e:e.text().then(n=>{throw new Error(`${t}：${n||e.status}`)})}function Vo(e,t){const n=`strawmoneybook_${Math.random().toString(16).slice(2)}`,a=`\r
--${n}\r
`,r=`\r
--${n}--`;return{body:new Blob([a,`Content-Type: application/json; charset=UTF-8\r
\r
`,JSON.stringify(e),a,`Content-Type: application/json; charset=UTF-8\r
\r
`,t,r]),contentType:`multipart/related; boundary=${n}`}}async function Jo(e,t,n){const a=encodeURIComponent(`name='${n}' and 'appDataFolder' in parents and trashed=false`),r=encodeURIComponent("files(id,name,modifiedTime,size)"),i=`${Re}?spaces=appDataFolder&q=${a}&fields=${r}&orderBy=modifiedTime desc`,o=await le(e,t,i,{method:"GET",headers:_e(e)});await Te(o,"讀取 Google 備份清單失敗");const s=await o.json();return Array.isArray(s?.files)?s.files:[]}async function Qo(e,t,n){const a=`${Re}/${encodeURIComponent(n)}`,r=await le(e,t,a,{method:"DELETE",headers:_e(e)});await Te(r,"刪除重複備份失敗")}async function Zo(e,t,n,a){const r={name:n,parents:["appDataFolder"]},{body:i,contentType:o}=Vo(r,a),s=await le(e,t,`${fr}?uploadType=multipart&fields=id,name,modifiedTime`,{method:"POST",headers:_e(e,{"Content-Type":o}),body:i});return await Te(s,"建立 Google 備份失敗"),s.json()}async function es(e,t,n,a){const r=await le(e,t,`${fr}/${encodeURIComponent(n)}?uploadType=media`,{method:"PATCH",headers:_e(e,{"Content-Type":"application/json; charset=UTF-8"}),body:a});await Te(r,"更新 Google 備份失敗")}async function ts({accessToken:e,reauth:t,filename:n,jsonText:a}){let r=e;const i=typeof t=="function"?async()=>{const c=await t();return r=String(c??"").trim()||r,r}:null,o=await Jo(r,i,n),s=o[0]||null;if(s?.id){await es(r,i,s.id,a);for(const c of o.slice(1))c?.id&&await Qo(r,i,c.id);return{fileId:s.id,filename:n,modifiedTime:new Date().toISOString(),created:!1}}const d=await Zo(r,i,n,a);return{fileId:String(d?.id??""),filename:String(d?.name??n),modifiedTime:String(d?.modifiedTime??new Date().toISOString()),created:!0}}async function Ar({accessToken:e,reauth:t,pageSize:n=100}={}){const a=[];let r="";const i=Math.min(1e3,Math.max(1,Number(n)||100)),o=encodeURIComponent("nextPageToken,files(id,name,modifiedTime,size)");do{let s=`${Re}?spaces=appDataFolder&fields=${o}&orderBy=modifiedTime desc&pageSize=${i}`;r&&(s+=`&pageToken=${encodeURIComponent(r)}`);const d=await le(e,t,s,{method:"GET",headers:_e(e)});await Te(d,"讀取 Google 備份清單失敗");const c=await d.json(),E=Array.isArray(c?.files)?c.files:[];a.push(...E),r=String(c?.nextPageToken??"").trim()}while(r);return a}async function ns({accessToken:e,reauth:t,fileId:n,pageSize:a=200}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=[];let o="";const s=Math.min(1e3,Math.max(1,Number(a)||200)),d=encodeURIComponent("nextPageToken,revisions(id,modifiedTime,size,keepForever)");do{let c=`${Re}/${encodeURIComponent(r)}/revisions?fields=${d}&pageSize=${s}`;o&&(c+=`&pageToken=${encodeURIComponent(o)}`);const E=await le(e,t,c,{method:"GET",headers:_e(e)});await Te(E,"讀取 Google Drive 檔案版本失敗");const u=await E.json(),T=Array.isArray(u?.revisions)?u.revisions:[];i.push(...T),o=String(u?.nextPageToken??"").trim()}while(o);return i.map(c=>({id:String(c?.id??"").trim(),modifiedTime:String(c?.modifiedTime??"").trim(),size:c?.size!=null?String(c.size):"",keepForever:!!c?.keepForever})).filter(c=>c.id).sort((c,E)=>String(E.modifiedTime).localeCompare(String(c.modifiedTime)))}async function Or({accessToken:e,reauth:t,fileId:n,revisionId:a}={}){const r=String(n??"").trim();if(!r)throw new Error("缺少 Google Drive 檔案 id");const i=String(a??"").trim(),o=i?`${Re}/${encodeURIComponent(r)}/revisions/${encodeURIComponent(i)}?alt=media`:`${Re}/${encodeURIComponent(r)}?alt=media`,s=await le(e,t,o,{method:"GET",headers:_e(e)});return await Te(s,"下載 Google 備份失敗"),s.text()}function Sr(e){const t=e?.deleted_at;return t==null?!1:String(t).trim()!==""}function rs(e){const t=String(e??"").trim();if(!t)return"";const n=t.match(/^(\d{4})-(\d{2})/);if(n)return`${n[1]}-${n[2]}`;const a=Date.parse(t);if(!Number.isFinite(a))return"";const r=new Date(a);if(Number.isNaN(r.getTime()))return"";const i=r.getUTCFullYear(),o=String(r.getUTCMonth()+1).padStart(2,"0");return`${i}-${o}`}function as(e){return!e||typeof e!="object"?[]:Array.isArray(e.ledgers)&&e.backup_scope==="all_ledgers"?e.ledgers.filter(t=>t&&typeof t=="object"):e.tables&&typeof e.tables=="object"?[e]:[]}function is(e){const t=Array.isArray(e?.tables?.ledgers)?e.tables.ledgers:[],n=t.find(i=>i&&!Sr(i))||t[0],a=String(n?.name??e?.ledger_name??"").trim();return a||String(e?.ledger_id??n?.id??"").trim()||""}function os(e){const t=Array.isArray(e?.tables?.transactions)?e.tables.transactions:[];let n=0;const a=Object.create(null);for(const r of t){if(!r||typeof r!="object"||Sr(r))continue;n+=1;const i=rs(r.occurred_at);i&&(a[i]=(a[i]||0)+1)}return{count:n,monthDistribution:a}}function ss(...e){const t=Object.create(null);for(const n of e)if(!(!n||typeof n!="object"))for(const[a,r]of Object.entries(n))t[a]=(t[a]||0)+Number(r||0);return t}function ve(e){const t={ok:!1,parseError:"",backupScope:"",exportedAt:"",ledgerNames:[],ledgerCount:0,transactionCount:0,monthDistribution:{},months:[],earliestMonth:"",latestMonth:""};if(!e||typeof e!="object")return{...t,parseError:"invalid_payload"};const n=as(e);if(!n.length)return{...t,parseError:"missing_ledgers",backupScope:String(e.backup_scope??"").trim(),exportedAt:String(e.exported_at??"").trim()};const a=[];let r=0,i=Object.create(null);for(const s of n){const d=is(s);d&&a.push(d);const c=os(s);r+=c.count,i=ss(i,c.monthDistribution)}const o=Object.keys(i).sort();return{ok:!0,parseError:"",backupScope:String(e.backup_scope??(n.length>1?"all_ledgers":"single")).trim(),exportedAt:String(e.exported_at??"").trim(),ledgerNames:a,ledgerCount:n.length,transactionCount:r,monthDistribution:i,months:o,earliestMonth:o[0]||"",latestMonth:o[o.length-1]||""}}function Rr(e){const t=String(e??"");if(!t.trim())return ve(null);try{return ve(JSON.parse(t))}catch{return{...ve(null),parseError:"json_parse_error"}}}function cs(e,t,n={}){const a=e&&typeof e=="object"?e:{},r=t&&typeof t=="object"?t:{},i=String(n.remoteModifiedAt??a.exportedAt??"").trim(),o=String(n.localModifiedAt??r.exportedAt??"").trim();let s="unknown";const d=Date.parse(i),c=Date.parse(o);Number.isFinite(d)&&Number.isFinite(c)&&(d<c-1e3?s="older":d>c+1e3?s="newer":s="same");const E=Array.isArray(a.months)?a.months:[],u=Array.isArray(r.months)?r.months:[],T=new Set(E),m=new Set(u),L=u.filter(S=>!T.has(S)),v=E.filter(S=>!m.has(S));let f="unknown";!a.ok&&!r.ok?f="unknown":!E.length&&!u.length||!L.length&&!v.length?f="equal":!L.length&&v.length?f="remote_wider":L.length&&!v.length?f="remote_narrower":E.length&&u.length?f="overlapping":f="disjoint";const M=Number(r.transactionCount??0)||0,V=Number(a.transactionCount??0)||0,re=!!(a.ok&&r.ok&&(L.length>0||M>0&&V<M));return{ageRelation:s,coverage:f,monthsOnlyInLocal:L,monthsOnlyInRemote:v,localTxCount:M,remoteTxCount:V,warnIncompleteRemote:re,warnOlderRemote:s==="older",warnNewerRemote:s==="newer"}}function Mc(e,{limit:t=8}={}){const n=Object.entries(e||{}).sort(([i],[o])=>i.localeCompare(o));if(!n.length)return"";const a=n.slice(0,Math.max(1,t)).map(([i,o])=>`${i}:${o}`),r=n.length-a.length;return r>0?`${a.join(", ")} (+${r})`:a.join(", ")}const ds=["ledgers","account_groups","accounts","category_groups","categories","transactions","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"],_s=Object.freeze({app_settings:"key",bank_sync_rules:"connection_id",savings_jars:"account_id"});function h(e){return JSON.parse(JSON.stringify(e??null))}function l(e){return String(e??"").trim()}function de(e){if(e==null||e==="")return Number.NaN;if(e instanceof Date){const a=e.getTime();return Number.isFinite(a)?a:Number.NaN}if(typeof e=="number")return Number.isFinite(e)?Math.abs(e)<1e11?Math.round(e*1e3):Math.round(e):Number.NaN;const t=l(e);if(!t)return Number.NaN;if(/^-?\d+(\.\d+)?$/.test(t))return de(Number(t));const n=Date.parse(t);return Number.isFinite(n)?n:Number.NaN}function it(e){const t=de(e);return Number.isFinite(t)?new Date(t).toISOString():""}function g(e,t){const n=e?.tables?.[t];return Array.isArray(n)?n.map(a=>h(a)):[]}function $t(e,t){const n=ds.filter(r=>r!=="deleted_log"),a=new Set;for(const r of[e,t]){const i=r?.tables&&typeof r.tables=="object"?Object.keys(r.tables):[];for(const o of i){const s=l(o);!s||s==="deleted_log"||n.includes(s)||a.add(s)}}return[...n,...Array.from(a).sort((r,i)=>r.localeCompare(i))]}function O(e,t,n=0){const a=_s[e];if(a){const i=l(t?.[a]);if(i)return i}const r=l(t?.id);return r||`__row_${e}_${n}_${JSON.stringify(t??{})}`}function P(e){const t=[e?.deleted_at,e?.updated_at,e?.occurred_at,e?.posted_at,e?.paid_at,e?.received_at,e?.submitted_at,e?.approved_at,e?.settled_at,e?.last_seen_at,e?.first_seen_at,e?.last_sync_at,e?.created_at];for(const n of t){const a=de(n);if(Number.isFinite(a))return a}return 0}function Ye(e,t){return[...t].sort((n,a)=>{const r=O(e,n),i=O(e,a),o=r.localeCompare(i);if(o!==0)return o;const s=P(n)-P(a);return s!==0?s:JSON.stringify(n).localeCompare(JSON.stringify(a))})}function qt(e){return[...e].sort((t,n)=>{const a=l(t?.table_name),r=l(n?.table_name),i=a.localeCompare(r);if(i!==0)return i;const o=l(t?.row_pk),s=l(n?.row_pk),d=o.localeCompare(s);if(d!==0)return d;const c=P(t)-P(n);return c!==0?c:JSON.stringify(t).localeCompare(JSON.stringify(n))})}function p(e=[],t="id"){return new Set(e.map(n=>l(n?.[t])).filter(Boolean))}function Le(e,t=[],n=new Set){let a=e;for(const r of t){const i=l(a?.[r]);i&&!n.has(i)&&(a={...a,[r]:null})}return a}const y=Object.freeze({created_at:"1970-01-01T00:00:00.000Z",updated_at:"1970-01-01T00:00:00.000Z"});function D(e,t,n,a){const r=p(e[t]),i=[];for(const o of n){const s=l(o);!s||r.has(s)||(i.push(a(s)),r.add(s))}return i.length===0?0:(e[t]=Ye(t,[...g({tables:e},t),...i]),i.length)}function R(e,t){const n=new Set;for(const a of e){const r=l(a?.[t]);r&&n.add(r)}return n}function Es(e,t,n="system_fk_preserve_accounts"){return t.synthesizedAccountGroups+=D(e,"account_groups",[n],a=>({id:a,name:"資料保全群組",type:"other",sort_order:9999,is_archived:1,...y})),n}function ie(e,t,n){if(!n?.length)return 0;const a=Es(e,t);return D(e,"accounts",n,r=>({id:r,group_id:a,name:"資料保全帳戶",account_type:"asset",account_kind:"cash",allow_negative:1,opening_balance_minor:0,currency_code:"TWD",include_in_assets:0,include_in_group_statistics:0,sort_order:9999,is_archived:1,...y}))}function bt(e,t,n){if(!n?.length)return 0;const a="system_fk_preserve_categories";return t.synthesizedCategoryGroups+=D(e,"category_groups",[a],r=>({id:r,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...y})),D(e,"categories",n,r=>({id:r,group_id:a,name:"資料保全分類",type:"expense",sort_order:9999,is_archived:1,...y}))}function us(e){const t={...e},n={synthesizedAccountGroups:0,synthesizedAccounts:0,synthesizedCategoryGroups:0,synthesizedCategories:0,synthesizedCounterparties:0,synthesizedBudgets:0,synthesizedBankConnections:0,synthesizedLoans:0,nulledOptionalRefs:0,droppedChildRows:0},a=g({tables:t},"accounts");n.synthesizedAccountGroups+=D(t,"account_groups",R(a,"group_id"),_=>({id:_,name:"資料保全群組",type:"other",sort_order:9999,is_archived:1,...y})),t.accounts=a;let r=p(t.accounts);const i=g({tables:t},"categories");n.synthesizedCategoryGroups+=D(t,"category_groups",R(i,"group_id"),_=>({id:_,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...y})),t.categories=i;let o=p(t.categories);const s=g({tables:t},"transactions"),d=[...R(s,"account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ie(t,n,d),r=p(t.accounts);const c=[...R(s,"peer_account_id")].filter(_=>!r.has(_));n.synthesizedAccounts+=ie(t,n,c),r=p(t.accounts);const E=[...R(s,"category_id")].filter(_=>!o.has(_));n.synthesizedCategories+=bt(t,n,E),o=p(t.categories),t.transactions=s;const u=p(t.transactions);t.transaction_attachments=g({tables:t},"transaction_attachments");const T=g({tables:t},"loans");n.synthesizedCounterparties+=D(t,"counterparties",R(T,"counterparty_id"),_=>({id:_,name:"資料保全往來對象",...y})),t.loans=T;let m=p(t.loans);const L=g({tables:t},"loan_payments"),v=[...R(L,"loan_id")].filter(_=>!m.has(_));n.synthesizedLoans+=D(t,"loans",v,_=>({id:_,counterparty_id:null,principal_minor:0,status:"active",...y})),m=p(t.loans),n.synthesizedAccounts+=ie(t,n,[...R(L,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.loan_payments=L.map(_=>Le(_,["generated_tx_id","generated_interest_tx_id"],u));const f=g({tables:t},"reimbursement_advances");n.synthesizedAccounts+=ie(t,n,[...R(f,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.reimbursement_advances=f.map(_=>Le(_,["source_tx_id"],u));const M=p(t.reimbursement_advances),V=g({tables:t},"reimbursement_advance_usages"),re=[...R(V,"advance_id")].filter(_=>!M.has(_));if(re.length>0){const _="system_fk_preserve_advance_account";n.synthesizedAccounts+=ie(t,n,[_]),r=p(t.accounts),D(t,"reimbursement_advances",re,B=>({id:B,account_id:_,amount_minor:0,...y}))}t.reimbursement_advance_usages=V.map(_=>{const B=l(_?.expense_tx_id),H=Le(_,["expense_tx_id"],u);return B&&!l(H?.expense_tx_id)&&(n.nulledOptionalRefs+=1),H});const Ce=g({tables:t},"reimbursements");n.synthesizedCounterparties+=D(t,"counterparties",R(Ce,"counterparty_id"),_=>({id:_,name:"資料保全往來對象",...y})),t.reimbursements=Ce.map(_=>{const B=l(_?.paid_tx_id),H=Le(_,["paid_tx_id"],u);return B&&!l(H?.paid_tx_id)&&(n.nulledOptionalRefs+=1),H});const Ue=p(t.reimbursements),S=g({tables:t},"reimbursement_items"),U=[...R(S,"reimbursement_id")].filter(_=>!Ue.has(_));D(t,"reimbursements",U,_=>({id:_,title:"資料保全請款",status:"open",total_minor:0,...y})),n.synthesizedAccounts+=ie(t,n,[...R(S,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),n.synthesizedCategories+=bt(t,n,[...R(S,"category_id")].filter(_=>!o.has(_))),o=p(t.categories),t.reimbursement_items=S.map(_=>{const B=l(_?.transaction_id),H=Le(_,["transaction_id"],u);return B&&!l(H?.transaction_id)&&(n.nulledOptionalRefs+=1),H});const x=g({tables:t},"budgets");t.budgets=x;let w=p(t.budgets);const K=g({tables:t},"budget_containers"),ae=[...R(K,"budget_id")].filter(_=>!w.has(_));n.synthesizedBudgets+=D(t,"budgets",ae,_=>({id:_,month_key:"1970-01",...y})),w=p(t.budgets),t.budget_containers=K;const J=g({tables:t},"budget_items"),me=[...R(J,"budget_id")].filter(_=>!w.has(_));n.synthesizedBudgets+=D(t,"budgets",me,_=>({id:_,month_key:"1970-01",...y})),w=p(t.budgets),n.synthesizedCategories+=bt(t,n,J.filter(_=>l(_?.scope_type)==="category").map(_=>l(_?.category_id)).filter(_=>_&&!o.has(_))),o=p(t.categories),n.synthesizedCategoryGroups+=D(t,"category_groups",J.filter(_=>l(_?.scope_type)==="group").map(_=>l(_?.category_group_id)).filter(_=>_&&!p(t.category_groups).has(_)),_=>({id:_,name:"資料保全分類群組",type:"expense",sort_order:9999,is_archived:1,...y})),t.budget_items=J;const qe=g({tables:t},"savings_jars");n.synthesizedAccounts+=ie(t,n,[...R(qe,"account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.savings_jars=qe;const xr=g({tables:t},"bank_connections");t.bank_connections=xr;let Q=p(t.bank_connections);const Lt=g({tables:t},"bank_accounts"),Br=[...R(Lt,"connection_id")].filter(_=>!Q.has(_));n.synthesizedBankConnections+=D(t,"bank_connections",Br,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...y})),Q=p(t.bank_connections),n.synthesizedAccounts+=ie(t,n,[...R(Lt,"mapped_account_id")].filter(_=>!r.has(_))),r=p(t.accounts),t.bank_accounts=Lt;let Qt=p(t.bank_accounts);const Nt=g({tables:t},"bank_transactions"),Gr=[...R(Nt,"connection_id")].filter(_=>!Q.has(_));n.synthesizedBankConnections+=D(t,"bank_connections",Gr,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...y})),Q=p(t.bank_connections);const Zt=[...R(Nt,"bank_account_id")].filter(_=>!Qt.has(_));if(Zt.length>0){const _=[...Q][0]||"system_fk_preserve_bank_connection";[...Q].length||(n.synthesizedBankConnections+=D(t,"bank_connections",[_],B=>({id:B,provider:"fk_preserve",display_name:"資料保全銀行連線",...y})),Q=p(t.bank_connections)),D(t,"bank_accounts",Zt,B=>({id:B,connection_id:[...Q][0],display_name:"資料保全銀行帳戶",...y})),Qt=p(t.bank_accounts)}t.bank_transactions=Nt.map(_=>{const B=l(_?.imported_txn_id),H=Le(_,["imported_txn_id"],u);return B&&!l(H?.imported_txn_id)&&(n.nulledOptionalRefs+=1),H});const en=g({tables:t},"bank_sync_rules"),Pr=[...R(en,"connection_id")].filter(_=>!Q.has(_));return n.synthesizedBankConnections+=D(t,"bank_connections",Pr,_=>({id:_,provider:"fk_preserve",display_name:"資料保全銀行連線",...y})),t.bank_sync_rules=en,n.droppedChildRows=0,t.__fk_preserve_report=n,t}function ls(e){try{const t=JSON.parse(String(e?.payload_json??"{}"));return t&&typeof t=="object"?t:null}catch{return null}}function Ts(e=[]){let t=0;for(const n of e)t=Math.max(t,P(n));return t}function ms(e,t){const n={...e},a=(r,i,o)=>{const s=l(i);if(!s||p(n[r]).has(s))return;const c=`${r}::${s}`,E=t.get(c);if(!E)return;const u=de(E.deleted_at),T=Ts(o);if(!Number.isFinite(u)||!(T>u))return;const m=ls(E);if(!m)return;const L={...h(m),id:s,updated_at:it(m.updated_at)||it(T)||new Date().toISOString()};n[r]=Ye(r,[...g({tables:n},r),L]),t.delete(c)};for(const r of g({tables:n},"transactions"))a("accounts",r?.account_id,[r]),a("accounts",r?.peer_account_id,[r]),a("categories",r?.category_id,[r]);for(const r of g({tables:n},"accounts"))a("account_groups",r?.group_id,[r,...g({tables:n},"transactions").filter(i=>l(i?.account_id)===l(r?.id)||l(i?.peer_account_id)===l(r?.id))]);for(const r of g({tables:n},"categories"))a("category_groups",r?.group_id,[r,...g({tables:n},"transactions").filter(i=>l(i?.category_id)===l(r?.id))]);return n}function gs(e){if(!e||typeof e!="object")return null;const t=l(e.table_name),n=l(e.row_pk);if(!t||!n)return null;const a=it(e.deleted_at||e.updated_at||e.created_at)||new Date().toISOString();return{...h(e),table_name:t,row_pk:n,payload_json:String(e?.payload_json??"{}"),deleted_at:a}}function zt(e=[]){const t=new Map;for(const n of e){const a=gs(n);if(!a)continue;const r=`${a.table_name}::${a.row_pk}`,i=de(a.deleted_at),o=t.get(r),s=de(o?.deleted_at);(!o||i>=s)&&t.set(r,a)}return t}function Ne(e,t){return JSON.stringify(e)===JSON.stringify(t)}function Ls(e,t,n="remote"){return br(e,t,n).row}function be(e,t){return`${e}::${t}`}function br(e,t,n="remote"){if(!e&&!t)return{row:null,source:"none"};if(!e)return{row:h(t),source:"remote"};if(!t)return{row:h(e),source:"local"};if(Ne(e,t))return{row:h(e),source:"same"};const a=P(e),r=P(t);if(a>r)return{row:h(e),source:"local"};if(r>a)return{row:h(t),source:"remote"};const i=n==="local"?"local":"remote";return{row:h(i==="local"?e:t),source:i}}function Xt(e,t,n){for(const[a,r]of g({tables:e},t).entries())if(O(t,r,a)===n)return r;return null}function G(e,t,n,a,r){const i=l(n);if(!i||!a||!r)return;const o=`${t}::${i}`;e.has(o)||e.set(o,{type:t,unitKey:i,members:[]});const s=e.get(o);s.members.some(d=>d.tableName===a&&d.rowKey===r)||s.members.push({tableName:a,rowKey:r})}function Ns(e,t){const n=new Map;for(const a of[e,t])for(const r of g({tables:a},"transactions")){const i=l(r?.transfer_group_id);if(!i)continue;const o=O("transactions",r);G(n,"transfer_group",i,"transactions",o)}for(const a of[e,t])for(const r of g({tables:a},"loan_payments")){const i=l(r?.id)||O("loan_payments",r);G(n,"loan_payment_bundle",i,"loan_payments",O("loan_payments",r));for(const o of[r?.generated_tx_id,r?.generated_interest_tx_id]){const s=l(o);if(!s)continue;const d=g({tables:a},"transactions").find(c=>l(c?.id)===s);d&&G(n,"loan_payment_bundle",i,"transactions",O("transactions",d))}}for(const a of[e,t])for(const r of g({tables:a},"reimbursements")){const i=l(r?.id);if(i){G(n,"reimbursement_bundle",i,"reimbursements",O("reimbursements",r));for(const o of g({tables:a},"reimbursement_items"))l(o?.reimbursement_id)===i&&G(n,"reimbursement_bundle",i,"reimbursement_items",O("reimbursement_items",o))}}for(const a of[e,t])for(const r of g({tables:a},"reimbursement_advances")){const i=l(r?.id);if(i){G(n,"advance_bundle",i,"reimbursement_advances",O("reimbursement_advances",r));for(const o of g({tables:a},"reimbursement_advance_usages"))l(o?.advance_id)===i&&G(n,"advance_bundle",i,"reimbursement_advance_usages",O("reimbursement_advance_usages",o))}}for(const a of[e,t])for(const r of g({tables:a},"credit_statements")){const i=l(r?.account_id);if(!i)continue;const o=i;G(n,"credit_card_bundle",o,"credit_statements",O("credit_statements",r));const s=g({tables:a},"accounts").find(c=>l(c?.id)===i);s&&G(n,"credit_card_bundle",o,"accounts",O("accounts",s));for(const c of g({tables:a},"credit_repayments")){if(l(c?.account_id)!==i)continue;G(n,"credit_card_bundle",o,"credit_repayments",O("credit_repayments",c));const E=l(c?.id);for(const u of g({tables:a},"credit_repayment_allocations"))l(u?.repayment_id)===E&&G(n,"credit_card_bundle",o,"credit_repayment_allocations",O("credit_repayment_allocations",u))}const d=l(r?.id);for(const c of g({tables:a},"transaction_postings")){if(l(c?.statement_id)!==d)continue;G(n,"credit_card_bundle",o,"transaction_postings",O("transaction_postings",c));const E=l(c?.transaction_id);if(!E)continue;const u=g({tables:a},"transactions").find(T=>l(T?.id)===E);u&&G(n,"credit_card_bundle",o,"transactions",O("transactions",u))}}return Array.from(n.values())}function ps(e,t,n,a){let r=0,i=0;for(const o of e.members){const s=Xt(t,o.tableName,o.rowKey),d=Xt(n,o.tableName,o.rowKey);s&&(r=Math.max(r,P(s))),d&&(i=Math.max(i,P(d)))}return r>i?"local":i>r?"remote":a==="local"?"local":"remote"}function fs(e,t,n,a){const r=(e[t]??[]).filter((i,o)=>O(t,i,o)!==n);a&&r.push(h(a)),e[t]=Ye(t,r)}function yr({mergedTables:e,rowDecisions:t,localTables:n,remoteTables:a,prefer:r}){const i=[],o={...e};for(const s of Ns(n,a)){const d=new Set;for(const u of s.members){const T=t.get(be(u.tableName,u.rowKey));(T?.source==="local"||T?.source==="remote")&&d.add(T.source)}if(d.size<2)continue;const c=ps(s,n,a,r);i.push({tableName:s.members[0]?.tableName??"",rowKey:s.unitKey,conflictType:s.type,unitKey:s.unitKey,resolution:c});const E=c==="local"?n:a;for(const u of s.members){const T=Xt(E,u.tableName,u.rowKey);fs(o,u.tableName,u.rowKey,T),t.set(be(u.tableName,u.rowKey),{source:T?c:"none",row:T?h(T):null})}}return{conflicts:i,mergedTables:o}}function Dr(e,t,n){const a=[];for(const[r,i]of t.entries()){const o=`${e}::${r}`,s=n.get(o),d=P(i),c=de(s?.deleted_at);s&&Number.isFinite(c)&&c>=d||(s&&d>c&&n.delete(o),a.push(i))}return Ye(e,a)}function As(e,t,n={}){const a=n?.prefer==="local"?"local":"remote",r=$t(e,t),i=zt([...g(e,"deleted_log"),...g(t,"deleted_log")]),o={},s=new Map;for(const c of r){const E=new Map;for(const[u,T]of g(e,c).entries()){const m=O(c,T,u),L=h(T);E.set(m,L),s.set(be(c,m),{source:"local",row:L})}for(const[u,T]of g(t,c).entries()){const m=O(c,T,u),L=br(E.get(m),T,a);L.row?E.set(m,L.row):E.delete(m),s.set(be(c,m),L)}o[c]=Dr(c,E,i)}o.deleted_log=qt(Array.from(i.values()));const d=yr({mergedTables:o,rowDecisions:s,localTables:e.tables,remoteTables:t.tables,prefer:a});return{mergedTables:d.mergedTables,conflicts:d.conflicts}}function q(e){const t=h(e);if(!t||typeof t!="object")return{schema_version:null,ledger_id:"",exported_at:"",tables:{}};const n=$t(t,null),a=zt(g(t,"deleted_log")),r={};for(const c of n){const E=new Map;for(const[T,m]of g(t,c).entries()){const L=O(c,m,T),v=E.get(L);E.set(L,Ls(v,m,"remote"))}const u=[];for(const[T,m]of E.entries()){const L=`${c}::${T}`,v=a.get(L),f=P(m),M=de(v?.deleted_at);v&&Number.isFinite(M)&&M>=f||(v&&f>M&&a.delete(L),u.push(m))}r[c]=Ye(c,u)}const i=ms(r,a),o=us(i),s=o.__fk_preserve_report||null;delete o.__fk_preserve_report,o.deleted_log=qt(Array.from(a.values()));const d={schema_version:t.schema_version??null,ledger_id:l(t.ledger_id),exported_at:it(t.exported_at),tables:o};return s&&(d.fk_preserve_report=s),d}function Os(e){return q(e)}function xc(e,t,n={}){const a=q(e),r=q(t),i=l(a.ledger_id||r.ledger_id);if(a.ledger_id&&r.ledger_id&&a.ledger_id!==r.ledger_id)throw new Error("共同帳本快照 ledger_id 不一致，無法合併");const{mergedTables:o,conflicts:s}=As(a,r,n),d=q({schema_version:r.schema_version??a.schema_version??null,ledger_id:i,exported_at:new Date().toISOString(),tables:o});return n?.detectConflicts?{mergedSnapshot:d,conflicts:s,hasConflicts:s.length>0}:d}function Bc(e,t,n,a={}){const r=q(e),i=q(t),o=q(n),s=l(i.ledger_id||o.ledger_id||r.ledger_id);if(i.ledger_id&&o.ledger_id&&i.ledger_id!==o.ledger_id)throw new Error("共同帳本快照 ledger_id 不一致，無法合併");const d=a?.prefer==="local"?"local":"remote",c=$t(i,o),E=zt([...g(r,"deleted_log"),...g(i,"deleted_log"),...g(o,"deleted_log")]),u={},T=[],m=new Map;for(const f of c){const M=new Map;for(const[S,U]of g(r,f).entries())M.set(O(f,U,S),h(U));const V=new Map;for(const[S,U]of g(i,f).entries())V.set(O(f,U,S),h(U));const re=new Map;for(const[S,U]of g(o,f).entries())re.set(O(f,U,S),h(U));const Ce=new Set([...M.keys(),...V.keys(),...re.keys()]),Ue=new Map;for(const S of Ce){const U=M.get(S)??null,x=V.get(S)??null,w=re.get(S)??null;let K=null,ae="same";if(Ne(x,U))K=w,ae=w&&!Ne(w,U)?"remote":"same";else if(Ne(w,U))K=x,ae=x&&!Ne(x,U)?"local":"same";else if(Ne(x,w))K=x,ae="same";else{const J=P(x),me=P(w);if(J!==me){const qe=me>J;K=d==="local"?J>=me?x:w:me>=J?w:x,ae=qe?"remote":"local"}else K=d==="local"?x:w,ae=d;T.push({tableName:f,rowKey:S,baseRow:U,localRow:x,remoteRow:w,chosenRow:K,resolution:d})}if(!K){m.set(be(f,S),{source:"none",row:null});continue}Ue.set(S,K),m.set(be(f,S),{source:ae,row:K})}u[f]=Dr(f,Ue,E)}u.deleted_log=qt(Array.from(E.values()));const L=yr({mergedTables:u,rowDecisions:m,localTables:i.tables,remoteTables:o.tables,prefer:d});return T.push(...L.conflicts),{mergedSnapshot:q({schema_version:o.schema_version??i.schema_version??r.schema_version??null,ledger_id:s,exported_at:new Date().toISOString(),tables:L.mergedTables}),conflicts:T,hasConflicts:T.length>0}}function Gc(e=[],t={}){const n=t?.prefer==="local"?"local":"remote",a=l(t?.mergeMode)||"unknown",r=Array.isArray(e)?e:[];return{mergeMode:a,prefer:n,conflictCount:r.length,conflicts:r.map(i=>({tableName:l(i?.tableName),rowKey:l(i?.rowKey),conflictType:l(i?.conflictType)||"row",unitKey:l(i?.unitKey),resolution:l(i?.resolution)||n})),recordedAt:new Date().toISOString()}}function Pc(e,t){const n=q(e),a=q(t),r={schema_version:n.schema_version??null,ledger_id:n.ledger_id,tables:n.tables},i={schema_version:a.schema_version??null,ledger_id:a.ledger_id,tables:a.tables};return JSON.stringify(r)===JSON.stringify(i)}const Ss=Object.freeze(["account_groups","accounts","category_groups","categories","transactions","wear_applied","transaction_attachments","counterparties","loans","loan_payments","reimbursement_advances","reimbursement_advance_usages","reimbursements","reimbursement_items","budget_save_settlements","budgets","budget_containers","budget_items","savings_jars","securities","security_transactions","credit_statements","credit_repayments","credit_repayment_allocations","transaction_postings","bank_connections","bank_accounts","bank_transactions","bank_sync_rules","app_settings","deleted_log"]);function N(...e){return Object.freeze(new Set(e))}function I(e){const t={};for(const[n,a]of Object.entries(e))t[n]=Object.freeze([...a]);return Object.freeze(t)}const Rs=Object.freeze({account_groups:{columns:N("ledger_id","id","name","type","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","type","created_at","updated_at"]),enums:I({type:["cash","bank","ewallet","credit_card","other"]})},accounts:{columns:N("ledger_id","id","group_id","name","account_type","account_kind","allow_negative","opening_balance_minor","currency_code","icon","credit_limit_minor","repayment_reminder_day","statement_close_day","payment_due_day","card_last4","issuer","sort_order","is_archived","created_at","updated_at","deleted_at","include_in_assets","include_in_group_statistics","is_settlement"),required:Object.freeze(["id","group_id","name","created_at","updated_at"]),enums:I({account_type:["asset","liability"],account_kind:["cash","credit"]})},category_groups:{columns:N("ledger_id","id","name","kind","sort_order","is_archived","created_at","updated_at","deleted_at"),required:Object.freeze(["id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},categories:{columns:N("ledger_id","id","group_id","name","kind","icon","is_budgetable","sort_order","is_archived","created_at","updated_at","deleted_at","default_include_in_analysis","default_include_in_budget","default_is_reimbursable","system_key"),required:Object.freeze(["id","group_id","name","kind","created_at","updated_at"]),enums:I({kind:["expense","income","both"]})},transactions:{columns:N("ledger_id","id","type","transfer_group_id","account_id","peer_account_id","category_id","amount_minor","occurred_at","posted_at","note","location","tags_json","origin_type","external_ref_id","idempotency_key","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at","is_reimbursable","reimbursement_state","reimbursed_at","reimburse_target_minor","created_by_user_id","created_by_display_name","updated_by_user_id","updated_by_display_name"),required:Object.freeze(["id","type","account_id","amount_minor","occurred_at","created_at","updated_at"]),enums:I({type:["expense","income","adjustment","transfer"],origin_type:["manual","loan_payment","reimbursement","import","recurring","refund","wear"],reimbursement_state:["none","pending","reimbursed"]})},wear_applied:{columns:N("idempotency_key","ledger_id","tx_id","applied_at"),required:Object.freeze(["idempotency_key","ledger_id","tx_id","applied_at"])},transaction_attachments:{columns:N("ledger_id","id","transaction_id","file_uri","mime_type","file_size","checksum","created_at"),required:Object.freeze(["id","transaction_id","file_uri","mime_type","file_size","created_at"])},counterparties:{columns:N("ledger_id","id","name","contact_json","note","is_archived","created_at","updated_at"),required:Object.freeze(["id","name","created_at","updated_at"])},loans:{columns:N("ledger_id","id","counterparty_id","direction","principal_minor","interest_rule_json","start_date","due_date","status","settled_at","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","counterparty_id","direction","principal_minor","start_date","status","created_at","updated_at"]),enums:I({direction:["lend","borrow"],status:["active","partial","settled","void"]})},loan_payments:{columns:N("ledger_id","id","loan_id","account_id","paid_at","amount_minor","principal_component_minor","interest_component_minor","generated_tx_id","generated_interest_tx_id","note","created_at","updated_at"),required:Object.freeze(["id","loan_id","account_id","paid_at","amount_minor","created_at","updated_at"])},reimbursement_advances:{columns:N("ledger_id","id","account_id","source_tx_id","amount_minor","used_minor","note","received_at","created_at","updated_at","deleted_at","category_id","return_amount_minor"),required:Object.freeze(["id","account_id","received_at","created_at","updated_at"])},reimbursement_advance_usages:{columns:N("ledger_id","id","advance_id","expense_tx_id","amount_minor","created_at","updated_at"),required:Object.freeze(["id","advance_id","expense_tx_id","created_at","updated_at"])},reimbursements:{columns:N("ledger_id","id","title","counterparty_id","status","submitted_at","approved_at","paid_at","paid_tx_id","total_minor","note","idempotency_key","created_at","updated_at","deleted_at"),required:Object.freeze(["id","title","status","created_at","updated_at"]),enums:I({status:["draft","submitted","in_review","approved","paid","rejected"]})},reimbursement_items:{columns:N("ledger_id","id","reimbursement_id","source_type","transaction_id","category_id","account_id","description","amount_minor","occurred_at","attachment_uri","created_at","updated_at","entry_type"),required:Object.freeze(["id","reimbursement_id","source_type","amount_minor","occurred_at","created_at","updated_at"]),enums:I({source_type:["transaction","manual","advance"],entry_type:["expense","income"]})},budget_save_settlements:{columns:N("ledger_id","id","scope_type","scope_ref_id","period_key","source_account_id","target_account_id","settled_amount_minor","status","transfer_group_id","last_error","created_at","updated_at"),required:Object.freeze(["id","scope_type","scope_ref_id","period_key","status","created_at","updated_at"]),enums:I({scope_type:["budget_item_day","budget_item_month","budget_total_month"],status:["settled","skipped_no_surplus","invalid_config","conflict","failed"]})},budgets:{columns:N("ledger_id","id","month_key","name","include_transfers","include_loan_repayments","include_reimbursed_expenses","created_at","updated_at","deleted_at","budget_save_total_enabled","budget_save_total_target_account_id","budget_save_total_source_account_id","period_key","period_start_date","period_end_date","period_mode"),required:Object.freeze(["id","month_key","created_at","updated_at"])},budget_containers:{columns:N("ledger_id","id","budget_id","name","amount_minor","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","sort_order","created_at","updated_at","period_mode"),required:Object.freeze(["id","budget_id","name","created_at","updated_at"])},budget_items:{columns:N("ledger_id","id","budget_id","scope_type","category_id","category_group_id","amount_minor","sort_order","created_at","updated_at","amount_mode","day_rule_unit","day_rule_values_json","budget_save_enabled","budget_save_target_account_id","budget_save_source_account_id","budget_container_id"),required:Object.freeze(["id","budget_id","scope_type","amount_minor","created_at","updated_at"]),enums:I({scope_type:["category","group"],amount_mode:["fixed","daily_average"],day_rule_unit:["none","weekday","monthday"]})},savings_jars:{columns:N("ledger_id","account_id","goal_type","target_amount_minor","created_at","updated_at","auto_save_source_account_id","auto_save_amount_minor","auto_save_interval_value","auto_save_interval_unit","auto_save_start_date","auto_save_charge_day","auto_save_paused"),required:Object.freeze(["account_id","created_at","updated_at"]),enums:I({goal_type:["open","target"]})},securities:{columns:N("ledger_id","id","symbol","name","market","asset_class","currency_code","include_in_assets","manual_price_minor","manual_price_at","price_source","sort_order","is_archived","settlement_account_id","created_at","updated_at","deleted_at"),required:Object.freeze(["id","symbol","name","created_at","updated_at"]),enums:I({asset_class:["stock","etf"]})},security_transactions:{columns:N("ledger_id","id","security_id","type","occurred_at","quantity","price_minor","fee_minor","fee_mode","record_mode","principal_minor","proceeds_minor","settle_at","settlement_status","confirmed_at","cash_account_id","cash_principal_tx_id","cash_pnl_tx_id","source_buy_tx_id","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","security_id","type","occurred_at","quantity","price_minor","created_at","updated_at"]),enums:I({type:["buy","sell"],fee_mode:["into_cost","from_proceeds"],record_mode:["position","funds"],settlement_status:["scheduled","confirmed","cancelled"]})},credit_statements:{columns:N("ledger_id","id","account_id","period_start_inclusive","period_end_exclusive","status","closing_balance_minor","due_on","closed_at","closing_hash","close_token","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","period_start_inclusive","period_end_exclusive","status","created_at","updated_at"]),enums:I({status:["open","closed"]})},credit_repayments:{columns:N("ledger_id","id","account_id","source_account_id","amount_minor","paid_at","transfer_group_id","idempotency_key","note","created_at","updated_at","deleted_at"),required:Object.freeze(["id","account_id","source_account_id","amount_minor","paid_at","idempotency_key","created_at","updated_at"])},credit_repayment_allocations:{columns:N("ledger_id","id","repayment_id","statement_id","amount_minor","created_at","updated_at","deleted_at"),required:Object.freeze(["id","repayment_id","statement_id","amount_minor","created_at","updated_at"])},transaction_postings:{columns:N("ledger_id","id","transaction_id","role","account_id","category_id","amount_minor","statement_id","include_in_budget","include_in_analysis","created_at","updated_at","deleted_at"),required:Object.freeze(["id","transaction_id","role","amount_minor","created_at","updated_at"]),enums:I({role:["expense_accrual","card_liability","cash_transfer","fee","adjustment","reversal"]})},bank_connections:{columns:N("ledger_id","id","provider","provider_connection_id","status","user_label","last_sync_at","sync_cursor","last_sync_status","last_error","created_at","updated_at","deleted_at"),required:Object.freeze(["id","provider","provider_connection_id","created_at","updated_at"]),enums:I({status:["active","revoked","error"],last_sync_status:["idle","ok","error"]})},bank_accounts:{columns:N("ledger_id","id","connection_id","provider_account_id","account_mask","account_name","account_type","currency","enabled","user_label","mapped_account_id","created_at","updated_at","deleted_at"),required:Object.freeze(["id","connection_id","provider_account_id","account_name","created_at","updated_at"])},bank_transactions:{columns:N("ledger_id","id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","currency","description","merchant","status","seen_in_app","imported","imported_txn_id","raw_json","first_seen_at","last_seen_at","created_at","updated_at","transaction_type","note","summary","balance_minor"),required:Object.freeze(["id","connection_id","bank_account_id","provider_transaction_id","posted_at","amount_minor","first_seen_at","last_seen_at","created_at","updated_at"]),enums:I({status:["pending","posted","reversed"]})},bank_sync_rules:{columns:N("ledger_id","connection_id","direction","exclude_keywords_json","min_amount_minor","include_pending","lookback_days","updated_at"),required:Object.freeze(["connection_id","updated_at"]),enums:I({direction:["all","income","expense"]})},app_settings:{columns:N("ledger_id","key","value_json","updated_at"),required:Object.freeze(["key","value_json","updated_at"])},deleted_log:{columns:N("id","ledger_id","table_name","row_pk","payload_json","deleted_at"),required:Object.freeze(["table_name","row_pk","payload_json","deleted_at"])}});function Ir(e,t){const n=String(e??"").trim();if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n))throw new Error(`表 ${t} 欄位名稱不合法：${n}`);return n}function bs(e,t){const n=Object.keys(t).map(o=>Ir(o,e));if(!n.length)throw new Error(`表 ${e} 缺少欄位資料`);const a=n.map(()=>"?").join(", "),r=`INSERT INTO ${e} (${n.join(", ")}) VALUES (${a});`,i=n.map(o=>t[o]);return{sql:r,values:i}}function Cr(e){return e==null||e===""}function ys(e,t,n){const a=t?.enums;if(!(!a||typeof a!="object"))for(const[r,i]of Object.entries(a)){if(!(r in n)||Cr(n[r]))continue;const o=n[r];if(!i.includes(o))throw new Error(`表 ${e} 欄位 ${r} 值不符合約束：${o}`)}}function Ds(e){const t=e?.tables&&typeof e.tables=="object"?e.tables:{};for(const n of Ss){const a=Array.isArray(t[n])?t[n]:[],r=Rs[n];if(!r)throw new Error(`表 ${n} 缺少匯入 schema 合約`);for(let i=0;i<a.length;i+=1){const o=a[i];if(!o||typeof o!="object"||Array.isArray(o))throw new Error(`表 ${n} 第 ${i+1} 筆資料格式無效`);const s={...o,ledger_id:o.ledger_id||"gate_ledger_probe"};n==="deleted_log"&&delete s.id;const d=Object.keys(s);if(!d.length)throw new Error(`表 ${n} 缺少欄位資料`);for(const c of d)if(Ir(c,n),!r.columns.has(c))throw new Error(`表 ${n} 含不存在的欄位：${c}`);for(const c of r.required)if(Cr(s[c]))throw new Error(`表 ${n} 缺少必要欄位：${c}`);ys(n,r,s),bs(n,s)}}}function Is(e){try{return JSON.parse(String(e??""))}catch{throw new Error("JSON 格式錯誤")}}function Cs(e){const t=e?.ledger_id??e?.tables?.ledgers?.[0]?.id;if(!t)throw new Error("JSON 缺少 ledger_id");const n=e?.tables?.ledgers?.find(a=>a.id===t)??e?.tables?.ledgers?.[0];if(!n)throw new Error("JSON 缺少 ledgers 資料");return{sourceLedgerId:t,ledgerRow:n}}function Ln(e){const t=Os(e);return Cs(t),Ds(t),t}function Us(e){const t=Is(e),n=Array.isArray(t?.ledgers)?t.ledgers:null;if(!n||t?.backup_scope!=="all_ledgers")return Ln(t),{mode:"single",ledgerCount:1};if(!n.length)throw new Error("JSON 缺少可匯入的帳本資料");for(const a of n)Ln(a);return{mode:"all_ledgers",ledgerCount:n.length}}const Ur="DRIVE_RESTORE_PREVIEW_REQUIRED",Tt="DRIVE_RESTORE_NOT_IMPORTABLE",hs="DRIVE_RESTORE_IMPORT_FAILED_RESTORED";function yt(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||"還原前必須完成可匯入的備份預覽。預覽失敗或內容無法解析時，禁止進入清空本機流程。",r=new Error(a);return r.code=Ur,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.preview_required",r.originalMessage=n,r.silentWipeBlocked=!0,r}function z(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.parseError??"").trim(),r=String(t.message??"").trim()||`選定的 Drive 檔／舊版無法匯入（${a||n||"invalid_backup"}）。已中止，不清空本機。`,i=new Error(r);return i.code=Tt,i.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.not_importable",i.parseError=a||n,i.originalMessage=n,i.silentWipeBlocked=!0,i}function ws(e,t={}){const n=String(e?.message??e??"").trim(),a=String(t.message??"").trim()||`雲端備份匯入失敗（${n||"import_failed"}）。已從本機 durable recovery 回滾，本機資料未清空。`,r=new Error(a);if(r.code=hs,r.i18nKey=t.i18nKey||"settings_auto_backup.drive_browser.import_failed_restored",r.originalMessage=n,r.localDataRestoredFromRecovery=!0,r.silentWipeBlocked=!0,e&&typeof e=="object")try{r.cause=e}catch{}return r}function Vt(e,t={}){const n=String(e??"");if(!n.trim())throw z(new Error("empty_json"),{...t,parseError:"empty_json"});const a=Rr(n);if(!a.ok)throw z(new Error(a.parseError||"invalid_backup"),{...t,parseError:a.parseError||"invalid_backup"});try{Us(n)}catch(r){throw r?.code===Tt?r:z(r,{...t,parseError:String(r?.message??"importer_structure_rejected").trim()||"importer_structure_rejected"})}return a}function hr(e,t={}){if(!e||typeof e!="object")throw yt(new Error("preview_missing"),t);if(!String(e.jsonText??"").trim())throw yt(new Error("preview_json_missing"),t);try{Vt(e.jsonText,t)}catch(n){throw n?.code===Tt?yt(n,{...t,message:n.message}):n}return e}function jc(e){try{return hr(e),!0}catch{return!1}}async function ks({createRecoveryBackup:e,wipeFn:t,importFn:n,restoreFromRecovery:a,source:r,i18nKey:i}={}){if(typeof n!="function")throw z(new Error("import_missing"),{parseError:"import_missing"});const o=await Oi({createRecoveryBackup:e,wipeFn:t,source:r,i18nKey:i});try{return{imported:await n(),recoveryProof:o}}catch(s){if(typeof a!="function")throw z(s,{parseError:"import_failed_after_wipe_no_rollback",message:`備份匯入失敗且無法回滾（缺少 restoreFromRecovery）：${String(s?.message??s??"").trim()||"import_failed"}`});try{await t()}catch(d){const c=z(s,{parseError:"import_failed_partial_clear_failed",message:`備份匯入失敗，且清除部分匯入殘留亦失敗：${String(d?.message??d??"").trim()||"partial_clear_failed"}`});throw c.localDataRestoredFromRecovery=!1,c.clearError=d,c}try{await a(o)}catch(d){const c=z(s,{parseError:"import_failed_rollback_failed",message:`備份匯入失敗，且 durable recovery 回滾亦失敗：${String(d?.message??d??"").trim()||"rollback_failed"}`});throw c.localDataRestoredFromRecovery=!1,c.rollbackError=d,c}throw ws(s)}}async function Kc({preview:e,downloadBackup:t,createRecoveryBackup:n,wipeFn:a,importBackupJson:r,restoreFromRecovery:i,source:o,i18nKey:s}={}){if(hr(e,{i18nKey:"settings_auto_backup.drive_browser.preview_required"}),typeof t!="function")throw z(new Error("download_missing"),{parseError:"download_missing"});if(typeof r!="function")throw z(new Error("import_missing"),{parseError:"import_missing"});let d;try{d=await t()}catch(u){throw u?.code===Tt||u?.code===Ur||u?.code===Gt?u:z(u,{parseError:"download_failed",message:`下載 Drive 備份失敗，已中止不清空本機：${String(u?.message??u??"").trim()||"download_failed"}`})}Vt(d?.jsonText,{i18nKey:"settings_auto_backup.drive_browser.not_importable"});const{imported:c,recoveryProof:E}=await ks({createRecoveryBackup:n,wipeFn:a,importFn:()=>r(d.jsonText),restoreFromRecovery:i,source:o,i18nKey:s});return{backup:d,imported:c,recoveryProof:E}}const ot="backup.google_drive",Xe="StrawMoneyBook_all_ledgers.json",C=(e,t,n)=>bn(e,t,n);function vs(){return{connected:!1,accountEmail:"",accountName:"",accountImageUrl:"",autoEnabled:!1,dataChangeAutoEnabled:!1,intervalHours:24,lastBackupFilename:"",lastBackupAt:"",lastBackupStatus:"idle",lastError:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:""}}function st(e){const t=vs();return!e||typeof e!="object"?t:{...t,...e,connected:!!e.connected,accountEmail:String(e.accountEmail??"").trim(),accountName:String(e.accountName??"").trim(),accountImageUrl:String(e.accountImageUrl??"").trim(),autoEnabled:!!e.autoEnabled,dataChangeAutoEnabled:!!e.dataChangeAutoEnabled,intervalHours:pr(e.intervalHours),lastBackupFilename:String(e.lastBackupFilename??"").trim(),lastBackupAt:String(e.lastBackupAt??""),lastBackupStatus:String(e.lastBackupStatus??"idle"),lastError:String(e.lastError??""),lastAutoCheckAt:String(e.lastAutoCheckAt??""),lastAutoCheckStatus:String(e.lastAutoCheckStatus??"idle"),lastAutoCheckReason:String(e.lastAutoCheckReason??"")}}function j(e){if(!e)throw new Error(C("settings_auto_backup.error.missing_ledger_id"))}function Jt(){if(!A.isNativePlatform())throw new Error(C("settings_auto_backup.error.google.native_only"))}function Xs(e){return!Array.isArray(e)||!e.length?null:e.find(n=>String(n?.name??"")===Xe)??e[0]}function Nn(e){return{id:String(e?.id??"").trim(),name:String(e?.name??"").trim(),modifiedTime:String(e?.modifiedTime??"").trim(),size:e?.size!=null?String(e.size):""}}function pn(e){const t=String(e??"").trim();return t===Xe?"all_ledgers":/^StrawMoneyBook_sync_.+\.json$/i.test(t)?"ledger_sync":/\.json$/i.test(t)?"other_json":"other"}function mt(){if(typeof window>"u")return null;const e=window.__SMB_DRIVE_APPDATA_MOCK__;return e&&typeof e=="object"?e:null}async function gt(e,t={}){j(e),Jt();const n=t?.interactiveAuth!==!1,a=()=>dr({interactive:n,requireRefreshToken:!0}),r=await We(e);if(!r.connected)throw new Error(C("settings_auto_backup.error.google.connect_required"));return{accessToken:await Ie({interactive:n,requireRefreshToken:!0}),reauthHandler:a,state:r}}function Fs(e){return!e||typeof e!="object"?!1:!!(e.email||e.name||e.imageUrl)}function Fe(e){return{email:String(e?.email??"").trim(),name:String(e?.name??"").trim(),imageUrl:String(e?.imageUrl??"").trim()}}function wr(e,t){const n={};return t.email&&t.email!==e.accountEmail&&(n.accountEmail=t.email),t.name&&t.name!==e.accountName&&(n.accountName=t.name),t.imageUrl&&t.imageUrl!==e.accountImageUrl&&(n.accountImageUrl=t.imageUrl),n}function Me(e){return String(e??"").trim().toLowerCase()}function ct(e={}){return{connected:!0,lastError:"",lastBackupStatus:"idle",...e}}function Ms(e,t){const n=ct({accountEmail:t.email,accountName:t.name,accountImageUrl:t.imageUrl});return e?.lastAutoCheckReason==="reauth_required"&&(n.lastAutoCheckAt="",n.lastAutoCheckStatus="idle",n.lastAutoCheckReason=""),n}function kr(e,t){const n=Me(e?.accountEmail),a=Me(t?.email);return!n||!a?!1:n!==a}async function xs(e,t){if(!t.connected)return t;const n=Fe(Se());if(kr(t,n)){const i=st({...t,connected:!1,lastError:""});return await nt(e,ot,i),i}const a=wr(t,n);if(!Object.keys(a).length)return t;const r=st({...t,...a});return await nt(e,ot,r),r}async function vr(e=""){const t=Me(e);let n=!1;try{await Ie({interactive:!1,requireRefreshToken:!0}),n=!0}catch{n=!1}let a=Fe(Se());if(t&&Me(a.email)&&Me(a.email)!==t&&(n=!1,a=Fe({})),!n){const r=await wt({preferredEmail:t||e,requireRefreshToken:!0});a=Fe(r?.profile??Se())}return a}function Bs(e){return A.isNativePlatform()||_r()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function Gs(e){return _r()?!0:!e||typeof e!="object"?!1:e.connected?!0:!!(e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function Ps(e){return!e||typeof e!="object"?!1:!!(e.connected||e.autoEnabled||e.dataChangeAutoEnabled||e.accountEmail||e.accountName||e.accountImageUrl)}function js(){return(Array.isArray(nn()?.user?.auth_providers)?nn().user.auth_providers:[]).some(t=>String(t?.provider??"").trim()==="google")}function Ks(e,t={}){return!t?.allowInteractiveWhenGoogleLinked||!Ps(e)?!1:js()}async function Hs(e,t){if(!A.isNativePlatform()||!Bs(t))return t;let n="";try{n=String(await Ie({interactive:!1,requireRefreshToken:!0})??"").trim()}catch{return t}if(!n)return t;const a=Fe(Se());if(kr(t,a))return b(e,{connected:!1,lastError:""});const r=wr(t,a),i=ct(r);return t.connected&&!Object.keys(r).length&&!t.lastError?t:!t.connected||Fs(a)?b(e,i):b(e,ct())}async function b(e,t){const n=await We(e),a=st({...n,...t});return await nt(e,ot,a),a}function Ys(e){return e.connected?e.autoEnabled?typeof navigator<"u"&&navigator.onLine===!1?"offline":qo(e)?"":"not_due":"auto_disabled":e.lastError?"connect_restore_failed":"not_connected"}async function We(e){j(e);const t=await zn(e,ot),n=st(t);return xs(e,n)}async function Xr(e,t={}){j(e);const n=!!t.allowInteractive,a=await We(e),r=await Hs(e,a),i=String(r.accountEmail||a.accountEmail||"").trim(),o=Gs(r)||Ks(r,t);if(!n||!o)return r;if(r.connected)try{return await Ie({interactive:!1,preferredEmail:i,requireRefreshToken:!0}),r}catch{}try{const s=await vr(i);return b(e,ct({accountEmail:s.email,accountName:s.name,accountImageUrl:s.imageUrl}))}catch(s){const d=String(s?.message??s??"").trim();return b(e,{lastError:d||C("settings_auto_backup.error.google_connect_failed")})}}async function Hc(e,t={}){return j(e),b(e,t)}async function Yc(e){j(e),Jt();const t=await We(e),n=await vr(t.accountEmail);return b(e,Ms(t,n))}async function Wc(e){j(e);try{await No()}catch(t){console.warn("[google-backup] sign out failed",t)}return b(e,{connected:!1,autoEnabled:!1,accountEmail:"",accountName:"",accountImageUrl:"",lastAutoCheckAt:"",lastAutoCheckStatus:"idle",lastAutoCheckReason:"",lastError:""})}async function Fr(e,t={}){j(e),Jt();const n=t?.interactiveAuth!==!1,a=()=>dr({interactive:n,requireRefreshToken:!0});if(!(await We(e)).connected)throw new Error(C("settings_auto_backup.error.google.connect_required"));const i=await Ie({interactive:n,requireRefreshToken:!0}),o=await gr(),s=JSON.stringify(o,null,2),d=new Date().toISOString(),c=await ts({accessToken:i,reauth:a,filename:Xe,jsonText:s}),E=await b(e,{lastBackupFilename:c.filename||Xe,lastBackupAt:c.modifiedTime||d,lastBackupStatus:"ok",lastError:""});return{filename:E.lastBackupFilename||Xe,lastBackupAt:E.lastBackupAt||d}}async function $c(e,t={}){j(e);const n=mt();if(n&&typeof n.restorePreferred=="function")return n.restorePreferred({ledgerId:e,options:t});const{accessToken:a,reauthHandler:r}=await gt(e,t),i=await Ar({accessToken:a,reauth:r}),o=Xs(i);if(!o?.id)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const s=await Or({accessToken:a,reauth:r,fileId:o.id});return{filename:String(o.name??""),modifiedTime:String(o.modifiedTime??""),fileId:String(o.id??""),revisionId:"",jsonText:s}}async function qc(e,t={}){j(e);const n=mt();if(n&&typeof n.listFiles=="function"){const o=await n.listFiles({ledgerId:e,options:t});return(Array.isArray(o)?o:[]).map(s=>{const d=Nn(s);return{...d,kind:String(s?.kind??pn(d.name))}})}const{accessToken:a,reauthHandler:r}=await gt(e,t);return(await Ar({accessToken:a,reauth:r})).map(o=>{const s=Nn(o);return{...s,kind:pn(s.name)}})}async function zc(e,t,n={}){j(e);const a=String(t??"").trim();if(!a)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const r=mt();if(r&&typeof r.listRevisions=="function"){const s=await r.listRevisions({ledgerId:e,fileId:a,options:n});return Array.isArray(s)?s:[]}const{accessToken:i,reauthHandler:o}=await gt(e,n);return ns({accessToken:i,reauth:o,fileId:a})}async function Ws(e,t={},n={}){j(e);const a=String(t?.fileId??"").trim(),r=String(t?.revisionId??"").trim();if(!a)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));const i=mt();if(i&&typeof i.download=="function"){const c=await i.download({ledgerId:e,fileId:a,revisionId:r,options:n});return{fileId:a,revisionId:r,filename:String(c?.filename??t?.filename??""),modifiedTime:String(c?.modifiedTime??t?.modifiedTime??""),jsonText:String(c?.jsonText??"")}}const{accessToken:o,reauthHandler:s}=await gt(e,n),d=await Or({accessToken:o,reauth:s,fileId:a,revisionId:r||void 0});return{fileId:a,revisionId:r,filename:String(t?.filename??""),modifiedTime:String(t?.modifiedTime??""),jsonText:d}}async function $s(e,t={},n={}){const a=await Ws(e,t,n),r=Rr(a.jsonText);let i=ve(null),o="";try{const d=await gr();i=ve(d),o=String(d?.exported_at??"").trim()}catch(d){console.warn("[google-backup] local summary failed",d)}const s=cs(r,i,{remoteModifiedAt:a.modifiedTime||r.exportedAt,localModifiedAt:o||i.exportedAt});return{...a,remoteSummary:r,localSummary:i,comparison:s}}async function Vc(e,t={},n={}){const a=await $s(e,t,n);if(!a.jsonText)throw new Error(C("settings_auto_backup.error.google.restore_file_missing"));return Vt(a.jsonText),{filename:a.filename,modifiedTime:a.modifiedTime,fileId:a.fileId,revisionId:a.revisionId,jsonText:a.jsonText,remoteSummary:a.remoteSummary,localSummary:a.localSummary,comparison:a.comparison}}async function Jc(e){j(e);const t=new Date().toISOString();if(!A.isNativePlatform())return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await Xr(e),a=Ys(n);if(a){const r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}try{const r=Se();return r?.email&&!n.accountEmail&&await b(e,{accountEmail:r.email,accountName:r.name||"",accountImageUrl:r.imageUrl||""}),await Fr(e,{interactiveAuth:!1}),await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"backup_completed"}),{status:"completed",skipped:!1,reason:"backup_completed",checkedAt:t}}catch(r){const i=String(r?.code??"")==="GOOGLE_REAUTH_REQUIRED",o=String(r?.message??r??"").trim(),s=o?C("settings_auto_backup.error.detail_suffix",{detail:o}):"";return await b(e,{lastBackupStatus:"error",lastError:i?C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:s}):o||C("settings_auto_backup.error.google.auto_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:i?"reauth_required":"backup_failed",...i?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:i?"reauth_required":"backup_failed",checkedAt:t}}}async function Qc(e){j(e);const t=new Date().toISOString();if(!A.isNativePlatform())return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"platform_unsupported"}),{status:"skipped",skipped:!0,reason:"platform_unsupported",checkedAt:t};const n=await Xr(e);if(!n.connected||!n.autoEnabled||!n.dataChangeAutoEnabled){const a=n.connected?n.autoEnabled?"data_change_disabled":"auto_disabled":n.lastError?"connect_restore_failed":"not_connected",r=(a==="not_connected"||a==="connect_restore_failed")&&(n.autoEnabled||!!n.accountEmail);return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:r?"error":"skipped",lastAutoCheckReason:r?"reauth_required":a,...r?{lastBackupStatus:"error",lastError:C("settings_auto_backup.error.google.auto_backup_reauth_required",{detailSuffix:""})}:{}}),{status:r?"error":"skipped",skipped:!r,error:r,reason:r?"reauth_required":a,checkedAt:t}}if(typeof navigator<"u"&&navigator.onLine===!1)return await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"skipped",lastAutoCheckReason:"offline"}),{status:"skipped",skipped:!0,reason:"offline",checkedAt:t};try{const a=Se();return a?.email&&!n.accountEmail&&await b(e,{accountEmail:a.email,accountName:a.name||"",accountImageUrl:a.imageUrl||""}),await Fr(e,{interactiveAuth:!1}),await b(e,{lastAutoCheckAt:t,lastAutoCheckStatus:"ok",lastAutoCheckReason:"data_change_backup_completed"}),{status:"completed",skipped:!1,reason:"data_change_backup_completed",checkedAt:t}}catch(a){const r=String(a?.code??"")==="GOOGLE_REAUTH_REQUIRED",i=String(a?.message??a??"").trim(),o=i?C("settings_auto_backup.error.detail_suffix",{detail:i}):"";return await b(e,{lastBackupStatus:"error",lastError:r?C("settings_auto_backup.error.google.data_change_backup_reauth_required",{detailSuffix:o}):i||C("settings_auto_backup.error.google.data_change_backup_failed"),lastAutoCheckAt:t,lastAutoCheckStatus:"error",lastAutoCheckReason:r?"reauth_required":"backup_failed",...r?{connected:!1}:{}}),{status:"error",skipped:!1,error:!0,reason:r?"reauth_required":"backup_failed",checkedAt:t}}}const fn="https://accounts.google.com/gsi/client",ye=Vn(),Mr=Rn("GoogleIdentity");let we=null;function X(e,t="google_identity_error"){const n=new Error(String(e??"").trim()||"Google identity error");return n.code=t,n}function dt(){return globalThis.google?.accounts?.id??null}function $e(){return A.getPlatform()==="web"}function Zc(){return ye?$e()?!0:A.isNativePlatform()&&A.getPlatform()==="android":!1}function ed(){return ye?$e()||A.isNativePlatform()&&A.getPlatform()==="android"?"":A.isNativePlatform()?"目前僅支援 Android App 的 Google 登入":Ut():Ut()}async function qs(){if(!$e())throw X("Web GIS 僅支援瀏覽器環境","google_identity_web_only");return we||(we=new Promise((e,t)=>{const n=document.querySelector(`script[src="${fn}"]`);if(n){n.addEventListener("load",()=>e(),{once:!0}),n.addEventListener("error",()=>t(X("Google Identity Services 載入失敗","google_gis_load_failed")),{once:!0}),dt()&&e();return}const a=document.createElement("script");a.src=fn,a.async=!0,a.defer=!0,a.onload=()=>e(),a.onerror=()=>t(X("Google Identity Services 載入失敗","google_gis_load_failed")),document.head.appendChild(a)}).finally(()=>{dt()||(we=null)}),we)}function zs(e){const t=String(e?.message??e??"").trim()||"Google 登入失敗",n=String(e?.code??"").trim();return X(t,n||"google_identity_native_failed")}async function td({nonce:e}={}){if(!A.isNativePlatform()||A.getPlatform()!=="android")throw X("Credential Manager 僅支援 Android App","google_identity_android_only");if(!ye)throw X("缺少 Google Web Client ID","google_client_id_missing");if(!e)throw X("缺少 Google nonce","google_nonce_required");try{const t=await Mr.signIn({serverClientId:ye,nonce:String(e).trim(),filterByAuthorizedAccounts:!1});return{idToken:String(t?.idToken??"").trim(),displayName:String(t?.displayName??"").trim(),email:String(t?.email??"").trim(),avatarUrl:String(t?.avatarUrl??"").trim()}}catch(t){throw zs(t)}}async function nd(e,{nonce:t,text:n="signin_with",theme:a="outline",shape:r="pill",size:i="large",width:o=280,onCredential:s=null,onError:d=null}={}){if(!e)throw X("缺少 Google 按鈕容器","google_button_container_missing");if(!$e())throw X("Google GIS 按鈕僅支援 Web","google_identity_web_only");if(!ye)throw X("缺少 Google Web Client ID","google_client_id_missing");if(!t)throw X("缺少 Google nonce","google_nonce_required");await qs();const c=dt();if(!c)throw X("Google Identity Services 尚未就緒","google_gis_not_ready");e.innerHTML="",c.initialize({client_id:ye,nonce:String(t).trim(),ux_mode:"popup",cancel_on_tap_outside:!0,callback:E=>{const u=String(E?.credential??"").trim();if(!u){const T=X("Google 未回傳 ID token","google_id_token_missing");typeof d=="function"&&d(T);return}typeof s=="function"&&s({idToken:u,selectBy:String(E?.select_by??"").trim()})},error_callback:E=>{typeof d=="function"&&d(X(String(E?.type??"Google 登入失敗"),"google_gis_error"))}}),c.renderButton(e,{type:"standard",theme:a,text:n,shape:r,size:i,logo_alignment:"left",width:o})}async function rd(){if($e()){dt()?.disableAutoSelect?.();return}if(A.isNativePlatform()&&A.getPlatform()==="android")try{await Mr.clearCredentialState()}catch{}}export{_r as $,Ie as A,$n as B,Ya as C,ft as D,Gi as E,pr as F,gr as G,qo as H,Qc as I,Jc as J,Fr as K,yi as L,Us as M,Os as N,Cs as O,Ss as P,bs as Q,Hn as R,Oc as S,dc as T,ea as U,Zr as V,Ai as W,Pc as X,Gc as Y,Bc as Z,xc as _,xi as a,Ti as a0,wt as a1,Ar as a2,ts as a3,Or as a4,Se as a5,dr as a6,ac as a7,rc as a8,Pi as a9,tc as aA,Oi as aB,Xi as aC,ui as aD,Gt as aE,Vt as aF,ks as aG,Tt as aH,hs as aI,nc as aJ,qc as aK,$s as aL,jc as aM,zc as aN,hr as aO,Kc as aP,Vc as aQ,Ur as aR,Mc as aS,Yc as aT,Wc as aU,Hc as aV,We as aW,$c as aX,Dc as aY,_c as aZ,mc as a_,ji as aa,Ei as ab,Xr as ac,wc as ad,Bo as ae,Fc as af,hc as ag,Ho as ah,kc as ai,yc as aj,Xc as ak,Uc as al,lc as am,td as an,rd as ao,nd as ap,Zc as aq,ed as ar,sc as as,Tr as at,vc as au,Ic as av,Sc as aw,Rc as ax,bc as ay,Cc as az,Tc as b,Ec as c,Ki as d,gc as e,Bi as f,zn as g,Ge as h,jn as i,pc as j,Ac as k,ec as l,uc as m,qn as n,Nc as o,Lc as p,W as q,_t as r,nt as s,fc as t,ic as u,Si as v,Mi as w,cc as x,oc as y,ht as z};
