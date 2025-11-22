import { hydrate, LocationProvider, Route, Router } from "preact-iso";
import { HireMe } from "./HireMe.tsx";
import { LoremIpsum } from "./LoremIpsum.tsx";
import { NotFound } from "./404.tsx";
import { Home } from "./Home.tsx";
import { CoreTable } from "./core.tsx";
import { FlatTable } from "./flattable.tsx";
import { EditableTable } from "./editable.tsx";
import { GroupedTable } from "./grouping.tsx";
import { KanbanTable } from "./kanban.tsx";

import Layout from "./layout.tsx";

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/core" component={CoreTable} />
          <Route path="/flat" component={FlatTable} />
          <Route path="/editable" component={EditableTable} />
          <Route path="/groupable" component={GroupedTable} />
          <Route path="/kanban" component={KanbanTable} />
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
