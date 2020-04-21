import React from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "components";
import { Home, Note, Form } from "pages";
import {
  ProvideThemeContext,
  ProvidSideBarContext,
  ProvideNoteContext,
} from "hooks";
import moment from "moment";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import ReactGA from "react-ga";

const history = createBrowserHistory();

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-164169628-1");
  ReactGA.pageview(window.location.pathname + window.location.search);
  history.listen((location) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });
}

moment.updateLocale("en", {
  relativeTime: {
    s: "1s",
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    y: "1y",
    yy: "%dy",
  },
});

export const App = () => (
  <Router history={history}>
    <ProvideNoteContext>
      <ProvideThemeContext>
        <ProvidSideBarContext>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/create" component={Form} />
              <Route exact path="/:slug/edit" component={Form} />
              <Route exact path="/:slug" component={Note} />
            </Switch>
          </Layout>
        </ProvidSideBarContext>
      </ProvideThemeContext>
    </ProvideNoteContext>
  </Router>
);
