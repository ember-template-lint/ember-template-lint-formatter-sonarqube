import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import EmberTemplateLintProject from './utils/ember-template-lint-project';
import { createBinTester } from '@scalvert/bin-tester';

const formatterPath = require.resolve('..');

describe('SonarQube Formatter', () => {
  let project: EmberTemplateLintProject;
  let { setupProject, teardownProject, runBin } = createBinTester({
    binPath: require.resolve('../node_modules/ember-template-lint/bin/ember-template-lint.js'),
    createProject: async () => new EmberTemplateLintProject(),
  });

  beforeEach(async () => {
    project = await setupProject();
  });

  afterEach(() => {
    teardownProject();
  });

  it('can format output from no results', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': 'warn',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs': '<div></div>',
        },
      },
    });

    let result = await runBin('.', '--format', formatterPath);

    expect(result.stdout).toMatchInlineSnapshot(`
      "{
        \\"issues\\": []
      }"
    `);
  });

  it('can format output when there are warnings', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': 'warn',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
          components: {
            'foo.hbs': '{{fooData}}',
          },
        },
      },
    });

    let result = await runBin('.', '--format', formatterPath);

    expect(JSON.parse(result.stdout)).toMatchInlineSnapshot(`
      {
        "issues": [
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Non-translated string used",
              "textRange": {
                "endColumn": 14,
                "endLine": 1,
                "startColumn": 4,
                "startLine": 1,
              },
            },
            "ruleId": "no-bare-strings",
            "severity": "MINOR",
            "type": "CODE_SMELL",
          },
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Non-translated string used",
              "textRange": {
                "endColumn": 48,
                "endLine": 1,
                "startColumn": 25,
                "startLine": 1,
              },
            },
            "ruleId": "no-bare-strings",
            "severity": "MINOR",
            "type": "CODE_SMELL",
          },
        ],
      }
    `);
  });

  it('can format output when there are errors', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': 'error',
      },
    });
    await project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
          components: {
            'foo.hbs': '{{fooData}}',
          },
        },
      },
    });

    let result = await runBin('.', '--format', formatterPath);

    expect(JSON.parse(result.stdout)).toMatchInlineSnapshot(`
      {
        "issues": [
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Non-translated string used",
              "textRange": {
                "endColumn": 14,
                "endLine": 1,
                "startColumn": 4,
                "startLine": 1,
              },
            },
            "ruleId": "no-bare-strings",
            "severity": "CRITICAL",
            "type": "BUG",
          },
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Non-translated string used",
              "textRange": {
                "endColumn": 48,
                "endLine": 1,
                "startColumn": 25,
                "startLine": 1,
              },
            },
            "ruleId": "no-bare-strings",
            "severity": "CRITICAL",
            "type": "BUG",
          },
        ],
      }
    `);
  });

  it('can format output when there startLine is missing', async () => {
    await project.setConfig({
      rules: {
        'no-bare-strings': 'error',
      },
    });

    await project.write({
      app: {
        templates: {
          'application.hbs': '<h2>Here too!!</h2> <div>Bare strings are bad...</div>',
        },
      },
    });

    // generate todo based on existing errors
    await runBin('.', '--update-todo');

    // mimic fixing the error manually via user interaction
    await project.write({
      app: {
        templates: {
          'application.hbs': '<div></div>',
        },
      },
    });

    // run normally with --no-clean-todo and expect an error for not running --fix
    let result = await runBin('.', '--no-clean-todo', '--format', formatterPath);

    expect(JSON.parse(result.stdout)).toMatchInlineSnapshot(`
      {
        "issues": [
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Todo violation passes \`no-bare-strings\` rule. Please run \`npx ember-template-lint app/templates/application.hbs --clean-todo\` to remove this todo from the todo list.",
              "textRange": {
                "startLine": 1,
              },
            },
            "ruleId": "invalid-todo-violation-rule",
            "severity": "CRITICAL",
            "type": "BUG",
          },
          {
            "engineId": "ember-template-lint",
            "primaryLocation": {
              "filePath": "app/templates/application.hbs",
              "message": "Todo violation passes \`no-bare-strings\` rule. Please run \`npx ember-template-lint app/templates/application.hbs --clean-todo\` to remove this todo from the todo list.",
              "textRange": {
                "startLine": 1,
              },
            },
            "ruleId": "invalid-todo-violation-rule",
            "severity": "CRITICAL",
            "type": "BUG",
          },
        ],
      }
    `);
  });
});
