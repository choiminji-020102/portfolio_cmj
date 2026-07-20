export interface ChallengeStep {
  description: string;
  code?: { language: string; content: string };
}

export interface Challenge {
  id: string;
  title: string;
  summary: string;
  problem: string;
  decision: string;
  diagramId?: string;
  steps: ChallengeStep[];
  result: string;
}

export interface FeatureScreenshot {
  src: string;
  caption: string;
  type: "before" | "after";
}

export interface Feature {
  id: string;
  title: string;
  summary: string;
  description: string;
  coreLogic: string;
  relatedChallengeIds: string[];
  screenshots?: FeatureScreenshot[];
}

export interface ProblemSolution {
  title: string;
  problem: string[];
  solution: string[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  problemSolutions: ProblemSolution[];
  role: string;
  teamSize: number;
  period: string;
  status: "완료" | "진행 중" | "유지보수";
  tags: string[];
  features: Feature[];
  challenges: Challenge[];
  results: string[];
  github: string;
  demo: string | null;
}

export const projects: Project[] = [
  {
    slug: "magazine-manager",
    title: "월간지 구독관리 시스템",
    summary:
      "실제 월간지 출판사의 구독자 관리·발송·정산 업무를 디지털화한 내부 관리자 전용 웹 시스템",
    problemSolutions: [
      {
        title: "Cafe24 배송 상태 수작업",
        problem: [
          "정기구독 주문을 단품과 구분하려면 Cafe24에서 건별로 배송준비중→배송대기로 수동 전환해야 했음",
          "전환 시 운송사·운송장번호 필수 — 기출유 우편이라 전부 '자체배송'으로 동일하지만 Cafe24에서 일괄 적용 불가",
          "수백 건을 하나씩 직접 입력하는 단순 반복 작업이 매월 발생",
        ],
        solution: [
          "import 시점에 정기구독 전체를 Cafe24 API로 일괄 배송대기 등록",
          "발급된 shipping_code를 저장해두고, 매월 발송 완료 시 이 코드만으로 배송중 자동 전환",
        ],
      },
      {
        title: "매달 5~20건 미배송",
        problem: [
          "Cafe24는 정기구독 첫 달 이후 월별 배송을 추적하지 않아 3,200건을 엑셀로 수기 관리",
          "매월 1일 기출유 발송 명단 제출 시 해당 월 활성 구독건을 눈으로 직접 골라 기입",
          "매달 5~20건 미배송 발생 — 재배송마다 배송비·포장비·상품값 추가 낭비",
        ],
        solution: [
          "구독자별 구독 기간·상태·발송 이력을 DB로 관리",
          "매월 발송 시 구독 범위·휴지 여부·발송 이력 조건으로 자동 필터링해 명단 생성",
          "발송 전 구독 시작~목표 호 직전 구간을 순회해 누락 호 사전 감지",
        ],
      },
      {
        title: "구독 변경 이력 소실",
        problem: [
          "취소·휴지·기간 이동·연장·단축을 모두 전화 문의로만 접수",
          "엑셀에서 해당 고객을 찾아 값을 직접 수정 — 비고란에 '주소 변경(26.06.26)'처럼 날짜만 기록",
          "덮어쓰는 방식이라 변경 전 데이터는 영구 소실, 이전 상태 확인 불가",
        ],
        solution: [
          "구독 변경 작업별 전용 API 제공 (취소·휴지·연장·단축·기간이동)",
          "최초 계약 필드(불변)와 현재 유효 기간 필드(가변)를 이중 설계해 원본 계약 항상 추적 가능",
          "모든 변경 작업은 활동 로그에 자동 기록",
        ],
      },
      {
        title: "단품·VIP 발송 암묵지 의존",
        problem: [
          "매일 오후 3시까지 Cafe24 배송준비중 건을 엑셀로 옮겨 단품 명단 작성 — 합포장 대상은 눈으로 직접 판단",
          "상품 종류마다 발송 경로가 달랐음 (기본판·큰글자판은 기출유 택배, 나머지는 관리자가 우체국에서 직접 발송)",
          "인근 주민 직접 배송, 집필진·목사님 무상 제공, 해외 배송 등 예외 케이스가 엑셀 색깔 표시와 담당 관리자 기억에만 의존",
          "담당 관리자 출장·휴가 시 다른 관리자가 이 규칙을 알 방법이 없어 처리 불가",
        ],
        solution: [
          "단품 발송 대상을 자동 수집하고 우편번호+수령 주소 기준으로 합포장 자동화",
          "VIP 슬롯으로 예외 케이스를 시스템에 명시적으로 등록 — 일반 명단에서 자동 제외되고 VIP 탭에서 별도 처리",
          "발송 흐름과 대상이 시스템에 정의되어 담당자 교체·부재와 무관하게 동일하게 처리 가능",
        ],
      },
    ],
    role: "기획, 요구사항 분석, DB 설계, 백엔드/프론트엔드 개발, 서버 배포까지 전 과정 단독 수행",
    teamSize: 1,
    period: "2025년 10월 ~ 현재",
    status: "유지보수",
    tags: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "MySQL",
      "Alembic",
      "React",
      "TypeScript",
      "TailwindCSS",
      "React Query",
      "JWT",
    ],
    features: [
      {
        id: "send-dispatch",
        title: "발송 자동화",
        summary:
          "정기구독·단품·VIP 3종 발송 흐름 자동 그룹화. 엑셀 다운로드 → 물류 업체 전송 → 발송 완료 일괄 처리",
        description:
          "매월 발송 처리를 위해 물류 업체에 구독자 명단을 엑셀로 제출합니다. 정기구독은 매월 1일 약 3,500건, 단품은 매일 정리해서 제출합니다.\n\n발송 준비(PREPARING) 박스를 생성하고, 엑셀 다운로드 → 물류 업체 전송 → 발송 완료(DELIVERED) 처리까지 전 과정이 시스템 안에서 이루어집니다. VIP 발송(교회·학교 등 단체)은 별도 탭에서 독립적으로 관리합니다.",
        coreLogic:
          "발송은 PREPARING(발송 준비)과 DELIVERED(발송 완료) 2단계로 운영됩니다.\n\n그룹화 실행 시 PAID 상태 주문 품목을 종류별로 분류하고, 각 흐름에 맞는 그룹화 함수를 통과시켜 SendGroup(박스 묶음) 리스트를 생성합니다. 세 함수 모두 동일한 SendGroup 데이터클래스를 반환하기 때문에, 이후 Send/SendItem 레코드 생성 함수는 발송 유형에 관계없이 동일한 인터페이스로 처리합니다.",
        relatedChallengeIds: ["send-grouping", "duplicate-send-prevention"],
      },
      {
        id: "subscription-period",
        title: "구독 기간 관리",
        summary:
          "구독 연장·단축·기간변경·휴지(일시중지) 지원. 단축 시 환불 금액 자동 계산 후 2단계 확정",
        description:
          "정기구독 품목의 구독 기간을 연장하거나 단축하고, 시작 호를 앞당기거나 미룰 수 있습니다. 특정 호를 지정해 발송을 일시 중지(휴지)하는 기능도 지원합니다.\n\n단축 처리는 확정 전 환불 금액을 미리 계산해 관리자가 확인한 뒤 최종 확정하는 2단계로 이루어집니다.",
        coreLogic:
          "구독 기간 변경 작업은 모두 단일 공식을 통해 재계산됩니다.\n\n실효 종료 호 = f(실효 시작 호, 구독 개월 수) + 활성 휴지 수\n\n연장·단축 시 구독 개월 수를 먼저 갱신하고, 휴지는 별도 카운트로 항상 공식 위에 얹습니다. 어떤 순서로 작업이 쌓여도 이 함수 하나를 거치면 종료 호가 항상 정합성을 유지합니다.",
        relatedChallengeIds: ["subscription-period-design"],
      },
      {
        id: "cafe24-integration",
        title: "Cafe24 연동",
        summary:
          "OAuth 2.0 인증, 주문 자동 import. 금액 3중 검증과 주문 단위 독립 트랜잭션으로 안전하게 처리",
        description:
          "Cafe24 쇼핑몰 주문을 내부 DB로 자동으로 가져옵니다. 날짜 범위를 선택해 주문 목록을 불러오고, 원하는 주문을 선택해 import할 수 있습니다.\n\nimport 전 미리보기 모드로 매핑·검증 결과를 먼저 확인할 수 있고, import 후 Cafe24 주문 화면에서 배송 상태를 확인할 수 있도록 배송 레코드를 자동으로 등록합니다.",
        coreLogic:
          "API embed 기능으로 목록 조회 1번에 구매자·수령인·품목 정보를 모두 받아와 N+1 호출을 방지합니다.\n\n주문 단위 독립 트랜잭션으로 처리해 실패한 주문만 건너뛰고 나머지는 정상 저장합니다. 두 관리자가 동시에 같은 주문을 import할 때 발생하는 DB 고유 제약 위반은 별도로 포착해 안전하게 처리합니다.\n\nimport 단계에서 단가·합계·결제금 3중 금액 검증을 수행하며, 하나라도 맞지 않으면 해당 주문은 건너뛰고 실패 사유를 반환합니다.",
        relatedChallengeIds: ["cafe24-oauth", "cafe24-shipping-sync"],
      },
      {
        id: "customer-order",
        title: "고객·주문 관리",
        summary:
          "Cafe24·GP몰·오프라인 채널 통합 관리. 전화번호 뒤 4자리 즉시 검색, 주문 취소 상태 이원화",
        description:
          "Cafe24, GP몰, 오프라인 3개 채널 주문을 통합해 관리합니다. 전화 상담 시 번호 마지막 4자리로 즉시 고객을 검색할 수 있습니다.\n\n주문 취소 시 결제 상태에 따라 CANCELLED(결제 완료 후 취소 → 환불 필요)와 UNPAID_CANCELLED(결제 전 취소 → 환불 불필요)를 구분합니다.",
        coreLogic:
          "고객 식별 키는 (전화번호, 이름) 복합 Unique입니다. 같은 번호라도 이름이 다르면 별도 고객으로 분리됩니다.\n\n주문 생성은 8단계 파이프라인으로 처리됩니다.\n1. 외부 주문번호 중복 검증\n2. 고객 조회 또는 생성\n3. 배송지 조회 또는 생성\n4. 상품 유효성 검증\n5. 금액 계산 (배송비 자동 설정)\n6. 주문 생성\n7. 주문 품목 생성 (구독 시작/종료 호 자동 계산)\n8. 고객 최근 주문일 업데이트",
        relatedChallengeIds: ["customer-unique-key"],
      },
      {
        id: "role-based-access",
        title: "역할 기반 권한 제어",
        summary:
          "SUPER_ADMIN / ADMIN / MANAGER 3단계 권한 분리. JWT 이중 토큰 인증, Refresh Token DB 폐기 관리",
        description:
          "SUPER_ADMIN, ADMIN, MANAGER 3단계 권한으로 기능 접근을 제어합니다. 관리자 계정 생성·삭제·권한 변경은 SUPER_ADMIN만 가능합니다.\n\n계정은 소프트 삭제(삭제 여부)와 활성화 상태(로그인 가능 여부)를 분리해 관리합니다. 삭제된 계정은 복구 가능하며, 일시 비활성화만으로도 로그인을 차단할 수 있습니다.",
        coreLogic:
          "JWT Access Token + Refresh Token 이중 발급 방식으로 인증합니다. Refresh Token은 DB에 저장하며 JWT 유효성과 DB 폐기 여부를 모두 확인합니다.\n\n로그인 성공 시 기존 refresh token을 전부 폐기해 동시 세션을 차단합니다. 비밀번호 변경 시에도 모든 refresh token이 폐기됩니다. 이메일 없음/비밀번호 틀림은 같은 에러 메시지로 반환해 계정 존재 여부 노출을 차단합니다.",
        relatedChallengeIds: [],
      },
      {
        id: "order-create-ui",
        title: "주문 수기 등록 UI 개선",
        summary:
          "상품 선택 필터 단계화, 구독기간 년 단위 변환·판매가 자동 연동, 실시간 소계 표시 등 5가지 UX 개선으로 등록 오류와 불편함을 해소",
        description:
          "오프라인·GP몰 주문을 관리자가 직접 입력하는 수기 주문 등록 화면에서 반복적으로 발생하던 UX 문제를 개선했습니다.\n\n기존에는 활성 상품 전체가 한 번에 나열되어 종류·월호가 뒤섞여 스크롤이 길었고, 구독기간이 월 단위였지만 실제 계약은 년 단위로 이루어져 입력 혼란이 생겼습니다. 구독기간을 변경해도 판매가가 자동으로 반영되지 않는 치명적인 버그도 있었습니다.\n\n또한 선택된 품목이 카드 형태로 표시되어 여러 항목이 쌓이면 한눈에 비교하기 어려웠고, 수량을 바꿔도 소계를 4단계 최종 확인 화면에서만 확인할 수 있었습니다.",
        coreLogic:
          "구독기간 입력 단위를 월에서 년으로 변경하면서 백엔드 스키마(subscribe_period, 월 단위)와 UI 표현을 분리했습니다.\n\nUI에는 subscribe_years(년 단위)와 base_sale_price(1년 단가 기준값)를 별도 상태로 관리합니다. 구독기간 스테퍼를 조작하면 sale_price = base_sale_price × subscribe_years 로 즉시 재계산됩니다. 제출 시에만 subscribe_period = subscribe_years × 12 로 변환해 백엔드에 전달합니다.\n\n소계(sale_price × order_num)는 수량·판매가·구독기간 중 하나라도 바뀌면 자동으로 반영됩니다. 스텝 4의 상품금액 합산 로직도 동일한 수식을 사용해 일관성을 보장합니다.",
        relatedChallengeIds: [],
        screenshots: [
          {
            src: "/magazine-manager/before_1.png",
            caption: "개선 전 — 모든 상품이 한 번에 나열되어 스크롤이 길고 종류·월호가 뒤섞임",
            type: "before",
          },
          {
            src: "/magazine-manager/before_2.png",
            caption: "개선 전 — 선택 품목이 카드 형태, 구독기간 월 단위 입력, 소계 없음",
            type: "before",
          },
          {
            src: "/magazine-manager/after.png",
            caption: "개선 후 — 구독 종류 → 책 종류 단계별 필터, 테이블 행 형태, 구독기간 년 단위·판매가 자동 연동, 실시간 소계",
            type: "after",
          },
        ],
      },
      {
        id: "statistics",
        title: "통계 대시보드",
        summary:
          "채널별 주문 현황, 구독 종류별 분포, 월별 추이를 차트로 시각화",
        description:
          "채널별(Cafe24·GP몰·오프라인) 주문 현황, 정기구독·단품 구독자 분포, 월별 신규 주문 추이를 시각화한 대시보드를 제공합니다.\n\n관리자가 전체 운영 현황을 한눈에 파악할 수 있도록 주요 지표를 수치와 차트로 함께 표시합니다.",
        coreLogic:
          "백엔드에서 SQLAlchemy 집계 쿼리로 통계 데이터를 계산해 반환합니다. 프론트엔드에서는 Recharts 라이브러리로 차트를 렌더링합니다.\n\nReact Query로 데이터를 캐시해 불필요한 재요청을 방지합니다.",
        relatedChallengeIds: [],
      },
    ],
    challenges: [
      {
        id: "subscription-period-design",
        title: "구독 기간 이중 필드 설계",
        summary:
          "불변 원본 필드와 가변 실효 필드를 분리하고 단일 공식으로 재계산해 구독 기간 정합성을 보장",
        problem:
          "정기구독은 연장, 단축, 기간 이동, 휴지 생성, 휴지 삭제 다섯 가지 작업으로 구독 범위가 바뀝니다.\n\n문제의 본질은 실효 종료 호가 독립적인 데이터가 아닌 파생값이라는 점입니다. 이 값은 실효 시작 호, 구독 개월 수, 활성 휴지 수 세 입력으로 완전히 결정됩니다.\n\n실효 종료 호를 직접 증감하면 원인(세 입력값)과 결과(종료 호)를 두 곳에서 따로 관리하게 됩니다. 기간 이동 작업이 이 문제를 가장 선명하게 드러냅니다. 시작 호를 3개월 앞당기면 종료 호도 정확히 같은 만큼 이동해야 하는데, 휴지가 쌓여있으면 직접 증감 방식으로는 복합 규칙을 각 작업마다 정확히 재현해야 합니다.",
        decision:
          "order_items 테이블에 4개 필드를 이중으로 설계했습니다.\n\n원본 필드(subscribe_start_issue, subscribe_end_issue)는 최초 계약 시 1회만 기록하고 이후 절대 변경하지 않습니다. 실효 필드(final_subscribe_start_issue, final_subscribe_end_issue)는 각 작업에 따라 변경됩니다.\n\n실효 종료 호는 파생값이지만 발송 대상 SQL 필터에서 직접 인덱스를 탐색해야 하므로 계산 결과를 DB에 저장합니다. 모든 변경 작업은 직접 증감 대신 단일 공식을 통해 재계산합니다.",
        diagramId: "subscription-period",
        steps: [
          {
            description:
              "구독 개월 수(subscribe_period)를 독립 입력값으로 유지합니다. 실효 종료 호에서 역산이 불가능한 이유가 있습니다.\n\n케이스 A: 구독 12개월 + 활성 휴지 2개 → 종료 호 동일\n케이스 B: 구독 14개월 + 활성 휴지 0개 → 종료 호 동일\n\n두 케이스는 같은 기간 범위이지만 단축 환불 단가(판매가 ÷ 구독 개월 수)가 달라집니다. 종료 호만으로는 현재 상태를 구별할 수 없습니다.",
          },
          {
            description:
              "모든 구독 기간 변경 작업이 단일 공식을 통해 재계산됩니다. 연장·단축 시 구독 개월 수를 먼저 갱신하고, 휴지는 별도 카운트로 항상 공식 위에 얹습니다.",
            code: {
              language: "python",
              content: `def recalculate_final_end_issue(db, order_item):
    base_end = calculate_subscribe_end_issue(
        order_item.final_subscribe_start_issue,
        order_item.subscribe_period,
    )
    pause_count = _count_active_pauses(db, order_item.order_item_id)
    return _add_months_to_issue(base_end, pause_count)`,
            },
          },
        ],
        result:
          "원본 계약 이력이 보존되어 언제든 추적 가능합니다. 관리자 화면에서 원래 구독 기간과 현재 유효 구독 기간을 나란히 표시합니다.\n\n어떤 순서로 연장·단축·휴지가 쌓여도 단일 공식으로 재계산되므로 누적 오차 없이 종료 호의 정합성이 항상 보장됩니다.",
      },
      {
        id: "send-grouping",
        title: "발송 그룹화 알고리즘",
        summary:
          "3종 발송 유형별 다른 박스 묶음 기준으로 매월 발송 명단을 자동 생성하고 VIP를 격리",
        problem:
          "발송 처리는 물류 업체에 구독자 명단을 엑셀로 제출하는 방식으로 이루어집니다. 단품은 매일, 정기구독은 매월 1일에 약 3,500건을 제출합니다.\n\n두 종류의 발송 방식이 근본적으로 달라 하나의 명단으로 처리할 수 없었습니다.\n- 정기구독: 우편(비닐 봉투) 발송 → 봉투 하나에 책 한 권만 가능 → 1인 1박스\n- 단품: 택배(종이박스, CJ대한통운) 발송 → 같은 주소에 여러 권이면 합포장 가능 → 주소 기준 묶음 필요\n\n수작업으로는 두 명단을 직접 구분하고 합포장 여부를 수동으로 판단했으며, 이 과정에서 오류가 반복됐습니다. 또한 VIP 구독자(교회·학교 등 단체)가 일반 박스에 섞이면 합포장 기준과 이력 판단이 뒤엉켰습니다.",
        decision:
          "세 가지 발송 흐름을 처음부터 분리해 각각의 기준으로 처리하고 VIP 격리를 자동화했습니다.\n\n합포장 기준은 우편번호 + 수령 주소 2개 필드만 사용합니다. 처음에는 수령인 이름·연락처까지 4개 필드를 기준으로 쓰려 했지만, 월간지 특성상 주문자와 수령인이 다른 경우가 빈번해(선물 구독, 자녀 구독, 배우자 혼용 등) 4개 필드를 사용하면 같은 집으로 가는 주문이 다른 박스로 쪼개집니다.\n\n세 함수 모두 동일한 SendGroup 데이터클래스를 출력으로 반환해 이후 레코드 생성 단계는 유형에 관계없이 동일하게 처리합니다.",
        diagramId: "send-grouping",
        steps: [
          {
            description:
              "단품(group_monthly_for_send): 우편번호 + 수령 주소 기준 합포장. 수령인 정보가 충돌하면 이름 → 연락처 기준 가나다 정렬 후 첫 번째를 대표 수신인으로 자동 채택.",
          },
          {
            description:
              "정기구독(group_yearly_for_send): 주문 품목 1개 = 박스 1개. 실효 구독 범위·휴지 여부·중복 이력 등 다층 필터 적용.",
          },
          {
            description:
              "VIP(group_vip_for_send): 우편번호 + 수령 주소 기준 합포장. 정기구독·단품 혼합 가능, 해외 주소 포함. 단품·정기구독 쿼리에서는 VIP 슬롯에 속한 주문을 자동 제외합니다.",
            code: {
              language: "python",
              content: `def exclude_active_vip(query, active_slots, address_ref=Address):
    if not active_slots:
        return query
    vip_columns = [getattr(address_ref, f"vip{n}") for n in active_slots]
    return query.filter(not_(or_(*vip_columns)))`,
            },
          },
        ],
        result:
          "매월 3,500건 이상의 정기구독 명단과 매일 정리해야 했던 단품 명단이 버튼 한 번으로 유형별 엑셀로 자동 생성됩니다. 합포장 누락과 VIP 격리 실수가 사라졌습니다.",
      },
      {
        id: "duplicate-send-prevention",
        title: "중복 발송 방지 필터",
        summary:
          "MONTHLY는 호 무관 전체 이력, YEARLY는 해당 호 이력으로 판단 기준을 분리해 재발송을 방지",
        problem:
          "발송 그룹화 실행 시 '이미 발송된 주문 품목'을 걸러내야 하는데, 단품과 정기구독의 중복 판단 기준이 다릅니다.\n\n- 단품: 특정 달의 잡지를 딱 한 번만 보내는 개념 → 한 번이라도 발송 이력이 있으면 영구 제외 (호 비교 불필요)\n- 정기구독: 매달 보내야 하므로 해당 호에 발송됐는지만 확인 → 같은 호의 이력이 없으면 발송 대상",
        decision:
          "이미 발송된 주문 품목 판별 조건을 단품과 정기구독으로 분리해 구현했습니다.\n\n발송 완료 여부 판단 기준: 활성 SendItem이 있거나, 종료된 박스(DELIVERED/CANCELLED)에 들어있는 주문 품목은 재발송 대상에서 제외합니다.",
        diagramId: "duplicate-prevention",
        steps: [
          {
            description: "단품 필터: 호 비교 없이 전체 발송 이력 기준으로 이미 처리된 품목을 제외합니다.",
            code: {
              language: "python",
              content: `already_sent_ids = {row[0] for row in
    db.query(SendItem.order_item_id)
    .join(Send).filter(
        SendItem.order_item_id.in_(order_item_ids),
        or_(SendItem.cancelled_at.is_(None),
            Send.send_status.in_(["DELIVERED", "CANCELLED"]))
    ).all()}`,
            },
          },
          {
            description:
              "정기구독 추가 조건: 해당 호 이력 확인 + 구독 범위 내 + 휴지 없음 세 조건을 모두 만족해야 발송 대상으로 선별합니다.",
            code: {
              language: "python",
              content: `.filter(
    SendItem.issue == issue,
    or_(OrderItem.last_send_issue.is_(None),
        OrderItem.last_send_issue < issue),
    OrderItem.final_subscribe_start_issue <= issue,
    OrderItem.final_subscribe_end_issue >= issue,
    ~OrderItem.order_item_id.in_(pause_subquery),
)`,
            },
          },
          {
            description:
              "순차 발송 위반 검사(find_sequence_violations): 발송 전 중간 호가 누락된 채 건너뛰는 경우를 사전에 감지해 관리자에게 알립니다. 구독 시작 호부터 목표 호 직전까지 각 호를 순회해 발송 이력과 휴지 모두 없는 호를 누락 호로 판정합니다.",
          },
        ],
        result:
          "단품·정기구독·VIP 3종 발송에서 중복 발송 0건을 유지하며 운영 중입니다. 순차 위반 사전 알림으로 구독자에게 잡지가 중간 호를 건너뛰어 배송되는 사고를 방지합니다.",
      },
      {
        id: "cafe24-oauth",
        title: "Cafe24 OAuth 2.0 연동",
        summary:
          "state 서명으로 CSRF를 방지하고 토큰 생명주기를 자동으로 관리하는 OAuth 2.0 인증 흐름 구현",
        problem:
          "Cafe24 API를 연동하려면 OAuth 2.0 Authorization Code Flow를 직접 구현해야 했습니다. 단순히 인증 코드를 주고받는 것 외에도 콜백 위조(CSRF) 방지, 만료 토큰 자동 갱신, 프론트엔드 리다이렉트 처리, 11개 API 권한 스코프 관리가 필요했습니다.",
        decision:
          "CSRF 방지를 위해 state 파라미터를 서버에서 서명합니다. itsdangerous 라이브러리의 URLSafeSerializer로 mall_id, nonce, timestamp를 담아 서명된 state를 생성합니다.\n\n토큰 자동 갱신은 API 호출 레이어에서 요청 전 만료 여부를 확인해 처리합니다.",
        steps: [
          {
            description:
              "인증 시작: 단순 URL 생성이 아닌, CSRF 방지를 위해 state 파라미터를 서버에서 서명합니다. nonce로 재사용을 방지하고 timestamp로 TTL을 검증합니다.",
            code: {
              language: "python",
              content: `signed_state = _sign_state({
    "mall_id": MALL_ID,
    "nonce": secrets.token_urlsafe(32),  # 재사용 방지
    "ts": int(time.time())               # TTL 검증용
})`,
            },
          },
          {
            description:
              "콜백 처리: Cafe24가 리다이렉트한 콜백에서 state 유효성을 3단계로 검증합니다.\n1. 서명 검증 — 위조 서명 시 즉시 거부\n2. 페이로드 타입 검증 — dict가 아니면 거부\n3. TTL 검증 — 발급 후 10분 초과 시 거부\n\n검증 통과 후 인증 코드를 토큰으로 교환하고 DB에 저장합니다. 콜백 완료 후 프론트엔드 설정 페이지로 302 리다이렉트합니다.",
          },
          {
            description:
              "토큰 자동 갱신: API 호출 레이어에서 요청 전 access_token 만료 여부를 확인해 자동으로 갱신합니다. 갱신 엔드포인트를 별도로 제공해 프론트엔드에서도 수동 갱신이 가능합니다.",
          },
        ],
        result:
          "인증 콜백 위조 방지(state 서명 + TTL)와 토큰 생명주기 관리를 분리 구현하여 Cafe24 API 연동이 안정적으로 운영되고 있습니다.",
      },
      {
        id: "customer-unique-key",
        title: "고객 Unique 키 재설계",
        summary:
          "전화번호 단일 Unique에서 (전화번호, 이름) 복합 Unique로 재설계해 주문 귀속 오류를 방지",
        problem:
          "초기 설계에서는 전화번호를 단일 Unique 컬럼으로 설정했습니다. 고객 이름은 customers 테이블에만 존재하기 때문에, 어떤 customer_id에 주문이 귀속되느냐가 그 주문이 누구의 주문인지를 결정합니다.\n\n전화번호만으로 고객을 식별하면, 같은 번호를 쓰는 다른 이름의 사람이 주문할 때 기존 고객 레코드에 합쳐집니다. 이는 단순히 이름이 잘못 표시되는 수준의 문제가 아닙니다. 두 사람이 같은 customer_id로 합쳐지면 서로 다른 두 사람의 주문·배송지·문의가 한 화면에 뒤섞입니다.\n\n월간지 구독 서비스에서는 주문자와 수령인이 일치하지 않는 경우가 일상입니다. 선물 구독, 자녀·손자녀 구독, 배우자 이름·번호 혼용, 고령자 대리 신청이 모두 여기에 해당합니다. 이름과 번호의 조합이 다른 것은 잘못 입력된 데이터가 아니라 주문자가 의도한 정보입니다.",
        decision:
          "(customer_phone, customer_name) 복합 Unique 제약을 적용했습니다.\n\n이 서비스에서 한 명의 고객이란 이름과 번호의 조합으로 특정되는 사람이라는 정의를 DB 제약으로 표현한 것입니다. 같은 번호라도 이름이 다르면 별도의 고객 레코드가 생성되어 주문이 정확한 명의에 귀속됩니다.",
        steps: [
          {
            description: "customers 테이블에 복합 Unique 제약을 추가했습니다.",
            code: {
              language: "python",
              content: `class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("customer_phone", "customer_name",
                         name="uq_customer_phone_name"),
    )`,
            },
          },
          {
            description:
              "고객을 찾거나 생성하는 모든 경로를 전화번호 단독 조회에서 전화번호 + 이름 복합 조회로 변경했습니다. Cafe24 주문 import, 레거시 엑셀 이관 스크립트, 고객 검색 API가 모두 여기에 해당합니다.",
          },
          {
            description:
              "운영 DB 마이그레이션: 이미 저장된 데이터에 동일 번호를 공유하는 고객 레코드가 있을 수 있었습니다. Alembic 마이그레이션 실행 전 중복 데이터 유무를 확인하고 수동으로 정리한 뒤 제약 조건을 추가했습니다.",
          },
        ],
        result:
          "이름과 번호가 다른 조합으로 주문이 들어와도 각자 독립된 고객 레코드에 정확하게 귀속됩니다. 전화 상담 시 고객이 주문 당시 입력한 이름과 번호 조합으로 즉시 조회할 수 있습니다.",
      },
      {
        id: "cafe24-shipping-sync",
        title: "Cafe24 배송 상태 자동 연동",
        summary:
          "정기구독은 import 시점, 단품은 발송 완료 시점으로 Cafe24 배송 상태 업데이트를 분리해 매월 수천 건의 수동 입력을 자동화",
        problem:
          "Cafe24에서 주문 상태를 N21(배송대기)·N30(배송중)으로 변경할 때 택배사·운송장번호 입력이 필수입니다. 정기구독은 우편 발송이라 운송장번호·택배사가 전부 '자체배송'으로 동일한데도, 매월 수천 건을 Cafe24 관리자 화면에서 하나씩 수동으로 입력해야 했습니다. 단품도 건수가 많아 동일하게 자동화 대상이었습니다.",
        decision:
          "상품 종류별로 Cafe24 배송 상태 업데이트 시점과 API 방식을 분리했습니다.\n\n정기구독: import 시 standby(N21) POST → shipping_code 저장 → 발송 완료 시 PUT으로 N30\n단품: 발송 완료 시 tracking_no 확정 후 POST로 N30 직접 등록\n\n정기구독을 import 시점에 먼저 N21로 등록하는 이유는 두 가지입니다. 첫째, N20 배송준비중에 두면 매일 들어오는 단품 주문과 구분이 안 됩니다. N21로 분리해 두면 Cafe24 관리자 화면에서 정기구독만 필터할 수 있습니다. 둘째, Cafe24 API 설계상 N21 진입(POST)에는 택배사·운송장번호가 필수이지만, N21→N30 전환(PUT)에는 shipping_code만 있으면 됩니다. import 시 미리 등록해두면 발송 완료 시 추가 정보 없이 PUT 한 번으로 처리할 수 있습니다.",
        diagramId: "cafe24-sync",
        steps: [
          {
            description:
              "import 직후 정기구독 standby 등록: 같은 주문에 정기구독 품목이 여러 개 있어도 order_item_code 배열로 묶어 POST 1회로 처리합니다. Cafe24는 request 항목당 shipping_code 1개를 발급하므로 해당 주문의 모든 정기구독 품목에 동일한 shipping_code를 저장합니다. 미리보기(dry_run) 모드이면 Cafe24 POST를 완전히 건너뜁니다. POST 실패 시 ImportSkip 예외 → 해당 주문 DB rollback + import 실패 처리.",
            code: {
              language: "python",
              content: `requests_payload = [{
    "order_id": external_order_id,
    "tracking_no": "자체배송",
    "shipping_company_code": "0001",
    "status": "standby",
    "order_item_code": item_codes,  # 해당 주문의 정기구독 품목 코드 목록
}]`,
            },
          },
          {
            description:
              "발송 완료 시 원자성 보장: DB flush(내부 상태 변경) → Cafe24 API 호출 → 성공 시 commit / 실패 시 rollback 순서로 처리합니다.\n\n정기구독은 '첫 번째 발송할 때 한 번만' Cafe24 상태를 N30으로 업데이트합니다. 같은 주문에 매월 Send가 생성되지만 Cafe24 주문은 1개이기 때문입니다. 판단 기준은 last_send_issue IS NULL — DB flush 전 시점에 확인해야 올바르게 체크됩니다. 같은 주문에 정기구독 2종이 있으면 shipping_code가 동일하므로 중복 제거 후 PUT 1회만 호출합니다.\n\nMONTHLY POST와 YEARLY PUT이 같은 Rate Limit 버킷(40)을 공유하므로, 100건씩 배치 처리 + 배치 간 0.5초 지연으로 버킷 소진을 방지합니다.",
          },
          {
            description:
              "공식 문서 vs 실제 동작 불일치: Cafe24 공식 문서 파라미터 표에 order_id가 Optional로 기재되어 있어 처음에는 생략했습니다. 실제 운영 환경에서 PUT 요청이 모두 502로 실패해 확인한 결과, order_id 누락 시 Cafe24가 422를 반환함을 발견했습니다.",
            code: {
              language: "python",
              content: `# 수정 전 — order_id 누락 → Cafe24 422 → 우리 시스템 502
{"shipping_code": oi.cafe24_shipping_code, "status": "shipping"}

# 수정 후
{"order_id": oi.order.external_order_id, "shipping_code": oi.cafe24_shipping_code, "status": "shipping"}`,
            },
          },
        ],
        result:
          "매월 수천 건의 Cafe24 배송 상태 수동 입력이 발송 완료 처리 시 자동으로 처리됩니다. 정기구독 주문은 import 직후 N21(배송대기)로 분리돼 단품 주문과 섞이지 않고, 발송 완료 처리 시 N30(배송중)으로 자동 전환됩니다.",
      },
      {
        id: "subscription-pause-design",
        title: "구독 일시중지(Pause) 설계",
        summary:
          "정기구독 중 특정 달만 발송을 건너뛰는 요구를 구독 계약·발송 로직·DB 구조·연장 정책 모두 고려해 월별 단건 엔티티로 설계",
        problem:
          "정기구독 중 특정 기간만 배송을 받지 않겠다는 사용자 요구를 처리해야 하는 상황이 발생했다.\n\n구독은 보통 1년 단위(12개월)로 설정되어 있고, 예를 들어 final_subscribe_start_issue = 202601, final_subscribe_end_issue = 202612라면 1월부터 12월까지 총 12권을 발송하는 구조다.\n\n하지만 고객은 특정 기간만 제외하고 싶을 수 있다.\n- '202605 ~ 202607 3개월은 받지 않겠습니다.'\n- '여름은 해외에 있어요. 3개월만 쉬고 다시 받아요.'\n\n이 기능은 단순히 해당 달만 발송하지 않는 것으로 끝나는 문제가 아니라, 구독 기간/발송 로직/DB 구조/연장 정책까지 모두 영향을 주는 복합적 문제였다. 이 요구를 처리하려면 기존 발송 로직과 DB 구조만으로는 부족했고, 구독의 메인 정보(order_items)와 별도로 쉬는 달을 저장하는 방법이 필요했다.",
        decision:
          "설계 초기에 네 가지 방식을 비교·검토했다.\n\n방식 A. order_items의 start/end_issue를 직접 수정 — 202605~202607을 제외하려면 나머지 기간을 여러 구간으로 나눠야 해 데이터 구조가 복잡해지고 의미상 부자연스럽다. → 탈락\n\n방식 B. 제외할 달을 콤마 문자열로 저장 (pause_months = '202605,202606,202607') — 조회·필터링·확장성 모두 비효율적. → 탈락\n\n방식 C. 범위 기반 별도 엔티티 (pause_start_issue ~ pause_end_issue) — 비연속 월(5·7·9월)은 범위 1개로 표현 불가. 결국 여러 행으로 쪼개야 해 방식 D와 구조적으로 동일해지면서 복잡도만 증가. → 탈락\n\n방식 D. 월별 단건 엔티티 (pause_issue, YYYYMM) — 비연속 월도 각각 1행으로 자연스럽게 표현. 발송 필터는 단순 등호 비교. 재계산은 COUNT만. → 채택\n\norder_items는 구독 계약 그 자체를 담는 메인 엔티티이므로 쉬는 구간까지 포함시키는 것은 역할을 과하게 하는 설계다. pauses 테이블을 별도로 분리해 역할을 분리했다.\n- order_items = 전체 구독 계약 정보\n- pauses = 구독에서 제외할 특정 호(issue) 목록 (1행 = 1개월)\n\n구독 종료 시점 정책은 두 가지 중 선택이 필요했다.\n- 정책 1(연장형): 5~7월 3개월을 쉬면 202612 → 202703으로 final_subscribe_end_issue를 연장. 쉬는 달은 skip, 뒤에 3달을 추가 발송. 매출·계약 기간 유지에 적합.\n- 정책 2(종료일 유지): 12개월 중 3개월은 미발송 처리. 별도 연장 없음.\n\n이 프로젝트에서는 정책 1(연장형)을 채택했다. 활성 pause 개수를 기존 final_end 재계산 공식에 얹어 처리하므로 연장·단축·기간이동과 동일한 공식 경로를 통과한다.",
        diagramId: "pause-design",
        steps: [
          {
            description:
              "pauses 테이블 설계. pause_issue는 생성 후 절대 변경하지 않는 불변 필드로 설정한다. 수정이 필요하면 소프트 삭제 후 재생성한다.",
            code: {
              language: "python",
              content: `class Pause(Base):
    __tablename__ = "pauses"
    pause_id        = Column(BigInteger, primary_key=True)
    order_item_id   = Column(BigInteger, ForeignKey("order_items.order_item_id"))
    pause_issue     = Column(String(6), nullable=False)   # YYYYMM, 불변
    reason          = Column(Text, nullable=True)
    admin_id        = Column(BigInteger, ForeignKey("admins.admin_id"))
    is_deleted      = Column(Boolean, default=False)
    created_at      = Column(DateTime)
    updated_at      = Column(DateTime)
    deleted_at      = Column(DateTime, nullable=True)`,
            },
          },
          {
            description:
              "발송 로직 수정. 발송 대상 선별 쿼리에 해당 호의 활성 pause 여부를 NOT EXISTS 조건으로 추가한다. 발송하려는 월이 pause에 포함되면 자동으로 제외된다.",
            code: {
              language: "sql",
              content: `SELECT order_items WHERE
    final_subscribe_start_issue <= issue_month
    AND final_subscribe_end_issue >= issue_month
    AND NOT EXISTS (
        SELECT 1 FROM pauses
        WHERE order_item_id = order_item.order_item_id
          AND pause_issue = issue_month
          AND deleted_at IS NULL
    )`,
            },
          },
          {
            description:
              "SQLAlchemy 구현. pause_issue == 이번 발송 호 단순 등호 비교로 처리되므로 필터가 간결하게 유지된다.",
            code: {
              language: "python",
              content: `pause_subquery = (
    db.query(Pause.order_item_id)
    .filter(
        Pause.pause_issue == issue,
        Pause.deleted_at.is_(None),
    )
    .subquery()
)
query = query.filter(
    OrderItem.final_subscribe_start_issue <= issue,
    OrderItem.final_subscribe_end_issue >= issue,
    ~OrderItem.order_item_id.in_(pause_subquery),
)`,
            },
          },
          {
            description:
              "final_subscribe_end_issue 재계산. pause 생성 시 +1개월, 소프트 삭제 시 −1개월. 기존 구독 기간 공식(연장·단축·기간이동과 동일한 경로)에 활성 pause 개수를 얹어 처리하므로 누적 오차가 없다.",
            code: {
              language: "python",
              content: `def recalculate_final_end_issue(db, order_item):
    base_end = calculate_subscribe_end_issue(
        order_item.final_subscribe_start_issue,
        order_item.subscribe_period,
    )
    pause_count = _count_active_pauses(db, order_item.order_item_id)
    return _add_months_to_issue(base_end, pause_count)`,
            },
          },
        ],
        result:
          "이 구조를 도입함으로써 다음과 같은 장점이 생겼다.\n\n1. 구독 정보(order_items)는 깔끔하게 구독 계약 역할에 집중\n2. 쉬는 달은 pauses 테이블만 관리하면 됨\n3. 사용자 요청으로 인한 일시중지, 재개, 구간 조정 등이 유연하게 가능\n4. 발송 로직은 단순하고 명확하게 처리\n5. 유지보수 용이성과 데이터 정합성 확보\n\n특히, pause를 월별 단건 엔티티로 분리하고 공식 기반 재계산을 도입한 것이 가장 큰 구조적 개선 포인트였다.\n\n정기구독의 중간 결번 처리(일시중지)는 단순히 발송을 건너뛰는 문제가 아니라 구독 계약/발송 로직/데이터 모델/정책이 모두 얽혀 있는 문제였다. 이를 해결하기 위해\n- 구독 정보는 order_items로 유지\n- 일시중지 정보는 pauses로 분리 (1행 = 1개월, pause_issue 불변)\n- 발송 로직에서 활성 pause 호를 제외\n- 활성 pause 개수 기반 공식으로 final_subscribe_end_issue 재계산\n이라는 구조로 정리함으로써 정확성과 확장성을 모두 확보할 수 있었다.",
      },
    ],
    results: [
      "월 3,500건 정기구독 발송 명단이 버튼 한 번으로 자동 생성",
      "Cafe24 주문을 수동 엑셀 입력 없이 자동 import",
      "발송 누락·중복 발송 0건, 구독 기간 계산 오류 없음",
      "만료 구독도 전부 보존 — 재구독 시 이전 구독 이력을 즉시 조회해 맥락 파악 가능",
      "전화 상담 시 과거 발송 이력·변경 내역이 모두 남아있어 정확한 응대 가능",
      "발송 이력 보존으로 미수령 분쟁 시 근거 데이터로 활용",
      "6종 도서 × 정기구독+단품 상품군을 통합 관리하며 실제 운영 중",
    ],
    github: "",
    demo: null,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeature(slug: string, featureId: string) {
  const project = getProject(slug);
  if (!project) return undefined;
  const index = project.features.findIndex((f) => f.id === featureId);
  if (index === -1) return undefined;
  return {
    feature: project.features[index],
    project,
    index,
    prev: project.features[index - 1] ?? null,
    next: project.features[index + 1] ?? null,
  };
}

export function getChallenge(slug: string, challengeId: string) {
  const project = getProject(slug);
  if (!project) return undefined;
  const index = project.challenges.findIndex((c) => c.id === challengeId);
  if (index === -1) return undefined;
  return {
    challenge: project.challenges[index],
    project,
    index,
    prev: project.challenges[index - 1] ?? null,
    next: project.challenges[index + 1] ?? null,
  };
}
