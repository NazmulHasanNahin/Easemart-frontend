// Utility function to get trimmed value from an input field by its ID
const getValue = (id) => document.getElementById(id).value.trim();

// Function to show or hide the spinner
const toggleSpinner = (show) => {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
};

// Function to display error messages
const showError = (message) => {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
};

// Function to display success messages
const showSuccess = (message) => {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
};

// Function to handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();

    // Get form values
    const firstName = getValue('first-name');
    const lastName = getValue('last-name');
    const username = getValue('username');
    const email = getValue('email');
    const password = getValue('password');
    const confirmPassword = getValue('confirm-password');
    const accountType = getValue('account-type');

    // Basic validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !accountType) {
        showError('All fields are required.');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }

    // Prepare data for API request
    const formData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        account_type: accountType,
    };

    // Hide error and success messages, and show spinner
    showError('');
    showSuccess('');
    toggleSpinner(true);

    try {
        // Send POST request to the registration API
        const response = await fetch('https://ease-mart-api.vercel.app/users/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Check response status
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Handle success response
        const result = await response.json();
        showSuccess(result.message || 'Registration successful!');
        console.log('Registration successful:', result);
        // You can add more logic here, like redirecting the user or clearing the form

    } catch (error) {
        // Handle errors
        console.error('There was a problem with the registration:', error);
        showError('Registration failed. Please try again.');
    } finally {
        // Hide spinner
        toggleSpinner(false);
    }
};

// Attach event listener to form submission
document.getElementById('signup-form').addEventListener('submit', handleSubmit);
