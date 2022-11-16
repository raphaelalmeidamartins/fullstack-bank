const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const service = {
  // post: {
  //   async login(email: string, password: string) {
  //     const response = await fetch(`${API_URL}/login`, {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify({ email, password }),
  //     });

  //     return response;
  //   },
  // },
};

export default service;
