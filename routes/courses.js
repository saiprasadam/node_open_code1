var express = require('express');
var router = express.Router();
var axios = require("axios");

let { springHost, springPort } = require("../helpers/constants");

/* GET home page. */
router.get('/', function (req, res, next) {
  let springEndpoint = "getAllCourses";

  let apiUrl = `http://${springHost}:${springPort}/${springEndpoint}`;
  axios.get(apiUrl)
    .then(function (response) {
      console.log("Requesting courses url: " + apiUrl);
      console.log(response.data);
      let data = [];
      for (let item of response.data) {
        let value = {};
        value.id = item.id;
        value.ownerName = item.ownerName;
        value.description = item.description;
        value.courseName = item.courseName;
        value.technology = [];
        value.level = [];
        for (let filterVal of item.filters) {
          let technology = filterVal.technology;
          let level = filterVal.level;
          value.technology.push(technology);
          value.level.push(level);
        }
        data.push(value);
      }
      console.log(data);
      console.log("Successfully obtained courses");

      res.render("courses.ejs", { data: data });
    })
    .catch(function (error) {
      // handle error
      console.error(error);
      res.render("error.ejs", { error });
    });
});

router.get("/:courseId", function (req, res, next) {
  let params = req.params;
  let courseId = params.courseId;
  console.log("Fetching resource with ID: " + courseId);
  if (!courseId) {
    let error = new Error("Course ID not found");
    error.statusCode = 400
    return next(error);
  }
  let url = `http://${springHost}:${springPort}/course/${courseId}`;
  return axios.get(url).then(function (response) {
    // Process the response data and render an EJS file
    if (response.status != 200) {
      let error = new Error(response.data);
      error.statusCode = response.status;
      return next(error);
    }
    return res.render("single_course.ejs", { course: response.data });
  }).catch(function (err) {
    let error = new Error("Unable to access resource: " + err);
    error.statusCode = 500;
    return next(error);
  })
});

module.exports = router;
