import "regenerator-runtime/runtime.js";
import * as React from "react";
import { registerElement } from "react-nativescript";

/* Controls react-nativescript log verbosity. true: all logs; false: only error logs. */
Object.defineProperty(global, '__DEV__', { value: false });

// @ts-ignore
global.process = global.process || {
  env: {}
}

import * as ReactNativeScript from "react-nativescript";
import AppAuth from "./components/Root";
import { NativeScriptProps, StackLayoutAttributes } from "react-nativescript";
import * as app from '@nativescript/core/application';
import { ImageCacheIt } from 'nativescript-image-cache-it';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from "subscriptions-transport-ws";

import { Video } from 'nativescript-videoplayer';
// @ts-ignore
import type { PreviousNextView, TextViewWithHint } from 'nativescript-iqkeyboardmanager';

import { TouchGestureEventData } from '@nativescript/core/ui/gestures';
import { View } from '@nativescript/core/ui/page';
import * as firebase from "nativescript-plugin-firebase";
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import events from "./registerElements";
import { split } from "apollo-link";
interface VideoAttributes extends StackLayoutAttributes {
  src: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
  fill?: boolean
  observeCurrentTime?: boolean
}

declare global {
  module JSX {
    interface IntrinsicElements {
      videoPlayer: NativeScriptProps<VideoAttributes, Video>,
      previousNextView: NativeScriptProps<any, PreviousNextView>,
      textViewWithHint: NativeScriptProps<any, TextViewWithHint>
    }
  }
}

registerElement('videoPlayer', () => require('nativescript-videoplayer').Video);

registerElement('textViewWithHint', () => require('nativescript-iqkeyboardmanager').TextViewWithHint);

registerElement('previousNextView', () => require('nativescript-iqkeyboardmanager').PreviousNextView)

declare var GMSServices: any;

if (app.ios) {
  GMSServices.provideAPIKey("AIzaSyDw-FqQ2ofF0h0agQG-YWR5Y1iifocMvwI");
}

export function onTouch(args: TouchGestureEventData) {
  const label = args.object as View;
  switch (args.action) {
    case 'up':
      label.deletePseudoClass("pressed");
      break;
    case 'down':
      label.addPseudoClass("pressed");
      setTimeout(() => {
        // label.deletePseudoClass("pressed");
      }, 3000)
      break;
    case 'move':
      setTimeout(() => {
        label.deletePseudoClass("pressed");
      }, 250)
      break;
  }
}

ImageCacheIt.enableAutoMM();

// Create a WebSocket link:
const wsUri = `wss://supotsu.com/graphql`;

const wsClient = new SubscriptionClient(wsUri, {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  },
});

const httpLink = createUploadLink({
  uri: 'https://supotsu.com/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  fetch
});

const wsLink = new WebSocketLink(wsClient);

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache({
  addTypename: true,
  dataIdFromObject: (object) => object.id,
  resultCaching: true
}); // .restore({});

export const client: ApolloClient<any> = new ApolloClient<any>({
  cache,
  link,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  },
});

export const getRoot = () => {
  const rootView = app.getRootView();
  return rootView;
}

events();

interface NavigationData {
  goBack?(): void
  navigate?(route: string, params?: Record<string, any>): void
}

export interface ScreenProps {
  onBack?(): void,
  navigation: NavigationData
}

ReactNativeScript.start(React.createElement(AppAuth, {
  client
}, null));

