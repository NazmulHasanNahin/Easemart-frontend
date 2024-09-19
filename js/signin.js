const handleLogin = (event) => {
    event.preventDefault();

    const getValue = (id) => document.getElementById(id).value.trim();

    const username = getValue("username");
    const password = getValue("password");

    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden");

    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    if (username && password) {
        fetch("https://easemart-api.onrender.com/users/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("Login Response:", data);

            if (data.token && data.account_type) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("account_type", data.account_type);

                spinner.classList.add("hidden");

                if (data.account_type === "customer") {
                    window.location.href = "account-user-details.html"; 
                } else {
                    window.location.href = "account-user-details.html";
                }
            } else {
                errorMessage.textContent = "Unexpected response format.";
                errorMessage.classList.remove("hidden");
                spinner.classList.add("hidden");
            }
        })
        .catch((error) => {
            console.error("Login Error:", error);
            errorMessage.textContent = "Login failed. Please check your credentials and try again.";
            errorMessage.classList.remove("hidden");
            spinner.classList.add("hidden");
        });
    } else {
        errorMessage.textContent = "Please enter both username and password.";
        errorMessage.classList.remove("hidden");
        spinner.classList.add("hidden");
    }
};

const autofill = (username, password) => {
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", handleLogin);
    }

    document.getElementById("autofill-seller").addEventListener("click", () => {
        autofill("seller2", "kirekire");
    });

    document.getElementById("autofill-customer").addEventListener("click", () => {
        autofill("user2", "kirekire");
    });
});
