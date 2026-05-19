
let expenses = [];

let budget = 0;


let expenseChart;


let filteredExpenses = [];


const expenseForm =
document.getElementById("expenseForm");

const expenseList =
document.getElementById("expenseList");

const totalExpense =
document.getElementById("totalExpense");

const budgetAmount =
document.getElementById("budgetAmount");

const remainingBalance =
document.getElementById("remainingBalance");


expenseForm.addEventListener("submit",

function(e){

    e.preventDefault();

    const title =
    document.getElementById("title").value;

    const amount =
    document.getElementById("amount").value;

    const category =
    document.getElementById("category").value;

    const date =
    document.getElementById("date").value;

    const expense = {

        id: Date.now(),

        title,

        amount: Number(amount),

        category,

        date

    };


    expenses.push(expense);

   

    applyFilters();

    updateSummary();

    updateChart();

    saveToLocalStorage();

    showToast("Expense Added Successfully");

    
    expenseForm.reset();

});


function showExpenses(data = expenses){

    expenseList.innerHTML = "";

    if(data.length === 0){

        expenseList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-wallet"></i>

            <h3>
                No Expenses Found
            </h3>

            <p>
                Start adding your expenses
            </p>

        </div>

        `;

        return;
    }

    data.sort((a,b)=> b.id - a.id);

    data.forEach((expense)=>{

        expenseList.innerHTML += `

        <div class="expense-item">

            <div class="expense-left">

                <div class="expense-icon">

                    <i class="fa-solid fa-wallet"></i>

                </div>

                <div class="expense-details">

                    <h3>
                        ${expense.title}
                    </h3>

                    <p>
                        ${expense.category} • ${expense.date}
                    </p>

                </div>

            </div>

            <div class="expense-right">

                <h2>
                    ₹${expense.amount}
                </h2>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>

        `;
    });

}


function updateSummary(){

    let total = 0;

    expenses.forEach((expense)=>{

        total += expense.amount;

    });

   
    totalExpense.innerText =
    `₹${total}`;

    
    budgetAmount.innerText =
    `₹${budget}`;

    remainingBalance.innerText =
    `₹${budget - total}`;

}

function deleteExpense(id){

    expenses = expenses.filter((expense)=>{

        return expense.id !== id;

    });

    
    saveToLocalStorage();

    applyFilters();

    updateSummary();

    updateChart();

    showToast("Expense Deleted");

}


function editExpense(id){

    const expense =
    expenses.find((item)=> item.id === id);

    document.getElementById("title").value =
    expense.title;

    document.getElementById("amount").value =
    expense.amount;

    document.getElementById("category").value =
    expense.category;

    document.getElementById("date").value =
    expense.date;

    expenses = expenses.filter((item)=>{

        return item.id !== id;

    });

    saveToLocalStorage();

    applyFilters();

    updateSummary();

    updateChart();

    showToast("Expense Ready To Edit");

}


function saveToLocalStorage(){

    localStorage.setItem(

        "expenses",

        JSON.stringify(expenses)

    );

    localStorage.setItem(

        "budget",

        budget

    );

}


function loadData(){

    const storedExpenses =
    localStorage.getItem("expenses");

    if(storedExpenses){

        expenses =
        JSON.parse(storedExpenses);

    }

    const storedBudget =
    localStorage.getItem("budget");

    if(storedBudget){

        budget = Number(storedBudget);

    }

    
    applyFilters();

    updateSummary();

    updateChart();

}


loadData();


document
.getElementById("setBudgetBtn")

.addEventListener("click",

function(){

    budget = Number(

        document
        .getElementById("budgetInput")
        .value

    );

    updateSummary();

    updateChart();

    saveToLocalStorage();

    showToast("Budget Updated");

});


document

.getElementById("searchInput")

.addEventListener("keyup",

function(){

    applyFilters();

});


document

.getElementById("filterCategory")

.addEventListener("change",

function(){

    applyFilters();

});

function applyFilters(){

    const searchValue =

    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const selectedCategory =

    document
    .getElementById("filterCategory")
    .value;

    filteredExpenses = expenses.filter((expense)=>{

        const matchesSearch =

            expense.title
            .toLowerCase()
            .includes(searchValue)

            ||

            expense.category
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =

            selectedCategory === "All"

            ||

            expense.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    showExpenses(filteredExpenses);

}


function updateChart(){

    const categoryTotals = {};

    expenses.forEach((expense)=>{

        if(categoryTotals[expense.category]){

            categoryTotals[expense.category] += expense.amount;

        }

        else{

            categoryTotals[expense.category] = expense.amount;

        }

    });

    const labels = Object.keys(categoryTotals);

    const data = Object.values(categoryTotals);

    if(expenseChart){

        expenseChart.destroy();

    }

    const ctx = document
    .getElementById("expenseChart");

    expenseChart = new Chart(ctx, {

        type:"doughnut",

        data:{

            labels:labels,

            datasets:[{

                label:"Expenses",

                data:data,

                backgroundColor:[

                    "#8b5cf6",
                    "#ec4899",
                    "#06b6d4",
                    "#f59e0b",
                    "#22c55e"

                ],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{
                        color:"white"
                    }

                }

            }

        }

    });

}


const themeToggle =

document.getElementById("themeToggle");



if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light-mode");

    themeToggle.innerHTML =

    `<i class="fa-solid fa-sun"></i>`;

}

themeToggle.addEventListener("click",

function(){

    document.body.classList.toggle("light-mode");


    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeToggle.innerHTML =

        `<i class="fa-solid fa-sun"></i>`;

    }

    else{

        localStorage.setItem("theme","dark");

        themeToggle.innerHTML =

        `<i class="fa-solid fa-moon"></i>`;

    }

});

function showToast(message){

    const toast =

    document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

document

.getElementById("exportBtn")

.addEventListener("click",

function(){

    

    if(expenses.length === 0){

        showToast("No Expenses To Export");

        return;

    }

    

    let csv =
    "Title,Amount,Category,Date\n";



    expenses.forEach((expense)=>{

        csv += `"${expense.title}","${expense.amount}","${expense.category}","${expense.date}"\n`;

    });

    

    const blob =

    new Blob([csv],{

        type:"text/csv"

    });

    
    const url =

    window.URL.createObjectURL(blob);

    const a =

    document.createElement("a");

    a.href = url;

    a.download = "expenses-report.csv";

    
    a.click();

    
    window.URL.revokeObjectURL(url);

    showToast("CSV Exported Successfully");

});