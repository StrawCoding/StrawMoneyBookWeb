import{_ as ke,J as Ce,al as Te,e as Ae,b as Me,cp as O,G as Ue,I as je,cy as We,cq as V,cz as _e,cA as ve,cB as ye,cu as Ie,cC as ze,cD as ae,cE as Ge,cF as Xe,d as Je,o as Qe,L as Ke,cx as Ye,cr as be,cv as Ze,cG as et}from"./index-CWOm9CJw.js";import{C as tt}from"./vendor-sqlite-0kSzDcW4.js";import{w as pe,j as Ne,k as f,n as ne,p as ge,l as v,F as ie,q as i,t as m,x as d,H as x,s as A,U as me,V as de,W as xe,m as fe,a6 as at,e as T,c as k,X as nt,a2 as it,a3 as ot,E as rt,o as lt,u as st,O as ct}from"./vendor-CMZrPRW1.js";import{M as D}from"./MoneyText-Bh4gfmnF.js";import{u as De,b as Le}from"./app-i18n-Ku6vFL0P.js";import{g as mt,f as dt}from"./claim-sheet-presentation-DpLz8xdt.js";import{af as ut,aj as pt,ak as $e,ag as gt,ah as ft}from"./app-google-Ca_oGlkt.js";import"./vendor-icons-Ck0eIV-m.js";import"./app-membership-CYOb7gbb.js";const ht={class:"row"},_t={key:0,class:"row"},vt={class:"row"},yt={class:"row"},bt={class:"row"},xt={class:"copy-wrap"},Lt={key:0,class:"copy-ledger-list"},$t=["value"],St={class:"copy-ledger-name"},wt={class:"advance-meta-line"},kt={class:"muted copy-ledger-meta"},Ct={class:"muted copy-ledger-meta"},Tt={key:1,class:"muted"},At={key:2,class:"row advance-summary-row"},Mt={key:3,class:"muted"},It={key:4,class:"muted"},zt={key:5,class:"muted"},Nt={key:1},Dt=["placeholder"],Pt=["disabled"],Et={__name:"ClaimSheetRecordPaymentSheet",props:{open:{type:Boolean,default:!1},claim:{type:Object,default:null}},emits:["close","recorded"],setup(e,{emit:n}){const a=e,t=n,{t:r}=De(),p=Ce(),h=Te(),y=Ae(),C=Me(),_=T(null),L=T([]),b=T(!1),g=nt({accountId:"",note:"",amountMajor:0,selectedAdvanceIds:[]}),I=k(()=>new Set((g.selectedAdvanceIds??[]).map(s=>String(s??"").trim()).filter(Boolean))),P=k(()=>h.advances.filter(s=>{const c=String(s?.id??"").trim(),R=Math.max(0,Math.round(Number(s?.available_minor??0)));return!!c&&(R>0||I.value.has(c))})),u=k(()=>V(_.value)),$=k(()=>Math.max(0,Math.round(Number(g.amountMajor??0)*100))),N=k(()=>ye(L.value,$.value).allocations),E=k(()=>$.value>0&&$.value===u.value),H=k(()=>N.value.reduce((s,c)=>_e(c.item)||ve(c.item)||!String(c.item?.transaction_id??"").trim()||String(c.item?.entry_type??"")==="income"?s:s+c.amountMinor,0)),q=k(()=>{let s=H.value;if(s<=0)return 0;const c=new Map(P.value.map(S=>[String(S?.id??"").trim(),S]));let R=0;for(const S of g.selectedAdvanceIds??[]){const M=String(S??"").trim();if(!M||s<=0)continue;const Q=c.get(M);if(!Q)continue;const ee=Math.max(0,Math.round(Number(Q.available_minor??0)));if(ee<=0)continue;const te=Math.min(ee,s);R+=te,s-=te}return R}),B=k(()=>{const s=$.value;return Math.max(0,s-q.value-K.value-U.value)}),K=k(()=>N.value.reduce((s,c)=>ve(c.item)?s+c.amountMinor:s,0)),U=k(()=>N.value.reduce((s,c)=>_e(c.item)?s+c.amountMinor:s,0)),j=k(()=>B.value>0||K.value>0||U.value>0),W=k(()=>!_.value||$.value<=0||$.value>u.value||ye(L.value,$.value).leftoverMinor>0?!1:j.value?y.accounts.some(s=>s.id===String(g.accountId??"").trim()):!0);function G(s){g.amountMajor=V(s)/100}function le(s){g.accountId=String(y.accounts[0]?.id??""),g.note=String(s?.title??"").trim()?r("claim_sheet.default_complete_note_named",{title:s.title}):r("claim_sheet.default_complete_note"),g.selectedAdvanceIds=[],G(s)}function X(){b.value||t("close")}async function Y(s){if(!(!C.activeLedgerId||!s))try{const c=await Ie(C.activeLedgerId,s);if(String(_.value?.id??"")!==String(s))return;_.value=c.claim??_.value,L.value=Array.isArray(c.items)?c.items:[],G(_.value)}catch(c){t("close"),p.pushToast(c.message??r("claim_sheet.toast.load_failed"),"error")}}function J(s){const c=String(s?.category_name??"").trim();return c||String(s?.note??"").trim()||"代收"}function Z(s){return String(s?.category_icon??"").trim()}async function se(){if(!(!W.value||b.value||!C.activeLedgerId||!_.value)){b.value=!0;try{const s=await We(C.activeLedgerId,{reimbursementId:_.value.id,accountId:j.value?g.accountId:"",note:g.note,selectedAdvanceIds:g.selectedAdvanceIds,amountMinor:$.value});await Promise.all([y.load(),h.load()]);const c=Math.max(0,Math.round(Number(s?.remainingMinor??0)));c>0?p.pushToast(r("claim_sheet.toast.recorded_remaining",{amount:c/100})):p.pushToast(r("claim_sheet.toast.completed")),t("recorded",{result:s,claim:_.value}),t("close")}catch(s){p.pushToast(s.message??r("claim_sheet.toast.complete_failed"),"error")}finally{b.value=!1}}}return pe(()=>[a.open,a.claim?.id,a.claim?.updated_at],([s,c])=>{if(!s||!c){_.value=null,L.value=[],g.selectedAdvanceIds=[];return}_.value=a.claim?{...a.claim}:null,L.value=[],le(_.value),Y(c)},{immediate:!0}),(s,c)=>{const R=Ne("font-awesome-icon");return f(),ne(je,{open:e.open,title:d(r)("claim_sheet.record_payment"),size:"form","header-close":!1,"close-variant":"icon","body-class":"stack form-wrap","sheet-class":"sheet","show-footer":!0,onClose:X},{footer:ge(()=>[i("button",{class:"btn",onClick:X},m(d(r)("common.cancel")),1),i("button",{class:"btn primary","data-testid":"claim-payment-submit",disabled:b.value||!W.value,onClick:se},m(b.value?d(r)("claim_sheet.processing"):E.value?d(r)("claim_sheet.confirm_complete"):d(r)("claim_sheet.confirm_payment")),9,Pt)]),default:ge(()=>[_.value?(f(),v(ie,{key:0},[i("div",ht,[i("span",null,m(d(r)("claim_sheet.sheet_label")),1),i("strong",null,m(_.value.title),1)]),_.value.counterparty_name?(f(),v("div",_t,[i("span",null,m(d(r)("claim_sheet.form.counterparty")),1),i("strong",null,m(_.value.counterparty_name),1)])):x("",!0),i("div",vt,[i("span",null,m(d(r)("claim_sheet.net_amount")),1),A(D,{"value-minor":_.value.total_minor},null,8,["value-minor"])]),i("div",yt,[i("span",null,m(d(r)("claim_sheet.paid_amount")),1),A(D,{"value-minor":d(O)(_.value)},null,8,["value-minor"])]),i("div",bt,[i("span",null,m(d(r)("claim_sheet.remaining_amount")),1),A(D,{"value-minor":u.value},null,8,["value-minor"])]),i("label",null,[me(m(d(r)("claim_sheet.form.payment_amount"))+" ",1),de(i("input",{"onUpdate:modelValue":c[0]||(c[0]=S=>g.amountMajor=S),class:"input","data-testid":"claim-payment-amount",type:"number",min:"0",step:"1"},null,512),[[xe,g.amountMajor,void 0,{number:!0}]])]),i("div",xt,[c[6]||(c[6]=i("p",{class:"copy-title"},"代收抵扣（可複選）",-1)),P.value.length?(f(),v("div",Lt,[(f(!0),v(ie,null,fe(P.value,S=>(f(),v("label",{key:S.id,class:"copy-ledger-item"},[de(i("input",{"onUpdate:modelValue":c[1]||(c[1]=M=>g.selectedAdvanceIds=M),class:"copy-ledger-check",type:"checkbox",value:S.id},null,8,$t),[[at,g.selectedAdvanceIds]]),c[4]||(c[4]=i("span",{class:"copy-ledger-mark"},"✓",-1)),i("span",St,[i("span",wt,[Z(S)?(f(),ne(R,{key:0,icon:Z(S),class:"advance-category-icon"},null,8,["icon"])):x("",!0),i("span",null,m(J(S)),1)]),i("small",kt,m(S.account_name||"未指定帳戶"),1),i("small",Ct,[A(D,{"value-minor":S.available_minor},null,8,["value-minor"])])])]))),128))])):(f(),v("p",Tt,"目前沒有可用代收")),q.value>0?(f(),v("div",At,[c[5]||(c[5]=i("span",null,"本次代收抵扣",-1)),A(D,{"value-minor":q.value},null,8,["value-minor"])])):x("",!0),c[7]||(c[7]=i("p",{class:"muted"},"代收只是可抵金額紀錄，可跨不同帳戶抵消；從 A 收，也可以從 B 出。",-1)),H.value<=0?(f(),v("p",Mt,"這張請款單沒有可供代收抵扣的匯入報銷項目。")):(f(),v("p",It,"代收會優先抵扣匯入的報銷項目，剩餘金額才建立新的入帳交易。")),B.value<=0?(f(),v("p",zt,"本次將全額以代收抵扣，不再建立新的入帳交易。")):x("",!0)]),j.value?(f(),v("label",Nt,[me(m(d(r)("claim_sheet.form.account"))+" ",1),A(Ue,{modelValue:g.accountId,"onUpdate:modelValue":c[2]||(c[2]=S=>g.accountId=S),groups:d(y).groupedRegularAccounts},null,8,["modelValue","groups"])])):x("",!0),i("label",null,[me(m(d(r)("claim_sheet.form.complete_note"))+" ",1),de(i("input",{"onUpdate:modelValue":c[3]||(c[3]=S=>g.note=S),class:"input",type:"text",placeholder:d(r)("claim_sheet.form.complete_note_placeholder")},null,8,Dt),[[xe,g.note]])])],64)):x("",!0)]),_:1},8,["open","title"])}}},Rt=ke(Et,[["__scopeId","data-v-76108589"]]),oe=794,he=1123;function o(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Se(e,n="claim-sheet"){return String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||n}function Pe(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleString(n,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function Ft(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleDateString(n,{year:"numeric",month:"2-digit",day:"2-digit"})}function F(e,n="zh-TW"){const a=Math.max(0,Math.round(Number(e??0)))/100;return new Intl.NumberFormat(n,{minimumFractionDigits:2,maximumFractionDigits:2}).format(a)}function Ht(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceType:String(e?.entry_type??"").trim()==="income"?n.incomeType:n.expenseType}function Bt(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceSource:String(e?.transaction_id??"").trim()?n.importedSource:n.manualSource}function qt(e={}){return{title:e.title||"請款單",detailTitle:e.detailTitle||"請款單明細",totalLabel:e.totalLabel||"請款淨額",statusLabel:e.statusLabel||"狀態",counterpartyLabel:e.counterpartyLabel||"請款對象",noteLabel:e.noteLabel||"備註",updatedAtLabel:e.updatedAtLabel||"更新時間",itemCountLabel:e.itemCountLabel||"項目數",categoryLabel:e.categoryLabel||"分類",descriptionLabel:e.descriptionLabel||"說明",amountLabel:e.amountLabel||"金額",dateLabel:e.dateLabel||"日期",sourceLabel:e.sourceLabel||"來源",importedNoteLabel:e.importedNoteLabel||"報銷備註",statusValue:e.statusValue||"",incomeType:e.incomeType||"收入",expenseType:e.expenseType||"支出",advanceType:e.advanceType||"代收",manualSource:e.manualSource||"手動項目",importedSource:e.importedSource||"導入報銷",advanceSource:e.advanceSource||"代收項目",emptyDescription:e.emptyDescription||"未命名項目",uncategorized:e.uncategorized||"未分類",summaryHint:e.summaryHint||"匯入報銷備註與手動代收項目均已納入此 PDF。",paidLabel:e.paidLabel||"已入帳",remainingLabel:e.remainingLabel||"剩餘未收",itemClaimAmountLabel:e.itemClaimAmountLabel||"請款金額",itemSettledLabel:e.itemSettledLabel||"已請款",itemRemainingLabel:e.itemRemainingLabel||"剩餘",paymentsTitle:e.paymentsTitle||"入帳紀錄",paymentsEmpty:e.paymentsEmpty||"尚無入帳紀錄",paymentDateLabel:e.paymentDateLabel||"入帳時間",paymentAmountLabel:e.paymentAmountLabel||"入帳金額",paymentAccountLabel:e.paymentAccountLabel||"帳戶",unknownAccount:e.unknownAccount||"未指定帳戶"}}function Ee(e,n=[]){const a=O(e),t=ze(e);return a>0&&V(e)>0||a>0&&t>0&&a<t?!0:n.some(r=>ae(r)>0)}function Vt(){return`
    <style>
      .claim-pdf-page {
        width: ${oe}px;
        height: ${he}px;
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
  `}function Ot(){const e=document.createElement("div");return e.setAttribute("data-claim-sheet-pdf","true"),e.style.position="fixed",e.style.left="-99999px",e.style.top="0",e.style.width=`${oe}px`,e.style.padding="0",e.style.background="#ffffff",e.style.zIndex="-1",e.innerHTML=Vt(),e}function Ut(e,n,a){const t=ze(e),r=O(e),p=V(e);return`
    <section class="payment-summary">
      <article class="payment-metric payment-metric--total">
        <span>${o(n.totalLabel)}</span>
        <strong>${o(F(t,a))}</strong>
      </article>
      <article class="payment-metric payment-metric--paid">
        <span>${o(n.paidLabel)}</span>
        <strong>${o(F(r,a))}</strong>
      </article>
      <article class="payment-metric payment-metric--remaining">
        <span>${o(n.remainingLabel)}</span>
        <strong>${o(F(p,a))}</strong>
      </article>
    </section>
  `}function jt(e,n,a){const t=Array.isArray(e)?e:[];return t.length?`
    <section class="payments-panel">
      <h4>${o(n.paymentsTitle)}</h4>
      <div class="payments-table">
        <div class="payments-table-head">
          <span>${o(n.paymentDateLabel)}</span>
          <span>${o(n.paymentAccountLabel)}</span>
          <span>${o(n.paymentAmountLabel)}</span>
        </div>
        ${t.map(r=>`
          <div class="payments-table-row">
            <span>${o(Pe(r?.paid_at,a))}</span>
            <span>${o(String(r?.account_name??"").trim()||n.unknownAccount)}</span>
            <span class="amount">${o(F(r?.amount_minor,a))}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `:`
      <section class="payments-panel">
        <h4>${o(n.paymentsTitle)}</h4>
        <p class="empty-note">${o(n.paymentsEmpty)}</p>
      </section>
    `}function Wt(e,n,a,t,r=[]){const p=O(e)>0||Array.isArray(r)&&r.length>0;return`
    <div class="claim-pdf">
      <header class="hero">
        <div>
          <div class="eyebrow">${o(a.title)}</div>
          <h1>${o(String(e?.title??"").trim()||a.detailTitle)}</h1>
          <p class="hero-note">${o(a.summaryHint)}</p>
        </div>
      </header>

      ${Ut(e,a,t)}

      <section class="summary-grid">
        <article class="summary-card">
          <span class="meta-label">${o(a.statusLabel)}</span>
          <strong>${o(a.statusValue)}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${o(a.counterpartyLabel)}</span>
          <strong>${o(String(e?.counterparty_name??"").trim()||"-")}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${o(a.updatedAtLabel)}</span>
          <strong>${o(Pe(e?.updated_at,t))}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${o(a.itemCountLabel)}</span>
          <strong>${o(String(n.length))}</strong>
        </article>
      </section>

      ${String(e?.note??"").trim()?`<section class="claim-note"><span class="meta-label">${o(a.noteLabel)}</span><p>${o(e.note)}</p></section>`:""}

      ${p?jt(r,a,t):""}

      ${Re(e,n,a)}
    </div>
  `}function Gt(e,n,a,t){const r=O(e),p=V(e);return`
    <div class="claim-pdf">
      <header class="continuation-head">
        <div>
          <div class="eyebrow">${o(a.detailTitle)}</div>
          <h2>${o(String(e?.title??"").trim()||a.detailTitle)}</h2>
          <p class="continuation-note">${o(a.summaryHint)}</p>
        </div>
        <div class="continuation-metrics">
          <div>${o(a.totalLabel)} <strong>${o(F(e?.total_minor,t))}</strong></div>
          <div>${o(a.paidLabel)} <strong>${o(F(r,t))}</strong></div>
          <div>${o(a.remainingLabel)} <strong>${o(F(p,t))}</strong></div>
        </div>
      </header>

      ${Re(e,n,a)}
    </div>
  `}function Re(e,n,a,t){const r=Ee(e,n),p=r?"items-table items-table--partial":"items-table",h=r?`
          <span>#</span>
          <span>${o(a.descriptionLabel)}</span>
          <span>${o(a.categoryLabel)}</span>
          <span>${o(a.dateLabel)}</span>
          <span>${o(a.itemClaimAmountLabel)}</span>
          <span>${o(a.itemSettledLabel)}</span>
          <span>${o(a.itemRemainingLabel)}</span>
        `:`
          <span>#</span>
          <span>${o(a.descriptionLabel)}</span>
          <span>${o(a.categoryLabel)}</span>
          <span>${o(a.sourceLabel)}</span>
          <span>${o(a.dateLabel)}</span>
          <span>${o(a.amountLabel)}</span>
        `;return`
    <section class="items-panel">
      <div class="items-panel-head">
        <div>
          <div class="meta-label">${o(a.detailTitle)}</div>
          <h3>${o(String(e?.title??"").trim()||a.detailTitle)}</h3>
        </div>
        <strong class="items-count">${o(`${a.itemCountLabel}：${n.length}`)}</strong>
      </div>
      <div class="${p}" data-partial="${r?"1":"0"}">
        <div class="items-table-head">
          ${h}
        </div>
        <div class="items-table-body" data-role="items-body"></div>
      </div>
    </section>
  `}function we(e){return`${e}（續）`}function Xt(e,n,a,t,r,p=!1){const h=String(e?.description??"").trim()||a.emptyDescription,y=String(e?.transaction_note??"").trim(),C=`${Ht(e,a)} / ${Bt(e,a)}`,_=Ge(e),L=ae(e),b=Xe(e);return{amountText:F(_,t),settledText:F(L,t),remainingText:F(b,t),partialColumns:p,categoryName:r,dateText:Ft(e?.occurred_at,t),description:h,importedNote:y,indexLabel:String(n+1).padStart(2,"0"),itemSourceText:C}}function Jt(e){return e.partialColumns?`
    <div class="item-main-grid">
      <span class="item-index">${o(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${o(e.description)}</strong>
        <small>${o(e.itemSourceText)}</small>
      </div>
      <span class="cell">${o(e.categoryName)}</span>
      <span class="cell cell-date">${o(e.dateText)}</span>
      <strong class="cell cell-amount">${o(e.amountText)}</strong>
      <strong class="cell cell-amount-settled">${o(e.settledText)}</strong>
      <strong class="cell cell-amount-remaining">${o(e.remainingText)}</strong>
    </div>
  `:`
    <div class="item-main-grid">
      <span class="item-index">${o(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${o(e.description)}</strong>
        <small>${o(e.itemSourceText)}</small>
      </div>
      <span class="cell">${o(e.categoryName)}</span>
      <span class="cell">${o(e.itemSourceText)}</span>
      <span class="cell cell-date">${o(e.dateText)}</span>
      <strong class="cell cell-amount">${o(e.amountText)}</strong>
    </div>
  `}function Qt(e,n,a,t,r,p=[]){const h=document.createElement("section");return h.className="claim-pdf-page",h.innerHTML=r?Wt(e,n,a,t,p):Gt(e,n,a,t),{page:h,body:h.querySelector('[data-role="items-body"]')}}function Fe(e,n,a={}){const t=String(a.noteText??e.importedNote??"").trim(),r=document.createElement("article");return r.className="item-row",r.innerHTML=`
    ${Jt(e)}
    ${t?`<div class="item-note-row"><span class="meta-label">${o(n.importedNoteLabel)}</span><p>${o(t)}</p></div>`:""}
  `,r}function ue(e,n,a){const t=document.createElement("article");return t.className="item-row item-row-note-continuation",t.innerHTML=`
    <div class="item-note-continuation-head">
      <span class="item-index">${o(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${o(e.description)}</strong>
        <small>${o(we(n.importedNoteLabel))}</small>
      </div>
    </div>
    <div class="item-note-row item-note-row-continued">
      <span class="meta-label">${o(we(n.importedNoteLabel))}</span>
      <p>${o(a)}</p>
    </div>
  `,t}function Kt(e){const n=document.createElement("p");return n.className="empty-note",n.textContent=e.detailTitle,n}async function Yt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))}async function Zt(e){return await Yt(),ot(e,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,width:oe,height:he,windowWidth:oe,windowHeight:he})}function He(e){return e.scrollHeight>e.clientHeight}function re(e,n){return e.body.appendChild(n),He(e.page)?(e.body.removeChild(n),!1):!0}function ea(e,n){const a=Math.max(1,Math.min(e.length,Math.floor(n)));if(a>=e.length)return e.length;const t=e.slice(0,a),r=t.lastIndexOf(`
`),p=t.lastIndexOf(" "),h=Math.max(r,p),y=Math.max(1,Math.floor(a*.6));return h>=y?h+1:a}function ta(e,n,a){const t=String(n??"");if(!t)return null;let r=1,p=t.length,h=null;for(;r<=p;){const y=Math.floor((r+p)/2),C=ea(t,y),_=t.slice(0,C),L=a(_);e.body.appendChild(L);const b=!He(e.page);if(e.body.removeChild(L),b){h={consumedLength:C,text:_},r=y+1;continue}p=y-1}return h}function aa(e,n){return String(e??"").slice(n).replace(/^\s+/,"")}function na(e,n,a,t){const r=Fe(e,n,{noteText:""});re(a,r)||(a.body.childElementCount&&(a=t(!1)),re(a,r)||a.body.appendChild(r));let p=e.importedNote;for(;p;){const h=ta(a,p,y=>ue(e,n,y));if(!h){if(!a.body.childElementCount){a.body.appendChild(ue(e,n,p));break}a=t(!1);continue}a.body.appendChild(ue(e,n,h.text)),p=aa(p,h.consumedLength),p&&(a=t(!1))}return a}function ia(e,n={},a){const t=e?.claim??{},r=Array.isArray(e?.items)?e.items:[],p=Array.isArray(e?.payments)?e.payments:[],h=n.locale||"zh-TW",y=qt(n),C=Ee(t,r),_=[];function L(g){const I=Qt(t,r,y,h,g,p);return a.appendChild(I.page),_.push(I),I}let b=L(!0);return r.forEach((g,I)=>{const P=n.categoryName?.(g?.category_id)||y.uncategorized,u=Xt(g,I,y,h,P,C),$=Fe(u,y);re(b,$)||(b.body.childElementCount&&(b=L(!1)),re(b,$)||(b=na(u,y,b,L)))}),_.forEach(({body:g})=>{g.childElementCount||g.appendChild(Kt(y))}),{container:a,pages:_}}async function oa(e,n={}){if(typeof document>"u")throw new Error("目前環境不支援 PDF 匯出");const a=Ot();document.body.appendChild(a);const{pages:t}=ia(e,n,a);try{const r=new it({orientation:"portrait",unit:"pt",format:"a4",compress:!0}),p=r.internal.pageSize.getWidth(),h=r.internal.pageSize.getHeight();for(const[_,{page:L}]of t.entries()){const g=(await Zt(L)).toDataURL("image/png");_>0&&r.addPage(),r.addImage(g,"PNG",0,0,p,h,void 0,"FAST")}const y=Se(e?.claim?.title??n.title??"claim-sheet"),C=Se(e?.claim?.id??"claim");return{filename:`${y}_${C}.pdf`,blob:r.output("blob")}}finally{a.remove()}}const ra={key:0,class:"card panel"},la={class:"row claim-head"},sa={class:"claim-title"},ca={class:"muted"},ma={class:"detail-grid"},da={class:"detail-row"},ua={class:"muted"},pa={class:"detail-row"},ga={class:"muted"},fa={class:"detail-row"},ha={class:"muted"},_a={class:"detail-row"},va={class:"muted"},ya={key:0,class:"detail-row"},ba={class:"muted"},xa={class:"detail-row"},La={class:"muted"},$a={key:0,class:"note"},Sa={class:"row action-row"},wa=["disabled"],ka=["disabled"],Ca=["disabled"],Ta={key:1,class:"muted file-note"},Aa={key:2,class:"muted file-note"},Ma={key:3,class:"row export-open-row"},Ia={key:1,class:"card panel"},za={class:"row"},Na={class:"detail-list"},Da={key:0,class:"muted"},Pa={class:"row detail-item-head"},Ea={class:"detail-item-title"},Ra={class:"detail-meta"},Fa={class:"detail-badge muted"},Ha={class:"detail-badge muted"},Ba={class:"detail-badge muted"},qa={key:0,class:"detail-badge muted"},Va={key:0,class:"muted detail-note"},Oa={key:2,class:"card panel"},Ua={class:"row"},ja={class:"detail-list"},Wa={class:"row detail-item-head"},Ga={class:"detail-item-title"},Xa={class:"detail-meta"},Ja={key:0,class:"detail-badge muted"},Qa={key:1,class:"detail-badge muted"},Ka={key:0,class:"muted"},Ya={key:3,class:"card panel"},Za={class:"muted"},en={__name:"ClaimSheetDetailPage",setup(e){const n=st(),a=ct(),{t,locale:r}=De(),p=Ce(),h=Me(),y=Je(),C=Te(),_=Ae(),L=T(!1),b=T(!1),g=T(!1),I=T(!1),P=T(!1),u=T(null),$=T([]),N=T([]),E=T(""),H=T(""),q=T(""),B=k(()=>String(n.params.id??"").trim()),K=k(()=>dt(y.categories)),U=k(()=>{const l=String(n.query.tab??"").trim();return l==="completed"?"completed":l==="active"?"active":be(u.value)?"completed":"active"}),j=k(()=>U.value==="completed"?{name:"claim-sheets",query:{tab:"completed"}}:{name:"claim-sheets"});rt(async()=>{await Promise.all([y.load(),C.load(),_.load()])}),lt(()=>{W()}),pe([B,()=>h.activeLedgerId],()=>{Q()},{immediate:!0}),pe([()=>n.query.recordPayment,u],([l])=>{if(String(l??"").trim()==="1"&&u.value?.id){if(J(u.value)){s();return}P.value=!0}},{immediate:!0});function W(){E.value.startsWith("blob:")&&ut(E.value)}function G(l){return l?new Date(l).toLocaleString(Le(r.value),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"-"}function le(l){return t(l==="paid"?"claim_sheet.status.paid":l==="rejected"?"claim_sheet.status.rejected":l==="approved"?"claim_sheet.status.approved":l==="in_review"?"claim_sheet.status.in_review":l==="submitted"?"claim_sheet.status.submitted":"claim_sheet.status.draft")}function X(l){return Ye(l)?t("claim_sheet.status.collecting"):be(l)?t("claim_sheet.status.paid"):le(l?.status)}function Y(l){return Ze(l,{payments:N.value})}function J(l){return V(l)<=0||String(l?.status??"")==="rejected"}function Z(){!u.value?.id||J(u.value)||(P.value=!0)}function se(){P.value=!1,s()}function s(){if(!String(n.query.recordPayment??"").trim())return;const l={...n.query};delete l.recordPayment,a.replace({name:"claim-sheet-detail",params:{id:B.value},query:l})}async function c(){await Q(),s()}function R(l){return Math.max(0,Math.round(Number(l?.amount_minor??0)))}function S(l){const z=String(l??"").trim();return z?y.categories.find(ce=>ce.id===z)?.name??t("analysis_page.uncategorized"):t("analysis_page.uncategorized")}function M(l){return mt(l,K.value,t)}async function Q(){if(!h.activeLedgerId||!B.value){u.value=null,$.value=[],N.value=[];return}L.value=!0;try{const l=await Ie(h.activeLedgerId,B.value);if(B.value!==String(n.params.id??"").trim())return;u.value=l.claim??null,$.value=Array.isArray(l.items)?l.items:[],N.value=Array.isArray(l.payments)?l.payments:[]}catch(l){u.value=null,$.value=[],N.value=[],p.pushToast(l.message??t("claim_sheet.toast.load_failed"),"error")}finally{L.value=!1}}function ee(){!u.value?.id||!Y(u.value)||a.push({name:"claim-sheet-edit",params:{id:B.value},query:U.value==="completed"?{tab:"completed"}:{}})}async function te(){if(!(!u.value||b.value)){b.value=!0;try{const l=await oa({claim:u.value,items:$.value,payments:N.value},{locale:Le(r.value),title:t("claim_sheet.title"),detailTitle:t("claim_sheet.detail_title"),totalLabel:t("claim_sheet.form.net_total"),paidLabel:t("claim_sheet.paid_amount"),remainingLabel:t("claim_sheet.remaining_amount"),statusLabel:t("claim_sheet.status_label"),counterpartyLabel:t("claim_sheet.form.counterparty"),noteLabel:t("claim_sheet.form.note"),updatedAtLabel:t("transaction_about.detail.updated_at"),itemCountLabel:t("claim_sheet.item_count_label"),categoryLabel:t("transaction_about.detail.category"),descriptionLabel:t("claim_sheet.export_headers.description"),amountLabel:t("claim_sheet.export_headers.amount"),itemClaimAmountLabel:t("claim_sheet.export_headers.claim_amount"),itemSettledLabel:t("claim_sheet.export_headers.settled_amount"),itemRemainingLabel:t("claim_sheet.export_headers.remaining_amount"),dateLabel:t("claim_sheet.export_headers.date"),sourceLabel:t("claim_sheet.export_headers.source"),importedNoteLabel:t("claim_sheet.form.import_note"),paymentsTitle:t("claim_sheet.payments_title"),paymentsEmpty:t("claim_sheet.payments_empty"),paymentDateLabel:t("claim_sheet.export_headers.payment_date"),paymentAmountLabel:t("claim_sheet.form.payment_amount"),paymentAccountLabel:t("claim_sheet.form.account"),unknownAccount:t("common.unknown_account"),incomeType:t("claim_sheet.entry_type.income"),expenseType:t("claim_sheet.entry_type.expense"),advanceType:t("claim_sheet.entry_type.advance"),manualSource:t("claim_sheet.item_source.manual"),importedSource:t("claim_sheet.item_source.imported"),advanceSource:t("claim_sheet.item_source.advance"),emptyDescription:t("claim_sheet.form.unnamed_item"),uncategorized:t("analysis_page.uncategorized"),statusValue:X(u.value),categoryName:z=>S(z),summaryHint:t("claim_sheet.export_pdf_hint")});if(W(),H.value=l.filename,q.value="",tt.isNativePlatform()){const z=await pt(l.filename,l.blob,{category:"claim-sheets"});if(z?.saved){H.value=String(z.filename??l.filename),q.value=String(z.location||t("claim_sheet.device_files")),E.value=String(z.uri??"").trim()||String(z.openUrl??"").trim()||$e(l.blob),p.pushToast(t("claim_sheet.toast.exported_saved",{location:z.location||t("claim_sheet.device_files")}));return}}E.value=$e(l.blob),p.pushToast(t("claim_sheet.toast.exported"))}catch(l){p.pushToast(l.message??t("claim_sheet.toast.export_failed"),"error")}finally{b.value=!1}}}function Be(){if(!E.value)return;!gt(E.value)&&H.value&&ft(E.value,H.value)}function qe(){u.value&&(I.value=!0)}function Ve(){g.value||(I.value=!1)}async function Oe(){if(!(!h.activeLedgerId||!u.value?.id||g.value)){g.value=!0;try{await et(h.activeLedgerId,u.value.id),await C.load(),p.pushToast(t("claim_sheet.toast.voided")),await a.replace(j.value)}catch(l){p.pushToast(l.message??t("claim_sheet.toast.void_failed"),"error")}finally{g.value=!1,I.value=!1}}}return(l,z)=>{const ce=Ne("font-awesome-icon");return f(),ne(Qe,{title:d(t)("claim_sheet.detail_title"),kicker:d(t)("claim_sheet.habitat_hello"),"test-id":"claim-sheet-detail-view","back-to":"/claim-sheets"},{default:ge(()=>[u.value?(f(),v("article",ra,[i("header",la,[i("div",sa,[i("h3",null,m(u.value.title||d(t)("claim_sheet.detail_title")),1),i("small",ca,m(X(u.value)),1)]),A(D,{"value-minor":u.value.total_minor},null,8,["value-minor"])]),i("div",ma,[i("div",da,[i("small",ua,m(d(t)("claim_sheet.net_amount")),1),i("span",null,[A(D,{"value-minor":u.value.total_minor},null,8,["value-minor"])])]),i("div",pa,[i("small",ga,m(d(t)("claim_sheet.paid_amount")),1),i("span",null,[A(D,{"value-minor":d(O)(u.value)},null,8,["value-minor"])])]),i("div",fa,[i("small",ha,m(d(t)("claim_sheet.remaining_amount")),1),i("span",null,[A(D,{"value-minor":d(V)(u.value)},null,8,["value-minor"])])]),i("div",_a,[i("small",va,m(d(t)("claim_sheet.item_count_label")),1),i("span",null,m($.value.length),1)]),u.value.counterparty_name?(f(),v("div",ya,[i("small",ba,m(d(t)("claim_sheet.form.counterparty")),1),i("span",null,m(u.value.counterparty_name),1)])):x("",!0),i("div",xa,[i("small",La,m(d(t)("transaction_about.detail.updated_at")),1),i("span",null,m(G(u.value.updated_at)),1)])]),u.value.note?(f(),v("p",$a,m(u.value.note),1)):x("",!0),i("div",Sa,[J(u.value)?x("",!0):(f(),v("button",{key:0,class:"btn primary",onClick:Z},m(d(t)("claim_sheet.record_payment")),1)),i("button",{class:"btn",disabled:!Y(u.value),onClick:ee},m(d(t)("common.edit")),9,wa),i("button",{class:"btn",disabled:b.value,onClick:te},m(b.value?d(t)("claim_sheet.processing"):d(t)("claim_sheet.export")),9,ka),i("button",{class:"btn danger",disabled:g.value,onClick:qe},m(d(t)("common.delete")),9,Ca)]),H.value?(f(),v("p",Ta,m(H.value),1)):x("",!0),q.value?(f(),v("p",Aa,m(q.value),1)):x("",!0),E.value?(f(),v("div",Ma,[i("button",{class:"btn",onClick:Be},m(d(t)("analysis_print.open_link")),1)])):x("",!0)])):x("",!0),u.value?(f(),v("article",Ia,[i("header",za,[i("h3",null,m(d(t)("claim_sheet.item_count",{count:$.value.length})),1)]),i("ul",Na,[$.value.length?x("",!0):(f(),v("li",Da,m(d(t)("claim_sheet.items_empty")),1)),(f(!0),v(ie,null,fe($.value,w=>(f(),v("li",{key:w.id,class:"detail-item"},[i("div",Pa,[i("div",Ea,[M(w).icon?(f(),ne(ce,{key:0,icon:M(w).icon,class:"detail-item-icon"},null,8,["icon"])):x("",!0),i("strong",null,m(M(w).title),1)]),A(D,{"value-minor":R(w)},null,8,["value-minor"])]),i("div",Ra,[i("span",Fa,m(M(w).entryLabel),1),i("span",Ha,m(M(w).sourceLabel),1),i("span",Ba,m(M(w).categoryName||d(t)("analysis_page.uncategorized")),1),d(ae)(w)>0?(f(),v("span",qa,m(d(t)("claim_sheet.item_settled",{amount:d(ae)(w)/100})),1)):x("",!0)]),M(w).note?(f(),v("p",Va,m(M(w).note),1)):x("",!0)]))),128))])])):x("",!0),u.value?(f(),v("article",Oa,[i("header",Ua,[i("h3",null,m(d(t)("claim_sheet.payments_title")),1)]),i("ul",ja,[(f(!0),v(ie,null,fe(N.value,w=>(f(),v("li",{key:w.id,class:"detail-item"},[i("div",Wa,[i("div",Ga,[i("strong",null,m(G(w.paid_at)),1)]),A(D,{"value-minor":w.amount_minor},null,8,["value-minor"])]),i("div",Xa,[w.account_name?(f(),v("span",Ja,m(w.account_name),1)):x("",!0),w.note?(f(),v("span",Qa,m(w.note),1)):x("",!0)])]))),128)),N.value.length?x("",!0):(f(),v("li",Ka,m(d(t)("claim_sheet.payments_empty")),1))])])):x("",!0),!u.value&&!L.value?(f(),v("article",Ya,[i("p",Za,m(d(t)("claim_sheet.not_found")),1)])):x("",!0),A(Rt,{open:P.value,claim:u.value,onClose:se,onRecorded:c},null,8,["open","claim"]),A(Ke,{open:I.value,title:d(t)("claim_sheet.delete_dialog.title"),message:u.value?d(t)("claim_sheet.confirm_void",{title:u.value.title||u.value.id}):"","confirm-text":d(t)("common.delete"),"confirm-disabled":g.value,loading:g.value,"loading-text":d(t)("claim_sheet.processing"),onClose:Ve,onConfirm:Oe},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"])]),_:1},8,["title","kicker"])}}},dn=ke(en,[["__scopeId","data-v-0ad5f259"]]);export{dn as default};
