document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.classList.add('fixed', 'top-5', 'right-5', 'z-50', 'space-y-4', 'w-80');
    document.body.appendChild(alertContainer);

    const cartContainer = document.querySelector('.cart-items');
    const orderSummaryContainer = document.querySelector('.order-summary');

    // Redirect to sign-in page if no token
    if (!token) {
        window.location.href = 'signin.html';
        return;
    }

    // Function to show alerts
    function showAlert(message, type = 'error') {
        if (!alertContainer) {
            console.error('Alert container not found.');
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.classList.add('p-4', 'rounded', 'shadow-lg', 'text-white', 'transition', 'duration-500', 'ease-in-out');

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

    // Fetch cart items
    fetch('http://127.0.0.1:7000/dashboard/customer/cart/', {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        return response.json();
    })
    .then(data => {
        if (data.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        let cartItemsHTML = '';
        let subtotal = 0;

        data.forEach(item => {
            const { id, product, quantity } = item;
            const { name, discounted_price, image } = product;
            const price = parseFloat(discounted_price);
            subtotal += price * quantity;

            cartItemsHTML += `
                <div class="flex flex-col lg:flex-row items-center lg:items-start gap-6 border-b pb-6 mb-6">
                    <div class="cart-img w-full lg:w-1/4">
                        <img src="${image}" class="w-full object-cover rounded-lg" alt="${name}">
                    </div>
                    <div class="flex-1">
                        <h4 class="text-lg font-semibold mb-2">${name}</h4>
                        <h5 class="text-xl font-bold mt-4">$${price.toFixed(2)}</h5>
                        <p class="text-gray-600">Quantity: ${quantity}</p>
                    </div>
                    <div class="lg:ml-auto">
                        <a href="" onclick="removeFromCart(${id})" class="text-red-600 hover:text-red-800 font-bold">
                            <i class='bx bx-x'></i> Remove
                        </a>
                    </div>
                </div>
            `;
        });

        cartContainer.innerHTML = cartItemsHTML;

        const tax = 14;
        const total = subtotal + tax;

        orderSummaryContainer.innerHTML = `
            <h5 class="text-xl font-bold mb-6">Order Summary</h5>
            <div class="flex justify-between mb-4">
                <p class="text-gray-600">Subtotal:</p>
                <p class="text-black font-bold">$${subtotal.toFixed(2)}</p>
            </div>
            <div class="flex justify-between mb-4">
                <p class="text-gray-600">Shipping:</p>
                <p class="text-black font-bold">--</p>
            </div>
            <div class="flex justify-between mb-4">
                <p class="text-gray-600">Taxes:</p>
                <p class="text-black font-bold">$${tax.toFixed(2)}</p>
            </div>
            <div class="flex justify-between mb-4">
                <p class="text-gray-600">Discount:</p>
                <p class="text-black font-bold">--</p>
            </div>
            <hr class="my-4">
            <div class="flex justify-between text-lg font-bold mb-6">
                <p>Total:</p>
                <p>$${total.toFixed(2)}</p>
            </div>
            <a href="checkout-payment.html" class="bg-gray-800 text-white py-3 w-full text-center rounded-lg hover:bg-gray-900 transition block">
                Proceed to Checkout
            </a>
            <div class="mt-6 flex justify-between">
                <a href="all-product.html" class="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition">
                    <i class='bx bx-shopping-bag'></i> Continue Shopping
                </a>
            </div>
        `;
    })
    .catch(error => {
        showAlert('Failed to load cart items.', 'error');
        console.error(error);
    });

    // Remove item from cart
    window.removeFromCart = function (itemId) {
        fetch(`http://127.0.0.1:7000/products/cart/remove/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                showAlert('Item removed from cart successfully!', 'success');
                // Reload cart items after removal
                location.reload();
            } else {
                showAlert('Failed to remove item from cart.', 'error');
            }
        })
        .catch(error => {
            showAlert('An error occurred while removing the item.', 'error');
            console.error(error);
        });
    };
});
