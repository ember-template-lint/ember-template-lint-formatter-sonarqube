var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/tsup/assets/esm_shims.js
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
  }
});

// src/index.ts
import path from "path";
var require_src = __commonJS({
  "src/index.ts"(exports, module) {
    init_esm_shims();
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
            let relativePath = path.relative(this.options.workingDirectory, result.filePath);
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
  }
});
export default require_src();
