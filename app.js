import { productsAPI, categoriesAPI, usersAPI, ordersAPI, auth } from './services/api.js';

const state = {
    products: [],
    categories: [],
    // Modified cart structure: array of objects, each containing product and quantity
    cart: [], // Example: [{ product: {id: 1, ...}, quantity: 2 }]
    currentFilter: 'all',
    searchQuery: '',
    currentUser: null, // Track logged in user
    loading: false,
    error: null
};

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const navCategories = document.getElementById('nav-categories');
const searchBar = document.getElementById('search-bar');
const productsTitle = document.getElementById('products-title');
const cartIcon = document.querySelector('button[aria-label="Shopping Cart"]');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// New Cart Modal DOM Elements
const cartModal = document.getElementById('cart-modal');
const cartPanel = document.getElementById('cart-panel');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalDisplay = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Checkout Page Elements
const mainContent = document.querySelector('main');
const checkoutPage = document.getElementById('checkout-page');
const backToStoreBtn = document.getElementById('back-to-store-btn');
const checkoutForm = document.getElementById('checkout-form');
const placeOrderBtn = document.getElementById('place-order-btn');
const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const shippingNameInput = document.getElementById('shipping-name');
const shippingEmailInput = document.getElementById('shipping-email');
// New checkout form field elements
const shippingZipInput = document.getElementById('shipping-zip');
const shippingCityInput = document.getElementById('shipping-city');
const shippingStateInput = document.getElementById('shipping-state');

// New Auth Modal DOM Elements
const authModal = document.getElementById('auth-modal');
const authModalContent = document.getElementById('auth-modal-content');
const closeAuthBtn = document.getElementById('close-auth-btn');
const userProfileBtn = document.getElementById('user-profile-btn');

// New Search Clear Button DOM Element
const clearSearchBtn = document.getElementById('clear-search-btn');

// Remove tab-related DOM elements as tabs are removed
// const loginTabBtn = document.getElementById('login-tab-btn');
// const registerTabBtn = document.getElementById('register-tab-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authModalTitle = document.getElementById('auth-modal-title');
const profileView = document.getElementById('profile-view');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const logoutBtn = document.getElementById('logout-btn');

// Profile Edit Elements
const profileDisplayView = document.getElementById('profile-display-view');
const profileEditView = document.getElementById('profile-edit-view');
const editProfileBtn = document.getElementById('edit-profile-btn');
const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');
const editProfileForm = document.getElementById('edit-profile-form');
const editNameInput = document.getElementById('edit-name');
const editEmailInput = document.getElementById('edit-email');

// New Auth Form Toggle Buttons
const showRegisterBtn = document.getElementById('show-register-btn'); // New element
const showLoginBtn = document.getElementById('show-login-btn'); // New element

// RENDER FUNCTIONS
const renderProductCard = (product) => {
    const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden product-card flex flex-col">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-sm text-gray-500 mt-1 flex-grow">${product.description}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xl font-bold text-orange-500">$${product.price.toFixed(2)}</span>
                    <span class="text-yellow-400">${ratingStars}</span>
                </div>
                <button data-product-id="${product._id}" class="add-to-cart-btn w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `;
};

const renderProducts = async () => {
    try {
        state.loading = true;
        showLoading();

        const filters = {};
        if (state.currentFilter !== 'all') {
            filters.category = state.currentFilter;
        }
        if (state.searchQuery) {
            filters.search = state.searchQuery;
        }

        const response = await productsAPI.getAll(filters);
        state.products = response.products || response;

        if (state.products.length === 0) {
            productGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center">No se encontraron productos.</p>`;
        } else {
            productGrid.innerHTML = state.products.map(renderProductCard).join('');
        }
        addCartButtonListeners();
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Error al cargar productos: ${error.message}</p>`;
    } finally {
        state.loading = false;
        hideLoading();
    }
};

const renderCategories = async () => {
    try {
        if (state.categories.length === 0) {
            const categories = await categoriesAPI.getAll();
            state.categories = categories;
        }

        const categoryLinksHTML = state.categories.map(cat => `
            <a href="#" data-category="${cat.id}" class="nav-link block py-2 px-1 md:p-0 ${state.currentFilter === cat.id ? 'active' : ''}">${cat.name}</a>
        `).join('');

        navCategories.innerHTML = categoryLinksHTML;
        mobileMenu.innerHTML = categoryLinksHTML; // Also render for mobile

        addCategoryLinkListeners();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

const updateCartCount = () => {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
};

const renderCart = () => {
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">El carrito está vacío.</p>';
        cartTotalDisplay.textContent = '$0.00';
        return;
    }

    let cartHTML = '';
    let total = 0;

    state.cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        cartHTML += `
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg shadow-sm">
                <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded-md">
                <div class="flex-grow">
                    <h4 class="text-base font-semibold text-gray-800">${item.product.name}</h4>
                    <p class="text-sm text-gray-600">Precio: $${itemTotal.toFixed(2)}</p>
                    <div class="flex items-center mt-2">
                        <button data-product-id="${item.product._id}" data-action="decrease" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-300 transition-colors">-</button>
                        <span class="px-3 py-1 bg-gray-100 border-t border-b border-gray-200 text-gray-800">${item.quantity}</span>
                        <button data-product-id="${item.product._id}" data-action="increase" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-300 transition-colors">+</button>
                    </div>
                </div>
                <button data-product-id="${item.product._id}" data-action="remove" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalDisplay.textContent = `$${total.toFixed(2)}`;

    addCartItemControlListeners(); // Add listeners for +/-/remove buttons
};

// New function to render auth modal content based on login state
const renderAuthModal = () => {
    if (state.currentUser) {
        // Show Profile View
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        profileView.classList.remove('hidden');

        authModalTitle.textContent = 'Mi Perfil';
        profileName.textContent = state.currentUser.name;
        profileEmail.textContent = state.currentUser.email;
        
        // Show admin panel if user is admin
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            if (state.currentUser.role === 'admin') {
                adminPanel.classList.remove('hidden');
            } else {
                adminPanel.classList.add('hidden');
            }
        }
    } else {
        // Show Login Form
        profileView.classList.add('hidden');
        showLoginForm(); // Re-use existing function to show login form
    }
};

// Functions to switch between profile display and edit views
const showProfileDisplay = () => {
    profileDisplayView.classList.remove('hidden');
    profileEditView.classList.add('hidden');
    authModalTitle.textContent = 'Mi Perfil';
};

const showProfileEdit = () => {
    // Pre-fill form with current user data
    if (state.currentUser) {
        editNameInput.value = state.currentUser.name;
        editEmailInput.value = state.currentUser.email;
    }
    profileDisplayView.classList.add('hidden');
    profileEditView.classList.remove('hidden');
    authModalTitle.textContent = 'Editar Perfil';
};

// EVENT HANDLERS & LISTENERS

const flyToAnimate = (startElement, endElement) => {
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    let flyingEl;

    // Check if the start element is an image or contains one
    const imgInStart = startElement.querySelector('img') || (startElement.tagName === 'IMG' ? startElement : null);
    
    if (imgInStart) {
        flyingEl = imgInStart.cloneNode(true);
        flyingEl.style.width = `${startRect.width}px`;
        flyingEl.style.height = `${startRect.height}px`;
        flyingEl.style.borderRadius = '0.5rem';
        flyingEl.style.objectFit = 'cover';
    } else {
        // Fallback for elements without images (like text buttons)
        flyingEl = document.createElement('div');
        flyingEl.style.width = `${startRect.width}px`;
        flyingEl.style.height = `${startRect.height}px`;
        flyingEl.style.backgroundColor = 'rgba(249, 115, 22, 0.8)'; // orange-500 with opacity
        flyingEl.style.borderRadius = '9999px';
    }
    
    flyingEl.style.position = 'fixed';
    flyingEl.style.left = `${startRect.left}px`;
    flyingEl.style.top = `${startRect.top}px`;
    flyingEl.style.zIndex = '1000';
    flyingEl.style.transition = 'left 1s cubic-bezier(0.5, 0, 1, 0.5), top 1s cubic-bezier(0.5, 0, 1, 0.5), width 1s ease-in-out, height 1s ease-in-out, opacity 0.8s ease-in-out, transform 1s ease-in-out';
    
    document.body.appendChild(flyingEl);

    // Force a reflow to apply initial styles before transitioning
    flyingEl.offsetHeight; 

    // Animate to end element
    flyingEl.style.left = `${endRect.left + endRect.width / 2}px`;
    flyingEl.style.top = `${endRect.top + endRect.height / 2}px`;
    flyingEl.style.width = '0px';
    flyingEl.style.height = '0px';
    flyingEl.style.opacity = '0';
    flyingEl.style.transform = 'rotate(360deg) scale(0.2)';


    flyingEl.addEventListener('transitionend', () => {
        flyingEl.remove();
        endElement.classList.add('jiggle');
        const countEl = endElement.querySelector('#cart-count') || endElement;
        countEl.classList.add('pop');
        setTimeout(() => {
            endElement.classList.remove('jiggle');
            countEl.classList.remove('pop');
        }, 500); 
    });
};

const handleAddToCart = (productId, buttonElement) => {
    const productToAdd = state.products.find(p => p._id === productId);
    if (productToAdd) {
        const existingItem = state.cart.find(item => item.product._id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ product: productToAdd, quantity: 1 });
        }
        updateCartCount();
        renderCart(); // Update cart modal content
        flyToAnimate(buttonElement.closest('.product-card'), cartIcon);
        console.log(`${productToAdd.name} añadido al carrito.`);
        console.log(state.cart);
    }
};

const handleCartItemControl = (productId, action) => {
    const itemIndex = state.cart.findIndex(item => item.product._id === productId);

    if (itemIndex > -1) {
        if (action === 'increase') {
            state.cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            state.cart[itemIndex].quantity--;
            if (state.cart[itemIndex].quantity <= 0) {
                state.cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
                console.log(`Product ID ${productId} removed from cart due to quantity <= 0.`);
            }
        } else if (action === 'remove') {
            state.cart.splice(itemIndex, 1); // Directly remove the item
            console.log(`Product ID ${productId} explicitly removed from cart.`);
        }
    }
    updateCartCount();
    renderCart(); // Re-render the cart modal
    renderCheckoutSummary(); // Also update checkout summary if visible
};

const addCartButtonListeners = () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.productId;
            handleAddToCart(productId, e.target);
        });
    });
};

const addCartItemControlListeners = () => {
    cartItemsContainer.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            const action = e.currentTarget.dataset.action;
            handleCartItemControl(productId, action);
        });
    });
};

const handleCategoryFilter = (categoryId) => {
    state.currentFilter = categoryId;
    state.searchQuery = ''; // Reset search on category change
    searchBar.value = '';
    const categoryName = state.categories.find(c => c.id === categoryId)?.name || 'Productos';
    productsTitle.textContent = categoryId === 'all' ? 'Productos Destacados' : `${categoryName}`;
    renderCategories(); // Re-render to update active class
    renderProducts();
    mobileMenu.classList.add('hidden'); // Hide mobile menu on selection
};

const addCategoryLinkListeners = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = e.target.dataset.category;
            handleCategoryFilter(categoryId);
        });
    });
};

const handleSearch = (query) => {
    state.searchQuery = query.toLowerCase().trim();
    state.currentFilter = 'all'; // Reset category filter when searching
    productsTitle.textContent = query ? `Resultados para: "${query}"` : 'Productos Destacados';
    renderCategories(); // Re-render to update active class
    renderProducts();
    toggleClearSearchBtn();
};

const toggleClearSearchBtn = () => {
    if (searchBar.value) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }
};

const showCartModal = () => {
    cartModal.classList.remove('hidden');
    // Force reflow to apply 'display' before starting transitions
    cartModal.offsetWidth;
    cartModal.classList.add('open');
};

const hideCartModal = () => {
    cartModal.classList.remove('open');
    cartPanel.addEventListener('transitionend', () => {
        // Only hide after the panel transition is complete
        if (!cartModal.classList.contains('open')) {
            cartModal.classList.add('hidden');
        }
    }, { once: true });
};

// CHECKOUT PAGE LOGIC

const renderCheckoutSummary = () => {
    if (state.cart.length === 0) {
        checkoutSummaryItems.innerHTML = '<p class="text-gray-500 text-center">Tu carrito está vacío.</p>';
        checkoutSubtotal.textContent = '$0.00';
        checkoutTotal.textContent = '$0.00';
        placeOrderBtn.disabled = true;
        return;
    }

    let summaryHTML = '';
    let subtotal = 0;

    state.cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;
        summaryHTML += `
            <div class="flex justify-between items-center text-sm">
                <div class="flex items-center gap-2">
                    <img src="${item.product.image}" class="w-12 h-12 object-cover rounded-md" />
                    <div>
                        <p class="font-medium text-gray-800">${item.product.name}</p>
                        <p class="text-gray-500">Cantidad: ${item.quantity}</p>
                    </div>
                </div>
                <span class="font-semibold text-gray-800">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    checkoutSummaryItems.innerHTML = summaryHTML;
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    // Assuming free shipping for now
    checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
    placeOrderBtn.disabled = false;
};

const showCheckoutPage = () => {
    if (state.cart.length === 0) {
        // Optional: show a message that cart is empty instead of navigating.
        alert("Tu carrito está vacío. Añade productos antes de proceder al pago.");
        return;
    }
    renderCheckoutSummary();
    hideCartModal();
    mainContent.classList.add('hidden');
    checkoutPage.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Pre-fill user info if logged in
    if (state.currentUser) {
        shippingNameInput.value = state.currentUser.name;
        shippingEmailInput.value = state.currentUser.email;
    }
};

const hideCheckoutPage = () => {
    mainContent.classList.remove('hidden');
    checkoutPage.classList.add('hidden');
    checkoutForm.reset();
    window.scrollTo(0, 0);
};

const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!checkoutForm.checkValidity()) {
        checkoutForm.reportValidity();
        return;
    }

    if (!state.currentUser) {
        alert('Debes iniciar sesión para realizar un pedido');
        return;
    }
    
    try {
        // Prepare order data
        const orderData = {
            items: state.cart.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            })),
            shippingInfo: {
                name: document.getElementById('shipping-name').value,
                email: document.getElementById('shipping-email').value,
                address: document.getElementById('shipping-address').value,
                city: document.getElementById('shipping-city').value,
                state: document.getElementById('shipping-state').value,
                zipCode: document.getElementById('shipping-zip').value
            },
            paymentInfo: {
                cardNumber: document.getElementById('card-number').value,
                expiryDate: document.getElementById('card-expiry').value,
                cvc: document.getElementById('card-cvc').value
            }
        };

        const order = await ordersAPI.create(orderData);
        console.log('Order created:', order);
        
        // Animate items flying away
        const summaryItems = checkoutSummaryItems.querySelectorAll('.flex.justify-between');
        summaryItems.forEach((item, index) => {
            item.style.transition = `all 0.5s ease ${index * 0.1}s`;
            item.style.transform = 'translateX(200%)';
            item.style.opacity = '0';
        });
        
        setTimeout(() => {
            alert(`¡Gracias por tu compra! Tu pedido ${order.orderNumber} ha sido realizado con éxito.`);
            // Clear cart
            state.cart = [];
            updateCartCount();
            renderCart();
            
            // Hide checkout and show main page
            hideCheckoutPage();
        }, 500 + summaryItems.length * 100);
    } catch (error) {
        console.error('Order placement error:', error);
        alert('Error al realizar el pedido: ' + error.message);
    }
};

// Changed to function declarations to ensure hoisting
function showAuthModal() {
    renderAuthModal(); // Decide what to show before opening
    authModal.classList.remove('hidden');
    // We use a small timeout to allow the display property to be applied before starting the transition
    setTimeout(() => {
        authModal.classList.add('open');
    }, 10); 
}

// Changed to function declarations to ensure hoisting
function hideAuthModal() {
    authModal.classList.remove('open');
    authModal.addEventListener('transitionend', () => {
        // Only hide after the transition is complete
        if (!authModal.classList.contains('open')) { // Ensure it's still closed
            authModal.classList.add('hidden');
        }
    }, { once: true });
}

// Functions to switch between login and register forms
function showLoginForm() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    authModalTitle.textContent = 'Iniciar Sesión';
}

function showRegisterForm() {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    authModalTitle.textContent = 'Crear Cuenta';
}

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const response = await usersAPI.login({ email, password });
        
        // Store token and user data
        auth.setToken(response.token);
        auth.setUser(response.user);
        state.currentUser = response.user;

        loginForm.reset();
        renderAuthModal();
        console.log('Login successful');
    } catch (error) {
        console.error('Login error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        const response = await usersAPI.register({ name, email, password });
        
        // Store token and user data
        auth.setToken(response.token);
        auth.setUser(response.user);
        state.currentUser = response.user;

        registerForm.reset();
        renderAuthModal();
        showProfileDisplay();
        console.log('Registration successful');
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error al registrar usuario: ' + error.message);
    }
};

const handleLogout = () => {
    state.currentUser = null;
    auth.logout();
    // After logging out, show the login form and hide profile views
    profileView.classList.add('hidden');
    showLoginForm();
};

const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        const newName = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;

        const response = await usersAPI.updateProfile({ name: newName, email: newEmail });
        
        // Update local state
        state.currentUser = response;
        auth.setUser(response);
        
        renderAuthModal();
        alert('¡Perfil actualizado con éxito!');
        showProfileDisplay();
    } catch (error) {
        console.error('Profile update error:', error);
        alert('Error al actualizar perfil: ' + error.message);
    }
};

// New Postal Code Autocomplete Function
const handlePostalCodeAutocomplete = async (e) => {
    const postalCode = e.target.value;
    // Spanish postal codes are 5 digits
    if (postalCode.length === 5 && /^\d{5}$/.test(postalCode)) {
        try {
            // Add a small loading indicator if desired
            shippingCityInput.value = 'Buscando...';
            shippingStateInput.value = 'Buscando...';

            const response = await fetch(`https://api.zippopotam.us/es/${postalCode}`);
            if (!response.ok) {
                throw new Error('Código postal no encontrado');
            }
            const data = await response.json();

            // Populate fields with data from the API
            const place = data.places[0];
            shippingCityInput.value = place['place name'] || '';
            shippingStateInput.value = place['state'] || '';

            // Focus the address line for a better user experience
            document.getElementById('shipping-address').focus();

        } catch (error) {
            console.error("Error fetching postal code data:", error);
            // Clear fields if postal code is invalid
            shippingCityInput.value = '';
            shippingStateInput.value = '';
            shippingCityInput.placeholder = 'Ciudad';
            shippingStateInput.placeholder = 'Provincia';
        }
    }
};

// Loading functions
const showLoading = () => {
    if (!document.getElementById('loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50';
        spinner.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p class="text-gray-600">Cargando...</p>
            </div>
        `;
        document.body.appendChild(spinner);
    }
};

const hideLoading = () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
};

// ADMIN PANEL FUNCTIONS

// Admin Products Management
const showAdminProducts = async () => {
    try {
        hideAuthModal();
        const response = await productsAPI.getAllForAdmin();
        const products = response.products || response;
        
        const adminContent = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="admin-products-modal">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 class="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
                        <div class="flex gap-2">
                            <button id="add-product-btn" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Agregar Producto
                            </button>
                            <button id="close-admin-products" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[70vh]">
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white border border-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    ${products.map(product => `
                                        <tr>
                                            <td class="px-4 py-2">
                                                <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded">
                                            </td>
                                            <td class="px-4 py-2 font-medium text-gray-900">${product.name}</td>
                                            <td class="px-4 py-2 text-gray-900">$${product.price.toFixed(2)}</td>
                                            <td class="px-4 py-2 text-gray-900">${product.category}</td>
                                            <td class="px-4 py-2">
                                                <span class="px-2 py-1 text-xs rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    ${product.inStock ? 'En Stock' : 'Agotado'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-2">
                                                <button onclick="editProduct('${product._id}')" class="text-blue-600 hover:text-blue-800 mr-2">Editar</button>
                                                <button onclick="deleteProduct('${product._id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adminContent);
        
        // Add event listeners
        document.getElementById('close-admin-products').addEventListener('click', () => {
            document.getElementById('admin-products-modal').remove();
        });
        
        document.getElementById('add-product-btn').addEventListener('click', showAddProductForm);
        
    } catch (error) {
        console.error('Error loading admin products:', error);
        alert('Error al cargar productos: ' + error.message);
    }
};

// Admin Categories Management
const showAdminCategories = async () => {
    try {
        hideAuthModal();
        const categories = await categoriesAPI.getAllForAdmin();
        
        const adminContent = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="admin-categories-modal">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 class="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
                        <div class="flex gap-2">
                            <button id="add-category-btn" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Agregar Categoría
                            </button>
                            <button id="close-admin-categories" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[70vh]">
                        <div class="grid gap-4">
                            ${categories.map(category => `
                                <div class="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <h3 class="font-semibold text-gray-900">${category.name}</h3>
                                        <p class="text-gray-600 text-sm">${category.description}</p>
                                        <span class="px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            ${category.isActive ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="editCategory('${category.id}')" class="text-blue-600 hover:text-blue-800">Editar</button>
                                        <button onclick="deleteCategory('${category.id}')" class="text-red-600 hover:text-red-800">
                                            ${category.isActive ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adminContent);
        
        // Add event listeners
        document.getElementById('close-admin-categories').addEventListener('click', () => {
            document.getElementById('admin-categories-modal').remove();
        });
        
        document.getElementById('add-category-btn').addEventListener('click', showAddCategoryForm);
        
    } catch (error) {
        console.error('Error loading admin categories:', error);
        alert('Error al cargar categorías: ' + error.message);
    }
};

// Admin Orders Management
const showAdminOrders = async () => {
    try {
        hideAuthModal();
        const orders = await ordersAPI.getAll();
        
        const adminContent = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="admin-orders-modal">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 class="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
                        <button id="close-admin-orders" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[70vh]">
                        <div class="space-y-4">
                            ${orders.length > 0 ? orders.map(order => `
                                <div class="border rounded-lg p-4">
                                    <div class="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 class="font-semibold text-gray-900">Pedido #${order.orderNumber || order._id.slice(-6)}</h3>
                                            <p class="text-gray-600 text-sm">Cliente: ${order.shippingInfo?.name || 'N/A'}</p>
                                            <p class="text-gray-600 text-sm">Email: ${order.shippingInfo?.email || 'N/A'}</p>
                                        </div>
                                        <div class="text-right">
                                            <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                ${order.status || 'Pendiente'}
                                            </span>
                                            <p class="text-lg font-bold text-gray-900 mt-1">$${order.total?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        <p>Fecha: ${new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p>Productos: ${order.items?.length || 0} artículos</p>
                                    </div>
                                </div>
                            `).join('') : '<p class="text-gray-500 text-center">No hay pedidos disponibles</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adminContent);
        
        // Add event listeners
        document.getElementById('close-admin-orders').addEventListener('click', () => {
            document.getElementById('admin-orders-modal').remove();
        });
        
    } catch (error) {
        console.error('Error loading admin orders:', error);
        alert('Error al cargar pedidos: ' + error.message);
    }
};

// Admin Users Management
const showAdminUsers = () => {
    hideAuthModal();
    alert('Funcionalidad de gestión de usuarios en desarrollo. Esta función permitirá ver y gestionar todos los usuarios registrados.');
};

// Product Management Functions
const showAddProductForm = () => {
    const formContent = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="product-form-modal">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div class="flex justify-between items-center p-6 border-b">
                    <h2 class="text-2xl font-bold text-gray-800">Agregar Producto</h2>
                    <button id="close-product-form" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form id="product-form" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input type="text" name="name" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea name="description" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" rows="3"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                            <input type="number" name="price" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="">Seleccionar categoría</option>
                                <option value="alimento">Alimento</option>
                                <option value="juguetes">Juguetes</option>
                                <option value="accesorios">Accesorios</option>
                                <option value="salud">Salud</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                        <input type="url" name="image" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                            <input type="number" name="rating" min="1" max="5" value="5" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" name="inStock" checked class="mr-2">
                            <label class="text-sm font-medium text-gray-700">En Stock</label>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 pt-4">
                        <button type="button" id="cancel-product-form" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                            Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formContent);
    
    // Add event listeners
    document.getElementById('close-product-form').addEventListener('click', () => {
        document.getElementById('product-form-modal').remove();
    });
    
    document.getElementById('cancel-product-form').addEventListener('click', () => {
        document.getElementById('product-form-modal').remove();
    });
    
    document.getElementById('product-form').addEventListener('submit', handleAddProduct);
};

const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image'),
            rating: parseInt(formData.get('rating')),
            inStock: formData.has('inStock')
        };
        
        await productsAPI.create(productData);
        alert('Producto creado exitosamente');
        document.getElementById('product-form-modal').remove();
        document.getElementById('admin-products-modal').remove();
        showAdminProducts(); // Refresh the products list
    } catch (error) {
        console.error('Error creating product:', error);
        alert('Error al crear producto: ' + error.message);
    }
};

// Global functions for product management
window.editProduct = async (productId) => {
    try {
        const product = await productsAPI.getById(productId);
        // Similar form to add but pre-filled with product data
        alert('Función de editar producto en desarrollo. ID: ' + productId);
    } catch (error) {
        console.error('Error loading product for edit:', error);
        alert('Error al cargar producto: ' + error.message);
    }
};

window.deleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await productsAPI.delete(productId);
            alert('Producto eliminado exitosamente');
            document.getElementById('admin-products-modal').remove();
            showAdminProducts(); // Refresh the products list
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar producto: ' + error.message);
        }
    }
};

// Category Management Functions
const showAddCategoryForm = () => {
    alert('Función de agregar categoría en desarrollo');
};

window.editCategory = (categoryId) => {
    alert('Función de editar categoría en desarrollo. ID: ' + categoryId);
};

window.deleteCategory = async (categoryId) => {
    if (confirm('¿Estás seguro de que quieres cambiar el estado de esta categoría?')) {
        try {
            await categoriesAPI.delete(categoryId);
            alert('Estado de categoría cambiado exitosamente');
            document.getElementById('admin-categories-modal').remove();
            showAdminCategories(); // Refresh the categories list
        } catch (error) {
            console.error('Error changing category status:', error);
            alert('Error al cambiar estado de categoría: ' + error.message);
        }
    }
};

// INITIALIZATION
const init = async () => {
    try {
        // Check for a logged-in user and token
        const savedUser = auth.getUser();
        const token = auth.getToken();
        
        if (savedUser && token) {
            state.currentUser = savedUser;
        }

        // Load initial data
        await renderCategories();
        await renderProducts();
        updateCartCount();
        renderCart(); // Initial render of the empty cart modal

        searchBar.addEventListener('input', (e) => handleSearch(e.target.value));
        toggleClearSearchBtn(); // Initial check for clear button
        
        // Add event listener for the new clear search button
        clearSearchBtn.addEventListener('click', () => {
            searchBar.value = '';
            handleSearch('');
        });

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cart Modal Event Listeners
        cartIcon.addEventListener('click', showCartModal);
        closeCartBtn.addEventListener('click', hideCartModal);
        checkoutBtn.addEventListener('click', showCheckoutPage);
        // Close modal if clicking outside the sidebar content
        cartModal.addEventListener('click', (e) => {
            // If the click target is the modal overlay itself (not the panel)
            if (e.target === cartModal) {
                hideCartModal();
            }
        });

        // Checkout Page Listeners
        backToStoreBtn.addEventListener('click', hideCheckoutPage);
        checkoutForm.addEventListener('submit', handlePlaceOrder);
        shippingZipInput.addEventListener('input', handlePostalCodeAutocomplete);

        // Auth Modal Event Listeners
        userProfileBtn.addEventListener('click', showAuthModal);
        closeAuthBtn.addEventListener('click', hideAuthModal);
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });

        // New: Event listeners for switching auth forms
        showRegisterBtn.addEventListener('click', showRegisterForm);
        showLoginBtn.addEventListener('click', showLoginForm);

        // Profile view switch listeners
        editProfileBtn.addEventListener('click', showProfileEdit);
        cancelEditProfileBtn.addEventListener('click', showProfileDisplay);

        // Auth form submission and logout listeners
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        editProfileForm.addEventListener('submit', handleUpdateProfile);
        logoutBtn.addEventListener('click', handleLogout);

        // Select the "Iniciar Sesión" button itself from the login form to add the register button below it.
        // The previous prompt specified adding the button below the *login* button, so this will require
        // moving the button itself or adjusting the DOM structure.
        // Let's modify the HTML slightly to place the 'show-register-btn' directly under the login submit button.
        // And then add event listeners here.
        // Get the login submit button
        const loginSubmitBtn = document.querySelector('#login-form button[type="submit"]');

        // Create the "Registrarse" button
        const newRegisterButton = document.createElement('button');
        newRegisterButton.type = 'button';
        newRegisterButton.id = 'show-register-btn';
        newRegisterButton.className = 'w-full mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium';
        newRegisterButton.textContent = '¿No tienes cuenta? Regístrate aquí.';
        
        // Insert it after the login submit button
        if (loginSubmitBtn && !document.getElementById('show-register-btn')) {
            loginSubmitBtn.after(newRegisterButton);
            newRegisterButton.addEventListener('click', showRegisterForm); // For the new "Regístrate aquí" button
        } else if (document.getElementById('show-register-btn')) {
            // If it was already there (from HTML), just add listener
            document.getElementById('show-register-btn').addEventListener('click', showRegisterForm);
        }

        // Add event listeners to the new buttons
        showLoginBtn.addEventListener('click', showLoginForm); // For the "Ya tienes cuenta?" button in register form

        // Admin panel event listeners
        const adminProductsBtn = document.getElementById('admin-products-btn');
        const adminCategoriesBtn = document.getElementById('admin-categories-btn');
        const adminOrdersBtn = document.getElementById('admin-orders-btn');
        const adminUsersBtn = document.getElementById('admin-users-btn');

        if (adminProductsBtn) {
            adminProductsBtn.addEventListener('click', showAdminProducts);
        }

        if (adminCategoriesBtn) {
            adminCategoriesBtn.addEventListener('click', showAdminCategories);
        }

        if (adminOrdersBtn) {
            adminOrdersBtn.addEventListener('click', showAdminOrders);
        }

        if (adminUsersBtn) {
            adminUsersBtn.addEventListener('click', showAdminUsers);
        }

        // Ensure login form is visible by default when modal opens (no tabs to control this)
        showLoginForm();
        // Also ensure profile display is shown by default if logged in
        showProfileDisplay();

    } catch (error) {
        console.error('Initialization error:', error);
        alert('Error al inicializar la aplicación. Por favor, recarga la página.');
    }
};

// Start the app
document.addEventListener('DOMContentLoaded', init);
