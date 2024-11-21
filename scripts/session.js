
// This code handles everything related to logins.
// time is in miliseconds so this code is basically a snazzy way of getting fifteen minutes in miliseconds.
window.SESSION_TIMEOUT = 15 * 60 * 1000;

window.sessionTimer = null;
window.sessionExpiration = null;
//check if there is an active/not timed out session, if so display the timer etc. If not get rid of the irrelevant logout button and kick their butts back to index/login.
function checkSession() {
    const session = JSON.parse(localStorage.getItem('session'));
    const now = Date.now();

    if (session && session.expiration > now) {
        sessionExpiration = session.expiration;
        startTimer();
        hideModal();
        document.getElementById('timerDisplay').classList.remove('hidden');
        showLogoutButton();

        adjustNavBarForRole(session.role);
    } else {
        localStorage.removeItem('session');
        hideLogoutButton();

        adjustNavBarForRole(null);
        if (window.location.pathname !== '/index.html') {
            window.location.href = '/index.html';
        } else {
            showModal();
            document.getElementById('timerDisplay').classList.add('hidden');
        }
    }
}
//function to display the logout.
function showLogoutButton() {
    const logoutContainer = document.getElementById('logoutButtonContainer');
    if (logoutContainer) {
        logoutContainer.style.display = 'block';
    }
}
//function to hide the logout.
function hideLogoutButton() {
    const logoutContainer = document.getElementById('logoutButtonContainer');
    if (logoutContainer) {
        logoutContainer.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            logout();
        });
    }

    checkSession();

    document.getElementById('timerDisplay').onclick = function () {
        resetTimer();
    };
});
// Code to adjust navbar based on user role (Helped by AI as stated in AI record) 
function adjustNavBarForRole(role) {
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach(item => {
        item.style.display = 'none';
    });

    if (!role) {
        return;
    }

    if (role === 'Quality Inspector') {
        showNavLink('Home');
        showNavLink('Create NCR');
        showNavLink('NCR Storage');
    } else if (role === 'Engineering') {
        showNavLink('Home');
        showNavLink('Create NCR');
        showNavLink('NCR Storage');
        showNavLink('Engineering');
    } else if (role === 'Operations Manager') {
        showNavLink('Home');
        showNavLink('Create NCR');
        showNavLink('NCR Storage');
        showNavLink('Engineering');
        showNavLink('Operations');
    }
}

function showNavLink(linkName) {
    const navItem = document.querySelector(`nav ul li[data-link="${linkName}"]`);
    if (navItem) {
        navItem.style.display = 'block';
    }
}

//Code to start timer 
function startTimer() {
    updateTimerDisplay();

    if (sessionTimer) clearInterval(sessionTimer);

    sessionTimer = setInterval(() => {
        const now = Date.now();
        const timeLeft = sessionExpiration - now;

        if (timeLeft <= 0) {

            clearInterval(sessionTimer);
            logout();
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}
//Code to update the display if a page is navigated to.
function updateTimerDisplay() {
    const now = Date.now();
    const timeLeft = sessionExpiration - now;
    // used a formula that I have used before for a website that I was going to include in my portfolio, instead it is here.
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    //padzero used here to ensure if the time is something like 09:09 it doesn't show as 9:9, which would be dumb.
    document.getElementById('timeLeft').textContent = `${padZero(minutes)}:${padZero(seconds)}`;
}
//function for time formatting.
function padZero(num) {
    return num.toString().padStart(2, '0');
}
// reset the timer to 15:00. I have this called when the user clicks on it or when they nav to another page, which makes sense I think.
function resetTimer() {
    sessionExpiration = Date.now() + SESSION_TIMEOUT;
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
        session.expiration = sessionExpiration;
        localStorage.setItem('session', JSON.stringify(session));
    }
    updateTimerDisplay();
}
//a modal is a term for something that displays on a high z index. 
function showModal() {
    if (document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'block';
    }
}

function hideModal() {
    if (document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
}
//If the user chooses to logout they still get the alert for session expiry, I want to fix this yet.
function logout() {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('session');
    showModal();
    document.getElementById('timerDisplay').classList.add('hidden');
    adjustNavBarForRole(null);
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    checkSession();

    document.getElementById('timerDisplay').onclick = function () {
        resetTimer();
    };
});
