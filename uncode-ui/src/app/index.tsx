import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';
import { listen } from '@tauri-apps/api/event';

import { HomePage } from './pages/HomePage/Loadable';
import { DesignPage } from './pages/DesignPage/Loadable';
import { CodePage } from './pages/CodePage';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import TauriShortcuts from '../tauri-shortcuts';
import { StoryPage } from './pages/StoryPage/Loadable';
import UncodeBridge from '../uncode-bridge';

export function App() {
  TauriShortcuts.init();
  const { i18n } = useTranslation();

  // eslint-disable-next-line
  // const [project, setProject] = useState({});

  listen('bootstrap', (data: any) => {
    let payload = JSON.parse(data.payload);
    UncodeBridge.config = payload;
    // setProject(payload);
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
