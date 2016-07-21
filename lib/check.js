/**
 * Creator: yeliex
 * Project: es5check
 * Description:
 */

// 判断是否有外部规则

const init = (rules) => {
  return (str, line) => {
    let errors = 0;
    Object.keys(rules).forEach((rule)=> {
      const match = str.match(rules[rule]);
      if (match) {
        errors ++;
        console.log(`${'\033[1;31m'}Error${'\033[0m'}  ${'\033[33m'}${line}:${str.indexOf(match[0])}${'\033[0m'} ${'\033[43m'}${rule}${'\033[0m'}  ${str}\n`)
      }
    });

    return errors;
  };
};

module.exports = init;
