async function loadAppointments() {
  const tbody = document.getElementById('appointmentsTableBody');
  tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-on-surface-variant">Loading appointments...</td></tr>`;

  try {
    const res = await fetch(`https://sheikhashir.app.n8n.cloud/webhook/fetch-appointments?salon_id=${SALON_ID}`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const appointments = await res.json();

    if (!appointments.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-on-surface-variant">No appointments today.</td></tr>`;
      return;
    }

    tbody.innerHTML = appointments.map(app => `
      <tr class="hover:bg-surface-container-lowest transition-colors group">
        <td class="px-6 py-4 font-body-md text-body-md font-semibold">${app.time}</td>
        <td class="px-6 py-4 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center font-label-md text-on-tertiary-container">
            ${app.customerInitials}
          </div>
          <span class="font-body-md text-body-md font-medium">${app.customerName}</span>
        </td>
        <td class="px-6 py-4 font-body-md text-body-md">${app.stylist}</td>
        <td class="px-6 py-4 font-body-md text-body-md">${app.service}</td>
        <td class="px-6 py-4">
          <span class="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-full font-label-sm text-label-sm">
            ${app.status}
          </span>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-red-500">Couldn't load appointments: ${err.message}</td></tr>`;
  }
}

loadAppointments();