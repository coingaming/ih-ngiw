const Ngiw = require("./index");

const { RS_ERROR_UNKNOWN } = Ngiw.STATUS_CODES;

describe("server", function() {
  it("should throw exception if one of callbacks not implemented", function() {
    const w = new Ngiw();

    expect(w.start).toThrow();
  });
});

describe("balance route", function() {
  const correctRequestBody = {
    request_uuid: "foo",
    token: "tok",
    game_id: 123
  };

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
      body: correctRequestBody
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
      body: correctRequestBody
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
      body: correctRequestBody
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

describe("win route", function() {
  const correctRequestBody = {
    transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
    token: "55b7518e-b89e-11e7-81be-58404eea6d16",
    supplier_user: "cg_45141",
    round: "rNEMwgzJAOZ6eR3V",
    request_uuid: "foo",
    reference_transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
    is_free: false,
    game_id: 132,
    currency: "BTC",
    bet: "zero",
    amount: 100500
  };

  it("should return status RS_ERROR_WRONG_SYNTAX if request does not container required fields", function() {
    const req = {};
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const winRoute = Ngiw._createWinRoute(cb);

    winRoute(req, res);

    expect(res.send).toBeCalledWith({
      status: "RS_ERROR_WRONG_SYNTAX"
    });
  });

  it("should throw error if result does not contain required fields", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const winRoute = Ngiw._createWinRoute(cb);

    expect(() => winRoute(req, res)).toThrow();
  });

  it("should not throw error if status passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ status: RS_ERROR_UNKNOWN });
    const winRoute = Ngiw._createWinRoute(cb);

    winRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: RS_ERROR_UNKNOWN
    });
  });

  it("should return RS_OK result if everything passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ user: "bar", currency: "EUR", balance: 123 });
    const winRoute = Ngiw._createWinRoute(cb);

    winRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: "RS_OK",
      user: "bar",
      balance: 123,
      currency: "EUR"
    });
  });
});

describe("rollback route", function() {
  const correctRequestBody = {
    transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
    token: "55b7518e-b89e-11e7-81be-58404eea6d16",
    round: "rNEMwgzJAOZ6eR3V",
    request_uuid: "foo",
    reference_transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
    game_id: 132
  };

  it("should return status RS_ERROR_WRONG_SYNTAX if request does not container required fields", function() {
    const req = {};
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const rollbackRoute = Ngiw._createRollbackRoute(cb);

    rollbackRoute(req, res);

    expect(res.send).toBeCalledWith({
      status: "RS_ERROR_WRONG_SYNTAX"
    });
  });

  it("should throw error if result does not contain required fields", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const rollbackRoute = Ngiw._createRollbackRoute(cb);

    expect(() => rollbackRoute(req, res)).toThrow();
  });

  it("should not throw error if status passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ status: RS_ERROR_UNKNOWN });
    const rollbackRoute = Ngiw._createRollbackRoute(cb);

    rollbackRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: RS_ERROR_UNKNOWN
    });
  });

  it("should return RS_OK result if everything passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ user: "bar", currency: "EUR", balance: 123 });
    const rollbackRoute = Ngiw._createRollbackRoute(cb);

    rollbackRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: "RS_OK",
      user: "bar",
      balance: 123,
      currency: "EUR"
    });
  });
});

describe("bet route", function() {
  const correctRequestBody = {
    transaction_uuid: "16d2dcfe-b89e-11e7-854a-58404eea6d16",
    token: "55b7518e-b89e-11e7-81be-58404eea6d16",
    supplier_user: "cg_45141",
    round: "rNEMwgzJAOZ6eR3V",
    request_uuid: "foo",
    is_free: false,
    game_id: 132,
    currency: "BTC",
    bet: "zero",
    amount: 100500
  };

  it("should return status RS_ERROR_WRONG_SYNTAX if request does not container required fields", function() {
    const req = {};
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const betRoute = Ngiw._createBetRoute(cb);

    betRoute(req, res);

    expect(res.send).toBeCalledWith({
      status: "RS_ERROR_WRONG_SYNTAX"
    });
  });

  it("should throw error if result does not contain required fields", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const betRoute = Ngiw._createBetRoute(cb);

    expect(() => betRoute(req, res)).toThrow();
  });

  it("should not throw error if status passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ status: RS_ERROR_UNKNOWN });
    const betRoute = Ngiw._createBetRoute(cb);

    betRoute(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: RS_ERROR_UNKNOWN
    });
  });

  it("should return RS_OK result if everything passed", function() {
    const req = {
      body: correctRequestBody
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({ user: "bar", currency: "EUR", balance: 123 });
    const betRoute = Ngiw._createBetRoute(cb);

    betRoute(req, res);

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
      isValid: () => false
    };
    const validateSignature = Ngiw._validateSignature(crypto);

    validateSignature(req, res);

    expect(res.send).toBeCalledWith({
      request_uuid: "foo",
      status: "RS_ERROR_INVALID_SIGNATURE"
    });
  });
});
