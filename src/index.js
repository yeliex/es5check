#!/usr/bin/env node

const app = require('./../package.json');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const stripJsonComments = require('strip-json-comments');

const start = new Date();

let onProcess = true;

// 获取配置文件
const config = (()=> {
  const loadJson = (file) => JSON.parse(stripJsonComments(fs.readFileSync(file).toString()));

  const defaultConfigPath = path.join(process.cwd(), 'es5check.config.js');

  const defauleConfig = require('../es5check.config');

  if (fs.existsSync(defaultConfigPath)) {
    const userConfig = require(defaultConfigPath);
    defauleConfig.rules = Object.assign({},defauleConfig.rules,userConfig.rules);
    defauleConfig.ignore = defauleConfig.ignore.concat(userConfig.ignore);
  }

  return defauleConfig;
})();
const check = require('../lib/check')(config.rules);

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
    if (p.match(/\.js.?|html$/)) {
      // 是js?个文件
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
          currentErr += lineErr;

          rl.resume();
        }
      );

      rl.on('close', ()=> {

        if (currentErr === 0) {
          console.log(`${'\033[1;32m'}All Checked${'\033[0m'}`)
        } else {
          countFile++;
        }

        rl = null;
        finish();
      });
    } else {
      console.log(`Type not support: ${path.extname(p)} \nAdd PR to ${'\033[4m'}https://github.com/yeliex/es5check${'\033[0m'} is welcome`);
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
