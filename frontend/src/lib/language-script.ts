import { resources } from './locales'

// Runs in <head> before hydration, like themeScript. Only the locale codes are
// embedded, not translation bundles or untrusted localStorage values.
export const languageScript = `
(function() {
  var language = 'en-US';
  var preference;
  try { preference = localStorage.getItem('i18nextLng'); } catch (e) {}
  preference = preference || (navigator.languages && navigator.languages[0]) || navigator.language;
  try {
    var code = Intl.getCanonicalLocales(preference)[0];
    var available = ${JSON.stringify(Object.keys(resources))};
    // Match i18next's language/script/base hierarchy, then its English fallback.
    var parts = code.split('-');
    var script = parts.length > 2 && parts[parts.length - 2] !== 'x'
      ? parts.slice(0, -1).join('-') : '';
    language = [code, script, parts[0], 'en-US'].find(function(candidate) {
      return available.indexOf(candidate) !== -1;
    }) || 'en-US';
  } catch (e) {}
  document.documentElement.lang = language;
  document.documentElement.dir = language.startsWith('ar') ? 'rtl' : 'ltr';
})();
`
