
// This code handles the logic behind registering/logging in.
//domcontent loaded just means "make sure the HTML elements are visible to the JS before we mess with them", I have nested most of the page inside of it to be sure.
//throughout this document in the eventlisteners you will see me use preventDefault(), this is provided by JS
//and it simply stops the default event behavior from happening so that I can mess with it.
//Code for login button, finding any users that exist, checking if the user is logged in or not, etc.
function saveSendFunction() {
    var supplierName = document.getElementById('supName').value;
    var ncrNumber = document.getElementById('ncrNo').value;
    var poOrProductNumber = document.getElementById('prodNo').value;
    var salesOrderNumber = document.getElementById('saleOrderNo').value;
    var quantityReceived = document.getElementById('quantityR').value;
    var quantityDefective = document.getElementById('quantityD').value;

    var rdoRecInsp = document.getElementById('rdoRecInsp');
    var rdoWIP = document.getElementById('rdoWIP');
    var sapNo = document.getElementById('sapNo').value;

    var itemDescription = document.getElementById('itemDescription').value;
    var defectDescription = document.getElementById('defectDescription').value;
    var ncrImage = document.getElementById('nrcImage').files;

    var rdoConformingYes = document.getElementById('rdoConformingYes');
    var rdoConformingNo = document.getElementById('rdoConformingNo');
    var reportDate = document.getElementById('reportDate').value;
    var repName = document.getElementById('repName').value;

    var rdoOneValue = '';
    if (rdoRecInsp.checked) {
        rdoOneValue = 'recInsp';
    } else if (rdoWIP.checked) {
        rdoOneValue = 'WIP';
    }

    var rdoTwoValue = '';
    if (rdoConformingYes.checked) {
        rdoTwoValue = 'Yes';
    } else if (rdoConformingNo.checked) {
        rdoTwoValue = 'No';
    }

    var ncrForm = {
        supplierInfo: {
            supplierName: supplierName,
            ncrNumber: ncrNumber,
            poOrProductNumber: poOrProductNumber,
            salesOrderNumber: salesOrderNumber,
            quantityReceived: quantityReceived,
            quantityDefective: quantityDefective,
        },
        reportDetails: {
            processApplicable: rdoOneValue,
            sapNo: sapNo,
            itemDescription: itemDescription,
            descriptionOfDefect: defectDescription,
            nonConformityImage: ncrImage,
        },
        nonConformanceDetails: {
            isNonConforming: rdoTwoValue,
            dateOfReport: reportDate,
            qualityRepresentativeName: repName,
        }
    };

    return ncrForm;
}

// Validation function
function validation(ncrForm) {
    let isValid = true;
    let firstErrorElement = null;

    // Error elements
    const supNameError = document.getElementById('supNameError');
    const ncrNoError = document.getElementById('ncrNoError');
    const prodNoError = document.getElementById('prodNoError');
    const saleOrderNoError = document.getElementById('saleOrderNoError');
    const quantityRError = document.getElementById('quantityRError');
    const quantityDError = document.getElementById('quantityDError');
    const sapNoError = document.getElementById('sapNoError');
    const itemDescriptionError = document.getElementById('itemDescriptionError');
    const defectDescriptionError = document.getElementById('defectDescriptionError');
    const repNameError = document.getElementById('repNameError');
    const reportDateError = document.getElementById('reportDateError');
    const rdoIPAError = document.getElementById('rdoIPAError');
    const rdoConformingError = document.getElementById('rdoConformingError');
    const nrcImageError = document.getElementById('nrcImageError');

    // Clear error messages
    supNameError.textContent = "";
    ncrNoError.textContent = "";
    prodNoError.textContent = "";
    saleOrderNoError.textContent = "";
    quantityRError.textContent = "";
    quantityDError.textContent = "";
    sapNoError.textContent = "";
    itemDescriptionError.textContent = "";
    defectDescriptionError.textContent = "";
    repNameError.textContent = "";
    reportDateError.textContent = "";
    rdoIPAError.textContent = "";
    rdoConformingError.textContent = "";
    nrcImageError.textContent = "";

    // Validation checks
    if (ncrForm.supplierInfo.supplierName === "") {
        supNameError.textContent = "You must enter a name";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('supName');
    }

    if (ncrForm.supplierInfo.supplierName.length > 35) {
        supNameError.textContent = "Your name cannot be more than 35 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('supName');
    }

    if (ncrForm.supplierInfo.ncrNumber === "") {
        ncrNoError.textContent = "You must enter an NCR number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (ncrForm.supplierInfo.ncrNumber.length !== 8) {
        ncrNoError.textContent = "Your NCR number must be 8 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (ncrForm.supplierInfo.poOrProductNumber === "") {
        prodNoError.textContent = "You must enter a product number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('prodNo');
    }

    if (isNaN(ncrForm.supplierInfo.poOrProductNumber)) {
        prodNoError.textContent = "Your product number must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('prodNo');
    }

    if (ncrForm.supplierInfo.salesOrderNumber === "") {
        saleOrderNoError.textContent = "You must enter a sales order number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (isNaN(ncrForm.supplierInfo.salesOrderNumber)) {
        saleOrderNoError.textContent = "Your sales order number must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (ncrForm.supplierInfo.salesOrderNumber.length > 8) {
        saleOrderNoError.textContent = "Your sales order number cannot be more than 8 digits";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (ncrForm.supplierInfo.quantityReceived === "") {
        quantityRError.textContent = "You must enter a quantity";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityR');
    }

    if (isNaN(ncrForm.supplierInfo.quantityReceived)) {
        quantityRError.textContent = "Your quantity must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityR');
    }

    if (ncrForm.supplierInfo.quantityDefective === "") {
        quantityDError.textContent = "You must enter a defective quantity";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityD');
    }

    if (isNaN(ncrForm.supplierInfo.quantityDefective)) {
        quantityDError.textContent = "Your defective quantity must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityD');
    }

    if (ncrForm.reportDetails.sapNo === "") {
        sapNoError.textContent = "You must enter a SAP number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('sapNo');
    }

    if (isNaN(ncrForm.reportDetails.sapNo)) {
        sapNoError.textContent = "Your SAP number must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('sapNo');
    }

    if (ncrForm.reportDetails.itemDescription === "") {
        itemDescriptionError.textContent = "You must enter an item description";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('itemDescription');
    }

    if (ncrForm.reportDetails.itemDescription.length > 250) {
        itemDescriptionError.textContent = "Your item description must be less than 250 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('itemDescription');
    }

    if (ncrForm.reportDetails.descriptionOfDefect === "") {
        defectDescriptionError.textContent = "You must enter a description of the defect";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('defectDescription');
    }

    if (ncrForm.reportDetails.descriptionOfDefect.length > 250) {
        defectDescriptionError.textContent = "Your defect description must be less than 250 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('defectDescription');
    }

    if (!ncrForm.reportDetails.nonConformityImage || ncrForm.reportDetails.nonConformityImage.length === 0) {
        nrcImageError.textContent = "You must upload an image";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('nrcImage');
    }

    if (ncrForm.nonConformanceDetails.qualityRepresentativeName === "") {
        repNameError.textContent = "You must enter a name";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('repName');
    }

    if (ncrForm.nonConformanceDetails.qualityRepresentativeName.length > 70) {
        repNameError.textContent = "The name you enter cannot be more than 70 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('repName');
    }

    if (ncrForm.nonConformanceDetails.dateOfReport === "") {
        reportDateError.textContent = "You must select a date";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('reportDate');
    }

    if (ncrForm.reportDetails.processApplicable === "") {
        rdoIPAError.textContent = "You must select one of the options";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementsByName('rdoIPA')[0];
    }

    if (ncrForm.nonConformanceDetails.isNonConforming === "") {
        rdoConformingError.textContent = "You must select one of the options";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementsByName('conforming')[0];
    }

    if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth" });
    }

    return isValid;
}

function storeFormData(ncrForm) {
    let storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];
    const existingIndex = storedNCRs.findIndex(ncr => ncr.supplierInfo.ncrNumber === ncrForm.supplierInfo.ncrNumber);

    if (existingIndex !== -1) {
        storedNCRs[existingIndex] = ncrForm; // Update existing NCR
        notifyOnNewNCR(ncrForm);

    } else {
        storedNCRs.push(ncrForm); // Add new NCR
        notifyOnNewNCR(ncrForm);

    }

    localStorage.setItem('storedNCRs', JSON.stringify(storedNCRs));
}
// Load form data
function loadFormData() {
    const session = JSON.parse(localStorage.getItem('session')); // Assume session stores user role
    const userRole = session?.role; // Get user role
    const currentEditIndex = localStorage.getItem('currentEditIndex'); // Retrieve the current NCR index
    const isEditing = currentEditIndex !== null; // Determine if we are editing
    const storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || []; // Retrieve stored NCRs
    const ncrData = isEditing ? storedNCRs[parseInt(currentEditIndex, 10)] : null; // Get the NCR data for editing
    const ncrNumberNext = generateNCRNumber();

    if (!isEditing) {
        // If not editing, generate a new NCR number
        if (ncrNumberNext) {
            document.getElementById('ncrNo').value = ncrNumberNext;
        }
    } else if (ncrData) {
        // If editing, populate the NCR number and existing data
        document.getElementById('ncrNo').value = ncrData.supplierInfo.ncrNumber;
    } else {
        console.warn("Editing mode detected but no NCR data found.");
        return;
    }

    // Populate common fields for all roles
    const commonFields = [
        { id: "supName", value: ncrData?.supplierInfo?.supplierName },
        { id: "ncrNo", value: ncrData?.supplierInfo?.ncrNumber },
        { id: "prodNo", value: ncrData?.supplierInfo?.poOrProductNumber },
        { id: "saleOrderNo", value: ncrData?.supplierInfo?.salesOrderNumber },
        { id: "quantityR", value: ncrData?.supplierInfo?.quantityReceived },
        { id: "quantityD", value: ncrData?.supplierInfo?.quantityDefective },
        { id: "sapNo", value: ncrData?.reportDetails?.sapNo },
        { id: "itemDescription", value: ncrData?.reportDetails?.itemDescription },
        { id: "defectDescription", value: ncrData?.reportDetails?.descriptionOfDefect },
        { id: "reportDate", value: ncrData?.nonConformanceDetails?.dateOfReport },
        { id: "repName", value: ncrData?.nonConformanceDetails?.qualityRepresentativeName },
    ];

    commonFields.forEach(({ id, value }) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || ''; // Populate with value or empty string
        }
    });

    // Check user role and populate role-specific fields
    if (userRole === "Engineering" && ncrData?.engineeringAction) {
        const engineeringFields = [
            { id: "selectDisposition", value: ncrData.engineeringAction.disposition },
            { id: "dispositionDescription", value: ncrData.engineeringAction.dispositionDescription },
            { id: "revisionDate", value: ncrData.engineeringAction.revisionDate },
            { id: "txtEngName", value: ncrData.engineeringAction.engineerName },
        ];

        engineeringFields.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        });
    } else if (userRole === "Operations Manager" && ncrData?.operationsAction) {
        const operationsFields = [
            { id: "purchDecision", value: ncrData.operationsAction.purchDecision },
            { id: "CAR", value: ncrData.operationsAction.car },
            { id: "carNumber", value: ncrData.operationsAction.carNumber },
            { id: "followUp", value: ncrData.operationsAction.followUp },
            { id: "txtOpName", value: ncrData.operationsAction.operationsManager },
        ];

        operationsFields.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value || '';
            }
        });
    } else if (userRole === "Quality Inspector") {
        console.log("Quality Inspector role: No additional fields to populate.");
        // No additional fields to populate for Quality Inspector
    } else {
        console.warn("Unrecognized user role.");
    }

    console.log(`Loaded NCR data for role: ${userRole}, Editing: ${isEditing}`);
}



function savePartialNCR() {
    var ncrForm = saveSendFunction();
    incompleteNCRs.push(ncrForm);
    localStorage.setItem("incompleteNCRs", JSON.stringify(incompleteNCRs));
    alert("Incomplete NCR saved successfully.");
    displayNCRList(incompleteNCRs, false);
}

// Save button click event
document.getElementById("btnSave").addEventListener("click", function (event) {
    event.preventDefault();
    var ncrForm = saveSendFunction();    

    console.log(ncrForm);
    if (validation(ncrForm)) {
        storeFormData(ncrForm);
        alert("Form saved successfully.");
        window.location.href = "storeNCR.html";
    } else {
        console.log("Form has errors");
    }
});

// Clear button click event
document.getElementById("btnClear").addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector('form').reset();
    const errorElements = document.querySelectorAll('span[id$="Error"]');
    errorElements.forEach(function (element) {
        element.textContent = "";
    });
    lastCheckedRadioIPA = null;
    lastCheckedRadioConforming = null;
});

// Auto-expand text areas (thus the name)
function autoExpandTextarea(textarea) {
    function resize() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    textarea.addEventListener('input', resize);
    resize();
}

// Handle radio button selection
let lastCheckedRadioIPA = null;
let lastCheckedRadioConforming = null;
handleDeselectRadioButton('rdoIPA', { value: lastCheckedRadioIPA });
handleDeselectRadioButton('conforming', { value: lastCheckedRadioConforming });

function handleDeselectRadioButton(radioGroupName, lastCheckedRadioRef) {
    document.querySelectorAll(`input[name="${radioGroupName}"]`).forEach(function (radio) {
        radio.addEventListener('click', function () {
            if (lastCheckedRadioRef.value === this) {
                this.checked = false;
                lastCheckedRadioRef.value = null;
            } else {
                lastCheckedRadioRef.value = this;
            }
        });
    });
}

// Onload function to reset timer, load form data, and auto-expand text areas
window.onload = function () {
    resetTimer();
    loadFormData();
    
    /*document.getElementById('timerDisplay').classList.add('hidden');*/

    var itemDescriptionTextarea = document.getElementById('itemDescription');
    var defectDescriptionTextarea = document.getElementById('defectDescription');

    autoExpandTextarea(itemDescriptionTextarea);
    autoExpandTextarea(defectDescriptionTextarea);

    handleDeselectRadioButton('rdoIPA', { value: lastCheckedRadioIPA });
    handleDeselectRadioButton('conforming', { value: lastCheckedRadioConforming });
};