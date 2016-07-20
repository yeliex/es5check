/**
 * Creator: yeliex
 * Project: es5check
 * Description:
 */

const app = require('./package.json');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const co = require('co');
const stripJsonComments = require('strip-json-comments');

// 获取配置文件
const config = (()=> {
  const loadJson = (file) => JSON.parse(stripJsonComments(fs.readFileSync(file).toString()));

  let defaultConfig = path.join(process.cwd(), '.es5checkrc');
  if (fs.existsSync(defaultConfig)) {
    return loadJson(defaultConfig);
  } else {
    return loadJson(path.join(__dirname, '.es5checkrc'));
  }
})();

config.ignore = (config.ignore || []).concat(['.git', '.idea', '/node_modules/', '.es5checkrc']);

let countErr = 0;
let countFile = 0;

console.log(`${app.name} v${app.version} Powered by yeliex \n${app.description}`);

// 获取当前目录下所有文件
const getDir = (p) => {
  const list = [];

  fs.readdirSync(p).forEach((file) => {
    const n = path.join(p, file);
    if (fs.statSync(n).isDirectory()) {
      getDir(n)
    } else {
      list.push(n);
    }
  });

  return list;
};


const list = getDir(process.cwd());

let i = 0;

// 验证文件
const checkFile = () => {
  const p = list[i];
  i++;
  // 判断文件是否需要忽略
  if (config.ignore.some((rule) => p.match(new RegExp(rule, 'g')))) {
    return;
  }
  console.log(`\n${'\033[4m'}${p}${'\033[0m'}\n`);
  if (p.match(/\.js.?$/)) {
    // 是js?个文件
    countFile++;
    let rl = readline.createInterface({
      input: fs.createReadStream(p)
    });
    rl.on('line', (line)=> {
      rl.pause();
      console.log(2)
      rl.resume();
    });

    rl.on('close', ()=> {
      checkFile();
    });
  } else {
    console.log(`Type not match: ${path.extname(p)}`);
  }
};

co(function *() {
  new Promise(function (res, rej) {
    checkFile();
  })
});