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
    
    //Check condition of flag to update notification.
    if(ncrForm.reportDetails.submitterRole === 'Quality Inspector'){
        notifList.push(newNotif);
        localStorage.setItem('notifications', JSON.stringify(notifList));
        updateNotifBadge();
    }
    else if(ncrForm.reportDetails.submitterRole ==='Engineering' ){
        notifList.push(newNotif);
        localStorage.setItem('notifications', JSON.stringify(notifList));
        updateNotifBadge();
    }else if(ncrForm.reportDetails.submitterRole === 'Engineering' && session.role ==='Quality Inspector'){ 
        notifList.push(newNotif);
        localStorage.setItem('notifications', JSON.stringify(notifList));
        updateNotifBadge();
    }   
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
    const session = JSON.parse(localStorage.getItem('session')) || {};
    
    if(session.role === 'Operations Manager'){
        console.log(session);
        window.location.href = `operations.html?ncr=${ncrNumber}`;
    }else if (session.role === 'Engineering'){
        window.location.href = `engineering.html?ncr=${ncrNumber}`;
    }    
}


// Attach event listener to the notification icon
document.getElementById('notifIcon').addEventListener('click', displayNotifications);

// Update notifications badge on page load

document.addEventListener('DOMContentLoaded', function () {
    updateNotifBadge();
    emailjs.init("v11zkRvHEyRxW0Icf"); 
    
});

function notifyOnNewNCR(ncrForm) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const engineers = users.filter(user => user.role === 'Engineering');
    engineers.forEach(engineer => {
        sendEmailNotification(
            engineer.email,
            `New NCR Assigned: ${ncrForm.supplierInfo.ncrNumber}`,
            ncrForm
        );
    });
    updateNotifBadge();

}

    
function sendEmailNotification(email, subject, ncrData) {
    emailjs.send("service_ifwgw9e", "template_or6un3i", {
        to_email: email,
        subject: subject,
        ncr_number: ncrData.supplierInfo.ncrNumber,
        supplier_name: ncrData.supplierInfo.supplierName,
        description: ncrData.reportDetails.descriptionOfDefect,
    })
    .then(() => {
        console.log('Email sent successfully.');
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

