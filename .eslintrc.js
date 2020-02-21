module.exports = {
  "settings": {
      "import/resolver": {
          "node": {
              "extensions": [".js", ".jsx", ".ts", ".tsx"],
              "moduleDirectory": ["node_modules", "src/"]
          }
      }
  },
  "env": {
      "es6": true,
      "node": true
  },
  "extends": [
      "airbnb-base",
      "plugin:@typescript-eslint/eslint-recommended"
  ],
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint"
  ],
  "rules": {
    "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"
        }
     ],
    "import/no-unresolved": [
        2, 
        { "caseSensitive": false }
     ],
      "indent": [
          "error",
          4
      ],
      "quotes": [
          "error",
          "double"
      ],
      "semi": [
          "error",
          "always"
      ]

  }
}