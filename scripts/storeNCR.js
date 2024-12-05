
// This code handles things related to NCR form storage and retrieval

var storedNCRs = JSON.parse(localStorage.getItem("storedNCRs")) || [];
var incompleteNCRs = JSON.parse(localStorage.getItem("incompleteNCRs")) || [];

// this fairly large function checks whether any NCRs are stored, and if so, it retrieves and lists them using DOM
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

        // Actions (View, Edit, Delete, Export)
        var actionsCell = document.createElement("td");
       // View Button
       var viewButton = document.createElement('button');
       viewButton.innerText = 'View';
       viewButton.onclick = function () {
           viewNCR(index);
       };
       actionsCell.appendChild(viewButton);
        // Edit Button
        var editButton = document.createElement("button");
        
        editButton.innerText = "Edit";
        editButton.onclick = function () {
        const session = JSON.parse(localStorage.getItem("session"));
        const userRole = session ? session.role : null;
             // Redirect based on role
        if (userRole === "Quality Inspector") {
            window.location.href = "qualityInspector.html";
        } else if (userRole === "Engineering") {
            window.location.href = "engineering.html";
        } else if (userRole === "Operations Manager") {
            window.location.href = "operations.html";
        } else {
            console.warn("User role not found. Redirecting to login.");
            window.location.href = "login.html"; // Redirect to login
            return;
        }

            localStorage.setItem("currentEditIndex", index);
            localStorage.setItem("isIncomplete", !isComplete);
        };
        actionsCell.appendChild(editButton);

        // Delete Button
        // var deleteButton = document.createElement("button");
        // deleteButton.innerText = "Delete";
        // deleteButton.onclick = function () {
        //     deleteNCR(index, isComplete);
        // };
        // actionsCell.appendChild(deleteButton);

        // Export Button
        const exportButton = document.createElement("button");
        exportButton.innerText = "Export";

        const session = JSON.parse(localStorage.getItem("session"));
        const userRole = session ? session.role : null;
        exportButton.onclick = function () {
            
            if (userRole === "Engineering") {
                exportNCRAsPDF(index)
                exportButton.disabled = false; 
            } else {
            alert('Only engineers can export pdf.')
               exportButton.disabled = true; 
               
            }
        }
            
        
   actionsCell.appendChild(exportButton);
   row.appendChild(actionsCell);
   tbody.appendChild(row);
});

    table.appendChild(tbody);
    ncrListContainer.appendChild(table);
}
// This is based on the jsPDF api. If you guys need help on working with it https://artskydj.github.io/jsPDF/docs/jsPDF.html
// it is not as complicated as it looks. We just need a logic structure (if else for instance) that checks if the form has engineering data
// and if so, exports the engineering data in the pdf. Everything else is simple little doc.text commands
function exportNCRAsPDF(index) {
    const session = JSON.parse(localStorage.getItem("session"));
    const userRole = session ? session.role : null;

    const ncr = storedNCRs[index];
    const { jsPDF } = window.jspdf; 

    const doc = new jsPDF();

    const crossfireLogo = './images/CrossfireLogo.png';
    doc.addImage(crossfireLogo, 'PNG', 10, 10, 50, 15);

    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.setFont("helvetica", "bold");
    doc.text("NCR Report", 105, 30, { align: "center" });

    const sectionHeaderColor = [52, 152, 219];

    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 40, 190, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Supplier and Product Info", 15, 47);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Supplier Name: ${ncr.supplierInfo.supplierName || "N/A"}`, 15, 55);
    doc.text(`NCR Number: ${ncr.supplierInfo.ncrNumber || "N/A"}`, 15, 60);
    doc.text(`Product Number: ${ncr.supplierInfo.poOrProductNumber || "N/A"}`, 15, 65);
    doc.text(`Sales Order Number: ${ncr.supplierInfo.salesOrderNumber || "N/A"}`, 15, 70);
    doc.text(`Quantity Received: ${ncr.supplierInfo.quantityReceived || "N/A"}`, 15, 75);
    doc.text(`Quantity Defective: ${ncr.supplierInfo.quantityDefective || "N/A"}`, 15, 80);

    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 90, 190, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Report Details", 15, 97);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`SAP Number: ${ncr.reportDetails.sapNo || "N/A"}`, 15, 105);
    doc.text(`Item Description: ${ncr.reportDetails.itemDescription || "N/A"}`, 15, 110);
    doc.text(`Defect Description: ${ncr.reportDetails.descriptionOfDefect || "N/A"}`, 15, 115);

    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 125, 190, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Nonconformance Details", 15, 132);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Is Non-Conforming: ${ncr.nonConformanceDetails.isNonConforming || "N/A"}`, 15, 140);
    doc.text(`Date of Report: ${ncr.nonConformanceDetails.dateOfReport || "N/A"}`, 15, 145);
    doc.text(`Quality Representative: ${ncr.nonConformanceDetails.qualityRepresentativeName || "N/A"}`, 15, 150);

   /* doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 165, 190, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Engineering Details", 15, 132);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Disposition: ${ncr.engineeringAction.selectDisposition || "N/A"}`, 15, 160);
    doc.text(`Description of disposition: ${ncr.engineeringAction.dispositionDescription || "N/A"}`, 15, 165);
    doc.text(`Original Rev. Number: ${ncr.engineeringAction.txtUpRevNo || "N/A"}`, 15, 170);
    doc.text(`Revision Date: ${ncr.engineeringAction.revisionDateDate || "N/A"}`, 15, 175);
    doc.text(`Name of Engineer: ${ncr.engineeringAction.txtEngName || "N/A"}`, 15, 180);*/

    doc.save(`${ncr.supplierInfo.ncrNumber || "NCR_Report"}.pdf`);
}

// Edit NCR function to load the existing NCR data into the form
function editNCR(index) {
    const ncr = storedNCRs[index];
    

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

    //taking the passed ncr form and setting the form inputs to their values.
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

    // This here is where I have coded the check for what the users role is, and if they do have access to 
    // engineering, we then populate the fields with the relevant info. Please verify this works.
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
   //function to dynamically generate an NCR number.
    let ncrCounter = 0;
    function generateNCRNumber() {
    const year = new Date().getFullYear();
    const storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];

    // Filter NCRs from the current year to find the highest existing NCR number
    const currentYearNCRs = storedNCRs
        .filter(ncr => ncr.supplierInfo.ncrNumber.startsWith(`${year}-`))
        .map(ncr => parseInt(ncr.supplierInfo.ncrNumber.split('-')[1], 10)); // Extract the counter part after the hyphen

    const lastNumber = currentYearNCRs.length > 0 ? Math.max(...currentYearNCRs) : 0;

    if (ncrCounter === 0) {
        ncrCounter = lastNumber;
    }

    ncrCounter += 1;

    return `${year}-${String(ncrCounter).padStart(3, '0')}`;
}
// Function to seed NCRs if there are none, if none found, it'll give us ten of them as mark requested.
function seedNCRs() {
    let storedNCRs = JSON.parse(localStorage.getItem('storedNCRs')) || [];

    if (storedNCRs.length > 0) {
        console.log("NCRs are already seeded. Skipping seeding process.");
        return;
    }

    for (let i = 1; i <= 10; i++) {
        const newNCR = {
            supplierInfo: {
                ncrNumber: generateNCRNumber(),
                supplierName: `Supplier ${i}`,
                poOrProductNumber: `${1000 + i}`,
                salesOrderNumber: `${10000000 + i}`,
                quantityReceived: Math.floor(Math.random() * 100) + 1,
                quantityDefective: Math.floor(Math.random() * 10),
            },
            reportDetails: {
                processApplicable: 'recInsp',
                sapNo: `${3000 + i}`,
                itemDescription: `Item description ${i}`,
                descriptionOfDefect: `Defect description ${i}`,
                nonConformityImage: `image${i}.jpg`
            },
            nonConformanceDetails: {
                isNonConforming: 'Yes',
                dateOfReport: new Date().toISOString().split('T')[0],
                qualityRepresentativeName: `Rep ${i}`,
            }
        };

        storedNCRs.push(newNCR);
    }

    localStorage.setItem('storedNCRs', JSON.stringify(storedNCRs));
    console.log("NCRs seeded successfully.");
}
// Function to view NCR details
// I used to have a lot more code here but I broke it out into a separate JS file (ViewNCR.js) for better
// functionality across pages.
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
// Mark wanted us to add more search functionalities. Searching by date range, searching by open closed status.
function searchNCRs() {
    var year = document.getElementById("yearSearch").value;
    var code = document.getElementById("codeSearch").value.trim();
    var supplier = document.getElementById("supplierSearch").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var inspectorName = document.getElementById("inspectorNameSearch").value.trim();

    var filteredNCRs = storedNCRs.filter(function (ncr) {
        var matchYear = true;
        var matchCode = true;
        var matchSupplier = true;
        var matchDateRange = true;
        var matchInspectorName = true;

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
        if (startDate) {
            var ncrDate = new Date(ncr.nonConformanceDetails.dateOfReport);
            matchDateRange = ncrDate >= new Date(startDate);
        }
        if (endDate) {
            var ncrDate = new Date(ncr.nonConformanceDetails.dateOfReport);
            matchDateRange = matchDateRange && ncrDate <= new Date(endDate);
        }
        if (inspectorName) {
            matchInspectorName = ncr.nonConformanceDetails.qualityRepresentativeName.includes(inspectorName);
        }

        return matchYear && matchCode && matchSupplier && matchDateRange && matchInspectorName;
    });

    displayNCRList(filteredNCRs);
}


// Function to populate the supplier search dropdown dynamically
function populateSupplierDropdown() {
    const supplierDropdown = document.getElementById("supplierSearch");
    const suppliers = new Set();

    // Iterate over stored NCRs and collect unique supplier names
    storedNCRs.forEach(ncr => {
        if (ncr.supplierInfo && ncr.supplierInfo.supplierName) {
            suppliers.add(ncr.supplierInfo.supplierName); 
        }
    });

    // Clear existing options except the first one (All Suppliers)
    supplierDropdown.innerHTML = '<option value="">All Suppliers</option>';

    // Add unique suppliers to the dropdown
    suppliers.forEach(supplier => {
        const option = document.createElement("option");
        option.value = supplier;
        option.textContent = supplier;
        supplierDropdown.appendChild(option);
    });
}

// Call the function to populate the supplier dropdown on page load
document.addEventListener('DOMContentLoaded', populateSupplierDropdown);

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

seedNCRs();