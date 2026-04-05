const { Git } = require('node-git-server');
const repos = new Git('./repos/test1', { autoCreate: true });
repos.on('push', (push) => push.accept());
repos.listen(7005, () => console.log('Git server running on 7005'));