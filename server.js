const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

let enqueueError = false;

server.post('/enqueue-error', (req, res) => {
  enqueueError = true;
  res.json({ status: 'Next request will return 500' });
});

server.use((req, res, next) => {
  if (Math.random() < 0.1) {
    console.log("Option 1, use randomness, 1/10 requests will give 500 response");
    res.status(500).json({ error: 'Random failure' });
    return;
  }
  if (req.query.forceError) {
    console.log("Option 2, use query parameter, /products?forceError=500 would give a 500 response");
    res.status(parseInt(req.query.forceError)).json({ error: `Forced error ${req.query.forceError}` });
    return;
  }
  if (Math.random() < 0.2) {
    console.log("Option 3, random slowness, 1/5 requests will take 5 seconds");
    setTimeout(() => {
      next();
    }, 5000);
    return;
  }
  if (enqueueError) {
    enqueueError = false;
    console.log("Option 4, error is enqueued");
    res.status(500).json({ error: "Error was enqueued" });
    return;
  }
  next();
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server running on port 3000');
});

