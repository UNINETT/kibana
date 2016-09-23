var config = require('../config');
var elasticsearch = require('elasticsearch');
var logger = require('./logger');
var _ = require('lodash');
var fs = require('fs');
var util = require('util');
var url = require('url');
var uri = _.pick(url.parse(config.elasticsearch, false, true), ['protocol', 'hostname', 'pathname', 'port', 'auth', 'query']);
if (config.kibana.kibana_elasticsearch_username && config.kibana.kibana_elasticsearch_password) {
  uri.auth = util.format('%s:%s', config.kibana.kibana_elasticsearch_username, config.kibana.kibana_elasticsearch_password);
}
if (config.kibana.kibana_oauth_token) {
  uri.headers = { Authorization: 'Bearer ' + config.kibana.kibana_oauth_token };
}

var ssl = { rejectUnauthorized: config.kibana.verify_ssl };

if (config.kibana.kibana_elasticsearch_client_crt && config.kibana.kibana_elasticsearch_client_key) {
  ssl.cert = fs.readFileSync(config.kibana.kibana_elasticsearch_client_crt, 'utf8');
  ssl.key = fs.readFileSync(config.kibana.kibana_elasticsearch_client_key, 'utf8');
}

if (config.kibana.ca) {
  ssl.ca = fs.readFileSync(config.kibana.ca, 'utf8');
}

module.exports = new elasticsearch.Client({
  host: uri,
  ssl: ssl,
  pingTimeout: config.ping_timeout,
  log: function (config) {
    this.error = function (err) {
      logger.error({ err: err });
    };
    this.warning = _.bindKey(logger, 'warn');
    this.info = _.noop;
    this.debug = _.noop;
    this.trace = _.noop;
    this.close = _.noop;
  }
});

