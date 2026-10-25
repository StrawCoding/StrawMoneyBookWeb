import{q as u,a as i,b as _,c as g,n as c,r as o,f as b,k as A}from"./app-google--1O9wKfz.js";import"./vendor-sqlite-CnPD_Y5r.js";import"./app-membership-CiXQVt7I.js";import"./app-i18n-mgKt5DTB.js";import"./vendor-B2d7LeBh.js";function p(t){return String(t??"").trim()==="daily"?"daily":"monthly"}function y(t,e=!1){const d=String(t??"").trim();return d==="save"?"save":d==="roll"?"roll":e?"save":"roll"}function r(t){return String(t??"").trim()||null}function l(t){return t===!0||t===1||t==="1"}function N(t,e,d){return`${String(t??"").trim()}:${String(e??"").trim()}:${String(d??"").trim()}`}function v(t){return String(t??"").trim()==="pay_cycle"?"pay_cycle":"calendar_month"}function E(t,e){return String(t??"").trim()||String(e??"").trim()}function m(t="transactions"){const e=A(t);return`(CASE
    WHEN ABS(${t}.amount_minor) - ${e} > 0
    THEN ABS(${t}.amount_minor) - ${e}
    ELSE 0
  END)`}async function x(t,e){_(t);const d=await u(`SELECT ledger_id, id, month_key,
            COALESCE(period_key, month_key) AS period_key,
            COALESCE(period_start_date, month_key || '-01') AS period_start_date,
            COALESCE(period_end_date, date(month_key || '-01', '+1 month', '-1 day')) AS period_end_date,
            COALESCE(period_mode, 'calendar_month') AS period_mode,
            name,
            include_transfers, include_loan_repayments, include_reimbursed_expenses,
            budget_save_total_enabled, budget_save_total_target_account_id, budget_save_total_source_account_id,
            created_at, updated_at
     FROM budgets
     WHERE ledger_id = ? AND month_key = ? AND deleted_at IS NULL
     LIMIT 1;`,[t,e]);return b(d)}async function D(t,e){_(t);const d=String(e??"").trim();if(!d)return null;const a=await u(`SELECT ledger_id, id, month_key,
            COALESCE(period_key, month_key) AS period_key,
            COALESCE(period_start_date, month_key || '-01') AS period_start_date,
            COALESCE(period_end_date, date(month_key || '-01', '+1 month', '-1 day')) AS period_end_date,
            COALESCE(period_mode, 'calendar_month') AS period_mode,
            name,
            include_transfers, include_loan_repayments, include_reimbursed_expenses,
            budget_save_total_enabled, budget_save_total_target_account_id, budget_save_total_source_account_id,
            created_at, updated_at
     FROM budgets
     WHERE ledger_id = ?
       AND COALESCE(period_key, month_key) = ?
       AND deleted_at IS NULL
     LIMIT 1;`,[t,d]);return b(a)}async function B(t,e){_(t);const d=e.id??g("budget"),a=c();return await o(`INSERT INTO budgets (
      ledger_id, id, month_key,
      period_key, period_start_date, period_end_date, period_mode,
      name,
      include_transfers, include_loan_repayments, include_reimbursed_expenses,
      budget_save_total_enabled, budget_save_total_target_account_id, budget_save_total_source_account_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,[t,d,e.monthKey,E(e.periodKey,e.monthKey),e.periodStartDate??null,e.periodEndDate??null,v(e.periodMode),e.name??null,e.includeTransfers?1:0,e.includeLoanRepayments?1:0,e.includeReimbursedExpenses?1:0,l(e.budgetSaveTotalEnabled),r(e.budgetSaveTotalTargetAccountId),r(e.budgetSaveTotalSourceAccountId),a,a]),D(t,E(e.periodKey,e.monthKey))}async function I(t){_(t);const e=await u(`SELECT b.ledger_id, b.id, b.month_key,
            COALESCE(b.period_key, b.month_key) AS period_key,
            COALESCE(b.period_start_date, b.month_key || '-01') AS period_start_date,
            COALESCE(b.period_end_date, date(b.month_key || '-01', '+1 month', '-1 day')) AS period_end_date,
            COALESCE(b.period_mode, 'calendar_month') AS period_mode,
            b.name,
            b.include_transfers, b.include_loan_repayments, b.include_reimbursed_expenses,
            b.budget_save_total_enabled, b.budget_save_total_target_account_id, b.budget_save_total_source_account_id,
            b.created_at, b.updated_at
     FROM budgets b
     WHERE b.ledger_id = ?
       AND b.deleted_at IS NULL
       AND (
         b.budget_save_total_enabled = 1
         OR EXISTS (
           SELECT 1
           FROM budget_items bi
           WHERE bi.ledger_id = b.ledger_id
             AND bi.budget_id = b.id
             AND bi.budget_save_enabled = 1
         )
         OR EXISTS (
           SELECT 1
           FROM budget_containers bc
           WHERE bc.ledger_id = b.ledger_id
             AND bc.budget_id = b.id
             AND bc.budget_save_enabled = 1
         )
       )
     ORDER BY COALESCE(b.period_start_date, b.month_key || '-01') ASC, b.created_at ASC;`,[t]);return i(e)}async function M(t,e){_(t);const d=await u(`SELECT ledger_id, id, budget_id, name, amount_minor,
            budget_save_enabled, budget_save_target_account_id, budget_save_source_account_id,
            period_mode, surplus_mode, sort_order, created_at, updated_at
     FROM budget_containers
     WHERE ledger_id = ? AND budget_id = ?
     ORDER BY sort_order ASC, created_at ASC;`,[t,e]);return i(d).map(a=>({...a,surplus_mode:y(a?.surplus_mode,Number(a?.budget_save_enabled??0)===1)}))}async function h(t,e){_(t);const d=c(),a=e.id??g("bc"),n=l(e.budgetSaveEnabled),s=y(e.surplusMode,n);return await o(`INSERT INTO budget_containers (
      ledger_id, id, budget_id, name, amount_minor,
      budget_save_enabled, budget_save_target_account_id, budget_save_source_account_id,
      period_mode, surplus_mode, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ledger_id, id) DO UPDATE SET
      name = excluded.name,
      amount_minor = excluded.amount_minor,
      budget_save_enabled = excluded.budget_save_enabled,
      budget_save_target_account_id = excluded.budget_save_target_account_id,
      budget_save_source_account_id = excluded.budget_save_source_account_id,
      period_mode = excluded.period_mode,
      surplus_mode = excluded.surplus_mode,
      sort_order = excluded.sort_order,
      updated_at = excluded.updated_at;`,[t,a,e.budgetId,e.name,Math.max(0,Math.round(Number(e.amountMinor??0))),n,r(e.budgetSaveTargetAccountId),r(e.budgetSaveSourceAccountId),p(e.periodMode),s,e.sortOrder??0,d,d]),a}async function k(t,e){if(_(t),!e)return;const d=c();await o(`UPDATE budget_items
     SET budget_container_id = NULL, updated_at = ?
     WHERE ledger_id = ? AND budget_container_id = ?;`,[d,t,e]),await o("DELETE FROM budget_containers WHERE ledger_id = ? AND id = ?;",[t,e])}async function w(t,e){_(t),await o("DELETE FROM budget_containers WHERE ledger_id = ? AND budget_id = ?;",[t,e])}async function U(t,e){const d=await u(`SELECT bi.ledger_id, bi.id, bi.budget_id, bi.scope_type, bi.category_id, bi.category_group_id,
            bi.budget_container_id,
            bi.amount_minor, bi.amount_mode, bi.day_rule_unit, bi.day_rule_values_json,
            bi.budget_save_enabled, bi.budget_save_target_account_id, bi.budget_save_source_account_id,
            bi.sort_order AS sort_order, c.name AS category_name
     FROM budget_items bi
     LEFT JOIN categories c
       ON c.ledger_id = bi.ledger_id
      AND c.id = bi.category_id
     WHERE bi.ledger_id = ? AND bi.budget_id = ?
     ORDER BY bi.sort_order ASC, bi.created_at ASC;`,[t,e]);return i(d)}async function F(t,e){const d=c(),a=e.id??g("bi");return await o(`INSERT INTO budget_items (
      ledger_id, id, budget_id, scope_type, category_id, category_group_id,
      budget_container_id,
      amount_minor, amount_mode, day_rule_unit, day_rule_values_json,
      budget_save_enabled, budget_save_target_account_id, budget_save_source_account_id,
      sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ledger_id, id) DO UPDATE SET
      scope_type = excluded.scope_type,
      category_id = excluded.category_id,
      category_group_id = excluded.category_group_id,
      budget_container_id = excluded.budget_container_id,
      amount_minor = excluded.amount_minor,
      amount_mode = excluded.amount_mode,
      day_rule_unit = excluded.day_rule_unit,
      day_rule_values_json = excluded.day_rule_values_json,
      budget_save_enabled = excluded.budget_save_enabled,
      budget_save_target_account_id = excluded.budget_save_target_account_id,
      budget_save_source_account_id = excluded.budget_save_source_account_id,
      sort_order = excluded.sort_order,
      updated_at = excluded.updated_at;`,[t,a,e.budgetId,e.scopeType,e.categoryId??null,e.categoryGroupId??null,e.budgetContainerId??null,e.amountMinor,e.amountMode??"fixed",e.dayRuleUnit??"none",e.dayRuleValuesJson??"[]",l(e.budgetSaveEnabled),r(e.budgetSaveTargetAccountId),r(e.budgetSaveSourceAccountId),e.sortOrder??0,d,d]),a}async function H(t,e){await o("DELETE FROM budget_items WHERE ledger_id = ? AND id = ?;",[t,e])}async function W(t,e){await o("DELETE FROM budget_items WHERE ledger_id = ? AND budget_id = ?;",[t,e])}async function P(t,e,d={}){if(_(t),!e)throw new Error("缺少預算 ID");await o(`UPDATE budgets
     SET budget_save_total_enabled = ?,
         budget_save_total_target_account_id = ?,
         budget_save_total_source_account_id = ?,
         updated_at = ?
     WHERE ledger_id = ? AND id = ? AND deleted_at IS NULL;`,[l(d.enabled),r(d.targetAccountId),r(d.sourceAccountId),c(),t,e])}async function z(t,e,d){const a=await u(`SELECT category_id, SUM(${m("transactions")}) AS spent_minor
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
       AND type = 'expense'
       AND include_in_budget = 1
       AND occurred_at >= ?
       AND occurred_at < ?
       AND category_id IS NOT NULL
     GROUP BY category_id;`,[t,e,d]);return i(a)}async function $(t,e,d){const a=await u(`SELECT category_id, substr(occurred_at, 1, 10) AS occurred_day
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
       AND type = 'expense'
       AND include_in_budget = 1
       AND ${m("transactions")} > 0
       AND occurred_at >= ?
       AND occurred_at < ?
       AND category_id IS NOT NULL
     GROUP BY category_id, substr(occurred_at, 1, 10);`,[t,e,d]);return i(a)}async function K(t,e,d){const a=await u(`SELECT category_id,
            substr(occurred_at, 1, 10) AS occurred_day,
            SUM(${m("transactions")}) AS spent_minor
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
       AND type = 'expense'
       AND include_in_budget = 1
       AND occurred_at >= ?
       AND occurred_at < ?
       AND category_id IS NOT NULL
     GROUP BY category_id, substr(occurred_at, 1, 10);`,[t,e,d]);return i(a)}async function L(t,e,d,a){_(t);const n=await u(`SELECT ledger_id, id, scope_type, scope_ref_id, period_key,
            source_account_id, target_account_id, settled_amount_minor, status,
            transfer_group_id, last_error, created_at, updated_at
     FROM budget_save_settlements
     WHERE ledger_id = ?
       AND scope_type = ?
       AND scope_ref_id = ?
       AND period_key = ?
     LIMIT 1;`,[t,e,d,a]);return b(n)}async function Y(t,e={}){_(t);const d=String(e.scopeType??"").trim(),a=String(e.scopeRefId??"").trim(),n=String(e.periodKey??"").trim();if(!d||!a||!n)throw new Error("預算存款結算資料不完整");const s=c(),S=String(e.id??"").trim()||N(d,a,n);return await o(`INSERT INTO budget_save_settlements (
      ledger_id, id, scope_type, scope_ref_id, period_key,
      source_account_id, target_account_id, settled_amount_minor, status,
      transfer_group_id, last_error, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ledger_id, id) DO UPDATE SET
      source_account_id = excluded.source_account_id,
      target_account_id = excluded.target_account_id,
      settled_amount_minor = excluded.settled_amount_minor,
      status = excluded.status,
      transfer_group_id = excluded.transfer_group_id,
      last_error = excluded.last_error,
      updated_at = excluded.updated_at;`,[t,S,d,a,n,r(e.sourceAccountId),r(e.targetAccountId),Math.max(0,Math.round(Number(e.settledAmountMinor??0)||0)),String(e.status??"failed").trim()||"failed",r(e.transferGroupId),String(e.lastError??"").trim()||null,s,s]),L(t,d,a,n)}async function q(t,e,d,a){_(t),await o(`DELETE FROM budget_save_settlements
     WHERE ledger_id = ?
       AND scope_type = ?
       AND scope_ref_id = ?
       AND period_key = ?;`,[t,e,d,a])}export{z as computeBudgetSpentByCategory,B as createBudget,k as deleteBudgetContainer,w as deleteBudgetContainersByBudget,H as deleteBudgetItem,W as deleteBudgetItemsByBudget,q as deleteBudgetSaveSettlement,x as getBudgetByMonth,D as getBudgetByPeriod,L as getBudgetSaveSettlement,M as listBudgetContainers,U as listBudgetItems,K as listBudgetSpentByCategoryAndDay,$ as listBudgetUsageDaysByCategory,I as listBudgetsWithSaveRules,P as updateBudgetSaveTotalConfig,h as upsertBudgetContainer,F as upsertBudgetItem,Y as upsertBudgetSaveSettlement};
