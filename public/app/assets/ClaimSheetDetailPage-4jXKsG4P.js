import{cp as R,cC as le,cq as M,cD as q,cE as ze,cF as De,_ as Ne,J as Ee,b as Ie,d as Re,al as He,o as Me,L as Z,cr as Pe,cs as ee,cA as Fe,cG as qe,cH as Oe,cw as Be}from"./index-DTeF_q6q.js";import{C as Ue}from"./vendor-sqlite-0kSzDcW4.js";import{a2 as We,a3 as je,E as Ve,o as Ge,w as Je,n as te,p as Xe,x as d,e as w,u as Ke,O as Qe,j as Ye,k as g,l as h,q as l,t as m,s as z,H as y,F as ae,m as ne,c as F}from"./vendor-CMZrPRW1.js";import{M as I}from"./MoneyText-DI9WmmLI.js";import{u as Ze,b as ie}from"./app-i18n-Clg64AuJ.js";import{g as et,e as tt}from"./claim-sheet-presentation-2ri67IDP.js";import{af as at,aj as nt,ak as re,ag as it,ah as rt}from"./app-google-B7EgMrSJ.js";import"./vendor-icons-Ck0eIV-m.js";import"./app-membership-BiCrykJ3.js";const O=794,V=1123;function i(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function se(e,n="claim-sheet"){return String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||n}function ce(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleString(n,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function st(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleDateString(n,{year:"numeric",month:"2-digit",day:"2-digit"})}function T(e,n="zh-TW"){const a=Math.max(0,Math.round(Number(e??0)))/100;return new Intl.NumberFormat(n,{minimumFractionDigits:2,maximumFractionDigits:2}).format(a)}function ot(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceType:String(e?.entry_type??"").trim()==="income"?n.incomeType:n.expenseType}function lt(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceSource:String(e?.transaction_id??"").trim()?n.importedSource:n.manualSource}function ct(e={}){return{title:e.title||"請款單",detailTitle:e.detailTitle||"請款單明細",totalLabel:e.totalLabel||"請款淨額",statusLabel:e.statusLabel||"狀態",counterpartyLabel:e.counterpartyLabel||"請款對象",noteLabel:e.noteLabel||"備註",updatedAtLabel:e.updatedAtLabel||"更新時間",itemCountLabel:e.itemCountLabel||"項目數",categoryLabel:e.categoryLabel||"分類",descriptionLabel:e.descriptionLabel||"說明",amountLabel:e.amountLabel||"金額",dateLabel:e.dateLabel||"日期",sourceLabel:e.sourceLabel||"來源",importedNoteLabel:e.importedNoteLabel||"報銷備註",statusValue:e.statusValue||"",incomeType:e.incomeType||"收入",expenseType:e.expenseType||"支出",advanceType:e.advanceType||"代收",manualSource:e.manualSource||"手動項目",importedSource:e.importedSource||"導入報銷",advanceSource:e.advanceSource||"代收項目",emptyDescription:e.emptyDescription||"未命名項目",uncategorized:e.uncategorized||"未分類",summaryHint:e.summaryHint||"匯入報銷備註與手動代收項目均已納入此 PDF。",paidLabel:e.paidLabel||"已入帳",remainingLabel:e.remainingLabel||"剩餘未收",itemClaimAmountLabel:e.itemClaimAmountLabel||"請款金額",itemSettledLabel:e.itemSettledLabel||"已請款",itemRemainingLabel:e.itemRemainingLabel||"剩餘",paymentsTitle:e.paymentsTitle||"入帳紀錄",paymentsEmpty:e.paymentsEmpty||"尚無入帳紀錄",paymentDateLabel:e.paymentDateLabel||"入帳時間",paymentAmountLabel:e.paymentAmountLabel||"入帳金額",paymentAccountLabel:e.paymentAccountLabel||"帳戶",unknownAccount:e.unknownAccount||"未指定帳戶"}}function de(e,n=[]){const a=R(e),t=le(e);return a>0&&M(e)>0||a>0&&t>0&&a<t?!0:n.some(s=>q(s)>0)}function dt(){return`
    <style>
      .claim-pdf-page {
        width: ${O}px;
        height: ${V}px;
        box-sizing: border-box;
        padding: 34px;
        color: #0f172a;
        background:
          radial-gradient(circle at top right, rgba(59, 130, 246, 0.10), transparent 24%),
          linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        font-family: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
        overflow: hidden;
      }
      .claim-pdf {
        height: 100%;
        display: grid;
        align-content: start;
        gap: 14px;
      }
      .hero,
      .continuation-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        padding: 18px 20px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.26);
      }
      .hero {
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 62%);
      }
      .eyebrow {
        margin-bottom: 8px;
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #2563eb;
      }
      .hero h1,
      .continuation-head h2,
      .items-panel-head h3 {
        margin: 0;
        line-height: 1.2;
      }
      .hero h1 {
        font-size: 28px;
      }
      .continuation-head h2 {
        font-size: 22px;
      }
      .hero-note,
      .continuation-note {
        margin: 10px 0 0;
        font-size: 12px;
        line-height: 1.6;
        color: #475569;
      }
      .payment-summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      .payment-metric {
        padding: 14px 16px;
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(255, 255, 255, 0.94);
        display: grid;
        gap: 6px;
      }
      .payment-metric--total {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #f8fafc;
        border-color: transparent;
      }
      .payment-metric--paid {
        background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 88%);
        border-color: rgba(16, 185, 129, 0.28);
      }
      .payment-metric--remaining {
        background: linear-gradient(135deg, #fffbeb 0%, #ffffff 88%);
        border-color: rgba(245, 158, 11, 0.28);
      }
      .payment-metric span {
        font-size: 11px;
        color: #64748b;
      }
      .payment-metric--total span {
        color: rgba(248, 250, 252, 0.72);
      }
      .payment-metric strong {
        font-size: 22px;
        line-height: 1.15;
        letter-spacing: -0.02em;
      }
      .continuation-total {
        min-width: 160px;
        padding: 14px 16px;
        border-radius: 20px;
        background: #0f172a;
        color: #f8fafc;
        display: grid;
        gap: 6px;
      }
      .continuation-total span {
        font-size: 11px;
        color: rgba(248, 250, 252, 0.72);
      }
      .continuation-total strong {
        font-size: 24px;
        line-height: 1.1;
      }
      .continuation-metrics {
        display: grid;
        gap: 6px;
        min-width: 180px;
        text-align: right;
        font-size: 12px;
        color: #475569;
      }
      .continuation-metrics strong {
        color: #0f172a;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .payments-panel {
        padding: 12px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.20);
        display: grid;
        gap: 8px;
      }
      .payments-panel h4 {
        margin: 0;
        font-size: 14px;
      }
      .payments-table {
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        overflow: hidden;
      }
      .payments-table-head,
      .payments-table-row {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1.2fr);
        gap: 10px;
        padding: 8px 12px;
        align-items: center;
      }
      .payments-table-head {
        background: #f1f5f9;
        font-size: 11px;
        font-weight: 700;
        color: #334155;
      }
      .payments-table-row {
        background: #ffffff;
        border-top: 1px solid rgba(226, 232, 240, 0.9);
        font-size: 12px;
      }
      .payments-table-row .amount {
        text-align: right;
        font-weight: 700;
      }
      .summary-card,
      .claim-note,
      .items-panel,
      .item-row {
        break-inside: avoid;
      }
      .summary-card {
        padding: 12px 14px;
        border-radius: 18px;
        background: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.20);
        display: grid;
        gap: 6px;
      }
      .meta-label {
        font-size: 11px;
        color: #64748b;
      }
      .summary-card strong,
      .claim-note p,
      .cell,
      .item-note-row p {
        font-size: 13px;
      }
      .claim-note {
        padding: 12px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.20);
      }
      .claim-note p,
      .item-note-row p {
        margin: 6px 0 0;
        white-space: pre-wrap;
        line-height: 1.55;
      }
      .items-panel {
        padding: 14px 16px 16px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(148, 163, 184, 0.22);
        display: grid;
        gap: 10px;
      }
      .items-panel-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-end;
      }
      .items-panel-head h3 {
        font-size: 18px;
      }
      .items-count {
        font-size: 12px;
        color: #1e293b;
        white-space: nowrap;
      }
      .items-table {
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        overflow: hidden;
      }
      .items-table-head,
      .item-main-grid {
        display: grid;
        grid-template-columns: 46px minmax(0, 2.25fr) minmax(0, 1.15fr) minmax(0, 1.3fr) 98px 94px;
        gap: 12px;
        align-items: start;
      }
      .items-table--partial .items-table-head,
      .items-table--partial .item-main-grid {
        grid-template-columns: 36px minmax(0, 2fr) minmax(0, 1fr) 78px 72px 72px 72px;
      }
      .items-table--partial .cell-amount-settled {
        text-align: right;
        font-size: 12px;
        color: #047857;
      }
      .items-table--partial .cell-amount-remaining {
        text-align: right;
        font-size: 12px;
        color: #b45309;
      }
      .items-table-head {
        padding: 10px 14px;
        background: #e2e8f0;
        font-size: 11px;
        font-weight: 700;
        color: #334155;
      }
      .items-table-body {
        display: grid;
      }
      .item-row {
        padding: 10px 14px;
        background: #ffffff;
        border-top: 1px solid rgba(226, 232, 240, 0.9);
      }
      .item-row:first-child {
        border-top: 0;
      }
      .item-index,
      .cell-date,
      .cell-amount {
        white-space: nowrap;
      }
      .item-index {
        font-size: 12px;
        color: #2563eb;
        font-weight: 700;
      }
      .cell {
        line-height: 1.5;
        color: #0f172a;
      }
      .cell-description strong {
        display: block;
        font-size: 13px;
        line-height: 1.45;
      }
      .cell-description small {
        display: block;
        margin-top: 4px;
        font-size: 11px;
        color: #64748b;
      }
      .cell-amount {
        text-align: right;
        font-size: 14px;
      }
      .item-note-row {
        margin-top: 8px;
        padding: 8px 10px;
        border-radius: 12px;
        background: #eff6ff;
      }
      .item-row-note-continuation {
        background: #f8fbff;
      }
      .item-note-continuation-head {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }
      .item-note-continuation-head .cell-description {
        min-width: 0;
      }
      .item-note-row-continued {
        background: #eef2ff;
      }
      .empty-note {
        margin: 0;
        padding: 14px;
        color: #64748b;
        font-size: 13px;
      }
    </style>
  `}function mt(){const e=document.createElement("div");return e.setAttribute("data-claim-sheet-pdf","true"),e.style.position="fixed",e.style.left="-99999px",e.style.top="0",e.style.width=`${O}px`,e.style.padding="0",e.style.background="#ffffff",e.style.zIndex="-1",e.innerHTML=dt(),e}function ut(e,n,a){const t=le(e),s=R(e),c=M(e);return`
    <section class="payment-summary">
      <article class="payment-metric payment-metric--total">
        <span>${i(n.totalLabel)}</span>
        <strong>${i(T(t,a))}</strong>
      </article>
      <article class="payment-metric payment-metric--paid">
        <span>${i(n.paidLabel)}</span>
        <strong>${i(T(s,a))}</strong>
      </article>
      <article class="payment-metric payment-metric--remaining">
        <span>${i(n.remainingLabel)}</span>
        <strong>${i(T(c,a))}</strong>
      </article>
    </section>
  `}function pt(e,n,a){const t=Array.isArray(e)?e:[];return t.length?`
    <section class="payments-panel">
      <h4>${i(n.paymentsTitle)}</h4>
      <div class="payments-table">
        <div class="payments-table-head">
          <span>${i(n.paymentDateLabel)}</span>
          <span>${i(n.paymentAccountLabel)}</span>
          <span>${i(n.paymentAmountLabel)}</span>
        </div>
        ${t.map(s=>`
          <div class="payments-table-row">
            <span>${i(ce(s?.paid_at,a))}</span>
            <span>${i(String(s?.account_name??"").trim()||n.unknownAccount)}</span>
            <span class="amount">${i(T(s?.amount_minor,a))}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `:`
      <section class="payments-panel">
        <h4>${i(n.paymentsTitle)}</h4>
        <p class="empty-note">${i(n.paymentsEmpty)}</p>
      </section>
    `}function gt(e,n,a,t,s=[]){const c=R(e)>0||Array.isArray(s)&&s.length>0;return`
    <div class="claim-pdf">
      <header class="hero">
        <div>
          <div class="eyebrow">${i(a.title)}</div>
          <h1>${i(String(e?.title??"").trim()||a.detailTitle)}</h1>
          <p class="hero-note">${i(a.summaryHint)}</p>
        </div>
      </header>

      ${ut(e,a,t)}

      <section class="summary-grid">
        <article class="summary-card">
          <span class="meta-label">${i(a.statusLabel)}</span>
          <strong>${i(a.statusValue)}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${i(a.counterpartyLabel)}</span>
          <strong>${i(String(e?.counterparty_name??"").trim()||"-")}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${i(a.updatedAtLabel)}</span>
          <strong>${i(ce(e?.updated_at,t))}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${i(a.itemCountLabel)}</span>
          <strong>${i(String(n.length))}</strong>
        </article>
      </section>

      ${String(e?.note??"").trim()?`<section class="claim-note"><span class="meta-label">${i(a.noteLabel)}</span><p>${i(e.note)}</p></section>`:""}

      ${c?pt(s,a,t):""}

      ${me(e,n,a)}
    </div>
  `}function ft(e,n,a,t){const s=R(e),c=M(e);return`
    <div class="claim-pdf">
      <header class="continuation-head">
        <div>
          <div class="eyebrow">${i(a.detailTitle)}</div>
          <h2>${i(String(e?.title??"").trim()||a.detailTitle)}</h2>
          <p class="continuation-note">${i(a.summaryHint)}</p>
        </div>
        <div class="continuation-metrics">
          <div>${i(a.totalLabel)} <strong>${i(T(e?.total_minor,t))}</strong></div>
          <div>${i(a.paidLabel)} <strong>${i(T(s,t))}</strong></div>
          <div>${i(a.remainingLabel)} <strong>${i(T(c,t))}</strong></div>
        </div>
      </header>

      ${me(e,n,a)}
    </div>
  `}function me(e,n,a,t){const s=de(e,n),c=s?"items-table items-table--partial":"items-table",u=s?`
          <span>#</span>
          <span>${i(a.descriptionLabel)}</span>
          <span>${i(a.categoryLabel)}</span>
          <span>${i(a.dateLabel)}</span>
          <span>${i(a.itemClaimAmountLabel)}</span>
          <span>${i(a.itemSettledLabel)}</span>
          <span>${i(a.itemRemainingLabel)}</span>
        `:`
          <span>#</span>
          <span>${i(a.descriptionLabel)}</span>
          <span>${i(a.categoryLabel)}</span>
          <span>${i(a.sourceLabel)}</span>
          <span>${i(a.dateLabel)}</span>
          <span>${i(a.amountLabel)}</span>
        `;return`
    <section class="items-panel">
      <div class="items-panel-head">
        <div>
          <div class="meta-label">${i(a.detailTitle)}</div>
          <h3>${i(String(e?.title??"").trim()||a.detailTitle)}</h3>
        </div>
        <strong class="items-count">${i(`${a.itemCountLabel}：${n.length}`)}</strong>
      </div>
      <div class="${c}" data-partial="${s?"1":"0"}">
        <div class="items-table-head">
          ${u}
        </div>
        <div class="items-table-body" data-role="items-body"></div>
      </div>
    </section>
  `}function oe(e){return`${e}（續）`}function ht(e,n,a,t,s,c=!1){const u=String(e?.description??"").trim()||a.emptyDescription,p=String(e?.transaction_note??"").trim(),L=`${ot(e,a)} / ${lt(e,a)}`,x=ze(e),v=q(e),_=De(e);return{amountText:T(x,t),settledText:T(v,t),remainingText:T(_,t),partialColumns:c,categoryName:s,dateText:st(e?.occurred_at,t),description:u,importedNote:p,indexLabel:String(n+1).padStart(2,"0"),itemSourceText:L}}function _t(e){return e.partialColumns?`
    <div class="item-main-grid">
      <span class="item-index">${i(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${i(e.description)}</strong>
        <small>${i(e.itemSourceText)}</small>
      </div>
      <span class="cell">${i(e.categoryName)}</span>
      <span class="cell cell-date">${i(e.dateText)}</span>
      <strong class="cell cell-amount">${i(e.amountText)}</strong>
      <strong class="cell cell-amount-settled">${i(e.settledText)}</strong>
      <strong class="cell cell-amount-remaining">${i(e.remainingText)}</strong>
    </div>
  `:`
    <div class="item-main-grid">
      <span class="item-index">${i(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${i(e.description)}</strong>
        <small>${i(e.itemSourceText)}</small>
      </div>
      <span class="cell">${i(e.categoryName)}</span>
      <span class="cell">${i(e.itemSourceText)}</span>
      <span class="cell cell-date">${i(e.dateText)}</span>
      <strong class="cell cell-amount">${i(e.amountText)}</strong>
    </div>
  `}function bt(e,n,a,t,s,c=[]){const u=document.createElement("section");return u.className="claim-pdf-page",u.innerHTML=s?gt(e,n,a,t,c):ft(e,n,a,t),{page:u,body:u.querySelector('[data-role="items-body"]')}}function ue(e,n,a={}){const t=String(a.noteText??e.importedNote??"").trim(),s=document.createElement("article");return s.className="item-row",s.innerHTML=`
    ${_t(e)}
    ${t?`<div class="item-note-row"><span class="meta-label">${i(n.importedNoteLabel)}</span><p>${i(t)}</p></div>`:""}
  `,s}function j(e,n,a){const t=document.createElement("article");return t.className="item-row item-row-note-continuation",t.innerHTML=`
    <div class="item-note-continuation-head">
      <span class="item-index">${i(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${i(e.description)}</strong>
        <small>${i(oe(n.importedNoteLabel))}</small>
      </div>
    </div>
    <div class="item-note-row item-note-row-continued">
      <span class="meta-label">${i(oe(n.importedNoteLabel))}</span>
      <p>${i(a)}</p>
    </div>
  `,t}function yt(e){const n=document.createElement("p");return n.className="empty-note",n.textContent=e.detailTitle,n}async function vt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))}async function xt(e){return await vt(),je(e,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,width:O,height:V,windowWidth:O,windowHeight:V})}function pe(e){return e.scrollHeight>e.clientHeight}function B(e,n){return e.body.appendChild(n),pe(e.page)?(e.body.removeChild(n),!1):!0}function Lt(e,n){const a=Math.max(1,Math.min(e.length,Math.floor(n)));if(a>=e.length)return e.length;const t=e.slice(0,a),s=t.lastIndexOf(`
`),c=t.lastIndexOf(" "),u=Math.max(s,c),p=Math.max(1,Math.floor(a*.6));return u>=p?u+1:a}function $t(e,n,a){const t=String(n??"");if(!t)return null;let s=1,c=t.length,u=null;for(;s<=c;){const p=Math.floor((s+c)/2),L=Lt(t,p),x=t.slice(0,L),v=a(x);e.body.appendChild(v);const _=!pe(e.page);if(e.body.removeChild(v),_){u={consumedLength:L,text:x},s=p+1;continue}c=p-1}return u}function wt(e,n){return String(e??"").slice(n).replace(/^\s+/,"")}function St(e,n,a,t){const s=ue(e,n,{noteText:""});B(a,s)||(a.body.childElementCount&&(a=t(!1)),B(a,s)||a.body.appendChild(s));let c=e.importedNote;for(;c;){const u=$t(a,c,p=>j(e,n,p));if(!u){if(!a.body.childElementCount){a.body.appendChild(j(e,n,c));break}a=t(!1);continue}a.body.appendChild(j(e,n,u.text)),c=wt(c,u.consumedLength),c&&(a=t(!1))}return a}function kt(e,n={},a){const t=e?.claim??{},s=Array.isArray(e?.items)?e.items:[],c=Array.isArray(e?.payments)?e.payments:[],u=n.locale||"zh-TW",p=ct(n),L=de(t,s),x=[];function v(b){const S=bt(t,s,p,u,b,c);return a.appendChild(S.page),x.push(S),S}let _=v(!0);return s.forEach((b,S)=>{const N=n.categoryName?.(b?.category_id)||p.uncategorized,o=ht(b,S,p,u,N,L),k=ue(o,p);B(_,k)||(_.body.childElementCount&&(_=v(!1)),B(_,k)||(_=St(o,p,_,v)))}),x.forEach(({body:b})=>{b.childElementCount||b.appendChild(yt(p))}),{container:a,pages:x}}async function Tt(e,n={}){if(typeof document>"u")throw new Error("目前環境不支援 PDF 匯出");const a=mt();document.body.appendChild(a);const{pages:t}=kt(e,n,a);try{const s=new We({orientation:"portrait",unit:"pt",format:"a4",compress:!0}),c=s.internal.pageSize.getWidth(),u=s.internal.pageSize.getHeight();for(const[x,{page:v}]of t.entries()){const b=(await xt(v)).toDataURL("image/png");x>0&&s.addPage(),s.addImage(b,"PNG",0,0,c,u,void 0,"FAST")}const p=se(e?.claim?.title??n.title??"claim-sheet"),L=se(e?.claim?.id??"claim");return{filename:`${p}_${L}.pdf`,blob:s.output("blob")}}finally{a.remove()}}const Ct={key:0,class:"card panel"},At={class:"row claim-head"},zt={class:"claim-title"},Dt={class:"muted"},Nt={class:"detail-grid"},Et={class:"detail-row"},It={class:"muted"},Rt={class:"detail-row"},Ht={class:"muted"},Mt={class:"detail-row"},Pt={class:"muted"},Ft={class:"detail-row"},qt={class:"muted"},Ot={key:0,class:"detail-row"},Bt={class:"muted"},Ut={class:"detail-row"},Wt={class:"muted"},jt={key:0,class:"note"},Vt={class:"row action-row"},Gt=["disabled"],Jt=["disabled"],Xt=["disabled"],Kt=["disabled"],Qt={key:1,class:"muted file-note"},Yt={key:2,class:"muted file-note"},Zt={key:3,class:"row export-open-row"},ea={key:1,class:"card panel"},ta={class:"row"},aa={class:"detail-list"},na={class:"row detail-item-head"},ia={class:"detail-item-title"},ra={class:"detail-meta"},sa={class:"detail-badge muted"},oa={class:"detail-badge muted"},la={class:"detail-badge muted"},ca={key:0,class:"detail-badge muted"},da={key:0,class:"muted detail-note"},ma={key:2,class:"card panel"},ua={class:"row"},pa={class:"detail-list"},ga={class:"row detail-item-head"},fa={class:"detail-item-title"},ha={class:"detail-meta"},_a={key:0,class:"detail-badge muted"},ba={key:1,class:"detail-badge muted"},ya={key:0,class:"muted"},va={key:3,class:"card panel"},xa={class:"muted"},La={__name:"ClaimSheetDetailPage",setup(e){const n=Ke(),a=Qe(),{t,locale:s}=Ze(),c=Ee(),u=Ie(),p=Re(),L=He(),x=w(!1),v=w(!1),_=w(!1),b=w(!1),S=w(!1),N=w(!1),o=w(null),k=w([]),D=w([]),C=w(""),E=w(""),P=w(""),H=F(()=>String(n.params.id??"").trim()),ge=F(()=>tt(p.categories)),U=F(()=>{const r=String(n.query.tab??"").trim();return r==="completed"?"completed":r==="active"?"active":ee(o.value)?"completed":"active"}),fe=F(()=>U.value==="completed"?{name:"claim-sheets",query:{tab:"completed"}}:{name:"claim-sheets"});Ve(async()=>{await p.load(),await L.load()}),Ge(()=>{G()}),Je([H,()=>u.activeLedgerId],()=>{ve()},{immediate:!0});function G(){C.value.startsWith("blob:")&&at(C.value)}function J(r){return r?new Date(r).toLocaleString(ie(s.value),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"-"}function he(r){return t(r==="paid"?"claim_sheet.status.paid":r==="rejected"?"claim_sheet.status.rejected":r==="approved"?"claim_sheet.status.approved":r==="in_review"?"claim_sheet.status.in_review":r==="submitted"?"claim_sheet.status.submitted":"claim_sheet.status.draft")}function X(r){return Pe(r)?t("claim_sheet.status.collecting"):ee(r)?t("claim_sheet.status.paid"):he(r?.status)}function K(r){return Fe(r,{payments:D.value})}function Q(r){return String(r?.status??"").trim()==="paid"||R(r)>0}function Y(r){return M(r)<=0||String(r?.status??"")==="rejected"}function _e(){!o.value?.id||Y(o.value)||a.push({name:"claim-sheets",query:{complete:o.value.id,...U.value==="completed"?{tab:"completed"}:{}}})}function be(r){return Math.max(0,Math.round(Number(r?.amount_minor??0)))}function ye(r){const $=String(r??"").trim();return $?p.categories.find(W=>W.id===$)?.name??t("analysis_page.uncategorized"):t("analysis_page.uncategorized")}function A(r){return et(r,ge.value,t)}async function ve(){if(!u.activeLedgerId||!H.value){o.value=null,k.value=[],D.value=[];return}x.value=!0;try{const r=await Be(u.activeLedgerId,H.value);if(H.value!==String(n.params.id??"").trim())return;o.value=r.claim??null,k.value=Array.isArray(r.items)?r.items:[],D.value=Array.isArray(r.payments)?r.payments:[]}catch(r){o.value=null,k.value=[],D.value=[],c.pushToast(r.message??t("claim_sheet.toast.load_failed"),"error")}finally{x.value=!1}}function xe(){!o.value?.id||!K(o.value)||a.push({name:"claim-sheet-edit",params:{id:H.value},query:U.value==="completed"?{tab:"completed"}:{}})}async function Le(){if(!(!o.value||v.value)){v.value=!0;try{const r=await Tt({claim:o.value,items:k.value,payments:D.value},{locale:ie(s.value),title:t("claim_sheet.title"),detailTitle:t("claim_sheet.detail_title"),totalLabel:t("claim_sheet.form.net_total"),paidLabel:t("claim_sheet.paid_amount"),remainingLabel:t("claim_sheet.remaining_amount"),statusLabel:t("claim_sheet.status_label"),counterpartyLabel:t("claim_sheet.form.counterparty"),noteLabel:t("claim_sheet.form.note"),updatedAtLabel:t("transaction_about.detail.updated_at"),itemCountLabel:t("claim_sheet.item_count_label"),categoryLabel:t("transaction_about.detail.category"),descriptionLabel:t("claim_sheet.export_headers.description"),amountLabel:t("claim_sheet.export_headers.amount"),itemClaimAmountLabel:t("claim_sheet.export_headers.claim_amount"),itemSettledLabel:t("claim_sheet.export_headers.settled_amount"),itemRemainingLabel:t("claim_sheet.export_headers.remaining_amount"),dateLabel:t("claim_sheet.export_headers.date"),sourceLabel:t("claim_sheet.export_headers.source"),importedNoteLabel:t("claim_sheet.form.import_note"),paymentsTitle:t("claim_sheet.payments_title"),paymentsEmpty:t("claim_sheet.payments_empty"),paymentDateLabel:t("claim_sheet.export_headers.payment_date"),paymentAmountLabel:t("claim_sheet.form.payment_amount"),paymentAccountLabel:t("claim_sheet.form.account"),unknownAccount:t("common.unknown_account"),incomeType:t("claim_sheet.entry_type.income"),expenseType:t("claim_sheet.entry_type.expense"),advanceType:t("claim_sheet.entry_type.advance"),manualSource:t("claim_sheet.item_source.manual"),importedSource:t("claim_sheet.item_source.imported"),advanceSource:t("claim_sheet.item_source.advance"),emptyDescription:t("claim_sheet.form.unnamed_item"),uncategorized:t("analysis_page.uncategorized"),statusValue:X(o.value),categoryName:$=>ye($),summaryHint:t("claim_sheet.export_pdf_hint")});if(G(),E.value=r.filename,P.value="",Ue.isNativePlatform()){const $=await nt(r.filename,r.blob,{category:"claim-sheets"});if($?.saved){E.value=String($.filename??r.filename),P.value=String($.location||t("claim_sheet.device_files")),C.value=String($.uri??"").trim()||String($.openUrl??"").trim()||re(r.blob),c.pushToast(t("claim_sheet.toast.exported_saved",{location:$.location||t("claim_sheet.device_files")}));return}}C.value=re(r.blob),c.pushToast(t("claim_sheet.toast.exported"))}catch(r){c.pushToast(r.message??t("claim_sheet.toast.export_failed"),"error")}finally{v.value=!1}}}function $e(){if(!C.value)return;!it(C.value)&&E.value&&rt(C.value,E.value)}function we(){o.value&&(S.value=!0)}function Se(){!o.value||!Q(o.value)||(N.value=!0)}function ke(){_.value||(S.value=!1)}function Te(){b.value||(N.value=!1)}async function Ce(){if(!(!u.activeLedgerId||!o.value?.id||b.value)){b.value=!0;try{const r=await qe(u.activeLedgerId,o.value.id,"draft");o.value=r,await L.load(),c.pushToast(t("claim_sheet.toast.restored")),await a.replace({name:"claim-sheet-detail",params:{id:o.value.id}})}catch(r){c.pushToast(r.message??t("claim_sheet.toast.restore_failed"),"error")}finally{b.value=!1,N.value=!1}}}async function Ae(){if(!(!u.activeLedgerId||!o.value?.id||_.value)){_.value=!0;try{await Oe(u.activeLedgerId,o.value.id),await L.load(),c.pushToast(t("claim_sheet.toast.voided")),await a.replace(fe.value)}catch(r){c.pushToast(r.message??t("claim_sheet.toast.void_failed"),"error")}finally{_.value=!1,S.value=!1}}}return(r,$)=>{const W=Ye("font-awesome-icon");return g(),te(Me,{title:d(t)("claim_sheet.detail_title"),kicker:d(t)("claim_sheet.habitat_hello"),"test-id":"claim-sheet-detail-view","back-to":"/claim-sheets"},{default:Xe(()=>[o.value?(g(),h("article",Ct,[l("header",At,[l("div",zt,[l("h3",null,m(o.value.title||d(t)("claim_sheet.detail_title")),1),l("small",Dt,m(X(o.value)),1)]),z(I,{"value-minor":o.value.total_minor},null,8,["value-minor"])]),l("div",Nt,[l("div",Et,[l("small",It,m(d(t)("claim_sheet.net_amount")),1),l("span",null,[z(I,{"value-minor":o.value.total_minor},null,8,["value-minor"])])]),l("div",Rt,[l("small",Ht,m(d(t)("claim_sheet.paid_amount")),1),l("span",null,[z(I,{"value-minor":d(R)(o.value)},null,8,["value-minor"])])]),l("div",Mt,[l("small",Pt,m(d(t)("claim_sheet.remaining_amount")),1),l("span",null,[z(I,{"value-minor":d(M)(o.value)},null,8,["value-minor"])])]),l("div",Ft,[l("small",qt,m(d(t)("claim_sheet.item_count_label")),1),l("span",null,m(k.value.length),1)]),o.value.counterparty_name?(g(),h("div",Ot,[l("small",Bt,m(d(t)("claim_sheet.form.counterparty")),1),l("span",null,m(o.value.counterparty_name),1)])):y("",!0),l("div",Ut,[l("small",Wt,m(d(t)("transaction_about.detail.updated_at")),1),l("span",null,m(J(o.value.updated_at)),1)])]),o.value.note?(g(),h("p",jt,m(o.value.note),1)):y("",!0),l("div",Vt,[Y(o.value)?y("",!0):(g(),h("button",{key:0,class:"btn primary",onClick:_e},m(d(t)("claim_sheet.record_payment")),1)),l("button",{class:"btn",disabled:!K(o.value),onClick:xe},m(d(t)("common.edit")),9,Gt),Q(o.value)?(g(),h("button",{key:1,class:"btn",disabled:b.value,onClick:Se},m(b.value?d(t)("claim_sheet.processing"):d(t)("claim_sheet.restore")),9,Jt)):y("",!0),l("button",{class:"btn",disabled:v.value,onClick:Le},m(v.value?d(t)("claim_sheet.processing"):d(t)("claim_sheet.export")),9,Xt),l("button",{class:"btn danger",disabled:_.value,onClick:we},m(d(t)("common.delete")),9,Kt)]),E.value?(g(),h("p",Qt,m(E.value),1)):y("",!0),P.value?(g(),h("p",Yt,m(P.value),1)):y("",!0),C.value?(g(),h("div",Zt,[l("button",{class:"btn",onClick:$e},m(d(t)("analysis_print.open_link")),1)])):y("",!0)])):y("",!0),o.value?(g(),h("article",ea,[l("header",ta,[l("h3",null,m(d(t)("claim_sheet.item_count",{count:k.value.length})),1)]),l("ul",aa,[(g(!0),h(ae,null,ne(k.value,f=>(g(),h("li",{key:f.id,class:"detail-item"},[l("div",na,[l("div",ia,[A(f).icon?(g(),te(W,{key:0,icon:A(f).icon,class:"detail-item-icon"},null,8,["icon"])):y("",!0),l("strong",null,m(A(f).title),1)]),z(I,{"value-minor":be(f)},null,8,["value-minor"])]),l("div",ra,[l("span",sa,m(A(f).entryLabel),1),l("span",oa,m(A(f).sourceLabel),1),l("span",la,m(A(f).categoryName||d(t)("analysis_page.uncategorized")),1),d(q)(f)>0?(g(),h("span",ca,m(d(t)("claim_sheet.item_settled",{amount:d(q)(f)/100})),1)):y("",!0)]),A(f).note?(g(),h("p",da,m(A(f).note),1)):y("",!0)]))),128))])])):y("",!0),o.value?(g(),h("article",ma,[l("header",ua,[l("h3",null,m(d(t)("claim_sheet.payments_title")),1)]),l("ul",pa,[(g(!0),h(ae,null,ne(D.value,f=>(g(),h("li",{key:f.id,class:"detail-item"},[l("div",ga,[l("div",fa,[l("strong",null,m(J(f.paid_at)),1)]),z(I,{"value-minor":f.amount_minor},null,8,["value-minor"])]),l("div",ha,[f.account_name?(g(),h("span",_a,m(f.account_name),1)):y("",!0),f.note?(g(),h("span",ba,m(f.note),1)):y("",!0)])]))),128)),D.value.length?y("",!0):(g(),h("li",ya,m(d(t)("claim_sheet.payments_empty")),1))])])):y("",!0),!o.value&&!x.value?(g(),h("article",va,[l("p",xa,m(d(t)("claim_sheet.not_found")),1)])):y("",!0),z(Z,{open:N.value,title:d(t)("claim_sheet.restore_dialog.title"),message:o.value?d(t)("claim_sheet.confirm_restore",{title:o.value.title||o.value.id}):"","confirm-text":d(t)("claim_sheet.restore"),"confirm-disabled":b.value,loading:b.value,"loading-text":d(t)("claim_sheet.processing"),onClose:Te,onConfirm:Ce},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"]),z(Z,{open:S.value,title:d(t)("claim_sheet.delete_dialog.title"),message:o.value?d(t)("claim_sheet.confirm_void",{title:o.value.title||o.value.id}):"","confirm-text":d(t)("common.delete"),"confirm-disabled":_.value,loading:_.value,"loading-text":d(t)("claim_sheet.processing"),onClose:ke,onConfirm:Ae},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"])]),_:1},8,["title","kicker"])}}},Na=Ne(La,[["__scopeId","data-v-a2b93a3f"]]);export{Na as default};
