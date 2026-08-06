async function loadStylists() {
  const grid = document.getElementById('stylistsGrid');
  const addCardButton = grid.querySelector('button'); // preserve the "Add New Stylist" ghost card
  if (!grid) return;

  const statusBadge = {
    AVAILABLE: 'bg-green-50 text-green-700 border-green-100',
    BUSY: 'bg-orange-50 text-orange-700 border-orange-100',
    'OFF-DUTY': 'bg-surface-container text-on-surface-variant border-outline-variant'
  };
  const statusDot = {
    AVAILABLE: 'bg-green-500',
    BUSY: 'bg-orange-500',
    'OFF-DUTY': 'bg-gray-400'
  };

  try {
    const res = await fetch(`https://sheikhashir.app.n8n.cloud/webhook/fetch-stylists?salon_id=${SALON_ID}`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const stylists = await res.json();

    const cardsHtml = stylists.map(s => {
      const footerText = s.status === 'BUSY'
        ? 'In session'
        : s.appointments_today > 0
          ? `${s.appointments_today} Appts Today`
          : (s.next_appointment_time
              ? `Starts at ${new Date(s.next_appointment_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
              : 'No appointments today');

      return `
        <div class="group bg-surface-container-lowest border border-outline-variant hover:border-primary-container transition-all duration-300 relative overflow-hidden rounded-lg">
          <div class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div class="relative">
                <div class="w-20 h-20 rounded-full bg-surface-container overflow-hidden border-2 border-surface-container-highest group-hover:border-primary-container/30 transition-all">
                  <img class="w-full h-full object-cover" src="${s.photo_url || 'https://via.placeholder.com/80'}" />
                </div>
                <div class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${statusDot[s.status] || 'bg-gray-400'}"></div>
              </div>
              <span class="px-3 py-1 ${statusBadge[s.status] || 'bg-surface-container text-on-surface-variant'} text-label-sm font-label-sm rounded-full border uppercase tracking-wider">${s.status}</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-headline-md text-headline-md text-on-surface">${s.name}</h3>
            </div>
            <div class="mt-6 pt-6 border-t border-outline-variant flex justify-end items-center">
              <span class="text-label-md text-on-surface-variant">${footerText}</span>
            </div>
          </div>
          <div class="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/5 transition-colors pointer-events-none"></div>
        </div>
      `;
    }).join('');

    grid.innerHTML = cardsHtml + addCardButton.outerHTML;
  } catch (err) {
    grid.innerHTML = `<p class="text-red-500 col-span-full">Couldn't load stylists: ${err.message}</p>` + addCardButton.outerHTML;
  }
}

loadStylists();