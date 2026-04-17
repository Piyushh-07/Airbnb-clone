const express = require('express');
const app = express();
// const users = require('./routes/users');
// const posts = require('./routes/posts');
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
}));

app.get('/test', (req, res) => {
    res.send('Welcome to the test page!');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});