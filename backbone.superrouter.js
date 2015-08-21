var Backbone = require('backbone');
var SuperRouter = {};
var _ = require('underscore');

Backbone.history.routeObjects = [];

Backbone.history.navigate = function(fragment, options) {
  // We have to override Backbone's existing navigate by copying it :(
  if (!History.started) return false;
  if (!options || options === true) options = {trigger: !!options};

  // Normalize the fragment.
  fragment = this.getFragment(fragment || '');

  // Don't include a trailing slash on the root.
  var root = this.root;
  if (fragment === '' || fragment.charAt(0) === '?') {
    root = root.slice(0, -1) || '/';
  }
  var url = root + fragment;

  // Strip the hash and decode for matching.
  fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

  if (this.fragment === fragment) return;
  this.fragment = fragment;

  // If pushState is available, we use it to set the fragment as a real URL.
  if (this._usePushState) {
    this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

    // If hash changes haven't been explicitly disabled, update the hash
    // fragment to store history.
  } else if (this._wantsHashChange) {
    this._updateHash(this.location, fragment, options.replace);
    if (this.iframe && (fragment !== this.getHash(this.iframe.contentWindow))) {
      var iWindow = this.iframe.contentWindow;

      // Opening and closing the iframe tricks IE7 and earlier to push a
      // history entry on hash-tag change.  When replace is true, we don't
      // want this.
      if (!options.replace) {
        iWindow.document.open();
        iWindow.document.close();
      }

      this._updateHash(iWindow.location, fragment, options.replace);
    }

  // If you've told us that you explicitly don't want fallback hashchange-
  // based history, then `navigate` becomes a page refresh.
  } else {
    return this.location.assign(url);
  }
  if (options.trigger) return this.loadUrl(fragment, options);
};

Backbone.history.loadUrl = function(fragment, options){
  console.log("overriden ", JSON.stringify(fragment));
  return _.some(Backbone.history.routeObjects, function(route){
    if(route.matches(fragment)){
      route.route();
      return true;
    }
    return false;
  });
};

var Route = SuperRouter.Route = function(){};

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

_.extend(Route.prototype, {
  route: function(){
    throw new Exception("Route.route() was not implemented");
  },
  url: null,
  matches: function(fragment){
    if(this.url == null){
      console.warn("Route.url was not overriden!");
      return false;
    }

    return this.regex.test(fragment)
  },
  initialize: function(){
    var route = this.url.replace(escapeRegExp, '\\$&')
                 .replace(optionalParam, '(?:$1)?')
                 .replace(namedParam, function(match, optional) {
                   return optional ? match : '([^/?]+)';
                 })
                 .replace(splatParam, '([^?]*?)');
    this.regex = new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  }
});

Route.extend = Backbone.Model.extend; // Use backbone's extend function

// Create a new Route
Route.create = function(opts){
  var route = new this();
  _.extend(route, opts);
  Backbone.history.routeObjects.push(route);
  route.initialize();
  return route;
};

// Clear all routes
Route.clear = SuperRouter.clear = function(){
  Backbone.history.routeObjects = [];
};


module.exports = SuperRouter;
