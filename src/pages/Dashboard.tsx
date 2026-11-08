import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';
// import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';


export default function Dashboard() {
  const { user } = useTelegram();
  const { isLoading: isAuthLoading } = useAuth(); // ждем окончания авторизации

  // запрос данных профиля (баланс, код клиента, ...)
  // как появится бэкенд - раскомментировать с импортом и убрать тестовые данные
  // const { data: profile, isLoading: isProfileLoading, isError, refetch } = useProfile();
  const profile = {
    client_code: 'CL-12345',
    bonus_balance: 125000, // 1250 сомов
    level: { cashback_percentage: 200 } // 2%
  };
  const isProfileLoading = false;
  const isError = false;
  const refetch = () => {};



  // обработка состояний загрузки страницы
  if(isAuthLoading || isProfileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className='w-10 h-10 text-[#2AABEE] animate-spin' />
      </div>
    );
  }

  if(isError || !profile) {
    return (
      <div className="flex flex-col h-full items-center p-5 text-center">
        <p className='text-red-400 mb-4'>Не удалось загрузить данные профиля.</p>
        <p className='text-gray-400 mb-6'>Убедитесь, что бэкенд запущен и доступен.</p>

        <button onClick={() => refetch()} className='bg-[#2AABEE] px-6 py-2 rounded-xl font-medium'>
          Попробовать снова
        </button>
      </div>
    );
  }

  
  // данные для отображения
  const displayName = user?.first_name || 'Гость';
  const avatarUrl = user?.photo_url || 'https://i.pravatar.cc/150?img=11';
  const bonusBalance = (profile.bonus_balance / 100).toLocaleString('ru-RU'); // бэкенд присылает в тыйынах
  const cashbackLevel = profile.level.cashback_percentage / 100; // бэкенд присылает в сотых (200 = 2%)
  const clientCode = profile.client_code; // код для qr


  return (
    <div className="p-5 flex flex-col min-h-full">
      <header className='flex justify-between items-center mb-6 mt-2'>
        <h1 className='text-2xl font-bold leading-tight'>
          Привет, <br />{displayName}!
        </h1>

        <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden border-2 border-[#2AABEE]">
          {/* заглушка аватарки */}
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </header>


      <div className="bg-linear-to-br from-[#2A394A] to-[#17212B] border border-[#2A394A] rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden">
        <h2 className='text-3xl font-bold mb-1 z-10 relative'>{bonusBalance} бонусов</h2>
        <p className='text-gray-400 text-sm z-10 relative'>Ваш уровень: {cashbackLevel}% кэшбэка</p>

        {/* декоративное свечение справа бонуски */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2AABEE] opacity-20 rounded-full blur-2xl"></div>
      </div>


      <div className="flex flex-col items-center flex-1 justify-center relative py-6">
        {/* декоративное свечение за кодом */}
        <div className="absolute w-60 h-60 bg-[#2AABEE] opacity-20 rounded-full blur-2xl"></div>

        <div className="bg-white p-4 rounded-3xl shadow-xl relative z-10">
          <QRCodeSVG
            value={clientCode}
            size={220}
            level='H'
          />
        </div>

        <p className='text-gray-400 text-sm mt-6 z-10 relative'>Покажите этот код на кассе</p>
      </div>


      <button className='mt-6 w-full bg-[#242F3D] hover:bg-[#2A394A] transition-colors rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-medium'>
        <RefreshCw size={18} />
        Обновить данные
      </button>
    </div>
  );
}