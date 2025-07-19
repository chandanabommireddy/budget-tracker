const salaryInput = document.getElementById('salary');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('addBtn');
const remainingDisplay = document.getElementById('remaining');
const transactionsList = document.getElementById('transactionsList');
const pieChartCtx = document.getElementById('pieChart').getContext('2d');

let transactions = [];
let salary = 0;

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'];

// Initialize empty chart
let pieChart = new Chart(pieChartCtx, {
  type: 'pie',
  data: {
    labels: categories,
    datasets: [{
      label: 'Expenses by Category',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        '#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

function updateRemaining() {
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = salary + totalIncome - totalExpenses;
  remainingDisplay.textContent = `Remaining Budget: ${remaining.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`;
}

function updateTransactionsList() {
  transactionsList.innerHTML = '';
  if (transactions.length === 0) {
    transactionsList.textContent = 'No transactions yet.';
    return;
  }
  transactions.forEach(t => {
    const div = document.createElement('div');
    div.classList.add('transaction');
    div.classList.add(t.type);
    div.textContent = `${t.type === 'income' ? 'Income' : t.category}: ${t.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`;
    transactionsList.appendChild(div);
  });
}

function updateChart() {
  // Sum expenses by category
  const expenseSums = categories.map(cat => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  pieChart.data.datasets[0].data = expenseSums;
  pieChart.update();
}

salaryInput.addEventListener('input', () => {
  salary = Number(salaryInput.value) || 0;
  updateRemaining();
});

addBtn.addEventListener('click', () => {
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  if (!salary) {
    alert('Please enter your salary first!');
    return;
  }
  if (!amount || amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }
  if (type === 'income' || (type === 'expense' && categories.includes(category))) {
    transactions.push({ amount, type, category });
    amountInput.value = '';
    updateTransactionsList();
    updateRemaining();
    updateChart();
  }
});

// Disable category select when income is selected
typeInput.addEventListener('change', () => {
  categoryInput.disabled = typeInput.value === 'income';
});

// Initialize category disabled state
categoryInput.disabled = false;
