const Ngiw = require("../index");

const { RS_ERROR_UNKNOWN } = Ngiw.STATUS_CODES;

const w = new Ngiw({
  port: 3000,
  publicKey: "priv/demo_pub.pem",
  privateKey: "priv/demo_priv.pem"
});

w.balance(res => {
  console.log(res);
  return { user: "123", balance: 0, currency: "EUR" };
}).start();
