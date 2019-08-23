const express = require("express");

class Ngiw {
  constructor(params = { port: 3000 }) {
    this.params = params;
  }

  balance(cb) {
    this._balance = cb;

    return this;
  }

  start() {
    if (!this._balance) {
      throw Error("Balance callback should be implemented");
    }

    const app = express();

    app.get("/", (req, res) => {
      const result = this._balance(req);

      res.send("Hello World!");
    });

    app.listen(this.params.port, () =>
      console.log(`Example app listening on port ${this.params.port}!`)
    );

    return this;
  }
}

module.exports = Ngiw;
