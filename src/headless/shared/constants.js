import { Strophe } from 'strophe.js/src/strophe';

export const CONNECTION_STATUS = {};
CONNECTION_STATUS[Strophe.Status.ATTACHED] = 'ATTACHED';
CONNECTION_STATUS[Strophe.Status.AUTHENTICATING] = 'AUTHENTICATING';
CONNECTION_STATUS[Strophe.Status.AUTHFAIL] = 'AUTHFAIL';
CONNECTION_STATUS[Strophe.Status.CONNECTED] = 'CONNECTED';
CONNECTION_STATUS[Strophe.Status.CONNECTING] = 'CONNECTING';
CONNECTION_STATUS[Strophe.Status.CONNFAIL] = 'CONNFAIL';
CONNECTION_STATUS[Strophe.Status.DISCONNECTED] = 'DISCONNECTED';
CONNECTION_STATUS[Strophe.Status.DISCONNECTING] = 'DISCONNECTING';
CONNECTION_STATUS[Strophe.Status.ERROR] = 'ERROR';
CONNECTION_STATUS[Strophe.Status.RECONNECTING] = 'RECONNECTING';
CONNECTION_STATUS[Strophe.Status.REDIRECT] = 'REDIRECT';


export const URL_PARSE_OPTIONS = { 'start': /\b(?:([a-z][a-z0-9.+-]*:\/\/)|xmpp:|mailto:|www\.)/gi };
