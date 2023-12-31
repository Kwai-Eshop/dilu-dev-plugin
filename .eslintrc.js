module.exports = {
  extends: [
    "semistandard",
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": 0,
    "no-tabs": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "react/require-default-props": 0,
    "import/extensions": 0,
    camelcase: 0,
    "max-len": 0,
    "no-throw-literal": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "promise/param-names": 0,
    "no-promise-executor-return": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "max-classes-per-file": 0,
    "import/prefer-default-export": 1,
    "no-use-before-define": 1,
    "no-return-assign": 1,
    "import/order": 1,
    "import/no-unresolved": 1,
    "react/jsx-props-no-spreading": 1,
    "jsx-a11y/click-events-have-key-events": 1,
    "jsx-a11y/no-static-element-interactions": 1,
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".html"],
        moduleDirectory: ["src", "node_modules"],
        caseSensitive: false,
        paths: ["src"],
      },
    },
  },
  root: true,
};
