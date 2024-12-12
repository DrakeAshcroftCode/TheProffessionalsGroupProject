// email.js - Handles all email and notification-related functionality

// EmailJS Initialization
(function () {
    emailjs.init('v11zkRvHEyRxW0Icf'); // Your public API key
})();

// Function to send email notifications
function sendEmailNotification(toEmail, subject, ncrForm) {
    const templateParams = {
        to_email: toEmail,
        subject: subject,
        supplier_name: ncrForm.supplierInfo.supplierName,
        ncr_number: ncrForm.supplierInfo.ncrNumber,
        product_number: ncrForm.supplierInfo.poOrProductNumber,
        sales_order_number: ncrForm.supplierInfo.salesOrderNumber,
        quantity_received: ncrForm.supplierInfo.quantityReceived,
        quantity_defective: ncrForm.supplierInfo.quantityDefective,
        sap_no: ncrForm.reportDetails.sapNo,
        item_description: ncrForm.reportDetails.itemDescription,
        defect_description: ncrForm.reportDetails.descriptionOfDefect,
        report_date: ncrForm.nonConformanceDetails.dateOfReport,
        representative_name: ncrForm.nonConformanceDetails.qualityRepresentativeName,
    };

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
    const notificationsKey = `notifications_${email}`;
    const notifications = JSON.parse(localStorage.getItem(notificationsKey)) || [];
    notifications.push({ title, message, timestamp: new Date().toISOString() });
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));
    console.log("Notification queued for:", email, "Title:", title, "Message:", message);
}

// Function to notify relevant users
function notifyRoleUsers(role, ncrForm) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const roleUsers = users.filter(user => user.role === role);

    roleUsers.forEach(user => {
        sendEmailNotification(
            user.email,
            `New NCR Assigned: ${ncrForm.supplierInfo.ncrNumber}`,
            ncrForm
        );

        queueNotification(
            user.email,
            "New NCR Assigned",
            `You have been assigned NCR #${ncrForm.supplierInfo.ncrNumber}. Please review it.`
        );
    });
}

// Function to determine the next role to notify
function determineNextRole(ncrForm) {
    const submitterRole = ncrForm.reportDetails.submitterRole;
    if (submitterRole === 'Quality Inspector') return 'Engineering';
    if (submitterRole === 'Engineering') return 'Operations Manager';
    return null;
}

export { sendEmailNotification, queueNotification, notifyRoleUsers, determineNextRole };
