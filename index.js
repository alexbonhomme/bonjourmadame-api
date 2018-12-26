const express = require('express');
const request = require('request');
const cors = require('cors')
const { JSDOM } = require('jsdom');
const BM_URL = 'http://www.bonjourmadame.fr/';

/**
 * Get Bonjour Madame of the day picture URL
 */
function getMadamePictureUrl() {
  return JSDOM.fromURL(BM_URL).then(({ window }) => {
    const { document } = window;

    const rawUrl = document.querySelector('.post-content').children[0].children[0].src;

    if (!rawUrl) {
      throw new Error('Madame est introuvable :-(')
    }

    const url = rawUrl.split('?')[0];

    return url;
  });
}

/**
 * Simple Error handler
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function errorHandler (err, req, res, next) {
  console.error(err)

  res.status(500);
  res.setHeader('Content-Type', 'application/json');
  res.send({
    error: 'Okay, Houston, we\'ve had a problem here'
  });
}

const app = express()

app.use(cors())

// direct madame picture
app.get('/', function (_, res, next) {
  getMadamePictureUrl()
    // actually serve image file
    .then(url => request(url).pipe(res))
    .catch(error => next(error))
});

// json object with madame url
app.get('/json', function (_, res, next) {
  getMadamePictureUrl()
    .then(url => {
      const jsonContent = {
        url: url
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(jsonContent));
    })
    .catch(error => next(error))
});

// funny error handler
app.use(errorHandler);

app.listen(8888);
console.log('Ready to serve madame !')
