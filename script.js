
const products = [
    {
        id: 1,
        name: "Batik Parang",
        price: 250000,
        description: "Batik motif parang klasik dari Solo",
        image: "img/batikparang.jpeg"
    },
    {
        id: 2,
        name: "Batik Mega Mendung",
        price: 230000,
        description: "Batik Cirebon dengan motif mega mendung",
        image: "img/batikmegamendung.jpeg"
    },
    {
        id: 3,
        name: "Batik Kawung",
        price: 180000,
        description: "Batik Yogyakarta motif kawung elegan",
        image: "img/batikkawung.jpeg"
    },
    {
        id: 4,
        name: "Batik motif modern",
        price: 225000,
        description: "Batik Pekalongan warna-warni cerah",
        image: "img/batiktujuhrupa.jpeg"
    },
    {
        id: 5,
        name: "Batik Sidomukti",
        price: 350000,
        description: "Batik Solo motif sidomukti untuk acara resmi",
        image: "img/batiksidomukti.jpeg"
    },
    {
        id: 6,
        name: "Batik Lasem",
        price: 280000,
        description: "Batik Lasem dengan warna merah khas",
        image: "img/batiklasem.jpeg"
    },
    {
        id: 7,
        name: "Batik trusme",
        price: 290000,
        description: "mencerminkan semangat pertumbuhan dan kelestarian",
        image: "img/batiktrusme.jpeg"
    },
    {
        id: 8,
        name: "Batik mayung",
        price: 260000,
        description: "sosok yang elegan dan mampu mengatasi berbagai masalah",
        image: "img/batikmayung.jpeg"
    }
];

// Variabel Global
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const thankyouModal = document.getElementById('thankyou-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');
const backToShopBtn = document.getElementById('back-to-shop');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Cart icon click
    document.querySelector('.cart-icon').addEventListener('click', openCartModal);
    
    // Close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
            thankyouModal.style.display = 'none';
        });
    });
    
    // Checkout button in cart
    checkoutBtn.addEventListener('click', openCheckoutModal);
    
    // Checkout form submit
    checkoutForm.addEventListener('submit', processCheckout);
    
    // Back to shop button
    backToShopBtn.addEventListener('click', () => {
        thankyouModal.style.display = 'none';
        cart = [];
        updateCart();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === checkoutModal) checkoutModal.style.display = 'none';
        if (e.target === thankyouModal) thankyouModal.style.display = 'none';
    });
});

// Fungsi untuk menampilkan produk
function renderProducts() {
    productContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">Rp ${product.price.toLocaleString()}</span>
                    <button class="add-to-cart" data-id="${product.id}">+ Keranjang</button>
                </div>
            </div>
        `;
        
        productContainer.appendChild(productCard);
    });
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Cek apakah produk sudah ada di keranjang
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Animasi feedback
    e.target.textContent = '✓ Ditambahkan';
    e.target.style.backgroundColor = '#4caf50';
    setTimeout(() => {
        e.target.textContent = '+ Keranjang';
        e.target.style.backgroundColor = '#d4a373';
    }, 1000);
}

// Fungsi untuk memperbarui keranjang
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'block') {
        renderCartItems();
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Keranjang belanja Anda kosong.</p>';
        cartTotal.textContent = 'Rp 0';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString()}</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Fungsi untuk mengurangi jumlah item
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // Jika quantity 1, hapus item
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Fungsi untuk menambah jumlah item
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}

// Fungsi untuk menghapus item
function removeItem(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Fungsi untuk membuka modal keranjang
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'block';
}

// Fungsi untuk membuka modal checkout
function openCheckoutModal() {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
}

function processCheckout(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        payment: document.getElementById('payment').value,
        items: [...cart],
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    
    console.log('Data Checkout:', formData);
    
    checkoutModal.style.display = 'none';
    thankyouModal.style.display = 'block';
    
    checkoutForm.reset();
}   