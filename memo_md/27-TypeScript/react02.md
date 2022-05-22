# TypeScript + React

## 만들기

>npx create-react-app react-ts --template typescript

안에 폴더를 열어보면 ts가 아니라 tsx파일인데, 이것은 ts문법 안에서 jsx문법을 오류없이 쓸 수 있게 하는 확장자다.

## props + TSX

_Todos.tsx_
```tsx
import React from "react";

const Todos: React.FC = (props) => {
  return (
    <ul>
      {}
    </ul>
  )
}

export default Todos;

```
props에 대해서 어떤 타입을 적용해야하는지의 오류를 뿜기 때문에 리액트가 설정한 방법인 제네릭을 적용하자.

우리는 Todos라는 함수에 React.FC라고 타입을 정의했다. 즉 이것은 이 함수가 함수형 컴포넌트로 동작한다는 것을 명확히 의미한 것이다. 

이렇게 되면 TS는 이 함수가 받는 값이 props객체라는 것을 이해하고, props객체에는 항상 children이 있다는 것도 이해하게 된다.

이후 React.FC 뒤에 `<{}>`을 넣어서 내부적으로 사용되는 제네릭 타입에 구체적인 값을 넣을 것이다.

즉 매개변수를 넣고 제네릭 함수를 호출해서 해당 값의 타입을 추론하도록 두는 게 아니라,

함수를 정의하고 TS에게 이 함수를 내부적으로 어떻게 처리해야하는지 알려주는 것.

---

다시 설명해보자

`FC` 즉, `FunctionComponent`는 리액트가 제공하는 하나의 타입이다. 

어떻게 생겼는지 뜯어서 보면 

```ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```
이렇게 생겼다.

여기서 알 수 있는건 FC는 FunctionComponent와 동일 하다는 점과 **제네릭 타입의 값을 객체로 받는다**는 점이다.

또한 FC type은 함수를 갖는데 인자로 props, context? 를 받고, ReactElement | null을 반환한다는 점이다.


여기서 `PropsWithChildren<P>` 부분을 한번 보자
```ts
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
```
이걸 보면 여기에 있는 props는 선언된 제네릭 타입과 children이 포함되어 있음을 알 수 있다. (단 children은 optional이다.)

따라서 이렇게 설정을 하면 

_Todos.tsx_
```tsx
import React from "react";

const Todos: React.FC<{ items: string[] }> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default Todos;
```

**string 배열인 items**를 객체방식으로 추가하면서, props 객체에 children과 같이 값을 추가할 수 있게 된 것이다.

이제 이걸 `App.tsx`에 적용해보자.,

우리는 items를 optional로 적용하지 않았기 때문에 Todos에는 값이 필수다. 따라서 더미데이터를 넣어주자.

_App.tsx_
```tsx
import React from 'react';
import './App.css';
import Todos from './components/Todos';

function App() {
  return (
    <div>
      <Todos items={['First', 'Second']}/>
    </div>
  );
}

export default App;
```
정상적으로 적용이 된다.

---

## 데이터 모델 추가

우리는 todos에 단순히 글만 추가할 게 아니기 때문에 객체를 만들어주자.

여기서는 class로 만들어주는데 interface로 만들어줘도 상관은 없다.

중요한건 클래스로 만들면 인스턴스화 되어야 한다. 

_/models/todo.ts_
```ts
class Todo {
  id: string;
  text: string;

  constructor(todoText: string) {
    this.text = todoText;
    this.id = new Date().toISOString();
  }
}

export default Todo;
```

좋은 점은 우리가 만든 class도 하나의 type이 될 수 있다는 점이다. 따라서 이렇게 만들면 똑같이 적용이 된다.

따라서 이제 이렇게 적용할 수 있다.

_Todos.tsx_
```tsx
import React from 'react';

import Todo from '../models/todo';

const Todos: React.FC<{ items: Todo[] }> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

export default Todos;
```

_App.tsx_
```tsx
import Todos from './components/Todos';
import Todo from './models/todo';

function App() {
  const todos = [new Todo('Learn React'), new Todo('Learn TypeScript')];

  return (
    <div>
      <Todos items={todos} />
    </div>
  );
}

export default App;
```

---

## Todo 컴포넌트 분리

_TodoItem.tsx_
```tsx
import React from "react";

const TodoItem: React.FC<{ text: string }> = (props) => {
  return <li>{props.text}</li>
};
export default TodoItem;
```

_Todos.tsx_
```tsx
import React from 'react';

import TodoItem from './TodoItem';
import Todo from '../models/todo';

const Todos: React.FC<{ items: Todo[] }> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <TodoItem key={item.id} text={item.text} />
      ))}
    </ul>
  );
};

export default Todos;
```

기억해야할 점은 React.FC라는 타입은 children뿐만 아니라 key같은 prop도 컴포넌트에 추가할 수 있음.

---

## TS의 Form 제출

form 제출에서 event는 `React.FormEvent` 객체 타입이다.

onClick은 `MouseEvent`... 

여기서 좋은 점은 만약 event의 type이 `React.MouseEvent`이었다면 onSubmit 부분에서 에러를 뿜는다는 것이다. 왜냐면 기대되는 Type과 일치하지 않기 때문!

_NewTodo.tsx_
```tsx
import React from "react";

const NewTodo = () => {
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' />
      <button>Add Todo</button> 
    </form>
  );
};

export default NewTodo;
```
---

## TS + useRef

우리가 만든 Ref에서 이 Ref가 입력창에 연결될 사실을 알지 못하기때문에, 이 Ref에 저장될 데이터가 어떤 타입인지 명확히 밝혀야한다.

또한 Ref에 다른요소가 할당되었을수 있기 때문에 생성되었을때 자동으로 입력해야할 기본값도 지정해줘야한다.

`todoTextInputRef.current?.value`에서 optional이 붙은 이유는 Ref에 value가 아직 설정이 되지 않았을 수 도 있기 때문이다.

말이 안되지만, TS는 우리가 연결이 완료되기 전에 이 함수가 포함된 로직이 실행되서 안된다는걸 이해를 못하기 때문에, 값에 접근해봐서 만약 있으면 가져오고 아니면 null을 가져오라는 거다.

따라서 우리는 이 optional기호를 !로 바꿀 수 있다. 이 기호는 TS에게 이 값이 null이 될 수 있지만 연결되는 시점에는 절대 null이 아니라는걸 알 때 사용한다. 즉 null이 아니라는 걸 100% 확신할때만 사용.

_NewTodo.tsx_
```tsx
import React, { useRef } from "react";

const NewTodo = () => {
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const entertedText = todoTextInputRef.current?.value;

    if (entertedText?.trim().length === 0) {
      return;
    }

    
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={todoTextInputRef}/>
      <button>Add Todo</button> 
    </form>
  );
};

export default NewTodo;
```

---

## Function Props

`App.tsx`에 있는 배열의 값을 동적으로 바꾸기 위해 state로 관리 하자.

그러면 `NewTodo`에서 props로 관리해야하는데 여기서 props는 함수다!

또한 이 함수는 text를 받고 반환하는 것은 없으므로 void를 반환하도록 하자.

_NewTodo.tsx_
```tsx
import React, { useRef } from "react";

const NewTodo: React.FC<{ onAddTodo: (text: string) => void }> = (props) => {
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const entertedText = todoTextInputRef.current!.value;

    if (entertedText?.trim().length === 0) {
      return;
    }

    props.onAddTodo(entertedText);
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={todoTextInputRef}/>
      <button>Add Todo</button> 
    </form>
  );
};

export default NewTodo;
```

이제  `App.tsx`에서 이에 맞게 바꿔보자.

_App.tsx_
```tsx
import React, { useRef } from "react";

const NewTodo: React.FC<{ onAddTodo: (text: string) => void }> = (props) => {
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const entertedText = todoTextInputRef.current!.value;

    if (entertedText?.trim().length === 0) {
      return;
    }

    props.onAddTodo(entertedText);
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={todoTextInputRef}/>
      <button>Add Todo</button> 
    </form>
  );
};

export default NewTodo;
```

---

## State 관리

`useState<Todo[]>([])`의 뜻은 Todo타입으로 구성된 배열 타입만 오게 type 안정성을 취한다는 뜻이다.

이제 로직을 짜자. setTodo안에 이전의 Todos 배열 안에 newTodo를 넣는 함수형, concat을 이용하여 바꾼다.

_App.tsx_
```tsx
import { useState } from 'react';
import NewTodo from './components/NewTodo';
import Todos from './components/Todos';
import Todo from './models/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoHandler = (todoText: string) => {
    const newTodo = new Todo(todoText);
    setTodos((prevTodos) => {
      return prevTodos.concat(newTodo);
    });
  }
  return (
    <div>
      <NewTodo onAddTodo={addTodoHandler}/>
      <Todos items={todos} />
    </div>
  );
}

export default App;
```
---

## 삭제기능 추가

---

## Context API


