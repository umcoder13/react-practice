# Redux

## 목표
1. 리덕스란 무엇이고 왜 쓰는가?
2. 리덕스를 쓰는 방법
3. 리덕스 툴 킷

## What is Redux?

**cross-component와 app-wide-state를 위한 state 관리 시스템**

리덕스는 state를 다수의 컴포넌트 혹은 App 전체에서 관리하도록 도와줌.

State은 3가지로 분류가 됨.

1. *Local State*: 데이터가 변경되어서 하나의 컴포넌트에 속하는 UI에 영향을 미치는 State, 하나만 속하는 state.
2. *Cross-Component State*: 다수의 컴포넌트에 영향을 미치는 State. ex) Modal을 열고 닫는 State. 우리는 그동안 이것을 prop 드릴링으로 구현했음.
3. *App-Wide State*: 애플리케이션 전체에 영향을 미치는 State. ex) 사용자 인증. 

리덕스는 이 중 2, 3을 관리를 해줌. 그러면 중요한 질문이 생기게 됨

---

## Why we use Redux?

우리는 prop 드릴링 대신 Context를 써서 관리할 수 있음. 그런데 왜 Redux를 쓸까?

#### 1. Context를 쓰면 매우 복잡해짐!

```js
return (
    <AaContextProvider>
        <BbContextProvider>
            <CcContextProvider>
                <DdContextProvider />
            </CcContextProvider>
        </BbContextProvider>
    </AaContextProvider>
)
```

이런 복잡한 코드가 나올 수 있음.

물론 하나의 ContextProvider로 통합도 가능하지만, 그러면 그 ContextProvider를 관리하기 매우 힘들어짐.

### 2. 성능문제

테마를 변경하거나 인증과 같은 저빈도 업데이트에는 Context가 좋지만 고빈도 변경은 Redux가 더 좋다. 

---


## Redux의 작동방식

Redux는 **단 하나의 state 저장소를 가진다.**

이 중앙저장소에 우리는 데이터를 저장해서 컴포넌트 안에서 사용할 수 있다.

그런데 State는 데이터가 때때로변경한다. 그러면 변경된 데이터를 어떻게 저장하는가?

**컴포넌트는 절대 저장된 데이터를 직접 조작하지 않고, Subscription할 뿐이다.**

대신 우리는 `Reducer Function`을 통해 변경한다. 

`Reducer Function`은 입력을 받아서 그 입력을 변환하고 새로운 출력, 결과를 뱉어낸다.,

그럼 컴포넌트와 `Reducer Function`은 어떻게 연결되는가? 바로 `Action`이라는 JS 개념이다.

컴포넌트가 `Reducer Function`이 수행해야할 작업을 `Action`을 통해 Redux에 발송(Dispatch)하고, 

Redux는 `Reducer Function`에게 그 액션을 전달해서 원하는 작업에 대한 설명을 읽게된다. 이후 `Reducer Function`이 작업을 수행하게 된다.

## Core Redux Concepts

리액트를 불러오지 않고 redux 폴더를 만들고 실행을 해보자.

빈 폴더에 js파일을 만들고, `npm init -y` 이후 `npm install redux`를 실행한다.

이제 state를 저장할 저장소부터 만들어보자.

_redux-demo.js_
```js
const redux = require('redux');

const store = redux.createStore();
```

이제 저장소를 만들었으니, 리듀서 함수가 액션이 도착할때마다 상태 스냅샷을 내뱉게 하자. 

`Reducer Function`은 JS 표준 함수지만, Redux 라이브러리에 의해 호출이 되며, 항상 2개의 매개변수를 가진다. 바로 Old State와 발송된 Action이다.

이에 대한 return으로 New State Object를 내뱉어야 한다. 따라서 동일한 입력을 받으면 항상 정확히 같은 값을 내뱉는 순수함수여야한다.

또한 함수 안에서는 어떠한 부수적인 효과가 없어야한다. ex) HTTP 요청 전송, 로컬저장소 기록...

그리고 반환할 객체를 입력했으면 redux의 createStore 함수 안에 `Reducer Function`을 넣어준다.

왜냐하면 저장소와 작업하는 것은 Reducer이고, 데이터를 조작하는 `Reducer Function`이 어떤 함수인지 알아야 하기 때문이다.

```js
const redux = require('redux');

const counterReducer = (state, action) => {
    return {
        counter: state.counter + 1
    };
};

const store = redux.createStore(counterReducer);
```

이제 이 저장소를 Subscibe하고, Dispatch 할 액션을 만들어 보자.

dispatch에서는 action을 보내는데 action은 자바스크립트 객체다. 

```js
import { createStore } from 'redux'

const countReducer = (state = { counter: 0 }, action) => {
    return {
        counter: state.counter + 1
    };
};

const store = createStore(countReducer);
console.log(store.getState());

const counterSubsciber = () => {
    const latestState = store.getState();
    console.log(latestState);
}

store.subscribe(counterSubsciber);

store.dispatch({ type: 'increment' });
```

결과
```js
{ counter: 1 }
{ counter: 2 }
```

사실 리덕스를 사용할 때 리덕스 내부에서 다른 액션을 하는 것이 목표임.

따라서 Reducer Function에 if문을 통해 값마다 다른 행동을 하게 설정해보자.

```js
import { createStore } from 'redux'

const countReducer = (state = { counter: 0 }, action) => {
    if (action.type === 'increment') {
        return {
            counter: state.counter + 1
        };
    };

    if (action.type === 'decrement') {
        return {
            counter: state.counter - 1
        };
    };
};

const store = createStore(countReducer);

const counterSubsciber = () => {
    const latestState = store.getState();
    console.log(latestState);
}

store.subscribe(counterSubsciber);

store.dispatch({ type: 'increment' });
store.dispatch({ type: 'decrement' });
```

결과
```js
{ counter: 1 }
{ counter: 0 }
```
