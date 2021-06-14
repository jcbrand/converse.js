# Changelog

## 8.0.0 (Unreleased)

- #1083: Add support for XEP-0393 Message Styling
- #2275: Allow punctuation to immediately precede a mention
- #2348: `auto_join_room` not showing the room in `fullscreen` `view_mode`.
- #2400: Fixes infinite loop bug when appending .png to allowed image urls
- #2409: Integrate App Badging API for unread messages
- #2464: New configuration setting [allow-url-history-change](https://conversejs.org/docs/html/configuration.html#allow-url-history-change)
- #2497: Bugfix /nick command is not working
- Add support for XEP-0437 Room Activity Indicators see [muc-subscribe-to-rai](https://conversejs.org/docs/html/configuration.html#muc-subscribe-to-rai)
- Bugfix: Use real JID in XEP-0372 references only when the MUC is non-anonymous
- Bugfix: Connection protocol not updated based on XEP-0156 connection methods
- Bugfix: `null` inserted by emoji picker and can't switch between skintones
- New hook: [getMessageActionButtons](https://conversejs.org/docs/html/api/-_converse.html#event:getMessageActionButtons)
- New hook: [shouldNotifyOfGroupMessage](https://conversejs.org/docs/html/api/-_converse.html#event:shouldNotifyOfGroupMessage)
- New hook: [presenceConstructed](https://conversejs.org/docs/html/api/-_converse.html#event:presenceConstructed)
- File structure reordering: All plugins are now in `./plugins` folders.
- New configuration setting: [show_tab_notifications](https://conversejs.org/docs/html/configuration.html#show-tab-notifications)
- New configuration setting: [muc_clear_messages_on_leave](https://conversejs.org/docs/html/configuration.html#muc-clear-messages-on-leave)
- New configuration setting: [send_chat_markers](https://conversejs.org/docs/html/configuration.html#send-chat-markers)
- New configuration setting: [muc_show_ogp_unfurls](https://conversejs.org/docs/html/configuration.html#muc-show-ogp-unfurls)
- #1823: New config options [mam_request_all_pages](https://conversejs.org/docs/html/configuration.html#mam-request-all-pages)
- Use the MUC stanza id when sending XEP-0333 markers
- Add support for rendering unfurls via [mod_ogp](https://modules.prosody.im/mod_ogp.html)
- Add a Description Of A Project (DOAP) file
- Add ability to deregister nickname when closing a MUC by setting `auto_register_muc_nickname` to `'unregister'`.

### Breaking Changes

The [afterMessageBodyTransformed](https://conversejs.org/docs/html/api/-_converse.html#event:afterMessageBodyTransformed) and [beforeMessageBodyTransformed](https://conversejs.org/docs/html/api/-_converse.html#event:beforeMessageBodyTransformed) events now has a different signatures.
When leaving a MUC, the message history is deleted. This means that decrypted
OMEMO messages are gone and cannot be recovered on that device. See [muc_clear_messages_on_leave](https://conversejs.org/docs/html/configuration.html#muc-clear-messages-on-leave).

Removed events:
* `chatBoxInsertedIntoDOM`
* `bookmarkViewsInitialized`
* `rosterGroupsFetched`
* `messageSend` (use `sendMessage` instead)

The `chatBoxClosed`, `chatBoxMaximized` and `chatBoxMinimized` events now have the `model` as
payload and not the `view`.

## 7.0.6 (2021-06-11)

- #2500: Wrong assignment in OMEMO code

## 7.0.5 (2021-03-16)

- #2377: The @converse/headless NPM package is missing the dist directory, causing import errors
- #2396: @converse/headless wrongly depends on `CustomElement` from the view layer
- #2381: Converse does not reflect the browser language

## 7.0.4 (2020-12-09)

Bugfix: Set protocol after discovering connection methods

Otherwise if an endpoint was passed in with `converse.initialize`, then
that endpoint's protocol is (potentially wrongly) used.

## 7.0.3 (2020-12-02)

- Bugfix: `null` inserted by emoji picker and can't switch between skintones


## 7.0.2 (2020-11-23)

- Updated translations: de, nb, gl, tr
- Still more necessary files not included in the 7.0.1 NPM package, causing `Module not found` errors.
- #2337: Newly opened headline chat isn't hidden by default

## 7.0.1 (2020-11-19)

- Updated translations: de, es, fi, fr, gl, hu, nb_NO, oc, pl, pt, pt_BR, ru, tr, uk, zh
- #2328: Honor `use_system_emojis` in emoji-picker
- Not all template/*.js files were included in the 7.0.0 NPM package, causing:
  `Module not found: Error: Can't resolve 'templates/*.js'`

## 7.0.0 (2020-11-18)

*Note for plugin authors:*
configuration settings should now be accessed via `_converse.api.settings.get` and not directly on the `_converse` object.
Soon we'll deprecate the latter, so prepare now.

- #515 Add support for XEP-0050 Ad-Hoc commands
- #2231: add sort_by_query and remove sort_by_length
- #1313: Stylistic improvements to the send button
- #1481: MUC OMEMO: Error No record for device
- #1490: Busy-loop when fetching registration form fails
- #1535: Add option to destroy a MUC
- #1715: Update chat state notification after receiving a message correction.
- #1793: Send button doesn't appear in Firefox in 1:1 chats
- #1820: Set focus on jid field after controlbox is loaded
- #1822: Don't log error if user has no bookmarks
- #1823: New config options [muc_roomid_policy](https://conversejs.org/docs/html/configuration.html#muc-roomid-policy)
    and [muc_roomid_policy_hint](https://conversejs.org/docs/html/configuration.html#muc-roomid-policy-hint)
- #1826: A user can now add himself as a contact
- #1839: Headline messages are shown in controlbox
- #1924: Configuring an ejabberd room fails
- #1896: Don't send receipts for messages fetched from the archive
- #1937: Editing a message removes the mentions highlight
- #1963: Mentions are visually incorrect when used in message replies
- #1999: Demarcate first unread message
- #2002: fix rendering of `muc_roomid_policy_hint`
- #2006: fix rendering of emojis in case `use_system_emojis == false`
- #2028: Implement XEP-0333 `displayed` chat marker
- #2101: Improve contrast of text in control box
- #2187: Avoid merging initial settings with themselves every time settings are extended.
- #2199: Fix BOSH session restore.
- #2201: added html to converse.env
- #2213: added CustomElement to converse.env
- #2220: fix rendering of emojis in case `use_system_emojis == false` (again).
- #2092: fixes room list update loop when having the `locked_muc_domain` truthy or `'hidden'`
- #2259: Rename configuration setting `muc_show_join_leave` to `muc_show_info_messages`. Now accepts a list of events to show instead of a boolean.
- #2285: Rename config option `muc_hats_from_vcard` to [muc_hats](https://conversejs.org/docs/html/configuration.html#muc-hats). Now accepts a list instead of a boolean and allows for more flexible choices regarding user badges.
- #2300: Fix message reorder issue after message correction.
- #2304: Custom emojis (stickers) images not shown
- #2307: BootstrapModal is not accessible to plugins
- #2308: Allow getHats method to be overriden in the `overrides` object in plugins.
- #2321: When Converse runs inside a browser extension, enable browser sync and local storage for persistent storage
- #1250: Change favicon color when unread messages
- Updated translations: de, es, fi, fr, gl, hu, nb_NO, oc, pl, pt, pt_BR, ru, tr, uk, zh
- The `trusted` configuration setting has been removed in favor of two new settings:
    [allow_user_trust_override](https://conversejs.org/docs/html/configuration.html#allow-user-trust-override)
    [clear_cache_on_logout](https://conversejs.org/docs/html/configuration.html#clear-cache-on-logout)
- The `persistent_store` setting can now also be set to `sessionStorage`
- The `api.archive.query` method no longer accepts an RSM instance as argument.
- The plugin `converse-uniview` has been removed and its functionality merged into `converse-chatboxviews`
- Removed the mockups from the project. Recommended to use tests instead.
- The API method `api.settings.update` has been deprecated in favor of `api.settings.extend`.
- The API methods under the `api.user.status` namespace are now asynchronous and need to be `await`ed.
- Filter roster contacts via all available information (JID, nickname and VCard full name).
- Allow ignoring of bootstrap modules at build using environment variable. For xample: `export BOOTSTRAP_IGNORE_MODULES="Modal,Dropdown" && make dist`
- Bugfix. Handle stanza that clears the MUC subject
- Replace Backbone with [Skeletor](https://github.com/skeletorjs/skeletor)
- Start using [lit-html](https://lit-html.polymer-project.org/) instead of lodash for templating.
- [muc_fetch_members](https://conversejs.org/docs/html/configuration.html#muc-fetch-members) now also accepts an array of affiliations to fetch.
- Remove the configuration setting `muc_show_join_leave_status`. The optional status message is no longer shown at all.
- Support for XEP-0156 is now enabled by default (which means that
  [discover_connection_methods](https://conversejs.org/docs/html/configuration.html#discover-connection-methods) now has a default value of `true`).
- [show_send_button](https://conversejs.org/docs/html/configuration.html#show-send-button) now has a default value of `true`.
- The [api.confirm](https://conversejs.org/docs/html/api/-_converse.api.html#.confirm) method now accepts a list of fields and returns the filled in list upon confirmation.
- New config option [allow_adhoc_commands](https://conversejs.org/docs/html/configuration.html#allow-adhoc-commands)
- New config option [modtools_disable_assign](https://conversejs.org/docs/html/configuration.html#modtools-disable-assign)
- New config option [modtools_disable_query](https://conversejs.org/docs/html/configuration.html#modtools-disable-query)
- New config option [muc_hats_from_vcard](https://conversejs.org/docs/html/configuration.html#muc-hats-from-vcard).
- New config option [muc_send_probes](https://conversejs.org/docs/html/configuration.html#muc-send-probes).
- New config option [notify_nicknames_without_references](https://conversejs.org/docs/html/configuration.html#notify-nicknames-without-references).
- New config option [show_message_avatar](https://conversejs.org/docs/html/configuration.html#show-message-avatar).
- New public API [converse.insertInto](https://conversejs.org/docs/html/api/converse.html#.insertInto)

## 6.0.0 (2020-01-09)

- [enable_smacks](https://conversejs.org/docs/html/configuration.html#enable-smacks) is not set to `true` by default.
- Refactor some presence and status handling code from `converse-core` into `@converse/headless/converse-status`.
- It's now possible to navigate the emoji-picker via the keyboard arrow keys.

- Add support for [notifications about affiliation change for users not in a room](https://xmpp.org/extensions/xep-0045.html#example-196)
- Add support for [XEP-0424 Message Retraction](http://xmpps.org/extensions/xep-0424.html)
- Add support for [XEP-0425 Message Moderation](http://xmpps.org/extensions/xep-0425.html)

- New API [\_converse.api.headlines](https://conversejs.org/docs/html/api/-_converse.api.headlines.html#.get)
- New config option [allow_message_retraction](https://conversejs.org/docs/html/configuration.html#allow-message-retraction)
- New config option [muc-show-logs-before-join](https://conversejs.org/docs/html/configuration.html#muc-show-logs-before-join)
- New config option [muc_mention_autocomplete_filter](https://conversejs.org/docs/html/configuration.html#muc-mention-autocomplete-filter)
- New config option [muc_mention_autocomplete_show_avatar](https://conversejs.org/docs/html/configuration.html#muc-mention-autocomplete-show-avatar)
- New config option [persistent_store](https://conversejs.org/docs/html/configuration.html#persistent-store)

- Initial support for sending custom emojis. Currently only between Converse
  instances. Still working out a wire protocol for compatibility with other clients.
  To add custom emojis, edit the `emojis.json` file.

- #129: Add support for [XEP-0156: Disovering Alternative XMPP Connection Methods](https://xmpp.org/extensions/xep-0156.html). Only XML is supported for now.
- #1105: Support for storing persistent data in IndexedDB
- #1253: Show contacts with unread messages at the top of the roster
- #1322 Display occupants’ avatars in the occupants list
- #1640: Add the ability to resize the occupants sidebar in MUCs
- #1666: Allow scrolling of the OMEMO fingerprints list
- #1691: Fix `collection.chatbox is undefined` errors
- #1767: `credentials_url` is not called when logging out and then in again
- #1764: Incorrect URI encoding in "mention" references
- #1772: `_converse.api.contact.add(jid, nick)` fails, says not a function
- #1791: `auto_focus` set to `false` is ignored when switching back to a MUC
- #1792: Fix: modals don't have scrollbars
- #1796: Don't show "back" arrow navigation (on mobile) in the chat header when in `singleton` mode
- #1821: Errors caused by malformed URLs are now handled
- #1819: Click on a desktop notification now opens corresponding chat.
- #1836: MUC invites appear to come from the MUC name

### Breaking changes

- The ``debug`` configuration option has been replaced with [loglevel](https://conversejs.org/docs/html/configuration.html#loglevel).

- In contrast to sessionStorage and localStorage, IndexedDB is an asynchronous database.
  A lot of code that relied on database access to be synchronous had to be
  updated to work with asynchronous access via promises.

- In order to add support for XEP-0156, the XMPP connection needs to be created
  only once we know the JID of the user that's logging in. This means that the
  [connectionInitialized](https://conversejs.org/docs/html/api/-_converse.html#event:connectionInitialized)
  event now fires much later than before. Plugins that rely on `connectionInitialized`
  being triggered before the user's JID has been provided will need to be updated.

- The following API methods now return promises:
  * `_converse.api.chats.get`
  * `_converse.api.chats.create`
  * `_converse.api.rooms.get`
  * `_converse.api.rooms.create`
  * `_converse.api.roomviews.close`

- Changes the events:
  * The `chatBoxInitialized` event now triggers when a `_converse.ChatBox` (not the view) is opened.
  * Renamed the old `chatBoxInitialized` to `chatBoxViewInitialized` and trigger only for `ChatBoxView` instances.
  * Renamed `chatRoomOpened` event to `chatRoomViewInitialized`
  * The order of certain events have now changed: `statusInitialized` is now triggered after `initialized` and `connected` and `reconnected`.

- `_converse.api.chats.get()` now only returns one-on-one chats, not the control box or headline notifications.
- The `show_only_online_users` setting has been removed.
- `_converse.api.alert.show` is now `_converse.api.show` and instead of taking
  an integer for the `type`, "info", "warn" or "error" should be passed in.
- The `converse-headline` plugin has been split up into `converse-headlines` and `converse-headlines-view`.

## 5.0.5 (2019-11-20)

- Prevent editing of sent file uploads.
- #1089: When filtering the roster for `online` users, show all non-offline users.
- #1733: New message notifications for a minimized chat stack on top of each other
- #1757: Chats are hidden behind the controlbox on mobile
- #1760: Private messages no longer received after websocket reconnect

## 5.0.4 (2019-10-08)

- New config option [allow_message_corrections](https://conversejs.org/docs/html/configuration.html#allow-message-corrections)
  which, if set to `last`, limits editing of sent messages to the last message sent.
- Bugfix: Don't treat every duplicate message ID as a message correction; since some clients don't use globally unique ID's this causes false positives.
- Bugfix: process stanzas from mam one-by-one in order to correctly process message receipts
- #1712: `TypeError: plugin._features is not a function`
- #1714: Don't notify the user in case we're receiving a message delivery receipt only
- #1739: New config option [assets_path](https://conversejs.org/docs/html/configuration.html#assets-path)
  which lets you set the path from which "chunks" are loaded.

## 5.0.3 (2019-09-13)

- Emit `chatBoxFocused` and `chatBoxBlurred` events for emoji picker input
- SECURITY FIX: Reject unencapsulated forwarded messages, since we don't support XEP-0297 on its own

## 5.0.2 (2019-09-11)

- `po` translations files are now loaded via Webpack. As a result the `locales_url`
  config option is now removed given that the path to the locale JSON files is now
  determined by the webpack config and can't be changed at runtime.
- The JSON representing emojis is now fetched asynchronously as a separate file `converse.emojis.js`.
- Webpack is now configured with a `publicPath` set to `/dist/`. This is necessary
  so that chunks (such as the emojis and locales JSON files) can be fetched asynchronously.
  This means that all your assets need to be served at `/dist`. If you need to set a
  different path, you'll need to set `publicPath` in `webpack.config.js` to
  your preferred path and then rebuild all assets (e.g. `make dist`).
- Use `listenTo` to avoid memory leaks when views get removed.
- SECURITY FIX: Ignore MAM `chat` messages not sent from yourself
- #1692 Bugfix: `TypeError: oldest_message is undefined`
- #1704: SECURITY FIX: Impersonation by misusage of groupchat carbons
- #1705: Bugfix: `this.roomspanel` is `undefined` after hibernating

## 5.0.1 (2019-08-14)

- Add a new GUI for moderator actions. You can trigger it by entering `/modtools` in a MUC.
- Reconnect if the server doesn't respond to a `ping` within 10 seconds.
- Don't query for MAM MUC messages before the cached messages have been restored (another cause of duplicate messages).
- Show an error message and option to retry when fetching of the MAM archive times out
- Bugfix: `TypeError: o.getAttribute is not a function converse-chatview.js` (can cause messages to not appear).
- #1679: Room invitation fails with singleton and random server assigned room name

## 5.0.0 (2019-08-08)

- BOSH support has been moved to a plugin.
- Support for XEP-0410 to check whether we're still present in a room
- Initial support for the [CredentialsContainer](https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer) web API
- Allow for synchronous events. When a synchronous event is fired, Converse will
  wait for all promises returned by the event's handlers to finish before continuing.
- Properly handle message correction being received before the corrected message
- Groupchat default configuration now supports `list-multi` fields
- Bugfix: Don't set `muc_domain` for roomspanel if `locked_muc_domain` is `true`.
- Bugfix: Modal auto-closes when you open it for a second time.
- Bugfix: `Cannot read property 'parentElement' of null` in shadow DOM
- Take roster nickname into consideration when rendering messages and chat headings.
- Hide the textarea when a user is muted in a groupchat.
- Don't restore a BOSH session without knowing the JID
- In the `/help` menu, only show allowed commands
- Message deduplication bugfixes and improvements
- Continuously retry (in 2s intervals) to fetch login credentials (via [credentials_url](https://conversejs.org/docs/html/configuration.html#credentials-url)) in case of failure
- Replace `moment` with [DayJS](https://github.com/iamkun/dayjs).
- New config option [auto_focus](https://conversejs.org/docs/html/configuration.html#auto-focus)
- New config option [clear_messages_on_reconnection](https://conversejs.org/docs/html/configuration.html#clear-messages-on-reconnection)
- New config option [enable_smacks](https://conversejs.org/docs/html/configuration.html#enable-smacks)
- New config option [message_limit](https://conversejs.org/docs/html/configuration.html#message-limit)
- New config option [muc_fetch_members](https://conversejs.org/docs/html/configuration.html#muc-fetch-members)
- New config option [muc_mention_autocomplete_min_chars](https://conversejs.org/docs/html/configuration.html#muc-mention-autocomplete-min-chars)
- New config option [muc_show_join_leave_status](https://conversejs.org/docs/html/configuration.html#muc-show-join-leave-status)
- New config option [singleton](https://conversejs.org/docs/html/configuration.html#singleton)
  By setting this option to `false` and `view_mode` to `'embedded'`, it's now possible to
  "embed" the full app and not just a single chat. To embed just a single chat, it's now
  necessary to explicitly set `singleton` to `true`.
- Re-add the previously removed config option [keepalive](https://conversejs.org/docs/html/configuration.html#keepalive)
- New event: [chatBoxBlurred](https://conversejs.org/docs/html/api/-_converse.html#event:chatBoxBlurred)
- New event: [chatReconnected](https://conversejs.org/docs/html/api/-_converse.html#event:chatReconnected)
- #316: Add support for XEP-0198 Stream Management
- #1071: x clear cross of same size as text
- #1142: Up/down arrow shouldn't erase current message
- #1196: Use alternative connection method upon connfail
- #1296: `embedded` view mode shows `chatbox-navback` arrow in header
- #1330: Missing room name in MUC invitation popup
- #1445: Participants list uses big font in embedded mode
- #1455: Avatar in controlbox status-view not updated
- #1465: When highlighting a roster contact, they're incorrectly shown as online
- #1476: Support OMEMO on by default for chats via a config variable
- #1494: Trim whitespace around messages
- #1495: Mentions should always include a URI attribute
- #1502: Fatal error when using prebind
- #1524: OMEMO libsignal-protocol.js Invalid signature
- #1532: Converse reloads on enter pressed in the filter box
- #1538: Allow adding self as contact
- #1548: Add support for paging through the MAM results when filling in the blanks
- #1550: Legitimate carbons being blocked due to erroneous forgery check
- #1554: Room auto-configuration broke if the config form contained fields with type `fixed`
- #1558: `this.get` is not a function error when `forward_messages` is set to `true`.
- #1561: Don't call `clear` on local or session storage
- #1572: In `fullscreen` view mode the top is cut off on iOS
- #1575: MUC invitation autocomplete list doesn't appear
- #1576: Converse gets stuck with spinner when logging out with `auto_login` set to `true`
- #1579: Trim spaces at the beginning and end of a JID (when adding contact)
- #1585: Upload files by pasting from clipboard
- #1586: Not possible to kick someone with a space in their nickname
- #1664: Blacklisting converse-profile makes the control box totally blank

### Breaking changes

- The minimum required NodeJS version for making builds is now 8.9.0
- Rename `muc_disable_moderator_commands` to [muc_disable_slash_commands](https://conversejs.org/docs/html/configuration.html#muc-disable-slash-commands).
- `_converse.api.archive.query` now returns a Promise instead of accepting a callback functions.
- `_converse.api.disco.supports` now returns a Promise which resolves to a Boolean instead of an Array.
- The `forward_messages` config option (which was set to `false` by default) has been removed.
  Use [message_carbons](https://conversejs.org/docs/html/configuration.html#message-carbons) instead.
- Remove the `keepalive` configuration setting. It is now always implicitly `true`.
- Remove the `expose_rid_and_sid` configuration setting.
- A `prebind_url` is now mandatory when setting `authentication` to `prebind`.
  It's no longer possible to pass in `rid` and `sid` values to `converse.initialize.
- Removed events `statusChanged` and `statusMessageChanged`. Instead, you can
  listen on the `change:status` or `change:status\_message` events on
  `_converse.xmppstatus`.
- #1403: Rename show_chatstate_notifications to show_chat_state_notifications

### API changes

- `_converse.chats.open` and `_converse.rooms.open` now take a `force`
  parameter to force maximizing (in `overlayed` view mode) or bringing a
  background chat into the foreground (in `fullscreen` view mode). Previously
  this was the default behavior.
- `_converse.api.emit` has been removed in favor of [\_converse.api.trigger](https://conversejs.org/docs/html/api/-_converse.api.html#.trigger)
- `_converse.updateSettings` has been removed in favor of [\_converse.api.settings.update](https://conversejs.org/docs/html/api/-_converse.api.settings.html#.update)
- `_converse.api.roster.get` now returns a promise.
- New API method [\_converse.api.disco.features.get](https://conversejs.org/docs/html/api/-_converse.api.disco.features.html#.get)
- New API method [\_converse.api.connection.reconnect](https://conversejs.org/docs/html/api/-_converse.api.connection.html#.reconnect)

## 4.2.0 (2019-04-04)

**Note:** This release introduces a hard requirement on [MAM:2](https://xmpp.org/extensions/xep-0313.html),
specifically the requirement that the MAM archive ID matches the [XEP-0359 stanza-id](https://xmpp.org/extensions/xep-0359.html).
Patches intended to make Converse work with MAM:1 will cause problems and
unexpected behaviour due to the above requirement, which is not met with MAM:1.
This will affect OpenFire users who use the [monitoring plugin](https://www.igniterealtime.org/projects/openfire/plugin-archive.jsp?plugin=monitoring)
version 1.7.0 and below. You're advised to stay on Converse version 4.1.2 until an update to that plugin has been released.

- Updated translation: af, cz, de, es, gl, he, lt, nl, nl_BE, ru
- Upgrade to Backbone 1.4.0, Strophe 1.3.2 and Jasmine 2.99.2
- Remove dependency on (our fork of) Awesomplete
- Prevent user from adding themselves as contact
- Fix "flashing" of roster filter when you have less than 5 roster contacts
- Fix handling of CAPTCHAs offered by ejabberd
- Don't send out receipts or markers for MAM messages
- Allow setting of debug mode via URL with `/#converse?debug=true`
- Render inline images served over HTTP if Converse itself was loaded on an unsecured (HTTP) page.
- Make sure `nickname` passed in via `_converse.initialize` has first preference as MUC nickname
- Make sure required registration fields have "required" attribute
- New config setting [autocomplete_add_contact](https://conversejs.org/docs/html/configuration.html#autocomplete-add-contact)
- New config setting [locked_muc_domain](https://conversejs.org/docs/html/configuration.html#locked-muc-domain)
- New config setting [locked_muc_nickname](https://conversejs.org/docs/html/configuration.html#locked-muc-nickname)
- New config setting [show_client_info](https://conversejs.org/docs/html/configuration.html#show-client-info)
- Document new API method [sendMessage](https://conversejs.org/docs/html/api/-_converse.ChatBox.html#sendMessage)
- Don't filter out own device when sending an OMEMO message
- #1149: With `xhr_user_search_url`, contact requests are not being sent out
- #1213: Switch roster filter input and icons
- #1327: fix False mentions positives in URLs and Email addresses
- #1352: Add [Jed](https://github.com/messageformat/Jed) as dependency of `@converse/headless`
- #1373: Re-add support for the [muc_domain](https://conversejs.org/docs/html/configuration.html#muc-domain) setting
- #1400: When a chat message is just an emoji, enlarge the emoji
- #1407: Silent errors when trying to use whitespace as MUC nickname
- #1437: List of groupchats in modal doesn't scroll
- #1457: Wrong tooltip shown for "unbookmark" icon
- #1467: Fix rendering of URLs enclosed with sharp brackets such as <https://example.org>
- #1479: Allow file upload by drag & drop also in MUCs
- #1487: New config option [muc_respect_autojoin](https://conversejs.org/docs/html/configuration.html#muc-respect-autojoin)
- #1488: In error message, fall back to JID if name is not available.
- #1501: Don't prompt for a reason if [auto_join_on_invite](https://conversejs.org/docs/html/configuration.html#auto-join-on-invite) is `true`
- #1507: Make message id and origin-id identical in order to fix LMC with Conversations
- #1508: Minimized bookmarked chatboxes should not be always maximized after page reload.
- #1512: Allow manual entry of jid even with [xhr_user_search_url](https://conversejs.org/docs/html/configuration.html#xhr-user-search-url).
         The JID input field is now also visible. To hide it simply hide `.add-xmpp-contact__jid` via CSS.

## 4.1.2 (2019-02-22)

- Updated translations: af, cz, de, es, he, it, nl, nl_BE, pt_BR, zh_CN
- Bugfix. Prevent duplicate messages by comparing MAM archive id to XEP-0359 stanza ids.
- Bugfix. Open groupchats not shown when logging in after disconnection.
- #1406: `TypeError: e.devicelists is undefined` when unchecking the "trusted device" checkbox

## 4.1.1 (2019-02-18)

- Updated translations: af, cz, de, es, eu, ga, he, hi, ja, nb, nl_BE, zh_CN
- New language supported: Esperanto
- Accessibility: Tag the chat-content as an ARIA live region, for screen readers
- Set releases URL to new Github repo
- Rudimentary support for XEP-0333 chat markers
- Better support for XEP-0359 `stanza-id` and `origin-id` elements.
- Bugfix: restore textarea size after sending a message
- Bugfix: MUC invite form not appearing
- #1369 Don't wrongly interpret message with `subject` as a topic change.
- #1405 Status of contacts list are not displayed properly
- #1408 New config option [roomconfig_whitelist](https://conversejs.org/docs/html/configuration.html#roomconfig-whitelist)
- #1410 HTTP upload not working if conversations push proxy is used
- #1412 MUC moderator commands can be disabled selectively by config
- #1413 Fix moderator commands that change affiliation
- #1414 Prevent duplicate messages on MUC join
- #1417 Margin between nickname and badge
- #1421 Fix direct invite for membersonly room
- #1422 Resurrect the `muc_show_join_leave` option
- #1438 Update contact nickname when receiving a roster push
- #1442 MUC read receipts causing empty lines

## 4.1.0 (2019-01-11)

- Bugfix: MUC commands were being ignored
- Bugfix: Multiple rooms shown active in the rooms list
- Bugfix: Don't open chats when receiving messages without a `body`
- Bugfix: Typing in the textarea can become very slow in large MUCs
- UI: Always show the OMEMO lock icon (grayed out if not available).
- Use `publish-options` with `pubsub#access_model` set to `open` when publishing OMEMO public keys and devices
- Add a new `converse-pubsub` plugin, for generic PubSub operations
- #1180 It's now possible to use OMEMO in a MUC (if it's members-only and non-anonymous)
- #1334 Force avatar refetch when receiving `vcard-temp:x:update`
- #1337 `send_chat_state_notifications` doesn't work in MUCs
- #1353 Message Delivery Receipts not working because of the message "type" attribute
- #1356 Make triangle icon usable
- #1374 Can't load embedded chat when changing `view_mode` between page reloads
- #1376 Fixed some alignment issues in the sidebar
- #1378 Message Delivery Receipts were being sent for carbons and own messages
- #1379 MUC unread messages indicator is failing
- #1382 Message Delivery Receipts: Set store hint and type='chat'
- #1388 implement muc-owner command `/destroy`

## 4.0.6 (2018-12-07)

- Updated translations: ar, cs, de, es, eu, fr, gl, hu, id, it, ja, nb, pt_BR
- Don't render http (i.e. non-TLS) resources
- Bugfix: Converse caused `RID out of range` errors on Prosody
- Bugfix: MUC messages sometimes appear twice after resync.
- #1331 Fix missing checkmarks in old muc messages
- #1333 Don't send receipt requests in MUCs
- #1348 Font gets cut off in Firefox #1348

## 4.0.5 (2018-11-15)

- Error `FATAL: TypeError: Cannot read property 'extend' of undefined` when using `embedded` view mode.
- Default paths in converse-notifications.js are now relative
- Add a button to regenerate OMEMO keys
- Add client info modal which shows Converse's version number
- New config setting [theme](https://conversejs.org/docs/html/configuration.html#theme)
- #141 XEP-0184: Message Delivery Receipts
- #1033 Setting show_send_button to true didn't work
- #1188 Feature request: drag and drop file to HTTP Upload
- #1268 Switch from SASS variables to CSS custom properties
- #1278 Replace the default avatar with a SVG version
- #1288 Add CSS classes to differentiate between incoming and outgoing messages
- #1305 added value 'all' for 'show_desktop_notifications' to notifiy even if converse.js is open
- #1306 added option `notification_delay`
- #1312 Error `unrecognized expression` in Safari
- #1316 show version info in login dialog
- #1317 Don't show errors for CSI messages
- #1318 added values 'on' and 'off' for 'trusted' option which removes the "This is a trusted device" checkbox from the login form
- #1319 Implement sending of presences according to XEP-0319: Last User Interaction in Presence

## 4.0.4 (2018-10-29)

- Use [Lerna](https://lernajs.io/) to create the @converse/headless package
- Use ES2015 modules instead of UMD.
- #1252 Correctly reflect the state in bookmark icon title.
- #1257 Prefer 'probably' over 'maybe' when evaluating audio play support.
- #1259 Don't inform of affiliation change after user leaves MUC
- #1261 File upload not working
- #1264 Right Align badges of room occupants
- #1272 Hiding MUC occupants leaves a blank space
- #1278 Replace the default avatar with a SVG version

## 4.0.3 (2018-10-22)

- New translations: Arabic, Basque, Czech, French, German, Hungarian, Japanese, Norwegian Bokmål, Polish, Romanian, Spanish
- Bugfix. Converse continuously publishes an empty OMEMO devicelist for itself
- Bugfix. Handler not triggered when submitting MUC password form 2nd time
- Bugfix. MUC features weren't being refreshed when saving the config form
- Don't show duplicate notification messages
- New config setting [show_images_inline](https://conversejs.org/docs/html/configuration.html#show-images-inline)
- Disable OMEMO when the user has indicated that Converse is running on an untrusted device.
- #537 Render `xmpp:` URI as link
- #1058 Send an inactive chat state notification when the user switches to another tab
- #1062 Collapse multiple join/leave messages into one
- #1063 URLs in the topic / subject are not clickable
- #1140 Add support for destroyed chatrooms
- #1169 Non-joined participants display an unwanted status message
- #1185 Added Contact still shown as pending
- #1190 MUC Participants column disappears in certain viewport widths
- #1193 OMEMO messages without a `<body>` fallback are ignored
- #1199 Can't get back from to login screen from registration screen
- #1204 Link encoding issue
- #1209 Bring color codes of users' status in line with other clients
- #1214 Setting `allow_contact_requests` to `false` has no effect
- #1221 Avoid creating a headlines box if we don't have anything to show inside it
- #1222 Adding a bookmark should prefill the room name
- #1228 Converse automatically visits links (to try and determine whether they're images to show inline)

## 4.0.2 (2018-10-02)

- M4A and WEBM files, when sent as XEP-0066 Out of Band Data, are now playable directly in chat
- Updated French and Spanish translations
- Two new languages supported, [Hindi](https://hosted.weblate.org/languages/hi/conversejs/) and [Romanian](https://hosted.weblate.org/languages/ro/conversejs/)
- #1176 Add config setting [send_chat_state_notifications](https://conversejs.org/docs/html/configuration.html#send-chat-state-notifications)
- #1187 UTF-8 characters have the wrong encoding when using OMEMO
- #1189 Video playback failure
- #1220 Converse not working in Edge
- #1225 User profile sometimes not displayed when libsignal-protocol.js is used
- #1227 Login form does not work in Epiphany

## 4.0.1 (2018-09-19)

- Use https://compliance.conversations.im instead of dead link tot st https://xmpp.net
- New config  setting [auto_register_muc_nickname](https://conversejs.org/docs/html/configuration.html#auto-register-muc-nickname)
- New config setting [enable_muc_push](https://conversejs.org/docs/html/configuration.html#enable-muc-push)
- #1182 MUC occupants without nick or JID created
- #1184 Notification error when message has no body
- #1201 Emoji picker appears when pressing enter

## 4.0.0 (2018-09-07)

## New Features

- #161 XEP-0363: HTTP File Upload
- #194 Include entity capabilities in outgoing presence stanzas
- #337 API call to update a VCard
- #421 XEP-0308: Last Message Correction
- #497 XEP-0384: OMEMO encrypted messaging
- #968 Use nickname from VCard when joining a room
- #986 Affiliation changes aren't displayed in the chat
- #1081 Allow for shift-enter to insert newlines
- #1091 There's now only one CSS file for all view modes.
- #1094 Show room members who aren't currently online
- #1106 Support for Roster Versioning
- #1137 Autocompletion and support for [XEP-0372 References](https://xmpp.org/extensions/xep-0372.html), specifically section "3.2 Mentions".
- It's now also possible to edit your VCard via the UI
- Automatically grow/shrink input as text is entered/removed
- MP4 and MP3 files when sent as XEP-0066 Out of Band Data, are now playable directly in chat
- Support for rendering URLs sent according to XEP-0066 Out of Band Data.
- Geo-URIs (e.g. from Conversations) are now replaced by links to openstreetmap (works in reverse also)
- Add a checkbox to indicate whether a trusted device is being used or not.
  If the device is not trusted, sessionStorage is used and all user data is deleted from the browser cache upon logout.
  If the device is trusted, localStorage is used and user data is cached indefinitely.
- Initial support for [XEP-0357 Push Notifications](https://xmpp.org/extensions/xep-0357.html), specifically registering an "App Server".
- Add support for logging in via OAuth (see the [oauth_providers](https://conversejs.org/docs/html/configuration.html#oauth-providers) setting)

### Bugfixes

- Spoiler messages didn't include the message author's name.
- Documentation includes utf-8 charset to make minfied versions compatible across platforms. #1017
- #1026 Typing in MUC shows "Typing from another device"
- #1039 Multi-option data form elements not shown and saved correctly
- #1143 Able to send blank message

### API changes

- `_converse.api.vcard.get` now also accepts a `Backbone.Model` instance and
  has an additional `force` parameter to force fetching the vcard even if it
  has already been fetched.
- New API method `_converse.api.vcard.update`.
- The `contactStatusChanged` event has been renamed to `contactPresenceChanged`
  and a event `presenceChanged` is now also triggered on the contact.
- `_converse.api.chats.open` and `_converse.api.rooms.open` now returns a
  `Presence` which resolves with the `Backbone.Model` representing the chat
  object.

## UI changes

- #956 Conversation pane should show my own identity in pane header
- The UI is now based on Bootstrap4 and Flexbox is used extensively.
- Fontawesome 5 is used for icons.
- User Avatars are now shown in chat messages.

## Configuration changes

- Removed the `storage` configuration setting, use [trusted](https://conversejs.org/docs/html/configuration.html#trusted) instead.
- Removed the `use_vcards` configuration setting, instead VCards are always used.
- Removed the `xhr_custom_status` and `xhr_custom_status_url` configuration
  settings. If you relied on these settings, you can instead listen for the
  [statusMessageChanged](https://conversejs.org/docs/html/events.html#contactstatusmessagechanged)
  event and make the XMLHttpRequest yourself.
- Removed  `xhr_user_search` in favor of only accepting `xhr_user_search_url` as configuration option.
- `xhr_user_search_url` has to include the `?` character now in favor of more flexibility. See example in the documentation.
- The data returned from the `xhr_user_search_url` must now include the user's
  `jid` instead of just an `id`.
- New configuration settings [nickname](https://conversejs.org/docs/html/configuration.html#nickname)
  and [auto_join_private_chats](https://conversejs.org/docs/html/configuration.html#auto-join-private-chats).

## Architectural changes

- Extracted the views from `converse-muc.js` into `converse-muc-views.js` and
  where appropriate moved methods from the views into the models/collections.
  This makes MUC possible in headless mode.
- Created a new core plugin `converse-roster.js` which contains the models for
  roster-related data. Previously this code was in `converse-core.js`.
- VCards are now stored separately from chats and roster contacts.

## Other

- Support for OTR (off-the-record) encryption has been dropped.

## 3.3.4 (2018-03-05)

- Don't show bookmark toggles when PEP bookmarking not supported by the XMPP server.
- Emojis are now sent in unicode instead of short names (also in MUCs)

### Bugfixes

- Server field in `Rooms` tab showed MUC supporting clients instead of only components.
- Avatars weren't being shown.
- Bookmarks list and open rooms list weren't recreated after logging in for a 2nd time (without reloading the browser).
- #1022 Status message not sent out on subsequent presences
- #1024 null reference on MUC Invite
- #1025 OTR lock icon disappears
- #1027 `new Event` not supported in IE11
- #1028 Avoid `eval` (crept in via `_.template` from lodash).

### Translation changes

- New locale: Bulgarian
- Updated German, Russian, Chinese (traditional), Norwegian Bokmål and French translations.

## 3.3.3 (2018-02-14)

### Bugfixes
- Attribute error when empty IQ stanza is returned for vCard query
- In fullscreen view, sometimes a background MUC would come into the foreground
  when a new message appears inside it.

### Security fixes

- CVE-2018-6591: Don't allow PEP bookmarks if `pubsub#publish-options` is not advertised by the server.

    In previous versions of converse.js, bookmarks sent to servers that don't
    support `pubsub#publish-options` were visible to all your contacts, even
    though they should be kept private. This is due to those servers simply
    ignoring the `pubsub#publish-options` directive and converse.js not checking
    first whether `pubsub#publish-options` is supported before setting bookmarks
    via PEP.

    More info here: https://gultsch.de/converse_bookmarks.html

### New features
- XEP-0382 Spoiler Messages (currently only for private chats)
- Listen for new room bookmarks pushed from the user's PEP service.
- Simplified the [embedded](https://conversejs.org/demo/embedded.html) usecase.
    - No need to manually blacklist or whitelist any plugins.
    - Relies on the [view_mode](https://conversejs.org/docs/html/configuration.html#view-mode) being set to `'embedded'`.
    - The main `converse.js` build can be used for the embedded usecase.
    - Maintain MUC session upon page reload

### API changes
- New API method `_converse.api.disco.getIdentity` to check whether a JID has a given identity.

### Configuration settings
- `auto_reconnect` is now set to `true` by default.
- New configuration setting [allow_public_bookmarks](https://conversejs.org/docs/html/configuration.html#allow-public-bookmarks)
- New configuration setting [root](https://conversejs.org/docs/html/configuration.html#root)
- The [view_mode](https://conversejs.org/docs/html/configuration.html#view-mode) setting now has a new possible value: `embedded`

### Translation updates
- Chinese (Traditional), French, German, Portuguese (Brazil), Russian, Ukrainian

## 3.3.2 (2018-01-29)

### Bugfixes

- Various fixes for IE11.
- Could not register on Ejabberd 18. `"Missing attribute 'id' in tag qualified by namespace 'jabber:client'"`
- #878 Ending slash in link not recognized
- #921 FATAL error when `visible_toolbar_buttons.emoji = false`
- #959 Add padding for the iPhone X (to the mobile CSS).
- #993 `moment.format` is not a function error when sending a message.
- #994 TypeError when using the `user.login` API.
- #995 `ChildNode.replaceWith` is not available in Internet Explorer or Safari. Use `Node.replaceChild` instead.
- #999 MUC Chat Send button causes page reload
- #1000 Scroll to bottom when maximizing a chat room.
- #1003 Handle bare MUC room JIDs

### Translation changes

- Updated Dutch, French, Japanese, Norwegian Bokmål and Ukrainian translations

## 3.3.1 (2018-01-18)

### UI/UX changes
- Add new configuration option
  [show_message_load_animation](https://conversejs.org/docs/html/configuration.html#show-message-load-animation)
  with a default value of `false`. The message load animations (added in 3.3.0)
  cause slowness and performance issues in Firefox, so they're now disabled by default.

### Translation changes
- Updated Spanish and French translations.
- New translation: "Simplified Chinese"
- Rename `zh` language code to `zh_TW` and add Simplified Chinese as `zh_CN`

## 3.3.0 (2018-01-17)

### Bugfixes
- #800 Could not register successfully in ejabberd 17.01
- #949 Don't flash the roster contacts filter (i.e. hide by default)
- #951 Duplicate messages received in an MUC chat room.
- #953 MUC "Features" displayed when exiting configuration
- #967 Rooms list doesn't show when the server doesn't support bookmarks
- Don't require `auto_login` to be `true` when using the API to log in.
- Moment locale wasn't being set to the value passed via the `i18n` option.
- In the chat heading, two avatars sometimes get rendered.
- Refetch the roster from the server after reconnection.
  From the perspective of the XMPP server, this is an entirely new login,
  and therefore as per [RFC-6121](https://tools.ietf.org/html/rfc6121#section-2.1.6)
  the roster SHOULD be queried, making the client an "interested resource".
  Otherwise connected contacts might not get your presence updates.
- The way the archive ID of a MAM message is specified, has changed.
  See https://xmpp.org/extensions/xep-0313.html#archives_id
- Fixed error building DOM toggle_chats.html span.unread-message-count class attribute
- Bugfix. In a MUC the `/help` command didn't render properly.
- The `/voice` MUC command didn't set the right role in order to grant voice again.

### New Features
- Emojis are now sent in unicode instead of short names
- #314 Add support for opening chat rooms with a URL fragment such as `#converse/room?jid=room@domain`
  and private chats with a URL fragment such as `#converse/chat?jid=user@domain`
- #828 Add routing for the `#converse/login` and `#converse/register` URL
  fragments, which will render the registration and login forms respectively.
- New configuration setting [view_mode](https://conversejs.org/docs/html/configuration.html#view-mode)
  This removes the need for separate `inverse.js` and `converse-mobile.js`
  builds. Instead the `converse.js` build is now used with `view_mode` set to
  `fullscreen` and `mobile` respectively.
- Fetch VCard when starting a chat with someone not in the user's roster.
- Show status messages in an MUC room when a user's role changes.
- In MUC chat rooms, collapse multiple, consecutive join/leave messages.
- Performance improvements for rendering private chats, rooms and the contacts roster.
- MUC Leave/Join messages now also show a new day indicator if applicable.

### API changes
- New API method `_converse.disco.supports` to check whether a certain
  service discovery feature is supported by an entity.
- New API method `_converse.api.vcard.get` which fetches the VCard for a
  particular JID.

### Configuration changes
- `hide_open_bookmarks` is now by default `true`.

### UX/UI changes
- #984 Improve loading of archived messages via "infinite scroll"
- Use CSS3 fade transitions to render various elements.
- Remove `Login` and `Registration` tabs and consolidate into one panel.
- Show validation error messages on the login form.
- Don't hang indefinitely and provide nicer error messages when a connection
  can't be established.
- Consolidate error and validation reporting on the registration form.
- Don't close the emojis panel after inserting an emoji.
- Focus the message textarea when the emojis panel is opened or closed.
- MUC chatroom occupants are now sorted alphabetically and according to their roles.

### Technical changes
- Converse.js now includes a [Virtual DOM](https://github.com/snabbdom/snabbdom)
  via [backbone.vdomview](https://github.com/jcbrand/backbone.vdomview) and uses
  it to render various views.
- Converse.js no longer includes all the translations in its build. Instead,
  only the currently relevant translation is requested. This results in a much
  smaller filesize but means that the translations you want to provide need to
  be available. See the [locales_url](https://conversejs.org/docs/html/configuration.html#locales-url)
  configuration setting for more info.
- The translation machinery has now been moved to a separate module in `src/i18n.js`.
- jQuery has been completely removed as a dependency (still used in tests though).

## 3.2.1 (2017-08-29)

### Bugfixes
- Various IE11 fixes.
- #907 Unnecessary login validation error when `default_domain` or `locked_domain` are set.
- #908 Login form for inVerse is only 200px when `allow_registration` is set to `false`.
- #909 Translations written as template literals [aren't parsed properly by xgettext](https://savannah.gnu.org/bugs/?50920).
- #911 Use `getDefaultNickName` consistently to allow better overrides via plugins.
- #912 `maximize` method in `converse-minimize` fails if the `controlbox` is not there.

## 3.2.0 (2017-08-09)

### New Plugins
- New plugin `converse-disco` which replaces the original support for
  [XEP-0030](https://xmpp.org/extensions/xep-0030.html) and which has been
  refactored to allow features for multiple entities to be stored.

### New features and improvements
- Add support for Emojis (either native, or via <a href="https://www.emojione.com/">Emojione</a>).
- Add JID validation to the contact add form, the occupant invite form and the login form.
- #896 Consistently use `XMPP username` in user-facing text (instead of JID, Jabber ID etc.).

### New configuration settings
* The `visible_toolbar_buttons.emoticons` configuration option is now changed to `visible_toolbar_buttons.emoji`.
* [use_emojione](https://conversejs.org/docs/html/configuration.html#use-emojione)
  is used to determine whether Emojione should be used to render emojis,
  otherwise rendering falls back to native browser or OS support.
* [emojione_image_path](https://conversejs.org/docs/html/configuration.html#emojione-image-path)
  is used to specify from where Emojione will load images for rendering emojis.

### New events
* ['discoInitialized'](https://conversejs.org/docs/html/development.html#discoInitialized)
* ['afterMessagesFetched'](https://conversejs.org/docs/html/development.html#afterMessagesFetched)

### Code changes
- Removed jQuery from `converse-core`, `converse-vcard` and `converse-roomslist`.
- Remove `jquery.easing` from the full build. Was only being used by the
  [conversejs.org](https://conversejs.org) website, which has been updated to not rely on it.
- All promises are now native (or polyfilled) ES2015 Promises instead of jQuery's Deferred.
- #866 Add babel in order to support ES2015 syntax

#### Bugfixes:
- The domain was queried for MAM:2 support, instead of the JID.
- Roster filter is not shown when all groups are collapsed.
- When filtering, contacts in closed groups appear.
- Room name wasn't being updated after changing it in the configuration form.
- Server disco features were "forgotten" after logging out and then logging in again.
- Don't show duplicate sent groupchat messages in Slack chat rooms.
- Bookmark icon shown in the open rooms list when `allow_bookmarks` is to `false`.
- It wasn't possible to add or remove bookmarks via the "Open Rooms" list.
- #879 Text in links are converted to smileys leading to non-clickable links.
- #899: Only touch `stamp-npm` if `npm install` was successful
- #902 `make build` dependends on non-existing files

## 3.1.1 (2017-07-12)

- Use a patched version of [awesomplete](https://github.com/LeaVerou/awesomplete)
  which doesn't render suggestions as HTML (possible XSS attack vector). [jcbrand]

More info here: https://github.com/LeaVerou/awesomplete/pull/17082

## 3.1.0 (2017-07-05)

### API changes
- Deprecate the `updateSettings` method in favour of
  `_converse.settings.update`. [jcbrand]
- Add a new API method `_converse.promises.add` for exposing promises to be
  used with `_converse.waitUntil`. [jcbrand]
- The `message` event now returns a data object with `stanza` and
  `chatbox` attributes, instead of just the stanza. [jcbrand]

### New Plugins
- New non-core plugin `converse-singleton` which ensures that no more than
  one chat is visible at any given time. Used in the mobile build:
  `converse-mobile.js` and makes the unread messages counter possible there.
  [jcbrand]
- New non-core plugin `converse-roomslist`, which shows a list of open rooms
  in the `Rooms` tab of the control box. [jcbrand]

### New configuration settings
- New setting for `converse-bookmarks`:
  [hide_open_bookmarks](https://conversejs.org/docs/html/configuration.html#hide-open-bookmarks)
  It is meant to be set to `true` when using `converse-roomslist` so that open
  rooms aren't listed twice (in the rooms list and the bookmarks list).
  [jcbrand]

### Github tickets resolved
- #567 Unreaded message count reset on page load [novokrest]
- #575 Logging out from converse.js doesn't clear the connection status from the
  sessionStorage [jcbrand]
- #591 Unread message counter is reset when the chatbox is closed [novokrest]
- #754 Show unread messages next to roster contacts. [jcbrand]
- #864 Remove all inline CSS to comply with strict Content-Security-Policy headers [mathiasertl]
- #873 Inconsistent unread messages count updating [novokrest]
- #887 Make embedded images clickabe [jcbrand]
- #890 Message carbons not sent out after reconnection [jcbrand]
- #894 Room affiliation lost when connection jid and room presence jid are of different case [Rayzen]

### Miscellaneous

- Support for [XMPP-0313 Message Archive Management](https://xmpp.org/extensions/xep-0313.html)
  has been upgraded to version 2. [jcbrand]
- Show unread messages for minimized chats. [jcbrand]
- Render nickname form when entering a room via invitation. [jcbrand]

## 3.0.2 (2017-04-23)

*Dependency updates*:
- Jasmine 2.5.3
- Phantomjs 2.1.14
- moment 2.18.1
- sinon 2.1.0
- eslint 3.19.0

- Don't rerender the text input when filtering contacts. [jcbrand]
- Show the MUC server in a bookmarked room's info view (in the bookmarks list). [jcbrand]
- Enable creation of `dist/converse-muc-embedded.js` build file for the
  embedded MUC room demo. [jcbrand]
- Use `noConflict` to avoid polluting globale namespace with lodash and Backbone. [jcbrand]
- Bugfix: MUC user's nickname wasn't being shown in HTML5 notification messages. [jcbrand]
- Bugfix: OTR meta-messages were being shown in HTML5 notifications. [jcbrand]
- CSS fix: Icon lock wasn't showing. [jcbrand]
- #626 Open chat minimised [novokrest]
- #842 Persistent muc room creation not working [jcbrand]
- #848 OTR doesn't start when `cache_otr_key` is set to `true`. [jcbrand]
- #849 `TypeError: _converse.i18n.locale_data is undefined` when reconnecting. [jcbrand]
- #850 Roster not loading when group names are numbers. [jcbrand]

## 3.0.1 (2017-04-04)

- Bugfix. Endless spinner when trying to log in after rendering the registration form. [jcbrand]
- #585 Duplicate contact created due to JID case sensivity [saganshul]
- #628 Fixes the bug in displaying chat status during private chat. [saganshul]
- #628 Changes the message displayed while typing from a different resource of the same user. [smitbose]
- #675 Time format made configurable.
   See [time_format](https://conversejs.org/docs/html/configuration.html#time-format)
   [smitbose]
- #682 Add "Send" button to input box in chat dialog window.
   See [show_send_button](https://conversejs.org/docs/html/configuration.html#show-send-button)
   [saganshul]
- #704 Automatic fetching of registration form when
   [registration_domain](https://conversejs.org/docs/html/configuration.html#registration-domain)
   is set. [smitbose]
- #806 The `_converse.listen` API event listeners aren't triggered. [jcbrand]
- #807 Error: Plugin "converse-dragresize" tried to override HeadlinesBoxView but it's not found. [jcbrand]
- #811 jQuery wasn't being closured in builds. [jcbrand]
- #814 Images from URLs with query strings aren't being rendered. [novokrest]
- #820 Inconsistency in displaying room features. [jcbrand]

## 3.0.0 (2017-03-05)

- **Breaking changes**:
    * Plugins must now be whitelisted.
      See the [whitelisted_plugins](https://conversejs.org/docs/html/configuration.html#whitelisted-plugins) setting.
    * Callbacks for `converse.on` now no longer receive an event object as first parameter.
    * The API has been split into public and private parts.
      The private API methods are now only available to plugins.
      For more info, read [developer API](https://conversejs.org/docs/html/developer_api.html)
      and the [plugin_development](https://conversejs.org/docs/html/plugin_development.html)
      documentation.
    * To prevent confusion the private, closured object, only
      available to plugins, has been renamed from `converse` to `_converse`.
      The public API is accessible via a global `converse` object.
    * The `keepalive` and `roster_groups` options are now set to `true` by default.
    * Templates are no longer stored as attributes on the `_converse` object.
      If you need a particular template, use `require` to load it.

- Bugfix. After bookmarking a room for which a nickname is required, return to
  the nickname form. [jcbrand]
- Show the chat states of room occupants. [jcbrand]
- The no-jQuery build has been renamed from `converse.nojquery.js` to
  `converse-no-jquery.js` to fit the convention used for other build names.
  [jcbrand]
- 50 is the new default [archived_messages_page_size](https://conversejs.org/docs/html/configuration.html#archived-messages-page-size)
  [jcbrand]
- Better support for delayed delivery of presence stanzas (XEP-0203). [jcbrand]
- The chat room `description` is now shown in the heading, not the `subject`.
  [jcbrand]
- Chat room features are shown in the sidebar. [jcbrand]
- Hide the chat room invite widget if the room is not open or if the room is members-only
  and the user is not the owner. [jcbrand]
- Created a new non-core plugin `converse-muc-embedded` which embeds a single
  chat room into a page. An example can be found at https://conversejs.org/demo/embedded.html
  [jcbrand]
- Use lodash instead of underscore.js [jcbrand]
- Case insensitive matching of moderation commands. [jcbrand]
- Add `/subject` as alias to `/topic` [jcbrand]
- `message_carbons`, `play_sounds` and `allow_chat_pending_contacts` now default to `true` [jcbrand]
- Improved roster filter UX. [jcbrand]
- Render the login form again upon authfail. [jcbrand]
- New promises API: [waitUntil](https://conversejs.org/docs/html/developer_api.html#waituntil)
  [jcbrand]
- New configuration setting:
  [show_chatstate_notifications](https://conversejs.org/docs/html/configuration.html#show-chatstate-notifications)
  [jcbrand]
- New configuration setting:
  [whitelisted_plugins](https://conversejs.org/docs/html/configuration.html#whitelisted-plugins)
  [jcbrand]
- New configuration setting:
  [blacklisted_plugins](https://conversejs.org/docs/html/configuration.html#blacklisted-plugins)
  [jcbrand]
- The API now no longer returns wrapped chatboxes (or rooms) but instead a
  Backbone.View object. This means the API of the returned object has changed.
  You're still able to do everything from before but now also much more.
  [jcbrand]
- Allow JIDs not on the roster to be invited to a chat room. [jcbrand]
- Bugfix. `TypeError: this.sendConfiguration(...).then is not a function` when
  an instant room is created. [jcbrand]
- Ensure consistent behavior from `show_controlbox_by_default` [jcbrand]
- #365 Show join/leave messages for chat rooms.
  New configuration setting:
  [muc_show_join_leave](https://conversejs.org/docs/html/configuration.html#muc-show-join-leave)
- #366 Show the chat room occupant's JID in the tooltip (if you're allowed to see it). [jcbrand]
- #610, #785 Add presence priority handling [w3host, jcbrand]
- #620 `auto_away` shouldn't change the user's status if it's set to `dnd`. [jcbrand]
- #694 The `notification_option` wasn't being used consistently. [jcbrand]
- #745 New config option [priority](https://conversejs.org/docs/html/configuration.html#priority) [jcbrand]
- #770 Allow setting contact attrs on chats.open [Ape]
- #790 MAM retrieval broken [jcbrand]

## 2.0.6 (2017-02-13)
- Escape user-generated input to prevent JS-injection attacks. (Thanks to SamWhited) [jcbrand]
- #486 Honor existing mam user configuration [throwaway42]
- #749 /me will show your contact's name in the sent field [jcbrand]
- #774 Browser language (fr-fr or fr) is not detected by default [jcbrand]
- #775 Anonymous login form is a text field instead of a push button [jcbrand]

## 2.0.5 (2017-02-01)
- #743, #751, #753 Update to Strophe 1.2.12. SASL-EXTERNAL now has reduced priority, so it won't
  be prioritized above other auth mechanisms. [jcbrand]
- #755: create composer.json to add this project in packagist.org [fabiomontefuscolo]
- #758: Bugfix. Render all resize drag handles for ChatRoomView. [LeoYReyes]
- #762 Allow chatting with users not in your roster. [Ape, jcbrand]
- Bugfix. Cancel button shown while registration form is being fetched wasn't working
  properly. [jcbrand]
- Bugfix. Login form wasn't rendered after logging out (when `auto_reconnect` is `true`). [jcbrand]
- Bugfix. Properly disconnect upon "host-unknown" error. [jcbrand]
- Bugfix. Minimized chats weren't removed when logging out. [jcbrand]
- Security fix: Prevent message forging via carbons. (Thanks to ge0rg) [jcbrand]

## 2.0.4 (2016-12-13)
- #737: Bugfix. Translations weren't being applied. [jcbrand]
- Fetch room info and store it on the room model.
  For context, see: https://xmpp.org/extensions/xep-0045.html#disco-roominfo [jcbrand]
- Bugfix. Switching from bookmarks form to config form shows only the spinner. [jcbrand]
- Bugfix. Other room occupants sometimes not shown when reloading the page. [jcbrand]
- Bugfix. Due to changes in `converse-core` the controlbox wasn't aware anymore of
  disconnection or reconnection events. [jcbrand]
- Optimize fetching of MAM messages (in some cases happened on each page load). [jcbrand]
- Fix empty controlbox toggle after disconnect. [jcbrand]
- When inviting someone to a members-only room, first add them to the member
  list. [jcbrand]
- New configuration setting [muc_disable_moderator_commands](https://conversejs.org/docs/html/configuration.html#muc-disable-moderator-commands) [jcbrand]

## 2.0.3 (2016-11-30)
- #735 Room configuration button not visible. [jcbrand]
- CSS fix for fadeIn animation. [jcbrand]

## 2.0.2 (2016-11-30)
- #721 keepalive not working with anonymous authentication [jcbrand]
- #723 Bugfix: Arrays in configuration settings were ignored. [jcbrand]
- #734 Bugfix. `converse.rooms.open` ignored the `muc_nickname_from_jid` setting. [jcbrand]
- Enable new rooms to be configured automatically, with a default config, via `rooms.open`.
  For details, refer to the [relevant documentation](https://conversejs.org/docs/html/developer_api.html#the-rooms-grouping) [jcbrand]
- Bugfix: Chatboxes aren't closed when logging out. [jcbrand]
- Bugfix: Trying to save data on the `ControlBox` model before `ChatBoxes`
  collection has its `browserStorage` configured.
  Causes `Error: A "url" property or function must be specified`. [jcbrand]
- Don't open the controlbox on contact requests. [jcbrand]
- Bugfix: Reconnection fails when original connection was never established. [jcbrand]
- If a `credentials_url` is provided, then keep on attempting to reconnect when connection is down.  [jcbrand]
- Remove (undocumented) `callback` config parameter for `converse.initialize`.
  Instead, `converse.initialize` returns a promise which will resolve once
  initialization is complete. [jcbrand]
- New event ['reconnecting'](https://conversejs.org/docs/html/development.html#reconnecting) [jcbrand]
- New configuration setting [allow_bookmarks](https://conversejs.org/docs/html/configuration.html#allow-bookmarks) [jcbrand]
- The `rooms.open` API method will no longer maximize rooms that are minimized (unless `maximize: true` is passed in). [jcbrand]

## 2.0.1 (2016-11-07)
- #203 New configuration setting [muc_domain](https://conversejs.org/docs/html/configuration.html#muc-domain) [jcbrand]
- #705 White content after submitting password on chat rooms [jcbrand]
- #712 Controlbox clicks stop responding after auto-reconnect [jcbrand]
- Removed shared state between tests. All tests are now isolated. [jcbrand]
- Allow the context (i.e. `this` value) to be passed in when registering event
  listeners with `converse.listen.on` and `converse.listen.once`. [jcbrand]
- New event ['rosterContactsFetched'](https://conversejs.org/docs/html/development.html#rosterContactsFetched) [jcbrand]
- New event ['rosterGroupsFetched'](https://conversejs.org/docs/html/development.html#rosterGroupsFetched) [jcbrand]
- HTML templates are now loaded in the respective modules/plugins. [jcbrand]
- Start improving Content-Security-Policy compatibility by removing inline CSS. [mathiasertl]
- Add support for XEP-0048, chat room bookmarks [jcbrand]
- New configuration setting [connection_options](https://conversejs.org/docs/html/configuration.html#connection-options) [jcbrand]

## 2.0.0 (2016-09-16)
- #656 Online users count not shown initially [amanzur]
- #674 Polish translation updated [ser]
- Backwards incompatible change: the `_super` attribute in plugins is now named `__super__`. [jcbrand]
- Continuously attempt to resurrect dead connections when `auto_reconnect` is `true`. [jcbrand]
- Update the 'rooms' API to allow user to pass in room attributes. [jcbrand]
- New configuration setting [message_storage](https://conversejs.org/docs/html/configuration.html#message-storage) [jcbrand]
- Hardcode the storage for roster contacts and chat room occupants to `sessionStorage`. [jcbrand]
- Fixed wrong chat state value, should be `chat`, not `chatty`.
  See [RFC 3921](https://xmpp.org/rfcs/rfc3921.html#rfc.section.2.1.2.2). [jcbrand]
- Adds support for SASL-EXTERNAL. [jcbrand]

## 1.0.6 (2016-08-12)
- #632 Offline and Logout states do not properly update once users start
  chatting. [chrisuehlinger, jcband]
- #674 Polish translation updated to the current master. [ser]
- #677 Chatbox does not open after close. [jcbrand]
- The behavior of `converse.chats.get` has changed. If the chat box is not
  already open, then `undefined` will be returned. [jcbrand]
- Typing (i.e. chat state) notifications are now also sent out from MUC rooms. [jcbrand]
- `ChatRoomView.onChatRoomMessageSubmitted` has been renamed to
  `onMessageSubmitted`, to make it the same as the method on `ChatBoxView`. [jcbrand]
- New configuration setting [muc_nickname_from_jid](https://conversejs.org/docs/html/configuration.html#muc-nickname-from-jid) [jcbrand]
- New configuration setting [muc_instant_rooms](https://conversejs.org/docs/html/configuration.html#muc-instant-rooms) [jcbrand]

## 1.0.5 (2016-07-28)
- In case of nickname conflict when joining a room, allow the user to choose a new one.
  [jcbrand]
- Check whether the user has a reserved nickname before entering a room, and if so,
  use it. [jcbrand]
- Mention someone in your chat room message by clicking on their name in the occupants
  list. [jcbrand]
- #645 When accepting a contact request, the contact didn't appear in the
  pending contacts group. [jcbrand]
- Bugfix: allow multiple MAM queries to be made simultaneously. [jcbrand]

## 1.0.4 (2016-07-26)

- Restrict occupants sidebar to 30% chat room width. [jcbrand]
- Made requesting contacts more visible, by placing them at the top of the roster. [jcbrand]
- `insertIntoPage` method of `ChatBoxView` has been renamed to `insertIntoDOM`,
  to make it the same as the method of `ChatRoomView`. [jcbrand]
- Render error messages received from the server (for undelivered chat messages). [jcbrand]
- Don't hide requesting contacts when filtering by chat state. [jcbrand]
- When logging in anonymously, the server JID can now be passed in via `converse.initialize`
  or via `converse.user.login`. [jcbrand]

## 1.0.3 (2016-06-20)

- Update the plugin architecture to allow plugins to have optional dependencies [jcbrand]
- Bugfix. Login form doesn't render after logging out, when `auto_reconnect = false` [jcbrand]
- Also indicate new day for the first day's messages. [jcbrand]
- Chat bot messages don't appear when they have the same ids as their commands. [jcbrand]
- Updated onDisconnected method to fire disconnected event even if `auto_reconnect = false`. [kamranzafar]
- Bugfix: MAM messages weren't being fetched oldest first. [jcbrand]
- Add processing hints to chat state notifications [jcbrand]
- Don't use sound and desktop notifications for OTR messages (when setting up the session) [jcbrand]
- New config option [default_state](https://conversejs.org/docs/html/configuration.html#default_state) [jcbrand]
- New API method `converse.rooms.close()` [jcbrand]
- New configuration setting [allow_muc_invites](https://conversejs.org/docs/html/configuration.html#allow-muc-invites) [jcbrand]
- Add new event [pluginsInitialized](https://conversejs.org/docs/html/development.html#pluginsInitialized) [jcbrand]
- #553 Add processing hints to OTR messages [jcbrand]
- #650 Don't ignore incoming messages with same JID as current user (might be MAM archived) [jcbrand]
- #656 online users count in minimized chat window on initialization corrected [amanzur]

## 1.0.2 (2016-05-24)

- Bugfix. Bind `sendPresence` to the right context. Bug that slipped in during
  the release of `1.0.1`. [jcbrand]

## 1.0.1 (2016-05-24)

- Bugfix. Roster filter sometimes gets hidden when it shouldn't. [jcbrand]
- Chat boxes weren't being initialized due to typo. [jcbrand]
- Flush request queue just after connection. Solves a problem with PubSub and
  Prosody, whereby BOSH HTTP responses weren't being received. [jcbrand]

## 1.0.0 (2016-05-03)

- Add catalan language [JoseMariaRubioMoral]
- Split converse.js up into different plugin modules. [jcbrand]
- Better Sass/CSS for responsive/mobile views. New mobile-only build. [jcbrand]
- Roster contacts can now be filtered by chat state and roster filters are
  remembered across page loads. [jcbrand]
- Add support for messages with type `headline`, often used for notifications
  from the server. [jcbrand]
- Add stanza-specific event listener `converse.listen.stanza`.
  As a result `converse.listen.on('message');` has been deprecated, use
  `converse.stanza.on('message');` instead. [jcbrand]
- Emit an event `chatBoxInitialized` once a chat box's initialize method has been called. [jcbrand]
- Emit an event `statusInitialized` once the user's own status has been initialized upon startup. [jcbrand]
- New config option [chatstate_notification_blacklist](https://conversejs.org/docs/html/configuration.html#chatstate-notification-blacklist) [jcbrand]
- New config option [sticky_controlbox](https://conversejs.org/docs/html/configuration.html#sticky-controlbox) [jcbrand]
- New config option [credentials_url](https://conversejs.org/docs/html/configuration.html#credentials-url) [jcbrand]
- Don't play sound notifications for OTR messages which are setting up an
  encrypted session. [jcbrand]
- Bugfix: RID, SID and JID tokens ignored when `keepalive` set to `true`. [jcbrand]
- Removed the `account.logout` API, instead use `user.logout`. [jcbrand]
- Use `rel=noopener` with links that contain `target=_blank` to prevent potential
  phishing attacks. [More info here](https://mathiasbynens.github.io/rel-noopener/)
  [jcbrand]
- #156 Add the option `auto_join_rooms` which allows you to automatically
  connect to certain rooms once logged in. [jcbrand]
- #261 `show_controlbox_by_default` config not working [diditopher]
- #443 HTML5 notifications of received messages [jcbrand]
- #534 Updated Russian translation [badfiles]
- #566 Do not steal the focus when the chatbox opens automatically [rlanvin]
- #573 xgettext build error: `'javascript' unknown` [jcbrand]
- #577 New config variable [message_archiving_timeout](https://conversejs.org/docs/html/configuration.html#message-archiving-timeout) [jcbrand]
- #587 Fix issue when logging out with `auto_logout=true` [davec82]
- #589 Save scroll position on minimize and restore it on maximize [rlanvin]
- #592 Add random resource for `auto_login`, add method generateResource to
  generate random resource [davec82]
- #598 Add option `synchronize_availability` [davec82]
- #600 Fix change xmpp status also on icon-status click [davec82]
- #616 converse-otr should depend on converse-minimize  [jcbrand]
- #609 Remove split of fullname [lixmal]

## 0.10.1 (2016-02-06)

- #352 When the user has manually scrolled up in a chat window, don't scroll
  down on chat event notifications. [jcbrand]
- #524 Added [auto_join_on_invite](https://conversejs.org/docs/html/configuration.html#auto_join_on_invite)
  parameter for automatically joining chat rooms. [ben]
- #520 Set specific domain. Two new options [default_domain](https://conversejs.org/docs/html/configuration.html#default_domain)
  and [locked_domain](https://conversejs.org/docs/html/configuration.html#locked_domain). [jcbrand]
- #521 Not sending presence when connecting after disconnection. [jcbrand]
- #535 Messages not received when room with mixed-case JID is used. [jcbrand]
- #536 Presence not sent out (in cases where it should) after page refresh. [jcbrand]
- #540 `bind is not a function` error for plugins without `initialize` method. [jcbrand]
- #547 By default the `offline` state is no longer choosable.
  See [include_offline_state](https://conversejs.org/docs/html/configuration.html#include-offline-state) for details. [jcbrand]
- A chat room invite might come from someone not in your roster list. [ben]
- #487 Empty the resources array when the resource is null [rlanvin]
- #534 Updated Russian translation [LaconicTranslator]
- #555 The status restored from sessionStorage is never updated [jcbrand]
- #559 Remove reconnection timer once connected succesfully [m0cs]

## 0.10.0 (2015-11-05)

**Note:**
*This release drops CSS support for IE8 and IE9.*

- #459 Wrong datatype passed to converse.chatboxes.getChatBox. [hobblegobber, jcbrand]
- #493 Roster push fix [jcbrand]
- #403 emit an event `rosterPush` when a roster push happens [teseo]
- #502. Chat room not opened in non_amd version. [rjanbiah]
- #505 Typo caused [object Object] in room info [gromiak]
- #508 "Is typing" doesn't automatically disappear [jcbrand]
- #509 Updated Polish translations [ser]
- #510 MUC room memberlist is being cleared with page reload when keepalive option is set. [jcbrand]
- Add the ability to also drag-resize chat boxes horizontally. [jcbrand]
- Updated Sass files and created a new style. [jcbrand]


## 0.9.6 (2015-10-12)

- Bugfix. Spinner doesn't disappear when scrolling up (when server doesn't support XEP-0313). [jcbrand]
- #462 Fix MUC rooms with names containing special characters not working [1st8]
- #467 Fix outgoing chat messages not having a msgid when being put into sessionStorage [1st8]
- #468 Fix [object Object] being sometimes shown as status [1st8]
- #472 Fix "Cannot read property 'splitOnce' of undefined" when typing /clear in a chat room. [jcbrand]
- #493 Roster wasn't being updated after a Roster push update [teseo, jcbrand]
- #496 Bugfix. Pings weren't being sent out. [teseo, jcbrand]
- #499 Message not received due to non-unique message ids. [jcbrand]

## 0.9.5 (2015-08-24)

- #306 XEP-0313: Message Archive Management [jcbrand]
- #439 auto_login and keepalive not working [jcbrand]
- #440 null added as resource to contact [jcbrand]
- Add new event serviceDiscovered [jcbrand]
- Add a new configuration setting [muc_history_max_stanzas](https://conversejs.org/docs/html/configuration.html#muc-history-max-stanzas>). [jcbrand]

## 0.9.4 (2015-07-04)

- #144 Add Ping functionality and Pong handler [thierrytiti]
- #234, #431 Messages aren't received when the user logs in with a mixed-case JID. [jcbrand]
- #367 API methods for changing chat status (online, busy, away etc.) and status message [jcbrand]
- #389 Allow login panel placeholders and roster item 'Name' translations. [gbonvehi]
- #394 Option to allow chatting with pending contacts [thierrytiti]
- #396 Add automatic Away mode and XEP-0352 support [thierrytiti]
- #400, #410 Allow offline pretty status and placeholder for "Insert a smiley" to be translated [thierrytiti]
- #401 Updated French translation [thierrytiti]
- #404 CSS fix: position and width of the div #conversejs [thierrytiti]
- #407 CSS: Fonts Path: editabable $font-path via sass/variables.scss [thierrytiti]
- #408 MUC: missing toggle call handler and updated documentation about call [thierrytiti]
- #413 Auto-detect user's locale to show date and time in the right format [thierrytiti]
- #415 closeAllChatBoxes is giving ReferenceError when 2 chats are open [nevcos, jcbrand]
- #416 Add icon for XA status [thierrytiti]
- #418 Logging out with `auto_reconnect=true` causes reconnection retries [jcbrand]
- #420 Updated German translation [1st8]
- #427 Converse.js does not subscribe back to a contact not in the roster. [emmanuel-florent]
- Add offline pretty status to enable translation [thierrytiti]
- Bugfix. ClearSessions during unload event would throw an error when not logged in. [gbonvehi]
- Bugfix. Manual login doesn't work when only websocket_url is set and not bosh_service_url. [jcbrand]
- Bugfix. Wrong callback argument mapping in XmppStatus initialize: fullname is null [thierrytiti]
- CSS fix: room-info bug on hover after room description loaded [thierrytiti]
- CSS: Fonts Path: editabable $font-path via sass/variables.scss [thierrytiti]
- Chat boxes returned by the API now have an `is_chatroom` attribute [jcbrand]
- Decouple automatic away and XEP-0352 support. [jcbrand]
- Don't carbon copy OTR messages. [jcbrand]
- I18N: Autodetection of User Locale if no i18n setting is set. [thierrytiti]
- Refactored in order to remove the strophe.roster.js dependency. [jcbrand]
- Refactored the plugin architecture. Add `overrides` convention for
  automatically overriding converse.js's methods and Backbone views and models. [jcbrand]
- With keepalive, don't send out a presence stanza on each page load [jcbrand]

## 0.9.3 (2015-05-01)

- Add the ability to log in automatically. [jcbrand]
- Remove `type=email` from JID field in login form. Resulting validation error confuses people. [jcbrand]
- Add Ukranian translations [Andriy Kopystyansky]
- #244 Add the ability to log in anonymously. [jcbrand]
- #344 Enable the path to the sound files to be configured [thierrytiti and jcbrand]
- #370 Unable to register a new user to ejabberd 2.1.11. [gbonvehi]
- #372 Some offline users have a visible empty `<dd>` in the roster. [floriancargoet]
- #374 Fix collapsed group visibility on page load. [floriancargoet]
- #378 Expect full JIDs to be returned via XHR user search [thierrytiti]
- #379 Updated French translations [thierrytiti]
- #379 Fix for bower not finding crypto-js-evanvosberg#3.1.2-5 any more. [jcbrand]

## 0.9.2 (2015-04-09)

- Bugfix. Prevent attaching twice during initialization. [jcbrand]
- API method chats.get can now also return chat boxes which haven't been opened yet. [jcbrand]
- Add API method contacts.add. [pzia]
- #356 Fix the plugin extend function. [floriancargoet]
- #357 Fix the known bug where a state notification reopens a chat box. [floriancargoet]
- #358 Bugfix. Chat rooms show the same occupants bug. [floriancargoet]
- #359 Fix a timeout bug in chat state notifications. [floriancargoet]
- #360 Incorrect roster height when `allow_contact_requests=true`. [floriancargoet, jcbrand]
- #362 Add API for retrieving and opening rooms. [pzia]
- #364 Text selection in chat boxes not shown in Firefox. [jcbrand]

## 0.9.1 (2015-03-26)

- Set the JID input field in the login form to `type=email`. [chatme]
- New configuration setting [allow_contact_removal](https://conversejs.org/docs/html/configuration.html#allow-contact-removal) [jcbrand]
- Document that event handlers receive 'event' obj as first arg. [jcbrand]
- Add a test to check that notifications are played in chat rooms. [jcbrand]
- #333 Enable automatic reconnection when `prebind` and `prebind_url` are specified. [jcbrand]
- #339 Require the JID to be specified when using `keepalive` with `prebind`. Also add a logout API method. [jcbrand]
- #349 Indicate visitors in chat rooms. [c143]

## 0.9.0 (2015-03-06)

- #204 Support websocket connections. [jcbrand]
- #252, 253 Add fullname and jid to contact's tooltip in roster. [gbonvehi]
- #292 Better support for XEP-0085 Chat State Notifications. [jcbrand]
- #295 Document "allow_registration". [gbonvehi]
- #304 Added Polish translations. [ser]
- #305 presence/show text in XMPP request isn't allowed by specification. [gbonvehi]
- Add new API method `chats.open` to open chat boxes. [jcbrand]
- Add new API method to set and get configuration settings. [jcbrand]
- Add responsiveness to CSS. We now use Sass preprocessor for generating CSS. [jcbrand]
- Bugfix. Custom status message form doesn't submit/disappear. [jcbrand]
- Calling the API method `contacts.get()` without parameters now returns all contacts. [jcbrand]
- Don't send out the message carbons IQ stanza on each page load. [jcbrand]
- New Makefile.win to build in Windows environments. [gbonvehi]
- Norwegian Bokmål translations. [Andreas Lorentsen]
- Removed deprecated API methods. [jcbrand]
- Strophe.log and Strophe.error now uses converse.log to output messages. [gbonvehi]
- The API method `chats.get` now only returns already opened chat boxes. [jcbrand]
- Updated Afrikaans translations. [jcbrand]
- Add new configuration setting [prebind_url](https://conversejs.org/docs/html/configuration.html#prebind-url) [jcbrand]

## 0.8.6 (2014-12-07)

- Bugfix. Login panel didn't appear under certain conditions. [jcbrand]
- Bugfix. Error when trying to render chat room configuration form. [jcbrand]
- Text on the registration form was not configurable or i18n aware. [jcbrand]
- #285 With prebind the jid, rid and sid settings were ignored. [jcbrand]

## 0.8.5 (2014-12-01)

- #117 JIDs or nicknames not shown in chat rooms. [jcbrand]
- #282 XEP-0077 In-band registration. [jcbrand]

## 0.8.4 (2014-11-15)

**note:**
*Certain API methods have been deprecated in favor of a new API and will be removed in the 0.9.0 release.*

- Bugfix. Error when trying to use prebind and keepalive together. [heban and jcbrand]
- Bugfix. Cannot read property "top" of undefined. [jcbrand]
- Add new event, noResumeableSession, for when keepalive=true and there aren't
  any prebind session tokens. [jcbrand]
- #46 Refactor the API and add new methods. [jcbrand]
- #151 Browser locks/freezes with many roster users. [jcbrand]
- #177 Setting status to offline does nothing. [jcbrand]
- #232 Always get full name from model. [jcbrand]
- #237 Unable to create room when `hide_muc_server` is `true`. [jcbrand]
- #238 Rooms are not shown when `hide_offline_users` is `true`. [jcbrand]
- #251 Non-minified builds for debugging. [jcbrand]
- #260 Sent message carbons are not displayed. [jcbrand]
- #262 Contact requests are not shown if page is reloaded. [jcbrand]
- #264 Remove unnecessary commas for ie8 compatibility. [Deuteu]
- #267 Unread messages counter wrongly gets incremented by chat state notifications. [Deuteu]
- #274 Roster filtering results change with presence changes. [jcbrand]
- #275 Custom status message doesn't reset. [jcbrand]
- #278 Unread messages counter doesn't unbind it's events. [Deuteu]
- #279 Handle more field types for MUC config forms. [gbonvehi]
- #280 New config option, `hide_offline_users` [gbonvehi]

## 0.8.3 (2014-09-22)

- The Javascript build files in the 0.8.2 release weren't updated due to a
  unnoticed build error. [jcbrand]

## 0.8.2 (2014-09-22)

- Converse.js now has the ability to maintain sessions across page loads.
  Previously, the session tokens had to be handled externally and passed in.
  See the [keepalive](https://conversejs.org/docs/html/configuration.html#keepalive) configuration setting. [jcbrand]
- Allow changing of nickname in a chat room via /nick command. [jcbrand]
- Allow a chat room user to be muted or unmuted with the /mute and /voice commands. [jcbrand]
- Add a chat room toolbar button for toggling the list of occupants. [jcbrand]
- Converse.js now responds to XEP-0030: Service Discovery requests. [jcbrand]
- Bugfix. Roster groups all appear offline after page reload (with prebind).
  See http://librelist.com/browser//conversejs/2014/8/26/problem-with-contact-list-everyone-is-offline/ [heban and jcbrand]
- Bugfix concerning trimmed chats. Chats were being trimmed even though there was enough room. [jcbrand]
- #62 Sound notifications will now also play when you are mentioned in a chat room. [jcbrand]
- #212 Bugfix. Groups weren't being show again after the live filter was cleared. [jcbrand]
- #215 (and also #75) XEP-0249: Direct MUC Invitations. [jcbrand]
- #216 Contacts tab empty when using xhr_user_search. [hcderaad and jcbrand]
- #219 New contacts added need page refresh to be accepted and become visible. [hcderaad and jcbrand]
- #220 Non-AMD example page was not working. [xavier83ar and jcbrand]
- #222 Control box state not remembered. [priyadi and jcbrand]
- #223 Provide API to query buddy status. [priyadi and jcbrand]
- #227 Updated Hebrew translations [GreenLunar]

## 0.8.1 (2014-08-23)

- Bugfix: Roster contacts' cache key too vague. [jcbrand]
- Bugfix: Roster contacts weren't properly sorted according to chat status. [jcbrand]
- #63 Support for sound notification when message is received. [jcbrand]
- #212 Provide a live filter of the roster contacts. [jcbrand]

## 0.8.0 (2014-08-04)

**note**:
    1. Converse.js is now relicensed under the [Mozilla Public License](http://www.mozilla.org/MPL/2.0/).
    2. Configuration options for the chat toolbar have changed. Please refer to the [relevant documentation](http://devbox:8890/docs/html/configuration.html#visible-toolbar-buttons).
    3. This release has reduced support for IE8 (some features won't work).
    4. Events have been renamed to remove "on" prefix (sorry for any inconvenience).

- No initial HTML markup is now needed in the document body for converse.js to work. [jcbrand]
- All date handling is now done with moment.js. [jcbrand]
- Add a new toolbar button for clearing chat messages. [jcbrand]
- Chat boxes and rooms can now be resized vertically. [jcbrand]
- Upgraded dependencies to their latest versions. [jcbrand]
- Add new configuration setting [forwarded_messages](https://conversejs.org/docs/html/configuration.html#forwarded-messages).
  Message forwarding was before a default behavior but is now optional (and disabled by default). [jcbrand]
- Newly opened chat boxes always appear immediately left of the controlbox. [jcbrand]
- #71 Chat boxes and rooms can be minimized. [jcbrand]
- #83 Roster contacts can be shown according to their groups. [jcbrand]
    Note: Converse.js can show users under groups if you have assigned them
    already via another client or server configuration. There is not yet a way
    to assign contacts to groups from within converse.js itself.
- #123 Show converse.js in the resource assigned to a user. [jcbrand]
- #130 Fixed bootstrap conflicts. [jcbrand]
- #132 Support for [XEP-0280: Message Carbons](https://xmpp.org/extensions/xep-0280.html).
    Configured via [message_carbons](https://conversejs.org/docs/html/configuration.html#message-carbons) [hejazee]
- #176 Add support for caching in sessionStorage as opposed to localStorage. [jcbrand]
- #180 RID and SID undefined [g8g3]
- #191 No messages history [heban]
- #192 Error: xhr_user_search_url is not defined. [jcbrand]
- #195 Chinese translations. [lancelothuxi]
- #196 [Safari v7.0.5] TypeError: Attempted to assign to readonly property. [g8g3]
- #199 Improved Spanish translations [chilicuil]
- #201 Add zh-locale to fix build task [schoetty]

## 0.7.4 (2014-03-05)

**note:**
*This release contains an important security fix. Thanks to Renaud Dubourguais from [Synacktiv](http://synacktiv.com) for reporting the vulnerability.*

- #125 Bugfix: crypto dependencies loaded in wrong order [jcbrand]
- Bugfix: action messages (i.e. /me) didn't work in OTR mode. [jcbrand]
- Security fix: Ensure that message URLs are properly encoded. [jcbrand]

## 0.7.3 (2014-02-23)

- #93 Add API methods exposing the RID and SID values. Can be disabled. [jcbrand]
- #102 Option to enable OTR by default. [Aupajo]
- #103 Option to display a call button in the chatbox toolbar, to allow third-party libraries to provide a calling feature. [Aupajo]
- #108 Japanese Translations [mako09]
- #111 OTR not working when using converse.js with prebinding. [jseidl, jcbrand]
- #114, #124 Hewbrew Translations [GreenLunar]
- #115 Indonesian Translations [priyadi]

## 0.7.2 (2013-12-18)

**note**
*This release contains an important security fix. Thanks to hejsan for reporting the vulnerability.*

- #48 Add event emitter support and emit events. [jcbrand]
- #97 Wrong number of online contacts shown with config option `show_only_online_users`. [jcbrand]
- #100 Make the fetching of vCards optional (enabled by default). [jcbrand]
- Sanitize message text to avoid Javascript injection attacks.  [jcbrand]

## 0.7.1 (2013-11-17)

- Don't load OTR crypto if the browser doesn't have a CSRNG [jcbrand]
- Don't break when crypto libraries aren't defined. [jcbrand]
- Check if canvas is supported before trying to render the user avatar [jcbrand]
- Use newest strophe.muc plugin. Fixes #85 [jcbrand]

**note:**
If you are using the development libraries, you'll need to run ``bower update``
to fetch the newest strophe.muc.plugin (for bugfix of #85).

This release contains 3 different builds:
- converse.min.js
- converse-no-otr.min.js (Without OTR encryption)
- converse-no-locales-no-otr.min.js (Without OTR encryption or any translations)

## 0.7.0 (2013-11-13)

### Important:

This release includes support for [Off-the-record encryption](https://otr.cypherpunks.ca).
For this to work, your browser needs a CSPRNG (Cryptographically secure pseudorandom number generator).

Internet Explorer of all versions doesn't have one at all, neither does older versions of Firefox.

If you need to support older browsers, please download the latest release from the 0.6 bran

#### Features:

- Add a toolbar to the chat boxes [jcbrand]
- Add support for OTR (off-the-record) encryption [jcbrand]
- Add support for smileys [jcbrand]
- Simplified boilerplate markup [jcbrand]
- New configuration settings, `xhr_custom_status_url` and `xhr_user_search_url` [jcbrand]

**note:**
*This release introduces a backward incompatible change. The boilerplate
HTML needed in your webpage for converse.js to work has been reduced to a
single div: `<div id="conversejs"></div>`*

#### Bugfixes:

- #58 Contact's name gets replaced with their JID [jcbrand]
- #81 Requesting contacts appear as pending contacts [jcbrand]

## 0.6.6 (2013-10-16)

- Bugfix: Presence stanza must be sent out after roster has been initialized [jcbrand]
- Bugfix: Don't reconnect while still disconnecting, causes endless authentication loops. [jcbrand]
- Dutch translation [maartenkling]

## 0.6.5 (2013-10-08)

- Fetch vCards asynchronously once a roster contact is added [jcbrand]
- Hungarian translation [w3host]
- Russian translation [bkocherov]
- Update CSS to avoid clash with bootstrap [seocam]
- New config option `allow_muc` toggles multi-user chat (MUC) [jcbrand]
- New config option `allow_contact_requests` toggles user adding [jcbrand]
- New config option `show_only_online_users` [jcbrand]

## 0.6.4 (2013-09-15)

- Add icon for the unavailable chat state. [jcbrand]
- Chat state descriptions weren't translation aware. [jcbrand]
- Clear messages from localStorage when user types "/clear". [jcbrand]
- The 'xa' chat state wasn't being handled properly. [jcbrand]
- Updated pt-BR translations [seocam]
- Updated af and de translations [jcbrand]

## 0.6.3 (2013-09-12)

*NB: This release contains an important security fix. Please don't use older
versions of the 0.6 branch.*

- French translations. [tdesvenain]
- Bugfix: Messages were stored against buddy JID and not own JID. [jcbrand]

## 0.6.2 (2013-08-29)

- Bugfix. The remove icon wasn't appearing in the contacts roster. [jcbrand]
- Bugfix. With auto_subscribe=True, the "Pending Contacts" header didn't disappear
  after a new user was accepted. [jcbrand]

## 0.6.1 (2013-08-28)

- IE9 and IE8 CSS fixes. [jcbrand]
- Bugfix: Pencil icon not visible (for setting status update). [jcbrand]
- Bugfix: RID, JID and SID initialization values were being ignored. [jcbrand]
- Bugfix: Fall back to English if a non-existing locale was specified. [jcbrand]

## 0.6.0 (2013-08-26)

- #39 Documentation for minifying JS is wrong. [jcbrand]
- #41 prebind and show_controlbox_by_default true fails. [jcbrand]
- With prebinding, attaching to the connection now happens inside Converse and
  not as a separate step after initialization. [jcbrand]
- Register presence and message handlers before fetching the roster. Otherwise
  some presence notifications might be missed. [jcbrand]
- Add a debug option (logs to the browser console). [jcbrand]
- Use font icons from http://icomoon.io [jcbrand]
- Added a static mockup to aid CSS/design process. [jcbrand]
- Save language codes with hyphens. Thanks to @seocam. [jcbrand]
- The combined and minified JS file now uses almond and not require.js. [jcbrand]

## 0.5.2 (2013-08-05)

- Important security update. Don't expose the Strophe connection object globally. [jcbrand]

## 0.5.1 (2013-08-04)

- #13, #14: Messages sent between to GTalk accounts weren't being received. [jcbrand]
- #32: Default status was offline when user didn't have contacts. [jcbrand]
- Attach panels to the DOM upon initialize. [jcbrand]

## 0.5.0 (2013-07-30)

- #09 Remove dependency on AMD/require.js [jcbrand]
- #22 Fixed compare operator in strophe.muc [sonata82]
- #23 Add Italian translations [ctrlaltca]
- #24 Add Spanish translations [macagua]
- #25 Using span with css instead of img [matheus-morfi]
- #26 Only the first minute digit shown in chatbox. [jcbrand]
- #28 Add Brazilian Portuguese translations [matheus-morfi]
- Use Bower to manage 3rd party dependencies. [jcbrand]

## 0.4.0 (2013-06-03)

- CSS tweaks: fixed overflowing text in status message and chat rooms list. [jcbrand]
- Bugfix: Couldn't join chat room when clicking from a list of rooms. [jcbrand]
- Add better support for kicking or banning users from chat rooms. [jcbrand]
- Fixed alignment of chat messages in Firefox. [jcbrand]
- More intelligent fetching of vCards. [jcbrand]
- Fixed a race condition bug. Make sure that the roster is populated before sending initial presence. [jcbrand]
- Reconnect automatically when the connection drops. [jcbrand]
- Add support for internationalization. [jcbrand]

## 0.3.0 (2013-05-21)

- Add vCard support [jcbrand]
- Remember custom status messages upon reload. [jcbrand]
- Remove jquery-ui dependency. [jcbrand]
- Use backbone.localStorage to store the contacts roster, open chatboxes and chat messages. [jcbrand]
- Fixed user status handling, which wasn't 100% according to the spec. [jcbrand]
- Separate messages according to day in chats. [jcbrand]
- Add support for specifying the BOSH bind URL as configuration setting. [jcbrand]
- #8 Improve the message counter to only increment when the window is not focused [witekdev]
- Make fetching of list of chat rooms on a server a configuration option. [jcbrand]
- Use service discovery to show all available features on a room. [jcbrand]
- Multi-user chat rooms are now configurable. [jcbrand]

## 0.2.0 (2013-03-28)

- Performance enhancements and general script cleanup [ichim-david]
- Add "Connecting to chat..." info [alecghica]
- Various smaller improvements and bugfixes [jcbrand]

## 0.1.0 (2012-06-12)

- Created [jcbrand]
