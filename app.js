// State
let appState = {
    view: 'home',
    currentUser: null, // 'admin' or null
    products: [],
    company: {}
};

// DOM Elements
const app = document.getElementById('app');
const toastElement = document.getElementById('toast');
const mobileMenu = document.getElementById('mobile-menu');


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadData, 100); // Small delay to ensure consistent loading
    checkAuth();

    // Handle initial route
    const hash = window.location.hash.slice(1);
    router(hash || 'home');
});

// Handle External Navigation (Back/Forward)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (appState.view !== hash) {
        router(hash || 'home');
    }
});


function loadData() {
    const db = JSON.parse(localStorage.getItem('sriya_products_db') || '{}');
    appState.products = db.products || [];
    appState.company = db.company || {};
}

function saveData() {
    const db = {
        products: appState.products,
        company: appState.company
    };
    localStorage.setItem('sriya_products_db', JSON.stringify(db));
}

function checkAuth() {
    const user = sessionStorage.getItem('sriya_user');
    if (user === 'admin') {
        appState.currentUser = 'admin';
        document.getElementById('admin-login-btn').classList.add('hidden');
        document.getElementById('admin-dashboard-btn').classList.remove('hidden');
        document.getElementById('admin-logout-btn').classList.remove('hidden');
        document.getElementById('mobile-admin-links').innerHTML = `<a href="#" onclick="router('admin'); toggleMobileMenu()">Dashboard</a><a href="#" onclick="logout(); toggleMobileMenu()">Logout</a>`;
    }
}

// Router
function router(view) {
    appState.view = view;
    // Highlight nav
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    // Simple matching
    if (view === 'home' || view === 'products' || view === 'about' || view === 'contact') {
        // Note: we can't select by href easily if href='#home' etc. Just simple logic:
        // Actually the HTML uses onclick="router('home')" so we are good.
    }

    // Render
    switch (view) {
        case 'home':
            renderHome();
            break;
        case 'products':
            renderProductsPage();
            break;
        case 'about':
            renderAbout();
            break;
        case 'contact':
            renderContact();
            break;
        case 'admin':
            if (appState.currentUser === 'admin') {
                renderAdminDashboard();
            } else {
                showToast('Please login first', 'error');
                toggleAdminModal();
            }
            break;
        default:
            renderHome();
    }
    window.scrollTo(0, 0);
}

// Render Functions
function renderHome() {
    const featured = appState.products.slice(0, 3);
    app.innerHTML = `
        <section class="hero">
            <div class="hero-content">
                <h1>${appState.company.tagline || 'Authentic Sri Lankan Spices'}</h1>
                <p>Taste the tradition of Ceylon with our premium range of spices and flour.</p>
                <button onclick="router('products')" class="btn-primary" style="font-size: 1.2rem;">Shop Now</button>
            </div>
        </section>
        
        <section class="container">
            <h2 class="section-title">Featured Products</h2>
            <div class="products-grid">
                ${featured.map(p => createProductCard(p)).join('')}
            </div>
            <div class="text-center" style="margin-bottom: 4rem;">
                <button onclick="router('products')" class="btn-outline">View All Products</button>
            </div>
        </section>

        <section class="container" style="background: var(--primary-color); color: white; padding: 4rem; border-radius: 8px; text-align: center; margin-bottom: 4rem;">
            <h2>Premium Quality Guaranteed</h2>
            <p style="margin: 1rem 0 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                We source only the finest ingredients from local farmers. No artificial colors, flavors, or preservatives. 
                Just pure, authentic taste.
            </p>
            <button onclick="router('about')" class="btn-primary" style="background: var(--secondary-color); color: var(--text-color);">Learn More About Us</button>
        </section>
    `;
}

function renderProductsPage() {
    app.innerHTML = `
        <section class="container" style="padding-top: 2rem;">
            <h2 class="section-title">Our Products</h2>
            
            <!-- Category Filter (Simple) -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <button class="btn-outline" onclick="filterProducts('all')">All</button>
                <button class="btn-outline" onclick="filterProducts('Spices')">Spices</button>
                <button class="btn-outline" onclick="filterProducts('Flour')">Flour</button>
            </div>

            <div class="products-grid" id="products-list">
                ${appState.products.map(p => createProductCard(p)).join('')}
            </div>
        </section>
    `;
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                ${product.sinhalaName ? `<p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${product.sinhalaName}</p>` : ''}
                <div class="product-price">LKR ${product.price}.00</div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #555;">${truncate(product.description, 60)}</p>
            </div>
        </div>
    `;
}

function renderAbout() {
    const c = appState.company;
    app.innerHTML = `
        <section class="container" style="padding-top: 4rem; padding-bottom: 4rem;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <h2 class="section-title">About Sriya Products</h2>
                <div style="font-size: 1.1rem; line-height: 1.8; color: #444;">
                    <p>${c.about}</p>
                    <br>
                    <p><strong>Founded:</strong> 1999</p>
                    <p><strong>Location:</strong> ${c.contact.address}</p>
                </div>
            </div>
        </section>
    `;
}

function renderContact() {
    const c = appState.company;
    app.innerHTML = `
        <section class="container" style="padding-top: 4rem; padding-bottom: 4rem;">
            <h2 class="section-title">Contact Us</h2>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4rem;">
                <div style="flex: 1; min-width: 300px; padding: 2rem; background: var(--white); box-shadow: var(--shadow-md); border-radius: 8px;">
                    <h3>Get in Touch</h3>
                    <div style="margin-top: 1.5rem;">
                        <p style="margin-bottom: 1rem;"><i class="fas fa-phone" style="width: 24px; color: var(--primary-color);"></i> ${c.contact.phone}</p>
                        <p style="margin-bottom: 1rem;"><i class="fas fa-mobile-alt" style="width: 24px; color: var(--primary-color);"></i> ${c.contact.mobile}</p>
                        <p style="margin-bottom: 1rem;"><i class="fas fa-envelope" style="width: 24px; color: var(--primary-color);"></i> ${c.contact.email}</p>
                        <p style="margin-bottom: 1rem;"><i class="fas fa-map-marker-alt" style="width: 24px; color: var(--primary-color);"></i> ${c.contact.address}</p>
                    </div>
                </div>
                
                <div style="flex: 1; min-width: 300px;">
                    <h3>Send us a message</h3>
                    <form onsubmit="event.preventDefault(); showToast('Message sent! We will contact you soon.');">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    `;
}

function renderAdminDashboard() {
    app.innerHTML = `
        <section class="container" style="padding-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2>Admin Dashboard</h2>
                <div style="display: flex; gap: 1rem;">
                     <button onclick="router('home')" class="btn-outline">View Site</button>
                     <button onclick="openProductModal()" class="btn-primary"><i class="fas fa-plus"></i> Add Product</button>
                </div>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3>Manage Products</h3>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; background: white; box-shadow: var(--shadow-md);">
                        <thead>
                            <tr style="background: var(--gray-100); text-align: left;">
                                <th style="padding: 1rem;">Image</th>
                                <th style="padding: 1rem;">Name</th>
                                <th style="padding: 1rem;">Category</th>
                                <th style="padding: 1rem;">Price</th>
                                <th style="padding: 1rem;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appState.products.map(p => `
                                <tr style="border-bottom: 1px solid var(--gray-200);">
                                    <td style="padding: 1rem;"><img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                                    <td style="padding: 1rem;">
                                        <strong>${p.name}</strong><br>
                                        <small>${p.sinhalaName || ''}</small>
                                    </td>
                                    <td style="padding: 1rem;">${p.category}</td>
                                    <td style="padding: 1rem;">LKR ${p.price}</td>
                                    <td style="padding: 1rem;">
                                        <button onclick="editProduct('${p.id}')" style="color: blue; margin-right: 0.5rem;"><i class="fas fa-edit"></i></button>
                                        <button onclick="deleteProduct('${p.id}')" style="color: red;"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow-md); margin-bottom: 4rem;">
                <h3>Edit Company Details</h3>
                <form onsubmit="handleCompanyUpdate(event)">
                    <div class="form-group">
                        <label>About Us Text</label>
                        <textarea id="company-about" rows="4">${appState.company.about}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" id="company-phone" value="${appState.company.contact.phone}">
                        </div>
                        <div class="form-group">
                            <label>Mobile</label>
                            <input type="text" id="company-mobile" value="${appState.company.contact.mobile}">
                        </div>
                    </div>
                    <div class="form-row">
                         <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="company-email" value="${appState.company.contact.email}">
                        </div>
                        <div class="form-group">
                             <label>Address</label>
                             <input type="text" id="company-address" value="${appState.company.contact.address}">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Update Company Info</button>
                </form>
            </div>
        </section>
    `;
}

// Admin Actions
let isEditingId = null;

function toggleAdminModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('visible');
    if (modal.classList.contains('visible')) {
        document.getElementById('username').focus();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    // Hardcoded credentials for demo
    if (u === 'admin' && p === 'admin123') {
        sessionStorage.setItem('sriya_user', 'admin');
        appState.currentUser = 'admin';
        toggleAdminModal();
        checkAuth(); // update UI
        router('admin');
        showToast('Welcome back, Admin!');
    } else {
        showToast('Invalid credentials!', 'error');
    }
}

function logout() {
    sessionStorage.removeItem('sriya_user');
    appState.currentUser = null;
    window.location.reload();
}

function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('product-modal-title');

    modal.classList.add('visible');

    if (id) {
        // Edit Mode
        const p = appState.products.find(x => x.id === id);
        isEditingId = id;
        title.innerText = 'Edit Product';
        document.getElementById('product-name').value = p.name;
        document.getElementById('product-name-sinhala').value = p.sinhalaName || '';
        document.getElementById('product-category').value = p.category;
        document.getElementById('product-price').value = p.price;
        document.getElementById('product-description').value = p.description;
        document.getElementById('product-image').value = p.image;
    } else {
        // Add Mode
        isEditingId = null;
        title.innerText = 'Add Product';
        form.reset();
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('visible');
}

function handleProductSubmit(e) {
    e.preventDefault();

    const newProduct = {
        id: isEditingId || Date.now().toString(),
        name: document.getElementById('product-name').value,
        sinhalaName: document.getElementById('product-name-sinhala').value,
        category: document.getElementById('product-category').value,
        price: Number(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value || 'https://via.placeholder.com/300'
    };

    if (isEditingId) {
        const index = appState.products.findIndex(p => p.id === isEditingId);
        if (index !== -1) appState.products[index] = newProduct;
        showToast('Product updated successfully!');
    } else {
        appState.products.push(newProduct);
        showToast('Product added successfully!');
    }

    saveData();
    closeProductModal();
    renderAdminDashboard();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        appState.products = appState.products.filter(p => p.id !== id);
        saveData();
        renderAdminDashboard();
        showToast('Product deleted.');
    }
}

function editProduct(id) {
    openProductModal(id);
}

function handleCompanyUpdate(e) {
    e.preventDefault();
    appState.company.about = document.getElementById('company-about').value;
    appState.company.contact.phone = document.getElementById('company-phone').value;
    appState.company.contact.mobile = document.getElementById('company-mobile').value;
    appState.company.contact.email = document.getElementById('company-email').value;
    appState.company.contact.address = document.getElementById('company-address').value;

    saveData();
    showToast('Company details updated!');
}

// Helpers
function filterProducts(category) {
    const list = document.getElementById('products-list');
    if (category === 'all') {
        list.innerHTML = appState.products.map(p => createProductCard(p)).join('');
    } else {
        const filtered = appState.products.filter(p => p.category === category);
        list.innerHTML = filtered.length ? filtered.map(p => createProductCard(p)).join('') : '<p>No products found in this category.</p>';
    }
}

function truncate(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;
}

function showToast(message, type = 'success') {
    const t = document.getElementById('toast');
    t.innerText = message;
    t.style.backgroundColor = type === 'error' ? '#d32f2f' : '#388e3c';
    t.classList.remove('hidden');
    t.classList.add('visible'); // Add animation class if needed, or just display block
    t.style.display = 'block';

    setTimeout(() => {
        t.style.display = 'none';
    }, 3000);
}


function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
    // Ensure CSS handles .mobile-menu.active { display: flex; }
}

// Add CSS for mobile menu active state
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .mobile-menu.active {
        display: flex !important;
    }
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 3000;
        display: none;
        color: white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideUp 0.3s ease-out;
    }
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

