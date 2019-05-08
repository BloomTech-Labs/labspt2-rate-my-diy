import React from 'react';
import ReactDOM from 'react-dom';
import './styles/_globals.scss';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { FirebaseContext, Firebase } from './components/Firebase/Exports';
import { BrowserRouter as Router } from 'react-router-dom';


const client = new ApolloClient({
  uri: 'https://mighty-anchorage-40936.herokuapp.com/',
  resolvers: {},
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <FirebaseContext.Provider value={new Firebase()}>
      <Router>
        <App />
      </Router>
    </FirebaseContext.Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
