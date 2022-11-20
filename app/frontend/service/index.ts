const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const service = {
  post: {
    async login(username: string, password: string) {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, password }),
      });

      return response;
    },
    async users(username: string, password: string) {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, password }),
      });

      return response;
    },
    async transactions(authorization: string, username: string, value: number) {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { ...headers, authorization },
        body: JSON.stringify({ username, value }),
      });

      return response;
    },
  },
  get: {
    async balance(authorization: string) {
      const response = await fetch(`${API_URL}/users/balance`, {
        method: 'GET',
        headers: { ...headers, authorization },
      });

      return response;
    },
    async transactions(
      authorization: string,
      type: string,
      from: string,
      to: string,
    ) {
      const response = await fetch(
        `${API_URL}/transactions?from=${from}&to=${to}&type=${type}`,
        {
          method: 'GET',
          headers: { ...headers, authorization },
        },
      );

      return response;
    },
  },
};

export default service;
