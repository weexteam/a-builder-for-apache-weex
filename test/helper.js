const shell = require('shelljs');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

const createTemplateDir = function (subdir) {
  let dir = path.join(os.tmpdir(), 'e2e-test');
  if (subdir) {
    dir = path.join(dir, subdir);
  }
  if (fs.existsSync(dir)) {
    shell.rm('-rf', dir);
  }
  shell.mkdir('-p', dir);
  console.log(`mkdir ${dir}`)
  return dir;
};
module.exports ={
  createTemplateDir
}
