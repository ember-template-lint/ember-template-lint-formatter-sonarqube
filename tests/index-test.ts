import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import EmberTemplateLintProject from './utils/ember-template-lint-project';
import { createBinTester } from '@scalvert/bin-tester';

describe('SonarQube Formatter', () => {
  let project: EmberTemplateLintProject;
  let { setupProject, teardownProject, runBin } = createBinTester({
    binPath: require.resolve('../node_modules/ember-template-lint/bin/ember-template-lint.js'),
    staticArgs: ['.', '--no-clean-todo', '--format', require.resolve('..')],
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

    expect(JSON.parse(result.stdout)).toEqual({
      issues: [
        {
          engineId: 'ember-template-lint',
          ruleId: 'no-bare-strings',
          severity: 'MINOR',
          type: 'CODE_SMELL',
          primaryLocation: {
            message: 'Non-translated string used',
            filePath: `${project.baseDir}/app/templates/application.hbs`,
            textRange: {
              startLine: 1,
              startColumn: 4,
              endLine: 1,
              endColumn: 14,
            },
          },
        },
        {
          engineId: 'ember-template-lint',
          ruleId: 'no-bare-strings',
          severity: 'MINOR',
          type: 'CODE_SMELL',
          primaryLocation: {
            message: 'Non-translated string used',
            filePath: `${project.baseDir}/app/templates/application.hbs`,
            textRange: {
              startLine: 1,
              startColumn: 25,
              endLine: 1,
              endColumn: 48,
            },
          },
        },
      ],
    });
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

    expect(JSON.parse(result.stdout)).toEqual({
      issues: [
        {
          engineId: 'ember-template-lint',
          ruleId: 'no-bare-strings',
          severity: 'CRITICAL',
          type: 'BUG',
          primaryLocation: {
            message: 'Non-translated string used',
            filePath: `${project.baseDir}/app/templates/application.hbs`,
            textRange: {
              startLine: 1,
              startColumn: 4,
              endLine: 1,
              endColumn: 14,
            },
          },
        },
        {
          engineId: 'ember-template-lint',
          ruleId: 'no-bare-strings',
          severity: 'CRITICAL',
          type: 'BUG',
          primaryLocation: {
            message: 'Non-translated string used',
            filePath: `${project.baseDir}/app/templates/application.hbs`,
            textRange: {
              startLine: 1,
              startColumn: 25,
              endLine: 1,
              endColumn: 48,
            },
          },
        },
      ],
    });
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
          'application.hbs': '<div></div>',
        },
      },
      '.lint-todo': 'add|ember-template-lint|no-bare-strings|1|5|1|5|70c881d4a26984ddce795f6f71817c9cf4480e79|1687824000000|1690416000000|1693008000000|app/templates/application.hbs',
    });

    let result = await runBin();

    expect(JSON.parse(result.stdout)).toEqual({
      issues: [
        {
          engineId: 'ember-template-lint',
          ruleId: 'invalid-todo-violation-rule',
          severity: 'CRITICAL',
          type: 'BUG',
          primaryLocation: {
            message: 'Todo violation passes `no-bare-strings` rule. Please run `npx ember-template-lint app/templates/application.hbs --clean-todo` to remove this todo from the todo list.',
            filePath: `${project.baseDir}/app/templates/application.hbs`,
            textRange: {
              startLine: 1,
            },
          },
        },
      ],
    });
  });
});
