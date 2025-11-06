import { hydrate, LocationProvider, Route, Router } from "preact-iso";

import { About } from "./About.tsx";
import { HireMe } from "./HireMe.tsx";
import { LoremIpsum } from "./LoremIpsum.tsx";
import { NotFound } from "./404.tsx";
import { Home } from "./Home.tsx";
import { FlatTableWithColumnManagement } from "./flat-table-with-column-management.tsx";
import { GroupTable } from "./group-table.tsx";
import { FlatTable } from "./flat-table.tsx";
import Layout from "./layout.tsx";

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/flat" component={FlatTable} />
          <Route
            path="/flat-with-column-management"
            component={FlatTableWithColumnManagement}
          />
          <Route path="/groupable" component={GroupTable} />
          <Route path="/lorem-ipsum" component={LoremIpsum} />
          <Route path="/hire" component={HireMe} />
          <Route default component={NotFound} />
        </Router>
      </Layout>
    </LocationProvider>
  );
}

if (typeof document !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}
