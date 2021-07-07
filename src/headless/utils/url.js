import URI from 'urijs';
import log from '@converse/headless/log';
import { api } from '@converse/headless/core';

function checkTLS (uri) {
    return (
        window.location.protocol === 'http:' ||
        (window.location.protocol === 'https:' && uri.protocol().toLowerCase() === 'https')
    );
}

export function getURI (url) {
    try {
        return url instanceof URI ? url : new URI(url);
    } catch (error) {
        log.debug(error);
        return null;
    }
}

function checkFileTypes (types, url) {
    const uri = getURI(url);
    if (uri === null || !checkTLS(uri)) {
        return false;
    }
    const filename = uri.filename().toLowerCase();
    return !!types.filter(ext => filename.endsWith(ext)).length;
}

function isDomainAllowed (whitelist, url) {
    const uri = getURI(url);
    const subdomain = uri.subdomain();
    const domain = uri.domain();
    const fulldomain = `${subdomain ? `${subdomain}.` : ''}${domain}`;
    return whitelist.includes(domain) || whitelist.includes(fulldomain);
}

export function filterQueryParamsFromURL (url) {
    const paramsArray = api.settings.get('filter_url_query_params');
    if (!paramsArray) return url;
    const parsed_uri = getURI(url);
    return parsed_uri.removeQuery(paramsArray).toString();
}

export function isAudioDomainAllowed (url) {
    const embed_audio = api.settings.get('embed_audio');
    if (!Array.isArray(embed_audio)) {
        return embed_audio;
    }
    try {
        return isDomainAllowed(embed_audio, url);
    } catch (error) {
        log.debug(error);
        return false;
    }
}

export function isVideoDomainAllowed (url) {
    const embed_videos = api.settings.get('embed_videos');
    if (!Array.isArray(embed_videos)) {
        return embed_videos;
    }
    try {
        return isDomainAllowed(embed_videos, url);
    } catch (error) {
        log.debug(error);
        return false;
    }
}

export function isImageDomainAllowed (url) {
    const show_images_inline = api.settings.get('show_images_inline');
    if (!Array.isArray(show_images_inline)) {
        return show_images_inline;
    }
    try {
        return isDomainAllowed(show_images_inline, url);
    } catch (error) {
        log.debug(error);
        return false;
    }
}

export function isURLWithImageExtension (url) {
    return checkFileTypes(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg'], url);
}

export function isGIFURL (url) {
    return checkFileTypes(['.gif'], url);
}

export function isAudioURL (url) {
    return checkFileTypes(['.ogg', '.mp3', '.m4a'], url);
}

export function isVideoURL (url) {
    return checkFileTypes(['.mp4', '.webm'], url);
}

export function isImageURL (url) {
    const regex = api.settings.get('image_urls_regex');
    return regex?.test(url) || isURLWithImageExtension(url);
}

export function isEncryptedFileURL (url) {
    return url.startsWith('aesgcm://');
}
