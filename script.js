// ===============================
// Employee Management System
// Part 3A
// ===============================

(() => {

const STORAGE_KEY = "employees";

let employees = [];
let editingEmployeeId = null;

// Elements
const form = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const employeeCount = document.getElementById("employeeCount");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");

const empId = document.getElementById("employeeId");
const name = document.getElementById("name");
const email = document.getElementById("email");
const department = document.getElementById("department");
const position = document.getElementById("position");
const joiningDate = document.getElementById("joiningDate");

const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");

const phone = document.getElementById("phone");
const exportBtn = document.getElementById("exportBtn");
const nameError = document.getElementById("nameError");
// =======================
// Initialize
// =======================

init();
search.addEventListener("input", function () {

    const keyword = search.value.toLowerCase().trim();

    const filteredEmployees = employees.filter(employee =>

        employee.name.toLowerCase().includes(keyword) ||
        employee.email.toLowerCase().includes(keyword) ||
        employee.department.toLowerCase().includes(keyword)

    );

    renderTable(filteredEmployees);

});
function init(){

    loadEmployees();

    renderTable();

    updateEmployeeCount();

}

// =======================
// Load Local Storage
// =======================

function loadEmployees(){

    try{

        const data = localStorage.getItem(STORAGE_KEY);

        employees = data ? JSON.parse(data) : [];

        if(!Array.isArray(employees))
            employees=[];

    }

    catch(error){

        employees=[];

    }

}

// =======================
// Save Local Storage
// =======================

function saveToStorage(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );

}

// =======================
// Validate Form
// =======================


   function validateForm(){

    // Clear previous errors
    phoneError.textContent = "";
    phone.classList.remove("input-error");

    nameError.textContent = "";
    name.classList.remove("input-error");

    if(
        empId.value.trim()==="" ||
        name.value.trim()==="" ||
        email.value.trim()==="" ||
        phone.value.trim()==="" ||
        department.value==="" ||
        position.value.trim()==="" ||
        joiningDate.value===""

    ){
        showToast("All fields are required","error");
        return false;
    }

    // Name Validation
    const nameRegex = /^[A-Za-z ]+$/;

    if(!nameRegex.test(name.value.trim())){

        nameError.textContent = "Name should contain only letters.";

        name.classList.add("input-error");

        return false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email.value.trim())){

        showToast("Invalid Email","error");

        return false;
    }

    // Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if(!phoneRegex.test(phone.value.trim())){

        phoneError.textContent = "Enter a valid 10-digit phone number.";

        phone.classList.add("input-error");

        return false;
    }

    // Duplicate Employee ID
    if(editingEmployeeId===null){

        const duplicate = employees.some(employee =>
            employee.id===empId.value.trim()
        );

        if(duplicate){

            showToast("Employee ID already exists","error");

            return false;
        }

    }

    return true;
}
      
 
// =======================
// Form Submit
// =======================
form.addEventListener("submit", function(e){

    e.preventDefault();

    if(!validateForm())
        return;

    if(editingEmployeeId === null){

        addEmployee();

    }else{

        updateEmployee();

    }

});

// =======================
// Add Employee
// =======================

function addEmployee(){

    const employee = {

    id: empId.value.trim(),

    name: name.value.trim(),

    email: email.value.trim(),

    phone: phone.value.trim(),

    department: department.value,

    position: position.value.trim(),

    joiningDate: joiningDate.value

};

    employees.push(employee);

    saveToStorage();

    renderTable();

    updateEmployeeCount();

    clearForm();

    showToast("Employee Added Successfully","success");

}

function updateEmployee(){

    const index = employees.findIndex(emp => emp.id === editingEmployeeId);

    if(index === -1) return;

    employees[index].name = name.value.trim();
    employees[index].email = email.value.trim();
    employees[index].phone = phone.value.trim();
    employees[index].department = department.value;
    employees[index].position = position.value.trim();
    employees[index].joiningDate = joiningDate.value;

    saveToStorage();

    renderTable();

    updateEmployeeCount();

    clearForm();

    editingEmployeeId = null;

    empId.disabled = false;

    submitBtn.textContent = "Add Employee";

    formTitle.textContent = "Add Employee";

    cancelBtn.style.display = "none";

    showToast("Employee Updated Successfully","success");

}
// =======================
// Render Table
// =======================

// =======================
// Render Table
// =======================

function renderTable(list = employees) {

    employeeTable.innerHTML = "";

    if (list.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No employees found
                </td>
            </tr>
        `;

        return;
    }

    list.forEach(employee => {

        employeeTable.innerHTML += `
            <tr>

                <td>${employee.id}</td>

                <td>${employee.name}</td>

                <td>${employee.email}</td>

                <td>${employee.phone}</td>

                <td>${employee.department}</td>

                <td>${employee.position}</td>

                <td>${employee.joiningDate}</td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="editBtn"
                            onclick="editEmployee('${employee.id}')">
                            Edit
                        </button>

                        <button
                            class="deleteBtn"
                            onclick="deleteEmployee('${employee.id}')">
                            Delete
                        </button>

                    </div>

                </td>

            </tr>
        `;

    });

}

// =======================
// Employee Count
// =======================

function updateEmployeeCount(){

    employeeCount.textContent=employees.length;

}

// =======================
// Clear Form
// =======================

function clearForm(){

    form.reset();

    empId.disabled = false;

}
// =======================
// Toast Message
// =======================

function showToast(message,type){

    toast.innerHTML=message;

    toast.className="";

    toast.id="toast";

    toast.classList.add(type);

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },3000);

}

cancelBtn.addEventListener("click", function(){

    editingEmployeeId = null;

    clearForm();

    empId.disabled = false;

    submitBtn.textContent = "Add Employee";

    formTitle.textContent = "Add Employee";

    cancelBtn.style.display = "none";
    // =======================
// Export CSV
// =======================

const exportBtn = document.getElementById("exportBtn");

});
// =======================
// Expose Functions
// =======================

window.editEmployee = function(id){

    const employee = employees.find(emp => emp.id === id);

    if(!employee) return;

    editingEmployeeId = id;

    empId.value = employee.id;
    empId.disabled = true;

    name.value = employee.name;
    email.value = employee.email;
    phone.value = employee.phone;
    department.value = employee.department;
    position.value = employee.position;
    joiningDate.value = employee.joiningDate;

    formTitle.textContent = "Edit Employee";
    submitBtn.textContent = "Update Employee";
    cancelBtn.style.display = "inline-block";

};

window.deleteEmployee = function(id){

    if(!confirm("Delete this employee?"))
        return;

    employees = employees.filter(emp => emp.id !== id);

    saveToStorage();

    renderTable();

    updateEmployeeCount();

    showToast("Employee Deleted Successfully","success");

};
// =======================
// Export Employees to CSV
// =======================

function exportCSV(){

    if(employees.length === 0){

        showToast("No employee data to export","error");
        return;

    }

    let csv = "Employee ID,Name,Email,Phone Number,Department,Position,Joining Date\n";

    employees.forEach(employee => {

        csv += `"${employee.id}","${employee.name}","${employee.email}","${employee.phone || ""}","${employee.department}","${employee.position}","${employee.joiningDate}"\n`;

    });

}
// ==========================================
// Export Employees to CSV
// ==========================================

exportBtn.addEventListener("click", exportToCSV);

function exportToCSV(){

    if(employees.length === 0){

        showToast("No employees available to export","error");

        return;

    }

    const headers = [

        "Employee ID",
        "Name",
        "Email",
        "Department",
        "Position",
        "Joining Date"

    ];

    let csv = headers.join(",") + "\n";

    employees.forEach(employee=>{

        csv += [

            employee.id,
            employee.name,
            employee.email,
            employee.department,
            employee.position,
            employee.joiningDate

        ].join(",") + "\n";

    });

    const blob = new Blob([csv],{

        type:"text/csv;charset=utf-8;"

    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "employees.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast("CSV Exported Successfully","success");

}
phone.addEventListener("input", function(){

    phoneError.textContent = "";
    phone.classList.remove("input-error");

});
name.addEventListener("input", function(){

    nameError.textContent = "";

    name.classList.remove("input-error");

});

})();