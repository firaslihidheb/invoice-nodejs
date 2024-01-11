const config = require('config');
const mysql = require("mysql");
const assert = require('assert');
const AssertionError = assert.AssertionError;

const connectionPool = mysql.createPool({
    host: config.get('database.host'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.dbname'),
    connectionLimit: 2,
    multipleStatements: true,
});

class Invoice {

    /**
     * This methods inserts a new invoice data to the DB
     * @param req request object
     * @param res response object
     * @return Returns error if error inserting invoice data, else return success message
     */
   
    getMonths(req, res) {
        const currentDate = new Date();
        const months = [];
        console.log('getMonths method called',currentDate);
        months.push({
            value: currentDate.getMonth() + 1,
            label: `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`,
        });

        const previousMonth = new Date(currentDate);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        months.push({
            value: previousMonth.getMonth() + 1,
            label: `${previousMonth.toLocaleString('default', { month: 'long' })} ${previousMonth.getFullYear()}`,
        });

        const monthBeforePrevious = new Date(previousMonth);
        monthBeforePrevious.setMonth(monthBeforePrevious.getMonth() - 1);
        months.push({
            value: monthBeforePrevious.getMonth() + 1,
            label: `${monthBeforePrevious.toLocaleString('default', { month: 'long' })} ${monthBeforePrevious.getFullYear()}`,
        });

        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        months.push({
            value: nextMonth.getMonth() + 1,
            label: `${nextMonth.toLocaleString('default', { month: 'long' })} ${nextMonth.getFullYear()}`,
        });

        res.json(months);
    }
}

module.exports = Invoice;
