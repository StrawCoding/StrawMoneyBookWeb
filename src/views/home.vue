<template>
  <div class="landing" :data-theme="theme" :class="{ 'reveal-enabled': hasRevealObserver }">
    <div class="landing-shell">
      <header class="topbar">
        <a class="brand" href="#hero">
          <img :src="appLogo" alt="StrawMoneyBook Logo" class="brand-logo" />
          <span class="brand-name">StrawMoneyBook</span>
        </a>

        <nav class="nav-links" aria-label="Primary">
          <a href="#features">功能亮點</a>
          <a href="#budget">預算分析</a>
          <a href="#flows">金流流程</a>
          <a href="#security">備份保障</a>
          <a href="#download" class="pill-link">立即下載</a>
        </nav>

        <button type="button" class="theme-toggle" :aria-pressed="theme === 'light'" @click="toggleTheme">
          <span class="theme-toggle-icon" aria-hidden="true">{{ theme === 'dark' ? '☾' : '☀' }}</span>
          <span class="toggle-text">{{ theme === 'dark' ? '深色模式' : '淺色模式' }}</span>
        </button>
      </header>

      <main class="content">
        <section id="hero" class="panel hero reveal" :ref="registerReveal">
          <div>
            <p class="kicker">Cashflow, Not Just Logging</p>
            <h1 class="hero-title">把記一筆帳，升級成管理一整段金流流程。</h1>
            <p class="hero-subtitle">
              StrawMoneyBook 把日常收支、預算控管、借貸追蹤、報銷請款、存錢管理與備份還原整合在同一個 App，
              讓你不只知道花了多少，也知道每一筆錢正經過什麼流程。
            </p>

            <div class="hero-actions">
              <a href="#features" class="btn btn-secondary">了解功能亮點</a>
              <a
                class="btn btn-secondary"
                :class="{ disabled: !hasIosDownload }"
                :href="hasIosDownload ? iosUrl : '#download'"
                target="_blank"
                rel="noreferrer"
              >
                下載 iOS 版本
              </a>
              <a
                class="btn btn-primary"
                :class="{ disabled: !hasAndroidDownload }"
                :href="hasAndroidDownload ? androidUrl : '#download'"
                target="_blank"
                rel="noreferrer"
              >
                下載 Android 版本
              </a>
            </div>

            <ul class="hero-bullets">
              <li>多帳本分流</li>
              <li>AI 自然語言記帳</li>
              <li>借貸 / 報銷 / 請款</li>
              <li>存錢罐與備份還原</li>
            </ul>

            <div class="hero-metrics">
              <article v-for="item in heroMetrics" :key="item.label" class="metric-card">
                <p>{{ item.label }}</p>
                <strong>{{ item.value }}</strong>
                <span>{{ item.detail }}</span>
              </article>
            </div>
          </div>

          <aside class="phone-shell">
            <div class="phone-head">
              <span>Quick Add</span>
              <strong>Today</strong>
            </div>
            <div class="balance-card">
              <p>本月可支配資產</p>
              <h3>NT$ 38,420</h3>
              <small>代收與存錢罐已分流，不混入可花餘額</small>
            </div>
            <ul class="entry-stream">
              <li
                v-for="(item, index) in heroEntries"
                :key="item.title"
                class="entry-row"
                :class="item.type"
                :style="{ '--delay': `${0.15 + index * 0.12}s` }"
              >
                <div>
                  <p>{{ item.title }}</p>
                  <small>{{ item.meta }}</small>
                </div>
                <strong class="entry-amount">{{ item.amount }}</strong>
              </li>
            </ul>
          </aside>
        </section>

        <section class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Core Value</p>
          <h2 class="section-title">你需要的，不只是收入和支出</h2>
          <p class="section-subtitle">
            很多記帳工具只能幫你記錄數字。StrawMoneyBook 更重視的是管理與追蹤，
            把常見的金流場景收斂成同一套可持續使用的流程。
          </p>
          <div class="pain-grid">
            <article v-for="item in valueCards" :key="item.title" class="pain-card">
              <h3>{{ item.title }}</h3>
              <p class="pain-question">{{ item.highlight }}</p>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section id="features" class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Feature Highlights</p>
          <h2 class="section-title">為真實生活設計的記帳方式</h2>
          <p class="section-subtitle">核心功能以互動卡片呈現，快速理解不同金流場景的使用價值。</p>
          <div class="feature-layout">
            <div class="feature-menu">
              <button
                v-for="feature in coreFeatures"
                :key="feature.key"
                type="button"
                class="feature-tab"
                :class="{ 'is-active': activeFeature.key === feature.key }"
                @mouseenter="activeFeatureKey = feature.key"
                @focus="activeFeatureKey = feature.key"
                @click="activeFeatureKey = feature.key"
              >
                <span class="feature-title">{{ feature.title }}</span>
                <span class="feature-copy">{{ feature.description }}</span>
              </button>
            </div>

            <div class="feature-preview">
              <transition name="screen-swap" mode="out-in">
                <article :key="activeFeature.key" class="feature-preview-screen">
                  <p class="preview-kicker">{{ activeFeature.previewTag }}</p>
                  <h3>{{ activeFeature.previewTitle }}</h3>
                  <p class="preview-copy">{{ activeFeature.previewDescription }}</p>

                  <div class="preview-pill-list">
                    <span v-for="pill in activeFeature.pills" :key="pill">{{ pill }}</span>
                  </div>

                  <ul class="preview-rows">
                    <li v-for="row in activeFeature.rows" :key="row.label">
                      <span>{{ row.label }}</span>
                      <strong>{{ row.value }}</strong>
                    </li>
                  </ul>
                </article>
              </transition>
            </div>
          </div>
        </section>

        <section id="budget" class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Budget & Insight</p>
          <h2 class="section-title">不只知道花了多少，還知道該怎麼控管</h2>
          <p class="section-subtitle">
            預算按月份管理，能細看到分類層級，並在分析頁快速切換收入與支出視角，
            讓你在超支前就先看見風險。
          </p>
          <div class="trust-grid insight-grid">
            <article v-for="item in insightItems" :key="item.title" class="trust-card insight-card">
              <p class="trust-icon" aria-hidden="true">{{ item.icon }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section id="flows" class="panel advanced reveal" :ref="registerReveal">
          <p class="section-tag">Real-World Flow</p>
          <h2 class="section-title">借貸、報銷、請款，不再靠備註硬撐</h2>
          <p class="section-subtitle">
            一般記帳、暫墊款項與代收抵扣拆開處理，才能讓資產與現金流判讀更準確。
          </p>
          <div class="flow-rows">
            <article
              v-for="(flow, index) in advancedFlows"
              :key="flow.title"
              class="flow-row"
              :class="{ reverse: index % 2 === 1 }"
            >
              <div class="flow-graphic">
                <p class="flow-graphic-title">{{ flow.graphicTitle }}</p>
                <ol>
                  <li v-for="(step, stepIndex) in flow.steps" :key="step">
                    <span>{{ stepIndex + 1 }}</span>
                    <p>{{ step }}</p>
                  </li>
                </ol>
              </div>
              <div class="flow-copy">
                <p class="flow-chip">{{ flow.chip }}</p>
                <h3>{{ flow.title }}</h3>
                <p>{{ flow.description }}</p>
              </div>
            </article>
          </div>
        </section>

        <section id="security" class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Data & Continuity</p>
          <h2 class="section-title">資料留得住，才能真正長期使用</h2>
          <p class="section-subtitle">
            匯出、還原、修復工具與雲端備份都在同一條資料管理路徑上，讓跨裝置延續使用更可靠。
          </p>
          <div class="trust-grid">
            <article v-for="item in trustItems" :key="item.title" class="trust-card">
              <p class="trust-icon" aria-hidden="true">{{ item.icon }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Who It's For</p>
          <h2 class="section-title">適合這些使用情境</h2>
          <p class="section-subtitle">如果你要的不只是單純記錄，這會比一般記帳工具更合適。</p>
          <div class="feature-layout bottom-layout">
            <article class="feature-preview audience-card">
              <div class="feature-preview-screen">
                <p class="preview-kicker">Why It Matters</p>
                <h3>你不是只在記一筆帳</h3>
                <p class="preview-copy">
                  StrawMoneyBook 的差異化不在單一炫技功能，而在多帳本、預算、借貸、報銷、請款單、
                  存錢罐、AI 快速輸入與備份還原的整合完整度。
                </p>
                <div class="preview-pill-list">
                  <span v-for="item in differentiationItems" :key="item">{{ item }}</span>
                </div>
              </div>
            </article>

            <article class="feature-preview audience-card">
              <div class="feature-preview-screen">
                <p class="preview-kicker">Best Fit</p>
                <h3>符合這些需求的人會特別有感</h3>
                <ul class="audience-list">
                  <li v-for="item in audienceItems" :key="item">{{ item }}</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section id="download" class="panel footer-panel reveal" :ref="registerReveal">
          <h2 class="section-title">從今天開始，把記帳變成真正可追蹤的金流管理</h2>
          <p class="section-subtitle">
            從日常收支，到暫墊款項、借貸往來、儲蓄目標與備份保障，讓每一筆錢都更清楚、更可控。
          </p>
          <div class="footer-actions">
            <a
              class="download-btn download-btn-ios"
              :class="{ disabled: !hasIosDownload }"
              :href="hasIosDownload ? iosUrl : '#download'"
              target="_blank"
              rel="noreferrer"
            >
              下載 iOS
            </a>
            <a
              class="download-btn download-btn-android"
              :class="{ disabled: !hasAndroidDownload }"
              :href="hasAndroidDownload ? androidUrl : '#download'"
              target="_blank"
              rel="noreferrer"
            >
              下載 Android
            </a>
          </div>
          <div class="footer-links">
            <RouterLink to="/terms-of-service">服務條款</RouterLink>
            <RouterLink to="/privacy-policy">隱私權政策</RouterLink>
          </div>
          <p id="privacy-note" class="privacy-note">
            本站採本地優先與可匯出策略，不綁定你的資料所有權。Android 安裝提示為系統防護行為，請僅透過官網下載。
          </p>
          <p class="copyright">© 2026 StrawMoneyBook. Designed for financial clarity.</p>
        </section>
      </main>
    </div>

    <a href="#download" class="download-fab">立即下載</a>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import appLogo from '@/assets/icon/icon.png'

const androidUrl = import.meta.env.VITE_ANDROID_URL || import.meta.env.VITE_APK_URL || '#'
const iosUrl = import.meta.env.VITE_IOS_URL || '#'
const hasAndroidDownload = androidUrl !== '#'
const hasIosDownload = iosUrl !== '#'

const initialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem('smb-web-theme')
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const theme = ref(initialTheme())

watch(
  theme,
  (value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('smb-web-theme', value)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = value
    }
  },
  { immediate: true },
)

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const heroEntries = [
  { type: 'expense', title: '午餐 250', meta: '信用卡 · AI 解析完成', amount: '-NT$ 250' },
  { type: 'expense', title: '專案代墊材料', meta: '標記待報銷', amount: '-NT$ 1,800' },
  { type: 'income', title: '報銷回款', meta: '代收抵扣後入帳', amount: '+NT$ 1,800' },
  { type: 'income', title: '副業請款完成', meta: '請款單自動結案', amount: '+NT$ 12,000' },
]

const heroMetrics = [
  { label: '管理範圍', value: '8+ 金流場景', detail: '記帳、預算、借貸、報銷、請款、存錢與備份整合' },
  { label: '輸入速度', value: '一句話入帳', detail: 'AI 解析金額、帳戶、分類與備註' },
  { label: '資料延續', value: '備份可還原', detail: '支援匯出、修復、WebDAV 與 Google Drive' },
]

const valueCards = [
  {
    title: '從記錄變成追蹤',
    highlight: '不只知道花了多少，也知道每一筆錢正卡在哪個流程。',
    description: '把一般消費、暫墊款項、報銷回款、借貸還款拆開管理，現金流才看得準。',
  },
  {
    title: '從單一帳本變成分流管理',
    highlight: '個人、家庭、工作、副業可以各自獨立運作。',
    description: '切換帳本後，首頁、分析、借貸、報銷與備份會同步使用同一帳本脈絡。',
  },
  {
    title: '從短期使用變成長期可持續',
    highlight: '匯出、還原、修復與雲端備份都先準備好。',
    description: '對重度記帳使用者來說，資料能留住、能換機，才算真正能長期依賴。',
  },
]

const coreFeatures = [
  {
    key: 'quick-add',
    title: '快速新增',
    description: '金額、帳戶、分類、時間、備註、可報銷與附加金額一次完成。',
    previewTag: 'Quick Add',
    previewTitle: '一次完成「記帳 + 補充資訊」',
    previewDescription: '當下就把交易情境記完整，減少事後回補與漏記。',
    pills: ['備註', '可報銷', '附加金額'],
    rows: [
      { label: '交易型態', value: '支出 / 收入 / 轉帳 / 調整' },
      { label: '填寫節奏', value: '單一表單完成' },
      { label: '適用場景', value: '日常消費與臨時代墊' },
      { label: '目的', value: '降低漏記與誤記' },
    ],
  },
  {
    key: 'ai-input',
    title: 'AI 快速記帳',
    description: '像輸入一句話一樣記帳，自動拆解成可入帳資料。',
    previewTag: 'AI Parsing',
    previewTitle: '自然語句可直接解析成交易',
    previewDescription: '例如「午餐250信用卡牛肉麵」，可自動判斷金額、帳戶、分類與備註。',
    pills: ['多語輸入', '分類判斷', '減少重複備註'],
    rows: [
      { label: '輸入內容', value: '午餐250信用卡牛肉麵' },
      { label: '解析金額', value: 'NT$ 250' },
      { label: '解析帳戶', value: '信用卡' },
      { label: '解析分類', value: '餐飲支出' },
    ],
  },
  {
    key: 'ledgers',
    title: '多帳本設計',
    description: '生活、家庭、工作帳分開，資料不混雜。',
    previewTag: 'Ledger Context',
    previewTitle: '同一套功能，跟著帳本上下文一起切換',
    previewDescription: '不只首頁，連分析、借貸、報銷與備份都會使用同一帳本脈絡。',
    pills: ['個人', '家庭', '副業'],
    rows: [
      { label: '帳本切換', value: '個人 / 家庭 / 工作' },
      { label: '資料範圍', value: '互不混用' },
      { label: '報表分析', value: '各自獨立統計' },
      { label: '適合對象', value: '多身分、多用途使用者' },
    ],
  },
  {
    key: 'search',
    title: '高效率搜尋',
    description: '關鍵字搭配日期區間，快速回查任一筆交易。',
    previewTag: 'Search & Audit',
    previewTitle: '對帳、追蹤、回溯都更快',
    previewDescription: '可搜尋分類、帳戶、備註、金額與日期文字，適合回查異常支出。',
    pills: ['關鍵字', '日期區間', '多欄位命中'],
    rows: [
      { label: '查詢條件', value: '聚餐 + 2026/01/01 - 2026/01/31' },
      { label: '可搜欄位', value: '分類 / 帳戶 / 備註 / 金額 / 日期' },
      { label: '使用情境', value: '對帳與異常追蹤' },
      { label: '結果整理', value: '可接續報表匯出' },
    ],
  },
  {
    key: 'money-box',
    title: '存錢罐',
    description: '把先存起來的錢獨立管理，不混進日常可花餘額。',
    previewTag: 'Savings Space',
    previewTitle: '儲蓄有自己的空間，而不是塞進一般帳戶',
    previewDescription: '可設定目標金額、追蹤進度，並決定是否納入資產統計。',
    pills: ['目標進度', '可排除資產', '不限用途'],
    rows: [
      { label: '免費版', value: '1 個存錢罐' },
      { label: '會員版', value: '不限數量' },
      { label: '可執行', value: '存入 / 提取' },
      { label: '預設行為', value: '不計入資產' },
    ],
  },
]

const insightItems = [
  {
    icon: '📅',
    title: '按月份管理預算',
    description: '每月預算獨立檢視，知道這個月真正該控制的消費重點。',
  },
  {
    icon: '🧭',
    title: '分類層級執行狀況',
    description: '不只看總額，還能掌握哪些分類超支、哪些仍有空間。',
  },
  {
    icon: '📈',
    title: '日均規則更貼近日常',
    description: '支援固定月額、平日 / 假日 / 自訂星期與指定日期的分類預算規則。',
  },
  {
    icon: '🥧',
    title: '收入 / 支出視角切換',
    description: '分析頁可切換區間與收支視角，搭配圓餅圖、占比與筆數快速讀懂金流。',
  },
]

const advancedFlows = [
  {
    chip: 'Lending Flow',
    title: '借貸管理',
    graphicTitle: '借出 / 借入 -> 還款 -> 狀態更新 -> 結束或作廢',
    description:
      '每筆借貸都能獨立追蹤借出、借入、還款與狀態，不再把欠款對象塞進備註裡硬記。',
    steps: ['建立借貸項目', '設定金額與對象', '記錄還款', '追蹤進行中 / 已結束 / 作廢'],
  },
  {
    chip: 'Reimbursement Flow',
    title: '報銷與請款',
    graphicTitle: '標記待報銷 -> 導入請款單 -> 完成請款 -> 自動同步狀態',
    description:
      '未報銷與已報銷分開管理，請款單可手動新增項目，也可導入報銷並在完成後同步更新。',
    steps: ['交易標記待報銷', '整理未報銷清單', '建立或導入請款單', '完成請款後同步結案'],
  },
  {
    chip: 'Offset Flow',
    title: '代收抵扣',
    graphicTitle: '先收到款項 -> 標記為代收 -> 報銷入帳時抵扣 -> 不計入可支配資產',
    description:
      '代收金額不計入預算、不進分析，也不算入可支配餘額，避免把暫收款誤判成真正收入。',
    steps: ['先收到但未核銷的款項', '標示為代收', '報銷入帳時自動抵扣', '帳戶額外顯示代收金額'],
  },
]

const trustItems = [
  {
    icon: '☁️',
    title: '雲端備份',
    description: '支援 WebDAV 與 Google Drive appDataFolder，備份位置可控。',
  },
  {
    icon: '🔐',
    title: 'Google 自動恢復登入',
    description: '開啟 App 與回前景時可嘗試靜默恢復登入，優先沿用上次備份帳號。',
  },
  {
    icon: '🔄',
    title: '完整還原流程',
    description: '還原前可清空資料再匯入，還原後提供一致性檢查與修復提示。',
  },
  {
    icon: '📄',
    title: 'CSV / PDF 匯出',
    description: '除了 CSV，也能直接輸出 PDF 報表，方便對帳、存檔與分享。',
  },
]

const differentiationItems = ['多帳本', '預算', '借貸', '報銷', '請款單', '存錢罐', 'AI 輸入', '備份還原']

const audienceItems = [
  '想穩定維持每月記帳習慣的人',
  '想把家庭、個人與工作金流分開管理的人',
  '常有代墊、報銷、請款情境的人',
  '有借貸往來、需要追蹤欠款對象的人',
  '想建立儲蓄目標、控制可支配資產的人',
  '需要定期對帳、匯出與備份的人',
]

const activeFeatureKey = ref(coreFeatures[0].key)
const activeFeature = computed(
  () => coreFeatures.find((item) => item.key === activeFeatureKey.value) ?? coreFeatures[0],
)

const revealNodes = ref([])
const hasRevealObserver = ref(false)
const registerReveal = (el) => {
  if (el && !revealNodes.value.includes(el)) {
    revealNodes.value.push(el)
  }
}

let sectionObserver
let anchorLinkHandlers = []
onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    hasRevealObserver.value = true
    sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            sectionObserver.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    for (const node of revealNodes.value) {
      sectionObserver.observe(node)
    }
  }

  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'))
  anchorLinkHandlers = anchorLinks.map((link) => {
    const handler = (event) => {
      const href = link.getAttribute('href')
      if (!href || href === '#') {
        return
      }

      const target = document.querySelector(href)
      if (!target) {
        return
      }

      event.preventDefault()
      const targetTop = target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: Math.max(0, targetTop - 88),
        behavior: 'smooth',
      })
      target.classList.add('is-visible')
      history.replaceState(null, '', href)
    }

    link.addEventListener('click', handler)
    return { link, handler }
  })
})

onBeforeUnmount(() => {
  if (sectionObserver) {
    sectionObserver.disconnect()
  }

  for (const item of anchorLinkHandlers) {
    item.link.removeEventListener('click', item.handler)
  }
  anchorLinkHandlers = []
})
</script>

<style scoped>
.landing {
  --bg-primary: #000000;
  --bg-secondary: rgba(30, 30, 30, 0.92);
  --bg-card: #1b1b1b;
  --bg-card-soft: #202020;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --accent-color: #f2c94c;
  --accent-strong: #ddb845;
  --accent-soft: rgba(242, 201, 76, 0.15);
  --border-color: #333333;
  --success-color: #27ae60;
  --danger-color: #cf6679;
  --surface-glass: rgba(21, 21, 21, 0.84);
  --shadow-soft: 0 24px 64px rgba(0, 0, 0, 0.34);
  min-height: 100vh;
  position: relative;
  color: var(--text-primary);
  background: var(--bg-primary);
  overflow: hidden;
  transition: background 0.35s ease, color 0.35s ease;
}

.landing::before,
.landing::after {
  content: '';
  position: absolute;
  inset: auto;
  pointer-events: none;
  z-index: 0;
}

.landing::before {
  width: 720px;
  height: 720px;
  top: -420px;
  right: -120px;
  background: radial-gradient(circle, rgba(242, 201, 76, 0.22) 0%, transparent 68%);
}

.landing::after {
  width: 760px;
  height: 760px;
  bottom: -430px;
  left: -180px;
  background: radial-gradient(circle, rgba(39, 174, 96, 0.14) 0%, transparent 72%);
}

.landing[data-theme='light'] {
  --bg-primary: #f9f9f9;
  --bg-secondary: rgba(255, 255, 255, 0.94);
  --bg-card: #ffffff;
  --bg-card-soft: #f4f6f8;
  --text-primary: #2c3e50;
  --text-secondary: #546e7a;
  --accent-color: #d4af37;
  --accent-strong: #bc9928;
  --accent-soft: rgba(212, 175, 55, 0.16);
  --border-color: #e0e0e0;
  --success-color: #219653;
  --danger-color: #eb5757;
  --surface-glass: rgba(255, 255, 255, 0.85);
  --shadow-soft: 0 24px 58px rgba(24, 39, 64, 0.12);
}

.landing-shell {
  width: min(1140px, calc(100% - 2.6rem));
  margin: 0 auto;
  padding: 1.25rem 0 5rem;
  position: relative;
  z-index: 1;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  position: relative;
  z-index: 18;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.72rem;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--border-color);
}

.brand-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.nav-links {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-links a:not(.pill-link) {
  padding: 0.38rem 0.7rem;
  border-radius: 999px;
}

.nav-links a:not(.pill-link):hover {
  background: color-mix(in srgb, var(--bg-card-soft) 78%, transparent);
}

.nav-links .pill-link {
  border: 1px solid var(--accent-color);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  color: var(--accent-color);
}

.theme-toggle {
  border: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-card-soft) 90%, transparent);
  color: var(--text-primary);
  border-radius: 999px;
  min-height: 42px;
  padding: 0.45rem 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.theme-toggle-icon {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--accent-soft) 70%, var(--bg-card));
  color: var(--accent-color);
  font-size: 0.92rem;
  line-height: 1;
}

.toggle-text {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.content {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
}

.panel {
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background: var(--bg-secondary);
  box-shadow: var(--shadow-soft);
  padding: clamp(1rem, 2.3vw, 1.6rem);
}

.panel[id],
#privacy-note {
  scroll-margin-top: 6.4rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: clamp(1rem, 2vw, 1.6rem);
  align-items: center;
}

.kicker {
  color: var(--accent-color);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-title {
  margin-top: 0.6rem;
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  letter-spacing: -0.02em;
  line-height: 1.08;
}

.hero-subtitle {
  margin-top: 1rem;
  color: var(--text-secondary);
  line-height: 1.72;
}

.hero-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid transparent;
  min-height: 46px;
  padding: 0.7rem 1.15rem;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.disabled {
  opacity: 0.58;
  pointer-events: none;
}

.btn-primary {
  color: #1f1600;
  background: linear-gradient(120deg, var(--accent-color), #fbe182);
  box-shadow: 0 14px 34px rgba(242, 201, 76, 0.26);
}

.btn-secondary {
  color: var(--text-primary);
  border-color: var(--border-color);
  background: color-mix(in srgb, var(--bg-card-soft) 86%, transparent);
}

.hero-bullets {
  margin-top: 1rem;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.hero-bullets li {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.35rem 0.72rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--bg-card-soft) 76%, transparent);
}

.hero-metrics {
  margin-top: 1rem;
  display: grid;
  gap: 0.72rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.85rem;
  background: color-mix(in srgb, var(--bg-card-soft) 82%, transparent);
  display: grid;
  gap: 0.28rem;
}

.metric-card p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.76rem;
}

.metric-card strong {
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.metric-card span {
  color: var(--text-secondary);
  font-size: 0.78rem;
  line-height: 1.55;
}

.phone-shell {
  border: 1px solid var(--border-color);
  border-radius: 30px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 96%, black 4%), var(--bg-card-soft));
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.phone-shell::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  right: -70px;
  top: -70px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent-color) 46%, transparent), transparent 74%);
}

.phone-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.phone-head strong {
  color: var(--text-primary);
}

.balance-card {
  margin-top: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: color-mix(in srgb, var(--bg-card-soft) 82%, transparent);
  padding: 0.85rem;
}

.balance-card p {
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.balance-card h3 {
  margin-top: 0.25rem;
  font-size: 1.44rem;
  letter-spacing: -0.02em;
}

.balance-card small {
  margin-top: 0.3rem;
  display: block;
  color: var(--text-secondary);
  font-size: 0.72rem;
}

.entry-stream {
  list-style: none;
  margin-top: 0.8rem;
  display: grid;
  gap: 0.6rem;
}

.entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.65rem 0.75rem;
  background: color-mix(in srgb, var(--bg-card-soft) 78%, transparent);
  animation: entry-slide-up 0.56s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--delay);
}

.entry-row p {
  font-size: 0.88rem;
  font-weight: 600;
}

.entry-row small {
  display: block;
  margin-top: 0.15rem;
  color: var(--text-secondary);
  font-size: 0.72rem;
}

.entry-row .entry-amount {
  font-size: 0.9rem;
}

.entry-row.income .entry-amount {
  color: var(--success-color);
}

.entry-row.expense .entry-amount {
  color: var(--danger-color);
}

.section-tag {
  color: var(--accent-color);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.section-title {
  margin-top: 0.42rem;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  letter-spacing: -0.015em;
}

.section-subtitle {
  margin-top: 0.58rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.pain-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.72rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pain-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-card);
  padding: 1rem;
  display: grid;
  gap: 0.6rem;
}

.pain-card h3 {
  font-size: 1.05rem;
}

.pain-card p {
  color: var(--text-secondary);
  line-height: 1.66;
}

.pain-card .pain-question {
  color: var(--text-primary);
}

.feature-layout {
  margin-top: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
}

.feature-menu {
  display: grid;
  gap: 0.62rem;
}

.feature-tab {
  text-align: left;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: inherit;
  border-radius: 15px;
  padding: 0.9rem;
  display: grid;
  gap: 0.36rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.feature-tab:hover {
  transform: translateY(-1px);
}

.feature-tab.is-active {
  border-color: var(--accent-color);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--accent-soft) 70%, transparent),
    color-mix(in srgb, var(--bg-card) 88%, transparent)
  );
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
}

.feature-copy {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.92rem;
}

.feature-preview {
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 96%, black 4%), var(--bg-card-soft));
  padding: 1rem;
  display: flex;
  align-items: stretch;
}

.feature-preview-screen {
  width: 100%;
  display: grid;
  gap: 0.78rem;
}

.preview-kicker {
  color: var(--accent-color);
  font-size: 0.76rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  font-weight: 700;
}

.feature-preview-screen h3 {
  font-size: 1.22rem;
}

.preview-copy {
  color: var(--text-secondary);
  line-height: 1.66;
}

.preview-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.preview-pill-list span {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: color-mix(in srgb, var(--bg-card-soft) 74%, transparent);
}

.preview-rows {
  list-style: none;
  display: grid;
  gap: 0.45rem;
}

.preview-rows li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--border-color);
  border-radius: 11px;
  padding: 0.55rem 0.68rem;
  background: color-mix(in srgb, var(--bg-card-soft) 82%, transparent);
}

.preview-rows span {
  color: var(--text-secondary);
  font-size: 0.86rem;
}

.preview-rows strong {
  font-size: 0.86rem;
}

.screen-swap-enter-active,
.screen-swap-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease;
}

.screen-swap-enter-from,
.screen-swap-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.advanced {
  background:
    linear-gradient(145deg, color-mix(in srgb, var(--accent-soft) 64%, transparent), transparent 45%),
    var(--bg-secondary);
}

.flow-rows {
  margin-top: 1rem;
  display: grid;
  gap: 0.95rem;
}

.flow-row {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 0.85rem;
  align-items: stretch;
}

.flow-row.reverse .flow-graphic {
  order: 2;
}

.flow-row.reverse .flow-copy {
  order: 1;
}

.flow-graphic {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-card);
  padding: 0.95rem;
}

.flow-graphic-title {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.flow-graphic ol {
  margin-top: 0.72rem;
  list-style: none;
  display: grid;
  gap: 0.58rem;
}

.flow-graphic li {
  display: flex;
  gap: 0.58rem;
  align-items: flex-start;
}

.flow-graphic li span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-color);
  color: var(--accent-color);
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
}

.flow-graphic li p {
  color: var(--text-secondary);
  line-height: 1.55;
  font-size: 0.88rem;
}

.flow-copy {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-card-soft);
  padding: 0.95rem;
}

.flow-chip {
  color: var(--accent-color);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.flow-copy h3 {
  margin-top: 0.32rem;
  font-size: 1.24rem;
}

.flow-copy p {
  margin-top: 0.6rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.trust-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.insight-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.trust-card {
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--bg-card);
  padding: 0.92rem;
  display: grid;
  gap: 0.45rem;
}

.trust-icon {
  font-size: 1.35rem;
}

.trust-card h3 {
  font-size: 0.98rem;
}

.trust-card p {
  color: var(--text-secondary);
  line-height: 1.62;
  font-size: 0.9rem;
}

.bottom-layout {
  align-items: stretch;
}

.audience-card {
  min-height: 100%;
}

.audience-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.audience-list li {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.62rem 0.72rem;
  background: color-mix(in srgb, var(--bg-card-soft) 78%, transparent);
  color: var(--text-secondary);
  line-height: 1.55;
  font-size: 0.9rem;
}

.footer-panel {
  text-align: center;
}

.footer-actions {
  margin-top: 1.05rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.download-btn {
  min-width: 188px;
  min-height: 54px;
  border-radius: 14px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.download-btn:hover {
  transform: translateY(-2px);
}

.download-btn-ios {
  color: var(--text-primary);
  border-color: var(--border-color);
  background: color-mix(in srgb, var(--bg-card-soft) 90%, transparent);
}

.download-btn-ios.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.download-btn-android.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.download-btn-android {
  color: #1f1600;
  background: linear-gradient(120deg, var(--accent-color), #fbe182);
  box-shadow: 0 12px 28px rgba(242, 201, 76, 0.24);
}

.footer-links {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.95rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.privacy-note {
  margin-top: 0.75rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.58;
}

.copyright {
  margin-top: 0.8rem;
  font-size: 0.83rem;
  color: var(--text-secondary);
}

.download-fab {
  position: fixed;
  right: clamp(0.8rem, 2vw, 1.6rem);
  bottom: clamp(0.8rem, 2.2vw, 1.6rem);
  min-width: 136px;
  min-height: 50px;
  border-radius: 999px;
  background: linear-gradient(120deg, var(--accent-color), #fbe182);
  color: #1f1600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.01em;
  box-shadow: 0 14px 36px rgba(242, 201, 76, 0.34);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 22;
}

.download-fab:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 18px 40px rgba(242, 201, 76, 0.42);
}

.reveal {
  opacity: 1;
  transform: none;
}

.reveal-enabled .reveal {
  opacity: 0;
  transform: translateY(34px);
}

.reveal-enabled .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.72s ease, transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes entry-slide-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1060px) {
  .hero,
  .feature-layout,
  .flow-row {
    grid-template-columns: 1fr;
  }

  .hero-metrics,
  .insight-grid {
    grid-template-columns: 1fr;
  }

  .flow-row.reverse .flow-graphic,
  .flow-row.reverse .flow-copy {
    order: initial;
  }

  .trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 880px) {
  .topbar {
    flex-wrap: wrap;
    border-radius: 18px;
    justify-content: space-between;
  }

  .nav-links {
    width: 100%;
    order: 3;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.25rem 0 0;
  }

  .nav-links a {
    font-size: 0.84rem;
  }

  .nav-links a:not(.pill-link),
  .nav-links .pill-link {
    padding: 0.42rem 0.68rem;
  }
}

@media (max-width: 720px) {
  .landing-shell {
    width: min(1140px, calc(100% - 1.3rem));
  }

  .panel {
    border-radius: 18px;
    padding: 1rem;
  }

  .pain-grid,
  .trust-grid {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .hero-actions .btn,
  .download-btn {
    width: 100%;
  }

  .theme-toggle {
    width: 100%;
  }

  .toggle-text {
    display: inline;
  }

  .download-fab {
    min-width: 120px;
    min-height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .entry-row,
  .btn,
  .feature-tab,
  .download-btn,
  .download-fab,
  .theme-toggle {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
