(function () {
  const STORAGE_KEY = 'jakereardon-project-status';
  const STATUS_LABELS = {
    live: 'Live',
    revisit: 'Revisit',
    todo: 'To-do'
  };

  const listEl = document.getElementById('projectList');
  const summaryEl = document.getElementById('projectsSummary');
  const filterButtons = document.querySelectorAll('.filter');

  let activeFilter = 'all';
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS)
    ? window.PORTFOLIO_PROJECTS.map((p) => ({ ...p }))
    : [];

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveOverrides(overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }

  function applyOverrides() {
    const overrides = loadOverrides();
    projects.forEach((project) => {
      if (overrides[project.id]) {
        project.status = overrides[project.id];
      }
    });
  }

  function setStatus(id, status) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    project.status = status;
    const overrides = loadOverrides();
    overrides[id] = status;
    saveOverrides(overrides);
    render();
  }

  function counts() {
    return projects.reduce(
      (acc, p) => {
        acc.total += 1;
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      { total: 0, live: 0, revisit: 0, todo: 0 }
    );
  }

  function updateSummary() {
    const c = counts();
    const bits = [`${c.total} project${c.total === 1 ? '' : 's'}`];
    if (c.revisit) bits.push(`${c.revisit} to revisit`);
    if (c.todo) bits.push(`${c.todo} to-do`);
    if (!c.revisit && !c.todo && c.live) bits.push('all live');
    summaryEl.textContent = bits.join(' · ');
  }

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

  function projectRow(project, index) {
    const hidden = activeFilter !== 'all' && project.status !== activeFilter;
    const statuses = ['live', 'revisit', 'todo'];
    const statusButtons = statuses
      .map((status) => {
        const active = project.status === status ? ' is-active' : '';
        return `<button type="button" class="status__btn${active}" data-status="${status}" data-id="${project.id}" aria-pressed="${project.status === status}">${STATUS_LABELS[status]}</button>`;
      })
      .join('');

    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');

    const num = String(index + 1).padStart(2, '0');
    const host = hostFromUrl(project.url);

    return `
      <li class="project${hidden ? ' is-hidden' : ''}" style="animation-delay: ${0.1 + index * 0.08}s" data-status="${project.status}">
        <span class="project__index" aria-hidden="true">${num}</span>
        <div class="project__body">
          <h3 class="project__title">${escapeHtml(project.title)}</h3>
          <a class="project__host" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(host)}</a>
          <p class="project__blurb">${escapeHtml(project.blurb)}</p>
          <div class="project__meta">${tags}</div>
        </div>
        <div class="project__aside">
          <div class="status" role="group" aria-label="Status for ${escapeHtml(project.title)}">
            ${statusButtons}
          </div>
          <a class="project__link" href="${escapeAttr(project.url)}" target="_blank" rel="noopener noreferrer">
            Open site ${externalIcon()}
          </a>
        </div>
      </li>
    `;
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

  function render() {
    updateSummary();

    const visible = projects.filter(
      (p) => activeFilter === 'all' || p.status === activeFilter
    );

    if (!projects.length) {
      listEl.innerHTML = '<li><p class="project-list__empty">No projects yet — add some in projects.js.</p></li>';
      return;
    }

    if (!visible.length) {
      listEl.innerHTML = `<li><p class="project-list__empty">Nothing marked “${STATUS_LABELS[activeFilter] || activeFilter}” yet.</p></li>`;
      return;
    }

    listEl.innerHTML = projects.map((p, i) => projectRow(p, i)).join('');
  }

  listEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.status__btn');
    if (!btn) return;
    setStatus(btn.dataset.id, btn.dataset.status);
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  applyOverrides();
  render();
})();
