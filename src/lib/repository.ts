/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Guide, Category, GuideFeedback, SearchLog, AnalyticsEvent, ContentBlock } from "../types";

// Default Categories
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-trace-forward",
    name: "LOT 정방향 추적",
    description: "특정 부품 LOT 번호를 기반으로 어떤 차량(VIN)에 장착되었는지 영향 범위를 조사합니다.",
    icon: "ArrowRightLeft",
    displayOrder: 1,
  },
  {
    id: "cat-trace-backward",
    name: "차량 역방향 추적",
    description: "차량 차대번호(VIN)를 조회하여 차량에 조립된 모든 부품들의 생산 LOT 정보를 역추적합니다.",
    icon: "History",
    displayOrder: 2,
  },
  {
    id: "cat-receiving-history",
    name: "부품 입고 및 투입 이력",
    description: "협력사 부품이 공장에 입고된 후 서브 조립 라인에 실시간 투입된 이력을 모니터링합니다.",
    icon: "FileText",
    displayOrder: 3,
  },
  {
    id: "cat-factory-search",
    name: "생산공장 조회",
    description: "국내외 각 생산공장 라인 구성과 생산 스케줄, 공장 코드 기준정보를 조회합니다.",
    icon: "Factory",
    displayOrder: 4,
  },
  {
    id: "cat-vendor-info",
    name: "협력사 정보 조회",
    description: "부품을 납품하는 협력사 코드(Vendor Code), 공급 이력 및 신뢰성 평가 등급을 확인합니다.",
    icon: "Users",
    displayOrder: 5,
  },
  {
    id: "cat-impact-analysis",
    name: "품질 문제 영향 범위 확인",
    description: "품질 이슈가 발생한 특정 부품의 적용 일자, 대상 차량 및 재고 처리를 위한 범위를 정립합니다.",
    icon: "ShieldAlert",
    displayOrder: 6,
  },
  {
    id: "cat-download",
    name: "조회 결과 다운로드",
    description: "대량의 LOT 및 차량 리스트 데이터를 Excel 형식으로 대용량 다운로드하는 가이드입니다.",
    icon: "Download",
    displayOrder: 7,
  },
  {
    id: "cat-permission-settings",
    name: "권한 및 사용자 설정",
    description: "메뉴 접근 불가 권한 오류 해결 및 공장별 기본 조회 권한 세팅 등을 조절합니다.",
    icon: "Settings",
    displayOrder: 8,
  },
  {
    id: "cat-faq",
    name: "FAQ",
    description: "현장 사용자들이 가장 자주 묻는 질문들을 신속하게 한곳에서 모아 아코디언식으로 안내합니다.",
    icon: "HelpCircle",
    displayOrder: 9,
  },
  {
    id: "cat-terms",
    name: "GPTIS 용어",
    description: "현장 품질/생산 실무 용어와 GPTIS 시스템 내부 정합 메뉴어 사전을 매핑 및 대조해 줍니다.",
    icon: "BookOpen",
    displayOrder: 10,
  }
];

// Rich Sample Guides (12 items)
export const INITIAL_GUIDES: any[] = [
  {
    id: "guide-001",
    title: "특정 부품 LOT가 장착된 차량 찾기",
    summary: "문제가 확인된 부품 LOT를 기준으로 해당 부품이 장착된 차량 목록을 조회하는 정방향 추적 방법입니다.",
    categoryId: "cat-trace-forward",
    type: "TASK",
    status: "PUBLISHED",
    targetUsers: ["현장 품질 담당자", "부품 품질 분석원", "협력사 상주원"],
    difficulty: "MEDIUM",
    estimatedMinutes: 5,
    tags: ["LOT", "차량 조회", "정방향 추적", "영향 범위", "부품 추적"],
    synonyms: ["로트", "LOT", "lot", "차량 찾기", "정방향"],
    errorMessages: ["No Data Found", "조회 권한이 올바르지 않습니다"],
    prerequisites: ["부품번호 (10자리)", "부품 LOT 번호", "대상 생산공장 코드", "추적 대상 생산 기간"],
    viewCount: 1420,
    helpfulCount: 92,
    partiallyHelpfulCount: 5,
    notHelpfulCount: 3,
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-07-10T14:30:00Z",
    author: "홍길동 운영파트장",
    contentBlocks: [
      {
        id: "b1-1",
        type: "TEXT",
        title: "이 가이드를 사용하는 상황",
        body: "협력업체로부터 특정 기간에 생산된 부품에 결함이 있다는 통보를 받았거나, 현장 피드백을 통해 특정 부품 LOT의 품질 영향도를 파악하기 위해 해당 부품이 최종 탑재된 완성차 차량번호(VIN) 목록을 전수 조사할 때 활용합니다."
      },
      {
        id: "b1-2",
        type: "CHECKLIST",
        title: "시작 전 준비사항",
        items: [
          "분석하고자 하는 대상 부품의 10자리 부품번호 (예: 58101-H1A00)",
          "부품 표면에 마킹되거나 입고 바코드에 명시된 LOT 번호 (예: A23B15)",
          "해당 부품이 투입되어 완성차가 제작된 생산 공장 (예: 울산 1공장, 아산공장 등)",
          "검색할 기간 범위 (부품 입고일 기준으로 최소 앞뒤 1주일 권장)"
        ]
      },
      {
        id: "b1-3",
        type: "STEP",
        stepNumber: 1,
        title: "GPTIS 시스템 접속 및 메뉴 이동",
        menuPath: "GPTIS 메인 > 품질 추적성 관리 > LOT 정방향 추적 > [부품-완성차 매핑조회]",
        description: "GPTIS 포털 웹에 로그인한 후, 왼쪽 사이드 메뉴에서 '품질 추적성 관리'를 클릭하고 'LOT 정방향 추적' 그룹 아래의 '부품-완성차 매핑조회' 화면으로 진입합니다.",
        inputExample: "메뉴 경로 클릭",
        expectedResult: "부품번호 및 LOT 입력 필드가 포함된 검색 그리드가 우측 화면에 렌더링됩니다."
      },
      {
        id: "b1-4",
        type: "STEP",
        stepNumber: 2,
        title: "기본 공장 정보 및 필수 매개변수 입력",
        description: "상단 필터 바에서 조회할 '생산공장'(예: HMA, 울산1공장 등)을 필수로 지정한 뒤, 부품번호('58101-H1A00')를 정확하게 기입합니다. 연속으로 부품 LOT 번호 입력란에 'A23B15'를 채워 넣습니다.",
        inputExample: "부품번호: 58101-H1A00, LOT: A23B15 입력",
        expectedResult: "입력 칸 우측에 초록색 체크 마크가 생기며 형식 정합성이 확인됩니다."
      },
      {
        id: "b1-5",
        type: "STEP",
        stepNumber: 3,
        title: "조회 범위 날짜 및 조건 실행",
        description: "조회 날짜는 완성차 조립일 기준입니다. 일반적으로 '최근 30일'이 디폴트 세팅이므로, 필요시 기간 달력을 클릭하여 과거 일자로 날짜를 수정해 줍니다. 최종적으로 우측 상단의 [조회 (F8)] 버튼을 클릭합니다.",
        inputExample: "조회 기간: 2026-06-01 ~ 2026-07-01 지정 후 조회 버튼 클릭",
        expectedResult: "화면 중앙에 로딩 서클이 돌며 잠시 후 완성차 리스트 그리드가 하단에 출력됩니다."
      },
      {
        id: "b1-6",
        type: "RESULT_EXAMPLE",
        description: "조회가 완료되면 완성차 VIN 리스트(17자리 차대번호), 생산일시, 투입된 조립 작업장 라인명, 공정 운전자 정보가 일련번호 순으로 표시됩니다. 해당 차량들의 이력을 더블클릭하면 상세 차량 이력 모달로 이동 가능합니다."
      },
      {
        id: "b1-7",
        type: "WARNING",
        message: "주의: LOT 번호는 대소문자를 구분합니다. 특히 숫자 '0'과 영문 'O'를 잘못 입력하는 경우가 빈번하므로, 복사-붙여넣기 기능을 사용하거나 현물 바코드 값을 재확인하여 입력해 주세요."
      },
      {
        id: "b1-8",
        type: "TIP",
        message: "팁: 여러 개의 LOT 번호를 한 번에 일괄 조회하고 싶을 때에는 LOT 번호 입력칸 옆의 '다중 입력 [Button]'을 누르고 엑셀에서 복사한 목록을 붙여넣으면 최대 100개까지 한 번에 추적을 돌릴 수 있습니다."
      },
      {
        id: "b1-9",
        type: "CHECKLIST",
        title: "문제가 해결되지 않을 때 확인할 체크리스트",
        items: [
          "입력한 부품번호가 완성차 도면 기준 사양과 정확히 일치하는지 확인해 보세요.",
          "품질 불량 발생 LOT가 투입된 해외 공장이 누락되지 않았는지 '대상 법인/공장' 코드를 추가해 보세요.",
          "최근 24시간 이내에 완성차 조립 라인을 갓 통과한 차량의 경우 데이터 인터페이스 주기 문제로 아직 반영되지 않았을 수 있습니다. 1시간 뒤 재조회 해보세요."
        ]
      }
    ]
  },
  {
    id: "guide-002",
    title: "차량에 장착된 부품 LOT 확인하기",
    summary: "차량번호 또는 VIN(차대번호)을 기준으로 해당 완성 차량에 조립·장착된 주요 부품 LOT 정보를 한눈에 규명하는 역방향 추적 가이드입니다.",
    categoryId: "cat-trace-backward",
    type: "TASK",
    status: "PUBLISHED",
    targetUsers: ["정비 서비스 센터", "완성차 출고 품질팀", "현장 생산 관리원"],
    difficulty: "EASY",
    estimatedMinutes: 3,
    tags: ["VIN", "차량번호", "LOT 조회", "역방향 추적", "품질 이력"],
    synonyms: ["차량번호", "차대번호", "VIN", "vin", "역방향", "조립 이력"],
    errorMessages: ["Invalid VIN Format", "미매핑 차량"],
    prerequisites: ["차량 차대번호 (VIN, 17자리) 또는 완성차 차량번호"],
    viewCount: 980,
    helpfulCount: 88,
    partiallyHelpfulCount: 4,
    notHelpfulCount: 1,
    createdAt: "2026-01-15T11:00:00Z",
    updatedAt: "2026-07-11T16:15:00Z",
    author: "김지헌 선임연구원",
    contentBlocks: [
      {
        id: "b2-1",
        type: "TEXT",
        title: "이 가이드를 사용하는 상황",
        body: "품질 클레임이 인입된 특정 완성차 차량 1대에 어떤 협력사의 어떤 부품 LOT가 쓰였는지 역추적하고자 할 때 활용합니다. (예: 엔진 소음 차량의 엔진 일련번호 및 조립 LOT 확인)"
      },
      {
        id: "b2-2",
        type: "STEP",
        stepNumber: 1,
        title: "역방향 매핑 메뉴 접속",
        menuPath: "GPTIS 메인 > 품질 추적성 관리 > 차량 역방향 추적 > [완성차 조립이력 역추적]",
        description: "좌측 트리의 역방향 추적 하위 '완성차 조립이력 역추적' 기능을 활성화합니다.",
        expectedResult: "차대번호(VIN) 17자리를 입력할 수 있는 넓은 단일 입력창이 나타납니다."
      },
      {
        id: "b2-3",
        type: "STEP",
        stepNumber: 2,
        title: "VIN(차대번호) 기입",
        description: "조사하고자 하는 차량의 차대번호 17자리(예: KMHDK41BPJU123456)를 작성합니다. 17자리 글자가 모자라거나 초과하면 유효성 에러가 납니다.",
        inputExample: "KMHDK41BPJU123456",
        expectedResult: "조회 버튼이 파란색으로 활성화됩니다."
      },
      {
        id: "b2-4",
        type: "STEP",
        stepNumber: 3,
        title: "조회 실행 및 계통도 분석",
        description: "조회 버튼을 누르면 엔진, 변속기, 제동장치, 조향장치, 에어백 등 차량 핵심 안전/기능성 부품들의 명세가 트리 구조로 계통화되어 표기됩니다. 우측 칼럼에 각 부품들의 장착 LOT 번호 및 납품 협력사 정보가 나열됩니다.",
        expectedResult: "완성차 조립 이력 계통도와 부품 LOT 이력 리스트 매핑 출력 완료"
      },
      {
        id: "b2-5",
        type: "WARNING",
        message: "주의: 국산/수입 여부 및 생산법인(국내, HMA, BHMC 등) 세팅을 일치시켜야 검색됩니다. 기본 세팅이 국내공장으로 되어 있어 해외 공장 생산 차량의 경우 우상단 법인 셀렉트 박스에서 현지 법인을 먼저 전환해 주셔야 조회가 원활합니다."
      }
    ]
  },
  {
    id: "guide-003",
    title: "LOT 조회 결과가 없을 때 확인할 항목",
    summary: "검색한 부품번호와 LOT 정보의 조회가 불가능하거나 공백으로 출력되는 경우, 단계적으로 파악해야 할 실용 자가 체크 리스트 가이드입니다.",
    categoryId: "cat-permission-settings",
    type: "TROUBLESHOOTING",
    status: "PUBLISHED",
    targetUsers: ["공통 전체 사용자"],
    difficulty: "EASY",
    estimatedMinutes: 4,
    tags: ["조회 결과 없음", "데이터 없음", "LOT 검색", "문제 해결"],
    synonyms: ["안 나옴", "조회 안 됨", "결과 없음", "검색 실패", "데이터 안 나옴", "조회 실패"],
    errorMessages: ["No Record Found", "데이터 누락"],
    prerequisites: ["이전 검색에 사용했던 부품 번호 / LOT 번호"],
    viewCount: 2150,
    helpfulCount: 145,
    partiallyHelpfulCount: 12,
    notHelpfulCount: 8,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-07-12T09:20:00Z",
    author: "홍길동 운영파트장",
    contentBlocks: [
      {
        id: "b3-1",
        type: "TEXT",
        title: "조회 결과가 나오지 않는 가장 빈번한 3대 원인",
        body: "완성차 현물 차량은 지나가는데 GPTIS 조회가 되지 않을 경우 십중팔구는 (1) 협력사의 바코드 입고 리딩 누락, (2) 부품번호 자릿수 포맷 불일치(대시 및 띄어쓰기 등), (3) 공장 코드 선택 부정확성에서 유발됩니다. 시스템 장애 신고 전 아래 절차를 신속히 먼저 필터링해 보세요."
      },
      {
        id: "b3-2",
        type: "CHECKLIST",
        title: "오류 탈출 자가 진단 필수 체크 5문항",
        items: [
          "부품번호 포맷 검증: 현대기아 표준 부품코드 양식(예: 58101-H1A00 처럼 5-5자리 대시 조합)과 일치합니까? 공백이나 하이픈 기호가 왜곡되지 않았는지 확인하세요.",
          "검색 기간 범위 재설정: 완품 생산일보다 부품 생산/납품일이 1~2개월 더 빠를 수 있습니다. 조회 날짜 필터의 시작 기간을 3개월 전까지 넓혀서 다시 실행해보세요.",
          "바코드 전산 전송 완료 여부: 협력사 납품 시 모바일 PDA 단말기로 입고 검수 스캔을 거치지 않았다면, 시스템 상 실물 데이터가 입고 누락 상태일 수 있습니다. '부품 입고 및 투입 이력' 메뉴에서 해당 LOT 공급내역이 찍히는지 확인해 보세요.",
          "공장/공정 권한 설정: 본인 계정에 대상 생산 공장(예: 아산 2공정)의 조회가 정식 승인되어 있는지 마이페이지 권한 탭에서 점검해 보십시오.",
          "데이터 인터페이스 배치 동기화 주기: 협력사 공급망 ERP에서 생성된 데이터가 GPTIS로 적재되는 데에는 통상 1~2시간의 전송 지연이 발생할 수 있습니다."
        ]
      },
      {
        id: "b3-3",
        type: "ERROR_EXAMPLE",
        errorMessage: "No Data returned for parameters [PartNo=58101H1A00, Lot=A23]",
        possibleCauses: [
          "하이픈('-') 기호 생략으로 문자열 매칭 실패",
          "LOT 번호가 최소 6자리 이상 규격인데 일부 단축 키워드만 기입함",
          "선택된 공장 분류가 엉뚱한 법인으로 지정됨"
        ]
      }
    ]
  },
  {
    id: "guide-004",
    title: "접근 권한이 없다는 메시지가 표시될 때",
    summary: "특정 공정 또는 메뉴를 클릭했을 때 '권한 제한(Access Denied)' 혹은 메뉴 비활성화 현상이 생길 경우 권한을 신청하고 승인받는 절차입니다.",
    categoryId: "cat-permission-settings",
    type: "PERMISSION",
    status: "PUBLISHED",
    targetUsers: ["신규 입사자", "협력사 변경 사용자", "운영자"],
    difficulty: "EASY",
    estimatedMinutes: 3,
    tags: ["권한 오류", "메뉴 접근", "공장 권한", "사용자 권한"],
    synonyms: ["권한 없음", "접근 불가", "메뉴 안 보임", "Access Denied", "접근 제한"],
    errorMessages: ["Access Denied", "Unauthorized menu click"],
    prerequisites: ["사번 또는 사용자 ID", "소속 부서 결재선"],
    viewCount: 1670,
    helpfulCount: 110,
    partiallyHelpfulCount: 8,
    notHelpfulCount: 4,
    createdAt: "2026-02-10T14:00:00Z",
    updatedAt: "2026-07-05T13:40:00Z",
    author: "박상수 보안담당 주임",
    contentBlocks: [
      {
        id: "b4-1",
        type: "TEXT",
        body: "GPTIS는 완성차 내부 주요 품질 및 보안 자산 데이터를 다루므로, 부서 이동이나 신규 권한 부여 시 별도의 시스템 권한 신청 단계를 경유해야 보안 접근 제한이 풀립니다."
      },
      {
        id: "b4-2",
        type: "STEP",
        stepNumber: 1,
        title: "권한 오류 팝업 발생 위치와 에러 캡처",
        description: "화면에 '사용 권한이 없습니다' 경고창이 나타나면 이를 캡처해 두거나 팝업 상세의 에러 ID(예: ERR-AUTH-403)를 메모해 둡니다. 이는 권한 부서 매칭용 기초 자료입니다.",
        expectedResult: "에러 스크린샷 획득"
      },
      {
        id: "b4-3",
        type: "STEP",
        stepNumber: 2,
        title: "GPTIS 권한 셀프 포털 웹 이동",
        menuPath: "GPTIS 우상단 프로필 > [사용자 정보] > [권한 신청 및 결재 관리]",
        description: "화면 우상단 사용자 프로필 버튼을 누르고, 내 정보 변경 메뉴로 들어가 '권한 신청' 서브 탭을 활성화합니다.",
        expectedResult: "신청서 폼 팝업 렌더링"
      },
      {
        id: "b4-4",
        type: "STEP",
        stepNumber: 3,
        title: "대상 공장 법인 및 메뉴 검색 선택",
        description: "신청 정보 입력란에 내가 신규로 맡게 된 '대상 법인/생산공장' (예: HMMC 체코공장) 및 필요한 기능적 메뉴 그룹(예: 정방향 LOT추적 메뉴)을 선택 체크하고 사유를 구체적으로 기입한 후 [결재 요청]을 선택합니다.",
        inputExample: "체코공장 품질 이슈 발생에 따른 LOT 정방향 추적 권한 필요 기재",
        expectedResult: "결재 기안 완료 메시지가 표시되며 부서장 자동 결재선 지정"
      },
      {
        id: "b4-5",
        type: "TIP",
        message: "알림: 협력업체 임직원의 경우에는 자사 소속 공장 이외에 다른 타 협력업체 공장 정보를 보안상 절대 조회할 수 없습니다. 타사 정보가 부득이하게 필요한 업무 연계라면 당사 주관 품질팀 파트장님의 정식 공문 협조와 승인이 요구됩니다."
      }
    ]
  },
  {
    id: "guide-005",
    title: "신규 생산 데이터가 조회되지 않을 때",
    summary: "현장에서 완성차가 조립 중이거나 실시간 생산 라인을 경유했음에도 시스템에서 즉시 부품 매핑이 인식되지 않는 전산 전송 랙(Lag) 해결 가이드입니다.",
    categoryId: "cat-receiving-history",
    type: "TROUBLESHOOTING",
    status: "PUBLISHED",
    targetUsers: ["품질 엔지니어", "라인 제어 담당"],
    difficulty: "MEDIUM",
    estimatedMinutes: 5,
    tags: ["데이터 반영", "지연", "신규 데이터", "인터페이스", "실시간 데이터"],
    synonyms: ["미반영", "데이터 늦음", "실시간 안됨", "반영 지연", "데이터 누락"],
    errorMessages: ["Data synchronization delayed"],
    prerequisites: ["협력사 입고 완료 바코드 스캔 내역"],
    viewCount: 1100,
    helpfulCount: 62,
    partiallyHelpfulCount: 14,
    notHelpfulCount: 5,
    createdAt: "2026-03-01T15:00:00Z",
    updatedAt: "2026-07-01T11:10:00Z",
    author: "김지헌 선임연구원",
    contentBlocks: [
      {
        id: "b5-1",
        type: "TEXT",
        body: "실제 생산 라인에서 완성된 차량이라도 전산 원천 시스템(MES/ERP)의 원천 적재 배치 주기에 따라 GPTIS 시스템과의 데이터 전송 오차가 가끔 발생합니다."
      },
      {
        id: "b5-2",
        type: "CHECKLIST",
        title: "인터페이스 주기 확인 프로세스",
        items: [
          "라인 통과 시간 검토: 차량 품질 검사 완료 스탬프가 찍힌 지 아직 1시간 미만인가요? GPTIS는 1시간 간격 정시 주기로 미들웨어 배치 동기화가 돌아가므로 최대 60분 간의 지연이 일어납니다.",
          "서브공정 ERP 전송 체크: 해당 엔진/변속기 서브 조립 공장의 협력업체 출하 전산에서 현대글로비스 물류 ERP로 출하 승인이 정식 완료되었는지 사전 ERP 명세 번호를 체크하십시오.",
          "현장 서브라인 단말기 오프라인 여부: 생산라인의 PDA 무선 안테나 망에 와이파이 장애 등으로 데이터 임시 세이브 후 전송 보류 상태일 수 있으니, 무선 통신 모뎀 전원을 껐다 켜보세요."
        ]
      },
      {
        id: "b5-3",
        type: "WARNING",
        message: "해외 공장의 경우 시차 및 통신 회선 속도 편차로 데이터 동기화 배치가 최대 4시간까지 지연될 수 있습니다. 비상 상황으로 정밀 조회가 당장 급선무라면 수동으로 ERP 전산 이력을 조회하여 확인하십시오."
      }
    ]
  },
  {
    id: "guide-006",
    title: "조회 결과를 파일로 다운로드하기",
    summary: "검색해서 산출된 수만 건의 LOT 대량 데이터를 전산 먹통(멈춤) 없이 로컬 PC에 엑셀(Excel) 스프레드시트로 무사히 다운로드 및 보존하는 공식 방법입니다.",
    categoryId: "cat-download",
    type: "TASK",
    status: "PUBLISHED",
    targetUsers: ["공통 전체 사용자"],
    difficulty: "EASY",
    estimatedMinutes: 2,
    tags: ["다운로드", "엑셀", "조회 결과", "파일 저장"],
    synonyms: ["다운로드", "엑셀", "엑셀저장", "Excel", "엑셀 다운", "파일 저장"],
    errorMessages: ["Excel export limit exceeded", "브라우저 팝업 차단"],
    prerequisites: ["조회 결과 그리드가 출력된 화면"],
    viewCount: 1850,
    helpfulCount: 125,
    partiallyHelpfulCount: 3,
    notHelpfulCount: 2,
    createdAt: "2026-03-12T09:00:00Z",
    updatedAt: "2026-07-09T17:10:00Z",
    author: "홍길동 운영파트장",
    contentBlocks: [
      {
        id: "b6-1",
        type: "TEXT",
        body: "GPTIS에서 수천 건 이상의 조회 결과를 정식 보고하기 위해 엑셀로 내보내려다 간혹 브라우저 프리징이나 크래시가 납니다. 시스템 안정성을 보장하기 위해 한 번에 내려받을 수 있는 행(Row) 수는 최대 10,000건으로 통제됩니다."
      },
      {
        id: "b6-2",
        type: "STEP",
        stepNumber: 1,
        title: "조회 리스트 출력 및 다운로드 버튼 발굴",
        description: "데이터 조회를 정상 필터링하여 그리드가 표시되면 우상단 구석에 초록색 [Excel 다운로드] 혹은 플로팅 기어 아이콘을 탐색합니다.",
        expectedResult: "엑셀 다운로드 포맷 선택 다이얼로그 개방"
      },
      {
        id: "b6-3",
        type: "STEP",
        stepNumber: 2,
        title: "필드 양식 및 파일명 명명 규칙 지정",
        description: "모든 필드를 다 받을 필요가 없다면 '현재 컬럼 기준' 옵션을 체크하세요. 필요한 데이터만 정밀하게 내려받아 용량을 최적화할 수 있습니다. 파일명은 영문/숫자 기호 위주로 가급적 짧게 작성해 주세요.",
        inputExample: "Ulsan_PartTrace_20260714",
        expectedResult: "양식 생성 진행 게이지가 100% 도달"
      },
      {
        id: "b6-4",
        type: "STEP",
        stepNumber: 3,
        title: "브라우저 보안 팝업 허용 및 파일 다운로드",
        description: "만약 다운로드 진행률이 멈춰 있다면 크롬/엣지 브라우저의 주소창 우측에서 '다중 파일 다운로드 차단 팝업'이 활성화되어 차단되었는지 확인하시고, '허용'을 누르세요.",
        expectedResult: "내 컴퓨터 다운로드 폴더로 엑셀 파일 보존 완료"
      },
      {
        id: "b6-5",
        type: "WARNING",
        message: "주의: 다운로드 행 수가 10,000건을 넘어가면 자동으로 엑셀 분할 다운로드 팝업이 나타납니다. 1~10,000번, 10,001~20,000번씩 잘라서 복수 진행해 주세요."
      }
    ]
  },
  {
    id: "guide-007",
    title: "부품번호와 LOT 번호의 차이",
    summary: "품질 관리에 활용되는 핵심 속성인 부품번호(Part Number)와 생산 묶음 단위인 LOT 번호의 개념적 기술적 차이에 대한 완벽한 대조 및 용어 사전 가이드입니다.",
    categoryId: "cat-terms",
    type: "TERM",
    status: "PUBLISHED",
    targetUsers: ["신규 배치 사용자", "자재 실무자"],
    difficulty: "EASY",
    estimatedMinutes: 2,
    tags: ["부품번호", "LOT 번호", "용어", "기초상식"],
    synonyms: ["부품번호", "로트번호", "LOT번호", "용어 차이", "부품코드"],
    errorMessages: [],
    prerequisites: [],
    viewCount: 1350,
    helpfulCount: 118,
    partiallyHelpfulCount: 12,
    notHelpfulCount: 1,
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-07-02T15:20:00Z",
    author: "박상수 보안담당 주임",
    contentBlocks: [
      {
        id: "b7-1",
        type: "TEXT",
        body: "GPTIS에서 가장 빈번히 질문하는 기초 개념입니다. 부품번호는 부품의 '디자인/형태적 사양 종류'를 가리키며, LOT 번호는 그 사양을 '언제 어떤 묶음으로 생산했는지'를 규정하는 추적 인덱스입니다."
      },
      {
        id: "b7-2",
        type: "CHECKLIST",
        title: "한눈에 비교하는 차이점 명세",
        items: [
          "부품번호 (Part Number): 차량 도면에 부여된 고유 부품 설계 ID입니다. 동일 품종의 제품이라면 생산 연도/장소와 무관하게 완전히 동일한 번호를 공유합니다. (예: 아반떼 MD 전방 브레이크 패드 ID는 전 세계 공장 동일)",
          "LOT 번호 (LOT Number): 품질 추적을 위해 특정 일자, 특정 설비 라인에서 연속적으로 조립된 부품들의 최소 집합체 번호입니다. 불량 유발 범위 식별 시 전체 부품 교체가 아닌 문제 발생 LOT 범위에 해당하는 수십~수백 대 차량만 리콜하는 근거가 됩니다."
        ]
      },
      {
        id: "b7-3",
        type: "TIP",
        message: "상식: 보통 LOT 번호는 년/월/일과 협력업체 고유 생산조(A조, B조) 기호를 섞어 6~10자리 조합으로 수립하는 것이 품질 관리 관례입니다."
      }
    ]
  },
  {
    id: "guide-008",
    title: "정방향 추적과 역방향 추적의 차이",
    summary: "품질 신뢰성을 연결하는 Traceability의 양대 축인 정방향(Forward Tracking)과 역방향(Backward Tracking)의 시스템 시나리오별 차이 및 사용 용도 분석입니다.",
    categoryId: "cat-terms",
    type: "TERM",
    status: "PUBLISHED",
    targetUsers: ["공통 전체 사용자"],
    difficulty: "EASY",
    estimatedMinutes: 3,
    tags: ["정방향 추적", "역방향 추적", "Traceability", "추적성"],
    synonyms: ["정방향", "역방향", "추적 차이", "trace", "추적방향"],
    errorMessages: [],
    prerequisites: [],
    viewCount: 1250,
    helpfulCount: 96,
    partiallyHelpfulCount: 7,
    notHelpfulCount: 2,
    createdAt: "2026-04-05T14:00:00Z",
    updatedAt: "2026-07-03T10:15:00Z",
    author: "김지헌 선임연구원",
    contentBlocks: [
      {
        id: "b8-1",
        type: "TEXT",
        body: "GPTIS는 상향(Upward)과 하향(Downward) 추적을 동시에 구현하여 공장 내부의 모든 데이터 선순환을 지원합니다."
      },
      {
        id: "b8-2",
        type: "CHECKLIST",
        title: "업무 시나리오별 올바른 방향 선택 가이드",
        items: [
          "정방향 추적(Forward Trace): '협력업체 1차 부품 LOT'에서 출발하여 완성차 '차량 VIN'으로 나아가는 방향입니다. 목적: '불량 부품 LOT'의 전체 영향 완성차 리스트를 추출해 내어 긴급 출고 정지나 리콜을 집행할 때 씁니다.",
          "역방향 추적(Backward Trace): 특정 완성차 '차량 VIN'에서 거꾸로 출발하여 내부에 탑재된 '수십 종의 핵심 부품 생산 LOT/협력사 정보'를 파헤쳐 내려가는 방향입니다. 목적: 정비소에 입고된 차량의 시동 꺼짐 결함이 어느 특정 변속기 부품 LOT의 하자 때문인지를 밝혀내어 협력사 불량 구상 책임을 물을 때 주로 사용됩니다."
        ]
      }
    ]
  },
  {
    id: "guide-009",
    title: "협력사 코드가 검색되지 않을 때",
    summary: "신규로 입점했거나 거래를 개시한 부품 납품 협력사 코드(Vendor Code)가 시스템에서 검색 또는 적용이 불가할 때 기준정보 정합성 확인과 조치법입니다.",
    categoryId: "cat-vendor-info",
    type: "TROUBLESHOOTING",
    status: "PUBLISHED",
    targetUsers: ["자재 구매팀", "협력사 관리자", "운영자"],
    difficulty: "MEDIUM",
    estimatedMinutes: 4,
    tags: ["협력사", "협력사 코드", "기준정보", "검색 실패"],
    synonyms: ["협력사", "업체", "공급사", "벤더", "vendor", "업체코드"],
    errorMessages: ["Vendor Code is inactive", "No Vendor mapped"],
    prerequisites: ["정식 등록 요청된 4자리 협력사 코드"],
    viewCount: 950,
    helpfulCount: 74,
    partiallyHelpfulCount: 9,
    notHelpfulCount: 4,
    createdAt: "2026-05-01T13:00:00Z",
    updatedAt: "2026-07-06T15:45:00Z",
    author: "박상수 보안담당 주임",
    contentBlocks: [
      {
        id: "b9-1",
        type: "TEXT",
        body: "GPTIS는 부품 입고 관리 및 귀책 분석을 위해 현대 구매 연동 시스템(VAATZ)의 마스터 거래처 코드와 동기화됩니다. 만약 VAATZ에 새로 등록한 코드의 거래 상태가 미승인이거나, GPTIS 내부 전산과 동기화 전이라면 미검색 오류가 발생합니다."
      },
      {
        id: "b9-2",
        type: "STEP",
        stepNumber: 1,
        title: "VAATZ 원천 전산 거래 상태 확인",
        description: "구매 시스템 VAATZ 포털에 접속하여 대상 협력업체 코드 상태가 '활성화(Active)'로 정식 영업 거래 중인지 검증합니다.",
        expectedResult: "거래 상태가 '정상'으로 조회되어야 함"
      },
      {
        id: "b9-3",
        type: "STEP",
        stepNumber: 2,
        title: "GPTIS 마스터 정보 동기화 강제 배치 실행 위임",
        description: "만약 상태가 정상인데도 GPTIS에서 안 뜬다면, 매일 밤 12시에 돌아가는 자동 스케줄 동기화 주기 전일 수 있습니다. 만약 주간 업무 중 긴급 동기화가 급할 경우, 관리자 화면의 [협력사 마스터 수동 동기화] 트리거를 운영자에게 원클릭 요청하거나 1:1 상담 게시판에 코드 등록 수동 연동을 기재해 전달합니다.",
        inputExample: "업체코드: V123, 수동 동기화 요청 작성",
        expectedResult: "운영자의 강제 수동 배치 트리거를 통한 즉시 데이터 수혈 완료"
      }
    ]
  },
  {
    id: "guide-010",
    title: "다른 공장의 LOT 정보를 조회하는 방법",
    summary: "국내 공장 소속 사용자가 체코, 미국(HMA), 인도 등 해외 법인 공장의 부품 투입 및 완성차 탑재 LOT 데이터를 임시 또는 정식 크로스 오버로 조회하는 방법입니다.",
    categoryId: "cat-factory-search",
    type: "TASK",
    status: "PUBLISHED",
    targetUsers: ["글로벌 품질 통제원", "해외 사업부 엔지니어"],
    difficulty: "MEDIUM",
    estimatedMinutes: 4,
    tags: ["공장", "글로벌 공장", "다른 공장", "조회 권한", "해외법인"],
    synonyms: ["공장", "생산공장", "법인", "해외공장", "울산", "아산"],
    errorMessages: ["No plant privileges found"],
    prerequisites: ["해외 공장 코드명 및 승인된 글로벌 권한"],
    viewCount: 1120,
    helpfulCount: 84,
    partiallyHelpfulCount: 5,
    notHelpfulCount: 3,
    createdAt: "2026-05-15T09:30:00Z",
    updatedAt: "2026-07-08T11:40:00Z",
    author: "김지헌 선임연구원",
    contentBlocks: [
      {
        id: "b10-1",
        type: "TEXT",
        body: "기본적으로 GPTIS 계정은 가입 시 선택한 자사 소속 '단일 주관 공장' 정보만 조회할 수 있게 초기 세팅됩니다. 해외 품질 공조를 위해 다중 공장 데이터 스캔이 수반될 때 조회 공장을 필터링하여 스위칭하는 정당 절차를 준수해 보세요."
      },
      {
        id: "b10-2",
        type: "STEP",
        stepNumber: 1,
        title: "글로벌 플랜트 맵 조회",
        menuPath: "GPTIS 메인 > 품질 추적성 관리 > [글로벌 다중공장 추적]",
        description: "메뉴에서 '글로벌 다중공장 추적' 패널로 접속합니다. 멀티 공장 조회가 활성화된 유저에게만 접근이 열려있습니다.",
        expectedResult: "전 세계 글로벌 공장 맵 시뮬레이션 인터페이스가 오픈됨"
      },
      {
        id: "b10-3",
        type: "STEP",
        stepNumber: 2,
        title: "상단 타겟 법인 탭 변경",
        description: "화면 좌상단의 콤보박스에서 'HMA(미국)', 'BHMC(중국)', 'HMMC(체코)' 등 조회하려는 해외 생산 법인을 지정 후 [전환]을 누릅니다. 이를 통해 해당 공장의 전산 로컬 데이터베이스와 터널링 인터페이스가 일시 연동됩니다.",
        inputExample: "법인: HMA, 공장: HM1 (앨라배마 엔진공정) 지정",
        expectedResult: "검색 가능한 부품번호 마스터 포맷이 미국 전용 코드로 로딩 전환됨"
      }
    ]
  },
  {
    id: "guide-011",
    title: "운영자 문의 전 확인해야 할 정보",
    summary: "GPTIS 장애 발생이나 정형화된 데이터 누락으로 인해 운영 관리자에게 전산을 의뢰하기 전, 한 번에 원스톱으로 문제를 검증하고 문의 정보를 취합하는 체크 가이드입니다.",
    categoryId: "cat-faq",
    type: "FAQ",
    status: "PUBLISHED",
    targetUsers: ["공통 전체 사용자"],
    difficulty: "EASY",
    estimatedMinutes: 3,
    tags: ["운영자 문의", "오류 신고", "문의 정보", "장애 신고", "자가 진단"],
    synonyms: ["운영자", "문의", "질문", "전화번호", "문의사항", "메일", "장애"],
    errorMessages: [],
    prerequisites: [],
    viewCount: 1540,
    helpfulCount: 132,
    partiallyHelpfulCount: 8,
    notHelpfulCount: 1,
    createdAt: "2026-06-01T11:00:00Z",
    updatedAt: "2026-07-14T10:00:00Z",
    author: "홍길동 운영파트장",
    contentBlocks: [
      {
        id: "b11-1",
        type: "TEXT",
        body: "시스템 사용 중 해결되지 않는 장애나 데이터 누락으로 인해 1:1 온라인 헬프데스크 또는 전화 문의 시, 아래 9가지 체크리스트 정보를 텍스트로 미리 복사하여 전달해주시면 1분 이내에 긴급 접수 및 전산 트레이싱 추적이 즉각 개시됩니다."
      },
      {
        id: "b11-2",
        type: "CHECKLIST",
        title: "헬프데스크 긴급 접수용 9가지 마스터 항목",
        items: [
          "1. 장애 발생 정확한 일시 및 시간대 (예: 2026-07-14 14:15)",
          "2. 사용자 ID 및 소속 (예: 사번 26119999, 품질보증팀 홍길동)",
          "3. 사용 중이던 장치 및 브라우저 (예: Windows 11 PC, Edge 브라우저)",
          "4. 에러가 나타난 메뉴 경로 및 화면명 (예: LOT 정방향 추적 > 부품-완성차 매핑조회)",
          "5. 조회를 시도했던 정확한 파라미터 값 (부품번호: 58101-H1A00, LOT: A23B15)",
          "6. 모니터링된 구체적 오류 메시지 또는 코드 (예: ERR-DB-402 Timeout)",
          "7. 오류가 난 화면 전체의 정밀 캡처 이미지 첨부",
          "8. 동일한 조회를 주변 다른 동료 PC에서 시도했을 때도 똑같은 현상이 재현되는지 여부",
          "9. 협력사 원천 전산(ERP) 상에는 해당 데이터가 이미 정식 등록 완료되었는지 여부"
        ]
      },
      {
        id: "b11-3",
        type: "TIP",
        message: "팁: 본 가이드 웹사이트의 '자가진단' 메뉴를 돌리면 위 9가지 정보가 자동으로 클립보드로 완벽하게 양식 가공되어 [복사하기] 클릭 한 번에 문의 준비를 마칠 수 있습니다!"
      }
    ]
  },
  {
    id: "guide-012",
    title: "조회 화면이 느리거나 멈춘 것처럼 보일 때",
    summary: "조회 버튼을 클릭했으나 브라우저 대기 서클이 멈추지 않거나 시스템 응답 지연 타임아웃 오류가 발생할 때 실행하는 초스피드 브라우저 최적화 가이드입니다.",
    categoryId: "cat-permission-settings",
    type: "TROUBLESHOOTING",
    status: "PUBLISHED",
    targetUsers: ["공통 전체 사용자"],
    difficulty: "EASY",
    estimatedMinutes: 3,
    tags: ["성능", "느림", "타임아웃", "조회 지연", "브라우저 초기화", "멈춤"],
    synonyms: ["느림", "멈춤", "로딩", "타임아웃", "버벅임", "렉", "안 움직임"],
    errorMessages: ["Connection Timeout", "Request is too large"],
    prerequisites: ["인터넷 브라우저 브레이킹"],
    viewCount: 1290,
    helpfulCount: 95,
    partiallyHelpfulCount: 11,
    notHelpfulCount: 3,
    createdAt: "2026-06-10T16:00:00Z",
    updatedAt: "2026-07-13T15:30:00Z",
    author: "박상수 보안담당 주임",
    contentBlocks: [
      {
        id: "b12-1",
        type: "TEXT",
        body: "GPTIS의 추적 데이터베이스는 하루에도 수억 건에 달하는 트랜잭션 행을 가공하므로, 검색 기간을 너무 방대하게 잡거나 브라우저 캐시 데이터가 꼬일 경우 성능 병목 현상이 생깁니다."
      },
      {
        id: "b12-2",
        type: "CHECKLIST",
        title: "즉각 조치할 수 있는 성능 개선 비법 4항목",
        items: [
          "검색 기간을 최대 2주일 이내로 압축하십시오. 날짜 범위가 줄어들면 쿼리 스캔 면적이 감소하여 1초 이내에 완료됩니다.",
          "검색 필터에 '부품번호'나 '공업 코드' 등 유니크 인덱스 키를 하나라도 가급적 완벽히 적어 조회 분량을 좁히세요.",
          "브라우저 캐시 클렌징: 키보드 단축키 'Ctrl + Shift + R'을 눌러 브라우저 강제 강력 새로고침을 실행하면 낡은 스크립트 캐시가 말끔히 초기화됩니다.",
          "사내 인트라넷 통신 가속 망이 과부하 상태일 수 있습니다. 우측 상단의 '서버 지연 자율 속도 테스트' 체크를 수행해 속도를 파악하세요."
        ]
      }
    ]
  }
];

// Helper to expand synonyms for search
const SYNONYM_MAP: Record<string, string[]> = {
  "로트": ["LOT", "lot", "로트번호", "로트 번호"],
  "LOT": ["로트", "lot", "로트번호", "로트 번호"],
  "lot": ["로트", "LOT", "로트번호", "로트 번호"],
  "차량번호": ["VIN", "vin", "차대번호", "차량 번호", "완성차"],
  "차대번호": ["VIN", "vin", "차량번호", "차량 번호", "완성차"],
  "VIN": ["차량번호", "차대번호", "vin", "완성차"],
  "vin": ["차량번호", "차대번호", "VIN", "완성차"],
  "안 나옴": ["조회 결과가 없음", "결과 없음", "검색 실패", "데이터 없음", "안나옴", "조회 안 됨"],
  "조회 안 됨": ["조회 결과가 없음", "결과 없음", "검색 실패", "데이터 없음", "안 나옴", "조회 안됨"],
  "결과 없음": ["조회 결과가 없음", "안 나옴", "검색 실패", "데이터 없음", "조회 안 됨"],
  "검색 실패": ["조회 결과가 없음", "결과 없음", "안 나옴", "데이터 없음", "조회 안 됨"],
  "권한 없음": ["접근 불가", "메뉴 안 보임", "Access Denied", "접근 제한", "권한오류", "권한이 없"],
  "접근 불가": ["권한 없음", "메뉴 안 보임", "Access Denied", "접근 제한", "권한오류"],
  "메뉴 안 보임": ["권한 없음", "접근 불가", "메뉴 보이지 않", "접근 제한", "메뉴안보임"],
  "느림": ["멈춤", "로딩", "타임아웃", "지연", "렉", "버벅임"],
  "멈춤": ["느림", "로딩", "타임아웃", "지연", "렉", "버벅임", "프리징"],
  "로딩": ["느림", "멈춤", "타임아웃", "지연", "렉"],
  "타임아웃": ["느림", "멈춤", "로딩", "지연", "렉", "Timeout"],
  "협력사": ["업체", "공급사", "벤더", "vendor", "업체코드"],
  "업체": ["협력사", "공급사", "벤더", "vendor"],
  "공급사": ["협력사", "업체", "벤더", "vendor"],
  "공장": ["생산공장", "법인", "울산", "아산", "플랜트", "plant"],
  "생산공장": ["공장", "법인", "울산", "아산", "플랜트", "plant"],
  "법인": ["공장", "생산공장", "해외법인", "해외 공장"]
};

// Repository implementation backing localStorage
export class LocalStorageGuideRepository {
  private static STORAGE_KEY = "gptis_guides";
  private static FEEDBACK_KEY = "gptis_feedbacks";
  private static SEARCH_LOGS_KEY = "gptis_search_logs";
  private static BOOKMARKS_KEY = "gptis_bookmarks";
  private static RECENT_VIEWS_KEY = "gptis_recent_views";
  private static ANALYTICS_EVENTS_KEY = "gptis_analytics_events";

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(LocalStorageGuideRepository.STORAGE_KEY)) {
      const formatted = INITIAL_GUIDES.map(g => ({
        ...g,
        relatedGuideIds: g.relatedGuideIds || []
      }));
      localStorage.setItem(LocalStorageGuideRepository.STORAGE_KEY, JSON.stringify(formatted));
    }
    if (!localStorage.getItem(LocalStorageGuideRepository.FEEDBACK_KEY)) {
      localStorage.setItem(LocalStorageGuideRepository.FEEDBACK_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageGuideRepository.SEARCH_LOGS_KEY)) {
      localStorage.setItem(LocalStorageGuideRepository.SEARCH_LOGS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageGuideRepository.BOOKMARKS_KEY)) {
      localStorage.setItem(LocalStorageGuideRepository.BOOKMARKS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageGuideRepository.RECENT_VIEWS_KEY)) {
      localStorage.setItem(LocalStorageGuideRepository.RECENT_VIEWS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageGuideRepository.ANALYTICS_EVENTS_KEY)) {
      localStorage.setItem(LocalStorageGuideRepository.ANALYTICS_EVENTS_KEY, JSON.stringify([]));
    }
  }

  // --- GUIDES ---
  async getAll(): Promise<Guide[]> {
    const data = localStorage.getItem(LocalStorageGuideRepository.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<Guide | null> {
    const guides = await this.getAll();
    const guide = guides.find(g => g.id === id);
    if (guide) {
      // Increment view count dynamically
      guide.viewCount += 1;
      await this.saveGuides(guides);
      await this.logRecentView(id);
      await this.logEvent("guide_opened", { guideId: id, title: guide.title });
      return guide;
    }
    return null;
  }

  private async saveGuides(guides: Guide[]): Promise<void> {
    localStorage.setItem(LocalStorageGuideRepository.STORAGE_KEY, JSON.stringify(guides));
  }

  // Exact scoring algorithm based on rules:
  // 1. Title exact match (score += 100)
  // 2. Title partial match (score += 50)
  // 3. Synonym match (score += 40)
  // 4. Tag match (score += 30)
  // 5. Error message match (score += 25)
  // 6. Summary match (score += 20)
  // 7. Body content block text match (score += 10)
  async search(query: string, filters?: { categoryId?: string; type?: string; difficulty?: string }): Promise<Guide[]> {
    const guides = await this.getAll();
    const activeGuides = guides.filter(g => g.status === "PUBLISHED");
    
    const trimmedQuery = query.trim().toLowerCase();
    
    // Log search event
    const searchLogId = "log-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    
    if (!trimmedQuery) {
      let filtered = activeGuides;
      if (filters?.categoryId) filtered = filtered.filter(g => g.categoryId === filters.categoryId);
      if (filters?.type) filtered = filtered.filter(g => g.type === filters.type);
      if (filters?.difficulty) filtered = filtered.filter(g => g.difficulty === filters.difficulty);
      return filtered;
    }

    // Identify matching synonyms
    const synonymsToSearch: string[] = [trimmedQuery];
    Object.entries(SYNONYM_MAP).forEach(([key, values]) => {
      if (trimmedQuery.includes(key.toLowerCase()) || key.toLowerCase().includes(trimmedQuery)) {
        values.forEach(v => {
          if (!synonymsToSearch.includes(v.toLowerCase())) {
            synonymsToSearch.push(v.toLowerCase());
          }
        });
      }
    });

    const keywords = trimmedQuery.split(/\s+/).filter(Boolean);

    interface ScoredGuide {
      guide: Guide;
      score: number;
    }

    const scoredList: ScoredGuide[] = [];

    activeGuides.forEach(g => {
      let score = 0;
      const lowerTitle = g.title.toLowerCase();
      const lowerSummary = g.summary.toLowerCase();

      // Check filters
      if (filters?.categoryId && g.categoryId !== filters.categoryId) return;
      if (filters?.type && g.type !== filters.type) return;
      if (filters?.difficulty && g.difficulty !== filters.difficulty) return;

      // Rule 1: Title exact match
      if (lowerTitle === trimmedQuery) {
        score += 100;
      }

      // Process keywords / synonyms
      keywords.forEach(kw => {
        // Rule 2: Title partial match
        if (lowerTitle.includes(kw)) {
          score += 50;
        }

        // Rule 4: Tag match
        const matchesTag = g.tags.some(t => t.toLowerCase().includes(kw));
        if (matchesTag) {
          score += 30;
        }

        // Rule 5: Error message match
        const matchesError = g.errorMessages.some(e => e.toLowerCase().includes(kw));
        if (matchesError) {
          score += 25;
        }

        // Rule 6: Summary match
        if (lowerSummary.includes(kw)) {
          score += 20;
        }

        // Rule 7: Content body text match
        g.contentBlocks.forEach(cb => {
          if (cb.type === "TEXT" && cb.body.toLowerCase().includes(kw)) {
            score += 10;
          } else if (cb.type === "STEP") {
            if (cb.title.toLowerCase().includes(kw) || cb.description.toLowerCase().includes(kw)) {
              score += 10;
            }
          } else if (cb.type === "WARNING" && cb.message.toLowerCase().includes(kw)) {
            score += 10;
          } else if (cb.type === "TIP" && cb.message.toLowerCase().includes(kw)) {
            score += 10;
          } else if (cb.type === "CHECKLIST" && (cb.title.toLowerCase().includes(kw) || cb.items.some(item => item.toLowerCase().includes(kw)))) {
            score += 10;
          }
        });
      });

      // Rule 3: Synonym match
      synonymsToSearch.forEach(syn => {
        if (syn !== trimmedQuery) { // avoid double scoring exact
          if (lowerTitle.includes(syn)) {
            score += 40;
          }
          if (g.tags.some(t => t.toLowerCase().includes(syn))) {
            score += 20; // lower weight for synonyms in secondary fields
          }
          if (lowerSummary.includes(syn)) {
            score += 15;
          }
        }
      });

      if (score > 0) {
        scoredList.push({ guide: g, score });
      }
    });

    // Sort by score descending
    scoredList.sort((a, b) => b.score - a.score);
    const results = scoredList.map(s => s.guide);

    // Save search log
    const logs = this.getSearchLogsInternal();
    logs.push({
      id: searchLogId,
      query,
      resultCount: results.length,
      selectedGuideId: results[0]?.id || undefined,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(LocalStorageGuideRepository.SEARCH_LOGS_KEY, JSON.stringify(logs));

    // Log Analytics Event
    if (results.length === 0) {
      await this.logEvent("search_no_result", { query });
    } else {
      await this.logEvent("search_submitted", { query, resultsCount: results.length });
    }

    return results;
  }

  async create(input: Omit<Guide, 'id' | 'viewCount' | 'helpfulCount' | 'partiallyHelpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>): Promise<Guide> {
    const guides = await this.getAll();
    const newGuide: Guide = {
      ...input,
      id: "guide-" + Date.now(),
      viewCount: 0,
      helpfulCount: 0,
      partiallyHelpfulCount: 0,
      notHelpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    guides.push(newGuide);
    await this.saveGuides(guides);
    await this.logEvent("admin_guide_created", { guideId: newGuide.id, title: newGuide.title, status: newGuide.status });
    return newGuide;
  }

  async update(id: string, input: Partial<Guide>): Promise<Guide> {
    const guides = await this.getAll();
    const idx = guides.findIndex(g => g.id === id);
    if (idx === -1) {
      throw new Error(`Guide with id ${id} not found`);
    }
    const updatedGuide = {
      ...guides[idx],
      ...input,
      updatedAt: new Date().toISOString()
    };
    guides[idx] = updatedGuide;
    await this.saveGuides(guides);
    await this.logEvent("admin_guide_updated", { guideId: id, title: updatedGuide.title, status: updatedGuide.status });
    return updatedGuide;
  }

  async delete(id: string): Promise<boolean> {
    const guides = await this.getAll();
    const filtered = guides.filter(g => g.id !== id);
    if (filtered.length === guides.length) return false;
    await this.saveGuides(filtered);
    await this.logEvent("admin_guide_deleted", { guideId: id });
    return true;
  }

  // --- BOOKMARKS ---
  async getBookmarks(): Promise<string[]> {
    const data = localStorage.getItem(LocalStorageGuideRepository.BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async toggleBookmark(guideId: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    const idx = bookmarks.indexOf(guideId);
    let isBookmarked = false;
    if (idx > -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(guideId);
      isBookmarked = true;
    }
    localStorage.setItem(LocalStorageGuideRepository.BOOKMARKS_KEY, JSON.stringify(bookmarks));
    await this.logEvent("guide_bookmarked", { guideId, isBookmarked });
    return isBookmarked;
  }

  // --- RECENT VIEWS ---
  async getRecentViews(): Promise<{ guideId: string; viewedAt: string }[]> {
    const data = localStorage.getItem(LocalStorageGuideRepository.RECENT_VIEWS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private async logRecentView(guideId: string): Promise<void> {
    let recent = await this.getRecentViews();
    // Remove existing
    recent = recent.filter(r => r.guideId !== guideId);
    // Add to front
    recent.unshift({ guideId, viewedAt: new Date().toISOString() });
    // Trim to 20
    if (recent.length > 20) {
      recent = recent.slice(0, 20);
    }
    localStorage.setItem(LocalStorageGuideRepository.RECENT_VIEWS_KEY, JSON.stringify(recent));
  }

  // --- FEEDBACKS ---
  async addFeedback(feedback: Omit<GuideFeedback, 'id' | 'createdAt'> & { status?: string; adminMemo?: string }): Promise<GuideFeedback & { status: string; adminMemo: string }> {
    const feedbacks = this.getFeedbacksInternal();
    const newFb = {
      ...feedback,
      id: "fb-" + Date.now(),
      status: feedback.status || "미확인", // '미확인', '확인 중', '가이드 수정 필요', '시스템 확인 필요', '처리 완료'
      adminMemo: feedback.adminMemo || "",
      createdAt: new Date().toISOString()
    };
    feedbacks.push(newFb);
    localStorage.setItem(LocalStorageGuideRepository.FEEDBACK_KEY, JSON.stringify(feedbacks));

    // Increment count on target guide
    const guides = await this.getAll();
    const guide = guides.find(g => g.id === feedback.guideId);
    if (guide) {
      if (feedback.result === "SOLVED") guide.helpfulCount += 1;
      else if (feedback.result === "PARTIALLY_SOLVED") guide.partiallyHelpfulCount += 1;
      else guide.notHelpfulCount += 1;
      await this.saveGuides(guides);
    }

    await this.logEvent("feedback_submitted", { guideId: feedback.guideId, result: feedback.result });
    return newFb;
  }

  async getAllFeedback(): Promise<any[]> {
    return this.getFeedbacksInternal();
  }

  async updateFeedbackStatus(id: string, status: string, adminMemo?: string): Promise<void> {
    const feedbacks = this.getFeedbacksInternal();
    const fb = feedbacks.find(f => f.id === id);
    if (fb) {
      fb.status = status;
      if (adminMemo !== undefined) {
        fb.adminMemo = adminMemo;
      }
      localStorage.setItem(LocalStorageGuideRepository.FEEDBACK_KEY, JSON.stringify(feedbacks));
    }
  }

  private getFeedbacksInternal(): any[] {
    const data = localStorage.getItem(LocalStorageGuideRepository.FEEDBACK_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getSearchLogsInternal(): SearchLog[] {
    const data = localStorage.getItem(LocalStorageGuideRepository.SEARCH_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getSearchLogs(): Promise<SearchLog[]> {
    return this.getSearchLogsInternal();
  }

  // --- ANALYTICS ---
  async logEvent(eventName: string, metadata: Record<string, string | number | boolean>): Promise<void> {
    const events = this.getEventsInternal();
    const event: AnalyticsEvent = {
      id: "evt-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      eventName,
      timestamp: new Date().toISOString(),
      metadata
    };
    events.push(event);
    localStorage.setItem(LocalStorageGuideRepository.ANALYTICS_EVENTS_KEY, JSON.stringify(events));
  }

  async getEvents(): Promise<AnalyticsEvent[]> {
    return this.getEventsInternal();
  }

  private getEventsInternal(): AnalyticsEvent[] {
    const data = localStorage.getItem(LocalStorageGuideRepository.ANALYTICS_EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Helper to completely reset storage to default (useful for testing or reset button)
  async resetToDefaults(): Promise<void> {
    localStorage.setItem(LocalStorageGuideRepository.STORAGE_KEY, JSON.stringify(INITIAL_GUIDES));
    localStorage.setItem(LocalStorageGuideRepository.FEEDBACK_KEY, JSON.stringify([]));
    localStorage.setItem(LocalStorageGuideRepository.SEARCH_LOGS_KEY, JSON.stringify([]));
    localStorage.setItem(LocalStorageGuideRepository.BOOKMARKS_KEY, JSON.stringify([]));
    localStorage.setItem(LocalStorageGuideRepository.RECENT_VIEWS_KEY, JSON.stringify([]));
    localStorage.setItem(LocalStorageGuideRepository.ANALYTICS_EVENTS_KEY, JSON.stringify([]));
  }
}

// Single active repository instance
export const guideRepository = new LocalStorageGuideRepository();
