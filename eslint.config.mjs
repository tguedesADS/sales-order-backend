import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        languageOptions: {
            globals: globals.node
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['./gen/*.{js,ts}'],
        files: ['**/*.{js,mjs,ts}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore',
                    ignoreRestSiblings: true
                }
            ],
            'eol-last': 'error',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1
                }
            ],
            'max-len': ['error', 120],
            'max-lines-per-function': ['error', 30],
            'object-curly-spacing': ['error', 'always'],
            quotes: ['error', 'single'],
            'quote-props': ['error', 'as-needed'],
            semi: ['error', 'always'],
            'sort-imports': [
                'error', 
                {
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: true
                }
            ]
        }
    }
]