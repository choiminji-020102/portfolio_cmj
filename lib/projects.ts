export interface ChallengeStep {
  description: string;
  code?: { language: string; content: string };
}

export interface Challenge {
  id: string;
  /* 성격 구분 — "design"은 왜 이렇게 만들었나, "incident"는 터져서 어떻게 고쳤나.
     지정하지 않으면 한 덩어리로 렌더한다 (분류가 없는 다른 프로젝트 상세 호환) */
  kind?: "design" | "incident";
  title: string;
  summary: string;
  problem: string;
  decision: string;
  diagramId?: string;
  steps: ChallengeStep[];
  result: string;
  /* 증상·해결 후 화면 기록. 서술의 숫자(295→290, 53건 실패 등)를 그대로 보여준다 */
  screenshots?: Screenshot[];
}

/* 전/후 대비 캡처. 기능(개선 전/후)과 트러블 슈팅(증상/해결 후)이 함께 쓴다 —
   대비의 성격만 다르고 구조가 같아 라벨은 화면 쪽(ShotGrid)에서 갈아끼운다 */
export interface Screenshot {
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
  screenshots?: Screenshot[];
}

export interface ProblemSolution {
  title: string;
  /* 불릿 요약과 산문 두 표기를 함께 받는다 — 항목마다 필요한 설명 깊이가 다르다.
     배열이면 2단 불릿, 문자열이면 문단(빈 줄로 나눈다)으로 편다 */
  problem: string | string[];
  solution: string | string[];
  /* 산문 항목에서만 쓴다 — 불릿 항목은 해결에 결과가 녹아 있다 */
  result?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /* 제목 바로 아래 한 줄 — 스크롤 없이 맡은 범위가 잡히도록.
     LightProject 의 tagline 과 같은 자리, 같은 성격이다 */
  tagline: string;
  problemSolutions: ProblemSolution[];
  /* 담당 범위 절의 리드 문단 */
  role: string;
  /* 담당 범위 — 순서 파이프라인. LightProject 의 myRolePipeline 과 같은 표기 */
  rolePipeline: string[];
  /* 인원·상태 모두 자유 문구다 — LightProject 와 같은 방식.
     '프리랜서 단독 개발 (1인)'처럼 숫자에서 도출할 수 없는 표기를 쓴다 */
  teamSize: string;
  period: string;
  status: string;
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
    tagline: "기획부터 서버 배포까지 전 과정을 단독으로 맡은 프리랜서 프로젝트",
    problemSolutions: [
      {
        title: "배송상태 월 100건 반복 입력 → 주문 수집에 통합해 자동화",
        problem:
          "Cafe24의 배송 상태는 배송준비중 → 배송대기 → 배송중 → 배송완료 순으로 흐릅니다. 결제가 끝난 주문은 전부 배송준비중에 모이는데, 여기서 단품과 정기구독의 성격이 갈립니다.\n\n단품은 그날 바로 나가므로 배송준비중에 잠깐 있다가 배송중으로 넘어갑니다.\n\n정기구독은 매월 1일에 한 번 나갑니다. 결제는 이미 끝났지만 실제 발송은 한참 뒤입니다. 배송준비중에 그대로 두면 매일 들어오는 단품 주문과 섞여 구분이 안 되므로, 중간 단계인 배송대기로 옮겨 분리해둡니다.\n\n문제는 배송대기로 넘길 때 Cafe24가 택배사와 운송장번호를 필수로 요구한다는 점입니다. 기출유(기독교출판유통) 우편 발송이라 운송장번호라는 게 애초에 없어서, 택배사는 '자체배송', 운송장번호 칸에도 '자체배송'을 적어 넣습니다. 전부 같은 값인데 화면에서는 일괄 적용이 안 돼 건별로 반복 입력해야 했습니다.\n\n매월 신규 주문 100건 안팎. 판단이 필요 없는 순수 반복 입력입니다.",
        solution:
          "주문 수집 처리 안에 배송대기 등록을 포함시켰습니다. 정기구독 품목이 있는 주문은 저장과 동시에 Cafe24 API로 배송대기가 등록됩니다. 화면에서 막혀 있던 일괄 처리를 API로 우회했습니다.\n\n미리 등록해두는 데는 이유가 하나 더 있습니다. Cafe24는 배송대기로 진입할 때만 택배사와 운송장번호를 요구하고, 배송대기에서 배송중으로 올릴 때는 발급된 배송 식별자(shipping_code)만 받습니다. 수집 시점에 한 번 등록해두면, 이후 발송이 끝났을 때 저장해둔 그 코드만 보내면 됩니다.\n\n외부 API를 주문마다 호출하므로 실패를 전제로 설계했습니다. 트랜잭션 경계는 주문 하나입니다. 배송대기 등록이 실패하면 그 주문의 저장까지 되돌리고 사유를 남깁니다. 우리 DB에는 있는데 Cafe24에는 없는 상태가 생기지 않습니다. 실패한 주문은 저장되지 않았으므로 다시 수집하면 되고, 이미 성공한 주문은 주문번호 중복 검사에 걸려 두 번 등록되지 않습니다. 100건 중 몇 건이 실패해도 나머지는 그대로 저장됩니다.",
        result:
          "매월 100건 안팎의 수동 입력이 사라졌습니다. 별도 작업으로 떨어져 있던 상태 전환이 수집 처리에 통합되면서, 사람이 따로 기억해서 챙겨야 할 단계가 없어졌습니다. 실패한 건은 사유와 함께 화면에 남아 다시 수집하면 됩니다.",
      },
      {
        title: "매달 5~20건 미배송 → 명단 자동 생성과 누락 호 사전 감지",
        problem:
          "Cafe24는 정기구독의 첫 달 배송만 추적합니다. 두 번째 달부터는 기록이 남지 않아, 당시 3,200건의 구독을 엑셀로 따로 관리했습니다.\n\n매월 1일 기출유에 발송 명단을 제출할 때, 이 엑셀에서 이번 달에 보내야 할 구독건을 눈으로 골라 기입했습니다. 이번 달이 구독 기간 안에 드는지, 휴지(구독을 한 달 쉬어가는 것) 신청이 걸려 있는지, 지난달에 이미 보냈는지를 행마다 사람이 판단해야 했습니다. 3,200행입니다.\n\n매달 5~20건이 미배송으로 돌아왔습니다. 원인은 알 수 없었습니다. 명단에서 빠진 건지, 보냈는데 도착하지 않은 건지 구분할 기록이 없었으니까요. 아는 것은 재배송 비용이 매달 나간다는 것뿐이었습니다.",
        solution:
          "구독 기간·휴지·발송 이력을 각각의 테이블로 관리하고, 매월 발송 시 이 세 조건으로 자동 필터링해 명단을 생성합니다. 사람이 고르는 단계가 없어집니다.\n\n발송 직전에는 한 번 더 검사합니다. 각 구독의 시작 호부터 이번 호 직전까지를 한 달씩 순회하면서, 보낸 적도 휴지도 아닌 호를 찾아 화면에 경고합니다.\n\n사후에 메울 수 없는 누락이라 사전에 잡아야 합니다. 발송 대상은 마지막으로 보낸 호보다 뒤인 호에서만 고르는데, 이번 호를 내보내는 순간 마지막 발송 호가 이번 호로 올라갑니다. 건너뛴 앞 호는 그때부터 영원히 대상에 들어오지 않습니다.",
        result:
          "8월호 명단 누락은 0건이었습니다. 명단을 고르는 판단이 사람 손을 떠났습니다.\n\n그달 재배송 7건은 전부 일반우편 배송사고였습니다. 판정 근거는 발송 이력입니다. 7건 모두 8월호 명단에 올라 7월 30일 발송 처리까지 끝난 기록이 남아 있었습니다. 명단에서 빠진 게 아니라 나간 뒤에 사라진 겁니다. 8월호 정기구독 2,919박스 중 일반우편이 2,680건인데, 유실은 전부 거기서 나왔습니다. 명단 로직이 아니라 발송 수단의 문제입니다.\n\n원인을 모른 채 비용만 나가던 문제가, 원인을 지목할 수 있는 문제가 됐습니다.",
      },
      {
        title: "구독 변경 이력 소실 → 원본 보존과 변경 로그 설계",
        problem:
          "구독은 자주 바뀝니다. 취소, 휴지, 구독기간 이동, 연장, 단축 — 지금도 전부 전화로 접수됩니다.\n\n엑셀에서는 해당 고객 행을 찾아 구독 기간 숫자를 직접 고쳤습니다. 비고란에는 '주소 변경(26.06.26)'처럼 날짜만 적었습니다. 원래 기간이 언제였는지, 왜 바꿨는지, 환불이 얼마였는지는 남지 않습니다. 지금 값만 남고 그 값이 된 경위는 사라집니다.\n\n되짚을 방법이 없다는 게 문제였습니다. 고객이 '작년에 몇 달 쉬었는데 그만큼 밀린 게 맞냐'고 물으면 확인할 근거가 없습니다.",
        solution:
          "원래 계약 기간은 손대지 않는 값으로 두고, 실제 적용되는 기간을 별도 필드로 관리합니다. 두 값이 함께 남아 있으면 원래 어디서 어디까지였는지와 지금 어디까지인지를 동시에 볼 수 있습니다.\n\n변경은 작업별 전용 API로만 처리합니다. 취소·휴지·연장·단축·구독기간 이동이 각각 다른 엔드포인트이고, 각자 자기 규칙을 갖습니다. 휴지 한 건이 붙으면 종료 호가 한 달 밀리고, 단축하면 줄인 회차만큼 환불액이 계산됩니다.\n\n모든 변경은 활동 로그에 자동 기록됩니다. 누가 언제, 어디서 어디로, 왜 바꿨고 환불이 얼마였는지가 함께 남습니다.",
        result:
          "'2027년 8월까지였는데 청소년판에서 기본판으로 바꾸느라 2026년 9월로 단축, 환불 35,288원' — 이런 내용이 그대로 조회됩니다. 지금 값이 왜 그 값이 됐는지 되짚을 수 있습니다.\n\n다만 이관 전 이력은 가져올 수 없었습니다. 엑셀에는 변경 기록이라는 게 아예 없었으니, 넘어온 3,138건은 각자의 최종 상태만 담고 있습니다. 그 이전에 무슨 변경이 있었는지는 영영 알 수 없습니다. 기록하지 않은 것은 시스템을 바꿔도 되살아나지 않습니다.",
      },
      {
        title: "발송 엑셀이 곧 관리 대장 → 호 입력 한 번으로 명단 생성",
        problem:
          "엑셀 한 장이 발송 명단이자 관리 대장이었습니다. 명단을 만드는 일이 곧 관리였고, 그래서 판단이 전부 그 파일 안에서 사람 손으로 이뤄졌습니다.\n\n단품은 매일 오후 3시까지 기출유에 명단을 넘겨야 합니다. Cafe24 배송준비중 건을 엑셀로 옮기면서, 같은 주소로 가는 건은 한 박스에 묶어야 하니 그것도 눈으로 골랐습니다.\n\n예외가 많았습니다. 인근 주민에게는 직접 가져다주고, 집필진과 목사님께는 무상으로 보내고, 해외로 나가는 건도 있습니다. 상품마다 발송 경로도 달랐습니다. 기본판과 큰글자판은 기출유로, 나머지는 관리자가 우체국에서 직접 부쳤습니다. 이 규칙들이 엑셀 색깔 표시와 담당자 기억에만 있었습니다.\n\n담당 관리자가 출장이나 휴가로 자리를 비우면 다른 사람은 그날 발송을 처리할 수 없었습니다.",
        solution:
          "이제 명단은 시스템이 만듭니다. 정기구독은 호를 넣으면 그 달에 보낼 대상이 잡히고, 단품은 아직 나가지 않은 건이 모입니다.\n\n같은 우편번호와 주소로 갈 건은 한 박스로 묶여서 나옵니다. 주문자가 서로 달라도 주소가 같으면 묶입니다. 눈으로 훑어 짝을 찾을 일이 없어집니다.\n\n색깔로 표시하던 예외는 VIP 슬롯이 됐습니다. 슬롯에 등록된 주소는 일반 명단에서 자동으로 빠지고 전용 탭에서 따로 처리됩니다. 슬롯마다 이름이 붙어 있어 \'해외배송\', \'평생배송\'처럼 규칙이 화면에 그대로 보입니다.\n\n상품별 발송 경로는 기본값으로 잡혀 있습니다. 기본판·큰글자판은 기출유우편 엑셀, 꿀땅·저학년·고학년·청소년은 일반우편 엑셀, 단품은 기출유택배 엑셀입니다. 발송수단을 고르면 택배사가 따라옵니다. 필요하면 바꿀 수 있되, 매번 같은 값을 다시 고르는 수고는 없습니다.",
        result:
          "사람이 하던 판단이 파일 안에 이미 반영돼 나옵니다. 매달 80개 안팎의 박스가 둘 이상의 품목을 함께 담습니다. 그만큼 발송이 월 120건 줄어듭니다. 단품과 VIP를 합친 수치입니다.\n\n색깔과 기억에 있던 것이 슬롯 이름과 탭이 됐습니다. 담당자가 아니어도 같은 결과가 나옵니다.",
      },
    ],
    role:
      "출판사에서 직접 의뢰받아 혼자 맡은 프리랜서 프로젝트입니다. 기획과 요구사항 분석부터 DB 설계, 백엔드·프론트엔드 개발, 서버 배포와 실운영 이관까지 전 과정을 단독으로 진행했습니다.",
    rolePipeline: [
      "기획",
      "요구사항 분석",
      "DB 설계",
      "백엔드 개발",
      "프론트엔드 개발",
      "서버 배포",
    ],
    teamSize: "프리랜서 단독 개발 (1인)",
    period: "2025년 10월 ~ 현재",
    status: "2026년 7월 실운영 이관 · 유지보수 중",
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
          "매월 발송 처리를 위해 물류 업체에 구독자 명단을 엑셀로 제출합니다. 정기구독은 매월 1일 약 3,000건, 단품은 매일 정리해서 제출합니다.\n\n발송 후보(PREPARING) 박스를 생성하고, 엑셀 다운로드 → 물류 업체 전송 → 발송 완료(DELIVERED) 처리까지 전 과정이 시스템 안에서 이루어집니다. VIP 발송(교회·학교 등 단체)은 별도 탭에서 독립적으로 관리합니다.",
        coreLogic:
          "발송은 PREPARING(발송 후보)과 DELIVERED(발송 완료) 2단계로 운영됩니다.\n\n그룹화 실행 시 PAID 상태 주문 품목을 종류별로 분류하고, 각 흐름에 맞는 그룹화 함수를 통과시켜 SendGroup(박스 묶음) 리스트를 생성합니다. 세 함수 모두 동일한 SendGroup 데이터클래스를 반환하기 때문에, 이후 Send/SendItem 레코드 생성 함수는 발송 유형에 관계없이 동일한 인터페이스로 처리합니다.",
        relatedChallengeIds: [
          "send-grouping",
          "duplicate-send-prevention",
          "pagination-tie-break",
          "address-change-shared-box",
        ],
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
        relatedChallengeIds: [
          "cafe24-oauth",
          "cafe24-shipping-sync",
          "cafe24-shipment-deadlock",
        ],
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
            caption: "모든 상품이 한 번에 나열되어 스크롤이 길고 종류·월호가 뒤섞임",
            type: "before",
          },
          {
            src: "/magazine-manager/before_2.png",
            caption: "선택 품목이 카드 형태, 구독기간 월 단위 입력, 소계 없음",
            type: "before",
          },
          {
            src: "/magazine-manager/after.png",
            caption: "구독 종류 → 책 종류 단계별 필터, 테이블 행 형태, 구독기간 년 단위·판매가 자동 연동, 실시간 소계",
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
        kind: "design",

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
        kind: "design",

        title: "발송 그룹화 알고리즘",
        summary:
          "3종 발송 유형별 다른 박스 묶음 기준으로 매월 발송 명단을 자동 생성하고 VIP를 격리",
        problem:
          "발송 처리는 물류 업체에 구독자 명단을 엑셀로 제출하는 방식으로 이루어집니다. 단품은 매일, 정기구독은 매월 1일에 약 3,000건을 제출합니다.\n\n두 종류의 발송 방식이 근본적으로 달라 하나의 명단으로 처리할 수 없었습니다.\n- 정기구독: 우편(비닐 봉투) 발송 → 봉투 하나에 책 한 권만 가능 → 1인 1박스\n- 단품: 택배(종이박스, CJ대한통운) 발송 → 같은 주소에 여러 권이면 합포장 가능 → 주소 기준 묶음 필요\n\n수작업으로는 두 명단을 직접 구분하고 합포장 여부를 수동으로 판단했으며, 이 과정에서 오류가 반복됐습니다. 또한 VIP 구독자(교회·학교 등 단체)가 일반 박스에 섞이면 합포장 기준과 이력 판단이 뒤엉켰습니다.",
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
          "매월 약 3,000건의 정기구독 명단과 매일 정리해야 했던 단품 명단이 버튼 한 번으로 유형별 엑셀로 자동 생성됩니다. 합포장 누락과 VIP 격리 실수가 사라졌습니다.",
      },
      {
        id: "duplicate-send-prevention",
        kind: "design",

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
        kind: "design",

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
        kind: "design",

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
        kind: "design",

        title: "Cafe24 배송 상태 자동 연동",
        summary:
          "정기구독은 import 시점, 단품은 발송 완료 시점으로 Cafe24 배송 상태 업데이트를 분리해 매월 100건 안팎의 수동 입력을 자동화",
        problem:
          "Cafe24에서 주문 상태를 N21(배송대기)·N30(배송중)으로 변경할 때 택배사·운송장번호 입력이 필수입니다. 정기구독은 우편 발송이라 운송장번호·택배사가 전부 '자체배송'으로 동일한데도, 매월 100건 안팎을 Cafe24 관리자 화면에서 하나씩 수동으로 입력해야 했습니다. 단품도 같은 입력이 필요해 동일하게 자동화 대상이었습니다.",
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
          "매월 100건 안팎의 Cafe24 배송 상태 수동 입력이 발송 완료 처리 시 자동으로 처리됩니다. 정기구독 주문은 import 직후 N21(배송대기)로 분리돼 단품 주문과 섞이지 않고, 발송 완료 처리 시 N30(배송중)으로 자동 전환됩니다.",
      },
      {
        id: "subscription-pause-design",
        kind: "design",

        title: "구독 일시중지(Pause) 설계",
        summary:
          "정기구독 중 특정 달만 발송을 건너뛰는 요구를 구독 계약·발송 로직·DB 구조·연장 정책 모두 고려해 월별 단건 엔티티로 설계",
        problem:
          "정기구독 중 특정 기간만 배송을 받지 않겠다는 사용자 요구를 처리해야 하는 상황이 발생했습니다.\n\n구독은 보통 1년 단위(12개월)로 설정되어 있고, 예를 들어 final_subscribe_start_issue = 202601, final_subscribe_end_issue = 202612라면 1월부터 12월까지 총 12권을 발송하는 구조입니다.\n\n하지만 고객은 특정 기간만 제외하고 싶을 수 있습니다.\n- '202605 ~ 202607 3개월은 받지 않겠습니다.'\n- '여름은 해외에 있어요. 3개월만 쉬고 다시 받아요.'\n\n이 기능은 단순히 해당 달만 발송하지 않는 것으로 끝나는 문제가 아니라, 구독 기간/발송 로직/DB 구조/연장 정책까지 모두 영향을 주는 복합적 문제였습니다. 이 요구를 처리하려면 기존 발송 로직과 DB 구조만으로는 부족했고, 구독의 메인 정보(order_items)와 별도로 쉬는 달을 저장하는 방법이 필요했습니다.",
        decision:
          "설계 초기에 네 가지 방식을 비교·검토했습니다.\n\n방식 A. order_items의 start/end_issue를 직접 수정 — 202605~202607을 제외하려면 나머지 기간을 여러 구간으로 나눠야 해 데이터 구조가 복잡해지고 의미상 부자연스러움. → 탈락\n\n방식 B. 제외할 달을 콤마 문자열로 저장 (pause_months = '202605,202606,202607') — 조회·필터링·확장성 모두 비효율적. → 탈락\n\n방식 C. 범위 기반 별도 엔티티 (pause_start_issue ~ pause_end_issue) — 비연속 월(5·7·9월)은 범위 1개로 표현 불가. 결국 여러 행으로 쪼개야 해 방식 D와 구조적으로 동일해지면서 복잡도만 증가. → 탈락\n\n방식 D. 월별 단건 엔티티 (pause_issue, YYYYMM) — 비연속 월도 각각 1행으로 자연스럽게 표현. 발송 필터는 단순 등호 비교. 재계산은 COUNT만. → 채택\n\norder_items는 구독 계약 그 자체를 담는 메인 엔티티이므로 쉬는 구간까지 포함시키는 것은 역할을 과하게 하는 설계입니다. pauses 테이블을 별도로 분리해 역할을 분리했습니다.\n- order_items = 전체 구독 계약 정보\n- pauses = 구독에서 제외할 특정 호(issue) 목록 (1행 = 1개월)\n\n구독 종료 시점 정책은 두 가지 중 선택이 필요했습니다.\n- 정책 1(연장형): 5~7월 3개월을 쉬면 202612 → 202703으로 final_subscribe_end_issue를 연장. 쉬는 달은 skip, 뒤에 3달을 추가 발송. 매출·계약 기간 유지에 적합.\n- 정책 2(종료일 유지): 12개월 중 3개월은 미발송 처리. 별도 연장 없음.\n\n이 프로젝트에서는 정책 1(연장형)을 채택했습니다. 활성 pause 개수를 기존 final_end 재계산 공식에 얹어 처리하므로 연장·단축·기간이동과 동일한 공식 경로를 통과합니다.",
        diagramId: "pause-design",
        steps: [
          {
            description:
              "pauses 테이블 설계. pause_issue는 생성 후 절대 변경하지 않는 불변 필드로 설정합니다. 수정이 필요하면 소프트 삭제 후 재생성합니다.",
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
              "발송 로직 수정. 발송 대상 선별 쿼리에 해당 호의 활성 pause 여부를 NOT EXISTS 조건으로 추가합니다. 발송하려는 월이 pause에 포함되면 자동으로 제외됩니다.",
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
              "SQLAlchemy 구현. pause_issue == 이번 발송 호 단순 등호 비교로 처리되므로 필터가 간결하게 유지됩니다.",
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
              "final_subscribe_end_issue 재계산. pause 생성 시 +1개월, 소프트 삭제 시 −1개월. 기존 구독 기간 공식(연장·단축·기간이동과 동일한 경로)에 활성 pause 개수를 얹어 처리하므로 누적 오차가 없습니다.",
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
          "이 구조를 도입함으로써 다음과 같은 장점이 생겼습니다.\n\n1. 구독 정보(order_items)는 깔끔하게 구독 계약 역할에 집중\n2. 쉬는 달은 pauses 테이블만 관리하면 됨\n3. 사용자 요청으로 인한 일시중지, 재개, 구간 조정 등이 유연하게 가능\n4. 발송 로직은 단순하고 명확하게 처리\n5. 유지보수 용이성과 데이터 정합성 확보\n\n특히, pause를 월별 단건 엔티티로 분리하고 공식 기반 재계산을 도입한 것이 가장 큰 구조적 개선 포인트였습니다.\n\n정기구독의 중간 결번 처리(일시중지)는 단순히 발송을 건너뛰는 문제가 아니라 구독 계약/발송 로직/데이터 모델/정책이 모두 얽혀 있는 문제였습니다. 이를 해결하기 위해\n- 구독 정보는 order_items로 유지\n- 일시중지 정보는 pauses로 분리 (1행 = 1개월, pause_issue 불변)\n- 발송 로직에서 활성 pause 호를 제외\n- 활성 pause 개수 기반 공식으로 final_subscribe_end_issue 재계산\n이라는 구조로 정리함으로써 정확성과 확장성을 모두 확보할 수 있었습니다.",
      },
      {
        id: "pagination-tie-break",
        kind: "incident",

        title: "페이징 정렬 불안정으로 인한 조용한 누락",
        summary:
          "정렬 키가 유일하지 않아 페이지 경계에서 중복과 누락이 짝으로 발생하던 문제를 PK 2차 정렬키로 고정",
        problem:
          "발송 후보 화면에서 [전체 선택 (총 295건)]을 눌렀는데 290건만 선택됐습니다. 예외도, 에러 응답도 없었습니다. 모든 요청이 200으로 응답했고 화면에 실패 표시도 없었습니다. 누락이 조용히 발생하는 형태였습니다.\n\n화면 없이 DB에서 직접 재현하자 문제의 성격이 확정됐습니다. 발송 후보 전체 349건을 전체 선택과 같은 방식(limit=100으로 페이지를 끝까지 순회)으로 수집하니, 반환된 행 수는 349로 total과 일치하는데 고유 send_id는 348이었습니다. 덜 가져온 것이 아니라 어떤 행이 두 번 오고 다른 행이 한 번도 오지 않은 것이었습니다.\n\n실질 피해는 표시 문제로 끝나지 않습니다. 선택된 항목이 그대로 발송 완료 처리 요청 본문에 실리므로, 선택에서 빠진 건은 발송 완료 처리에서도 빠집니다. 실제로 발송했는데 시스템상 미발송으로 남는 상태가 됩니다.",
        decision:
          "원인은 세 가지가 겹친 결과였습니다.\n\n1. SQLAlchemy의 Column(DateTime)은 MySQL에서 자릿수 없는 DATETIME으로 생성되어 소수점 이하가 저장되지 않고 초 단위로 잘립니다(DATETIME_PRECISION = 0). 같은 초에 들어온 행은 값이 완전히 동일해집니다.\n2. 발송은 일괄 생성되므로 동일 값 행이 대량으로 쌓입니다. sends 전체 3,173건 중 3,165건(99%)이 created_at 중복 그룹에 속했고, 한 초에 최대 617건이 같은 값을 가졌습니다.\n3. ORDER BY 값이 같은 행들 사이의 순서는 SQL 표준상 정의되지 않습니다. 페이지마다 쿼리가 새로 실행되고 정렬도 다시 수행되므로, 정렬값이 같은 행들의 묶음(tie) 안에서 순서가 그때마다 달라지면 경계에 놓인 행들이 자리를 바꿔 중복 1건과 누락 1건이 짝으로 발생합니다.\n\n정렬 키가 유일하지 않으면 LIMIT/OFFSET 페이징은 원리적으로 불안정합니다. 충돌 확률을 낮추는 대신 tie 자체를 없애기로 하고, 이미 인덱스가 있고 유일성·NOT NULL이 보장된 PK를 2차 정렬키로 추가했습니다.\n\n대안도 검토했습니다. DATETIME(6)으로 정밀도를 올리는 방식은 기존 데이터에 소급되지 않아 확률만 줄이고, ROW_NUMBER()는 tie 상태에서 어느 행에 몇 번을 줄지가 그대로 비결정적이라 문제가 남습니다. 커서(keyset) 페이징은 OFFSET의 구조적 한계까지 해결하는 근본 대안이지만 커서가 (created_at, send_id) 복합이어야 하므로 tie-break를 전제로 깔고 있고, 페이지 번호로 임의 점프하는 현재 UI와 맞지 않아 API와 프론트엔드를 전면 수정해야 합니다. 어느 경로로 가든 결국 필요한 수정이면서 변경 범위가 가장 작고 기존 정렬 옵션을 그대로 유지하는 방법이었습니다.",
        steps: [
          {
            description:
              "프론트엔드 순회 로직부터 확인했습니다. total_pages까지 정상적으로 돌고 중단 조건도 맞아 원인이 아니었지만, 결정적인 단서를 얻었습니다. 수집 자료구조가 Map<send_id, ...>라 같은 send_id가 두 번 오면 덮어쓰기되어 하나로 합쳐집니다. \"반환 349 / 고유 348\"과 정확히 맞물립니다. 프론트엔드는 백엔드가 준 중복을 조용히 흡수하고 있었을 뿐이었습니다.",
            code: {
              language: "tsx",
              content: `const collected = new Map<number, SendResponse>();
do {
  const { data } = await sendsApi.getSends({ ...baseParams, page: currentPage, limit: 100 });
  data.items.forEach((item) => { collected.set(item.send_id, item); });  // ← 중복이 합쳐짐
  totalPages = data.total_pages;
  currentPage += 1;
} while (currentPage <= totalPages);`,
            },
          },
          {
            description:
              "정렬값이 실제로 겹치는지 확인했습니다. 처음에는 DateTime 타입이면 밀리초 이하까지 저장되어 충돌이 드물 것이라 가정했으나, 실제 스키마와 집계를 차례로 조회해 기각했습니다.",
            code: {
              language: "sql",
              content: `SELECT COLUMN_TYPE, DATETIME_PRECISION FROM information_schema.COLUMNS
WHERE TABLE_NAME = 'sends' AND COLUMN_NAME = 'created_at'
-- datetime   DATETIME_PRECISION = 0    ← 소수점 이하가 저장되지 않는다

SELECT created_at, COUNT(*) n FROM sends GROUP BY created_at ORDER BY n DESC
-- 2026-07-23 14:43:32 → 617건          ← 한 초 최대`,
            },
          },
          {
            description:
              "정렬에 PK를 2차 키로 추가해 (정렬값, PK)가 항상 유일하도록 만들었습니다. 동일 패턴이 전 도메인에 있어 order_by를 전수 조사한 뒤 페이징을 사용하는 쿼리 10곳을 함께 수정했습니다.",
            code: {
              language: "python",
              content: `- q = q.order_by(sort_col.asc() if query.sort_order == "asc" else sort_col.desc())
+ is_asc = query.sort_order == "asc"
+ q = q.order_by(
+     sort_col.asc() if is_asc else sort_col.desc(),
+     Send.send_id.asc() if is_asc else Send.send_id.desc(),
+ )`,
            },
          },
          {
            description:
              "누락 건수가 실행할 때마다 달랐기 때문에(관찰 시점 5건, 재현 시점 1건) 단발 실행으로는 판단할 수 없었습니다. 검증을 반복 실행으로 설계하고, 먼저 대조군으로 \"이 검증이 문제를 잡아낼 수 있는가\"를 확인했습니다.\n\n수정 전 방식(단일 정렬): 10회 중 10회 누락 발생\n수정 후 방식(PK 2차 키): 10회 중 0회 누락 발생\n\n수정 전 코드로 10번 모두 실패하므로 이후 통과 결과가 우연이 아님이 담보됩니다.",
          },
          {
            description:
              "테스트 인프라가 없어(테스트 파일 0개, pytest 미설치) 새로 구성하고 회귀 테스트 13개를 추가했습니다. 다만 SQLite는 MySQL의 tie 비결정성을 재현하지 못해, 데이터 기반 테스트는 tie-break를 제거해도 통과합니다. 회귀를 실제로 잡아낸 것은 발행된 SQL을 캡처해 ORDER BY의 마지막 정렬키가 PK인지 검증하는 구조 테스트 하나였고, 이 한계를 문서에 명시했습니다.",
          },
        ],
        result:
          "페이징 쿼리 10곳과 상위 N 조회 3곳을 전수 수정했습니다. 페이지 크기를 7·20·50·100으로 바꿔도 결과 집합이 완전히 동일하고, 정렬 6조합·필터 전수·전 도메인 순회에서 누락 0건, 중복 0건을 확인했습니다.\n\n수정 전후 EXPLAIN이 동일해 성능 회귀는 없었습니다. 정렬 컬럼에 인덱스가 없어 기존에도 전부 filesort였기 때문입니다.\n\n이미 발생한 누락이 데이터에 남아 있는지도 확인했습니다. 판정 기준은 배치 혼재 여부입니다 — 누락이 있었다면 같은 created_at 그룹 안에 PREPARING과 DELIVERED가 섞여 있어야 합니다. 전 배치 검사 결과 혼재 배치는 0개로, 과거 처리분에 누락 잔여가 없었습니다.\n\n다만 tie-break로 해결되지 않는 부분이 남습니다. 전체 선택이 페이지를 순회하는 수 초 동안 다른 관리자가 발송을 생성하거나 취소하면 건수는 여전히 어긋날 수 있습니다. 순회 자체를 없애는 ID 일괄 조회를 후속 과제로 남겼습니다.",
        screenshots: [
          {
            src: "/magazine-manager/tie-break-before.png",
            caption:
              "총 295건인데 선택은 290건 — 버튼·배지·토스트가 모두 290을 가리킨다",
            type: "before",
          },
          {
            src: "/magazine-manager/tie-break-after-1.png",
            caption: "수정 후 — 총 2,874건이 2,874건 그대로 선택된다",
            type: "after",
          },
          {
            src: "/magazine-manager/tie-break-after-2.png",
            caption: "선택된 2,874건이 누락 없이 일괄 처리된다",
            type: "after",
          },
        ],
      },
      {
        id: "address-change-shared-box",
        kind: "incident",

        title: "배송지 변경 오판과 공유 박스 오염",
        summary:
          "구독이 남았는데 배송지를 못 바꾸고, 바꾸면 같은 박스에 든 다른 고객의 책까지 주소가 바뀌던 문제",
        problem:
          "구독 기간이 4개 호 남은 정기구독의 배송지를 바꾸려 하자 \"모두 이미 발송 완료되어 기존 배송지가 유지됩니다\"라며 거부됐습니다. 에러도 예외도 아니었고 요청은 200으로 응답했습니다. 정책상 막은 것처럼 보이지만 실은 오판이었습니다.\n\n판정 코드가 \"발송 예정\"을 이미 DB에 존재하는 Send 레코드로만 판단하고 있었습니다. 정기구독은 매월 그 호의 Send가 새로 생성되는 구조라, 아직 [발송 생성]을 누르지 않은 다음 호는 Send 자체가 없습니다. 발송 예정 목록이 빈 것은 \"보낼 게 없어서\"가 아니라 \"아직 안 만들어서\"였는데, 코드가 이 구분을 하지 못했습니다. 정기구독자가 이사해도 남은 전 회차가 옛 주소로 계속 발송되며, 관리자가 이를 우회할 UI 경로가 없었습니다.\n\n조사 중 두 번째 결함을 발견했습니다. Send : SendItem은 정기구독이 그룹화 키 없이 품목당 박스 하나라 결과적으로 1:1일 뿐이고, 단품·VIP는 (우편번호, 주소)로 묶이므로 1:N입니다. 그런데 배송지 변경이 Send 스냅샷을 박스 통째로 덮어쓰고 있었습니다. 엑셀은 Address를 조인하지 않고 Send 스냅샷을 직접 읽으므로, 한 명만 이사시키면 같은 박스에 든 다른 고객의 책까지 새 주소로 발송됩니다. 아무 조작도 하지 않은 고객이 피해를 봅니다.\n\n이 결함이 그동안 드러나지 않은 이유는 조회 함수의 시야였습니다. 활성 SendItem 조회가 order_item_id로 필터하므로 \"내 SendItem 1건\"만 보이고, 그 박스에 다른 품목이 몇 개 더 들어 있는지는 알려주지 않습니다.",
        decision:
          "판정 기준을 파생 데이터(Send 레코드)에서 원본 사실(구독 범위)로 옮겼습니다. \"앞으로 발송할 호가 남았는가\"는 실효 구독 종료 호와 발송 이력으로 판단해야 합니다.\n\n공유 박스 오염은 스냅샷을 갈아끼우는 방식 자체가 그룹화 모델과 어긋난 결과였습니다. 발송 후보 박스는 (우편번호, 주소)로 묶인 결과물이므로, 주소가 바뀌었다면 그 품목이 속할 박스 자체가 달라져야 맞습니다. 그룹화를 다시 돌리지 않고 박스의 주소 라벨만 바꾸면 \"서울 주소로 묶인 박스인데 라벨은 부산\"이라는 모순이 만들어집니다. 한 명만 바꿔도 박스 전체가 영향받는 것은 이 설계에서 필연이었습니다.\n\n세 가지 안을 비교했습니다.\nA. 이미 만들어진 발송 후보는 건드리지 않고 [발송 생성] 재실행으로 반영 → 채택\nB. 박스에서 내 SendItem만 제거 → 오배송은 막지만 정기구독까지 발송 목록에서 즉시 사라져 \"왜 없어졌지?\"가 \"왜 안 바뀌었지?\"보다 나쁨\nC. 박스에 나 혼자면 덮어쓰고 공유 박스면 분리 → 같은 동작에 두 갈래 경로가 생겨 어떤 때는 바로 되고 어떤 때는 안 되는 예측 불가능한 UX\n\nA를 채택하면 그룹화 로직이 \"주소 → 박스 배치\"의 유일한 진실이 됩니다. 스냅샷을 손으로 맞추는 경로가 사라지므로 박스 구성과 라벨이 어긋나는 상태가 원천적으로 생기지 않습니다.",
        steps: [
          {
            description:
              "판정을 \"앞으로 발송할 호가 남았는가\"로 교체했습니다. issue는 YYYYMM 6자리 고정이므로 문자열 비교가 곧 시간순 비교입니다. last_send_issue 하나만 쓰지 않은 이유는 단품이 이 값을 갱신하지 않고 레거시 엑셀 이관분은 NULL일 수 있어서이며, 실제 SendItem 이력과 max를 취하는 이중 안전장치를 뒀습니다.",
            code: {
              language: "python",
              content: `def _has_remaining_send_issues(order_item, shipped_issues):
    sent_issues = [issue for issue in shipped_issues if issue]
    if order_item.last_send_issue:
        sent_issues.append(order_item.last_send_issue)

    # MONTHLY 는 시작호 = 종료호(1회성) — 보냈으면 끝, 아직이면 남아 있다
    if order_item.product_kind != "YEARLY":
        return not sent_issues

    end_issue = order_item.final_subscribe_end_issue
    if not end_issue:
        return False
    return max(sent_issues, default="") < end_issue`,
            },
          },
          {
            description:
              "공유 박스 오염은 SQLite in-memory로 상황을 만들어 확정했습니다. 같은 주소에 고객1·고객2의 단품 주문을 넣어 한 Send에 SendItem 2건이 묶이게 한 뒤 고객1만 이사시켰습니다. 두 품목의 address_id는 의도대로 갈라졌지만 박스 스냅샷은 통째로 오염됐습니다.",
            code: {
              language: "python",
              content: `# 수정 전 — 박스 전체를 덮어씀
sends = db.query(Send).filter(Send.send_id.in_(preparing_send_ids)).all()
for send in sends:
    if send.send_status == "PREPARING":
        send.recipient_address = new_address.recipient_address

# 재현 결과
# item1.address_id       = 새 주소   (의도대로)
# item2.address_id       = 옛 주소   (의도대로)
# send.recipient_address = "부산시 해운대구 99"   ← 박스 전체가 오염`,
            },
          },
          {
            description:
              "스냅샷 덮어쓰기 블록을 제거하고 OrderItem.address_id만 갱신하도록 바꿨습니다. 아직 Send가 없는 호는 발송 그룹화가 OrderItem.address_id를 조인해 주소를 읽으므로 [발송 생성] 시점에 자동 반영됩니다.\n\n대신 즉시 반영이 사라지는 트레이드오프가 생겨, 재생성을 잊으면 예전 주소로 나갑니다. 변경 전 모달 하단, 일괄 변경 확인 모달, 변경 후 토스트 세 지점에 안내를 넣고 재생성 안내를 최우선으로 띄웠습니다. 문구는 내부 상태값이 아니라 화면에 실제로 표시되는 용어(PREPARING → \"발송 후보\")로 썼습니다. 초안에서 \"이미 생성된 발송 건\" 같은 표현을 썼다가 관리자가 화면에서 보는 단어와 달라 전면 수정했습니다.",
          },
          {
            description:
              "수정 검증 중 세 번째 증상이 보고됐습니다. 같은 주문의 배송지를 30초 안에 두 번 바꾸면 두 번째부터 \"변경되지 않았습니다\" 거짓 경고가 뜨고 화면에 예전 주소가 표시됐습니다. 앞선 수정이 잘못된 것처럼 보였지만, 운영 DB의 활동 로그와 updated_at을 대조하니 백엔드는 매번 정상 변경하고 있었습니다.\n\n원인은 결과 확인용 fetchQuery였습니다. QueryClient 기본값 staleTime: 30_000 때문에 서버를 타지 않고 변경 전 캐시를 반환하고 있었습니다. 이 캐시는 화면이 배송지를 그리는 데도 쓰여, 하나의 stale 값이 스킵 판정과 화면 표시 두 곳을 동시에 망가뜨렸습니다.",
            code: {
              language: "tsx",
              content: `const freshRes = await queryClient.fetchQuery({
  queryKey: ["order", orderId],
  queryFn: () => ordersApi.getOrder(orderId).then((r) => r.data),
  staleTime: 0,   // ← 이 호출의 목적은 조회가 아니라 "방금 보낸 변경이 반영됐는가"의 검증
})`,
            },
          },
          {
            description:
              "응답 필드 pending_issues를 preparing_issues로 리네임했습니다. 같은 값인데 의미가 정반대로 뒤집혔기 때문입니다 — 이전에는 \"스냅샷을 덮어썼으니 반영 완료된 호\"였고 이후에는 \"예전 주소 그대로라 재생성이 필요한 호\"입니다. 주석만 고치면 다음에 읽는 사람이 거꾸로 해석할 위험이 컸습니다. 이제 DB 상태값 PREPARING, 백엔드 필드 preparing_issues, 화면 표기 \"발송 후보\" 세 층의 이름이 일치합니다.",
          },
        ],
        result:
          "회귀 테스트 21건(함수 15개, 파라미터 케이스 포함)을 추가했습니다. 공유 박스 오염은 수정 전 코드에서 실제로 실패하는 것을 먼저 확인한 뒤 재현 시나리오 그대로 고정했습니다.\n\n정기구독자가 이사하면 남은 회차가 새 주소로 나가고, 같은 박스에 든 다른 고객의 배송지는 그대로 유지됩니다. 함께 발견한 VIP 슬롯 승계 누락(새 배송지에 VIP 플래그가 붙지 않아 VIP 구독자가 이사하면 VIP 발송 대상에서 조용히 빠지던 문제)도 배송지 변경 모달에서 VIP 그룹을 함께 지정하도록 보완했습니다.\n\n이 문제에서 얻은 것은 세 가지입니다. 레코드의 부재를 상태의 종결로 읽으면, 아직 만들지 않았을 뿐인 것을 끝난 것으로 오판합니다. 조회 함수의 시야가 곧 사고의 시야가 됩니다 — order_item_id로 필터한 탓에 \"내 것 1건\"만 보였고, 그 send_id로 Send 전체를 덮어쓰는 코드가 자연스러워 보였습니다. 그리고 \"확인\"에는 캐시를 쓰면 안 됩니다. 같은 호출이라도 목적이 조회면 캐시 재사용이 이득이고, 방금 보낸 변경의 반영 여부를 묻는 검증이면 캐시가 곧 오답입니다.",
        screenshots: [
          {
            src: "/magazine-manager/address-change-before.png",
            caption:
              "구독이 4개 호 남아 있는데도 \"모두 이미 발송 완료\"로 판정해 변경을 거부하던 경고",
            type: "before",
          },
        ],
      },
      {
        id: "cafe24-shipment-deadlock",
        kind: "incident",

        title: "카페24 배송 상태 교착",
        summary:
          "멱등하지 않은 외부 API와 부분 실패 전체 폐기가 맞물려, 재시도할수록 악화되는 교착을 만든 장애",
        problem:
          "8월호 정기구독 발송을 처리하려고 발송 후보 53건을 전체 선택해 [발송 완료 처리]를 실행했으나 성공 0건 / 실패 53건이었습니다. 재시도해도 결과가 같았고, 활동 로그상 같은 날 두 시간 동안 31회 반복 실행됐습니다.\n\n단순 실패가 아니었습니다. 추측을 배제하려고 카페24 Admin API로 53건의 실제 배송 상태를 직접 조회하니 49건이 shipping(배송중), 2건이 shipped(배송완료)였고 아직 standby(배송대기)로 남은 것은 2건뿐이었습니다. 카페24에서는 51건이 이미 진행 상태인데 우리 시스템은 53건 전부 PREPARING인, 두 시스템이 어긋난 채 고착된 상태였습니다.\n\n더 나쁜 것은 누를수록 악화된다는 점이었습니다. 조사 시점에 standby로 남아 성공 가능했던 2건이, 이후 두 번의 클릭으로 각각 카페24에서는 전환에 성공하고 우리 DB에는 반영되지 않은 채 교착에 편입되어 0건이 됐습니다. 조사 중에도 상태가 변하고 있었습니다.",
        decision:
          "세 가지가 맞물려 빠져나갈 수 없는 상태를 만들고 있었습니다.\n\n1. 카페24 상태 전환 API가 멱등하지 않습니다. 이미 shipping인 주문에 status: \"shipping\"을 다시 보내면 422 \"This status cannot be applied to this order. (Current order status: In transit)\"를 반환합니다. 목표 상태에 이미 도달했는데도 오류입니다.\n2. 부분 실패를 전체 실패로 처리합니다. 배치 호출 함수가 응답의 errors 배열을 만나면 어느 건이 성공했는지 정보를 통째로 버리고 반환합니다. 한 요청에 최대 100건을 묶으므로, 이미 shipping인 건이 하나라도 섞이면 그 배치 전체가 죽습니다. 53건은 한 배치에 들어가므로 전멸합니다.\n3. 정기구독 재시도 가드가 무력합니다. 대상 판정에 쓰는 last_send_issue는 DELIVERED 전환에 성공해야만 세팅되므로, 실패하면 다음 시도에서도 같은 건이 그대로 대상에 포함됩니다. 단품은 cafe24_shipping_code 유무로 이미 성공한 건을 건너뛰지만, 정기구독은 이 값이 주문 가져오기 시점에 이미 채워지므로 같은 방식을 쓸 수 없습니다. 즉 정기구독에는 \"카페24 반영을 이미 성공시켰다\"는 사실을 기록할 자리가 없었습니다.\n\n8월호 발송을 먼저 끝내야 했으므로, 카페24 상태를 standby로 되돌려 정방향 전환이 가능한 상태로 만드는 임시 복구를 택했습니다.\n\n근본 수정 방향은 errors 배열 각 항목의 more_info.shipping_code로 건별 판정하는 것입니다. errors에 없는 건은 성공으로 진행하고, 사유가 In transit이면 이미 목표 상태에 도달했으므로 성공으로 간주하며, 그 외 사유만 실패로 남겨 사용자에게 표시합니다. 어느 건이 왜 실패했는지 특정할 정보를 지금은 버리고 있을 뿐이므로, DB 스키마나 public API 변경 없이 해결됩니다.",
        steps: [
          {
            description:
              "첫 가설은 \"카페24에서 누군가 직접 상태를 바꿨다\"였습니다. 활동 로그를 조회하니 발송 관련 작업은 전부 한 사람이 우리 시스템에서 실행한 것이었고 외부 조작 흔적이 없었습니다. 이어서 코드를 확인한 결과 애초에 외부 조작을 가정할 필요가 없었습니다 — 우리 시스템이 배송완료 처리 시 카페24로 상태를 push하고 있었습니다. 카페24의 \"배송중\"은 설계대로 우리가 보낸 결과였습니다. 이 단계를 기각하지 않았다면 원인을 계속 시스템 밖에서 찾았을 것입니다.",
            code: {
              language: "python",
              content: `yearly_requests.append({
    "order_id": oi.order.external_order_id,
    "shipping_code": oi.cafe24_shipping_code,
    "status": "shipping",
})`,
            },
          },
          {
            description:
              "다음으로 \"standby인 건은 성공하고 shipping인 건은 실패한다\"고 가정했으나, 성공한 2건의 처리 직전 상태는 이미 처리가 끝난 뒤라 확인할 수 없었습니다. 조회 시점에 둘 다 shipping인 것은 성공의 결과이지 원인의 증거가 아닙니다. 근거 없이 \"한 번 shipping이 되면 영원히 처리 불가\"라고 단정했다가 철회했습니다 — 결과를 원인으로 뒤집어 읽은 오류였습니다.\n\n원인은 카페24가 반환하는 실제 오류 전문을 확보하고서야 확정됐습니다. 앞선 가설은 결과적으로 맞았지만, 맞은 이유는 \"standby여서 성공\"이 아니라 \"shipping이라서 거부\"였습니다.",
            code: {
              language: "json",
              content: `{"code": 422,
 "message": "This status cannot be applied to this order. (Current order status: In transit)",
 "more_info": {"order_id": "20260605-0000019", "status": "shipping",
               "shipping_code": "D-20260605-0000019-00"}}`,
            },
          },
          {
            description:
              "오류 전문을 정밀하게 읽던 중, 화면에는 \"처리되지 않음\"으로 표시되는데 errors 배열 51개 항목 어디에도 없는 건을 발견했습니다. 해당 건들의 카페24 상태를 처리 전후로 대조하니 standby → shipping으로 전환에 성공해 있었습니다. 카페24에서는 성공했는데 화면은 실패로 표시하고 DB는 PREPARING으로 남긴 것입니다. 원인은 배치 처리 코드가 errors를 만나면 성공분 정보까지 버리고 반환하는 데 있었습니다.",
            code: {
              language: "python",
              content: `result = r.json()
errors = result.get("errors") or []
if errors:
    return None, f"Cafe24 Shipments API partial error: {errors}", 400
    # ← 배치 안의 어떤 건이 성공했는지 정보를 통째로 버린다

# 호출부는 실패 배치에 든 "모든" 항목을 실패로 기록하고
# DELIVERED 전환 대상에서 제외한다`,
            },
          },
          {
            description:
              "교착이 형성되는 순서는 이렇습니다.\n\n1회차: 53건 PUT → 카페24는 standby 건들을 실제로 shipping으로 전환 → 응답에 errors(이미 shipping이던 건들) → 우리 코드가 배치 전체 폐기 → DB는 전부 PREPARING 유지\n2회차: 가드가 통과시키므로 같은 53건 재요청 → 1회차에 전환된 건도 이제 shipping이라 422 → errors 항목만 늘어남 → 또 전체 폐기\n\n재시도할수록 errors 대상이 늘어나기만 하고, 성공 가능했던 건이 클릭할 때마다 하나씩 교착에 편입됩니다.",
          },
          {
            description:
              "임시 복구는 53건을 shipping → standby로 되돌리는 방식으로 했습니다. 역행이 가능한지 미검증이었으므로 1건 먼저 시도하고 실패하면 즉시 중단하도록 설계했고, 한 건의 실패가 다른 건에 영향을 주지 않도록 배치로 묶지 않고 1건씩 개별 호출했습니다.\n\n첫 시도는 422로 실패했습니다. shipping_code만 보낸 것이 원인으로, standby 전환에는 order_id가 함께 필요했습니다. 이를 추가하니 53건 전부 성공했습니다. 이후 tracking_no·운송사 코드·shipping_code가 그대로인지 대조해 부수 효과가 없음을 확인했습니다.",
            code: {
              language: "python",
              content: `# 되돌리기 스크립트의 요청 본문 — 첫 시도에서 아래 422 를 받았다
# 422 If you make a request without a combined shipment number,
#     an order number must be entered.
- {"shipping_code": code, "status": "standby"}
+ {"order_id": order_id, "shipping_code": code, "status": "standby"}`,
            },
          },
        ],
        result:
          "되돌린 53건을 한 번에 전체 선택해 재처리했습니다. 나눠 실행하면 먼저 성공한 건이 shipping이 되어 다음 배치에서 다시 422를 유발하기 때문입니다. 발송 후보 정기 탭 53건 → 0건, DELIVERED 전환 53건, last_send_issue 갱신 53건으로 정합성을 회복하고 8월호 발송을 완료했습니다.\n\n다만 임시 복구는 데이터만 정리했을 뿐 원인은 그대로입니다. 배치 하나가 실패해도 나머지 배치는 계속 진행하는 부분 성공 허용 경로는 장애 이전에 이미 넣어 두었지만, 53건이 한 배치(최대 100건)에 통째로 들어가는 규모에서는 배치 간 격리가 아무 역할도 하지 못했습니다. 부분 성공을 배치 단위가 아니라 건 단위로 판정하는 것이 이 장애가 요구하는 수정이며, 다음 호 발송 전에 처리할 과제로 남겨 두었습니다. 미적용 상태로 다음 발송을 진행하면 되돌리기 작업을 매달 반복해야 합니다.\n\n조사 과정에서 부수 결함도 드러났습니다. 실패한 처리가 422 오류 전문(53건분)을 활동 로그 details 컬럼에 통째로 저장해 로그 1건이 744KB까지 커졌고, 목록 1페이지 30건의 합계가 2.5MB에 달해 정렬 시 \"Out of sort memory\"로 활동 로그 조회 자체가 500을 반환하고 있었습니다. 실패 기록이 다음 장애를 만드는 형태였습니다.",
        screenshots: [
          {
            src: "/magazine-manager/cafe24-deadlock-before.png",
            caption:
              "성공 0건 / 실패 53건 — 카페24의 422 원문이 화면에 그대로 쏟아진다",
            type: "before",
          },
          {
            src: "/magazine-manager/cafe24-deadlock-after.png",
            caption:
              "standby 로 되돌린 뒤 한 번에 재처리 — 발송 후보 정기 탭 53건이 0건이 됐다",
            type: "after",
          },
        ],
      },
    ],
    results: [
      "월 약 3,000건 정기구독 발송 명단이 버튼 한 번으로 자동 생성",
      "Cafe24 주문을 수동 엑셀 입력 없이 자동 import",
      "발송 누락·중복 발송 0건, 구독 기간 계산 오류 없음",
      "만료 구독도 전부 보존 — 재구독 시 이전 구독 이력을 즉시 조회해 맥락 파악 가능",
      "전화 상담 시 과거 발송 이력·변경 내역이 모두 남아있어 정확한 응대 가능",
      "발송 이력 보존으로 미수령 분쟁 시 근거 데이터로 활용",
      "6종 도서 × 정기구독+단품 상품군을 통합 관리하며 실제 운영 중",
    ],
    github: "https://github.com/sunmok-labs",
    demo: null,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
