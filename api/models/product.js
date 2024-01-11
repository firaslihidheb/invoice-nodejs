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

class Product{

    /**
     * This methods inserts a product data to the DB
     * @param req request object
     * @param res response object
     * @return Returns error if error inserting product data, else return success message
     */
    addProduct(req, res){
        try {
            assert(req.body.customer_id, "Customer ID is required");
            assert(req.body.collaborateur_id, "Collaborateur ID is required");
            assert(req.body.start_date, "Start date is required");
            assert(req.body.end_date, "End date is required");
            assert(req.body.numero_contrat, "Contract number is required");
            assert(req.body.tjm, "TJM (taux journalier de la prestation) is required");
            assert(req.body.client_order_number, "Numéro de commande Client is required");
            
    
            let customer_id = req.body.customer_id;
            let collaborateur_id = req.body.collaborateur_id;
            let start_date = req.body.start_date;
            let end_date = req.body.end_date;
            let numero_contrat = req.body.numero_contrat;
            let tjm = req.body.tjm;
            let created_by_user_id = req.user_id;
            
            let client_order_number = req.body.client_order_number;
            

            
    
            connectionPool.query(
                `INSERT INTO contract (customer_id, collaborateur_id, start_date,end_date, numero_contrat, tjm, created_by_user_id,client_order_number) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [customer_id, collaborateur_id, start_date, end_date, numero_contrat, tjm, created_by_user_id, client_order_number],
                function (error, result, fields) {
                    if (error) {
                        if (error.code === "ER_DUP_ENTRY") {
                            res.status(422).send({
                                status: "error",
                                message: "Contract with this contract number already exists"
                            });
                        } else {
                            res.status(500).send({
                                status: "error",
                                code: error.code,
                                message: error.sqlMessage
                            });
                        }
                    } else if (result.insertId > 0) {
                        res.status(200).send({
                            status: "success",
                            data: "",
                            message: "Contract added successfully"
                        });
                    } else {
                        res.status(422).send({
                            status: "error",
                            message: "Contract with this contract number already exists"
                        });
                    }
                }
            );
        } catch (e) {
            if (e instanceof AssertionError) {
                console.log(req.url, "-", __function, "-", "AssertionError : ", e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            } else {
                console.log(req.url, "-", __function, "-", "Error : ", e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }
    
    /**
     * This function returns all the products of a user
     * @param req request object
     * @param res response object
     * @return Returns the list of products if they exists else returns blank result with 204 statuscode.
     *         Returns error type & message in case of error
     */
    getProducts(req, res){
        try {
            assert(req.user_id, 'User Id not found');

            connectionPool.query(`SELECT * FROM contract where created_by_user_id = ?`, req.user_id,
                function(error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else{
                        if(result.length>0){
                            res.status(200).send({
                                status: "success",
                                data: result,
                                length: result.length
                            });
                        }
                        else{
                            res.status(204).send();
                        }
                    }
                });
        }
        catch (e) {
            if(e instanceof AssertionError){
                console.log(req.url,"-",__function,"-","AssertionError : ",e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            }
            else{
                console.log(req.url,"-",__function,"-","Error : ",e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }

    /**
     * This function returns a single product as per the product id
     * @param req request object
     * @param res response object
     * @return Returns a product if it exists. Returns error in case of error
     */
    getProduct(req, res){
        try {
            assert(req.params.id, 'fu uId not provided');
            assert(req.user_id, 'User not logged in');

            connectionPool.query(`SELECT * FROM contract where id = ? and created_by_user_id = ?`,
                [req.params.id, req.user_id], function(error, result, fields) {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            code: error.code,
                            message: error.sqlMessage
                        });
                    } else{
                        if(result.length>0){
                            res.status(200).send({
                                status: "success",
                                data: result[0],
                                length: result.length
                            });
                        }
                        else{
                            res.status(204).send();
                        }
                    }
                });
        }
        catch (e) {
            if(e instanceof AssertionError){
                console.log(req.url,"-",__function,"-","AssertionError : ",e.message);
                res.status(500).send({
                    status: "AssertionError",
                    message: e.message
                });
            }
            else{
                console.log(req.url,"-",__function,"-","Error : ",e.message);
                res.status(500).send({
                    status: "error",
                    message: e.message
                });
            }
        }
    }
}

module.exports = Product;
