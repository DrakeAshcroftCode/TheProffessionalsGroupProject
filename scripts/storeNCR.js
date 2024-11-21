//This code handles things related to NCR form storage and retrieval.


var storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];
// this fairly large function checks whether any NCRs are stored, and if so, it retrieves and lists them using DOM
function displayNCRList(ncrList) {
    var ncrListContainer = document.getElementById('ncrList');
    ncrListContainer.innerHTML = '';

    if (ncrList.length === 0) {
        ncrListContainer.innerHTML = '<p>No NCRs found.</p>';
        return;
    }

    var table = document.createElement('table');
    table.classList.add('ncr-table');

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    ['NCR Number', 'Supplier Name', 'Date', 'Actions'].forEach(function (headerText) {
        var th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    ncrList.forEach(function (ncr, index) {
        var row = document.createElement('tr');

        var ncrNumberCell = document.createElement('td');
        ncrNumberCell.innerText = ncr.supplierInfo.ncrNumber;
        row.appendChild(ncrNumberCell);

        var supplierNameCell = document.createElement('td');
        supplierNameCell.innerText = ncr.supplierInfo.supplierName;
        row.appendChild(supplierNameCell);

        var dateCell = document.createElement('td');
        dateCell.innerText = ncr.nonConformanceDetails.dateOfReport;
        row.appendChild(dateCell);

        var actionsCell = document.createElement('td');
        var viewButton = document.createElement('button');
        viewButton.innerText = 'View';
        viewButton.onclick = function () {
            viewNCR(index);
        };
        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function () {
            deleteNCR(index);
        };
        actionsCell.appendChild(viewButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    ncrListContainer.appendChild(table);
}
// this function retrieves and displays the selected (index) ncr form in a popup alert window. Rudementary for now, final version will display on a page.
function viewNCR(index) {
    var ncr = storedNCRs[index];
    var ncrDetails = `
    NCR Number: ${ncr.supplierInfo.ncrNumber}
    Supplier Name: ${ncr.supplierInfo.supplierName}
    Product Number: ${ncr.supplierInfo.poOrProductNumber}
    Sales Order Number: ${ncr.supplierInfo.salesOrderNumber}
    Quantity Received: ${ncr.supplierInfo.quantityReceived}
    Quantity Defective: ${ncr.supplierInfo.quantityDefective}
    Process Applicable: ${ncr.reportDetails.processApplicable}
    SAP Number: ${ncr.reportDetails.sapNo}
    Item Description: ${ncr.reportDetails.itemDescription}
    Description of Defect: ${ncr.reportDetails.descriptionOfDefect}
    Is Non-Conforming: ${ncr.nonConformanceDetails.isNonConforming}
    Date of Report: ${ncr.nonConformanceDetails.dateOfReport}
    Quality Representative Name: ${ncr.nonConformanceDetails.qualityRepresentativeName}
    `;
    alert(ncrDetails);
}
// this function receives the index of the NCR the user is trying to delete, and then gracefully eliminates it.
function deleteNCR(index) {
    if (confirm('Deleting NCR, are you sure?')) {
        storedNCRs.splice(index, 1);
        localStorage.setItem('storedNCRs', JSON.stringify(storedNCRs));
        displayNCRList(storedNCRs);
    }
}
// this function retrieves the search criteria from the user inputs and checks them for a match against what is stored. Then displays any NCRs that match that criteria.
function searchNCRs() {
    var year = document.getElementById('yearSearch').value;
    var code = document.getElementById('codeSearch').value.trim();
    var supplier = document.getElementById('supplierSearch').value;

    var filteredNCRs = storedNCRs.filter(function (ncr) {
        var matchYear = true;
        var matchCode = true;
        var matchSupplier = true;

        if (year) {
            var ncrYear = new Date(ncr.nonConformanceDetails.dateOfReport).getFullYear().toString();
            matchYear = (ncrYear === year);
        }
        if (code) {
            matchCode = ncr.supplierInfo.ncrNumber.endsWith(code);
        }
        if (supplier) {
            matchSupplier = (ncr.supplierInfo.supplierName === supplier);
        }

        return matchYear && matchCode && matchSupplier;
    });

    displayNCRList(filteredNCRs);
}
//Button event, obviously.
document.getElementById('btnSearch').addEventListener('click', function (event) {
    event.preventDefault();
    searchNCRs();
});
// the code will always call the displayNCRlist function, so that it updates.
displayNCRList(storedNCRs);
// Making sure the user timer resets for accessibility purposes.
window.onload = function () {
    resetTimer();

}