import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  useDidShow(() => {
    console.log('App didShow');
  });

  useDidHide(() => {
    console.log('App didHide');
  });

  return props.children;
}

export default App;
