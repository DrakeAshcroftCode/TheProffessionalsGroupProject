//Nav Bar Login/Register link popup. 

document.getElementById("openModal").onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior if applicable
    document.getElementById("modal").style.display = "block";
};

document.getElementsByClassName("close")[0].onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior if applicable
    document.getElementById("modal").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};

// Show register form
document.getElementById("showRegister").onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
};

// Show login form
document.getElementById("showLogin").onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
};
