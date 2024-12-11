// This code handles the logic behind registering/logging in.
// domcontentloaded ensures HTML elements are visible before JS interacts with them.
// preventDefault() is used to stop default behavior and handle it manually.

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginButton').onclick = function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const sessionExpiration = Date.now() + SESSION_TIMEOUT;
            const session = {
                email: user.email,
                expiration: sessionExpiration,
                role: user.role
            };
            localStorage.setItem('session', JSON.stringify(session));

            loadNotificationsForUser(user.email); // Load any saved notifications for this user
            hideModal();
            startTimer();
            showLogoutButton();
            adjustNavBarForRole(user.role);
        } else {
            alert('Invalid email or password.');
        }
    };

    document.getElementById('registerButton').onclick = function (event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const role = document.getElementById('registerRole').value;

        if (!username || !email || !password || !role) {
            alert('Please fill in all fields and select a role.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert('User with this email already exists.');
        } else {
            const newUser = {
                username: username,
                email: email,
                password: password,
                role: role
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            const sessionExpiration = Date.now() + SESSION_TIMEOUT;
            const session = {
                email: newUser.email,
                expiration: sessionExpiration,
                role: newUser.role
            };
            localStorage.setItem('session', JSON.stringify(session));

            hideModal();
            startTimer();
            showLogoutButton();
            adjustNavBarForRole(newUser.role);
        }
    };

    document.getElementById('showRegister').onclick = function (event) {
        event.preventDefault();
        document.getElementById('loginForm').style.display = "none";
        document.getElementById('registerForm').style.display = "block";
    };

    document.getElementById('showLogin').onclick = function (event) {
        event.preventDefault();
        document.getElementById('registerForm').style.display = "none";
        document.getElementById('loginForm').style.display = "block";
    };
});

// Function to load notifications for a user
function loadNotificationsForUser(email) {
    const notifications = JSON.parse(localStorage.getItem(`notifications_${email}`)) || [];
    notifications.forEach(notification => {
        displayNotification(notification.title, notification.message);
    });

    // Optionally clear notifications after displaying
    localStorage.removeItem(`notifications_${email}`);
}

// Function to display notifications in the UI
function displayNotification(title, message) {
    const notifArea = document.getElementById('notificationArea'); // Ensure notificationArea exists in your HTML
    const notifElement = document.createElement('div');
    notifElement.classList.add('notification');
    notifElement.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    notifArea.appendChild(notifElement);
}

// Reset the timer on page load
window.onload = function () {
    resetTimer();
};
