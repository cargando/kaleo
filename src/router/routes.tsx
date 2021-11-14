import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import Index from 'pages/main';
import * as URLs from './url';

const AboutPage = lazy(() => import('../pages/about'));

const NoMatch = lazy(() => import('../pages/404')); // import LoadingPage from './components/spinner/loading_page';

export default (
  <Switch>
    <Route exact path={URLs.HOME} component={Index} />
    <Route exact path={URLs.ABOUT} component={AboutPage} />

    <Route component={NoMatch} />
  </Switch>
);
