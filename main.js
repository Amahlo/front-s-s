
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

// ==========================================
// LÓGICA HU-05: TECLADO Y ABONOS NATILLERA
// ==========================================

let abonoAmount = 0;
let selectedMemberId = '';

// Diccionario en memoria para simular los saldos
let natilleraMembers = {
    'deerly': { name: 'Deerly Hernandez', ahorro: 1200000, extraText: ' • Estado: AL DÍA' },
    'carlos': { name: 'Carlos Gomez', ahorro: 900000, extraText: ' • Préstamo: $500.000 COP' }
};

function openAbonoKeypad(memberId, memberName) {
    selectedMemberId = memberId;
    abonoAmount = 0;
    updateKeypadDisplay();
    
    document.getElementById('keypad-member-name').textContent = memberName;
    
    // Transición entre listas y teclado ocultando/mostrando clases Bootstrap (d-none)
    document.getElementById('natillera-list-view').classList.add('d-none');
    document.getElementById('natillera-keypad-view').classList.remove('d-none');
    
    speakPrompt(`Teclado abierto. Digite el monto a abonar para ${memberName}.`);
}

function closeAbonoKeypad() {
    document.getElementById('natillera-list-view').classList.remove('d-none');
    document.getElementById('natillera-keypad-view').classList.add('d-none');
    speakPrompt("Abono cancelado. Volviendo a la lista de socios.");
}

function pressKeypad(num) {
    let currentStr = abonoAmount.toString();
    // Limita a 10 caracteres para que no desborde la pantalla ni se ingresen montos irreales
    if(currentStr.length < 10) { 
        abonoAmount = parseInt(currentStr === '0' ? num.toString() : currentStr + num.toString());
        updateKeypadDisplay();
    }
}

function clearKeypad() {
    abonoAmount = 0;
    updateKeypadDisplay();
}

function updateKeypadDisplay() {
    document.getElementById('keypad-display').textContent = formatCOP(abonoAmount);
}

function confirmAbono() {
    if(abonoAmount === 0) {
        speakPrompt("No se puede registrar. El monto ingresado es cero pesos.");
        return;
    }

    let member = natilleraMembers[selectedMemberId];

    // 1. Registramos el abono en el historial global del día reutilizando addQuickSale
    addQuickSale(`Abono Natillera (${member.name})`, abonoAmount, 'Natillera');

    // 2. Sumamos matemáticamente al saldo del socio
    member.ahorro += abonoAmount;
    let newAhorroText = formatCOP(member.ahorro);
    
    // 3. Actualizamos el texto en la tarjeta del socio
    document.getElementById(`info-${selectedMemberId}`).innerHTML = 
        `Ahorro: ${newAhorroText} ${member.extraText}`;

    // 4. Cerramos el panel de teclado
    closeAbonoKeypad();

    // 5. EFECTO DE DESTELLO (CRITERIO DE ACEPTACIÓN 3)
    let memberCard = document.getElementById(`member-card-${selectedMemberId}`);
    
    // Aplicamos fondo verde y lo hacemos un poquito más grande temporalmente
    memberCard.classList.remove('bg-white');
    memberCard.classList.add('bg-success', 'text-white');
    memberCard.style.transform = 'scale(1.03)';
    
    // Lo regresamos a la normalidad después de 800ms
    setTimeout(() => {
        memberCard.classList.remove('bg-success', 'text-white');
        memberCard.classList.add('bg-white');
        memberCard.style.transform = 'scale(1)';
    }, 800); 

    speakPrompt(`Abono exitoso. Se sumaron ${formatCOP(abonoAmount)} al ahorro de ${member.name}.`);
}
