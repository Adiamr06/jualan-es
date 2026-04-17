let cart = [];
let orderHistory = JSON.parse(localStorage.getItem('tea_fresh_history')) || [];
let activeTab = 'active';

// DOM Elements
const cartSidebar = document.getElementById('cart-sidebar');
const historySidebar = document.getElementById('history-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const historyToggle = document.getElementById('history-toggle');
const closeCart = document.getElementById('close-cart');
const closeHistory = document.getElementById('close-history');
const cartItemsContainer = document.getElementById('cart-items');
const historyItemsContainer = document.getElementById('history-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const tabBtns = document.querySelectorAll('.tab-btn');

// Checkout Elements
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const modalTotal = document.getElementById('modal-total');
const paymentItems = document.querySelectorAll('.payment-item');
const paymentViews = {
    qris: document.getElementById('qris-view'),
    tf: document.getElementById('tf-view'),
    dana: document.getElementById('ewallet-view'),
    ovo: document.getElementById('ewallet-view')
};

// Toggle Cart
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    historySidebar.classList.remove('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Toggle History
const openHistory = () => {
    historySidebar.classList.add('open');
    cartSidebar.classList.remove('open');
    renderHistory();
};

historyToggle.addEventListener('click', openHistory);

closeHistory.addEventListener('click', () => {
    historySidebar.classList.remove('open');
});

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab = btn.getAttribute('data-tab');
        renderHistory();
    });
});

// Checkout Modal
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang anda masih kosong!');
        return;
    }
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotal.innerText = `Rp ${totalAmount.toLocaleString('id-ID')}`;
    checkoutModal.style.display = 'flex';
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

// Payment Method Selection
paymentItems.forEach(item => {
    item.addEventListener('click', () => {
        paymentItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const method = item.getAttribute('data-method');
        Object.values(paymentViews).forEach(view => view.style.display = 'none');
        paymentViews[method].style.display = 'block';
    });
});

window.confirmPayment = function() {
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'TF-' + Math.floor(Math.random() * 90000 + 10000);
    
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleString('id-ID'),
        items: [...cart],
        total: totalAmount,
        status: 'Diproses'
    };

    orderHistory.unshift(newOrder);
    localStorage.setItem('tea_fresh_history', JSON.stringify(orderHistory));

    alert('Terima kasih! Pembayaran anda sedang kami verifikasi. Pesanan ' + orderId + ' akan segera diproses.');
    
    cart = [];
    updateCartUI();
    checkoutModal.style.display = 'none';
    cartSidebar.classList.remove('open');
    
    // Auto open history to show the new order
    setTimeout(() => {
        openHistory();
    }, 500);
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // Animation feedback
    const btn = event.target;
    if (btn && btn.classList.contains('add-to-cart')) {
        const originalText = btn.innerText;
        btn.innerText = 'Ditambahkan! ✓';
        btn.style.background = 'var(--primary-light)';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--primary)';
        }, 1500);
    }
}

function updateCartUI() {
    // Update count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalCount;

    // Render items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--gray-400); padding: 20px;">Keranjang kosong.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid var(--gray-100); padding-bottom: 15px;">
                <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 16px;">${item.title}</h4>
                    <div style="font-size: 14px; color: var(--primary); font-weight: 700;">
                        ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}
                    </div>
                </div>
                <div onclick="removeFromCart(${item.id})" style="cursor: pointer; color: #ff6b6b; font-size: 18px;">&times;</div>
            </div>
        `).join('');
    }

    // Update total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.innerText = `Rp ${totalAmount.toLocaleString('id-ID')}`;
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function renderHistory() {
    const filteredHistory = orderHistory.filter(order => {
        if (activeTab === 'active') return order.status === 'Diproses';
        if (activeTab === 'completed') return order.status === 'Selesai';
        return true;
    });

    if (filteredHistory.length === 0) {
        historyItemsContainer.innerHTML = `<p style="text-align: center; color: var(--gray-400); padding: 40px;">Belum ada pesanan ${activeTab === 'active' ? 'aktif' : 'selesai'}.</p>`;
        return;
    }

    historyItemsContainer.innerHTML = filteredHistory.map(order => `
        <div class="history-card" style="cursor: pointer; transition: 0.3s;" onclick="toggleOrderDetails('${order.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <span class="history-id">${order.id}</span>
                    <span style="font-size: 11px; color: var(--gray-400);">${order.date}</span>
                </div>
                <span class="history-status ${order.status === 'Diproses' ? 'status-processing' : 'status-completed'}">${order.status}</span>
            </div>
            
            <div id="details-${order.id}" class="order-details-content" style="display: none; margin-top: 15px; padding-top: 10px; border-top: 1px dashed var(--gray-200);">
                ${order.items.map(item => `
                    <div style="font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>${item.quantity}x ${item.title}</span>
                        <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                `).join('')}
                <div style="margin-top: 10px; display: flex; justify-content: space-between; font-weight: 700; font-size: 15px;">
                    <span>Total Pembayaran</span>
                    <span style="color: var(--primary);">Rp ${order.total.toLocaleString('id-ID')}</span>
                </div>
                
                ${order.status === 'Diproses' ? `
                    <button class="history-btn-complete" onclick="event.stopPropagation(); completeOrder('${order.id}')">
                        Selesaikan Pesanan (Sudah Diterima)
                    </button>
                ` : `
                    <div style="margin-top: 10px; text-align: center; font-size: 11px; color: var(--gray-800);">
                        Pesanan ini telah selesai. Terima kasih!
                    </div>
                `}
            </div>
            <div id="expand-hint-${order.id}" style="text-align: center; font-size: 10px; color: var(--gray-400); margin-top: 10px;">
                Klik untuk detail
            </div>
        </div>
    `).join('');
}

window.toggleOrderDetails = function(orderId) {
    const detail = document.getElementById(`details-${orderId}`);
    const hint = document.getElementById(`expand-hint-${orderId}`);
    if (detail.style.display === 'none') {
        detail.style.display = 'block';
        hint.innerText = 'Klik untuk menutup';
    } else {
        detail.style.display = 'none';
        hint.innerText = 'Klik untuk detail';
    }
}

window.completeOrder = function(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (order) {
        order.status = 'Selesai';
        localStorage.setItem('tea_fresh_history', JSON.stringify(orderHistory));
        renderHistory();
        alert('Terima kasih! Pesanan ' + orderId + ' telah selesai. Kunjungi kami lagi ya!');
    }
}
