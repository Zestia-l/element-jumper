module.exports = {
    // 指定解析器
    parser: '@typescript-eslint/parser',
    
    // 解析器选项
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    
    // 继承的规则集
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier' // 如果使用 Prettier，避免冲突
    ],
    
    // 环境定义
    env: {
      browser: true,
      node: true,
      es6: true
    },
    
    // 全局变量
    globals: {
      React: 'readonly'
    },
    
    // 自定义规则
    rules: {
      // 禁止未使用的变量
      '@typescript-eslint/no-unused-vars': 'error',
      // 禁止使用空函数
      '@typescript-eslint/no-empty-function': 'warn',
      // 强制使用骆驼命名法
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE']
        }
      ],
      // 允许非空断言（!）
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 关闭 prop-types 检查（TypeScript 已提供类型检查）
      'react/prop-types': 'off',
      // 强制 React 组件使用箭头函数
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ]
    },
    
    // 插件
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    
    // 特定文件的配置
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          // TypeScript 特定规则
        }
      }
    ],
    
    // 自动发现 React 版本
    settings: {
      react: {
        version: 'detect'
      }
    }
  };