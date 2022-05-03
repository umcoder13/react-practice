# React Basic & Traning Component

## Component

리액트는 사용자 인터페이스를 구축하는 자바스크립트 라이브러리.

리액트는 좀 더 간단히 사용자 인터페이스를 구축할 수 있음. HTML, CSS, JS도 가능하지만, 더 쉽게!!

리액트의 전부는 `컴포넌트`.

컴포넌트란?

컴포넌트는 왜 리액트에서 중요한 개념이 되었을까?

모든 인터페이스는 컴포넌트로 이루어져있기 때문 

컴포넌트는 HTML, CSS, JS의 조합.

컴포넌트는 `재사용성`과 `관심사(Concerns)분리`라는 중요한 장점이 있음.

  - 재사용성: 반복하지 않아도 됨
  - Concerns 분리: 코드베이스를 작고 관리 가능한 단위로 유지하게 해줌. 즉 커다란 JS파일 보다는 분리된 과제에 중점을 놓은 컴포넌트 단위로 코딩 할 수 있음. 

이런 것은 함수의 특징이라고도 할 수 있음.

리액트는 이러한 함수의 개념을 가져와서 여러 함수로 코드를 분리하고 프론트엔드 웹 응용프로그램을 위해 코드를 해석함.   
코드를 여러개의 컴포넌트로 나눠서 우리가 필요할 때 맞춰서 전체 사용자 인터페이스를 구축함.

---

## Component는 어떻게 만들어지는가?

HTML, CSS, JS의 결합이 컴포넌트지만 리액트에서는 대부분 HTML + JS를 다룸

컴포넌트를 만들기 위해서 `선언적 접근방식`을 사용함.   
이 방법을 사용하면, Vanila JS에서 했던 것처럼 HTML 요소를 생성하고 사용자 인터페이스에서 어떤위치에 삽입되어야 하는지 리액트에게 명령하고 그러지 않음.

대신 리액트로 작업할 때 항상 원하는 `목표상태`를 정의하는 것이 중요함.    
JS처럼 Dom을 업데이트하는 지침을 작성할 필요가 없음. 

그저 최종상태와 어떤상황에서 어떤상태가 사용되어야 하는지 정의함.

---

## React 환경 구현

node.js 최신환경 구축

원하는 디렉토리 생성 후 명령 프롬프트에 이것을 실현

```
npx create-react-app react-complete-guide
```

이후 파일 폴더 들어간 후 `npm start`

디렉토리에서 중요한 것은 `src`폴더와 `package.json`파일

`package.json`파일은 프로젝트에서 어떤 패키지들을 사용하고 있는지 보여줌

`src`폴더는 우리가 실제 사용하는 소스코드가 있음.

zip 파일을 기본으로 하고, 버전은 16.15.0으로. 17버전부터 잘안됨.

---

## 표준 리액트 프로젝트 분석

```js
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

```

index.js코드는 처음으로 실행될 코드를 갖고 있음.

하지만 이건 변환된 코드 버전임. 

`npm start`를 한다면 코드는 변환되서 실행이 됨. 

예를들어 css는 import할 수 없지만 여기서 import하고 있음.

HTML코드와 같이 보이는 것도 여기서는 작동이 함.

왜냐하면 변환이 되기 때문!!! 

`ReactDom`은 react-dom이라는 서브파티 라이브러리에서 ReactDom이라는 객체를 import하고 있음.    
이 라이브러리는 종속 라이브러리 중 하나이기 때문에 로컬 컴퓨터에 다운로드해서 설치되어 있음. 

index html파일에 
```html
<div id="root"></div>
```
가 있음

따라서 documet 전역변수로 root를 따와서 `<App / >`로 대체된다는 뜻. 

이 구문은 JSX라는 구문

`App`은 컴포넌트!

root의 id와 함께 그 요소가 있는 자리에서 렌더링을 함.

App.js
```js
function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
    </div>
  );
}

export default App;
```

html코드를 반환 


## JSX

`JSX` = JS + XML, HTML은 일종의 XML이기 때문

브라우저에서 지원되지는 않지만 코드를 작성하면 자동적으로 브라우저에서 작동하는 코드.

## React 작동방식

컴포넌트는 기본적으로 자체 html요소. 

리액트는 선언적인 접근 방식을 통해 작동함.    
목표상태를 정의 하고 실제 화면에 보이는 것을 업데이트하는 DOM 지시사항을 생성하고 실행하는 역할을 한다는 뜻.

App.js를 변경하면 자동으로 서버가 변경을 인지해서 자동으로 변경시킴.

---

## First Component

`components` 폴더를 추가하지만 `App.js`는 이동시키지 않음.

왜냐하면 이것은 `Root Component`로 `index.js`의 시작파일에서 렌더링이 되는 주요 구성요소이기 때문

또한 모든 컴포넌트들은 `App.js`안에 혹은 다른 컴포넌트 안에 중첩됨.

![component_tree](https://smartcodehelper.com/wp-content/uploads/2021/06/image-4-1024x461.png)

컴포넌트 트리를 만들면서 이를 확실시 하는데, 맨 위에 가장 중요한 App 컴포넌트가 있고   
그 아래에는 다양한 사용자 지정 HTML 컴포넌트를 가짐.

만드는 App이 커지면 커질수록 컴포넌트 트리도 커짐

맨 위에 있는 컴포넌트만이 리액트 돔 렌더의 지시로 html페이지에 직접 렌더링됨. 

다른 컴포넌트들은 렌더링 되지 않고, 컴포넌트의 html코드안에 있는 regular html component를 사용해 렌더링이 됨. 

`components` 안에 `ExpenseItem.js`을 추가하고 여기에 비용 아이템을 저장함

리액트로 작성된 컴포넌트는 단순히 html을 반환하는 자바스크립트 함수라는 것을 기억!

ExpenseItem.js
```js
function ExpenseItem() {
    return <h2>Expense item!</h2>
}

export default ExpenseItem;
```

따라서 html을 반환하는 함수, 즉 컴포넌트를 만들어 주고 이것을 다른 곳에서 사용할 수 있게 export해줌!

App.js

```js
import ExpenseItem from "./components/ExpenseItem";

function App() {
  return (
    <div>
      <h2>Let's get started!</h2>
      <ExpenseItem></ExpenseItem>
      <p>This is also visible!</p>
    </div>
  );
}

export default App;

```

그리고 이걸 `App.js`에 삽입시켜줌. 이제 우리는 컴포넌트를 html처럼 사용 가능함!   
그렇기 때문에 사용지 지정 컴포넌트는 항상 대문자로 작성해야함   
그래야 리액트가 컴포넌트를 감지할 수 있기 때문.

다양한 것을 작성하기 위해 `ExpenseItem.js`을 바꿔보자!

```js
function ExpenseItem() {
    return (
    <div>
        <div>2022.03.04</div>
        <div>
            <h2>Car Insurance</h2>
            <div>$294.67</div>
        </div>
    </div>
    )
}

export default ExpenseItem;
```

리액트 컴포넌트를 작성할 때는 중요한 규칙이 하나 있음

반환하는 문장 혹은 JSX코드 조각마다 반드시 한개의 root component를 가진다는 것!

따라서 `<div>`태그 안에 다 넣어주는 식으로 짜면 오류가 없고, 가독성이 좋게 괄호로 감싸주자

---

## CSS

css는 보통 특정한 컴포넌트를 위해 컴포넌트의 자바스크립트 파일이 있는 경로에 추가함.

ExpenseItem.css -> 참조

그러면 이제 css를 js에 적용시켜보자. 

```js
import './ExpenseItem.css';

function ExpenseItem() {
    return (
    <div className="expense-item">
        <div>2022.03.04</div>
        <div className="expense-item__description">
            <h2>Car Insurance</h2>
            <div className='expense-item__price'>$294.67</div>
        </div>
    </div>
    )
}

export default ExpenseItem;
```

여기서 중요한것은 import로 css를 적용시킨다는 것과   
`class` 대신 `className` 을 쓴다는 것. 왜? html코드가 아니라 JSX, 즉 JS 코드이기 때문

Class는 이미 js에서 사용하는 코드명중 하나 따라서 className을 씀

---

## JSX 동적데이터 출력 & 표현식 작업

사용자로부터 입력받은 것을 동적으로 출력해야함.

하드코드에서 벗어나서 JSX안의 HTML코드 안에 중괄호를 넣음으로써 자바스크립트 코드를 안에 넣어 실행이 가능함.
```js
...
function ExpenseItem() {

    const expenseDate = new Date(2022, 3, 29);
    const expenseTitle = 'Car Insurance';
    const expenseAmount = 294.67;

    return (
    <div className="expense-item">
        <div>{expenseDate.toISOString()}</div>
        <div className="expense-item__description">
            <h2>{expenseTitle}</h2>
            <div className='expense-item__price'>${expenseAmount}</div>
        </div>
    </div>
    )
}
...
```
Date 객체는 출력이 안되므로 내장 메소드인 `toISOString`을 해줌

---

## props

`ExpenseItem.js`를 어떻게 재사용할 수 있을까?

단순 복사붙여넣기를 해도 되지만 그러면 항상 똑같은 데이터가 보여지게 됨.

함수에 매개변수를 다르게 해서 다른 입력값에 따라 다른 출력값을 보여주는 것 처럼 리액트도 매개변수와 props라는 개념을 사용해서 쓸 수 있음.

```js
function App() {
  const expenses = [
    {
      id: 'e1',
      title: 'Toilet Paper',
      amount: 94.12,
      date: new Date(2020, 7, 14),
    },
    { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12) },
    {
      id: 'e3',
      title: 'Car Insurance',
      amount: 294.67,
      date: new Date(2021, 2, 28),
    },
    {
      id: 'e4',
      title: 'New Desk (Wooden)',
      amount: 450,
      date: new Date(2021, 5, 12),
    },
  ];
  return (
    <div>
      <h2>Let's get started!</h2>
      <ExpenseItem 
        title={expenses[0].title} 
        amount={expenses[0].amount} 
        date={expenses[0].date}
        ></ExpenseItem>
      <ExpenseItem 
        title={expenses[1].title} 
        amount={expenses[1].amount} 
        date={expenses[1].date}
        ></ExpenseItem>
      <ExpenseItem 
        title={expenses[2].title} 
        amount={expenses[2].amount} 
        date={expenses[2].date}
        ></ExpenseItem>
      <ExpenseItem 
        title={expenses[2].title} 
        amount={expenses[2].amount} 
        date={expenses[2].date}
        ></ExpenseItem>
      <p>This is also visible!</p>
    </div>
  );
}
```

이걸 이제 ExpenseItem.js에!


```js
...
function ExpenseItem(props) {
    return (
    <div className="expense-item">
        <div>{props.date.toISOString()}</div>
        <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
    </div>
    )
}
export default ExpenseItem;
```

이처럼 props는 중요함

재사용이 가능한 컴포넌트를 만들 수 있게 해준 다음 컴포넌트와 컴포넌트 사이에서 데이터를 주고 받게 해줄 수 있기 때문! 

---

## Component에 JS코드 추가

JSX 코드 안에 있는 html문법 안에도 js코드는 실행이 된다. (중괄호 안에서)

하지만 굳이 그렇게 할 필요 없이 가독성 좋게 return 밖에서 상수를 만들어서 해결

```js
function ExpenseItem(props) {

    const month = props.date.toLocaleString('en-Us', {month: 'long'});
    const day = props.date.toLocaleString('en-Us', {day: '2-digit'});
    const year = props.date.getFullYear();

    return (
    <div className="expense-item">
        <div>
            <div>{month}</div>
            <div>{year}</div>
            <div>{day}</div>
        </div>
        <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
    </div>
    )
}
```

## Component 분할

컴포넌트를 분리하기위해 `ExpenseDate.js`를 생성


ExpenseDate.js
```js
function ExpenseDate(props) {
    const month = props.date.toLocaleString('en-Us', {month: 'long'});
    const day = props.date.toLocaleString('en-Us', {day: '2-digit'});
    const year = props.date.getFullYear();

    return (
        <div>
            <div>{month}</div>
            <div>{year}</div>
            <div>{day}</div>
        </div>
    );
}
```

이처럼 분리하는건 별로 어렵지 않음!

하지만 ExpenseDate 컴포넌트에 props가 있어야 하는것은 기억!


우리는 컴포넌트가 중첩되어 있기 때문에 마찬가지로 데이터를 주고받는, props도 중첩되고 있음을 기억해야함. App.js 에서 데이터를 넘기면 props를 통해 ExponseItem.js로 넘어가고 그것은 다시 props를 통해 ExponseDate.js로 넘어가게 됨. 

따라서 `ExpenseItem.js`는 이런구조

```js
...
function ExpenseItem(props) {

    return (
    <div className="expense-item">
        <ExpenseDate date={props.date}/>
        <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
    </div>
    )
}
...
```

이후 css 추가해주고 다듬어주자

ExpenseDate.js
```js
import './ExpenseDate.css';

function ExpenseDate(props) {
    const month = props.date.toLocaleString('en-Us', {month: 'long'});
    const day = props.date.toLocaleString('en-Us', {day: '2-digit'});
    const year = props.date.getFullYear();

    return (
        <div className='expense-date'>
            <div className='expense-date__month'>{month}</div>
            <div className='expense-date__year'>{year}</div>
            <div className='expense-date__day'>{day}</div>
        </div>
    );
}

export default ExpenseDate;
```

그러면 과제로 준 것도 해결해보자. `App.js`간단화!

`Expense.js`를 만들어 준 다음 이렇게 처리하자.

```js
import ExpenseItem from './ExpenseItem';
import './Expenses.css';

function Expenses(props) {
    
    return (
        <div className='expenses'>
        <ExpenseItem 
            title={props.items[0].title} 
            amount={props.items[0].amount} 
            date={props.items[0].date}
         />
        <ExpenseItem 
            title={props.items[1].title} 
            amount={props.items[1].amount} 
            date={props.items[1].date}
         />
        <ExpenseItem 
            title={props.items[2].title} 
            amount={props.items[2].amount} 
            date={props.items[2].date}
         />
        <ExpenseItem 
            title={props.items[2].title} 
            amount={props.items[2].amount} 
            date={props.items[2].date}
         />
        </div>
    );
}

export default Expenses;
```

복잡해 보이지만 `App.js`에 있던 것을 거의 그대로 옮겼을 뿐이고, 로직은 동일하다.

단 props를 받은 다음 안에 있는 객체의 값을 다시 던져줘야 한다.

따라서 props뒤에 객체를 던져준다는 의미로 items를 붙여준다. (이름은 자유다!) 

이제 `App.js`를 간단화 하자.

App.js
```js
import Expenses from "./components/Expenses";

function App() {
  const expenses = [
    ...
  ];
  
  return (
    <div>
      <h2>Let's get started!</h2>
      <Expenses items={expenses} />
      <p>This is also visible!</p>
    </div>
  );
}

export default App;

```
이후 Expenses에서 items에 어떤 객체를 넣을지 제시가 되어 있으므로 중괄호를 넣고 객체인 expenses를 넣어준다. 


---
## Concept of Component 

컴포넌트의 역할이란?   
1. JSX 코드를 결합한 자용자 정의 html
2. 스타일링
3. 자바스크립트 로직 추가 가능

많은 컴포넌트 블럭으로 사용자 인터페이스를 구축하는 접근방식을 `Composition(합성)`이라고 함.

이런 접근방식을 봤을 때 `ExpenseItem.js`와 `Expense.js`파일에서 모두 가지고 있는 컨테이너 `<div>`와 공통으로 가지고 있는 스타일을 추출 할 수 있음. 

`Card.js`와 `Card.css`를 추가해주자.

Card.js
```js
import './Card.css';

function Card() {
    return <div className="card"></div>
} 

export default Card;
```

Card.css
```css
.card {
    border-radius: 12px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25);
}
```

이후  `ExpenseItem.css`와 `Expense.css`에서 해당되는 부분을 제거하자.


그 후  `ExpenseItem.js`와 `Expense.js`를 이러한 방식으로 수정하게 된다면?


```js
...
import Card from './Card';
function ExpenseItem(props) {
    return (
    <Card className="expense-item">
        <ExpenseDate date={props.date}/>
        <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className='expense-item__price'>${props.amount}</div>
        </div>
    </Card>
    )
}
...
```

`Card.css`에서 정의된 스타일을 자동으로 가지게 됨!

그러나 실제 구현하면 다 사라져있는데 이러한 이유는 사용자 지정 컴포넌트를 컨텐츠를 감싸는 Wrapper로 사용할 수 없기 때문임. 이러한 문제의 해결 방식은?


Card.js
```js
function Card(props) {
    return <div className="card">{props.children}</div>
} 
```

`props.children`을 쓰는것!

chidren은 예약어!    

A 컴포넌트 사이에 B 컴포넌트가 있을 때, A 컴포넌트에서 B 컴포넌트 내용을 보여주려고 사용하는 props

이러면 적용이 되지만 약간 깨짐. 왜? 안의 class가 적용이 안되기 때문. 

Card에 className props를 설정했는데, Card가 내가 지정한 사용자 지정 컴포넌트이기 때문에 내가 지원하라고 지시한 것만 지원하고 있음.

따라서 Card 컴포넌트 안에 className이 설정되기 원하고 바뀌기 원한다면 약간 수정해야함.

Card.js
```js
function Card(props) {
    const classes = 'card ' + props.className;
    return <div className={classes}>{props.children}</div>
} 
```

동적으로 class의 상수를 가리키도록 설정! 

이제 재사용 가능한 Wrapper 컴포넌트를 만든 것!

다른 것도 수정해주자

Expenses.js
```js
...
import Card from './Card';

function Expenses(props) {
    return (
        <Card className='expenses'>
          ...
        </Card>
    );
}
...
```

이렇게 하는, 즉 합성을 하는 이유? 중복코드를 줄일 수 있고 코드르 더 깔끔하게 짤 수 있음.




