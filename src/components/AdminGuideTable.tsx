/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Filter
} from "lucide-react";
import { Guide, Category, GuideType, GuideStatus } from "../types";
import { GuideTypeBadge, StatusBadge } from "./CommonUI";

interface AdminGuideTableProps {
  guides: Guide[];
  categories: Category[];
  onEditGuide: (guide: Guide) => void;
  onCreateGuide: () => void;
  onDeleteGuide: (id: string) => Promise<void>;
  onCloneGuide: (guide: Guide) => Promise<void>;
  onToggleStatus: (id: string, newStatus: GuideStatus) => Promise<void>;
}

export const AdminGuideTable: React.FC<AdminGuideTableProps> = ({
  guides,
  categories,
  onEditGuide,
  onCreateGuide,
  onDeleteGuide,
  onCloneGuide,
  onToggleStatus
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const categoryMap = React.useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]));
  }, [categories]);

  // Filter guides list
  const filteredGuides = React.useMemo(() => {
    return guides.filter((g) => {
      const matchesQuery =
        g.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        g.summary.toLowerCase().includes(filterQuery.toLowerCase()) ||
        g.tags.some((t) => t.toLowerCase().includes(filterQuery.toLowerCase()));

      const matchesCat = selectedCategory === "all" || g.categoryId === selectedCategory;
      const matchesType = selectedType === "all" || g.type === selectedType;
      const matchesStatus = selectedStatus === "all" || g.status === selectedStatus;

      return matchesQuery && matchesCat && matchesType && matchesStatus;
    });
  }, [guides, filterQuery, selectedCategory, selectedType, selectedStatus]);

  // Calculate helpful percentage
  const getHelpfulRate = (g: Guide) => {
    const total = g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount;
    if (total === 0) return 0;
    const score = g.helpfulCount * 1.0 + g.partiallyHelpfulCount * 0.5;
    return Math.round((score / total) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2.5 flex-1">
          {/* Inner Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="가이드 제목, 요약, 태그 검색..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 hidden sm:inline">카테고리:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700"
          >
            <option value="all">전체 유형</option>
            <option value="TASK">업무 가이드</option>
            <option value="TROUBLESHOOTING">오류 해결</option>
            <option value="FAQ">자주 묻는 질문</option>
            <option value="TERM">용어 사전</option>
            <option value="PERMISSION">권한 안내</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700"
          >
            <option value="all">전체 상태</option>
            <option value="PUBLISHED">공개</option>
            <option value="DRAFT">초안</option>
            <option value="REVIEW">검토 중</option>
            <option value="HIDDEN">비공개</option>
          </select>
        </div>

        {/* Right side New Guide Button */}
        <button
          onClick={onCreateGuide}
          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition"
        >
          <Plus className="h-4 w-4" />
          새 가이드 등록
        </button>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">가이드 정보</th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">카테고리</th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">유형</th>
                <th scope="col" className="px-4 py-3">상태</th>
                <th scope="col" className="px-4 py-3 text-center">조회수</th>
                <th scope="col" className="px-4 py-3 text-center">해결률</th>
                <th scope="col" className="px-4 py-3 hidden lg:table-cell">최종 수정일</th>
                <th scope="col" className="px-5 py-3 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-400 font-semibold bg-white">
                    조건에 부합하는 품질 가이드 문서가 발견되지 않았습니다.
                  </td>
                </tr>
              ) : (
                filteredGuides.map((g) => {
                  const helpfulRate = getHelpfulRate(g);
                  return (
                    <tr key={g.id} className="hover:bg-gray-50/50 transition">
                      {/* Guide Title + Author */}
                      <td className="px-5 py-3.5 max-w-[280px]">
                        <div className="font-bold text-gray-900 leading-tight mb-1">{g.title}</div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">{g.summary}</div>
                        <div className="text-[9px] text-gray-400 mt-1 font-semibold">작성자: {g.author}</div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 hidden md:table-cell font-medium text-gray-600">
                        {categoryMap.get(g.categoryId) || "미지정"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <GuideTypeBadge type={g.type} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={g.status} />
                      </td>

                      {/* View Count */}
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-900 font-mono">
                        {g.viewCount.toLocaleString()}
                      </td>

                      {/* Helpful Rate */}
                      <td className="px-4 py-3.5 text-center font-mono">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-semibold ${
                            helpfulRate >= 80 ? "text-green-600" : helpfulRate >= 50 ? "text-amber-600" : "text-red-500"
                          }`}>
                            {helpfulRate}%
                          </span>
                          <span className="text-[9px] text-gray-400 font-normal">
                            ({g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount}명 평가)
                          </span>
                        </div>
                      </td>

                      {/* Updated Date */}
                      <td className="px-4 py-3.5 hidden lg:table-cell text-gray-500 font-medium font-mono">
                        {new Date(g.updatedAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit"
                        })}
                      </td>

                      {/* Operations */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          {/* Quick Publish / Unpublish */}
                          {g.status === "PUBLISHED" ? (
                            <button
                              onClick={() => onToggleStatus(g.id, "DRAFT")}
                              className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                              title="초안으로 변경(비공개)"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleStatus(g.id, "PUBLISHED")}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                              title="즉시 공개"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => onEditGuide(g)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="가이드 수정"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Clone */}
                          <button
                            onClick={() => onCloneGuide(g)}
                            className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                            title="가이드 복제"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`'${g.title}' 가이드를 영구히 삭제하시겠습니까?`)) {
                                onDeleteGuide(g.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="가이드 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
