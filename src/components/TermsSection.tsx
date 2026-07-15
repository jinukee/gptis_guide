/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Book, Search, ArrowRightLeft } from "lucide-react";

interface TermItem {
  name: string;
  engName?: string;
  consonant: string; // 'ㅂ', 'ㄹ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㄷ'
  definition: string;
  practicalUsage: string;
}

export const TermsSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedConsonant, setSelectedConsonant] = useState("all");

  const termsList: TermItem[] = [
    {
      name: "LOT",
      engName: "생산 관리 최소 추적 묶음 단위",
      consonant: "ㄹ",
      definition: "동일하거나 유사한 생산 조건(동일 설비, 동일 원자재 투입, 동일 작업 시간대) 하에 한 그룹으로 연속 생산되어 완성된 부품들의 최소 집합 관리 단위입니다.",
      practicalUsage: "품질 검증 상 중대 오결함이 식별되었을 때, 전체 리콜이 아닌 불량이 유발된 '특정 LOT 범위(예: 300개)'만 공인 선별 교체 처리하여 보상 구상 및 리스크 발생 비용을 대폭 축소하는 데 핵심 지표로 사용됩니다."
    },
    {
      name: "부품번호",
      engName: "Part Number",
      consonant: "ㅂ",
      definition: "완성차 도면 및 자재 표준 기준정보 상에 기재된 부품 종류, 형태, 설계 규격 및 호환성을 상호 명확히 식별하기 위한 10자리 고유 설계 기호 코드입니다.",
      practicalUsage: "예: '58101-H1A00'과 같이 현대기아차 표준 자재 사양 식별 시 대조 및 정합 입력 기준이 됩니다."
    },
    {
      name: "VIN",
      engName: "Vehicle Identification Number (차대번호)",
      consonant: "ㅊ",
      definition: "완성차 출고 및 등록을 규율하기 위해 차량 전면 윈드실드나 차체 프레임에 마킹되는 전 세계 유일무이한 17자리 식별 차대코드입니다.",
      practicalUsage: "차량이 공장에서 최종 생산 완료되면 이 VIN 17자리 밑으로 계통화된 모든 협력사의 조립 부품번호와 투입 LOT가 연결 수렴되어 전산 영구 보존됩니다."
    },
    {
      name: "정방향 추적",
      engName: "Forward Tracking (상향 추적)",
      consonant: "ㅈ",
      definition: "협력사에서 생산된 최초의 '부품 LOT 번호'를 추적 시작점으로 지정하여, 최종적으로 해당 부품이 탑재 완결되어 출고된 완성차 '차량 VIN 리스트'를 선별해 올라가는 정추적 시나리오입니다.",
      practicalUsage: "협력업체로부터 자재 제작 공정 하자 소명을 받았을 때, 리콜 출고 보류 조치가 필요한 타겟 완성차 대상을 완벽하게 발라내기 위해 사용됩니다."
    },
    {
      name: "역방향 추적",
      engName: "Backward Tracking (하향 추적)",
      consonant: "ㅇ",
      definition: "클레임이 접수된 완성차 단 1대의 '차량 VIN 번호'를 기초 추적 기점으로 기입하여, 해당 완성차 제작 단계에 쓰인 수십여 종의 엔진/샤시/안전 부품의 생산 LOT와 제조 협력업체를 하부로 거슬러 내려가며 도출하는 역추적 방식입니다.",
      practicalUsage: "A/S 정비 현장에서 엔진 소음 등 특이 클레임 차량 유입 시 해당 부품이 어느 사 소속 제품인지 귀책 사를 발췌하기 위한 기초 역추적 수단입니다."
    },
    {
      name: "추적성",
      engName: "Traceability (계통 추적 정합성)",
      consonant: "ㅊ",
      definition: "제품의 제조, 원자재 입고, 서브 공정 조립, 최종 완성 및 고객 정비 입고 이력에 이르는 전 주기의 정보를 공실 데이터 누락 없이 실시간 전산 기록하여 한 이력으로 연결시키는 시스템적 품질 역량입니다.",
      practicalUsage: "GPTIS는 현대차그룹 완성차와 협력사 간 이 Traceability를 한 웹에서 조회하도록 돕는 정예 툴입니다."
    },
    {
      name: "데이터 반영 지연",
      engName: "Data Sync Lag (인터페이스 주기)",
      consonant: "ㄷ",
      definition: "현장 완성차 조립 MES 및 구매 GL ERP 전산 등의 거래처 원천 적재 이력이 GPTIS와 주기적 정시 동기화(통상 1시간 단위 배치 스케줄) 전이라 데이터에 반영되지 않은 전산 오프라인 상태입니다.",
      practicalUsage: "품질 분석 시 방금 완성된 차량은 인터페이스 배치가 완성된 약 1시간 뒤부터 GPTIS에서 데이터 매핑 확인이 정식으로 열립니다."
    }
  ];

  const consonants = [
    { id: "all", name: "전체" },
    { id: "ㅂ", name: "ㅂ" },
    { id: "ㄹ", name: "ㄹ" },
    { id: "ㅇ", name: "ㅇ" },
    { id: "ㅈ", name: "ㅈ" },
    { id: "ㅊ", name: "ㅊ" },
    { id: "ㄷ", name: "ㄷ" }
  ];

  const filteredTerms = termsList.filter((t) => {
    const matchesConsonant = selectedConsonant === "all" || t.consonant === selectedConsonant;
    const matchesSearch =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.definition.toLowerCase().includes(query.toLowerCase()) ||
      (t.engName && t.engName.toLowerCase().includes(query.toLowerCase()));
    return matchesConsonant && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Terms filter Header */}
      <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="품질 용어 사전 검색 (예: 로트, 정방향)..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-950 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Consonants list */}
        <div className="flex flex-wrap gap-1.5">
          {consonants.map((con) => (
            <button
              key={con.id}
              onClick={() => setSelectedConsonant(con.id)}
              className={`h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold border transition ${
                selectedConsonant === con.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {con.name}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 font-semibold text-xs">
            매칭되는 품질 및 GPTIS 도메인 사양 용어가 없습니다.
          </div>
        ) : (
          filteredTerms.map((term, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-blue-50 text-blue-700 text-xs font-bold rounded-md flex items-center justify-center shrink-0">
                    {term.consonant}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">{term.name}</h4>
                    {term.engName && (
                      <span className="text-[9px] text-gray-400 font-semibold block uppercase tracking-tight">
                        {term.engName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {term.definition}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 bg-gray-50/50 p-2.5 rounded-lg">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  실무 활용 시나리오 예시
                </span>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {term.practicalUsage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
