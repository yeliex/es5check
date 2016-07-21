/**
 * Creator: yeliex
 * Project: es5check
 * Description:
 */

const rules = require('./rules.json');

const check = (str, line) => {
  let errors = 0;
  Object.keys(rules).forEach((rule)=> {
    const reg = new RegExp(rules[rule],'g');
    if (str.match(rule)) {
      errors ++;
      console.log(`${'\033[1;31m'}Error${'\033[0m'}  ${'\033[33m'}${line}:${str.indexOf(rule)}${'\033[0m'} ${'\033[43m'}${rule}${'\033[0m'}  ${line}`)
    }
  });

  return errors;
};

module.exports = check;