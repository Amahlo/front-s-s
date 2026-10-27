
let dailyTotal = 1450000;
let audioEnabled = true;
let highContrast = false;

let salesHistory = [
    { id: 1, name: 'Perfume Coco Chanel', price: 180000, cat: 'Loción AAA' },
    { id: 2, name: 'Pijama Térmica S&S', price: 110000, cat: 'Ropa/Pijama' },
    { id: 3, name: 'Perfume Sauvage Dior', price: 195000, cat: 'Loción AAA' },
    { id: 4, name: 'Aporte Natillera', price: 100000, cat: 'Natillera' },
    { id: 5, name: 'Combo Mercancía S&S', price: 865000, cat: 'Ropa/Pijama' }
];

function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO');
}

function render() {
    const display = document.getElementById('daily-total-display');
    display.innerHTML = `${formatCOP(dailyTotal)} <span class="fs-4 text-light">COP</span>`;

    const container = document.getElementById('transactions-container');
    container.innerHTML = '';

    salesHistory.slice().reverse().forEach(s => {
        const el = document.createElement('article');
        el.className = 'p-3 bg-earth-950 border border-secondary rounded-3 d-flex align-items-center justify-content-between fw-bold';
        el.innerHTML = `
            <div>
                <div class="text-white fs-6">${s.name}</div>
                <div class="small text-warning fw-bold uppercase">${s.cat}</div>
            </div>
            <div class="text-warning fs-5">+${formatCOP(s.price)}</div>
        `;
        container.appendChild(el);
    });
}

function addQuickSale(name, price, cat) {
    dailyTotal += price;
    salesHistory.push({ id: Date.now(), name: name, price: price, cat: cat });
    render();
    speakPrompt(`Se sumó ${name} por ${formatCOP(price)}. El nuevo total es ${formatCOP(dailyTotal)} pesos.`);
}

function handleManualSale(e) {
    e.preventDefault();
    const nameEl = document.getElementById('manual-name');
    const priceEl = document.getElementById('manual-price');
    const name = nameEl.value.trim();
    const price = parseInt(priceEl.value);

    if (name && !isNaN(price) && price > 0) {
        addQuickSale(name, price, 'Venta Manual');
        nameEl.value = '';
        priceEl.value = '';
    }
}

function resetDailyTotal() {
    dailyTotal = 0;
    salesHistory = [];
    render();
    speakPrompt("Las ventas del día han sido reiniciadas a cero pesos.");
}

function switchTab(tab) {
    const mVentas = document.getElementById('module-ventas');
    const mNatillera = document.getElementById('module-natillera');
    const btnVentas = document.getElementById('tab-btn-ventas');
    const btnNatillera = document.getElementById('tab-btn-natillera');

    if (tab === 'ventas') {
        mVentas.classList.remove('d-none');
        mNatillera.classList.add('d-none');
        btnVentas.className = "btn btn-danger w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2";
        btnNatillera.className = "btn btn-earth-200 bg-earth-200 text-earth-950 w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2 border border-secondary";
        speakPrompt("Pantalla de Registro de Ventas seleccionada.");
    } else {
        mVentas.classList.add('d-none');
        mNatillera.classList.remove('d-none');
        btnNatillera.className = "btn btn-danger w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2";
        btnVentas.className = "btn btn-earth-200 bg-earth-200 text-earth-950 w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2 border border-secondary";
        speakPrompt("Pantalla de Natillera y Ahorros seleccionada.");
    }
}

function speakPrompt(text) {
    document.getElementById('spoken-text').textContent = `"${text}"`;
    if (audioEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CO';
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
    }
}

function setFontScale(scale) {
    speakPrompt(`Tamaño de letra cambiado a nivel ${scale}.`);
}

function toggleHighContrast() {
    highContrast = !highContrast;
    speakPrompt(highContrast ? "Modo de Alto Contraste Activado." : "Modo de Alto Contraste Desactivado.");
}

function toggleAudioAssist() {
    audioEnabled = !audioEnabled;
    const btnText = document.getElementById('audio-btn-text');
    const icon = document.getElementById('audio-icon');

    if (audioEnabled) {
        btnText.textContent = "Voz Guiada: SI";
        icon.className = "fa-solid fa-volume-high";
        speakPrompt("Asistencia de voz activada.");
    } else {
        btnText.textContent = "Voz Guiada: NO";
        icon.className = "fa-solid fa-volume-xmark";
        document.getElementById('spoken-text').textContent = "Asistencia de voz silenciada.";
    }
}

window.onload = function() {
    render();
};

// ============ HU-06: REGISTRAR PRÉSTAMO ============
let natilleraFund = 14850000;   // mismo valor que muestra el HTML
let activeLoans = 4200000;
let pendingLoan = null;

function renderNatillera() {
    const outs = document.querySelectorAll('#module-natillera output');
    if (outs.length < 2) return;
    outs[0].textContent = `${formatCOP(natilleraFund)} COP`; // Fondo total
    outs[1].textContent = `${formatCOP(activeLoans)} COP`;   // Préstamos activos
}

function requestLoan(member, inputEl) {
    const amount = parseInt(inputEl.value, 10);

    if (isNaN(amount) || amount <= 0) {
        speakPrompt('Escriba primero cuánto dinero va a prestar.');
        inputEl.focus();
        return;
    }
    if (amount > natilleraFund) {
        speakPrompt(`El fondo solo tiene ${formatCOP(natilleraFund)} pesos. No alcanza para ese préstamo.`);
        inputEl.focus();
        return;
    }

    pendingLoan = { member, amount, inputEl };
    document.getElementById('loan-confirm-member').textContent = member;
    document.getElementById('loan-confirm-amount').textContent = formatCOP(amount);
    document.getElementById('loan-confirm-overlay').showModal(); // el foco cae en "NO" por autofocus
    speakPrompt(`¿Seguro que presta ${formatCOP(amount)} pesos a ${member}?`);
}

function confirmLoan() {
    if (!pendingLoan) return;
    const { member, amount, inputEl } = pendingLoan;

    natilleraFund -= amount;   // sale dinero del fondo
    activeLoans += amount;     // y queda como préstamo activo
    renderNatillera();

    inputEl.value = '';
    document.getElementById('loan-confirm-overlay').close();
    speakPrompt(`Préstamo de ${formatCOP(amount)} pesos registrado a ${member}. El fondo queda en ${formatCOP(natilleraFund)} pesos.`);
}

function cancelLoan() {
    speakPrompt('Préstamo cancelado. No se movió dinero.');
    document.getElementById('loan-confirm-overlay').close();
}

// Inyecta formulario (monto + botón PRESTAR) junto a cada botón de aporte
function initLoanButtons() {
    const aportes = document.querySelectorAll('#module-natillera button[onclick*="addQuickSale"]');

    aportes.forEach(btnAporte => {
        const member = btnAporte.closest('section').querySelector('h4').textContent.trim();

        const form = document.createElement('form');
        form.className = 'd-flex align-items-center gap-2';
        form.noValidate = true; // las validaciones las damos nosotros, con voz
        form.innerHTML = `
            <input type="number" min="1" class="form-control form-control-sm fw-bold border-2"
                   style="max-width: 150px;" placeholder="Monto COP"
                   aria-label="Monto a prestar a ${member}">
            <button type="submit" class="btn btn-prestar btn-lg shadow">
                <i class="fa-solid fa-hand-holding-dollar me-1" aria-hidden="true"></i> PRESTAR
            </button>
        `;

        form.addEventListener('submit', e => {
            e.preventDefault();
            requestLoan(member, form.querySelector('input'));
        });
        btnAporte.insertAdjacentElement('afterend', form);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoanButtons();
    renderNatillera();

    const dialog = document.getElementById('loan-confirm-overlay');
    // 'cancel' se dispara cuando el usuario presiona Escape
    dialog.addEventListener('cancel', () => speakPrompt('Préstamo cancelado. No se movió dinero.'));
    // 'close' se dispara siempre que se cierra, por cualquier vía
    dialog.addEventListener('close', () => { pendingLoan = null; });
});