import { ApolloProvider } from '@apollo/react-common';
import { PersistentStorage } from 'apollo-cache-persist/types';
import ApolloClient from 'apollo-client';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { client } from '../app';

// import React, {
//   useEffect,
//   useState,
//   useContext,
//   FC,
//   createContext,
//   useCallback,
//   useRef
// } from 'react';
// import {
//   ApolloClient,
//   ApolloLink,
//   ApolloProvider,
//   createHttpLink,
//   split,
//   from,
//   NormalizedCacheObject,
//   ServerError,
//   ServerParseError
// } from '@apollo/client';
// import { enableFlipperApolloDevtools } from 'react-native-flipper-apollo-devtools';
// import { RetryLink } from '@apollo/client/link/retry';
// import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
// import { setContext } from '@apollo/client/link/context';
// import { onError } from '@apollo/client/link/error';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { GraphQLError } from 'graphql';
// import { v4 as uuidv4 } from 'uuid';
// import { getMainDefinition } from '@apollo/client/utilities';
import * as AppSettings from '@nativescript/core/application-settings';


export class AsyncStorageWrapper implements PersistentStorage<string> {
  // Actual type definition: https://github.com/react-native-async-storage/async-storage/blob/master/types/index.d.ts
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): string | Promise<string | null> | null {
    return AppSettings.getString(key);
  }

  removeItem(key: string): void | Promise<void> {
    return AppSettings.remove(key);
  }

  setItem(key: string, value: string): void | Promise<void> {
    return AppSettings.setString(key, value);
  }


}

interface SupotsuApolloContextValue {
  client: ApolloClient<any>
}

const SupotsuApolloContext = createContext({} as SupotsuApolloContextValue);

export const SupotsuApolloProvider = ({
  children
}: {
  children: ReactNode
}) => {
  useEffect(() => {
    console.log('SupotsuApolloContext: running')
  }, [])
  return (
    <SupotsuApolloContext.Provider value={{
      client
    }}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </SupotsuApolloContext.Provider>
  )
}

export const useSupotsuApolloContext = () => {
  const context = useContext(SupotsuApolloContext);
  return context;
}
