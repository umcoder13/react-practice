import React, { useRef, useContext } from "react";

import { TodosContext } from '../store/todos-context';
import classes from './NewTodo.module.css';

const NewTodo: React.FC = () => {

  const todoCtx = useContext(TodosContext);
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const entertedText = todoTextInputRef.current!.value;

    if (entertedText?.trim().length === 0) {
      return;
    }

    todoCtx.addTodo(entertedText);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={todoTextInputRef}/>
      <button>Add Todo</button> 
    </form>
  );
};

export default NewTodo;