// ===== Language Toggle =====
const LANG_KEY = 'marswei_lang';

function setLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    if (el.dataset.lang === lang) {
      const inline = ['SPAN', 'A', 'STRONG', 'EM', 'B', 'I'];
      el.style.display = inline.includes(el.tagName) ? 'inline' : 'block';
    } else {
      el.style.display = 'none';
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.switch === lang);
  });

  localStorage.setItem(LANG_KEY, lang);
}

function initLang() {
  const saved = localStorage.getItem(LANG_KEY);
  const preferred = saved || 'en';
  setLang(preferred);
}

// ===== Article switching =====
function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.article;

      // Update sidebar active state
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Show matching article view
      views.forEach(v => {
        v.classList.toggle('active', v.dataset.article === id);
      });

      // Scroll content to top
      document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initArticles();

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.switch));
  });
});
