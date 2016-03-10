# Backbone SuperRouter

[![Circle CI](https://circleci.com/gh/mypebble/backbone-superrouter.svg?style=svg)](https://circleci.com/gh/mypebble/backbone-superrouter)

[![NPM](https://nodei.co/npm/backbone.superrouter.png)](https://npmjs.org/package/backbone.superrouter)

Backbone Router powerpack

## Usage

SuperRouter replaces the built-in Backbone routing system with a different
way of doing things.

To create a route do the following:

    var SuperRouter = require('backbone.superrouter');
    SuperRouter.Route.create({
      url: "users/:user_id",
      route: function(){
        alert("normal routing stuff here!");
      }
    });

And then you can use the normal `Backbone.history.navigate('users/1', {trigger: true})`
to get to this route.

Any options passed to the navigate function are available inside of the route
(by default) from `this.options`. Also any query parameters (yes they work)
are available from `this.options` (but navigate overrides any) or `this.query`

Note the use of `Route.create` as this creates the route and adds it to the
list of routes in the system.

### Route object

#### Route.create(obj)

Create a route with the specified objects.

Required elements on obj are `url` and `route`.

##### obj.route(...)

The route function. Any url params specified in `url` will be passed as
url parameters (like Backbone does)

##### obj.unroute()

This is called when you are no longer the current route and another route
has been activated. By default this does nothing.

##### obj.url

The url to match on. This is the [same as Backbone.](http://backbonejs.org/#Router-routes)

##### obj.matches(fragment)

Returns true if the route matches fragment. The default works the same as
Backbone, however you can override it if you want to.

By default we put the result in `this.matchedURL`.

##### obj.run(fragment, options)

This is called to run the route if it matched. This function will need to
parse the fragment of any url and query parameters, deal with the
options hash (defaults to putting in `this.options`) and then call the
`obj.run(...)` function.

##### obj.initialize()

Create the route. By default this constructs the regex used to match with

#### Route.extend(objs)

Normal Backbone extend style.

Allows you to create abstract Routes. This useful when doing things such as
creating generic routes (for example if you want the ability to pass a dialog
option to any route etc). This does not require `url` or `route`.

## License

The MIT License (MIT)

Copyright (c) 2015 Joe Simpson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
