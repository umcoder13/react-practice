# React State + Event 

목표: 상호작용이 가능한 앱

1. 이벤트 핸들링
2. UI 업데이트하기, State 다루기
3. Component와 State 자세히 보기


## Event Listening and Event Handler

리액트는 모든 기본 이벤트를 on으로 시작하는 props로 시작함

on 이후 작성되는 값은 실행되었을 때 실행되어야 하는 코드. 

```js
const ExpenseItem = (props) => {

    const clckHandler = () => {

    };

    return (
    <Card className="expense-item">
        <ExpenseDate date={props.date}/>
        <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
        <button onClick={clckHandler}>Update</button>
    </Card>
    )
}
```
이런식으로 하면 jsx는 클릭할때만 `clickHandler` 메소드를 분석한다.

자 이제 업데이트 버튼을 누르면 변경되게 코드를 짜보자

```js
const ExpenseItem = (props) => {

    let title = props.title;

    const clckHandler = () => {
        title = "Updated!"
        console.log(title);
    };

    return (
    <Card className="expense-item">
        <ExpenseDate date={props.date}/>
        <div className="expense-item__description">
            <h2>{title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
        <button onClick={clckHandler}>Update</button>
    </Card>
    )
}
```

하지만 이 상태에서 눌러도 제목은 바뀌지않는다?   
재밌는 것은 `title`객체는 바뀌었다는 점이다.

왜 이런 상황이 나왔을까?

왜냐하면 리액트는 모든 애플리케이션이 렌더링 되었을때 모든 과정을 실행하고 끝이고, 반복이 되지 않기 때문.

따라서 이것을 해결하기 위해 State라는 개념을 사용함. 

---

## State

State를 사용하기 위해서는 `useState`라는 함수를 불러온다.

이것은 리액트 라이브러리에서 제공하는 함수다. 따라서 아래의 코드를 작성한다.

```js
import React, { useState } from 'react';
```

이 함수는 컴포넌트 함수가 다시 호출되는 곳에서 변경된 값을 반영하기 위해 state로 값을 정의할 수 있게 해주는 함수다. 

`useState`는 다른 변수와 다르게 특별한 변수를 생성한다. 이 변수에는 우리가 초기값을 설정할 수 있는데 여기서는 변경할 `props.title`을 초기값으로 잡아주어서 인자로 전달한다.

그러면 `useState`는 어떠한 값을 반환하는데 이 값은 변수에 접근 할 수 있을 뿐만 아니라 새로운 값을 할당할 수 있는 함수도 존재한다.

즉 배열로 반환한다는 뜻이다.

배열의 첫째 값은 상태값인, 변수 자체고, 두번째는 업데이트가 가능한 함수다.

```js
const ExpenseItem = (props) => {

    const [title, setTitle] = useState(props.title);

    const clckHandler = () => {
        setTitle('Updated!');
        console.log(title);
    };

    return (
        ...
    )
}
```

이렇게 작업을 바꾸면 변수에 새로운 값을 할당하는 것이 아니라, State 변수라는 특별한 변수로 시작하는 개념이다. 

이것은 메모리의 특정 부분에 리액트가 관리하게 된다.

재밌는 것은 `console.log(title)`의 값은 변하지 않는다는 것.    
왜냐하면 state를 업데이트 하는 함수를 호출했을 때는 값을 바꾸는 것이 아니라 state의 업데이트를 예약하는 것이기 때문.

State는 같은 컴포넌트를 여러번 호출 해도 리액트가 독립적으로 관리를 하기 때문에 서로의 영향을 받지 않는다.

그러니까 Item 컴포넌트를 100번 호출해도, 1번 state의 값을 변한다 해도 나머지 99개의 state는 전혀 변화하지 않는다는 뜻.

즉 컴포넌트 별 인스턴스를 기반으로 하여 독립적인 state를 갖는다는 뜻.

하나 더 중요한 점이 있는데 어떻게 const형을 사용해서 useState를 저장하는 것일까? 

그것은 아까도 말했듯이 이건 값을 바로 변화하거나 재할당하는 것이 아니라 `setTitle`을 실행할 때 리액트가 새로운 값을 생성하여 메모리 어딘가에 저장하고, 그것을 JSX가 재실행할 때 불러오는 것이기 때문. 

그러면 가장 최신의 title값은 어떻게 가져올 것인가?

```js
const [title, setTitle] = useState(props.title);
```

이 코드는 컴포넌트 함수가 재 실행될때마다 같이 재실행이 된다.   
따라서 setTitle을 호출해서 새로운 title을 할당하면, 컴포넌트를 다시 불러오게 되고 리액트로 부터 메모리에서 가지고 있던 값을 가져와 title에 할당하게 되는 것이다. 

---

## 입력값 만들기

준비과정

`NewExpense.js`, `ExpenseForm.js` 생성

NewExpense.js
```js
import React, { useState } from 'react';
import './NewExpense.css';

const NewExpense = () => {
    return ( 
        <div className="new-expense">
        </div>
    );
}

export default NewExpense;
```

ExpenseForm.js
```js
import React from 'react';
import './ExpenseForm.css';


const ExpenseForm = () => {
    return (
        <form>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label>Title</label>
                    <input type="text" />
                </div>
                <div className="new-expense__control">
                    <label>Amount</label>
                    <input type="number" min="0.01" step="0.01" />
                </div>
                <div className="new-expense__control">
                    <label>Date</label>
                    <input type="date" min="2013-01-01" max="2023-12-31" />
                </div>
            </div>
            <div className='new-expense__actions'>
                <button type='submit'>Add Expense</button>
            </div>
        </form>
    );
}

export default ExpenseForm;
```

---

## 사용자 입력 리스닝 + Multe State

`onChange`의 장점은 모든 입력 타입에 같은 이벤트를 사용할 수 있음.


값이 변경된 것을 체크하고 저장해야함

그러면 `useState`를 써서 저장. 

```js
const [enteredTitle, setEnteredTitle] = useState('');
```

이렇게 코드를 작성하는 이유?

컴포넌트 함수의 생명주기와 별개인 다른 변수에 저장하고 있는 값을 확실하게 하기 위해. 

또한 나중에 컴포넌트를 업데이트해서 다시 렌더링 해야하기 때문.

state 다중으로 쓰는 것은 간단함. 그냥 쓰면됨.

코드 정리

```js
const ExpenseForm = () => {

    const [enteredTitle, setEnteredTitle] = useState('');
    const [enteredAmount, setenteredAmount] = useState('');
    const [enteredDate, setenteredDate] = useState('');

    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    };

    const amountChangeHandler = (event) => {
        setenteredAmount(event.target.value);
    }

    const dateChangeHandler = (event) => {
        setenteredDate(event.target.value);
    }

    return (
        <form>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label>Title</label>
                    <input type="text" onChange={titleChangeHandler} />
                </div>
                <div className="new-expense__control">
                    <label>Amount</label>
                    <input type="number" min="0.01" step="0.01" onChange={amountChangeHandler}/>
                </div>
                <div className="new-expense__control">
                    <label>Date</label>
                    <input type="date" min="2013-01-01" max="2023-12-31" onChange={dateChangeHandler}/>
                </div>
            </div>
            <div className='new-expense__actions'>
                <button type='submit'>Add Expense</button>
            </div>
        </form>
    );
}
```

---

## Multi State 개선

`useState`를 한번 호출해서 값으로 `객체`를 전달하면 됨. 
```js
const [userInput, setUserInput] = useState({
        enteredTitle: '',
        enteredAmount: '',
        enteredDate: ''
    });
});
```

이런 식으로 그러면 이제 로직을 `setUserInput`으로 변환시키자

```js
const amountChangeHandler = (event) => {
        setUserInput({
            enteredAmount: event.target.value,
        });
    };
```

그런데 이런식으로 하면 문제가 다른 title이나 date의 값이 초기화가 되어버린다. 따라서 이전의 date와 title의 값을 불러올 수 있게, js문법 중 하나인 스프레드 문법을 사용한다.

```js
const amountChangeHandler = (event) => {
        setUserInput({
            ...userInput,
            enteredAmount: event.target.value,
        });
    };
```

나머지도 다 똑같이 바꿔주자

```js
...
const [userInput, setUserInput] = useState({
        enteredTitle: '',
        enteredAmount: '',
        enteredDate: ''
    });

    const titleChangeHandler = (event) => {
        setUserInput({
            ...userInput,
            enteredTitle: event.target.value,
        });
    };

    const amountChangeHandler = (event) => {
        setUserInput({
            ...userInput,
            enteredAmount: event.target.value,
        });
    }
...
```

하지만 이것도 좋은 방법이라 할 수 없음.

왜냐하면 특정 사례에서는 이것이 제대로 작동하지 않을 가능성이 있기 때문.

스프레드를 사용하면서 이전의 state의 스냅샷에 맞게 state를 업데이트 하고 있는데, 이전의 state에 의존하고 있다는 뜻이 됨.

이럴 경우 만약 하나씩 증가하는 카운터를 관리하고 있으면 이러한 방식은 제대로 작동하지 않게 됨. 

따라서 함수를 호출하는 식으로 변경해야함. 

```js
const titleChangeHandler = (event) => {
        setUserInput((prevState) => {
            return {...prevState, enteredTitle: event.target.value,}
        });
    };   
```

이런 식으로

왜 이렇게 해야하는가?

왜냐하면 리액트는 상태 업데이트 스케줄을 가지고 있기 때문에 바로 업데이트 하지 않기 때문.

따라서 동시에 수많은 State를 업데이트하는 로직을 짜게 된다면 오래되거나 혹은 잘못된 State 스냅샷에 의존할 수 있게 됨.

하지만 위의 방법을 쓰게 되면, 리액트는 위의 함수에서의 `prevState`의 스냅샷이 가장 최신 상태의 스냅샷이라는 것과 항상 예약된 State 업데이트를 염두에 두고있는 것을 보장하게 됨.

---

## 양식 제출 처리

버튼이 눌러졌을 때 하나의 Form이 제출 되도록 로직을 짜야함.

그럴라면 State조각들을 하나의 객체로 연결해야함. 

또한 자바스크립트와 수동으로 ㅈ데이터를 수집하고 결합해서 무언가를 하는 방법으로 폼을 제출하도록 해야함.

버튼을 클릭할때마다 페이지가 다시 로드되는 방식 말고! 

따라서 기본 자바스크립트 문법인 `event.prevendDefault()`를 추가해줌

```js
...
const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            date: new Date(enteredDate),
        };
    };

    return (
        <form onSubmit={submitHandler}>
        ...

```



---

## 양방향 바인딩

`양방향 바인딩`이란? 간단히 말해서 변경되는 입력값만 수신하는 것이 아니라 입력에 새로운 값을 다시 전달할 수 있다는 뜻.

따라서 프로그램에 따라 입력값을 재설정하거나 새로 입력할 수 있음. 

방법은? 기본 속성인 `value`에다 맞는 state를 추가하기만 하면 됨. 

```js
...
return (
        <form onSubmit={submitHandler}>
            <div className="new-expense__controls">
                <div className="new-expense__control">
                    <label>Title</label>
                    <input 
                    type="text" 
                    value={enteredTitle}
                    onChange={titleChangeHandler} />
                </div>
                ...
```

이렇게 양방향 바인딩을 할 경우 상태를 업데이트 하기 위해 입력에서 변경사항을 받을 뿐만 아니라 입력에 `state`를 보내주기도 함.

따라서 상태를 변경하면 입력도 변하게 됨. 

이후 메소드도 이렇게 변경해준다면?

```js
const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            date: new Date(enteredDate),
        };

        console.log(expenseData);
        setEnteredTitle('');
        setenteredAmount('');
        setenteredDate('');
    };
```

set 메소드를 써서 입력했던 것을 오버라이드 해 다 지워줄 수 있음.

---
## 부모 자식 Component 통신

우리가 실질적으로 데이터가 필요한 곳은 `NewExpense.js` 혹은 `App.js`임.

따라서 `ExpenseForm.js`에서 생성한 데이터를 옮겨줘야함. 

부모에서 자식으로 데이터를 넘겨줄 때는 `props`를 사용했지만 반대의 경우는 어떻게 해야하는가?

일단  `NewExpense.js`부터 수정해 보자.

```js
const NewExpense = () => {
    return ( 
        <div className="new-expense">
            <ExpenseForm onSaveExpenseData />
        </div>
    );
}

export default NewExpense;
```

컴포넌트에 `onSaveExpenseData`라는 속성을 추가해주자.

이름은 자유지만 컴포넌트 내부에서 어떤 일이 벌어졌을 때 작동되는 함수라는 것을 확실히 알 수 있는 이름으로 붙여주는 것이 좋다.

```js
const NewExpense = () => {

    const saveExpenseDataHandler = (enteredExpenseData) => {
        const expenseData = {
            ...enteredExpenseData,
            id: Math.random.toString()
        }
        console.log(expenseData)
    }

    return ( 
        <div className="new-expense">
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    );
}

export default NewExpense;
```

이후 데이터를 받을 함수를 설정해 준다. 함수에는 Form으로 받는 데이터에다 랜덤 생성된 id를 추가해주는 역할을 한다.

이후 이 함수의 포인터를 `onSaveExpenseData`라는 속성에 전달하기 위해 값으로 이 함수를 받는 로직을 짠다.

실행하는 것이 아니라 함수를 가리키는 것!

이제 `ExpenseForm`을 수정해보자

```js
const ExpenseForm = (props) => {
    ...
    const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: enteredAmount,
            date: new Date(enteredDate),
        };

        props.onSaveExpenseData(expenseData);
        ...}
        return (
            ...
        )
}
```

이 구조를 통해 props로 `onSaveExpenseData` 함수를 받았고, 그 함수 안에 Data를 넣어준다. 

즉, 부모 컴포넌트로 부터 자식 컴포넌트에게 함수를 주기 위해 value로 함수를 호출하고,   
호출 했을 때는 그 함수에 매개변수로 데이터를 전달할 수 있다는 것.

이제 같은 논리로 `App.js`와 `NewExpense.js`의 로직도 수정해보자.

```js
const NewExpense = (props) => {

    const saveExpenseDataHandler = (enteredExpenseData) => {
        const expenseData = {
            ...enteredExpenseData,
            id: Math.random.toString()
        }
        props.onAddExpense(expenseData);
    }
    ...
```

```js
const App = () => {
    ...
   const addExpenseHandler = expense => {
    console.log('In App js');
    console.log(expense);
  }
  
  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} />
    </div>
  );
}
export default App;
```
---

## State 끌어올리기

`NewExpense.js`에서 생성한 데이터를 `Expenses.js`에 소통해야하는데, 서로 소통이 불가능하기 때문에 부모 컴포넌트인 `App.js`에 데이터를 올려놓고 소통하는 것.

![state](./img/2022-05-03%20145849.png)

---
## Stateless vs Stateful Component

Stateless Component

State를 갖지 않고 단순히 데이터를 출력하기 위해 존재하는 컴포넌트


