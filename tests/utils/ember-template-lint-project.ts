'use strict';

import { join } from 'node:path';
import { createRequire } from 'node:module';
import { BinTesterProject } from '@scalvert/bin-tester';

const require = createRequire(import.meta.url);

// this is the default .editorconfig file for new ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.editorconfig
const DEFAULT_EDITOR_CONFIG = `
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org

root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 2

[*.hbs]
insert_final_newline = false

[*.{diff,md}]
trim_trailing_whitespace = false
`;

// this is the default .template-lintrc.js used by ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.template-lintrc.js
const DEFAULT_TEMPLATE_LINTRC = `
'use strict';

module.exports = {
  extends: 'recommended'
};
`;

export default class EmberTemplateLintProject extends BinTesterProject {
  constructor(name = 'fake-project', ...arguments_: any[]) {
    super(name, ...arguments_);
  }

  async setConfig(config: Record<string, any>) {
    let configFileContents =
      config === undefined
        ? DEFAULT_TEMPLATE_LINTRC
        : // eslint-disable-next-line unicorn/no-null
          `module.exports = ${JSON.stringify(config, null, 2)};`;

    this.files['.template-lintrc.js'] = configFileContents;

    await this.write();
  }

  getConfig() {
    return require(join(this.baseDir, '.template-lintrc'));
  }

  async setEditorConfig(value = DEFAULT_EDITOR_CONFIG) {
    this.files['.editorconfig'] = value;

    await this.write();
  }
}
