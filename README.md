# ember-template-lint-formatter-sonarqube

![CI Build](https://github.com/scalvert/ember-template-lint-formatter-sonarqube/workflows/CI%20Build/badge.svg)
[![npm version](https://badge.fury.io/js/ember-template-lint-formatter-sonarqube.svg)](https://badge.fury.io/js/ember-template-lint-formatter-sonarqube)
[![License](https://img.shields.io/npm/l/ember-template-lint-formatter-sonarqube.svg)](https://github.com/scalvert/ember-template-lint-formatter-sonarqube/blob/master/package.json)
![Dependabot](https://badgen.net/badge/icon/dependabot?icon=dependabot&label)
![Volta Managed](https://img.shields.io/static/v1?label=volta&message=managed&color=yellow&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAeQC6AMEpK7AhAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AMGFS07qAYEaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFmSURBVDjLY2CgB/g/j0H5/2wGW2xyTAQ1r2DQYOBgm8nwh+EY6TYvZtD7f9rn5e81fAGka17GYPL/esObP+dyj5Cs+edqZsv/V8o//H+z7P+XHarW+NSyoAv8WsFszyKTtoVBM5Tn7/Xys+zf7v76vYrJlPEvAwPjH0YGxp//3jGl/L8LU8+IrPnPUkY3ZomoDQwOpZwMv14zMHy8yMDwh4mB4Q8jA8OTgwz/L299wMDyx4Mp9f9NDAP+bWVwY3jGsJpB3JaDQVCEgYHlLwPDfwYWRqVQJgZmHoZ/+3PPfWP+68Mb/Pw5sqUoLni9ipuRnekrAwMjA8Ofb6K8/PKBF5nU7RX+Hize8Y2DOZTP7+kXogPy1zrH+f/vT/j/Z5nUvGcr5VhJioUf88UC/59L+/97gUgDyVH4YzqXxL8dOs/+zuFLJivd/53HseLPPHZPsjT/nsHi93cqozHZue7rLDYhUvUAADjCgneouzo/AAAAAElFTkSuQmCC&link=https://volta.sh)
[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](#badge)

> A custom formatter for `ember-template-lint` that will format the output in SonarQube's [generic issue format](https://docs.sonarqube.org/latest/analysis/generic-issue/).

## Install

```shell
npm i ember-template-lint-formatter-sonarqube --save-dev

# or

yarn add ember-template-lint-formatter-sonarqube --dev
```

Output will be in 'Generic Issue Format'.

```json
{
  "issues": [
    {
      "engineId": "ember-template-lint",
      "ruleId": "no-bare-strings",
      "severity": "MINOR",
      "type": "CODE_SMELL",
      "primaryLocation": {
        "message": "Non-translated string used",
        "filePath": "app/templates/application.hbs",
        "textRange": {
          "startLine": 1,
          "startColumn": 4,
          "endLine": 1,
          "endColumn": 14
        }
      }
    },
    {
      "engineId": "ember-template-lint",
      "ruleId": "no-bare-strings",
      "severity": "MINOR",
      "type": "CODE_SMELL",
      "primaryLocation": {
        "message": "Non-translated string used",
        "filePath": "app/templates/application.hbs",
        "textRange": {
          "startLine": 1,
          "startColumn": 25,
          "endLine": 1,
          "endColumn": 48
        }
      }
    }
  ]
}
```

## Usage

```shell
ember-template-lint . --format ember-template-lint-formatter-sonarqube
```
