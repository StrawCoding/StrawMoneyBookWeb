<template>
  <main class="legal-page">
    <div class="legal-container">
      <h1>StrawMoneyBook 隱私權政策（Privacy Policy）</h1>
      <p>生效日期：2026-02-14</p>
      <p>最後更新：2026-02-14</p>
      <p>資料控制者／提供者：StrawCoding</p>
      <p>聯絡方式：service@strawmb.com</p>

      <p>
        本政策說明我們如何蒐集、使用、處理與保護你在使用 StrawMoneyBook 時的資訊。StrawMoneyBook
        以最小蒐集為原則；若你不啟用雲端或登入等功能，多數情況下資料僅存放於你的裝置本機。
      </p>

      <section>
        <h2>1. 我們可能蒐集的資訊類型</h2>
        <h3>1.1 你主動提供的資訊</h3>
        <ul>
          <li>帳號資訊（如適用）：若你使用第三方登入（例如 Google），我們可能取得基本帳號識別資訊（依你授權範圍與供應商提供內容為準）。</li>
          <li>你輸入的記帳資料：包含交易金額、日期、分類、備註、標籤、帳戶、報銷/預算資料等。</li>
          <li>附件（如適用）：你上傳或附加的圖片/檔案（例如發票照片）。</li>
        </ul>

        <h3>1.2 裝置與使用資訊（如適用）</h3>
        <p>為了提供基本功能、改善穩定性與除錯，我們可能蒐集裝置資訊、崩潰紀錄、錯誤日誌與效能資料。</p>

        <h3>1.3 權限資料（依你授權）</h3>
        <p>本服務可能請求相簿/檔案、相機、網路等權限，僅用於對應功能（匯入匯出、附件拍攝、登入與備份）。</p>
      </section>

      <section>
        <h2>2. 我們如何使用資訊</h2>
        <ul>
          <li>提供並維持本服務功能（記帳、統計、匯入/匯出）。</li>
          <li>進行雲端備份（如你啟用），包含上傳、下載、版本管理與還原。</li>
          <li>客服支援、錯誤處理與體驗改善。</li>
          <li>安全與防護：偵測濫用、詐欺或攻擊行為。</li>
          <li>產品改善：分析崩潰與效能問題、提升穩定性。</li>
        </ul>
      </section>

      <section>
        <h2>3. 記帳資料的儲存位置與備份模式</h2>
        <h3>3.1 本機儲存（預設）</h3>
        <p>記帳資料通常儲存在你的裝置本機。若你解除安裝或清除資料，可能導致本機資料刪除且無法復原，除非你已自行備份。</p>
        <h3>3.2 雲端備份（如你啟用）</h3>
        <p>若你使用 Google Drive 等雲端備份，我們會在你授權範圍內將備份檔上傳至你的雲端帳戶空間。</p>
      </section>

      <section>
        <h2>4. 我們如何分享資訊</h2>
        <p>我們不會販售你的個人資料。除你明確同意、法令要求或第三方服務提供功能所需外，不會對外分享你的資訊。</p>
      </section>

      <section>
        <h2>5. 資料保留與刪除</h2>
        <ul>
          <li>本機資料：由你控制，可在 App 內刪除、清除、匯出後自行管理。</li>
          <li>雲端備份：由你控制，可在你的雲端空間中刪除備份檔案。</li>
          <li>診斷/日誌（如適用）：僅保留合理期間，並盡可能採去識別化或最小化資料策略。</li>
        </ul>
      </section>

      <section>
        <h2>6. 資料安全</h2>
        <p>我們會採取合理的技術與組織措施保護資料，例如傳輸加密（HTTPS/TLS）及平台安全機制；但任何系統皆無法保證 100% 安全。</p>
      </section>

      <section>
        <h2>7. 你的權利（依適用法規）</h2>
        <p>你可能享有查詢、閱覽、補充、更正、停止處理或刪除等權利。由於本服務多採本機儲存，許多權利可透過 App 內刪除/匯出/清除資料達成。</p>
      </section>

      <section>
        <h2>8. 兒童隱私</h2>
        <p>本服務非以兒童為主要對象。若你為未成年人，應由法定代理人同意後使用。</p>
      </section>

      <section>
        <h2>9. 政策更新</h2>
        <p>我們可能因功能或法規變更而更新本政策。更新後版本會公布於本服務或官網；你在更新後繼續使用本服務，視為同意更新內容。</p>
      </section>

      <section>
        <h2>10. 聯絡我們</h2>
        <p>Email：service@strawmb.com</p>
      </section>

      <div class="link-group">
        <RouterLink class="back-link" to="/preview">預先體驗版</RouterLink>
        <RouterLink class="back-link" to="/">返回首頁</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #000;
  color: #f3f6ff;
  padding: clamp(1.5rem, 3vw, 2.6rem) 1rem 3rem;
}

.legal-container {
  width: min(940px, 100%);
  margin: 0 auto;
  padding: clamp(1rem, 2.5vw, 1.6rem);
  border-radius: 22px;
  background: rgba(10, 15, 30, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
  line-height: 1.72;
}

h1 {
  font-size: clamp(1.45rem, 3.8vw, 2.2rem);
  margin-bottom: 1.1rem;
  letter-spacing: 0.015em;
}

.legal-container > p {
  color: #d8def0;
  margin: 0.42rem 0;
}

.legal-container > p:nth-of-type(-n + 4) {
  display: inline-flex;
  margin-right: 0.6rem;
  margin-bottom: 0.55rem;
  padding: 0.33rem 0.72rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #c9d1ea;
  font-size: 0.86rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.65rem;
  font-size: clamp(1.05rem, 2.2vw, 1.2rem);
  color: #f7d77a;
}

h3 {
  margin-top: 0.75rem;
  margin-bottom: 0.45rem;
  font-size: 0.98rem;
  color: #e7ebf9;
}

p,
li {
  color: #d6dcef;
}

ul {
  margin: 0;
  padding-left: 1.15rem;
}

section {
  margin-top: 1rem;
  padding: 1rem 1.05rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2rem;
  padding: 0.52rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #f8df8f;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.back-link:hover {
  transform: translateY(-1px);
  border-color: rgba(248, 223, 143, 0.6);
  background: rgba(248, 223, 143, 0.08);
}

.link-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.6rem;
}

@media (max-width: 640px) {
  .legal-container {
    padding: 0.95rem;
  }

  section {
    padding: 0.85rem 0.88rem;
  }
}
</style>
