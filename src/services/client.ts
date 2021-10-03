import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import CONFIGS from '@src/constants/configs';
import { URL_BASE } from './urls';

const link = new HttpLink({
  uri: `${URL_BASE}graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(CONFIGS.TOKEN_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  uri: `${URL_BASE}graphql`,
  defaultOptions: {
    query: { fetchPolicy: 'no-cache' },
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
