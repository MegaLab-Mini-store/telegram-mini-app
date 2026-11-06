import axios from "axios";


// базовый OPENAPI-URL, потом изменить на реальный
const BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// перехватчик запросов: перед каждым запросом автоматически подставляется токен
api.interceptors.request.use(async (config) => {
  let token: string | null = null;

  // проверяем, внутри тг ли
  if(window.Telegram?.WebApp?.CloudStorage) {
    try {
      // tg cloudstorage работает через Promise, поэтому используем await
      // ждем, пока тг достанет токен из своего хранилища
      token = await window.Telegram.WebApp.CloudStorage.getItem('access_token');
    } catch (error) {
      console.error('Ошибка при получении токена из Telegram CloudStorage:', error);
    }
    // фолбэк, то есть запасной вариант для браузерной разработки (не в тг)
  } else token = localStorage.getItem('access_token');

  // если токен найден, добавляем его в заголовки
  if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;

  return config;
});