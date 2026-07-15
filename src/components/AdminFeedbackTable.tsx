/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Check, Clipboard, MessageCircle, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle, Save } from "lucide-react";
import { GuideFeedback, Guide } from "../types";

interface AdminFeedbackTableProps {
  feedbacks: (GuideFeedback & { status: string; adminMemo: string })[];
  guides: Guide[];
  onUpdateFeedbackStatus: (id: string, status: string, memo: string) => Promise<void>;
  onRefresh: () => void;
}

export const AdminFeedbackTable: React.FC<AdminFeedbackTableProps> = ({
  feedbacks,
  guides,
  onUpdateFeedbackStatus,
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editMemo, setEditMemo] = useState("");

  const guideMap = React.useMemo(() => {
    return new Map(guides.map((g) => [g.id, g.title]));
  }, [guides]);

  const filteredFeedbacks = React.useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchesStatus = filterStatus === "all" || fb.status === filterStatus;
      const matchesRating = filterRating === "all" || fb.result === filterRating;
      return matchesStatus && matchesRating;
    });
  }, [feedbacks, filterStatus, filterRating]);

  const handleStartEdit = (fb: any) => {
    setEditingId(fb.id);
    setEditStatus(fb.status);
    setEditMemo(fb.adminMemo || "");
  };

  const handleSaveEdit = async (id: string) => {
    await onUpdateFeedbackStatus(id, editStatus, editMemo);
    setEditingId(null);
  };

  const statusConfigs: Record<string, { bg: string; text: string }> = {
    "미확인": { bg: "bg-red-50 text-red-700 border-red-200", text: "미확인" },
    "확인 중": { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "확인 중" },
    "가이드 수정 필요": { bg: "bg-purple-50 text-purple-700 border-purple-200", text: "가이드 수정 필요" },
    "시스템 확인 필요": { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "시스템 확인 필요" },
    "처리 완료": { bg: "bg-green-50 text-green-700 border-green-200", text: "처리 완료" }
  };

  return (
    <div className="space-y-4">
      {/* Filters Header bar */}
      <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Rating filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
          >
            <option value="all">전체 평가 결과</option>
            <option value="SOLVED">완벽히 해결됨 (SOLVED)</option>
            <option value="PARTIALLY_SOLVED">일부 해결됨 (PARTIALLY)</option>
            <option value="NOT_SOLVED">해결되지 않음 (NOT_SOLVED)</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-hidden"
          >
            <option value="all">전체 처리 상태</option>
            <option value="미확인">미확인</option>
            <option value="확인 중">확인 중</option>
            <option value="가이드 수정 필요">가이드 수정 필요</option>
            <option value="시스템 확인 필요">시스템 확인 필요</option>
            <option value="처리 완료">처리 완료</option>
          </select>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 text-xs font-semibold border border-gray-300 rounded-lg px-3 py-1.5 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          새로고침
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">가이드 타겟</th>
                <th scope="col" className="px-4 py-3">평가 및 사유</th>
                <th scope="col" className="px-4 py-3">사용자 의견</th>
                <th scope="col" className="px-4 py-3">제출일 및 처리</th>
                <th scope="col" className="px-4 py-3">운영 파트장 메모</th>
                <th scope="col" className="px-5 py-3 text-right">관리 작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 font-semibold bg-white">
                    아직 수집된 사용자 피드백 정보가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => {
                  const guideTitle = guideMap.get(fb.guideId) || "존재하지 않는 가이드";
                  const isEditing = editingId === fb.id;
                  const statusConf = statusConfigs[fb.status] || { bg: "bg-gray-50 text-gray-600 border-gray-200", text: fb.status };

                  return (
                    <tr key={fb.id} className="hover:bg-gray-50/20 transition">
                      {/* Target Guide Title */}
                      <td className="px-5 py-4 max-w-[200px] font-bold text-gray-900 leading-tight">
                        {guideTitle}
                      </td>

                      {/* Evaluation result + reasons */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span className="inline-flex items-center gap-1">
                            {fb.result === "SOLVED" && (
                              <>
                                <ThumbsUp className="h-4 w-4 text-green-500 shrink-0" />
                                <span className="font-bold text-green-700">완벽히 해결됨</span>
                              </>
                            )}
                            {fb.result === "PARTIALLY_SOLVED" && (
                              <>
                                <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                <span className="font-bold text-amber-700">일부 해결됨</span>
                              </>
                            )}
                            {fb.result === "NOT_SOLVED" && (
                              <>
                                <ThumbsDown className="h-4 w-4 text-red-500 shrink-0" />
                                <span className="font-bold text-red-700">해결되지 않음</span>
                              </>
                            )}
                          </span>

                          {/* list of reasons if any */}
                          {fb.reasons && fb.reasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {fb.reasons.map((r, i) => (
                                <span key={i} className="bg-gray-100 text-[10px] text-gray-600 px-1.5 py-0.5 rounded">
                                  {r}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* User written comment */}
                      <td className="px-4 py-4 max-w-[240px] text-gray-600 font-medium">
                        {fb.comment ? (
                          <div className="flex gap-1.5 items-start">
                            <MessageCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed italic">“ {fb.comment} ”</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 italic">의견 미기재</span>
                        )}
                      </td>

                      {/* Date Submitted & Status Badge */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="text-gray-400 font-mono text-[10px]">
                            {new Date(fb.createdAt).toLocaleString("ko-KR")}
                          </div>
                          
                          {/* Render select or badge depending on editing state */}
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="bg-white border border-gray-300 rounded-lg p-1 text-[11px] font-bold text-gray-700"
                            >
                              <option value="미확인">미확인</option>
                              <option value="확인 중">확인 중</option>
                              <option value="가이드 수정 필요">가이드 수정 필요</option>
                              <option value="시스템 확인 필요">시스템 확인 필요</option>
                              <option value="처리 완료">처리 완료</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${statusConf.bg}`}>
                              {statusConf.text}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Admin Memo */}
                      <td className="px-4 py-4 max-w-[220px]">
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={editMemo}
                            onChange={(e) => setEditMemo(e.target.value)}
                            placeholder="조치한 내용을 기록해 두세요."
                            className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-950 font-semibold"
                          />
                        ) : fb.adminMemo ? (
                          <div className="text-gray-700 font-semibold leading-relaxed border-l-2 border-blue-500 pl-2 bg-blue-50/20 py-1 rounded">
                            {fb.adminMemo}
                          </div>
                        ) : (
                          <span className="text-gray-300 italic">작성된 일지가 없습니다.</span>
                        )}
                      </td>

                      {/* Operations Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(fb.id)}
                            className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] px-2 py-1.5 rounded shadow-xs"
                            title="메모 저장"
                          >
                            <Save className="h-3 w-3" />
                            완료
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(fb)}
                            className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold text-[10px] px-2.5 py-1.5 rounded shadow-xs transition"
                          >
                            상태 수정
                          </button>
                        )}
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
