const { server } = require('../src/server');
const { sequelize } = require('../src/models/index');

const supertest = require('supertest');

const request = supertest(server);

beforeEach(() => sequelize.sync());
afterEach(() => sequelize.drop());

describe('POST /signup', () => {
  it('creates a new user', async () => {
    const res = await request
      .post('/signup')
      .send({ username: 'Ezgi', password: 'loki1' });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('username', 'Ezgi');
  });
});

describe('POST /signin', () => {
  it('logs in existing user', async () => {
    await request.post('/signup').send({ username: 'Ezgi', password: 'loki1' });
    const res = await request.post('/signin').auth('Ezgi', 'loki1');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('username', 'Ezgi');
  });
});
