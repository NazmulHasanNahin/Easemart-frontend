// Function to fetch all products
async function fetchProducts() {
    try {
        const response = await fetch('http://127.0.0.1:7000/products/products/');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products on the page
// Function to display products on the page
function displayProducts(products) {
    const productsContainer = document.querySelector('.grid');
    const noProductsContainer = document.querySelector('.no-pd');
    
    productsContainer.innerHTML = ''; // Clear existing products
    noProductsContainer.innerHTML = ''; // Clear any existing message

    if (products.length === 0) {
        // Display a message if no products are available
        noProductsContainer.innerHTML = `
            <div class="bg-white rounded-lg  p-6 text-center text-gray-600">
                <h3 class="text-lg font-semibold">No products available</h3>
                <p class="mt-2">Try searching with a different keyword or check back later.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        // Ensure prices are numbers or default to 0
        const originalPrice = product.original_price ? parseFloat(product.original_price).toFixed(2) : null;
        const discountedPrice = product.discounted_price ? parseFloat(product.discounted_price).toFixed(2) : null;
        
        // Handle price display
        const originalPriceDisplay = originalPrice ? `$${originalPrice}` : '';
        const discountedPriceDisplay = discountedPrice ? `$${discountedPrice}` : '';
        
        // Create HTML for each product
        const productHTML = `
        <div class="bg-white rounded-lg shadow-lg hover:shadow-2xl p-3 transform hover:-translate-y-1 hover:scale-105 transition-transform duration-300">
            <img src="${product.image || 'default-image.png'}" alt="${product.name || 'Product Image'}" class="w-full h-40 object-contain mb-4 rounded-lg">
            <div class="text-center">
                <h5 class="text-gray-800 font-bold text-md">${product.name ? (product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name) : 'Product Name'}</h5>
                <div class="flex justify-center items-center gap-1">
                    ${discountedPrice ? `<span class="text-gray-400 line-through">${originalPriceDisplay}</span>` : originalPriceDisplay}
                    ${discountedPrice ? `<span class="text-xl text-black font-semibold">${discountedPriceDisplay}</span>` : ''}
                </div>
                <div class="flex justify-center mt-2 text-yellow-500">
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                    <i class="bx bxs-star"></i>
                </div>
                <div class="mt-4 flex justify-around gap-5 lg:gap-0">
                    <button 
                        onclick="addToCart(${product.id})"
                        class="bg-black text-white text-sm px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                        Add to Cart
                    </button>
                    <a href="http://127.0.0.1:5501/product-details.html?id=${product.id}" 
                       class="bg-gray-200 text-black text-sm px-3 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                        Details
                    </a>
                </div>
            </div>
        </div>
        `;
        
        // Insert the product HTML into the container
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}


// Function to show alerts
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
        showAlert('Only customers can add products to the cart.', 'error'); 
        return;
    }

    fetch(`http://127.0.0.1:7000/products/cart/add/${productId}/`, {
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

// Function to fetch products by search or category
async function fetchFilteredProducts(searchTerm = '', categoryName = '') {
    let apiUrl = 'http://127.0.0.1:7000/products/products/';
    
    const queryParams = new URLSearchParams();
    
    if (searchTerm) {
        queryParams.append('search', searchTerm);
    }
    if (categoryName && categoryName !== 'Product Category') {
        queryParams.append('category__name', categoryName);
    }

    if (queryParams.toString()) {
        apiUrl += `?${queryParams.toString()}`;
    }

    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching filtered products:', error);
    }
}

// Function to get query parameters from the URL
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// When the page loads, check if there's a search query in the URL
document.addEventListener('DOMContentLoaded', () => {
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.classList.add('fixed', 'top-5', 'right-5', 'z-50');
    document.body.appendChild(alertContainer);

    const searchQuery = getQueryParameter('search');
    
    if (searchQuery) {
        // Fetch and display products based on the search query from URL
        fetchFilteredProducts(searchQuery);
    } else {
        // Fetch and display all products
        fetchProducts();
    }
});

// Function to handle search and category filter
function handleSearchAndFilter() {
    const searchInput = document.getElementById('search-input').value.trim();
    const selectedCategory = document.getElementById('category-filter').value;

    fetchFilteredProducts(searchInput, selectedCategory);
}

// Event listeners for search button and category filter
document.getElementById('search-button').addEventListener('click', handleSearchAndFilter);
document.getElementById('category-filter').addEventListener('change', handleSearchAndFilter);

// Function to fetch all categories
async function fetchCategories() {
    try {
        const response = await fetch('http://127.0.0.1:7000/categories/categories/');
        const categories = await response.json();
        populateCategoryFilter(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to populate category filter dropdown
function populateCategoryFilter(categories) {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option selected>Product Category</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Initialize categories on page load
document.addEventListener('DOMContentLoaded', fetchCategories);
