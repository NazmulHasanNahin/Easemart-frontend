// Function to get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');  // Assuming you pass the product ID as ?id=<product_id>
}

// Fetch and display product details
function fetchProductDetails() {
    const productId = getProductIdFromUrl();

    if (productId) {
        fetch(`https://ease-mart-api.vercel.app/products/products/${productId}`)
            .then(response => response.json())
            .then(product => displayProductDetails(product))
            .catch(error => console.error('Error fetching product details:', error));
    } else {
        console.error('Product ID not found in URL.');
    }
}

// Function to handle tab switching
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove 'block' class and hide all panels
            tabPanels.forEach(panel => panel.classList.add('hidden'));
            
            // Remove focus class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('border-black', 'text-black'));

            // Add 'block' class to the selected panel
            tabPanels[index].classList.remove('hidden');

            // Highlight the active tab button
            button.classList.add('border-black', 'text-black');
        });
    });
}

// Function to display a custom alert with Tailwind CSS
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('p-4', 'rounded', 'shadow-lg', 'max-w-sm', 'mb-4', 'text-white', 'transition', 'duration-500', 'ease-in-out');

    if (type === 'error') {
        alertDiv.classList.add('bg-red-500');
    } else if (type === 'success') {
        alertDiv.classList.add('bg-green-500');
    }

    alertDiv.textContent = message;

    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.add('opacity-0');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

// Function to add a product to the cart
function addToCart(productId) {
    const token = localStorage.getItem('token');
    const accountType = localStorage.getItem('account_type');

    if (!token) {
        window.location.href = 'signin.html';
        return;
    }

    if (accountType !== 'customer') {
        showAlert('Only customers can add products to the cart.', 'error');  // Show error alert
        return;
    }

    fetch(`https://ease-mart-api.vercel.app/products/cart/add/${productId}/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: 1,
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add product to cart.');
        }
    })
    .then(data => {
        showAlert(data.message, 'success');  // Show success alert
    })
    .catch(error => {
        showAlert(error.message, 'error');  // Show error alert
    });
}


// Display product details
function displayProductDetails(product) {
    const productContainer = document.querySelector('.product-details');
    
    if (productContainer) {
        productContainer.innerHTML = `
            <!-- Go Back Button -->
        <div class="container mx-auto mt-2">
            <a href="javascript:history.back()" class="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition inline-flex items-center">
                <i class='bx bx-arrow-back'></i> Go Back
            </a>
        </div>
            <div class="container mx-auto">
                <div class="flex flex-col lg:flex-row gap-10">
                    <!-- Product Image -->
                    <div class="w-full lg:w-1/2 flex items-center justify-center">
                        <div class="border p-3">
                            <img src="${product.image || './images/product-gallery/default.png'}" class="w-full h-96 object-contain"
                                alt="${product.name || 'Product Image'}">
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="w-full lg:w-1/2 p-3">
                        <h3 class="text-2xl font-semibold mb-2">${product.name}</h3>
                        <div class="flex items-center mb-4">
                            <div class="flex text-yellow-500 text-lg">
                                <i class="bx bxs-star"></i>
                                <i class="bx bxs-star"></i>
                                <i class="bx bxs-star"></i>
                                <i class="bx bxs-star"></i>
                                <i class="bx bxs-star text-gray-300"></i>
                            </div>
                            <p class="ml-2 text-gray-600">(24 Ratings)</p>
                        </div>
                        <div class="flex items-center gap-4 mb-6">
                            ${product.discounted_price ? `
                                <h5 class="text-gray-400 line-through">$${parseFloat(product.original_price).toFixed(2)}</h5>
                                <h4 class="text-2xl font-bold">$${parseFloat(product.discounted_price).toFixed(2)}</h4>
                            ` : `
                                <h4 class="text-2xl font-bold">$${parseFloat(product.original_price).toFixed(2)}</h4>
                            `}
                        </div>

                        <div class="mb-6">
                            <h6 class="text-lg font-semibold">Description:</h6>
                            <p class="text-gray-700">${product.description}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-lg font-semibold">Product id:</h6>
                            <p class="text-gray-700">${product.product_id}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-lg font-semibold">Product category:</h6>
                            <p class="text-gray-700">${product.category}</p>
                        </div>
                        <div class="mb-6">
                            <h6 class="text-lg font-semibold">Seller Shop:</h6>
                            <p class="text-gray-700">${product.seller}</p>
                        </div>

                        <!-- Add to Cart Button -->
                        <button onclick="addToCart(${product.id})"
                            class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                            <i class="bx bxs-cart-add"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <!-- Switchable Tabs Section -->
                <div class="mt-10">
                    <div class="tabs flex space-x-4 border-b border-gray-200">
                        <button id="tab-description" class="tab-button py-2 px-4 text-lg text-gray-600 hover:text-black border-b-2 border-transparent">DESCRIPTION</button>
                        
                        <button id="tab-tags" class="tab-button py-2 px-4 text-lg text-gray-600 hover:text-black border-b-2 border-transparent">TAGS</button>
                    </div>
                    <div class="tab-content mt-6 p-4 lg:p-0">
                        <!-- DESCRIPTION -->
                        <div id="panel-description" class="tab-panel block">
                            <p class="text-gray-700">${product.description || 'No description available'}</p>
                        </div>

                        <!-- TAGS -->
                        <div id="panel-tags" class="tab-panel hidden">
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Men's Fashion</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Casual</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Electronics</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Furniture</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Sports</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Women Wear</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Formal Shirts</button>
                                <button class="border px-4 py-2 bg-gray-200 hover:bg-black hover:text-white transition-all duration-300">Shoes</button>
                            </div>               
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Set up tab switching after rendering
        setupTabSwitching();
    } else {
        console.error('Product details container not found.');
    }
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.classList.add('fixed', 'top-5', 'right-5', 'z-50');
    document.body.appendChild(alertContainer);


    fetchProductDetails();
});