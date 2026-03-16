<template>
  <main class="invite-page">
    <section class="invite-card">
      <img class="invite-logo" src="@/assets/icon/icon.png" alt="StrawMoneyBook" />
      <p class="eyebrow">StrawMoneyBook 共同帳本邀請</p>
      <h1>{{ title }}</h1>
      <p class="description">
        {{ description }}
      </p>

      <div v-if="inviteCode" class="invite-code-box">
        <span>邀請碼</span>
        <strong>{{ inviteCode }}</strong>
      </div>

      <div class="action-group">
        <a
          v-if="primaryActionUrl"
          class="action-button primary"
          :href="primaryActionUrl"
        >
          {{ primaryActionLabel }}
        </a>
        <a
          v-if="playStoreUrl"
          class="action-button secondary"
          :href="playStoreUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          尚未安裝？前往 Google Play
        </a>
        <RouterLink class="action-button ghost" to="/">
          回到官網首頁
        </RouterLink>
      </div>

      <p class="hint">
        {{ hint }}
      </p>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.strawcoding.strawmoneybook'
const DEFAULT_NATIVE_APP_URL = 'com.strawcoding.strawmoneybook://shared-ledger'
const EXPLICIT_WEB_REDIRECT_BASE = String(import.meta.env.VITE_SHARED_LEDGER_REDIRECT_URL ?? '').trim()
const EXPLICIT_NATIVE_APP_BASE = String(import.meta.env.VITE_SHARED_LEDGER_NATIVE_URL ?? '').trim()

let nativeOpenTimer = 0

function normalizeInviteCode(value) {
  const normalized = String(value ?? '').trim().toUpperCase()
  return /^[A-Z0-9]{6,32}$/.test(normalized) ? normalized : ''
}

function buildTargetUrl(baseUrl, code) {
  const normalizedBaseUrl = String(baseUrl ?? '').trim()
  if (!normalizedBaseUrl || !code) return ''

  try {
    const target = typeof window === 'undefined'
      ? new URL(normalizedBaseUrl, 'https://www.strawmb.com')
      : new URL(normalizedBaseUrl, window.location.origin)
    target.searchParams.set('inviteCode', code)
    return target.toString()
  } catch {
    return ''
  }
}

function buildNativeAppUrl(baseUrl, code) {
  const normalizedBaseUrl = String(baseUrl ?? '').trim() || DEFAULT_NATIVE_APP_URL
  if (!code) return ''

  const separator = normalizedBaseUrl.includes('?') ? '&' : '?'
  return `${normalizedBaseUrl}${separator}inviteCode=${encodeURIComponent(code)}`
}

function isMobileBrowser() {
  if (typeof navigator === 'undefined') return false
  return /android|iphone|ipad|ipod/i.test(String(navigator.userAgent ?? ''))
}

function tryOpenNativeApp(url) {
  if (typeof document === 'undefined' || !url) return
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  window.setTimeout(() => {
    iframe.remove()
  }, 1200)
}

const inviteCode = computed(() => normalizeInviteCode(
  route.query.inviteCode ?? route.query.invite_code ?? route.query.code,
))

const webRedirectUrl = computed(() => buildTargetUrl(EXPLICIT_WEB_REDIRECT_BASE, inviteCode.value))
const nativeAppUrl = computed(() => buildNativeAppUrl(EXPLICIT_NATIVE_APP_BASE, inviteCode.value))
const primaryActionUrl = computed(() => webRedirectUrl.value || nativeAppUrl.value)
const playStoreUrl = computed(() => PLAY_STORE_URL)

const title = computed(() => (
  inviteCode.value
    ? '準備開啟共同帳本邀請'
    : '這個共同帳本邀請連結不完整'
))

const description = computed(() => {
  if (!inviteCode.value) {
    return '目前沒有讀到有效的 inviteCode。請回到來源訊息重新點一次邀請連結，或請對方重新分享。'
  }
  if (webRedirectUrl.value) {
    return '正在把你帶往 StrawMoneyBook App 的共同帳本頁面。若沒有自動跳轉，可以手動點擊下方按鈕。'
  }
  return '這個邀請連結已由官網接住。若你的手機已安裝 StrawMoneyBook，可以直接開啟 App 並前往共同帳本邀請頁。'
})

const primaryActionLabel = computed(() => (
  webRedirectUrl.value ? '前往共同帳本頁' : '開啟 StrawMoneyBook App'
))

const hint = computed(() => {
  if (!inviteCode.value) {
    return '若你是從瀏覽器手動輸入網址，請確認 query string 內有 inviteCode。'
  }
  if (webRedirectUrl.value) {
    return '若你停留在此頁面太久，代表目前裝置無法直接跳轉；可改用下方按鈕繼續。'
  }
  return '若沒有自動開啟 App，通常是因為裝置尚未安裝，或目前瀏覽器不允許直接喚起原生 App。'
})

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.title = inviteCode.value
      ? '共同帳本邀請｜StrawMoneyBook'
      : '邀請連結無效｜StrawMoneyBook'
  }

  if (!inviteCode.value) return

  if (webRedirectUrl.value && typeof window !== 'undefined') {
    window.location.replace(webRedirectUrl.value)
    return
  }

  if (isMobileBrowser()) {
    nativeOpenTimer = window.setTimeout(() => {
      tryOpenNativeApp(nativeAppUrl.value)
    }, 180)
  }
})

onBeforeUnmount(() => {
  if (nativeOpenTimer) {
    window.clearTimeout(nativeOpenTimer)
  }
})
</script>

<style scoped>
.invite-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(242, 201, 76, 0.22), transparent 28%),
    radial-gradient(circle at bottom, rgba(59, 130, 246, 0.18), transparent 32%),
    linear-gradient(160deg, #060914 0%, #0b1020 46%, #11182e 100%);
}

.invite-card {
  width: min(100%, 560px);
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  background: rgba(10, 15, 28, 0.84);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
}

.invite-logo {
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
  border-radius: 18px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--brand-accent);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1.08;
}

.description,
.hint {
  margin: 16px 0 0;
  color: var(--text-muted);
}

.invite-code-box {
  margin-top: 24px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.invite-code-box span {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.invite-code-box strong {
  font-size: clamp(1.2rem, 4vw, 1.7rem);
  letter-spacing: 0.12em;
}

.action-group {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.action-button.primary {
  color: #111827;
  background: linear-gradient(135deg, #f2c94c, #f5d977);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.action-button.ghost {
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .invite-page {
    padding: 16px;
  }

  .invite-card {
    padding: 24px;
    border-radius: 24px;
  }
}
</style>
