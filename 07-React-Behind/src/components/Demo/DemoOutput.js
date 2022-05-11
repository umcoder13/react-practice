import React from 'react';

const DemoOutput = (props) => {
    console.log('데모 실행중');
    return <p>{props.show ? '짜잔!' : ''}</p>;
};

export default React.memo(DemoOutput);