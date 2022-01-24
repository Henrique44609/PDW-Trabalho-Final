//Imports
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");

    next();
  });


//Importing Routes
const authRoute = require('./routes/authorization/authorization');
const tokenRoute = require('./routes/authorization/newtoken');
const loginRoute = require('./routes/authentication/login');
const registerRoute = require('./routes/authentication/register');
const forgotRoute = require('./routes/authentication/forgotpassword');
const changeRoute = require('./routes/authentication/changepassword');
const updateRoute = require('./routes/authentication/updatepassword');
const categoriasRoute = require('./routes/categorias');
const subcategoriasRoute = require('./routes/subcategorias');
const despesasRoute = require('./routes/despesas');
const pageRoute = require('./routes/authorization/page');
const exportRoute = require('./routes/export');
const importRoute = require('./routes/import');



//Middlewares for parser information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware auth defined below 
//Always use this middleware for ALL ROUTES except Login, Register and ForgotPassword
//This route authenticats the user's token
app.use('/auth', authRoute);

//Route for creating new tokens is the ones that user has are invalid
app.use('/newtoken', tokenRoute);

//Middlewares for routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/forgotpassword', forgotRoute);
app.use('/changepassword', changeRoute);

//Middleware for user actions inside the application
app.use('/auth/updatepassword', updateRoute);
app.use('/auth/categoria', categoriasRoute);
app.use('/auth/subcategoria', subcategoriasRoute);
app.use('/auth/despesa', despesasRoute);
app.use('/page', pageRoute);
app.use('/export', exportRoute);
app.use('/import', importRoute);




//In Login the accessToken is stored in cookie and refreshToken in Database
//When making an API call user needs to access the cookie and send the token along with every request made





app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})





