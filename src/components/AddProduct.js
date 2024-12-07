import React, { useState } from 'react';
import { Barcode } from 'lucide-react';

const AddProduct = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    condition: 'New',
    price: '',
    brand: '',
    category: '',
    upc: ''
  });

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setDebugMessage('Enter key pressed - Starting lookup');
      if (scannedCode) {
        await lookupBarcode(scannedCode);
      }
    }
  };

  const lookupBarcode = async (code) => {
    setLoading(true);
    setDebugMessage(`Looking up UPC: ${code}`);

    try {
      const response = await fetch('https://api.upcitemdb.com/prod/trial/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          upc: code
        })
      });

      setDebugMessage(`Got response with status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDebugMessage(`Received data: ${JSON.stringify(data)}`);

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        setProductData({
          title: item.title || '',
          description: item.description || '',
          brand: item.brand || '',
          category: item.category || '',
          upc: code,
          price: item.lowest_recorded_price || '',
          condition: 'New'
        });
        setDebugMessage(`Found product: ${item.title}`);
        setScannedCode('');
      } else {
        setDebugMessage('No product found for this UPC');
        alert('Product not found in database. Please enter details manually.');
      }
    } catch (error) {
      setDebugMessage(`Error: ${error.message}`);
      alert(`Error looking up product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Enter Product</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scan barcode"
                className="flex-1 px-3 py-2 border rounded-lg"
                autoFocus
              />
              <button
                onClick={() => scannedCode && lookupBarcode(scannedCode)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                <Barcode size={20} />
                {loading ? 'Looking up...' : 'Lookup'}
              </button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
              <p><strong>Status:</strong> {loading ? 'Loading...' : 'Ready'}</p>
              <p><strong>Current Code:</strong> {scannedCode}</p>
              <p><strong>Last Action:</strong> {debugMessage}</p>
              <p><strong>Product Found:</strong> {productData.title ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {!loading && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={productData.title}
                  onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={productData.condition}
                  onChange={(e) => setProductData({ ...productData, condition: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="New">New</option>
                  <option value="Open Box">Open Box</option>
                  <option value="Used">Used</option>
                  <option value="Parts">Parts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  rows={4}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {productData.brand && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Brand:</strong> {productData.brand}</p>
                    <p><strong>Category:</strong> {productData.category}</p>
                    <p><strong>UPC:</strong> {productData.upc}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                  Save as Draft
                </button>
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Proceed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;