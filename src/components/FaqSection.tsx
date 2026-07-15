/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: "CONCEPT" | "OPERATION" | "TROUBLE" | "ADMIN";
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const faqItems: FaqItem[] = [
    {
      id: 1,
      question: "부품번호와 LOT 번호는 무엇이 다른가요?",
      answer: "부품번호(Part Number)는 부품 사양의 종류를 고유하게 구별하는 10자리 설계코드이며 동일 품목은 번호가 같습니다. 반면, LOT 번호는 생산 묶음(예: 특정 날짜, 특정 조립조)을 세부 추적하는 일련번호입니다. 품질 이슈 리콜 범위 수립 시에는 특정 불량 LOT 번호 단위로 대상 완성차를 선별하므로 두 값을 명확히 혼용 없이 기입해야 합니다.",
      category: "CONCEPT"
    },
    {
      id: 2,
      question: "LOT 번호를 일부만 입력해도 조회할 수 있나요?",
      answer: "원칙적으로는 정밀 정합 매칭을 위해 완전한 LOT 번호 기입을 권장합니다. 하지만 6자리 LOT 중 앞부분 3~4자리만 안다면, 일부 조회창 옆에 있는 '부분 일치 조회' 체크박스를 누르고 뒤에 '%' 기호를 붙여 조회할 수 있습니다. (예: A23B% 입력 시 A23B로 시작하는 모든 로트 추적)",
      category: "OPERATION"
    },
    {
      id: 3,
      question: "차량에서 장착 부품 LOT를 어떻게 확인하나요?",
      answer: "차량에 쓰인 로트를 대조하려면 '차량 역방향 추적' > '완성차 조립이력 역추적' 메뉴로 진입하여 차량 차대번호(VIN) 17자리를 기입 후 조회하면 됩니다. 조립 계통 트리를 통해 조립 시기 및 입고 로트를 정밀히 수렴할 수 있습니다.",
      category: "OPERATION"
    },
    {
      id: 4,
      question: "특정 LOT가 적용된 차량은 어떻게 찾나요?",
      answer: "'LOT 정방향 추적' > '부품-완성차 매핑조회' 메뉴에 들어간 뒤 대상 부품번호 10자리와 LOT 번호를 입력하고 조회를 클릭하면, 해당 부품이 최종 탑재 완료된 모든 완성차 VIN 리스트와 투입 라인 정보를 한 번에 추출해 낼 수 있습니다.",
      category: "OPERATION"
    },
    {
      id: 5,
      question: "조회 결과가 없으면 시스템 오류인가요?",
      answer: "대부분은 입력 양식 오류(대시 기호 유무), 공장 코드 불일치, 또는 실물 조립 전산과 전송 지연 배치 주기(통상 1시간) 때문이며 시스템 장애일 확률은 극히 낮습니다. 자가진단 메뉴를 돌려 기초 조건을 먼저 점검해 보세요.",
      category: "TROUBLE"
    },
    {
      id: 6,
      question: "신규 생산 데이터는 언제 GPTIS에 반영되나요?",
      answer: "국내 및 해외 생산공장 현장의 MES 원천 시스템 데이터는 매시 정각 1시간 단위 주기로 동기화 배치가 수행되어 GPTIS로 인입됩니다. 차량이 방금 라인을 통과했다면 약 1시간의 전산 반영 랙이 유발되니 대기 후 재조회해 보십시오.",
      category: "TROUBLE"
    },
    {
      id: 7,
      question: "메뉴가 보이지 않으면 어떻게 해야 하나요?",
      answer: "최근 부서 이동이 있었거나 계정을 신규 개설했다면, 아직 보안 조인 권한이 안 잡힌 상태일 수 있습니다. 우상단 프로필 메뉴의 '권한 신청' 코너로 이동하여 해당 메뉴 사용 결재 서류를 기안해 승인받으십시오.",
      category: "ADMIN"
    },
    {
      id: 8,
      question: "조회 결과를 엑셀로 다운로드할 수 있나요?",
      answer: "예, 조회 목록 그리드 우상단에 위치한 'Excel 다운로드' 단추를 통해 스프레드시트로 영구 저장이 가능합니다. 단, 브라우저 다운로드 팝업이 허용되어 있어야 하며 일회 다운로드 최대 행수는 안정성을 위해 10,000건으로 통제됩니다.",
      category: "OPERATION"
    },
    {
      id: 9,
      question: "다른 공장의 데이터도 조회할 수 있나요?",
      answer: "본인 소속 주관 공장 외 타 공장 조회가 급한 업무 파트너라면 '글로벌 다중공장 추적' 패널을 경유해 해외 법인을 스위칭할 수 있습니다. 단, 이 또한 결재를 통해 멀티 플랜트 조회 승인이 풀린 유저에게만 노출됩니다.",
      category: "ADMIN"
    },
    {
      id: 10,
      question: "운영자에게 문의할 때 어떤 정보를 전달해야 하나요?",
      answer: "정확하고 빠른 조사를 위해 (1) 발생 일시, (2) 사번/소속, (3) 조회 대상 메뉴, (4) 시도한 입력 파라미터(부품No/LOT), (5) 오류 스크린샷이 확보되어야 합니다. '자가진단' 결과를 완료하면 이 정보가 메일 서식으로 자동 클립보드에 가공 복사되니 편리하게 전달하실 수 있습니다.",
      category: "ADMIN"
    }
  ];

  const categories = [
    { id: "all", name: "전체 FAQ" },
    { id: "CONCEPT", name: "기초 개념" },
    { id: "OPERATION", name: "사용/조회법" },
    { id: "TROUBLE", name: "조회 해결" },
    { id: "ADMIN", name: "권한/계정" }
  ];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* FAQ Search bar */}
      <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="궁금한 질문 키워드 검색..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                filterCategory === cat.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs divide-y divide-gray-150 overflow-hidden">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-semibold text-xs">
            검색어에 매칭되는 해결 아코디언 FAQ 이력이 없습니다. 다른 질문을 찾아보세요.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="transition-colors">
                {/* Accordion Button */}
                <button
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition duration-150 focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 ${isOpen ? "text-blue-600" : "text-gray-400"} shrink-0`} />
                    <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4.5 w-4.5 text-blue-600 shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-gray-400 shrink-0 ml-3" />
                  )}
                </button>

                {/* Answer panel */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed bg-blue-50/10 border-t border-blue-50 animate-slide-down whitespace-pre-line">
                    <div className="pl-8 text-gray-600 font-semibold">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
