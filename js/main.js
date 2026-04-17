// Product Data
const products = [
    {
        id: 1,
        title: "Original Jasmine Green Tea",
        price: 15000,
        desc: "Teh hijau melati murni yang menyegarkan dengan aroma bunga yang menenangkan.",
        image: "assets/img/jasmine.png",
        color: "var(--clr-jasmine)"
    },
    {
        id: 2,
        title: "Signature Thai Milk Tea",
        price: 22000,
        desc: "Teh Thailand autentik dengan rasa creamy dan manis yang pas.",
        image: "assets/img/thai.png",
        color: "var(--clr-thai)"
    },
    {
        id: 3,
        title: "Sweet Peach Blossom",
        price: 20000,
        desc: "Perpaduan teh berkualitas dengan ekstrak buah persik asli yang manis.",
        image: "assets/img/peach.png",
        color: "var(--clr-peach)"
    },
    {
        id: 4,
        title: "Royal Lychee Rose",
        price: 20000,
        desc: "Sensasi kemewahan teh mawar dengan potongan buah leci segar.",
        image: "assets/img/lychee.png",
        color: "var(--clr-lychee)"
    },
    {
        id: 5,
        title: "Creamy Taro Fusion",
        price: 25000,
        desc: "Varian taro yang gurih dan manis, lengkap dengan tekstur yang lembut.",
        image: "assets/img/taro.png",
        color: "var(--clr-taro)"
    }
];

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initStickyNav();
});

function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image" style="background-color: ${product.color}">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.desc}</p>
                <button class="btn btn-primary add-to-cart" style="width: 100%" onclick="addToCart(${product.id})">
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

function initStickyNav() {
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '10px 0';
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            nav.style.padding = '20px 0';
            nav.style.boxShadow = 'none';
        }
    });
}
