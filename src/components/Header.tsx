import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, Search, Menu, CheckCircle2, Info, FileText } from "lucide-react";
import { useProfile } from "../hooks/queries/useUsers";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    position: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setData({
      name: user.name,
      position: user.position_id,
    });
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div
          className="flex items-center space-x-3 border-l border-slate-200 pl-4 ml-2 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
          onClick={() => navigate("/perfil")}
        >
          <img
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
            src="https://picsum.photos/seed/user/100/100"
            alt="User avatar"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">{data.name}</p>
            <p className="text-xs text-slate-500">{data.position}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
