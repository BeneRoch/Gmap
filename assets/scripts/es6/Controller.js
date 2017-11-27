/* jshint esnext: true */
import {$document, $window, $html, $body} from './utils/environment';
/**
 * Abstract Module
 */
export default class {
    constructor(options) {
        this.$document = $document;
        this.$window = $window;
        this.$html = $html;
        this.$body = $body;
    }

    init() {
    }

    destroy() {
    }
}
