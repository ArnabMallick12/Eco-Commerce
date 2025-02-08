import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    material: '',
    weight: '',
    sizeFactor: '',
    price: '',
    image: null
  });

  const materials = [
    "Wood", "Metal", "Plastic", "Glass", "Ceramic", "Fabric", "Stone", "Leather",
    "Bamboo", "Concrete", "Acrylic", "Resin", "Marble", "Granite", "Rattan", "Jute",
    "Paper", "Cork", "Foam", "Rubber", "Carbon Fiber", "Fiberglass", "Polycarbonate",
    "Stainless Steel", "Brass", "Copper", "Aluminum", "Iron", "Silver", "Gold"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              <option value="furniture">Furniture</option>
              <option value="lighting">Lighting</option>
              <option value="wallArt">Wall Art</option>
              <option value="rugs">Rugs</option>
              <option value="curtains">Curtains</option>
              <option value="tableware">Tableware</option>
              <option value="bedding">Bedding</option>
              <option value="plants">Plants</option>
              <option value="storage">Storage</option>
              <option value="clocks">Clocks</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material
            </label>
            <select
              name="material"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Material</option>
              {materials.map((material, index) => (
                <option key={index} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              step="0.01"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size Factor
            </label>
            <input
              type="number"
              name="sizeFactor"
              step="0.1"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
