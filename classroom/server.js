const express = require('express');
const app = express();
// const users = require('./routes/users');
// const posts = require('./routes/posts');
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));



app.get('/test', (req, res) => {
    req.session.count= (req.session.count || 0) + 1;
    res.send(`you sent a request ${req.session.count} times`);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});