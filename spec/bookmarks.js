/*global waitUntilPromise */

(function (root, factory) {
    define([
        "jasmine",
        "jquery",
        "mock",
        "test-utils"
        ], factory);
} (this, function (jasmine, $, mock, test_utils) {
    "use strict";
    const $iq = converse.env.$iq,
         $msg = converse.env.$msg,
         Backbone = converse.env.Backbone,
         Strophe = converse.env.Strophe,
         sizzle = converse.env.sizzle,
         _ = converse.env._,
         u = converse.env.utils;

    describe("A chat room", function () {

        it("can be bookmarked", mock.initConverseWithPromises(
                null, ['rosterGroupsFetched'], {},
                async function (done, _converse) {
                
            await test_utils.waitUntilDiscoConfirmed(
                _converse, _converse.bare_jid,
                [{'category': 'pubsub', 'type': 'pep'}],
                ['http://jabber.org/protocol/pubsub#publish-options']
            );
            let sent_stanza, IQ_id;
            const sendIQ = _converse.connection.sendIQ;
            spyOn(_converse.connection, 'sendIQ').and.callFake(function (iq, callback, errback) {
                sent_stanza = iq;
                IQ_id = sendIQ.bind(this)(iq, callback, errback);
            });
            spyOn(_converse.connection, 'getUniqueId').and.callThrough();

            await test_utils.openChatRoom(_converse, 'theplay', 'conference.shakespeare.lit', 'JC');
            var jid = 'theplay@conference.shakespeare.lit';
            const view = _converse.chatboxviews.get(jid);
            spyOn(view, 'renderBookmarkForm').and.callThrough();
            spyOn(view, 'closeForm').and.callThrough();
            await test_utils.waitUntil(() => !_.isNull(view.el.querySelector('.toggle-bookmark')));
            const bookmark = view.el.querySelector('.toggle-bookmark');
            bookmark.click();
            expect(view.renderBookmarkForm).toHaveBeenCalled();

            view.el.querySelector('.button-cancel').click();
            expect(view.closeForm).toHaveBeenCalled();
            expect(u.hasClass('on-button', bookmark), false);

            bookmark.click();
            expect(view.renderBookmarkForm).toHaveBeenCalled();

            /* Client uploads data:
             * --------------------
             *  <iq from='juliet@capulet.lit/balcony' type='set' id='pip1'>
             *      <pubsub xmlns='http://jabber.org/protocol/pubsub'>
             *          <publish node='storage:bookmarks'>
             *              <item id='current'>
             *                  <storage xmlns='storage:bookmarks'>
             *                      <conference name='The Play&apos;s the Thing'
             *                                  autojoin='true'
             *                                  jid='theplay@conference.shakespeare.lit'>
             *                          <nick>JC</nick>
             *                      </conference>
             *                  </storage>
             *              </item>
             *          </publish>
             *          <publish-options>
             *              <x xmlns='jabber:x:data' type='submit'>
             *                  <field var='FORM_TYPE' type='hidden'>
             *                      <value>http://jabber.org/protocol/pubsub#publish-options</value>
             *                  </field>
             *                  <field var='pubsub#persist_items'>
             *                      <value>true</value>
             *                  </field>
             *                  <field var='pubsub#access_model'>
             *                      <value>whitelist</value>
             *                  </field>
             *              </x>
             *          </publish-options>
             *      </pubsub>
             *  </iq>
             */
            expect(view.model.get('bookmarked')).toBeFalsy();
            const form = view.el.querySelector('.chatroom-form');
            form.querySelector('input[name="name"]').value = 'Play&apos;s the Thing';
            form.querySelector('input[name="autojoin"]').checked = 'checked';
            form.querySelector('input[name="nick"]').value = 'JC';

            _converse.connection.IQ_stanzas = [];
            view.el.querySelector('.btn-primary').click();

            await test_utils.waitUntil(() => sent_stanza);
            expect(sent_stanza.toLocaleString()).toBe(
                `<iq from="dummy@localhost/resource" id="${IQ_id}" type="set" xmlns="jabber:client">`+
                    `<pubsub xmlns="http://jabber.org/protocol/pubsub">`+
                        `<publish node="storage:bookmarks">`+
                            `<item id="current">`+
                                `<storage xmlns="storage:bookmarks">`+
                                    `<conference autojoin="true" jid="theplay@conference.shakespeare.lit" name="Play&amp;apos;s the Thing">`+
                                        `<nick>JC</nick>`+
                                    `</conference>`+
                                `</storage>`+
                            `</item>`+
                        `</publish>`+
                        `<publish-options>`+
                            `<x type="submit" xmlns="jabber:x:data">`+
                                `<field type="hidden" var="FORM_TYPE">`+
                                    `<value>http://jabber.org/protocol/pubsub#publish-options</value>`+
                                `</field>`+
                                `<field var="pubsub#persist_items">`+
                                    `<value>true</value>`+
                                `</field>`+
                                `<field var="pubsub#access_model">`+
                                    `<value>whitelist</value>`+
                                `</field>`+
                            `</x>`+
                        `</publish-options>`+
                    `</pubsub>`+
                `</iq>`
            );
            /* Server acknowledges successful storage
             *
             * <iq to='juliet@capulet.lit/balcony' type='result' id='pip1'/>
             */
            const stanza = $iq({
                'to':_converse.connection.jid,
                'type':'result',
                'id':IQ_id
            });
            _converse.connection._dataRecv(test_utils.createRequest(stanza));
            await test_utils.waitUntil(() => view.model.get('bookmarked'));
            expect(view.model.get('bookmarked')).toBeTruthy();
            expect(u.hasClass('on-button', bookmark), true);
            // We ignore this IQ stanza... (unless it's an error stanza), so
            // nothing to test for here.
            done();
        }));


        describe("when publish-options is not supported", function () {

            it("can not be bookmarked if the node can't be configured", mock.initConverseWithPromises(
                null, ['rosterGroupsFetched'], {}, function (done, _converse) {

                test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#create-nodes']
                ).then(function () {
                    var sent_stanza, IQ_id;
                    var sendIQ = _converse.connection.sendIQ;
                    spyOn(_converse.connection, 'sendIQ').and.callFake(function (iq, callback, errback) {
                        sent_stanza = iq;
                        IQ_id = sendIQ.bind(this)(iq, callback, errback);
                    });
                    spyOn(_converse.connection, 'getUniqueId').and.callThrough();

                    test_utils.openChatRoom(_converse, 'theplay', 'conference.shakespeare.lit', 'JC');
                    var jid = 'theplay@conference.shakespeare.lit';
                    var view = _converse.chatboxviews.get(jid);
                    spyOn(view, 'renderBookmarkForm').and.callThrough();
                    spyOn(view, 'closeForm').and.callThrough();

                    test_utils.waitUntil(function () {
                        return !_.isNull(view.el.querySelector('.toggle-bookmark'));
                    }, 300).then(function () {
                        expect(view.model.get('bookmarked')).toBeFalsy();

                        /* Client uploads data:
                         * --------------------
                         *  <iq from='juliet@capulet.lit/balcony' type='set' id='pip1'>
                         *      <pubsub xmlns='http://jabber.org/protocol/pubsub'>
                         *          <publish node='storage:bookmarks'>
                         *              <item id='current'>
                         *                  <storage xmlns='storage:bookmarks'>
                         *                      <conference name='The Play&apos;s the Thing'
                         *                                  autojoin='true'
                         *                                  jid='theplay@conference.shakespeare.lit'>
                         *                          <nick>JC</nick>
                         *                      </conference>
                         *                  </storage>
                         *              </item>
                         *          </publish>
                         *      </pubsub>
                         *  </iq>
                         */
                        var $bookmark = $(view.el).find('.toggle-bookmark');
                        $bookmark[0].click();
                        expect(view.renderBookmarkForm).toHaveBeenCalled();

                        var $form = $(view.el).find('.chatroom-form');
                        $form.find('input[name="name"]').val('Play&apos;s the Thing');
                        $form.find('input[name="autojoin"]').prop('checked', true);
                        $form.find('input[name="nick"]').val('JC');
                        view.el.querySelector('.btn-primary').click();

                        expect(view.model.get('bookmarked')).toBeTruthy();
                        expect(_converse.bookmarks.models.length).toBe(1);
                        expect($bookmark.hasClass('on-button'), true);

                        return test_utils.waitUntil(function () {
                            return sent_stanza.toLocaleString() ===
                                "<iq type='get' from='dummy@localhost/resource' xmlns='jabber:client' id='"+IQ_id+"'>"+
                                    "<pubsub xmlns='http://jabber.org/protocol/pubsub#owner'>" +
                                        "<configure node='storage:bookmarks'/>" +
                                    "</pubsub>" +
                                "</iq>";
                        });
                    }).then(function () {
                        /* Server says that the node may not be configured
                         *
                         * <iq type='error'
                         *      from='hamlet@denmark.lit/elsinore'
                         *      to='pubsub.shakespeare.lit'
                         *      id='config1'>
                         *  <error type='cancel'>
                         *      <not-allowed xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/>
                         *  </error>
                         *  </iq>
                         */
                        var stanza = $iq({
                            'to': _converse.connection.jid,
                            'type': 'error',
                            'id': IQ_id
                        }).c('error', {'type': 'cancel'})
                        .c('not-allowed', {'xmlns': 'urn:ietf:params:xml:ns:xmpp-stanzas'});
                        _converse.connection._dataRecv(test_utils.createRequest(stanza));

                        // TODO: check that the bookmark toggle goes off.

                        return test_utils.waitUntil(function () {
                            return !view.model.get('bookmarked');
                        });
                    }).then(function () {
                        // TODO: show erorr modal
                        expect(_converse.bookmarks.models.length).toBe(0);
                        done();
                    });
                });
            }));

            describe("and no PEP node exists", function () {

                it("can still be bookmarked if the node can be created", mock.initConverseWithPromises(
                    null, ['rosterGroupsFetched'], {}, function (done, _converse) {

                    test_utils.waitUntilDiscoConfirmed(
                        _converse, _converse.bare_jid,
                        [{'category': 'pubsub', 'type': 'pep'}],
                        ['http://jabber.org/protocol/pubsub#create-nodes']
                    ).then(function () {
                        var sent_stanza, IQ_id;
                        var sendIQ = _converse.connection.sendIQ;
                        spyOn(_converse.connection, 'sendIQ').and.callFake(function (iq, callback, errback) {
                            sent_stanza = iq;
                            IQ_id = sendIQ.bind(this)(iq, callback, errback);
                        });
                        spyOn(_converse.connection, 'getUniqueId').and.callThrough();

                        test_utils.openChatRoom(_converse, 'theplay', 'conference.shakespeare.lit', 'JC');
                        var jid = 'theplay@conference.shakespeare.lit';
                        var view = _converse.chatboxviews.get(jid);
                        spyOn(view, 'renderBookmarkForm').and.callThrough();
                        spyOn(view, 'closeForm').and.callThrough();

                        test_utils.waitUntil(function () {
                            return !_.isNull(view.el.querySelector('.toggle-bookmark'));
                        }, 300).then(function () {
                            expect(view.model.get('bookmarked')).toBeFalsy();

                            /* Client uploads data:
                             * --------------------
                             *  <iq from='juliet@capulet.lit/balcony' type='set' id='pip1'>
                             *      <pubsub xmlns='http://jabber.org/protocol/pubsub'>
                             *          <publish node='storage:bookmarks'>
                             *              <item id='current'>
                             *                  <storage xmlns='storage:bookmarks'>
                             *                      <conference name='The Play&apos;s the Thing'
                             *                                  autojoin='true'
                             *                                  jid='theplay@conference.shakespeare.lit'>
                             *                          <nick>JC</nick>
                             *                      </conference>
                             *                  </storage>
                             *              </item>
                             *          </publish>
                             *      </pubsub>
                             *  </iq>
                             */
                            var $bookmark = $(view.el).find('.toggle-bookmark');
                            $bookmark[0].click();
                            expect(view.renderBookmarkForm).toHaveBeenCalled();

                            var $form = $(view.el).find('.chatroom-form');
                            $form.find('input[name="name"]').val('Play&apos;s the Thing');
                            $form.find('input[name="autojoin"]').prop('checked', true);
                            $form.find('input[name="nick"]').val('JC');
                            view.el.querySelector('.btn-primary').click();

                            expect(view.model.get('bookmarked')).toBeTruthy(); // FIXME: this should be reset when bookmarking fails
                            expect($bookmark.hasClass('on-button'), true);

                            return test_utils.waitUntil(function () {
                                return sent_stanza.toLocaleString() ===
                                    "<iq type='get' from='dummy@localhost/resource' xmlns='jabber:client' id='"+IQ_id+"'>"+
                                        "<pubsub xmlns='http://jabber.org/protocol/pubsub#owner'>" +
                                            "<configure node='storage:bookmarks'/>" +
                                        "</pubsub>" +
                                    "</iq>";
                            });
                        }).then(function () {
                            /* Server says that the node doesn't exist.
                             *  <iq type='error'
                             *      from='pubsub.shakespeare.lit'
                             *      to='hamlet@denmark.lit/elsinore'
                             *      id='config1'>
                             *        <error type='cancel'>
                             *          <item-not-found xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/>
                             *        </error>
                             *  </iq>
                             */
                            var stanza = $iq({
                                'to': _converse.connection.jid,
                                'type': 'error',
                                'id': IQ_id
                            }).c('error', {'type': 'cancel'})
                            .c('item-not-found', {'xmlns': 'urn:ietf:params:xml:ns:xmpp-stanzas'});
                            _converse.connection._dataRecv(test_utils.createRequest(stanza));

                            return test_utils.waitUntil(function () {
                                return sent_stanza.nodeTree.getAttribute('type') === 'set';
                            });
                        }).then(function () {
                            // Converse.js creates and configures the node in one go.
                            expect(sent_stanza.toLocaleString()).toBe(
                                "<iq type='set' from='dummy@localhost/resource' xmlns='jabber:client' id='"+IQ_id+"'>"+
                                    "<pubsub xmlns='http://jabber.org/protocol/pubsub'>" +
                                        "<create node='storage:bookmarks'/>" +
                                        "<configure>" +
                                            "<x xmlns='jabber:x:data' type='submit'>"+
                                                "<field var='FORM_TYPE' type='hidden'>"+
                                                    "<value>http://jabber.org/protocol/pubsub#node_config</value>"+
                                                "</field>"+
                                                "<field var='pubsub#access_model'><value>whitelist</value></field>"+
                                                "<field var='pubsub#persist_items'><value>1</value></field>"+
                                            "</x>"+
                                        "</configure>" +
                                    "</pubsub>" +
                                "</iq>");
                            expect(view.model.get('bookmarked')).toBeTruthy();
                            expect(_converse.bookmarks.models.length).toBe(1);
                            done();
                        });
                    });
                }));
            })
        });

        it("will be automatically opened if 'autojoin' is set on the bookmark", mock.initConverseWithPromises(
            null, ['rosterGroupsFetched'], {},
            async function (done, _converse) {

            await test_utils.waitUntilDiscoConfirmed(
                _converse, _converse.bare_jid,
                [{'category': 'pubsub', 'type': 'pep'}],
                ['http://jabber.org/protocol/pubsub#publish-options']
            );
            let jid = 'lounge@localhost';
            _converse.bookmarks.create({
                'jid': jid,
                'autojoin': false,
                'name':  'The Lounge',
                'nick': ' Othello'
            });
            expect(_.isUndefined(_converse.chatboxviews.get(jid))).toBeTruthy();

            jid = 'theplay@conference.shakespeare.lit';
            _converse.bookmarks.create({
                'jid': jid,
                'autojoin': true,
                'name':  'The Play',
                'nick': ' Othello'
            });
            expect(_.isUndefined(_converse.chatboxviews.get(jid))).toBeFalsy();
            done();
        }));


        describe("when bookmarked", function () {

            it("displays that it's bookmarked through its bookmark icon", mock.initConverseWithPromises(
                null, ['rosterGroupsFetched'], {},
                async function (done, _converse) {

                test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#publish-options']
                );
                await test_utils.openChatRoom(_converse, 'lounge', 'localhost', 'dummy');
                const view = _converse.chatboxviews.get('lounge@localhost');
                await test_utils.waitUntil(() => !_.isNull(view.el.querySelector('.toggle-bookmark')));
                var bookmark_icon = view.el.querySelector('.toggle-bookmark');
                expect(_.includes(bookmark_icon.classList, 'button-on')).toBeFalsy();
                view.model.set('bookmarked', true);
                expect(_.includes(bookmark_icon.classList, 'button-on')).toBeTruthy();
                view.model.set('bookmarked', false);
                expect(_.includes(bookmark_icon.classList, 'button-on')).toBeFalsy();
                done();
            }));

            it("can be unbookmarked", mock.initConverseWithPromises(
                null, ['rosterGroupsFetched'], {},
                async function (done, _converse) {

                let sent_stanza, IQ_id;

                await test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#publish-options']
                );
                const sendIQ = _converse.connection.sendIQ;
                await test_utils.openChatRoom(_converse, 'theplay', 'conference.shakespeare.lit', 'JC');

                const jid = 'theplay@conference.shakespeare.lit';
                const view = _converse.chatboxviews.get(jid);
                await test_utils.waitUntil(() => !_.isNull(view.el.querySelector('.toggle-bookmark')));

                spyOn(view, 'toggleBookmark').and.callThrough();
                spyOn(_converse.bookmarks, 'sendBookmarkStanza').and.callThrough();
                view.delegateEvents();

                _converse.bookmarks.create({
                    'jid': view.model.get('jid'),
                    'autojoin': false,
                    'name':  'The Play',
                    'nick': ' Othello'
                });
                expect(_converse.bookmarks.length).toBe(1);
                expect(view.model.get('bookmarked')).toBeTruthy();
                var bookmark_icon = view.el.querySelector('.toggle-bookmark');
                expect(u.hasClass('button-on', bookmark_icon)).toBeTruthy();

                spyOn(_converse.connection, 'sendIQ').and.callFake(function (iq, callback, errback) {
                    sent_stanza = iq;
                    IQ_id = sendIQ.bind(this)(iq, callback, errback);
                });
                spyOn(_converse.connection, 'getUniqueId').and.callThrough();
                bookmark_icon.click();
                expect(view.toggleBookmark).toHaveBeenCalled();
                expect(u.hasClass('button-on', bookmark_icon)).toBeFalsy();
                expect(_converse.bookmarks.length).toBe(0);

                // Check that an IQ stanza is sent out, containing no
                // conferences to bookmark (since we removed the one and
                // only bookmark).
                expect(sent_stanza.toLocaleString()).toBe(
                    `<iq from="dummy@localhost/resource" id="${IQ_id}" type="set" xmlns="jabber:client">`+
                        `<pubsub xmlns="http://jabber.org/protocol/pubsub">`+
                            `<publish node="storage:bookmarks">`+
                                `<item id="current">`+
                                    `<storage xmlns="storage:bookmarks"/>`+
                                `</item>`+
                            `</publish>`+
                            `<publish-options>`+
                                `<x type="submit" xmlns="jabber:x:data">`+
                                    `<field type="hidden" var="FORM_TYPE">`+
                                        `<value>http://jabber.org/protocol/pubsub#publish-options</value>`+
                                    `</field>`+
                                    `<field var="pubsub#persist_items">`+
                                        `<value>true</value>`+
                                    `</field>`+
                                    `<field var="pubsub#access_model">`+
                                        `<value>whitelist</value>`+
                                    `</field>`+
                                `</x>`+
                            `</publish-options>`+
                        `</pubsub>`+
                    `</iq>`
                );
                done();
            }));
        });

        describe("and when autojoin is set", function () {

            it("will be be opened and joined automatically upon login", mock.initConverseWithPromises(
                null, ['rosterGroupsFetched'], {},
                async function (done, _converse) {

                await test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#publish-options']
                );
                spyOn(_converse.api.rooms, 'create').and.callThrough();
                const jid = 'theplay@conference.shakespeare.lit';
                const model = _converse.bookmarks.create({
                    'jid': jid,
                    'autojoin': false,
                    'name':  'The Play',
                    'nick': ''
                });
                expect(_converse.api.rooms.create).not.toHaveBeenCalled();
                _converse.bookmarks.remove(model);
                _converse.bookmarks.create({
                    'jid': jid,
                    'autojoin': true,
                    'name':  'Hamlet',
                    'nick': ''
                });
                expect(_converse.api.rooms.create).toHaveBeenCalled();
                done();
            }));
        });
    });

    describe("Bookmarks", function () {

        it("can be pushed from the XMPP server", mock.initConverseWithPromises(
            ['send'], ['rosterGroupsFetched', 'connected'], {},
            async function (done, _converse) {

            await test_utils.waitUntilDiscoConfirmed(
                _converse, _converse.bare_jid,
                [{'category': 'pubsub', 'type': 'pep'}],
                ['http://jabber.org/protocol/pubsub#publish-options']
            );
            await test_utils.waitUntil(() => _converse.bookmarks);
            // Emit here instead of mocking fetching of bookmarks.
            _converse.emit('bookmarksInitialized');

            /* The stored data is automatically pushed to all of the user's
             * connected resources.
             *
             * Publisher receives event notification
             * -------------------------------------
             * <message from='juliet@capulet.lit'
             *         to='juliet@capulet.lit/balcony'
             *         type='headline'
             *         id='rnfoo1'>
             * <event xmlns='http://jabber.org/protocol/pubsub#event'>
             *     <items node='storage:bookmarks'>
             *     <item id='current'>
             *         <storage xmlns='storage:bookmarks'>
             *         <conference name='The Play&apos;s the Thing'
             *                     autojoin='true'
             *                     jid='theplay@conference.shakespeare.lit'>
             *             <nick>JC</nick>
             *         </conference>
             *         </storage>
             *     </item>
             *     </items>
             * </event>
             * </message>
             */
            var stanza = $msg({
                'from': 'dummy@localhost',
                'to': 'dummy@localhost/resource',
                'type': 'headline',
                'id': 'rnfoo1'
            }).c('event', {'xmlns': 'http://jabber.org/protocol/pubsub#event'})
                .c('items', {'node': 'storage:bookmarks'})
                    .c('item', {'id': 'current'})
                        .c('storage', {'xmlns': 'storage:bookmarks'})
                            .c('conference', {'name': 'The Play&apos;s the Thing',
                                            'autojoin': 'true',
                                            'jid':'theplay@conference.shakespeare.lit'})
                                .c('nick').t('JC');
            _converse.connection._dataRecv(test_utils.createRequest(stanza));
            await test_utils.waitUntil(() => _converse.bookmarks.length);
            expect(_converse.bookmarks.length).toBe(1);
            expect(_converse.chatboxviews.get('theplay@conference.shakespeare.lit')).not.toBeUndefined();
            done();
        }));


        it("can be retrieved from the XMPP server", mock.initConverseWithPromises(
            ['send'], ['chatBoxesFetched', 'roomsPanelRendered', 'rosterGroupsFetched'], {},
            async function (done, _converse) {

            await test_utils.waitUntilDiscoConfirmed(
                _converse, _converse.bare_jid,
                [{'category': 'pubsub', 'type': 'pep'}],
                ['http://jabber.org/protocol/pubsub#publish-options']
            );
            /* Client requests all items
             * -------------------------
             *
             *  <iq from='juliet@capulet.lit/randomID' type='get' id='retrieve1'>
             *  <pubsub xmlns='http://jabber.org/protocol/pubsub'>
             *      <items node='storage:bookmarks'/>
             *  </pubsub>
             *  </iq>
             */
            let IQ_id;
            const call = await test_utils.waitUntil(() =>
                _.filter(
                    _converse.connection.send.calls.all(),
                    call => {
                        const stanza = call.args[0];
                        if (!(stanza instanceof Element) || stanza.nodeName !== 'iq') {
                            return;
                        }
                        if (sizzle('items[node="storage:bookmarks"]', stanza).length) {
                            IQ_id = stanza.getAttribute('id');
                            return true;
                        }
                    }
                ).pop()
            );

            expect(Strophe.serialize(call.args[0])).toBe(
                `<iq from="dummy@localhost/resource" id="${IQ_id}" type="get" xmlns="jabber:client">`+
                '<pubsub xmlns="http://jabber.org/protocol/pubsub">'+
                    '<items node="storage:bookmarks"/>'+
                '</pubsub>'+
                '</iq>');
                
            /*
             * Server returns all items
             * ------------------------
             * <iq type='result'
             *     to='juliet@capulet.lit/randomID'
             *     id='retrieve1'>
             * <pubsub xmlns='http://jabber.org/protocol/pubsub'>
             *     <items node='storage:bookmarks'>
             *     <item id='current'>
             *         <storage xmlns='storage:bookmarks'>
             *         <conference name='The Play&apos;s the Thing'
             *                     autojoin='true'
             *                     jid='theplay@conference.shakespeare.lit'>
             *             <nick>JC</nick>
             *         </conference>
             *         </storage>
             *     </item>
             *     </items>
             * </pubsub>
             * </iq>
             */
            expect(_converse.bookmarks.models.length).toBe(0);

            spyOn(_converse.bookmarks, 'onBookmarksReceived').and.callThrough();
            var stanza = $iq({'to': _converse.connection.jid, 'type':'result', 'id':IQ_id})
                .c('pubsub', {'xmlns': Strophe.NS.PUBSUB})
                    .c('items', {'node': 'storage:bookmarks'})
                        .c('item', {'id': 'current'})
                            .c('storage', {'xmlns': 'storage:bookmarks'})
                                .c('conference', {
                                    'name': 'The Play&apos;s the Thing',
                                    'autojoin': 'true',
                                    'jid': 'theplay@conference.shakespeare.lit'
                                }).c('nick').t('JC').up().up()
                                .c('conference', {
                                    'name': 'Another room',
                                    'autojoin': 'false',
                                    'jid': 'another@conference.shakespeare.lit'
                                }); // Purposefully exclude the <nick> element to test #1043
            _converse.connection._dataRecv(test_utils.createRequest(stanza));
            await test_utils.waitUntil(() => _converse.bookmarks.onBookmarksReceived.calls.count());
            expect(_converse.bookmarks.models.length).toBe(2);
            expect(_converse.bookmarks.findWhere({'jid': 'theplay@conference.shakespeare.lit'}).get('autojoin')).toBe(true);
            expect(_converse.bookmarks.findWhere({'jid': 'another@conference.shakespeare.lit'}).get('autojoin')).toBe(false);
            done();
        }));

        describe("The rooms panel", function () {

            it("shows a list of bookmarks", mock.initConverseWithPromises(
                ['send'], ['rosterGroupsFetched'], {},
                async function (done, _converse) {

                await test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#publish-options']
                );
                test_utils.openControlBox();

                let IQ_id;
                const call = await test_utils.waitUntil(() =>
                    _.filter(
                        _converse.connection.send.calls.all(),
                        call => {
                            const stanza = call.args[0];
                            if (!(stanza instanceof Element) || stanza.nodeName !== 'iq') {
                                return;
                            }
                            if (sizzle('items[node="storage:bookmarks"]', stanza).length) {
                                IQ_id = stanza.getAttribute('id');
                                return true;
                            }
                        }
                    ).pop()
                );
                expect(Strophe.serialize(call.args[0])).toBe(
                    `<iq from="dummy@localhost/resource" id="${IQ_id}" type="get" xmlns="jabber:client">`+
                    '<pubsub xmlns="http://jabber.org/protocol/pubsub">'+
                        '<items node="storage:bookmarks"/>'+
                    '</pubsub>'+
                    '</iq>'
                );

                const stanza = $iq({'to': _converse.connection.jid, 'type':'result', 'id':IQ_id})
                    .c('pubsub', {'xmlns': Strophe.NS.PUBSUB})
                        .c('items', {'node': 'storage:bookmarks'})
                            .c('item', {'id': 'current'})
                                .c('storage', {'xmlns': 'storage:bookmarks'})
                                    .c('conference', {
                                        'name': 'The Play&apos;s the Thing',
                                        'autojoin': 'false',
                                        'jid': 'theplay@conference.shakespeare.lit'
                                    }).c('nick').t('JC').up().up()
                                    .c('conference', {
                                        'name': '1st Bookmark',
                                        'autojoin': 'false',
                                        'jid': 'first@conference.shakespeare.lit'
                                    }).c('nick').t('JC').up().up()
                                    .c('conference', {
                                        'autojoin': 'false',
                                        'jid': 'noname@conference.shakespeare.lit'
                                    }).c('nick').t('JC').up().up()
                                    .c('conference', {
                                        'name': 'Bookmark with a very very long name that will be shortened',
                                        'autojoin': 'false',
                                        'jid': 'longname@conference.shakespeare.lit'
                                    }).c('nick').t('JC').up().up()
                                    .c('conference', {
                                        'name': 'Another room',
                                        'autojoin': 'false',
                                        'jid': 'another@conference.shakespeare.lit'
                                    }).c('nick').t('JC').up().up();
                _converse.connection._dataRecv(test_utils.createRequest(stanza));

                await test_utils.waitUntil(() => document.querySelectorAll('#chatrooms div.bookmarks.rooms-list .room-item').length);
                expect(document.querySelectorAll('#chatrooms div.bookmarks.rooms-list .room-item').length).toBe(5);
                let els = document.querySelectorAll('#chatrooms div.bookmarks.rooms-list .room-item a.list-item-link');
                expect(els[0].textContent).toBe("1st Bookmark");
                expect(els[1].textContent).toBe("Another room");
                expect(els[2].textContent).toBe("Bookmark with a very very long name that will be shortened");
                expect(els[3].textContent).toBe("noname@conference.shakespeare.lit");
                expect(els[4].textContent).toBe("The Play's the Thing");

                spyOn(window, 'confirm').and.returnValue(true);
                document.querySelector('#chatrooms .bookmarks.rooms-list .room-item:nth-child(2) a:nth-child(2)').click();
                expect(window.confirm).toHaveBeenCalled();
                await test_utils.waitUntil(() => document.querySelectorAll('#chatrooms div.bookmarks.rooms-list .room-item').length === 4)
                els = document.querySelectorAll('#chatrooms div.bookmarks.rooms-list .room-item a.list-item-link');
                expect(els[0].textContent).toBe("1st Bookmark");
                expect(els[1].textContent).toBe("Bookmark with a very very long name that will be shortened");
                expect(els[2].textContent).toBe("noname@conference.shakespeare.lit");
                expect(els[3].textContent).toBe("The Play's the Thing");
                done();
            }));


            it("remembers the toggle state of the bookmarks list", mock.initConverseWithPromises(
                ['send'], ['rosterGroupsFetched'], {},
                async function (done, _converse) {

                test_utils.openControlBox();
                await test_utils.waitUntilDiscoConfirmed(
                    _converse, _converse.bare_jid,
                    [{'category': 'pubsub', 'type': 'pep'}],
                    ['http://jabber.org/protocol/pubsub#publish-options']
                );

                let IQ_id;
                const call = await test_utils.waitUntil(() =>
                    _.filter(
                        _converse.connection.send.calls.all(),
                        call => {
                            const stanza = call.args[0];
                            if (!(stanza instanceof Element) || stanza.nodeName !== 'iq') {
                                return;
                            }
                            if (sizzle('items[node="storage:bookmarks"]', stanza).length) {
                                IQ_id = stanza.getAttribute('id');
                                return true;
                            }
                        }
                    ).pop()
                );
                expect(Strophe.serialize(call.args[0])).toBe(
                    `<iq from="dummy@localhost/resource" id="${IQ_id}" type="get" xmlns="jabber:client">`+
                    '<pubsub xmlns="http://jabber.org/protocol/pubsub">'+
                        '<items node="storage:bookmarks"/>'+
                    '</pubsub>'+
                    '</iq>'
                );

                const stanza = $iq({'to': _converse.connection.jid, 'type':'result', 'id':IQ_id})
                    .c('pubsub', {'xmlns': Strophe.NS.PUBSUB})
                        .c('items', {'node': 'storage:bookmarks'})
                            .c('item', {'id': 'current'})
                                .c('storage', {'xmlns': 'storage:bookmarks'});
                _converse.connection._dataRecv(test_utils.createRequest(stanza));

                _converse.bookmarks.create({
                    'jid': 'theplay@conference.shakespeare.lit',
                    'autojoin': false,
                    'name':  'The Play',
                    'nick': ''
                });
                await test_utils.waitUntil(() => $('#chatrooms .bookmarks.rooms-list .room-item:visible').length);
                expect($('#chatrooms .bookmarks.rooms-list').hasClass('collapsed')).toBeFalsy();
                expect($('#chatrooms .bookmarks.rooms-list .room-item:visible').length).toBe(1);
                expect(_converse.bookmarksview.list_model.get('toggle-state')).toBe(_converse.OPENED);
                $('#chatrooms .bookmarks-toggle')[0].click();
                expect($('#chatrooms .bookmarks.rooms-list').hasClass('collapsed')).toBeTruthy();
                expect(_converse.bookmarksview.list_model.get('toggle-state')).toBe(_converse.CLOSED);
                $('#chatrooms .bookmarks-toggle')[0].click();
                expect($('#chatrooms .bookmarks.rooms-list').hasClass('collapsed')).toBeFalsy();
                expect($('#chatrooms .bookmarks.rooms-list .room-item:visible').length).toBe(1);
                expect(_converse.bookmarksview.list_model.get('toggle-state')).toBe(_converse.OPENED);
                done();
            }));
        });
    });

    describe("When hide_open_bookmarks is true and a bookmarked room is opened", function () {

        it("can be closed", mock.initConverseWithPromises(
            null, ['rosterGroupsFetched'],
            { hide_open_bookmarks: true },
            async function (done, _converse) {

            const jid = 'room@conference.example.org';
            await test_utils.waitUntilDiscoConfirmed(
                _converse, _converse.bare_jid,
                [{'category': 'pubsub', 'type': 'pep'}],
                ['http://jabber.org/protocol/pubsub#publish-options']
            );
            // XXX Create bookmarks view here, otherwise we need to mock stanza
            // traffic for it to get created.
            _converse.bookmarksview = new _converse.BookmarksView(
                {'model': _converse.bookmarks}
            );
            _converse.emit('bookmarksInitialized');

            // Check that it's there
            _converse.bookmarks.create({
                'jid': jid,
                'autojoin': false,
                'name':  'The Play',
                'nick': ' Othello'
            });
            expect(_converse.bookmarks.length).toBe(1);
            const room_els = _converse.bookmarksview.el.querySelectorAll(".open-room");
            expect(room_els.length).toBe(1);

            // Check that it disappears once the room is opened
            const bookmark = _converse.bookmarksview.el.querySelector(".open-room");
            bookmark.click();
            await test_utils.waitUntil(() => _converse.chatboxviews.get(jid));
            expect(u.hasClass('hidden', _converse.bookmarksview.el.querySelector(".available-chatroom"))).toBeTruthy();
            // Check that it reappears once the room is closed
            const view = _converse.chatboxviews.get(jid);
            view.close();
            expect(u.hasClass('hidden', _converse.bookmarksview.el.querySelector(".available-chatroom"))).toBeFalsy();
            done();
        }));
    });
}));
