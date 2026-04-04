// ===== Article switching =====
function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.article;

      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        v.classList.toggle('active', v.dataset.article === id);
      });

      document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

document.addEventListener('DOMContentLoaded', initArticles);
