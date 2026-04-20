// ===== Article switching =====
function isMobile() {
  return window.innerWidth <= 768;
}

function initArticles() {
  const items = document.querySelectorAll('.sidebar-articles .article-item');
  const views = document.querySelectorAll('.main .article-view');
  const main  = document.querySelector('.main');
  const backBtn = document.getElementById('backBtn');

  // Activate an article by id; pushHistory=true updates the URL
  function activateArticle(id, pushHistory) {
    const item = document.querySelector(`.article-item[data-article="${id}"]`);
    if (!item) return;

    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    views.forEach(v => v.classList.toggle('active', v.dataset.article === id));

    if (pushHistory) {
      history.pushState({ article: id }, '', '#' + id);
    }
  }

  // On page load: set initial URL to the default active article
  const defaultActive = document.querySelector('.article-item.active');
  if (defaultActive && !location.hash) {
    history.replaceState({ article: defaultActive.dataset.article }, '', '#' + defaultActive.dataset.article);
  }

  // On page load: if URL already has a hash, activate that article
  if (location.hash) {
    const id = location.hash.slice(1);
    activateArticle(id, false);
    if (isMobile()) document.body.classList.add('show-article');
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.article;
      activateArticle(id, true);

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

  // "← Writing" button
  backBtn.addEventListener('click', () => history.back());

  // Browser back/forward
  window.addEventListener('popstate', e => {
    if (isMobile()) {
      if (document.body.classList.contains('show-article')) {
        goBack();
      }
    } else {
      // Desktop: restore whichever article the URL points to
      const id = e.state?.article || location.hash.slice(1);
      if (id) {
        activateArticle(id, false);
        main.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Mobile swipe detection
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
