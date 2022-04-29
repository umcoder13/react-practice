# JS 문법

## Arrow Functions

```javascript
function printMyName(name) {
    console.log(name);
}

const printMyNameArrow = (name) => {
    console.log(name);
}
```

완전히 동일함.

만약 한가지 인수만 가지는 경우는?
```javascript
const printMyNameArrow = name => {
    console.log(name);
}
```
이렇게 해도 작동함!

return 말고 다른 코드가 없는 함수는?

```javascript
const multiply = number => number * 2;
```

***

## Exports and Imports(Modules)

![exports and imports](https://velog.velcdn.com/images%2Fgrinding_hannah%2Fpost%2F714ccc52-180c-4ca2-8fac-6ee952e54407%2Fimage.png)

![exandimp2](https://velog.velcdn.com/images%2Fgrinding_hannah%2Fpost%2F6d775c93-df78-4018-958c-84e73f39b451%2Fimage.png
)

---

## Class

class는 property와 method를 가질 수 있음.
property는 클래스에 정의한 변수

클래스는 자바스크립트 생성자 함수를 만드는 편한 방법 중 하나.
클래스를 통해 자바스크립트 객체를 생성 할 수 있음.

ex)
```js
class Person {
    name='hi',
    call = () => {...}
}

const myPerson = new Person();
myPerson.call();
console.log(myPerson.name);
```

클래스는 상속도 가능함.

클래스에 바로 프로퍼티와 메소드도 할당가능

예시

```js
class Human {
    constructor() {
        gender = 'male';
    }

    printGender = () => {
        console.log(this.gender);
    }
}

class Person extends Human {
    constructor() {
        super();
        name = 'Hi';
    }

    printMyName = () => {
        console.log(this.name);
    }
}

const person = new Person();
person.printMyName();
person.printMyGender();

/*
결과
"Hi"
"male"
*/
```
---

## Speread, Rest

- Spread: 배열의 원소나 객체의 프로퍼티를 나누는데 사용, 
  - ex) oldArray에 새로운 값을 추가할 경우 const newArray = [...oldArray, 1, 2]
  - object도 마찬가지로 사용
- Rest: 함수의 인수목록을 배열로 합치는데 사용
  - ex) 매개변수를 무한으로 받는 sortArgs function sortArgs(...args) {...}

```js
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];

console.log(newNumbers);
// 값: [1, 2, 3, 4]

const person = {
    name = 'hi'
};

const newPerson = {
    ...person,
    age: 28
}

console.log(newPerson);

/* 실행 결과
{
    age: 28,
    name: "hi"
}
*/

const filter = (...args) => {
    return args.filter(el => el === 1);
    // 1일때만 숫자로 반환
}

console.log(filter(1,2,3));
//값 [1]
```

---

## Destructuring

원소나 프로퍼티를 하나만 가져와서 변수에 저장하는 것.   
스프레드 연산과는 다름.


```js
const numbers = [1, 2, 3];
[n1, n2] = numbers;
console.log(n1, n2); // 결과: 1 2

[nn1, ,nn3] = numbers;

console.log(nn1, nn2) // 결과: 1 3
```

사실 이건 잘 안씀

---
## 참조형, 원시형 데이터 타입

```js
const person = {
    name: 'hi'
};

const secondPerson = person;

person.name = 'bye';

console.log(secondPerson);

//결과 name: "bye"
```

이렇게 되는 이유는 단지 포인터를 복사한 것이고, person이 가리키는 메모리에 있는 동일한 객체를 가리키기 때문입니다

이런 경우는 심각한 오류를 발생시킬 수 있음. 왜냐하면 다른 앱에서 수정했다고 이걸 참조한 모든 앱에서도 수정이 발생 될 수 있기 때문

따라서 변경할 수 없는 방법으로 복사하는 방법을 배워야함

```js
...
const secondPerson = {
    ...person
};
person.name = 'bye';

console.log(secondPerson);

// 결과 name: "hi";
```

이건 포인터를 복사한 것이 아니라 새로운 객체를 생성해서 프로퍼티를 복사한 것이기 때문

객체와 배열은 참조형 자료 타입이므로 이 지점을 조심해야함!!!

---
## Array Function

map()함수는 예전값을 새 값으로 반환함 

```js
const nubmers = [1, 2, 3];

const doubleNumArray = numbers.map((num) =>
    return num * 2;
);

console.log(numbers);
console.log(doubleNumArray);
```

이건 Next JS는 아니고 일반적인 JS

