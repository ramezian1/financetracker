document.addEventListener('DOMContentLoaded', () => {
    // Get references to our HTML elements
    const expenseNameInput = document.getElementById('expenseName');
    const expenseCategoryInput = document.getElementById('expenseCategory');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expensesTableBody = document.getElementById('expensesTableBody');
    const totalAmountSpan = document.getElementById('totalAmount');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    let expenses = []; // This array will hold all our expense objects

    // --- Expense Management Functions ---

    // Function to add an expense
    const addExpense = () => {
        const name = expenseNameInput.value.trim();
        const category = expenseCategoryInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        // Basic validation
        if (name === '' || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid expense name and a positive amount.');
            return;
        }

        const newExpense = {
            id: Date.now(), // Unique ID for each expense
            name: name,
            category: category === '' ? 'Uncategorized' : category,
            amount: amount
        };

        expenses.push(newExpense);
        // Removed: saveExpenses(); // No longer saving to Local Storage
        renderExpenses();
        calculateTotal();

        // Clear the input fields after adding
        expenseNameInput.value = '';
        expenseCategoryInput.value = '';
        expenseAmountInput.value = '';
        expenseNameInput.focus();
    };

    // Function to delete an expense
    const deleteExpense = (idToDelete) => {
        expenses = expenses.filter(expense => expense.id !== idToDelete);
        // Removed: saveExpenses(); // No longer saving to Local Storage
        renderExpenses();
        calculateTotal();
    };

    // Function to display all expenses in the table
    const renderExpenses = () => {
        expensesTableBody.innerHTML = ''; // Clear previous entries

        expenses.forEach(expense => {
            const row = expensesTableBody.insertRow();

            const nameCell = row.insertCell();
            const categoryCell = row.insertCell();
            const amountCell = row.insertCell();
            const actionCell = row.insertCell();

            nameCell.textContent = expense.name;
            categoryCell.textContent = expense.category;
            amountCell.textContent = `$${expense.amount.toFixed(2)}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteExpense(expense.id));

            actionCell.appendChild(deleteButton);
        });
    };

    // Function to calculate and display the total
    const calculateTotal = () => {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmountSpan.textContent = total.toFixed(2);
    };

    // --- Export Function ---

    const exportToCsv = () => {
        if (expenses.length === 0) {
            alert('No expenses to export!');
            return;
        }

        // Define CSV header
        const header = 'ID,Name,Category,Amount\n';

        // Map expense objects to CSV rows
        const rows = expenses.map(expense =>
            `${expense.id},"${expense.name.replace(/"/g, '""')}","${expense.category.replace(/"/g, '""')}",${expense.amount.toFixed(2)}`
        ).join('\n');

        const csvContent = header + rows;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finance_tracker_expenses.csv';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- Event Listeners ---

    addExpenseBtn.addEventListener('click', addExpense);

    expenseAmountInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addExpense();
        }
    });

    exportCsvBtn.addEventListener('click', exportToCsv);

    // --- Initial Load ---
    // Removed: loadExpenses(); // No longer loading from Local Storage
    renderExpenses();
    calculateTotal();
});