const moment = require("moment");

require("colors");

function ellipsis(n, str) {
  if (str.length > n) {
    return str.substring(0, Math.floor(n * 0.7) - 3) + "..." + str.substring(str.length - Math.floor(n * 0.3));
  }
  return str;
}

module.exports = function (props) {
  const typeColor = props.type === "POST"
    ? "cyan"
    : props.type === "GET"
      ? "yellow"
      : props.type === "WRITE"
        ? "grey"
        : "magenta";

  let message = props.message
    ? props.message
    : "";

  if (typeof props.isSuccess === "boolean") {
    message = (
      (props.message ? message + " " : "") +
      new Array(Math.max(0, 50 - message.length)).join(".").grey + " " +
      (props.isSuccess ? " ".bgGreen : " ".bgRed)
    );
  } else {
    message = (
      (props.message ? message + " " : "") +
      new Array(Math.max(0, 50 - message.length)).join(".").grey + " " +
      " ".bgYellow
    );
  }

  console.log(
    moment().format("HH:mm") + " " + props.type[typeColor] + " " + new Array(Math.max(0, 15 - props.type.length)).join(".").grey + " " +
    ellipsis(45, props.module) + " " + new Array(Math.max(0, 45 - props.module.length)).join(".").grey +
    (props.message ? " " : " .".grey) +
    message
  );
};