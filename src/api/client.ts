import { api } from "./axiosInstance";


// ответ от бэкенд-опенапи
export interface ClientProfile {
  id: number;
  client_code: string;
  name: string;
  phone: string | null;
  telegram_id: number | null;
  level: {
    id: number;
    name: string;
    cashback_percentage: number; // в сотых долях (200 = 2%)
  };
  bonus_balance: number; // в тыйынах (100т = 1с)
  total_debt: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}


// запрос на получение профиля
export const getMyProfile = async (): Promise<ClientProfile> => {
  const response = await api.get('/clients/me');
  return response.data;
};


// запрос на авторизацию через тг
export const loginWithTelegram = async (initData: string) => {
  const response = await api.post('/auth/telegram', { init_data: initData });
  return response.data;
}