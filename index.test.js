const Ngiw = require("./index");

const { RS_ERROR_UNKNOWN } = Ngiw.STATUS_CODES;

describe("server", function() {
  it("should throw exception if one of callbacks not implemented", function() {
    const w = new Ngiw();

    expect(w.start).toThrow();
  });
});

describe("balance route", function() {
  it("should return status RS_ERROR_WRONG_SYNTAX if request does not container required fields", function() {
    const req = {};
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const balanceRoute = Ngiw._createBalanceRoute(cb);

    balanceRoute(req, res);

    expect(res.send).toBeCalledWith({
      status: "RS_ERROR_WRONG_SYNTAX"
    });
  });

  it("should throw error if result does not contain required fields", function() {
    const req = {
      body: { request_uuid: "foo", token: "tok", game_id: 123 }
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const balanceRoute = Ngiw._createBalanceRoute(cb);

    expect(() => balanceRoute(req, res)).toThrow();
  });

  it("should not throw error if status passed", function() {
    const req = {
      body: { request_uuid: "foo", token: "tok", game_id: 123 }
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ status: RS_ERROR_UNKNOWN });
    const balanceRoute = Ngiw._createBalanceRoute(cb);

    balanceRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: RS_ERROR_UNKNOWN
    });
  });

  it("should return RS_OK result if everything passed", function() {
    const req = {
      body: { request_uuid: "foo", token: "tok", game_id: 123 }
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ user: "bar", currency: "EUR", balance: 123 });
    const balanceRoute = Ngiw._createBalanceRoute(cb);

    balanceRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: "RS_OK",
      user: "bar",
      balance: 123,
      currency: "EUR"
    });
  });
});

describe("validate signature", function() {
  it("should return status RS_ERROR_INVALID_SIGNATURE if signature not equal expected", function() {
    const req = {
      get: () => "wrong_sign",
      body: {
        request_uuid: "foo"
      }
    };
    const res = {
      send: jest.fn()
    };
    const crypto = {
      sign: () => "sign"
    };
    const validateSignature = Ngiw._createValidateSignature(crypto);

    validateSignature(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: "RS_ERROR_INVALID_SIGNATURE"
    });
  });
});
