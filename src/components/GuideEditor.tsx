/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Save,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  ChevronLeft,
  Settings,
  ListOrdered,
  AlertTriangle,
  Info
} from "lucide-react";
import { Guide, Category, ContentBlock, GuideType, GuideStatus } from "../types";

interface GuideEditorProps {
  guide?: Guide | null; // Null if creating new
  categories: Category[];
  onSave: (guideData: Omit<Guide, 'id' | 'viewCount' | 'helpfulCount' | 'partiallyHelpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

export const GuideEditor: React.FC<GuideEditorProps> = ({
  guide,
  categories,
  onSave,
  onCancel
}) => {
  const isNew = !guide;

  // Metadata States
  const [title, setTitle] = useState(guide?.title || "");
  const [summary, setSummary] = useState(guide?.summary || "");
  const [categoryId, setCategoryId] = useState(guide?.categoryId || categories[0]?.id || "");
  const [type, setType] = useState<GuideType>(guide?.type || "TASK");
  const [status, setStatus] = useState<GuideStatus>(guide?.status || "DRAFT");
  const [author, setAuthor] = useState(guide?.author || "GPTIS 운영국");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(guide?.difficulty || "EASY");
  const [estimatedMinutes, setEstimatedMinutes] = useState(guide?.estimatedMinutes || 3);
  
  // Comma-separated or newline-separated metadata fields
  const [tagsInput, setTagsInput] = useState(guide?.tags.join(", ") || "");
  const [synonymsInput, setSynonymsInput] = useState(guide?.synonyms.join(", ") || "");
  const [errorMessagesInput, setErrorMessagesInput] = useState(guide?.errorMessages.join(", ") || "");
  const [prerequisitesInput, setPrerequisitesInput] = useState(guide?.prerequisites.join(", ") || "");

  // Content Blocks state
  const [blocks, setBlocks] = useState<ContentBlock[]>(guide?.contentBlocks || []);

  const [activeBlockTypeToAdd, setActiveBlockTypeToAdd] = useState<ContentBlock["type"]>("TEXT");

  // Helper to add block
  const handleAddBlock = () => {
    const blockId = "block-" + Date.now();
    let newBlock: ContentBlock;

    switch (activeBlockTypeToAdd) {
      case "TEXT":
        newBlock = { id: blockId, type: "TEXT", title: "", body: "" };
        break;
      case "STEP":
        const nextStepNum = blocks.filter(b => b.type === "STEP").length + 1;
        newBlock = {
          id: blockId,
          type: "STEP",
          stepNumber: nextStepNum,
          title: "",
          menuPath: "",
          description: "",
          inputExample: "",
          expectedResult: ""
        };
        break;
      case "WARNING":
        newBlock = { id: blockId, type: "WARNING", message: "" };
        break;
      case "TIP":
        newBlock = { id: blockId, type: "TIP", message: "" };
        break;
      case "CHECKLIST":
        newBlock = { id: blockId, type: "CHECKLIST", title: "준비 완료 체크리스트", items: ["예시 항목 1"] };
        break;
      case "ERROR_EXAMPLE":
        newBlock = { id: blockId, type: "ERROR_EXAMPLE", errorMessage: "ERR_DB_TIMEOUT", possibleCauses: ["과도한 조회 범위", "네트워크 동기화 오류"] };
        break;
      case "RESULT_EXAMPLE":
        newBlock = { id: blockId, type: "RESULT_EXAMPLE", description: "" };
        break;
      case "IMAGE_PLACEHOLDER":
        newBlock = { id: blockId, type: "IMAGE_PLACEHOLDER", caption: "그림. 1조회 단계 클릭 지점", altText: "조회 버튼 클릭 캡처" };
        break;
      default:
        return;
    }

    setBlocks([...blocks, newBlock]);
  };

  // Delete a block
  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
  };

  // Reorder blocks
  const moveBlock = (index: number, direction: "UP" | "DOWN") => {
    const newBlocks = [...blocks];
    if (direction === "UP" && index > 0) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
    } else if (direction === "DOWN" && index < newBlocks.length - 1) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
    }
    setBlocks(newBlocks);
  };

  // Update specific block text fields dynamically
  const handleUpdateBlockField = (blockId: string, field: string, value: any) => {
    setBlocks(
      blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, [field]: value };
        }
        return b;
      })
    );
  };

  const handleUpdateChecklistItems = (blockId: string, text: string) => {
    const items = text.split("\n").map(i => i.trim()).filter(Boolean);
    handleUpdateBlockField(blockId, "items", items);
  };

  const handleUpdateErrorCauses = (blockId: string, text: string) => {
    const causes = text.split("\n").map(i => i.trim()).filter(Boolean);
    handleUpdateBlockField(blockId, "possibleCauses", causes);
  };

  // Auto-generate sample blocks template to make writer's life 10x easier
  const loadDraftTemplate = () => {
    const templateBlocks: ContentBlock[] = [
      { id: "t1", type: "TEXT", title: "이 가이드를 사용하는 상황", body: "언제 이 기능이 사용되는지 시나리오를 구체적으로 한 줄 기재합니다." },
      { id: "t2", type: "CHECKLIST", title: "시작 전 준비사항", items: ["필수 파라미터 1", "필수 파라미터 2", "적절한 마스터 공정 코드"] },
      { id: "t3", type: "STEP", stepNumber: 1, title: "기본 메뉴 접속", menuPath: "GPTIS 메인 > 품질 추적 > 대상화면", description: "화면을 활성화한 후 조회 인수를 탐색합니다.", inputExample: "공장명 입력", expectedResult: "그리드 공백 출력" },
      { id: "t4", type: "STEP", stepNumber: 2, title: "검색 및 조회 실행", description: "최적의 범위 필터링을 지정 후 조회를 실행합니다.", inputExample: "LOT 번호 기입", expectedResult: "정상 완성차 리스트 매핑" },
      { id: "t5", type: "WARNING", message: "LOT 대소문자 구분에 주의해 주세요!" },
      { id: "t6", type: "RESULT_EXAMPLE", description: "조회가 완료되면 우측 그리드에 VIN 및 출하 일정이 대조 매핑됩니다." }
    ];
    setBlocks(templateBlocks);
  };

  // Save submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      alert("제목과 요약은 필수 기입 항목입니다.");
      return;
    }

    const cleanList = (str: string) => str.split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      id: guide?.id, // Send back id if editing
      title: title.trim(),
      summary: summary.trim(),
      categoryId,
      type,
      status,
      author: author.trim(),
      difficulty,
      estimatedMinutes: Number(estimatedMinutes),
      tags: cleanList(tagsInput),
      synonyms: cleanList(synonymsInput),
      errorMessages: cleanList(errorMessagesInput),
      prerequisites: cleanList(prerequisitesInput),
      contentBlocks: blocks,
      relatedGuideIds: guide?.relatedGuideIds || []
    };

    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Editor Header Navigation bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 bg-white px-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              {isNew ? "새 가이드 등록하기" : "가이드 수정하기"}
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
              {isNew ? "GPTIS 현장 사용자들이 참고할 새 자가 해결 가이드를 수립합니다." : `'${guide.title}' 문서 수정 모드`}
            </p>
          </div>
        </div>

        {/* Action button header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-sm transition"
          >
            <Save className="h-4 w-4" />
            가이드 저장
          </button>
        </div>
      </div>

      {/* Editor Two Column Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata Forms (5 cols) */}
        <div className="xl:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Settings className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold text-gray-900 tracking-tight uppercase">기초 마스터 메타데이터</h3>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">가이드 제목 *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 특정 부품 LOT가 장착된 차량 찾기"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 shadow-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">한 줄 요약 (목록 노출용) *</label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="문제가 파악된 LOT를 기준으로 해당 부품이 최종 탑재된 완성차 차대번호 목록을 조사하는 요령입니다."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 shadow-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">카테고리</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs font-semibold text-gray-700 focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Guide Type selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">가이드 유형</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GuideType)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs font-semibold text-gray-700 focus:ring-1 focus:ring-blue-500"
              >
                <option value="TASK">업무 가이드 (TASK)</option>
                <option value="TROUBLESHOOTING">오류 해결 (TROUBLESHOOTING)</option>
                <option value="FAQ">자주 묻는 질문 (FAQ)</option>
                <option value="TERM">용어 사전 (TERM)</option>
                <option value="PERMISSION">권한 안내 (PERMISSION)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">공개 상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GuideStatus)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs font-semibold text-gray-700 focus:ring-1 focus:ring-blue-500"
              >
                <option value="DRAFT">초안 (DRAFT)</option>
                <option value="REVIEW">검토 요청 (REVIEW)</option>
                <option value="PUBLISHED">공개 승인 (PUBLISHED)</option>
                <option value="HIDDEN">비공개 잠금 (HIDDEN)</option>
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">담당 작성자</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="홍길동 운영파트장"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Difficulty selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">난이도 등급</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-lg px-2 py-2 text-xs font-semibold text-gray-700 focus:ring-1 focus:ring-blue-500"
              >
                <option value="EASY">초급 (EASY)</option>
                <option value="MEDIUM">중급 (MEDIUM)</option>
                <option value="HARD">고급 (HARD)</option>
              </select>
            </div>

            {/* Estimated minutes */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">예상 소요 시간 (분)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Tags (comma-separated) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">태그 목록 (쉼표 구분)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="LOT, 차량 조회, 정방향 추적"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Synonyms (comma-separated) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">검색 동의어 (쉼표 구분 - 우선 검색용)</label>
            <input
              type="text"
              value={synonymsInput}
              onChange={(e) => setSynonymsInput(e.target.value)}
              placeholder="로트, 차량번호, 차대번호, VIN"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Error messages linked (comma-separated) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">연관 시스템 오류 명칭 (쉼표 구분)</label>
            <input
              type="text"
              value={errorMessagesInput}
              onChange={(e) => setErrorMessagesInput(e.target.value)}
              placeholder="No Data Found, Invalid VIN Format, ERR-AUTH-403"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Prerequisites (comma-separated) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">조회 전 필요 준비사항 (쉼표 구분)</label>
            <input
              type="text"
              value={prerequisitesInput}
              onChange={(e) => setPrerequisitesInput(e.target.value)}
              placeholder="부품번호 (10자리), 부품 LOT 번호"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Column: Interactive Blocks List (7 cols) */}
        <div className="xl:col-span-7 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <ListOrdered className="h-4.5 w-4.5 text-blue-600" />
              <h3 className="text-xs font-bold text-gray-900 tracking-tight uppercase">조직화 가이드 본문 블록</h3>
            </div>
            
            {blocks.length === 0 && (
              <button
                type="button"
                onClick={loadDraftTemplate}
                className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                기본 템플릿 불러오기
              </button>
            )}
          </div>

          {/* Blocks List */}
          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div className="p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center text-gray-400 font-semibold text-xs">
                현재 추가된 구성 블록이 없습니다. 하단의 블록 추가 도구를 통해 본문 단계를 구성하세요.
              </div>
            ) : (
              blocks.map((block, index) => {
                return (
                  <div key={block.id} className="relative group border border-gray-200 rounded-xl p-4.5 bg-gray-50/20 shadow-xs space-y-3">
                    {/* Block Toolbar Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          블록 #{index + 1}: {block.type}
                        </span>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "UP")}
                          disabled={index === 0}
                          className="p-1 rounded text-gray-400 hover:bg-white hover:text-gray-700 border border-transparent hover:border-gray-200 transition disabled:opacity-30"
                          title="위로"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "DOWN")}
                          disabled={index === blocks.length - 1}
                          className="p-1 rounded text-gray-400 hover:bg-white hover:text-gray-700 border border-transparent hover:border-gray-200 transition disabled:opacity-30"
                          title="아래로"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition"
                          title="블록 삭제"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Form Fields conditionally */}
                    {block.type === "TEXT" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.title || ""}
                          onChange={(e) => handleUpdateBlockField(block.id, "title", e.target.value)}
                          placeholder="서브 섹션 제목 (선택 사항)"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                        <textarea
                          rows={3}
                          value={block.body}
                          onChange={(e) => handleUpdateBlockField(block.id, "body", e.target.value)}
                          placeholder="단락 세부 본문을 기술해 주세요."
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                      </div>
                    )}

                    {block.type === "STEP" && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">단계 번호:</span>
                            <input
                              type="number"
                              value={block.stepNumber}
                              onChange={(e) => handleUpdateBlockField(block.id, "stepNumber", Number(e.target.value))}
                              className="w-16 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-bold text-gray-950"
                            />
                          </div>
                          <input
                            type="text"
                            value={block.title}
                            onChange={(e) => handleUpdateBlockField(block.id, "title", e.target.value)}
                            placeholder="단계 요약 구문 (예: VIN 17자리 기입)"
                            className="sm:col-span-2 w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                        </div>

                        <input
                          type="text"
                          value={block.menuPath || ""}
                          onChange={(e) => handleUpdateBlockField(block.id, "menuPath", e.target.value)}
                          placeholder="전산 메뉴 경로 (예: 품질관리 > LOT 역방향조회)"
                          className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />

                        <textarea
                          rows={2}
                          value={block.description}
                          onChange={(e) => handleUpdateBlockField(block.id, "description", e.target.value)}
                          placeholder="사용자가 실제 수행해야 하는 세부 동작 행동요령"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={block.inputExample || ""}
                            onChange={(e) => handleUpdateBlockField(block.id, "inputExample", e.target.value)}
                            placeholder="입력값 예시 (예: 58101-H1A00)"
                            className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                          <input
                            type="text"
                            value={block.expectedResult || ""}
                            onChange={(e) => handleUpdateBlockField(block.id, "expectedResult", e.target.value)}
                            placeholder="화면 출력 예상 결과 (예: 완성차 매핑 그리드가 하단에 렌더)"
                            className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "WARNING" && (
                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          value={block.message}
                          onChange={(e) => handleUpdateBlockField(block.id, "message", e.target.value)}
                          placeholder="여기에 주의해야 할 특이 실수를 한글로 간결히 적어주세요."
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                      </div>
                    )}

                    {block.type === "TIP" && (
                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          value={block.message}
                          onChange={(e) => handleUpdateBlockField(block.id, "message", e.target.value)}
                          placeholder="숨겨진 유용한 단축키나 우회 팁"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                      </div>
                    )}

                    {block.type === "CHECKLIST" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => handleUpdateBlockField(block.id, "title", e.target.value)}
                          placeholder="체크리스트 소제목 (예: 자가진단 5대 항목)"
                          className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block uppercase">항목들 (줄바꿈으로 구분)</label>
                          <textarea
                            rows={3}
                            value={block.items.join("\n")}
                            onChange={(e) => handleUpdateChecklistItems(block.id, e.target.value)}
                            placeholder="체크리스트에 올릴 각 요소들을 줄바꿈을 통해 기재합니다."
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950 font-sans"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "ERROR_EXAMPLE" && (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={block.errorMessage}
                          onChange={(e) => handleUpdateBlockField(block.id, "errorMessage", e.target.value)}
                          placeholder="시스템 실제 에러 메시지 팝업 텍스트 (예: No Data mapped [PartNo=58110])"
                          className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950 font-mono text-red-600 bg-red-50/10"
                        />
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block uppercase">유발 원인 후보군 (줄바꿈 구분)</label>
                          <textarea
                            rows={2}
                            value={block.possibleCauses.join("\n")}
                            onChange={(e) => handleUpdateErrorCauses(block.id, e.target.value)}
                            placeholder="원인 유발 이유들을 한 개씩 줄바꿈하여 기재합니다."
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "RESULT_EXAMPLE" && (
                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          value={block.description}
                          onChange={(e) => handleUpdateBlockField(block.id, "description", e.target.value)}
                          placeholder="조회가 완전히 끝났을 때 마주할 양식에 관한 묘사"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                        />
                      </div>
                    )}

                    {block.type === "IMAGE_PLACEHOLDER" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block uppercase">이미지 캡션 설명구</label>
                          <input
                            type="text"
                            value={block.caption}
                            onChange={(e) => handleUpdateBlockField(block.id, "caption", e.target.value)}
                            placeholder="예: 그림 1. LOT 조회 다중 다이얼로그"
                            className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 block uppercase">시각 대체 텍스트(Alt Text)</label>
                          <input
                            type="text"
                            value={block.altText}
                            onChange={(e) => handleUpdateBlockField(block.id, "altText", e.target.value)}
                            placeholder="예: 다중 입력 텍스트 아리아가 켜진 모습"
                            className="w-full px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-950"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Add block tool footer action bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">추가할 블록 선택:</span>
              <select
                value={activeBlockTypeToAdd}
                onChange={(e) => setActiveBlockTypeToAdd(e.target.value as ContentBlock["type"])}
                className="bg-white border border-gray-300 rounded-md px-1.5 py-1 text-xs font-semibold text-gray-700"
              >
                <option value="TEXT">설명 단락 (TEXT)</option>
                <option value="STEP">작업 단계 (STEP)</option>
                <option value="WARNING">주의사항 (WARNING)</option>
                <option value="TIP">유용한 팁 (TIP)</option>
                <option value="CHECKLIST">체크리스트 (CHECKLIST)</option>
                <option value="ERROR_EXAMPLE">오류 예제 (ERROR_EXAMPLE)</option>
                <option value="RESULT_EXAMPLE">정상결과 (RESULT_EXAMPLE)</option>
                <option value="IMAGE_PLACEHOLDER">스크린샷 자리 (IMAGE_PLACEHOLDER)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddBlock}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-md shadow-xs transition cursor-pointer ml-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              신규 블록 추가
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
