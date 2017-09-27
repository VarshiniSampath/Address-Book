const fs = require('fs');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

module.exports = (server) => {

  server.use(bodyParser.urlencoded( { extended: true } ));

  /**
   * Controller that routes requests based on the URL using ExpressJS.
   * Server runs on PORT 3000.
   **/

  // The root of the project is index.html, which is opened when the project is opened.
  server.get('/', (request, response) => {
    response.sendFile(path.resolve('./public/index.html'));
  });

  // Common resolve for all other kinds of URL.
  server.get('*', (request, response) => {

    const filePath = path.join('./' + request.url);
    const fileExtension = path.extname(filePath);

    console.log(request.url + " " + fileExtension);
    let contentType = 'text/html';

    if (fileExtension === '.css') {
      contentType = 'text/css';
    } else if (fileExtension === '.js') {
      contentType = 'application/javascript';
    } else if (fileExtension === '.png') {
      contentType = 'image/png';
    }

    fs.readFile(filePath, (error, content) => {
      if (!error) {
        response.writeHead(200, { 'Content-Type': "'" + contentType + ";charset=utf-8" });
        response.write(content);
        response.end();
      } else {
        console.log(error);
        response.writeHead(500);
        response.end();
      }
    });
   });
};
