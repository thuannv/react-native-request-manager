module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 7,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true,
            experimentalObjectRestSpread: true,
        },
        sourceType: 'module',
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ['@momo-platform/momo'],
    extends: ['@react-native-community'],
    rules: {
        'no-undef': 2,
        'no-control-regex': 0,
        semi: 0,
        'jsx-quotes': 0,
        'react-hooks/exhaustive-deps': 0,
        curly: 0,
        'no-catch-shadow': 0,
        'no-extra-boolean-cast': 0,
        'no-bitwise': 0,
        'no-shadow': 0,
        'react-native/no-inline-styles': 0,
        'prettier/prettier': 0,
    },
    globals: { _: true, __DEV__: true, alert: true, fetch: true, fs: true },
    overrides: [
        {
            files: ['*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
        },
    ],
    parser: 'babel-eslint',
};
