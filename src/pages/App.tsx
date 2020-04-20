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
import { HashRouter as Router } from "react-router-dom";

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
  <Router>
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
