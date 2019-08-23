const express = require("express");

const STATUS_CODES = {
  RS_ERROR_UNKNOWN: "RS_ERROR_UNKNOWN"
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

    app.post("/user/balance", (req, res) => {
      if (!req.body || !req.body.request_uuid) {
        res.send({
          status: "RS_ERROR_WRONG_SYNTAX"
        });
        return;
      }

      const result = this._balance(req.body);

      if (!result.user) {
        throw Error("Balance should return user");
      }

      res.send({
        status: result.status || "RS_OK",
        user: result.user,
        request_uuid: req.body.request_uuid
      });
    });

    app.listen(this.params.port, () =>
      console.log(`Example app listening on port ${this.params.port}!`)
    );

    return this;
  }
}

Ngiw.STATUS_CODES = STATUS_CODES;

module.exports = Ngiw;
