// Initialize the notification system
if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
}

// Function to add a notification
function addNotification(ncrForm) {
    const notifList = JSON.parse(localStorage.getItem('notifications')) || [];
    const newNotif = {
        ncrNumber: ncrForm.supplierInfo.ncrNumber,
        message: `New NCR created: ${ncrForm.supplierInfo.ncrNumber}`,
        timestamp: new Date().toISOString(),
        read: false,
    };
    notifList.push(newNotif);
    localStorage.setItem('notifications', JSON.stringify(notifList));
    updateNotifBadge();
}

// Function to update the notification badge
function updateNotifBadge() {
    const notifList = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadCount = notifList.filter(notif => !notif.read).length;

    const badge = document.getElementById('notifBadge');
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    badge.textContent = unreadCount;
}

// Function to display notifications
function displayNotifications() {
    const notifDropdown = document.getElementById('notifDropdown');
    const notifList = document.getElementById('notifList');
    const storedNotifs = JSON.parse(localStorage.getItem('notifications')) || [];

    notifList.innerHTML = '';

    if (storedNotifs.length === 0) {
        notifList.innerHTML = '<li>No notifications</li>';
    } else {
        storedNotifs.forEach((notif, index) => {
            const notifItem = document.createElement('li');
            notifItem.style.marginBottom = '8px';
            notifItem.innerHTML = `
                <span>${notif.message}</span>
                <button style="margin-left: 10px;" onclick="goToNCR('${notif.ncrNumber}', ${index})">View</button>
            `;
            notifList.appendChild(notifItem);
        });
    }

    notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
}

// Function to handle "View" button click
function goToNCR(ncrNumber, notifIndex) {
    const notifList = JSON.parse(localStorage.getItem('notifications')) || [];
    notifList[notifIndex].read = true;
    localStorage.setItem('notifications', JSON.stringify(notifList));

    // Redirect to the engineering page with the NCR number
    window.location.href = `engineering.html?ncr=${ncrNumber}`;
}

// Attach event listener to the notification icon
document.getElementById('notifIcon').addEventListener('click', displayNotifications);

// Update notifications badge on page load
document.addEventListener('DOMContentLoaded', updateNotifBadge);

function notifyOnNewNCR(ncrForm) {
    const session = JSON.parse(localStorage.getItem('session')) || {};
    if (session.role === 'Engineering') {
        addNotification(ncrForm);
    }
}

