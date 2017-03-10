/*!
 * cookie-parser
 * Copyright(c) 2014 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';
var createElement = require('react').createElement;
var React = require("react-router");
var Provider = require("react-redux").Provider;
var renderToString = require("react-dom/server").renderToString;

/**
 * Module exports.
 * @public
 */

module.exports = ssr;

function sequence(items, consumer) {
  const results = [];
  const runner = () => {
    const item = items.shift();
    if (item) {
      return consumer(item)
        .then((result) => {
          results.push(result);
        })
        .then(runner);
    }

    return Promise.resolve(results);
  };
  return runner();
}

function fetchComponentData(store, components, params) {
  const needs = components.reduce((prev, current) => {
    return (current.need || [])
      .concat((current.WrappedComponent && (current.WrappedComponent.need !== current.need) ? current.WrappedComponent.need : []) || [])
      .concat(prev);
  }, []);
  return sequence(needs, need => store.dispatch(need(params, store.getState())));
}

function ssr(config,cb) {
  var routes = config.routes;
  var template = config.template;
  var data = config.data;
  var store = config.store;
  var url = config.url;
    React.match({ routes, location: url }, (err, redirectLocation, renderProps) => {
      if (err) {
        data.error = 'Url Not Found';
        return res.status(500).end(template(data));
      }
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }
      if (!renderProps) {
        return next();
      }
      return fetchComponentData(store, renderProps.components, renderProps.params)
        .then(() => {
          const initialView = renderToString(
            createElement(
              Provider,
              { store: store },
              createElement(React.RouterContext, renderProps)
            )
          );
          let head = {title:"",meta:""};
          const finalState = store.getState();
          data.body = initialView;
          data.head = head;
          data.initialState = JSON.stringify(finalState);
          cb(null,template(data))
        })
        .catch((error) => next(error));
    });
}
