import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from 'components/ErrorBoundary';
import { createStore } from './store';
import theRoutes from './router/routes';
import App from './App';

import './assets/styles/index.scss';

declare global {
  interface Window {
    axiosAPI?: any;
  }
}

const routing = new RouterStore();
const appHistory = syncHistoryWithStore(createBrowserHistory(), routing);

const store = createStore(routing);

ReactDOM.render(
  <React.StrictMode>
    <Provider {...store}>
      <Router history={appHistory}>
        <ErrorBoundary>
          <App>{theRoutes}</App>
        </ErrorBoundary>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
