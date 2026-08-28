import{b as u,r as b,q as _,f as y,a as A,n as f,c as L}from"./app-google-BYo0F7bL.js";import{b8 as v}from"./index-1xwEGOmI.js";import{o as z,r as R,p as J}from"./bank-sync.service-CIaEdwPU.js";import"./vendor-sqlite-DKEMZiEb.js";import"./app-membership-DfDUGj4J.js";import"./app-i18n-BtVubweK.js";import"./vendor-CkjNk_C8.js";import"./vendor-icons-C9p9q0PR.js";function B(t){const n=String(t??"").trim().toLowerCase();return n==="revoked"||n==="error"?n:"active"}function I(t){const n=String(t??"").trim().toLowerCase();return n==="ok"||n==="error"||n==="partial_success"?n:"idle"}function C(t){const n=String(t??"").trim().toLowerCase();return n==="ok"||n==="error"||n==="partial_success"?n:"idle"}function h(t){const n=String(t??"").trim().toLowerCase();return n==="income"||n==="expense"?n:"all"}function $(t){try{const n=JSON.parse(t);return Array.isArray(n)?n:[]}catch{return[]}}function q(t){const n=t&&typeof t=="object"?t:{};return{direction:h(n.direction),excludeKeywords:$(n.exclude_keywords_json).map(e=>String(e??"").trim()).filter(Boolean),minAmountMinor:Math.max(0,Math.round(Number(n.min_amount_minor??0)||0)),includePending:!!Number(n.include_pending??0),lookbackDays:Math.min(30,Math.max(0,Math.round(Number(n.lookback_days??3)||3))),updatedAt:String(n.updated_at??"")}}function o(t,n=""){return String(t??"").trim()||n}function F(t,n="TWD"){const e=String(t??"").trim().toUpperCase();return/^[A-Z]{3}$/.test(e)?e:n}function K(t){const n=String(t??"").trim().toLowerCase();return n==="pending"||n==="reversed"?n:"posted"}function V(t){const n=Math.round(Number(t)||0);if(!Number.isFinite(n)||n===0)throw new Error("bank transaction amount_minor is invalid");return n}function Y(t){if(t==null||t==="")return null;const n=Math.round(Number(t)||0);return Number.isFinite(n)?n:null}function g(t){return!t||typeof t!="object"?"":JSON.stringify({posted_at:String(t.posted_at??t.postedAt??""),amount_minor:Number(t.amount_minor??t.amountMinor??0),currency:String(t.currency??""),description:String(t.description??""),merchant:String(t.merchant??""),status:String(t.status??""),transaction_type:String(t.transaction_type??t.transactionType??""),note:String(t.note??""),summary:String(t.summary??""),balance_minor:t.balance_minor===null||t.balanceMinor===null?null:Number(t.balance_minor??t.balanceMinor??0)})}function U(t){return!Array.isArray(t)||!t.length?"":t.map(()=>"?").join(", ")}const w=`ledger_id, id, provider, provider_connection_id, status, user_label,
            last_sync_at, sync_cursor, last_sync_status, last_error,
            last_attempt_at, last_full_success_at, auto_import_enabled,
            created_at, updated_at, deleted_at`,W=`ledger_id, id, connection_id, provider_account_id, account_mask,
            account_name, account_type, currency, enabled, user_label, mapped_account_id,
            last_success_sync_at, sync_cursor, last_sync_status, last_error,
            created_at, updated_at, deleted_at`;async function _t(t){u(t);const n=await _(`SELECT ${w}
     FROM bank_connections
     WHERE ledger_id = ?
       AND deleted_at IS NULL
     ORDER BY updated_at DESC, created_at DESC;`,[t]);return A(n)}async function k(t,n){if(u(t),!n)return null;const e=await _(`SELECT ${w}
     FROM bank_connections
     WHERE ledger_id = ?
       AND id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,n]);return y(e)}async function G(t,n,e){u(t);const a=o(n),r=o(e);if(!a||!r)return null;const i=await _(`SELECT ${w}
     FROM bank_connections
     WHERE ledger_id = ?
       AND provider = ?
       AND provider_connection_id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,a,r]);return y(i)}async function lt(t,n){u(t);const e=o(n?.provider),a=o(n?.providerConnectionId);if(!e||!a)throw new Error("provider and providerConnectionId are required");const r=f(),i=await G(t,e,a),d=o(n?.id||i?.id)||L("bconn"),p=B(n?.status??i?.status),c=o(n?.userLabel??i?.user_label),l=o(n?.lastSyncAt??i?.last_sync_at),E=o(n?.syncCursor??i?.sync_cursor),N=I(n?.lastSyncStatus??i?.last_sync_status),S=o(n?.lastError??i?.last_error);return await b(`INSERT INTO bank_connections (
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
      deleted_at = NULL;`,[t,d,e,a,p,c||null,l||null,E||null,N,S||null,i?.created_at||r,r]),k(t,d)}async function mt(t,n,e={}){u(t);const a=await k(t,n);if(!a)throw new Error("找不到銀行連結");const r={status:B(e.status??a.status),userLabel:o(e.userLabel??a.user_label)||null,lastSyncAt:o(e.lastSyncAt??a.last_sync_at)||null,syncCursor:o(e.syncCursor??a.sync_cursor)||null,lastSyncStatus:I(e.lastSyncStatus??a.last_sync_status),lastError:o(e.lastError??a.last_error)||null,lastAttemptAt:e.lastAttemptAt===void 0?a.last_attempt_at??null:o(e.lastAttemptAt)||null,lastFullSuccessAt:e.lastFullSuccessAt===void 0?a.last_full_success_at??null:o(e.lastFullSuccessAt)||null,autoImportEnabled:e.autoImportEnabled===void 0?Number(a.auto_import_enabled??0):e.autoImportEnabled?1:0,deletedAt:e.deletedAt===void 0?a.deleted_at:o(e.deletedAt)||null};return await b(`UPDATE bank_connections
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
     WHERE ledger_id = ? AND id = ?;`,[r.status,r.userLabel,r.lastSyncAt,r.syncCursor,r.lastSyncStatus,r.lastError,r.lastAttemptAt,r.lastFullSuccessAt,r.autoImportEnabled,f(),r.deletedAt,t,n]),k(t,n)}async function Z(t,n){if(u(t),!n)return[];const e=await _(`SELECT ba.ledger_id, ba.id, ba.connection_id, ba.provider_account_id, ba.account_mask,
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
     ORDER BY ba.updated_at DESC, ba.created_at DESC;`,[t,n]);return A(e)}async function bt(t,n){if(u(t),!n)return[];const e=await _(`SELECT ${W}
     FROM bank_accounts
     WHERE ledger_id = ?
       AND connection_id = ?
       AND enabled = 1
       AND deleted_at IS NULL
     ORDER BY updated_at DESC, created_at DESC;`,[t,n]);return A(e)}async function O(t,n){if(u(t),!n)return null;const e=await _(`SELECT ${W}
     FROM bank_accounts
     WHERE ledger_id = ?
       AND id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,n]);return y(e)}async function pt(t,n,e=[]){if(u(t),!n)throw new Error("connectionId is required");if(!Array.isArray(e)||!e.length)return[];const a=f(),r=[];for(const i of e){const d=o(i?.providerAccountId||i?.id);if(!d)continue;const p=await _(`SELECT id, enabled, user_label, mapped_account_id, created_at
       FROM bank_accounts
       WHERE ledger_id = ?
         AND connection_id = ?
         AND provider_account_id = ?
       LIMIT 1;`,[t,n,d]),c=y(p),l=o(i?.localId||c?.id)||L("bacc");r.push(l),await b(`INSERT INTO bank_accounts (
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
        deleted_at = NULL;`,[t,l,n,d,o(i?.accountMask)||null,o(i?.accountName,d),o(i?.accountType)||null,F(i?.currency,"TWD"),c?Number(c.enabled??1):i?.enabled?1:0,c?.user_label??null,c?.mapped_account_id??null,c?.created_at||a,a])}return Z(t,n).then(i=>i.filter(d=>r.includes(d.id)))}async function yt(t,n,e={}){u(t);const a=await O(t,n);if(!a)throw new Error("找不到銀行帳戶");const r=e.enabled===void 0?Number(a.enabled??1):e.enabled?1:0,i=e.userLabel===void 0?a.user_label:o(e.userLabel)||null,d=e.mappedAccountId===void 0?a.mapped_account_id:o(e.mappedAccountId)||null,p=e.lastSuccessSyncAt===void 0?a.last_success_sync_at??null:o(e.lastSuccessSyncAt)||null,c=e.syncCursor===void 0?a.sync_cursor??null:o(e.syncCursor)||null,l=e.lastSyncStatus===void 0?C(a.last_sync_status):C(e.lastSyncStatus),E=e.lastError===void 0?a.last_error??null:o(e.lastError)||null;return await b(`UPDATE bank_accounts
     SET enabled = ?,
         user_label = ?,
         mapped_account_id = ?,
         last_success_sync_at = ?,
         sync_cursor = ?,
         last_sync_status = ?,
         last_error = ?,
         updated_at = ?
     WHERE ledger_id = ? AND id = ?;`,[r,i,d,p,c,l,E,f(),t,n]),O(t,n)}async function M(t,n){if(u(t),!n)throw new Error("connectionId is required");const e=await _(`SELECT ledger_id, connection_id, direction, exclude_keywords_json, min_amount_minor,
            include_pending, lookback_days, updated_at
     FROM bank_sync_rules
     WHERE ledger_id = ? AND connection_id = ?
     LIMIT 1;`,[t,n]),a=y(e);return a?q(a):{direction:"all",excludeKeywords:[],minAmountMinor:0,includePending:!1,lookbackDays:3,updatedAt:""}}async function Et(t,n,e={}){if(u(t),!n)throw new Error("connectionId is required");const a=await M(t,n),r={direction:h(e.direction??a.direction),excludeKeywords:Array.isArray(e.excludeKeywords)?e.excludeKeywords.map(i=>o(i)).filter(Boolean):a.excludeKeywords,minAmountMinor:Math.max(0,Math.round(Number(e.minAmountMinor??a.minAmountMinor)||0)),includePending:e.includePending===void 0?a.includePending:!!e.includePending,lookbackDays:Math.min(30,Math.max(0,Math.round(Number(e.lookbackDays??a.lookbackDays)||3)))};return await b(`INSERT INTO bank_sync_rules (
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
      updated_at = excluded.updated_at;`,[t,n,r.direction,JSON.stringify(r.excludeKeywords),r.minAmountMinor,r.includePending?1:0,r.lookbackDays,f()]),M(t,n)}async function Q(t,n,e){const a=await _(`SELECT ledger_id, id, connection_id, bank_account_id, provider_transaction_id,
            posted_at, amount_minor, currency, description, merchant, status, transaction_type,
            note, summary, balance_minor, seen_in_app, imported, imported_txn_id, raw_json,
            identity_scheme, first_seen_at, last_seen_at, created_at, updated_at
     FROM bank_transactions
     WHERE ledger_id = ?
       AND bank_account_id = ?
       AND provider_transaction_id = ?
     LIMIT 1;`,[t,n,e]);return y(a)}async function X(t,{bankAccountId:n,providerTransactionId:e,postedAt:a,amountMinor:r}){const i=J(a);if(!i||!n||!e)return null;const d=await _(`SELECT id, provider_transaction_id, raw_json
     FROM bank_transactions
     WHERE ledger_id = ?
       AND bank_account_id = ?
       AND amount_minor = ?
       AND substr(posted_at, 1, 10) = ?
       AND provider_transaction_id != ?
     LIMIT 1;`,[t,n,Number(r)||0,i,e]);return y(d)}async function ft(t,n,e=[]){if(u(t),!n)throw new Error("connectionId is required");if(!Array.isArray(e)||!e.length)return{addedIds:[],modifiedIds:[],touchedIds:[]};const a=f(),r=[],i=[],d=[];let p=0;for(const c of e){p+=1,p%20===0&&await v();try{const l=o(c?.bankAccountId),E=o(c?.providerTransactionId||c?.id);if(!l||!E)continue;const N=o(c?.identityScheme||c?.identity_scheme)||null;let S=c?.rawJson?String(c.rawJson):JSON.stringify(c??{});const D=await X(t,{bankAccountId:l,providerTransactionId:E,postedAt:c?.postedAt||c?.posted_at,amountMinor:c?.amountMinor??c?.amount_minor});D?.id&&(S=z(S,{possible_duplicate_of:D.id}));const s={posted_at:o(c?.postedAt||c?.posted_at,a),amount_minor:V(c?.amountMinor??c?.amount_minor),currency:F(c?.currency,"TWD"),description:o(c?.description)||null,merchant:o(c?.merchant)||null,status:K(c?.status),transaction_type:o(c?.transactionType??c?.transaction_type)||null,note:o(c?.note)||null,summary:o(c?.summary)||null,balance_minor:Y(c?.balanceMinor??c?.balance_minor),raw_json:S,identity_scheme:N},x=L("btx");await b(`INSERT OR IGNORE INTO bank_transactions (
          ledger_id, id, connection_id, bank_account_id, provider_transaction_id,
          posted_at, amount_minor, currency, description, merchant, status, transaction_type,
          note, summary, balance_minor, seen_in_app, imported, imported_txn_id, raw_json,
          identity_scheme, first_seen_at, last_seen_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NULL, ?, ?, ?, ?, ?, ?);`,[t,x,n,l,E,s.posted_at,s.amount_minor,s.currency,s.description,s.merchant,s.status,s.transaction_type,s.note,s.summary,s.balance_minor,s.raw_json,s.identity_scheme,a,a,a,a]);const m=await Q(t,l,E);if(!m)continue;if(m.id===x){r.push(m.id),d.push(m.id);continue}const H=g(m),j=g(s);H!==j||o(m.identity_scheme)!==o(s.identity_scheme)||R(m.raw_json)!==R(s.raw_json)?(await b(`UPDATE bank_transactions
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
               identity_scheme = ?,
               last_seen_at = ?,
               updated_at = ?
           WHERE ledger_id = ? AND id = ?;`,[s.posted_at,s.amount_minor,s.currency,s.description,s.merchant,s.status,s.transaction_type,s.note,s.summary,s.balance_minor,s.raw_json,s.identity_scheme,a,a,t,m.id]),i.push(m.id),d.push(m.id)):(await b(`UPDATE bank_transactions
           SET last_seen_at = ?,
               updated_at = ?
           WHERE ledger_id = ? AND id = ?;`,[a,a,t,m.id]),d.push(m.id))}catch(l){console.warn("[bank-sync] upsert item skipped",l)}}return{addedIds:r,modifiedIds:i,touchedIds:d}}const T=300;function tt(t,n=T){const e=Math.trunc(Number(t));return!Number.isFinite(e)||e<=0?n:Math.min(e,T)}function nt(t){const n=Math.trunc(Number(t));return Number.isFinite(n)&&n>0?n:0}function P(t,n={}){const e=!!n.includeImported,a=o(n.connectionId),r=[t,e?1:0];let i="";return a&&(i=" AND bt.connection_id = ?",r.push(a)),{whereSql:`bt.ledger_id = ?
       AND (? = 1 OR bt.imported = 0)${i}`,values:r}}async function St(t,n={}){u(t);const{whereSql:e,values:a}=P(t,n),r=await _(`SELECT COUNT(*) AS total
     FROM bank_transactions bt
     WHERE ${e};`,a);return Number(y(r)?.total??0)}async function At(t,n={}){u(t);const e=tt(n.limit,T),a=nt(n.offset),{whereSql:r,values:i}=P(t,n),[d,p]=await Promise.all([_(`SELECT bt.ledger_id, bt.id, bt.connection_id, bt.bank_account_id, bt.provider_transaction_id,
              bt.posted_at, bt.amount_minor, bt.currency, bt.description, bt.merchant, bt.status,
              bt.transaction_type, bt.note, bt.summary, bt.balance_minor, bt.seen_in_app,
              bt.imported, bt.imported_txn_id, bt.raw_json, bt.identity_scheme,
              bt.first_seen_at, bt.last_seen_at, bt.updated_at,
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
       LIMIT ? OFFSET ?;`,[...i,e,a]),_(`SELECT COUNT(*) AS total
       FROM bank_transactions bt
       WHERE ${r};`,i)]);return{items:A(d),total:Number(y(p)?.total??0),limit:e,offset:a}}async function Nt(t,n=[]){u(t);const e=Array.from(new Set(n.map(i=>o(i)).filter(Boolean)));if(!e.length)return[];const a=U(e),r=await _(`SELECT bt.ledger_id, bt.id, bt.connection_id, bt.bank_account_id, bt.provider_transaction_id,
            bt.posted_at, bt.amount_minor, bt.currency, bt.description, bt.merchant, bt.status,
            bt.transaction_type, bt.note, bt.summary, bt.balance_minor, bt.seen_in_app,
            bt.imported, bt.imported_txn_id, bt.raw_json, bt.identity_scheme,
            bt.first_seen_at, bt.last_seen_at, bt.updated_at,
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
       AND bt.id IN (${a});`,[t,...e]);return A(r)}async function kt(t,n=[]){u(t);const e=Array.from(new Set(n.map(r=>o(r)).filter(Boolean)));if(!e.length)return;const a=U(e);await b(`UPDATE bank_transactions
     SET seen_in_app = 1,
         updated_at = ?
     WHERE ledger_id = ?
       AND id IN (${a});`,[f(),t,...e])}async function Tt(t,n=[]){if(u(t),!Array.isArray(n)||!n.length)return;const e=f();let a=0;for(const r of n){a+=1,a%20===0&&await v();const i=o(r?.bankTransactionId),d=o(r?.importedTxnId);!i||!d||await b(`UPDATE bank_transactions
       SET imported = 1,
           imported_txn_id = ?,
           seen_in_app = 1,
           updated_at = ?
       WHERE ledger_id = ? AND id = ?;`,[d,e,t,i])}}async function Lt(t,n){u(t),n&&await b("DELETE FROM bank_transactions WHERE ledger_id = ? AND connection_id = ?;",[t,n])}async function wt(t,n){u(t);const e=o(n);if(!e)return null;const a=await _(`SELECT id, type, account_id, amount_minor, occurred_at
     FROM transactions
     WHERE ledger_id = ?
       AND origin_type = 'import'
       AND external_ref_id = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,e]);return y(a)}export{T as BANK_REVIEW_PAGE_SIZE,Lt as clearBankMirrorDataByConnection,St as countBankTransactionsForReview,O as findBankAccountById,k as findBankConnectionById,G as findBankConnectionByProviderRef,wt as findImportedLedgerTransactionBySourceRef,M as getBankSyncRule,Z as listBankAccountsByConnection,_t as listBankConnections,Nt as listBankTransactionsByIds,At as listBankTransactionsForReview,bt as listEnabledBankAccountsByConnection,Tt as markBankTransactionsImported,kt as markBankTransactionsSeen,yt as updateBankAccount,mt as updateBankConnection,pt as upsertBankAccounts,lt as upsertBankConnection,Et as upsertBankSyncRule,ft as upsertBankTransactions};
