const config = require('config');
const mysql = require("mysql");
const assert = require('assert');
const AssertionError = assert.AssertionError;

const connectionPool = mysql.createPool({
    host: config.get('database.host'),
    user: config.get('database.user'),
    password: config.get('database.password'),
    database: config.get('database.dbname'),
    connectionLimit: 2
});

class Customer {

    /**
     * This methods inserts a customer data to the DB
     * @param req request object
     * @param res response object
     * @return Returns error if error inserting customer data, else return success message
     */
    addCustomer(req, res) {
        try {
            assert(req.body.raison_social, 'Raison Sociale is required');
            assert(req.body.email, 'Email is required');

            assert(req.body.email_interlocuteur, 'Email Interlocuteur is required');
            assert(req.body.NumeroEtVoie, 'NumeroEtVoie is required');
            assert(req.body.CodePostal, 'CodePostal is required');
            assert(req.body.Commune, 'Commune is required');
            assert(req.body.tin_no, 'TIN Number is required');
            assert(req.body.interlocuteur, 'Interlocuteur is required');
            assert(req.body.client_number, 'Client Number is required');

            let raison_social = req.body.raison_social;
            let email = req.body.email;

            let email_interlocuteur = req.body.email_interlocuteur;
            let NumeroEtVoie = req.body.NumeroEtVoie;
            let CodePostal = req.body.CodePostal;
            let Commune = req.body.Commune;
            let tin_no = req.body.tin_no;
            let interlocuteur = req.body.interlocuteur;
            let client_number = req.body.client_number;
            let user_id = req.user_id;

            connectionPool.query(
                `INSERT INTO customer (raison_social, client_number, email, user_id, email_interlocuteur, interlocuteur, NumeroEtVoie, CodePostal, Commune, tin_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [raison_social, client_number, email, user_id, email_interlocuteur, interlocuteur, NumeroEtVoie, CodePostal, Commune, tin_no],
                function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else if (result.insertId > 0) {
                        res.status(200).send({
                            status: "success",
                            data: "",
                            message: "Customer added successfully"
                        });
                    }
                    else {
                        res.status(422).send({
                            status: "error",
                            message: "Customer with same email already exists"
                        });
                    }
                });
        }
        catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            }
            else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function returns all the customers requested by a user
     * @param req request object
     * @param res response object
     * @return Returns the list of customers if they exists else returns blank result with 204 statuscode.
     *         Returns error type & message in case of error
     */
    getCustomers(req, res) {
        try {

            connectionPool.query(` SELECT 
    
    
   *
    
FROM
    customer cst
    
WHERE
    user_id = ?`, req.user_id,
                function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.length > 0) {

                            res.status(200).send({
                                status: "success",
                                data: result,
                                length: result.length
                            });
                        }
                        else {
                            res.status(204).send();
                        }
                    }
                });
        }
        catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            }
            else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function returns a single customer data as per the customer id
     * @param req request object
     * @param res response object
     * @return Returns a customer data if it exists. Returns error in case of error
     */
    getCustomer(req, res) {
        try {
            assert(req.params.customer_id, 'Customer Id not provided');

            connectionPool.query(`SELECT * FROM customer where id = ? and user_id = ?`,
                [req.params.customer_id, req.user_id], function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.length > 0) {
                            res.status(200).send({
                                status: "success",
                                data: result[0],
                                length: result.length
                            });
                        }
                        else {
                            res.status(204).send();
                        }
                    }
                });
        }
        catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            }
            else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function deletes a single customer along with its data as per the customer id
     * @param req request object
     * @param res response object
     * @return Returns true if data deleted successfully. Returns error in case of error
     */
    deleteCustomer(req, res) {
        try {
            assert(req.params.customer_id, 'Customer Id not provided');

            connectionPool.query(`DELETE FROM customer where id = ? and user_id = ?`,
                [req.params.customer_id, req.user_id], function (error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else {
                        if (result.affectedRows > 0) {
                            res.status(200).send({
                                status: "success",
                                data: ""
                            });
                        }
                        else {
                            res.status(204).send();
                        }
                    }
                });
        }
        catch (e) {
            console.log(req.url, "-", __function, "-", "Error : ", e.message);
            res.status(500).send({
                status: "error",
                message: e.message
            });
        }
    }
}

module.exports = Customer;
