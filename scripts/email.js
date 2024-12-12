// email.js - Handles all email and notification-related functionality

// EmailJS Initialization
(function () {
    try {
        emailjs.init('v11zkRvHEyRxW0Icf'); // public API key
        console.log("EmailJS initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize EmailJS:", error);
    }
})();

// Function to send email notifications
function sendEmailNotification(toEmail, subject, ncrForm) {
    if (!toEmail || !ncrForm) {
        console.error("Missing required parameters for sending email.");
        return;
    }

    const templateParams = {
        to_email: toEmail,
        subject: subject,
        ncr_number: ncrForm.supplierInfo?.ncrNumber || "N/A",
        supplier_name: ncrForm.supplierInfo?.supplierName || "N/A",
        description: ncrForm.reportDetails?.descriptionOfDefect || "N/A", 
    };

    console.log("Sending email with templateParams:", templateParams);

    emailjs.send('service_ifwgw9e', 'template_or6un3i', templateParams)
        .then((response) => {
            console.log('Email sent successfully:', response);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
}

// Function to queue notifications locally
function queueNotification(email, title, message) {
    if (!email || !title || !message) {
        console.error("Missing required parameters for queuing notification.");
        return;
    }

    const notificationsKey = `notifications_${email}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey)) || [];
    notifications.push({ title, message, timestamp: new Date().toISOString() });
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));

    console.log("Notification queued for:", email, "Title:", title, "Message:", message);
}

// Function to notify relevant users
function notifyRoleUsers(role, ncrForm) {
    if (!role || !ncrForm) {
        console.error("Missing required parameters for notifying users.");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const roleUsers = users.filter(user => user.role === role);

    if (roleUsers.length === 0) {
        console.warn(`No users found for role: ${role}`);
    }

    roleUsers.forEach(user => {
        console.log(`Notifying user: ${user.email}`);
        sendEmailNotification(
            user.email,
            `New NCR Assigned: ${ncrForm.supplierInfo?.ncrNumber || "N/A"}`,
            ncrForm
        );

        queueNotification(
            user.email,
            "New NCR Assigned",
            `You have been assigned NCR #${ncrForm.supplierInfo?.ncrNumber || "N/A"}. Please review it.`
        );
    });
}

// Function to determine the next role to notify
// function determineNextRole(ncrForm) {
//     if (!ncrForm?.reportDetails?.submitterRole) {
//         console.error("Submitter role is missing in NCR form.");
//         return null;
//     }

//     const submitterRole = ncrForm.reportDetails.submitterRole;
//     if (submitterRole === 'Quality Inspector') return 'Engineering';
//     if (submitterRole === 'Engineering') return 'Operations Manager';

//     console.warn("No next role determined for submitterRole:", submitterRole);
//     return null;
// }

