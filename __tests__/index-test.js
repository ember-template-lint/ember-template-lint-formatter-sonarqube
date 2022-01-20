const execa = require("execa");
const stripAnsi = require("strip-ansi");
const Project = require("./__utils__/fake-project");
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
  let project;

  beforeEach(() => {
    project = new Project("fake-project");
  });

  afterEach(() => {
    // project.dispose();
  });

  it("can format output from no results", () => {
    let mockConsole = new MockConsole();
    let formatter = new SonarQubeFormatter({
      console: mockConsole,
    });

    formatter.print({});

    expect(mockConsole.toString()).toMatchInlineSnapshot(`
      "{
        \\"issues\\": []
      }"
    `);
  });

  it("can format output when there are warnings", async () => {
    project.setConfig({
      rules: {
        "no-bare-strings": "warn",
      },
    });
    project.write({
      app: {
        templates: {
          "application.hbs":
            "<h2>Here too!!</h2> <div>Bare strings are bad...</div>",
          components: {
            "foo.hbs": "{{fooData}}",
          },
        },
      },
    });

    let result = await emberTemplateLint();

    expect(result.stdout).toMatchInlineSnapshot(`
      "{
        \\"issues\\": [
          {
            \\"engineId\\": \\"ember-template-lint\\",
            \\"ruleId\\": \\"no-bare-strings\\",
            \\"severity\\": \\"MINOR\\",
            \\"type\\": \\"CODE_SMELL\\",
            \\"primaryLocation\\": {
              \\"message\\": \\"Non-translated string used\\",
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"textRange\\": {
                \\"startLine\\": 1,
                \\"startColumn\\": 4,
                \\"endLine\\": 1,
                \\"endColumn\\": 14
              }
            }
          },
          {
            \\"engineId\\": \\"ember-template-lint\\",
            \\"ruleId\\": \\"no-bare-strings\\",
            \\"severity\\": \\"MINOR\\",
            \\"type\\": \\"CODE_SMELL\\",
            \\"primaryLocation\\": {
              \\"message\\": \\"Non-translated string used\\",
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"textRange\\": {
                \\"startLine\\": 1,
                \\"startColumn\\": 25,
                \\"endLine\\": 1,
                \\"endColumn\\": 48
              }
            }
          }
        ]
      }"
    `);
  });

  it("can format output when there are errors", async () => {
    project.setConfig({
      rules: {
        "no-bare-strings": "error",
      },
    });
    project.write({
      app: {
        templates: {
          "application.hbs":
            "<h2>Here too!!</h2> <div>Bare strings are bad...</div>",
          components: {
            "foo.hbs": "{{fooData}}",
          },
        },
      },
    });

    let result = await emberTemplateLint();

    expect(result.stdout).toMatchInlineSnapshot(`
      "{
        \\"issues\\": [
          {
            \\"engineId\\": \\"ember-template-lint\\",
            \\"ruleId\\": \\"no-bare-strings\\",
            \\"severity\\": \\"CRITICAL\\",
            \\"type\\": \\"BUG\\",
            \\"primaryLocation\\": {
              \\"message\\": \\"Non-translated string used\\",
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"textRange\\": {
                \\"startLine\\": 1,
                \\"startColumn\\": 4,
                \\"endLine\\": 1,
                \\"endColumn\\": 14
              }
            }
          },
          {
            \\"engineId\\": \\"ember-template-lint\\",
            \\"ruleId\\": \\"no-bare-strings\\",
            \\"severity\\": \\"CRITICAL\\",
            \\"type\\": \\"BUG\\",
            \\"primaryLocation\\": {
              \\"message\\": \\"Non-translated string used\\",
              \\"filePath\\": \\"app/templates/application.hbs\\",
              \\"textRange\\": {
                \\"startLine\\": 1,
                \\"startColumn\\": 25,
                \\"endLine\\": 1,
                \\"endColumn\\": 48
              }
            }
          }
        ]
      }"
    `);
  });

  function emberTemplateLint(argumentsOrOptions, options) {
    if (arguments.length > 0) {
      if (arguments.length === 1) {
        options = Array.isArray(argumentsOrOptions) ? {} : argumentsOrOptions;
      }
    } else {
      argumentsOrOptions = [];
      options = {};
    }

    const mergedOptions = Object.assign(
      {
        reject: false,
        cwd: project.baseDir,
      },
      options
    );

    return execa(
      process.execPath,
      [
        require.resolve(
          "../node_modules/ember-template-lint/bin/ember-template-lint.js"
        ),
        ".",
        "--format",
        require.resolve(".."),
        ...argumentsOrOptions,
      ],
      mergedOptions
    );
  }
});
