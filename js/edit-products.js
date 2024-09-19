document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');  // Extract the product ID from the URL
    const apiUrl = `https://easemart-api.onrender.com/products/products/${productId}/`;

    // Fetch product details
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.name;
            document.getElementById('description').value = data.description;
            document.getElementById('original_price').value = data.original_price;
            document.getElementById('discounted_price').value = data.discounted_price;
            document.getElementById('category').value = data.category;
            document.getElementById('seller').value = data.seller;
            document.getElementById('image').value = data.image;
            document.getElementById('imagePreview').src = data.image;
            document.getElementById('product_id').value = data.product_id;
        })
        .catch(error => {
            showAlert('Failed to load product details', 'error');
        });

    document.getElementById('saveProductBtn').addEventListener('click', function() {
        const updatedProduct = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            original_price: document.getElementById('original_price').value,
            discounted_price: document.getElementById('discounted_price').value,
            category: document.getElementById('category').value,
            seller: document.getElementById('seller').value,
            product_id: document.getElementById('product_id').value
            // Notice the "image" field is excluded
        };

        console.log("Data being sent to the API:", updatedProduct); // Log the data being sent

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error response from server:", errorData); // Log the error response from server
                    showAlert('Failed to update product: ' + (errorData.detail || 'Bad request'), 'error');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                showAlert('Product updated successfully', 'success');
                console.log("Successful response:", data); // Log the successful response
            }
        })
        .catch(error => {
            console.error("Network error or other issue:", error); // Log any network errors
            showAlert('Error occurred while updating product', 'error');
        });
    });
});

// Function to display alert messages
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
