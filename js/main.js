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

      // Push a history entry (enables browser back), but keep URL unchanged
      history.pushState({ article: id }, '', location.pathname);

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

  backBtn.addEventListener('click', goBack);

  // Browser native back button / Android back button
  window.addEventListener('popstate', e => {
    if (isMobile()) {
      if (document.body.classList.contains('show-article')) {
        goBack();
      }
    } else {
      const id = e.state?.article;
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

// ===== Music Player =====
function initMusicPlayer() {
  const tracks = [
    { file: 'music/坂本龙一-energy flow.ogg',                                              display: '坂本龙一 — Energy Flow' },
    { file: 'music/坂本龙一,Jaques Morelenbaum,Judy Kang-Merry Christmas Mr. Lawrence.ogg', display: 'Sakamoto — Merry Christmas Mr. Lawrence' },
    { file: 'music/风云-孤星独吟 (萧版).ogg',                                               display: '风云 — 孤星独吟' },
    { file: 'music/日向敏文-End Title (Inst.).ogg',                                         display: '日向敏文 — End Title' },
    { file: 'music/James Horner-A Gift of a Thistle.ogg',                                  display: 'James Horner — A Gift of a Thistle' },
  ];

  const MODES    = ['sequential', 'shuffle', 'single'];
  const MODE_ICON  = { sequential: '↻', shuffle: '⇄', single: '⟳' };
  const MODE_TITLE = { sequential: 'Loop All', shuffle: 'Shuffle', single: 'Repeat One' };

  let currentIndex = 0;
  let mode = 'sequential';
  let isPlaying = false;
  let shuffleOrder = [];

  const audio = new Audio();
  audio.preload = 'metadata';

  const trackNameEl    = document.getElementById('playerTrackName');
  const playBtn        = document.getElementById('playerPlay');
  const prevBtn        = document.getElementById('playerPrev');
  const nextBtn        = document.getElementById('playerNext');
  const modeBtn        = document.getElementById('playerMode');
  const progressFill   = document.getElementById('playerProgressFill');
  const progressBar    = document.getElementById('playerProgressBar');
  const currentTimeEl  = document.getElementById('playerCurrentTime');
  const durationEl     = document.getElementById('playerDuration');
  const playlistEl     = document.getElementById('playerPlaylist');

  function fmt(t) {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function buildShuffle() {
    const others = [...Array(tracks.length).keys()].filter(i => i !== currentIndex);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    shuffleOrder = [currentIndex, ...others];
  }

  function updatePlaylistActive() {
    playlistEl.querySelectorAll('li').forEach((li, i) => {
      li.classList.toggle('active', i === currentIndex);
    });
  }

  function loadTrack(idx, autoPlay) {
    currentIndex = idx;
    audio.src = tracks[idx].file;
    trackNameEl.textContent = tracks[idx].display;
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    updatePlaylistActive();
    if (autoPlay) audio.play().then(() => { isPlaying = true; playBtn.textContent = '⏸'; }).catch(() => {});
  }

  // Build playlist items
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t.display;
    li.addEventListener('click', () => loadTrack(i, true));
    playlistEl.appendChild(li);
  });

  // Mobile: toggle playlist on tap; desktop: hover handled by CSS
  const playlistWrap = document.getElementById('playerPlaylistWrap');
  const playlistBtn  = document.getElementById('playerPlaylistBtn');
  let playlistOpen = false;

  function isTouchDevice() { return window.matchMedia('(hover: none)').matches; }

  playlistBtn.addEventListener('click', e => {
    if (!isTouchDevice()) return;
    e.stopPropagation();
    playlistOpen = !playlistOpen;
    playlistEl.classList.toggle('touch-open', playlistOpen);
  });

  document.addEventListener('click', e => {
    if (isTouchDevice() && playlistOpen && !playlistWrap.contains(e.target)) {
      playlistOpen = false;
      playlistEl.classList.remove('touch-open');
    }
  });

  function nextIdx() {
    if (mode === 'single') return currentIndex;
    if (mode === 'shuffle') {
      const pos = shuffleOrder.indexOf(currentIndex);
      return shuffleOrder[(pos + 1) % shuffleOrder.length];
    }
    return (currentIndex + 1) % tracks.length;
  }

  function prevIdx() {
    if (mode === 'single') return currentIndex;
    if (mode === 'shuffle') {
      const pos = shuffleOrder.indexOf(currentIndex);
      return shuffleOrder[(pos - 1 + shuffleOrder.length) % shuffleOrder.length];
    }
    return (currentIndex - 1 + tracks.length) % tracks.length;
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause(); isPlaying = false; playBtn.textContent = '▶';
    } else {
      audio.play().then(() => { isPlaying = true; playBtn.textContent = '⏸'; }).catch(() => {});
    }
  });

  prevBtn.addEventListener('click', () => {
    if (audio.currentTime > 3) { audio.currentTime = 0; }
    else { loadTrack(prevIdx(), isPlaying); }
  });

  nextBtn.addEventListener('click', () => loadTrack(nextIdx(), isPlaying));

  modeBtn.addEventListener('click', () => {
    const idx = MODES.indexOf(mode);
    mode = MODES[(idx + 1) % MODES.length];
    modeBtn.textContent = MODE_ICON[mode];
    modeBtn.title = MODE_TITLE[mode];
    modeBtn.classList.toggle('shuffle', mode === 'shuffle');
    if (mode === 'shuffle') buildShuffle();
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      currentTimeEl.textContent = fmt(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => { durationEl.textContent = fmt(audio.duration); });
  audio.addEventListener('ended', () => loadTrack(nextIdx(), true));

  progressBar.addEventListener('click', e => {
    if (!audio.duration) return;
    const r = progressBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  loadTrack(1, true);
  buildShuffle();

  // On mobile, keep content-area margin in sync with fixed player bar height
  if (window.matchMedia('(max-width: 768px)').matches) {
    const contentArea = document.querySelector('.content-area');
    const bar = document.getElementById('playerBar');
    function syncMargin() { contentArea.style.marginTop = bar.offsetHeight + 'px'; }
    syncMargin();
    new ResizeObserver(syncMargin).observe(bar);
  }
}

document.addEventListener('DOMContentLoaded', initMusicPlayer);
