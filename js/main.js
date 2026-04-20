// ===== Article switching =====
function isMobile() {
  return window.innerWidth <= 768;
}

function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');
  const main  = document.querySelector('.main');
  const backBtn = document.getElementById('backBtn');

  // Restore article from URL hash if page was loaded with one (e.g. shared link)
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

      // Update URL
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

  // Go back to article list: update UI + clean hash from URL, never exit the site
  function goBack() {
    document.body.classList.remove('show-article');
    history.replaceState(null, '', location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backBtn.addEventListener('click', goBack);

  // Browser native back button (desktop/mobile)
  window.addEventListener('popstate', e => {
    if (isMobile()) {
      if (document.body.classList.contains('show-article')) {
        document.body.classList.remove('show-article');
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Mobile swipe to go back
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
    if (dx > 60 && dy < 80) goBack();
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initArticles);
