// This code handles things related to NCR form storage and retrieval

var storedNCRs = JSON.parse(localStorage.getItem("storedNCRs")) || [];
var incompleteNCRs = JSON.parse(localStorage.getItem("incompleteNCRs")) || [];

// Function to display the list of NCRs
function displayNCRList(ncrList, isComplete = true) {
    var ncrListContainer = document.getElementById(isComplete ? "ncrList" : "incompleteNcrList");
    ncrListContainer.innerHTML = "";

    if (ncrList.length === 0) {
        ncrListContainer.innerHTML = `<p>No ${isComplete ? "" : "incomplete "}NCRs found.</p>`;
        return;
    }

    var table = document.createElement("table");
    table.classList.add("ncr-table");

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    ["NCR Number", "Supplier Name", "Date", "Status", "Actions"].forEach(function (headerText) {
        var th = document.createElement("th");
        th.innerText = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");

    ncrList.forEach(function (ncr, index) {
        var row = document.createElement("tr");

        // NCR Number
        var ncrNumberCell = document.createElement("td");
        ncrNumberCell.innerText = ncr.supplierInfo.ncrNumber || "N/A";
        row.appendChild(ncrNumberCell);

        // Supplier Name
        var supplierNameCell = document.createElement("td");
        supplierNameCell.innerText = ncr.supplierInfo.supplierName || "Incomplete";
        row.appendChild(supplierNameCell);

        // Date
        var dateCell = document.createElement("td");
        dateCell.innerText = ncr.nonConformanceDetails?.dateOfReport || "N/A";
        row.appendChild(dateCell);

        // Status
        var statusCell = document.createElement("td");
        statusCell.innerText = ncr.status || (isComplete ? "Open" : "Incomplete");
        row.appendChild(statusCell);

        // Actions (View, Edit, Delete)
        var actionsCell = document.createElement("td");

        // Edit Button
        var editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function () {
            localStorage.setItem("currentEditIndex", index);
            localStorage.setItem("isIncomplete", !isComplete);
            window.location.href = "qualityInspector.html";
        };
        actionsCell.appendChild(editButton);

        // Delete Button
        var deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
            deleteNCR(index, isComplete);
        };
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    ncrListContainer.appendChild(table);
}

// Edit NCR function to load the existing NCR data into the form
function editNCR(index) {
    const ncr = storedNCRs[index];
    const session = JSON.parse(localStorage.getItem("session"));
    const userRole = session ? session.role : null;

    function setValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
            if (id === "ncrNo") {
                element.readOnly = true; // Make NCR number read-only
            }
        } else {
            console.warn(`Element with ID ${id} not found`);
        }
    }

    setValue("supName", ncr.supplierInfo.supplierName);
    setValue("ncrNo", ncr.supplierInfo.ncrNumber);
    setValue("prodNo", ncr.supplierInfo.poOrProductNumber);
    setValue("saleOrderNo", ncr.supplierInfo.salesOrderNumber);
    setValue("quantityR", ncr.supplierInfo.quantityReceived);
    setValue("quantityD", ncr.supplierInfo.quantityDefective);

    var rdoRecInsp = document.getElementById("rdoRecInsp");
    if (rdoRecInsp && ncr.reportDetails.processApplicable === "recInsp") {
        rdoRecInsp.checked = true;
    }
    var rdoWIP = document.getElementById("rdoWIP");
    if (rdoWIP && ncr.reportDetails.processApplicable === "WIP") {
        rdoWIP.checked = true;
    }
    setValue("sapNo", ncr.reportDetails.sapNo);
    setValue("itemDescription", ncr.reportDetails.itemDescription);
    setValue("defectDescription", ncr.reportDetails.descriptionOfDefect);

    var rdoConformingYes = document.getElementById("rdoConformingYes");
    if (rdoConformingYes && ncr.nonConformanceDetails.isNonConforming === "Yes") {
        rdoConformingYes.checked = true;
    }
    var rdoConformingNo = document.getElementById("rdoConformingNo");
    if (rdoConformingNo && ncr.nonConformanceDetails.isNonConforming === "No") {
        rdoConformingNo.checked = true;
    }
    setValue("reportDate", ncr.nonConformanceDetails.dateOfReport);
    setValue("repName", ncr.nonConformanceDetails.qualityRepresentativeName);

    if (userRole === "Engineering" || userRole === "Operations Manager") {
        if (ncr.engineeringAction) {
            setValue("selectDisposition", ncr.engineeringAction.disposition);
            setValue("dispositionDescription", ncr.engineeringAction.dispositionDescription);
            var rdoRedrawYes = document.getElementById("rdoRedrawYes");
            if (rdoRedrawYes && ncr.engineeringAction.redraw === "Yes") {
                rdoRedrawYes.checked = true;
            }
            var rdoRedrawNo = document.getElementById("rdoRedrawNo");
            if (rdoRedrawNo && ncr.engineeringAction.redraw === "No") {
                rdoRedrawNo.checked = true;
            }
            setValue("revisionDate", ncr.engineeringAction.revisionDate);
            setValue("txtEngName", ncr.engineeringAction.engineerName);
        }
    }

    if (userRole === "Operations Manager" && ncr.operationsAction) {
        setValue("purchDecision", ncr.operationsAction.purchDecision);
    }

    document.getElementById("saveButton")?.addEventListener("click", function () {
        const updatedNCR = saveSendFunction();
        if (userRole === "Quality Inspector") {
            delete updatedNCR.engineeringAction;
            delete updatedNCR.operationsAction;
        }
        storedNCRs[index] = updatedNCR;
        localStorage.setItem("storedNCRs", JSON.stringify(storedNCRs));
        displayNCRList(storedNCRs);
    });
}

// Function to view NCR details
function viewNCR(index) {
    localStorage.setItem("currentViewIndex", index);
    window.location.href = "viewNCR.html";
}


// Function to delete an NCR, either complete or incomplete
function deleteNCR(index, isComplete) {
    if (confirm("Deleting NCR, are you sure?")) {
        if (isComplete) {
            storedNCRs.splice(index, 1);
            localStorage.setItem("storedNCRs", JSON.stringify(storedNCRs));
            displayNCRList(storedNCRs, true);
        } else {
            incompleteNCRs.splice(index, 1);
            localStorage.setItem("incompleteNCRs", JSON.stringify(incompleteNCRs));
            displayNCRList(incompleteNCRs, false);
        }
    }
}

// Search function for NCRs
function searchNCRs() {
    var year = document.getElementById("yearSearch").value;
    var code = document.getElementById("codeSearch").value.trim();
    var supplier = document.getElementById("supplierSearch").value;

    var filteredNCRs = storedNCRs.filter(function (ncr) {
        var matchYear = true;
        var matchCode = true;
        var matchSupplier = true;

        if (year) {
            var ncrYear = new Date(ncr.nonConformanceDetails.dateOfReport).getFullYear().toString();
            matchYear = ncrYear === year;
        }
        if (code) {
            matchCode = ncr.supplierInfo.ncrNumber.endsWith(code);
        }
        if (supplier) {
            matchSupplier = ncr.supplierInfo.supplierName === supplier;
        }

        return matchYear && matchCode && matchSupplier;
    });

    displayNCRList(filteredNCRs);
}

document.getElementById("btnSearch").addEventListener("click", function (event) {
    event.preventDefault();
    searchNCRs();
});

document.addEventListener("DOMContentLoaded", function () {
    storedNCRs = JSON.parse(localStorage.getItem("storedNCRs")) || [];
    incompleteNCRs = JSON.parse(localStorage.getItem("incompleteNCRs")) || [];
    displayNCRList(storedNCRs, true);
    displayNCRList(incompleteNCRs, false);
});