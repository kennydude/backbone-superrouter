window.$ = require('jquery');
var chai = require('chai');
var sinon = require('sinon');
var Backbone = require('backbone');
var SuperRouter = require('../backbone.superrouter');

describe('Should route things normally', function(){
  beforeEach(function(){
    document.location.hash = "thisisnotarealpage";
    Backbone.history.start({});
  });

  afterEach(function(){
    SuperRouter.clear();
    Backbone.history.stop();
    console.log("---");
  });

  it('should navigate normally', function(){
    var testRan = false;
    SuperRouter.Route.create({
      url: "/",
      route: function(){
        testRan = true;
      }
    });

    chai.expect(Backbone.history.navigate("/", {trigger: true})).to.equal(true);
    chai.expect(testRan).to.equal(true);

    Backbone.history.navigate("/12", {trigger: true});
  });
});
