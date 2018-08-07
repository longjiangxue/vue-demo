// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    //'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    //'standard'
    'airbnb-base'
  ],
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {

    'import/extensions': ['error', 'always',{
      'js': 'never',
      'vue': 'never'
    }],
    'import/no-extraneous-dependencies': ['error',{
      'optionalDependencies': ['test/unit/index.js']
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'no-alert': 0,
    'max-len': 0,
    'no-unused-vars': 0,
    'prefer-const': 0,

    // allow async-await
   // 'generator-star-spacing': 'off',
    // allow debugger during development
    //"semi": [2, "always"], // 强制分号结尾
    //"comma-dangle": [2, "always"], //对象字面量项尾要有逗号
  }
}
