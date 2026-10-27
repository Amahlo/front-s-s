
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
document.addEventListener('DOMContentLoaded', () => {
  // Datos interactivos de cada participante
  const socios = {
    1: {
      nombre: "Felipe Isaza",
      saldo: "$1.850.000",
      aportado: "$1.850.000",
      deuda: "$0",
      estado: "SALDO A FAVOR",
      mensaje: '"Participante Felipe Isaza. Saldo a favor por $1.850.000 pesos."'
    },
    2: {
      nombre: "Deerly Hernandez",
      saldo: "$1.200.000",
      aportado: "$1.200.000",
      deuda: "$0",
      estado: "SALDO A FAVOR",
      mensaje: '"Participante Deerly Hernandez. Saldo a favor por $1.200.000 pesos."'
    },
    3: {
      nombre: "Carlos Gomez",
      saldo: "-$550.000",
      aportado: "$0",
      deuda: "$550.000",
      estado: "DEUDA PENDIENTE",
      mensaje: '"Participante Carlos Gomez. Deuda pendiente por $550.000 pesos."'
    },
    4: {
      nombre: "Maiky Vergara",
      saldo: "-$400.000",
      aportado: "$0",
      deuda: "$400.000",
      estado: "DEUDA PENDIENTE",
      mensaje: '"Participante Maiky Vergara. Deuda pendiente por $400.000 pesos."'
    }
  };

  const partnerItems = document.querySelectorAll('.partner-item');
  const userNameElem = document.getElementById('userName');
  const totalBalanceElem = document.getElementById('totalBalance');
  const totalAportadoElem = document.getElementById('totalAportado');
  const totalDeudaElem = document.getElementById('totalDeuda');
  const assistantMsgElem = document.getElementById('assistantMessage');

  partnerItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      const data = socios[id];
      if (!data) return;

      // Actualizar estado de selección visual
      partnerItems.forEach(el => {
        el.classList.remove('is-selected');
        const av = el.querySelector('.partner-avatar');
        if (av) av.classList.remove('avatar--accent');
      });

      item.classList.add('is-selected');
      const avatar = item.querySelector('.partner-avatar');
      if (avatar) avatar.classList.add('avatar--accent');

      // Actualizar datos del panel principal
      userNameElem.textContent = data.nombre;
      totalBalanceElem.textContent = data.saldo;
      totalAportadoElem.textContent = data.aportado;
      totalDeudaElem.textContent = data.deuda;
      assistantMsgElem.textContent = data.mensaje;

      // Color del total si es negativo o positivo
      if (data.saldo.startsWith('-')) {
        totalBalanceElem.style.color = '#ff6b6b';
      } else {
        totalBalanceElem.style.color = '#38ef7d';
      }
    });
  });
});