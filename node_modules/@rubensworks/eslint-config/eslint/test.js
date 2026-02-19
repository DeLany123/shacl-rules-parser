const jest = require('eslint-plugin-jest');

// Specifically for tests
module.exports = {
  // See https://github.com/jest-community/eslint-plugin-jest/issues/1408
  plugins: {
    jest,
  },
  files: [ '**/test/**/*.ts' ],
  rules: {
    ...jest.configs.all.rules,
    // Rule is not smart enough to check called function in the test
    'jest/expect-expect': 'off',

    // Default rules that are overkill
    'jest/no-hooks': 'off',
    'jest/max-expects': 'off',
    'jest/no-conditional-in-test': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/prefer-lowercase-title': 'off',
    'jest/prefer-strict-equal': 'off',
    'jest/require-hook': 'off',
    'jest/valid-title': 'off',
    'jest/unbound-method': 'off',

    'max-statements-per-line': 'off',
    'id-length': 'off',
    'arrow-body-style': 'off',
    'line-comment-position': 'off',
    'no-inline-comments': 'off',
    'unicorn/filename-case': 'off',
    'no-new': 'off',
    'unicorn/no-nested-ternary': 'off',
    'no-return-assign': 'off',
    'no-useless-call': 'off',
    'no-sync': 'off',
    'import/no-extraneous-dependencies': 'off',
    'func-style': 'off',
    'unicorn/consistent-function-scoping': 'off',

    'test/prefer-lowercase-title': 'off',

    'ts/naming-convention': 'off',
    'ts/no-unsafe-argument': 'off',
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-call': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-return': 'off',
    'ts/unbound-method': 'off',
    'ts/brace-style': 'off',
    'ts/ban-ts-comment': 'off',
    'ts/ban-ts-ignore': 'off',
    'ts/explicit-function-return-type': 'off',
    'ts/no-extra-parens': 'off',
    'ts/restrict-plus-operands': 'off',
    'ts/no-require-imports': 'off',
    'ts/no-var-requires': 'off',

    // Incorrectly detects usage of undefined in "toHaveBeenLastCalledWith" checks
    'unicorn/no-useless-undefined': 'off',
  },
};
