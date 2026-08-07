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

  function projectCard(project, index) {
    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');

    const num = String(index + 1).padStart(2, '0');
    const host = hostFromUrl(project.url);
    const year = project.year
      ? `<span class="project__year">${escapeHtml(String(project.year))}</span>`
      : '';

    return `
      <li class="project" style="animation-delay: ${0.06 + index * 0.05}s">
        <div class="project__top">
          <span class="project__index" aria-hidden="true">${num}</span>
          ${year}
        </div>
        <h3 class="project__title">${escapeHtml(project.title)}</h3>
        <a class="project__host" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(host)}</a>
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

    summaryEl.textContent = `${sitesCount} site${sitesCount === 1 ? '' : 's'} · ${gamesCount} game${gamesCount === 1 ? '' : 's'}`;

    listEl.setAttribute('aria-labelledby', activeTab === 'games' ? 'tab-games' : 'tab-sites');

    if (!items.length) {
      listEl.innerHTML = `<li class="project-grid__empty"><p>Nothing in this tab yet — add entries in projects.js.</p></li>`;
      return;
    }

    listEl.innerHTML = items.map((p, i) => projectCard(p, i)).join('');
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
