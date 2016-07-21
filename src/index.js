/**
 * Creator: yeliex
 * Project: es5check
 * Description:
 */

const app = require('./../package.json');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const stripJsonComments = require('strip-json-comments');
const check = require('../lib/check');

const start = new Date();

let onProcess = true;

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

const list = [];

// 获取当前目录下所有文件
const getDir = (p) => {
  fs.readdirSync(p).forEach((file) => {
    const n = path.join(p, file);
    if (fs.statSync(n).isDirectory()) {
      getDir(n)
    } else {
      list.push(n);
    }
  });
};

getDir(process.cwd());

let i = 0;

// 验证文件
const checkFile = () => {
  const p = list[i];
  i++;

  const finish = ()=> {
    if (i < list.length) {
      checkFile();
    }
    else {
      onProcess = false;
    }
  };
  // 判断文件是否需要忽略
  if (config.ignore.some((rule) => p.match(new RegExp(rule, 'g')))) {
    finish();
  } else {
    console.log(`\n${'\033[4m'}${p}${'\033[0m'}\n`);
    if (p.match(/\.js.?$/)) {
      // 是js?个文件
      countFile++;
      let rl = readline.createInterface({
        input: fs.createReadStream(p)
      });

      let num = 0;
      let currentErr = 0;

      rl.on('line', (line)=> {
          num++;

          rl.pause();
          const lineErr = check(line, num);
          countErr += lineErr;

          rl.resume();
        }
      );

      rl.on('close', ()=> {

        if(currentErr === 0){
          console.log(`${'\033[1;32m'}All Checked${'\033[0m'}`)
        }

        rl = null;
        finish();
      });
    } else {
      console.log(`Type not match: ${path.extname(p)}`);
      finish();
    }
  }
};

checkFile();

setInterval(()=> {
  if (!onProcess) {
    const take = new Date(new Date() - start).getSeconds();
    console.log(`\n\nProcess Finished\ntake ${take} second${take > 1 ? 's' : ''} \nFind ${countErr} error${countErr > 1 ? 's' : ''} in ${countFile} file${countFile > 1 ? 's' : ''}`)
    process.exit(0);
  }
}, 1000);