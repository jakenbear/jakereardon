(function () {
  const listEl = document.getElementById('projectList');
  const summaryEl = document.getElementById('projectsSummary');
  const tabs = document.querySelectorAll('.tab');

  let activeTab = 'sites';
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS)
    ? window.PORTFOLIO_PROJECTS.map((p) => ({ ...p }))
    : [];

  function hostFromUrl(url) {
    try {
      return new URL(url).host.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  function linkLabel(project) {
    if (project.category === 'games') return 'View on Steam';
    if (project.category === 'acting' || project.youtubeId) return 'Watch on YouTube';
    return 'Open site';
  }

  function storeLinks(project) {
    const stores = Array.isArray(project.stores) && project.stores.length
      ? project.stores
      : [{ label: linkLabel(project), url: project.url }];

    return `
      <div class="project__actions">
        ${stores
          .map(
            (store, i) => `
          <a class="project__link${i === 0 ? '' : ' project__link--ghost'}" href="${escapeAttr(store.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(store.label)} ${externalIcon()}
          </a>
        `
          )
          .join('')}
      </div>
    `;
  }

  function youtubeIframe(project, autoplay) {
    const params = autoplay ? '?autoplay=1' : '';
    const src = `https://www.youtube.com/embed/${encodeURIComponent(project.youtubeId)}${params}`;
    return `
      <iframe
        src="${src}"
        title="${escapeAttr(project.title)}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    `;
  }

  function youtubeThumb(project) {
    if (project.thumbnail) {
      return { src: project.thumbnail, fallback: '' };
    }
    const id = encodeURIComponent(project.youtubeId);
    return {
      src: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      fallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    };
  }

  function videoEmbed(project) {
    if (!project.youtubeId) return '';
    const thumb = youtubeThumb(project);
    const fallbackAttr = thumb.fallback
      ? ` data-fallback="${escapeAttr(thumb.fallback)}"`
      : '';
    return `
      <div class="project__video">
        <button type="button" class="project__poster" data-youtube-id="${escapeAttr(project.youtubeId)}" data-title="${escapeAttr(project.title)}" aria-label="Play ${escapeAttr(project.title)}">
          <img alt="" data-thumb="${escapeAttr(thumb.src)}"${fallbackAttr} />
          <span class="project__play" aria-hidden="true"></span>
        </button>
      </div>
    `;
  }

  function bindVideoPosters() {
    listEl.querySelectorAll('.project__poster').forEach((btn) => {
      const img = btn.querySelector('img');
      if (img && img.dataset.thumb) {
        const useFallback = () => {
          if (img.dataset.fallback && img.currentSrc !== img.dataset.fallback) {
            img.src = img.dataset.fallback;
          }
        };
        img.addEventListener("error", useFallback, { once: true });
        img.addEventListener(
          "load",
          () => {
            if (img.naturalWidth < 200) useFallback();
          },
          { once: true }
        );
        img.src = img.dataset.thumb;
      }
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.project__video');
        if (!wrap) return;
        wrap.innerHTML = youtubeIframe(
          { youtubeId: btn.dataset.youtubeId, title: btn.dataset.title || 'YouTube video' },
          true
        );
      });
    });
  }

  function externalIcon() {
    return `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 3h7v7h-1.5V5.56L4.53 12.53 3.47 11.47 10.44 4.5H6V3z"/></svg>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function filtered() {
    return projects.filter((p) => (p.category || 'sites') === activeTab);
  }

  function tabId(name) {
    return `tab-${name}`;
  }

  function projectCard(project, index) {
    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');

    const num = String(index + 1).padStart(2, '0');
    const host = hostFromUrl(project.url);
    const year = project.year
      ? `<span class="project__year">${escapeHtml(String(project.year))}</span>`
      : '';
    const isVideo = Boolean(project.youtubeId);

    return `
      <li class="project${isVideo ? ' project--video' : ''}" style="animation-delay: ${0.06 + index * 0.05}s">
        <div class="project__top">
          <span class="project__index" aria-hidden="true">${num}</span>
          ${year}
        </div>
        <h3 class="project__title">${escapeHtml(project.title)}</h3>
        <a class="project__host" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(host)}</a>
        ${videoEmbed(project)}
        <p class="project__blurb">${escapeHtml(project.blurb)}</p>
        <div class="project__meta">${tags}</div>
        ${storeLinks(project)}
      </li>
    `;
  }

  function render() {
    const items = filtered();
    const sitesCount = projects.filter((p) => (p.category || 'sites') === 'sites').length;
    const gamesCount = projects.filter((p) => p.category === 'games').length;
    const actingCount = projects.filter((p) => p.category === 'acting').length;

    summaryEl.textContent = `${sitesCount} site${sitesCount === 1 ? '' : 's'} · ${gamesCount} game${gamesCount === 1 ? '' : 's'} · ${actingCount} acting`;

    listEl.setAttribute('aria-labelledby', tabId(activeTab));

    if (!items.length) {
      listEl.innerHTML = `<li class="project-grid__empty"><p>Nothing in this tab yet — add entries in projects.js.</p></li>`;
      return;
    }

    listEl.innerHTML = items.map((p, i) => projectCard(p, i)).join('');
    bindVideoPosters();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      render();
    });
  });

  render();
})();
