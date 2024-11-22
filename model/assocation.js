const NewRec = require('./auth');
const Expense = require('./expenses');

NewRec.associate({ Expense });
Expense.associate({ NewRec });

module.exports = {
    NewRec,
    Expense,
};
