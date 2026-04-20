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

  // "← Writing" button
  backBtn.addEventListener('click', () => history.back());

  // Browser back button / Android back button → popstate
  window.addEventListener('popstate', () => {
    if (document.body.classList.contains('show-article')) {
      goBack();
    }
  });

  // Custom swipe detection (after overscroll-behavior-x:none blocks Chrome's gesture)
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
    if (dx > 60 && dy < 80) history.back(); // triggers popstate → goBack()
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initArticles);
