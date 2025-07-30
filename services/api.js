// API base URL - Dynamic configuration for different environments
const getApiUrl = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }
    // For production (render.com or any other domain), use the current origin
    return `${window.location.origin}/api`;
};

const API_URL = getApiUrl();

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Products API
export const productsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchAPI(`/products?${params}`);
    },
    getById: (id) => fetchAPI(`/products/${id}`),
    // Admin functions
    getAllForAdmin: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchAPI(`/products/admin/all?${params}`);
    },
    create: (productData) => fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }),
    update: (id, productData) => fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }),
    delete: (id) => fetchAPI(`/products/${id}`, {
        method: 'DELETE'
    })
};

// Categories API
export const categoriesAPI = {
    getAll: () => fetchAPI('/categories'),
    getById: (id) => fetchAPI(`/categories/${id}`),
    // Admin functions
    getAllForAdmin: () => fetchAPI('/categories/admin/all'),
    create: (categoryData) => fetchAPI('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    }),
    update: (id, categoryData) => fetchAPI(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    }),
    delete: (id) => fetchAPI(`/categories/${id}`, {
        method: 'DELETE'
    })
};

// Users API
export const usersAPI = {
    register: (userData) => fetchAPI('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    login: (credentials) => fetchAPI('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    getProfile: () => fetchAPI('/users/profile'),
    
    updateProfile: (data) => fetchAPI('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    updatePassword: (passwords) => fetchAPI('/users/password', {
        method: 'PUT',
        body: JSON.stringify(passwords)
    })
};

// Orders API
export const ordersAPI = {
    create: (orderData) => fetchAPI('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    
    getAll: () => fetchAPI('/orders'),
    
    getById: (id) => fetchAPI(`/orders/${id}`),
    
    updateStatus: (id, status) => fetchAPI(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    })
};

// Auth helper functions
export const auth = {
    isAuthenticated: () => !!localStorage.getItem('token'),
    
    getToken: () => localStorage.getItem('token'),
    
    setToken: (token) => localStorage.setItem('token', token),
    
    removeToken: () => localStorage.removeItem('token'),
    
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    
    removeUser: () => localStorage.removeItem('user'),
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
