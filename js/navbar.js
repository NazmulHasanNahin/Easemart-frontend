document.addEventListener("DOMContentLoaded", () => {
    // Load navbar HTML
    fetch("./navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            initNavbar(); // Initialize navbar functionality (mobile menu, etc.)
            initializeSearchFunctionality(); // Initialize search functionality
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Initialize navbar event listeners
    function initNavbar() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeMobileMenu = document.getElementById('closeMobileMenu');

        // Toggle mobile menu
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Close mobile menu
        if (closeMobileMenu && mobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        } else {
            console.warn("Close button not found on this page");
        }

        // Close the mobile menu when clicking outside of it
        window.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});

// Function to add event listeners when the navbar has been loaded
function initializeSearchFunctionality() {
    // Desktop search elements
    const searchButton = document.getElementById('navbar-search-button');
    const searchInput = document.getElementById('navbar-search-input');

    // Mobile search elements
    const mobileSearchButton = document.getElementById('mobile-search-button');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    // Function to handle search redirect
    function handleSearch(searchInputElement) {
        const searchQuery = searchInputElement.value.trim(); // Get the search query
        if (searchQuery) {
            // Redirect to the 'all-product.html' page with the search query as a parameter
            window.location.href = `all-product.html?search=${encodeURIComponent(searchQuery)}`;
        }
    }

    // Desktop search event listener
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function () {
            handleSearch(searchInput);
        });
    } else {
        console.error('Desktop search button or input not found in the DOM. Retrying...');
        setTimeout(initializeSearchFunctionality, 500);
    }

    // Mobile search event listener
    if (mobileSearchButton && mobileSearchInput) {
        mobileSearchButton.addEventListener('click', function () {
            handleSearch(mobileSearchInput);
        });
    } else {
        console.error('Mobile search button or input not found in the DOM. Retrying...');
        setTimeout(initializeSearchFunctionality, 500);
    }
}
