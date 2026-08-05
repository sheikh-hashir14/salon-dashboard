function initCreateNewDropdown() {
  const button = document.getElementById('createNewBtn');
  const menu = document.getElementById('createNewMenu');
  if (!button || !menu) return;

  button.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', function () {
    menu.classList.add('hidden');
  });

  menu.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  menu.querySelectorAll('a[data-action]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.add('hidden');
      openModal(link.dataset.action);
    });
  });
}

const SALON_ID = "9e4ce3c6-9d47-4e2a-b6aa-9f156fceccc4";

const ACTIONS = {
  "create-customer": {
    title: "Create Customer",
    webhook: "https://sheikhashir.app.n8n.cloud/webhook/create-new-customer-web",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email (Optional)", type: "text", required: false },
      { name: "loyalty_tier", label: "Loyalty Tier (none/silver/gold/platinum)", type: "text", required: true },
      { name: "preferred_stylist", label: "Preferred Stylist (optional)", type: "text", required: false }
    ]
  },
  "create-service": {
    title: "Create Service",
    webhook: "https://sheikhashir.app.n8n.cloud/webhook/create-new-service-web",
    fields: [
      { name: "name", label: "Service Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "duration_minutes", label: "Duration (minutes)", type: "number", required: true },
      { name: "price", label: "Price (PKR)", type: "number", required: true }
    ]
  },
  "create-stylist": {
    title: "Create Stylist",
    webhook: "https://sheikhashir.app.n8n.cloud/webhook/create-new-stylist-web",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text", required: false },
      { name: "photo_url", label: "Photo URL", type: "text" }
    ]
  },
  "create-appointment": {
    title: "Create Appointment",
    webhook: "https://sheikhashir.app.n8n.cloud/webhook/create-new-appointment",
    fields: [
      { name: "phone", label: "Customer Phone", type: "text", required: true },
      { name: "name", label: "Customer Name (if new)", type: "text" },
      { name: "service_name", label: "Service Name", type: "text", required: true },
      { name: "stylist_name", label: "Preferred Stylist (optional)", type: "text" },
      { name: "start_time", label: "Date & Time", type: "datetime-local", required: true }
    ]
  },
  "create-payment": {
    title: "Record Payment",
    webhook: "https://sheikhashir.app.n8n.cloud/webhook/create_new_payment",
    fields: [
      { name: "appointment_id", label: "Appointment ID", type: "text", required: true },
      { name: "amount", label: "Amount (PKR)", type: "number", required: true },
      { name: "payment_method", label: "Method (cash/card/jazzcash/easypaisa)", type: "text", required: true },
      { name: "status", label: "Status (confirmed_digital/confirmed_onsite)", type: "text", required: true }
    ]
  }
};

const overlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const modalError = document.getElementById('modalError');
let currentAction = null;

function openModal(actionKey) {
  const config = ACTIONS[actionKey];
  if (!config) return;
  currentAction = actionKey;
  modalTitle.textContent = config.title;
  modalError.classList.add('hidden');
  modalForm.innerHTML = config.fields.map(f => `
    <div>
      <label class="block text-xs text-on-surface-variant mb-1">${f.label}</label>
      <input name="${f.name}" type="${f.type}" ${f.required ? 'required' : ''}
        class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-transparent text-sm" />
    </div>
  `).join('');
  overlay.classList.remove('hidden');
}

function closeModal() {
  overlay.classList.add('hidden');
  modalForm.reset();
  currentAction = null;
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalCancel')?.addEventListener('click', closeModal);
overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

modalForm?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const config = ACTIONS[currentAction];
  const formData = new FormData(modalForm);
  const payload = { salon_id: SALON_ID };
  formData.forEach((value, key) => payload[key] = value);

  const submitBtn = document.getElementById('modalSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const res = await fetch(config.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    closeModal();
    alert(config.title + " saved successfully.");
  } catch (err) {
    modalError.textContent = "Something went wrong: " + err.message;
    modalError.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save";
  }
});