Git=require('node-git-server');
join=require('path').join;

const port =
  !process.env.PORT || isNaN(process.env.PORT)
    ? 7005
    : parseInt(process.env.PORT);

console.log(join(__dirname, './repos'))
const repos = new Git(join(__dirname, './repos'), {
  autoCreate: true,
});

async function processRepos(push) {
  // Waits for the full list, then iterates
  for (const repo of await repos.list()) {
    push.log(repo.name);
    // await someAsyncOp(repo); // Sequential async operation
  }
}

repos.on('push', async (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`);
  push.log();
  push.log('Hey!');
  push.log('Checkout these other repos:');
  await processRepos(push)  
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
