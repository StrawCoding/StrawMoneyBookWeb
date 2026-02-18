<template>
  <main class="preview-page">
    <div class="preview-container">
      <h1>StrawMoneyBook 預先體驗版</h1>
      <p class="intro">
        歡迎搶先填寫預先體驗版表單，我們會依照填寫資訊通知你最新測試名額與版本消息。
      </p>

      <div class="form-wrap" role="region" aria-label="預先體驗版申請表單">
        <iframe
          class="google-form"
          src="https://docs.google.com/forms/d/e/1FAIpQLSdlkCgRn8R_MxfJpyyp90JogSxoFERLr3wGnrF_i_5AnfAaGw/viewform?embedded=true"
          title="StrawMoneyBook 預先體驗版表單"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        >
          載入中…
        </iframe>
      </div>

      <div class="actions">
        <a
          class="open-link"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdlkCgRn8R_MxfJpyyp90JogSxoFERLr3wGnrF_i_5AnfAaGw/viewform?usp=sharing&ouid=108951777470887788719"
          target="_blank"
          rel="noreferrer"
        >
          無法顯示？改用新分頁填寫
        </a>
        <RouterLink class="back-link" to="/">返回首頁</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.preview-page {
  min-height: 100vh;
  background: #000;
  color: #f3f6ff;
  padding: clamp(1.5rem, 3vw, 2.8rem) 1rem 3.2rem;
}

.preview-container {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: clamp(1rem, 2.8vw, 1.8rem);
  border-radius: 24px;
  background: rgba(10, 15, 30, 0.54);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
}

h1 {
  font-size: clamp(1.55rem, 3.8vw, 2.4rem);
  margin-bottom: 0.85rem;
  letter-spacing: 0.015em;
}

.intro {
  color: #d3dbf2;
  margin-bottom: 1.3rem;
  line-height: 1.75;
  max-width: 760px;
}

.form-wrap {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.google-form {
  width: 100%;
  min-height: 1100px;
  border: none;
  background: #fff;
}

.actions {
  margin-top: 1.15rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.open-link,
.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.58rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #f8df8f;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.22s ease, background 0.22s ease;
}

.open-link:hover,
.back-link:hover {
  transform: translateY(-1px);
  border-color: rgba(248, 223, 143, 0.62);
  background: rgba(248, 223, 143, 0.08);
}

@media (max-width: 640px) {
  .preview-container {
    padding: 0.95rem;
  }

  .google-form {
    min-height: 1180px;
  }
}
</style>
