import { useQuery } from "@tanstack/react-query";
// import { api } from "../api/axiosInstance";


interface BonusTransaction {
  id: number;
  created_at: string;
  operation_type: 'earn' | 'spend' | 'reversal_earn' | 'reversal_spend';
  amount: number;
  sale_id: number | null;
  base_amount: number | null; // сумма, от которой считали
}


const fetchBonuses = async (): Promise<BonusTransaction[]> => {
  // раскомментировать вместе с импортом при бэкенде
  // const res = await api.get('/clients/me/bonus-transactions');

  // return res.data.items;
  // удалить при бэкенде
  return [
    {
      id: 1,
      created_at: '2026-10-12T14:30:00+06:00',
      operation_type: 'earn',
      amount: 25000,
      sale_id: 101,
      base_amount: 50000, // покупка была на 500 сомов
    },
    {
      id: 2,
      created_at: '2026-10-10T18:15:00+06:00',
      operation_type: 'spend',
      amount: 10000,
      sale_id: 102,
      base_amount: 120000,
    },
    {
      id: 3,
      created_at: '2026-10-12T14:30:00+06:00',
      operation_type: 'reversal_earn', // возврат покупки, за которую начислили бонусы
      amount: 25000, 
      sale_id: 99,
      base_amount: 10000,
    }
  ];
};


export default function Bonuses() {
  const { data: bonuses, isLoading, isError } = useQuery({
    queryKey: ['bonuses'],
    queryFn: fetchBonuses,
  });


  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(' г.', ''); // убираем лишнее г. (если появится)
  };


  const formatBonus = (tyiyn: number) => {
    return (tyiyn / 100).toLocaleString('ru-RU') + ' бонусов';
  };


  const formatMoney = (tyiyn: number) => {
    return (tyiyn / 100).toLocaleString('ru-RU') + ' сомов';
  };


  if(isLoading) return <div className="text-center mt-10 text-gray-400">Загрузка...</div>
  if(isError) return <div className="text-center mt-10 text-red-400">Ошибка загрузки</div>


  return (
    <div className="p-5 flex flex-col h-full bg-[#141A22]">
      <header className="mb-5 mt-2">
        <h1 className="text-3xl font-bold">История бонусов</h1>
      </header>

      <div className="flex flex-col gap-4 overflow-y-auto pb-4">
        {bonuses?.map((tx) => {
          let title = '';
          let sign = '';
          let amountColor = '';

          // каждый статус
          switch(tx.operation_type) {
            case 'earn':
              title = 'Начисление бонусов (за покупку)';
              sign = '+';
              amountColor = 'text-[#4ADE80]';
              break;
            case 'spend':
              title = 'Списание бонусов (скидка)';
              sign = '-';
              amountColor = 'text-[#F87171]';
              break;
            case 'reversal_earn':
              title = 'Отмена начисления (возврат покупки)';
              sign = '-';
              amountColor = 'text-[#F87171]';
              break;
            case 'reversal_spend':
              title = 'Возврат списанных бонусов';
              sign = '+';
              amountColor = 'text-[#4ADE80]';
              break;
          }


          // контекст операции (покупка + номер чека, в других ситуациях просто номер чека)
          let contextText = 'Ручная корректировка';
          if(tx.base_amount) {
            contextText = `Покупка на ${formatMoney(tx.base_amount)}`;

            if(tx.sale_id) contextText += ` (Чек №${tx.sale_id})`;
          } else if(tx.sale_id) contextText = `Чек №${tx.sale_id}`;


          return (
            <div
              key={tx.id}
              className="bg-linear-to-br from-[#232f44] to-[#1a2233] rounded-2xl p-4 border border-[#3b3c5a] shadow-lg"
            >
              <div className="text-gray-400 text-sm mb-2">
                {formatDate(tx.created_at)}
              </div>

              <div className="text-gray-300 text-sm mb-1">
                {title}
              </div>

              <div className={`text-3xl font-bold mb-3 ${amountColor}`}>
                {sign} {formatBonus(tx.amount)}
              </div>

              <div className="text-gray-500 text-xs">
                Контекст: {contextText}
              </div>
            </div>
          );

        })}
      </div>
    </div>
  );
}