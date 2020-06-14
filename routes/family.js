const express = require('express');

const router = express.Router();

// Database
const db = require('../util/database');

const { formatJSON } = require('../helpers/helpers');

const fetchUsers = async (withKids) => {
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

    return db.execute(query);
};

const postUser = async (bodyArr) => {
    const query = `INSERT INTO user (fullName,email,gender) VALUES (?,?,?)`;

    return db.execute(query, [...bodyArr]);
};

const postChild = async (bodyArr) => {
    const query = `INSERT INTO kid (user_id,name,age,gender) VALUES (?,?,?,?)`;

    return db.execute(query, [...bodyArr]);
};

module.exports = {
    getAllUsers: async (req, res) => {
        const { withKids, userId, fullName } = req.query;

        try {
            const result = await fetchUsers(withKids);
            // Transforming the result with helper function
            const newResult = formatJSON(result[0]);
            // Sending transformed data
            res.status(200).send(newResult);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    addUser: async (req, res) => {
        const { fullName = null, email = null, gender = null } = req.body;
        try {
            const result = await postUser([fullName, email, gender]);
            res.status(200).send(req.body);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    addChild: async (req, res) => {
        const user_id = req.params.id || null;

        const { name = null, age = null, gender = null } = { ...req.body };

        try {
            const result = await postChild([user_id, name, age, gender]);
            res.status(200).send(req.body);
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
};
