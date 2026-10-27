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

// ==========================================
// NUEVO: ESTADO Y LÓGICA DE LA NATILLERA
// ==========================================
let participantes = ["Juan Pérez", "Koralyn", "Carlos Mendoza", "Ana Gómez", "Sofía Ruiz", "Andrés Felipe"];
let paginaActual = 0;
const elementosPorPagina = 4;

function renderizarPagina() {
    const contenedor = document.getElementById("participantesContainer");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const inicio = paginaActual * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const participantesPagina = participantes.slice(inicio, fin);

    participantesPagina.forEach(nombre => {
        const boton = document.createElement("button");
        boton.className = "participant-btn";
        boton.textContent = nombre;
        boton.onclick = () => {
            // Al hacer clic en un socio, registra su aporte en las ventas y avisa por voz
            addQuickSale(`Aporte Natillera (${nombre})`, 100000, 'Natillera');
            speakPrompt(`Se registró el aporte de natillera de ${nombre} por 100 mil pesos.`);
        };
        contenedor.appendChild(boton);
    });

    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");
    
    if (btnAnterior) btnAnterior.disabled = paginaActual === 0;
    if (btnSiguiente) btnSiguiente.disabled = fin >= participantes.length;
}

function formatCOP(num) {
    return '$' + num.toLocaleString('es-CO');
}

function render() {
    const display = document.getElementById('daily-total-display');
    if (display) {
        display.innerHTML = `${formatCOP(dailyTotal)} <span class="fs-4 text-light">COP</span>`;
    }

    const container = document.getElementById('transactions-container');
    if (!container) return;
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
    const spokenTextEl = document.getElementById('spoken-text');
    if (spokenTextEl) spokenTextEl.textContent = `"${text}"`;
    
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
        if (btnText) btnText.textContent = "Voz Guiada: SI";
        if (icon) icon.className = "fa-solid fa-volume-high";
        speakPrompt("Asistencia de voz activada.");
    } else {
        if (btnText) btnText.textContent = "Voz Guiada: NO";
        if (icon) icon.className = "fa-solid fa-volume-xmark";
        const spokenTextEl = document.getElementById('spoken-text');
        if (spokenTextEl) spokenTextEl.textContent = "Asistencia de voz silenciada.";
    }
}

// Configuración de eventos al cargar la ventana
window.onload = function() {
    render();
    renderizarPagina();

    // Event listeners para la natillera
    const btnAddPersona = document.getElementById("btnAddPersona");
    if (btnAddPersona) {
        btnAddPersona.addEventListener("click", () => {
            const nuevoNombre = prompt("Ingrese el nombre de la persona:");
            if (nuevoNombre && nuevoNombre.trim() !== "") {
                participantes.push(nuevoNombre.trim());
                renderizarPagina();
                speakPrompt(`Se agregó a ${nuevoNombre.trim()} a la natillera.`);
            }
        });
    }

    const btnAnterior = document.getElementById("btnAnterior");
    if (btnAnterior) {
        btnAnterior.addEventListener("click", () => {
            if (paginaActual > 0) {
                paginaActual--;
                renderizarPagina();
            }
        });
    }

    const btnSiguiente = document.getElementById("btnSiguiente");
    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", () => {
            if ((paginaActual + 1) * elementosPorPagina < participantes.length) {
                paginaActual++;
                renderizarPagina();
            }
        });
    }
};