import { useQuery } from "@tanstack/react-query";
import { getMyProfile, type ClientProfile } from "../api/client";


// автоматический лоадер, пока данные грузятся
export function useProfile() {
  return useQuery<ClientProfile, Error> ({
    queryKey: ['profile'], // уникальный ключ для кэша
    queryFn: getMyProfile, // функция запроса из апи
    retry: 1,
    refetchOnWindowFocus: false,
  });
}