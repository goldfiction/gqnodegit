Git=require('node-git-server');
join=require('path').join;
fs = require('fs');
path = require('path');

pattern = /git/;
auth = true;

const port =
  !process.env.PORT || isNaN(process.env.PORT)
    ? 7005
    : parseInt(process.env.PORT);

const repopath = join(__dirname, './repos');
console.log(repopath)
const repos = new Git(repopath, {
  autoCreate: true,
  authenticate: ({ type, repo, user, headers }, next) => {
    console.log(type, repo, headers); // eslint-disable-line
    if (type == 'push' || type == 'fetch') {
      // Decide if this user is allowed to perform this action against this repo.
      if (auth) {
        user((username, password) => {
          if (username === 'admin' && password === '0000') {
            next();
          } else {
            next('wrong password');
          }
        });
      } else {
        next();
      }
    } else {
      // Check these credentials are correct for this user.
      next();
    }
  },
});

function processRepos() {
    return folders = fs.readdirSync(repopath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && pattern.test(dirent.name))
    .map(dirent => dirent.name);
}

repos.on('push', async (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`);
  push.log();
  push.log('Hey!');
  push.log('Checkout these other repos:');
  push.log(processRepos())
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
