import{q as n,a as c,b as a,c as g,n as u,r as o,f as l}from"./app-google-6WICTDwl.js";import"./vendor-sqlite-DKEMZiEb.js";import"./app-membership-DA28kzVh.js";import"./app-i18n-DMQMgWtW.js";import"./vendor-CkjNk_C8.js";function y(t){return String(t??"").trim()==="daily"?"daily":"monthly"}function r(t){return String(t??"").trim()||null}function s(t){return t===!0||t===1||t==="1"}function A(t,e,d){return`${String(t??"").trim()}:${String(e??"").trim()}:${String(d??"").trim()}`}function p(t){return String(t??"").trim()==="pay_cycle"?"pay_cycle":"calendar_month"}function m(t,e){return String(t??"").trim()||String(e??"").trim()}function N(t="transactions"){return`COALESCE((
    SELECT SUM(ABS(rt.amount_minor))
    FROM transactions rt
    LEFT JOIN categories rc
      ON rc.ledger_id = rt.ledger_id
     AND rc.id = rt.category_id
    WHERE rt.ledger_id = ${t}.ledger_id
      AND rt.deleted_at IS NULL
      AND rt.external_ref_id = ${t}.id
      AND (
        rt.origin_type = 'refund'
        OR rc.name = '退款'
        OR rt.note LIKE '退款：%'
        OR rt.note LIKE '退款:%'
      )
  ), 0)`}function E(t="transactions"){const e=N(t);return`(CASE
    WHEN ABS(${t}.amount_minor) - ${e} > 0
    THEN ABS(${t}.amount_minor) - ${e}
    ELSE 0
  END)`}async function f(t,e){a(t);const d=await n(`SELECT ledger_id, id, month_key,
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
     LIMIT 1;`,[t,e]);return l(d)}async function L(t,e){a(t);const d=String(e??"").trim();if(!d)return null;const _=await n(`SELECT ledger_id, id, month_key,
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
     LIMIT 1;`,[t,d]);return l(_)}async function I(t,e){a(t);const d=e.id??g("budget"),_=u();return await o(`INSERT INTO budgets (
      ledger_id, id, month_key,
      period_key, period_start_date, period_end_date, period_mode,
      name,
      include_transfers, include_loan_repayments, include_reimbursed_expenses,
      budget_save_total_enabled, budget_save_total_target_account_id, budget_save_total_source_account_id,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,[t,d,e.monthKey,m(e.periodKey,e.monthKey),e.periodStartDate??null,e.periodEndDate??null,p(e.periodMode),e.name??null,e.includeTransfers?1:0,e.includeLoanRepayments?1:0,e.includeReimbursedExpenses?1:0,s(e.budgetSaveTotalEnabled),r(e.budgetSaveTotalTargetAccountId),r(e.budgetSaveTotalSourceAccountId),_,_]),L(t,m(e.periodKey,e.monthKey))}async function x(t){a(t);const e=await n(`SELECT b.ledger_id, b.id, b.month_key,
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
     ORDER BY COALESCE(b.period_start_date, b.month_key || '-01') ASC, b.created_at ASC;`,[t]);return c(e)}async function B(t,e){a(t);const d=await n(`SELECT ledger_id, id, budget_id, name, amount_minor,
            budget_save_enabled, budget_save_target_account_id, budget_save_source_account_id,
            period_mode, sort_order, created_at, updated_at
     FROM budget_containers
     WHERE ledger_id = ? AND budget_id = ?
     ORDER BY sort_order ASC, created_at ASC;`,[t,e]);return c(d)}async function M(t,e){a(t);const d=u(),_=e.id??g("bc");return await o(`INSERT INTO budget_containers (
      ledger_id, id, budget_id, name, amount_minor,
      budget_save_enabled, budget_save_target_account_id, budget_save_source_account_id,
      period_mode, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(ledger_id, id) DO UPDATE SET
      name = excluded.name,
      amount_minor = excluded.amount_minor,
      budget_save_enabled = excluded.budget_save_enabled,
      budget_save_target_account_id = excluded.budget_save_target_account_id,
      budget_save_source_account_id = excluded.budget_save_source_account_id,
      period_mode = excluded.period_mode,
      sort_order = excluded.sort_order,
      updated_at = excluded.updated_at;`,[t,_,e.budgetId,e.name,Math.max(0,Math.round(Number(e.amountMinor??0))),s(e.budgetSaveEnabled),r(e.budgetSaveTargetAccountId),r(e.budgetSaveSourceAccountId),y(e.periodMode),e.sortOrder??0,d,d]),_}async function h(t,e){if(a(t),!e)return;const d=u();await o(`UPDATE budget_items
     SET budget_container_id = NULL, updated_at = ?
     WHERE ledger_id = ? AND budget_container_id = ?;`,[d,t,e]),await o("DELETE FROM budget_containers WHERE ledger_id = ? AND id = ?;",[t,e])}async function w(t,e){a(t),await o("DELETE FROM budget_containers WHERE ledger_id = ? AND budget_id = ?;",[t,e])}async function k(t,e){const d=await n(`SELECT bi.ledger_id, bi.id, bi.budget_id, bi.scope_type, bi.category_id, bi.category_group_id,
            bi.budget_container_id,
            bi.amount_minor, bi.amount_mode, bi.day_rule_unit, bi.day_rule_values_json,
            bi.budget_save_enabled, bi.budget_save_target_account_id, bi.budget_save_source_account_id,
            bi.sort_order AS sort_order, c.name AS category_name
     FROM budget_items bi
     LEFT JOIN categories c
       ON c.ledger_id = bi.ledger_id
      AND c.id = bi.category_id
     WHERE bi.ledger_id = ? AND bi.budget_id = ?
     ORDER BY bi.sort_order ASC, bi.created_at ASC;`,[t,e]);return c(d)}async function U(t,e){const d=u(),_=e.id??g("bi");return await o(`INSERT INTO budget_items (
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
      updated_at = excluded.updated_at;`,[t,_,e.budgetId,e.scopeType,e.categoryId??null,e.categoryGroupId??null,e.budgetContainerId??null,e.amountMinor,e.amountMode??"fixed",e.dayRuleUnit??"none",e.dayRuleValuesJson??"[]",s(e.budgetSaveEnabled),r(e.budgetSaveTargetAccountId),r(e.budgetSaveSourceAccountId),e.sortOrder??0,d,d]),_}async function F(t,e){await o("DELETE FROM budget_items WHERE ledger_id = ? AND id = ?;",[t,e])}async function H(t,e){await o("DELETE FROM budget_items WHERE ledger_id = ? AND budget_id = ?;",[t,e])}async function W(t,e,d={}){if(a(t),!e)throw new Error("缺少預算 ID");await o(`UPDATE budgets
     SET budget_save_total_enabled = ?,
         budget_save_total_target_account_id = ?,
         budget_save_total_source_account_id = ?,
         updated_at = ?
     WHERE ledger_id = ? AND id = ? AND deleted_at IS NULL;`,[s(d.enabled),r(d.targetAccountId),r(d.sourceAccountId),u(),t,e])}async function P(t,e,d){const _=await n(`SELECT category_id, SUM(${E("transactions")}) AS spent_minor
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
       AND type = 'expense'
       AND include_in_budget = 1
       AND occurred_at >= ?
       AND occurred_at < ?
       AND category_id IS NOT NULL
     GROUP BY category_id;`,[t,e,d]);return c(_)}async function $(t,e,d){const _=await n(`SELECT category_id, substr(occurred_at, 1, 10) AS occurred_day
     FROM transactions
     WHERE ledger_id = ?
       AND deleted_at IS NULL
       AND type = 'expense'
       AND include_in_budget = 1
       AND ${E("transactions")} > 0
       AND occurred_at >= ?
       AND occurred_at < ?
       AND category_id IS NOT NULL
     GROUP BY category_id, substr(occurred_at, 1, 10);`,[t,e,d]);return c(_)}async function D(t,e,d,_){a(t);const i=await n(`SELECT ledger_id, id, scope_type, scope_ref_id, period_key,
            source_account_id, target_account_id, settled_amount_minor, status,
            transfer_group_id, last_error, created_at, updated_at
     FROM budget_save_settlements
     WHERE ledger_id = ?
       AND scope_type = ?
       AND scope_ref_id = ?
       AND period_key = ?
     LIMIT 1;`,[t,e,d,_]);return l(i)}async function K(t,e={}){a(t);const d=String(e.scopeType??"").trim(),_=String(e.scopeRefId??"").trim(),i=String(e.periodKey??"").trim();if(!d||!_||!i)throw new Error("預算存款結算資料不完整");const b=u(),S=String(e.id??"").trim()||A(d,_,i);return await o(`INSERT INTO budget_save_settlements (
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
      updated_at = excluded.updated_at;`,[t,S,d,_,i,r(e.sourceAccountId),r(e.targetAccountId),Math.max(0,Math.round(Number(e.settledAmountMinor??0)||0)),String(e.status??"failed").trim()||"failed",r(e.transferGroupId),String(e.lastError??"").trim()||null,b,b]),D(t,d,_,i)}async function z(t,e,d,_){a(t),await o(`DELETE FROM budget_save_settlements
     WHERE ledger_id = ?
       AND scope_type = ?
       AND scope_ref_id = ?
       AND period_key = ?;`,[t,e,d,_])}export{P as computeBudgetSpentByCategory,I as createBudget,h as deleteBudgetContainer,w as deleteBudgetContainersByBudget,F as deleteBudgetItem,H as deleteBudgetItemsByBudget,z as deleteBudgetSaveSettlement,f as getBudgetByMonth,L as getBudgetByPeriod,D as getBudgetSaveSettlement,B as listBudgetContainers,k as listBudgetItems,$ as listBudgetUsageDaysByCategory,x as listBudgetsWithSaveRules,W as updateBudgetSaveTotalConfig,M as upsertBudgetContainer,U as upsertBudgetItem,K as upsertBudgetSaveSettlement};
