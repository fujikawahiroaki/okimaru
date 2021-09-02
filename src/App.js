import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Map from './pages/Map';
import Top from './pages/Top';
import "./App.css";
import { theme } from './theme/theme';

export default function App() {
  return (
    <div className="App">
      <Router>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route path="/" exact component={Top} />
            <Route path="/yambarumap/" exact component={Map} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    </div>
  );
}
