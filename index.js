const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const open = require('open');
const webpack = require('webpack');
const config = require('./webpack.config');
const { NODE_ENV: nodeEnv } = process.env;
const comsLibFile = path.join(process.cwd(), 'src');
const comsMapFile = path.join(__dirname, 'comsMap.js');
const comsMapStyleFile = path.join(__dirname, 'index.scss');
const compiler = webpack(config);
const http = require('http');
const configFile = 'focus.d.json';

require('colors');

let APPPORT = 9000;

const configObj = (() => {
  const configFileAbPath = path.join(process.cwd(), configFile);
  if (fs.existsSync(configFileAbPath)) {
    const fileString = fs.readFileSync(configFileAbPath).toString();
    if (fileString && fileString.trim()) return JSON.parse(fileString);
  };
  return void 0;
})();

app.use(express.static(path.join(__dirname, 'dist')));

// detect there is src folder
const detectSrcFolder = () => {
  if (!fs.existsSync(comsLibFile)) {
    console.log('there is no src folder in your components folder,program will be terminated'.red);
    process.exit();
  }
};

detectSrcFolder();

// help commander
const showHelpCommander = () => {
  const params = process.argv;
  if (params[2] === '--help') {
    process.stdout.write(`
      focusD : start your components dev server
      focusD --help : show help
      focusD component folder name : only start the input component eg:focusD button;
    `.green);
    process.exit();
  };
};

showHelpCommander();



// get comsMap
const matchComsMap = () => {
  let comsImportString = '';
  let comsStyleImportString = '';
  let comsMap = '';
  if (fs.existsSync(comsMapFile)) fs.unlinkSync(comsMapFile);
  if (fs.existsSync(comsMapStyleFile)) fs.unlinkSync(comsMapStyleFile);
  const params = process.argv;
  let files = fs.readdirSync(comsLibFile, {
    encoding: 'utf8',
    withFileTypes: true,
  });
  if (params[2]) {
    if (files.every((file) => {
      return file.name !== params[2];
    })) {
      console.log(`there is no component ${params[2]},program will be terminated!`.red);
      process.exit();
    };
    files = files.filter((file) => file.name === params[2]);
  };
  files.forEach((el) => {
    let isMockDataExit = false;
    let extName = 'js';
    let styleExtName = 'scss';

    // style file
    if (fs.existsSync(path.join(comsLibFile, el.name, 'index.css'))) styleExtName = 'css';
    if (fs.existsSync(path.join(comsLibFile, el.name, `index.${styleExtName}`)))
      comsStyleImportString += `@import '${path.join(comsLibFile, el.name, `index.${styleExtName}`)}';\n`;


    // file ext name
    if (fs.existsSync(path.join(comsLibFile, el.name, 'index.jsx'))) extName = 'jsx';

    if (fs.existsSync(path.join(comsLibFile, el.name, `index.${extName}`)))
      comsImportString += `import ${el.name} from '${path.join(comsLibFile, el.name, `index.${extName}`)}';\n`;

    // if there is mock js
    if (fs.existsSync(path.join(comsLibFile, el.name, 'mock.js'))) {
      isMockDataExit = true;
      comsImportString += `import ${el.name}Mock from '${path.join(comsLibFile, el.name, 'mock.js')}';\n`;
    };

    // if mock js exit
    if (isMockDataExit) {
      comsMap += `    ${el.name}:{com:${el.name},mockData:${el.name}Mock},\n`;
    } else {
      comsMap += `    ${el.name}:{com:${el.name}},\n`;
    }


  });
  fs.writeFileSync(comsMapFile, comsImportString + `\n\nexport default {\n${comsMap}}`);
  if (configObj && configObj.globalCss) {
    if (typeof configObj.globalCss === 'string') {
      comsStyleImportString = comsStyleImportString + `@import '~${configObj.globalCss}';\n`;
    };
    if (Object.prototype.toString.call(configObj.globalCss) === '[object Array]') {
      configObj.globalCss.forEach((el) => {
        comsStyleImportString += `@import "~${el}";\n`;
      })
    };
  };
  fs.writeFileSync(comsMapStyleFile, comsStyleImportString);
};

// subscribe to cwd lib
const subscribeLib = () => {
  fs.watch(comsLibFile, {
    recursive: true,
  }, (eventType, fileName) => {
    matchComsMap();
  })
};

const devRun = async () => {
  if (nodeEnv === 'development') {
    matchComsMap();
    subscribeLib();
    let isOpen = false;
    setTimeout(() => {
      const getProgress = (percentage, msg) => {
        const intPercentage = parseInt(percentage * 10);
        const progressStr = Array.apply(null, { length: intPercentage }).map((el) => {
          return '|';
        });
        if (intPercentage === 10) msg = 'finish building';
        if (intPercentage === 10) return `${msg} 【${progressStr.join('')}】 ${intPercentage * 10}%\n`;
        return `${msg} 【${progressStr.join('')}】 ${intPercentage * 10}%`;
      };

      new ProgressPlugin((percentage, msg) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        let files = fs.readdirSync(comsLibFile, {
          encoding: 'utf8',
          withFileTypes: true,
        });
        const params = process.argv;

        if (parseInt(percentage * 10) === 10 && isOpen === false) {
          isOpen = true;
          setTimeout(() => {
            let openUrl = `http://localhost:${APPPORT}`;
            if (params[2] && files.some((file) => file.name === params[2])) openUrl = openUrl + `/#/${params[2]}`;
            open(openUrl, { app: 'google chrome' });
          }, 500);
        };
        process.stdout.write(`${getProgress(percentage, msg)}`);
      }).apply(compiler);

      // 启用自动打包功能
      // 可以使用webpack -w
      app.use(WebpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true },
        lazy: false,
        logLevel: 'error',
        watchOptions: {
          aggregateTimeout: 300,
          poll: true,
          watchContentBase: true,
        },
      }));
      // 启用热更新
      app.use(WebpackHotMiddleware(compiler));
    }, 1000);
  }
};

devRun();

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'page/index.htm'), (err, result) => {
    if (err) return res.end('some fatal error,please try restart your dev server');
    const htmlStream = result.toString();
    const cwdChunks = process.cwd().split('/');
    res.header({
      'Content-Type': 'text/html',
    });
    res.end(htmlStream.replace(/\$page_name/, cwdChunks[cwdChunks.length - 1]));
  });
});

/***
 * fetch readme
 * **/
app.get('/fetchReadme', (req, res) => {
  const { componentName } = req.query;
  const dataModel = {};
  if (componentName) {
    res.header({
      'Content-Type': 'application/json',
    });
    let readmeFile = path.join(comsLibFile, componentName, 'readme.md');
    if (fs.existsSync(path.join(comsLibFile, componentName, 'README.md')))
      readmeFile = path.join(comsLibFile, componentName, 'README.md');
    if (fs.existsSync(readmeFile)) {
      dataModel.data = fs.readFileSync(readmeFile).toString();
      dataModel.success = true;
    }
  } else {
    dataModel.data = '';
    dataModel.success = false;
  };
  res.status(200, 'ok');
  res.send(JSON.stringify(dataModel));
});

app.listen = function () {
  const server = http.createServer(this);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`port ${APPPORT} is used,program will assign another port ${APPPORT + 1} for your dev server`.yellow);
      APPPORT += 1;
      this.listen.call(this, APPPORT, arguments[1]);
    };
  });
  return server.listen.apply(server, arguments);
};

app.listen(APPPORT, (err) => {
  setTimeout(() => {
    console.log('components dev server start,good luck!'.green);
  }, 5000);
});

process.on('SIGINT', function () {
  if (fs.existsSync(comsLibFile)) fs.unlinkSync(comsMapFile);
  if (fs.existsSync(comsMapStyleFile)) fs.unlinkSync(comsMapStyleFile);
  process.exit();
});


