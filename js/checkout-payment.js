// Function to fetch and display cart items
async function fetchCartItems() {
    const token = localStorage.getItem('token');
    if (!token) {
        showAlert('You need to log in first', 'error');
        window.location.href = 'signin.html';  // Redirect to login if no token
        return;
    }

    try {
        const response = await fetch('https://easemart-api.onrender.com/dashboard/customer/cart/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 401) {
            throw new Error('Unauthorized: Invalid token or expired session');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }

        const cartItems = await response.json();
        displayCartItems(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        showAlert(error.message || 'Error fetching cart items', 'error');
    }
}

// Function to display cart items
function displayCartItems(cartItems) {
    const cartSummary = document.getElementById('cart-summary');
    if (!cartSummary) return;

    cartSummary.innerHTML = ''; // Clear existing items

    let total = 0;

    cartItems.forEach(item => {
        const { product, quantity } = item;
        const productTotal = (product.discounted_price || product.original_price) * quantity;
        total += productTotal;

        cartSummary.innerHTML += `
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                    <img src="${product.image || 'default-image.png'}" alt="${product.name || 'Product Image'}" class="w-16 h-16 object-cover rounded-md mr-4">
                    <div>
                        <p class="font-semibold">${product.name || 'Product Name'}</p>
                        <p class="text-sm text-gray-500">Quantity: ${quantity}</p>
                    </div>
                </div>
                <p class="font-semibold">$${(productTotal).toFixed(2)}</p>
            </div>
        `;
    });

    document.getElementById('total-price').textContent = `$${(total + 14).toFixed(2)}`;
}

// Function to auto-fill payment details
function autoFillPaymentDetails() {
    const cardOwner = document.querySelector('input[placeholder="Card Owner name"]');
    const cardNumber = document.querySelector('input[placeholder="Valid Owner number"]');
    const expMonth = document.querySelector('input[placeholder="MM"]');
    const expYear = document.querySelector('input[placeholder="YY"]');
    const cvv = document.querySelector('input[placeholder="Three digit CCV number"]');

    cardOwner.value = 'John Doe';
    cardNumber.value = '4204 5536 6778 3348';
    expMonth.value = '12';
    expYear.value = '26';
    cvv.value = '771';
}

// Function to validate payment details
function validatePaymentDetails() {
    const cardOwner = document.querySelector('input[placeholder="Card Owner name"]');
    const cardNumber = document.querySelector('input[placeholder="Valid Owner number"]');
    const expMonth = document.querySelector('input[placeholder="MM"]');
    const expYear = document.querySelector('input[placeholder="YY"]');
    const cvv = document.querySelector('input[placeholder="Three digit CCV number"]');

    // Check if all fields are filled
    return cardOwner.value && cardNumber.value && expMonth.value && expYear.value && cvv.value;
}

// Function to enable or disable the payment button
function togglePaymentButton() {
    const paymentButton = document.getElementById('payment-button');
    if (paymentButton) {
        paymentButton.disabled = !validatePaymentDetails();
    }
}

// Event listeners to validate payment details on input change
document.querySelectorAll('input[placeholder]').forEach(input => {
    input.addEventListener('input', togglePaymentButton);
});

// Function to handle the purchase process
async function handlePurchase() {
    const token = localStorage.getItem('token');
    if (!token) {
        showAlert('You need to log in first', 'error');
        window.location.href = 'signin.html';  // Redirect to login if no token
        return;
    }

    if (!validatePaymentDetails()) {
        showAlert('Please fill in all payment details', 'error');
        return;
    }

    try {
        const response = await fetch('https://easemart-api.onrender.com/products/purchase/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Purchase failed');
        }

        const result = await response.json();
        showAlert('Purchase successful', 'success');
        
        // Redirect to checkout-complete.html after successful purchase
        window.location.href = 'checkout-complete.html';

    } catch (error) {
        console.error('Error during purchase:', error);
        showAlert(error.message || 'Error during purchase', 'error');
    }
}

// Function to show alert messages
function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white p-4 rounded-md fixed bottom-4 right-4 shadow-lg`;
    alertContainer.textContent = message;
    document.body.appendChild(alertContainer);

    setTimeout(() => {
        alertContainer.remove();
    }, 5000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
    togglePaymentButton(); // Initialize button state
});
