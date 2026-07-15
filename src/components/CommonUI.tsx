/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, Info, CheckSquare, RefreshCw } from "lucide-react";
import { GuideType, GuideStatus } from "../types";

// Guide Type Badge Component
export const GuideTypeBadge: React.FC<{ type: GuideType }> = ({ type }) => {
  const configs: Record<GuideType, { text: string; bg: string; textCol: string }> = {
    TASK: { text: "업무 가이드", bg: "bg-blue-50 text-blue-700 border-blue-200", textCol: "text-blue-700" },
    TROUBLESHOOTING: { text: "오류 해결", bg: "bg-red-50 text-red-700 border-red-200", textCol: "text-red-700" },
    FAQ: { text: "자주 묻는 질문", bg: "bg-teal-50 text-teal-700 border-teal-200", textCol: "text-teal-700" },
    TERM: { text: "용어 사전", bg: "bg-amber-50 text-amber-700 border-amber-200", textCol: "text-amber-700" },
    PERMISSION: { text: "권한 안내", bg: "bg-purple-50 text-purple-700 border-purple-200", textCol: "text-purple-700" }
  };

  const config = configs[type] || { text: type, bg: "bg-gray-50 text-gray-700 border-gray-200", textCol: "text-gray-700" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}>
      {config.text}
    </span>
  );
};

// Difficulty Badge
export const DifficultyBadge: React.FC<{ difficulty: "EASY" | "MEDIUM" | "HARD" }> = ({ difficulty }) => {
  const configs = {
    EASY: { text: "초급", bg: "bg-green-50 text-green-700 border-green-200" },
    MEDIUM: { text: "중급", bg: "bg-amber-50 text-amber-700 border-amber-200" },
    HARD: { text: "고급", bg: "bg-red-50 text-red-700 border-red-200" }
  };

  const config = configs[difficulty] || { text: difficulty, bg: "bg-gray-50 text-gray-700 border-gray-200" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg}`}>
      난이도: {config.text}
    </span>
  );
};

// Guide Status Badge
export const StatusBadge: React.FC<{ status: GuideStatus }> = ({ status }) => {
  const configs: Record<GuideStatus, { text: string; bg: string }> = {
    PUBLISHED: { text: "공개", bg: "bg-green-100 text-green-800 border-green-200" },
    DRAFT: { text: "초안", bg: "bg-gray-100 text-gray-800 border-gray-200" },
    REVIEW: { text: "검토 중", bg: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    HIDDEN: { text: "비공개", bg: "bg-red-100 text-red-800 border-red-200" }
  };

  const config = configs[status] || { text: status, bg: "bg-gray-100 text-gray-800 border-gray-200" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${config.bg}`}>
      {config.text}
    </span>
  );
};

// Empty State Component
export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionText, onAction, id = "empty-state" }) => {
  return (
    <div id={id} className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-xl bg-white">
      <Info className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center px-3.5 py-2 border border-transparent text-xs font-medium rounded-lg shadow-xs text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Loading Skeleton Component
export const LoadingSkeleton: React.FC<{ count?: number; height?: string }> = ({ count = 3, height = "h-24" }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`w-full ${height} bg-gray-100 rounded-xl border border-gray-200`} />
      ))}
    </div>
  );
};

// Warning Box Component
export const WarningBox: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-xs font-semibold text-amber-800">주의사항</h4>
        <p className="text-xs text-amber-700 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

// Checklist Component
export const Checklist: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare className="h-4 w-4 text-blue-600" />
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Error State Component
export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-100 rounded-xl bg-red-50/30">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
      <h3 className="text-sm font-semibold text-red-900 mb-1">오류가 발생했습니다</h3>
      <p className="text-xs text-red-700 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-xs font-medium rounded-lg shadow-xs text-red-800 bg-white hover:bg-red-50 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          다시 시도
        </button>
      )}
    </div>
  );
};
