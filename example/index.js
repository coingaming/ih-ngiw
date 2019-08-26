const Ngiw = require("../index");

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
  publicKey: "priv/demo_pub.pem",
  privateKey: "priv/demo_priv.pem"
});

w.balance(res => {
  const user = db.findUserBySession(res.token);
  return { user: user.name, balance: user.balance, currency: "EUR" };
})
  .win(res => {
    const game = db.winGame(res.transaction_uuid);
    return { user: game.user, balance: game.balance, currency: "EUR" };
  })
  .rollback(res => {
    const transaction = db.rollbackTransaction(res.transaction_uuid);
    return {
      user: transaction.user,
      balance: transaction.balance,
      currency: "EUR"
    };
  })
  .bet(res => {
    const transaction = db.betTransaction(res.transaction_uuid);
    return {
      user: transaction.user,
      balance: transaction.balance,
      currency: "EUR"
    };
  })
  .start();
