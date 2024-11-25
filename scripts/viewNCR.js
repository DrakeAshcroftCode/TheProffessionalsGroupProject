document.addEventListener('DOMContentLoaded', function () {
    const index = localStorage.getItem('currentViewIndex');
    if (index !== null) {
        const ncr = JSON.parse(localStorage.getItem('storedNCRs'))[index];
        if (ncr) {
            document.getElementById('viewNcrNumber').textContent = ncr.supplierInfo.ncrNumber;
            document.getElementById('viewSupplierName').textContent = ncr.supplierInfo.supplierName;
            document.getElementById('viewProductNumber').textContent = ncr.supplierInfo.poOrProductNumber;
            document.getElementById('viewSalesOrderNumber').textContent = ncr.supplierInfo.salesOrderNumber;
            document.getElementById('viewQuantityReceived').textContent = ncr.supplierInfo.quantityReceived;
            document.getElementById('viewQuantityDefective').textContent = ncr.supplierInfo.quantityDefective;
            document.getElementById('viewProcessApplicable').textContent = ncr.reportDetails.processApplicable;
            document.getElementById('viewSapNumber').textContent = ncr.reportDetails.sapNo;
            document.getElementById('viewItemDescription').textContent = ncr.reportDetails.itemDescription;
            document.getElementById('viewDefectDescription').textContent = ncr.reportDetails.descriptionOfDefect;
            document.getElementById('viewIsNonConforming').textContent = ncr.nonConformanceDetails.isNonConforming;
            document.getElementById('viewDateOfReport').textContent = ncr.nonConformanceDetails.dateOfReport;
            document.getElementById('viewQualityRepName').textContent = ncr.nonConformanceDetails.qualityRepresentativeName;
        }
    }

    // Set up the Edit button to redirect to the edit page
    const editButton = document.getElementById('viewEditButton');
    editButton.addEventListener('click', function () {
        localStorage.setItem('currentEditIndex', index);
        window.location.href = 'qualityInspector.html'; // Redirect to the edit page
    });
    const backButton = document.getElementById('viewBackButton');
    backButton.addEventListener('click', function () {
        window.location.href = 'storeNCR.html'; // Redirect to the storage page
    });
});
