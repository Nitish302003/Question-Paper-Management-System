function logout() {
    // Clear user token and any other session data
    localStorage.removeItem('token');
    
    // Redirect to the index page in the root directory
    window.location.href = '../index.html'; // Go up one directory to access index.html

    // Optionally, clear the history so the back button doesn't work
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1); // Prevents going back to the previous page
    };
}

// Add a logout button handler
document.getElementById('logout-button').addEventListener('click', logout);
