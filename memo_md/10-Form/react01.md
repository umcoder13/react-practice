# Form

## 목표

1. Form은 왜 복잡한가?
2. Input 다루기 & 리액트와 Form
3. 간단하고 편리하게 작업할 수 있는 도구와 접근법

---

## Form은 왜 복잡한가?

Form은 하나 이상의 입력값이 모두 유효하지 않을 수도 있고,

심지어 front에서는 문제 없이 보내더라도, 서버로 request를 보낸 뒤에 특정값이 useable한지 확인하는 비동기 validation을 이용해야 하서 상태를 알기 힘들수도 있다.

게다가 하나의 form만 이런게 아니라 모든 form의 입력값에 이러한 유효성이 있다는 것이 문제다. 즉 모든 input이 일치해야 form이 통과가 되야한다.

따라서 입력값이 유효치 않으면 에러 메세지를 출력해야하고, 문제가 되는 입력값을 강조해야한다. 그리고 하나 이상의 입력값이 유효치 않으면 입력값이 제출되거나 저장되지 않도록 해야한다.

그렇다면 언제 validate를 해야할까? 

1. **form이 완전히 제출 되었을 때**: 불필요한 경고를 줄일 수 있으나, 피드백이 늦을 수 있음. 사용자가 값을 제출한 뒤에 문제있는 부분을 알려주면 사용자는 잘못된 입력값이 있는 전으로 돌아가서 값을 입력해야함. 
2. **사용자가 값을 입력하고 그 input요소가 focus가 없을 때**: 전체 폼이 제출되고 경고메시지를 보내기 전에 사용자가 유효한 값을 입력할 수 있음. 그러나 사용자가 그 이전에 유효하지 않은 값을 입력하고 나서 고치는 중에 validate가 불가능하다는 것.
3. **사용자가 키를 한번씩 칠때마다**: 단점은 사용자가 유효한 값을 입력하기도 전에 경고를 보냄.

이것들을 적절하게 조합해서 만들어보자.


---

## 양식 제출 및 사용자 입력값 가져오기

validate와 에러메시지를 띄우는 로직을 짜자 

두가지 방법이 있다 state와 ref.

state 방법 

_BasicForm.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const [enteredName, setEnteredName] = useState('');

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    console.log(enteredName);
  }

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className='form-control'>
        <label htmlFor='name'>Your Name</label>
        <input type='text' id='name' onChange={nameInputChangeHandler} />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;

```
ref 방법

_BasicForm.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    console.log(enteredName);
    const enteredValue = nameInputRef.current.value;

    console.log(enteredValue);
  }

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className='form-control'>
        <label htmlFor='name'>Your Name</label>
        <input 
          ref={nameInputRef}
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler} />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;

```

- Ref: value가 제출되었을 때 단 한번만 필요할 때
- State: 즉각적인 유효성 검증을 위해 키 입력마다 입력값이 필요할 때, 값을 초기화 할때

최종적으로는 state를 사용하는게 좋다.

_BasicForm.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    console.log(enteredName);
    const enteredValue = nameInputRef.current.value;

    console.log(enteredValue);

    setEnteredName('');
  }

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className='form-control'>
        <label htmlFor='name'>Your Name</label>
        <input 
          ref={nameInputRef}
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          value={enteredName} />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;

```
---

## 기본 Validation 추가 + 검증 피드백


state와 if문을 써서 공란일 때 오류 메시지를 띄우고 해결이 안되는 식으로 구현,

또한 css도 변경하여 가독성 좋게.

_BasicForm.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsValid, setEnteredNameIsValid] = useState(true);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    if (enteredName.trim() === '') {
      setEnteredNameIsValid(false);
    }

    setEnteredName(true);


    const enteredValue = nameInputRef.current.value;

    setEnteredName('');
  }

  const nameInputClasses = enteredNameIsValid 
  ? 'form-control' 
  : 'form-control invalid';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          ref={nameInputRef}
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          value={enteredName} 
        />
        {!enteredNameIsValid && <p>이름이 공란입니다.</p>}
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
```
---

## 'was touched' State 해결

우리가 `enteredNameIsValid`를 처음에 true로 설정해서 처음부터 오류 메시지가 띄워지지 않도록 했지만 이건 사실 속임수에 가깝다.

useEffect를 사용하고, `enteredNameIsValid`가 true일 경우를 생각해보자.

```js
const SimpleInput = (props) => {
    ...
    useEffect(() => {
        if (enteredNameIsValid) {
            console.log('hi!');
        }
    }, [enteredNameIsValid])
    ...
}
```

이 경우 실행을 하면 아무것도 하지 않았는데 처음부터 문구가 출력이 된다.

왜냐하면 처음부터 상태를 true로 부정확하게 설정했기 때문.

따라서 3번째 state를 추가하자.

이 state는 사용자가 입력란에 enteredName이 있는지 확인하는 state다. 

따라서 입력값이 유효한지에 더해 사용자가 입력창을 건드릴 수 있었는지도 확인할 수 있게 된다. 그래서 입력창을 건드리지 않았다면 에러를 띄워주지 않는다.

그리고 이제 form이 통과되는 로직 `formSubmissionHandler`의 상단 부분에 이 state를 true로 바꿔주는 로직으로 짠 뒤, return하는 JSX들의 로직들도 이에 맞게 바꿔준다.

_BasicForm.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsValid, setEnteredNameIsValid] = useState(false);
  const [enteredNameIsTouched, setenteredNameIsTouched] = useState(false);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setenteredNameIsTouched(true);

    if (enteredName.trim() === '') {
      setEnteredNameIsValid(false);
    }

    setEnteredName(true);


    const enteredValue = nameInputRef.current.value;

    setEnteredName('');
  }

  const nameInputIsInvalid = !enteredNameIsValid && enteredNameIsTouched;

  const nameInputClasses = nameInputIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          ref={nameInputRef}
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          value={enteredName} 
        />
        {nameInputIsInvalid && <p>이름이 공란입니다.</p>}
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
```

## Losing Focus React 

이제 처음으로 돌아가보자. 우리는  **form이 완전히 제출 되었을 때**는 제대로 다룰 수 있게 되었다.

하지만 **사용자가 값을 입력하고 그 input요소가 focus가 없을 때**와, **사용자가 키를 한번씩 칠때마다**는 다루지 못했다.

왜 이러한 방식으로 꾸려야하나? 만약 사용자가 입력 칸을 빈 칸으로 둔채 바깥을 클릭했을 때 이 값이 허용되지 않는다고 에러를 띄울 경우를 가정.

따라서 JSX에서 onBlur 핸들러를 사용하면 가능함.

_SimpleInput.js_
```js
import React, { useRef, useState } from 'react';


const SimpleInput = (props) => {

  const nameInputRef = useRef();
  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsValid, setEnteredNameIsValid] = useState(false);
  const [enteredNameIsTouched, setenteredNameIsTouched] = useState(false);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const nameInputBlurHandler = (event) => {
    setenteredNameIsTouched(true);
    if (enteredName.trim() === '') {
      setEnteredNameIsValid(false);
      return;
    }
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setenteredNameIsTouched(true);

    if (enteredName.trim() === '') {
      setEnteredNameIsValid(false);
      return;
    }

    setEnteredName(true);


    const enteredValue = nameInputRef.current.value;

    setEnteredName('');
  }

  const nameInputIsInvalid = !enteredNameIsValid && enteredNameIsTouched;

  const nameInputClasses = nameInputIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          ref={nameInputRef}
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName} 
        />
        {nameInputIsInvalid && <p>이름이 공란입니다.</p>}
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
```

이런식으로. 그런데 문제는 이렇게 하면 submit 하기 전에 계속 오류 메시지가 표시됨.

## 리팩토링 & state 파생

이제 저 부분의 오류를 해결해보자.

여기서 기억해야할 것은 우리가 if문에서 쓰이는 값은 항상 `event.target.value`라는 점. state를 쓰면 안됨. 왜냐하면 리액트는 비동기로 한꺼번에 처리하니까!

이후 리팩토링을 하자. 먼저 ref에 관한 부분을 전부 지우자. 필요없다.

이후 유효성 검증 로직에서는 입력값이 유효한가, 사용자가 입력창을 건드렸는가, 그리고 값이 유효하지 않고 입력창을 건드렸으면 에러를 보여주고 아니면 그러지 않는것.

즉 `enteredNameIsValid`라는 state는 필요가 없음. 왜냐면 `enteredName`이라는 state로부터 얻어 낼 수 있기 때문. 

또한 state에 새 값이 입력될때마다 컴포넌트도 재실행 되기 때문에 `enteredNameIsValid`라는 상수의 값은 가장 최신의 `enteredName`과 `enteredNameIsTouched`의 state를 반영하게 됨.

이후 논리들을 전부 상수값 `enteredNameIsValid`을 적용 시키고, 마지막에, form을 제출했으므로 `enteredNameIsTouched` state를 false로 바꿔준자.

왜냐하면 form을 제출하고 나면 새양식으로 돌아가서 다시 아무것도 건드려지지 않은 상태가 되어야 하기 때문.

```js
import React, { useState } from 'react';


const SimpleInput = (props) => {

  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsTouched, setEnteredNameIsTouched] = useState(false);

  const enteredNameIsValid = enteredName.trim() !== '';
  const nameInputIsInvalid = !enteredNameIsValid && enteredNameIsTouched;

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const nameInputBlurHandler = (event) => {
    setEnteredNameIsTouched(true);
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setEnteredNameIsTouched(true);

    if (!enteredNameIsValid) {
      return;
    }

    setEnteredName('');
    setEnteredNameIsTouched(false);
  }



  const nameInputClasses = nameInputIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName} 
        />
        {nameInputIsInvalid && <p>이름이 공란입니다.</p>}
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;

```
---
## Multi Input

하나의 입력도 유효하지 않으면 통과되지 않는 로직을 짜자.

`fomrIsValid` state를 만들고 useEffect를 불러와서 `enteredNameIsValid`를 유효성에 넣어, 이 값이 변할때마다 useEffect 로직이 재 실행되도록 하자.

```js
import React, { useEffect, useState } from 'react';


const SimpleInput = (props) => {

  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsTouched, setEnteredNameIsTouched] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const enteredNameIsValid = enteredName.trim() !== '';
  const nameInputIsInvalid = !enteredNameIsValid && enteredNameIsTouched;

  useEffect(() => {
    if (enteredNameIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [enteredNameIsValid])

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const nameInputBlurHandler = (event) => {
    setEnteredNameIsTouched(true);
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setEnteredNameIsTouched(true);

    if (!enteredNameIsValid) {
      return;
    }

    setEnteredName('');
    setEnteredNameIsTouched(false);
  }

  const nameInputClasses = nameInputIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName} 
        />
        {nameInputIsInvalid && (
          <p className='error-text'>이름이 공란입니다.</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
```
---
## 이메일 항목 추가

같은 논리를 써보자. 

```js
import React, { useEffect, useState } from 'react';


const SimpleInput = (props) => {

  const [enteredName, setEnteredName] = useState('');
  const [enteredNameIsTouched, setEnteredNameIsTouched] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredEmailTouched, setEnteredEmailIsTouched] = useState(false);

  const enteredNameIsValid = enteredName.trim() !== '';
  const nameInputIsInvalid = !enteredNameIsValid && enteredNameIsTouched;
  const enteredEmailIsValid = enteredEmail.includes('@');
  const enteredEmailIsInvalid = !enteredEmailIsValid && enteredEmailTouched;

  useEffect(() => {
    if (enteredNameIsValid) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [enteredNameIsValid])

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const nameInputBlurHandler = (event) => {
    setEnteredNameIsTouched(true);
  }

  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  }

  const emailInputBlurHandler = (event) => {
    setEnteredEmailIsTouched(true);
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    setEnteredNameIsTouched(true);

    if (!enteredNameIsValid) {
      return;
    }

    setEnteredName('');
    setEnteredNameIsTouched(false);

    setEnteredEmail('');
    setEnteredEmailIsTouched(false);
  }



  const nameInputClasses = nameInputIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  const emailInputClasses = enteredEmailIsInvalid 
  ? 'form-control invalid' 
  : 'form-control';

  return (
    <form onSubmit={formSubmissionHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
          type='text' 
          id='name' 
          onChange={nameInputChangeHandler}
          onBlur={nameInputBlurHandler}
          value={enteredName} 
        />
        {nameInputIsInvalid && (
          <p className='error-text'>이름이 공란입니다.</p>
        )}
      </div>
      <div className={emailInputClasses}>
        <label htmlFor='email'>Your E-Mail</label>
        <input 
          type='text'
          id='email'
          onChange={emailInputChangeHandler}
          onBlur={emailInputBlurHandler}
          value={enteredEmail}
        />
        {enteredEmailIsInvalid && (
          <p className='error-text'>이름이 공란입니다.</p>
        )}
      </div>
      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
```

## 커스텀훅 생성

보면 중복되는 로직이 많으므로, 로직을 아웃소싱하자.

