
// This code handles everything related to logins.
// time is in miliseconds so this code is basically a snazzy way of getting fifteen minutes in miliseconds.
window.SESSION_TIMEOUT =   15 * 60 * 1000;

window.sessionTimer = null;
window.sessionExpiration = null;
//check if there is an active/not timed out session, if so display the timer etc. 
//If not get rid of the irrelevant logout button and kick their butts back to index/login.
function checkSession() {
    const session = JSON.parse(localStorage.getItem('session'));
    const now = Date.now();

    if (session && session.expiration > now) {
        sessionExpiration = session.expiration;
        startTimer();
        hideModal();
        
        /*document.getElementById('timerDisplay').classList.add('hidden');
        showLogoutButton();*/

        adjustNavBarForRole(session.role);
        showUserProfile(session); //Get the user data to display in the profile section

    } else {
        localStorage.removeItem('session');
        hideLogoutButton();
        hideUserProfile(); //Hide the user profile when your done with it

        adjustNavBarForRole(null);
        if (window.location.pathname !== '/index.html') {
            window.location.href = '/index.html';
        } else {
            showModal();
           /* document.getElementById('timerDisplay').classList.add('hidden');*/
        }
    }
}

//Function to display the user profile section, click the user profile image and then a user profile section will drop down
function showUserProfile(user) {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    if (user) {
        profileName.textContent = `Role: ${user.role}` || 'Role not available';
        profileEmail.textContent = `Email: ${user.email}` || 'Email not available';
    }
}

//Function that does the opposite so when you click the user profile image again it takes away the profile information
function hideUserProfile() {
    const profileSection = document.getElementById('profileSection');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileSection) {
        profileSection.style.display = 'none';
        profileDropdown.style.display = 'none';
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

    /*document.getElementById('timerDisplay').onclick = function () {
        resetTimer();
    };*/
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
    
    if (sessionTimer) clearInterval(sessionTimer);

    sessionTimer = setInterval(() => {
        const now = Date.now();
        const timeLeft = sessionExpiration - now;

        if (timeLeft <= 0) {
            clearInterval(sessionTimer);
            logout();
        } 
        else if (timeLeft <= 5 *60 * 1000 && !alertShown) {
            
            // if user wants to reset the time then they can click on OK and the time will reset.
            // But if they don't then  session will expire automatically.
            confirm("Session will expire in 5 minutes, press ok to reset timer.");
            
            if (userResponse) {
                resetTimer();
            }
            
        }
    }, 60000); // calculating the time in minutes.
}

//Code to update the display if a page is navigated to.
/*function updateTimerDisplay() {
    const now = Date.now();
    const timeLeft = sessionExpiration - now;
    // used a formula that I have used before for a website that I was going to include in my portfolio, instead it is here.
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    //padzero used here to ensure if the time is something like 09:09 it doesn't show as 9:9, which would be dumb.
    document.getElementById('timeLeft').textContent = `${padZero(minutes)}:${padZero(seconds)}`;
    document.getElementById('timerDisplay').classList.add('hidden');

}
//function for time formatting.
function padZero(num) {
    return num.toString().padStart(2, '0');
}*/

let alertShown=false;

// reset the timer to 15:00. I have this called when the user clicks on it or when they nav to another page, which makes sense I think.
function resetTimer() {
    sessionExpiration = Date.now() + SESSION_TIMEOUT;
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
        session.expiration = sessionExpiration;
        localStorage.setItem('session', JSON.stringify(session));
    }

    alertShown=false;
   /* updateTimerDisplay();*/
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

    /*document.getElementById('timerDisplay').classList.add('hidden');*/
    adjustNavBarForRole(null);

    window.top.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    checkSession();

    /*document.getElementById('timerDisplay').onclick = function () {
        resetTimer();
    };*/
});


/* I make the timerdisplay and its reference as a comment in every js file (where it is used) so that it will not affect our website. 
Because when i remove the timedisplay from html, it shows error in console and alert part is'nt working. I hope it makes sense.
Things I removed: Timerdisplay and its visibility: html and css ONLY */

function onLoginSuccess() {
    const iframe = document.getElementById('mainIframe');
    if (iframe) {
        iframe.src = 'index.html'
    } else {
        console.error('Iframe not found!');
    }
}