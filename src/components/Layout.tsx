import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, History, User, Gift } from "lucide-react";


export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/history', icon: History, label: 'История покупок' },
    { path: '/bonuses', icon: Gift, label: 'История бонусов' },
    { path: '/profile', icon: User, label: 'Привязка клиента' },
  ];


  return (
    <div className="flex flex-col h-screen bg-[#17212B] text-white font-sans">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="w-full bg-[#1C2533] border-t border-[#2A394A] flex justify-around py-3 px-2 pb-6 shrink-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#2AABEE]' : 'texg-gray-400 hover:text-gray-300'}`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}