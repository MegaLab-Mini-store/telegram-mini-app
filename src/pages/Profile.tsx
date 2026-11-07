import { useState } from "react"
import { Loader2 } from "lucide-react"
import axios from "axios";
// import { api } from "../api/axiosInstance";


export default function Profile() {
  const [clientCode, setClientCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);


  const handleLinkCard = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!clientCode.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      // раскомментировать с импортом при готовности бэкенда
      // await api.post('/clients/me/link', { client_code: clientCode });

      // заглушка (имитация запроса) - убрать при бэкенде
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({ text: 'Карта успешно привязана!', type: 'success' });
      setClientCode('');
    } catch (error: unknown) {
      if(axios.isAxiosError(error)) {
        if(error.response?.status === 409) setMessage({ text: 'Эта карта уже привязана к другому аккаунту.', type: 'error' });
        else if(error.response?.status === 404) setMessage({ text: 'Карта с таким кодом не найдена.', type: 'error' });
        else setMessage({ text: 'Ошибка сервера. Попробуйте позже.', type: 'error' });
      } else {
        setMessage({ text: 'Произошла непредвиденная ошибка.', type: 'error' });
        console.error('Неизвестная ошибка:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-5 flex flex-col h-full bg-[#141A22]">
      <header className="mb-6 mt-2">
        <h1 className="text-3xl font-bold">Привязка карты</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="bg-linear-to-br from-[#232f44] to-[#1a2233] rounded-2xl p-5 border border-[#3b4c6b]">
          <p className="text-gray-300 text-sm leading-relaxed">
            Если вас еще нет в базе, или вы хотите привязать свою старую карту лояльности.
          </p>
        </div>

        <form onSubmit={handleLinkCard} className="flex flex-col gap-4">
          <div className="bg-linear-to-br from-[#232f44] to-[#1a2233] rounded-2xl p-5 border border-[#3b4c6b]">
            <label htmlFor="clientCode" className="block text-gray-300 text-sm mb-3">
              Cliend ID
            </label>

            <input
              id="clientCode"
              name="client_id_field" // защита от автозаполнения
              type="text"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              placeholder="Введите код Cliend ID"
              className="w-full bg-[#1C2533] text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none border border-[#3b4c6b] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] transition-all"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>


          {message && (
            <div className={`p-3 rounded-xl text-sm text-center ${
              message.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-reg-900/30 text-red-400'
            }`}>
              {message.text}
            </div>
          )}


          <button
            type="submit"
            disabled={isLoading || !clientCode.trim()}
            className="w-full bg-[#2AABEE] hover:bg-[#2393d1] text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(42,171,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-15"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Привязать карту'}
          </button>
        </form>

      </div>
    </div>
  );
}