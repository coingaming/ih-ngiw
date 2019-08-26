const express = require("express");
const fs = require("fs");
const path = require("path");
const HmCrypto = require("hm-crypto-nodejs");

const readPem = filename => {
  return fs.readFileSync(path.resolve(__dirname, filename)).toString("ascii");
};

const digestType = "RSA-SHA256";

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

const createRoute = requiredFields => cb => (req, res) => {
  const isValidRequest =
    req.body && requiredFields.every(field => req.body[field] !== undefined);

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
    throw Error("Method should return `user`, `currency`, `balance` fields");
  }

  const { user, currency, balance } = result;

  res.send({
    status: result.status || "RS_OK",
    ...{ user, currency, balance },
    request_uuid: req.body.request_uuid
  });
};

const createBalanceRoute = createRoute(["request_uuid", "token", "game_id"]);

const createWinRoute = createRoute([
  "transaction_uuid",
  "token",
  "supplier_user",
  "round",
  "request_uuid",
  "reference_transaction_uuid",
  "is_free",
  "game_id",
  "currency",
  "bet",
  "amount"
]);

const createRollbackRoute = createRoute([
  "transaction_uuid",
  "token",
  "round",
  "request_uuid",
  "reference_transaction_uuid",
  "game_id"
]);

const createBetRoute = createRoute([
  "transaction_uuid",
  "token",
  "supplier_user",
  "round",
  "request_uuid",
  "is_free",
  "game_id",
  "currency",
  "bet",
  "amount"
]);

const createValidateSignature = hmCrypto => (req, res) => {
  const signature = hmCrypto.sign(JSON.stringify(req.body));

  if (signature !== req.get("X-Hub88-Signature")) {
    res.send({
      status: "RS_ERROR_INVALID_SIGNATURE",
      request_uuid: req.body.request_uuid
    });
    return false;
  }

  return true;
};

const defaultParams = {
  port: 3000,
  publicKey: "priv/demo_pub.pem",
  privateKey: "priv/demo_priv.pem"
};

class Ngiw {
  constructor(params = defaultParams) {
    this.params = params;

    const publicKeyPem = readPem(params.publicKey);
    const privateKeyPem = readPem(params.privateKey);

    this.hmCrypto = HmCrypto(digestType, privateKeyPem, publicKeyPem);
  }

  /**
   *
   * @param {balanceCallback} cb
   */
  balance(cb) {
    this._balanceCallback = cb;

    return this;
  }

  win(cb) {
    this._winCallback = cb;

    return this;
  }

  rollback(cb) {
    this._rollbackCallback = cb;

    return this;
  }

  bet(cb) {
    this._betCallback = cb;

    return this;
  }

  start() {
    if (!this._balanceCallback) {
      throw Error("Balance callback should be implemented");
    }

    if (!this._winCallback) {
      throw Error("Win callback should be implemented");
    }

    if (!this._rollbackCallback) {
      throw Error("Rollback callback should be implemented");
    }

    if (!this._betCallback) {
      throw Error("Bet callback should be implemented");
    }

    const app = express();

    app.use(express.json());

    const balanceRoute = createBalanceRoute(
      this._balanceCallback,
      this.hmCrypto
    );

    const winRoute = createWinRoute(this._winCallback, this.hmCrypto);

    const rollbackRoute = createRollbackRoute(
      this._rollbackCallback,
      this.hmCrypto
    );

    const betRoute = createRollbackRoute(this._betCallback, this.hmCrypto);

    const validateSignature = createValidateSignature(this.hmCrypto);

    app.post("/user/balance", (req, res) => {
      if (!validateSignature(req, res)) {
        return;
      }
      balanceRoute(req, res);
    });

    app.post("/transaction/win", (req, res) => {
      if (!validateSignature(req, res)) {
        return;
      }
      winRoute(req, res);
    });

    app.post("/transaction/rollback", (req, res) => {
      if (!validateSignature(req, res)) {
        return;
      }
      rollbackRoute(req, res);
    });

    app.post("/transaction/bet", (req, res) => {
      if (!validateSignature(req, res)) {
        return;
      }
      betRoute(req, res);
    });

    app.listen(this.params.port, () =>
      console.log(`NGIW listening on port ${this.params.port}!`)
    );

    return this;
  }
}

Ngiw.STATUS_CODES = STATUS_CODES;
Ngiw._createBalanceRoute = createBalanceRoute;
Ngiw._createWinRoute = createWinRoute;
Ngiw._createRollbackRoute = createRollbackRoute;
Ngiw._createBetRoute = createBetRoute;
Ngiw._createValidateSignature = createValidateSignature;

module.exports = Ngiw;
