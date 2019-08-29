# ih-ngiw

Hub88 Next Generation Integration Wrapper

## Usage

First of all you need to install package:

```
npm install --save @heathmont/ih-ngiw
```

Then you can include your it in your own script:

```
const Ngiw = require("@heathmont/ih-ngiw");
```

You should already have public and private key for checking requests from Hub88, in case you don't read about it here: https://github.com/coingaming/Hub88-Examples.

Constructor accepts `port` and `publicKey`, `privateKey` params:

```
const path = require("path");

const w = new Ngiw({
  port: 3000,
  publicKey: path.resolve(__dirname, "priv/demo_pub.pem"),
  privateKey: path.resolve(__dirname, "priv/demo_priv.pem")
});
```

You need to implement 4 callbacks, for example:

```
const balance = req => {
  const user = db.findUserBySession(req.token);
  return { user: user.name, balance: user.balance, currency: "EUR" };
}

const win = req => {
  const game = db.winGame(req.transaction_uuid);
  return { user: game.user, balance: game.balance, currency: "EUR" };
}

const rollback = req => {
  const transaction = db.rollbackTransaction(req.transaction_uuid);
  return {
    user: transaction.user,
    balance: transaction.balance,
    currency: "EUR"
  };
}

const bet = req => {
  const transaction = db.betTransaction(req.transaction_uuid);
  return {
    user: transaction.user,
    balance: transaction.balance,
    currency: "EUR"
  };
}

w.balance(balance);
w.win(win);
w.rollback(rollback);
w.bet(bet);
w.start();

```

Every callback called with different params, you can find description here in `body` section: https://app.swaggerhub.com/apis/hub88/hub88/2.0#/Wallet%20API. For example `balance` callback called with `token` and `game_id` (you should not care about `request_uuid`, it handled internally).

In every callback you should return `user`, `balance`, and `currency` fields. Or if something goes wrong your can return `status` field, you can grab all statuses from `Ngiw.STATUS_CODES`. For example:

```
const { RS_ERROR_USER_DISABLED } = Ngiw.STATUS_CODES;

w.balance(res => {
  return { status: RS_ERROR_USER_DISABLED };
})
```

More compilcated example can be found in `example/` folder.
