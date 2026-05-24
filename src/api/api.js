import axios from 'axios';
import { useState, useEffect } from 'react';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

//FARMS HOOK 
export function useFarms() {
  const [farms, setFarms]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = () => {
    api.get('/farms')
      .then(r => { setFarms(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchFarms(); }, []);

  return { farms, setFarms, loading, refetch: fetchFarms };
}

//PRODUCTS HOOK 
export function useProducts(farmId = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchProducts = () => {
    const url = farmId ? `/products?farmId=${farmId}` : '/products';
    api.get(url)
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [farmId]);

  return { products, setProducts, loading, refetch: fetchProducts };
}

//REVIEWS HOOK 
export function useReviews(farmId = null) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    const url = farmId ? `/reviews/farm/${farmId}` : '/reviews';
    api.get(url)
      .then(r => { setReviews(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [farmId]);

  return { reviews, setReviews, loading, refetch: fetchReviews };
}

export const postReview = (data) => api.post('/reviews', data);