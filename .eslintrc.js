module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
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
      "@typescript-eslint/no-this-alias": [
        "error",
        {
          "allowDestructuring": true, // Allow `const { props, state } = this`; false by default
          "allowedNames": ["that"] // Allow `const that= this`; `[]` by default
        }
      ]
    ,
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["warn"],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/prop-types": 0,
    "react/display-name": 0
  },
  globals: {
    __DOMAIN__: false,
    __API_HOST__:false,
    __CDN_HOST__:false,
    __OMNI_HOST__: false,
    dataLayer: false,
    __FB_APP_ID__: false,
    __GOOGLE_CLIENT_ID__: false,
    __GTM_ID__: false,
    __IP_DATA_KEY__: false,
    __MOENG__:false,
    Vimeo: false,
    __CAREERS_FORM__: false,
    Moengage: false,
    __EnableCrypto__:false
}
};
