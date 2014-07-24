var Hapi = require('hapi');
var Good = require('good');
// Create a server with a host and port
var server = new Hapi.Server('localhost', 8000);

var quotes = [
  {
    author: 'Audrey Hepburn',
    text: 'Nothing is impossible, the word itself says \'I\'m possible\'!'
  },
  {
    author: 'Walt Disney',
    text: 'You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you'
  },
  {
    author: 'Unknown',
    text: 'Even the greatest was once a beginner. Don\'t be afraid to take that first step.'
  },
  {
    author: 'Neale Donald Walsch',
    text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
  }
];

// Hello World Route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        reply('hello world');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.route({
  method: 'GET',
  path: '/quote/{id?}',
  handler: function(req, reply) {
    if (req.params.id) {
      if (quotes.length <= req.params.id) {
        return reply('No quote found.').code(404);
      }
      return reply(quotes[req.params.id]);
    }
    reply(quotes);
  }
});

server.route({
  method: 'GET',
  path: '/quotes',
  handler: function(req, reply) {
    reply(quotes);
  }
});

server.route({
  method: 'GET',
  path: '/random',
  handler: function(req, reply) {
    reply(quotes[Math.floor(Math.random() * (quotes.length - 1))]);
  }
});

server.route({
  method: 'POST',
  path: '/quote',
  config: {
    handler: function(req, reply) {
      var newQuote = {
        author: req.payload.author
      , text: req.payload.text
      };
      quotes.push(newQuote);
      reply(newQuote);
    },
    validate: {
      payload: {
        author: Hapi.types.String().required()
      , text: Hapi.types.String().required()
      }
    }
  }
});

server.route({
  method: 'DELETE',
  path: '/quote/{id}',
  handler: function(req, reply) {
    if (quotes.length <= req.params.id) {
      return reply('No quote found.').code(404);
    }
    quotes.splice(req.params.id, 1);
    reply(true);
  }
});

server.start(function () {
  console.log('info', 'Server running at: ' + server.info.uri);
});