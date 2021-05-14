module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',

  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts',
    '!src/App.vue',
    '!src/views/*.vue',
    '!src/router/*.ts'
  ],
  transformIgnorePatterns: ["/node_modules/(?!echarts|zrender).+\.js$"]
  //transformIgnorePatterns: ['<rootDir>/node_modules/']
}