<template>
  <div class="landing" :data-theme="theme" :class="{ 'reveal-enabled': hasRevealObserver }">
    <div class="landing-shell">
      <header class="topbar">
        <a class="brand" href="#hero">
          <img :src="appLogo" alt="StrawMoneyBook Logo" class="brand-logo" />
          <span class="brand-name">StrawMoneyBook</span>
        </a>

        <button type="button" class="theme-toggle" :aria-pressed="theme === 'light'" @click="toggleTheme">
          <span class="toggle-track">
            <span class="toggle-thumb">
              <span class="sun-icon">☀</span>
              <span class="moon-icon">☾</span>
            </span>
          </span>
          <span class="toggle-text">{{ theme === 'dark' ? 'Night Owl' : 'Morning Clarity' }}</span>
        </button>
      </header>

      <main class="content">
        <section id="hero" class="panel hero reveal" :ref="registerReveal">
          <div>
            <p class="kicker">From Bookkeeping to Cashflow Control</p>
            <h1 class="hero-title">不只是記帳，而是掌控生活金流。</h1>
            <p class="hero-subtitle">
              整合預算、借貸管理與報銷流程。StrawMoneyBook 讓你的每一分錢都有跡可循。
            </p>

            <div class="hero-actions">
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
              <a href="#features" class="btn btn-secondary">觀看 30 秒功能演示</a>
            </div>

            <ul class="hero-bullets">
              <li>多帳本分流</li>
              <li>AI 自然語言記帳</li>
              <li>借貸與報銷雙流程</li>
            </ul>
          </div>

          <aside class="phone-shell">
            <div class="phone-head">
              <span>Dashboard</span>
              <strong>Today</strong>
            </div>
            <div class="balance-card">
              <p>可用資金</p>
              <h3>NT$ 38,420</h3>
              <small>已套用本月預算規劃</small>
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
          <p class="section-tag">Why StrawMoneyBook</p>
          <h2 class="section-title">為何選擇我們</h2>
          <p class="section-subtitle">解決日常記帳混亂，把每個財務場景收斂成可控流程。</p>
          <div class="pain-grid">
            <article v-for="item in painPoints" :key="item.title" class="pain-card">
              <h3>{{ item.title }}</h3>
              <p class="pain-question">「{{ item.question }}」</p>
              <p><strong>解法：</strong>{{ item.solution }}</p>
            </article>
          </div>
        </section>

        <section id="features" class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Core Features</p>
          <h2 class="section-title">核心功能展示</h2>
          <p class="section-subtitle">游標滑過左側功能，右側手機預覽同步切換。</p>
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

        <section class="panel advanced reveal" :ref="registerReveal">
          <p class="section-tag">Professional Flow</p>
          <h2 class="section-title">為真實生活設計的金流場景</h2>
          <div class="flow-rows">
            <article v-for="(flow, index) in advancedFlows" :key="flow.title" class="flow-row" :class="{ reverse: index % 2 === 1 }">
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

        <section class="panel reveal" :ref="registerReveal">
          <p class="section-tag">Security & Data</p>
          <h2 class="section-title">你的資料，完全自主</h2>
          <div class="trust-grid">
            <article v-for="item in trustItems" :key="item.title" class="trust-card">
              <p class="trust-icon" aria-hidden="true">{{ item.icon }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </article>
          </div>
        </section>

        <section id="download" class="panel footer-panel reveal" :ref="registerReveal">
          <h2 class="section-title">準備好釐清你的財務現狀了嗎？</h2>
          <p class="section-subtitle">立即下載 StrawMoneyBook，從「記一筆帳」升級為「管理一段完整金流」。</p>
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
            <a href="#hero">用戶指南</a>
            <a href="#features">常見問題</a>
            <a href="mailto:hello@strawmoneybook.app">聯繫開發者</a>
            <a href="#privacy-note">隱私權政策</a>
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
  { type: 'income', title: '薪資入帳', meta: '中國信託 · 本月', amount: '+NT$ 36,000' },
  { type: 'expense', title: '午餐牛肉麵', meta: '信用卡 · AI 解析', amount: '-NT$ 250' },
  { type: 'expense', title: '公司代墊材料', meta: '標記待報銷', amount: '-NT$ 1,800' },
  { type: 'income', title: '報銷回款', meta: '自動沖銷完成', amount: '+NT$ 1,800' },
]

const painPoints = [
  {
    title: '公私不分？',
    question: '工作代墊款混進生活費，月底對帳總是不準',
    solution: '多帳本 + 報銷系統，把個人消費與代墊流程分離。',
  },
  {
    title: '借錢忘記？',
    question: '朋友借錢、分攤聚餐，這筆帳到底記在哪',
    solution: '獨立借貸模組，追蹤借出、借入與還款狀態。',
  },
  {
    title: '輸入繁瑣？',
    question: '站在收銀台前手忙腳亂找分類',
    solution: 'AI 自然語言輸入，一句話完成記帳。',
  },
]

const coreFeatures = [
  {
    key: 'ai-input',
    title: 'AI 智慧輸入',
    description: '「午餐250信用卡牛肉麵」，自動解析金額、帳戶與分類。',
    previewTag: 'Chat-to-Book',
    previewTitle: '一句話，完成一筆交易',
    previewDescription: '自然語句自動拆解，減少輸入摩擦，收銀台前也能 3 秒完成記帳。',
    pills: ['語義解析', '欄位自填', '可追問缺漏'],
    rows: [
      { label: '金額', value: 'NT$ 250' },
      { label: '分類', value: '餐飲支出' },
      { label: '帳戶', value: '信用卡' },
      { label: '備註', value: '牛肉麵' },
    ],
  },
  {
    key: 'ledgers',
    title: '多帳本系統',
    description: '家庭、個人、副業一鍵切換，資料與分析完全隔離。',
    previewTag: 'Ledger Isolation',
    previewTitle: '多身份資金流同步管理',
    previewDescription: '每本帳有自己的收支、預算與報表，避免公私混帳。',
    pills: ['家庭', '個人', '副業'],
    rows: [
      { label: '家庭帳本', value: '本月結餘 +NT$ 8,420' },
      { label: '個人帳本', value: '本月結餘 +NT$ 12,100' },
      { label: '副業帳本', value: '本月結餘 +NT$ 6,980' },
      { label: '切換速度', value: '< 1 秒' },
    ],
  },
  {
    key: 'budget',
    title: '預算透視',
    description: '不只看總額，深入分類層級，紅綠燈號一目了然。',
    previewTag: 'Budget Insight',
    previewTitle: '超支前先看見風險',
    previewDescription: '分類預算即時比對，紅燈區塊優先顯示，快速調整消費策略。',
    pills: ['分類預警', '月度趨勢', '剩餘預算'],
    rows: [
      { label: '餐飲預算', value: '90% 使用（黃燈）' },
      { label: '交通預算', value: '62% 使用（綠燈）' },
      { label: '娛樂預算', value: '112% 使用（紅燈）' },
      { label: '本月總控', value: '可控狀態 81%' },
    ],
  },
  {
    key: 'search',
    title: '強大搜尋',
    description: '關鍵字 + 日期區間，像搜尋引擎一樣回查交易歷史。',
    previewTag: 'Search Engine',
    previewTitle: '查帳不再靠記憶',
    previewDescription: '組合關鍵字、分類、日期區間，精準找回每一筆交易。',
    pills: ['全文搜尋', '日期區間', '多條件篩選'],
    rows: [
      { label: '搜尋詞', value: '「聚餐」 + 去年第四季' },
      { label: '命中筆數', value: '23 筆交易' },
      { label: '最快回應', value: '0.15 秒' },
      { label: '可匯出', value: 'CSV / Excel' },
    ],
  },
]

const advancedFlows = [
  {
    chip: 'Lending Flow',
    title: '借貸管理',
    graphicTitle: '借出 -> 進行中 -> 設定還款 -> 結案',
    description:
      '別把借貸藏在備註裡。每筆欠款都有獨立狀態與紀錄，清楚區分資產流動與實際支出。',
    steps: ['建立借貸對象', '設定金額與期限', '分次還款追蹤', '結案自動對帳'],
  },
  {
    chip: 'Reimbursement Flow',
    title: '報銷流程',
    graphicTitle: '標記待報銷 -> 提交憑證 -> 報銷入帳 -> 自動沖銷',
    description:
      '公司代墊、家庭採購都能標記為待報銷，入帳後自動沖銷，避免代墊金額灌水個人資產。',
    steps: ['交易標記待報銷', '追蹤待回款清單', '執行報銷入帳', '資產與支出同步修正'],
  },
]

const trustItems = [
  {
    icon: '☁️',
    title: '雲端備份',
    description: '支援 Google Drive(appDataFolder) 與 WebDAV，備份位置可控。',
  },
  {
    icon: '🔒',
    title: '本地優先',
    description: '基於 SQLite，離線也能極速記帳，不依賴持續網路連線。',
  },
  {
    icon: '🔄',
    title: '無痛換機',
    description: '完整匯出與還原流程，附一致性檢查，降低遺漏與毀損風險。',
  },
  {
    icon: '📂',
    title: 'CSV 匯出',
    description: '資料可帶去 Excel 深度分析，不被單一平台綁架。',
  },
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
onMounted(() => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

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
})

onBeforeUnmount(() => {
  if (sectionObserver) {
    sectionObserver.disconnect()
  }
})
</script>

<style scoped>
.landing {
  --bg-primary: #121212;
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
  gap: 0.9rem;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-links .pill-link {
  border: 1px solid var(--accent-color);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  color: var(--accent-color);
}

.theme-toggle {
  border: 1px solid var(--border-color);
  background: var(--bg-card-soft);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 0.28rem 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.toggle-track {
  width: 56px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.14), rgba(255, 255, 255, 0.04));
  border: 1px solid var(--border-color);
  padding: 3px;
  position: relative;
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50% 48% 52% 50%;
  background: var(--accent-color);
  position: relative;
  transform: translateX(0) rotate(-6deg);
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.34s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
}

.landing[data-theme='dark'] .toggle-thumb {
  transform: translateX(26px) rotate(8deg);
  border-radius: 45% 55% 50% 50%;
}

.sun-icon,
.moon-icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.sun-icon {
  opacity: 1;
  transform: scale(1);
}

.moon-icon {
  opacity: 0;
  transform: scale(0.62);
}

.landing[data-theme='dark'] .sun-icon {
  opacity: 0;
  transform: scale(0.62);
}

.landing[data-theme='dark'] .moon-icon {
  opacity: 1;
  transform: scale(1);
}

.toggle-text {
  font-size: 0.82rem;
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
  }

  .nav-links {
    width: 100%;
    order: 3;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 0.2rem 0.1rem 0;
  }

  .toggle-text {
    display: none;
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

  .hero-actions .btn,
  .download-btn {
    width: 100%;
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
  .toggle-thumb,
  .sun-icon,
  .moon-icon {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
