const fs = require("fs");
const exec = require("child_process").exec;
const path = require("path");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "upload.json")));

function each(i) {
  let str = (
    "rsync --ignore-times -e ssh " +
    (config.files[i].substr(-1) === "/" ? "-avz " : "") +
    path.resolve(config.files[i]) + " " +
    config.username + "@" + config.server +
    ":" + config.root
  );

  exec(str, function (err, std) {
    if (err) {
      console.log(err);
    } else {
      console.log("Uploaded: " + config.files[i]);
      if (config.files[i + 1]) {
        each(i + 1);
      }
    }
  });
}

each(0);