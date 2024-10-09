import { backend } from 'declarations/backend';

// DOM Elements
const employeeForm = document.getElementById('employee-form');
const expenseForm = document.getElementById('expense-form');
const expenseEmployee = document.getElementById('expense-employee');
const totalExpenses = document.getElementById('total-expenses');
const categoryExpenses = document.getElementById('category-expenses');
const expensesList = document.getElementById('expenses');

// Helper Functions
const formatDate = (timestamp) => {
  return new Date(Number(timestamp) / 1000000).toLocaleString();
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Load Employees
const loadEmployees = async () => {
  const employees = await backend.getAllEmployees();
  expenseEmployee.innerHTML = employees.map(emp => 
    `<option value="${emp.id}">${emp.name} (${emp.category})</option>`
  ).join('');
};

// Load Expenses
const loadExpenses = async () => {
  const employees = await backend.getAllEmployees();
  let allExpenses = [];
  for (const emp of employees) {
    const expenses = await backend.getExpensesByEmployee(emp.id);
    allExpenses = [...allExpenses, ...expenses.map(exp => ({ ...exp, employeeName: emp.name }))];
  }
  
  expensesList.innerHTML = allExpenses.map(exp => 
    `<li>
      ${exp.employeeName}: ${formatAmount(exp.amount)} - ${exp.description} (${formatDate(exp.date)})
    </li>`
  ).join('');
};

// Load Summary
const loadSummary = async () => {
  const total = await backend.getTotalExpenses();
  totalExpenses.textContent = `Total Expenses: ${formatAmount(total)}`;

  const categories = ['CSuite', 'Senior', 'Junior'];
  const categoryTotals = await Promise.all(
    categories.map(async (category) => {
      const amount = await backend.getTotalExpensesByCategory(category);
      return `${category}: ${formatAmount(amount)}`;
    })
  );
  categoryExpenses.innerHTML = categoryTotals.map(total => `<p>${total}</p>`).join('');
};

// Event Listeners
employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('employee-name').value;
  const category = document.getElementById('employee-category').value;
  await backend.addEmployee(name, category);
  employeeForm.reset();
  loadEmployees();
});

expenseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const employeeId = Number(expenseEmployee.value);
  const amount = Number(document.getElementById('expense-amount').value);
  const description = document.getElementById('expense-description').value;
  await backend.addExpense(employeeId, amount, description);
  expenseForm.reset();
  loadExpenses();
  loadSummary();
});

// Initial Load
window.addEventListener('load', () => {
  loadEmployees();
  loadExpenses();
  loadSummary();
});
