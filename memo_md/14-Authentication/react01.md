# 인증

## 목표

1. 리액트 앱에서 인증이 작동하는 원리
2. 사용자 인증 예시 구현
3. 인증 유지 추가와 자동 로그 아웃

## 인증을 어떻게?

### 절차

1. 사용자가 접근 허가를 받음: 로그인으로 자격 증명 제공
2. 보호받는 리소스를 요청함

### 인증방법

단순히 인증되었나를 예/아니오로 구분하는 것은 위험함

따라서 2가지 기법으로 인증을 확인하는데

1. 서버사이드 세션
  - 전통적인 방법. 
  - 특정 사용자의 고유 ID를 서버가 저장함. 이 ID는 클라이언트에게도 저장됨. 따라서 request는 예/아니오가 아니라 id까지 저장됨. 고로 ID를 조작하면 서버가 알아차리고 인증을 거부함.
  - 단점은 백엔드와 프론트엔드의 결합이 긴밀하지 않으면, 독립적으로 작용하기 때문에 서버에 ID를 저장하면 위험하다.

2. 인증 토큰
  - 자격이 증명되면 서버는 허가 토큰이라는 것을 생성함
  - 토큰은 서버의 특정 알고리즘에 따라 생성됨
  - 중요한 것은 토큰은 클라이언트는 모르고 서버는 안다는것.
  - 토큰은 클라이언트에게 보내지만, 생성방법은 서버만 알고 있음
  - 토큰을 future requests에 첨부해 서버의 보호된 리소스에 보냄.

---

## 인증 Form 구현

`AuthForm.js`에서 구현하자.

로그인 해주는 함수인 `submitHandler`를 구현하고,

이메일과 비밀번호는 useRef로 따오자.

이후 Firebase의 [Auth Rest API 규칙](https://firebase.google.com/docs/reference/rest/auth)을 보자.

Email Sign up에서 EndPoint를 다음과 같이 지정하고 있다

>_https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]_

이걸 복사해서, URL로 넣어주고, API 부분은 개인 Firebase의 프로젝트 설정에 있는 웹 API를 넣어주자.

이후 POST 요청으로 넣어주는 로직을 짜주면 완성

_AuthForm.js_
```js
import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  
  const submitHandler = (event) => {

    const URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPjJSamRqXRoubpmDBKqczw55_eAjbpT8'

    event.prevendDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {

    } else {
      fetch(URL, 
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(res => {
        if (res.ok) {

        } else {
          res.json().then(data => {
            console.log(data);
          });
        }
      })
    }

  }

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
```
물론 아직 실행은 안된다.

---

## 오류메시지 출력

일단 오류 메시지가 무엇을 나타내는지 부터 띄워주고, 그것은 json에 자동으로 뿜는 객체인 `error`에서 따온다.

또한 Loading state를 통해 로딩중인것도 표시해주자. 버튼을 로딩일때만 나타나게!

```js
import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {

  const URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPjJSamRqXRoubpmDBKqczw55_eAjbpT8'

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const submitHandler = (event) => {
    event.prevendDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    if (isLogin) {

    } else {
      fetch(URL, 
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(res => {
        setIsLoading(false);
        if (res.ok) {

        } else {
          res.json().then(data => {
            let errorMessage = 'Auth Failed!';
            if (data && data.error & data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          });
        }
      })
    }

  }

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
```
---

## 실전 form 구현

이제 form을 제대로 구현해보자.



```js
import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPjJSamRqXRoubpmDBKqczw55_eAjbpT8';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPjJSamRqXRoubpmDBKqczw55_eAjbpT8';
    };

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => {
      setIsLoading(false);
      if (res.ok) {
        return res.json();
      } else {
        res.json().then(data => {
          let errorMessage = 'Auth Failed!';
          if (data && data.error & data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      console.log(data);
    })
    .catch((err) => {
      alert(err.message);
    })

  }

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
```

이제 이러면 객체가 출력된다.

CORS 주의!

---

## 인증 State 관리

Context API를 통해 관리하자.

```js
const useIsLoggedIn = !!token;
```

이렇게 구현한 것은 토큰이 비어있으면 false, 안비어있으면 true라는 뜻.

_/store/auth-context.js_
```js
import React, { useState } from 'react';

const AuthContex = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {}
});

export const AuthContextProvider = (props) => {

  const [token, setToken] = useState(null);

  const useIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
  };

  const contextValue = {
    token: token,
    isLoggedIn: useIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  }

  return <AuthContex.Provider>{props.children}</AuthContex.Provider>
};

export default AuthContex;
```

이제 Context를 `index.js` 에 적용하자

_index.js_
```js
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { AuthContextProvider } from './store/auth-context';

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById('root')
);
```

이후 Form에도 Context를 적용한다.

_AuthForm.js_
```js
import { useState, useRef, useContext } from 'react';
import AuthContex from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContex);

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const submitHandler = (event) => {
    ...

    fetch(
      ...
    ).then((data) => {
      // 여기서 추가!
      authCtx.login(data.idToken);
    })
    .catch((err) => {
      alert(err.message);
    })

  }

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    ...
  );
};

export default AuthForm;
```

이제 UI도 바꾸게 수정해주자

_MainNavigation.js_
```js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContex from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContex);

  const isLoggedIn = authCtx.isLoggedIn;
  
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && <li>
            <Link to='/auth'>Login</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to='/profile'>Profile</Link>
          </li>}
          {isLoggedIn && <li>
            <button>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
```
---

## 비밀번호 수정

로그인이 되었으니 보호된 리소스에 요청을 보낼경우 인증 토큰이 어떻게 사용되는지 알아보자.

마찬가지로 위의 동일 페이지에서 업데이트에 필요한 엔드포인트는 이것이다

>_https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]_

로그인 form으로 간다.

마찬가지로 useRef를 통해 값을 뽑고, Context로 state를 가져온다음 fetch로 넣는 함수를 만든다.

_ProfileForm.js_
```js
import { useContext, useRef } from 'react';
import AuthContex from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {

  const authCtx = useContext(AuthContex);
  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    
    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCPjJSamRqXRoubpmDBKqczw55_eAjbpT8',{
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // assumption: Always succeeds!
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
```

---

## 리디렉션

비밀번호 변경 및 로그인 후에는 사용자를 리디렉션 하는것!

엄청 간단하다.

_AuthForm.js_
```js
import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContex from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  ...
  
  const submitHandler = (event) => {
    ...

    fetch(...)
      .then((data) => {
        authCtx.login(data.idToken);
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  ...

  return (
    ...
  );
};

export default AuthForm;
```

_ProfileForm.js_
```js react
import { useContext, useRef } from 'react';
...

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContex);
  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    
    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch(...)
    .then(res => {
      history.replace('/');
    });
  };

  return (
    ...
  );
};

export default ProfileForm;
```
---

## 로그아웃

인증 토큰방식에서 핵심은 로그인한 클라이언트의 어떤 정보도 저장되지 않는 다는 점. 

firebase는 우리가 로그인 중이거나 로그인 했었는지 알지도 못하고 관심도 없음.

따라서 바꿔야할건 우리의 state밖에 없음.

_MainNavigation.js_
```js
...
const MainNavigation = () => {
  const authCtx = useContext(AuthContex);

  const isLoggedIn = authCtx.isLoggedIn;
  
  const logoutHandler = () => {
    authCtx.logout();
  }

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && <li>
            <Link to='/auth'>Login</Link>
          </li>}
          {isLoggedIn && <li>
            <Link to='/profile'>Profile</Link>
          </li>}
          {isLoggedIn && <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>}
        </ul>
      </nav>
    </header>
  );
};
export default MainNavigation;
```

엄청 간단하다!

## 프론트엔드 앱 보호 (네비게이션 가드)

그런데 여기서 문제는 로그아웃 하더라도 리디렉션이 안된다는점.

더 심각한건, 우리가 그냥 `/profile`을 하게 되면 바로 수정하는 화면으로 들어가진다는 점이다.

그럼 정확하게 바꾸어보자. 만약 로그인이 안되어 있다면 `UserProfile`은 렌더링 되지 않는다는 식으로 구현 하면 된다!

마찬가지로 모든 페이지는 전부 메인 페이지로 이동한다는 로직도 짠다..

_App.js_
```js
import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}
        <Route path='/profile'>
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
```
---

## 사용자 state 보관

localStorage에 token을 저장하고, token을 보고 있으면 바로 로그인 시키는 로직으로 바꾼다. 

_/store/auth-context.js_
```js
import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

## 자동 로그아웃

Context에 시간을 현재시각과 만료시각을 빼서 시간을 알려주는 로직을 짠다. 

이후 그 로직을 로그인 함수에 넣고, timeout을 통해 만료되면 로그아웃되게 로직을 짠다.

_/store/auth-context.js_
```js
import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculteTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
}

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);

    const remaingTime = calculteTime(expirationTime);

    setTimeout(logoutHandler, remaingTime);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

이제 이걸 `AuthForm.js`에 적용시키자.

```js
...
const AuthForm = () => {
  ...
  const submitHandler = (event) => {
    ...
    fetch(...)
      ...
      .then((data) => {
        const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)));
        authCtx.login(data.idToken, expirationTime.toISOString);
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  ...
  return (
    ...
  );
};

export default AuthForm;
```

Firebase의 [Auth Rest API 규칙](https://firebase.google.com/docs/reference/rest/auth) 에서 expiresIn이 String으로 되어있으므로 그 점을 주의해서 짜자.

이제 로그아웃을 했을 때 타이머를 초기화 해보자.

또한 토큰이 유효하지 않을때 삭제하는 로직도 짜자.

useEffect에서 사용하고 있는 함수중에는 logoutHandler도 있다. 하지만 이는 무한루프의 위험성이 있으므로 logoutHandler에 콜백함수를 씌어준다. 

의존성은 추가해줄게 없음. 여기서 쓰는것들은 리액트가 아니라 자바에서 쓰는함수니까.

_/store/auth-context.js_
```js
import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```