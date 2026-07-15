/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Home,
  Briefcase,
  AlertOctagon,
  Activity,
  HelpCircle,
  BookOpen,
  Bookmark,
  Clock,
  BarChart3,
  FileEdit,
  MessageSquare
} from "lucide-react";

export type UserTab =
  | "HOME"
  | "TASK_GUIDES"
  | "TROUBLESHOOTING"
  | "DIAGNOSIS"
  | "FAQ"
  | "TERMS"
  | "BOOKMARKS"
  | "RECENT";

export type AdminTab =
  | "ADMIN_DASHBOARD"
  | "ADMIN_GUIDE_LIST"
  | "ADMIN_FEEDBACK";

interface SideNavigationProps {
  isAdminMode: boolean;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  bookmarkCount: number;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  isAdminMode,
  activeTab,
  onSelectTab,
  bookmarkCount
}) => {
  const userMenuItems: MenuItem[] = [
    { id: "HOME", name: "홈", icon: Home },
    { id: "TASK_GUIDES", name: "업무별 가이드", icon: Briefcase },
    { id: "TROUBLESHOOTING", name: "오류 해결", icon: AlertOctagon },
    { id: "DIAGNOSIS", name: "자가진단", icon: Activity },
    { id: "FAQ", name: "자주 묻는 질문", icon: HelpCircle },
    { id: "TERMS", name: "GPTIS 용어", icon: BookOpen },
    { id: "BOOKMARKS", name: "즐겨찾기", icon: Bookmark, badge: bookmarkCount },
    { id: "RECENT", name: "최근 본 가이드", icon: Clock },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: "ADMIN_DASHBOARD", name: "대시보드", icon: BarChart3 },
    { id: "ADMIN_GUIDE_LIST", name: "가이드 관리", icon: FileEdit },
    { id: "ADMIN_FEEDBACK", name: "사용자 피드백", icon: MessageSquare },
  ];

  const menuItems = isAdminMode ? adminMenuItems : userMenuItems;

  return (
    <nav className="w-full md:w-64 bg-white border-r border-gray-200 md:h-[calc(100vh-64px)] p-4 shrink-0 overflow-y-auto">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          {isAdminMode ? "관리 메뉴" : "가이드 서비스"}
        </p>
        
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors group ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconComponent
                  className={`h-4.5 w-4.5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {"badge" in item && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Footer disclaimer inside Navigation sidebar */}
      <div className="mt-8 pt-4 border-t border-gray-100 hidden md:block">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[10px] text-gray-500 font-semibold mb-1">💡 셀프 조치 팁</p>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            전화 문의 전에 검색창에 오류 메시지를 입력하거나 <strong>자가진단</strong>을 통해 3분 안에 해결책을 찾아보세요!
          </p>
        </div>
      </div>
    </nav>
  );
};
