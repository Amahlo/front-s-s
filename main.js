
let audioEnabled = true;
let highContrast = false;

// Datos de ejemplo (se reemplazan por la lista real de la natillera)
const participantes = [
    { nombre: 'María Fernanda Gómez', tel: '3001234567' },
    { nombre: 'Carlos Andrés Ruiz',   tel: '3109876543' },
    { nombre: 'Luz Marina Herrera',   tel: '3157654321' },
    { nombre: 'José Luis Pérez',      tel: '3201112233' },
    { nombre: 'Ana Sofía Torres',     tel: '3012223344' },
    { nombre: 'Pedro Pablo Díaz',     tel: '3123334455' },
    { nombre: 'Rosa Elena Vargas',    tel: '3134445566' },
    { nombre: 'Jorge Iván Castro',    tel: '3005556677' }
];

const POR_PAGINA = 4;
let busqueda = '';
let pagina = 0;

function filtrar() {
    if (busqueda === '') return participantes;
    return participantes.filter(p => p.tel.includes(busqueda));
}

function formatTel(t) {
    return t.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

function render() {
    const lista = filtrar();
    const total = lista.length;
    const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
    if (pagina >= paginas) pagina = paginas - 1;

    document.getElementById('search-display').textContent = busqueda === '' ? '—' : busqueda;

    const container = document.getElementById('results');
    container.innerHTML = '';
    lista.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA).forEach(p => {
        const el = document.createElement('button');
        el.className = 'card bg-earth-900 text-white w-100 p-4 border border-3 border-secondary rounded-4 shadow text-start d-flex flex-row align-items-center justify-content-between';
        el.onclick = function () { speakPrompt(`Seleccionó a ${p.nombre}`); };
        el.innerHTML = `
            <article>
                <h3 class="h5 fw-bold text-white m-0">${p.nombre}</h3>
                <output class="fs-4 fw-bold text-warning">${formatTel(p.tel)}</output>
            </article>
            <i class="fa-solid fa-chevron-right fs-2 text-warning" aria-hidden="true"></i>
        `;
        container.appendChild(el);
    });

    const vacio = total === 0;
    document.getElementById('not-found').classList.toggle('d-none', !vacio);
    document.getElementById('pager').classList.toggle('d-none', vacio);
    document.getElementById('result-count-text').textContent = vacio
        ? 'SIN RESULTADOS'
        : `${total} PARTICIPANTE${total === 1 ? '' : 'S'} · PÁGINA ${pagina + 1} DE ${paginas}`;
    document.getElementById('btn-prev').disabled = pagina === 0;
    document.getElementById('btn-next').disabled = pagina >= paginas - 1;
}

function pulsar(k) {
    if (k === 'limpiar') {
        busqueda = '';
        speakPrompt('Búsqueda limpiada.');
    } else if (k === 'borrar') {
        busqueda = busqueda.slice(0, -1);
    } else if (busqueda.length < 10) {
        busqueda += k;
        speakPrompt(k);
    }
    pagina = 0;
    render();
    if (filtrar().length === 0) speakPrompt('No encontrado. Presione limpiar.');
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

window.onload = function () {
    document.querySelectorAll('.key').forEach(b => b.addEventListener('click', () => pulsar(b.dataset.key)));
    document.getElementById('btn-limpiar-nf').addEventListener('click', () => pulsar('limpiar'));
    document.getElementById('btn-prev').addEventListener('click', () => { if (pagina > 0) { pagina--; render(); } });
    document.getElementById('btn-next').addEventListener('click', () => { pagina++; render(); });
    render();
};
