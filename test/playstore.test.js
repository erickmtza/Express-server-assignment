const app = require('../playstoreServer');

const expect = require('chai').expect;
const request = require('supertest');

describe('GET /app', () => {
    it('should return an array of books', () => {
      return request(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array')

            const book = res.body[0];
            expect(book).to.include.all.keys('App', 'Rating', 'Genres');
        })
    })

    it('should be 400 if sort is incorrect', () => {
        return request(app)
          .get('/apps')
          .query({sort: 'MISTAKE'})
          .expect(400, 'Sort must be one of Rating or App');
    });

    it('should sort by Rating', () => {
        return request(app)
          .get('/apps')
          .query({sort: 'Rating'})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            while(sorted && i < res.body.length - 1) {
              sorted = sorted && res.body[i].title < res.body[i + 1].title;
              i++;
            }
            expect(sorted).to.be.true;
          });
    });
});