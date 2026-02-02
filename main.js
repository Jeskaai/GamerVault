import './src/style.css';
import { products } from './src/products.js';

// Cargar carrito desde memoria para no perder datos al refrescar
let cart = JSON.parse(localStorage.getItem('active_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.15;
    audio.play().catch(() => {});
};

// --- GESTIÓN DE PERFIL ---
window.saveProfile = () => {
    const name = document.getElementById('prof-name').value;
    const addr = document.getElementById('prof-address').value;
    const card = document.getElementById('prof-card').value;
    const fileInput = document.getElementById('prof-file');

    const finalize = (img) => {
        currentUser = { ...currentUser, name, address: addr, avatar: img || currentUser.avatar, payment: card ? `VISA **** ${card.slice(-4)}` : currentUser.payment };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        location.reload();
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => finalize(e.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else finalize();
};

// --- CARRITO CON PERSISTENCIA ---
window.addToCart = (id) => {
    const item = products.find(p => p.id === Number(id));
    if (item) {
        playSound();
        cart.push({ ...item, cartId: Date.now() + Math.random() });
        saveCart();
        renderCartUI();
        document.getElementById('cart-panel').classList.add('active');
    }
};

window.removeFromCart = (cartId) => {
    playSound();
    cart = cart.filter(i => i.cartId !== cartId);
    saveCart();
    renderCartUI();
};

const saveCart = () => {
    localStorage.setItem('active_cart', JSON.stringify(cart));
};

const renderCartUI = () => {
    const list = document.getElementById('cart-items');
    const sub = cart.reduce((s, i) => s + i.price, 0);
    list.innerHTML = cart.map(i => `
        <div class="cart-item">
            <span>${i.name}</span>
            <div><strong>$${i.price}</strong> <button onclick="removeFromCart(${i.cartId})" class="delete-btn">✕</button></div>
        </div>`).join('');
    document.getElementById('tax-val').innerText = `$${(sub * 0.14).toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${(sub * 1.14).toFixed(2)}`;
};

// --- ÓRDENES CON FEEDBACK VISUAL ---
window.deployOrder = async () => {
    const activeUser = JSON.parse(localStorage.getItem('currentUser'));
    if (cart.length === 0) return alert("Rig vacío.");
    if (!activeUser.address) { alert("Configura dirección en PERFIL."); return window.openProfile(); }
    
    const btn = document.getElementById('deploy-btn');
    const originalText = btn.innerText;
    btn.innerText = "PROCESANDO DATOS...";
    btn.disabled = true;

    // Simular tiempo de respuesta de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
        id: Math.floor(Math.random() * 9000) + 1000,
        userName: activeUser.name,
        userEmail: activeUser.email,
        userAvatar: activeUser.avatar,
        address: activeUser.address,
        payment: activeUser.payment,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price, 0) * 1.14,
        status: 'Preparando'
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    playSound();
    cart = [];
    saveCart();
    btn.innerText = originalText;
    btn.disabled = false;
    renderCartUI();
    renderView('MY RIG');
};

// --- RENDERIZADO DE VISTAS ---
const renderView = (view) => {
    const container = document.getElementById('content-area');
    document.getElementById('cart-panel').classList.remove('active');

    if (view === 'STORE') {
        container.innerHTML = `<h1 class="neon-text">Elite Hardware</h1><div class="grid">${products.map(p => `
            <div class="p-card">
                <div class="p-img-container">
                    <img src="${p.image}" class="p-img" onerror="this.src='https://via.placeholder.com/150/000/00f3ff?text=COMPONENT'">
                </div>
                <h3>${p.name}</h3><p class="p-price">$${p.price}</p>
                <button class="btn-primary" onclick="addToCart(${p.id})">AÑADIR AL RIG</button>
            </div>`).join('')}</div>`;
    } else if (view === 'MY RIG') {
        const myOrders = JSON.parse(localStorage.getItem('orders') || '[]').filter(o => o.userEmail === currentUser.email);
        container.innerHTML = `<h1 class="neon-text">Mi Historial</h1>` + myOrders.reverse().map(o => `
            <div class="p-card" style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
                <div><h3>ORDEN #${o.id}</h3><p>ESTADO: <span style="color:var(--neon-cyan)">${o.status.toUpperCase()}</span></p></div>
                <button onclick="viewOrderDetails(${o.id})" class="btn-primary" style="width:auto; padding:5px 15px;">DETALLES</button>
            </div>`).join('');
    } else if (view === 'ADMIN' && currentUser.role === 'admin') {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        container.innerHTML = `<h1 class="neon-text">Admin Hub</h1><div class="grid">${allOrders.reverse().map(o => `
            <div class="p-card">
                <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                    <img src="${o.userAvatar}" style="width:35px; height:35px; border-radius:50%; object-fit:cover; border:1px solid var(--neon-magenta)">
                    <h3>${o.userName}</h3>
                </div>
                <select onchange="updateOrderStatus(${o.id}, this.value)" class="input-futuristic" style="padding:5px; font-size:0.8rem;">
                    <option value="Preparando" ${o.status==='Preparando'?'selected':''}>PREPARANDO</option>
                    <option value="Enviado" ${o.status==='Enviado'?'selected':''}>ENVIADO</option>
                    <option value="Entregado" ${o.status==='Entregado'?'selected':''}>ENTREGADO</option>
                </select>
                <button onclick="viewOrderDetails(${o.id})" class="btn-primary" style="margin-top:10px;">DETALLES</button>
            </div>`).join('')}</div>`;
    }
};

window.updateOrderStatus = (orderId, newStatus) => {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('orders', JSON.stringify(orders));
    playSound();
    renderView('ADMIN'); 
};

window.viewOrderDetails = (orderId) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const o = orders.find(ord => ord.id === orderId);
    document.getElementById('modal-body').innerHTML = `
        <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:10px; margin-bottom:15px; border:1px solid var(--neon-cyan);">
            <p>📍 ENVÍO: ${o.address}</p><p>💳 PAGO: ${o.payment}</p><p>🛰️ STATUS: ${o.status}</p>
        </div>` + o.items.map(i => `<div style="display:flex; justify-content:space-between;"><span>${i.name}</span><strong>$${i.price}</strong></div>`).join('');
    document.getElementById('modal-title').innerText = `ORDEN #${o.id}`;
    document.getElementById('modal-footer-info').innerHTML = `<h3 style="color:var(--neon-magenta)">TOTAL: $${o.total.toFixed(2)}</h3>`;
    document.getElementById('order-modal').style.display = 'flex';
};

// --- EVENTOS DE INTERFAZ ---
document.getElementById('enter-btn').onclick = () => {
    const name = document.getElementById('login-name').value;
    const email = document.getElementById('login-email').value;
    const role = document.getElementById('login-role').value;
    if (!name || !email) return alert("Completa los datos.");
    currentUser = { name, email, role, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, address: '', payment: '' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    initApp();
};

document.getElementById('btn-shop').onclick = () => renderView('STORE');
document.getElementById('btn-orders').onclick = () => renderView('MY RIG');
document.getElementById('btn-profile').onclick = () => { playSound(); document.getElementById('profile-modal').style.display='flex'; };
document.getElementById('btn-admin').onclick = () => renderView('ADMIN');
document.getElementById('deploy-btn').onclick = window.deployOrder;
document.getElementById('logout-btn').onclick = () => { localStorage.clear(); location.reload(); };
window.toggleCart = () => { playSound(); document.getElementById('cart-panel').classList.toggle('active'); };
window.closeProfile = () => document.getElementById('profile-modal').style.display = 'none';
window.closeModal = () => document.getElementById('order-modal').style.display = 'none';

const initApp = () => {
    if (!currentUser) return;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('user-name').innerText = currentUser.name;
    document.getElementById('user-avatar').src = currentUser.avatar;
    document.getElementById('btn-admin').style.display = (currentUser.role === 'admin') ? 'inline-block' : 'none';
    renderView('STORE');
    renderCartUI();
};

if (currentUser) initApp();