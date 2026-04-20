// ===== Article switching =====
function isMobile() {
  return window.innerWidth <= 768;
}

function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');
  const main = document.querySelector('.main');
  const sidebar = document.querySelector('.sidebar');
  const backBtn = document.getElementById('backBtn');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.article;

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        v.classList.toggle('active', v.dataset.article === id);
      });

      if (isMobile()) {
        sidebar.classList.add('mobile-hidden');
        main.classList.add('mobile-visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        main.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  backBtn.addEventListener('click', () => {
    main.classList.remove('mobile-visible');
    sidebar.classList.remove('mobile-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', initArticles);
