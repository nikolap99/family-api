const express = require('express');

const router = express.Router();

// Database
const db = require('../util/database');

const { formatJSON } = require('../helpers/helpers');

module.exports = {
    getAllUsers: (req, res) => {
        const { withKids, userId, fullName } = req.query;
        let users = [];
        let kids = [];
        // No parameters
        const query = `
        SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
        LEFT JOIN kid ON user.id = kid.user_id;`;

        // With kids only
        const queryWithKids = `
        SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
        INNER JOIN kid ON user.id = kid.user_id;`;

        // Without kids only
        const queryWithoutKids = `
        SELECT user.*, kid.id AS kid_id, kid.name, kid.age, kid.gender AS kid_gender FROM user
        LEFT JOIN kid ON user.id = kid.user_id
        WHERE kid.id IS NULL;`;

        db.execute(
            withKids === 'true'
                ? queryWithKids
                : withKids === 'false'
                ? queryWithoutKids
                : query
        )
            .then((result) => {
                // Transforming the result with helper function
                const newResult = formatJSON(result[0]);

                // Sending transformed data
                res.status(200).send(newResult);
            })
            .catch((err) => {
                res.status(400).send(err);
            });

        db.execute(query)
            .then((result) => {
                users = [...result[0]];
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    },

    addUser: (req, res) => {
        const { fullName, email, gender } = req.body;

        const addUserQuery = `INSERT INTO user (fullName,email,gender) VALUES (?,?,?)`;

        db.execute(addUserQuery, [
            fullName || null,
            email || null,
            gender || null,
        ])
            .then((result) => {
                res.status(200).send(req.body);
            })
            .catch((err) => {
                res.status(400).send('Error: Missing values.');
            });
    },

    addChild: (req, res) => {
        const user_id = req.params.id;

        const { name, age, gender } = { ...req.body };

        const addUserQuery = `INSERT INTO kid (user_id,name,age,gender) VALUES (?,?,?,?)`;

        db.execute(addUserQuery, [
            user_id || null,
            name || null,
            age || null,
            gender || null,
        ])
            .then((result) => {
                res.status(200).send(req.body);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    },
};
