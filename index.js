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

function load(folder) {
  const spike  = require(path.join(folder, "spike.js"));

  logger({
    type   : "START",
    module : path.basename(folder)
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

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  bodyParser.json()
);

app.listen(port);

promisify(fs.readdir, "./apps")
  .then(folders => {
    folders
      .map(name => path.resolve(path.join("./apps", name)))
      .filter(file => !/\/\./.test(file))
      .forEach(folder => {
        if (fs.existsSync(path.join(folder, "spike.js"))) {
          load(folder);
        } else {
          console.log("WARNING: \"" + folder + "\" is missing \"spike.js\" file");
        }
      });
  })
  .catch(err => {
    console.log(err);
  });

logger({
  type    : "START",
  module  : "server",
  message : "http://localhost:" + port
});