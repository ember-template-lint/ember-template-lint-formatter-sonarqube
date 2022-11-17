import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import EmberTemplateLintProject from './utils/ember-template-lint-project';
import { createBinTester } from '@scalvert/bin-tester';

describe('SonarQube Formatter', () => {
  let project: EmberTemplateLintProject;
  let { setupProject, teardownProject, runBin } = createBinTester({
    binPath: require.resolve('../node_modules/ember-template-lint/bin/ember-template-lint.js'),
    staticArgs: ['.', '--format', require.resolve('..')],
    createProject: async () => new EmberTemplateLintProject(),
  });

  beforeEach(async () => {
    project = await setupProject();
  });

  afterEach(() => {
    // teardownProject();
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
    debugger;
    let result = await runBin();

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

    let result = await runBin();

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

    let result = await runBin();

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
});
