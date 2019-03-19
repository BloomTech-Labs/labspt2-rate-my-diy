import React from "react";
import ReactDOM from "react-dom";
import "./styles/_globals.scss";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Firebase, FirebaseContext } from "./components/firebase/index";
import { BrowserRouter as Router } from "react-router-dom";

const client = new ApolloClient({
  // uri: 'https://labspt-diy-1bdc9280b0.herokuapp.com/labspt2-diy/dev',
  uri: "https://guarded-beach-26773.herokuapp.com/"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <FirebaseContext.Provider value={new Firebase()}>
      <Router>
        <App />
      </Router>
    </FirebaseContext.Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
