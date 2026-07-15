/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight
} from "lucide-react";
import { Guide } from "../types";

interface SelfDiagnosisProps {
  publishedGuides: Guide[];
  onOpenGuide: (guideId: string) => void;
  id?: string;
}

interface Question {
  id: number;
  text: string;
  options: { label: string; nextQuestionId: number | null; resultTag?: string }[];
}

export const SelfDiagnosis: React.FC<SelfDiagnosisProps> = ({
  publishedGuides,
  onOpenGuide,
  id = "self-diagnosis-flow"
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [history, setHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // stepeed question flow mapping
  const questions: Record<number, Question> = {
    1: {
      id: 1,
      text: "현재 GPTIS 시스템에서 어떤 문제가 발생했나요?",
      options: [
        { label: "조회 버튼을 클릭했으나 결과가 공백으로 나오거나 '결과 없음'이 뜹니다.", nextQuestionId: 2, resultTag: "조회결과없음" },
        { label: "메뉴 자체가 보이지 않거나 특정 클릭 버튼이 비활성 상태입니다.", nextQuestionId: 3, resultTag: "메뉴비활성" },
        { label: "화면 가득히 '권한 오류 (Access Denied)' 혹은 제한 경고창이 나옵니다.", nextQuestionId: 4, resultTag: "권한오류" },
        { label: "조회 결과 리스트는 뜨지만 실제 어제/오늘 현장 생산 실물값과 다릅니다.", nextQuestionId: 5, resultTag: "데이터불일치" },
        { label: "조회 속도가 극히 느리거나 '타임아웃(Timeout)' 통신장애 팝업이 뜹니다.", nextQuestionId: 6, resultTag: "속도느림" }
      ]
    },
    2: {
      id: 2,
      text: "동일한 조건으로 옆자리 동료 PC에서 조회했을 때도 똑같이 조회가 되지 않나요?",
      options: [
        { label: "예, 다른 사람 PC에서도 동일한 부품번호/LOT가 전혀 나오지 않습니다.", nextQuestionId: null, resultTag: "데이터반영누락" },
        { label: "아니오, 다른 사람 컴퓨터에서는 정상 조회가 완료됩니다.", nextQuestionId: null, resultTag: "개인권한포맷오류" },
        { label: "확인하지 못했습니다 / 기타 조건", nextQuestionId: null, resultTag: "기초조건포맷오류" }
      ]
    },
    3: {
      id: 3,
      text: "GPTIS 시스템을 새로 회원가입하셨거나, 최근 부서 이동이 있었나요?",
      options: [
        { label: "예, 이번 주에 신규 가입했거나 신규 업무 파트로 이동 배치되었습니다.", nextQuestionId: null, resultTag: "권한미신청상태" },
        { label: "아니오, 이전까지 잘 쓰다가 갑자기 오늘 안 보입니다.", nextQuestionId: null, resultTag: "일시적권한만료" }
      ]
    },
    4: {
      id: 4,
      text: "지금 들어가려 하시는 공정 메뉴가 본인 주관 소속 공장(예: 울산) 이외의 타 공장인가요?",
      options: [
        { label: "예, 타 지역공장 또는 해외 법인(HMA, 체코 등)의 정보를 클릭했습니다.", nextQuestionId: null, resultTag: "글로벌멀티공장권한부족" },
        { label: "아니오, 제 소속의 원 주관 라인 공장입니다.", nextQuestionId: null, resultTag: "메뉴권한부족" }
      ]
    },
    5: {
      id: 5,
      text: "실물 조립 완료 도장 스탬프가 리딩된 지 몇 분이나 흘렀나요?",
      options: [
        { label: "완성차가 조립 검사 라인을 통과한 지 10분 미만으로 아주 갓 통과했습니다.", nextQuestionId: null, resultTag: "실시간배치랙" },
        { label: "완성차가 통과한 지 대략 30분 ~ 1시간 정도 지났습니다.", nextQuestionId: null, resultTag: "배치인터페이스대기" },
        { label: "조립 완료된 지 4시간 이상, 혹은 이틀 이상 경과한 자재 데이터입니다.", nextQuestionId: null, resultTag: "협력사바코드스캔누락" }
      ]
    },
    6: {
      id: 6,
      text: "조회 날짜 조건 기간을 달력에서 며칠로 지정하셨나요?",
      options: [
        { label: "과거 통계 수립을 위해 3개월 이상의 장기간 대량 데이터를 한 번에 조회 중입니다.", nextQuestionId: null, resultTag: "대량쿼리병목" },
        { label: "1주일 이내 혹은 오늘 당일 범위로 짧게 지정했습니다.", nextQuestionId: null, resultTag: "브라우저메모리캐시누락" }
      ]
    }
  };

  const handleOptionSelect = (option: Question["options"][0]) => {
    // Record answer
    setAnswers({
      ...answers,
      [`Q${currentStep}`]: option.label
    });

    if (option.nextQuestionId !== null) {
      setHistory([...history, currentStep]);
      setCurrentStep(option.nextQuestionId);
    } else {
      // Flow completed, move to result step
      setHistory([...history, currentStep]);
      setCurrentStep(100); // 100 represents outcome screen
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStep(prev);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setHistory([]);
    setAnswers({});
    setCopied(false);
  };

  // Determine dynamic diagnostic result based on choices
  const getDiagnosticResult = () => {
    const lastAnswerQ2 = answers["Q2"];
    const lastAnswerQ3 = answers["Q3"];
    const lastAnswerQ4 = answers["Q4"];
    const lastAnswerQ5 = answers["Q5"];
    const lastAnswerQ6 = answers["Q6"];

    if (answers["Q1"]?.includes("결과가 공백")) {
      if (lastAnswerQ2?.includes("다른 사람 PC에서도 동일")) {
        return {
          title: "데이터 반영 지연 및 협력사 전송 누락 의심",
          confidence: "매우 높음 (90%)",
          description: "현장 차량은 제작 완료되었으나 해당 부품 LOT 바코드 데이터가 원천 시스템에서 GPTIS로 유입되지 않은 상태입니다.",
          checks: [
            "협력사 측에서 자재 출하 시 PDA 바코드 리딩 단계를 빼먹었는지 검증이 급선무입니다.",
            "물류 시스템(VAATZ/GLOVIS)에 정식 출고 승인이 찍혔는지 자재 파트에 조회 요청하세요."
          ],
          guideLink: "guide-003", // LOT 조회 결과가 없을 때
          relatedGuideTitle: "LOT 조회 결과가 없을 때 확인할 항목"
        };
      }
      if (lastAnswerQ2?.includes("다른 사람 컴퓨터에서는 정상")) {
        return {
          title: "개인 권한 범위 또는 브라우저 로컬 캐시 엉킴",
          confidence: "높음 (85%)",
          description: "동료의 PC에서는 정상 조회가 가능한 것으로 보아, 시스템 데이터 결함이 아닌 사용자 계정 고유의 공장 권한 불일치 또는 크롬 쿠키 상태 오류입니다.",
          checks: [
            "우상단 프로필 메뉴를 눌러 소속 공장과 본인 권한 정보에 '울산/아산' 등 해당 공장이 인가되었는지 확인하세요.",
            "키보드 'Ctrl + Shift + R'을 눌러 브라우저 캐시를 강력 리클렌징하고 재시도하세요."
          ],
          guideLink: "guide-003",
          relatedGuideTitle: "LOT 조회 결과가 없을 때 확인할 항목"
        };
      }
    }

    if (answers["Q1"]?.includes("메뉴 자체가 보이지")) {
      if (lastAnswerQ3?.includes("신규 가입했거나")) {
        return {
          title: "신규 발령 및 계정 권한 미인가 상태",
          confidence: "확실함 (99%)",
          description: "소속 팀 발령이나 계정 신설 이후, 해당 품질 추적 메뉴에 관한 정식 보안 결재 승인이 내려지지 않은 공실 상태입니다.",
          checks: [
            "GPTIS 프로필 메뉴 > '권한 신청' 서브 탭으로 이동하여 결재 기안을 올리세요.",
            "파트장 결재선 승인 완료 후 즉시 활성화됩니다."
          ],
          guideLink: "guide-004", // 접근 권한이 없다는 메시지
          relatedGuideTitle: "접근 권한이 없다는 메시지가 표시될 때"
        };
      }
    }

    if (answers["Q1"]?.includes("권한 오류")) {
      if (lastAnswerQ4?.includes("해외 법인")) {
        return {
          title: "글로벌 크로스오버 다중공장 조회 권한 누락",
          confidence: "확실함 (95%)",
          description: "국내 본사 망 계정으로는 원칙적으로 수입 차종 및 해외 법인(HMA, KMC, BHMC)의 원천 조립 추적망에 함부로 파고들 수 없습니다.",
          checks: [
            "운영자 문의란을 통해 해외 공장 데이터 수동 스키마 매핑 크로스 권한을 공식 결재 결부해 신청하셔야 합니다.",
            "타사 보안 영역의 경우 주관 품질 파트장의 협조 공문이 필수입니다."
          ],
          guideLink: "guide-010", // 다른 공장 조회 방법
          relatedGuideTitle: "다른 공장의 LOT 정보를 조회하는 방법"
        };
      }
      return {
        title: "기본 메뉴 접근 제한",
        confidence: "높음 (80%)",
        description: "해당 메뉴 보안 등급이 사용자 계정 직급 또는 직무 범위 바깥에 머물러 있습니다.",
        checks: [
          "보안 승인 권한 변경 신청서 양식을 제출하여 정당한 승인을 획득해 주십시오."
        ],
        guideLink: "guide-004",
        relatedGuideTitle: "접근 권한이 없다는 메시지가 표시될 때"
      };
    }

    if (answers["Q1"]?.includes("실물값과 다릅니다")) {
      if (lastAnswerQ5?.includes("10분 미만")) {
        return {
          title: "초실시간 미들웨어 배치 지연 (데이터 미들랙)",
          confidence: "매우 높음 (95%)",
          description: "원천 조립 라인의 ERP 전산 데이터가 GPTIS에 가공 매핑 적재되는 데에는 최소 30분 ~ 최대 1시간의 시간적 버퍼 배치가 존재합니다.",
          checks: [
            "현재 조립 중인 차량은 정시 배치가 완료되기 전까지 공백으로 뜹니다.",
            "통상 1시간 뒤 자동 동기화 배치가 완료된 다음 다시 클릭해 보세요."
          ],
          guideLink: "guide-005", // 신규 생산 데이터 조회 불가
          relatedGuideTitle: "신규 생산 데이터가 조회되지 않을 때"
        };
      }
      if (lastAnswerQ5?.includes("4시간 이상")) {
        return {
          title: "협력사 공급망 실물 스캔 누락 이력 발생",
          confidence: "높음 (75%)",
          description: "시간이 충분히 경과했음에도 누락된 것은 전산 문제가 아니라 실물 생산 시 바코드 리더 검수가 누락되어 원천 누락 공실 데이터가 올라간 현상입니다.",
          checks: [
            "협력사 자재팀 측에 수동 ERP 공급 이력 증명 명세서 조정을 요청하십시오."
          ],
          guideLink: "guide-009", // 협력사 코드 미검색
          relatedGuideTitle: "협력사 코드가 검색되지 않을 때"
        };
      }
    }

    if (answers["Q1"]?.includes("속도가 극히 느리거나")) {
      if (lastAnswerQ6?.includes("3개월 이상")) {
        return {
          title: "대용량 DB 조회 쿼리 타임아웃 병목",
          confidence: "확실함 (95%)",
          description: "수백만 건의 원천 데이터베이스를 한꺼번에 Full-Scan 하느라 DB 방화벽 및 쿼리 연산에 과부하가 생겨 브라우저가 타임아웃 멈춤으로 빠진 현상입니다.",
          checks: [
            "조회 시작-종료 날짜 범위를 '1주일 이내' 또는 '최대 2주일 이내'로 압축 세팅하여 데이터 양을 좁히세요.",
            "부품번호 10자리 규격을 정확히 같이 입력하여 인덱스 조건 스캔을 유도하십시오."
          ],
          guideLink: "guide-012", // 조회 느림/멈춤
          relatedGuideTitle: "조회 화면이 느리거나 멈춘 것처럼 보일 때"
        };
      }
    }

    // Default Fallback
    return {
      title: "정밀 운영자 분석 및 원천 서버 체크 대상",
      confidence: "중간 (60%)",
      description: "일반적인 자가조치 영역을 이탈한 원인 불명의 일시적 데이터 랙이거나 시스템 보안 충돌입니다.",
      checks: [
        "아래 양식 정보를 복사하여 GPTIS 1:1 온라인 헬프데스크 운영진에게 이메일 또는 메신저로 긴급 이관해 주십시오."
      ],
      guideLink: "guide-011", // 운영자 문의 전 확인사항
      relatedGuideTitle: "운영자 문의 전 확인해야 할 정보"
    };
  };

  // Formats diagnostic report 9 items into unified Korean text block
  const formatReportText = () => {
    const outcome = getDiagnosticResult();
    const timestamp = new Date().toLocaleString("ko-KR");
    const formattedAnswers = Object.entries(answers)
      .map(([q, a]) => {
        const qNum = q.replace("Q", "");
        const qText = questions[Number(qNum)]?.text || q;
        return `  └ ${qText}: ${a}`;
      })
      .join("\n");

    return `==========================================
[GPTIS 자가진단 종합 리포트 및 운영자 문의 서식]
==========================================
1. 진단 시간: ${timestamp}
2. 임시 사용자 ID: ${navigator.userAgent.substring(0, 30)} (데모 사용자)
3. 장애 유형 및 증상: ${answers["Q1"] || "미지정"}
4. 자가문답 선택 이력:
${formattedAnswers}
5. 시스템 분석 결과:
  - 의심 지점: ${outcome.title} (신뢰도: ${outcome.confidence})
  - 설명: ${outcome.description}
6. 자가 권장 조치사항:
${outcome.checks.map((c, i) => `  * ${i + 1}. ${c}`).join("\n")}
7. 연관 긴급 가이드: [${outcome.relatedGuideTitle}]
8. 재현 여부: 지속적 재현 발생
9. 원천 ERP 바코드 매핑 여부: 확인 불가
==========================================`;
  };

  const handleCopyToClipboard = () => {
    const text = formatReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const question = questions[currentStep];

  return (
    <div id={id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 shadow-xs">
      {/* Upper header icon and info */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
        <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">GPTIS 문제 셀프 자가진단</h2>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            전화 문의 없이, 몇 번의 예/아니오 대답만으로 증상 원인을 좁혀 해결책을 제시해 드립니다.
          </p>
        </div>
      </div>

      {currentStep !== 100 ? (
        // ACTIVE QUESTION STEP
        <div className="space-y-6">
          {/* Question Indicator progress bar */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              진행 중: 질문 단계 #{history.length + 1}
            </span>
            <div className="flex gap-1">
              {Object.keys(questions).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 w-8 rounded ${
                    idx <= history.length ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-blue-50/20 border border-blue-100/50 p-4.5 rounded-xl">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              {question?.text}
            </h3>
          </div>

          {/* Options Button List */}
          <div className="space-y-2.5">
            {question?.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionSelect(opt)}
                className="w-full text-left p-4 bg-white hover:bg-blue-50/40 border border-gray-200 hover:border-blue-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-900 shadow-xs hover:shadow-sm transition flex items-center justify-between group cursor-pointer"
              >
                <span>{opt.label}</span>
                <ChevronRight className="h-4.5 w-4.5 text-gray-400 group-hover:text-blue-600 transition shrink-0 ml-3" />
              </button>
            ))}
          </div>

          {/* Stepper Back Actions */}
          {history.length > 0 && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                이전 질문으로 가기
              </button>
            </div>
          )}
        </div>
      ) : (
        // FINAL DIAGNOSIS RESULT SCREEN
        <div className="space-y-6 animate-fade-in">
          {(() => {
            const outcome = getDiagnosticResult();
            return (
              <>
                {/* Result Block Card */}
                <div className="bg-blue-600 text-white rounded-xl p-5.5 shadow-md">
                  <span className="text-[9px] bg-blue-500 font-bold px-2 py-0.5 rounded text-blue-100 uppercase tracking-widest block w-max mb-1.5">
                    셀프 검출 원인 판정
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">{outcome.title}</h3>
                  <p className="text-xs text-blue-100/90 mt-2 leading-relaxed">
                    {outcome.description}
                  </p>
                  <div className="mt-3 text-[11px] font-semibold text-blue-200 flex items-center gap-1.5">
                    <span>원인 추정 정확도 신뢰선:</span>
                    <span className="bg-blue-700 px-1.5 py-0.5 rounded text-white">{outcome.confidence}</span>
                  </div>
                </div>

                {/* Checks List */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    현장에서 즉시 수행해야 할 자가 조치 목록
                  </h4>
                  <ul className="space-y-3">
                    {outcome.checks.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        <span className="inline-flex h-5 w-5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Link to matching Guide */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">추천 연관 가이드 바로가기</span>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">{outcome.relatedGuideTitle}</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenGuide(outcome.guideLink)}
                    className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    가이드 열기
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Copy report block details */}
                <div className="border border-gray-200 rounded-xl p-5 space-y-3.5 bg-gray-50/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4.5 w-4.5 text-gray-500" />
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">헬프데스크 전달용 복사 텍스트 양식</h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyToClipboard}
                      className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-700 px-2.5 py-1.5 rounded-lg shadow-xs transition"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-green-600 font-bold">복사 완료!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>양식 복사하기</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Text representation */}
                  <pre className="p-3 bg-gray-950 text-gray-200 rounded-lg text-[10px] sm:text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    {formatReportText()}
                  </pre>
                </div>

                {/* Reset Buttons */}
                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    새로 자가진단 시작하기
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
