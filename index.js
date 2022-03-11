const path = require('path');

const SONARQUBE_SEVERITY = {
  '-1': 'INFO', // todo
  1: 'MINOR', // warning
  2: 'CRITICAL', // error
};

const SONARQUBE_TYPE = {
  '-1': 'CODE_SMELL', // todo
  1: 'CODE_SMELL', // warning
  2: 'BUG', // error
};

module.exports = class SonarQubeFormatter {
  defaultFileExtension = 'json';

  constructor(options = {}) {
    this.options = options;
  }

  format(results) {
    const issues = [];

    if (this.options.hasResultData) {
      for (const filePath of Object.keys(results.files)) {
        let result = results.files[filePath];
        let relativePath = path.relative(
          this.options.workingDirectory,
          result.filePath
        );

        for (const message of result.messages) {
          issues.push({
            engineId: 'ember-template-lint',
            ruleId: message.rule,
            severity: SONARQUBE_SEVERITY[message.severity],
            type: SONARQUBE_TYPE[message.severity],
            primaryLocation: {
              message: message.message,
              filePath: relativePath,
              textRange: {
                startLine: message.line,
                startColumn: message.column,
                endLine: message.endLine,
                endColumn: message.endColumn,
              },
            },
          });
        }
      }
    }

    // eslint-disable-next-line unicorn/no-null
    return JSON.stringify({ issues }, null, 2);
  }
};
