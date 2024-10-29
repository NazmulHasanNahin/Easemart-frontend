const token = localStorage.getItem('token');

// Function to show alert messages
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

// Function to fetch and display cart items
async function fetchCartItems() {
    if (!token) {
        showAlert('You need to log in first', 'error');
        window.location.href = 'signin.html';
        return;
    }

    try {
        const response = await fetch('https://ease-mart-api.vercel.app/dashboard/customer/cart/', {
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
function copyTestCardNumber() {
    const testCardNumber = document.getElementById('test-card-number').textContent;
    navigator.clipboard.writeText(testCardNumber).then(() => {
        showAlert("Test card number copied to clipboard!", 'success');
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}
// Function to display cart items
function displayCartItems(cartItems) {
    const cartSummary = document.getElementById('cart-summary');
    if (!cartSummary) return;

    cartSummary.innerHTML = '';

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
                        <p class="text-gray-500">Quantity: ${quantity}</p>
                    </div>
                </div>
                <p class="text-lg font-semibold">$${productTotal.toFixed(2)}</p>
            </div>
        `;
    });

    const tax = 14;  
    total += tax;

    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

document.getElementById('checkout-button').addEventListener('click', async () => {
    if (!token) {
        alert('You need to be logged in to proceed with the checkout.');
        window.location.href = '/signin.html';  
        return;
    }

    try {
        const response = await fetch('https://ease-mart-api.vercel.app/products/purchase/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Redirect to Stripe Checkout
            window.location.href = data.checkout_url;
        } else {
            const data = await response.json();
            console.error('Error creating checkout session:', data.error);
            alert(data.error || 'An error occurred while processing your request.');
        }
    } catch (error) {
        console.error('Network or server error:', error);
        alert('A network error occurred. Please try again.');
    }
});

document.addEventListener('DOMContentLoaded', fetchCartItems);
