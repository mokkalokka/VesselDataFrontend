module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\.vue$': 'vue-jest',

  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts', // No need to cover bootstrap file
  ],
  //transformIgnorePatterns: ["/node_modules/(?!echarts|zrender).+\.js$"]
}