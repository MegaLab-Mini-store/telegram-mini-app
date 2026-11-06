import { useEffect, useMemo } from "react";


interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}


export function useTelegram() {
  const user: TelegramUser = useMemo(() => {
    if(window.Telegram?.WebApp?.initDataUnsafe?.user) return window.Telegram.WebApp.initDataUnsafe.user;

    // фолбэк с заглушкой для тестов в браузере
    return {
      id: 123456789,
      first_name: 'Богдан',
      photo_url: 'https://i.pravatar.cc/150?img=11'
    };
  }, []);


  useEffect(() => {
    if(window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready(); // сообщаем тг об окончании прогрузки
      window.Telegram.WebApp.expand(); // разворачиваем на весь экран
    }
  }, []);


  return { user, tg: window.Telegram?.WebApp };
}