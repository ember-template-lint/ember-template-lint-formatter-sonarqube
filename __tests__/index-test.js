const stripAnsi = require("strip-ansi");
const SonarQubeFormatter = require("../index");

class MockConsole {
  buffer = [];

  get lines() {
    return this.buffer.map((message) => {
      return stripAnsi(message).trim();
    });
  }

  log(message) {
    this.buffer.push(message);
  }

  toString() {
    return stripAnsi(this.buffer.join("\n"));
  }
}

describe("SonarQube Formatter", () => {
  it("can format output from no results", () => {
    let mockConsole = new MockConsole();
    let formatter = new SonarQubeFormatter({
      console: mockConsole,
    });

    formatter.print([]);

    expect(mockConsole.toString()).toMatchInlineSnapshot(`
      "{
        \\"issues\\": []
      }"
    `);
  });
});
