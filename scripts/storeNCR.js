
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
       viewButton.title="View NCR record"
       viewButton.onclick = function () {
           viewNCR(index);
       };
       actionsCell.appendChild(viewButton);
        // Edit Button
        var editButton = document.createElement("button");
        
        editButton.innerText = "Edit";
        editButton.title="Edit NCR  record"
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

        /*// Delete Button
        var deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function () {
            deleteNCR(index, isComplete);
        };
        actionsCell.appendChild(deleteButton);*/

        // Export Button
        const exportButton = document.createElement("button");
        exportButton.innerText = "Export";
        exportButton.title="Export NCR record"

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
////////////////////////////////////////////////////////////////////////
    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 40, 190, 10, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Quality Representative Information", 15, 47);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Identify Process Applicable: ${ncr.reportDetails.processApplicable || "N/A"}`, 15, 55);
    doc.text(`Supplier Name: ${ncr.supplierInfo.supplierName || "N/A"}`, 15, 60);
    doc.text(`NCR Number: ${ncr.supplierInfo.ncrNumber || "N/A"}`, 15, 65);
    doc.text(`Product Number: ${ncr.supplierInfo.poOrProductNumber || "N/A"}`, 15, 70);
    doc.text(`Sales Order Number: ${ncr.supplierInfo.salesOrderNumber || "N/A"}`, 15, 75);
    doc.text(`Quantity Received: ${ncr.supplierInfo.quantityReceived || "N/A"}`, 15, 80);
    doc.text(`Quantity Defective: ${ncr.supplierInfo.quantityDefective || "N/A"}`, 15, 85);
    doc.text(`Item Description: ${ncr.reportDetails.itemDescription || "N/A"}`, 15, 90);
    doc.text(`SAP Number: ${ncr.reportDetails.sapNo || "N/A"}`, 15, 95);
    doc.text(`Defect Description: ${ncr.reportDetails.descriptionOfDefect || "N/A"}`, 15, 100);
    doc.text(`Is Non-Conforming?: ${ncr.nonConformanceDetails.isNonConforming || "N/A"}`, 15, 105);
    doc.text(`Quality Representative: ${ncr.nonConformanceDetails.qualityRepresentativeName || "N/A"}`, 15, 110);
    doc.text(`Date of Report: ${ncr.nonConformanceDetails.dateOfReport || "N/A"}`, 15, 115);
   
   
/////////////////////////////////////////////////////////////////////////
    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 120, 190, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Engineering Information", 15, 127);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Review by CF Engineer: ${ncr.reportDetails.selectDisposition || "N/A"}`, 15, 135);
    doc.text(`Does Customer Require Notification?: ${ncr.reportDetails.selectNotification || "N/A"}`, 15, 140);
    doc.text(`Disposition Description: ${ncr.reportDetails.dispositionDescription || "N/A"}`, 15, 145);
    doc.text(`Does Drawing Require Updating?: ${ncr.reportDetails.needRedraw || "N/A"}`, 15, 150); 
    doc.text(`Original Rev. Num: ${ncr.reportDetails.origRevNum || "N/A"}`, 15, 155);
    doc.text(`Updated Rev. Num: ${ncr.reportDetails.updatedRevNum || "N/A"}`, 15, 160);
    doc.text(`Revision Date: ${ncr.reportDetails.revisionDate || "N/A"}`, 15, 165);
    doc.text(`Engineer Name: ${ncr.reportDetails.engineerName || "N/A"}`, 15, 170);

////////////////////////////////////////////////////////////////////////
    doc.setFillColor(...sectionHeaderColor);
    doc.rect(10, 175, 190, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Purchasing/Operations Information", 15, 182);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Puchasing's Prelim Decision: ${ncr.nonConformanceDetails.purchDecision || "N/A"}`, 15, 190);
    doc.text(`Was a CAR Raised?: ${ncr.nonConformanceDetails.car || "N/A"}`, 15, 195);
    doc.text(`If "Yes" Indicate CAR #: ${ncr.nonConformanceDetails.carNum || "N/A"}`, 15, 200);
    doc.text(`Follow-Up Required?: ${ncr.nonConformanceDetails.followUp || "N/A"}`, 15, 205);
    doc.text(`Operations Manager Name: ${ncr.nonConformanceDetails.txtOpName || "N/A"}`, 15, 210);
    doc.text(`Revision Date: ${ncr.nonConformanceDetails.revisionDate || "N/A"}`, 15, 215);
    doc.text(`Re-inspected Acceptable?: ${ncr.nonConformanceDetails.reInspect || "N/A"}`, 15, 220);
    doc.text(`New NCR Number: ${ncr.nonConformanceDetails.newNCRNum || "N/A"}`, 15, 225);
    doc.text(`Inspector's Name: ${ncr.nonConformanceDetails.inspectorName || "N/A"}`, 15, 230);
    doc.text(`Inspector's Date: ${ncr.nonConformanceDetails.inspectorDate || "N/A"}`, 15, 235);
    doc.text(`Quality Department: ${ncr.nonConformanceDetails.qualityName || "N/A"}`, 15, 240);
    doc.text(`Quality Department Date: ${ncr.nonConformanceDetails.qualityDate || "N/A"}`, 15, 245);
    
    doc.text(`Status: ${ncr.nonConformanceDetails.status || "N/A"}`, 15, 250);
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

    const suppliers = [
        "Acme Corp", "Global Suppliers Inc.", "Precision Parts Ltd.", 
        "TechGears Co.", "MegaTools International", "Nova Supplies",
        "Pioneer Equipment", "Vertex Components", "Infinity Tools", "Prime Materials"
    ];

    const defectDescriptions = [
        "Cracked housing on the unit.",
        "Misaligned drilling on component.",
        "Paint scratches on surface.",
        "Missing screws in assembly package.",
        "Incorrect dimensions for the bracket.",
        "Electrical wiring exposed.",
        "Sealant improperly applied.",
        "Surface corrosion observed.",
        "Packaging damage resulting in scratches.",
        "Labeling errors on shipment."
    ];

    const processOptions = ['recInsp', 'WIP'];
    const statuses = ['Open', 'Closed'];

    for (let i = 1; i <= 10; i++) {
        const randomIndex = Math.floor(Math.random() * suppliers.length);
        const randomProcess = processOptions[Math.floor(Math.random() * processOptions.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        const newNCR = {
            supplierInfo: {
                ncrNumber: generateNCRNumber(),
                supplierName: suppliers[randomIndex],
                poOrProductNumber: `${1000 + i}`,
                salesOrderNumber: `${10000000 + i}`,
                quantityReceived: Math.floor(Math.random() * 100) + 10, // Received between 10 and 100
                quantityDefective: Math.floor(Math.random() * 10) + 1,  // Defective between 1 and 10
            },
            reportDetails: {
                processApplicable: randomProcess,
                sapNo: `${3000 + i}`,
                itemDescription: `Item ${i}: High-quality widget.`,
                descriptionOfDefect: defectDescriptions[randomIndex],
                nonConformityImage: `image${i}.jpg`
            },
            nonConformanceDetails: {
                isNonConforming: randomStatus,
                dateOfReport: new Date(Date.now() - Math.random() * 1e9).toISOString().split('T')[0], // Random date in the past
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


/*// Function to delete an NCR, either complete or incomplete
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
}*/

// Search function for NCRs
// Mark wanted us to add more search functionalities. Searching by date range, searching by open closed status.
// Enhanced search function for NCRs
function searchNCRs() {
    const year = document.getElementById("yearSearch").value;
    const code = document.getElementById("codeSearch").value.trim();
    const supplier = document.getElementById("supplierSearch").value;
    const status = document.getElementById("statusSearch").value;
    const startDateValue = document.getElementById("startDate").value;
    const endDateValue = document.getElementById("endDate").value;

    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate && startDate > endDate) {
        alert("Start date must be before or equal to the end date.");
        return;
    }

    const filteredNCRs = storedNCRs.filter(ncr => {
        const ncrDate = new Date(ncr.nonConformanceDetails.dateOfReport);

        const matchesYear = year ? ncrDate.getFullYear().toString() === year : true;
        const matchesCode = code ? ncr.supplierInfo.ncrNumber.endsWith(code) : true;
        const matchesSupplier = supplier ? ncr.supplierInfo.supplierName === supplier : true;
        const matchesStatus = status ? (ncr.status || "Open") === status : true;
        const matchesDateRange = startDate && endDate ? (ncrDate >= startDate && ncrDate <= endDate) : true;

        return matchesYear && matchesCode && matchesSupplier && matchesStatus && matchesDateRange;
    });

    displayNCRList(filteredNCRs);
}

// Attach search function to the Search button
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