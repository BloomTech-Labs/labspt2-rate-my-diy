import React from 'react';
import ReactDOM from 'react-dom';
import './styles/_globals.scss';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { FirebaseContext, Firebase } from './components/Firebase/Exports';

const client = new ApolloClient({
  uri: 'https://strawberry-surprise-32108.herokuapp.com/'
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
