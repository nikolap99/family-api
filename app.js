const express = require('express');
const app = express();
const port = 3000;

// familyRoutes - defined all requests for parens/children
const { getAllUsers, addUser, addChild } = require('./routes/family');

// We get JSON objects from POST request body
app.use(express.json());

// Routes
app.get('/users', getAllUsers);
app.post('/users', addUser);
app.post('/users/:id/kid', addChild);

// Default if none of the routes is hit
app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found.</h1>');
});
// app.post('/users/:id/kid', addKid);

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
