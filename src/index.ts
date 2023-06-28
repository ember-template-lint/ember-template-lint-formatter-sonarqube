import path from 'path';

type PartialRecord<K extends keyof any, T> = {
  [P in K]: T;
};

enum Severity {
  todo = -1,
  warning = 1,
  error = 2,
}

interface EmberTemplateLintOptions {
  hasResultData: true;
  workingDirectory: string;
}

interface EmberTemplateLintResults {
  files: { [x: string]: any };
}

const SONARQUBE_SEVERITY: PartialRecord<Severity, string> = {
  '-1': 'INFO', // todo
  1: 'MINOR', // warning
  2: 'CRITICAL', // error
};

const SONARQUBE_TYPE: PartialRecord<Severity, string> = {
  '-1': 'CODE_SMELL', // todo
  1: 'CODE_SMELL', // warning
  2: 'BUG', // error
};

//@ts-ignore
export = class SonarQubeFormatter {
  defaultFileExtension = 'json';
  options: EmberTemplateLintOptions;

  constructor(options: EmberTemplateLintOptions) {
    this.options = options;
  }

  format(results: EmberTemplateLintResults) {
    const issues = [];

    for (const filePath of Object.keys(results.files)) {
      let result = results.files[filePath];
      let absolutePath = path.isAbsolute(filePath)
        ? path.resolve(this.options.workingDirectory, filePath)
        : filePath;

        for (const message of result.messages) {
          issues.push({
            engineId: 'ember-template-lint',
            ruleId: message.rule,
            severity: SONARQUBE_SEVERITY[message.severity as Severity],
            type: SONARQUBE_TYPE[message.severity as Severity],
            primaryLocation: {
              message: message.message,
              filePath: absolutePath,
              textRange: {
                startLine: message.line || 1,
                startColumn: message.column,
                endLine: message.endLine,
                endColumn: message.endColumn,
              },
            },
          });
        }
      }
    
    return JSON.stringify({ issues }, null, 2);
  }
};
