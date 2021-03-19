import "./message";
import dayjs from 'dayjs';
import tpl_new_day from "templates/new_day.js";
import { CustomElement } from 'components/element.js';
import { _converse, api } from "@converse/headless/core";
import { html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';

const tpl_message = (o) => html`
    <converse-chat-message
        .hats=${o.hats}
        .model=${o.model}
        ?correcting=${o.correcting}
        ?editable=${o.editable}
        ?has_mentions=${o.has_mentions}
        ?is_delayed=${o.is_delayed}
        ?is_encrypted=${!!o.is_encrypted}
        ?is_first_unread=${o.is_first_unread}
        ?is_me_message=${o.is_me_message}
        ?is_only_emojis=${o.is_only_emojis}
        ?is_retracted=${o.is_retracted}
        ?is_spoiler=${o.is_spoiler}
        ?is_spoiler_visible=${o.is_spoiler_visible}
        ?retractable=${o.retractable}
        edited=${o.edited || ''}
        error=${o.error || ''}
        error_text=${o.error_text || ''}
        filename=${o.filename || ''}
        filesize=${o.filesize || ''}
        from=${o.from}
        message_type=${o.type || ''}
        moderated_by=${o.moderated_by || ''}
        moderation_reason=${o.moderation_reason || ''}
        msgid=${o.msgid}
        occupant_affiliation=${o.model.occupant ? o.model.occupant.get('affiliation') : ''}
        occupant_role=${o.model.occupant ? o.model.occupant.get('role') : ''}
        oob_url=${o.oob_url || ''}
        pretty_type=${o.pretty_type}
        progress=${o.progress || 0 }
        reason=${o.reason || ''}
        received=${o.received || ''}
        retry_event_id=${o.retry_event_id || ''}
        sender=${o.sender}
        spoiler_hint=${o.spoiler_hint || ''}
        subject=${o.subject || ''}
        time=${o.time}
        unfurl_metadata=${o.unfurl_metadata}
        username=${o.username}></converse-chat-message>
`;


// Return a TemplateResult indicating a new day if the passed in message is
// more than a day later than its predecessor.
function getDayIndicator (model) {
    const models = model.collection.models;
    const idx = models.indexOf(model);
    const prev_model =  models[idx-1];
    if (!prev_model || dayjs(model.get('time')).isAfter(dayjs(prev_model.get('time')), 'day')) {
        const day_date = dayjs(model.get('time')).startOf('day');
        return tpl_new_day({
            'type': 'date',
            'time': day_date.toISOString(),
            'datestring': day_date.format("dddd ll").replace(',', '')
        });
    }
}
// This is set to _converse so that it can be overriden. An attempt was made to use
// a hook instead, but hook returns a promise and it forces the asynchronicity up
// to the render method.
_converse.getHats = function (model) {
    if (model.get('type') === 'groupchat') {
        const allowed_hats = api.settings.get('muc_hats').filter(hat => hat).map((hat) => (hat.toLowerCase()));
        let vcard_roles = []
        if (allowed_hats.includes('vcard_roles')) {
            vcard_roles = model.vcard ? model.vcard.get('role') : null;
            vcard_roles = vcard_roles ? vcard_roles.split(',').filter(hat => hat).map((hat) => ({title: hat})) : [];
        }
        const muc_role = model.occupant ? [model.occupant.get('role')] : [];
        const muc_affiliation = model.occupant ? [model.occupant.get('affiliation')] : [];

        const affiliation_role_hats = [...muc_role, ...muc_affiliation]
            .filter(hat => hat).filter((hat) => (allowed_hats.includes(hat.toLowerCase())))
            .map((hat) => ({title: hat}));
        const hats = allowed_hats.includes('xep317') ? model.occupant?.get('hats') || [] : [];
        return [...hats, ...vcard_roles, ...affiliation_role_hats];
    }
    return [];
}


export function getDerivedMessageProps (chatbox, model) {
    const is_groupchat = model.get('type') === 'groupchat';
    return {
        'has_mentions': is_groupchat && model.get('sender') === 'them' && chatbox.isUserMentioned(model),
        'hats': _converse.getHats(model),
        'is_first_unread': chatbox.get('first_unread_id') === model.get('id'),
        'is_me_message': model.isMeCommand(),
        'is_retracted': model.get('retracted') || model.get('moderated') === 'retracted',
        'username': model.getDisplayName(),
    }
}


export default class MessageHistory extends CustomElement {

    static get properties () {
        return {
            model: { type: Object},
            messages: { type: Array}
        }
    }

    render () {
        const msgs = this.messages;
        return msgs.length ? html`${repeat(msgs, m => m.get('id'), m => this.renderMessage(m)) }` : '';
    }

    renderMessage (model) {
        if (model.get('dangling_retraction') || model.get('is_only_key')) {
            return '';
        }
        const day = getDayIndicator(model);
        const templates = day ? [day] : [];
        const message = tpl_message(
            Object.assign(
                model.toJSON(),
                getDerivedMessageProps(this.model, model),
                { model }
            )
        );
        return [...templates, message];
    }
}

api.elements.define('converse-message-history', MessageHistory);
