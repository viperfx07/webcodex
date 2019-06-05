module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: [1, 'tab']
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
