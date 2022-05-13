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
