// ==============================================
// SISTEMA POS S&S — LÓGICA INTERACTIVA
// ==============================================

let currentRawAmount = "";
let acumuladoVentasHoy = 1450000;
let categoriaSeleccionada = "Lociones AAA";
let voiceActive = true;
let countdownInterval = null;

// ==============================================
// FORMATEAR MONEDA COLOMBIANA
// ==============================================
function formatCurrency(number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(number);
}

// ==============================================
// ACTUALIZAR PANTALLA
// ==============================================
function updateDisplay() {
    const displayElem = document.getElementById("displayMonto");
    const textElem = document.getElementById("displayTextoMonto");
    const val = parseInt(currentRawAmount, 10) || 0;
    
    displayElem.innerText = formatCurrency(val);
    
    if (val === 0) {
        textElem.innerText = "Cero pesos colombianos";
    } else {
        textElem.innerText = `${val.toLocaleString('es-CO')} pesos colombianos`;
    }
}

// ==============================================
// TECLA NUMÉRICA PRESIONADA
// ==============================================
function pressKey(val) {
    // Límite de seguridad: máximo 9 dígitos
    if (currentRawAmount.length >= 9) return;
    
    // Evitar ceros a la izquierda innecesarios
    if (currentRawAmount === "" && (val === "0" || val === "000")) return;
    
    currentRawAmount += val;
    updateDisplay();
    
    if (voiceActive) speakText(val);
}

// ==============================================
// BORRAR ÚLTIMO DÍGITO
// ==============================================
function pressBackspace() {
    currentRawAmount = currentRawAmount.slice(0, -1);
    updateDisplay();
    
    if (voiceActive) speakText("Borrar");
}

// ==============================================
// LIMPIAR TODO A CERO
// ==============================================
function clearAmount() {
    currentRawAmount = "";
    updateDisplay();
    
    if (voiceActive) speakText("Limpiar todo a cero");
}

// ==============================================
// CAMBIAR CATEGORÍA
// ==============================================
function selectCategory(cat) {
    categoriaSeleccionada = cat;
    document.getElementById("categoriaActivaBadge").innerText = `ACTIVO: ${cat.toUpperCase()}`;
    
    if (voiceActive) speakText(`Categoría ${cat}`);
}

// ==============================================
// PROCESAR VENTA
// ==============================================
function procesarVenta() {
    const montoNum = parseInt(currentRawAmount, 10) || 0;
    
    if (montoNum <= 0) {
        alert("Por favor ingrese un monto mayor a $0 para registrar la venta.");
        if (voiceActive) speakText("Ingrese un monto válido mayor a cero");
        return;
    }
    
    // Sumar al acumulado del día
    acumuladoVentasHoy += montoNum;
    document.getElementById("kpiTotalVentas").innerText = formatCurrency(acumuladoVentasHoy);
    
    // Llenar datos del modal
    document.getElementById("modalCategoria").innerText = categoriaSeleccionada;
    document.getElementById("modalMonto").innerText = `${formatCurrency(montoNum)} COP`;
    
    // Mostrar modal de Bootstrap
    const modalElement = document.getElementById('modalExito');
    const bsModal = new bootstrap.Modal(modalElement);
    bsModal.show();
    
    if (voiceActive) {
        speakText(`¡Venta registrada con éxito! ${montoNum} pesos en ${categoriaSeleccionada}`);
    }
    
    // Cuenta regresiva de 3 segundos para cerrar
    let secondsLeft = 3;
    const countdownElem = document.getElementById("modalCountdown");
    countdownElem.innerText = secondsLeft;
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        secondsLeft--;
        countdownElem.innerText = secondsLeft;
        
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            bsModal.hide();
            clearAmount(); // Reiniciar a $0
        }
    }, 1000);
}

// ==============================================
// SÍNTESIS DE VOZ — WCAG AAA
// ==============================================
function speakText(text) {
    if (!voiceActive || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
}

// ==============================================
// ALTERNAR ASISTENTE DE VOZ
// ==============================================
function toggleVoice() {
    voiceActive = !voiceActive;
    document.getElementById("voiceStateLabel").innerText = voiceActive ? "SÍ" : "NO";
    
    const btn = document.getElementById("toggleVoiceBtn");
    if (voiceActive) {
        btn.className = "btn btn-sm btn-outline-warning text-white px-2";
    } else {
        btn.className = "btn btn-sm btn-outline-secondary text-white-50 px-2";
    }
}

// ==============================================
// ALTERNAR ALTO CONTRASTE
// ==============================================
function toggleContrast() {
    document.body.classList.toggle("high-contrast");
}

// ==============================================
// CAMBIAR TAMAÑO DE FUENTE
// ==============================================
function setFontScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
}

// ==============================================
// INICIALIZAR AL CARGAR LA PÁGINA
// ==============================================
updateDisplay();