import{C as Ce}from"./vendor-sqlite-CnPD_Y5r.js";import{a2 as $e,a3 as ze,E as Ne,o as De,w as Ie,l as f,q as o,t as r,x as c,s as C,H as v,F as Y,m as Z,e as S,c as R,M as Ee,u as Ae,j as Fe,k as p,n as Re}from"./vendor-DKubtjiE.js";import{_ as Me,G as He,b as Pe,e as Be,af as qe,cl as q,cm as ee,J as te,M as Oe,cn as Ue,co as ae,cy as ie,ct as We,cz as Ve,cs as je}from"./index-GxRk1lKw.js";import{M as I}from"./MoneyText-DpULv2II.js";import{u as Ge,b as ne}from"./app-i18n-ByvJe3Zl.js";import{g as Je,d as Xe}from"./claim-sheet-presentation-BDvhYWYR.js";import{af as Ke,ah as Qe,ai as oe,ak as Ye,aj as Ze}from"./app-google-CTXDQAmH.js";import"./vendor-icons-CbGrZ9Df.js";import"./app-membership-CqnEm8HQ.js";const M=794,U=1123;function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function se(e,i="claim-sheet"){return String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||i}function et(e,i="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleString(i,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function tt(e,i="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleDateString(i,{year:"numeric",month:"2-digit",day:"2-digit"})}function W(e,i="zh-TW"){const a=Math.max(0,Math.round(Number(e??0)))/100;return new Intl.NumberFormat(i,{minimumFractionDigits:2,maximumFractionDigits:2}).format(a)}function at(e,i){return String(e?.source_type??"").trim()==="advance"?i.advanceType:String(e?.entry_type??"").trim()==="income"?i.incomeType:i.expenseType}function it(e,i){return String(e?.source_type??"").trim()==="advance"?i.advanceSource:String(e?.transaction_id??"").trim()?i.importedSource:i.manualSource}function nt(e={}){return{title:e.title||"請款單",detailTitle:e.detailTitle||"請款單明細",totalLabel:e.totalLabel||"請款淨額",statusLabel:e.statusLabel||"狀態",counterpartyLabel:e.counterpartyLabel||"請款對象",noteLabel:e.noteLabel||"備註",updatedAtLabel:e.updatedAtLabel||"更新時間",itemCountLabel:e.itemCountLabel||"項目數",categoryLabel:e.categoryLabel||"分類",descriptionLabel:e.descriptionLabel||"說明",amountLabel:e.amountLabel||"金額",dateLabel:e.dateLabel||"日期",sourceLabel:e.sourceLabel||"來源",importedNoteLabel:e.importedNoteLabel||"報銷備註",statusValue:e.statusValue||"",incomeType:e.incomeType||"收入",expenseType:e.expenseType||"支出",advanceType:e.advanceType||"代收",manualSource:e.manualSource||"手動項目",importedSource:e.importedSource||"導入報銷",advanceSource:e.advanceSource||"代收項目",emptyDescription:e.emptyDescription||"未命名項目",uncategorized:e.uncategorized||"未分類",summaryHint:e.summaryHint||"匯入報銷備註與手動代收項目均已納入此 PDF。"}}function ot(){return`
    <style>
      .claim-pdf-page {
        width: ${M}px;
        height: ${U}px;
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
  `}function st(){const e=document.createElement("div");return e.setAttribute("data-claim-sheet-pdf","true"),e.style.position="fixed",e.style.left="-99999px",e.style.top="0",e.style.width=`${M}px`,e.style.padding="0",e.style.background="#ffffff",e.style.zIndex="-1",e.innerHTML=ot(),e}function lt(e,i,a,t){return`
    <div class="claim-pdf">
      <header class="hero">
        <div>
          <div class="eyebrow">${l(a.title)}</div>
          <h1>${l(String(e?.title??"").trim()||a.detailTitle)}</h1>
          <p class="hero-note">${l(a.summaryHint)}</p>
        </div>
        <div class="total-box">
          <span>${l(a.totalLabel)}</span>
          <strong>${l(W(e?.total_minor,t))}</strong>
        </div>
      </header>

      <section class="summary-grid">
        <article class="summary-card">
          <span class="meta-label">${l(a.statusLabel)}</span>
          <strong>${l(a.statusValue)}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${l(a.counterpartyLabel)}</span>
          <strong>${l(String(e?.counterparty_name??"").trim()||"-")}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${l(a.updatedAtLabel)}</span>
          <strong>${l(et(e?.updated_at,t))}</strong>
        </article>
        <article class="summary-card">
          <span class="meta-label">${l(a.itemCountLabel)}</span>
          <strong>${l(String(i.length))}</strong>
        </article>
      </section>

      ${String(e?.note??"").trim()?`<section class="claim-note"><span class="meta-label">${l(a.noteLabel)}</span><p>${l(e.note)}</p></section>`:""}

      ${re(e,i,a)}
    </div>
  `}function rt(e,i,a,t){return`
    <div class="claim-pdf">
      <header class="continuation-head">
        <div>
          <div class="eyebrow">${l(a.detailTitle)}</div>
          <h2>${l(String(e?.title??"").trim()||a.detailTitle)}</h2>
          <p class="continuation-note">${l(a.summaryHint)}</p>
        </div>
        <div class="continuation-total">
          <span>${l(a.totalLabel)}</span>
          <strong>${l(W(e?.total_minor,t))}</strong>
        </div>
      </header>

      ${re(e,i,a)}
    </div>
  `}function re(e,i,a,t){return`
    <section class="items-panel">
      <div class="items-panel-head">
        <div>
          <div class="meta-label">${l(a.detailTitle)}</div>
          <h3>${l(String(e?.title??"").trim()||a.detailTitle)}</h3>
        </div>
        <strong class="items-count">${l(`${a.itemCountLabel}：${i.length}`)}</strong>
      </div>
      <div class="items-table">
        <div class="items-table-head">
          <span>#</span>
          <span>${l(a.descriptionLabel)}</span>
          <span>${l(a.categoryLabel)}</span>
          <span>${l(a.sourceLabel)}</span>
          <span>${l(a.dateLabel)}</span>
          <span>${l(a.amountLabel)}</span>
        </div>
        <div class="items-table-body" data-role="items-body"></div>
      </div>
    </section>
  `}function le(e){return`${e}（續）`}function ct(e,i,a,t,u){const d=String(e?.description??"").trim()||a.emptyDescription,m=String(e?.transaction_note??"").trim(),h=`${at(e,a)} / ${it(e,a)}`;return{amountText:W(e?.amount_minor,t),categoryName:u,dateText:tt(e?.occurred_at,t),description:d,importedNote:m,indexLabel:String(i+1).padStart(2,"0"),itemSourceText:h}}function dt(e){return`
    <div class="item-main-grid">
      <span class="item-index">${l(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${l(e.description)}</strong>
        <small>${l(e.itemSourceText)}</small>
      </div>
      <span class="cell">${l(e.categoryName)}</span>
      <span class="cell">${l(e.itemSourceText)}</span>
      <span class="cell cell-date">${l(e.dateText)}</span>
      <strong class="cell cell-amount">${l(e.amountText)}</strong>
    </div>
  `}function ut(e,i,a,t,u){const d=document.createElement("section");return d.className="claim-pdf-page",d.innerHTML=u?lt(e,i,a,t):rt(e,i,a,t),{page:d,body:d.querySelector('[data-role="items-body"]')}}function ce(e,i,a={}){const t=String(a.noteText??e.importedNote??"").trim(),u=document.createElement("article");return u.className="item-row",u.innerHTML=`
    ${dt(e)}
    ${t?`<div class="item-note-row"><span class="meta-label">${l(i.importedNoteLabel)}</span><p>${l(t)}</p></div>`:""}
  `,u}function O(e,i,a){const t=document.createElement("article");return t.className="item-row item-row-note-continuation",t.innerHTML=`
    <div class="item-note-continuation-head">
      <span class="item-index">${l(e.indexLabel)}</span>
      <div class="cell cell-description">
        <strong>${l(e.description)}</strong>
        <small>${l(le(i.importedNoteLabel))}</small>
      </div>
    </div>
    <div class="item-note-row item-note-row-continued">
      <span class="meta-label">${l(le(i.importedNoteLabel))}</span>
      <p>${l(a)}</p>
    </div>
  `,t}function mt(e){const i=document.createElement("p");return i.className="empty-note",i.textContent=e.detailTitle,i}async function pt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))}async function ft(e){return await pt(),ze(e,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,width:M,height:U,windowWidth:M,windowHeight:U})}function de(e){return e.scrollHeight>e.clientHeight}function H(e,i){return e.body.appendChild(i),de(e.page)?(e.body.removeChild(i),!1):!0}function gt(e,i){const a=Math.max(1,Math.min(e.length,Math.floor(i)));if(a>=e.length)return e.length;const t=e.slice(0,a),u=t.lastIndexOf(`
`),d=t.lastIndexOf(" "),m=Math.max(u,d),h=Math.max(1,Math.floor(a*.6));return m>=h?m+1:a}function ht(e,i,a){const t=String(i??"");if(!t)return null;let u=1,d=t.length,m=null;for(;u<=d;){const h=Math.floor((u+d)/2),x=gt(t,h),y=t.slice(0,x),_=a(y);e.body.appendChild(_);const b=!de(e.page);if(e.body.removeChild(_),b){m={consumedLength:x,text:y},u=h+1;continue}d=h-1}return m}function _t(e,i){return String(e??"").slice(i).replace(/^\s+/,"")}function vt(e,i,a,t){const u=ce(e,i,{noteText:""});H(a,u)||(a.body.childElementCount&&(a=t(!1)),H(a,u)||a.body.appendChild(u));let d=e.importedNote;for(;d;){const m=ht(a,d,h=>O(e,i,h));if(!m){if(!a.body.childElementCount){a.body.appendChild(O(e,i,d));break}a=t(!1);continue}a.body.appendChild(O(e,i,m.text)),d=_t(d,m.consumedLength),d&&(a=t(!1))}return a}function bt(e,i={},a){const t=e?.claim??{},u=Array.isArray(e?.items)?e.items:[],d=i.locale||"zh-TW",m=nt(i),h=[];function x(_){const b=ut(t,u,m,d,_);return a.appendChild(b.page),h.push(b),b}let y=x(!0);return u.forEach((_,b)=>{const L=i.categoryName?.(_?.category_id)||m.uncategorized,$=ct(_,b,m,d,L),z=ce($,m);H(y,z)||(y.body.childElementCount&&(y=x(!1)),H(y,z)||(y=vt($,m,y,x)))}),h.forEach(({body:_})=>{_.childElementCount||_.appendChild(mt(m))}),{container:a,pages:h}}async function yt(e,i={}){if(typeof document>"u")throw new Error("目前環境不支援 PDF 匯出");const a=st();document.body.appendChild(a);const{pages:t}=bt(e,i,a);try{const u=new $e({orientation:"portrait",unit:"pt",format:"a4",compress:!0}),d=u.internal.pageSize.getWidth(),m=u.internal.pageSize.getHeight();for(const[y,{page:_}]of t.entries()){const L=(await ft(_)).toDataURL("image/png");y>0&&u.addPage(),u.addImage(L,"PNG",0,0,d,m,void 0,"FAST")}const h=se(e?.claim?.title??i.title??"claim-sheet"),x=se(e?.claim?.id??"claim");return{filename:`${h}_${x}.pdf`,blob:u.output("blob")}}finally{a.remove()}}const xt={class:"stack"},Lt={class:"row"},wt={key:0,class:"card panel"},St={class:"row claim-head"},kt={class:"claim-title"},Tt={class:"muted"},Ct={class:"detail-grid"},$t={class:"detail-row"},zt={class:"muted"},Nt={class:"detail-row"},Dt={class:"muted"},It={class:"detail-row"},Et={class:"muted"},At={class:"detail-row"},Ft={class:"muted"},Rt={key:0,class:"detail-row"},Mt={class:"muted"},Ht={class:"detail-row"},Pt={class:"muted"},Bt={key:0,class:"note"},qt={class:"row action-row"},Ot=["disabled"],Ut=["disabled"],Wt=["disabled"],Vt=["disabled"],jt={key:1,class:"muted file-note"},Gt={key:2,class:"muted file-note"},Jt={key:3,class:"row export-open-row"},Xt={key:1,class:"card panel"},Kt={class:"row"},Qt={class:"detail-list"},Yt={class:"row detail-item-head"},Zt={class:"detail-item-title"},ea={class:"detail-meta"},ta={class:"detail-badge muted"},aa={class:"detail-badge muted"},ia={class:"detail-badge muted"},na={key:0,class:"detail-badge muted"},oa={key:0,class:"muted detail-note"},sa={key:2,class:"card panel"},la={class:"row"},ra={class:"detail-list"},ca={class:"row detail-item-head"},da={class:"detail-item-title"},ua={class:"detail-meta"},ma={key:0,class:"detail-badge muted"},pa={key:1,class:"detail-badge muted"},fa={key:0,class:"muted"},ga={key:3,class:"card panel"},ha={class:"muted"},_a={__name:"ClaimSheetDetailPage",setup(e){const i=Ae(),a=Ee(),{t,locale:u}=Ge(),d=He(),m=Pe(),h=Be(),x=qe(),y=S(!1),_=S(!1),b=S(!1),L=S(!1),$=S(!1),z=S(!1),s=S(null),N=S([]),E=S([]),k=S(""),D=S(""),F=S(""),A=R(()=>String(i.params.id??"").trim()),ue=R(()=>Xe(h.categories)),P=R(()=>{const n=String(i.query.tab??"").trim();return n==="completed"?"completed":n==="active"?"active":ae(s.value)?"completed":"active"}),V=R(()=>P.value==="completed"?{name:"claim-sheets",query:{tab:"completed"}}:{name:"claim-sheets"});Ne(async()=>{await h.load(),await x.load()}),De(()=>{j()}),Ie([A,()=>m.activeLedgerId],()=>{he()},{immediate:!0});function j(){k.value.startsWith("blob:")&&Ke(k.value)}function G(n){return n?new Date(n).toLocaleString(ne(u.value),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"-"}function J(n){return t(n==="paid"?"claim_sheet.status.paid":n==="rejected"?"claim_sheet.status.rejected":n==="approved"?"claim_sheet.status.approved":n==="in_review"?"claim_sheet.status.in_review":n==="submitted"?"claim_sheet.status.submitted":"claim_sheet.status.draft")}function me(n){return Ue(n)?t("claim_sheet.status.collecting"):ae(n)?t("claim_sheet.status.paid"):J(n?.status)}function X(n){return String(n?.status??"draft")==="draft"&&q(n)<=0}function K(n){return String(n?.status??"").trim()==="paid"||q(n)>0}function Q(n){return ee(n)<=0||String(n?.status??"")==="rejected"}function pe(){!s.value?.id||Q(s.value)||a.push({name:"claim-sheets",query:{complete:s.value.id,...P.value==="completed"?{tab:"completed"}:{}}})}function fe(n){return Math.max(0,Math.round(Number(n?.amount_minor??0)))}function ge(n){const w=String(n??"").trim();return w?h.categories.find(B=>B.id===w)?.name??t("analysis_page.uncategorized"):t("analysis_page.uncategorized")}function T(n){return Je(n,ue.value,t)}async function he(){if(!m.activeLedgerId||!A.value){s.value=null,N.value=[],E.value=[];return}y.value=!0;try{const n=await je(m.activeLedgerId,A.value);if(A.value!==String(i.params.id??"").trim())return;s.value=n.claim??null,N.value=Array.isArray(n.items)?n.items:[],E.value=Array.isArray(n.payments)?n.payments:[]}catch(n){s.value=null,N.value=[],E.value=[],d.pushToast(n.message??t("claim_sheet.toast.load_failed"),"error")}finally{y.value=!1}}function _e(){Oe(a,V.value)}function ve(){!s.value?.id||!X(s.value)||a.push({name:"claim-sheet-edit",params:{id:A.value},query:P.value==="completed"?{tab:"completed"}:{}})}async function be(){if(!(!s.value||_.value)){_.value=!0;try{const n=await yt({claim:s.value,items:N.value},{locale:ne(u.value),title:t("claim_sheet.title"),detailTitle:t("claim_sheet.detail_title"),totalLabel:t("claim_sheet.form.net_total"),statusLabel:t("claim_sheet.status_label"),counterpartyLabel:t("claim_sheet.form.counterparty"),noteLabel:t("claim_sheet.form.note"),updatedAtLabel:t("transaction_about.detail.updated_at"),itemCountLabel:t("claim_sheet.item_count_label"),categoryLabel:t("transaction_about.detail.category"),descriptionLabel:t("claim_sheet.export_headers.description"),amountLabel:t("claim_sheet.export_headers.amount"),dateLabel:t("claim_sheet.export_headers.date"),sourceLabel:t("claim_sheet.export_headers.source"),importedNoteLabel:t("claim_sheet.form.import_note"),incomeType:t("claim_sheet.entry_type.income"),expenseType:t("claim_sheet.entry_type.expense"),advanceType:t("claim_sheet.entry_type.advance"),manualSource:t("claim_sheet.item_source.manual"),importedSource:t("claim_sheet.item_source.imported"),advanceSource:t("claim_sheet.item_source.advance"),emptyDescription:t("claim_sheet.form.unnamed_item"),uncategorized:t("analysis_page.uncategorized"),statusValue:J(s.value?.status),categoryName:w=>ge(w),summaryHint:t("claim_sheet.export_pdf_hint")});if(j(),D.value=n.filename,F.value="",Ce.isNativePlatform()){const w=await Qe(n.filename,n.blob,{category:"claim-sheets"});if(w?.saved){D.value=String(w.filename??n.filename),F.value=String(w.location||t("claim_sheet.device_files")),k.value=String(w.uri??"").trim()||String(w.openUrl??"").trim()||oe(n.blob),d.pushToast(t("claim_sheet.toast.exported_saved",{location:w.location||t("claim_sheet.device_files")}));return}}k.value=oe(n.blob),d.pushToast(t("claim_sheet.toast.exported"))}catch(n){d.pushToast(n.message??t("claim_sheet.toast.export_failed"),"error")}finally{_.value=!1}}}function ye(){if(!k.value)return;!Ye(k.value)&&D.value&&Ze(k.value,D.value)}function xe(){s.value&&($.value=!0)}function Le(){!s.value||!K(s.value)||(z.value=!0)}function we(){b.value||($.value=!1)}function Se(){L.value||(z.value=!1)}async function ke(){if(!(!m.activeLedgerId||!s.value?.id||L.value)){L.value=!0;try{const n=await We(m.activeLedgerId,s.value.id,"draft");s.value=n,await x.load(),d.pushToast(t("claim_sheet.toast.restored")),await a.replace({name:"claim-sheet-detail",params:{id:s.value.id}})}catch(n){d.pushToast(n.message??t("claim_sheet.toast.restore_failed"),"error")}finally{L.value=!1,z.value=!1}}}async function Te(){if(!(!m.activeLedgerId||!s.value?.id||b.value)){b.value=!0;try{await Ve(m.activeLedgerId,s.value.id),await x.load(),d.pushToast(t("claim_sheet.toast.voided")),await a.replace(V.value)}catch(n){d.pushToast(n.message??t("claim_sheet.toast.void_failed"),"error")}finally{b.value=!1,$.value=!1}}}return(n,w)=>{const B=Fe("font-awesome-icon");return p(),f("section",xt,[o("header",Lt,[o("h2",null,r(c(t)("claim_sheet.detail_title")),1),o("button",{class:"btn back-btn",onClick:_e},r(c(t)("common.back")),1)]),s.value?(p(),f("article",wt,[o("header",St,[o("div",kt,[o("h3",null,r(s.value.title||c(t)("claim_sheet.detail_title")),1),o("small",Tt,r(me(s.value)),1)]),C(I,{"value-minor":s.value.total_minor},null,8,["value-minor"])]),o("div",Ct,[o("div",$t,[o("small",zt,r(c(t)("claim_sheet.net_amount")),1),o("span",null,[C(I,{"value-minor":s.value.total_minor},null,8,["value-minor"])])]),o("div",Nt,[o("small",Dt,r(c(t)("claim_sheet.paid_amount")),1),o("span",null,[C(I,{"value-minor":c(q)(s.value)},null,8,["value-minor"])])]),o("div",It,[o("small",Et,r(c(t)("claim_sheet.remaining_amount")),1),o("span",null,[C(I,{"value-minor":c(ee)(s.value)},null,8,["value-minor"])])]),o("div",At,[o("small",Ft,r(c(t)("claim_sheet.item_count_label")),1),o("span",null,r(N.value.length),1)]),s.value.counterparty_name?(p(),f("div",Rt,[o("small",Mt,r(c(t)("claim_sheet.form.counterparty")),1),o("span",null,r(s.value.counterparty_name),1)])):v("",!0),o("div",Ht,[o("small",Pt,r(c(t)("transaction_about.detail.updated_at")),1),o("span",null,r(G(s.value.updated_at)),1)])]),s.value.note?(p(),f("p",Bt,r(s.value.note),1)):v("",!0),o("div",qt,[Q(s.value)?v("",!0):(p(),f("button",{key:0,class:"btn primary",onClick:pe},r(c(t)("claim_sheet.record_payment")),1)),o("button",{class:"btn",disabled:!X(s.value),onClick:ve},r(c(t)("common.edit")),9,Ot),K(s.value)?(p(),f("button",{key:1,class:"btn",disabled:L.value,onClick:Le},r(L.value?c(t)("claim_sheet.processing"):c(t)("claim_sheet.restore")),9,Ut)):v("",!0),o("button",{class:"btn",disabled:_.value,onClick:be},r(_.value?c(t)("claim_sheet.processing"):c(t)("claim_sheet.export")),9,Wt),o("button",{class:"btn danger",disabled:b.value,onClick:xe},r(c(t)("common.delete")),9,Vt)]),D.value?(p(),f("p",jt,r(D.value),1)):v("",!0),F.value?(p(),f("p",Gt,r(F.value),1)):v("",!0),k.value?(p(),f("div",Jt,[o("button",{class:"btn",onClick:ye},r(c(t)("analysis_print.open_link")),1)])):v("",!0)])):v("",!0),s.value?(p(),f("article",Xt,[o("header",Kt,[o("h3",null,r(c(t)("claim_sheet.item_count",{count:N.value.length})),1)]),o("ul",Qt,[(p(!0),f(Y,null,Z(N.value,g=>(p(),f("li",{key:g.id,class:"detail-item"},[o("div",Yt,[o("div",Zt,[T(g).icon?(p(),Re(B,{key:0,icon:T(g).icon,class:"detail-item-icon"},null,8,["icon"])):v("",!0),o("strong",null,r(T(g).title),1)]),C(I,{"value-minor":fe(g)},null,8,["value-minor"])]),o("div",ea,[o("span",ta,r(T(g).entryLabel),1),o("span",aa,r(T(g).sourceLabel),1),o("span",ia,r(T(g).categoryName||c(t)("analysis_page.uncategorized")),1),c(ie)(g)>0?(p(),f("span",na,r(c(t)("claim_sheet.item_settled",{amount:c(ie)(g)/100})),1)):v("",!0)]),T(g).note?(p(),f("p",oa,r(T(g).note),1)):v("",!0)]))),128))])])):v("",!0),s.value?(p(),f("article",sa,[o("header",la,[o("h3",null,r(c(t)("claim_sheet.payments_title")),1)]),o("ul",ra,[(p(!0),f(Y,null,Z(E.value,g=>(p(),f("li",{key:g.id,class:"detail-item"},[o("div",ca,[o("div",da,[o("strong",null,r(G(g.paid_at)),1)]),C(I,{"value-minor":g.amount_minor},null,8,["value-minor"])]),o("div",ua,[g.account_name?(p(),f("span",ma,r(g.account_name),1)):v("",!0),g.note?(p(),f("span",pa,r(g.note),1)):v("",!0)])]))),128)),E.value.length?v("",!0):(p(),f("li",fa,r(c(t)("claim_sheet.payments_empty")),1))])])):v("",!0),!s.value&&!y.value?(p(),f("article",ga,[o("p",ha,r(c(t)("claim_sheet.not_found")),1)])):v("",!0),C(te,{open:z.value,title:c(t)("claim_sheet.restore_dialog.title"),message:s.value?c(t)("claim_sheet.confirm_restore",{title:s.value.title||s.value.id}):"","confirm-text":c(t)("claim_sheet.restore"),"confirm-disabled":L.value,loading:L.value,"loading-text":c(t)("claim_sheet.processing"),onClose:Se,onConfirm:ke},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"]),C(te,{open:$.value,title:c(t)("claim_sheet.delete_dialog.title"),message:s.value?c(t)("claim_sheet.confirm_void",{title:s.value.title||s.value.id}):"","confirm-text":c(t)("common.delete"),"confirm-disabled":b.value,loading:b.value,"loading-text":c(t)("claim_sheet.processing"),onClose:we,onConfirm:Te},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"])])}}},Ca=Me(_a,[["__scopeId","data-v-c6f28266"]]);export{Ca as default};
