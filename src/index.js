const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const port = 8080;

var get = require("simple-get");
var moment = require("moment");

const opts = {
  method: "GET",
  url: "https://api.github.com/users/phaniteja1/events",
  headers: {
    "user-agent": "humanize github events"
  },
  json: true
};

const getCommitsCount = event => {
  return event.payload.commits ? event.payload.commits.length : null;
};

app.use(bodyParser.json());

app.get("/", function(req, res) {
  get.concat(opts, function(err, response, data) {
    var filteredData = data.filter(event => {
      return (
        ["PushEvent", "CreateEvent", "PullRequestEvent"].indexOf(event.type) !==
        -1
      );
    });

    filteredData = filteredData.map(event => {
      return {
        type: event.type,
        repo_name: event.repo.name,
        commits: getCommitsCount(event),
        date: moment(event.created_at).format("LL"),
        human_date: moment(event.created_at).calendar()
      };
    });

    res.write(JSON.stringify(filteredData)); //write a response to the client
    res.end(); //end the response
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
