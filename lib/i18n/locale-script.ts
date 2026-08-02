import { LOCALE_STORAGE_KEY } from "./types";

/**
 * Blocking inline script: hide the document before first paint when the
 * saved locale differs from the static default (ms), so React can apply
 * the correct strings without a Malay → English flash.
 */
export const localeInitScript = `(function(){try{var k=${JSON.stringify(LOCALE_STORAGE_KEY)};var l=localStorage.getItem(k);if(l==="en"||l==="ms"){document.documentElement.lang=l;if(l!=="ms"){document.documentElement.dataset.localePending="";document.documentElement.style.visibility="hidden";setTimeout(function(){if(document.documentElement.dataset.localePending!==undefined){document.documentElement.style.visibility="";delete document.documentElement.dataset.localePending;}},1500);}}}catch(e){}})();`;
