const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const srcPath = path.join(cwd, 'src');
const methodSets = ['get', 'post', 'delete'];

module.exports = {
    requestMockUrl: (app) => {
        if (fs.existsSync(srcPath)) {
            const dirs = fs.readdirSync(srcPath, { withFileTypes: true, encoding: 'utf8' });
            dirs.forEach((dir) => {
                const requestDir = path.join(srcPath, dir.name, 'request');
                if (fs.existsSync(requestDir)) {
                    const requestApis = fs.readdirSync(path.join(requestDir), { withFileTypes: true, encoding: 'utf8' });
                    requestApis.forEach(({ name: api }) => {
                        const apiChunks = api.split('.');
                        let method = null;
                        if (!api.endsWith('.json')) {
                            console.error(`request file ${requestApi}.${meth}.json@${path.join(requestDir, api)} is not a regular request file`);
                            process.exit(-1);
                        }
                        if (apiChunks.length > 3 || apiChunks.length === 1) {
                            console.error(`request json file should be match ${requestApi}.${method}.json@${path.join(requestDir, api)}`);
                            process.exit(-1);
                        };
                        if (apiChunks.length === 3 || apiChunks.length === 2) {
                            if (apiChunks.length === 2) method = 'get';
                            if (apiChunks.length === 3) method = apiChunks[1];
                            if (methodSets.indexOf(method) < 0) {
                                console.error(`method ${method} is not a regular request method,please check file ${requestApi}.${method}.json@${path.join(requestDir, api)}`);
                                process.exit(-1);
                            };
                            app[method](`/${path.join(dir.name, 'request', apiChunks[0])}`, (req, res) => {
                                if (fs.existsSync(path.join(requestDir, api))) {
                                    const requestJsonStream = fs.createReadStream(path.join(requestDir, api));
                                    res.header({
                                        'Content-Type': 'application/json;charset=utf-8',
                                    });
                                    requestJsonStream.pipe(res);
                                } else {
                                    res.status(506, 'bad request json file');
                                    res.send(`no such file ${path.join(requestDir, api)}`);
                                };
                            });
                        };
                    });
                }
            })
        }
    }
}