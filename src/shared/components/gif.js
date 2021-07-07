import SuperGif from 'shared/gif/index.js';
// import SuperGif from 'libgif/libgif.js';
import { CustomElement } from 'shared/components/element.js';
import { api } from "@converse/headless/core";
import { getHyperlinkTemplate } from 'utils/html.js';
import { html } from 'lit';
import { isURLWithImageExtension } from '@converse/headless/utils/url.js';

import './styles/gif.scss';


export default class ConverseGIF extends CustomElement {

    static get properties () {
        return {
            'auto_play': { type: Boolean },
            'control_status': { type: String },
            'src': { type: String },
        }
    }

    constructor () {
        super();
        this.loaded = false;
        this.auto_play = false;
        this.control_status = 'loading';
    }

    render () {
        let overlay_style;
        if (this.canvas) {
            overlay_style = `
                width: ${this.canvas.width+"px"};
                height: ${this.canvas.height+"px"}`;
        } else {
            overlay_style = '';
        }
        const canvas_style = this.canvas ? `margin-top: -${(this.canvas.height/4)+"px"}` : '';
        return html`
            <div class="gifcontrol ${this.control_status}"
                @click="${(ev) => this.onControlsClicked(ev)}"
                style="${overlay_style}">

                <canvas style="${canvas_style}"></canvas>
                <div class="jsgif_toolbar"></div>
            </div>
            ${this.loaded ? '' : html`
                <img class="gif"
                    src="${this.src}"
                    @click=${() => alert('hello')}
                    @error=${() => this.onError()}
                    @load=${() => this._onLoad()}></a>`}`
    }

    initialize () {
        this.loaded = true;
        this.requestUpdate();
    }

    onControlsClicked (ev) {
        ev.preventDefault();
        if (this.control_status === 'playing') {
            this.supergif.pause();
            this.control_status = 'paused';
        } else if (this.control_status === 'paused') {
            this.supergif.play();
            this.control_status = 'playing';
        }
    }

    _onLoad () {
        this.supergif = SuperGif({ 'component': this, 'auto_play': this.auto_play});
        this.supergif.load(() => {
            this.control_status = 'paused';
        });
        this.canvas = this.supergif.get_canvas();
        this.requestUpdate();
    }

    onError () {
        if (isURLWithImageExtension(this.src)) {
            this.setValue(getHyperlinkTemplate(this.src));
        }
    }
}

api.elements.define('converse-gif', ConverseGIF);
