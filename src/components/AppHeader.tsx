/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, User, HelpCircle, ArrowRightLeft } from "lucide-react";

interface AppHeaderProps {
  isAdminMode: boolean;
  onToggleMode: () => void;
  onNavigateToHome: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isAdminMode,
  onToggleMode,
  onNavigateToHome,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToHome}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-xs" style={{ backgroundColor: "#cc785c" }}>
              {/* Anthropic-inspired 8-spoke radial-spike mark */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 2c-.6 0-1 .4-1 1v6.2l-4.4-4.4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.4 4.4H3.4c-.6 0-1 .4-1 1s.4 1 1 1h6.2l-4.4 4.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4.4-4.4v6.2c0 .6.4 1 1 1s1-.4 1-1v-6.2l4.4 4.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-4.4-4.4h6.2c.6 0 1-.4 1-1s-.4-1-1-1h-6.2l4.4-4.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-4.4 4.4V3c0-.6-.4-1-1-1z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 tracking-tight text-lg">GPTIS Guide Hub</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  isAdminMode ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {isAdminMode ? "관리자 모드" : "사용자 모드"}
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium block">
                현장 품질/생산 사용자를 위한 GPTIS 셀프서비스 가이드
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Server Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 mr-2 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-[11px]">전산망 동기화 정상</span>
            </div>

            {/* Mode Toggle Button */}
            <button
              onClick={onToggleMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition duration-150 ${
                isAdminMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title={isAdminMode ? "사용자 화면으로 가기" : "운영 관리자 도구 열기"}
            >
              {isAdminMode ? (
                <>
                  <User className="h-4 w-4" />
                  사용자 모드로 전환
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  관리자 모드로 전환
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
