const Ngiw = require("../index");
const path = require("path");

const { RS_ERROR_USER_DISABLED } = Ngiw.STATUS_CODES;

const db = {
  findUserBySession: sessionToken => {
    return { name: "Joe", balance: 100000 };
  },
  winGame: transactionId => {
    return { user: "Joe", balance: 100000 };
  },
  rollbackTransaction: transactionId => {
    return { user: "Joe", balance: 100000 };
  },
  betTransaction: transactionId => {
    return { user: "Joe", balance: 100000 };
  }
};

const w = new Ngiw({
  port: 3000,
  publicKey: path.resolve(__dirname, "priv/demo_pub.pem"),
  privateKey: path.resolve(__dirname, "priv/demo_priv.pem")
});

w.balance(req => {
  const user = db.findUserBySession(req.token);
  return { user: user.name, balance: user.balance, currency: "EUR" };
})
  .win(req => {
    const game = db.winGame(req.transaction_uuid);
    return { user: game.user, balance: game.balance, currency: "EUR" };
  })
  .rollback(req => {
    const transaction = db.rollbackTransaction(req.transaction_uuid);
    return {
      user: transaction.user,
      balance: transaction.balance,
      currency: "EUR"
    };
  })
  .bet(req => {
    const transaction = db.betTransaction(req.transaction_uuid);
    return {
      user: transaction.user,
      balance: transaction.balance,
      currency: "EUR"
    };
  })
  .start();
