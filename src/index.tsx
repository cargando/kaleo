import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './assets/styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { MaterialsStore } from './store';

declare global {
  interface Window {
    axiosAPI?: any;
  }
}

const store = { MaterialsStore };

ReactDOM.render(
  <React.StrictMode>
    <Provider {...store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
