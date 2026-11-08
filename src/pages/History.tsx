import { useState } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
// import { api } from "../api/axiosInstance";


interface SaleItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Sale {
  id: number;
  created_at: string;
  total_amount: number;
  status: 'completed' | 'voided';
  items: SaleItem[];
  earned_bonuses: number;
  bonus_spent: number;
}


const fetchPurchases = async (): Promise<Sale[]> => {
  // раскомментировать с импортом, когда появится бэкенд
  // const response = await api.get('/clients/me/purchases');

  // return response.data.items;
  // удалить, когда появится бэкенд
  return [
    {
      id: 1,
      created_at: '2026-10-12T14:30:00+06:00', // Реальный ISO формат
      total_amount: 189000, 
      status: 'completed',
      earned_bonuses: 3800,   
      bonus_spent: 15000,   
      items: [
        { id: 1, product_name: 'Сыр', quantity: 1, unit_price: 42000 },
        { id: 2, product_name: 'Майонез', quantity: 1, unit_price: 28000 },
        { id: 3, product_name: 'Редис', quantity: 1, unit_price: 22000 },
        { id: 4, product_name: 'Соль', quantity: 1, unit_price: 43000 },
        { id: 5, product_name: 'Чипсы', quantity: 1, unit_price: 12000 },
      ]
    },
    {
      id: 2,
      created_at: '2026-10-10T18:15:00+06:00',
      total_amount: 45000, 
      status: 'completed',
      earned_bonuses: 0,
      bonus_spent: 0,
      items: [{ id: 6, product_name: 'Хлеб', quantity: 2, unit_price: 22500 }]
    }
  ];
};


export default function History() {
  const [expandedId, setExpandedId] = useState<number | null>(1); // раскрытие карточки


  const { data: purchases, isLoading, isError } = useQuery({
    queryKey: ['purchases'],
    queryFn: fetchPurchases,
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };


  const formatMoney = (tyiyn: number) => {
    return (tyiyn / 100).toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' сомов';
  };


  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(' г.', ''); // убираем лишнее г. (если появится)
  };


  if(isLoading) return <div className="text-center mt-10 text-gray-400">Загрузка...</div>
  if(isError) return <div className="text-center mt-10 text-red-400">Ошибка загрузки</div>


  return (
    <div className="p-5 flex flex-col min-h-full bg-[#141A22]">
      <header className="mb-5 mt-2">
        <h1 className="text-3xl font-bold">Мои покупки</h1>
      </header>

      <div className="flex flex-col gap-3 overflow-y-auto pb-4">
        {purchases?.map((purchase) => {
          const isExpanded = expandedId === purchase.id;

          return (
            <div
              key={purchase.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isExpanded ?
                'bg-linear-to-b from-[#232f44] to-[#1a2233] border border-[#3b4c6b] shadow-[0_0_15px_rgba(59,76,107,0.3)]' :
                'bg-[#1C2533] hover:bg-[#232f44]'
              }`}
            >
              <button
                onClick={() => toggleExpand(purchase.id)}
                className="w-full p-4 flex justify-between items-center text-left"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-sm">{formatDate(purchase.created_at)}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">{formatMoney(purchase.total_amount)}</span>
                    
                    {purchase.status === 'completed' && (
                      <div className="flex items-center gap-1 bg-[#1b3f2b] text-[#4ade80] px-2 py-0.5 rounded-full text-xs font-medium">
                        <Check size={12} strokeWidth={3} />
                        оплачено
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </button>


              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2 border-b border-[#2A394A] text-xs text-gray-400">
                    <span>Наименование</span>
                    <span className="w-12 text-center">Кол-во</span>
                    <span className="w-20 text-right">Цена</span>
                  </div>

                  <div className="flex flex-col gap-3 py-3">
                    {purchase.items.map(item => (
                      <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-4 text-sm items-center">
                        <span className="text-gray-200">{item.product_name}</span>
                        <span className="w-12 text-center text-gray-400">{item.quantity} шт.</span>
                        <span className="w-20 text-right text-gray-200">{formatMoney(item.unit_price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#2A394A] flex flex-col gap-2 text-sm">
                    {purchase.earned_bonuses > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Начислено:</span>
                        <span className="text-gray-200 font-medium">{purchase.earned_bonuses / 100} бонусов</span>
                      </div>
                    )}

                    {purchase.bonus_spent > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Списано бонусами:</span>
                        <span className="text-gray-200 font-medium">{purchase.bonus_spent / 100} бонусов</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}