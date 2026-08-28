import{C as _e}from"./vendor-sqlite-DKEMZiEb.js";import{a1 as be,a2 as ve,E as ye,o as xe,w as Le,l as b,q as s,t as u,x as m,s as I,H as L,F as we,m as Se,e as w,c as A,M as Te,u as ke,j as $e,k as _,n as Ce}from"./vendor-CkjNk_C8.js";import{_ as Ne,q as ze,b as De,f as Ie,a6 as Ee,t as X,y as Ae,c8 as Fe,ca as He,c7 as Re}from"./index-B7Knuee2.js";import{M}from"./MoneyText-jvKhqtkL.js";import{u as Me,b as J}from"./app-i18n-ajT3yeQ9.js";import{g as Pe,d as Be}from"./claim-sheet-presentation-Bc0QSqk_.js";import{af as qe,ah as Ue,ai as K,ak as Oe,aj as We}from"./app-google-jyffQJJX.js";import"./vendor-icons-BlwP1UUA.js";import"./app-membership-B1qS6aUL.js";const F=794,B=1123;function o(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Q(e,n="claim-sheet"){return String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||n}function Ve(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleString(n,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function je(e,n="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleDateString(n,{year:"numeric",month:"2-digit",day:"2-digit"})}function q(e,n="zh-TW"){const a=Math.max(0,Math.round(Number(e??0)))/100;return new Intl.NumberFormat(n,{minimumFractionDigits:2,maximumFractionDigits:2}).format(a)}function Ge(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceType:String(e?.entry_type??"").trim()==="income"?n.incomeType:n.expenseType}function Xe(e,n){return String(e?.source_type??"").trim()==="advance"?n.advanceSource:String(e?.transaction_id??"").trim()?n.importedSource:n.manualSource}function Je(e={}){return{title:e.title||"請款單",detailTitle:e.detailTitle||"請款單明細",totalLabel:e.totalLabel||"請款淨額",statusLabel:e.statusLabel||"狀態",counterpartyLabel:e.counterpartyLabel||"請款對象",noteLabel:e.noteLabel||"備註",updatedAtLabel:e.updatedAtLabel||"更新時間",itemCountLabel:e.itemCountLabel||"項目數",categoryLabel:e.categoryLabel||"分類",descriptionLabel:e.descriptionLabel||"說明",amountLabel:e.amountLabel||"金額",dateLabel:e.dateLabel||"日期",sourceLabel:e.sourceLabel||"來源",importedNoteLabel:e.importedNoteLabel||"報銷備註",statusValue:e.statusValue||"",incomeType:e.incomeType||"收入",expenseType:e.expenseType||"支出",advanceType:e.advanceType||"代收",manualSource:e.manualSource||"手動項目",importedSource:e.importedSource||"導入報銷",advanceSource:e.advanceSource||"代收項目",emptyDescription:e.emptyDescription||"未命名項目",uncategorized:e.uncategorized||"未分類",summaryHint:e.summaryHint||"匯入報銷備註與手動代收項目均已納入此 PDF。"}}function Ke(){return`
    <style>
      .claim-pdf-page {
        width: ${F}px;
        height: ${B}px;
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
      .total-box,
      .continuation-total {
        min-width: 160px;
        padding: 14px 16px;
        border-radius: 20px;
        background: #0f172a;
        color: #f8fafc;
        display: grid;
        gap: 6px;
      }
      .total-box span,
      .continuation-total span {
        font-size: 11px;
        color: rgba(248, 250, 252, 0.72);
      }
      .total-box strong,
      .continuation-total strong {
        font-size: 24px;
        line-height: 1.1;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
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
  `}function Qe(){const e=document.createElement("div");return e.setAttribute("data-claim-sheet-pdf","true"),e.style.position="fixed",e.style.left="-99999px",e.style.top="0",e.style.width=`${F}px`,e.style.padding="0",e.style.background="#ffffff",e.style.zIndex="-1",e.innerHTML=Ke(),e}function Ye(e,n,a,t){return`
    <div class="claim-pdf">
      <header class="hero">
        <div>
          <div class="eyebrow">${o(a.title)}</div>
          <h1>${o(String(e?.title??"").trim()||a.detailTitle)}</h1>
          <p class="hero-note">${o(a.summaryHint)}</p>
        </div>
        <div class="total-box">
          <span>${o(a.totalLabel)}</span>
          <strong>${o(q(e?.total_minor,t))}</strong>
        </div>
      </header>

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
          <strong>${o(Ve(e?.updated_at,t))}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${o(a.itemCountLabel)}</span>
          <strong>${o(String(n.length))}</strong>
        </article>
      </section>

      ${String(e?.note??"").trim()?`<section class="claim-note"><span class="meta-label">${o(a.noteLabel)}</span><p>${o(e.note)}</p></section>`:""}

      ${Z(e,n,a)}
    </div>
  `}function Ze(e,n,a,t){return`
    <div class="claim-pdf">
      <header class="continuation-head">
        <div>
          <div class="eyebrow">${o(a.detailTitle)}</div>
          <h2>${o(String(e?.title??"").trim()||a.detailTitle)}</h2>
          <p class="continuation-note">${o(a.summaryHint)}</p>
        </div>
        <div class="continuation-total">
          <span>${o(a.totalLabel)}</span>
          <strong>${o(q(e?.total_minor,t))}</strong>
        </div>
      </header>

      ${Z(e,n,a)}
    </div>
  `}function Z(e,n,a,t){return`
    <section class="items-panel">
      <div class="items-panel-head">
        <div>
          <div class="meta-label">${o(a.detailTitle)}</div>
          <h3>${o(String(e?.title??"").trim()||a.detailTitle)}</h3>
        </div>
        <strong class="items-count">${o(`${a.itemCountLabel}：${n.length}`)}</strong>
      </div>
      <div class="items-table">
        <div class="items-table-head">
          <span>#</span>
          <span>${o(a.descriptionLabel)}</span>
          <span>${o(a.categoryLabel)}</span>
          <span>${o(a.sourceLabel)}</span>
          <span>${o(a.dateLabel)}</span>
          <span>${o(a.amountLabel)}</span>
        </div>
        <div class="items-table-body" data-role="items-body"></div>
      </div>
    </section>
  `}function Y(e){return`${e}（續）`}function et(e,n,a,t,c){const l=String(e?.description??"").trim()||a.emptyDescription,d=String(e?.transaction_note??"").trim(),p=`${Ge(e,a)} / ${Xe(e,a)}`;return{amountText:q(e?.amount_minor,t),categoryName:c,dateText:je(e?.occurred_at,t),description:l,importedNote:d,indexLabel:String(n+1).padStart(2,"0"),itemSourceText:p}}function tt(e){return`
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
  `}function at(e,n,a,t,c){const l=document.createElement("section");return l.className="claim-pdf-page",l.innerHTML=c?Ye(e,n,a,t):Ze(e,n,a,t),{page:l,body:l.querySelector('[data-role="items-body"]')}}function ee(e,n,a={}){const t=String(a.noteText??e.importedNote??"").trim(),c=document.createElement("article");return c.className="item-row",c.innerHTML=`
    ${tt(e)}
    ${t?`<div class="item-note-row"><span class="meta-label">${o(n.importedNoteLabel)}</span><p>${o(t)}</p></div>`:""}
  `,c}function P(e,n,a){const t=document.createElement("article");return t.className="item-row item-row-note-continuation",t.innerHTML=`
    <div class="item-note-continuation-head">
      <span class="item-index">${o(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${o(e.description)}</strong>
        <small>${o(Y(n.importedNoteLabel))}</small>
      </div>
    </div>
    <div class="item-note-row item-note-row-continued">
      <span class="meta-label">${o(Y(n.importedNoteLabel))}</span>
      <p>${o(a)}</p>
    </div>
  `,t}function nt(e){const n=document.createElement("p");return n.className="empty-note",n.textContent=e.detailTitle,n}async function it(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))}async function ot(e){return await it(),ve(e,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,width:F,height:B,windowWidth:F,windowHeight:B})}function te(e){return e.scrollHeight>e.clientHeight}function H(e,n){return e.body.appendChild(n),te(e.page)?(e.body.removeChild(n),!1):!0}function rt(e,n){const a=Math.max(1,Math.min(e.length,Math.floor(n)));if(a>=e.length)return e.length;const t=e.slice(0,a),c=t.lastIndexOf(`
`),l=t.lastIndexOf(" "),d=Math.max(c,l),p=Math.max(1,Math.floor(a*.6));return d>=p?d+1:a}function st(e,n,a){const t=String(n??"");if(!t)return null;let c=1,l=t.length,d=null;for(;c<=l;){const p=Math.floor((c+l)/2),v=rt(t,p),h=t.slice(0,v),f=a(h);e.body.appendChild(f);const g=!te(e.page);if(e.body.removeChild(f),g){d={consumedLength:v,text:h},c=p+1;continue}l=p-1}return d}function lt(e,n){return String(e??"").slice(n).replace(/^\s+/,"")}function ct(e,n,a,t){const c=ee(e,n,{noteText:""});H(a,c)||(a.body.childElementCount&&(a=t(!1)),H(a,c)||a.body.appendChild(c));let l=e.importedNote;for(;l;){const d=st(a,l,p=>P(e,n,p));if(!d){if(!a.body.childElementCount){a.body.appendChild(P(e,n,l));break}a=t(!1);continue}a.body.appendChild(P(e,n,d.text)),l=lt(l,d.consumedLength),l&&(a=t(!1))}return a}function dt(e,n={},a){const t=e?.claim??{},c=Array.isArray(e?.items)?e.items:[],l=n.locale||"zh-TW",d=Je(n),p=[];function v(f){const g=at(t,c,d,l,f);return a.appendChild(g.page),p.push(g),g}let h=v(!0);return c.forEach((f,g)=>{const y=n.categoryName?.(f?.category_id)||d.uncategorized,$=et(f,g,d,l,y),C=ee($,d);H(h,C)||(h.body.childElementCount&&(h=v(!1)),H(h,C)||(h=ct($,d,h,v)))}),p.forEach(({body:f})=>{f.childElementCount||f.appendChild(nt(d))}),{container:a,pages:p}}async function ut(e,n={}){if(typeof document>"u")throw new Error("目前環境不支援 PDF 匯出");const a=Qe();document.body.appendChild(a);const{pages:t}=dt(e,n,a);try{const c=new be({orientation:"portrait",unit:"pt",format:"a4",compress:!0}),l=c.internal.pageSize.getWidth(),d=c.internal.pageSize.getHeight();for(const[h,{page:f}]of t.entries()){const y=(await ot(f)).toDataURL("image/png");h>0&&c.addPage(),c.addImage(y,"PNG",0,0,l,d,void 0,"FAST")}const p=Q(e?.claim?.title??n.title??"claim-sheet"),v=Q(e?.claim?.id??"claim");return{filename:`${p}_${v}.pdf`,blob:c.output("blob")}}finally{a.remove()}}const mt={class:"stack"},pt={class:"row"},ft={key:0,class:"card panel"},gt={class:"row claim-head"},ht={class:"claim-title"},_t={class:"muted"},bt={class:"detail-grid"},vt={class:"detail-row"},yt={class:"muted"},xt={class:"detail-row"},Lt={class:"muted"},wt={key:0,class:"detail-row"},St={class:"muted"},Tt={class:"detail-row"},kt={class:"muted"},$t={key:0,class:"note"},Ct={class:"row action-row"},Nt=["disabled"],zt=["disabled"],Dt=["disabled"],It=["disabled"],Et={key:1,class:"muted file-note"},At={key:2,class:"muted file-note"},Ft={key:3,class:"row export-open-row"},Ht={key:1,class:"card panel"},Rt={class:"row"},Mt={class:"detail-list"},Pt={class:"row detail-item-head"},Bt={class:"detail-item-title"},qt={class:"detail-meta"},Ut={class:"detail-badge muted"},Ot={class:"detail-badge muted"},Wt={class:"detail-badge muted"},Vt={key:0,class:"muted detail-note"},jt={key:2,class:"card panel"},Gt={class:"muted"},Xt={__name:"ClaimSheetDetailPage",setup(e){const n=ke(),a=Te(),{t,locale:c}=Me(),l=ze(),d=De(),p=Ie(),v=Ee(),h=w(!1),f=w(!1),g=w(!1),y=w(!1),$=w(!1),C=w(!1),r=w(null),N=w([]),T=w(""),z=w(""),E=w(""),D=A(()=>String(n.params.id??"").trim()),ae=A(()=>Be(p.categories)),U=A(()=>{const i=String(n.query.tab??"").trim();return i==="completed"?"completed":i==="active"?"active":String(r.value?.status??"").trim()==="paid"?"completed":"active"}),O=A(()=>U.value==="completed"?{name:"claim-sheets",query:{tab:"completed"}}:{name:"claim-sheets"});ye(async()=>{await p.load(),await v.load()}),xe(()=>{W()}),Le([D,()=>d.activeLedgerId],()=>{re()},{immediate:!0});function W(){T.value.startsWith("blob:")&&qe(T.value)}function ne(i){return i?new Date(i).toLocaleString(J(c.value),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"-"}function V(i){return t(i==="paid"?"claim_sheet.status.paid":i==="rejected"?"claim_sheet.status.rejected":i==="approved"?"claim_sheet.status.approved":i==="in_review"?"claim_sheet.status.in_review":i==="submitted"?"claim_sheet.status.submitted":"claim_sheet.status.draft")}function j(i){return String(i?.status??"draft")==="draft"}function G(i){return String(i?.status??"").trim()==="paid"}function ie(i){return Math.max(0,Math.round(Number(i?.amount_minor??0)))}function oe(i){const x=String(i??"").trim();return x?p.categories.find(R=>R.id===x)?.name??t("analysis_page.uncategorized"):t("analysis_page.uncategorized")}function k(i){return Pe(i,ae.value,t)}async function re(){if(!d.activeLedgerId||!D.value){r.value=null,N.value=[];return}h.value=!0;try{const i=await Re(d.activeLedgerId,D.value);if(D.value!==String(n.params.id??"").trim())return;r.value=i.claim??null,N.value=Array.isArray(i.items)?i.items:[]}catch(i){r.value=null,N.value=[],l.pushToast(i.message??t("claim_sheet.toast.load_failed"),"error")}finally{h.value=!1}}function se(){Ae(a,O.value)}function le(){!r.value?.id||!j(r.value)||a.push({name:"claim-sheet-edit",params:{id:D.value},query:U.value==="completed"?{tab:"completed"}:{}})}async function ce(){if(!(!r.value||f.value)){f.value=!0;try{const i=await ut({claim:r.value,items:N.value},{locale:J(c.value),title:t("claim_sheet.title"),detailTitle:t("claim_sheet.detail_title"),totalLabel:t("claim_sheet.form.net_total"),statusLabel:t("claim_sheet.status_label"),counterpartyLabel:t("claim_sheet.form.counterparty"),noteLabel:t("claim_sheet.form.note"),updatedAtLabel:t("transaction_about.detail.updated_at"),itemCountLabel:t("claim_sheet.item_count_label"),categoryLabel:t("transaction_about.detail.category"),descriptionLabel:t("claim_sheet.export_headers.description"),amountLabel:t("claim_sheet.export_headers.amount"),dateLabel:t("claim_sheet.export_headers.date"),sourceLabel:t("claim_sheet.export_headers.source"),importedNoteLabel:t("claim_sheet.form.import_note"),incomeType:t("claim_sheet.entry_type.income"),expenseType:t("claim_sheet.entry_type.expense"),advanceType:t("claim_sheet.entry_type.advance"),manualSource:t("claim_sheet.item_source.manual"),importedSource:t("claim_sheet.item_source.imported"),advanceSource:t("claim_sheet.item_source.advance"),emptyDescription:t("claim_sheet.form.unnamed_item"),uncategorized:t("analysis_page.uncategorized"),statusValue:V(r.value?.status),categoryName:x=>oe(x),summaryHint:t("claim_sheet.export_pdf_hint")});if(W(),z.value=i.filename,E.value="",_e.isNativePlatform()){const x=await Ue(i.filename,i.blob,{category:"claim-sheets"});if(x?.saved){z.value=String(x.filename??i.filename),E.value=String(x.location||t("claim_sheet.device_files")),T.value=String(x.uri??"").trim()||String(x.openUrl??"").trim()||K(i.blob),l.pushToast(t("claim_sheet.toast.exported_saved",{location:x.location||t("claim_sheet.device_files")}));return}}T.value=K(i.blob),l.pushToast(t("claim_sheet.toast.exported"))}catch(i){l.pushToast(i.message??t("claim_sheet.toast.export_failed"),"error")}finally{f.value=!1}}}function de(){if(!T.value)return;!Oe(T.value)&&z.value&&We(T.value,z.value)}function ue(){r.value&&($.value=!0)}function me(){!r.value||!G(r.value)||(C.value=!0)}function pe(){g.value||($.value=!1)}function fe(){y.value||(C.value=!1)}async function ge(){if(!(!d.activeLedgerId||!r.value?.id||y.value)){y.value=!0;try{const i=await Fe(d.activeLedgerId,r.value.id,"draft");r.value=i,await v.load(),l.pushToast(t("claim_sheet.toast.restored")),await a.replace({name:"claim-sheet-detail",params:{id:r.value.id}})}catch(i){l.pushToast(i.message??t("claim_sheet.toast.restore_failed"),"error")}finally{y.value=!1,C.value=!1}}}async function he(){if(!(!d.activeLedgerId||!r.value?.id||g.value)){g.value=!0;try{await He(d.activeLedgerId,r.value.id),await v.load(),l.pushToast(t("claim_sheet.toast.voided")),await a.replace(O.value)}catch(i){l.pushToast(i.message??t("claim_sheet.toast.void_failed"),"error")}finally{g.value=!1,$.value=!1}}}return(i,x)=>{const R=$e("font-awesome-icon");return _(),b("section",mt,[s("header",pt,[s("h2",null,u(m(t)("claim_sheet.detail_title")),1),s("button",{class:"btn back-btn",onClick:se},u(m(t)("common.back")),1)]),r.value?(_(),b("article",ft,[s("header",gt,[s("div",ht,[s("h3",null,u(r.value.title||m(t)("claim_sheet.detail_title")),1),s("small",_t,u(V(r.value.status)),1)]),I(M,{"value-minor":r.value.total_minor},null,8,["value-minor"])]),s("div",bt,[s("div",vt,[s("small",yt,u(m(t)("claim_sheet.net_amount")),1),s("span",null,[I(M,{"value-minor":r.value.total_minor},null,8,["value-minor"])])]),s("div",xt,[s("small",Lt,u(m(t)("claim_sheet.item_count_label")),1),s("span",null,u(N.value.length),1)]),r.value.counterparty_name?(_(),b("div",wt,[s("small",St,u(m(t)("claim_sheet.form.counterparty")),1),s("span",null,u(r.value.counterparty_name),1)])):L("",!0),s("div",Tt,[s("small",kt,u(m(t)("transaction_about.detail.updated_at")),1),s("span",null,u(ne(r.value.updated_at)),1)])]),r.value.note?(_(),b("p",$t,u(r.value.note),1)):L("",!0),s("div",Ct,[s("button",{class:"btn",disabled:!j(r.value),onClick:le},u(m(t)("common.edit")),9,Nt),G(r.value)?(_(),b("button",{key:0,class:"btn",disabled:y.value,onClick:me},u(y.value?m(t)("claim_sheet.processing"):m(t)("claim_sheet.restore")),9,zt)):L("",!0),s("button",{class:"btn",disabled:f.value,onClick:ce},u(f.value?m(t)("claim_sheet.processing"):m(t)("claim_sheet.export")),9,Dt),s("button",{class:"btn danger",disabled:g.value,onClick:ue},u(m(t)("common.delete")),9,It)]),z.value?(_(),b("p",Et,u(z.value),1)):L("",!0),E.value?(_(),b("p",At,u(E.value),1)):L("",!0),T.value?(_(),b("div",Ft,[s("button",{class:"btn",onClick:de},u(m(t)("analysis_print.open_link")),1)])):L("",!0)])):L("",!0),r.value?(_(),b("article",Ht,[s("header",Rt,[s("h3",null,u(m(t)("claim_sheet.item_count",{count:N.value.length})),1)]),s("ul",Mt,[(_(!0),b(we,null,Se(N.value,S=>(_(),b("li",{key:S.id,class:"detail-item"},[s("div",Pt,[s("div",Bt,[k(S).icon?(_(),Ce(R,{key:0,icon:k(S).icon,class:"detail-item-icon"},null,8,["icon"])):L("",!0),s("strong",null,u(k(S).title),1)]),I(M,{"value-minor":ie(S)},null,8,["value-minor"])]),s("div",qt,[s("span",Ut,u(k(S).entryLabel),1),s("span",Ot,u(k(S).sourceLabel),1),s("span",Wt,u(k(S).categoryName||m(t)("analysis_page.uncategorized")),1)]),k(S).note?(_(),b("p",Vt,u(k(S).note),1)):L("",!0)]))),128))])])):L("",!0),!r.value&&!h.value?(_(),b("article",jt,[s("p",Gt,u(m(t)("claim_sheet.not_found")),1)])):L("",!0),I(X,{open:C.value,title:m(t)("claim_sheet.restore_dialog.title"),message:r.value?m(t)("claim_sheet.confirm_restore",{title:r.value.title||r.value.id}):"","confirm-text":m(t)("claim_sheet.restore"),"confirm-disabled":y.value,loading:y.value,"loading-text":m(t)("claim_sheet.processing"),onClose:fe,onConfirm:ge},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"]),I(X,{open:$.value,title:m(t)("claim_sheet.delete_dialog.title"),message:r.value?m(t)("claim_sheet.confirm_void",{title:r.value.title||r.value.id}):"","confirm-text":m(t)("common.delete"),"confirm-disabled":g.value,loading:g.value,"loading-text":m(t)("claim_sheet.processing"),onClose:pe,onConfirm:he},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"])])}}},ia=Ne(Xt,[["__scopeId","data-v-263de934"]]);export{ia as default};
