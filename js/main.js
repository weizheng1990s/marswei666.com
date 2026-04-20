// ===== Article switching =====
function isMobile() {
  return window.innerWidth <= 768;
}

function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');
  const main  = document.querySelector('.main');
  const backBtn = document.getElementById('backBtn');

  // Set initial URL to the default active article
  const defaultActive = document.querySelector('.article-item.active');
  if (defaultActive) {
    history.replaceState({ article: defaultActive.dataset.article }, '', '#' + defaultActive.dataset.article);
  }

  // Restore article from URL hash on page load
  if (location.hash) {
    const id = location.hash.slice(1);
    const target = document.querySelector(`.article-item[data-article="${id}"]`);
    if (target) {
      items.forEach(i => i.classList.remove('active'));
      target.classList.add('active');
      views.forEach(v => v.classList.toggle('active', v.dataset.article === id));
      if (isMobile()) document.body.classList.add('show-article');
    }
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.article;

      // Update URL immediately
      history.pushState({ article: id }, '', '#' + id);

      // Update sidebar
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update article view
      views.forEach(v => v.classList.toggle('active', v.dataset.article === id));

      if (isMobile()) {
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

  backBtn.addEventListener('click', () => history.back());

  window.addEventListener('popstate', e => {
    if (isMobile()) {
      if (document.body.classList.contains('show-article')) {
        goBack();
      }
    } else {
      const id = e.state?.article || location.hash.slice(1);
      if (id) {
        items.forEach(i => i.classList.remove('active'));
        views.forEach(v => v.classList.toggle('active', v.dataset.article === id));
        const target = document.querySelector(`.article-item[data-article="${id}"]`);
        if (target) target.classList.add('active');
        main.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Mobile swipe
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!document.body.classList.contains('show-article')) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    if (dx > 60 && dy < 80) history.back();
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initArticles);
