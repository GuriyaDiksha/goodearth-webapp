module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    useJSXTextNode: true,
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      jsx: true
    }
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/prop-types": 0,
    "react/display-name": 0
  },
  globals: {
    __DOMAIN__: false,
    __API_HOST__:false
}
};
