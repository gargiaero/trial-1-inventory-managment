// Load the Google Sign-In API
gapi.load('auth2', function () {
    gapi.auth2.init({
        client_id: '724646553417-pnk3nd8nhtkvsh34k7emrdpslaj939jd.apps.googleusercontent.com', // Replace with your client ID
    });
});

// Function to trigger Google Sign-In

function signInWithGoogle() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(onSignIn);
}

// Function to trigger Google Sign-In or Sign-Out
function signInOrOutWithGoogle() {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
        // User is already signed in, so sign them out
        signOutFromGoogle();
    } else {
        // User is not signed in, so sign them in
        authInstance.signIn().then(onSignIn);
    }
}

// Function to sign out from Google
function signOutFromGoogle() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(function () {
        // Handle sign-out here (e.g., update UI)
        document.getElementById("google-sign-in").style.display = "block";
        document.getElementById("google-sign-out").style.display = "none";
    });
}

// Add a function to handle Google Sign-In
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const userEmail = profile.getEmail();

    // You can use 'userEmail' for authentication and identifying users.
    // You can also send this email to your backend for further authentication and data association.

    // Example: Send the email to the server for authentication
    fetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Welcome, ${userEmail}!`);
            document.getElementById("google-sign-in-container").style.display = "none";
            document.getElementById("inventory-page").style.display = "block";
        } else {
            alert('Authentication failed.');
        }
    })
    .catch(error => {
        console.error(error);
    });

    // Update the UI to show the sign-out button
    document.getElementById("google-sign-in").style.display = "none";
    document.getElementById("google-sign-out").style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const addItemForm = document.getElementById("add-item-form");
    const itemList = document.getElementById("items-list");

    addItemForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const itemName = document.getElementById("item-name").value;
        const itemQuantity = document.getElementById("item-quantity").value;

        if (itemName && itemQuantity) {
            const newItemElement = document.createElement("li");
            newItemElement.textContent = `${itemName} (Quantity: ${itemQuantity})`;
            itemList.appendChild(newItemElement);

            // Clear input fields
            document.getElementById("item-name").value = "";
            document.getElementById("item-quantity").value = "";
        } else {
            alert("Please fill in both item name and quantity.");
        }
    });
});