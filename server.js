const http = require('node:http');
const fs = require('node:fs');

const port = 8080;
const filePath = 'array.json';

if (!fs.existsSync(filePath)) {
  const data = [];
  for (let i = 1; i <= 20; i++) {
    data.push({ id: i, name: `User_${i}`, age: 20 + i });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Файл з даними створено');
}

const readFileData = () => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeFileData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Помилка читання файлу');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newObj = JSON.parse(body);
        let data = readFileData();

        newObj.id = data.length + 1;
        data.push(newObj);

        writeFileData(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newObj));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Помилка обробки JSON');
      }
    });
  } else if (req.method === 'PUT') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newObj = JSON.parse(body);
        let data = readFileData();

        const index = data.findIndex((item) => item.id === newObj.id);
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Помилка: користувача не знайдено');
        } else {
          data[index] = newObj;
          writeFileData(data);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newObj));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Помилка обробки JSON');
      }
    });

  } else if (req.method === 'PATCH') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newObj = JSON.parse(body);
        let data = readFileData();

        const index = data.findIndex((item) => item.id === newObj.id);
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Помилка: користувача не знайдено');
        } else {
          data[index] = { ...data[index], ...newObj };
          writeFileData(data);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data[index]));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Помилка обробки JSON');
      }
    });

  } else if (req.method === 'DELETE') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const delObj = JSON.parse(body);
        let data = readFileData();

        const index = data.findIndex((item) => item.id === delObj.id);
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Помилка: користувача не знайдено');
        } else {
          data = data.filter((item) => item.id !== delObj.id);
          writeFileData(data);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(delObj));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Помилка обробки JSON');
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Метод не підтримується');
  }
});

server.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});