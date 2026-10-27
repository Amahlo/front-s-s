let dailyTotal = 1450000;
let audioEnabled = true;
let highContrast = false;

let salesHistory = [
    { id: 1, name: 'Perfume Coco Chanel', price: 180000, cat: 'Loción AAA', tipo: 'entrada' },
    { id: 2, name: 'Pijama Térmica S&S', price: 110000, cat: 'Ropa/Pijama', tipo: 'entrada' },
    { id: 3, name: 'Perfume Sauvage Dior', price: 195000, cat: 'Loción AAA', tipo: 'entrada' },
    { id: 4, name: 'Aporte Natillera', price: 100000, cat: 'Natillera', tipo: 'entrada' },
    { id: 5, name: 'Combo Mercancía S&S', price: 865000, cat: 'Ropa/Pijama', tipo: 'entrada' },
    // Ejemplo de salida para ver el color rojo (no afecta el total de ventas)
    { id: 6, name: 'Pago de transporte', price: 35000, cat: 'Gasto', tipo: 'salida' }
];

function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO');
}

function render() {
    const display = document.getElementById('daily-total-display');
    display.innerHTML = `${formatCOP(dailyTotal)} <span class="fs-4 text-light">COP</span>`;

    const container = document.getElementById('transactions-container');
    container.innerHTML = '';

    salesHistory.filter(s => s.tipo === 'entrada').reverse().forEach(s => {
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

    renderMovements();
}

// Lista estática de los últimos 5 movimientos (verde = entrada, rojo = salida)
function renderMovements() {
    const container = document.getElementById('movements-container');
    container.innerHTML = '';

    const ultimos = salesHistory.slice(-5).reverse();

    if (ultimos.length === 0) {
        container.innerHTML = '<li class="fs-3 fw-bold text-warning text-center py-4">Todavía no hay movimientos hoy.</li>';
        return;
    }

    ultimos.forEach(m => {
        const esEntrada = m.tipo === 'entrada';
        const el = document.createElement('li');
        el.className = `movement-item ${esEntrada ? 'movement-in' : 'movement-out'}`;
        el.innerHTML = `
            <i class="fa-solid ${esEntrada ? 'fa-circle-arrow-down' : 'fa-circle-arrow-up'} movement-icon" aria-hidden="true"></i>
            <div class="flex-grow-1">
                <div class="movement-type">${esEntrada ? 'ENTRADA' : 'SALIDA'}</div>
                <div class="movement-name"></div>
            </div>
            <div class="movement-amount">${esEntrada ? '+' : '−'}${formatCOP(m.price)}</div>
        `;
        el.querySelector('.movement-name').textContent = m.name;
        container.appendChild(el);
    });
}

function addQuickSale(name, price, cat) {
    dailyTotal += price;
    salesHistory.push({ id: Date.now(), name: name, price: price, cat: cat, tipo: 'entrada' });
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

const TAB_ACTIVE = "btn btn-danger w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2";
const TAB_INACTIVE = "btn btn-earth-200 bg-earth-200 text-earth-950 w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2 border border-secondary";

const TABS = {
    ventas: { module: 'module-ventas', btn: 'tab-btn-ventas', prompt: 'Pantalla de Registro de Ventas seleccionada.' },
    natillera: { module: 'module-natillera', btn: 'tab-btn-natillera', prompt: 'Pantalla de Natillera y Ahorros seleccionada.' },
    movimientos: { module: 'module-movimientos', btn: 'tab-btn-movimientos', prompt: 'Pantalla de Últimos Movimientos. Verde es entrada, rojo es salida. Para salir, presione Volver al Inicio.' }
};

function switchTab(tab) {
    Object.entries(TABS).forEach(([key, t]) => {
        const activa = key === tab;
        document.getElementById(t.module).classList.toggle('d-none', !activa);
        document.getElementById(t.btn).className = activa ? TAB_ACTIVE : TAB_INACTIVE;
    });

    // En la vista de movimientos se ocultan los demás controles: solo queda "VOLVER AL INICIO"
    const enMovimientos = tab === 'movimientos';
    document.querySelectorAll('.hide-in-movements').forEach(el => el.classList.toggle('d-none', enMovimientos));

    speakPrompt(TABS[tab].prompt);
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