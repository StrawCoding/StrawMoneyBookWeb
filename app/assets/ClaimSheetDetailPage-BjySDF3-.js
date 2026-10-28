import{_ as Ce,K as $e,b as ze,e as Ne,ak as De,p as Ie,cm as B,cn as Q,cz as Y,L as Z,co as Ee,cp as ee,cu as Ae,cA as Fe,ct as Re}from"./index-BYARB1VI.js";import{C as He}from"./vendor-sqlite-CnPD_Y5r.js";import{a2 as Me,a3 as Pe,E as qe,o as Be,w as Oe,n as te,p as Ue,x as r,e as S,u as We,O as Ve,j as je,k as p,l as g,q as s,t as d,s as C,H as v,F as ae,m as ie,c as R}from"./vendor-Bw942-mi.js";import{M as I}from"./MoneyText-BKLrW7fR.js";import{u as Ge,b as ne}from"./app-i18n-Rk7jWzVt.js";import{g as Xe,e as Je}from"./claim-sheet-presentation-DwZOEVSg.js";import{af as Ke,aj as Qe,ak as oe,ag as Ye,ah as Ze}from"./app-google-CkO6c4vk.js";import"./vendor-icons-0rUTbgrY.js";import"./app-membership-DWFybnRh.js";const H=794,U=1123;function l(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function se(e,i="claim-sheet"){return String(e??"").replace(/[\\/:*?"<>|]/g,"_").replace(/\s+/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||i}function et(e,i="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleString(i,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}function tt(e,i="zh-TW"){if(!e)return"-";const a=new Date(e);return Number.isNaN(a.getTime())?"-":a.toLocaleDateString(i,{year:"numeric",month:"2-digit",day:"2-digit"})}function W(e,i="zh-TW"){const a=Math.max(0,Math.round(Number(e??0)))/100;return new Intl.NumberFormat(i,{minimumFractionDigits:2,maximumFractionDigits:2}).format(a)}function at(e,i){return String(e?.source_type??"").trim()==="advance"?i.advanceType:String(e?.entry_type??"").trim()==="income"?i.incomeType:i.expenseType}function it(e,i){return String(e?.source_type??"").trim()==="advance"?i.advanceSource:String(e?.transaction_id??"").trim()?i.importedSource:i.manualSource}function nt(e={}){return{title:e.title||"請款單",detailTitle:e.detailTitle||"請款單明細",totalLabel:e.totalLabel||"請款淨額",statusLabel:e.statusLabel||"狀態",counterpartyLabel:e.counterpartyLabel||"請款對象",noteLabel:e.noteLabel||"備註",updatedAtLabel:e.updatedAtLabel||"更新時間",itemCountLabel:e.itemCountLabel||"項目數",categoryLabel:e.categoryLabel||"分類",descriptionLabel:e.descriptionLabel||"說明",amountLabel:e.amountLabel||"金額",dateLabel:e.dateLabel||"日期",sourceLabel:e.sourceLabel||"來源",importedNoteLabel:e.importedNoteLabel||"報銷備註",statusValue:e.statusValue||"",incomeType:e.incomeType||"收入",expenseType:e.expenseType||"支出",advanceType:e.advanceType||"代收",manualSource:e.manualSource||"手動項目",importedSource:e.importedSource||"導入報銷",advanceSource:e.advanceSource||"代收項目",emptyDescription:e.emptyDescription||"未命名項目",uncategorized:e.uncategorized||"未分類",summaryHint:e.summaryHint||"匯入報銷備註與手動代收項目均已納入此 PDF。"}}function ot(){return`
    <style>
      .claim-pdf-page {
        width: ${H}px;
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
  `}function st(){const e=document.createElement("div");return e.setAttribute("data-claim-sheet-pdf","true"),e.style.position="fixed",e.style.left="-99999px",e.style.top="0",e.style.width=`${H}px`,e.style.padding="0",e.style.background="#ffffff",e.style.zIndex="-1",e.innerHTML=ot(),e}function lt(e,i,a,t){return`
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
  `}function le(e){return`${e}（續）`}function ct(e,i,a,t,u){const c=String(e?.description??"").trim()||a.emptyDescription,m=String(e?.transaction_note??"").trim(),h=`${at(e,a)} / ${it(e,a)}`;return{amountText:W(e?.amount_minor,t),categoryName:u,dateText:tt(e?.occurred_at,t),description:c,importedNote:m,indexLabel:String(i+1).padStart(2,"0"),itemSourceText:h}}function dt(e){return`
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
  `}function ut(e,i,a,t,u){const c=document.createElement("section");return c.className="claim-pdf-page",c.innerHTML=u?lt(e,i,a,t):rt(e,i,a,t),{page:c,body:c.querySelector('[data-role="items-body"]')}}function ce(e,i,a={}){const t=String(a.noteText??e.importedNote??"").trim(),u=document.createElement("article");return u.className="item-row",u.innerHTML=`
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
  `,t}function mt(e){const i=document.createElement("p");return i.className="empty-note",i.textContent=e.detailTitle,i}async function pt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))}async function ft(e){return await pt(),Pe(e,{scale:2,backgroundColor:"#ffffff",useCORS:!0,logging:!1,width:H,height:U,windowWidth:H,windowHeight:U})}function de(e){return e.scrollHeight>e.clientHeight}function M(e,i){return e.body.appendChild(i),de(e.page)?(e.body.removeChild(i),!1):!0}function gt(e,i){const a=Math.max(1,Math.min(e.length,Math.floor(i)));if(a>=e.length)return e.length;const t=e.slice(0,a),u=t.lastIndexOf(`
`),c=t.lastIndexOf(" "),m=Math.max(u,c),h=Math.max(1,Math.floor(a*.6));return m>=h?m+1:a}function ht(e,i,a){const t=String(i??"");if(!t)return null;let u=1,c=t.length,m=null;for(;u<=c;){const h=Math.floor((u+c)/2),x=gt(t,h),y=t.slice(0,x),_=a(y);e.body.appendChild(_);const b=!de(e.page);if(e.body.removeChild(_),b){m={consumedLength:x,text:y},u=h+1;continue}c=h-1}return m}function _t(e,i){return String(e??"").slice(i).replace(/^\s+/,"")}function vt(e,i,a,t){const u=ce(e,i,{noteText:""});M(a,u)||(a.body.childElementCount&&(a=t(!1)),M(a,u)||a.body.appendChild(u));let c=e.importedNote;for(;c;){const m=ht(a,c,h=>O(e,i,h));if(!m){if(!a.body.childElementCount){a.body.appendChild(O(e,i,c));break}a=t(!1);continue}a.body.appendChild(O(e,i,m.text)),c=_t(c,m.consumedLength),c&&(a=t(!1))}return a}function bt(e,i={},a){const t=e?.claim??{},u=Array.isArray(e?.items)?e.items:[],c=i.locale||"zh-TW",m=nt(i),h=[];function x(_){const b=ut(t,u,m,c,_);return a.appendChild(b.page),h.push(b),b}let y=x(!0);return u.forEach((_,b)=>{const L=i.categoryName?.(_?.category_id)||m.uncategorized,$=ct(_,b,m,c,L),z=ce($,m);M(y,z)||(y.body.childElementCount&&(y=x(!1)),M(y,z)||(y=vt($,m,y,x)))}),h.forEach(({body:_})=>{_.childElementCount||_.appendChild(mt(m))}),{container:a,pages:h}}async function yt(e,i={}){if(typeof document>"u")throw new Error("目前環境不支援 PDF 匯出");const a=st();document.body.appendChild(a);const{pages:t}=bt(e,i,a);try{const u=new Me({orientation:"portrait",unit:"pt",format:"a4",compress:!0}),c=u.internal.pageSize.getWidth(),m=u.internal.pageSize.getHeight();for(const[y,{page:_}]of t.entries()){const L=(await ft(_)).toDataURL("image/png");y>0&&u.addPage(),u.addImage(L,"PNG",0,0,c,m,void 0,"FAST")}const h=se(e?.claim?.title??i.title??"claim-sheet"),x=se(e?.claim?.id??"claim");return{filename:`${h}_${x}.pdf`,blob:u.output("blob")}}finally{a.remove()}}const xt={key:0,class:"card panel"},Lt={class:"row claim-head"},wt={class:"claim-title"},St={class:"muted"},kt={class:"detail-grid"},Tt={class:"detail-row"},Ct={class:"muted"},$t={class:"detail-row"},zt={class:"muted"},Nt={class:"detail-row"},Dt={class:"muted"},It={class:"detail-row"},Et={class:"muted"},At={key:0,class:"detail-row"},Ft={class:"muted"},Rt={class:"detail-row"},Ht={class:"muted"},Mt={key:0,class:"note"},Pt={class:"row action-row"},qt=["disabled"],Bt=["disabled"],Ot=["disabled"],Ut=["disabled"],Wt={key:1,class:"muted file-note"},Vt={key:2,class:"muted file-note"},jt={key:3,class:"row export-open-row"},Gt={key:1,class:"card panel"},Xt={class:"row"},Jt={class:"detail-list"},Kt={class:"row detail-item-head"},Qt={class:"detail-item-title"},Yt={class:"detail-meta"},Zt={class:"detail-badge muted"},ea={class:"detail-badge muted"},ta={class:"detail-badge muted"},aa={key:0,class:"detail-badge muted"},ia={key:0,class:"muted detail-note"},na={key:2,class:"card panel"},oa={class:"row"},sa={class:"detail-list"},la={class:"row detail-item-head"},ra={class:"detail-item-title"},ca={class:"detail-meta"},da={key:0,class:"detail-badge muted"},ua={key:1,class:"detail-badge muted"},ma={key:0,class:"muted"},pa={key:3,class:"card panel"},fa={class:"muted"},ga={__name:"ClaimSheetDetailPage",setup(e){const i=We(),a=Ve(),{t,locale:u}=Ge(),c=$e(),m=ze(),h=Ne(),x=De(),y=S(!1),_=S(!1),b=S(!1),L=S(!1),$=S(!1),z=S(!1),o=S(null),N=S([]),E=S([]),k=S(""),D=S(""),F=S(""),A=R(()=>String(i.params.id??"").trim()),ue=R(()=>Je(h.categories)),P=R(()=>{const n=String(i.query.tab??"").trim();return n==="completed"?"completed":n==="active"?"active":ee(o.value)?"completed":"active"}),me=R(()=>P.value==="completed"?{name:"claim-sheets",query:{tab:"completed"}}:{name:"claim-sheets"});qe(async()=>{await h.load(),await x.load()}),Be(()=>{V()}),Oe([A,()=>m.activeLedgerId],()=>{_e()},{immediate:!0});function V(){k.value.startsWith("blob:")&&Ke(k.value)}function j(n){return n?new Date(n).toLocaleString(ne(u.value),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"-"}function G(n){return t(n==="paid"?"claim_sheet.status.paid":n==="rejected"?"claim_sheet.status.rejected":n==="approved"?"claim_sheet.status.approved":n==="in_review"?"claim_sheet.status.in_review":n==="submitted"?"claim_sheet.status.submitted":"claim_sheet.status.draft")}function pe(n){return Ee(n)?t("claim_sheet.status.collecting"):ee(n)?t("claim_sheet.status.paid"):G(n?.status)}function X(n){return String(n?.status??"draft")==="draft"&&B(n)<=0}function J(n){return String(n?.status??"").trim()==="paid"||B(n)>0}function K(n){return Q(n)<=0||String(n?.status??"")==="rejected"}function fe(){!o.value?.id||K(o.value)||a.push({name:"claim-sheets",query:{complete:o.value.id,...P.value==="completed"?{tab:"completed"}:{}}})}function ge(n){return Math.max(0,Math.round(Number(n?.amount_minor??0)))}function he(n){const w=String(n??"").trim();return w?h.categories.find(q=>q.id===w)?.name??t("analysis_page.uncategorized"):t("analysis_page.uncategorized")}function T(n){return Xe(n,ue.value,t)}async function _e(){if(!m.activeLedgerId||!A.value){o.value=null,N.value=[],E.value=[];return}y.value=!0;try{const n=await Re(m.activeLedgerId,A.value);if(A.value!==String(i.params.id??"").trim())return;o.value=n.claim??null,N.value=Array.isArray(n.items)?n.items:[],E.value=Array.isArray(n.payments)?n.payments:[]}catch(n){o.value=null,N.value=[],E.value=[],c.pushToast(n.message??t("claim_sheet.toast.load_failed"),"error")}finally{y.value=!1}}function ve(){!o.value?.id||!X(o.value)||a.push({name:"claim-sheet-edit",params:{id:A.value},query:P.value==="completed"?{tab:"completed"}:{}})}async function be(){if(!(!o.value||_.value)){_.value=!0;try{const n=await yt({claim:o.value,items:N.value},{locale:ne(u.value),title:t("claim_sheet.title"),detailTitle:t("claim_sheet.detail_title"),totalLabel:t("claim_sheet.form.net_total"),statusLabel:t("claim_sheet.status_label"),counterpartyLabel:t("claim_sheet.form.counterparty"),noteLabel:t("claim_sheet.form.note"),updatedAtLabel:t("transaction_about.detail.updated_at"),itemCountLabel:t("claim_sheet.item_count_label"),categoryLabel:t("transaction_about.detail.category"),descriptionLabel:t("claim_sheet.export_headers.description"),amountLabel:t("claim_sheet.export_headers.amount"),dateLabel:t("claim_sheet.export_headers.date"),sourceLabel:t("claim_sheet.export_headers.source"),importedNoteLabel:t("claim_sheet.form.import_note"),incomeType:t("claim_sheet.entry_type.income"),expenseType:t("claim_sheet.entry_type.expense"),advanceType:t("claim_sheet.entry_type.advance"),manualSource:t("claim_sheet.item_source.manual"),importedSource:t("claim_sheet.item_source.imported"),advanceSource:t("claim_sheet.item_source.advance"),emptyDescription:t("claim_sheet.form.unnamed_item"),uncategorized:t("analysis_page.uncategorized"),statusValue:G(o.value?.status),categoryName:w=>he(w),summaryHint:t("claim_sheet.export_pdf_hint")});if(V(),D.value=n.filename,F.value="",He.isNativePlatform()){const w=await Qe(n.filename,n.blob,{category:"claim-sheets"});if(w?.saved){D.value=String(w.filename??n.filename),F.value=String(w.location||t("claim_sheet.device_files")),k.value=String(w.uri??"").trim()||String(w.openUrl??"").trim()||oe(n.blob),c.pushToast(t("claim_sheet.toast.exported_saved",{location:w.location||t("claim_sheet.device_files")}));return}}k.value=oe(n.blob),c.pushToast(t("claim_sheet.toast.exported"))}catch(n){c.pushToast(n.message??t("claim_sheet.toast.export_failed"),"error")}finally{_.value=!1}}}function ye(){if(!k.value)return;!Ye(k.value)&&D.value&&Ze(k.value,D.value)}function xe(){o.value&&($.value=!0)}function Le(){!o.value||!J(o.value)||(z.value=!0)}function we(){b.value||($.value=!1)}function Se(){L.value||(z.value=!1)}async function ke(){if(!(!m.activeLedgerId||!o.value?.id||L.value)){L.value=!0;try{const n=await Ae(m.activeLedgerId,o.value.id,"draft");o.value=n,await x.load(),c.pushToast(t("claim_sheet.toast.restored")),await a.replace({name:"claim-sheet-detail",params:{id:o.value.id}})}catch(n){c.pushToast(n.message??t("claim_sheet.toast.restore_failed"),"error")}finally{L.value=!1,z.value=!1}}}async function Te(){if(!(!m.activeLedgerId||!o.value?.id||b.value)){b.value=!0;try{await Fe(m.activeLedgerId,o.value.id),await x.load(),c.pushToast(t("claim_sheet.toast.voided")),await a.replace(me.value)}catch(n){c.pushToast(n.message??t("claim_sheet.toast.void_failed"),"error")}finally{b.value=!1,$.value=!1}}}return(n,w)=>{const q=je("font-awesome-icon");return p(),te(Ie,{title:r(t)("claim_sheet.detail_title"),kicker:r(t)("claim_sheet.habitat_hello"),"test-id":"claim-sheet-detail-view","back-to":"/claim-sheets"},{default:Ue(()=>[o.value?(p(),g("article",xt,[s("header",Lt,[s("div",wt,[s("h3",null,d(o.value.title||r(t)("claim_sheet.detail_title")),1),s("small",St,d(pe(o.value)),1)]),C(I,{"value-minor":o.value.total_minor},null,8,["value-minor"])]),s("div",kt,[s("div",Tt,[s("small",Ct,d(r(t)("claim_sheet.net_amount")),1),s("span",null,[C(I,{"value-minor":o.value.total_minor},null,8,["value-minor"])])]),s("div",$t,[s("small",zt,d(r(t)("claim_sheet.paid_amount")),1),s("span",null,[C(I,{"value-minor":r(B)(o.value)},null,8,["value-minor"])])]),s("div",Nt,[s("small",Dt,d(r(t)("claim_sheet.remaining_amount")),1),s("span",null,[C(I,{"value-minor":r(Q)(o.value)},null,8,["value-minor"])])]),s("div",It,[s("small",Et,d(r(t)("claim_sheet.item_count_label")),1),s("span",null,d(N.value.length),1)]),o.value.counterparty_name?(p(),g("div",At,[s("small",Ft,d(r(t)("claim_sheet.form.counterparty")),1),s("span",null,d(o.value.counterparty_name),1)])):v("",!0),s("div",Rt,[s("small",Ht,d(r(t)("transaction_about.detail.updated_at")),1),s("span",null,d(j(o.value.updated_at)),1)])]),o.value.note?(p(),g("p",Mt,d(o.value.note),1)):v("",!0),s("div",Pt,[K(o.value)?v("",!0):(p(),g("button",{key:0,class:"btn primary",onClick:fe},d(r(t)("claim_sheet.record_payment")),1)),s("button",{class:"btn",disabled:!X(o.value),onClick:ve},d(r(t)("common.edit")),9,qt),J(o.value)?(p(),g("button",{key:1,class:"btn",disabled:L.value,onClick:Le},d(L.value?r(t)("claim_sheet.processing"):r(t)("claim_sheet.restore")),9,Bt)):v("",!0),s("button",{class:"btn",disabled:_.value,onClick:be},d(_.value?r(t)("claim_sheet.processing"):r(t)("claim_sheet.export")),9,Ot),s("button",{class:"btn danger",disabled:b.value,onClick:xe},d(r(t)("common.delete")),9,Ut)]),D.value?(p(),g("p",Wt,d(D.value),1)):v("",!0),F.value?(p(),g("p",Vt,d(F.value),1)):v("",!0),k.value?(p(),g("div",jt,[s("button",{class:"btn",onClick:ye},d(r(t)("analysis_print.open_link")),1)])):v("",!0)])):v("",!0),o.value?(p(),g("article",Gt,[s("header",Xt,[s("h3",null,d(r(t)("claim_sheet.item_count",{count:N.value.length})),1)]),s("ul",Jt,[(p(!0),g(ae,null,ie(N.value,f=>(p(),g("li",{key:f.id,class:"detail-item"},[s("div",Kt,[s("div",Qt,[T(f).icon?(p(),te(q,{key:0,icon:T(f).icon,class:"detail-item-icon"},null,8,["icon"])):v("",!0),s("strong",null,d(T(f).title),1)]),C(I,{"value-minor":ge(f)},null,8,["value-minor"])]),s("div",Yt,[s("span",Zt,d(T(f).entryLabel),1),s("span",ea,d(T(f).sourceLabel),1),s("span",ta,d(T(f).categoryName||r(t)("analysis_page.uncategorized")),1),r(Y)(f)>0?(p(),g("span",aa,d(r(t)("claim_sheet.item_settled",{amount:r(Y)(f)/100})),1)):v("",!0)]),T(f).note?(p(),g("p",ia,d(T(f).note),1)):v("",!0)]))),128))])])):v("",!0),o.value?(p(),g("article",na,[s("header",oa,[s("h3",null,d(r(t)("claim_sheet.payments_title")),1)]),s("ul",sa,[(p(!0),g(ae,null,ie(E.value,f=>(p(),g("li",{key:f.id,class:"detail-item"},[s("div",la,[s("div",ra,[s("strong",null,d(j(f.paid_at)),1)]),C(I,{"value-minor":f.amount_minor},null,8,["value-minor"])]),s("div",ca,[f.account_name?(p(),g("span",da,d(f.account_name),1)):v("",!0),f.note?(p(),g("span",ua,d(f.note),1)):v("",!0)])]))),128)),E.value.length?v("",!0):(p(),g("li",ma,d(r(t)("claim_sheet.payments_empty")),1))])])):v("",!0),!o.value&&!y.value?(p(),g("article",pa,[s("p",fa,d(r(t)("claim_sheet.not_found")),1)])):v("",!0),C(Z,{open:z.value,title:r(t)("claim_sheet.restore_dialog.title"),message:o.value?r(t)("claim_sheet.confirm_restore",{title:o.value.title||o.value.id}):"","confirm-text":r(t)("claim_sheet.restore"),"confirm-disabled":L.value,loading:L.value,"loading-text":r(t)("claim_sheet.processing"),onClose:Se,onConfirm:ke},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"]),C(Z,{open:$.value,title:r(t)("claim_sheet.delete_dialog.title"),message:o.value?r(t)("claim_sheet.confirm_void",{title:o.value.title||o.value.id}):"","confirm-text":r(t)("common.delete"),"confirm-disabled":b.value,loading:b.value,"loading-text":r(t)("claim_sheet.processing"),onClose:we,onConfirm:Te},null,8,["open","title","message","confirm-text","confirm-disabled","loading","loading-text"])]),_:1},8,["title","kicker"])}}},ka=Ce(ga,[["__scopeId","data-v-8b90dd69"]]);export{ka as default};
