/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Bookmark,
  Activity,
  User,
  Shield,
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Award,
  Factory,
  ChevronRight,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  ArrowRightLeft,
  ChevronLeft
} from "lucide-react";

import { AppHeader } from "./components/AppHeader";
import { SideNavigation, UserTab, AdminTab } from "./components/SideNavigation";
import { SearchBar } from "./components/SearchBar";
import { ContentBlockRenderer } from "./components/ContentBlockRenderer";
import { FeedbackWidget } from "./components/FeedbackWidget";
import { AdminGuideTable } from "./components/AdminGuideTable";
import { GuideEditor } from "./components/GuideEditor";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminFeedbackTable } from "./components/AdminFeedbackTable";
import { SelfDiagnosis } from "./components/SelfDiagnosis";
import { FaqSection } from "./components/FaqSection";
import { TermsSection } from "./components/TermsSection";

import {
  GuideTypeBadge,
  DifficultyBadge,
  StatusBadge,
  EmptyState,
  LoadingSkeleton,
  WarningBox,
  Checklist,
  ErrorState
} from "./components/CommonUI";

import { Guide, Category, GuideFeedback, SearchLog, GuideStatus } from "./types";
import { guideRepository, DEFAULT_CATEGORIES } from "./lib/repository";

export default function App() {
  // Mode & Tabs Navigation
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [userTab, setUserTab] = useState<UserTab>("HOME");
  const [adminTab, setAdminTab] = useState<AdminTab>("ADMIN_DASHBOARD");
  
  // Selected single guide view
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  // Repository Collections
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentViews, setRecentViews] = useState<{ guideId: string; viewedAt: string }[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);

  // Search Results
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Guide[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  // Editorial flow
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // UI Loaders
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<"relevance" | "views" | "recent" | "helpful">("relevance");

  // Load Initial state
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const allGuides = await guideRepository.getAll();
      const allBookmarks = await guideRepository.getBookmarks();
      const allRecent = await guideRepository.getRecentViews();
      const allFeedbacks = await guideRepository.getAllFeedback();
      const allSearchLogs = await guideRepository.getSearchLogs();

      setGuides(allGuides);
      setBookmarks(allBookmarks);
      setRecentViews(allRecent);
      setFeedbacks(allFeedbacks);
      setSearchLogs(allSearchLogs);
    } catch (err: any) {
      setError(err?.message || "데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch tab trigger (reset active single view)
  const handleSelectTab = (tab: any) => {
    setSelectedGuideId(null);
    setSelectedGuide(null);
    setSearchQuery("");
    setActiveCategoryFilter("all");
    setIsEditorOpen(false);
    setEditingGuide(null);

    if (isAdminMode) {
      setAdminTab(tab as AdminTab);
    } else {
      setUserTab(tab as UserTab);
    }
  };

  // Toggle user/admin mode roles
  const handleToggleMode = () => {
    const nextMode = !isAdminMode;
    setIsAdminMode(nextMode);
    setSelectedGuideId(null);
    setSelectedGuide(null);
    setSearchQuery("");
    setIsEditorOpen(false);
    setEditingGuide(null);

    if (nextMode) {
      setAdminTab("ADMIN_DASHBOARD");
    } else {
      setUserTab("HOME");
    }
  };

  // Perform client-side scoring search
  const handleSearchSubmit = async (query: string) => {
    setSearchQuery(query);
    setSelectedGuideId(null);
    setSelectedGuide(null);
    setIsLoading(true);

    try {
      const results = await guideRepository.search(query, {
        categoryId: activeCategoryFilter === "all" ? undefined : activeCategoryFilter
      });
      setSearchResults(results);
      
      if (query) {
        setUserTab("TASK_GUIDES"); // Switch to task listing tab to show results
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Category filter inside task guide list tab
  const handleCategoryFilterSelect = async (catId: string) => {
    setActiveCategoryFilter(catId);
    setIsLoading(true);
    try {
      const results = await guideRepository.search(searchQuery, {
        categoryId: catId === "all" ? undefined : catId
      });
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open guide details view
  const handleOpenGuide = async (guideId: string) => {
    setIsLoading(true);
    try {
      const guide = await guideRepository.getById(guideId);
      if (guide) {
        setSelectedGuideId(guideId);
        setSelectedGuide(guide);
        
        // Refresh logs and state counters
        const allRecent = await guideRepository.getRecentViews();
        const allGuides = await guideRepository.getAll();
        setRecentViews(allRecent);
        setGuides(allGuides);
      } else {
        alert("해당 가이드 문서를 찾을 수 없거나 비공개 상태입니다.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle bookmark key-value state
  const handleToggleBookmark = async (guideId: string) => {
    try {
      await guideRepository.toggleBookmark(guideId);
      const allBookmarks = await guideRepository.getBookmarks();
      setBookmarks(allBookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit feedback rating
  const handleFeedbackSubmit = async (feedbackData: {
    result: "SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED";
    reasons: string[];
    comment?: string;
  }) => {
    if (!selectedGuideId) return;
    try {
      await guideRepository.addFeedback({
        guideId: selectedGuideId,
        result: feedbackData.result,
        reasons: feedbackData.reasons,
        comment: feedbackData.comment
      });
      // Refresh statistics counters
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ADMINISTRATOR OPERATIONS ---
  
  // Create draft guide trigger
  const handleCreateGuideTrigger = () => {
    setEditingGuide(null);
    setIsEditorOpen(true);
  };

  const handleCreateGuideFromMissingWord = (word: string) => {
    const initialDraftPayload: Omit<Guide, 'id' | 'viewCount' | 'helpfulCount' | 'partiallyHelpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'> = {
      title: `'${word}'에 관한 신규 해결 조치법`,
      summary: `사용자 검색 누락 키워드인 '${word}'를 자가 해결하도록 마련된 긴급 초안 가이드입니다.`,
      categoryId: "cat-trace-forward",
      type: "TROUBLESHOOTING",
      status: "DRAFT",
      targetUsers: ["공통 전체 사용자"],
      difficulty: "EASY",
      estimatedMinutes: 3,
      tags: [word, "긴급보완"],
      synonyms: [word],
      errorMessages: [],
      prerequisites: [],
      contentBlocks: [
        { id: "b1", type: "TEXT", body: "여기에 구체적인 해결 대책을 저술해 주세요." }
      ],
      relatedGuideIds: [],
      author: "GPTIS 운영국"
    };

    // Open editor with this preset
    setEditingGuide(initialDraftPayload as any);
    setIsEditorOpen(true);
  };

  // Edit existing guide trigger
  const handleEditGuideTrigger = (g: Guide) => {
    setEditingGuide(g);
    setIsEditorOpen(true);
  };

  // Save Guide handler
  const handleSaveGuide = async (guideData: any) => {
    try {
      if (guideData.id) {
        // Update
        await guideRepository.update(guideData.id, guideData);
      } else {
        // Create new
        await guideRepository.create(guideData);
      }
      setIsEditorOpen(false);
      setEditingGuide(null);
      await loadAllData();
      setAdminTab("ADMIN_GUIDE_LIST");
    } catch (err) {
      alert("가이드 저장에 실패했습니다.");
    }
  };

  // Delete guide handler
  const handleDeleteGuide = async (id: string) => {
    try {
      await guideRepository.delete(id);
      await loadAllData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  // Clone guide handler
  const handleCloneGuide = async (g: Guide) => {
    try {
      const payload = {
        title: g.title + " - 복사본",
        summary: g.summary,
        categoryId: g.categoryId,
        type: g.type,
        status: "DRAFT" as GuideStatus,
        targetUsers: g.targetUsers,
        difficulty: g.difficulty,
        estimatedMinutes: g.estimatedMinutes,
        tags: g.tags,
        synonyms: g.synonyms,
        errorMessages: g.errorMessages,
        prerequisites: g.prerequisites,
        contentBlocks: g.contentBlocks,
        relatedGuideIds: g.relatedGuideIds,
        author: g.author
      };
      await guideRepository.create(payload);
      await loadAllData();
    } catch (err) {
      alert("가이드 복제 실패");
    }
  };

  // Fast Publish status toggle
  const handleToggleStatus = async (id: string, newStatus: GuideStatus) => {
    try {
      await guideRepository.update(id, { status: newStatus });
      await loadAllData();
    } catch (err) {
      alert("상태 수정 실패");
    }
  };

  // Update administrative memo & status on feedback
  const handleUpdateFeedbackStatus = async (id: string, status: string, memo: string) => {
    try {
      await guideRepository.updateFeedbackStatus(id, status, memo);
      await loadAllData();
    } catch (err) {
      alert("피드백 정보 변경 실패");
    }
  };

  // Popular and recently updated lists for Home page
  const popularGuides = React.useMemo(() => {
    return [...guides]
      .filter((g) => g.status === "PUBLISHED")
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);
  }, [guides]);

  const recentlyUpdatedGuides = React.useMemo(() => {
    return [...guides]
      .filter((g) => g.status === "PUBLISHED")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }, [guides]);

  // Sort search results helper
  const sortedSearchResults = React.useMemo(() => {
    const list = [...searchResults];
    if (sortBy === "views") {
      list.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === "helpful") {
      const getRate = (g: Guide) => {
        const total = g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount;
        if (total === 0) return 0;
        return (g.helpfulCount + g.partiallyHelpfulCount * 0.5) / total;
      };
      list.sort((a, b) => getRate(b) - getRate(a));
    }
    // "relevance" uses the default scoring calculated inside search repository
    return list;
  }, [searchResults, sortBy]);

  // Handle direct links or clicks from home frequent cards
  const handleQuickSearchKeyword = (kw: string) => {
    handleSearchSubmit(kw);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 font-sans">
      {/* 1. Global Header Navigation bar */}
      <AppHeader
        isAdminMode={isAdminMode}
        onToggleMode={handleToggleMode}
        onNavigateToHome={() => handleSelectTab("HOME")}
      />

      {/* Admin Mode Demo Disclaimer Alert block */}
      {isAdminMode && (
        <div className="bg-red-500 text-white text-xs px-4 py-2 text-center font-semibold">
          ⚠️ 데모 안내: 현재 개발 관리자 세션 상태입니다. 실제 업무 도입 시에는 사내 SSO 및 OAuth 등 역할기반(RBAC) 인증 체계를 정식 결부해야 합니다.
        </div>
      )}

      {/* 2. Page Container with layout grid (Sidebar + Main stage) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-stretch">
        
        {/* Sidebar Left panel */}
        <SideNavigation
          isAdminMode={isAdminMode}
          activeTab={isAdminMode ? adminTab : userTab}
          onSelectTab={handleSelectTab}
          bookmarkCount={bookmarks.length}
        />

        {/* Main content body stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
          {error && <ErrorState message={error} onRetry={loadAllData} />}

          {isLoading && !selectedGuideId ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4 mb-4" />
              <LoadingSkeleton count={3} />
            </div>
          ) : (
            <>
              {/* ========================================================= */}
              {/* ADMIN MODE MAIN CONTROLLER */}
              {/* ========================================================= */}
              {isAdminMode ? (
                isEditorOpen ? (
                  <GuideEditor
                    guide={editingGuide}
                    categories={categories}
                    onSave={handleSaveGuide}
                    onCancel={() => {
                      setIsEditorOpen(false);
                      setEditingGuide(null);
                    }}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h1 className="text-base sm:text-lg font-extrabold text-gray-900">
                        {adminTab === "ADMIN_DASHBOARD" && "운영자 품질 대시보드"}
                        {adminTab === "ADMIN_GUIDE_LIST" && "GPTIS 전체 가이드 통합 관리"}
                        {adminTab === "ADMIN_FEEDBACK" && "실시간 현장 목소리 (사용자 피드백)"}
                      </h1>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                        {adminTab === "ADMIN_DASHBOARD" && "현장 사용자들이 어떤 키워드로 검색을 헤매고 있는지 지표를 실시간 모니터링합니다."}
                        {adminTab === "ADMIN_GUIDE_LIST" && "가이드 등록, 복제, 수정 및 초안 스키마 작성이 가능합니다."}
                        {adminTab === "ADMIN_FEEDBACK" && "도움지수가 낮게 평가된 취약 품질 문서를 즉시 식별하여 보완 일지를 수정합니다."}
                      </p>
                    </div>

                    {/* Tab Dispatcher */}
                    {adminTab === "ADMIN_DASHBOARD" && (
                      <AdminDashboard
                        guides={guides}
                        categories={categories}
                        searchLogs={searchLogs}
                        onCreateGuideFromMissingWord={handleCreateGuideFromMissingWord}
                      />
                    )}

                    {adminTab === "ADMIN_GUIDE_LIST" && (
                      <AdminGuideTable
                        guides={guides}
                        categories={categories}
                        onEditGuide={handleEditGuideTrigger}
                        onCreateGuide={handleCreateGuideTrigger}
                        onDeleteGuide={handleDeleteGuide}
                        onCloneGuide={handleCloneGuide}
                        onToggleStatus={handleToggleStatus}
                      />
                    )}

                    {adminTab === "ADMIN_FEEDBACK" && (
                      <AdminFeedbackTable
                        feedbacks={feedbacks}
                        guides={guides}
                        onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
                        onRefresh={loadAllData}
                      />
                    )}
                  </div>
                )
              ) : (
                /* ========================================================= */
                /* USER MODE MAIN CONTROLLER */
                /* ========================================================= */
                selectedGuideId && selectedGuide ? (
                  // SINGLE DETAIL VIEW SECTION
                  <div className="space-y-6 animate-fade-in max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 shadow-sm">
                    {/* Upper breadcrumbs + back btn */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                      <button
                        onClick={() => setSelectedGuideId(null)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-700 transition"
                      >
                        <ChevronLeft className="h-4.5 w-4.5" />
                        목록으로 돌아가기
                      </button>
                      
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {categories.find((c) => c.id === selectedGuide.categoryId)?.name || "공통 일반"}
                      </div>
                    </div>

                    {/* Meta Section */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <GuideTypeBadge type={selectedGuide.type} />
                        <DifficultyBadge difficulty={selectedGuide.difficulty} />
                        <span className="text-[10px] font-mono text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-150">
                          독해 {selectedGuide.estimatedMinutes}분 소요
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <h1 className="text-base sm:text-xl font-extrabold text-gray-900 leading-snug">
                          {selectedGuide.title}
                        </h1>

                        {/* Interactive toggle bookmark */}
                        <button
                          onClick={() => handleToggleBookmark(selectedGuide.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer border ${
                            bookmarks.includes(selectedGuide.id)
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Bookmark className={`h-4.5 w-4.5 ${bookmarks.includes(selectedGuide.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                          {bookmarks.includes(selectedGuide.id) ? "즐겨찾는 중" : "즐겨찾기 추가"}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                        {selectedGuide.summary}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {selectedGuide.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-[10px] text-gray-600 px-2 py-0.5 rounded font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {selectedGuide.prerequisites && selectedGuide.prerequisites.length > 0 && (
                        <div className="bg-blue-50/20 border border-blue-100/50 p-3.5 rounded-xl text-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">조회 실행을 위한 준비자료</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedGuide.prerequisites.map((pre, idx) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded font-bold text-gray-700 border border-gray-200/50">
                                {pre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* 3. Core content blocks rendering */}
                    <div className="py-2">
                      <ContentBlockRenderer blocks={selectedGuide.contentBlocks} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* 4. Feedback widget */}
                    <FeedbackWidget
                      guideId={selectedGuide.id}
                      onSubmitFeedback={handleFeedbackSubmit}
                    />

                    {/* 5. Related Guides Recommendation */}
                    {(() => {
                      const related = guides
                        .filter((g) => g.id !== selectedGuide.id && g.status === "PUBLISHED" && g.categoryId === selectedGuide.categoryId)
                        .slice(0, 3);
                      
                      if (related.length === 0) return null;

                      return (
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">업무 연관 가이드 추천</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {related.map((g) => (
                              <div
                                key={g.id}
                                onClick={() => handleOpenGuide(g.id)}
                                className="border border-gray-200 rounded-xl p-3.5 hover:border-blue-300 hover:shadow-xs transition duration-200 cursor-pointer flex flex-col justify-between"
                              >
                                <div>
                                  <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">
                                    {g.type === "TASK" ? "업무" : "해결"}
                                  </span>
                                  <h5 className="text-xs font-bold text-gray-900 mt-1.5 line-clamp-1 leading-snug">
                                    {g.title}
                                  </h5>
                                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                                    {g.summary}
                                  </p>
                                </div>
                                <div className="text-[9px] text-blue-600 font-bold mt-3 flex items-center gap-0.5">
                                  <span>가이드 보기</span>
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  // TAB SWITCH DISPATCHER
                  <div className="space-y-6">
                    {/* TAB 1: HOME */}
                    {userTab === "HOME" && (
                      <div className="space-y-8 animate-fade-in">
                        {/* Hero center console */}
                        <div className="text-center space-y-4 max-w-2xl mx-auto py-5">
                          <h1 className="text-base sm:text-2xl font-extrabold text-gray-950 tracking-tight leading-snug">
                            GPTIS 사용법과 문제 해결 방법을 검색해 보세요.
                          </h1>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            완성차 부품 LOT 추적성 전산망과 현장 업무 용어 정합 매핑 검색을 지원합니다.
                          </p>

                          {/* Global Centered Search input */}
                          <SearchBar onSearch={handleSearchSubmit} />
                        </div>

                        {/* Frequently used Tasks block */}
                        <div className="space-y-3">
                          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="h-4.5 w-4.5 text-blue-600" />
                            자주 찾는 목적 상황별 업무 가이드
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {/* Card 1 */}
                            <div
                              onClick={() => handleOpenGuide("guide-001")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">정방향 추적</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">부품 LOT → 장착 차량 추적</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">문제가 생겨 출고 정지해야 할 완성차 리스트를 정방향으로 도출합니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>

                            {/* Card 2 */}
                            <div
                              onClick={() => handleOpenGuide("guide-002")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded border border-teal-100">역방향 추적</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">차량 번호 → 탑재 LOT 확인</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">클레임이 접수된 완성차 1대에 장착된 협력사 부품 로트를 확인합니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>

                            {/* Card 3 */}
                            <div
                              onClick={() => handleQuickSearchKeyword("부품 입고 및 투입 이력")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded border border-purple-100">이력 추적</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">부품 입고 및 실시간 라인 투입</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">협력사 자재 납품 바코드 리딩 누락 여부 및 서브라인 적재 상태를 검수합니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>

                            {/* Card 4 */}
                            <div
                              onClick={() => handleQuickSearchKeyword("협력사 정보 조회")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-100">기준 정보</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">협력사 마스터 벤더 코드</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">VAATZ ERP에 새로 승인된 공급처의 코드 매핑 실패 시 해결방법입니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>

                            {/* Card 5 */}
                            <div
                              onClick={() => handleOpenGuide("guide-006")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-100">조회 다운로드</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">조회결과 대량 엑셀 다운로드</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">행 수가 1만 건이 초과할 때 브라우저 멈춤 렉 방지 최적화 요령입니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>

                            {/* Card 6 */}
                            <div
                              onClick={() => handleOpenGuide("guide-004")}
                              className="bg-white border border-gray-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded border border-red-100">보안 권한</span>
                                <h3 className="text-xs sm:text-sm font-bold text-gray-950 mt-2">권한 신청 및 접근 오류 해결</h3>
                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">'Access Denied' 팝업 발생 시 결재 요령 및 권한 변경 단계를 짚어드립니다.</p>
                              </div>
                              <span className="text-[10px] text-blue-600 font-bold mt-4 flex items-center gap-0.5">3분 해결방법 보기 <ChevronRight className="h-3 w-3" /></span>
                            </div>
                          </div>
                        </div>

                        {/* Frequently occurring Issues (Troubleshooting quick chips) */}
                        <div className="space-y-3.5 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
                          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertOctagon className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                            자주 발생하는 문제 즉시 진단
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div
                              onClick={() => handleOpenGuide("guide-003")}
                              className="p-3.5 bg-red-50/10 hover:bg-red-50/30 border border-red-100 rounded-xl cursor-pointer text-center text-xs font-bold text-red-700 transition"
                            >
                              조회 결과가 없습니다.
                            </div>
                            <div
                              onClick={() => handleOpenGuide("guide-012")}
                              className="p-3.5 bg-red-50/10 hover:bg-red-50/30 border border-red-100 rounded-xl cursor-pointer text-center text-xs font-bold text-red-700 transition"
                            >
                              검색 조건을 확인해 주세요.
                            </div>
                            <div
                              onClick={() => handleOpenGuide("guide-004")}
                              className="p-3.5 bg-red-50/10 hover:bg-red-50/30 border border-red-100 rounded-xl cursor-pointer text-center text-xs font-bold text-red-700 transition"
                            >
                              접근 권한이 없습니다.
                            </div>
                            <div
                              onClick={() => handleOpenGuide("guide-005")}
                              className="p-3.5 bg-red-50/10 hover:bg-red-50/30 border border-red-100 rounded-xl cursor-pointer text-center text-xs font-bold text-red-700 transition"
                            >
                              데이터가 미반영되었습니다.
                            </div>
                            <div
                              onClick={() => handleOpenGuide("guide-012")}
                              className="p-3.5 bg-red-50/10 hover:bg-red-50/30 border border-red-100 rounded-xl cursor-pointer text-center text-xs font-bold text-red-700 transition"
                            >
                              화면 로딩 응답 지연
                            </div>
                          </div>
                        </div>

                        {/* Bento bottom block: Popular Guides (Left 5) & Recent Updates (Right 3) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Popular Guides (7 cols) */}
                          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                              🔥 실시간 현물 인기 해결 가이드 (TOP 5)
                            </h3>
                            <div className="divide-y divide-gray-100">
                              {popularGuides.map((g, idx) => (
                                <div
                                  key={g.id}
                                  onClick={() => handleOpenGuide(g.id)}
                                  className="py-3 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 px-2 rounded-lg transition"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs font-bold text-gray-400 w-4">0{idx + 1}</span>
                                    <div>
                                      <span className="text-xs sm:text-sm font-bold text-gray-950 group-hover:text-blue-600 transition block">
                                        {g.title}
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-medium line-clamp-1">{g.summary}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-gray-400 font-medium ml-4">
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>{g.viewCount.toLocaleString()}회</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent Updates (5 cols) */}
                          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                              ⏰ 최근 작성 보정된 최신본 가이드
                            </h3>
                            <div className="space-y-3.5">
                              {recentlyUpdatedGuides.map((g) => (
                                <div
                                  key={g.id}
                                  onClick={() => handleOpenGuide(g.id)}
                                  className="cursor-pointer hover:bg-gray-50/30 p-2 rounded-lg transition space-y-1 block border border-transparent hover:border-gray-100"
                                >
                                  <span className="text-[9px] bg-teal-50 text-teal-700 font-semibold px-1.5 py-0.5 rounded border border-teal-100">
                                    업데이트 완료
                                  </span>
                                  <h4 className="text-xs font-bold text-gray-950 line-clamp-1">
                                    {g.title}
                                  </h4>
                                  <p className="text-[10px] text-gray-400 line-clamp-1">{g.summary}</p>
                                  <div className="text-[9px] text-gray-400 font-mono font-medium flex items-center gap-1 pt-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(g.updatedAt).toLocaleDateString("ko-KR", {
                                        month: "2-digit",
                                        day: "2-digit"
                                      })}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: TASK_GUIDES (Search listing) */}
                    {userTab === "TASK_GUIDES" && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Upper search parameters bar inside Tab */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                          <SearchBar initialValue={searchQuery} onSearch={handleSearchSubmit} />

                          {/* Category horizontal scroll bar */}
                          <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
                            <button
                              onClick={() => handleCategoryFilterSelect("all")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                activeCategoryFilter === "all"
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              전체 업무
                            </button>
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryFilterSelect(cat.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                  activeCategoryFilter === cat.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Result summary and sorters */}
                        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                          <span>
                            총 <strong className="text-gray-900 font-bold">{sortedSearchResults.length}</strong>개의 부합하는 가이드 문서 검출
                          </span>
                          
                          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            <button
                              onClick={() => setSortBy("relevance")}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold ${sortBy === "relevance" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                            >
                              추천도순
                            </button>
                            <button
                              onClick={() => setSortBy("views")}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold ${sortBy === "views" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                            >
                              조회순
                            </button>
                            <button
                              onClick={() => setSortBy("helpful")}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold ${sortBy === "helpful" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                            >
                              해결률순
                            </button>
                            <button
                              onClick={() => setSortBy("recent")}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold ${sortBy === "recent" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                            >
                              최신순
                            </button>
                          </div>
                        </div>

                        {/* List grid */}
                        {sortedSearchResults.length === 0 ? (
                          <div className="space-y-4">
                            <EmptyState
                              title="검색 결과가 발견되지 않았습니다."
                              description={`귀하께서 질의하신 '${searchQuery}' 키워드에 상응하는 품질 가이드 가입 문헌이 누락되었습니다. 자가 조건이나 오타 여부를 점검해 주십시오.`}
                            />
                            
                            {/* Alternative recommended checklists */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 max-w-2xl mx-auto">
                              <h4 className="text-xs font-extrabold text-red-700 uppercase tracking-wider">💡 조회 결과가 없을 때의 대체 자가 해결 조치법</h4>
                              <ul className="space-y-2.5 text-xs text-gray-600 leading-relaxed">
                                <li className="flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                  <span>품질 부품코드 자릿수가 대시(-) 조합 규격대로 완전한지 (예: 58101-H1A00) 다시 체크하세요.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                  <span>부품 마킹 LOT 번호 앞뒤에 복사 시 공백이나 빈 스페이스가 딸려 들어가지 않았는지 지워보세요.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                  <span>그래도 지속적으로 누락된다면, 아래 버튼을 눌러 자가진단을 거쳐 해결책을 점검해 보세요.</span>
                                </li>
                              </ul>
                              
                              <div className="flex justify-center pt-2">
                                <button
                                  type="button"
                                  onClick={() => setUserTab("DIAGNOSIS")}
                                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl shadow-sm transition cursor-pointer"
                                >
                                  문제 자가진단 마스터 시작
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sortedSearchResults.map((g) => {
                              // Calculate helpful index
                              const total = g.helpfulCount + g.partiallyHelpfulCount + g.notHelpfulCount;
                              const rate = total === 0 ? 0 : Math.round(((g.helpfulCount + g.partiallyHelpfulCount * 0.5) / total) * 100);

                              return (
                                <div
                                  key={g.id}
                                  onClick={() => handleOpenGuide(g.id)}
                                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <GuideTypeBadge type={g.type} />
                                      <div className="text-[10px] text-gray-400 font-mono font-medium">
                                        마지막 업데이트: {new Date(g.updatedAt).toLocaleDateString("ko-KR")}
                                      </div>
                                    </div>

                                    <h3 className="text-xs sm:text-sm font-extrabold text-gray-950 leading-tight">
                                      {g.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                                      {g.summary}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mt-3">
                                      {g.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="bg-gray-50 text-[9px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-150">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 mt-4">
                                    <span className="text-[10px] font-mono text-gray-400 font-medium">
                                      독해 {g.estimatedMinutes}분 · 난이도: {g.difficulty === "EASY" ? "초급" : "중급"}
                                    </span>
                                    
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 font-mono">
                                      {total > 0 ? (
                                        <span>해결 성공률 {rate}%</span>
                                      ) : (
                                        <span className="text-gray-400 font-normal">신설 가이드</span>
                                      )}
                                      <ChevronRight className="h-4 w-4" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: TROUBLESHOOTING (Error message directory) */}
                    {userTab === "TROUBLESHOOTING" && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs max-w-2xl mx-auto space-y-3">
                          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-center">
                            🚨 전산 경고 오류 메시지 코드 검색
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-500 text-center font-medium">
                            화면에 출력된 영어 경고 문장이나 번호 코드를 입력하시면 완벽한 극복 해결책을 찾아드립니다.
                          </p>
                          <SearchBar onSearch={handleSearchSubmit} />
                        </div>

                        {/* List matching troubleshooting guides */}
                        {(() => {
                          const troubles = guides.filter((g) => g.type === "TROUBLESHOOTING" && g.status === "PUBLISHED");
                          return (
                            <div className="space-y-3.5">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">실시간 오류 해결 보완 가이드 목록</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {troubles.map((g) => (
                                  <div
                                    key={g.id}
                                    onClick={() => handleOpenGuide(g.id)}
                                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                                  >
                                    <div>
                                      <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded border border-red-100">
                                        오류 해결책
                                      </span>
                                      <h3 className="text-xs sm:text-sm font-extrabold text-gray-950 mt-2">
                                        {g.title}
                                      </h3>
                                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                                        {g.summary}
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 mt-4">
                                      <span className="text-[10px] text-gray-400 font-semibold font-mono">
                                        연관 에러: {g.errorMessages.join(", ") || "일반 장애"}
                                      </span>
                                      <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5">
                                        자가해결하기 <ChevronRight className="h-3 w-3" />
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TAB 4: DIAGNOSIS (Stepped self-diagnosis master flow) */}
                    {userTab === "DIAGNOSIS" && (
                      <div className="max-w-3xl mx-auto animate-fade-in">
                        <SelfDiagnosis
                          publishedGuides={guides.filter((g) => g.status === "PUBLISHED")}
                          onOpenGuide={handleOpenGuide}
                        />
                      </div>
                    )}

                    {/* TAB 5: FAQ */}
                    {userTab === "FAQ" && (
                      <div className="max-w-3xl mx-auto animate-fade-in">
                        <FaqSection />
                      </div>
                    )}

                    {/* TAB 6: TERMS */}
                    {userTab === "TERMS" && (
                      <div className="animate-fade-in">
                        <TermsSection />
                      </div>
                    )}

                    {/* TAB 7: BOOKMARKS */}
                    {userTab === "BOOKMARKS" && (
                      <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">내가 저장한 가이드 명세</h2>
                        {bookmarks.length === 0 ? (
                          <EmptyState
                            title="즐겨찾기 목록이 공란입니다."
                            description="현장에서 나에게 유용했던 가이드 문서를 점검하여 하단의 '즐겨찾기 추가' 단추를 누르면, 여기에 단축 폴더로 적재되어 언제든 1초 만에 재스캔할 수 있습니다."
                            actionText="가이드 찾아보기"
                            onAction={() => setUserTab("HOME")}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {guides
                              .filter((g) => bookmarks.includes(g.id))
                              .map((g) => (
                                <div
                                  key={g.id}
                                  onClick={() => handleOpenGuide(g.id)}
                                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <GuideTypeBadge type={g.type} />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleBookmark(g.id);
                                        }}
                                        className="p-1 text-blue-600 hover:text-red-500 transition"
                                        title="즐겨찾기 해제"
                                      >
                                        <Bookmark className="h-4.5 w-4.5 fill-blue-600" />
                                      </button>
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-extrabold text-gray-950 leading-tight">
                                      {g.title}
                                    </h3>
                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                      {g.summary}
                                    </p>
                                  </div>
                                  <div className="text-[10px] text-blue-600 font-bold mt-4 flex items-center justify-end gap-0.5">
                                    <span>가이드 즉시 열기</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 8: RECENT */}
                    {userTab === "RECENT" && (
                      <div className="space-y-4 animate-fade-in">
                        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">내가 최근 읽어 본 가이드 이력 (최대 20개)</h2>
                        {recentViews.length === 0 ? (
                          <EmptyState
                            title="최근 열람 기록이 없습니다."
                            description="품질 문제 해결을 위해 분석해 내려간 가이드 발자취 이력이 고스란히 여기에 나열됩니다."
                          />
                        ) : (
                          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-xs">
                            {recentViews.map((recent) => {
                              const g = guides.find((item) => item.id === recent.guideId);
                              if (!g) return null;
                              return (
                                <div
                                  key={recent.guideId}
                                  onClick={() => handleOpenGuide(g.id)}
                                  className="px-5 py-3.5 hover:bg-gray-50/50 cursor-pointer flex items-center justify-between transition"
                                >
                                  <div>
                                    <span className="text-xs font-bold text-gray-900 hover:text-blue-600 block">
                                      {g.title}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-semibold">
                                      카테고리: {categories.find((c) => c.id === g.categoryId)?.name || "일반"}
                                    </span>
                                  </div>
                                  
                                  <div className="text-right shrink-0 ml-4">
                                    <div className="text-[10px] font-mono text-gray-400 font-medium">
                                      {new Date(recent.viewedAt).toLocaleDateString("ko-KR")} {new Date(recent.viewedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                    <span className="text-[9px] text-blue-600 font-bold block mt-0.5">다시 보기</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 py-4.5 text-center text-[11px] text-gray-400 font-medium">
        <p>© 2026 완성차 품질 LOT 추적성 시스템 GPTIS 셀프 서비스 포털 · 보안 관리 준용 사양</p>
      </footer>
    </div>
  );
}
