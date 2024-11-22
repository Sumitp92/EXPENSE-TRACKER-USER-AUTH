// Handle Signup
document.getElementById('SignupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3000/api/signup', { name, email, password });

        if (response.data.success) {
            alert('Signup successful!');
            window.location.href = 'login.html'; 
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed');
    }
});

//handle login
document.getElementById('LoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3000/api/login', { email, password });

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token); // Store the token in localStorage

            alert('Login successful!');
            window.location.href = 'dashboard.html'; 
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed');
    }
});


// Switch to Signup page from Login page
document.getElementById('newUserBtn')?.addEventListener('click', () => {
    window.location.href = 'signup.html';
});

// Switch to Login page from Signup page
document.getElementById('loginBtn')?.addEventListener('click', () => {
    window.location.href = 'login.html';
});





document.addEventListener('DOMContentLoaded', () => {
    const expForm = document.getElementById('expense-form');
    const expList = document.getElementById('expense-list');
    let editingExpense = null;

    expForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = expForm['amount'].value;
        const description = expForm['description'].value;
        const category = expForm['category'].value;

        const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

        if (!token) {
            console.log('No token found. Please log in again.');
            return;
        }

        try {
            if (editingExpense) {
                const response = await axios.put(`/api/expenses/${editingExpense.id}`, 
                    { amount, description, category },
                    { headers: { 'Authorization': `Bearer ${token}` } } 
                );
                if (response.data && response.data.expense) {
                    console.log('Expense Updated', response.data.expense);
                    displayExpense(response.data.expense);
                    editingExpense = null;
                    expForm.reset();
                }
            } else {
                const response = await axios.post('/api/expenses', 
                    { amount, description, category },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (response.data && response.data.expense) {
                    console.log('Expense Added', response.data.expense);
                    displayExpense(response.data.expense);
                    expForm.reset();
                }
            }
        } catch (err) {
            console.log('Error Updating/Editing Expense', err.message);
        }
    });

    // Fetch and display expenses
    async function fetchExpenses() {
        const token = localStorage.getItem('authToken');  // Retrieve token from localStorage
    
        if (!token) {
            console.log('No token found. Please log in again.');
            return;  
        }
        try {
            const response = await axios.get('/api/expenses', {
                headers: { 'Authorization': `Bearer ${token}` }  
            });
            const expenses = response.data.expenses;
    
            if (expenses && Array.isArray(expenses)) {
                expList.innerHTML = '';  
                console.log("Expenses fetched successfully:", expenses);
                expenses.forEach(expense => displayExpense(expense)); 
            } else {
                console.log("No expenses found or unexpected data format:", response.data);
            }
        } catch (error) {
            console.log("Error fetching expenses:", error.message);
        }
    }
    
    function displayExpense(expense) {
        const expenseContainer = document.createElement('li');

        if (!expense.amount || !expense.description || !expense.category || !expense.id) {
            console.log('Incomplete expense data:', expense);
            return;
        }

        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.amount}, ${expense.description}, ${expense.category}`;

        const editBtn = document.createElement('button');
        editBtn.setAttribute('data-id', expense.id);
        editBtn.textContent = 'Edit';

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('data-id', expense.id);
        deleteBtn.textContent = 'Delete';

        expenseContainer.appendChild(expenseText);
        expenseContainer.appendChild(editBtn);
        expenseContainer.appendChild(deleteBtn);
        expList.appendChild(expenseContainer);

        editBtn.addEventListener('click', () => {
            expForm['amount'].value = expense.amount;
            expForm['description'].value = expense.description;
            expForm['category'].value = expense.category;
            editingExpense = expense;
        });

        deleteBtn.addEventListener('click', async () => {
            try {
                const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

                if (!token) {
                    console.log('No token found. Please log in again.');
                    return;
                }

                const response = await axios.delete(`/api/expenses/${expense.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                if (response.data && response.data.success) {
                    console.log('Expense Deleted:', expense.id);
                    expenseContainer.remove();
                } else {
                    console.log('Error Deleting Expense:', response.data);
                }
            } catch (error) {
                console.log('Error Deleting Expense:', error.message);
            }
        });
    }

    fetchExpenses();
});
