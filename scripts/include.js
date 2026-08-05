// scripts/include.js
async function loadPartial(id, path) {
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

async function initLayout() {
  await Promise.all([
    loadPartial('sidebar-placeholder', 'partials/sidebar.html'),
    loadPartial('header-placeholder', 'partials/header.html')
  ]);

  // Set the header title from this page's own declared value
  const titleEl = document.getElementById('pageTitle');
  if (titleEl) {
    titleEl.textContent = window.PAGE_TITLE || 'Luxe Salon';
  }

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sidebar-placeholder a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('bg-primary-container/10', 'text-primary', 'font-semibold', 'border-l-4', 'border-primary');
    }
  });

  initCreateNewDropdown();
}

document.addEventListener('DOMContentLoaded', initLayout);