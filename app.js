const state = { items: [], category: 'Alle', query: '' };

const palette = [
  ['#80958c', '#465f54', '#c1ae83'],
  ['#b78b62', '#6b4937', '#95a78a'],
  ['#8b9dab', '#536f79', '#c1b695'],
  ['#9b7563', '#4d5f68', '#d2c2a8'],
  ['#7b8063', '#b98550', '#5d6f72'],
  ['#6c7e70', '#a68e63', '#d7c9aa'],
  ['#8a6558', '#575a65', '#caa86c'],
  ['#6e7f88', '#3e5968', '#9b7b5d']
];

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function measure(item) {
  if (item.workSize && item.frameSize) return `${item.workSize} cm · Rahmen ${item.frameSize} cm`;
  if (item.workSize) return `${item.workSize} cm`;
  if (item.frameSize) return `Rahmen ${item.frameSize} cm`;
  return 'Maß noch offen';
}

function colors(index) {
  const p = palette[index % palette.length];
  return `--c1:${p[0]};--c2:${p[1]};--c3:${p[2]}`;
}

function renderFilters() {
  const categories = ['Alle', ...new Set(state.items.map(item => item.category))];
  $('#filters').innerHTML = categories.map(category =>
    `<button class="filter-chip${category === state.category ? ' active' : ''}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`
  ).join('');

  $('#filters').querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category;
      renderFilters();
      renderCatalog();
    });
  });
}

function filteredItems() {
  const q = state.query.trim().toLowerCase();
  return state.items.filter(item => {
    const categoryMatch = state.category === 'Alle' || item.category === state.category;
    const text = [item.title, item.category, item.medium, item.notes, item.signature, item.provenance, item.workSize, item.frameSize].join(' ').toLowerCase();
    return categoryMatch && (!q || text.includes(q));
  });
}

function renderCatalog() {
  const items = filteredItems();
  $('#empty').hidden = items.length !== 0;
  $('#catalog').innerHTML = items.map((item) => {
    const originalIndex = state.items.findIndex(entry => entry.id === item.id);
    return `
      <article class="catalog-card" tabindex="0" role="button" aria-label="Details zu ${escapeHtml(item.title)}" data-id="${escapeHtml(item.id)}">
        <div class="card-art" style="${colors(originalIndex)}" aria-hidden="true"></div>
        <div class="card-body">
          <div class="card-meta"><span>${escapeHtml(item.category)}</span><span>${escapeHtml(item.id)}</span></div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(measure(item))}</p>
        </div>
      </article>`;
  }).join('');

  $('#catalog').querySelectorAll('.catalog-card').forEach(card => {
    const open = () => showDetail(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
}

function showDetail(id) {
  const item = state.items.find(entry => entry.id === id);
  if (!item) return;
  const index = state.items.findIndex(entry => entry.id === id);
  const fields = [
    ['Werkmaß', item.workSize ? `${item.workSize} cm` : '–'],
    ['Rahmenmaß', item.frameSize ? `${item.frameSize} cm` : '–'],
    ['Technik / Träger', item.medium || 'noch zu prüfen'],
    ['Signatur / Beschriftung', item.signature || 'kein eindeutiger Hinweis erfasst'],
    ['Provenienz / Rückseite', item.provenance || 'keine Angabe'],
    ['Status', item.status || 'in Bearbeitung']
  ];

  $('#detail-content').innerHTML = `
    <div class="detail-art" style="${colors(index)}" aria-hidden="true"></div>
    <div class="detail-copy">
      <p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(item.id)}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p class="summary">${escapeHtml(item.notes || 'Der Eintrag wird im Zuge der laufenden Katalogisierung weiter ergänzt.')}</p>
      <dl class="detail-list">
        ${fields.map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
      </dl>
    </div>`;
  $('#detail-dialog').showModal();
}

async function init() {
  try {
    const response = await fetch('catalog/catalog.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Katalogdaten konnten nicht geladen werden.');
    state.items = await response.json();
  } catch (error) {
    console.error(error);
    state.items = [];
  }

  $('#stat-total').textContent = state.items.length;
  $('#stat-framed').textContent = state.items.filter(item => item.frameSize).length;
  $('#stat-categories').textContent = new Set(state.items.map(item => item.category)).size;
  $('#year').textContent = new Date().getFullYear();

  renderFilters();
  renderCatalog();

  $('#search').addEventListener('input', event => {
    state.query = event.target.value;
    renderCatalog();
  });

  $('.dialog-close').addEventListener('click', () => $('#detail-dialog').close());
  $('#detail-dialog').addEventListener('click', event => {
    if (event.target === $('#detail-dialog')) $('#detail-dialog').close();
  });
}

document.addEventListener('DOMContentLoaded', init);
