var express = require('express');
var router = express.Router();
var axios = require("axios");
const { springHost, springPort } = require("../helpers/constants");

router.get('/', (req, res) => {
    console.log("Login Page requested");
    res.render('login.ejs');
});

router.post('/validate', (req, res) => {
    console.log("Validate page requested");
    var errormessage = 'Invalid Username/password';
    let url = `http://${springHost}:${springPort}/getUser?name=${req.body.username}`;

    axios.get(url).then(function (response) {
        console.log("Fetching user details from: " + url);
        const status = response.status;
        if (status != 200) {
            console.error("Status is not 200");
            console.error("Error message: " + response.data);
            throw Error("Unable to continue, status received: " + status);
        }
        const data = response.data;
        if (data.name == req.body.username && data.password == req.body.password) {
            console.log("Successfully authenticated username: " + data.name);
            res.render('homepage.ejs', { username: req.body.username });
        }
        else {
            console.log("Unable to log in username: " + data.name);
            res.render('login.ejs', { errormessage: errormessage });
        }
    }).catch(function (error) {
        console.error(`Error: ${error.message}`);
    });
});

module.exports = router;