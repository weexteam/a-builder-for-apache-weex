const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');
const expect = require('chai').expect;
const compiler = require('../index');
const destName = 'destBase';
const helper = require('./helper');
const tmpDir = helper.createTemplateDir('build_test');
const project = path.join(tmpDir, destName);
const expectFileExisted = (file) => {
  const should = fs.existsSync(file);
  expect(should, `${file} should be include`).to.be.true;
}
const expectFileUnexisted = (file) => {
  const should = fs.existsSync(file);
  expect(should, `${file} should be exclude`).to.be.not.true;
}
describe('create end-to-end', function () {
  before(function () {
    shell.rm('-rf', project);
    shell.mkdir('-p', tmpDir);
  });
  after(function () {
    process.chdir(path.join(__dirname, '..')); // Needed to rm the dir on Windows.
    shell.rm('-rf', tmpDir);
  });
  describe('create project with not dependence', () => {
    it('should create a weex project successfully', (done) => {
      compiler.build('test/templates', project, {}, (err, output, jso) => {
        if (err) {
          return;
        }
        done()
      })
    }, 60000);
    it('should some files existed', () => {
      const shouldBeInclude = ['vue/index.js', 'we/test.js'];
      shouldBeInclude.forEach(file => {
        expectFileExisted(path.join(project, file));
      })
    })
  })
});
