import { Route, Switch } from "wouter";
import Home from "./pages/home";
import Privacidade from "./pages/privacidade";
import Termos from "./pages/termos";
import "./index.css";

function App() {
  return (
    <Switch>
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/termos" component={Termos} />
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
