import { hydrate, LocationProvider, Route, Router } from "preact-iso";

import { NotFound } from "./404.tsx";
import { Home } from "./Home.tsx";
import { BasicTable } from "./basic-table.tsx";
import Layout from "./layout.tsx";

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={BasicTable} />
          <Route default component={NotFound} />
        </Router>
      </Layout>
    </LocationProvider>
  );
}

if (typeof document !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}
