// Imports
var express = require('express');
var mongoose = require('mongoose');

// App declarations
var app = express();

// Constants definitions
const PORT = 3000 || process.env.PORT;

// Database connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitalAdminPro', (err, res) => {
    if (err) throw err;
    console.log('Database is running');
});


app.get('/', (req, res) => {
    res.send('Hello');
});
app.listen(PORT, () => {
    console.log('app running on port '+ PORT);
})