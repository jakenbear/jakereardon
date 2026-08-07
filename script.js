(function () {
  const listEl = document.getElementById('projectList');
  const summaryEl = document.getElementById('projectsSummary');
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

  function projectRow(project, index) {
    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');

    const num = String(index + 1).padStart(2, '0');
    const host = hostFromUrl(project.url);

    return `
      <li class="project" style="animation-delay: ${0.1 + index * 0.08}s">
        <span class="project__index" aria-hidden="true">${num}</span>
        <div class="project__body">
          <h3 class="project__title">${escapeHtml(project.title)}</h3>
          <a class="project__host" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(host)}</a>
          <p class="project__blurb">${escapeHtml(project.blurb)}</p>
          <div class="project__meta">${tags}</div>
        </div>
        <div class="project__aside">
          <a class="project__link" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">
            Open site ${externalIcon()}
          </a>
        </div>
      </li>
    `;
  }

  function render() {
    const n = projects.length;
    summaryEl.textContent = n
      ? `${n} project${n === 1 ? '' : 's'}`
      : 'Add projects in projects.js';

    if (!n) {
      listEl.innerHTML = '<li><p class="project-list__empty">No projects yet — add some in projects.js.</p></li>';
      return;
    }

    listEl.innerHTML = projects.map((p, i) => projectRow(p, i)).join('');
  }

  render();
})();
