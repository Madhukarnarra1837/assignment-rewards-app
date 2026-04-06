module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // This tells Jest to ignore CSS/Style imports
    '\\.(css|less|scss|sass)$': '<rootDir>/styleMock.js',
    // If you have image imports (png, svg, jpg), add this too:
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/styleMock.js',
  },
};