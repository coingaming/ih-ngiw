const express = require("express");

const STATUS_CODES = {
  RS_ERROR_UNKNOWN: "RS_ERROR_UNKNOWN",
  RS_ERROR_INVALID_PARTNER: "RS_ERROR_INVALID_PARTNER",
  RS_ERROR_INVALID_TOKEN: "RS_ERROR_INVALID_TOKEN",
  RS_ERROR_INVALID_GAME: "RS_ERROR_INVALID_GAME",
  RS_ERROR_WRONG_CURRENCY: "RS_ERROR_WRONG_CURRENCY",
  RS_ERROR_NOT_ENOUGH_MONEY: "RS_ERROR_NOT_ENOUGH_MONEY",
  RS_ERROR_USER_DISABLED: "RS_ERROR_USER_DISABLED",
  RS_ERROR_TOKEN_EXPIRED: "RS_ERROR_TOKEN_EXPIRED",
  RS_ERROR_DUPLICATE_TRANSACTION: "RS_ERROR_DUPLICATE_TRANSACTION",
  RS_ERROR_TRANSACTION_DOES_NOT_EXIST: "RS_ERROR_TRANSACTION_DOES_NOT_EXIST",
  RS_ERROR_TRANSACTION_ROLLED_BACK: "RS_ERROR_TRANSACTION_ROLLED_BACK"
};

/**
 * @typedef {Object} BalanceResponse
 * @property {string} user - Unique User ID in the Operator’s system. In case of DEMO gameplay, this parameter may be omitted.
 */

/**
 * Callback for balance
 *
 * @callback balanceCallback
 * @param {BalanceRequest} request
 * @return {BalanceResponse}
 */

const createBalanceRoute = cb => (req, res) => {
  const isValidRequest =
    req.body && req.body.request_uuid && req.body.token && req.body.game_id;

  if (!isValidRequest) {
    res.send({
      status: "RS_ERROR_WRONG_SYNTAX"
    });
    return;
  }

  const result = cb(req.body);

  const isValidResult =
    result.status ||
    (result.user && result.currency && result.balance !== undefined);

  if (!isValidResult) {
    throw Error("Balance method should return user");
  }

  res.send({
    status: result.status || "RS_OK",
    user: result.user,
    request_uuid: req.body.request_uuid
  });
};

class Ngiw {
  constructor(params = { port: 3000 }) {
    this.params = params;
  }

  /**
   *
   * @param {balanceCallback} cb
   */
  balance(cb) {
    this._balance = cb;

    return this;
  }

  start() {
    if (!this._balance) {
      throw Error("Balance callback should be implemented");
    }

    const app = express();

    app.use(express.json());

    const balanceRoute = createBalanceRoute(this._balance);

    app.post("/user/balance", balanceRoute);

    app.listen(this.params.port, () =>
      console.log(`Example app listening on port ${this.params.port}!`)
    );

    return this;
  }
}

Ngiw.STATUS_CODES = STATUS_CODES;
Ngiw._createBalanceRoute = createBalanceRoute;

module.exports = Ngiw;
