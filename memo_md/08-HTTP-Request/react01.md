# HTTP 통신하기. (백엔드 / DB)

## 목표

1. 리액트를 DB와 연결하는법
2. Http Requests를 보내고 Responses를 사용하는 법
3. 어플리케이션에서 Loading State와 에러를 숨기는법

---

## DB와 직접적으로 연결하지 않기.

일반적인 브라우저나 JS앱은 DB와 직접적으로 연결되면 안되기 때문이다.

왜냐하면 이 코드를 통해 DB의 인증정보가 노출 될 수 있기 때문이다. 모든 JS 코드는 브라우전 뿐 아니라 웹 이용자들도 접근하고 읽을 수 있음.

---

## 시작 / 백엔드

[스타워즈 API](https://swapi.dev/)를 통해 더미데이터를 불러와보자.

우리는 `axios`대신 `Fetch API`를 사용할 것이다.

`Fetch API`의 가장 간단한 사용법은, 전송하려는 url을 문자열로 전달하고, 이후 추가적인 헤더, body, request 메소드의 변경등을 입력하면 된다.

하지만 여기서는 그런게 딱히 필요없으므로 하지 않는다. 

`fetch()`는 `Promise`라는 객체를 반환하는데 이 객체는 우리가 잠재적으로 발생 가능한 오류나 호출에 대한 응답에 반응하게 해준다.

즉 어떤 즉각적인 행동 대신 특정한 데이터만을 전달하는 객체라는 것이다. 왜냐하면 HTTP Request 전송은 비동기 작업이기 때문이다. 지연이 될 수도, 실패가 될 수도 있다.

따라서 이것을 받았을 때를 가정해서 최종함수 `then()`을 설정하고, 응답을 받을 때 호출된다.

여기서 return을 통해 JSON Response의 본문을 코드에서 사용할수 있는 JS 객체로 바꿔주는 `json()`함수를 통해 변환시킨다.

이후 추가적인 then을 통해, 변환된 데이터를 가져온다. 이 로직으로 짜면 위의 js변환이 완료 될 경우 실행 될 것이다.

이후 변환된 데이터를 useState안에 넣고 저장해준다.

_App.js_
```js
import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films/';

function App() {

  const [movies, setMovies] = useState([]);

  const fetchMoviesHandler = () => {
    fetch(URL).then(response => {
      return response.json();
    }).then(data => {
      setMovies(data.results);
    });
  }

  return (
    <React.Fragment>
      <section>
        <button>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
```

그런데 `Movie.js`에서의 props와 JSON의 데이터 명이 일치하지 않음. 따라서 데이터의 형식을 바꿔서 어플리케이션 안에서 원하는 형식으로 변환해주자.

또한 then 대신 async를 써서 더 간결하게 표시해보자! 

_App.js_
```js
import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films/';

function App() {

  const [movies, setMovies] = useState([]);

  async function fetchMoviesHandler() {
    const response = await fetch(URL)
    const data = await response.json();
    
    const trasformedMoved = await data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        };
      });
      setMovies(data.results);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
```

---

## 로딩 및 데이터 state 처리

state 관리를 통해 로딩을 표시하자.

또한 영화가 빈 배열이라서 아무것도 없을때도 처리를 하자.

_App.js_
```js
import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films/';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    const response = await fetch(URL)
    const data = await response.json();
    
    const trasformedMoved = await data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        };
      });
      setMovies(data.results);
      setIsLoading(false);
  }


  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>Found no movies.</p>}
        {isLoading && <p>Loading!</p>}
      </section>
    </React.Fragment>
  );
}

export default App;

```
## 오류처리


error에 관한 state를 만든 후 try catch 문을 사용한다.

중요한 건 `fetch API`는 에러상태코드를 실제 에러 취급 하지 않는 다는 것. 따라서 오류 상태 코드를 받았을 때 오류가 발생하게끔 하는 것이 좋은 방식.

또한 response의 body부분을 파싱하기 전에 response의 응답이 ok인지 확인해야함. 왜냐하면 몇몇 API는 request가 성공적이지 않아도 json을 보내기 때문. 따라서 if문은 response.json 위에 놓는다.

_App.js_
```js
import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films/';
const WRONG_URL = 'https://swapi.dev/api/film/';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);

    try{
      const response = await fetch(URL)

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      
      const trasformedMoved = await data.results.map(movieData => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          };
        });
        setMovies(data.results);
        
    } catch (error) {
      setError(error.message);
    }
  setIsLoading(false);
  }


  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {isLoading && <p>Loading!</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;

```

그런데 이렇게 하나하나 inline 체크를 하는 대신 다른 방법을 사용가능하다.

```js

...
function App() {
  ...
  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  
  if(isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}
...
```

## useEffect로 페이지 방문하자마자 API 조회

HTTP Request 전송은 일종의 사이드 이펙트로 컴포넌트의 state를 변경하기 때문

이런 사이드 이펙트는 useEffect로 해야함. 무한루프 방지!

effect 함수 내에는 사용하는 모든 의존성을 이 의존성 배열에 표시해두는 것이 가장 좋음. 여기서는 `fetchMoviesHandler`가 그 대상. 

하지만 의존성으로 넣으면 무한루프가 발생할 가능성이 있음. 따라서 useCallback 훅으로 감싸자. 

useCallback 함수도 함수에 있는 의존성을 모두 나열해야하나, fetchAPI는 글로벌 브라우저 API고, state 업데이트 함수도 리액트가 절대 변경이 없을 것이라고 보장했기 때문에, 딱히 의존성이 없다.

_App.js_
```js
import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const URL = 'https://swapi.dev/api/films/';
const WRONG_URL = 'https://swapi.dev/api/film/';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try{
      const response = await fetch(URL)

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      
      const trasformedMoved = await data.results.map(movieData => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          };
        });
        setMovies(data.results);
        
    } catch (error) {
      setError(error.message);
    }
  setIsLoading(false);
  }, []);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  
  if(isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;

```

그런데 이렇게 실행하면 문제가 발생한다. 왜? 

이전에는 JS의 호이스팅 때문에 문제가 안되었는데 이제 상수인 `fetchMoviesHandler`가 전체 코드를 파싱하기 전에 함수를 호출하기 때문에 문제가 발생함

따라서 useEffect 호출을 함수 뒤에 붙여야함.

_App.js_
```js
...
function App() {
  ...

  const fetchMoviesHandler = useCallback(async () => {
    ...
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  ...
}

export default App;

```
## POST

새로운 프로젝트를 생성한후 `Realtime Database`에서 테스트용으로 만들자.

이후 URL을 firebase의 url로 수정해주자.

함수인 addMovieHandler에 fetch로 URL과,API로 보낼 부분을 넣어주자.

POST로 보내고, body에는 `AddMove.js` 컴포넌트에서 만든 form을 담아주고, 헤더에는 json으로 보낸다는 것을 말해주자.

_App.js_
```js
import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

const URL = 'https://react-http-bc15f-default-rtdb.firebaseio.com/movies.json';

function App() {
  ...

  async function addMovieHandler(movie) {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  ...

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

```

이후 firebase에서 확인해보면 정상적으로 등록이 되었다.

![firebase](../img/2022-05-11-004839.png)

그런데 이제는 fetch Movies가 적용이 안된다. 왜냐?

데이터가 배열이 아니라 객체로 받았기 때문이다.

따라서 우리는 map을 다른 방식으로 바꿔야한다. for과 push를 써서 바꿔보자.

_App.js_
```js
...

function App() {
  ...

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  ...

  return (
    ...
  );
}

export default App;
```

정상적으로 된다!
