//This massive block of code handle the logic for the form and retrieving data from it,
//validation, and other fun stuff.

//should just be called save function. But this function is the bread and butter of our app, retrieving and storing form data.
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

    // Grab error span elements
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

    // Clear previous error messages
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

    // Supplier Name validation
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

    // NCR Number validation
    if (ncrForm.supplierInfo.ncrNumber === "") {
        ncrNoError.textContent = "You must enter an NCR number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (ncrForm.supplierInfo.ncrNumber.length !== 5) {
        ncrNoError.textContent = "Your NCR number must be 5 digits";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (isNaN(ncrForm.supplierInfo.ncrNumber)) {
        ncrNoError.textContent = "Your NCR number must be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    // PO or Product Number validation
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

    // Sales Order Number validation
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

    // Quantity Received validation
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

    // Quantity Defective validation
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

    // SAP Number validation
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

    // Item Description validation
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

    // Defect Description validation
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

    // File Upload (Image) validation
    if (!ncrForm.reportDetails.nonConformityImage || ncrForm.reportDetails.nonConformityImage.length === 0) {
        nrcImageError.textContent = "You must upload an image";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('nrcImage');
    }

    // Quality Representative's Name validation
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

    // Date of Report validation
    if (ncrForm.nonConformanceDetails.dateOfReport === "") {
        reportDateError.textContent = "You must select a date";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('reportDate');
    }

    // Process Applicable (Radio Buttons) validation
    if (ncrForm.reportDetails.processApplicable === "") {
        rdoIPAError.textContent = "You must select one of the options";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementsByName('rdoIPA')[0];
    }

    // Is Non-Conforming (Radio Buttons) validation
    if (ncrForm.nonConformanceDetails.isNonConforming === "") {
        rdoConformingError.textContent = "You must select one of the options";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementsByName('conforming')[0];
    }

    // If there was any error, scroll to the first element with an error
    if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth" });
    }

    return isValid;
}

function storeFormData(ncrForm) {
    delete ncrForm.reportDetails.nonConformityImage;

    var storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];

    storedNCRs.push(ncrForm);

    localStorage.setItem('storedNCRs', JSON.stringify(storedNCRs));

    localStorage.setItem("storedForm", JSON.stringify(ncrForm));
}
//function to retrieve data
function loadFormData() {
    var storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];
    if (storedNCRs.length > 0) {
        var storedForm = storedNCRs[storedNCRs.length - 1]; 
        var supplierInfo = storedForm.supplierInfo;
        var reportDetails = storedForm.reportDetails;
        var nonConformanceDetails = storedForm.nonConformanceDetails;

        document.getElementById('supName').value = supplierInfo.supplierName;
        document.getElementById('ncrNo').value = supplierInfo.ncrNumber;
        document.getElementById('prodNo').value = supplierInfo.poOrProductNumber;
        document.getElementById('saleOrderNo').value = supplierInfo.salesOrderNumber;
        document.getElementById('quantityR').value = supplierInfo.quantityReceived;
        document.getElementById('quantityD').value = supplierInfo.quantityDefective;

        if (reportDetails.processApplicable === 'recInsp') {
            document.getElementById('rdoRecInsp').checked = true;
        }
        if (reportDetails.processApplicable === 'WIP') {
            document.getElementById('rdoWIP').checked = true;
        }
        document.getElementById('sapNo').value = reportDetails.sapNo;
        document.getElementById('itemDescription').value = reportDetails.itemDescription;
        document.getElementById('defectDescription').value = reportDetails.descriptionOfDefect;

        if (nonConformanceDetails.isNonConforming === 'Yes') {
            document.getElementById('rdoConformingYes').checked = true;
        }
        if (nonConformanceDetails.isNonConforming === 'No') {
            document.getElementById('rdoConformingNo').checked = true;
        }
        document.getElementById('reportDate').value = nonConformanceDetails.dateOfReport;
        document.getElementById('repName').value = nonConformanceDetails.qualityRepresentativeName;
    }
}




//I kept the savesendfunction but deleted the save/send buttons like Dave requested, so this single button/event handles saving the thingy.
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


//button to reset the form inputs to empty so that the user doesn't have to laboriously do it manually.
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

function autoExpandTextarea(textarea) {
    function resize() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    textarea.addEventListener('input', resize);
    resize();
}
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
//on load i reset the timer, but I also loadFormData, which I'm a little worried might be brittle on other pages that use this.
window.onload = function () {
    resetTimer();
    loadFormData();

    var itemDescriptionTextarea = document.getElementById('itemDescription');
    var defectDescriptionTextarea = document.getElementById('defectDescription');

    autoExpandTextarea(itemDescriptionTextarea);
    autoExpandTextarea(defectDescriptionTextarea);


    handleDeselectRadioButton('rdoIPA', { value: lastCheckedRadioIPA });
    handleDeselectRadioButton('conforming', { value: lastCheckedRadioConforming });
}

