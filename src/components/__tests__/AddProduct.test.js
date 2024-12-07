import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProduct from '../AddProduct';

describe('AddProduct Component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders the barcode input', () => {
    render(<AddProduct />);
    expect(screen.getByPlaceholderText('Scan barcode')).toBeInTheDocument();
  });

  it('handles manual barcode input', () => {
    render(<AddProduct />);
    const input = screen.getByPlaceholderText('Scan barcode');
    fireEvent.change(input, { target: { value: '194346264162' } });
    expect(input.value).toBe('194346264162');
  });

  it('handles barcode lookup on enter', async () => {
    const mockProductData = {
      items: [{
        title: 'Test Product',
        description: 'Test Description',
        brand: 'Test Brand',
        category: 'Test Category',
        upc: '194346264162',
        lowest_recorded_price: 9.99
      }]
    };

    fetch.mockResponseOnce(JSON.stringify(mockProductData));

    render(<AddProduct />);
    const input = screen.getByPlaceholderText('Scan barcode');
    
    fireEvent.change(input, { target: { value: '194346264162' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    });
  });

  it('shows error for failed API call', async () => {
    const mockError = new Error('API Error');
    fetch.mockRejectOnce(mockError);

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<AddProduct />);
    const input = screen.getByPlaceholderText('Scan barcode');
    
    fireEvent.change(input, { target: { value: '194346264162' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });
});