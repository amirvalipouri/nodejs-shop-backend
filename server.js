const cluster = require('cluster')
const numCpus = require('os').cpus().length;
if (cluster.isMaster) {
    for (let index = 0; index < numCpus; index++) {
        cluster.fork()
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    const App = require('./app');
    new App(4000, "mongodb://localhost:27017/backJelve");
}