// ===== Article switching =====
function isMobile() {
  return window.innerWidth <= 768;
}

function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');
  const main  = document.querySelector('.main');
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
        // Push a history state so browser back gesture pops it instead of leaving the page
        if (!document.body.classList.contains('show-article')) {
          history.pushState({ showArticle: true }, '');
        }
        document.body.classList.add('show-article');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        main.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  function goBack() {
    document.body.classList.remove('show-article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // "← Writing" button: trigger browser back, which fires popstate below
  backBtn.addEventListener('click', () => history.back());

  // Intercept browser back gesture / Android back button
  window.addEventListener('popstate', () => {
    if (document.body.classList.contains('show-article')) {
      goBack();
    }
  });
}

document.addEventListener('DOMContentLoaded', initArticles);
