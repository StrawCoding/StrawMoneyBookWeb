import{b as u,r as l,q as _,f as y,a as S,n as E,c as T}from"./app-google-6WICTDwl.js";import{b6 as R}from"./index-CcoieWl0.js";import"./vendor-sqlite-DKEMZiEb.js";import"./app-membership-DA28kzVh.js";import"./app-i18n-DMQMgWtW.js";import"./vendor-CkjNk_C8.js";import"./vendor-icons-BlwP1UUA.js";function g(t){const n=String(t??"").trim().toLowerCase();return n==="revoked"||n==="error"?n:"active"}function O(t){const n=String(t??"").trim().toLowerCase();return n==="ok"||n==="error"||n==="partial_success"?n:"idle"}function x(t){const n=String(t??"").trim().toLowerCase();return n==="ok"||n==="error"||n==="partial_success"?n:"idle"}function v(t){const n=String(t??"").trim().toLowerCase();return n==="income"||n==="expense"?n:"all"}function W(t){try{const n=JSON.parse(t);return Array.isArray(n)?n:[]}catch{return[]}}function P(t){const n=t&&typeof t=="object"?t:{};return{direction:v(n.direction),excludeKeywords:W(n.exclude_keywords_json).map(e=>String(e??"").trim()).filter(Boolean),minAmountMinor:Math.max(0,Math.round(Number(n.min_amount_minor??0)||0)),includePending:!!Number(n.include_pending??0),lookbackDays:Math.min(30,Math.max(0,Math.round(Number(n.lookback_days??3)||3))),updatedAt:String(n.updated_at??"")}}function o(t,n=""){return String(t??"").trim()||n}function M(t,n="TWD"){const e=String(t??"").trim().toUpperCase();return/^[A-Z]{3}$/.test(e)?e:n}function H(t){const n=String(t??"").trim().toLowerCase();return n==="pending"||n==="reversed"?n:"posted"}function z(t){const n=Math.round(Number(t)||0);if(!Number.isFinite(n)||n===0)throw new Error("bank transaction amount_minor is invalid");return n}function j(t){if(t==null||t==="")return null;const n=Math.round(Number(t)||0);return Number.isFinite(n)?n:null}function D(t){return!t||typeof t!="object"?"":JSON.stringify({posted_at:String(t.posted_at??t.postedAt??""),amount_minor:Number(t.amount_minor??t.amountMinor??0),currency:String(t.currency??""),description:String(t.description??""),merchant:String(t.merchant??""),status:String(t.status??""),transaction_type:String(t.transaction_type??t.transactionType??""),note:String(t.note??""),summary:String(t.summary??""),balance_minor:t.balance_minor===null||t.balanceMinor===null?null:Number(t.balance_minor??t.balanceMinor??0)})}function B(t){return!Array.isArray(t)||!t.length?"":t.map(()=>"?").join(", ")}const L=`ledger_id, id, provider, provider_connection_id, status, user_label,
            last_sync_at, sync_cursor, last_sync_status, last_error,
            last_attempt_at, last_full_success_at, auto_import_enabled,
            created_at, updated_at, deleted_at`,I=`ledger_id, id, connection_id, provider_account_id, account_mask,
            account_name, account_type, currency, enabled, user_label, mapped_account_id,
            last_success_sync_at, sync_cursor, last_sync_status, last_error,
            created_at, updated_at, deleted_at`;async function at(t){u(t);const n=await _(`SELECT ${L}
     FROM bank_connections
     WHERE ledger_id = ?
       AND deleted_at IS NULL
     ORDER BY updated_at DESC, created_at DESC;`,[t]);return S(n)}async function N(t,n){if(u(t),!n)return null;const e=await _(`SELECT ${L}
     FROM bank_connections
     WHERE ledger_id = ?
       AND id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,n]);return y(e)}async function J(t,n,e){u(t);const a=o(n),r=o(e);if(!a||!r)return null;const c=await _(`SELECT ${L}
     FROM bank_connections
     WHERE ledger_id = ?
       AND provider = ?
       AND provider_connection_id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,a,r]);return y(c)}async function rt(t,n){u(t);const e=o(n?.provider),a=o(n?.providerConnectionId);if(!e||!a)throw new Error("provider and providerConnectionId are required");const r=E(),c=await J(t,e,a),d=o(n?.id||c?.id)||T("bconn"),b=g(n?.status??c?.status),s=o(n?.userLabel??c?.user_label),m=o(n?.lastSyncAt??c?.last_sync_at),f=o(n?.syncCursor??c?.sync_cursor),i=O(n?.lastSyncStatus??c?.last_sync_status),p=o(n?.lastError??c?.last_error);return await l(`INSERT INTO bank_connections (
      ledger_id, id, provider, provider_connection_id, status, user_label,
      last_sync_at, sync_cursor, last_sync_status, last_error, created_at, updated_at, deleted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
    ON CONFLICT(ledger_id, id)
    DO UPDATE SET
      provider = excluded.provider,
      provider_connection_id = excluded.provider_connection_id,
      status = excluded.status,
      user_label = excluded.user_label,
      last_sync_at = excluded.last_sync_at,
      sync_cursor = excluded.sync_cursor,
      last_sync_status = excluded.last_sync_status,
      last_error = excluded.last_error,
      updated_at = excluded.updated_at,
      deleted_at = NULL;`,[t,d,e,a,b,s||null,m||null,f||null,i,p||null,c?.created_at||r,r]),N(t,d)}async function ot(t,n,e={}){u(t);const a=await N(t,n);if(!a)throw new Error("找不到銀行連結");const r={status:g(e.status??a.status),userLabel:o(e.userLabel??a.user_label)||null,lastSyncAt:o(e.lastSyncAt??a.last_sync_at)||null,syncCursor:o(e.syncCursor??a.sync_cursor)||null,lastSyncStatus:O(e.lastSyncStatus??a.last_sync_status),lastError:o(e.lastError??a.last_error)||null,lastAttemptAt:e.lastAttemptAt===void 0?a.last_attempt_at??null:o(e.lastAttemptAt)||null,lastFullSuccessAt:e.lastFullSuccessAt===void 0?a.last_full_success_at??null:o(e.lastFullSuccessAt)||null,autoImportEnabled:e.autoImportEnabled===void 0?Number(a.auto_import_enabled??0):e.autoImportEnabled?1:0,deletedAt:e.deletedAt===void 0?a.deleted_at:o(e.deletedAt)||null};return await l(`UPDATE bank_connections
     SET status = ?,
         user_label = ?,
         last_sync_at = ?,
         sync_cursor = ?,
         last_sync_status = ?,
         last_error = ?,
         last_attempt_at = ?,
         last_full_success_at = ?,
         auto_import_enabled = ?,
         updated_at = ?,
         deleted_at = ?
     WHERE ledger_id = ? AND id = ?;`,[r.status,r.userLabel,r.lastSyncAt,r.syncCursor,r.lastSyncStatus,r.lastError,r.lastAttemptAt,r.lastFullSuccessAt,r.autoImportEnabled,E(),r.deletedAt,t,n]),N(t,n)}async function $(t,n){if(u(t),!n)return[];const e=await _(`SELECT ba.ledger_id, ba.id, ba.connection_id, ba.provider_account_id, ba.account_mask,
            ba.account_name, ba.account_type, ba.currency, ba.enabled, ba.user_label, ba.mapped_account_id,
            ba.last_success_sync_at, ba.sync_cursor, ba.last_sync_status, ba.last_error,
            ba.created_at, ba.updated_at, ba.deleted_at, a.name AS mapped_account_name
     FROM bank_accounts ba
     LEFT JOIN accounts a
       ON a.ledger_id = ba.ledger_id
      AND a.id = ba.mapped_account_id
      AND a.deleted_at IS NULL
     WHERE ba.ledger_id = ?
       AND ba.connection_id = ?
       AND ba.deleted_at IS NULL
     ORDER BY ba.updated_at DESC, ba.created_at DESC;`,[t,n]);return S(e)}async function ct(t,n){if(u(t),!n)return[];const e=await _(`SELECT ${I}
     FROM bank_accounts
     WHERE ledger_id = ?
       AND connection_id = ?
       AND enabled = 1
       AND deleted_at IS NULL
     ORDER BY updated_at DESC, created_at DESC;`,[t,n]);return S(e)}async function w(t,n){if(u(t),!n)return null;const e=await _(`SELECT ${I}
     FROM bank_accounts
     WHERE ledger_id = ?
       AND id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,n]);return y(e)}async function st(t,n,e=[]){if(u(t),!n)throw new Error("connectionId is required");if(!Array.isArray(e)||!e.length)return[];const a=E(),r=[];for(const c of e){const d=o(c?.providerAccountId||c?.id);if(!d)continue;const b=await _(`SELECT id, enabled, user_label, mapped_account_id, created_at
       FROM bank_accounts
       WHERE ledger_id = ?
         AND connection_id = ?
         AND provider_account_id = ?
       LIMIT 1;`,[t,n,d]),s=y(b),m=o(c?.localId||s?.id)||T("bacc");r.push(m),await l(`INSERT INTO bank_accounts (
        ledger_id, id, connection_id, provider_account_id, account_mask, account_name, account_type,
        currency, enabled, user_label, mapped_account_id, created_at, updated_at, deleted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
      ON CONFLICT(ledger_id, id)
      DO UPDATE SET
        connection_id = excluded.connection_id,
        provider_account_id = excluded.provider_account_id,
        account_mask = excluded.account_mask,
        account_name = excluded.account_name,
        account_type = excluded.account_type,
        currency = excluded.currency,
        enabled = COALESCE(bank_accounts.enabled, excluded.enabled),
        user_label = COALESCE(bank_accounts.user_label, excluded.user_label),
        mapped_account_id = COALESCE(bank_accounts.mapped_account_id, excluded.mapped_account_id),
        updated_at = excluded.updated_at,
        deleted_at = NULL;`,[t,m,n,d,o(c?.accountMask)||null,o(c?.accountName,d),o(c?.accountType)||null,M(c?.currency,"TWD"),s?Number(s.enabled??1):c?.enabled?1:0,s?.user_label??null,s?.mapped_account_id??null,s?.created_at||a,a])}return $(t,n).then(c=>c.filter(d=>r.includes(d.id)))}async function it(t,n,e={}){u(t);const a=await w(t,n);if(!a)throw new Error("找不到銀行帳戶");const r=e.enabled===void 0?Number(a.enabled??1):e.enabled?1:0,c=e.userLabel===void 0?a.user_label:o(e.userLabel)||null,d=e.mappedAccountId===void 0?a.mapped_account_id:o(e.mappedAccountId)||null,b=e.lastSuccessSyncAt===void 0?a.last_success_sync_at??null:o(e.lastSuccessSyncAt)||null,s=e.syncCursor===void 0?a.sync_cursor??null:o(e.syncCursor)||null,m=e.lastSyncStatus===void 0?x(a.last_sync_status):x(e.lastSyncStatus),f=e.lastError===void 0?a.last_error??null:o(e.lastError)||null;return await l(`UPDATE bank_accounts
     SET enabled = ?,
         user_label = ?,
         mapped_account_id = ?,
         last_success_sync_at = ?,
         sync_cursor = ?,
         last_sync_status = ?,
         last_error = ?,
         updated_at = ?
     WHERE ledger_id = ? AND id = ?;`,[r,c,d,b,s,m,f,E(),t,n]),w(t,n)}async function C(t,n){if(u(t),!n)throw new Error("connectionId is required");const e=await _(`SELECT ledger_id, connection_id, direction, exclude_keywords_json, min_amount_minor,
            include_pending, lookback_days, updated_at
     FROM bank_sync_rules
     WHERE ledger_id = ? AND connection_id = ?
     LIMIT 1;`,[t,n]),a=y(e);return a?P(a):{direction:"all",excludeKeywords:[],minAmountMinor:0,includePending:!1,lookbackDays:3,updatedAt:""}}async function dt(t,n,e={}){if(u(t),!n)throw new Error("connectionId is required");const a=await C(t,n),r={direction:v(e.direction??a.direction),excludeKeywords:Array.isArray(e.excludeKeywords)?e.excludeKeywords.map(c=>o(c)).filter(Boolean):a.excludeKeywords,minAmountMinor:Math.max(0,Math.round(Number(e.minAmountMinor??a.minAmountMinor)||0)),includePending:e.includePending===void 0?a.includePending:!!e.includePending,lookbackDays:Math.min(30,Math.max(0,Math.round(Number(e.lookbackDays??a.lookbackDays)||3)))};return await l(`INSERT INTO bank_sync_rules (
      ledger_id, connection_id, direction, exclude_keywords_json, min_amount_minor,
      include_pending, lookback_days, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ledger_id, connection_id)
    DO UPDATE SET
      direction = excluded.direction,
      exclude_keywords_json = excluded.exclude_keywords_json,
      min_amount_minor = excluded.min_amount_minor,
      include_pending = excluded.include_pending,
      lookback_days = excluded.lookback_days,
      updated_at = excluded.updated_at;`,[t,n,r.direction,JSON.stringify(r.excludeKeywords),r.minAmountMinor,r.includePending?1:0,r.lookbackDays,E()]),C(t,n)}async function q(t,n,e){const a=await _(`SELECT ledger_id, id, connection_id, bank_account_id, provider_transaction_id,
            posted_at, amount_minor, currency, description, merchant, status, transaction_type,
            note, summary, balance_minor, seen_in_app, imported, imported_txn_id, raw_json,
            first_seen_at, last_seen_at, created_at, updated_at
     FROM bank_transactions
     WHERE ledger_id = ?
       AND bank_account_id = ?
       AND provider_transaction_id = ?
     LIMIT 1;`,[t,n,e]);return y(a)}async function ut(t,n,e=[]){if(u(t),!n)throw new Error("connectionId is required");if(!Array.isArray(e)||!e.length)return{addedIds:[],modifiedIds:[],touchedIds:[]};const a=E(),r=[],c=[],d=[];let b=0;for(const s of e){b+=1,b%20===0&&await R();const m=o(s?.bankAccountId),f=o(s?.providerTransactionId||s?.id);if(!m||!f)continue;const i={posted_at:o(s?.postedAt||s?.posted_at,a),amount_minor:z(s?.amountMinor??s?.amount_minor),currency:M(s?.currency,"TWD"),description:o(s?.description)||null,merchant:o(s?.merchant)||null,status:H(s?.status),transaction_type:o(s?.transactionType??s?.transaction_type)||null,note:o(s?.note)||null,summary:o(s?.summary)||null,balance_minor:j(s?.balanceMinor??s?.balance_minor),raw_json:s?.rawJson?String(s.rawJson):JSON.stringify(s??{})},p=await q(t,m,f);if(!p){const A=T("btx");await l(`INSERT INTO bank_transactions (
          ledger_id, id, connection_id, bank_account_id, provider_transaction_id,
          posted_at, amount_minor, currency, description, merchant, status, transaction_type,
          note, summary, balance_minor, seen_in_app, imported, imported_txn_id, raw_json,
          first_seen_at, last_seen_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NULL, ?, ?, ?, ?, ?);`,[t,A,n,m,f,i.posted_at,i.amount_minor,i.currency,i.description,i.merchant,i.status,i.transaction_type,i.note,i.summary,i.balance_minor,i.raw_json,a,a,a,a]),r.push(A),d.push(A);continue}const F=D(p),U=D(i);F!==U?(await l(`UPDATE bank_transactions
         SET posted_at = ?,
             amount_minor = ?,
             currency = ?,
             description = ?,
             merchant = ?,
             status = ?,
             transaction_type = ?,
             note = ?,
             summary = ?,
             balance_minor = ?,
             raw_json = ?,
             last_seen_at = ?,
             updated_at = ?
         WHERE ledger_id = ? AND id = ?;`,[i.posted_at,i.amount_minor,i.currency,i.description,i.merchant,i.status,i.transaction_type,i.note,i.summary,i.balance_minor,i.raw_json,a,a,t,p.id]),c.push(p.id),d.push(p.id)):(await l(`UPDATE bank_transactions
         SET last_seen_at = ?,
             updated_at = ?
         WHERE ledger_id = ? AND id = ?;`,[a,a,t,p.id]),d.push(p.id))}return{addedIds:r,modifiedIds:c,touchedIds:d}}const k=300;function K(t,n=k){const e=Math.trunc(Number(t));return!Number.isFinite(e)||e<=0?n:Math.min(e,k)}function V(t){const n=Math.trunc(Number(t));return Number.isFinite(n)&&n>0?n:0}function h(t,n={}){const e=!!n.includeImported,a=o(n.connectionId),r=[t,e?1:0];let c="";return a&&(c=" AND bt.connection_id = ?",r.push(a)),{whereSql:`bt.ledger_id = ?
       AND (? = 1 OR bt.imported = 0)${c}`,values:r}}async function _t(t,n={}){u(t);const{whereSql:e,values:a}=h(t,n),r=await _(`SELECT COUNT(*) AS total
     FROM bank_transactions bt
     WHERE ${e};`,a);return Number(y(r)?.total??0)}async function lt(t,n={}){u(t);const e=K(n.limit,k),a=V(n.offset),{whereSql:r,values:c}=h(t,n),[d,b]=await Promise.all([_(`SELECT bt.ledger_id, bt.id, bt.connection_id, bt.bank_account_id, bt.provider_transaction_id,
              bt.posted_at, bt.amount_minor, bt.currency, bt.description, bt.merchant, bt.status,
              bt.transaction_type, bt.note, bt.summary, bt.balance_minor, bt.seen_in_app,
              bt.imported, bt.imported_txn_id, bt.first_seen_at, bt.last_seen_at, bt.updated_at,
              ba.provider_account_id, ba.account_name AS bank_account_name, ba.user_label AS bank_account_user_label, ba.account_mask AS bank_account_mask,
              ba.mapped_account_id, a.name AS mapped_account_name,
              bc.provider, bc.user_label AS connection_user_label
       FROM bank_transactions bt
       INNER JOIN bank_accounts ba
         ON ba.ledger_id = bt.ledger_id
        AND ba.id = bt.bank_account_id
       INNER JOIN bank_connections bc
         ON bc.ledger_id = bt.ledger_id
        AND bc.id = bt.connection_id
       LEFT JOIN accounts a
         ON a.ledger_id = ba.ledger_id
        AND a.id = ba.mapped_account_id
        AND a.deleted_at IS NULL
       WHERE ${r}
       ORDER BY bt.posted_at DESC, bt.updated_at DESC
       LIMIT ? OFFSET ?;`,[...c,e,a]),_(`SELECT COUNT(*) AS total
       FROM bank_transactions bt
       WHERE ${r};`,c)]);return{items:S(d),total:Number(y(b)?.total??0),limit:e,offset:a}}async function bt(t,n=[]){u(t);const e=Array.from(new Set(n.map(c=>o(c)).filter(Boolean)));if(!e.length)return[];const a=B(e),r=await _(`SELECT bt.ledger_id, bt.id, bt.connection_id, bt.bank_account_id, bt.provider_transaction_id,
            bt.posted_at, bt.amount_minor, bt.currency, bt.description, bt.merchant, bt.status,
            bt.transaction_type, bt.note, bt.summary, bt.balance_minor, bt.seen_in_app,
            bt.imported, bt.imported_txn_id, bt.first_seen_at, bt.last_seen_at, bt.updated_at,
            ba.provider_account_id, ba.account_name AS bank_account_name, ba.user_label AS bank_account_user_label, ba.account_mask AS bank_account_mask,
            ba.mapped_account_id,
            bc.provider
     FROM bank_transactions bt
     INNER JOIN bank_accounts ba
       ON ba.ledger_id = bt.ledger_id
      AND ba.id = bt.bank_account_id
     INNER JOIN bank_connections bc
       ON bc.ledger_id = bt.ledger_id
      AND bc.id = bt.connection_id
     WHERE bt.ledger_id = ?
       AND bt.id IN (${a});`,[t,...e]);return S(r)}async function mt(t,n=[]){u(t);const e=Array.from(new Set(n.map(r=>o(r)).filter(Boolean)));if(!e.length)return;const a=B(e);await l(`UPDATE bank_transactions
     SET seen_in_app = 1,
         updated_at = ?
     WHERE ledger_id = ?
       AND id IN (${a});`,[E(),t,...e])}async function pt(t,n=[]){if(u(t),!Array.isArray(n)||!n.length)return;const e=E();let a=0;for(const r of n){a+=1,a%20===0&&await R();const c=o(r?.bankTransactionId),d=o(r?.importedTxnId);!c||!d||await l(`UPDATE bank_transactions
       SET imported = 1,
           imported_txn_id = ?,
           seen_in_app = 1,
           updated_at = ?
       WHERE ledger_id = ? AND id = ?;`,[d,e,t,c])}}async function yt(t,n){u(t),n&&await l("DELETE FROM bank_transactions WHERE ledger_id = ? AND connection_id = ?;",[t,n])}async function Et(t,n){u(t);const e=o(n);if(!e)return null;const a=await _(`SELECT id, type, account_id, amount_minor, occurred_at
     FROM transactions
     WHERE ledger_id = ?
       AND origin_type = 'import'
       AND external_ref_id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,e]);return y(a)}export{k as BANK_REVIEW_PAGE_SIZE,yt as clearBankMirrorDataByConnection,_t as countBankTransactionsForReview,w as findBankAccountById,N as findBankConnectionById,J as findBankConnectionByProviderRef,Et as findImportedLedgerTransactionBySourceRef,C as getBankSyncRule,$ as listBankAccountsByConnection,at as listBankConnections,bt as listBankTransactionsByIds,lt as listBankTransactionsForReview,ct as listEnabledBankAccountsByConnection,pt as markBankTransactionsImported,mt as markBankTransactionsSeen,it as updateBankAccount,ot as updateBankConnection,st as upsertBankAccounts,rt as upsertBankConnection,dt as upsertBankSyncRule,ut as upsertBankTransactions};
