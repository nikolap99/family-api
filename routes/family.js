const express = require('express');

const router = express.Router();

// Database
const db = require('../util/database');

const { formatJSON } = require('../helpers/helpers');

module.exports = {
    getAllUsers: (req, res) => {
        const { withKids, userId, fullName } = req.query;

        // Defining query based on withKids query parameter from GET request
        const query =
            withKids === 'true'
                ? `SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
            INNER JOIN kid ON user.id = kid.user_id;`
                : withKids === 'false'
                ? `SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
            LEFT JOIN kid ON user.id = kid.user_id
            WHERE kid.id IS NULL;`
                : `
            SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
            LEFT JOIN kid ON user.id = kid.user_id;
            `;

        db.execute(query)
            .then((result) => {
                // Transforming the result with helper function
                const newResult = formatJSON(result[0]);

                // Sending transformed data
                res.status(200).send(newResult);
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    addUser: (req, res) => {
        const { fullName = null, email = null, gender = null } = req.body;

        const addUserQuery = `INSERT INTO user (fullName,email,gender) VALUES (?,?,?)`;

        db.execute(addUserQuery, [fullName, email, gender])
            .then((result) => {
                res.status(200).send(req.body);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    },

    addChild: (req, res) => {
        const user_id = req.params.id || null;

        const { name = null, age = null, gender = null } = { ...req.body };

        const addUserQuery = `INSERT INTO kid (user_id,name,age,gender) VALUES (?,?,?,?)`;

        db.execute(addUserQuery, [user_id, name, age, gender])
            .then((result) => {
                res.status(200).send(req.body);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    },
};
