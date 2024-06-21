import { Client, Stanza } from "nativescript-xmpp-client";

export class BaseService {
  xmpp: typeof Client;
  Stanza: typeof Stanza;
  constructor(xmpp){
    this.xmpp = xmpp;
    this.Stanza = Stanza;
  }
  callback(data?: any) { }
  send() { }
}
