# react-express-ssr

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

You may reander HTML from `sever` by setup very less configuration and you may set list of action that you want to initially dispatch for setup your store before render HTML.

## Installation

```sh
$ npm install react-express-ssr
```

## API

```js
var express      = require('express')
var ssr = require('react-express-ssr')

var app = express()
app.get('*', (req, res, next) => {
    ssr(config,(err,html)=>{
        if(err) console.log(err);
        res.send(html);
  });
});

```

### ssr(config, callback)

- `config` a object of configuration that must have following keys:
    - `routes` a react route what you would like to render from server.
    eg: <Route path='/'  component={App}>......</Router>
    - `template` a compiled template may be in jade or ejs
    eg: 
        - For `jade template`
            jade.compile(require('./view/index.jade.js'))
        - For `ejs template`
            ejs.compile(require('./view/index.ejs.js'))
    - `store` must be your store with initial values of store state,that will be update after server side rendering.
     - `data` must be an object proive help to render dynamic data in your template.
     

### Need List

If you want to dispatch actions at the time of server side rendering, you need to define the list of action in an array known as "need".
- `Eg:`
 ```js
import { getMediaInfoAction } from './actions/getMediaInfoAction';
    class App extends Component {
        .........
    }
// All action of this list will be fire from server side rendering. just like App Component you may also use it for child Components as well
    App.need = [
        getMediaInfoAction,
    ];
```

## Example

```js
var express = require('express')
var ssr = require('react-express-ssr')
import routes from './routes';

var app = express()
app.get('*', (req, res, next) => {
const config = {
  routes: routes,
  template:  ejs.compile(require('./view/index.ejs.js')),
  url: req.url,
  store: configureStore(),
  data:{
    title: 'Home Page',
    apikey : '123xxxxxxx552',
  }
};
    ssr(config,(err,html)=>{
        if(err) console.log(err);
        res.send(html);
  });
});

```

## Template File :
- `Ejs Template File` should look like this.

```js
// Exporting ejs template as string for further compilation
// is a hack to work around webpack's serverside bundling
module.exports = `
<html>
<body>
<h1>Heading..</h1>
<%- body %>
</body>
`;

```
### [MIT Licensed](LICENSE)

[npm-image]: https://img.shields.io/npm/v/react-express-ssr.svg
[npm-url]: https://npmjs.org/package/react-express-ssr
[node-version-image]: https://img.shields.io/node/v/react-express-ssr.svg
[node-version-url]: https://nodejs.org/en/download
[travis-image]: https://img.shields.io/travis/expressjs/react-express-ssr/master.svg
[travis-url]: https://travis-ci.org/expressjs/react-express-ssr
[coveralls-image]: https://img.shields.io/coveralls/expressjs/react-express-ssr/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/react-express-ssr?branch=master
[downloads-image]: https://img.shields.io/npm/dm/react-express-ssr.svg
[downloads-url]: https://npmjs.org/package/react-express-ssr

