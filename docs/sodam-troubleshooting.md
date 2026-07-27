# 소담소담(BlackCows) 챗봇 — 기술 트러블슈팅

> LangGraph 기반 낙농 상담 챗봇 '소담이'의 고도화 과정.
> 모든 항목은 실제 코드·git 커밋 근거 기반으로 재구성했다. (근거 없는 항목은 제외)
> 출처 레포: `BlackCows-Team/blackcows-server` · `services/chatbot_langgraph/`

- **풀버전** — 상세 페이지/아코디언용
- **슬림버전** — 카드 그리드/좁은 공간용
- 효과는 측정하지 않은 성능 수치 대신 **코드로 확인 가능한 사실**로만 기술한다.
- `⟨실제 기억 채울 자리⟩` 표시는 개발 당시의 증상·판단을 1인칭으로 덧붙일 지점이다.

---

# 풀버전

## ① 질문 유형별 라우팅 아키텍처 재설계를 통한 응답 품질 및 UX 개선 · ⭐⭐⭐⭐⭐

> **기술 스택** : LangGraph · LangChain · OpenAI GPT-4o-mini · Python

### 문제 상황

소담이 챗봇은 하나의 서비스 안에서 성격이 서로 다른 질문을 처리해야 했다.

- 낙농 일반 지식
- 사용자 농장의 특정 소 정보 조회
- 챗봇과의 자연스러운 대화

초기에는 질문 유형을 구분하지 않고 **하나의 응답 흐름**에서 모든 질문을 처리했다.

이로 인해 두 가지 문제가 발생했다.

1. **"103번 소 상태 알려줘."**(사용자 농장의 특정 소 조회)와 **"젖소 발정 주기는?"**(일반 지식)처럼 필요한 데이터 소스가 서로 다른 질문이 같은 경로에서 처리되어 답변 품질이 일정하지 않았다.
2. **"로또 번호 알려줘."**, **"오늘 점심 뭐 먹지?"**처럼 서비스와 무관한 질문에도 일반 LLM이 그대로 응답하면서 낙농 전문 챗봇이라는 서비스 정체성이 흐려졌다.

### 원인 분석

문제의 원인은 **질문의 의도(Intent)를 먼저 판별하는 단계가 없었다는 것**이었다.

질문마다 필요한 데이터 소스는 서로 달랐다.

| 질문 유형 | 필요한 데이터 |
| --- | --- |
| 낙농 일반 지식 | RAG 문서 검색 |
| 특정 소 조회 | 농장 DB |
| 자연스러운 대화 | 대화 Context |

하지만 질문을 구분하지 않고 하나의 응답 흐름으로 처리하면서 적절한 데이터 소스를 선택하지 못했다.

결국 **질문의 의도보다 응답 생성이 먼저 이루어지는 구조** 자체가 문제였다.

### 해결 과정

**1. 질문 분류(Classifier)를 독립 노드로 분리**

먼저 응답 생성 이전에 질문의 의도를 분류하는 `classify_question_route` 노드를 LangGraph 그래프의 시작 단계에 추가하였다.

질문 분류는 창의성보다 **항상 동일한 결과를 반환하는 일관성**이 중요하다고 판단하여 `temperature=0`으로 설정하였다.

```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

chain = prompt | llm | StrOutputParser()

result = chain.invoke({
    "question": state["current_question"]
})
```

분류 결과는 다음 네 가지 중 하나만 반환하도록 설계하였다.

- rag
- cow_info
- general
- irrelevant

**2. 질문 유형별로 전용 노드에 라우팅**

분류 결과에 따라 LangGraph의 `add_conditional_edges()`를 이용하여 질문을 서로 다른 처리 노드로 연결하였다.

```python
builder.add_conditional_edges(
    "classifier",
    route_by_answer_type,
    {
        "rag": "rag_response",
        "cow_info": "cow_info_graph",
        "general": "general_response",
        "irrelevant": "irrelevant_response",
    }
)
```

각 노드는 하나의 책임만 수행하도록 설계하였다.

| 질문 유형 | 처리 방식 |
| --- | --- |
| rag | RAG 문서 검색 |
| cow_info | 농장 DB 조회 |
| general | UX 대화 |
| irrelevant | 서비스와 무관한 질문 차단 |

이를 통해 **질문의 의도를 먼저 분류한 뒤, 적절한 데이터 소스로 라우팅하는 구조**를 만들 수 있었다.

**3. 새로운 문제 발생 : Over-blocking**

하지만 실제 테스트 과정에서 예상하지 못한 문제가 발생했다.

서비스와 무관한 질문만 차단하려고 추가했던 `irrelevant`가

- "고마워."
- "너 누구야?"
- "내가 아까 뭐 물어봤지?"

같은 **챗봇으로서 자연스럽게 응답해야 하는 UX 대화까지 모두 차단**하고 있었다.

결과적으로

> "낙농 관련 질문에만 답변할 수 있습니다."

라는 응답이 반환되면서 사용자 경험이 오히려 저하되었다.

즉, **무관한 질문만 차단하려 했지만 정상적인 UX 대화까지 함께 차단하는 Over-blocking 문제가 발생한 것이다.**

**4. 해결 방법 검토**

처음에는 UX 대화를 처리하는 새로운 노드를 추가하는 방법도 고려하였다.

그러나 문제를 분석해 보니 **처리 노드가 부족한 것이 아니라 질문 유형의 경계가 잘못 정의되어 있다는 점**이 원인이었다.

노드를 계속 추가하면 그래프만 복잡해지고 역할이 중복될 수 있었다.

따라서 새로운 노드를 만드는 대신 **기존 노드의 책임을 다시 정의하는 방향**을 선택하였다.

**5. General 노드의 역할 재정의 (핵심)**

기존에는 `general` 노드를 단순한 일반 대화 정도로 정의하고 있었다.

이를

> **"낙농 질문은 아니지만 챗봇으로서 반드시 응답해야 하는 UX 대화 전담 노드"**

로 역할을 재정의하였다.

최종적으로 질문 유형의 경계를 다음과 같이 다시 설계하였다.

- **낙농 관련 질문 → rag**
- **사용자 농장의 특정 소 조회 → cow_info**
- **기억, 감사, 인사, 챗봇 소개 등 자연스러운 UX 대화 → general**
- **로또, 주식, 정치 등 서비스와 무관한 질문 → irrelevant**

이를 통해 `irrelevant`는 진짜 무관한 질문만 처리하고,

> "내가 아까 뭐 물어봤지?"
>
> "고마워."

와 같은 질문은 `general`로 라우팅되어 정상적으로 응답할 수 있도록 경계를 명확하게 재설계하였다.

**6. Cow 정보 분류 기준 정밀화**

멀티턴 대화에서 개체 조회가 자연스럽게 이어질 수 있도록 `cow_info` 분류 기준도 함께 개선하였다. (커밋 : **0de1fea**, **37f642e**)

기존에는

- "103번 소"

정도만 인식했지만, 다음과 같은 표현도 모두 `cow_info`로 분류하도록 확장하였다.

- 12자리 이표번호
- 그 소
- 그 아이

이를 통해

> "103번 소 상태 알려줘."
>
> ↓
>
> "그 소 어제 분만했어?"

와 같은 후속 질문도 동일한 개체 조회 흐름으로 정확하게 라우팅할 수 있도록 개선하였다.

**7. LLM 오출력 방어**

질문 분류를 LLM이 수행하기 때문에 정의되지 않은 문자열이 반환될 가능성도 고려하였다.

따라서 정의된 네 가지 유형 외의 값이 반환되면 `irrelevant`로 처리하도록 방어 로직을 추가하였다.

```python
if result not in {
    "rag",
    "cow_info",
    "general",
    "irrelevant"
}:
    result = "irrelevant"
```

이를 통해 예상하지 못한 출력에도 그래프가 안정적으로 동작하도록 구성하였다.

### 적용 결과

- 질문을 **응답 생성 이전에 먼저 분류하고, 분류 결과에 따라 적절한 데이터 소스로 연결하는 라우팅 아키텍처**를 구축하였다.
- 서비스와 무관한 질문은 사전에 차단하여 **낙농 전문 챗봇이라는 서비스 정체성**을 유지할 수 있었다.
- `general` 노드의 역할을 재정의하여 **Over-blocking 문제를 해결하고 자연스러운 UX 대화를 유지**할 수 있었다.
- 지시어와 12자리 이표번호까지 인식하도록 분류 기준을 확장하여 **멀티턴 대화의 정확도를 향상**시켰다.
- 질문 유형과 처리 노드의 책임을 명확하게 분리하여 **새로운 질문 유형이 추가되더라도 분류 규칙과 처리 노드만 확장하면 되는 구조**를 갖추었다.

### 배운 점

이번 트러블슈팅에서 가장 중요했던 것은 **질문을 4가지로 분류한 것 자체가 아니라, 라우팅 구조를 설계하는 과정에서 발생한 문제를 다시 설계로 해결한 경험**이었다.

처음에는 `irrelevant`를 추가하면 서비스와 무관한 질문을 해결할 수 있을 것이라 생각했다. 하지만 실제 테스트 과정에서 정상적인 UX 대화까지 차단되는 부작용을 확인했고, 원인이 **노드의 개수가 아니라 질문 유형의 경계와 각 노드의 책임 정의에 있다는 점**을 발견했다.

이를 해결하기 위해 새로운 노드를 계속 추가하는 대신 **기존 노드의 역할을 재정의하여 그래프 구조를 단순하게 유지하면서도 사용자 경험과 확장성을 함께 확보**할 수 있었다.

또한 LLM 기반 라우팅에서는 분류 정확도뿐 아니라 **예상하지 못한 출력에 대한 방어 로직까지 함께 설계해야 안정적인 서비스를 구축할 수 있다**는 점을 경험했다.

---

## ② 이표번호를 모르면 대화가 끊기던 소 정보 조회 — 단일 노드에서 상태 기반 서브그래프로 · ⭐⭐⭐⭐⭐

> **기술 스택** : LangGraph (Subgraph · Conditional Edge · State) · Firebase Firestore · Python

### 문제 상황

소담이 챗봇의 소 정보 조회는 처음에 **단일 노드** 하나로 구현되어 있었다. 질문에서 12자리 이표번호를 추출해 Firestore에서 소를 찾고, 키워드(착유·발정·건강·백신·체중 등)로 사용자가 원하는 기록 유형을 추측해 최근 기록 1건을 반환하는 구조였다.

이 구조는 두 지점에서 무너졌다.

#### 1. 이표번호가 없으면 대화가 그 자리에서 끊겼다

```python
# ab1c23e — generate_farmdata_response (그래프 노드 라벨: generate_cow_info_answer)
ear_tag_number = extract_ear_tag_number(question)
if not ear_tag_number:
    answer = "어떤 소에 대해 질문하시는지 12자리 이표번호(귀표번호)를 질문에 포함해 주세요."
    return {**state, "current_answer": answer}   # ← 여기서 흐름 종료
```

`"어제 분만한 소 누구야?"`, `"우리 농장 소 정보 알려줘"`처럼 개체를 특정하지 않은 질문은 전부 이 분기로 빠져 거부 메시지만 남기고 끝났다. 성공률을 측정할 필요도 없이 **코드 분기상 이표번호 없는 질문은 처리율 0%**였다. 사용자가 12자리 숫자를 외우고 있어야만 쓸 수 있는 챗봇이었다.

#### 2. 키워드 추측이 자주 빗나갔다

정보 종류를 `if "착유" in question`, `elif "발정" in question` 식의 키워드 매칭으로 판단했다. 사용자가 쓰는 표현이 예상 키워드와 어긋나면 엉뚱한 기록을 반환했다. **조용히 틀린 답을 주는 쪽이, 못 찾았다고 말하는 것보다 나빴다.**

### 원인 분석

두 문제의 뿌리는 같았다. **여러 턴에 걸쳐야 할 조회 과정을 상태 없는 단일 모듈에 밀어 넣은 것**이다.

실제 조회 흐름을 풀어보면 이렇다.

```
소 특정 → (실패 시) 후보 목록 제시 → 사용자 선택 → 정보 종류 선택 → 상세 응답
```

이 흐름은 본질적으로 **중간 상태**를 요구한다. 후보 목록이 무엇이었는지, 사용자가 어떤 소를 골랐는지를 다음 단계로 넘겨야 하는데, 단일 노드에는 이 상태를 담을 자리가 없었다.

문제는 파일 크기에서도 드러났다. Firebase 실연동을 거치며 `cow_info_response.py`는 **99줄에서 344줄로 3.5배 비대해졌고**, 그 안에서 8개 함수가 이표번호 추출·DB 조회·카테고리 분류·응답 빌드를 모두 떠안고 있었다.

주목할 점은 이 코드가 **깊게 중첩되어 있지는 않았다**는 것이다(최대 3단계). 문제는 복잡도의 깊이가 아니라 **넓이**였다. 한 모듈이 서로 다른 관심사 여러 개를 나란히 쥐고 있어서, "소를 못 찾으면 목록을 보여주고 고르게 하자"는 개선 하나를 넣으려 해도 조회·분류·응답 코드를 모두 헤집어야 했다.

### 해결 방법 비교

| 방법 | 장점 | 단점 |
|---|---|---|
| 단일 모듈에 조건 분기 추가 | 구현 비용 최소 | 관심사가 더 섞임, 분기 추가마다 전체 재검증 |
| 메인 챗봇 그래프에 노드 5개 직접 추가 | 흐름은 분리됨 | 메인 그래프에 소 조회 전용 노드·엣지가 섞여 복잡도 급증 |
| **전용 서브그래프로 분리** | 책임 분리, 전용 State 확보, 메인 그래프 불변 | 초기 설계 비용 |

**전용 서브그래프**를 선택했다. 메인 그래프의 `classifier`는 "이 질문을 어느 기능으로 보낼 것인가"만 판단하고, 소 조회의 다단계 흐름은 서브그래프가 통째로 책임지는 구조다.

### 해결 과정

#### 1. 전용 State 분리

메인 챗봇 상태(`DairyChatState`)와 별도로, 다단계 조회에 필요한 필드만 담은 State를 정의했다.

```python
# types.py
class DairyChatState(TypedDict):          # 메인 챗봇 상태
    user_id: str
    chat_id: str
    farm_id: str
    current_question: str
    current_answer: str
    answer_route: Literal["rag", "cow_info", "general", "irrelevant"]


class CowInfoState(TypedDict):            # 소 정보 조회 전용 상태
    user_id: str
    chat_id: str
    farm_id: str
    current_question: str
    current_answer: str
    selected_cow_info: Optional[Dict[str, Any]]   # 특정된 소의 기본 정보
    awaiting_confirmation: bool
    cow_list: Optional[List[Dict[str, Any]]]      # 후보 목록 (fallback용)
```

메인 상태가 `answer_route`(어디로 보낼지)만 든다면, `CowInfoState`는 `selected_cow_info`·`cow_list`(무엇을 조회 중인지)를 든다. **단일 노드 구조에서 담을 자리가 없었던 중간 상태**가 정확히 이 두 필드다.

#### 2. 단일 노드 → 5개 노드 서브그래프 (커밋 `37f642e`)

344줄짜리 단일 모듈을 관심사별 3개 파일(`graph` 40줄 / `nodes` 154줄 / `service` 193줄)로 쪼개고, 노드마다 책임을 하나씩만 지도록 나눴다.

| 노드 | 책임 |
|---|---|
| `check_ear_tag_node` | 이표번호로 소 식별 (진입점) |
| `show_cow_list_node` | 식별 실패 시 농장 소 목록 제시 (fallback) |
| `select_cow_node` | 목록에서 사용자 선택 처리 |
| `ask_info_detail_node` | 정보 카테고리 질의 |
| `ask_info_detail_response_node` | 상세 조회 후 응답 생성 |

```python
# cow_info_graph.py
def create_cow_info_graph():
    graph = StateGraph(CowInfoState)

    graph.add_node("check_ear_tag_node", RunnableLambda(check_ear_tag_node))
    graph.add_node("show_cow_list_node", RunnableLambda(show_cow_list_node))
    graph.add_node("select_cow_node", RunnableLambda(select_cow_node))
    graph.add_node("ask_info_detail_node", RunnableLambda(ask_info_detail_node))
    graph.add_node("ask_info_detail_response_node", RunnableLambda(ask_info_detail_response_node))

    graph.set_entry_point("check_ear_tag_node")

    graph.add_conditional_edges(
        "check_ear_tag_node",
        lambda s: "selected_cow_info" in s and s["selected_cow_info"] is not None,
        {
            True: "ask_info_detail_node",     # 소 특정 성공 → 목록 단계 스킵
            False: "show_cow_list_node"       # 실패 → 목록 fallback
        }
    )
    graph.add_edge("show_cow_list_node", "select_cow_node")
    graph.add_edge("select_cow_node", "ask_info_detail_node")
    graph.add_edge("ask_info_detail_node", "ask_info_detail_response_node")
    graph.add_edge("ask_info_detail_response_node", END)

    return graph.compile()
```

#### 3. 조건부 진입으로 지름길 확보

위 `add_conditional_edges`가 이 설계의 핵심이다. `selected_cow_info` 필드 하나의 유무로 경로가 갈리므로, **이표번호를 아는 사용자는 리팩토링 전과 동일한 최단 경로**를 유지하면서 모르는 사용자에게만 목록 경로를 태울 수 있었다. fallback을 추가하되 기존 경험을 손해 보지 않는 것이 조건이었다.

#### 4. 이중 식별 + 목록 fallback

식별 실패가 곧 대화 종료가 되지 않도록 3단계로 완충했다.

```python
# 1차 — 정규식으로 12자리 이표번호 추출
def extract_ear_tag_number(text: str) -> str | None:
    match = re.search(r'(\d{12})', text)
    return match.group(1) if match else None


# 2차 — select_cow_node: 이표번호 완전일치 또는 이름 부분매칭
ear_tag_number = extract_ear_tag_number(question)

if ear_tag_number:
    selected_cow = next(
        (cow for cow in cow_list if cow["ear_tag_number"] == ear_tag_number), None
    )
else:
    selected_cow = next(
        (cow for cow in cow_list if cow["name"] in question), None   # 이름 부분매칭
    )

# 3차 — 실패 시 목록을 다시 제시해 흐름 유지
if not selected_cow:
    return show_cow_list_node(state)
```

목록은 이름·이표번호·출생일을 함께 노출하고 **최대 10마리로 제한**했다. 전체 노출은 목록 자체가 다시 정보 과부하가 되기 때문이다. 농장에 소가 한 마리도 없는 경우는 별도 안내로 분기했다.

각 노드는 응답 생성 후 `append_chat_memory()`로 대화 기록을 남겨, 서브그래프 안에서 오간 내용도 전체 대화 맥락에 합류하도록 했다.

> 초기 구조에서 거부당하던 `"어제 분만한 소 누구야?"` 같은 질문은, 이제 조건을 해석하지는 못하더라도 **목록 → 선택 경로로 흘러 조회가 이어진다.** 완전 해결이 아니라 실패 시의 착지점을 만든 것이 이 단계의 목표였다.

#### 5. 키워드 추측 → 명시적 카테고리 선택

추측을 없애고 사용자가 직접 고르게 바꿨다. 소 한 마리의 관리 정보는 수십 개 필드에 걸쳐 있어 전량 출력도 답이 아니었기에 **9개 카테고리**로 나눴다.

`체형 / 산유 / 번식 / 건강 / 관리 / 혈통 / 사료 / 위치 / 행동`

선택한 카테고리의 필드만 조회하고, 그중에서도 **값이 있는 필드만** 응답에 포함했다.

```python
def build_relevant_cow_info_by_category(category: str, basic: dict, detail: dict) -> dict:
    if not basic or not detail:
        return {"오류": "해당 소의 기본 정보 또는 상세 정보를 찾을 수 없습니다."}
    if category not in fields_by_category:
        return {"오류": f"카테고리 '{category}'는 지원하지 않습니다."}

    category_data = detail.get(category, {})
    for field in fields_by_category[category]:
        value = category_data.get(field)
        if value:                        # 빈 값 스킵 → 응답 간결화
            info[field] = str(value)
    return info
```

추측이 사라지면서 **틀린 답을 주는 경우 자체가 없어졌다.** 되묻기 한 번을 추가하는 대신 오답 위험을 제거한 트레이드오프다.

#### 6. 실 데이터 불완전성 방어

placeholder에서 실제 Firestore 연동으로 전환하자(`abbaed9`) 개발 중엔 보이지 않던 문제가 나왔다. 문서 누락, 스키마와 어긋난 enum 값, 빈 필드였다. 특히 enum 불일치는 `ValueError`로 요청 전체를 500으로 떨어뜨렸다.

```python
def get_basic_info_by_ear_tag_number(ear_tag_number: str):
    try:
        docs = db.collection('cows') \
                 .where("ear_tag_number", "==", ear_tag_number) \
                 .limit(1).stream()
        cow_doc = next(docs, None)

        if cow_doc is None or not cow_doc.exists:
            print(f"[ERROR] 해당 이표번호로 문서를 찾지 못했습니다: {ear_tag_number}")
            return None

        cow_data = cow_doc.to_dict()

        health_status = None
        if cow_data.get("health_status"):
            try:
                health_status = HealthStatus(cow_data["health_status"])
            except ValueError:
                print(f"[WARNING] 잘못된 health_status 값: {cow_data['health_status']} "
                      f"(젖소 ID: {cow_data['id']})")
                health_status = HealthStatus.NORMAL   # 기본값 복구

        breeding_status = None
        if cow_data.get("breeding_status"):
            try:
                breeding_status = BreedingStatus(cow_data["breeding_status"])
            except ValueError:
                print(f"[WARNING] 잘못된 breeding_status 값: {cow_data['breeding_status']} "
                      f"(젖소 ID: {cow_data['id']})")
                breeding_status = None                # 폴백값 없이 비움

        return { ... }   # 15개 필드

    except Exception as e:
        print(f"[ERROR] 특정 젖소 *기본 정보* 조회 전체 실패 "
              f"(ear_tag_number: {ear_tag_number}): {str(e)}")
        return None
```

폴백 전략을 필드마다 다르게 가져간 것은 의도적이다. `health_status`는 표시 자체가 목적이므로 `NORMAL`로 복구하고, `breeding_status`는 잘못된 값으로 번식 판단을 오도하느니 비우는 편이 안전하다고 봤다.

모든 Firestore 조회를 `try/except`로 감싸 실패 시 `None`을 반환하고, 호출부에서 안내 메시지로 변환했다. **어떤 예외 경로로도 500이 나지 않는 것**을 기준으로 삼았다.

| 예외 상황 | 처리 |
|---|---|
| 문서 없음 / 조회 실패 | `[ERROR]` 로그 + `None` 반환 → 안내 메시지 |
| enum 값 불일치 | `[WARNING]` 로그 + `HealthStatus.NORMAL` / `breeding_status=None` |
| 농장에 소 없음 | 등록 유도 메시지 |
| 카테고리 오입력 | 9개 목록 재안내 |
| 기본·상세 정보 한쪽 누락 | "정보를 찾을 수 없습니다" 안내 |

#### 7. 서브그래프 통합 버그 (커밋 `2c83f8e`)

서브그래프를 부모 그래프에 붙이며 `.as_runnable()`을 호출했는데, `compile()`이 이미 실행 가능한 그래프를 반환하므로 불필요한 호출이었다.

```diff
- cow_info_subgraph = create_cow_info_graph().as_runnable()
+ cow_info_subgraph = create_cow_info_graph()   # compile() 결과가 이미 Runnable
```

### 적용 결과

**메인 그래프 노드 수는 5개 그대로 두고, cow_info 처리 노드만 1개 → 5개로 늘렸다.**

| 구분 | 초기 (`ab1c23e`) | 현재 (HEAD) |
|---|---|---|
| 메인 그래프 노드 수 | 5 | **5 (변동 없음)** |
| cow_info 처리 | 단일 노드 | `cow_info_graph` 서브그래프 |
| cow_info 노드 수 | 1 | **5** |
| cow_info 파일 구성 | 1파일 344줄 / 8함수 | 3파일 387줄 (graph·nodes·service) |

메인 그래프는 `classifier / general_response / rag_response / cow_info_graph / irrelevant_response` 5개를 그대로 유지한다. 소 조회 로직이 5배로 세분화되는 동안 메인 그래프는 단 한 줄도 복잡해지지 않았다는 점이, 서브그래프 분리가 실제로 값을 한 지점이다.

라인 수 자체는 344줄에서 387줄로 오히려 늘었다. 하지만 **8개 함수가 뒤섞여 있던 한 파일이 그래프 정의·노드 로직·DB 접근 3계층으로 갈렸고**, 이후 수정은 해당 계층 파일만 열면 되는 구조가 됐다.

그 외 결과는 다음과 같다.

- **이표번호를 몰라도 조회 경로가 생겼다.** 이표번호가 없으면 무조건 거부하고 종료하던 분기를 제거하고, 목록 → 선택 경로로 연결했다.
- **조건부 진입**으로 이표번호가 명확한 경우의 경로 길이는 리팩토링 전과 동일하게 유지했다.
- **키워드 추측 제거**로 오답 응답 가능성을 없앴다.
- Firestore 예외 5종을 안내 메시지로 흡수해, DB 데이터가 깨져도 500이 아닌 대화로 처리된다.

#### git 진화 타임라인

```
ab1c23e  단일 노드 (generate_farmdata_response, 99줄)
   ↓
abbaed9  실 DB 연동 → generate_cow_info_response로 개명, 344줄로 비대화
   ↓
0de1fea  질문 분류 · 이표번호 추출 로직 개선
   ↓
37f642e  5노드 서브그래프 분리 (graph / nodes / service 3파일 신규)
   ↓
2c83f8e  서브그래프 통합 버그 수정 (.as_runnable() 제거)
```

### 남은 과제

문서화하며 코드를 다시 감사한 결과 확인한, 아직 해결되지 않은 지점들이다.

#### 1. 다단계 설계와 단일 실행의 간극 (가장 근본적)

서브그래프는 **다단계 대화**를 전제로 설계했지만, 현재 그래프는 진입부터 `END`까지 **한 번의 실행에서 완주**한다. 사용자 입력을 받기 위해 중간에 멈추는 지점이 없다.

그 결과 두 가지가 어긋난다.

- **`awaiting_confirmation`이 소비되지 않는다.** 레포 전역 grep 결과 세팅 3곳, 읽기 0곳이다. 턴을 넘겨 이 플래그를 검사할 지점 자체가 없기 때문이다.
- **카테고리 검증이 같은 질문으로 수행된다.** `ask_info_detail_node`가 9개 목록을 안내한 직후 `ask_info_detail_response_node`가 `category = question.strip()`으로 검증하는데, 이 `question`은 사용자가 목록을 보기 전에 던진 원래 질문이다.

해결하려면 LangGraph의 checkpointer와 `interrupt`를 도입해 노드 사이에서 실행을 중단·재개하고, 재진입 시 `awaiting_confirmation`을 검사하는 조건부 엣지를 추가해야 한다. 이것이 다음 작업의 1순위다.

#### 2. 노드가 다른 노드를 직접 호출해 생기는 경로 오염

fallback을 그래프 엣지가 아니라 **파이썬 함수 직접 호출**로 구현한 지점이 두 곳 있다.

```python
# check_ear_tag_node 마지막 줄
return show_cow_list_node(state)      # 함수를 직접 호출
```

이 경우 `show_cow_list_node`가 실행되어 `selected_cow_info=None`이 담긴 상태가 반환되고, 그 직후 조건부 엣지가 다시 `False`로 평가되어 **같은 노드가 한 번 더 실행된다.** Firestore 조회와 `append_chat_memory`가 중복되는 구조다.

`select_cow_node`도 실패 시 같은 방식으로 반환하는데, 이후 엣지는 조건 없이 `ask_info_detail_node`로 향한다. 그곳에서 `cow['name']`을 참조하므로 **`selected_cow_info`가 `None`이면 `TypeError`가 발생**한다.

fallback을 함수 호출이 아니라 조건부 엣지로 옮기는 것이 옳은 수정이다.

#### 3. 데이터 계층의 결함 3가지

- **조회 방식 불일치** — 기본 정보는 필드 쿼리(`.where("ear_tag_number", ...)`), 상세 정보는 문서 ID 접근(`.document(ear_tag_number)`)이다. 문서 ID와 이표번호가 다른 데이터가 들어오면 기본 정보만 조회되고 상세 정보는 조용히 빈다.
- **`behavioral_info`의 enum 폴백 누락** — `Temperament(...)` / `MilkingBehavior(...)` 변환에는 개별 `try/except`가 없다. 값이 깨져 있으면 바깥 `try`에 잡혀 상세 조회 전체가 `None`으로 실패한다. `health_status`와 동일한 개별 폴백이 필요하다.
- **동기 DB 호출** — `show_cow_list_node`의 Firestore 호출이 동기라 이벤트 루프를 블로킹한다.

### 배운 점

이 구조는 처음부터 설계한 것이 아니라, **단일 노드가 한계에 부딪히면서 밀려서 도달한 결과**다.

"이표번호가 없으면 대화가 끊긴다"는 실제 한계가 목록·선택 흐름을 요구했고, 그 흐름을 담으려니 중간 상태가 필요해졌고, 상태를 관리하려니 서브그래프로 갈 수밖에 없었다. 하나의 모듈에 여러 책임이 쌓이면 **분기를 하나 추가하는 일이 곧 구조의 한계선**이 되고, 그 시점이 상태를 가진 워크플로우로 분리할 타이밍이라는 것을 배웠다.

또한 서브그래프 분리의 효과가 "그래프가 단순해졌다"가 아니라 **"복잡도를 한 곳에 가둬 메인 그래프를 안 건드리게 만들었다"**는 것도 노드 수를 직접 세어보고 나서야 정확히 이해했다. 메인 그래프 노드 수는 5개 그대로였고, 라인 수는 오히려 늘었다. 리팩토링의 성과를 "줄었다"로 말하려던 습관을 고치게 된 계기였다.

가장 크게 남은 배움은 **"구조를 만드는 것"과 "구조가 의도대로 도는 것"은 다른 문제**라는 점이다. 다단계 대화를 전제로 State와 노드를 나눴지만, 실행 모델(단일 실행 완주)을 함께 설계하지 않아 `awaiting_confirmation` 같은 필드가 쓰이지 못한 채 남았다. 상태 기반 워크플로우에서는 **상태를 어떻게 나눌지와 함께, 그 상태가 언제 저장되고 언제 재개되는지까지 같이 결정해야 한다**는 것을 이번 감사 과정에서 확인했다.

---

## ③ 배포 환경과 실행 환경 차이로 인한 Vector DB 생성 및 캐시 무효화 문제 해결 · ⭐⭐⭐⭐⭐

> **기술 스택** : LangGraph · LangChain · ChromaDB · OpenAI Embedding · Python

### 문제 상황

소담이 챗봇은 낙농 문서를 임베딩하여 Chroma Vector DB에 저장한 뒤, 사용자 질문과 가장 유사한 문서를 검색하는 RAG 구조로 구현하였다.

로컬 환경에서는 정상적으로 동작했지만, 배포 서버에서는 Vector DB 생성 단계에서 실패하여 RAG가 동작하지 않았다. 또한 DB가 정상적으로 생성된 경우에도 질문이 들어올 때마다 Vector DB를 다시 로드하여 불필요한 I/O가 반복되는 문제가 있었다.

### 원인 분석

**1. 배포 환경에서 Vector DB 생성 실패**

`persist_dir`의 기본 경로를 다음과 같이 설정해두었다.

```python
persist_dir="/RAG/chroma"
```

앞의 `/` 때문에 프로젝트 내부가 아닌 **파일 시스템 루트 경로**를 의미하게 되었고, 배포 환경에서는 해당 위치에 디렉터리를 생성할 권한이 없어 Vector DB 생성이 실패했다.

즉, 로컬과 배포 환경의 파일 시스템 및 권한 차이를 고려하지 못한 것이 원인이었다.

**2. 캐시가 동작하지 않는 구조**

Vector DB를 한 번만 생성하여 재사용하기 위해 전역 캐시(`_vectordb`)를 두었지만, 함수가 호출될 때마다 다음 코드가 실행되고 있었다.

```python
global _vectordb
_vectordb = None
```

이 때문에 아래 캐시 분기는 항상 실행되지 않았다.

```python
if _vectordb:
    return _vectordb
```

결과적으로 Vector DB는 매 요청마다 다시 로드되었고, 캐시를 구현했음에도 실제로는 전혀 활용되지 않는 구조였다.

### 해결 과정

**1. 저장 경로를 상대경로로 변경**

절대경로 대신 프로젝트 기준 상대경로를 사용하도록 변경하였다.

```diff
- persist_dir="/RAG/chroma"
+ persist_dir="RAG/chroma"
```

이를 통해 로컬과 배포 환경에서 동일한 경로 기준으로 동작하도록 수정하였다.

**2. Vector DB 캐시 복원**

불필요한 초기화를 제거하여 최초 한 번만 Vector DB를 생성하고 이후에는 메모리에 저장된 객체를 재사용하도록 수정하였다.

```diff
- _vectordb = None
+ # _vectordb = None
```

```python
if _vectordb:
    return _vectordb
```

**3. 예외 처리 추가**

배포 과정에서 원인을 빠르게 파악할 수 있도록 방어 로직도 함께 추가하였다.

```python
if not os.path.exists(source_folder):
    raise FileNotFoundError(...)

if len(raw_documents) == 0:
    raise ValueError("문서가 비어 있습니다.")
```

모든 예외는 로그로 출력한 뒤 다시 발생시키도록 구현하여 문제 원인을 즉시 확인할 수 있도록 개선하였다.

### 적용 결과

- 프로젝트 기준 상대경로를 사용하여 **로컬과 배포 환경 모두 동일한 방식으로 동작**하도록 개선
- Vector DB 캐시가 정상적으로 동작하여 **첫 로딩 이후에는 DB를 다시 생성하거나 로드하지 않도록 개선**
- 문서 경로 오류 및 빈 문서와 같은 예외를 사전에 검증하여 **문제 원인을 빠르게 파악할 수 있는 구조**를 구축

### 배운 점

이번 경험을 통해 **배포 환경에서는 파일 경로와 권한까지 고려한 설계가 필요하다**는 점을 배웠다.

또한 캐시는 단순히 구현하는 것이 아니라 **실제로 캐시가 동작하는지 검증하는 과정이 중요하다**는 것을 경험했다. `_vectordb = None` 한 줄 때문에 캐시가 완전히 무력화되어 있었고, 성능 문제의 원인은 새로운 기능이 아니라 기존 로직을 정확히 분석하는 과정에서 발견할 수 있었다.

---

# 슬림버전 (카드용)

## ① 질문 라우팅 아키텍처 재설계를 통한 응답 품질 개선 · ⭐⭐⭐⭐⭐
- **문제** — 모든 질문을 하나의 응답 흐름에서 처리해 데이터 소스가 혼재되었고, 무관 질문 차단 과정에서는 정상적인 UX 대화까지 함께 차단되는 Over-blocking 발생
- **해결** — Intent Classifier와 LangGraph 조건부 라우팅으로 질문을 역할별 노드(RAG·Cow Info·General·Irrelevant)에 분기하고, general 노드의 책임을 재정의하여 UX 대화를 분리
- **효과** — 질문 유형별 데이터 소스가 명확히 분리되어 답변 품질이 안정화되었고, 서비스 정체성과 사용자 경험을 모두 유지하는 라우팅 구조 구축
- `#LangGraph` `#라우팅설계` `#의도분류` `#RAG`

## ② 이표번호를 모르면 대화가 끊기던 소 정보 조회 — 단일 노드에서 상태 기반 서브그래프로 · ⭐⭐⭐⭐⭐
- **문제** — 소 정보 조회가 단일 노드로 구현돼 있어, 질문에 12자리 이표번호가 없으면 안내 메시지만 남기고 대화가 종료됐다(코드 분기상 처리율 0%).
- **해결** — LangGraph 서브그래프로 분리해 소 식별·목록 fallback·선택·카테고리 질의·상세 응답 5개 노드로 책임을 나누고, `selected_cow_info` 유무를 조건부 엣지로 평가해 이표번호를 아는 사용자는 목록 단계를 건너뛰게 했다.
- **효과** — cow_info 처리 노드가 1개 → 5개로 늘어나는 동안 메인 그래프는 5개 그대로 유지됐고, 이표번호 없이도 목록 → 선택 경로가 생겼다(대신 코드량은 344줄 1파일 → 387줄 3파일로 늘고, 되묻기 한 턴이 추가됨).
- `#서브그래프분리` `#상태관리` `#폴백설계` `#책임분리`
## ③ 배포 환경과 실행 환경 차이로 인한 Vector DB 생성 및 캐시 무효화 문제 해결 · ⭐⭐⭐⭐⭐
- **문제** — 로컬에서는 정상 동작하던 RAG가 배포 환경에서 Chroma Vector DB 생성에 실패했고, 캐시가 있어도 Vector DB를 매 요청마다 다시 로드하여 불필요한 파일 접근과 재임베딩이 반복됨
- **해결** — 절대경로를 프로젝트 기준 상대경로로 변경해 환경 의존성을 제거하고, `_vectordb = None` 초기화를 제거하여 인메모리 캐시를 복구했으며, 경로·빈 문서에 대한 예외 처리를 추가
- **효과** — 로컬과 배포 환경에서 동일하게 동작하는 구조를 구축하고, 첫 요청 이후에는 Vector DB를 재사용하여 반복적인 로딩과 재임베딩을 제거
- `#배포환경` `#벡터DB` `#캐싱` `#RAG`

