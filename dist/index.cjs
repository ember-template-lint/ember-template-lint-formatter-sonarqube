var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
var import_path = __toESM(require("path"), 1);
var SONARQUBE_SEVERITY = {
  "-1": "INFO",
  1: "MINOR",
  2: "CRITICAL"
};
var SONARQUBE_TYPE = {
  "-1": "CODE_SMELL",
  1: "CODE_SMELL",
  2: "BUG"
};
module.exports = class SonarQubeFormatter {
  constructor(options) {
    this.defaultFileExtension = "json";
    this.options = options;
  }
  format(results) {
    const issues = [];
    if (this.options.hasResultData) {
      for (const filePath of Object.keys(results.files)) {
        let result = results.files[filePath];
        let relativePath = import_path.default.relative(this.options.workingDirectory, result.filePath);
        for (const message of result.messages) {
          issues.push({
            engineId: "ember-template-lint",
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
                endColumn: message.endColumn
              }
            }
          });
        }
      }
    }
    return JSON.stringify({ issues }, null, 2);
  }
};
