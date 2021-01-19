import React from 'react';
import './App.css';
import GamePage from '../pages/Game';
import MyGames from '../pages/MyGames';
import Login from '../pages/Login';
import SocketTest from '../pages/SocketTest';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  Redirect,
} from 'react-router-dom';
import {
  AuthenticatedContenxt,
  AuthenticationEnvironment,
  OAuthLanding,
} from '../core/authentication';
import Index from '../pages/Index';

function App() {
  return (
    <div className="App">
      <AuthenticationEnvironment>
        <AuthenticatedContenxt.Consumer>
          {({ user }) => (
            <Router>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/game/:gameId">
                  {!user && <Redirect to="/login" />}
                  <GamePage />
                </Route>
                <Route path="/socket/:gameId" component={SocketTest} />
                <Route exact path="/">
                  <Index />
                </Route>
                <Route exact path="/games">
                  {!user && <Redirect to="/login" />}
                  <MyGames />
                </Route>
                <Route exact path="/game">
                  <Redirect to="/game/16" />
                </Route>
                <Route path="/oauth/callback">
                  <OAuthLanding />
                </Route>
              </Switch>
            </Router>
          )}
        </AuthenticatedContenxt.Consumer>
      </AuthenticationEnvironment>
    </div>
  );
}

export default App;
