const IS_PRODUCTION = process.env.NODE_ENV === "production";
const port          = IS_PRODUCTION ? 8080 : 5001;

const fs            = require("fs");
const path          = require("path");
const express       = require("express");
const app           = express();
const bodyParser    = require("body-parser");
const fileUpload    = require("express-fileupload");
const cookieParser  = require("cookie-parser");
const cookieSession = require("cookie-session");

const logger        = require("./scripts/helpers/logger");
const promisify     = require("./scripts/helpers/promisify");
const stat          = promisify(fs.stat);
const config        = require("./spike.config");

function load(path) {
  const spike  = require(path.join(path, "spike.js"));

  logger({
    type   : "START",
    module : path.basename(path)
  });

  spike(app);
}

app.use(fileUpload());
app.use(cookieParser("SECRET"));
app.use(cookieSession({
  name : "8hjdsfHj71LL",
  keys : [ "SECRET" ],
  maxAge : (function () {
    const d     = new Date();
    const month = 2592000000;
    d.setTime(d.getTime() + month);
    return d.getTime();
  }())
}));

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.listen(port);

config.load.forEach(path => {
  stat(path.join(path, "spike.js"))
    .then(() => load(path))
    .catch(() => {
      console.log("WARNING: \"" + path + "\" is missing \"spike.js\" file");
    });
});

logger({
  type    : "START",
  module  : "server",
  message : "http://localhost:" + port
});