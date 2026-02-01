import './src/style.css';
import { products } from './src/products.js';

let cart = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
};

// --- GESTIÓN DE ESTADOS (ADMIN) ---
window.updateOrderStatus = (orderId, newStatus) => {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('orders', JSON.stringify(orders));
    playSound();
    alert(`Orden #${orderId} actualizada a: ${newStatus}`);
    renderView('ADMIN'); // Refrescar vista admin
};

// --- SESIÓN Y PERFIL ---
document.getElementById('enter-btn').onclick = () => {
    const name = document.getElementById('login-name').value;
    const email = document.getElementById('login-email').value;
    const role = document.getElementById('login-role').value;
    if (!name || !email) return alert("Ingresa tus credenciales.");
    currentUser = { name, email, role, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, address: '', payment: '' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    initApp();
};

window.saveProfile = () => {
    const name = document.getElementById('prof-name').value;
    const addr = document.getElementById('prof-address').value;
    const card = document.getElementById('prof-card').value;
    const fileInput = document.getElementById('prof-file');

    const updateData = (imgData) => {
        currentUser = { ...currentUser, name, address: addr, avatar: imgData || currentUser.avatar, payment: card ? `VISA **** ${card.slice(-4)}` : currentUser.payment };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        location.reload();
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => updateData(e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else { updateData(); }
};

const initApp = () => {
    if (!currentUser) return;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('user-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.avatar;
    document.getElementById('btn-admin').style.display = (currentUser.role === 'admin') ? 'inline-block' : 'none';
    renderView('STORE');
};

// --- CARRITO ---
window.addToCart = (id) => {
    const item = products.find(p => p.id === Number(id));
    if (item) {
        playSound();
        cart.push({ ...item, cartId: Date.now() + Math.random() });
        renderCartUI();
        document.getElementById('cart-panel').classList.add('active');
    }
};

const renderCartUI = () => {
    const list = document.getElementById('cart-items');
    const sub = cart.reduce((s, i) => s + i.price, 0);
    list.innerHTML = cart.map(i => `<div class="cart-item"><span>${i.name}</span><div><strong>$${i.price}</strong> <button onclick="removeFromCart(${i.cartId})" class="delete-btn">✕</button></div></div>`).join('');
    document.getElementById('tax-val').innerText = `$${(sub * 0.14).toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${(sub * 1.14).toFixed(2)}`;
};

// --- PEDIDOS ---
window.deployOrder = () => {
    if (cart.length === 0) return alert("Rig vacío.");
    if (!currentUser.address) { alert("Configura tu dirección en PERFIL."); return window.openProfile(); }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
        id: Math.floor(Math.random() * 9000) + 1000,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userAvatar: currentUser.avatar,
        address: currentUser.address,
        payment: currentUser.payment,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price, 0) * 1.14,
        status: 'Preparando' // Estado inicial
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    cart = []; renderCartUI(); renderView('MY RIG');
};

// --- NAVEGACIÓN Y VISTAS ---
const renderView = (view) => {
    const container = document.getElementById('content-area');
    document.getElementById('cart-panel').classList.remove('active');

    if (view === 'STORE') {
        container.innerHTML = `<h1 class="neon-text">Elite Components</h1><div class="grid">${products.map(p => `
            <div class="p-card">
                <div class="p-img-container"><img src="${p.image}" class="p-img"></div>
                <div class="p-badge">${p.category}</div>
                <h3>${p.name}</h3><p class="p-price">$${p.price}</p>
                <button class="btn-primary" onclick="addToCart(${p.id})">AÑADIR AL RIG</button>
            </div>`).join('')}</div>`;
    } else if (view === 'MY RIG') {
        const myOrders = JSON.parse(localStorage.getItem('orders') || '[]').filter(o => o.userEmail === currentUser.email);
        container.innerHTML = `<h1 class="neon-text">Mi Historial</h1>` + myOrders.reverse().map(o => `
            <div class="p-card" style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
                <div>
                    <h3>ORDEN #${o.id}</h3>
                    <p>Estado: <span style="color:var(--neon-cyan); font-weight:800;">${o.status.toUpperCase()}</span></p>
                    <p style="font-size:0.7rem; color:var(--text-dim);">${o.date}</p>
                </div>
                <button onclick="viewOrderDetails(${o.id})" class="btn-primary" style="width:auto; padding:5px 15px;">DETALLES</button>
            </div>`).join('');
    } else if (view === 'ADMIN' && currentUser.role === 'admin') {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        container.innerHTML = `<h1 class="neon-text">Admin Hub</h1><div class="grid">${allOrders.reverse().map(o => `
            <div class="p-card">
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                    <img src="${o.userAvatar}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid var(--neon-magenta);">
                    <h3>${o.userName}</h3>
                </div>
                <p style="font-size:0.7rem; margin-bottom:10px;">ID: #${o.id} | $${o.total.toFixed(2)}</p>
                
                <label style="font-size:0.6rem; color:var(--neon-cyan);">ACTUALIZAR ESTADO:</label>
                <select onchange="updateOrderStatus(${o.id}, this.value)" class="input-futuristic" style="padding:5px; font-size:0.8rem; margin-top:5px;">
                    <option value="Preparando" ${o.status === 'Preparando' ? 'selected' : ''}>PREPARANDO</option>
                    <option value="Enviado" ${o.status === 'Enviado' ? 'selected' : ''}>ENVIADO</option>
                    <option value="Entregado" ${o.status === 'Entregado' ? 'selected' : ''}>ENTREGADO</option>
                </select>
                
                <button onclick="viewOrderDetails(${o.id})" class="btn-primary" style="margin-top:10px; font-size:0.7rem; padding:8px;">VER LOGÍSTICA</button>
            </div>`).join('')}</div>`;
    }
};

// --- MODALES ---
window.viewOrderDetails = (orderId) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const o = orders.find(ord => ord.id === orderId);
    document.getElementById('modal-body').innerHTML = `
        <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:10px; margin-bottom:15px; font-size:0.8rem; border:1px solid var(--neon-cyan);">
            <p>📍 DIRECCIÓN: ${o.address}</p>
            <p>💳 PAGO: ${o.payment || 'CRÉDITO GALÁCTICO'}</p>
            <p>🛰️ ESTADO: <strong>${o.status.toUpperCase()}</strong></p>
        </div>` + o.items.map(i => `<div style="display:flex; justify-content:space-between; margin-top:5px;"><span>${i.name}</span><strong>$${i.price}</strong></div>`).join('');
    document.getElementById('modal-title').innerText = `ORDEN #${o.id}`;
    document.getElementById('modal-footer-info').innerHTML = `<h3 style="color:var(--neon-magenta)">TOTAL: $${o.total.toFixed(2)}</h3>`;
    document.getElementById('order-modal').style.display = 'flex';
};

window.toggleCart = () => { playSound(); document.getElementById('cart-panel').classList.toggle('active'); };
window.openProfile = () => { playSound(); document.getElementById('prof-name').value = currentUser.name; document.getElementById('prof-address').value = currentUser.address || ''; document.getElementById('profile-modal').style.display = 'flex'; };
window.closeProfile = () => document.getElementById('profile-modal').style.display = 'none';
window.closeModal = () => document.getElementById('order-modal').style.display = 'none';
window.removeFromCart = (cartId) => { playSound(); cart = cart.filter(i => i.cartId !== cartId); renderCartUI(); };

document.getElementById('btn-shop').onclick = () => renderView('STORE');
document.getElementById('btn-orders').onclick = () => renderView('MY RIG');
document.getElementById('btn-profile').onclick = window.openProfile;
document.getElementById('btn-admin').onclick = () => renderView('ADMIN');
document.getElementById('deploy-btn').onclick = window.deployOrder;
document.getElementById('logout-btn').onclick = () => { localStorage.removeItem('currentUser'); location.reload(); };

if (currentUser) initApp();