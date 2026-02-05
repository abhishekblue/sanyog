module.exports = {
  extends: ['expo', 'plugin:@typescript-eslint/recommended'],
  plugins: ['import', 'tsdoc', '@typescript-eslint', 'local-rules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // ============================================
    // CUSTOM RULES (Samvaad)
    // ============================================
    // Interfaces must be in separate .types.ts files
    'local-rules/no-inline-interfaces': 'error',

    // ============================================
    // NAMING CONVENTIONS
    // ============================================
    '@typescript-eslint/naming-convention': [
      'error',
      // Interfaces must start with 'I'
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
      // Types use PascalCase (no prefix)
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      // Variables and functions use camelCase
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // React components use PascalCase
      {
        selector: 'variable',
        modifiers: ['const'],
        types: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
    ],

    // ============================================
    // IMPORT ORDER
    // ============================================
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js built-in modules
          'external', // npm packages
          'internal', // Internal modules (aliased paths)
          'parent', // Parent imports (../)
          'sibling', // Sibling imports (./)
          'index', // Index imports
          'type', // Type imports
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // ============================================
    // CONSOLE STATEMENTS (uncomment for production)
    // ============================================
    // 'no-console': ['error', { allow: ['warn', 'error'] }],

    // ============================================
    // LINE WIDTH (handled by Prettier, but ESLint can warn)
    // ============================================
    'max-len': [
      'warn',
      {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],

    // ============================================
    // TYPESCRIPT STRICT RULES
    // ============================================
    // Require explicit return types on functions
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],

    // No 'any' type - error instead of warn
    '@typescript-eslint/no-explicit-any': 'error',

    // Require explicit accessibility modifiers (public/private)
    '@typescript-eslint/explicit-member-accessibility': 'off', // Optional - enable if you want

    // ============================================
    // TSDOC
    // ============================================
    'tsdoc/syntax': 'warn',

    // ============================================
    // GENERAL BEST PRACTICES
    // ============================================
    'no-unused-vars': 'off', // Use TypeScript version instead
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
