# Custom Hook 실전

## 실전 세팅

URL에 내 firebase 링크를 넣자.

_App.js_
```js
import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';

const URL = 'https://react-http-bc15f-default-rtdb.firebaseio.com/task.json'

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

      const loadedTasks = [];

      for (const taskKey in data) {
        loadedTasks.push({ id: taskKey, text: data[taskKey].text });
      }

      setTasks(loadedTasks);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
```

마찬가지로 `NewTask.js`도 URL을 수정해주자.

_NewTask.js_
```js
import { useState } from 'react';

import Section from '../UI/Section';
import TaskForm from './TaskForm';

const NewTask = (props) => {
  const URL = 'https://react-http-bc15f-default-rtdb.firebaseio.com/task.json'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enterTaskHandler = async (taskText) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL,
        {
          method: 'POST',
          body: JSON.stringify({ text: taskText }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

      const generatedId = data.name; // firebase-specific => "name" contains generated id
      const createdTask = { id: generatedId, text: taskText };

      props.onAddTask(createdTask);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;

```

이 애플리케이션은 요청을 전송해야 하므로 firebase에 rule을 설정하자.

```json
{
  "rules": {
    ".read": true, // 2022-05-12
    ".write": true, // // 2022-05-12
  }
}
```

이건 todo 애플리케이션으로 입력을 하면 firebase에 저장이 되고 저장된 항목이 자동으로 나타나는 로직의 애플리케이션이다.

이 앱에서 제일 중요한 부분은 `fetchTask` 함수부분으로, 이 함수는 useEffect가 있는 컴포넌트가 로드되어 실행되거나, `Tasks` 컴포넌트 안에 button 이 클릭되거나 오류가 있을때 재시도하게 해주는 버튼이 클릭되었을때 실행됨.

한편 POST request는 `NewTask.js`에서 실행이 되는데, `Taskform.js`에서 최종적으로 제출이 될때 트리거가 됨. 즉 버튼이 클릭되고 입력된 값이 검증되는 시점이다.

여기서 커스텀훅을 뽑아낼 수 있는 부분이 있는데 바로 NesTesk부분에서 저장할 데이터를 전송하는 부분과 App.js 컴포넌트에서 데이터를 가져오기 위한 request를 보내는 부분이 비슷하다.

비슷한 부분은 로딩과 오류 state를 관리하는 부분과 오류를 다루는 로직이다.

---

## 사용자 정의 HTTP 커스텀 훅

일단 hooks 폴더에 `use-https.js`를 만든 후 `App.js`의 `fetchTasks`와 훅들을 모두 베껴와보자.

그 다음 무슨 매개변수가 필요할지 생각해보자. URL, 메소드(Rest API), body, 헤더가 필요할 것이다.

따라서 그 값을 객체를 통해 넣는다는 식으로 로직을 짠다. 이 후 데이터를 최종적으로 처리하는 부분은 구체적이기 때문에 따로 로직을 짜기 힘들다. 

따라서 데이터를 가져오면 이 커스텀 훅을 사용하는 컴포넌트로 부터 얻은 함수를 실행해서, 그 함수에 데이터를 넘기는 방식을 사용한다. 

즉 자식 로직에서 부모로 데이터를 전달하는 방식과 동일하다.

이후 return 할 대상에는 여러가지의 value를 넣어야 하므로 객체를 반환한다.

로딩되고 있는지, 그리고 error는 없는지가 중요하므로 error, isLoading, 그리고 sendRequest 함수 자체도 반환해준다.

Modern JS 덕분에 속성과 value가 같으면 그냥 한가지 값만 적어도 된다.

그러면 최종적인 앱은 이런 형식이 된다

_use-https.js_
```js
import React, { useState } from 'react';

const useHttp = (requestConfig, applyData) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                requestConfig.url, {
                    method: requestConfig.method ? requestConfig.message : 'GET',
                    headers: requestConfig.headers ? requestConfig.headers : {},
                    body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                }
            );

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();
            applyData(data);

        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    };

    return {
        isLoading,
        error,
        sendRequest,
    };
};

export default useHttp;
```

## 사용자 정의 HTTP 커스텀 훅 적용 

먼저 앞서 말한대로 컴포넌트에 커스텀 훅이 포인터로 지정한 함수부분을 구현하자. 바로 데이터를 최종적으로 처리하는 로직이다.

이후 `useHttp`라는 커스텀 훅을 가져와서 안에 매개변수로 사용할 객체와 함수를 지정해준다.

그리고 반환 값도 알맞게 객체로 지정해주고, 대신 객체의 값중 하나인 함수의 값을 useEffect와 맞춰준다. (`fetchTask`로!) 

중요한 것은 useEffect에서 의존성에 fetchTask를 넣어줘야 한다는 것, 왜냐하면 이전의 `fetchTask`는 state 갱신 함수만 호출하고 있기 때문에 변경되지 않기 때문 (리액트가 보장!)

하지만 바뀐 `fetchTask`함수, 즉 커스텀 훅 안의 함수에서는 무슨 일이 일어날 수 밖에 없으니 의존성을 추가해야한다. 

그러나 현재로선 문제가 생길 수 있으므로 나중에 추가하도록하자.

---

## 커스텀 훅 조정

JS에서 함수도 객체이므로, 내부에 같은 로직을 품고 있더라도 함수가 재생성되면 메모리에서 새로운 객체로 인식되어 useEffect가 새로운 값을 받아들이게 되서 재실행하게 되고, 무한 루프에 빠지게 된다.

따라서 이를 막기위해 `use-http`를 useCallback으로 wrapping 해야한다.

이후 의존성 배열에는 `requestConfig`, `applyData` 함수 라는 객체를 추가하게 된다. 왜냐하면 함수 내에서 사용되는 것들이고 변할 수 있기 때문.

_App.js_
```js
import React, { useState, useCallback } from 'react';

const useHttp = (requestConfig, applyData) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                requestConfig.url, {
                    method: requestConfig.method ? requestConfig.message : 'GET',
                    headers: requestConfig.headers ? requestConfig.headers : {},
                    body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                }
            );

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();
            applyData(data);

        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    }, [requestConfig, applyData]);

    return {
        isLoading,
        error,
        sendRequest,
    };
};

export default useHttp;
```

이제 `App.js`에 돌아가서, 우리가 전달하는 객체와 함수들이 함수가 재실행될때마다 재성성 되지 않도록 해야한다.,

따라서 `App.js`에 있는 `transformTasks`도 useCallback으로 감싸주자. 

여기서는 의존성 배열을 추가할 게 없는데, 왜냐하면 불변성이 보장되기 때문이다. `setTasks`만 빼면 외부에서 사용하는 것이 없는데, 그마저도 리액트가 불변성을 보장한다.

_App.js_
```js
import React, { useEffect, useState, useCallback} from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-https';



function App() {
  const URL = 'https://react-http-bc15f-default-rtdb.firebaseio.com/tasks.json';
  const [tasks, setTasks] = useState([]);

  const transformTasks = useCallback((taskObj) => {
    const loadedTasks = [];

    for (const taskKey in taskObj) {
      loadedTasks.push({ id: taskKey, text: taskObj[taskKey].text });
    }

    setTasks(loadedTasks);
  }, []);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp({ url: URL }, transformTasks);


  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
```

여기서 남은 문제는 URL이 App컴포넌트의 재평가마다 매번 재생성 된다는 것. 따라서 커스텀훅 안의 `sendRequest` 함수에서 받는 식으로 바꾸자.

_use-http.js_
```js
import React, { useState, useCallback } from 'react';

const useHttp = (applyData) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (requestConfig) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                requestConfig.url, {
                    method: requestConfig.method ? requestConfig.message : 'GET',
                    headers: requestConfig.headers ? requestConfig.headers : {},
                    body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
                }
            );

            if (!response.ok) {
                throw new Error('Request failed!');
            }

            const data = await response.json();
            applyData(data);

        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    }, [applyData]);

    return {
        isLoading,
        error,
        sendRequest,
    };
};

export default useHttp;
```

이 후 `App.js`에서 URL객체를 제거한 후, `transformTasks`에 인자를 전해줘야 하므로, useEffect안의 함수에 전달한다

그 다음, `App.js`에 useCallback를 넣는것이 보기 안좋다면, useEffect 함수를 `transformTasks`까지 합쳐서 위의 범위로 넣어버린 후, `use-http.js`에 useCallback을 적용시킨다. 

이러면 `use-http.js`의 커스텀 훅에는 매개변스가 없다.

_App.js_
```js
import React, { useEffect, useState } from 'react';

import Tasks from './components/Tasks/Tasks';
import NewTask from './components/NewTask/NewTask';
import useHttp from './hooks/use-http';

function App() {
  const [tasks, setTasks] = useState([]);

  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  useEffect(() => {
    const transformTasks = (tasksObj) => {
      const loadedTasks = [];

      for (const taskKey in tasksObj) {
        loadedTasks.push({ id: taskKey, text: tasksObj[taskKey].text });
      }

      setTasks(loadedTasks);
    };

    fetchTasks(
      { url: 'https://react-http-6b4a6.firebaseio.com/tasks.json' },
      transformTasks
    );
  }, [fetchTasks]);

  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
```

_use-http.js_
```js
import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();
      applyData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
```
---

## NewTasks 수정

여기서는 useCallback 같은 것을 사용하지 않아도 됨. 왜냐하면 `enterTaskHandler`에서만 `sendTaskRequest`를 호출하고 있기 때문. useEffect 같은 것이 없다. 따라서 무한루프 같은 문제는 발생하지 않는다.

대신 `createTask`메소드에서 `taskText`를 제대로 전달하지 못하는 문제가 있으므로, 이걸 bind메소드로 해결하자.

_NewTask.js_
```js
import { useState } from 'react';
import useHttp from '../../hooks/use-https';

import Section from '../UI/Section';
import TaskForm from './TaskForm';

const NewTask = (props) => {
  const URL = 'https://react-http-bc15f-default-rtdb.firebaseio.com/task.json'


  const {isLoading, error, sendRequest: sendTaskRequest} = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async (taskText) => {
    sendTaskRequest({
      url: URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { text: taskText },
    }, createTask.bind(null, taskText));
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
```

