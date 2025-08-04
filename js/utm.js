String.prototype.lastSplitTwain = function(separator, include) { var index = this.lastIndexOf(separator); if (index == -1) return [ '', this.toString() ]; return [ this.substr(0, index), this.substr(index + (!include ? separator.length : 0)) ]; }
String.prototype.splitTwain = function(separator, include) { var index = this.indexOf(separator); if (index == -1) return [ this.toString(), '' ]; return [ this.substr(0, index), this.substr(index + (!include ? separator.length : 0)) ]; }
Object.defineProperty(String.prototype, 'lastSplitTwain', { enumerable: false });
Object.defineProperty(String.prototype, 'splitTwain', { enumerable: false });

function saveDecodeURIComponent(string) { try { return decodeURIComponent(string); } catch(error) { return string; } }

'use strict';

var lucid = {
	query: {
		parse: function(string) {

			if (string[0] == '?') string = string.substr(1);

			return string.split('&').reduce(function(query, param) {
				param = param.splitTwain('=');
				query[saveDecodeURIComponent(param[0])] = saveDecodeURIComponent(param[1]);
				return query;
			}, {});
		},
		sort: function(query) {

			var order = [
				'utm_source',
				'utm_medium',
				'utm_campaign',
				'utm_content',
				'utm_term'
			];

			var keys = [];
			for (var key in query) if (order.indexOf(key) == -1) keys.push(key);
			keys = keys.sort();

			var sort = {}

			for (var i in order) if (typeof query[order[i]] != 'undefined') sort[order[i]] = query[order[i]];
			for (var i in keys) sort[keys[i]] = query[keys[i]];

			return sort;
		},
		stringify: function(query) {

			var params = [];
			for (var key in query) {
				if (query[key] === true || query[key] === '') params.push(encodeURIComponent(key));
				if (query[key] !== true && query[key] || query[key] === 0) params.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
			}
			var string = params.join('&');

			return string;
		}
	},
	url: {
		parse: function(string) {

			var url = {
				hash: '',
				host: '',
				hostname: '',
				password: '',
				pathname: '',
				port: '',
				protocol: '',
				search: '',
				username: '',
			};

			if (!string) return url;

			string = string.splitTwain('#', true);
			url.hash = string[1];
			string = string[0];

			string = string.splitTwain('?', true);
			url.search = string[1];
			string = string[0];

			if (!string) return url;

			string = string.splitTwain('//');
			url.protocol = string[0];
			string = string[1];

			string = string.splitTwain('/', true);
			url.pathname = string[1];
			string = string[0];

			string = string.lastSplitTwain('@');
			url.username = string[0];
			url.hostname = string[1];

			string = url.username.splitTwain(':');
			url.password = string[1];
			url.username = string[0];

			string = url.hostname.splitTwain(':');
			url.port = string[1];
			url.host = url.hostname = string[0];

			return url;
		},
		domain: function(host) {

			host = host.split('.');
			var domain = '.' + host[host.length-2] + '.' + host[host.length-1];
			if (host[host.length-2] == 'com') domain = '.' + host[host.length-3] + domain;

			return domain;
		},
		stringify: function(url) {

			var string = (url.protocol ? (url.protocol + '//') : '') + url.hostname + (url.port ? (':' + url.port) : '') + url.pathname + url.search + url.hash;

			return string;
		}
	},
	cookie: {
		parse: function(string) {

			var cookie = {}

			return cookie;
		},
		options: function(options) {

			if (options === undefined) options = {};

			if (typeof options.expires == 'undefined') {
				options.expires = 180 * 24 * 60 * 60;
			}

			if (typeof options.expires == 'number') {
				var date = new Date();
				date.setTime(date.getTime() + options.expires * 1000);
				options.expires = date.toUTCString();
			}

			if (typeof options.path == 'undefined') {
				options.path = '/';
			}

			if (typeof options.domain == 'undefined') {
				options.domain = lucid.url.domain(window.location.host);
			}

			return options;
		},
		stringify: function(name, value, options) {

			if (options === undefined) options = {};

			var params = [];
			params.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
			for (var option in options) params.push(option + '=' + options[option]);
			var string = params.join('; ');

			return string;
		}
	}
}

function utm(n, c, l, l2, l3) {

	if (n === undefined) n = 'input[name="landing"], meta[name="gtm_name"]';
	if (c === undefined) c = 'advertInfo';
	if (l === undefined) l = [
		'a[href*="fonbet.by"], input[name="link"][value*="fonbet.by"]',
	].join(', ');
	if (l2 === undefined) l2 = 'a[href*="app.adjust."], input[name="link"][value*="app.adjust."]';
	if (l3 === undefined) l3 = 'a[href*="onelink.me"], input[name="link"][value*="onelink.me"]';

	var attrs = {
		A: 'href',
		META: 'content',
		INPUT: 'value'
	};

	var mediums = {
		referral: /.+/,
		organic: /((ya(ndex)?|google)(\.com)?\.\w+|go\.mail\.ru)$/,
		social: /(ok|vk|facebook|twitter|instagramm)\.com$'/,
		'(none)': /^$/
	};

	function query(string) {
		return string.indexOf('&') > -1;
	}

	function parse(search) {
		if (search === undefined) search = window.location.search;
		params = lucid.query.parse(search);
		if (params.promo && query(params.promo)) params.promo = lucid.query.parse(params.promo);
		return params;
	}

	function empty(params) {
		return (params.utm_source === undefined || params.utm_medium === undefined);
	}

	function detect(params, referrer) {
		if (!empty(params)) return params;
		if (referrer === undefined) referrer = document.referrer;
		referrer = lucid.url.parse(referrer);
		if (lucid.url.domain(referrer.host) === lucid.url.domain(window.location.host)) return params;
		params.utm_source = referrer.host || '(direct)';

		for (var medium in mediums)
			if (mediums[medium].test(referrer.host))
				params.utm_medium = medium;

		return params;
	}

	function named(selector, hostname) {
		if (hostname === undefined) hostname = window.location.hostname;
		var name = hostname;
		var pathnames = window.location.pathname.split('/');
		if (pathnames[1] && hostname.indexOf('promo') > -1) name = pathnames[1];
		if (pathnames[2] && pathnames[1] == 'promo') name = pathnames[2];
		var els = select(selector);
		for (var i=0; i<els.length; i++) name = attr(els[i]) || name;
		return name;
	}

	function select(selector) {
		return selector.split(',').map(document.querySelector, document).filter(function(e) { return Boolean(e); });
	}

	function direct(params) {
		return (params.utm_source === '(direct)' && params.utm_medium === '(none)');
	}

	function copy(params) {
		return JSON.parse(JSON.stringify(params));
	}

	function filter(param) {
		return !!param;
	}

	function fixed(params, name, add) {
		if (add === undefined) add = false;
		if (params.utm_term) params.utm_term += '_landing_' + name;
		if (add) {
			if (!params.utm_term) params.utm_term = 'landing_' + name;
			if (!params.partner) params.partner = 'landing_' + name;
		}
		if (direct(params)) {
			params.utm_source = 'landing_' + name;
			params.utm_medium = 'referral';
		}
		return params;
	}

	function cookie(params, name) {
		var value = lucid.query.sort(params);
		value = lucid.query.stringify(value);
		value = encodeURIComponent(value);
		var options = lucid.cookie.options();
		var cookie = lucid.cookie.stringify(name, value, options);
		document.cookie = cookie;
	}

	function links(params, name, selector, callback) {
		var els = document.querySelectorAll(selector) || [];
		for (var i = 0; i < els.length; i++) attr(els[i], callback(params, name, attr(els[i]), backup(els[i])));
	}

	function backup(element) {
		if (!element.backup) element.backup = attr(element);
		return element.backup;
	}

	function attr(element, value) {
		var attr = attrs[element.tagName] || 'innerText';
		if (value) {
			element.attributes[attr] ? element.attributes[attr].value = value : element[attr] = value;
		} else {
			return element.attributes[attr] ? element.attributes[attr].value : element[attr];
		}
	}

	function link(params, name, url, backup) {
		url = lucid.url.parse(url);
		backup = lucid.url.parse(backup);
		search = lucid.query.parse(backup.search);

		var content = search['utm_content'];
		for (var key in params) if (key.indexOf('utm_') > -1 || !search[key]) search[key] = params[key];
		if (content && content != search['utm_content']) search['utm_term'] += (search['utm_term'] ? '_' : '') + content;

		search = lucid.query.sort(search);
		url.search = '?' + lucid.query.stringify(search);
		url = lucid.url.stringify(url);

		return url;
	}

	function link2(params, name, url, backup) {
		url = lucid.url.parse(url);
		backup = lucid.url.parse(backup);
		search = lucid.query.parse(backup.search);

		search.campaign = params.campaign || (params.promo ? params.promo.campaign : null) || name;
		search.adgroup = params.adgroup || (params.promo ? params.promo.adgroup : null) || [
			params.utm_source,
			params.utm_content
		].filter(filter).join('_') || name;
		search.creative = params.creative || (params.promo ? params.promo.creative : null) || [
			params.utm_campaign,
			params.utm_term,
			(params.partner ? 'partner=' + params.partner : null),
			(params['affijet-click'] ? 'affijet_click=' + params['affijet-click'] : null)
		].filter(filter).join('_') || null;

		search = lucid.query.sort(search);
		url.search = '?' + lucid.query.stringify(search);
		url = lucid.url.stringify(url);

		return url;
	}

	function link3(params, name, url, backup) {
		url = lucid.url.parse(url);
		backup = lucid.url.parse(backup);
		search = lucid.query.parse(backup.search);

		search.pid = params.pid || params.utm_source;
		search.c = params.c || [
			params.utm_content,
			params.utm_term
		].filter(filter).join('_') || null;
		search.af_channel = params.c || null;
		search.af_ad = params.af_ad || null;

		search = lucid.query.sort(search);
		url.search = '?' + lucid.query.stringify(search);
		url = lucid.url.stringify(url);

		return url;
	}

	var p = parse();
	p = detect(p);

	var n = named(n);
	var p2 = copy(fixed(p, n));
	p = fixed(p, n, true);

	cookie(p, c);
	links(p, n, l, link);
	links(p2, n, l2, link2);
	links(p2, n, l3, link3);
}

window.document.addEventListener('DOMContentLoaded', function(event) {
	if (window == window.parent) utm();
});