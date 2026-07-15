/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CheckCircle2, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";

interface FeedbackWidgetProps {
  guideId: string;
  onSubmitFeedback: (feedback: {
    result: "SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED";
    reasons: string[];
    comment?: string;
  }) => Promise<void>;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ guideId, onSubmitFeedback }) => {
  const [result, setResult] = useState<"SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED" | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonsList = [
    "설명이 너무 길거나 이해하기 어려움",
    "현재 실제 화면과 가이드 설명이 다름",
    "내가 겪는 고유한 세부 사례가 없음",
    "결국 계정 권한이 막혀 조치 불가능함",
    "데이터 지연/누락이 해결되지 않음",
    "시스템 전산 오류/장애가 원인으로 보임",
    "기타 의견"
  ];

  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleResultSelect = (res: "SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED") => {
    setResult(res);
    // If solved, we might clear previous negative reasons
    if (res === "SOLVED") {
      setSelectedReasons([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        result,
        reasons: selectedReasons,
        comment: comment.trim() || undefined
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/20 p-6 flex flex-col items-center text-center animate-fade-in">
        <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
        <h4 className="text-sm font-bold text-green-900">피드백을 제출해 주셔서 감사합니다!</h4>
        <p className="text-xs text-green-700 mt-1">
          작성해 주신 소중한 의견은 GPTIS 운영자가 분석하여 가이드를 즉각 보정하고 시스템 오류 해결을 가속하는 데 사용됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">이 가이드로 문제가 해결되었나요?</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleResultSelect("SOLVED")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              result === "SOLVED"
                ? "bg-green-50 border-green-500 text-green-700 ring-2 ring-green-100"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <span>완벽히 해결됨</span>
          </button>

          <button
            type="button"
            onClick={() => handleResultSelect("PARTIALLY_SOLVED")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              result === "PARTIALLY_SOLVED"
                ? "bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-100"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <HelpCircle className="h-4 w-4 text-amber-500" />
            <span>일부 해결됨</span>
          </button>

          <button
            type="button"
            onClick={() => handleResultSelect("NOT_SOLVED")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              result === "NOT_SOLVED"
                ? "bg-red-50 border-red-500 text-red-700 ring-2 ring-red-100"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ThumbsDown className="h-4 w-4 text-red-500" />
            <span>해결되지 않음</span>
          </button>
        </div>

        {/* Conditional Reason Checklist */}
        {result && result !== "SOLVED" && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200/50 animate-fade-in">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              해결에 방해가 된 구체적인 사유를 체크해 주세요 (중복 선택 가능)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reasonsList.map((reason, idx) => {
                const isChecked = selectedReasons.includes(reason);
                return (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-gray-100 hover:border-gray-300 transition text-xs font-medium text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleReasonToggle(reason)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{reason}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Written Comment Text Area */}
        {result && (
          <div className="space-y-1.5 animate-fade-in">
            <label htmlFor="feedback-comment" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              운영진에게 남길 추가 한마디 (선택 사항)
            </label>
            <textarea
              id="feedback-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="예: 단계 3에 찍힌 이미지의 메뉴 명칭이 실제 시스템의 '매핑조회' 대신 'Lotus Trace'로 이름이 바뀌었어요."
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-xs font-medium placeholder-gray-400 text-gray-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>
        )}

        {/* Submit Action */}
        {result && (
          <div className="flex justify-end pt-1 animate-fade-in">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "피드백 전송 중..." : "피드백 제출"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
