import Stream from './stream.js';
import { parseGIF } from './utils.js';


/**
 *  SuperGif
 *
 *  Example usage:
 *
 *      <img src="./example1_preview.gif" rel:animated_src="./example1.gif" width="360" height="360" rel:auto_play="1" />
 *
 *      <script type="text/javascript">
 *          $$('img').each(function (img_tag) {
 *              if (/.*\.gif/.test(img_tag.src)) {
 *                  var rub = new SuperGif({ gif: img_tag } );
 *                  rub.load();
 *              }
 *          });
 *      </script>
 *
 *  Image tag attributes:
 *
 *      rel:animated_src -  If this url is specified, it's loaded into the player instead of src.
 *                          This allows a preview frame to be shown until animated gif data is streamed into the canvas
 *
 *      rel:auto_play -     Defaults to 1 if not specified. If set to zero, a call to the play() method is needed
 *
 *  Constructor options args
 *
 *      gif                 Required. The DOM element of an img tag.
 *      loop_mode            Optional. Setting this to false will force disable looping of the gif.
 *      auto_play             Optional. Same as the rel:auto_play attribute above, this arg overrides the img tag info.
 *      max_width            Optional. Scale images over max_width down to max_width. Helpful with mobile.
 *       on_end                Optional. Add a callback for when the gif reaches the end of a single loop (one iteration). The first argument passed will be the gif HTMLElement.
 *      loop_delay            Optional. The amount of time to pause (in ms) after each single loop (iteration).
 *      draw_while_loading    Optional. Determines whether the gif will be drawn to the canvas whilst it is loaded.
 *      show_progress_bar    Optional. Only applies when draw_while_loading is set to true.
 *
 *  Instance methods
 *
 *      // loading
 *      load( callback )        Loads the gif specified by the src or rel:animated_src sttributie of the img tag into a canvas element and then calls callback if one is passed
 *      load_url( src, callback )    Loads the gif file specified in the src argument into a canvas element and then calls callback if one is passed
 *
 *      // play controls
 *      play -                Start playing the gif
 *      pause -                Stop playing the gif
 *      move_to(i) -        Move to frame i of the gif
 *      move_relative(i) -    Move i frames ahead (or behind if i < 0)
 *
 *      // getters
 *      get_canvas            The canvas element that the gif is playing in. Handy for assigning event handlers to.
 *      get_playing            Whether or not the gif is currently playing
 *      get_loading            Whether or not the gif has finished loading/parsing
 *      get_auto_play        Whether or not the gif is set to play automatically
 *      get_length            The number of frames in the gif
 *      get_current_frame    The index of the currently displayed frame of the gif
 *      get_frames            An array containing the data for all parsed frames
 *      get_duration        Returns the duration of the gif in hundredths of a second (standard for GIF spec)
 *      get_duration_ms        Returns the duration of the gif in milliseconds
 *
 *      For additional customization (viewport inside iframe) these params may be passed:
 *      c_w, c_h - width and height of canvas
 *      vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport
 *
 *      A bonus: few articles to understand what is going on
 *          http://enthusiasms.org/post/16976438906
 *          http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
 *          http://humpy77.deviantart.com/journal/Frame-Delay-Times-for-Animated-GIFs-214150546
 */

export default function SuperGif ( opts ) {
    const options = Object.assign({
        //viewport position
        vp_l: 0,
        vp_t: 0,
        vp_w: null,
        vp_h: null,
        //canvas sizes
        c_w: null,
        c_h: null
    }, opts, { 'is_vp': opts.vp_w && opts.vp_h });

    let stream;
    let hdr;

    let loadError = null;
    let loading = false;

    let transparency = null;
    let delay = null;
    let disposalMethod = null;
    let disposalRestoreFromIdx = null;
    let lastDisposalMethod = null;
    let frame = null;
    let lastImg = null;

    let playing = true;
    const forward = true;

    let ctx_scaled = false;

    let frames = [];
    const frameOffsets = []; // elements have .x and .y properties

    const component = options.component;
    const gif = component.querySelector('img');

    if (typeof options.auto_play == 'undefined')
        options.auto_play = (!gif.getAttribute('rel:auto_play') || gif.getAttribute('rel:auto_play') == '1');

    const onEndListener = (Object.prototype.hasOwnProperty.call(options, 'on_end') ? options.on_end : null);
    const loopDelay = (Object.prototype.hasOwnProperty.call(options, 'loop_delay') ? options.loop_delay : 0);
    const overrideLoopMode = (Object.prototype.hasOwnProperty.call(options, 'loop_mode') ? options.loop_mode : 'auto');
    let drawWhileLoading = (Object.prototype.hasOwnProperty.call(options, 'draw_while_loading') ? options.draw_while_loading : true);
    const showProgressBar = drawWhileLoading ? (Object.prototype.hasOwnProperty.call(options, 'show_progress_bar') ? options.show_progress_bar : true) : false;
    const progressBarHeight = (Object.prototype.hasOwnProperty.call(options, 'progressbar_height') ? options.progressbar_height : 25);
    const progressBarBackgroundColor = (Object.prototype.hasOwnProperty.call(options, 'progressbar_background_color') ? options.progressbar_background_color : 'rgba(255,255,255,0.4)');
    const progressBarForegroundColor = (Object.prototype.hasOwnProperty.call(options, 'progressbar_foreground_color') ? options.progressbar_foreground_color : 'rgba(255,0,22,.8)');

    function clear () {
        transparency = null;
        delay = null;
        lastDisposalMethod = disposalMethod;
        disposalMethod = null;
        frame = null;
    }

    function doParse () {
        try {
            parseGIF(stream, handler);
        } catch (err) {
            doLoadError('parse');
        }
    }

    function setSizes (w, h) {
        canvas.width = w * get_canvas_scale();
        canvas.height = h * get_canvas_scale();
        toolbar.style.minWidth = ( w * get_canvas_scale() ) + 'px';

        tmpCanvas.width = w;
        tmpCanvas.height = h;
        tmpCanvas.style.width = w + 'px';
        tmpCanvas.style.height = h + 'px';
        tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    }

    function setFrameOffset (frame, offset) {
        if (!frameOffsets[frame]) {
            frameOffsets[frame] = offset;
            return;
        }
        if (typeof offset.x !== 'undefined') {
            frameOffsets[frame].x = offset.x;
        }
        if (typeof offset.y !== 'undefined') {
            frameOffsets[frame].y = offset.y;
        }
    }

    function doShowProgress (pos, length, draw) {
        if (draw && showProgressBar) {
            let height = progressBarHeight;
            let left, mid, top, width;
            if (options.is_vp) {
                if (!ctx_scaled) {
                    top = (options.vp_t + options.vp_h - height);
                    left = options.vp_l;
                    mid = left + (pos / length) * options.vp_w;
                    width = canvas.width;
                } else {
                    top = (options.vp_t + options.vp_h - height) / get_canvas_scale();
                    height = height / get_canvas_scale();
                    left = (options.vp_l / get_canvas_scale() );
                    mid = left + (pos / length) * (options.vp_w / get_canvas_scale());
                    width = canvas.width / get_canvas_scale();
                }
                //some debugging, draw rect around viewport
                if (false) { // eslint-disable-line
                    let l, t, w, h;
                    if (!ctx_scaled) {
                        l = options.vp_l;
                        t = options.vp_t;
                        w = options.vp_w;
                        h = options.vp_h;
                    } else {
                        l = options.vp_l/get_canvas_scale();
                        t = options.vp_t/get_canvas_scale();
                        w = options.vp_w/get_canvas_scale();
                        h = options.vp_h/get_canvas_scale();
                    }
                    ctx.rect(l,t,w,h);
                    ctx.stroke();
                }
            }
            else {
                top = (canvas.height - height) / (ctx_scaled ? get_canvas_scale() : 1);
                mid = ((pos / length) * canvas.width) / (ctx_scaled ? get_canvas_scale() : 1);
                width = canvas.width / (ctx_scaled ? get_canvas_scale() : 1 );
                height /= ctx_scaled ? get_canvas_scale() : 1;
            }

            ctx.fillStyle = progressBarBackgroundColor;
            ctx.fillRect(mid, top, width - mid, height);

            ctx.fillStyle = progressBarForegroundColor;
            ctx.fillRect(0, top, mid, height);
        }
    }

    function doLoadError (originOfError) {
        function drawError () {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.moveTo(0, 0);
            ctx.lineTo(options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
            ctx.moveTo(0, options.c_h ? options.c_h : hdr.height);
            ctx.lineTo(options.c_w ? options.c_w : hdr.width, 0);
            ctx.stroke();
        }

        loadError = originOfError;
        hdr = {
            width: gif.width,
            height: gif.height
        }; // Fake header.
        frames = [];
        drawError();
    }

    function doHdr (_hdr) {
        hdr = _hdr;
        setSizes(hdr.width, hdr.height)
    }

    function doGCE (gce) {
        pushFrame();
        clear();
        transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
        delay = gce.delayTime;
        disposalMethod = gce.disposalMethod;
        // We don't have much to do with the rest of GCE.
    }

    function pushFrame () {
        if (!frame) return;
        frames.push({
            data: frame.getImageData(0, 0, hdr.width, hdr.height),
            delay: delay
        });
        frameOffsets.push({ x: 0, y: 0 });
    }

    function doImg (img) {
        if (!frame) frame = tmpCanvas.getContext('2d');

        const currIdx = frames.length;

        //ct = color table, gct = global color table
        const ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

        /*
        Disposal method indicates the way in which the graphic is to
        be treated after being displayed.

        Values :    0 - No disposal specified. The decoder is
                        not required to take any action.
                    1 - Do not dispose. The graphic is to be left
                        in place.
                    2 - Restore to background color. The area used by the
                        graphic must be restored to the background color.
                    3 - Restore to previous. The decoder is required to
                        restore the area overwritten by the graphic with
                        what was there prior to rendering the graphic.

                        Importantly, "previous" means the frame state
                        after the last disposal of method 0, 1, or 2.
        */
        if (currIdx > 0) {
            if (lastDisposalMethod === 3) {
                // Restore to previous
                // If we disposed every frame including first frame up to this point, then we have
                // no composited frame to restore to. In this case, restore to background instead.
                if (disposalRestoreFromIdx !== null) {
                    frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
                } else {
                    frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                }
            } else {
                disposalRestoreFromIdx = currIdx - 1;
            }

            if (lastDisposalMethod === 2) {
                // Restore to background color
                // Browser implementations historically restore to transparent; we do the same.
                // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
            }
        }
        // else, Undefined/Do not dispose.
        // frame contains final pixel data from the last frame; do nothing

        //Get existing pixels for img region after applying disposal method
        const imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);

        //apply color table colors
        img.pixels.forEach(function (pixel, i) {
            // imgData.data === [R,G,B,A,R,G,B,A,...]
            if (pixel !== transparency) {
                imgData.data[i * 4 + 0] = ct[pixel][0];
                imgData.data[i * 4 + 1] = ct[pixel][1];
                imgData.data[i * 4 + 2] = ct[pixel][2];
                imgData.data[i * 4 + 3] = 255; // Opaque.
            }
        });

        frame.putImageData(imgData, img.leftPos, img.topPos);

        if (!ctx_scaled) {
            ctx.scale(get_canvas_scale(),get_canvas_scale());
            ctx_scaled = true;
        }

        // We could use the on-page canvas directly, except that we draw a progress
        // bar for each image chunk (not just the final image).
        if (drawWhileLoading) {
            ctx.drawImage(tmpCanvas, 0, 0);
            drawWhileLoading = options.auto_play;
        }

        lastImg = img;
    }

    const player = (function () {
        let i = -1;
        let iterationCount = 0;

        /**
         * Gets the index of the frame "up next".
         * @returns {number}
         */
        function getNextFrameNo () {
            const delta = (forward ? 1 : -1);
            return (i + delta + frames.length) % frames.length;
        }

        function stepFrame (amount) { // XXX: Name is confusing.
            i = i + amount;

            putFrame();
        }

        const step = (function () {
            let stepping = false;

            function completeLoop () {
                if (onEndListener !== null)
                    onEndListener(gif);
                iterationCount++;

                if (overrideLoopMode !== false || iterationCount < 0) {
                    doStep();
                } else {
                    stepping = false;
                    playing = false;
                }
            }

            function doStep () {
                stepping = playing;
                if (!stepping) return;

                stepFrame(1);
                let delay = frames[i].delay * 10;
                if (!delay) delay = 100; // FIXME: Should this even default at all? What should it be?

                const nextFrameNo = getNextFrameNo();
                if (nextFrameNo === 0) {
                    delay += loopDelay;
                    setTimeout(completeLoop, delay);
                } else {
                    setTimeout(doStep, delay);
                }
            }

            return function () {
                if (!stepping) setTimeout(doStep, 0);
            };
        }());

        function putFrame () {
            i = parseInt(i, 10);

            if (i > frames.length - 1){
                i = 0;
            }

            if (i < 0){
                i = 0;
            }

            const offset = frameOffsets[i];

            tmpCanvas.getContext("2d").putImageData(frames[i].data, offset.x, offset.y);
            ctx.globalCompositeOperation = "copy";
            ctx.drawImage(tmpCanvas, 0, 0);
        }

        function play () {
            playing = true;
            step();
        }

        const pause = function () {
            playing = false;
        };


        return {
            init: function () {
                if (loadError) return;

                if ( ! (options.c_w && options.c_h) ) {
                    ctx.scale(get_canvas_scale(),get_canvas_scale());
                }

                if (options.auto_play) {
                    step();
                }
                else {
                    i = 0;
                    putFrame();
                }
            },
            step: step,
            play: play,
            pause: pause,
            playing: playing,
            move_relative: stepFrame,
            current_frame: function() { return i; },
            length: function() { return frames.length },
            move_to: function ( frame_idx ) {
                i = frame_idx;
                putFrame();
            }
        }
    }());

    function doDecodeProgress (draw) {
        doShowProgress(stream.pos, stream.data.length, draw);
    }

    function doNothing () {}

    /**
     * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
     *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
     *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
     */
    function withProgress (fn, draw) {
        return function (block) {
            fn(block);
            doDecodeProgress(draw);
        };
    }


    const handler = {
        hdr: withProgress(doHdr),
        gce: withProgress(doGCE),
        com: withProgress(doNothing),
        // I guess that's all for now.
        app: {
            // TODO: Is there much point in actually supporting iterations?
            NETSCAPE: withProgress(doNothing)
        },
        img: withProgress(doImg, true),
        eof: function () {
            //toolbar.style.display = '';
            pushFrame();
            doDecodeProgress(false);
            if ( ! (options.c_w && options.c_h) ) {
                canvas.width = hdr.width * get_canvas_scale();
                canvas.height = hdr.height * get_canvas_scale();
            }
            player.init();
            loading = false;
            if (load_callback) {
                load_callback(gif);
            }

        }
    };

    let canvas, ctx, toolbar, tmpCanvas;
    let initialized = false;
    let load_callback = false;

    function init () {
        toolbar = component.querySelector('.jsgif_toolbar');
        canvas = component.querySelector('canvas');
        ctx = canvas.getContext('2d');
        tmpCanvas = document.createElement('canvas');
        toolbar.style.minWidth = gif.width + 'px';
        if (options.c_w && options.c_h) {
            setSizes(options.c_w, options.c_h);
        }
        component.initialize();
        initialized = true;
    }

    function get_canvas_scale () {
        let scale;
        if (options.max_width && hdr && hdr.width > options.max_width) {
            scale = options.max_width / hdr.width;
        }
        else {
            scale = 1;
        }
        return scale;
    }

    function load_setup (callback) {
        if (loading) return false;
        if (callback) load_callback = callback;
        else load_callback = false;

        loading = true;
        frames = [];
        clear();
        disposalRestoreFromIdx = null;
        lastDisposalMethod = null;
        frame = null;
        lastImg = null;

        return true;
    }

    function calculateDuration () {
        return frames.reduce(function(duration, frame) {
            return duration + frame.delay;
        }, 0);
    }

    return {
        // play controls
        play: player.play,
        pause: player.pause,
        move_relative: player.move_relative,
        move_to: player.move_to,

        // getters for instance vars
        get_playing      : function() { return playing },
        get_canvas       : function() { return canvas },
        get_canvas_scale : function() { return get_canvas_scale() },
        get_loading      : function() { return loading },
        get_auto_play    : function() { return options.auto_play },
        get_length       : function() { return player.length() },
        get_frames       : function() { return frames },
        get_duration     : function() { return calculateDuration() },
        get_duration_ms  : function() { return calculateDuration() * 10 },
        get_current_frame: function() { return player.current_frame() },
        load_url: function(src,callback){
            if (!load_setup(callback)) return;

            const h = new XMLHttpRequest();
            h.open('GET', src, true);

            if ('overrideMimeType' in h) {
                h.overrideMimeType('text/plain; charset=x-user-defined');
            }
            h.onloadstart = function () {
                // Wait until connection is opened to replace the gif element with a canvas to avoid a blank img
                if (!initialized) init();
            };
            h.onload = function () {
                if (this.status != 200) {
                    doLoadError('xhr - response');
                }
                let data = this.response;
                if (data.toString().indexOf("ArrayBuffer") > 0) {
                    data = new Uint8Array(data);
                }
                stream = new Stream(data);
                setTimeout(doParse, 0);
            };
            h.onprogress = function (e) {
                if (e.lengthComputable) doShowProgress(e.loaded, e.total, true);
            };
            h.onerror = function() { doLoadError('xhr'); };
            h.send();
        },
        load: function (callback) {
            this.load_url(gif.getAttribute('rel:animated_src') || gif.src,callback);
        },
        load_raw: function(arr, callback) {
            if (!load_setup(callback)) return;
            if (!initialized) init();
            stream = new Stream(arr);
            setTimeout(doParse, 0);
        },
        set_frame_offset: setFrameOffset
    };
}
