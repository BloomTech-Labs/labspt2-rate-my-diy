import React from "react";
import ReactDOM from "react-dom";
import "./styles/_globals.scss";
import App from "./components/app/App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Firebase, { FirebaseContext } from "./components/firebase/index";

const client = new ApolloClient({
  uri: "https://stark-meadow-13883.herokuapp.com/"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
