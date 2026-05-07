import axios from 'axios';
axios.defaults.baseURL = ''; // Use relative paths to enable Vite proxy during development

const useAxiosInterceptor = () => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        if (!sessionStorage.getItem('hasReloaded')) {
          sessionStorage.setItem('hasReloaded', 'true'); 
          window.location.reload();
        }
        return Promise.reject(error); 
      }
      return Promise.reject(error);
    }
  );
};

export default useAxiosInterceptor;
