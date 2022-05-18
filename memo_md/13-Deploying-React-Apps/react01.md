# 배포하기

## 배포단계

배포 순서는 어떻게 되는가?

1. 코드 테스트
2. 코드 최적화 (Lazy Loading)
3. 프로덕션 용 App을 Build
4. 서버에 코드 올리기

## Lazy Loading

**해당 코드가 필요할 때만 특정 코드를 로딩하는 것**

서비스 이용자가 웹사이트에 방문하면, 모든 코드가 다운로드되어야 리액트가 실행이 됨.

따라서 초기 코드 번들을 가장한 작게 만들어야 함.

이것은 라우팅과 같이 하면 매우 좋다.

해당 라우트를 방문할 때만 다운로드 되도록 할 수 있기 때문.

```js
import ComA from './ComA';

// 이걸 Lazy로 변경하려면?

import React from 'react';

const ComA = React.lazy(() => import('./ComA'));

function App() {
  return (
    <Fragment>
      <ComA />
      <ComB />
    </Fragment>
  )
}

// 이렇게!
```

그러나 이 코드를 필요할 때만 다운로드하기 때문에 React는 중지되고 다운로드가 완료될 때까지 컴포넌트를 로딩할 수 없다.

따라서 `Suspense` 컴포넌트를 써야하고 App에서 Layout, Fragment과 같은 최상위 컴포넌트 아래의 레이아웃을 전부 감싸줘야한다.

```js
import React, { Suspense } from 'react';

const ComA = React.lazy(() => import('./ComA'));

function App() {
  return (
    <Fragment>
      <Suspense fallback={<p>Loading</p>}>
        <ComA />
        <ComB />
      </Suspense>
    </Fragment>
  );
};
```

선택사항이지만 복잡한 앱에선 고려할 필요가 잇음.

## 배포

npm run build를 하면 자동생성이 됨.

public 디렉토리를 사용할 것인가?

aws같은 호스트 제공자를 쓰려면 build폴더를 업데이트 해야함.

싱글페이지어플리케이션의 배포에 주의

