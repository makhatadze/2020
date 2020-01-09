const http = require('http');

const todos = [
  {
    id: 1,
    text: 'DAta One'
  },
  {
    id: 3,
    text: 'Data Two'
  },
  {
    id: 2,
    text: 'Data Tree'
  }
];
const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      let status = 404;

      const response = {
        success: false,
        data: null
      };

      if (method === 'GET' && url === '/todos') {
        status = 200;
        response.data = todos;
      }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js'
      });
      console.log(body);
    });

  // we can return normal status code and data! also
  res.end(JSON.stringify(response));
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
