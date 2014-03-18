/**
 * jTemplates 0.8.1 (http://jtemplates.tpython.com)
 * Copyright (c) 2007-2012 Tomasz Gloc (http://www.tpython.com)
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and/or GPL (GPL-LICENSE.txt) licenses.
 *
 * Id: $Id: jquery-jtemplates_uncompressed.js 189 2011-11-27 14:46:09Z tom $
 */
 
 /**
 * @fileOverview Template engine in JavaScript.
 * @name jTemplates
 * @author Tomasz Gloc
 * @date $Date: 2011-11-27 15:46:09 +0100 (N, 27 lis 2011) $
 */


if(window.jQuery && !window.jQuery.createTemplate) {(function(jQuery) {
	
	/**
	 * [abstract]
	 * @name BaseNode
	 * @class Abstract node. [abstract]
	 */
	
	/**
	 * Process node and get the html string. [abstract]
	 * @name get
	 * @function
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 * @memberOf BaseNode
	 */
	
	/**
	 * [abstract]
	 * @name BaseArray
	 * @augments BaseNode
	 * @class Abstract array/collection. [abstract]
	 */
	
	/**
	 * Add node 'e' to array.
	 * @name push
	 * @function
	 * @param {BaseNode} e a node
	 * @memberOf BaseArray
	 */
	
	/**
	 * See (http://jquery.com/).
	 * @name jQuery
	 * @class jQuery Library (http://jquery.com/)
	 */
	
	/**
	 * See (http://jquery.com/)
	 * @name fn
	 * @class jQuery Library (http://jquery.com/)
	 * @memberOf jQuery
	 */
	
	
	/**
	 * Create new template from string s.
	 * @name Template
	 * @class A template or multitemplate.
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings.
	 * @config {boolean} [disallow_functions] Do not allow use function in data (default: true).
	 * @config {boolean} [filter_data] Enable filter data using escapeHTML (default: true).
	 * @config {boolean} [filter_params] Enable filter parameters using escapeHTML (default: false).
	 * @config {boolean} [runnable_functions] Automatically run function (from data) inside {} [default: false].
	 * @config {boolean} [clone_data] Clone input data [default: true]
	 * @config {boolean} [clone_params] Clone input parameters [default: true]
	 * @config {Function} [f_cloneData] Function used to data cloning
	 * @config {Function} [f_escapeString] Function used to escape strings
	 * @config {Function} [f_parseJSON] Function used to parse JSON
	 * @augments BaseNode
	 */
	var Template = function(s, includes, settings) {
		this._tree = [];
		this._param = {};
		this._includes = null;
		this._templates = {};
		this._templates_code = {};
		this._maintemplate = null;
		
		//default parameters
		this.settings = jQuery.extend({
			disallow_functions: false,
			filter_data: true,
			filter_params: false,
			runnable_functions: false,
			clone_data: true,
			clone_params: true
		}, settings);
		
		//set handlers
		this.f_cloneData = (this.settings.f_cloneData !== undefined) ? (this.settings.f_cloneData) : (TemplateUtils.cloneData);
		this.f_escapeString = (this.settings.f_escapeString !== undefined) ? (this.settings.f_escapeString) : (TemplateUtils.escapeHTML);
		this.f_parseJSON = (this.settings.f_parseJSON !== undefined) ? (this.settings.f_parseJSON) : ((this.settings.disallow_functions) ? (jQuery.parseJSON) : (TemplateUtils.parseJSON));
		
		if(s == null) {
			return;
		}
		
		//split multiteplate
		this.splitTemplates(s, includes);
		
		if(s) {
			//set main template
			this.setTemplate(this._templates_code['MAIN'], includes, this.settings, this);
		}
		
		this._templates_code = null;
	};
	
	/**
	 * jTemplates version
	 * @type string
	 */
	Template.prototype.version = '0.8.1';
	
	/**
	 * Debug mode (all errors are on), default: off
	 * @type Boolean
	 */
	Template.DEBUG_MODE = false;
	
	/**
	 * Foreach loop limit (enable only when DEBUG_MODE = true)
	 * @type integer
	 */
	Template.FOREACH_LOOP_LIMIT = 10000;
	
	/**
	 * Global guid
	 * @type integer
	 */
	Template.guid = 0;
	
	/**
	 * Split multitemplate into multiple templates.
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} includes Array of included templates.
	 */
	Template.prototype.splitTemplates = function(s, includes) {
		var reg = /\{#template *(\w+) *(.*?) *\}/g;//split multitemplate into subtemplates
		var iter, tname, se;
		var lastIndex = null;
		
		var _template_settings = [];
		
		//while find new subtemplate
		while((iter = reg.exec(s)) != null) {
			lastIndex = reg.lastIndex;
			tname = iter[1];
			se = s.indexOf('{#/template ' + tname + '}', lastIndex);
			if(se == -1) {
				throw new Error('jTemplates: Template "' + tname + '" is not closed.');
			}
			//save a subtemplate and parse options
			this._templates_code[tname] = s.substring(lastIndex, se);
			_template_settings[tname] = TemplateUtils.optionToObject(iter[2]);
		}
		//when no subtemplates, use all as main template
		if(lastIndex === null) {
			this._templates_code['MAIN'] = s;
			return;
		}
		
		//create a new object for every subtemplates
		for(var i in this._templates_code) {
			if(i != 'MAIN') {
				this._templates[i] = new Template();
			}
		}
		for(var i in this._templates_code) {
			if(i != 'MAIN') {
				this._templates[i].setTemplate(this._templates_code[i],
					jQuery.extend({}, includes || {}, this._templates || {}),
					jQuery.extend({}, this.settings, _template_settings[i]),
					this);
				this._templates_code[i] = null;
			}
		}
	};
	
	/**
	 * Parse template. (should be template, not multitemplate).
	 * @param {string} s A template string (like: "Text: {$T.txt}.").
	 * @param {array} includes Array of included templates.
	 * @param {object} [settings] Settings.
	 * @param {object} maintemplate Main template
	 */
	Template.prototype.setTemplate = function(s, includes, settings, maintemplate) {
		if(s == undefined) {
			this._tree.push(new TextNode('', 1, this));
			return;
		}
		s = s.replace(/[\n\r]/g, ''); //remove endlines
		s = s.replace(/\{\*.*?\*\}/g, ''); //remove comments
		this._includes = jQuery.extend({}, this._templates || {}, includes || {});
		this.settings = new Object(settings);
		this._maintemplate = maintemplate;
		var node = this._tree;
		var op = s.match(/\{#.*?\}/g); //find operators
		var ss = 0, se = 0;
		var e;
		var literalMode = 0;
		var elseif_level = 0;
		
		//loop operators
		for(var i=0, l=(op)?(op.length):(0); i<l; ++i) {
			var this_op = op[i];
			
			//when literal mode is on, treat operator like a text
			if(literalMode) {
				se = s.indexOf('{#/literal}');
				if(se == -1) {
					throw new Error("jTemplates: No end of literal.");
				}
				if(se > ss) {
					node.push(new TextNode(s.substring(ss, se), 1, this));
				}
				ss = se + 11;
				literalMode = 0;
				i = jQuery.inArray('{#/literal}', op);
				continue;
			}
			
			se = s.indexOf(this_op, ss);
			if(se > ss) {
				node.push(new TextNode(s.substring(ss, se), literalMode, this));
			}
			var ppp = this_op.match(/\{#([\w\/]+).*?\}/); //find operator name
			var op_ = RegExp.$1;
			switch(op_) {
				case 'elseif':
					++elseif_level;
					node.switchToElse();
					//no break
				case 'if':
					e = new opIF(this_op, node, this);
					node.push(e);
					node = e;
					break;
				case 'else':
					node.switchToElse();
					break;
				case '/if':
					while(elseif_level) {
						node = node.getParent();
						--elseif_level;
					}
					//no break
				case '/for':
				case '/foreach':
					node = node.getParent();
					break;
				case 'foreach':
					e = new opFOREACH(this_op, node, this);
					node.push(e);
					node = e;
					break;
				case 'for':
					e = opFORFactory(this_op, node, this);
					node.push(e);
					node = e;
					break;
				case 'continue':
				case 'break':
					node.push(new JTException(op_));
					break;
				case 'include':
					node.push(new Include(this_op, this._includes, this));
					break;
				case 'param':
					node.push(new UserParam(this_op, this));
					break;
				case 'var':
					node.push(new UserVariable(this_op, this));
					break;
				case 'cycle':
					node.push(new Cycle(this_op));
					break;
				case 'ldelim':
					node.push(new TextNode('{', 1, this));
					break;
				case 'rdelim':
					node.push(new TextNode('}', 1, this));
					break;
				case 'literal':
					literalMode = 1;
					break;
				case '/literal':
					if(Template.DEBUG_MODE) {
						throw new Error("jTemplates: Missing begin of literal.");
					}
					break;
				default:
					if(Template.DEBUG_MODE) {
						throw new Error('jTemplates: unknown tag: ' + op_ + '.');
					}
			}
	
			ss = se + this_op.length;
		}
	
		if(s.length > ss) {
			node.push(new TextNode(s.substr(ss), literalMode, this));
		}
	};
	
	/**
	 * Process template and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Template.prototype.get = function(d, param, element, deep) {
		++deep;
		
		if (this._maintemplate == this && element != undefined) {
			jQuery.removeData(element, "jTemplatesRef");
		}
		
		var $T = d, _param1, _param2;
		this.EvalObj = new EvalClass(this);
		
		//create clone of data
		if(this.settings.clone_data) {
			$T = this.f_cloneData(d, {escapeData: (this.settings.filter_data && deep == 1), noFunc: this.settings.disallow_functions}, this.f_escapeString);
		}
		
		//create clone of parameters
		if(!this.settings.clone_params) {
			_param1 = this._param;
			_param2 = param;
		} else {
			_param1 = this.f_cloneData(this._param, {escapeData: (this.settings.filter_params), noFunc: false}, this.f_escapeString);
			_param2 = this.f_cloneData(param, {escapeData: (this.settings.filter_params && deep == 1), noFunc: false}, this.f_escapeString);
		}
		//split object and local parameters
		var $P = jQuery.extend({}, _param1, _param2);
		
		var $Q = (element != undefined) ? (element) : ({});
		$Q.version = this.version;
		
		var ret = '';
		for(var i=0, l=this._tree.length; i<l; ++i) {
			ret += this._tree[i].get($T, $P, $Q, deep);
		}
		
		this.EvalObj = null;
		
		--deep;
		return ret;
	};
	
	/**
	 * Set to parameter 'name' value 'value'.
	 * @param {string} name
	 * @param {object} value
	 */
	Template.prototype.setParam = function(name, value) {
		this._param[name] = value;
	};


	/**
	 * Template utilities.
	 * @namespace Template utilities.
	 */
	TemplateUtils = function() {
	};
	
	/**
	 * Replace chars &, >, <, ", ' with html entities.
	 * To disable function set settings: filter_data=false, filter_params=false
	 * @param {string} string
	 * @return {string}
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.escapeHTML = function(txt) {
		return txt.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
	};

	/**
	 * Make a copy od data 'd'. It also filters data (depend on 'filter').
	 * @param {object} d input data
	 * @param {object} filter a filters
	 * @config {boolean} [escapeData] Use escapeHTML on every string.
	 * @config {boolean} [noFunc] Do not allow to use function (throws exception).
	 * @param {Function} f_escapeString function using to filter string (usually: TemplateUtils.escapeHTML)
	 * @return {object} output data (filtered)
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.cloneData = function(d, filter, f_escapeString) {
		if(d == null) {
			return d;
		}
		switch(d.constructor) {
			case Object:
				var o = {};
				for(var i in d) {
					o[i] = TemplateUtils.cloneData(d[i], filter, f_escapeString);
				}
				if(!filter.noFunc) {
					if(d.hasOwnProperty("toString"))
						o.toString = d.toString;
				}
				return o;
			case Array:
				var o = [];
				for(var i=0,l=d.length; i<l; ++i) {
					o[i] = TemplateUtils.cloneData(d[i], filter, f_escapeString);
				}
				return o;
			case String:
				return (filter.escapeData) ? (f_escapeString(d)) : (d);
			case Function:
				if(filter.noFunc) {
					if(Template.DEBUG_MODE)
						throw new Error("jTemplates: Functions are not allowed.");
					else
						return undefined;
				}
				//no break
			default:
				return d;
		}
	};
	
	/**
	 * Convert text-based option string to Object
	 * @param {string} optionText text-based option string
	 * @return {Object}
	 * @static
	 * @memberOf TemplateUtils
	 */
	TemplateUtils.optionToObject = function(optionText) {
		if(optionText === null || optionText === undefined) {
			return {};
		}
		
		var o = optionText.split(/[= ]/);
		if(o[0] === '') {
			o.shift();
		}
		
		var obj = {};
		for(var i=0, l=o.length; i<l; i+=2) {
			obj[o[i]] = o[i+1];
		}
		
		return obj;
	};
	
	/**
	 * Parse JSON string into object
	 * @param {string} data Text JSON
	 * @return {Object}
	 * @static
	 */
	TemplateUtils.parseJSON = function(data) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		try {
			return (new Function("return " + jQuery.trim(data)))();
		} catch(e) {
			if(Template.DEBUG_MODE) {
				throw new Error("jTemplates: Invalid JSON");
			}
			return {};
		}
	};
	
	/**
	 * Find parents nodes for a reference value and return it
	 * @param {Element} el html element
	 * @param {int} guid template process unique identificator
	 * @param {int} id index
	 * @return {object}
	 * @static
	 */
	TemplateUtils.ReturnRefValue = function(el, guid, id) {
		while(true) {
			if(el == null) {
				return null;
			}
			var d = jQuery.data(el, 'jTemplatesRef');
			if(d != undefined && d.guid == guid && d.d[id] != undefined) {
				return d.d[id];
			}
			el = el.parentNode;
		}
	};
	
	/**
	 * Create a new text node.
	 * @name TextNode
	 * @class All text (block {..}) between control's block "{#..}".
	 * @param {string} val text string
	 * @param {boolean} literalMode When enable (true) template does not process blocks {..}.
	 * @param {Template} Template object
	 * @augments BaseNode
	 */
	var TextNode = function(val, literalMode, template) {
		this._value = val;
		this._literalMode = literalMode;
		this._template = template;
	};
	
	/**
	 * Get the html string for a text node.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	TextNode.prototype.get = function(d, param, element, deep) {
		if(this._literalMode) {
			return this._value;
		}
		var s = this._value;
		var result = "";
		var i = -1;
		var nested = 0;
		var sText = -1;
		var sExpr = 0;
		while(true) {
			var lm = s.indexOf("{", i+1);
			var rm = s.indexOf("}", i+1);
			if(lm < 0 && rm < 0) {
				break;
			}
			if((lm != -1 && lm < rm) || (rm == -1)) {
				i = lm;
				if(++nested == 1) {
					sText = lm;
					result += s.substring(sExpr, i);
					sExpr = -1;
				}
			} else {
				i = rm;
				if(--nested === 0) {
					if(sText >= 0) {
						result += this._template.EvalObj.evaluateContent(d, param, element, s.substring(sText, rm+1));
						sText = -1;
						sExpr = i+1;
					}
				} else if(nested < 0) {
					nested = 0;
				}
			}
		}
		if(sExpr > -1) {
			result += s.substr(sExpr);
		}
		return result;
	};
	
	/**
	 * Virtual context for eval() (internal class)
	 * @name EvalClass
	 * @class Virtual bin for eval() evaluation
	 * @param {Template} t template
	 * @private
	 */
	EvalClass = function(t) {
		this.__templ = t;
	};
	
	/**
	 * Evaluate expression (template content)
	 * @param {object} $T data
	 * @param {object} $P parameters
	 * @param {object} $Q element
	 * @param {String} __value Template content
	 * @return {String}
	 */
	EvalClass.prototype.evaluateContent = function($T, $P, $Q, __value) {
		try {
			var result = eval(__value);
			
			if(jQuery.isFunction(result)) {
				if(this.__templ.settings.disallow_functions || !this.__templ.settings.runnable_functions) {
					return '';
				}
				result = result($T, $P, $Q);
			}
			return (result === undefined) ? ("") : (String(result));
		} catch(e) {
			if(Template.DEBUG_MODE) {
				if(e instanceof JTException) {
					e.type = "subtemplate";
				}
				throw e;
			}
			return "";
		}
	};
	
	/**
	 * Evaluate expression (simple eval)
	 * @param {object} $T data
	 * @param {object} $P parameters
	 * @param {object} $Q element
	 * @param {String} __value content to evaluate
	 * @return {String}
	 */
	EvalClass.prototype.evaluate = function($T, $P, $Q, __value) {
		return eval(__value);
	};
	
	/**
	 * Create a new conditional node.
	 * @name opIF
	 * @class A class represent: {#if}.
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 * @param {Template} templ template
	 * @augments BaseArray
	 */
	var opIF = function(oper, par, templ) {
		this._parent = par;
		oper.match(/\{#(?:else)*if (.*?)\}/);
		this._cond = RegExp.$1;
		this._onTrue = [];
		this._onFalse = [];
		this._currentState = this._onTrue;
		this._templ = templ;
	};
	
	/**
	 * Add node 'e' to array.
	 * @param {BaseNode} e a node
	 */
	opIF.prototype.push = function(e) {
		this._currentState.push(e);
	};
	
	/**
	 * Get a parent node.
	 * @return {BaseNode}
	 */
	opIF.prototype.getParent = function() {
		return this._parent;
	};
	
	/**
	 * Switch from collection onTrue to onFalse.
	 */
	opIF.prototype.switchToElse = function() {
		this._currentState = this._onFalse;
	};
	
	/**
	 * Process node depend on conditional and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	opIF.prototype.get = function(d, param, element, deep) {
		var ret = '';
		
		try {
			var arr = (this._templ.EvalObj.evaluate(d, param, element, this._cond)) ? (this._onTrue) : (this._onFalse);
			for(var i=0, l=arr.length; i<l; ++i) {
				ret += arr[i].get(d, param, element, deep);
			}
		} catch(e) {
			if(Template.DEBUG_MODE || (e instanceof JTException)) {
				throw e;
			}
		}
		return ret;
	};
	
	/**
	 * Handler for a tag 'FOR'. Create new and return relative opFOREACH object.
	 * @name opFORFactory
	 * @class Handler for a tag 'FOR'. Create new and return relative opFOREACH object.
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 * @param {Template} template a pointer to Template object
	 * @return {opFOREACH}
	 */
	opFORFactory = function(oper, par, template) {
		//create operator FOREACH with function as iterator
		if(oper.match(/\{#for (\w+?) *= *(\S+?) +to +(\S+?) *(?:step=(\S+?))*\}/)) {
			var f = new opFOREACH(null, par, template);
			f._name = RegExp.$1;
			f._option = {'begin': (RegExp.$2 || 0), 'end': (RegExp.$3 || -1), 'step': (RegExp.$4 || 1), 'extData': '$T'};
			f._runFunc = (function(i){return i;});
			return f;
		} else {
			throw new Error('jTemplates: Operator failed "find": ' + oper);
		}
	};
	
	/**
	 * Create a new loop node.
	 * @name opFOREACH
	 * @class A class represent: {#foreach}.
	 * @param {string} oper content of operator {#..}
	 * @param {object} par parent node
	 * @param {Template} template a pointer to Template object
	 * @augments BaseArray
	 */
	var opFOREACH = function(oper, par, template) {
		this._parent = par;
		this._template = template;
		if(oper != null) {
			oper.match(/\{#foreach +(.+?) +as +(\w+?)( .+)*\}/);
			this._arg = RegExp.$1;
			this._name = RegExp.$2;
			this._option = RegExp.$3 || null;
			this._option = TemplateUtils.optionToObject(this._option);
		}
		
		this._onTrue = [];
		this._onFalse = [];
		this._currentState = this._onTrue;
		//this._runFunc = null;
	};
	
	/**
	 * Add node 'e' to array.
	 * @param {BaseNode} e
	 */
	opFOREACH.prototype.push = function(e) {
		this._currentState.push(e);
	};
	
	/**
	 * Get a parent node.
	 * @return {BaseNode}
	 */
	opFOREACH.prototype.getParent = function() {
		return this._parent;
	};
	
	/**
	 * Switch from collection onTrue to onFalse.
	 */
	opFOREACH.prototype.switchToElse = function() {
		this._currentState = this._onFalse;
	};
	
	/**
	 * Process loop and get the html string.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	opFOREACH.prototype.get = function(d, param, element, deep) {
		try {
			//array of elements in foreach (or function)
			var fcount = (this._runFunc === undefined)
				? (this._template.EvalObj.evaluate(d, param, element, this._arg))
				: (this._runFunc);
			if(fcount === $) {
				throw new Error("jTemplate: Variable '$' cannot be used as loop-function");
			}
			var key = [];	//only for objects
			var mode = typeof fcount;
			if(mode == 'object') {
				//transform object to array
				var arr = [];
				jQuery.each(fcount, function(k, v) {
					key.push(k);
					arr.push(v);
				});
				fcount = arr;
			}
			//setup primary iterator, iterator can get data from options (using by operator FOR) or from data "$T"
			var extData = (this._option.extData !== undefined)
				? (this._template.EvalObj.evaluate(d, param, element, this._option.extData))
				: ((d != null) ? (d) : ({}));
			if(extData == null) {
				extData = {};
			}
			//start, end and step
			var s = Number(this._template.EvalObj.evaluate(d, param, element, this._option.begin) || 0), e;	//start, end
			var step = Number(this._template.EvalObj.evaluate(d, param, element, this._option.step) || 1);
			if(mode != 'function') {
				e = fcount.length;
			} else {
				if(this._option.end === undefined || this._option.end === null) {
					e = Number.MAX_VALUE;
				} else {
					e = Number(this._template.EvalObj.evaluate(d, param, element, this._option.end)) + ((step>0) ? (1) : (-1));
				}
			}
			var ret = '';	//result string
			var i,l;	//local iterators
			
			if(this._option.count) {
				//limit number of loops
				var tmp = s + Number(this._template.EvalObj.evaluate(d, param, element, this._option.count));
				e = (tmp > e) ? (e) : (tmp);
			}
			
			if((e>s && step>0) || (e<s && step<0)) {
				var iteration = 0;
				var _total = (mode != 'function') ? (Math.ceil((e-s)/step)) : undefined;
				var ckey, cval;	//current key, current value
				var loopCounter = 0;
				for(; ((step>0) ? (s<e) : (s>e)); s+=step, ++iteration, ++loopCounter) {
					if(Template.DEBUG_MODE && loopCounter > Template.FOREACH_LOOP_LIMIT) {
						throw new Error("jTemplate: Foreach loop limit was exceed");
					}
					ckey = key[s];
					if(mode != 'function') {
						cval = fcount[s];  //get value from array
					} else {
						cval = fcount(s);  //calc function
						//if no result from function then stop foreach
						if(cval === undefined || cval === null) {
							break;
						}
					}
					if((typeof cval == 'function') && (this._template.settings.disallow_functions || !this._template.settings.runnable_functions)) {
						continue;
					}
					if((mode == 'object') && (ckey in Object) && (cval === Object[ckey])) {
						continue;
					}
					//backup on value
					var prevValue = extData[this._name];
					//set iterator properties
					extData[this._name] = cval;
					extData[this._name + '$index'] = s;
					extData[this._name + '$iteration'] = iteration;
					extData[this._name + '$first'] = (iteration==0);
					extData[this._name + '$last'] = (s+step>=e);
					extData[this._name + '$total'] = _total;
					extData[this._name + '$key'] = (ckey !== undefined && ckey.constructor == String) ? (this._template.f_escapeString(ckey)) : (ckey);
					extData[this._name + '$typeof'] = typeof cval;
					for(i=0, l=this._onTrue.length; i<l; ++i) {
						try {
							ret += this._onTrue[i].get(extData, param, element, deep);
						} catch(ex) {
							if(ex instanceof JTException) {
								switch(ex.type) {
									case 'continue':
										i = l; //force skip to next node
										break;
									case 'break':
										i = l;  //force skip to next node
										s = e;  //force skip outsite foreach
										break;
									default:
										throw ex;
								}
							} else {
							  throw ex;
							}
						}
					}
					//restore values
					delete extData[this._name + '$index'];
					delete extData[this._name + '$iteration'];
					delete extData[this._name + '$first'];
					delete extData[this._name + '$last'];
					delete extData[this._name + '$total'];
					delete extData[this._name + '$key'];
					delete extData[this._name + '$typeof'];
					delete extData[this._name];
					extData[this._name] = prevValue;
				}
			} else {
				//no items to loop ("foreach->else")
				for(i=0, l=this._onFalse.length; i<l; ++i) {
					ret += this._onFalse[i].get(d, param, element, deep);
				}
			}
			return ret;
		} catch(e) {
			if(Template.DEBUG_MODE || (e instanceof JTException)) {
				throw e;
			}
			return "";
		}
	};
	
	/**
	 * Template-control exceptions
	 * @name JTException
	 * @class A class used internals for a template-control exceptions
	 * @param type {string} Type of exception
	 * @augments Error
	 * @augments BaseNode
	 */
	var JTException = function(type) {
		this.type = type;
	};
	JTException.prototype = Error;
	
	/**
	 * Throw a template-control exception
	 * @throws It throws itself
	 */
	JTException.prototype.get = function(d) {
		throw this;
	};
	
	/**
	 * Create a new entry for included template.
	 * @name Include
	 * @class A class represent: {#include}.
	 * @param {string} oper content of operator {#..}
	 * @param {array} includes
	 * @param {Template} templ template
	 * @augments BaseNode
	 */
	var Include = function(oper, includes, templ) {
		oper.match(/\{#include (.*?)(?: root=(.*?))?\}/);
		this._template = includes[RegExp.$1];
		if(this._template == undefined) {
			if(Template.DEBUG_MODE)
				throw new Error('jTemplates: Cannot find include: ' + RegExp.$1);
		}
		this._root = RegExp.$2;
		this._mainTempl = templ;
	};
	
	/**
	 * Run method get on included template.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Include.prototype.get = function(d, param, element, deep) {
		try {
			//run a subtemplates with a new root node
			return this._template.get(this._mainTempl.EvalObj.evaluate(d, param, element, this._root), param, element, deep);
		} catch(e) {
			if(Template.DEBUG_MODE || (e instanceof JTException)) {
				throw e;
			}
		}
		return '';
	};
	
	/**
	 * Create new node for {#param}.
	 * @name UserParam
	 * @class A class represent: {#param}.
	 * @param {string} oper content of operator {#..}
	 * @param {Template} templ template
	 * @augments BaseNode
	 */
	var UserParam = function(oper, templ) {
		oper.match(/\{#param name=(\w*?) value=(.*?)\}/);
		this._name = RegExp.$1;
		this._value = RegExp.$2;
		this._templ = templ;
	};
	
	/**
	 * Return value of selected parameter.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String} empty string
	 */
	UserParam.prototype.get = function(d, param, element, deep) {
		try {
			param[this._name] = this._templ.EvalObj.evaluate(d, param, element, this._value);
		} catch(e) {
			if(Template.DEBUG_MODE || (e instanceof JTException)) {
				throw e;
			}
			param[this._name] = undefined;
		}
		return '';
	};
	
	/**
	 * Create new node for {#var}.
	 * @name UserVariable
	 * @class A class represent: {#var}.
	 * @param {string} oper content of operator {#..}
	 * @param {Template} templ template
	 * @augments BaseNode
	 */
	var UserVariable = function(oper, templ) {
		oper.match(/\{#var (.*?)\}/);
		this._id = RegExp.$1;
		this._templ = templ;
	};
	
	/**
	 * Return value of selected variable.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String} calling of function ReturnRefValue (as text string)
	 */
	UserVariable.prototype.get = function(d, param, element, deep) {
		try {
			if(element == undefined) {
				return "";
			}
			var obj = this._templ.EvalObj.evaluate(d, param, element, this._id);
			var refobj = jQuery.data(element, "jTemplatesRef");
			if(refobj == undefined) {
				refobj = {guid:++Template.guid, d:[]};
			}
			var i = refobj.d.push(obj);
			jQuery.data(element, "jTemplatesRef", refobj);
			return "(TemplateUtils.ReturnRefValue(this," + refobj.guid + "," + (i-1) + "))";
		} catch(e) {
			if(Template.DEBUG_MODE || (e instanceof JTException)) {
				throw e;
			}
			return '';
		}
	};
	
	/**
	 * Create a new cycle node.
	 * @name Cycle
	 * @class A class represent: {#cycle}.
	 * @param {string} oper content of operator {#..}
	 * @augments BaseNode
	 */
	var Cycle = function(oper) {
		oper.match(/\{#cycle values=(.*?)\}/);
		this._values = eval(RegExp.$1);
		this._length = this._values.length;
		if(this._length <= 0) {
			throw new Error('jTemplates: cycle has no elements');
		}
		this._index = 0;
		this._lastSessionID = -1;
	};

	/**
	 * Do a step on cycle and return value.
	 * @param {object} d data
	 * @param {object} param parameters
	 * @param {Element} element a HTML element
	 * @param {Number} deep
	 * @return {String}
	 */
	Cycle.prototype.get = function(d, param, element, deep) {
		var sid = jQuery.data(element, 'jTemplateSID');
		if(sid != this._lastSessionID) {
			this._lastSessionID = sid;
			this._index = 0;
		}
		var i = this._index++ % this._length;
		return this._values[i];
	};
	
	
	/**
	 * Add a Template to HTML Elements.
	 * @param {Template/string} s a Template or a template string
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplate = function(s, includes, settings) {
		if(s.constructor === Template) {
			return jQuery(this).each(function() {
				jQuery.data(this, 'jTemplate', s);
				jQuery.data(this, 'jTemplateSID', 0);
			});
		} else {
			return jQuery(this).each(function() {
				jQuery.data(this, 'jTemplate', new Template(s, includes, settings));
				jQuery.data(this, 'jTemplateSID', 0);
			});
		}
	};
	
	/**
	 * Add a Template (from URL) to HTML Elements.
	 * @param {string} url_ URL to template
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplateURL = function(url_, includes, settings) {
		var s = jQuery.ajax({
			url: url_,
			dataType: 'text',
			async: false,
			type: 'GET'
		}).responseText;
		
		return jQuery(this).setTemplate(s, includes, settings);
	};
	
	/**
	 * Create a Template from element's content.
	 * @param {string} elementName an ID of element
	 * @param {array} [includes] Array of included templates.
	 * @param {object} [settings] Settings (see Template)
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setTemplateElement = function(elementName, includes, settings) {
		var s = jQuery('#' + elementName).val();
		if(s == null) {
			s = jQuery('#' + elementName).html();
			s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		}
		
		s = jQuery.trim(s);
		s = s.replace(/^<\!\[CDATA\[([\s\S]*)\]\]>$/im, '$1');
		s = s.replace(/^<\!--([\s\S]*)-->$/im, '$1');
		
		return jQuery(this).setTemplate(s, includes, settings);
	};
	
	/**
	 * Check it HTML Elements have a template. Return count of templates.
	 * @return {number} Number of templates.
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.hasTemplate = function() {
		var count = 0;
		jQuery(this).each(function() {
			if(jQuery.getTemplate(this)) {
				++count;
			}
		});
		return count;
	};
	
	/**
	 * Remote Template from HTML Element(s)
	 * @return {jQuery} chainable jQuery class
	 */
	jQuery.fn.removeTemplate = function() {
		jQuery(this).processTemplateStop();
		return jQuery(this).each(function() {
			jQuery.removeData(this, 'jTemplate');
		});
	};
	
	/**
	 * Set to parameter 'name' value 'value'.
	 * @param {string} name
	 * @param {object} value
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.setParam = function(name, value) {
		return jQuery(this).each(function() {
			var t = jQuery.getTemplate(this);
			if(t === undefined) {
				if(Template.DEBUG_MODE)
					throw new Error('jTemplates: Template is not defined.');
				else
					return;
			}
			t.setParam(name, value); 
		});
	};
	
	/**
	 * Process template using data 'd' and parameters 'param'. Update HTML code.
	 * @param {object} d data 
	 * @param {object} [param] parameters
	 * @option {object} [options] internal use only
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplate = function(d, param, options) {
		return jQuery(this).each(function() {
			var t = jQuery.getTemplate(this);
			if(t === undefined) {
				if(Template.DEBUG_MODE)
					throw new Error('jTemplates: Template is not defined.');
				else
					return;
			}
			if(options != undefined && options.StrToJSON) {
				d = t.f_parseJSON(d);
			}
			jQuery.data(this, 'jTemplateSID', jQuery.data(this, 'jTemplateSID') + 1);
			jQuery(this).html(t.get(d, param, jQuery.extend(true, {}, this), 0));
		});
	};
	
	/**
	 * Process template using data from URL 'url_' (only format JSON) and parameters 'param'. Update HTML code.
	 * @param {string} url_ URL to data (in JSON)
	 * @param {object} [param] parameters
	 * @param {object} options options (over ajaxSettings) and callbacks
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateURL = function(url_, param, options) {
		var that = this;
		
		var o = jQuery.extend({cache: false}, jQuery.ajaxSettings);
		o = jQuery.extend(o, options);

		jQuery.ajax({
			url: url_,
			type: o.type,
			data: o.data,
			dataFilter: o.dataFilter,
			async: o.async,
			cache: o.cache,
			timeout: o.timeout,
			dataType: 'text',
			success: function(d) {
				var r = jQuery(that).processTemplate(d, param, {StrToJSON:true});
				if(o.on_success) {
					o.on_success(r);
				}
			},
			error: o.on_error,
			complete: o.on_complete
		});
		return this;
	};

	/**
	 * Create new Updater.
	 * @name Updater
	 * @class This class is used for 'Live Refresh!'.
	 * @param {string} url A destination URL
	 * @param {object} param Parameters (for template)
	 * @param {number} interval Time refresh interval
	 * @param {object} args Additional URL parameters (in URL alter ?) as assoc array.
	 * @param {array} objs An array of HTMLElement which will be modified by Updater.
	 * @param {object} options options and callbacks
	 */
	var Updater = function(url, param, interval, args, objs, options) {
		this._url = url;
		this._param = param;
		this._interval = interval;
		this._args = args;
		this.objs = objs;
		this.timer = null;
		this._options = options || {};
		
		var that = this;
		jQuery(objs).each(function() {
			jQuery.data(this, 'jTemplateUpdater', that);
		});
		this.run();
	};
	
	/**
	 * Create new HTTP request to server, get data (as JSON) and send it to templates. Also check does HTMLElements still exists in Document.
	 */
	Updater.prototype.run = function() {
		this.detectDeletedNodes();
		if(this.objs.length == 0) {
			return;
		}
		var that = this;
		jQuery.ajax({
			url: this._url,
			dataType: 'text',
			data: this._args,
			cache: false,
			success: function(d) {
				try {
					var r = jQuery(that.objs).processTemplate(d, that._param, {StrToJSON:true});
					if(that._options.on_success) {
						that._options.on_success(r);
					}
				} catch(ex) {}
			}
		});
		this.timer = setTimeout(function(){that.run();}, this._interval);
	};
	
	/**
	 * Check does HTMLElements still exists in HTML Document.
	 * If not exist, delete it from property 'objs'.
	 */
	Updater.prototype.detectDeletedNodes = function() {
		this.objs = jQuery.grep(this.objs, function(o) {
			if(jQuery.browser.msie) {
				var n = o.parentNode;
				while(n && n != document) {
					n = n.parentNode;
				}
				return n != null;
			} else {
				return o.parentNode != null;
			}
		});
	};
	
	/**
	 * Start 'Live Refresh!'.
	 * @param {string} url A destination URL
	 * @param {object} param Parameters (for template)
	 * @param {number} interval Time refresh interval
	 * @param {object} args Additional URL parameters (in URL alter ?) as assoc array.
	 * @param {object} options options and callbacks
	 * @return {Updater} an Updater object
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateStart = function(url, param, interval, args, options) {
		return new Updater(url, param, interval, args, this, options);
	};
	
	/**
	 * Stop 'Live Refresh!'.
	 * @return {jQuery} chainable jQuery class
	 * @memberOf jQuery.fn
	 */
	jQuery.fn.processTemplateStop = function() {
		return jQuery(this).each(function() {
			var updater = jQuery.data(this, 'jTemplateUpdater');
			if(updater == null) {
				return;
			}
			var that = this;
			updater.objs = jQuery.grep(updater.objs, function(o) {
				return o != that;
			});
			jQuery.removeData(this, 'jTemplateUpdater');
		});
	};
	
	jQuery.extend(/** @scope jQuery.prototype */{
		/**
		 * Create new Template.
		 * @param {string} s A template string (like: "Text: {$T.txt}.").
		 * @param {array} includes Array of included templates.
		 * @param {object} settings Settings. (see Template)
		 * @return {Template}
		 */
		createTemplate: function(s, includes, settings) {
			return new Template(s, includes, settings);
		},
		
		/**
		 * Create new Template from URL.
		 * @param {string} url_ URL to template
		 * @param {array} includes Array of included templates.
		 * @param {object} settings Settings. (see Template)
		 * @return {Template}
		 */
		createTemplateURL: function(url_, includes, settings) {
			var s = jQuery.ajax({
				url: url_,
				dataType: 'text',
				async: false,
				type: 'GET'
			}).responseText;
			
			return new Template(s, includes, settings);
		},
		
		/**
		 * Get a Template for HTML node
		 * @param {Element} HTML node
		 * @return {Template} a Template or "undefined"
		 */
		getTemplate: function(element) {
			return jQuery.data(element, 'jTemplate');
		},
		
		/**
		 * Process template and return text content.
		 * @param {Template} template A Template
		 * @param {object} data data
		 * @param {object} param parameters
		 * @return {string} Content of template
		 */
		processTemplateToText: function(template, data, parameter) {
			return template.get(data, parameter, undefined, 0);
		},
		
		/**
		 * Set Debug Mode
		 * @param {Boolean} value
		 */
		jTemplatesDebugMode: function(value) {
			Template.DEBUG_MODE = value;
		}
	});
	
})(jQuery);};

﻿/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/02/08
 *
 * @author Blair Mitchelmore
 * @version 1.1.2
 *
 **/

jQuery.fn.extend({
	everyTime: function(interval, label, fn, times, belay) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times, belay);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.event.special

jQuery.extend({
	timer: {
		global: [],
		guid: 1,
		dataKey: "jQuery.timer",
		regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
		powers: {
			// Yeah this is major overkill...
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times, belay) {
			var counter = 0;
			
			if (jQuery.isFunction(label)) {
				if (!times) 
					times = fn;
				fn = label;
				label = interval;
			}
			
			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
				return;

			if (times && times.constructor != Number) {
				belay = !!times;
				times = 0;
			}
			
			times = times || 0;
			belay = belay || false;
			
			var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});
			
			if (!timers[label])
				timers[label] = {};
			
			fn.timerID = fn.timerID || this.guid++;
			
			var handler = function() {
				if (belay && this.inProgress) 
					return;
				this.inProgress = true;
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
				this.inProgress = false;
			};
			
			handler.timerID = fn.timerID;
			
			if (!timers[label][fn.timerID])
				timers[label][fn.timerID] = window.setInterval(handler,interval);
			
			this.global.push( element );
			
		},
		remove: function(element, label, fn) {
			var timers = jQuery.data(element, this.dataKey), ret;
			
			if ( timers ) {
				
				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.timerID ) {
							window.clearInterval(timers[label][fn.timerID]);
							delete timers[label][fn.timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}
					
					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}
				
				for ( ret in timers ) break;
				if ( !ret ) 
					jQuery.removeData(element, this.dataKey);
			}
		}
	}
});

jQuery(window).bind("unload", function() {
	jQuery.each(jQuery.timer.global, function(index, item) {
		jQuery.timer.remove(item);
	});
});
//打开一个模态窗口
jQuery.fn.extend({
    OpenModalDiv: function() {
        var sWidth, sHeight;
        sWidth = window.screen.availWidth;
        if (window.screen.availHeight > document.body.scrollHeight) {
            sHeight = window.screen.availHeight;
        } else {
            sHeight = document.body.scrollHeight + 20;
        }
        var dw = $(document).width();
        var dh = $(document).height();
        sWidth = sWidth> dw? sWidth:dw;
        sHeight = sHeight> dh? sHeight:dh;
        var maskObj = document.createElement("div");
        maskObj.setAttribute('id', 'PgModalDiv');
        maskObj.style.position = "absolute";
        maskObj.style.top = "0";
        maskObj.style.left = "0";
        maskObj.style.background = "#dddddd";
        maskObj.style.filter = "Alpha(opacity=70);";
        maskObj.style.opacity = "0.7";
        maskObj.style.width = sWidth + "px";
        maskObj.style.height = sHeight + "px";
        maskObj.style.zIndex = "10000";
        $("body").attr("scroll", "no");//去除屏幕滚动条
        document.body.appendChild(maskObj);
        
        $("#PgModalDiv").data("divbox_selectlist", $("select:visible"));
        $("select:visible").hide();
        $("#PgModalDiv").attr("divbox_scrolltop", $.ScrollPosition().Top);
        $("#PgModalDiv").attr("divbox_scrollleft", $.ScrollPosition().Left);
        $("#PgModalDiv").attr("htmloverflow", $("html").css("overflow"));
        $("html").css("overflow", "hidden");
        window.scrollTo($("#PgModalDiv").attr("divbox_scrollleft"), $("#PgModalDiv").attr("divbox_scrolltop"));
        var MyDiv_w = this.width();
        var MyDiv_h = this.height();
        MyDiv_w = parseInt(MyDiv_w);
        MyDiv_h = parseInt(MyDiv_h);
        var width = $.PageSize().Width;
        var height = $.PageSize().Height;
        var left = $.ScrollPosition().Left;
        var top = $.ScrollPosition().Top;
        var Div_topposition = top + (height / 2) - (MyDiv_h / 2);
        var Div_leftposition = left + (width / 2) - (MyDiv_w / 2);
        this.css("position", "absolute");
        this.css("z-index", "10001");
        //this.css("background", "#aaaaaa");
        this.css("left", Div_leftposition + "px");
        this.css("top", Div_topposition + "px");
        
        if ($.browser.mozilla) {
            this.show();
            return;
        }
        var _this = this;
        
        $(window).resize(function(){
        	if($(_this).is(':visible')){
        	  $.CenterDiv(_this);
           }
        });
        var user_agent = navigator.userAgent;
        var isApple = false;
        //若为iphone、itouch、ipad,则去除绑定事件
        if(user_agent.indexOf("iPad") != -1 || user_agent.indexOf("iPhone") != -1 || user_agent.indexOf("iTouch") != -1){
          isApple = true;
        }
        if(!isApple){
        	$(window).scroll(function(){
        	if($(_this).is(':visible')){
        	  $.CenterDiv(_this);
           }
          });
        }
        
        this.show();
    },
    CloseModalDiv: function() {
        this.hide();
        if($("#PgModalDiv").length>0){
        	$("html").css("overflow", $("#PgModalDiv").attr("htmloverflow"));
        	   var top= $("#PgModalDiv").attr("divbox_scrolltop");
            var left = $("#PgModalDiv").attr("divbox_scrollleft");
            window.setTimeout(function(){window.scrollTo(left,top)},25);
            var $data =$("#PgModalDiv").data("divbox_selectlist");
            if($data){
            	$data.show();
            }
            $("#PgModalDiv").remove();
        }
    }
});
$.extend({
    PageSize: function() {
        var width = 0;
        var height = 0;
        width = window.innerWidth != null ? window.innerWidth: document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth: document.body != null ? document.body.clientWidth: null;
        height = window.innerHeight != null ? window.innerHeight: document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight: document.body != null ? document.body.clientHeight: null;
        return {
            Width: width,
            Height: height
        };
    },
    ScrollPosition: function() {
        var top = 0,
        left = 0;
        if ($.browser.mozilla) {
            top = window.pageYOffset;
            left = window.pageXOffset;
        } else if ($.browser.msie) {
            top = document.documentElement.scrollTop;
            left = document.documentElement.scrollLeft;
        } else if (document.body) {
            top = document.body.scrollTop;
            left = document.body.scrollLeft;
        }
        return {
            Top: top,
            Left: left
        };
    },
    CenterDiv:function(obj){
		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $(obj).height();
		var popupWidth = $(obj).width();
		$(obj).css({
			"top": (windowHeight-popupHeight)/2+$(document).scrollTop(),
			"left": (windowWidth-popupWidth)/2+$(document).scrollLeft()
			});
	},
	verticalCenterDiv:function(obj){
		var windowHeight = document.documentElement.clientHeight;
		var popupHeight = $(obj).height();
		$(obj).css({
			"top": (windowHeight-popupHeight)/2+$(document).scrollTop()
			});
	}
});
(function(E,B){function D(){}function T(c){C=[c]}function M(c){F.insertBefore(c,F.firstChild)}function L(e,c,d){return e&&e.apply(c.context||c,d)}function K(c){return/\?/.test(c)?"&":"?"}var N="async",S="charset",Q="",a="error",R="_jqjsp",W="on",O=W+"click",P=W+a,A=W+"load",I=W+"readystatechange",Z="removeChild",G="<script/>",V="success",Y="timeout",X=E.browser,F=E("head")[0]||document.documentElement,U={},J=0,C,H={callback:R,url:location.href};function b(c){c=E.extend({},H,c);var q=c.complete,e=c.dataFilter,m=c.callbackParameter,r=c.callback,g=c.cache,j=c.pageCache,i=c.charset,d=c.url,l=c.data,p=c.timeout,o,k=0,h=D;c.abort=function(){!k++&&h()};if(L(c.beforeSend,c,[c])===false||k){return c}d=d||Q;l=l?((typeof l)=="string"?l:E.param(l,c.traditional)):Q;d+=l?(K(d)+l):Q;m&&(d+=K(d)+encodeURIComponent(m)+"=?");!g&&!j&&(d+=K(d)+"_"+(new Date()).getTime()+"=");d=d.replace(/=\?(&|$)/,"="+r+"$1");function n(s){!k++&&B(function(){h();j&&(U[d]={s:[s]});e&&(s=e.apply(c,[s]));L(c.success,c,[s,V]);L(q,c,[c,V])},0)}function f(s){!k++&&B(function(){h();j&&s!=Y&&(U[d]=s);L(c.error,c,[c,s]);L(q,c,[c,s])},0)}j&&(o=U[d])?(o.s?n(o.s[0]):f(o)):B(function(t,s,u){if(!k){u=p>0&&B(function(){f(Y)},p);h=function(){u&&clearTimeout(u);t[I]=t[O]=t[A]=t[P]=null;F[Z](t);s&&F[Z](s)};window[r]=T;t=E(G)[0];t.id=R+J++;if(i){t[S]=i}function v(w){(t[O]||D)();w=C;C=undefined;w?n(w[0]):f(a)}if(X.msie){t.event=O;t.htmlFor=t.id;t[I]=function(){/loaded|complete/.test(t.readyState)&&v()}}else{t[P]=t[A]=v;X.opera?((s=E(G)[0]).text="jQuery('#"+t.id+"')[0]."+P+"()"):t[N]=N}t.src=d;M(t);s&&M(s)}},0);return c}b.setup=function(c){E.extend(H,c)};E.jsonp=b})(jQuery,setTimeout);
/**
 * 跨域组件
 *
 * @module pg
 * @submodule crossdomain component
 * @author wuxiumei
 * @requires jquery and jquery.jp-2.1.4.min.js
 * @params
 *  必传参数：
 */
 (function() {
     var S = function(tplId){
	  this.shareTplId = tplId;
	  this.defaultJsonpOps={
		 'data':{},
		 'url':'',
		 'type':"POST",//默认方式为post
		 'timeout':20000,
		 'success':function(){},
		 'error':function(){},
		 'complete':function(){}
	  }
     }
	 S.prototype = { 
		 /*
		 * 跨子域通信,模板需在chinaso.com域名下,
		 * 默认的跨越文件路径为http://www.chinaso.com/static/pg_cd_proxy.html
		 */
		 getDataFromSubDomain: function(tplURL,callback,cdURL){
			var data = null;
		    if(!cdURL){
					   cdURL = "http://www.chinaso.com/common_demo/pg_cd_proxy.html";
				   }
				   var _this = this;
				   var tplId = _this.shareTplId;
				   _this._setDomain();
				   _this.createIframe("crossDomainIfram",cdURL,
				   function(){
					var iframe=document.getElementById('crossDomainIfram').contentWindow.$;        
				    iframe.get(tplURL,function(data){
				    	callback(data);
				    });
				   });
			   },
			   _setDomain: function(){
		           var $s = $('<script type="text/javascript">document.domain="chinaso.com";</script>');
		    	   $('head').append($s);
		       },
		       createIframe:function(id,url,callback){
		           var $s = $('<iframe src="'+url+'" id="'+id+'" style="display:none"/>');
		    	   $('body').append($s);
		    	   var iframe = $s[0];
		    	   this._bindOnloadEvent("load",iframe,callback);
		    	},
		       _bindOnloadEvent:function(eventName,element,callback){
		       		if (element.attachEvent) {
		      			element.attachEvent("on"+eventName,function(){
		      				//element.detachEvent("onload",arguments.callee);
		      				callback();
		      			});
		      		}else {
		      			 // Mozilla, Opera and webkit nightlies currently support this event
		      			element.addEventListener(eventName,function(){
		      				//element.removeEventListener("load",arguments.callee, false);
		      				callback();
		      			},false);
		      		}
		         },
		       getJsonpData:function(opts){
		        	if(typeof jQuery != 'undefined'){
		        		opts = $.extend(this.defaultJsonpOps, opts);
		        		if(jQuery.jsonp){
		        			var purl = opts.url;
			        		if(purl.indexOf('?')!=-1){
			        			purl = purl + '&jsonpcallback=?';
			        		}else{
			        			purl = purl + '?jsonpcallback=?';
			        		}
				        	$.jsonp({
								data:opts.data,
								timeout:opts.timeout,
								url: purl,
								contentType: "application/x-www-form-urlencoded; charset=utf-8",
								success: function(data) {
				        		   opts.success(data);	 
						        },error: function(e) {
						           opts.error(e);
								},complete:function(e){
								   opts.complete(e);
								}
							});   
				       }else{//未加载jsonp错误处理组件
				    	   $.ajax({
								data:opts.data,
								dataType: "jsonp",
								type:opts.type,
								jsonp:"jsonpcallback",
								contentType: "application/x-www-form-urlencoded; charset=utf-8",
								timeout:opts.timeout,
								url: opts.url,
								success: function(data) {
				    		   	   opts.success(data);	
				    	        }
				    	   });
				    	   
				       }
				    }else{
				    	alert('未加载基础jquery库');
				    }
			 }
	};
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.crossDomain= new S("PgShareTpl");
	 
  })();
/**
 * 界面验证组件
 *
 * @module pg
 * @submodule validate component
 * @author wuxiumei
 * @requires
 * @params
 *  
 */
 (function() {
     var C = function(){
	 
	}

	 C.prototype = {
			 createResult:function (code,msg){
					var result = {
						'code':code,
						'msg':msg
					}
					return  result;
				},
			 /**
				 * 验证手机号
				 * @param inputid 输入框ID
				 * @param divid 显示tip的ID
				 * @return
				 */
		  isValidPhone: function(phone,callback,params){
			         pnum = $.trim(phone);
			         var r = null;
			           //判空
				       if(pnum.length<1){
				    	    r= this.createResult(false,'请输入手机号码'); 
				       }else{
				       //TODO：判长度
				       //判断是否合法
						var tmp = /^1[3-9]\d{9}$/;     //支持11位手机号码验证   
				        var flag=tmp.test(pnum);   
				        if(!flag){ 
				        	r =this.createResult(false,'请输入正确手机号码');
				        }else{
				            r = this.createResult(true,'');
				        }
				       }
			    	   if ( callback ) {
			    		   if(params){
			    			   callback.call(this,r,params);
			    		   }else{
			    			   callback.call(this,r);
			    		   }
			          }
			          return r;
				},
				/*
				 * 验证验证码是否有效
				 */
			 checkRandCode : function(randCode,callback,params){
				  var checkNum = $.trim(randCode);
				  var r = null;
				  if(checkNum.length<1){
			         r = this.createResult(false,'请输入验证码');
			      }else if(randCode.length!=4){
			    	 r = this.createResult(false,'验证码只能为4位数字');
			      }else{
			    	 r = this.createResult(true,'');
			      }
			     if ( callback ) {
				    if(params){
					  callback.call(this,r,params);
					}else{
					  callback.call(this,r);
					}
			     }
			     return r;
			 }
	  
	};
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.validate= new C();
  })();


	

(function ($) {

$.fn.maxlength = function (settings) {

    if (typeof settings == 'string') {
        settings = { feedback : settings };
    }

    settings = $.extend({}, $.fn.maxlength.defaults, settings);

    function length(el) {
    var parts = el.value;
    if ( settings.words )
       parts = el.value.length ? parts.split(/\s+/) : { length : 0 };
    return parts.length;
    }
   
    return this.each(function () {
        var field = this,
        $field = $(field),
        $form = $(field.form),
        limit = settings.useInput ? $form.find('input[name=maxlength]').val() : $field.attr('maxlength'),
        $charsLeft = $form.find(settings.feedback);

    function limitCheck(event) {
        var len = length(this),
             exceeded = len >= limit,
           code = event.keyCode;

        if ( !exceeded )
           return;

            switch (code) {
                case 8: // allow delete
                case 9:
                case 17:
                case 36: // and cursor keys
                case 35:
                case 37:
                case 38:
                case 39:
                case 40:
                case 46:
                case 65:
                    return;

                default:
                    return settings.words && code != 32 && code != 13 && len == limit;
            }
        }


        var updateCount = function () {
            var len = length(field),
            diff = limit - len;

            $charsLeft.html( diff || "0" );

            // truncation code
            if (settings.hardLimit && diff < 0) {
            field.value = settings.words ?
                 // split by white space, capturing it in the result, then glue them back
               field.value.split(/(\s+)/, (limit*2)-1).join('') :
               field.value.substr(0, limit);

                updateCount();
            }
        };

        $field.keyup(updateCount).change(updateCount);
        if (settings.hardLimit) {
            $field.keydown(limitCheck);
        }

        updateCount();
    });
};

$.fn.maxlength.defaults = {
    useInput : false,
    hardLimit : true,
    feedback : '.charsLeft',
    words : false
};

})(jQuery);



/**
 * 界面工具组件
 *
 * @module pg
 * @submodule uitools component
 * @author wuxiumei
 * @requires
 * @params
 *  
 */
 (function() {
     var T = function(){
	} 
	 
	 T.prototype = { 
		  changeFuncTip:function(targetObj,text,event){
				    var t = targetObj;//document.getElementById(target);
				    var val = t.value;
				    if(event == 'focus'){
				       if(val==text){
				          t.value = '';
				      }
				    }else if(event == 'blur'){
				    	 if(val==''){
				          t.value = text;
				      }
				    }
			},
			hideInputTip:function($tip){
				$tip.html('');
				$tip.hide()
			},
			showInputTip:function($tip,msg){
				$tip.html(msg);
				$tip.show()
			},
			hideAllWarningTips:function($tip){
				var _this = this;
				$tip.each(function(){
					_this.hideInputTip($(this));
				})
			},
			//更新验证码
			changeImgRandCode:function ($tip,url){ 
				$tip.attr('src',url);
		    },
		  //设置图片的显示尺寸
		    setImgSize:function(t,mw,mh,width,height){
		    	mw = parseInt(mw);
		    	mh = parseInt(mh);
		    	width = parseInt(width);
		    	height = parseInt(height);
		    	var img={
		    	   width:mw,
		    	   height:mh
		    	}
		    	if(img.width>0 && img.height>0){ 
		               if(img.width/img.height>=width/height){ 
		                   if(img.width>width){ 
		                       t.width(width); 
		                       t.height((img.height*width)/img.width); 
		                   }else{ 
		                       t.width(img.width); 
		                       t.height(img.height); 
		                   } 
		               } 
		               else{ 
		                   if(img.height>height){ 
		                       t.height(height); 
		                       t.width((img.width*height)/img.height); 
		                   }else{ 
		                       t.width(img.width); 
		                       t.height(img.height); 
		                   } 
		               } 
		           } 
		    },
		    /*
		     * 限制只能输入数字
		     */
		    //TODO:此方法不能限制中文的输入
		    onlyPermitNumber:function(event){
		     try{
			   	   var  e = event;
			   	   if(e.ctrlKey && e.which == 67 || e.which == 10){
			   		   return true;
			   	   }
			   	   
			   	   if(e.ctrlKey && e.which == 86  || e.which == 10){
			   		   return true;
			   	   }
			   	   
			   	   if(e.ctrlKey && e.which == 88  || e.which == 10){
			   		   return true;
			   	   }
			   	   
			   	   if(e.keyCode==46||e.keyCode==229||e.keyCode==8||e.keyCode==37||e.keyCode==39||e.keyCode==9||e.keyCode==13){	     
			   	      return true;
			   	   } 
			   	   if(e.keyCode>95 && e.keyCode<107){	     
			   	      return true;
			   	   }
			   	   if(e.keyCode>47 && e.keyCode<60){	     
			   	      return true;
			   	   }	  
			   		return false;
		       }catch(e){}
		   	}
	  
	};
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.uitools= new T();
  })();
/**
 *  发送到手机组件
 *
 * @module pg
 * @submodule send message component
 * @author wuxiumei
 * @requires jquery-jtemplates.js ,jquery.timers-1.1.2.js,jquery.modaltip.js,jquery.jp-2.1.4.min.js,pg.crossDomain.js,pg.validate.js,pg.maxlength.js,pg.UITools.js
 * @params
 */
(function() {
	var defaltConf={
	    	 smgPath:'http://www.chinaso.com/sendmsg',
	    	 // 产品类别
	    	 productType:'',
	    	 //服务ID
	    	 serviceid:'',
	    	 //后台规则标识，默认直接加密
	    	 flag:'0',
	    	 //是否需要过sso过滤器
	    	 ssoinit:false,
	    	// 信息类别，sms代表短信，mms代表彩信，默认发短信
			 msgType:'SMS',
			 recordLog:false,
	    	 // 再次发送验证码的等待时间
	    	randCodeWaitTime:120,
	    	// 发送成功后关闭窗口的等待时间
	    	 closeWaitTime:7,
	    	 smgTplId:'pg_smsgtpl',
	    	 tplURL:'http://www.chinaso.com/common/component/sendmsg/tpl/sendsmg.html',
	    	 cdURL:'http://www.chinaso.com/common_demo/pg_cd_proxy.html'
	    }
	var defaltParams = {
			  /*后台所需参数*/
			  md5:'',
			  sendMsgTitle:'',
			  //发送到手机上的内容
			  sendMsgContent:'',
			  // 彩信图片
			  imgURL:'',
			  
			/*显示在页面上所需参数*/
			  imgWidth:0,
			  imgHeight:0,
			showMsgTitle:'',
			showMsgContent:'',
			showMsgSourceURL:'',// 图片来源网址
			panguTokenName:'盘古搜索',
			panguTokenURL:'m.chinaso.com',
			/*记录发送到手机按钮日志所需的参数*/
			 afterSendLogData:{},
			 /*记录发送到手机按钮日志URL*/
			 afterSendLogURL:'',
			/*回调函数*/
			  beforeOpen:function(){},    
			  afterClose:function(){},
			  beforeSendRandcode:function(){},
			  //发送手机验证码成功回调函数（只有未登录情况会调用）
			  afterSendRandcode:function(){},
			  beforeSendMsg:function(){},
			  //发送信息成功回调函数（登录和未登录情况均会调用）
			  afterSendMsg:function(){},
			  //发送成功时的监听函数，若不定义此函数，则默认发送成功显示小弹窗
			  onSuccessSendMsg:null,
			  sessionExpired:function(){}
	}
	 var smsgParams = defaltParams;
     var Msg = function(conf){
		//this.opts = $.extend(defaltParams, opts);
	    this.conf = $.extend(defaltConf, conf);
	    var smgPath = this.conf.smgPath;
	    this.url = {
	    	initSendMsgURL:smgPath + '/sendmsg.htm?m=init',
		    getImgRandCodeURL:smgPath + '/img.htm?m=imgcode&sid=',
		    sendPhoneRandCodeURL:smgPath + '/sendmsg.htm?m=smscode',
		    sendSMSURL:smgPath + '/sendmsg.htm?m=sendsms',
		    sendMMSURL:smgPath + '/sendmsg.htm?m=sendmms'
	    }
	    if(this.conf.ssoinit){
	    	 this.url.initSendMsgURL= smgPath + '/initsso.htm?m=init';
	    }
	}

	 Msg.prototype = { 
			initTpl:function(smgTplId,tplURL,json){
					$('<div id = '+smgTplId+'></div>')
					 .appendTo($('body'))
					 .setTemplateURL(tplURL)
					 .processTemplate(json);
				},
			initTplcdomain:function(smgTplId,tplURL,cdURL){
					pg.crossDomain.getDataFromSubDomain(tplURL,function(data){
						$('<div id = '+smgTplId+'></div>').html(data)
				    	.appendTo($('body'));
						//暂时不填数据
					   // $('#'+tplId).processTemplate(json);
					},cdURL);
				},
			log:function(url,data){
					var _this = this;
				if(_this.conf.recordLog){
					var params={
					        'url': url,
					        'data' : data,
					        'type':"GET",//默认方式为post
							'timeout':20000,
							'success':function(){},
							'error':function(){},
							'complete':function(){}
						}
						pg.crossDomain.getJsonpData(params);	
				}
			},
		  changeWarningTip:function(r,$tip){
					if(r.code){//合法
						$tip.html(r.msg);
						$tip.hide();
					}else{//非法
						$tip.html(r.msg);
						$tip.show();
					}
				},
			showNtlSendSuccessBox:function(){
				var _this = this;
				$('#smsg_ntl').hide();
				$('#smsg_fillDataForm').hide();
				$('#smsg_success').show();
				//移除md5为key存储的数据
        $(document).removeData($('#smsg_mck').val());
				//成功发送框居中
			  $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
			  this._startSuccessTimer();
			},
			showLgdSendSuccessBox:function(){
				var _this = this;
				$('#smsg_fillDataForm').hide();
				$('#smsg_success').show();
				//移除md5为key存储的数据
        $(document).removeData($('#smsg_mck').val());
				//成功发送框居中
				$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				 _this._startSuccessTimer();
			},
		    isloginState:function(callback){
					var _this = this;
					$.ajax({
						data:{},
						dataType: "jsonp",
						type:"GET",
						jsonp:"jsonpcallback",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						timeout:20000,
						url: _this.url.initSendMsgURL,
						success: function(data) {
							if(data.flag==0){//会话过期
						           smsgParams.sessionExpired.call(this);
						 		   return;
						 	    }else{
						 	       callback();
						 	    }	
		    	        }
		    	   });
					/*var params={
				        url: _this.url.initSendMsgURL,
				        data : {},
				        timeout: "20000",
				        success : function(data){
				        if(data.flag==0){//会话过期
				           smsgParams.sessionExpired.call(this);
				 		   return;
				 	    }else{
				 	       callback();
				 	    }
				      }
					}
					pg.crossDomain.getJsonpData(params);*/
				},
				/**
				 * 初始化登陆前发送框，显示已发送验证码状态
				 * 初始化已经发送验证码状态的发送到手机页面
				 * @return
				 */
			_initAfterSendRcBox:function(){
					// $("#smsg_ntl_phone").attr({"disabled":false});
					// $("#smsg_get_randbtn").attr({"disabled":false});
					  // $('#smsg_ntl_counter').html('');
					   // $('#ntLogin_sendBox').show();
					pg.uitools.hideInputTip($('#smsg_ntl_phone_tip'));
					pg.uitools.hideInputTip($('#smsg_ntl_randCode_tip'));
					$("#smsg_ntl_rc_area").show();
					$("#smsg_ntl_sub_area").show();
					
					//设置未登录状态的手机输入框和获取验证码按钮的状态
					if($(document).data($('#smsg_mck').val()+'f2')==undefined){ 
				      	$("#smsg_ntl_phone").attr({"disabled":false});
						$("#smsg_get_randbtn").attr({"disabled":false});
						$("#smsg_get_randbtn").removeClass('dis_getRandBtn');
						}else{
				    	//若获取验证码后1分钟未发送短信且关闭发送弹窗的，继续保持按钮和手机的不可点击状态
				    	$("#smsg_ntl_phone").attr({"disabled":true});
						$("#smsg_get_randbtn").attr({"disabled":true});
						$("#smsg_get_randbtn").addClass('dis_getRandBtn');
				    }
				},
				/**
				* 清除发送到手机弹框数据(不含关闭逻辑)
				* @param toClose 是否关闭按钮弹窗
				* 
				*/
				cleanSmsgBox:function(toClose){
					var _this = this;
				   $('.warning').html('')
				      .hide();
				   //清除输入框数据
				   $('.smsg_input').each(function(){
					  var dt =$(this).attr('dt');
					  if(dt){
						 $(this).val(dt); 
					  }else{
						 $(this).val('');
					  }
				   })
				   //清空隐藏域发送内容和MD5
				   _this.clearMsgData();
				   $('#smsg_msg_content').val('');
				   $('#smsg_mck').val('');
				   //重置关闭倒计时
				   $(document).stopTime('smsg_success_closeTimer');	
				   $('#smsg_close_counter').html(_this.conf.closeWaitTime);
				   //隐藏关闭倒计时div
				   $('#smsg_success').hide();
				   //显示登录前
				   $('#smsg_fillDataForm').show();
				   //登陆前页面重置
				   $("#smsg_ntl_phone").attr({"disabled":false});
				   $("#smsg_get_randbtn").attr({"disabled":false});
				   $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				   $("#smsg_ntl_rc_area").hide();
				   $("#smsg_ntl_sub_area").hide();
				   $('#smsg_ntl_counter').html('');
				   //$('#ntLogin_sendBox').show();
				   
				   //此逻辑放在AfterClose方法中通过callback传进来
					//未登录情况下，不含有获取验证码但未发送的信息,按钮设置成可“发送到手机”状态
				    /*if(isLogin==0){
				    	if($(document).data($('#smsg_mck').val())==undefined){
				    	    mbicon.html('发送到手机');
				    	}
				    }*/
					
					if(toClose){
					   $('#pg_smsg_wrapper').unbind();
					   $('#pg_smsg_wrapper').CloseModalDiv();
					}
				},
				isApple:function(){
					var ua = navigator.userAgent;
					if(ua.indexOf("iPad") != -1 || ua.indexOf("iPhone") != -1 || ua.indexOf("iTouch") != -1){
						return true;
					}else{
						return false;
					}
				},
				/**
				* 打开发送到手机弹框,登录前或登录后的
				*/
				initSmsgBox:function(params){
					var _this = this;
					//1.合并参数
					smsgParams = $.extend(defaltParams,params);
					//调整外部状态
					smsgParams.beforeOpen.call(this);
					
					//2.清理，重新填充数据,内容、MD5等
					
					//首次打开弹框
					var md5 = smsgParams.md5;
					if($(document).data(md5)==undefined){ 
						_this.cleanSmsgBox(false);
						_this.setMsgData(smsgParams);
					}else{//未登录状态，已经发送过手机验证码
				    	//存手机号
						_this.setMsgData(smsgParams);
				        $("#smsg_ntl_phone").val($(document).data(md5));
				        _this._initAfterSendRcBox();
				    }
					//3.绑定交互事件
					this.bindSmsgEvent();
					var params = {
						'data' : {},
						'url' : _this.url.initSendMsgURL,
						'timeout' : 20000,
						'success' : function(data) {
							sid = data.sid;
							//为图片验证码添加sid参数
							isLogin = data.flag;
							if(data.flag==0){//未登录
								$('#pg_smsg_wrapper').OpenModalDiv();
								$('#smsg_ntl').show();
								$('#smsg_reg_mypangu').show();
								$('#smsg_lgd').hide();
								$('#smsg_success').hide();
								$('#smsg_note_tips').html('您将收到如下彩信：');
								_this.initNlgBoxStyle();
								//发送框居中
								  $.verticalCenterDiv(document.getElementById('pg_smsg_wrapper'));
								  $(window).resize(function(){
							    	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	}
						      });
						      if(!_this.isApple()){
						      	$(window).scroll(function(){
						        	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	  }
						        });
						      	
						      }
						    //绑定手机输入框回车交互事件
								$(document).unbind('keyup').bind('keyup', function(event){
								   if (event.keyCode=="13"){
								   		var act = document.activeElement.id;
									    if(act=="smsg_ntl_phone"){//回车获取验证码
									       if(!$("#smsg_get_randbtn").attr("disabled")){					       
										     	$("#smsg_get_randbtn").trigger("click");
										     }     
									     } 
								   }
								});
							}else if(data.flag==1){//已登录
								var phone = data.mobile;
								var email = data.email;
								$('#pg_smsg_wrapper').OpenModalDiv();
								if($.trim(phone).length>0){
								   $('#smsg_lgd_phone').val(phone);
								}
								$('#smsg_lgd').show();
								$('#smsg_ntl').hide();
								$('#smsg_reg_mypangu').hide();
								$('#smsg_success').hide();
								_this.initLgdBoxStyle();
								if($.trim(phone).length>0){
									$('#smsg_send_user').html('来自'+phone);
								}else if($.trim(email).length>0){
									$('#smsg_send_user').html('来自'+email);
								}
								$('#smsg_note_tips').html('您或您的好友将收到如下彩信：');
								//成功发送框居中
							    $.verticalCenterDiv(document.getElementById('pg_smsg_wrapper'));
								  $(window).resize(function(){
							    	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	}
						      });
						       if(!_this.isApple()){
						        $(window).scroll(function(){
						        	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	  }
						        });
						      }
								//登陆后有图形验证码
								pg.uitools.changeImgRandCode($('#smsg_lgd_rcimg'),_this.url.getImgRandCodeURL+sid+'&t='+new Date().getTime());
								//绑定手机输入框回车交互事件
								$(document).unbind('keyup').bind('keyup', function(event){
								   if (event.keyCode=="13"){
								   		var act = document.activeElement.id;
									    if(act=="smsg_lgd_phone"||act=="smsg_lgd_randCode"){//回车提交表单
									       if(!$("#smsg_lgd_submit").attr("disabled")){					       
										     	$("#smsg_lgd_submit").trigger("click");
										     }     
									     } 
								   }
								});
							}
						},
						'error' : function() {
							 //alert("服务暂时不可用，请稍候再试。");
						}
					}
					pg.crossDomain.getJsonpData(params);
				},
				/**
				 * 发送手机验证码成功后调用的函数
				 i. 手机号码输入框、 “获取验证码”button状态disable
				 ii. 延伸显示提示信息
				  1.  显示验证码输入框及发送按钮
				  2.  显示信息“验证码1小时内有效1分钟内未收到验证码可重新获取 120”
				  3.  120秒倒计时
				**/
			_sendRandCodeSuccess:function(){
					 var instance = this,
						conf = instance.conf;
				     pg.uitools.hideAllWarningTips($('#smsg_ntl .warning'));
				     $("#smsg_ntl_phone").attr({"disabled":true});
				     $("#smsg_get_randbtn").attr({"disabled":true});
				     $("#smsg_get_randbtn").addClass('dis_getRandBtn');
				       //显示验证码输入框
				       $("#smsg_ntl_rc_area").show();
				       //显示发送button
				       $("#smsg_ntl_sub_area").show();
				       //倒计时1分钟
				       $('#smsg_ntl_counter').html(conf.randCodeWaitTime);
				       //TODO:是否置空
				       //$("#smsg_ntl_randCode").val('');
				       var md5 = $('#smsg_mck').val();
				       //存储发送的手机号
				       $(document).data(md5,$("#smsg_ntl_phone").val()); 
				       //用于判断验证码记时是否结束
				       $(document).data(md5+'f2',$("#smsg_ntl_phone").val());
				       //为这条搜索结果发送到手机启动一个计时器，这样不同的搜索结果会有不同的计时器
				       $(document).everyTime(1000, md5,
				            function(i){
				               var tm = conf.randCodeWaitTime -i;        
				               if(tm<=0){//计时结束
				                 $(document).stopTime(md5);
				                  //pg.uitools.hideInputTip($('#ntLogin_phoneTip'));
				                  if($('#smsg_ntl_rc_area').is(":visible")&&md5==$('#smsg_mck').val()){
				                       $("#smsg_ntl_phone").attr({"disabled":false});
				                       $("#smsg_get_randbtn").attr({"disabled":false});
				                       $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				                       $('#smsg_ntl_counter').html(''); 
				                  }
				                  $(document).removeData(md5+'f2'); 
				                  //记时结束绑定回车提交事件
				                   /* $(document).unbind('keyup');
				                    $(document).bind('keyup', function(event){
				                    	if (event.keyCode=="13"){
				                   		    var act = document.activeElement.id;                           
				                            if(act=="smsg_ntl_phone"){                              
				                                $("#smsg_get_randbtn").trigger("click");
				                            }else if(act=="smsg_ntl_randCode"){
				                               $("#smsg_ntl_submit").trigger("click"); 
				                            }
				                       }
				                    });*/ 
				                    
				                }else{   
				                 //只改变定时器值与当前页面MD5一致的计时器
				                if(md5 == $('#smsg_mck').val()){              
				                    $('#smsg_ntl_counter').html(tm);
				                }
				               }
				            }
				        );
				       //发送框居中
					   $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				     //调用外部传入的afterSendRandcode方法，若还未发送完成，搜索结果的发送到手机的文字为填写验证码
				       smsgParams.afterSendRandcode.call(this);
				       //绑定回车发送信息功能
				       $(document).unbind('keyup');                
				       $(document).bind('keyup', function(event){
				    	   if (event.keyCode=="13"){
				    		 var act = document.activeElement.id;                           
				             if(act=="smsg_ntl_phone"){                              
				                 $("#smsg_get_randbtn").trigger("click");
				             }else if(act=="smsg_ntl_randCode"){
				                $("#smsg_ntl_submit").trigger("click"); 
				             }
				           }
				        });      
				},
				_startSuccessTimer:function(){
					 var _this= this;
					 var conf = _this.conf;
					   $(document).everyTime(1000, 'smsg_success_closeTimer',
							function(i) {
										   var tm = conf.closeWaitTime -i;		
										   if(tm==0){
										   	  $(document).stopTime('smsg_success_closeTimer');						   	   
										   	   $('#smsg_close_counter').html(conf.closeWaitTime);						   	   
										   	   //$(document).removeData($('#smsg_mck').val()); 
										   	   _this.cleanSmsgBox(true);   
										   }else{						   
										   	 $('#smsg_close_counter').html(tm);
										   }
										});
				},
				bindSmsgEvent:function (){
					var _this = this;
					 /**
					  * 关闭模式对话框
					  */
					 $('.smsg_js_close').unbind('click').bind('click',function(){
						 _this.cleanSmsgBox(true);
						 smsgParams.afterClose.call(this);
					 })
					 
				     /**
				      * 输入框的提示信息
				      */
					 $('.smsg_js_funcTip').unbind('focus').bind('focus',function(){
						 var text = $.trim($(this).attr('dt'));
						 pg.uitools.changeFuncTip($(this)[0],text,'focus');
					}).unbind('blur').bind('blur',function(){
						 var text = $.trim($(this).attr('dt'));
						 pg.uitools.changeFuncTip($(this)[0],text,'blur')
					})
					
					/**
					*登陆前业务逻辑
					*/
					$('#smsg_ntl_phone').bind('blur',function(){
						var phone = $(this).val();
						if($.trim(phone)=='请输入手机号码'){
							phone='';
						}
						pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip'));
						$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					
					/*$('#smsg_ntl_randCode').bind('blur',function(){
						var randCode = $(this).val();
						if($.trim(randCode)=='请输入验证码'){
							randCode='';
						}
						pg.validate.checkRandCode(randCode,_this.changeWarningTip,$('#smsg_ntl_randCode_tip'));
					})*/
					
					var getRandCodeEvent = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click';
					
					//未登陆状态发送手机验证码
					$('#smsg_get_randbtn').unbind(getRandCodeEvent).bind(getRandCodeEvent,function(){
					   smsgParams.beforeSendRandcode.call(this);
					    //手机输入框处于不可点击状态，则返回
					    var rbtable = $("#smsg_get_randbtn").attr("disabled");
					    var inputable = $("#smsg_ntl_phone").attr("disabled");
				      if(inputable==true||inputable=="disabled"||rbtable==true||rbtable=="disabled"){
				            return ;
				      }
				       
				       var phone  = $.trim($('#smsg_ntl_phone').val());
				       if(phone=='请输入手机号码'){
				    	   phone='';
				       }
				       var md5 = $('#smsg_mck').val();
				        //验证手机号
				       if(pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip')).code){
				            $(this).attr({"disabled":true});
				            var q = '';
				            if(smsgParams.afterSendLogData){
				            	q = smsgParams.afterSendLogData.q||'';
				            }
				            var params={
				             'data':{
				                    'mobile':phone,
				                    'md5':md5,
				                    'q':q
				                },
							 'url':_this.url.sendPhoneRandCodeURL,
							 'timeout':20000,
							 'success':function(data) {
				                var flag = data.flag;
				                if(flag==1){//发送成功
				                   _this._sendRandCodeSuccess();                    
				                }else{//发送失败
				                    if(flag==2){//非移动手机号，发送失败
				                        pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'手机号码格式不正确');
				                    }else if(flag==3){
				                    	pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'请输入手机号码');
				                    }else if(flag==0){
				                    	pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'您的发送数量已超过限制条数');
				                    }
				                    $('#smsg_get_randbtn').attr({"disabled":false});
				                    $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				                    //$("#smsg_ntl_phone").focus();
				                }
				              },
							 'error':function(){
							 	$('#smsg_get_randbtn').attr({"disabled":false});
							 	},
							 'complete':function(){}
				            }
				            pg.crossDomain.getJsonpData(params);
				            $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				        }					 
					})
					//未登录用户发送信息
					$('#smsg_ntl_submit').unbind('click').bind('click',function(){
						smsgParams.beforeSendMsg.call(this);
						//TODO:需要除去左右空字符？
					    var phone = $.trim($('#smsg_ntl_phone').val());
				        var rc = $.trim($('#smsg_ntl_randCode').val());
				        if(rc =='请输入验证码'){
							rc='';
						}
				        if(phone =='请输入手机号码'){
							phone='';
						}
				        var content = $('#smsg_msg_content').val();//发送信息的内容
				        var md5Str = $('#smsg_mck').val();
				        if(!pg.validate.checkRandCode(rc,_this.changeWarningTip,$('#smsg_ntl_randCode_tip')).code
				        ||!pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip')).code){
				        	$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				           return false;
				        }
				      //此处区分发短信和发彩信的参数
					    var udata = {'mobile':phone,
								     'smscode':rc}
					    udata = $.extend(udata,_this.getSpecialData())
					    var surl = _this.getSendMsgURL();
					    /*if(smsgParams.msgType == 'MMS'){//发彩信
					    	var mdata = getMMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendMMSURL;
					    }else if(smsgParams.msgType == 'SMS'){//短信彩信
					    	var mdata = getSMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendSMSURL;
					    }*/
				        var params={
								data:udata,
								url: surl,
							success: function(data) {
								var value = data.flag;
								document.getElementById('smsg_ntl_submit').disabled=false;
								if(value==0){//发送超过发送额度限制
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'发送短信次数超过限制');
								}else if(value==2){//非移动号码
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),"手机号码格式不正确");
								}else if(value==3){//手机号码为空
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),"手机号码不能为空");
								}else if(value==6){
									pg.uitools.showInputTip($('#smsg_ntl_randCode_tip'),"验证码输入错误");
								}else if(value==7){
									pg.uitools.showInputTip($('#smsg_ntl_randCode_tip'),"此验证码已失效，请重新发送");
								}else if(value==1){//发送成功
								   $('.warning').html('').hide();
								   $("#smsg_ntl_phone").attr({"disabled":false});
								   $("#smsg_get_randbtn").attr({"disabled":false});
								   $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
								   $("#ntLogin_randCode").hide();
								   $("#ntLogin_sendMsg").hide();
								  //停止已MD5值为名称的计时器
									$(document).stopTime($('#smsg_mck').val())					   
									$('#smsg_ntl_counter').html('');
									
									if(smsgParams.onSuccessSendMsg){
										 smsgParams.onSuccessSendMsg.call(_this);
									}else{
										//显示发送成功窗
									  _this.showNtlSendSuccessBox.call(_this);
									}
									   
									//移除发送手机号码数据
									$(document).removeData($('#smsg_mck').val());
									
									//记录日志
									var logData = $.extend({},{se:phone,api:'',clt:'share',sv:_this.conf.msgType},smsgParams.afterSendLogData);
									//调整外部状态
									smsgParams.afterSendMsg.call(this);
									_this.log(smsgParams.afterSendLogURL, logData);
								}
							},'error':function(){
							document.getElementById('smsg_ntl_submit').disabled=false;
							//alert("服务不可用，请稍候再试！");
							}
						}
				        pg.crossDomain.getJsonpData(params);
				        $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					});	
					
					/**
					 *登陆后业务逻辑
					 */
					$('#smsg_lgd_phone').bind('blur',function(){
						var phone = $(this).val();
						if($.trim(phone)=='请输入手机号码'){
							phone='';
						}
						pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_lgd_phone_tip'));
						$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					
					$('#smsg_lgd_exchange_rc').unbind('click').bind('click',function(){
						pg.uitools.changeImgRandCode($('#smsg_lgd_rcimg'),_this.url.getImgRandCodeURL+sid+'&t='+new Date().getTime());
						return false;
					})
					
					//登录状态用户提交发送信息
					$('#smsg_lgd_submit').unbind('click').bind('click',function(){
						smsgParams.beforeSendMsg.call(this);
						//TODO:需要除去左右空字符？
				        var phone = $.trim($('#smsg_lgd_phone').val());
				        var rc = $.trim($('#smsg_lgd_randCode').val());
				        if(rc =='验证码'){
							rc='';
						}
				        if(phone =='请输入手机号码'){
							phone='';
						}
				        var content = $('#smsg_msg_content').val();//发送信息的内容
				        var md5Str = $('#smsg_mck').val();
				        if(!pg.validate.checkRandCode(rc,_this.changeWarningTip,$('#smsg_lgd_randCode_tip')).code
				        ||!pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_lgd_phone_tip')).code){
				        	$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				        	return false;
				        }
					    $('#smsg_lgd_submit').attr('disabled',true);
					    //此处区分发短信和发彩信的参数
					    var udata = {'mobile':phone,
								     'imgcode':rc}
					    udata = $.extend(udata,_this.getSpecialData())
					    var surl = _this.getSendMsgURL();
					    /*if(smsgParams.msgType == 'MMS'){//发彩信
					    	var mdata = getMMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendMMSURL;
					    }else if(smsgParams.msgType == 'SMS'){//短信彩信
					    	var mdata = getSMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendSMSURL;
					    }*/
					    var params={
					    		data:udata,
								url: surl,
								type:"GET",
								success: function(data) {
									var value = data.flag;
									if(value==0){
										var smsCount = data.n;
										smsCount = "<span class='red'>"+smsCount+"</span>";
										var mss = '每个注册用户24小时内只能给好友发送'+smsCount+'次短信';
										pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),mss);
									}else if(value==2){//非移动号码
									pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),"手机号码格式不正确");
								}else if(value==3){//手机号码为空
									pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),"手机号码不能为空");
								}else if(value==8){
									pg.uitools.showInputTip($('#smsg_lgd_randCode_tip'),"验证码输入错误");
								}else if(value==9){
									pg.uitools.showInputTip($('#smsg_lgd_randCode_tip'),"此验证码已失效，请重新填写验证码");
									$('#smsg_lgd_exchange_rc').trigger('click');
								}else if(value==1){
									if(smsgParams.onSuccessSendMsg){
										 smsgParams.onSuccessSendMsg.call(_this);
									}else{
										//显示发送成功窗
									  _this.showLgdSendSuccessBox.call(_this);
									}
								 //记录日志
								  var logData = $.extend({},{se:phone,api:'',clt:'share',sv:_this.conf.msgType},smsgParams.afterSendLogData);
								  _this.log(smsgParams.afterSendLogURL, logData);
								  smsgParams.afterSendMsg.call(this);
								}
								  $('#smsg_lgd_submit').attr('disabled',false);	
								},'error':function(){
									$('#smsg_lgd_submit').attr('disabled',false);	
									//alert("服务不可用，请稍候再试！");
								}
							};
					    _this.isloginState(function(){
					    	pg.crossDomain.getJsonpData(params);
					    });
					    $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					/*$('#smsg_lgd_randCode').unbind('blur').bind('blur',function(){
						var randCode = $(this).val();
						if($.trim(randCode)=='请输入验证码'){
							randCode='';
						}
						setTimeout(pg.validate.checkRandCode(randCode,_this.changeWarningTip,$('#smsg_lgd_randCode_tip')),250000);
					})*/
				 },
				 /**
				  * 待覆盖的方法
				  * */
				getSpecialData:function(){},
				getSendMsgURL:function(){},
				setMsgData:function(ops){},
				//登陆后样式初始化
				initLgdBoxStyle:function(){},
				//登陆前样式初始化
				initNlgBoxStyle:function(){},
				clearMsgData:function(){}
				
	};
	 
	 var SMS =function(conf){
		 Msg.call(this,conf);
		 this.conf.msgType='SMS';
		 this.initTplcdomain(this.conf.smgTplId,this.conf.tplURL,this.conf.cdURL);
	 }
	 SMS.prototype = new Msg();
	 SMS.prototype.constructor=SMS;
	 SMS.prototype.getSpecialData=function(){
		 var smsData={
					'msg':$('#smsg_msg_content').val(),
					'md5':$('#smsg_mck').val(),
					'subject':$('#smsg_sms_title').val(),
					'flag': this.conf.flag,
					'serviceid':this.conf.serviceid
				};
			return smsData;
	 }
	 SMS.prototype.getSendMsgURL=function(){
		 return this.url.sendSMSURL;
	 }
	 SMS.prototype.initNlgBoxStyle=function(){
		 $('#smsg_pg_bottom').removeClass('pg_bottom');
	 }
	 SMS.prototype.initLgdBoxStyle=function(){
		 $('#smsg_pg_bottom').addClass('pg_bottom');
	 }
	 
	 SMS.prototype.clearMsgData=function(){
		 
	 }
	 SMS.prototype.setMsgData=function(ops){
			 if(ops){
				//$('#smsg_show_title').html(ops.showMsgTitle);
				$('#smsg_show_content').html(ops.showMsgContent);
				var shorturl = ops.showMsgSourceURL;
				if(shorturl.length>34){
					shorturl = shorturl.substring(0,34);
					shorturl = shorturl+"...";
				}
				$('#smsg_show_sourceurl').attr('href',ops.showMsgSourceURL);
				$('#smsg_show_sourceurl').text(shorturl);
				$('#pangu_token_name').html(ops.panguTokenName);
				$('#pangu_token_url').html(ops.panguTokenURL);
				$('#pangu_token_url').attr('href','http://'+ops.panguTokenURL);
				
				//后台需要的数据
				$('#smsg_sms_title').val(ops.sendMsgTitle);
				$('#smsg_msg_content').val(ops.sendMsgContent);
				$('#smsg_mck').val(ops.md5);
			  }	
	 }
	 
	 
	 var MMS =function(conf){
		 Msg.call(this,conf);
		 this.conf.msgType='MMS';
		 this.initTplcdomain(this.conf.smgTplId,this.conf.tplURL,this.conf.cdURL);
	 }
	 MMS.prototype = new Msg();
	 MMS.prototype.constructor=MMS;
	 MMS.prototype.getSpecialData=function(){
		 var mmsData={
					'msg':$('#smsg_msg_content').val(),
					'md5':$('#smsg_mck').val(),
					'subject':$('#smsg_mms_title').val(),
					'imgurl':$('#smsg_mms_imgurl').val()
				};
		 return mmsData;
	 }
	 MMS.prototype.getSendMsgURL=function(){
		 return this.url.sendMMSURL;
	 }
	 MMS.prototype.initLgdBoxStyle=function(){
	 }
	 MMS.prototype.clearMsgData=function(){
		 $('#mms_show_img').attr('src','');
	 }
	 MMS.prototype.setMsgData=function(ops){
		 if(ops){
				$('#mms_show_img').attr('src',ops.imgURL);
				pg.uitools.setImgSize($('#mms_show_img'),ops.imgWidth,ops.imgHeight,200,150);
				$('#smsg_show_title').html(ops.showMsgTitle);
				$('#smsg_show_content').html(ops.showMsgContent);
				var shorturl = ops.showMsgSourceURL;
				if(shorturl.length>34){
					shorturl = shorturl.substring(0,34);
					shorturl = shorturl+"...";
				}
				$('#smsg_show_sourceurl').attr('href',ops.showMsgSourceURL);
				$('#smsg_show_sourceurl').text(shorturl);
				$('#pangu_token_name').html(ops.panguTokenName);
				$('#pangu_token_url').html(ops.panguTokenURL);
				$('#pangu_token_url').attr('href','http://'+ops.panguTokenURL);
				
				//后台需要的数据
				$('#smsg_mms_title').val(ops.sendMsgTitle);
				$('#smsg_msg_content').val(ops.sendMsgContent);
				$('#smsg_mms_imgurl').val(ops.imgURL);
				$('#smsg_mck').val(ops.md5);
			  }	 
	}
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.msg= Msg;
	 window.pg.mms= MMS;
	 window.pg.sms= SMS;
  })();









 

