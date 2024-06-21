import { client } from "./app";
import * as Application from "@nativescript/core/application";
import * as AppSettings from "@nativescript/core/application-settings";
import { sports, users, TEAMS, user } from "./components/GQL";
import * as HttpModule from '@nativescript/core/http'
import Methods from "./Methods";
import { allowSleepAgain, keepAwake } from './utils/keep-alive';
import { hasCameraPermissions, requestCameraPermissions } from 'nativescript-advanced-permissions/camera';
import { hasFilePermissions, requestFilePermissions } from 'nativescript-advanced-permissions/files';
import { Client, Stanza } from "nativescript-xmpp-client";
import * as JID from 'nativescript-xmpp-client/lib/deps/@xmpp/jid/lib/JID.js';
import xml2js from 'nativescript-xml2js';
import gql from "graphql-tag";
import { BaseService } from "./services/Base.xmpp";
import { XmppClients } from "./services/Clients.xmpp";
import strings from "./utils/strings";
import { ThreadService } from "./services/Thread.xmpp";
import { MessageService } from './services/Message.xmpp';

const hasUserId = AppSettings.getString('user_id', null);
const serverId = () => {
  client.query({
    query: gql`
            query serverId{
                serverId
            }
        `
  }).then(({ data }) => {
    if (data.serverId) {
      AppSettings.setString('server_id', data.serverId);
      setRequestListeners(data.serverId);
    }
  }).catch((e) => {
    console.log(e)
    setTimeout(() => {
      serverId();
    }, 2000)
  })
}

const events = () => {
  Application.on(Application.launchEvent, (args: Application.ApplicationEventData) => {
    serverId();
    keepAwake().then(() => {
      console.log("Insomnia is active");
    }).catch((e) => {
      console.log(e)
    })
    const user_id = AppSettings.getString('user_id', '5c5bff18187b513744173553');

    setUpDefPerms();

    client.query({
      query: sports
    }).then(({ data }) => {
      if (data.sports) {
        AppSettings.setString('sports', JSON.stringify(data.sports));
      }
    }).catch((_err) => {
      console.log(_err, 'HERE -Sport')
    })

    client.query({
      query: users
    }).then(({ data }) => {
      if (data.users) {
        console.log('Users', data.users.length)
        AppSettings.setString('users', JSON.stringify(data.users));
      }
    }).catch((_err) => {
      console.log(_err, 'HERE - users')
    })

    client.query({
      query: TEAMS
    }).then(({ data }) => {
      if (data.teams) {
        AppSettings.setString('teams', JSON.stringify(data.teams));
      }
    }).catch((_err) => {
      console.log(_err, 'HERE - teams')
    })

    client.query({
      query: user,
      variables: {
        _id: "5c5bff18187b513744173553"
      }
    }).then(({ data }) => {
      if (data.user) {
        AppSettings.setString('user_id', data.user._id);
        Methods.setData('yoo', data.user)
      }
    }).catch((_err) => {
      console.log(_err, 'HERE - gql user')
    })
    if (args.android) {
      // Application.AndroidApplication.
    } else if (args.ios) {
      console.log('will fetch for iOS')
      // UIViewController
    }
  });

  Application.on(Application.exitEvent, () => {
    allowSleepAgain().then(function () {
      console.log("Insomnia is inactive, good night!");
    })
  })
}

const setUpDefPerms = () => {
  const files = () => {
    if (!hasFilePermissions()) {
      requestFilePermissions().then((hasPermission) => {
        if (hasPermission) {
          AppSettings.setBoolean('withFiles', true);
          Methods.loadMedia();
        } else {
          AppSettings.setBoolean('withFiles', false)
        }
      });
    } else {
      Methods.loadMedia();
    }
  }
  if (!hasCameraPermissions()) {
    requestCameraPermissions().then((hasPermission) => {
      if (hasPermission) {
        AppSettings.setBoolean('withCamera', true)
      } else {
        AppSettings.setBoolean('withCamera', false)
      }
      files();
    }).catch(() => {
      files();
    });
  } else {
    files()
  }
}

export const Services: { [x: string]: BaseService } = {}

export const setRequestListeners = (_server_id: string) => {
  const user = AppSettings.getString('you', '{}');
  const _user = JSON.parse(user);
  if (!_user._id) {
    setTimeout(() => {
      setRequestListeners(_server_id);
    }, 2000)
    return;
  }
  const addr = new JID(_user._id, `supotsu.com`, `app`);

  const _xmpp = new Client({
    websocket: { url: 'ws://supotsu.com:5280/xmpp-websocket' },
    jid: addr,
    password: _user._id
  });

  _xmpp.on('online', function (data) {
    if (!_server_id) {

    } else {
      const _iq = new Stanza('message', {
        from: data.jid,
        to: _server_id,
        type: 'update_id'
      });

      _iq.children = [
        new Stanza('body', {
          key: _user._id,
          id: `${data.jid.user}@supotsu.com/app`
        })
      ]

      AppSettings.setString('jid', String(data.jid.user));

      _xmpp.send(_iq);

      const stanza = new Stanza('message', {
        from: data.jid,
        to: _server_id,
        type: 'data'
      });

      stanza.children = [
        new Stanza('body', {
          func: 'xmppClients',
          action: 'Query',
          params: "{}"
        })
      ];

      _xmpp.send(stanza);

      Services[strings.XMPP_CLIENTS] = new XmppClients(_xmpp);
      Services[strings.XMPP_THREAD] = new ThreadService(_xmpp);
      Services[strings.XMPP_MESSAGE] = new MessageService(_xmpp);
    }
  });

  _xmpp.on('stanza', function (stanza) {
    var parser = new xml2js.Parser();
    parser.parseString(stanza.root().toString(), function (err, result) {
      const res = JSON.parse(result.message.body[0]);
      const { action, data } = res;
      if (Services[action]) {
        console.log(`XMPP:EVT:[${action}]: received ${data}`)
        Services[action].callback(data);
      }
    })
  });

  _xmpp.on('error', function (error) {
    console.log('client2', error)
  });
}

export async function FCMSender(content: string = ""): Promise<any> {
  const FCM_API = "https://fcm.googleapis.com/fcm/send";
  var serverKey = 'AAAASHh0I3U:APA91bFmVuz8zCyDFAH2HGrAOj8ZQlDJT-WOZzCJ3pQH7-lQNyfA6WhhPu8IwSvLq33FWYeA3xVN4h5ARWrG0rrudoK_lAwAqXvk9q1H7y6Nmj9gOxGTKZLcOXSm5DVKSy_sjeILjqUV'; //put your server key here
  const response = await HttpModule.request({
    url: FCM_API,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${serverKey}`
    },
    content
  });
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(response.content.toString());
  }
  return response.content.toJSON();
}

export default events;
