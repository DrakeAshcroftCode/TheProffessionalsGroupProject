
// This code handles the logic behind registering/logging in.
//domcontent loaded just means "make sure the HTML elements are visible to the JS before we mess with them", I have nested most of the page inside of it to be sure.
//throughout this document in the eventlisteners you will see me use preventDefault(), this is provided by JS
//and it simply stops the default event behavior from happening so that I can mess with it.
//Code for login button, finding any users that exist, checking if the user is logged in or not, etc.
function saveSendFunction() {
    const session = JSON.parse(localStorage.getItem('session')) || {};

    var supplierName = document.getElementById('supName').value;
    var ncrNumber = document.getElementById('ncrNo').value;
    var poOrProductNumber = document.getElementById('prodNo').value;
    var salesOrderNumber = document.getElementById('saleOrderNo').value;
    var quantityReceived = document.getElementById('quantityR').value;
    var quantityDefective = document.getElementById('quantityD').value;

    
    var sapNo = document.getElementById('sapNo').value;

    var itemDescription = document.getElementById('itemDescription').value;
    var defectDescription = document.getElementById('defectDescription').value;

    if(session.role== 'Quality Inspector' && window.location.pathname == '/qualityInspector.html'){
        var ncrImage = document.getElementById('nrcImage').files;
    }    

    var rdoConformingYes = document.getElementById('rdoConformingYes');
    var rdoConformingNo = document.getElementById('rdoConformingNo');
    var reportDate = document.getElementById('reportDate').value;
    var repName = document.getElementById('repName').value;

    
    if (session.role === 'Engineering' && window.location.pathname === '/engineering.html'){
    var dispositionDescription = document.getElementById('dispositionDescription').value;
    var selectDisposition = document.getElementById('selectDisposition').value;
    var selectNotification = document.getElementById('selectNotification').value;
    
    var origRevNum = document.getElementById('txtUpRevNo').value;
    var updatedRevNum = document.getElementById('txtUpRevNo').value;
    var revisionDate = document.getElementById('revisionDateDate').value;
    var engineerName = document.getElementById('txtEngName').value;
    var status = document.getElementById('status').value;
    }

    if (session.role ==='Operations Manager' && window.location.pathname === '/operations.html'){
        var purchDecision = document.getElementById('purchDecision').value;       
        var car = document.getElementById('CAR').value;
        var carNum = document.getElementById('carNumber').value;
        var followUp = document.getElementById('followUp').value;
        var txtOpName = document.getElementById('txtOpName').value;
        var revisionDate = document.getElementById('operationsDate').value;
        var reInspect = document.getElementById('reInspect').value;
        var newNCRNum = document.getElementById('newNCRnumber').value;
        var inspectorName = document.getElementById('txtInspectorName').value;
        var inspectorDate = document.getElementById('finalInspectorDate').value;
        var qualityName = document.getElementById('txtQualityName').value;
        var qualityDate = document.getElementById('qualityDate').value;
}
    var rdoOneValue = '';
    if(window.location.pathname === '/qualityInspector.html' || '/engineering.html'){
        var rdoRecInsp = document.getElementById('rdoRecInsp');
        var rdoWIP = document.getElementById('rdoWIP');
        if (rdoRecInsp && rdoRecInsp.checked) {
            rdoOneValue = 'rdoRecInsp';
        } else if (rdoWIP && rdoWIP.checked) {
            rdoOneValue = 'rdoWIP';
        }
    }
   console.log(rdoOneValue);

    var rdoTwoValue = '';
    if (rdoConformingYes.checked) {
        rdoTwoValue = 'Yes';
    } else if (rdoConformingNo.checked) {
        rdoTwoValue = 'No';
    }

    var rdoThreeValue = '';
    if(window.location.pathname === '/engineering.html'){
        var rdoRedrawYes = document.getElementById('rdoRedrawYes').value;
        var rdoRedrawNo = document.getElementById('rdoRedrawNo').value;
        if (rdoRedrawYes.checked) {
            rdoThreeValue = 'Yes';
        } else if (rdoRedrawNo.checked) {
            rdoThreeValue = 'No';
        }   
    }
    

    //Submitter flag stored to call notifications.
    var submitterRole = session.role;   
    console.log(submitterRole);
    
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
            rdoWIP:rdoWIP,
            itemDescription: itemDescription,
            descriptionOfDefect: defectDescription,
            nonConformityImage: ncrImage,
            selectDisposition: selectDisposition,
            dispositionDescription: dispositionDescription,
            selectNotification: selectNotification,
            needRedraw: rdoThreeValue,
            origRevNum: origRevNum,
            updatedRevNum: updatedRevNum,
            revisionDate: revisionDate,
            engineerName: engineerName,
            submitterRole: submitterRole,           
        },
        nonConformanceDetails: {
            isNonConforming: rdoTwoValue,
            dateOfReport: reportDate,
            qualityRepresentativeName: repName,
            status: status,
            purchDecision: purchDecision,
            car: car,
            carNum: carNum,
            followUp: followUp,
            txtOpName: txtOpName,
            revisionDate: revisionDate,
            reInspect: reInspect,
            newNCRNum: newNCRNum,
            inspectorName: inspectorName,
            inspectorDate: inspectorDate,
            qualityName: qualityName,
            qualityDate: qualityDate,
        },
       engineeringDetails:{           
            needRedraw: rdoThreeValue,
            isNonConforming: rdoTwoValue,
            origRevNum: origRevNum,
            updatedRevNum: updatedRevNum,
            revisionDate: revisionDate,
            engineerName: engineerName,
            status: status,
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

    if(window.location.pathname === '/qualityInspector.html'){
        
        const nrcImageError = document.getElementById('nrcImageError');
        if (!ncrForm.reportDetails.nonConformityImage || ncrForm.reportDetails.nonConformityImage.length === 0) {
            nrcImageError.textContent = "You must upload an image";
            isValid = false;
            if (!firstErrorElement) firstErrorElement = document.getElementById('nrcImage');
        }
    }
    

    // Clear error messages
    if(window.location.pathname === '/qualityInspector.html'){
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
    }
    

    // Validation checks
    if (ncrForm.supplierInfo.supplierName === "") {
        supNameError.textContent = "Name is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('supName');
    }

    if (ncrForm.supplierInfo.supplierName.length > 35) {
        supNameError.textContent = "Please ensure your name is within the 35 character limit";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('supName');
    }

    if (ncrForm.supplierInfo.ncrNumber === "") {
        ncrNoError.textContent = "NCR number is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (ncrForm.supplierInfo.ncrNumber.length !== 8) {
        ncrNoError.textContent = "Please make sure your NCR number consists of 8 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('ncrNo');
    }

    if (ncrForm.supplierInfo.poOrProductNumber === "") {
        prodNoError.textContent = "Product number is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('prodNo');
    }

    if (isNaN(ncrForm.supplierInfo.poOrProductNumber)) {
        prodNoError.textContent = "Your product number has to be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('prodNo');
    }

    if (ncrForm.supplierInfo.salesOrderNumber === "") {
        saleOrderNoError.textContent = "Sales order number is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (isNaN(ncrForm.supplierInfo.salesOrderNumber)) {
        saleOrderNoError.textContent = "Your sales order number has to be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (ncrForm.supplierInfo.salesOrderNumber.length > 8) {
        saleOrderNoError.textContent = "Please ensure  sales order number is withnin 8 digits";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('saleOrderNo');
    }

    if (ncrForm.supplierInfo.quantityReceived === "") {
        quantityRError.textContent = "Quantity is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityR');
    }

    if (isNaN(ncrForm.supplierInfo.quantityReceived)) {
        quantityRError.textContent = "Quantity has to be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityR');
    }

    if (ncrForm.supplierInfo.quantityDefective === "") {
        quantityDError.textContent = "Defective quantity is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityD');
    }

    if (isNaN(ncrForm.supplierInfo.quantityDefective)) {
        quantityDError.textContent = "Defective quantity has to be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('quantityD');
    }

    if (ncrForm.reportDetails.sapNo === "") {
        sapNoError.textContent = "SAP number is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('sapNo');
    }

    if (isNaN(ncrForm.reportDetails.sapNo)) {
        sapNoError.textContent = "SAP number has to be a number";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('sapNo');
    }

    if (ncrForm.reportDetails.itemDescription === "") {
        itemDescriptionError.textContent = "Item description is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('itemDescription');
    }

    if (ncrForm.reportDetails.itemDescription.length > 250) {
        itemDescriptionError.textContent = "Item description has to be less than 250 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('itemDescription');
    }

    if (ncrForm.reportDetails.descriptionOfDefect === "") {
        defectDescriptionError.textContent = "Description of the defect is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('defectDescription');
    }

    if (ncrForm.reportDetails.descriptionOfDefect.length > 250) {
        defectDescriptionError.textContent = "Defect description has to be less than 250 characters";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('defectDescription');
    }

   

    if (ncrForm.nonConformanceDetails.qualityRepresentativeName === "") {
        repNameError.textContent = "Name is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('repName');
    }

    if (ncrForm.nonConformanceDetails.qualityRepresentativeName.length > 70) {
        repNameError.textContent = "Please ensure your name is within the 70 character limit";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('repName');
    }

    if (ncrForm.nonConformanceDetails.dateOfReport === "") {
        reportDateError.textContent = "Date is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('reportDate');
    }

    if (ncrForm.reportDetails.processApplicable === "") {
        rdoIPAError.textContent = "Selecting one of the option is required";
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementsByName('rdoIPA')[0];
    }

    if (ncrForm.nonConformanceDetails.isNonConforming === "") {
        rdoConformingError.textContent = "Selecting one of the option is required";
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
    const session = JSON.parse(localStorage.getItem('session')); // Assume session stores user role
    const userRole = session?.role; // Get user role
    const ncrData = JSON.parse(localStorage.getItem('currentNCR')); // Get NCR data
    const ncrNumberNext = generateNCRNumber();

    if (ncrNumberNext) {
        document.getElementById('ncrNo').value = ncrNumberNext;
    }

    if (!ncrData) {
        console.warn("No NCR data found for this session.");
        return; // Stop further execution if no NCR data
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
        if (element && value) element.value = value; // Populate if value exists
    });

    // Check user role and populate role-specific fields
    if (userRole === "Engineering") {
        const engineeringFields = [
            { id: "selectDisposition", value: ncrData?.engineeringAction?.disposition },
            { id: "dispositionDescription", value: ncrData?.engineeringAction?.dispositionDescription },
            { id: "revisionDate", value: ncrData?.engineeringAction?.revisionDate },
            { id: "txtEngName", value: ncrData?.engineeringAction?.engineerName },
        ];

        engineeringFields.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        });
    } else if (userRole === "Operations Manager") {
        const operationsFields = [
            { id: "purchDecision", value: ncrData?.operationsAction?.purchDecision },
            { id: "CAR", value: ncrData?.operationsAction?.car },
            { id: "carNumber", value: ncrData?.operationsAction?.carNumber },
            { id: "followUp", value: ncrData?.operationsAction?.followUp },
            { id: "txtOpName", value: ncrData?.operationsAction?.operationsManager },
        ];

        operationsFields.forEach(({ id, value }) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        });
    } else if (userRole === "Quality Inspector") {
        console.log("Quality Inspector role: No additional fields to populate.");
        // No additional fields to populate for Quality Inspector
    } else {
        console.warn("Unrecognized user role.");
    }

    console.log(`Loaded NCR data for role: ${userRole}`);
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