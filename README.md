# ih-ngiw

Hub88 Next Generation Integration Wrapper

## Usage

First of all you need to install package:

```
npm install --save ih-ngiw
```

Then you can include your it in your own script:

```
const Ngiw = require("ih-ngiw");
```

You should already have public and private key for checking requests from Hub88, in case you don't you can read about it here: https://github.com/coingaming/Hub88-Examples.

Constructor accepts `port` and `publicKey`, `privateKey` params:

```
const w = new Ngiw({
  port: 3000,
  publicKey: "priv/demo_pub.pem",
  privateKey: "priv/demo_priv.pem"
});
```

You need to implement 4 callbacks, for example:

```
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

```

In every callback you should return `user`, `balance`, and `currency` fields. Or if something goes wrong your can return `status` field, you can grab all statuses from `Ngiw.STATUS_CODES`. For example:

```
const { RS_ERROR_USER_DISABLED } = Ngiw.STATUS_CODES;

w.balance(res => {
  return { status: RS_ERROR_USER_DISABLED };
})
```
