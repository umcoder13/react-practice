let age: number;

age = 12;

let userName: string;

userName = 'Hi';

let isInstructor: boolean;

isInstructor = true;

// null과 undefined는 더 실용적인 부분에서 다시 설명.

let hobbies: string[];
// 문자열 배열 타입

hobbies = ['hi', 'lol', 'yeah'];

type Person = {
  name: string;
  age: number;
}

let person: Person;

person = {
  name: 'hi',
  age: 532
};

let people: Person[];

let hello: string | number = 'hi';

hello = 213132;

function add(a: number, b: number) {
  return a + b;
}

function printOutput(value: any) {
  console.log(value);
}

function insertAtBetinning<T>(array: T[], value: T) {
  const newArray = [value, ...array];
  return newArray;
}

const demoArray = [1, 2, 3];

const updatedArray = insertAtBetinning(demoArray, -1); // [-1, 1, 2, 3]

const stringArray = insertAtBetinning(['a', 'b', 'c'], 'd');
stringArray[0].split('');
