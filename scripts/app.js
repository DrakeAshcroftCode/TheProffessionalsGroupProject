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

// Store function that checks for editing existing NCRs by NCR number
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
    const editIndex = localStorage.getItem('currentEditIndex');
    if (editIndex !== null) {
        const storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];
        const ncrForm = storedNCRs[parseInt(editIndex, 10)];

        if (ncrForm) {
            document.getElementById('supName').value = ncrForm.supplierInfo.supplierName;
            const ncrNoField = document.getElementById('ncrNo');
            ncrNoField.value = ncrForm.supplierInfo.ncrNumber;
            ncrNoField.disabled = true;

            document.getElementById('prodNo').value = ncrForm.supplierInfo.poOrProductNumber;
            document.getElementById('saleOrderNo').value = ncrForm.supplierInfo.salesOrderNumber;
            document.getElementById('quantityR').value = ncrForm.supplierInfo.quantityReceived;
            document.getElementById('quantityD').value = ncrForm.supplierInfo.quantityDefective;

            if (ncrForm.reportDetails.processApplicable === 'recInsp') {
                document.getElementById('rdoRecInsp').checked = true;
            }
            if (ncrForm.reportDetails.processApplicable === 'WIP') {
                document.getElementById('rdoWIP').checked = true;
            }
            document.getElementById('sapNo').value = ncrForm.reportDetails.sapNo;
            document.getElementById('itemDescription').value = ncrForm.reportDetails.itemDescription;
            document.getElementById('defectDescription').value = ncrForm.reportDetails.descriptionOfDefect;

            if (ncrForm.nonConformanceDetails.isNonConforming === 'Yes') {
                document.getElementById('rdoConformingYes').checked = true;
            }
            if (ncrForm.nonConformanceDetails.isNonConforming === 'No') {
                document.getElementById('rdoConformingNo').checked = true;
            }
            document.getElementById('reportDate').value = ncrForm.nonConformanceDetails.dateOfReport;
            document.getElementById('repName').value = ncrForm.nonConformanceDetails.qualityRepresentativeName;
        }
    }
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
    document.getElementById('timerDisplay').classList.add('hidden');

    var itemDescriptionTextarea = document.getElementById('itemDescription');
    var defectDescriptionTextarea = document.getElementById('defectDescription');

    autoExpandTextarea(itemDescriptionTextarea);
    autoExpandTextarea(defectDescriptionTextarea);

    handleDeselectRadioButton('rdoIPA', { value: lastCheckedRadioIPA });
    handleDeselectRadioButton('conforming', { value: lastCheckedRadioConforming });
};
 