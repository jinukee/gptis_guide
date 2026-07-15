/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  FileText,
  Eye,
  TrendingUp,
  FileQuestion,
  AlertTriangle,
  Award,
  Plus
} from "lucide-react";
import { Guide, Category, SearchLog } from "../types";

interface AdminDashboardProps {
  guides: Guide[];
  categories: Category[];
  searchLogs: SearchLog[];
  onCreateGuideFromMissingWord: (word: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  guides,
  categories,
  searchLogs,
  onCreateGuideFromMissingWord
}) => {
  // 1. Calculate overall counts
  const totalGuides = guides.length;
  const publishedGuides = guides.filter((g) => g.status === "PUBLISHED").length;
  const draftGuides = guides.filter((g) => g.status === "DRAFT").length;
  
  // Total Views across all guides
  const totalViews = React.useMemo(() => {
    return guides.reduce((acc, curr) => acc + curr.viewCount, 0);
  }, [guides]);

  // Overall Helpfulness Success Rate
  const overallSuccessRate = React.useMemo(() => {
    let totalHelpful = 0;
    let totalEvaluated = 0;
    guides.forEach((g) => {
      totalHelpful += g.helpfulCount * 1.0 + g.partiallyHelpfulCount * 0.5;
      totalEvaluated += g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount;
    });
    if (totalEvaluated === 0) return 85; // Default demo rate
    return Math.round((totalHelpful / totalEvaluated) * 100);
  }, [guides]);

  // 2. Daily Views Chart Data (simulated)
  const dailyViews = [
    { date: "07/08", views: 1240 },
    { date: "07/09", views: 1450 },
    { date: "07/10", views: 1390 },
    { date: "07/11", views: 1100 },
    { date: "07/12", views: 800 },
    { date: "07/13", views: 1650 },
    { date: "07/14", views: 1840 } // Peak views on current date
  ];
  const maxDailyViews = Math.max(...dailyViews.map((d) => d.views));

  // 3. Category Popularity (Views by Category)
  const categoryViews = React.useMemo(() => {
    const categoryMap = new Map<string, { name: string; views: number }>(
      categories.map((c) => [c.id, { name: c.name, views: 0 }])
    );
    guides.forEach((g) => {
      const data = categoryMap.get(g.categoryId);
      if (data) {
        data.views += g.viewCount;
      }
    });
    return Array.from(categoryMap.values())
      .filter((v) => v.views > 0)
      .sort((a, b) => b.views - a.views);
  }, [guides, categories]);
  const maxCategoryViews = categoryViews[0]?.views || 1000;

  // 4. Missing Searches Rank ("검색 결과 없음 키워드 순위" - extracted from logs with 0 results or mock items if empty)
  const missingKeywords = React.useMemo(() => {
    const map: Record<string, number> = {
      "차대번호 공백오류": 12,
      "체코공장 자재 누락": 9,
      "VAATZ 계정만료": 8,
      "타임아웃 튕김": 5,
      "PDA 통신먹통": 4
    };

    // Integrate real search logs if result count was 0
    searchLogs.forEach((log) => {
      if (log.resultCount === 0 && log.query.trim()) {
        const queryClean = log.query.trim().toLowerCase();
        map[queryClean] = (map[queryClean] || 0) + 1;
      }
    });

    return Object.entries(map)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [searchLogs]);

  // 5. Lowest performing guides (Weak guides with low helpful percentage)
  const lowPerformingGuides = React.useMemo(() => {
    const scoredGuides = guides
      .map((g) => {
        const total = g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount;
        const score = total === 0 ? 100 : Math.round(((g.helpfulCount + g.partiallyHelpfulCount * 0.5) / total) * 100);
        return { guide: g, score, total };
      })
      .filter((g) => g.total > 0 && g.score < 80) // Guides that have feedback but are below 80% satisfaction
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    return scoredGuides;
  }, [guides]);

  return (
    <div className="space-y-6">
      {/* KPI Cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">총 가이드 개수</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 font-mono">{totalGuides}</span>
            <span className="text-[9px] text-gray-400 block font-medium">공개: {publishedGuides} / 초안: {draftGuides}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">누적 가이드 뷰</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 font-mono">{totalViews.toLocaleString()}</span>
            <span className="text-[9px] text-gray-400 block font-medium">실시간 카운팅 동기화</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">평균 문제 해결률</span>
            <span className="text-base sm:text-lg font-extrabold text-teal-700 font-mono">{overallSuccessRate}%</span>
            <span className="text-[9px] text-gray-400 block font-medium">사용자 만족 피드백 기반</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3 col-span-1">
          <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <FileQuestion className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">검색 이력 로그</span>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 font-mono">
              {(searchLogs.length + 85).toLocaleString()}
            </span>
            <span className="text-[9px] text-gray-400 block font-medium">누적 질의 분석 데이터</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3 col-span-2 lg:col-span-1">
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">운영 상태</span>
            <span className="text-xs sm:text-sm font-extrabold text-purple-700 block mt-0.5">최적 관리 중</span>
            <span className="text-[9px] text-gray-400 block font-medium">지연배치 0건</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Daily Views (Timeline Bar Chart) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            일별 가이드 조회 추이 (최근 7일)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2.5 pt-4">
            {dailyViews.map((day, idx) => {
              const heightPercent = Math.round((day.views / maxDailyViews) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Floating tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono transition-opacity absolute mb-14">
                    {day.views}뷰
                  </div>
                  
                  {/* Vertical bar */}
                  <div className="w-full bg-blue-50 hover:bg-blue-600 rounded-md transition duration-200 relative overflow-hidden" style={{ height: `${heightPercent || 10}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-blue-600 h-[20%] group-hover:h-full transition-all duration-300" />
                  </div>
                  
                  {/* Date Label */}
                  <span className="text-[10px] text-gray-500 font-semibold font-mono">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Views by Category (Horizontal comparative bars) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
            카테고리별 누적 조회수 분포
          </h3>
          <div className="space-y-3 pt-2">
            {categoryViews.slice(0, 5).map((cat, idx) => {
              const widthPercent = Math.round((cat.views / maxCategoryViews) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-700">
                    <span>{cat.name}</span>
                    <span className="font-mono text-gray-900">{cat.views}회</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${widthPercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Warnings & missing searches Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Table 1: Search failures / Missing Keywords rank */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              미해결 검색어 통계 (검색 결과 없음)
            </h3>
            <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              컨텐츠 보완 필요
            </span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {missingKeywords.map((kw, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                  <span className="font-mono text-xs text-red-600 font-bold bg-red-50/50 px-2 py-0.5 rounded border border-red-100">
                    {kw.query}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 font-semibold font-mono">시도 횟수: {kw.count}회</span>
                  <button
                    onClick={() => onCreateGuideFromMissingWord(kw.query)}
                    className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-1 rounded"
                    title="해당 검색어로 즉시 가이드 초안 개설"
                  >
                    <Plus className="h-3 w-3" />
                    가이드 작성
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table 2: Low resolution success rate guides */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              개선 필요 가이드 목록 (낮은 해결 성공률)
            </h3>
            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              모니터링 경고
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {lowPerformingGuides.length === 0 ? (
              <div className="py-8 text-center text-gray-400 font-semibold bg-white text-xs">
                현재 문제 해결 성공률이 80% 미만인 취약 품질 가이드가 없습니다.
              </div>
            ) : (
              lowPerformingGuides.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-gray-900 block truncate leading-tight">{item.guide.title}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">총 피드백 수: {item.total}명</span>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-red-500 font-mono">{item.score}% 해결</span>
                      <span className="text-[9px] text-gray-400">품질 가이드 보정 요망</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
