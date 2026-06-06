const { Git } = require('node-git-server');
const repos = new Git('./repos', { autoCreate: true });
repos.on('push', (push) => { console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`); push.accept() });
repos.on('fetch', (fetch) => {console.log(`fetch ${fetch.commit}`);fetch.accept();});
repos.listen(7005, () => console.log('Git server running on 7005'));