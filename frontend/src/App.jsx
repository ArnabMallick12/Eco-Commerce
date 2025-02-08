import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import { Login } from './pages/Login';
import CategoryPage from './pages/CategoryPage';
import { Cart } from './pages/Cart';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import  AddProduct  from './components/AddProduct';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;