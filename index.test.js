const Ngiw = require("./index");

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

  it("should throw error if result does not contain requried fields", function() {
    const req = {
      body: { request_uuid: "foo" }
    };
    const res = {
      send: jest.fn()
    };
    const cb = () => ({});
    const balanceRoute = Ngiw._createBalanceRoute(cb);

    expect(() => balanceRoute(req, res)).toThrow();
  });
});
