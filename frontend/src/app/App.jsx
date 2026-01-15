import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Router from './router';

function App() {
  const { token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token]);

  return <Router />;
}

export default App;
