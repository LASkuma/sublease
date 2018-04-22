import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import VueApollo from 'vue-apollo';

import users from './api/users';

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
});

const withToken = setContext(async () => {
  let token;
  try {
    token = await users.authenticate();
  } catch (err) {
    token = null;
  }

  return {
    headers: {
      Authorization: token,
    },
  };
});

const apolloClient = new ApolloClient({
  link: withToken.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;
