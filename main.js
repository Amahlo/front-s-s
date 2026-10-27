// State
let dailyTotal = 1450000;
let totalAbonos = 200000;
let totalPrestamos = 0;
let audioEnabled = true;
let highContrast = false;

let salesHistory = [
    { id: 1, name: 'Perfume Coco Chanel', price: 180000, cat: 'Loción AAA' },
    { id: 2, name: 'Pijama Térmica S&S', price: 110000, cat: 'Ropa/Pijama' },
    { id: 3, name: 'Perfume Sauvage Dior', price: 195000, cat: 'Loción AAA' },
    { id: 4, name: 'Aporte Natillera', price: 100000, cat: 'Natillera' },
    { id: 5, name: 'Combo Mercancía S&S', price: 865000, cat: 'Ropa/Pijama' }
];

// Helper: Format COP Currency
function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO');
}

// Render UI
function render() {
    // Top right daily sales display
    const display = document.getElementById('daily-total-display');
    if (display) {
        display.innerHTML = `${formatCOP(dailyTotal)} <span class="fs-5 text-light">COP</span>`;
    }

    // Transactions list
    const container = document.getElementById('transactions-container');
    if (container) {
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

    // HU-09: Update giant summary cards
    const gSales = document.getElementById('summary-sales-giant');
    const gAbonos = document.getElementById('summary-abonos-giant');
    const gLoans = document.getElementById('summary-loans-giant');
    const gCash = document.getElementById('summary-cash-giant');

    if (gSales) gSales.textContent = formatCOP(dailyTotal);
    if (gAbonos) gAbonos.textContent = formatCOP(totalAbonos);
    if (gLoans) gLoans.textContent = formatCOP(totalPrestamos);
    if (gCash) {
        const cashInHand = dailyTotal + totalAbonos - totalPrestamos;
        gCash.textContent = `${formatCOP(cashInHand)} COP`;
    }
}

// Add Quick Sale
function addQuickSale(name, price, cat) {
    dailyTotal += price;
    if (cat === 'Natillera') {
        totalAbonos += price;
    }
    salesHistory.push({ id: Date.now(), name: name, price: price, cat: cat });
    render();
    speakPrompt(`Se sumó ${name} por ${formatCOP(price)}. El nuevo total es ${formatCOP(dailyTotal)} pesos.`);
}

// Manual Entry Sale
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

// Reset Daily Total Manual
function resetDailyTotal() {
    dailyTotal = 0;
    salesHistory = [];
    render();
    speakPrompt("Las ventas del día han sido reiniciadas a cero pesos.");
}

// Switch Navigation Tabs (Ventas, Natillera, Resumen HU-09)
function switchTab(tab) {
    const mVentas = document.getElementById('module-ventas');
    const mNatillera = document.getElementById('module-natillera');
    const mResumen = document.getElementById('module-resumen');

    const btnVentas = document.getElementById('tab-btn-ventas');
    const btnNatillera = document.getElementById('tab-btn-natillera');
    const btnResumen = document.getElementById('tab-btn-resumen');

    // Hide all modules
    if (mVentas) mVentas.classList.add('d-none');
    if (mNatillera) mNatillera.classList.add('d-none');
    if (mResumen) mResumen.classList.add('d-none');

    // Reset button styles
    const defaultBtnClass = "btn btn-earth-200 bg-earth-200 text-earth-950 w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2 border border-secondary";
    const activeBtnClass = "btn btn-danger w-100 py-3 fw-black fs-5 rounded-4 shadow d-flex align-items-center justify-content-center gap-2";

    if (btnVentas) btnVentas.className = defaultBtnClass;
    if (btnNatillera) btnNatillera.className = defaultBtnClass;
    if (btnResumen) btnResumen.className = defaultBtnClass;

    if (tab === 'ventas') {
        if (mVentas) mVentas.classList.remove('d-none');
        if (btnVentas) btnVentas.className = activeBtnClass;
        speakPrompt("Pantalla de Registro de Ventas seleccionada.");
    } else if (tab === 'natillera') {
        if (mNatillera) mNatillera.classList.remove('d-none');
        if (btnNatillera) btnNatillera.className = activeBtnClass;
        speakPrompt("Pantalla de Natillera y Ahorros seleccionada.");
    } else if (tab === 'resumen') {
        render(); // Ensure fresh calculations
        if (mResumen) mResumen.classList.remove('d-none');
        if (btnResumen) btnResumen.className = activeBtnClass;
        speakPrompt("Pantalla de Resumen del Día y Cierre de Caja seleccionada. Muestra Ventas Totales, Abonos Totales y Préstamos Totales.");
    }
}

// HU-09: Close Day and Reset function with confirmation
function closeDayAndReset() {
    const confirmed = window.confirm(
        "¿Está seguro de realizar el CIERRE DEL DÍA?\n\nEsta acción reiniciará el total de Ventas Totales, Abonos y Préstamos del día a $0 COP para cuadrar la caja física."
    );

    if (confirmed) {
        dailyTotal = 0;
        totalAbonos = 0;
        totalPrestamos = 0;
        salesHistory = [];
        render();
        speakPrompt("El día ha sido cerrado exitosamente. Todas las métricas diarias han sido reiniciadas a cero pesos.");
        alert("¡Cierre de caja exitoso! Las métricas del día se han reiniciado a $0 COP.");
    }
}

// Accessibility Voice Prompt Function
function speakPrompt(text) {
    const spokenEl = document.getElementById('spoken-text');
    if (spokenEl) spokenEl.textContent = `"${text}"`;

    if (audioEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CO';
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
    }
}

// Accessibility Adjusters
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
        if (btnText) btnText.textContent = "Voz Guiada: SI";
        if (icon) icon.className = "fa-solid fa-volume-high";
        speakPrompt("Asistencia de voz activada.");
    } else {
        if (btnText) btnText.textContent = "Voz Guiada: NO";
        if (icon) icon.className = "fa-solid fa-volume-xmark";
        const spokenEl = document.getElementById('spoken-text');
        if (spokenEl) spokenEl.textContent = "Asistencia de voz silenciada.";
    }
}

// Initial Load
window.onload = function() {
    render();
};