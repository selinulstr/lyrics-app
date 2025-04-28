const request = require('supertest');
const app = require('../server');
const axios = require('axios');

jest.mock('axios');
console.error = jest.fn(); 

describe('Lyrics API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TOKEN = 'test-token';
  });

  test('GET / returns homepage', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Home Page Working!');
  });

  test('POST /submit returns lyrics URL', async () => {
    axios.get.mockResolvedValue({
      data: {
        response: {
          hits: [{ result: { url: 'https://genius.com/test-url' } }]
        }
      }
    });

    const res = await request(app)
      .post('/submit')
      .send({ userPrompt: 'Test Song' });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe('https://genius.com/test-url');
  });

  test('POST /submit handles errors', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const res = await request(app)
      .post('/submit')
      .send({ userPrompt: 'Invalid Song' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Search failed');
    expect(console.error).toHaveBeenCalled();
  });
});