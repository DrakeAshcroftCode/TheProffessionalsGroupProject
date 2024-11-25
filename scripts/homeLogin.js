// This code handles the logic behind registering/logging in.
//domcontent loaded just means "make sure the HTML elements are visible to the JS before we mess with them", I have nested most of the page inside of it to be sure.
//throughout this document in the eventlisteners you will see me use preventDefault(), this is provided by JS
//and it simply stops the default event behavior from happening so that I can mess with it.

//Code for login button, finding any users that exist, checking if the user is logged in or not, etc.
document.addEventListener('DOMContentLoaded', function () 
{
    document.getElementById('loginButton').onclick = function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        const users = JSON.parse(localStorage.getItem('users')) || [];
        //Mary had a little lambda
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            sessionExpiration = Date.now() + SESSION_TIMEOUT;
            const session = {
                email: user.email,
                expiration: sessionExpiration,
                role: user.role
            };
            localStorage.setItem('session', JSON.stringify(session));
            hideModal();
            startTimer();
            showLogoutButton();
            /*document.getElementById('timerDisplay').classList.remove('hidden');*/

            adjustNavBarForRole(user.role);
        } else {
            alert('Invalid email or password.');
        }
    };
    //button to let users register, and call the papropriate events.
    document.getElementById('registerButton').onclick = function (event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const role = document.getElementById('registerRole').value;
        //simple validation.
        if (!username || !email || !password || !role) {
            alert('Please fill in all fields and select a role.');
            return;
        }
        //retrieve the users stored locally if there are any
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(u => u.email === email);
        //don't let somebody steal somebody elses identity.
        if (userExists) {
            alert('User with this email already exists.');

            //if the user is not trying to steal somebodies identity, they may register.
        } else {
            const newUser = {
                username: username,
                email: email,
                password: password,
                role: role
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            sessionExpiration = Date.now() + SESSION_TIMEOUT;
            const session = {
                email: newUser.email,
                expiration: sessionExpiration,
                role: newUser.role
            };
            //begin the user session
            localStorage.setItem('session', JSON.stringify(session));
            hideModal();
            startTimer();
            showLogoutButton();
            // document.getElementById('timerDisplay').classList.remove('hidden');

            adjustNavBarForRole(newUser.role);
        }
    };
    // buttons
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
// reset timer for accessibility reasonings
window.onload = function () {
    resetTimer();

}