import { useEffect, useState } from "react";
import { loginWithTelegram } from "../api/client";


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const authenticate = async () => {
      try {
        let token = null;


        // попытка получить токен из тг cloudstorage
        if(window.Telegram?.WebApp?.CloudStorage) {
          try {
            token = await window.Telegram.WebApp.CloudStorage.getItem('access_token');
          } catch(e) {
            console.warn('CloudStorage недоступен в текущей версии или браузере', e);
          }
        }


        // если в cloudstorage пусто, проверяем localstorage (для разработки в браузере)
        if(!token) token = localStorage.getItem('access_token');

        // если есть токен, то входим (авторизован)
        if(token) {
          setIsAuthenticated(true);

          return;
        }


        // при отсутствии токена - попытка авторизации
        const initData = window.Telegram?.WebApp?.initData;

        // пропуск авторизации, если мы в браузере (initData пустой) при разработке
        if(!initData) {
          console.warn('Нет initData. Мы не в Telegram [Тестовый режим]');
          setIsAuthenticated(true);

          return;
        }


        // запрос к бэкенду (сюда попадаем только в реальном тг)
        const data = await loginWithTelegram(initData);

        // сохраняем токен в тг cloudstorage
        if(window.Telegram?.WebApp?.CloudStorage) {
          try {
            await window.Telegram.WebApp.CloudStorage.setItem('access_token', data.access_token);
          } catch {
            localStorage.setItem('access_token', data.access_token);
          }
        } else localStorage.setItem('access_token', data.access_token);

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        // даже если бэкенд недоступен, пускаем в ПО для тестирования
        setIsAuthenticated(true);
      } finally {
        // выполнится всегда (даже при ошибке) и лоадер исчезнет
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  return { isAuthenticated, isLoading };
}