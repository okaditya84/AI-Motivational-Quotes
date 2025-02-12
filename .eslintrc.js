module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:react-hooks/recommended"
  ],
  plugins: [
    "react-hooks"
  ],
  rules: {
    "react-hooks/exhaustive-deps": "warn"
  }
}; 