const Ngiw = require("../index");

const { RS_ERROR_UNKNOWN } = Ngiw.STATUS_CODES;

const w = new Ngiw();

w.balance(res => {
  console.log(res);
  return {};
}).start();
