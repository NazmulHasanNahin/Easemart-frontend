document.addEventListener('DOMContentLoaded', function () {
    // Check if the script is running
    console.log('JavaScript Loaded');

    // Initialize Swiper
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});













document.addEventListener("DOMContentLoaded", () => {
    // Fetch products on page load
    fetchProducts();
});

// Function to fetch all products
async function fetchProducts() {
    try {
        const response = await fetch('https://easemart-api.onrender.com/products/products/');
        const products = await response.json();

        // Show 4 random products in the featured section
        const randomProducts = getRandomProducts(products, 4);
        displayProducts(randomProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to get random products from the list
function getRandomProducts(products, num) {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Function to display products in the featured section
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid .grid');

    productGrid.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productHTML = `
            <a href="https://easemart.netlify.app/product-details.html?id=${product.id}" class="block">
                <div class="card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
                    <div class="relative overflow-hidden">
                        <img src="${product.image || './images/default.png'}" class="w-full h-60 " alt="${product.name}">
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div class="truncate">
                                <h6 class="text-lg font-bold text-gray-900 mb-2 truncate" style="max-width: 200px;">${product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}</h6>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                        </div>
                        <div class="flex items-center gap-2 mt-2">
                            ${product.discounted_price ? `<span class="text-gray-500 line-through">$${product.original_price}</span>` : ''}
                            <span class="text-lg font-bold text-gray-900">$${product.discounted_price || product.original_price}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
        productGrid.innerHTML += productHTML;
    });
}









document.addEventListener("DOMContentLoaded", () => {
    // Fetch products on page load
    fetchProducts();
});

// Function to fetch all products
async function fetchProducts() {
    try {
        const response = await fetch('https://easemart-api.onrender.com/products/products/');
        const products = await response.json();

        // Show 4 random products in the featured section
        const randomProducts = getRandomProducts(products, 4);
        displayProducts(randomProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to get random products from the list
function getRandomProducts(products, num) {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Function to display products in the featured section
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid .grid');

    productGrid.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productHTML = `
            <a href="https://easemart.netlify.app/product-details.html?id=${product.id}" class="block">
                <div class="card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
                    <div class="relative overflow-hidden">
                        <img src="${product.image || './images/default.png'}" class="w-full h-60 " alt="${product.name}">
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div class="truncate">
                                <h6 class="text-lg font-bold text-gray-900 mb-2 truncate" style="max-width: 200px;">${product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}</h6>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                        </div>
                        <div class="flex items-center gap-2 mt-2">
                            ${product.discounted_price ? `<span class="text-gray-500 line-through">$${product.original_price}</span>` : ''}
                            <span class="text-lg font-bold text-gray-900">$${product.discounted_price || product.original_price}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
        productGrid.innerHTML += productHTML;
    });
}





document.addEventListener("DOMContentLoaded", () => {
    // Fetch products on page load
    fetchProductsForSections();
});

// Function to fetch products and display in both Featured and New Arrivals sections
async function fetchProductsForSections() {
    try {
        const response = await fetch('https://easemart-api.onrender.com/products/products/');
        const products = await response.json();

        // Show 4 random products in the featured section
        const randomFeaturedProducts = getRandomProducts(products, 4);
        displayProducts(randomFeaturedProducts, 'product-grid');

        // Show 4 random products in the new arrivals section
        const randomNewArrivalsProducts = getRandomProducts(products, 4);
        displayProducts(randomNewArrivalsProducts, 'new-arrivals-grid');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products in the respective section
function displayProducts(products, sectionClass) {
    const productGrid = document.querySelector(`.${sectionClass} .grid`);

    productGrid.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productHTML = `
            <a href="https://easemart.netlify.app/product-details.html?id=${product.id}" class="block">
                <div class="card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105">
                    <div class="relative overflow-hidden">
                        <img src="${product.image || './images/default.png'}" class="w-full h-60 " alt="${product.name}">
                    </div>
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h6 class="text-lg font-bold text-gray-900 mb-2">${product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}</h6>
                            </div>
                        </div>
                        <div class="flex items-center mt-2">
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                            <i class="bx bxs-star text-yellow-500"></i>
                        </div>
                        <div class="flex items-center gap-2 mt-2">
                            ${product.discounted_price ? `<span class="text-gray-500 line-through">$${product.original_price}</span>` : ''}
                            <span class="text-lg font-bold text-gray-900">$${product.discounted_price || product.original_price}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
        productGrid.innerHTML += productHTML;
    });
}
