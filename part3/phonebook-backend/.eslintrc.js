module.exports ={
    
        env: {
          browser: true,
          es2021: true
        },
        extends: [
          "eslint:recommended",
          "plugin:react/recommended",
          "airbnb"
        ],
        parserOptions: {
          "ecmaFeatures": {
            "jsx": true
          },
          "ecmaVersion": "latest",
          "sourceType": "module"
        },
        plugins: [
          "react"
        ],
        rules: {
          
          "indent": ["error", 2], // 使用 2 个空格进行缩进
          "linebreak-style": ["error", "unix"], // 强制使用 Unix 风格的换行符
          "quotes": ["error", "single"], // 强制使用单引号
          "semi": ["error", "always"], // 强制使用分号
          "no-unused-vars": ["warn"], // 发现未使用的变量时发出警告
        }
      
      
};