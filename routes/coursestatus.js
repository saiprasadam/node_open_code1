var express = require('express');
var router = express.Router();

var axios = require("axios");

let { springHost, springPort } = require("../helpers/constants");
router.get("/:userId", function (req, res, next) {
  let params = req.params;
  let courseId = params.userId;
  console.log("Fetching resource with ID: " + courseId);
  if (!courseId) {
    let error = new Error("Course ID not found");
    error.statusCode = 400
    return next(error);
  }
  let url = `http://${springHost}:${springPort}/getCourseStatus/${courseId}`;
  return axios.get(url).then(function (response) {
    // Process the response data and render an EJS file
    if (response.status != 200) {
      let error = new Error(response.data);
      error.statusCode = response.status;
      return next(error);
    }
    return res.render("user_courseDetail.ejs", { course: response.data });
  }).catch(function (err) {
    let error = new Error("Unable to access resource: " + err);
    error.statusCode = 500;
    return next(error);
  })
});

module.exports = router;
