import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock fetch globally
global.fetch = jest.fn();

// Setup MSW server
export const server = setupServer(
  rest.post('https://api.upcitemdb.com/prod/trial/lookup', (req, res, ctx) => {
    return res(
      ctx.json({
        items: [
          {
            title: 'Test Product',
            description: 'Test Description',
            brand: 'Test Brand',
            category: 'Test Category',
            upc: req.body.upc,
            lowest_recorded_price: 9.99
          }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());