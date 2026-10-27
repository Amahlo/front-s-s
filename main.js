
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

/* =========================================
   HU-08: ALERTA DE INVENTARIO SEMÁFORO
   ========================================= */

let inventory = {
    'Perfume AAA Coco Chanel': { stock: 8, minStock: 3 },
    'Perfume AAA Sauvage Dior': { stock: 5, minStock: 3 },
    'Pijama Térmica S&S': { stock: 4, minStock: 3 },
    'Aporte Natillera Colombiana': { stock: 20, minStock: 5 }
};

function getInventoryState(stock, minStock) {
    if (stock <= 0) {
        return 'danger';
    }

    if (stock <= minStock) {
        return 'warning';
    }

    return 'ok';
}

function renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    const inventoryAlert = document.getElementById('inventory-alert');

    inventoryList.innerHTML = '';

    let lowStockProducts = [];

    Object.keys(inventory).forEach(function(productName) {
        const product = inventory[productName];
        const state = getInventoryState(product.stock, product.minStock);

        const item = document.createElement('li');
        item.className = 'inventory-item';

        if (state === 'warning') {
            item.classList.add('inventory-item-warning');
            lowStockProducts.push(productName);
        }

        if (state === 'danger') {
            item.classList.add('inventory-item-danger');
            lowStockProducts.push(productName);
        }

        const name = document.createElement('p');
        name.className = 'inventory-name m-0';
        name.textContent = productName;

        const stock = document.createElement('output');
        stock.className = 'inventory-stock';
        stock.textContent = 'Stock: ' + product.stock;

        const stateText = document.createElement('p');
        stateText.className = 'inventory-state m-0';

        if (state === 'ok') {
            stateText.classList.add('inventory-state-ok');
            stateText.textContent = 'STOCK SUFICIENTE';
        } else if (state === 'warning') {
            stateText.classList.add('inventory-state-warning');
            stateText.textContent = 'POCO STOCK: HACER PEDIDO';
        } else {
            stateText.classList.add('inventory-state-danger');
            stateText.textContent = 'SIN STOCK: PEDIDO URGENTE';
        }

        item.appendChild(name);
        item.appendChild(stock);
        item.appendChild(stateText);
        inventoryList.appendChild(item);

        updateProductButtonAlert(productName, state);
    });

    inventoryAlert.classList.remove('inventory-ok', 'inventory-warning', 'inventory-danger');

    if (lowStockProducts.length > 0) {
        if (lowStockProducts.length === 1) {
            inventoryAlert.classList.add('inventory-warning');
            inventoryAlert.textContent = 'ATENCIÓN: POCO STOCK DE ' + lowStockProducts[0].toUpperCase() + '.';
        } else {
            inventoryAlert.classList.add('inventory-danger');
            inventoryAlert.textContent = 'ATENCIÓN: ' + lowStockProducts.length + ' PRODUCTOS NECESITAN PEDIDO.';
        }
    } else {
        inventoryAlert.classList.add('inventory-ok');
        inventoryAlert.textContent = 'TODO EL INVENTARIO TIENE STOCK SUFICIENTE.';
    }
}

function updateProductButtonAlert(productName, state) {
    const saleButtons = document.querySelectorAll('button[onclick*="addQuickSale"]');

    saleButtons.forEach(function(button) {
        const buttonHasProduct = button.textContent.toUpperCase().includes(productName.toUpperCase());

        if (buttonHasProduct) {
            button.classList.remove('product-button-warning', 'product-button-danger');

            if (state === 'warning') {
                button.classList.add('product-button-warning');
            }

            if (state === 'danger') {
                button.classList.add('product-button-danger');
            }
        }
    });
}

function decreaseInventory(productName) {
    if (inventory[productName]) {
        inventory[productName].stock = inventory[productName].stock - 1;

        if (inventory[productName].stock < 0) {
            inventory[productName].stock = 0;
        }

        renderInventory();
    }
}

/* Escucha las ventas sin cambiar la función original addQuickSale */
document.addEventListener('click', function(event) {
    const clickedButton = event.target.closest('button');

    if (!clickedButton) {
        return;
    }

    const onclickValue = clickedButton.getAttribute('onclick');

    if (!onclickValue || !onclickValue.includes('addQuickSale')) {
        return;
    }

    Object.keys(inventory).forEach(function(productName) {
        if (onclickValue.includes(productName)) {
            setTimeout(function() {
                decreaseInventory(productName);
            }, 100);
        }
    });
});

/* Agrega el inventario al render inicial sin modificar window.onload original */
document.addEventListener('DOMContentLoaded', function() {
    renderInventory();
});