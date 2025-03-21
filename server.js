const http = require('http');
const fs = require('node:fs');

const port = 8080;

fs.writeFile('user.txt', 'Hello World!', (err) => {
  if (err) throw err;
  console.log('File is created successfully.');
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    fs.readFile('user.txt', 'utf8', (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      fs.writeFile('user.txt', body + "/n", (err) => {
        if (err) throw err;
        res.end('File is updated successfully.');
      });
    });
  }
});

server.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
});