# Debug

## 코드 흐름 및 경고 분석

삭제 했을 때 엉뚱한 것이 삭제되는 로직의 문제점 파악

삭제와 관련된 로직으로 가자

_CourseGoalItem.js_

```js
import React from 'react';

import './CourseGoalItem.css';

const CourseGoalItem = (props) => {
  const deleteHandler = () => {
    props.onDelete(props.id);
  };

  return (
    <li className="goal-item" onClick={deleteHandler}>
      {props.children}
    </li>
  );
};

export default CourseGoalItem;
```

삭제하는 로직인 `deleteHandler`를 잘 봐야할 필요가 있다.

무엇이 잘못되었는가? 잘못된 것을 삭제하는거니까 id가 문제가 있을 수 있다. 그렇다면 id를 만드는 곳으로 가자.

_App.js_
```js
import React, { useState } from 'react';

import CourseGoalList from './components/CourseGoals/CourseGoalList/CourseGoalList';
import CourseInput from './components/CourseGoals/CourseInput/CourseInput';
import './App.css';

const App = () => {
  const [courseGoals, setCourseGoals] = useState([
    { text: 'Do all exercises!', id: 'g1' },
    { text: 'Finish the course!', id: 'g2' }
  ]);

  const addGoalHandler = enteredText => {
    setCourseGoals(prevGoals => {
      const updatedGoals = [...prevGoals];
      updatedGoals.unshift({ text: enteredText, id: 'goal1' });
      return updatedGoals;
    });
  };

  const deleteItemHandler = goalId => {
    setCourseGoals(prevGoals => {
      const updatedGoals = prevGoals.filter(goal => goal.id !== goalId);
      return updatedGoals;
    });
  };

  let content = (
    <p style={{ textAlign: 'center' }}>No goals found. Maybe add one?</p>
  );

  if (courseGoals.length > 0) {
    content = (
      <CourseGoalList items={courseGoals} onDeleteItem={deleteItemHandler} />
    );
  }

  return (


    <div>
      <section id="goal-form">
        <CourseInput onAddGoal={addGoalHandler} />
      </section>
      <section id="goals">
        {content}
      </section>
    </div>

  );
};

export default App;

```

여기서 봐야할 부분은 `goal`을 만드는 메소드,

```js
const addGoalHandler = enteredText => {
    setCourseGoals(prevGoals => {
      const updatedGoals = [...prevGoals];
      updatedGoals.unshift({ text: enteredText, id: 'goal1' });
      return updatedGoals;
    });
  };
```

여기서 `id`가 하드코딩 되고 있음을 알 수 있음.

즉 모든 목표에 같은 id를 할당하고 있다는 뜻.

그렇게 되면 삭제 로직을 돌리면, 배열에 찾을 수 있는 id 중 첫번째 id가 삭제되게된다.

이것은 터미널과 ide에서 체크가 되지 않지만 개발자 도구에서 console로 들어가면 체크가 된다.

---
## React Devtools

컴포넌트를 직접 볼 수 있고, 조절할 수 있음.


유용하게 사용 가능.