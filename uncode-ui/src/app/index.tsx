import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { DesignPage } from './pages/DesignPage/Loadable';
import { CodePage } from './pages/CodePage';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import TauriShortcuts from '../tauri-shortcuts';
import { StoryPage } from './pages/StoryPage/Loadable';
import { emit, listen } from '@tauri-apps/api/event';
import { useState } from 'react';
import TauriBridge from '../tauri-bridge';

export function App() {
  TauriShortcuts.init();
  const { i18n } = useTranslation();

  // eslint-disable-next-line
  const [project, setProject] = useState({});
  emit('get_config').then((data: any) => {
    console.log(data);
  });

  listen('bootstrap', (data: any) => {
    let payload = JSON.parse(data.payload);
    TauriBridge.uncode_config = payload;
    setProject(payload);
  });

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/story" component={StoryPage} />
        <Route path="/design" component={DesignPage} />
        {/*<Route path="/design/arch" component={DesignPage} />*/}
        {/*<Route path="/design/ui" component={DesignPage} />*/}
        <Route path="/code" component={CodePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
