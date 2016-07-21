module.exports ={
  "ignore": [
    ".git",
    ".idea",
    "node_modules",
    // "es5check"
  ],
  "rules": {
    "no-arrow-functions": /=>/g,
    'no-for-of': /for(.*)of/g,
    'no-class': /class/g,
    'no-template-string': /`/g,
    'no-spread': /\.\.\./g,
    'no-let-or-const': /let|const/g,
    'no-iterator': /\[.*\] *\(.*\)/g,
    'no-generators': /function.*\*/g,
    'no-yeild': /yield/g
  }
};