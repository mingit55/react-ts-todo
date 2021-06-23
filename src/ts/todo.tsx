import '../scss/fonts.scss';
import '../scss/common.scss';
import '../scss/todo.scss';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import TodoEditor from './todo/TodoEditor';

window.onload = () => {
  ReactDom.render(<TodoEditor />, document.querySelector('#app'));
};
