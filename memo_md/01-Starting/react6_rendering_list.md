# 렌더링 리스트와 조건부 Content

목적은 하드코드하고 있는 목록을 동적으로 렌더링 하는 것.

## 데이터의 렌더링 목록

`map`을 사용하자. 

Expesnses.js
```js
return (
        <div>
        <Card className='expenses'>
        <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
        {props.items.map((expense) =>(
            <ExpenseItem 
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        ))}
        </Card>
        </div>
    );
```

매우 간단해지고, 동적으로 렌더링 된다!

---
## State 저장목록

이제는 Expense가 추가 될수록 배열이 업데이트 되게 바꾸어 보자.

`App.js` 에 가서 변경해주자

```js
const DUMMY_EXPENSE = [
  ...
];

const App = () => {
  
  const [expenses, setExpenses] = useState(DUMMY_EXPENSE);

  const addExpenseHandler = expense => {
    setExpenses(prevExpenses => {
      return [expense, ...prevExpenses];
    });
  };
  
  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} />
    </div>
  );
}

export default App;

```

전에 언급한 것 처럼 스프레드를 사용하면서 이전의 state의 스냅샷에 맞게 state를 업데이트 하게 되면, 이전의 state에 의존하고 있다는 뜻이 됨

이럴 경우 만약 하나씩 증가하는 카운터를 관리하고 있으면 이러한 방식은 제대로 작동하지 않게 됨.

따라서 함수를 호출하는 식으로 로직을 짠다.

---

## Keys

지금까지의 로직은 배열의 길이와 렌더링 된 아이템 수를 확인하는 로직인데 성능측면에서는 훌륭하지 않음.

왜냐하면 모든 목록을 체크해서 업데이트 해야하기 때문이고 또 버그도 생성될 수 있음.

만약 `ExpenseTiem`이 Stateful 아이템이었다면 안에 State를 관리하는 무언가가 있었을 것인데, 추가한 아이템이 특정 state를 갖고 있었다면 이전 아이템을 덮어쓸 수 있기 때문임. 

그래서 경고가 생김 

**Warning: Each child in a list should have a unique "key" prop**

따라서 새로운 아이템이 어디에 추가되어야 하는지 리액트에게 알려줘야함. 

그 때 쓰이는 것이 key이고 key에 쓰이는 값이 id

그래서 DB에서 자료를 줄 때 id가 항상 포함되어 있어야 좋음.

_Expenses.js_

```js
...
...
return (
        <div>
        <Card className='expenses'>
        <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
        {props.items.map((expense) =>(
            <ExpenseItem
                key={expense.id} 
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        ))}
        </Card>
        </div>
    );
...
```
이제 리액트는 배열의 길이 뿐만 아니라 아이템이 위치해야할 곳까지 인식함.

요약하면 **목록의 아이템을 매핑할 때는 항상 key를 추가해야함.**

---

## Filter

연도의 값을 필터링 했을 때 그 값의 연도만 나오도록 로직을 짜보자

_Expenses.js_
```js
...
const Expenses = (props) => {

    const [filteredYear, setFilterdYear] = useState('2020');

    const filterChangeHandler = selectedYear => {
        setFilterdYear(selectedYear);
    }
    
    const filteredExpenses = props.items.filter(expense => {
        return expense.date.getFullYear().toString() === filteredYear;
    });
    
    return (
        <div>
        <Card className='expenses'>
        <ExpensesFilter 
            selected={filteredYear} 
            onChangeFilter={filterChangeHandler}
        />
        {filteredExpenses.map((expense) =>(
            <ExpenseItem
                key={expense.id} 
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        ))}
        </Card>
        </div>
    );
}
export default Expenses;
}
```

`filter`메소드는 배열을 필터링하는 내장 메소드

이 함수가 true를 반환하면 특정 아이템은 남겨지고 false를 반환하면 버려짐. 하지만 원래 배열을 건드리지 않음. 따라서 화면에 제한된 것만 출력하는 로직을 짤 때 좋음.

따라서 위의 로직 대로 짜면, items 배열에 있는 데이터 하나하나의 `date`에서 연도만 따로 뽑는데, 그것이 `state`에 저장되어있는 `filteredYear`과 일치할 경우만 true를 반환하게 됨.

그래고 `filter`메소드는 true만 남기고 다 제거.

---

## Conditional Content (조건 명령문)

공백일 경우 렌더링 하는 콘텐츠에 대해서.

우리가 짰던 로직에서는 연도가 없으면 아무것도 띄우지 않는다. 이걸 고쳐보자. 

변수 `expensesContent`를 추가하고 그 안에 아무것도 없을 때 표기할 jsx코드를 넣는다.

_Expenses.js_
```js
const Expenses = (props) => {
    ...
    let expensesContent = <p>No expenses found.</p>
    
    if (filteredExpenses.length > 0) {
        expensesContent = filteredExpenses.map((expense) =>(
            <ExpenseItem
                key={expense.id} 
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        ))
    }

    return (
        <div>
        <Card className='expenses'>
        <ExpensesFilter 
            selected={filteredYear} 
            onChangeFilter={filterChangeHandler}
        />
        {expensesContent}
        </Card>
        </div>
    );
}

export default Expenses;
```

이후 `filteredExpenses`의 길이를 체크해서 0보다 크면 배열들을 출력하는 map로직을 if문 안에 넣는다.

그러면 `filteredExpenses`의 로직을 만족하는 배열이 있으면 그대로 map이 실행이 되고 아니면 변수에서 기본적으로 선언한 JSX 코드가 출력이 될 것이다.

## 조건명령문 반환

조건부 컨텐츠를 따로 로직을 분리해서 깔끔하게 만들고 싶음.

`ExpensesList.js`를 만들어 주자.

_ExpensesList.js_
```js
import React from 'react';

import ExpenseItem from './ExpenseItem';
import './ExpensesList.css';

const ExpensesList = props => {
    
    if (props.items.length === 0) {
        return <h2 className='expenses-list__fallback'>Found no expenses.</h2> 
    }

    return <ul className="expenses-list">
        {props.items.map((expense) =>(
            <ExpenseItem
                key={expense.id} 
                title={expense.title}
                amount={expense.amount}
                date={expense.date}
            />
        ))}
    </ul>;
}
 
export default ExpensesList;
```

여기서는 아이템이 없으면 다른 JSX를 반환하는 조건문을 작성한다.

이 경우에는 조건을 만족하지 않으면 데이터가 아예 없어야 하기 때문에 이런식의 로직이 가능하다. 

또한 `ExpensesItem.js`에서 순서없는 `<div>`태그를 사용하고 있었는데 이를 `<li>`로 바꿔준다

_ExpensesItem.js_
```js
...
return (
    <li>
        <Card className="expense-item">
            <ExpenseDate date={props.date}/>
            <div className="expense-item__description">
                <h2>{title}</h2>
                <div className='expense-item__price'>${props.amount}</div>
            </div>
            <button onClick={clckHandler}>Update</button>
        </Card>
    </li>
    )
...
```
---

## 조건부 내용

이번엔 NewState에서 버튼을 통해 열고 닫는 기능, 그리고 입력하지 않고 닫는 취소기능까지 만들어보자.

그러기 위해서는 우리는 조건부로 렌더링이 되어야할 새로운 state가 필요하므로 `useState`를 추가해준다.

_NewExpense.js_
```js
const NewExpense = (props) => {

    const [isEditing, setIsEditing] = useState(false);

    const saveExpenseDataHandler = (enteredExpenseData) => {
        const expenseData = {
            ...enteredExpenseData,
            id: Math.random.toString()
        }
        props.onAddExpense(expenseData);
    }

    const startEditingHandler = () => {
        setIsEditing(true);
    }

    return ( 
        <div className="new-expense">
            {!isEditing && <button onClick={startEditingHandler}>Add New Expense</button>}
            {isEditing && <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />}
        </div>
    );
}

export default NewExpense;
```


기본값은 false로 잡고, &&동적 표현식으로 기본값이 아니면 버튼을 표시하고, 버튼을 누르면 true로 바꾸는 함수를 넣는다.

반대로 기본값이면 원래의 `ExpenseForm`을 표시하는 동적 표현식도 구현한다. 

이제 Cancle버튼도 추가해주자.

주 기능은 Form이 전송되면 편집 작업 또한 멈춰야 하므로, Add Expense버튼 옆에 자리잡게 하자. 

_ExpensesForm.js_
```js
...
return (
        <form onSubmit={submitHandler}>
            ...
            <div className='new-expense__actions'>
                <button type="button" onClick={props.onCancle}>Cancle</button>
                <button type='submit'>Add Expense</button>
            </div>
        </form>
    );
...
```

버튼 하나를 더 추가하고 `onClick` value를 넣어서 부모인 `NewExpense.js`로 부터 받은 props에 값 `onCancle`을 받는다.

`onCancle`안에는 `isEditing`의 값을 false로 바꾸는 `stopEditingHandler` 함수가 들어있으며, 버튼을 누를시에는 그 함수가 자동적으로 실행되어 값이 false로 바뀐다.

---

## 차트 구현

우리는 유동적인 차트를 구현할 것이며 , App안에서 그려야 되는 데이터포인트를 받아서, 그 수에 맞게 동적으로 렌더링 하는 방식으로 구현 할 것이다. 

미리 렌더링할 값을 정해서 `ChartBar.js`에 넘겨주는 방식으로 구현하자.

_Chart.js_
```js
import React from 'react';

import ChartBar from './ChartBar';
import './Chart.css';

const Chart = props => {
    
    
    return (
        <div className="chart">
            {props.dataPoints.map(dataPoint => 
            <ChartBar
                key={dataPoint.label} 
                value={dataPoint.value}
                maxValue={null}
                lable={dataPoint.lable} 
            />)}
        </div>
    );
}

export default Chart;
```

---
## 동적 스타일링

_CharBar.js_
```js
import React from 'react';

import './ChartBar.css'

const ChartBar = (props) => {

    let barFillHeight = '0%';

    if (props.maxValue > 0) {
        barFillHeight = Math.round((props.value / props.maxValue) * 100) + '%';
    }

    return <div className="chart0bar">
        <div className="chart-bar__inner">
            <div 
                className='chart-bar__fill' 
                style={{height: barFillHeight}}
            ></div>
        </div>
        <div className='chart-bar__label'>{props.label}</div>
    </div>;
}

export default ChartBar;
```

스타일을 동적으로 정하고 싶으면 style value를 추가하면 됨

기존 html의 style과 다른 점은 value로 자바스크립트 로직이 들어가야한다는 것.

따라서 여기에서는 bar의 높이가 동적으로 변해야함. 그래서 css코드에 맞게 bar는 퍼센트 단위로 잡아주고 변수에 기본값은 0%로 함.

그리고 만약 0보다 클 경우 props로 오는 value에 maxValue를 나눠서 100을 곱해주는 로직을 만듦. 백분율!

이후 동적스타일링을 해줘서 `height`는 `barFillHeight` 변수로 설정해준다.

---

## 차트에 데이터 전달

_ExpensesChart.js_
```js
import React from 'react';

import Chart from '../Chart/Chart';

const ExpensesChart = (props) => {
    const chartDataPoints = [
        { label: 'Jan', value: 0},
        { label: 'Feb', value: 0},
        { label: 'Mar', value: 0},
        { label: 'Apr', value: 0},
        { label: 'May', value: 0},
        { label: 'Jun', value: 0},
        { label: 'Jul', value: 0},
        { label: 'Aug', value: 0},
        { label: 'Sep', value: 0},
        { label: 'Oct', value: 0},
        { label: 'Nov', value: 0},
        { label: 'Dec', value: 0},
    ];

    for (const expense of props.expense) {
        const expenseMonth = expense.date.getMonth();
        chartDataPoints[expenseMonth].value += expense.amount;
    }

    return <Chart dataPoints={chartDataPoints} />;
}

export default ExpensesChart;
```

날짜별 배열을 만들어준다

이후 for문을 통해 `props.expense`에다가 `date.getMonth`을 써서 각각의 날짜 값을 추출함. 

주의해야할 것은 배열에 대해서는 in roof가 아니라 of roof다.

그리고 그걸 배열 날짜 값에 집어넣으면 배열의 날짜 객체가 불러와지고, 객체의 value에다가 expense.amount의 값을 더해줌

이제는 Max값을 만드는 로직을 짜자

_Chart.js_
```js
const Chart = props => {
    const dataPointValues = props.dataPoints.map(dataPoint => dataPoint.value);
    const totalMaximum = Math.max(...dataPointValues);
    
    return (
        <div className="chart">
            {props.dataPoints.map(dataPoint => 
            <ChartBar
                key={dataPoint.label} 
                value={dataPoint.value}
                maxValue={totalMaximum}
                lable={dataPoint.lable} 
            />)}
        </div>
    );
}

export default Chart;
```

map을 통해 객체에서 숫자로 변환시켜줌.  
그렇게 되면 이제 숫자만 되는 배열로 변환이 됨.

그 배열을 스프레드화 시킨 다음 max에 넣어준다. 그러면 가장 최상의 값을 뽑아주게 된다.

이제 데이터를 넣어보자

Expenses.js
```js
...
import ExpensesChart from './ExpensesChart';

const Expenses = (props) => {

    const [filteredYear, setFilterdYear] = useState('2020');

    const filterChangeHandler = selectedYear => {
        setFilterdYear(selectedYear);
    }

    const filteredExpenses = props.items.filter(expense => {
        return expense.date.getFullYear().toString() === filteredYear;
    });
    
    return (
        <div>
        <Card className='expenses'>
        <ExpensesFilter 
            selected={filteredYear} 
            onChangeFilter={filterChangeHandler}
        />
        <ExpensesChart expenses={filteredExpenses}/>
        <ExpensesList items={filteredExpenses}/>
        </Card>
        </div>
    );
}

export default Expenses;
```

우리는 연도별 그래프 리스트를 만드는 것이기 때문에 연도별로 필터링 된 `filteredExpenses`를 ExpensesChart에 넣어준다. 이러면 이제 동작이 된다.


