Git=require('node-git-server');
join=require('path').join;
fs = require('fs');
path = require('path');

pattern = /git/;

const port =
  !process.env.PORT || isNaN(process.env.PORT)
    ? 7005
    : parseInt(process.env.PORT);

const repopath = join(__dirname, './repos');
console.log(repopath)
const repos = new Git(repopath, {
  autoCreate: true,
});

function processRepos(push) {
    folders = fs.readdirSync(repopath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && pattern.test(dirent.name))
    .map(dirent => dirent.name);
    push.log(folders);
}

repos.on('push', async (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`);
  push.log();
  push.log('Hey!');
  push.log('Checkout these other repos:');
  processRepos(push)  
  push.log();
  push.accept();
});

repos.on('fetch', (fetch) => {
  console.log(`fetch ${fetch.commit}`);
  fetch.accept();
});

console.log("----")

repos.listen(port, () => {
    console.log("node-git-server running at http://localhost:7005");
});
