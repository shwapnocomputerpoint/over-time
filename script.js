document.getElementById("overtimeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let empId = document.getElementById("empId").value;
    let name = document.getElementById("name").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;
    let shiftBreak = parseInt(document.getElementById("shiftBreak").value) || 0;
    let mealBreak = parseInt(document.getElementById("mealBreak").value) || 0;

    if (!startTime || !endTime || !empId || !name) {
        alert("অনুগ্রহ করে সব ফিল্ড পূরণ করুন!");
        return;
    }

    let start = new Date("2000-01-01T" + startTime);
    let end = new Date("2000-01-01T" + endTime);

    if (end < start) {
        end.setDate(end.getDate() + 1);
    }

    let totalHours = (end - start) / (1000 * 60 * 60);
    let totalBreaks = (shiftBreak + mealBreak) / 60;
    let actualWorkHours = totalHours - totalBreaks;

    let hourlyRate = 30;  // প্রতি ঘণ্টার মজুরি
    let overtimeRate = 20;  // ওভারটাইম রেট

    let overtimeHours = totalHours > 8 ? totalHours - 8 : 0;  // 8 ঘণ্টার বেশি কাজ হলে ওভারটাইম হবে
    let regularHours = totalHours - overtimeHours;

    // যদি কর্মচারী কাজ না করে তবে জিরো দেখাবে
    let totalSalary = (regularHours * hourlyRate) + (overtimeHours * overtimeRate);
    if (totalHours <= 0 || regularHours <= 0) {
        overtimeHours = 0;  // জিরো কাজ হলে ওভারটাইম ০ হবে
        totalSalary = 0;
    }

    // টেবিলের মধ্যে তথ্য যুক্ত করা
    let table = document.getElementById("overtimeTable").getElementsByTagName('tbody')[0];
    let row = table.insertRow();
    row.setAttribute('data-id', empId); // Store empId in the row for editing/deleting

    row.innerHTML = `
        <td>${table.rows.length}</td>
        <td>${name}</td>
        <td>${empId}</td>
        <td>${startTime}</td>
        <td>${endTime}</td>
        <td>${totalHours.toFixed(2)}</td>
        <td>${shiftBreak}</td>
        <td>${mealBreak}</td>
        <td>${actualWorkHours.toFixed(2)}</td>
        <td>${overtimeHours.toFixed(2)}</td>
        <td>${hourlyRate}</td>
        <td>${overtimeRate}</td>
        <td>${totalSalary.toFixed(2)}</td>
        <td><button class="edit-btn" onclick="editRow(this)">এডিট</button></td>
        <td><button class="delete-btn" onclick="deleteRow(this)">ডিলেট</button></td>
    `;
    saveDataToLocalStorage();
});

function deleteRow(button) {
    let row = button.closest('tr');
    row.remove();
    saveDataToLocalStorage();
}

function editRow(button) {
    let row = button.closest('tr');
    let empId = row.cells[2].textContent;
    let name = row.cells[1].textContent;
    let startTime = row.cells[3].textContent;
    let endTime = row.cells[4].textContent;

    document.getElementById("empId").value = empId;
    document.getElementById("name").value = name;
    document.getElementById("startTime").value = startTime;
    document.getElementById("endTime").value = endTime;
    document.getElementById("shiftBreak").value = row.cells[6].textContent;
    document.getElementById("mealBreak").value = row.cells[7].textContent;

    deleteRow(button); // Delete the old row before updating
}

function saveDataToLocalStorage() {
    let rows = document.querySelectorAll('#overtimeTable tbody tr');
    let data = [];

    rows.forEach(row => {
        let rowData = {
            empId: row.cells[2].textContent,
            name: row.cells[1].textContent,
            startTime: row.cells[3].textContent,
            endTime: row.cells[4].textContent,
            shiftBreak: row.cells[6].textContent,
            mealBreak: row.cells[7].textContent,
            totalHours: row.cells[5].textContent,
            overtimeHours: row.cells[9].textContent,
            regularHours: row.cells[8].textContent,
            totalSalary: row.cells[12].textContent
        };
        data.push(rowData);
    });

    localStorage.setItem("overtimeData", JSON.stringify(data));
}

function loadDataFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem("overtimeData"));
    if (data) {
        let table = document.getElementById("overtimeTable").getElementsByTagName('tbody')[0];
        data.forEach(rowData => {
            let row = table.insertRow();
            row.innerHTML = `
                <td>${table.rows.length}</td>
                <td>${rowData.name}</td>
                <td>${rowData.empId}</td>
                <td>${rowData.startTime}</td>
                <td>${rowData.endTime}</td>
                <td>${rowData.totalHours}</td>
                <td>${rowData.shiftBreak}</td>
                <td>${rowData.mealBreak}</td>
                <td>${rowData.regularHours}</td>
                <td>${rowData.overtimeHours}</td>
                <td>${30}</td>
                <td>${20}</td>
                <td>${rowData.totalSalary}</td>
                <td><button class="edit-btn" onclick="editRow(this)">এডিট</button></td>
                <td><button class="delete-btn" onclick="deleteRow(this)">ডিলেট</button></td>
            `;
        });
    }
}

window.onload = loadDataFromLocalStorage;
