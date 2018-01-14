// Imports
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');

// App declarations
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Constants definitions
const PORT = 3000 || process.env.PORT;

// Database connections
mongoose.connection.openUri('mongodb://localhost:27017/hospitalAdminPro', (err, res) => {
    if (err) throw err;
    console.log('Database is running');
});

// App Routes
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);

app.listen(PORT, () => {
    console.log('app running on port '+ PORT);
});