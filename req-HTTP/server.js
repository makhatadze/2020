const http = require('http');

const datas = [
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
  //   res.statusCode = 404;
  //   res.setHeader('Content-Type', 'application/json');
  //   res.setHeader('X-Powered-By', 'Node.js');
  // Same thing
  res.writeHead(404, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'Node.js'
  });

  // we can return normal status code and data! also
  res.end(
    JSON.stringify({
      success: false,
      error: 'Not Found',
      data: null
    })
  );
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
