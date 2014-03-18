/**
*此js包含以下js：
*jquery-jtemplates.js 、jquery.qtip.js、jquery.ptip.js 及分享逻辑js
*/
/**
 * jTemplates 0.8.1 (http://jtemplates.tpython.com)
 * Copyright (c) 2007-2012 Tomasz Gloc (http://www.tpython.com)
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and/or GPL (GPL-LICENSE.txt) licenses.
 *
 * Id: $Id: jquery-jtemplates_uncompressed.js 190 2012-02-01 16:52:01Z tom $
 */
 
 /**
 * @fileOverview Template engine in JavaScript.
 * @name jTemplates
 * @author Tomasz Gloc
 * @date $Date: 2012-02-01 17:52:01 +0100 (?r, 01 lut 2012) $
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



/*
* qTip2 - Pretty powerful tooltips
* http://craigsworks.com/projects/qtip2/
*
* Version: nightly
* Copyright 2009-2010 Craig Michael Thompson - http://craigsworks.com
*
* Dual licensed under MIT or GPLv2 licenses
*   http://en.wikipedia.org/wiki/MIT_License
*   http://en.wikipedia.org/wiki/GNU_General_Public_License
*
* Date: Mon Dec 19 15:43:28.0000000000 2011
*/

/*jslint browser: true, onevar: true, undef: true, nomen: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */
/*global window: false, jQuery: false, console: false */


(function($, window, undefined) {

	"use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
	
	// Munge the primitives - Paul Irish tip
	var TRUE = true,
		FALSE = false,
		NULL = null,
		
		// Shortcut vars
		QTIP, PLUGINS, MOUSE,
		usedIDs = {},
		uitooltip = 'ui-tooltip',
		widget = 'ui-widget',
		disabled = 'ui-state-disabled',
		selector = 'div.qtip.'+uitooltip,
		defaultClass = uitooltip + '-default',
		focusClass = uitooltip + '-focus',
		hoverClass = uitooltip + '-hover',
		fluidClass = uitooltip + '-fluid',
		hideOffset = '-31000px',
		replaceSuffix = '_replacedByqTip',
		oldtitle = 'oldtitle',
		trackingBound;
		
	/* Thanks to Paul Irish for this one: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/ */
	function log() {
		log.history = log.history || [];
		log.history.push(arguments);
		
		// Make sure console is present
		if('object' === typeof console) {

			// Setup console and arguments
			var c = console[ console.warn ? 'warn' : 'log' ],
			args = Array.prototype.slice.call(arguments), a;

			// Add qTip2 marker to first argument if it's a string
			if(typeof arguments[0] === 'string') { args[0] = 'qTip2: ' + args[0]; }

			// Apply console.warn or .log if not supported
			a = c.apply ? c.apply(console, args) : c(args);
		}
	}




// Option object sanitizer
function sanitizeOptions(opts)
{
	var content;

	if(!opts || 'object' !== typeof opts) { return FALSE; }

	if(opts.metadata === NULL || 'object' !== typeof opts.metadata) {
		opts.metadata = {
			type: opts.metadata
		};
	}

	if('content' in opts) {
		if(opts.content === NULL || 'object' !== typeof opts.content || opts.content.jquery) {
			opts.content = {
				text: opts.content
			};
		}

		content = opts.content.text || FALSE;
		if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
			opts.content.text = FALSE;
		}

		if('title' in opts.content) {
			if(opts.content.title === NULL || 'object' !== typeof opts.content.title) {
				opts.content.title = {
					text: opts.content.title
				};
			}

			content = opts.content.title.text || FALSE;
			if(!$.isFunction(content) && ((!content && !content.attr) || content.length < 1 || ('object' === typeof content && !content.jquery))) {
				opts.content.title.text = FALSE;
			}
		}
	}

	if('position' in opts) {
		if(opts.position === NULL || 'object' !== typeof opts.position) {
			opts.position = {
				my: opts.position,
				at: opts.position
			};
		}
	}

	if('show' in opts) {
		if(opts.show === NULL || 'object' !== typeof opts.show) {
			if(opts.show.jquery) {
				opts.show = { target: opts.show };
			}
			else {
				opts.show = { event: opts.show };
			}
		}
	}

	if('hide' in opts) {
		if(opts.hide === NULL || 'object' !== typeof opts.hide) {
			if(opts.hide.jquery) {
				opts.hide = { target: opts.hide };
			}
			else {
				opts.hide = { event: opts.hide };
			}
		}
	}

	if('style' in opts) {
		if(opts.style === NULL || 'object' !== typeof opts.style) {
			opts.style = {
				classes: opts.style
			};
		}
	}

	// Sanitize plugin options
	$.each(PLUGINS, function() {
		if(this.sanitize) { this.sanitize(opts); }
	});
	
	return opts;
}

/*
* Core plugin implementation
*/
function QTip(target, options, id, attr)
{
	// Declare this reference
	var self = this,
		docBody = document.body,
		tooltipID = uitooltip + '-' + id,
		isPositioning = 0,
		isDrawing = 0,
		tooltip = $(),
		namespace = '.qtip-' + id,
		elements, cache;

	// Setup class attributes
	self.id = id;
	self.rendered = FALSE;
	self.elements = elements = { target: target };
	self.timers = { img: {} };
	self.options = options;
	self.checks = {};
	self.plugins = {};
	self.cache = cache = {
		event: {},
		target: $(),
		disabled: FALSE,
		attr: attr
	};

	/*
	* Private core functions
	*/
	function convertNotation(notation)
	{
		var i = 0, obj, option = options, 

		// Split notation into array
		levels = notation.split('.');

		// Loop through
		while( option = option[ levels[i++] ] ) {
			if(i < levels.length) { obj = option; }
		}

		return [obj || options, levels.pop()];
	}

	function setWidget() {
		var on = options.style.widget;

		tooltip.toggleClass(widget, on).toggleClass(defaultClass, options.style['default'] && !on);
		elements.content.toggleClass(widget+'-content', on);
		
		if(elements.titlebar){
			elements.titlebar.toggleClass(widget+'-header', on);
		}
		if(elements.button){
			elements.button.toggleClass(uitooltip+'-icon', !on);
		}
	}

	function removeTitle(reposition)
	{
		if(elements.title) {
			elements.titlebar.remove();
			elements.titlebar = elements.title = elements.button = NULL;

			// Reposition if enabled
			if(reposition !== FALSE) { self.reposition(); }
		}
	}

	function createButton()
	{
		var button = options.content.title.button,
			isString = typeof button === 'string',
			close = isString ? button : 'Close tooltip';

		if(elements.button) { elements.button.remove(); }

		// Use custom button if one was supplied by user, else use default
		if(button.jquery) {
			elements.button = button;
		}
		else {
			elements.button = $('<a />', {
				'class': 'ui-state-default ui-tooltip-close ' + (options.style.widget ? '' : uitooltip+'-icon'),
				'title': close,
				'aria-label': close
			})
			.prepend(
				$('<span />', {
					'class': 'ui-icon ui-icon-close',
					'html': '&times;'
				})
			);
		}

		// Create button and setup attributes
		elements.button.appendTo(elements.titlebar)
			.attr('role', 'button');
	  //******************modified by wuxiumei  
			$('.ui-tooltip-close')
			.click(function(event) {
				if(!tooltip.hasClass(disabled)) { self.hide(event); }
				return FALSE;
			});

		// Redraw the tooltip when we're done
		self.redraw();
	}

	function createTitle()
	{
		var id = tooltipID+'-title';

		// Destroy previous title element, if present
		if(elements.titlebar) { removeTitle(); }

		// Create title bar and title elements
		elements.titlebar = $('<div />', {
			'class': uitooltip + '-titlebar ' + (options.style.widget ? 'ui-widget-header' : '')
		})
		.append(
			elements.title = $('<div />', {
				'id': id,
				'class': uitooltip + '-title',
				'aria-atomic': TRUE
			})
		)
		.insertBefore(elements.content)

		// Button-specific events
		.delegate('.ui-tooltip-close', 'mousedown keydown mouseup keyup mouseout', function(event) {
			$(this).toggleClass('ui-state-active ui-state-focus', event.type.substr(-4) === 'down');
		})
		.delegate('.ui-tooltip-close', 'mouseover mouseout', function(event){
			$(this).toggleClass('ui-state-hover', event.type === 'mouseover');
		});

		// Create button if enabled
		if(options.content.title.button) { createButton(); }

		// Redraw the tooltip dimensions if it's rendered
		else if(self.rendered){ self.redraw(); } 
	}

	function updateButton(button)
	{
		var elem = elements.button,
			title = elements.title;

		// Make sure tooltip is rendered and if not, return
		if(!self.rendered) { return FALSE; }

		if(!button) {
			elem.remove();
		}
		else {
			if(!title) {
				createTitle();
			}
			createButton();
		}
	}

	function updateTitle(content, reposition)
	{
		var elem = elements.title;

		// Make sure tooltip is rendered and if not, return
		if(!self.rendered || !content) { return FALSE; }

		// Use function to parse content
		if($.isFunction(content)) {
			content = content.call(target, cache.event, self);
		}

		// Remove title if callback returns false
		if(content === FALSE) { return removeTitle(FALSE); }

		// Append new content if its a DOM array and show it if hidden
		else if(content.jquery && content.length > 0) {
			elem.empty().append(content.css({ display: 'block' }));
		}

		// Content is a regular string, insert the new content
		else { elem.html(content); }

		// Redraw and reposition
		self.redraw();
		if(reposition !== FALSE && self.rendered && tooltip.is(':visible')) {
			self.reposition(cache.event);
		}
	}

	function updateContent(content, reposition)
	{
		var elem = elements.content;

		// Make sure tooltip is rendered and content is defined. If not return
		if(!self.rendered || !content) { return FALSE; }

		// Use function to parse content
		if($.isFunction(content)) {
			content = content.call(target, cache.event, self) || '';
		}

		// Append new content if its a DOM array and show it if hidden
		if(content.jquery && content.length > 0) {
			elem.empty().append(content.css({ display: 'block' }));
		}

		// Content is a regular string, insert the new content
		else { elem.html(content); }

		// Image detection
		function detectImages(next) {
			var images, srcs = {};

			function imageLoad(image) {
				// Clear src from object and any timers and events associated with the image
				if(image) {
					delete srcs[image.src];
					clearTimeout(self.timers.img[image.src]);
					$(image).unbind(namespace);
				}

				// If queue is empty after image removal, update tooltip and continue the queue
				if($.isEmptyObject(srcs)) {
					self.redraw();
					if(reposition !== FALSE) {
						self.reposition(cache.event);
					}
					
					next();
				}
			}

			// Find all content images without dimensions, and if no images were found, continue
			if((images = elem.find('img:not([height]):not([width])')).length === 0) { return imageLoad(); }

			// Apply timer to each image to poll for dimensions
			images.each(function(i, elem) {
				// Skip if the src is already present
				if(srcs[elem.src] !== undefined) { return; }

        // Keep track of how many times we poll for image dimensions.
        // If it doesn't return in a reasonable amount of time, it's better
        // to display the tooltip, rather than hold up the queue.
        var iterations = 0, maxIterations = 3;

				(function timer(){
					// When the dimensions are found, remove the image from the queue
					if(elem.height || elem.width || (iterations > maxIterations)) { return imageLoad(elem); }

          iterations += 1;

					// Restart timer
					self.timers.img[elem.src] = setTimeout(timer, 700);
				}());  

				// Also apply regular load/error event handlers
				$(elem).bind('error'+namespace+' load'+namespace, function(){ imageLoad(this); });

				// Store the src and element in our object
				srcs[elem.src] = elem;
			});
		}

		/*
		 * If we're still rendering... insert into 'fx' queue our image dimension
		 * checker which will halt the showing of the tooltip until image dimensions
		 * can be detected properly.
		 */
		if(self.rendered < 0) { tooltip.queue('fx', detectImages); }

		// We're fully rendered, so reset isDrawing flag and proceed without queue delay
		else { isDrawing = 0; detectImages($.noop); }

		return self;
	}

	function assignEvents()
	{
		var posOptions = options.position,
			targets = {
				show: options.show.target,
				hide: options.hide.target,
				viewport: $(posOptions.viewport),
				document: $(document),
				body: $(document.body),
				window: $(window)
			},
			events = {
				show: $.trim('' + options.show.event).split(' '),
				hide: $.trim('' + options.hide.event).split(' ')
			},
			IE6 = $.browser.msie && parseInt($.browser.version, 10) === 6;

		// Define show event method
		function showMethod(event)
		{
			if(tooltip.hasClass(disabled)) { return FALSE; }

			// Clear hide timers
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);

			// Start show timer
			var callback = function(){ self.toggle(TRUE, event); };
			if(options.show.delay > 0) {
				self.timers.show = setTimeout(callback, options.show.delay);
			}
			else{ callback(); }
		}

		// Define hide method
		function hideMethod(event)
		{
			if(tooltip.hasClass(disabled) || isPositioning || isDrawing) { return FALSE; }

			// Check if new target was actually the tooltip element
			var relatedTarget = $(event.relatedTarget || event.target),
				ontoTooltip = relatedTarget.closest(selector)[0] === tooltip[0],
				ontoTarget = relatedTarget[0] === targets.show[0];

			// Clear timers and stop animation queue
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);

			// Prevent hiding if tooltip is fixed and event target is the tooltip. Or if mouse positioning is enabled and cursor momentarily overlaps
			if((posOptions.target === 'mouse' && ontoTooltip) || (options.hide.fixed && ((/mouse(out|leave|move)/).test(event.type) && (ontoTooltip || ontoTarget)))) {
				try { event.preventDefault(); event.stopImmediatePropagation(); } catch(e) {} return;
			}

			// If tooltip has displayed, start hide timer
			if(options.hide.delay > 0) {
				self.timers.hide = setTimeout(function(){ self.hide(event); }, options.hide.delay);
			}
			else{ self.hide(event); }
		}

		// Define inactive method
		function inactiveMethod(event)
		{
			if(tooltip.hasClass(disabled)) { return FALSE; }

			// Clear timer
			clearTimeout(self.timers.inactive);
			self.timers.inactive = setTimeout(function(){ self.hide(event); }, options.hide.inactive);
		}

		function repositionMethod(event) {
			if(tooltip.is(':visible')) { self.reposition(event); }
		}

		// On mouseenter/mouseleave...
		tooltip.bind('mouseenter'+namespace+' mouseleave'+namespace, function(event) {
			var state = event.type === 'mouseenter';

			// Focus the tooltip on mouseenter (z-index stacking)
			if(state) { self.focus(event); }

			// Add hover class
			tooltip.toggleClass(hoverClass, state);
		});

		// Enable hide.fixed
		if(options.hide.fixed) {
			// Add tooltip as a hide target
			targets.hide = targets.hide.add(tooltip);

			// Clear hide timer on tooltip hover to prevent it from closing
			tooltip.bind('mouseover'+namespace, function() {
				if(!tooltip.hasClass(disabled)) { clearTimeout(self.timers.hide); }
			});
		}

		// If using mouseout/mouseleave as a hide event...
		if(/mouse(out|leave)/i.test(options.hide.event)) {
			// Hide tooltips when leaving current window/frame (but not select/option elements)
			if(options.hide.leave === 'window') {
				targets.window.bind('mouseout'+namespace+' blur'+namespace, function(event) {
					if(/select|option/.test(event.target) && !event.relatedTarget) { self.hide(event); }
				});
			}
		}

		/*
		 * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
		 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
		 */
		else if(/mouse(over|enter)/i.test(options.show.event)) {
			targets.hide.bind('mouseleave'+namespace, function(event) {
				clearTimeout(self.timers.show);
			});
		}

		// Hide tooltip on document mousedown if unfocus events are enabled
		if(('' + options.hide.event).indexOf('unfocus') > -1) {
			targets.body.bind('mousedown'+namespace, function(event) {
				var $target = $(event.target),
					enabled = !tooltip.hasClass(disabled) && tooltip.is(':visible');

				if($target[0] !== tooltip[0] && $target.parents(selector).length === 0 && $target.add(target).length > 1 && !$target.attr('disabled')) {
					self.hide(event);
				}
			});
		}

		// Check if the tooltip hides when inactive
		if('number' === typeof options.hide.inactive) {
			// Bind inactive method to target as a custom event
			targets.show.bind('qtip-'+id+'-inactive', inactiveMethod);
			
			// Define events which reset the 'inactive' event handler
			$.each(QTIP.inactiveEvents, function(index, type){
				targets.hide.add(elements.tooltip).bind(type+namespace+'-inactive', inactiveMethod);
			});
		}

		// Apply hide events
		$.each(events.hide, function(index, type) {
			var showIndex = $.inArray(type, events.show),
					targetHide = $(targets.hide);

			// Both events and targets are identical, apply events using a toggle
			if((showIndex > -1 && targetHide.add(targets.show).length === targetHide.length) || type === 'unfocus')
			{
				targets.show.bind(type+namespace, function(event) {
					if(tooltip.is(':visible')) { hideMethod(event); }
					else { showMethod(event); }
				});

				// Don't bind the event again
				delete events.show[ showIndex ];
			}

			// Events are not identical, bind normally
			else { targets.hide.bind(type+namespace, hideMethod); }
		});

		// Apply show events
		$.each(events.show, function(index, type) {
			targets.show.bind(type+namespace, showMethod);
		});

		// Check if the tooltip hides when mouse is moved a certain distance
		if('number' === typeof options.hide.distance) {
			// Bind mousemove to target to detect distance difference
			targets.show.add(tooltip).bind('mousemove'+namespace, function(event) {
				var origin = cache.origin || {},
					limit = options.hide.distance,
					abs = Math.abs;

				// Check if the movement has gone beyond the limit, and hide it if so
				if(abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
					self.hide(event);
				}
			});
		}

		// Mouse positioning events
		if(posOptions.target === 'mouse') {
			// Cache mousemove coords on show targets
			targets.show.bind('mousemove'+namespace, function(event) {
				MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
			});

			// If mouse adjustment is on...
			if(posOptions.adjust.mouse) {
				// Apply a mouseleave event so we don't get problems with overlapping
				if(options.hide.event) {
					tooltip.bind('mouseleave'+namespace, function(event) {
						if((event.relatedTarget || event.target) !== targets.show[0]) { self.hide(event); }
					});
				}

				// Update tooltip position on mousemove
				targets.document.bind('mousemove'+namespace, function(event) {
					// Update the tooltip position only if the tooltip is visible and adjustment is enabled
					if(!tooltip.hasClass(disabled) && tooltip.is(':visible')) {
						self.reposition(event || MOUSE);
					}
				});
			}
		}

		// Adjust positions of the tooltip on window resize if enabled
		if(posOptions.adjust.resize || targets.viewport.length) {
			($.event.special.resize ? targets.viewport : targets.window).bind('resize'+namespace, repositionMethod);
		}

		// Adjust tooltip position on scroll if screen adjustment is enabled
		if(targets.viewport.length || (IE6 && tooltip.css('position') === 'fixed')) {
			targets.viewport.bind('scroll'+namespace, repositionMethod);
		}
	}

	function unassignEvents()
	{
		var targets = [
				options.show.target[0],
				options.hide.target[0],
				self.rendered && elements.tooltip[0],
				options.position.container[0],
				options.position.viewport[0],
				window,
				document
			];

		// Check if tooltip is rendered
		if(self.rendered) {
			$([]).pushStack( $.grep(targets, function(i){ return typeof i === 'object'; }) ).unbind(namespace);
		}

		// Tooltip isn't yet rendered, remove render event
		else { options.show.target.unbind(namespace+'-create'); }
	}

	// Setup builtin .set() option checks
	self.checks.builtin = {
		// Core checks
		'^id$': function(obj, o, v) {
			var id = v === TRUE ? QTIP.nextid : v,
				tooltipID = uitooltip + '-' + id;

			if(id !== FALSE && id.length > 0 && !$('#'+tooltipID).length) {
				tooltip[0].id = tooltipID;
				elements.content[0].id = tooltipID + '-content';
				elements.title[0].id = tooltipID + '-title';
			}
		},

		// Content checks
		'^content.text$': function(obj, o, v){ updateContent(v); },
		'^content.title.text$': function(obj, o, v) {
			// Remove title if content is null
			if(!v) { return removeTitle(); }

			// If title isn't already created, create it now and update
			if(!elements.title && v) { createTitle(); }
			updateTitle(v);
		},
		'^content.title.button$': function(obj, o, v){ updateButton(v); },

		// Position checks
		'^position.(my|at)$': function(obj, o, v){
			// Parse new corner value into Corner objecct
			if('string' === typeof v) {
				obj[o] = new PLUGINS.Corner(v);
			}
		},
		'^position.container$': function(obj, o, v){
			if(self.rendered) { tooltip.appendTo(v); }
		},

		// Show checks
		'^show.ready$': function() {
			if(!self.rendered) { self.render(1); }
			else { self.toggle(TRUE); }
		},

		// Style checks
		'^style.classes$': function(obj, o, v) { 
			tooltip.attr('class', uitooltip + ' qtip ui-helper-reset ' + v);
		},
		'^style.widget|content.title': setWidget,

		// Events check
		'^events.(render|show|move|hide|focus|blur)$': function(obj, o, v) {
			tooltip[($.isFunction(v) ? '' : 'un') + 'bind']('tooltip'+o, v);
		},

		// Properties which require event reassignment
		'^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)': function() {
			var posOptions = options.position;

			// Set tracking flag
			tooltip.attr('tracking', posOptions.target === 'mouse' && posOptions.adjust.mouse);

			// Reassign events
			unassignEvents(); assignEvents();
		}
	};

	/*
	* Public API methods
	*/
	$.extend(self, {
		render: function(show)
		{
			if(self.rendered) { return self; } // If tooltip has already been rendered, exit

			var text = options.content.text,
				title = options.content.title.text,
				posOptions = options.position,
				callback = $.Event('tooltiprender');

			// Add ARIA attributes to target
			$.attr(target[0], 'aria-describedby', tooltipID);

			// Create tooltip element
			tooltip = elements.tooltip = $('<div/>', {
					'id': tooltipID,
					'class': uitooltip + ' qtip ui-helper-reset ' + defaultClass + ' ' + options.style.classes + ' '+ uitooltip + '-pos-' + options.position.my.abbrev(),
					'width': options.style.width || '',
					'height': options.style.height || '',
					'tracking': posOptions.target === 'mouse' && posOptions.adjust.mouse,

					/* ARIA specific attributes */
					'role': 'alert',
					'aria-live': 'polite',
					'aria-atomic': FALSE,
					'aria-describedby': tooltipID + '-content',
					'aria-hidden': TRUE
				})
				.toggleClass(disabled, cache.disabled)
				.data('qtip', self)
				.appendTo(options.position.container)
				.append(
					// Create content element
					elements.content = $('<div />', {
						'class': uitooltip + '-content',
						'id': tooltipID + '-content',
						'aria-atomic': TRUE
					})
				);

			// Set rendered flag and prevent redundant redraw/reposition calls for now
			self.rendered = -1;
			isDrawing = 1; isPositioning = 1;

			// Create title...
			if(title) { 
				createTitle();

				// Update title only if its not a callback (called in toggle if so)
				if(!$.isFunction(title)) { updateTitle(title, FALSE); }
			}

			// Set proper rendered flag and update content if not a callback function (called in toggle)
			if(!$.isFunction(text)) { updateContent(text, FALSE); }
			self.rendered = TRUE;

			// Setup widget classes
			setWidget();

			// Assign passed event callbacks (before plugins!)
			$.each(options.events, function(name, callback) {
				if($.isFunction(callback)) {
					tooltip.bind(name === 'toggle' ? 'tooltipshow tooltiphide' : 'tooltip'+name, callback);
				}
			});

			// Initialize 'render' plugins
			$.each(PLUGINS, function() {
				if(this.initialize === 'render') { this(self); }
			});

			// Assign events
			assignEvents();

			/* Queue this part of the render process in our fx queue so we can
			 * load images before the tooltip renders fully.
			 *
			 * See: updateContent method
			*/
			tooltip.queue('fx', function(next) {
				// Trigger tooltiprender event and pass original triggering event as original
				callback.originalEvent = cache.event;
				tooltip.trigger(callback, [self]);

				// Reset flags
				isDrawing = 0; isPositioning = 0;

				// Redraw the tooltip manually now we're fully rendered
				self.redraw();

				// Show tooltip if needed
				if(options.show.ready || show) {
					self.toggle(TRUE, cache.event, FALSE);
				}

				next(); // Move on to next method in queue
			});

			return self;
		},

		get: function(notation)
		{
			var result, o;

			switch(notation.toLowerCase())
			{
				case 'dimensions':
					result = {
						height: tooltip.outerHeight(), width: tooltip.outerWidth()
					};
				break;

				case 'offset':
					result = PLUGINS.offset(tooltip, options.position.container);
				break;

				default:
					o = convertNotation(notation.toLowerCase());
					result = o[0][ o[1] ];
					result = result.precedance ? result.string() : result;
				break;
			}

			return result;
		},

		set: function(option, value)
		{
			var rmove = /^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,
				rdraw = /^content\.(title|attr)|style/i,
				reposition = FALSE,
				redraw = FALSE,
				checks = self.checks,
				name;

			function callback(notation, args) {
				var category, rule, match;

				for(category in checks) {
					for(rule in checks[category]) {
						if(match = (new RegExp(rule, 'i')).exec(notation)) {
							args.push(match);
							checks[category][rule].apply(self, args);
						}
					}
				}
			}

			// Convert singular option/value pair into object form
			if('string' === typeof option) {
				name = option; option = {}; option[name] = value;
			}
			else { option = $.extend(TRUE, {}, option); }

			// Set all of the defined options to their new values
			$.each(option, function(notation, value) {
				var obj = convertNotation( notation.toLowerCase() ), previous;

				// Set new obj value
				previous = obj[0][ obj[1] ];
				obj[0][ obj[1] ] = 'object' === typeof value && value.nodeType ? $(value) : value;

				// Set the new params for the callback
				option[notation] = [obj[0], obj[1], value, previous];

				// Also check if we need to reposition / redraw
				reposition = rmove.test(notation) || reposition;
				redraw = rdraw.test(notation) || redraw;
			});

			// Re-sanitize options
			sanitizeOptions(options);

			/*
			 * Execute any valid callbacks for the set options
			 * Also set isPositioning/isDrawing so we don't get loads of redundant repositioning
			 * and redraw calls.
			 */
			isPositioning = isDrawing = 1; $.each(option, callback); isPositioning = isDrawing = 0;

			// Update position / redraw if needed
			if(tooltip.is(':visible') && self.rendered) {
				if(reposition) {
					self.reposition( options.position.target === 'mouse' ? NULL : cache.event );
				}
				if(redraw) { self.redraw(); }
			}

			return self;
		},

		toggle: function(state, event)
		{
			// Render the tooltip if showing and it isn't already
			if(!self.rendered) { return state ? self.render(1) : self; }

			var type = state ? 'show' : 'hide',
				opts = options[type],
				visible = tooltip.is(':visible'),
				sameTarget = !event || options[type].target.length < 2 || cache.target[0] === event.target,
				posOptions = options.position,
				contentOptions = options.content,
				delay,
				callback;

			// Detect state if valid one isn't provided
			if((typeof state).search('boolean|number')) { state = !visible; }

			// Return if element is already in correct state
			if(!tooltip.is(':animated') && visible === state && sameTarget) { return self; }

			// Try to prevent flickering when tooltip overlaps show element
			if(event) {
				if((/over|enter/).test(event.type) && (/out|leave/).test(cache.event.type) &&
					event.target === options.show.target[0] && tooltip.has(event.relatedTarget).length) {
					return self;
				}

				// Cache event
				cache.event = $.extend({}, event);
			}

			// Call API methods
			callback = $.Event('tooltip'+type);
			callback.originalEvent = event ? cache.event : NULL;
			tooltip.trigger(callback, [self, 90]);
			if(callback.isDefaultPrevented()){ return self; }

			// Set ARIA hidden status attribute
			$.attr(tooltip[0], 'aria-hidden', !!!state);

			// Execute state specific properties
			if(state) {
				// Store show origin coordinates
				cache.origin = $.extend({}, MOUSE);

				// Focus the tooltip
				self.focus(event);

				// Update tooltip content & title if it's a dynamic function
				if($.isFunction(contentOptions.text)) { updateContent(contentOptions.text, FALSE); }
				if($.isFunction(contentOptions.title.text)) { updateTitle(contentOptions.title.text, FALSE); }

				// Cache mousemove events for positioning purposes (if not already tracking)
				if(!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
					$(document).bind('mousemove.qtip', function(event) {
						MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
					});
					trackingBound = TRUE;
				}

				// Update the tooltip position
				self.reposition(event, arguments[2]);

				// Hide other tooltips if tooltip is solo, using it as the context
				if((callback.solo = !!opts.solo)) { $(selector, opts.solo).not(tooltip).qtip('hide', callback); }
			}
			else {
				// Clear show timer if we're hiding 
				clearTimeout(self.timers.show);

				// Remove cached origin on hide
				delete cache.origin;

				// Remove mouse tracking event if not needed (all tracking qTips are hidden)
				if(trackingBound && !$(selector+'[tracking="true"]:visible', opts.solo).not(tooltip).length) {
					$(document).unbind('mousemove.qtip');
					trackingBound = FALSE;
				}
				
				// Blur the tooltip
				self.blur(event);
			}

			// Define post-animation, state specific properties
			function after() {
				if(state) {
					// Prevent antialias from disappearing in IE by removing filter
					if($.browser.msie) { tooltip[0].style.removeAttribute('filter'); }

					// Remove overflow setting to prevent tip bugs
					tooltip.css('overflow', '');

					// Autofocus elements if enabled
					if('string' === typeof opts.autofocus) {
						$(opts.autofocus, tooltip).focus();
					}

					// Call API method
					callback = $.Event('tooltipvisible');
					callback.originalEvent = event ? cache.event : NULL;
					tooltip.trigger(callback, [self]);

					// If set, hide tooltip when inactive for delay period
					opts.target.trigger('qtip-'+id+'-inactive');
				}
				else {
					// Reset CSS states
					tooltip.css({
						display: '',
						visibility: '',
						opacity: '',
						left: '',
						top: ''
					});
				}
			}

			// Clear animation queue if same target
			if(sameTarget) { tooltip.stop(0, 1); }

			// If no effect type is supplied, use a simple toggle
			if(opts.effect === FALSE) {
				tooltip[ type ]();
				after.call(tooltip);
			}

			// Use custom function if provided
			else if($.isFunction(opts.effect)) {
				opts.effect.call(tooltip, self);
				tooltip.queue('fx', function(n){ after(); n(); });
			}

			// Use basic fade function by default
			else { tooltip.fadeTo(90, state ? 1 : 0, after); }

			// If inactive hide method is set, active it
			if(state) { opts.target.trigger('qtip-'+id+'-inactive'); }

			return self;
		},

		show: function(event){ return self.toggle(TRUE, event); },

		hide: function(event){ return self.toggle(FALSE, event); },

		focus: function(event)
		{
			if(!self.rendered) { return self; }

			var qtips = $(selector),
				curIndex = parseInt(tooltip[0].style.zIndex, 10),
				newIndex = QTIP.zindex + qtips.length,
				cachedEvent = $.extend({}, event),
				focusedElem, callback;

			// Only update the z-index if it has changed and tooltip is not already focused
			if(!tooltip.hasClass(focusClass))
			{
				// Call API method
				callback = $.Event('tooltipfocus');
				callback.originalEvent = cachedEvent;
				tooltip.trigger(callback, [self, newIndex]);

				// If default action wasn't prevented...
				if(!callback.isDefaultPrevented()) {
					// Only update z-index's if they've changed
					if(curIndex !== newIndex) {
						// Reduce our z-index's and keep them properly ordered
						qtips.each(function() {
							if(this.style.zIndex > curIndex) {
								this.style.zIndex = this.style.zIndex - 1;
							}
						});
						
						// Fire blur event for focused tooltip
						qtips.filter('.' + focusClass).qtip('blur', cachedEvent);
					}

					// Set the new z-index
					tooltip.addClass(focusClass)[0].style.zIndex = newIndex;
				}
			}

			return self;
		},

		blur: function(event) {
			var cachedEvent = $.extend({}, event),
				callback;

			// Set focused status to FALSE
			tooltip.removeClass(focusClass);

			// Trigger blur event
			callback = $.Event('tooltipblur');
			callback.originalEvent = cachedEvent;
			tooltip.trigger(callback, [self]);

			return self;
		},

		reposition: function(event, effect)
		{
			if(!self.rendered || isPositioning) { return self; }

			// Set positioning flag
			isPositioning = 1;
	
			var target = options.position.target,
				posOptions = options.position,
				my = posOptions.my, 
				at = posOptions.at,
				adjust = posOptions.adjust,
				method = adjust.method.split(' '),
				elemWidth = tooltip.outerWidth(),
				elemHeight = tooltip.outerHeight(),
				targetWidth = 0,
				targetHeight = 0,
				callback = $.Event('tooltipmove'),
				fixed = tooltip.css('position') === 'fixed',
				viewport = posOptions.viewport,
				position = { left: 0, top: 0 },
				container = posOptions.container,
				flipoffset = FALSE,
				tip = self.plugins.tip,
				readjust = {
					// Axis detection and readjustment indicator
					horizontal: method[0],
					vertical: (method[1] = method[1] || method[0]),
					enabled: viewport.jquery && target[0] !== window && target[0] !== docBody && adjust.method !== 'none',
			 
					// Reposition methods
					left: function(posLeft) {
						var isShift = readjust.horizontal === 'shift',
							viewportScroll = -container.offset.left + viewport.offset.left + viewport.scrollLeft,
							myWidth = my.x === 'left' ? elemWidth : my.x === 'right' ? -elemWidth : -elemWidth / 2,
							atWidth = at.x === 'left' ? targetWidth : at.x === 'right' ? -targetWidth : -targetWidth / 2,
							tipWidth = tip && tip.size ? tip.size.width || 0 : 0,
							tipAdjust = tip && tip.corner && tip.corner.precedance === 'x' && !isShift ? tipWidth : 0,
							overflowLeft = viewportScroll - posLeft + tipAdjust,
							overflowRight = posLeft + elemWidth - viewport.width - viewportScroll + tipAdjust,
							offset = myWidth - (my.precedance === 'x' || my.x === my.y ? atWidth : 0),
							isCenter = my.x === 'center';

						// Optional 'shift' style repositioning
						if(isShift) {
							tipAdjust = tip && tip.corner && tip.corner.precedance === 'y' ? tipWidth : 0;
							offset = (my.x === 'left' ? 1 : -1) * myWidth - tipAdjust;

							// Adjust position but keep it within viewport dimensions
							position.left += overflowLeft > 0 ? overflowLeft : overflowRight > 0 ? -overflowRight : 0;
							position.left = Math.max(
								-container.offset.left + viewport.offset.left + (tipAdjust && tip.corner.x === 'center' ? tip.offset : 0),
								posLeft - offset,
								Math.min(
									Math.max(-container.offset.left + viewport.offset.left + viewport.width, posLeft + offset),
									position.left
								)
							);
						}

						// Default 'flip' repositioning
						else {
							if(overflowLeft > 0 && (my.x !== 'left' || overflowRight > 0)) {
								position.left -= offset;
							}
							else if(overflowRight > 0 && (my.x !== 'right' || overflowLeft > 0)  ) {
								position.left -= isCenter ? -offset : offset;
							}
							if(position.left !== posLeft && isCenter) { position.left -= adjust.x; }
							
							// Make sure we haven't made things worse with the adjustment and return the adjusted difference
							if(position.left < viewportScroll && -position.left > overflowRight) { position.left = posLeft; }
						}

						return position.left - posLeft;
					},
					top: function(posTop) {
						var isShift = readjust.vertical === 'shift',
							viewportScroll = -container.offset.top + viewport.offset.top + viewport.scrollTop,
							myHeight = my.y === 'top' ? elemHeight : my.y === 'bottom' ? -elemHeight : -elemHeight / 2,
							atHeight = at.y === 'top' ? targetHeight : at.y === 'bottom' ? -targetHeight : -targetHeight / 2,
							tipHeight = tip && tip.size ? tip.size.height || 0 : 0,
							tipAdjust = tip && tip.corner && tip.corner.precedance === 'y' && !isShift ? tipHeight : 0,
							overflowTop = viewportScroll - posTop + tipAdjust,
							overflowBottom = posTop + elemHeight - viewport.height - viewportScroll + tipAdjust,
							offset = myHeight - (my.precedance === 'y' || my.x === my.y ? atHeight : 0),
							isCenter = my.y === 'center';
							
						// Optional 'shift' style repositioning
						if(isShift) {
							tipAdjust = tip && tip.corner && tip.corner.precedance === 'x' ? tipHeight : 0;
							offset = (my.y === 'top' ? 1 : -1) * myHeight - tipAdjust;

							// Adjust position but keep it within viewport dimensions
							position.top += overflowTop > 0 ? overflowTop : overflowBottom > 0 ? -overflowBottom : 0;
							position.top = Math.max(
								-container.offset.top + viewport.offset.top + (tipAdjust && tip.corner.x === 'center' ? tip.offset : 0),
								posTop - offset,
								Math.min(
									Math.max(-container.offset.top + viewport.offset.top + viewport.height, posTop + offset),
									position.top
								)
							);
						}

						// Default 'flip' repositioning
						else {
							if(overflowTop > 0 && (my.y !== 'top' || overflowBottom > 0)) {
								position.top -= offset;
							}
							else if(overflowBottom > 0 && (my.y !== 'bottom' || overflowTop > 0)  ) {
								position.top -= isCenter ? -offset : offset;
							}
							if(position.top !== posTop && isCenter) { position.top -= adjust.y; }

							// Make sure we haven't made things worse with the adjustment and return the adjusted difference
							if(position.top < 0 && -position.top > overflowBottom) { position.top = posTop; }
						}

						return position.top - posTop;
					}
				},
				win;

			// Check if absolute position was passed
			if($.isArray(target) && target.length === 2) {
				// Force left top and set position
				at = { x: 'left', y: 'top' };
				position = { left: target[0], top: target[1] };
			}

			// Check if mouse was the target
			else if(target === 'mouse' && ((event && event.pageX) || cache.event.pageX)) {
				// Force left top to allow flipping
				at = { x: 'left', y: 'top' };

				// Use cached event if one isn't available for positioning
				event = (event && (event.type === 'resize' || event.type === 'scroll') ? cache.event :
					event && event.pageX && event.type === 'mousemove' ? event :
					MOUSE && MOUSE.pageX && (adjust.mouse || !event || !event.pageX) ? { pageX: MOUSE.pageX, pageY: MOUSE.pageY } :
					!adjust.mouse && cache.origin && cache.origin.pageX ? cache.origin :
					event) || event || cache.event || MOUSE || {};

				// Use event coordinates for position
				position = { top: event.pageY, left: event.pageX };
			}

			// Target wasn't mouse or absolute...
			else {
				// Check if event targetting is being used
				if(target === 'event') {
					if(event && event.target && event.type !== 'scroll' && event.type !== 'resize') {
						target = cache.target = $(event.target);
					}
					else {
						target = cache.target;
					}
				}
				else { cache.target = $(target); }

				// Parse the target into a jQuery object and make sure there's an element present
				target = $(target).eq(0);
				if(target.length === 0) { return self; }

				// Check if window or document is the target
				else if(target[0] === document || target[0] === window) {
					targetWidth = PLUGINS.iOS ? window.innerWidth : target.width();
					targetHeight = PLUGINS.iOS ? window.innerHeight : target.height();

					if(target[0] === window) {
						position = {
							top: fixed || PLUGINS.iOS ? (viewport || target).scrollTop() : 0,
							left: fixed || PLUGINS.iOS ? (viewport || target).scrollLeft() : 0
						};
					}
				}

				// Use Imagemap/SVG plugins if needed
				else if(target.is('area') && PLUGINS.imagemap) {
					position = PLUGINS.imagemap(target, at, readjust.enabled ? method : FALSE);
				}
				else if(target[0].namespaceURI === 'http://www.w3.org/2000/svg' && PLUGINS.svg) {
					position = PLUGINS.svg(target, at);
				}

				else {
					targetWidth = target.outerWidth();
					targetHeight = target.outerHeight();

					position = PLUGINS.offset(target, container);
				}

				// Parse returned plugin values into proper variables
				if(position.offset) {
					targetWidth = position.width;
					targetHeight = position.height;
					flipoffset = position.flipoffset;
					position = position.offset;
				}

				// Adjust for position.fixed tooltips (and also iOS scroll bug in v3.2 - v4.0)
				if((PLUGINS.iOS < 4.1 && PLUGINS.iOS > 3.1) || PLUGINS.iOS == 4.3 || (!PLUGINS.iOS && fixed)) {
					win = $(window);
					position.left -= win.scrollLeft();
					position.top -= win.scrollTop();
				}

				// Adjust position relative to target
				position.left += at.x === 'right' ? targetWidth : at.x === 'center' ? targetWidth / 2 : 0;
				position.top += at.y === 'bottom' ? targetHeight : at.y === 'center' ? targetHeight / 2 : 0;
			}

			// Adjust position relative to tooltip
			position.left += adjust.x + (my.x === 'right' ? -elemWidth : my.x === 'center' ? -elemWidth / 2 : 0);
			position.top += adjust.y + (my.y === 'bottom' ? -elemHeight : my.y === 'center' ? -elemHeight / 2 : 0);

			// Calculate collision offset values if viewport positioning is enabled
			if(readjust.enabled) {
				// Cache our viewport details
				viewport = {
					elem: viewport,
					height: viewport[ (viewport[0] === window ? 'h' : 'outerH') + 'eight' ](),
					width: viewport[ (viewport[0] === window ? 'w' : 'outerW') + 'idth' ](),
					scrollLeft: fixed ? 0 : viewport.scrollLeft(),
					scrollTop: fixed ? 0 : viewport.scrollTop(),
					offset: viewport.offset() || { left: 0, top: 0 }
				};
				container = {
					elem: container,
					scrollLeft: container.scrollLeft(),
					scrollTop: container.scrollTop(),
					offset: container.offset() || { left: 0, top: 0 }
				};

				// Adjust position based onviewport and adjustment options
				position.adjusted = {
					left: readjust.horizontal !== 'none' ? readjust.left(position.left) : 0,
					top: readjust.vertical !== 'none' ? readjust.top(position.top) : 0
				};

				// Set tooltip position class
				if(position.adjusted.left + position.adjusted.top) {
					tooltip.attr('class', tooltip[0].className.replace(/ui-tooltip-pos-\w+/i, uitooltip + '-pos-' + my.abbrev()));
				}

				// Apply flip offsets supplied by positioning plugins
				if(flipoffset && position.adjusted.left) { position.left += flipoffset.left; }
				if(flipoffset && position.adjusted.top) {  position.top += flipoffset.top; }
			}

			//Viewport adjustment is disabled, set values to zero
			else { position.adjusted = { left: 0, top: 0 }; }

			// Call API method
			callback.originalEvent = $.extend({}, event);
			tooltip.trigger(callback, [self, position, viewport.elem || viewport]);
			if(callback.isDefaultPrevented()){ return self; }
			delete position.adjusted;

			// If effect is disabled, target it mouse, no animation is defined or positioning gives NaN out, set CSS directly
			if(effect === FALSE || isNaN(position.left) || isNaN(position.top) || target === 'mouse' || !$.isFunction(posOptions.effect)) {
				tooltip.css(position);
			}
			
			// Use custom function if provided
			else if($.isFunction(posOptions.effect)) {
				posOptions.effect.call(tooltip, self, $.extend({}, position));
				tooltip.queue(function(next) {
					// Reset attributes to avoid cross-browser rendering bugs
					$(this).css({ opacity: '', height: '' });
					if($.browser.msie) { this.style.removeAttribute('filter'); }

					next();
				});
			}

			// Set positioning flag
			isPositioning = 0;

			return self;
		},

		// Max/min width simulator function for all browsers.. yeaaah!
		redraw: function()
		{
			if(self.rendered < 1 || isDrawing) { return self; }

			var container = options.position.container,
				perc, width, max, min;

			// Set drawing flag
			isDrawing = 1;

			// If tooltip has a set height, just set it... like a boss!
			if(options.style.height) { tooltip.css('height', options.style.height); }

			// If tooltip has a set width, just set it... like a boss!
			if(options.style.width) { tooltip.css('width', options.style.width); }

			// Otherwise simualte max/min width...
			else {
				// Reset width and add fluid class
				tooltip.css('width', '').addClass(fluidClass);

				// Grab our tooltip width (add 1 so we don't get wrapping problems.. huzzah!)
				width = tooltip.width() + 1;

				// Grab our max/min properties
				max = tooltip.css('max-width') || '';
				min = tooltip.css('min-width') || '';

				// Parse into proper pixel values
				perc = (max + min).indexOf('%') > -1 ? container.width() / 100 : 0;
				max = ((max.indexOf('%') > -1 ? perc : 1) * parseInt(max, 10)) || width;
				min = ((min.indexOf('%') > -1 ? perc : 1) * parseInt(min, 10)) || 0;

				// Determine new dimension size based on max/min/current values
				width = max + min ? Math.min(Math.max(width, min), max) : width;

				// Set the newly calculated width and remvoe fluid class
				tooltip.css('width', Math.round(width)).removeClass(fluidClass);
			}

			// Set drawing flag
			isDrawing = 0;

			return self;
		},

		disable: function(state)
		{
			if('boolean' !== typeof state) {
				state = !(tooltip.hasClass(disabled) || cache.disabled);
			}
			 
			if(self.rendered) {
				tooltip.toggleClass(disabled, state);
				$.attr(tooltip[0], 'aria-disabled', state);
			}
			else {
				cache.disabled = !!state;
			}

			return self;
		},
		
		enable: function() { return self.disable(FALSE); },

		destroy: function()
		{
			var t = target[0],
				title = $.attr(t, oldtitle),
				elemAPI = target.data('qtip');

			// Destroy tooltip and  any associated plugins if rendered
			if(self.rendered) {
				tooltip.remove();
				
				$.each(self.plugins, function() {
					if(this.destroy) { this.destroy(); }
				});
			}

			// Clear timers and remove bound events
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);
			unassignEvents();

			// If the API if actually this qTip API...
			if(!elemAPI || self === elemAPI) {
				// Remove api object
				$.removeData(t, 'qtip');

				// Reset old title attribute if removed
				if(options.suppress && title) {
					$.attr(t, 'title', title);
					target.removeAttr(oldtitle);
				}

				// Remove ARIA attributes
				target.removeAttr('aria-describedby');
			}

			// Remove qTip events associated with this API
			target.unbind('.qtip-'+id);

			// Remove ID from sued id object
			delete usedIDs[self.id];

			return target;
		}
	});
}

// Initialization method
function init(id, opts)
{
	var obj, posOptions, attr, config, title,

	// Setup element references
	elem = $(this),
	docBody = $(document.body),

	// Use document body instead of document element if needed
	newTarget = this === document ? docBody : elem,

	// Grab metadata from element if plugin is present
	metadata = (elem.metadata) ? elem.metadata(opts.metadata) : NULL,

	// If metadata type if HTML5, grab 'name' from the object instead, or use the regular data object otherwise
	metadata5 = opts.metadata.type === 'html5' && metadata ? metadata[opts.metadata.name] : NULL,

	// Grab data from metadata.name (or data-qtipopts as fallback) using .data() method,
	html5 = elem.data(opts.metadata.name || 'qtipopts');

	// If we don't get an object returned attempt to parse it manualyl without parseJSON
	try { html5 = typeof html5 === 'string' ? (new Function("return " + html5))() : html5; }
	catch(e) { log('Unable to parse HTML5 attribute data: ' + html5); }

	// Merge in and sanitize metadata
	config = $.extend(TRUE, {}, QTIP.defaults, opts, 
		typeof html5 === 'object' ? sanitizeOptions(html5) : NULL,
		sanitizeOptions(metadata5 || metadata));

	// Re-grab our positioning options now we've merged our metadata and set id to passed value
	posOptions = config.position;
	config.id = id;
	
	// Setup missing content if none is detected
	if('boolean' === typeof config.content.text) {
		attr = elem.attr(config.content.attr);

		// Grab from supplied attribute if available
		if(config.content.attr !== FALSE && attr) { config.content.text = attr; }

		// No valid content was found, abort render
		else {
			log('Unable to locate content for tooltip! Aborting render of tooltip on element: ', elem);
			return FALSE;
		}
	}

	// Setup target options
	if(!posOptions.container.length) { posOptions.container = docBody; }
	if(posOptions.target === FALSE) { posOptions.target = newTarget; }
	if(config.show.target === FALSE) { config.show.target = newTarget; }
	if(config.show.solo === TRUE) { config.show.solo = docBody; }
	if(config.hide.target === FALSE) { config.hide.target = newTarget; }
	if(config.position.viewport === TRUE) { config.position.viewport = posOptions.container; }

	// Convert position corner values into x and y strings
	posOptions.at = new PLUGINS.Corner(posOptions.at);
	posOptions.my = new PLUGINS.Corner(posOptions.my);

	// Destroy previous tooltip if overwrite is enabled, or skip element if not
	if($.data(this, 'qtip')) {
		if(config.overwrite) {
			elem.qtip('destroy');
		}
		else if(config.overwrite === FALSE) {
			return FALSE;
		}
	}

	// Remove title attribute and store it if present
	if(config.suppress && (title = $.attr(this, 'title'))) {
		$(this).removeAttr('title').attr(oldtitle, title);
	}

	// Initialize the tooltip and add API reference
	obj = new QTip(elem, config, id, !!attr);
	$.data(this, 'qtip', obj);

	// Catch remove events on target element to destroy redundant tooltip
	elem.bind('remove.qtip-'+id, function(){ obj.destroy(); });

	return obj;
}

// jQuery $.fn extension method
QTIP = $.fn.qtip = function(options, notation, newValue)
{
	var command = ('' + options).toLowerCase(), // Parse command
		returned = NULL,
		args = $.makeArray(arguments).slice(1),
		event = args[args.length - 1],
		opts = this[0] ? $.data(this[0], 'qtip') : NULL;

	// Check for API request
	if((!arguments.length && opts) || command === 'api') {
		return opts;
	}

	// Execute API command if present
	else if('string' === typeof options)
	{
		this.each(function()
		{
			var api = $.data(this, 'qtip');
			if(!api) { return TRUE; }

			// Cache the event if possible
			if(event && event.timeStamp) { api.cache.event = event; }

			// Check for specific API commands
			if((command === 'option' || command === 'options') && notation) {
				if($.isPlainObject(notation) || newValue !== undefined) {
					api.set(notation, newValue);
				}
				else {
					returned = api.get(notation);
					return FALSE;
				}
			}

			// Execute API command
			else if(api[command]) {
				api[command].apply(api[command], args);
			}
		});

		return returned !== NULL ? returned : this;
	}

	// No API commands. validate provided options and setup qTips
	else if('object' === typeof options || !arguments.length)
	{
		opts = sanitizeOptions($.extend(TRUE, {}, options));

		// Bind the qTips
		return QTIP.bind.call(this, opts, event);
	}
};

// $.fn.qtip Bind method
QTIP.bind = function(opts, event)
{
	return this.each(function(i) {
		var options, targets, events, namespace, api, id;

		// Find next available ID, or use custom ID if provided
		id = $.isArray(opts.id) ? opts.id[i] : opts.id;
		id = !id || id === FALSE || id.length < 1 || usedIDs[id] ? QTIP.nextid++ : (usedIDs[id] = id);

		// Setup events namespace
		namespace = '.qtip-'+id+'-create';

		// Initialize the qTip and re-grab newly sanitized options
		api = init.call(this, id, opts);
		if(api === FALSE) { return TRUE; }
		options = api.options;

		// Initialize plugins
		$.each(PLUGINS, function() {
			if(this.initialize === 'initialize') { this(api); }
		});

		// Determine hide and show targets
		targets = { show: options.show.target, hide: options.hide.target };
		events = {
			show: $.trim('' + options.show.event).replace(/ /g, namespace+' ') + namespace,
			hide: $.trim('' + options.hide.event).replace(/ /g, namespace+' ') + namespace
		};

		/*
		 * Make sure hoverIntent functions properly by using mouseleave as a hide event if
		 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
		 */
		if(/mouse(over|enter)/i.test(events.show) && !/mouse(out|leave)/i.test(events.hide)) {
			events.hide += ' mouseleave' + namespace;
		}

		/*
		 * Also make sure initial mouse targetting works correctly by caching mousemove coords
		 * on show targets before the tooltip has rendered.
		 */
		targets.show.bind('mousemove'+namespace, function(event) {
			MOUSE = { pageX: event.pageX, pageY: event.pageY, type: 'mousemove' };
		});

		// Define hoverIntent function
		function hoverIntent(event) {
			function render() {
				// Cache mouse coords,render and render the tooltip
				api.render(typeof event === 'object' || options.show.ready);

				// Unbind show and hide events
				targets.show.add(targets.hide).unbind(namespace);
			}

			// Only continue if tooltip isn't disabled
			if(api.cache.disabled) { return FALSE; }

			// Cache the event data
			api.cache.event = $.extend({}, event);
			api.cache.target = event ? $(event.target) : [undefined];

			// Start the event sequence
			if(options.show.delay > 0) {
				clearTimeout(api.timers.show);
				api.timers.show = setTimeout(render, options.show.delay);
				if(events.show !== events.hide) {
					targets.hide.bind(events.hide, function() { clearTimeout(api.timers.show); });
				}
			}
			else { render(); }
		}

		// Bind show events to target
		targets.show.bind(events.show, hoverIntent);

		// Prerendering is enabled, create tooltip now
		if(options.show.ready || options.prerender) { hoverIntent(event); }
	});
};

// Setup base plugins
PLUGINS = QTIP.plugins = {
	// Corner object parser
	Corner: function(corner) {
		corner = ('' + corner).replace(/([A-Z])/, ' $1').replace(/middle/gi, 'center').toLowerCase();
		this.x = (corner.match(/left|right/i) || corner.match(/center/) || ['inherit'])[0].toLowerCase();
		this.y = (corner.match(/top|bottom|center/i) || ['inherit'])[0].toLowerCase();

		var f = corner.charAt(0); this.precedance = (f === 't' || f === 'b' ? 'y' : 'x');

		this.string = function() { return this.precedance === 'y' ? this.y+this.x : this.x+this.y; };
		this.abbrev = function() { 
			var x = this.x.substr(0,1), y = this.y.substr(0,1);
			return x === y ? x : (x === 'c' || (x !== 'c' && y !== 'c')) ? y + x : x + y;
		};

		this.clone = function() {
			return { x: this.x, y: this.y, precedance: this.precedance, string: this.string, abbrev: this.abbrev, clone: this.clone };
		};
	},

	// Custom (more correct for qTip!) offset calculator
	offset: function(elem, container) {
		var pos = elem.offset(),
			parent = container,
			deep = 0,
			docBody = document.body,
			coffset, overflow;

		function scroll(e, i) {
			pos.left += i * e.scrollLeft();
			pos.top += i * e.scrollTop();
		}

		if(parent) {
			// Compensate for non-static containers offset
			do {
				if(parent.css('position') !== 'static') {
					coffset = parent[0] === docBody ?
						{ left: parseInt(parent.css('left'), 10) || 0, top: parseInt(parent.css('top'), 10) || 0 } :
						parent.position();

					pos.left -= coffset.left + (parseInt(parent.css('borderLeftWidth'), 10) || 0) + (parseInt(parent.css('marginLeft'), 10) || 0);
					pos.top -= coffset.top + (parseInt(parent.css('borderTopWidth'), 10) || 0);

					overflow = parent.css('overflow');
					if(overflow === 'scroll' || overflow === 'auto') { deep++; }
				}
				
				if(parent[0] === docBody) { break; }
			}
			while(parent = parent.offsetParent());

			// Compensate for containers scroll if it also has an offsetParent
			if(container[0] !== docBody && deep) { scroll( container, 1 ); }
		}

		return pos;
	},
	
	/*
	 * iOS 3.2 - 4.0 scroll fix detection used in offset() function.
	 */
	iOS: parseFloat(
		('' + (/CPU.*OS ([0-9_]{1,3})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
			.replace('undefined', '3_2').replace('_','.')
	) || FALSE,
	
	/*
	 * jQuery-specific $.fn overrides
	 */
	fn: {
		/* Allow other plugins to successfully retrieve the title of an element with a qTip applied */
		attr: function(attr, val) {
			if(this.length) {
				var self = this[0],
					title = 'title',
					api = $.data(self, 'qtip');

				if(attr === title && api && 'object' === typeof api && api.options.suppress) {
					if(arguments.length < 2) {
						return $.attr(self, oldtitle);
					}
					else {
						// If qTip is rendered and title was originally used as content, update it
						if(api && api.options.content.attr === title && api.cache.attr) {
							api.set('content.text', val);
						}

						// Use the regular attr method to set, then cache the result
						return this.attr(oldtitle, val);
					}
				}
			}

			return $.fn['attr'+replaceSuffix].apply(this, arguments);
		},
		
		/* Allow clone to correctly retrieve cached title attributes */
		clone: function(keepData) {
			var titles = $([]), title = 'title',

			// Clone our element using the real clone method
			elems = $.fn['clone'+replaceSuffix].apply(this, arguments);

			// Grab all elements with an oldtitle set, and change it to regular title attribute, if keepData is false
			if(!keepData) {
				elems.filter('['+oldtitle+']').attr('title', function() {
					return $.attr(this, oldtitle);
				})
				.removeAttr(oldtitle);
			}

			return elems;
		},

		/* 
		 * Taken directly from jQuery 1.8.2 widget source code
		 * Trigger 'remove' event on all elements on removal
		 */
		remove: $.ui ? NULL : function( selector, keepData ) {
			if($.ui) { return; } // We don't need to do this if jQuery UI is present!

			$(this).each(function() {
				if (!keepData) {
					if (!selector || $.filter( selector, [ this ] ).length) {
						$('*', this).add(this).each(function() {
							$(this).triggerHandler('remove');
						});
					}
				}
			});
		}
	}
};

// Apply the fn overrides above
$.each(PLUGINS.fn, function(name, func) {
	if(!func || $.fn[name+replaceSuffix]) { return TRUE; }
	
	var old = $.fn[name+replaceSuffix] = $.fn[name];
	$.fn[name] = function() {
		return func.apply(this, arguments) || old.apply(this, arguments);
	};
});

// Set global qTip properties
QTIP.version = 'nightly';
QTIP.nextid = 0;
QTIP.inactiveEvents = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' ');
QTIP.zindex = 15000;

// Define configuration defaults
QTIP.defaults = {
	prerender: FALSE,
	id: FALSE,
	overwrite: TRUE,
	suppress: TRUE,
	content: {
		text: TRUE,
		attr: 'title',
		title: {
			text: FALSE,
			button: FALSE
		}
	},
	position: {
		my: 'top left',
		at: 'bottom right',
		target: FALSE,
		container: FALSE,
		viewport: FALSE,
		adjust: {
			x: 0, y: 0,
			mouse: TRUE,
			resize: TRUE,
			method: 'flip flip'
		},
		effect: function(api, pos, viewport) {
			$(this).animate(pos, {
				duration: 200,
				queue: FALSE
			});
		}
	},
	show: {
		target: FALSE,
		event: 'mouseenter',
		effect: TRUE,
		delay: 90,
		solo: FALSE,
		ready: FALSE,
		autofocus: FALSE
	},
	hide: {
		target: FALSE,
		event: 'mouseleave',
		effect: TRUE,
		delay: 0,
		fixed: FALSE,
		inactive: FALSE,
		leave: 'window',
		distance: FALSE
	},
	style: {
		classes: '',
		widget: FALSE,
		width: FALSE,
		height: FALSE,
		'default': TRUE
	},
	events: {
		render: NULL,
		move: NULL,
		show: NULL,
		hide: NULL,
		toggle: NULL,
		visible: NULL,
		focus: NULL,
		blur: NULL
	}
};




function Ajax(api)
{
	var self = this,
		tooltip = api.elements.tooltip,
		opts = api.options.content.ajax,
		namespace = '.qtip-ajax',
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		first = TRUE;

	api.checks.ajax = {
		'^content.ajax': function(obj, name, v) {
			// If content.ajax object was reset, set our local var
			if(name === 'ajax') { opts = v; }

			if(name === 'once') {
				self.init();
			}
			else if(opts && opts.url) {
				self.load();
			}
			else {
				tooltip.unbind(namespace);
			}
		}
	};

	$.extend(self, {
		init: function() {
			// Make sure ajax options are enabled and bind event
			if(opts && opts.url) {
				tooltip.unbind(namespace)[ opts.once ? 'one' : 'bind' ]('tooltipshow'+namespace, self.load);
			}

			return self;
		},

		load: function(event, first) {
			var hasSelector = opts.url.indexOf(' '),
				url = opts.url,
				selector,
				hideFirst = opts.once && !opts.loading && first;

			// If loading option is disabled, prevent the tooltip showing until we've completed the request
			if(hideFirst) { try{ event.preventDefault(); } catch(e) {} }

			// Make sure default event hasn't been prevented
			else if(event && event.isDefaultPrevented()) { return self; }
			
			// Check if user delcared a content selector like in .load()
			if(hasSelector > -1) {
				selector = url.substr(hasSelector);
				url = url.substr(0, hasSelector);
			}

			// Define common after callback for both success/error handlers
			function after() {
				// Re-display tip if loading and first time, and reset first flag
				if(hideFirst) { api.show(event.originalEvent); first = FALSE; }

				// Call users complete if it was defined
				if($.isFunction(opts.complete)) { opts.complete.apply(this, arguments); }
			}

			// Define success handler
			function successHandler(content) {
				if(selector) {
					// Create a dummy div to hold the results and grab the selector element
					content = $('<div/>')
						// inject the contents of the document in, removing the scripts
						// to avoid any 'Permission Denied' errors in IE
						.append(content.replace(rscript, ""))
						
						// Locate the specified elements
						.find(selector);
				}

				// Set the content
				api.set('content.text', content);
			}

			// Error handler
			function errorHandler(xh, status, error) {
				if (xh.status === 0) { return; }
				api.set('content.text', status + ': ' + error);
			}

			// Setup $.ajax option object and process the request
			$.ajax( $.extend({ success: successHandler, error: errorHandler, context: api }, opts, { url: url, complete: after }) );
		}
	});

	self.init();
}


PLUGINS.ajax = function(api)
{
	var self = api.plugins.ajax;
	
	return 'object' === typeof self ? self : (api.plugins.ajax = new Ajax(api));
};

PLUGINS.ajax.initialize = 'render';

// Setup plugin sanitization
PLUGINS.ajax.sanitize = function(options)
{
	var content = options.content, opts;
	if(content && 'ajax' in content) {
		opts = content.ajax;
		if(typeof opts !== 'object') { opts = options.content.ajax = { url: opts }; }
		if('boolean' !== typeof opts.once && opts.once) { opts.once = !!opts.once; }
	}
};

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
	content: {
		ajax: {
			loading: TRUE,
			once: TRUE
		}
	}
});




PLUGINS.imagemap = function(area, corner, flip)
{
	if(!area.jquery) { area = $(area); }

	var shape = (area[0].shape || area.attr('shape')).toLowerCase(),
		baseCoords = (area[0].coords || area.attr('coords')).split(','),
		coords = [],
		image = $('img[usemap="#'+area.parent('map').attr('name')+'"]'),
		imageOffset = image.offset(),
		result = {
			width: 0, height: 0,
			offset: { top: 1e10, right: 0, bottom: 0, left: 1e10 }
		},
		i = 0, next = 0, dimensions;

	// POLY area coordinate calculator
	//	Special thanks to Ed Cradock for helping out with this.
	//	Uses a binary search algorithm to find suitable coordinates.
	function polyCoordinates(result, coords, corner)
	{
		var i = 0,
			compareX = 1, compareY = 1,
			realX = 0, realY = 0,
			newWidth = result.width,
			newHeight = result.height;

		// Use a binary search algorithm to locate most suitable coordinate (hopefully)
		while(newWidth > 0 && newHeight > 0 && compareX > 0 && compareY > 0)
		{
			newWidth = Math.floor(newWidth / 2);
			newHeight = Math.floor(newHeight / 2);

			if(corner.x === 'left'){ compareX = newWidth; }
			else if(corner.x === 'right'){ compareX = result.width - newWidth; }
			else{ compareX += Math.floor(newWidth / 2); }

			if(corner.y === 'top'){ compareY = newHeight; }
			else if(corner.y === 'bottom'){ compareY = result.height - newHeight; }
			else{ compareY += Math.floor(newHeight / 2); }

			i = coords.length; while(i--)
			{
				if(coords.length < 2){ break; }

				realX = coords[i][0] - result.offset.left;
				realY = coords[i][1] - result.offset.top;

				if((corner.x === 'left' && realX >= compareX) ||
				(corner.x === 'right' && realX <= compareX) ||
				(corner.x === 'center' && (realX < compareX || realX > (result.width - compareX))) ||
				(corner.y === 'top' && realY >= compareY) ||
				(corner.y === 'bottom' && realY <= compareY) ||
				(corner.y === 'center' && (realY < compareY || realY > (result.height - compareY)))) {
					coords.splice(i, 1);
				}
			}
		}

		return { left: coords[0][0], top: coords[0][1] };
	}

	// Make sure we account for padding and borders on the image
	imageOffset.left += Math.ceil((image.outerWidth() - image.width()) / 2);
	imageOffset.top += Math.ceil((image.outerHeight() - image.height()) / 2);

	// Parse coordinates into proper array
	if(shape === 'poly') {
		i = baseCoords.length; while(i--)
		{
			next = [ parseInt(baseCoords[--i], 10), parseInt(baseCoords[i+1], 10) ];

			if(next[0] > result.offset.right){ result.offset.right = next[0]; }
			if(next[0] < result.offset.left){ result.offset.left = next[0]; }
			if(next[1] > result.offset.bottom){ result.offset.bottom = next[1]; }
			if(next[1] < result.offset.top){ result.offset.top = next[1]; }

			coords.push(next);
		}
	}
	else {
		coords = $.map(baseCoords, function(coord){ return parseInt(coord, 10); });
	}

	// Calculate details
	switch(shape)
	{
		case 'rect':
			result = {
				width: Math.abs(coords[2] - coords[0]),
				height: Math.abs(coords[3] - coords[1]),
				offset: {
					left: Math.min(coords[0], coords[2]),
					top: Math.min(coords[1], coords[3])
				}
			};
		break;

		case 'circle':
			result = {
				width: coords[2] + 2,
				height: coords[2] + 2,
				offset: { left: coords[0], top: coords[1] }
			};
		break;

		case 'poly':
			$.extend(result, {
				width: Math.abs(result.offset.right - result.offset.left),
				height: Math.abs(result.offset.bottom - result.offset.top)
			});

			if(corner.string() === 'centercenter') {
				result.offset = {
					left: result.offset.left + (result.width / 2),
					top: result.offset.top + (result.height / 2)
				};
			}
			else {
				result.offset = polyCoordinates(result, coords.slice(), corner);

				// If flip adjustment is enabled, also calculate the closest opposite point
				if(flip && (flip[0] === 'flip' || flip[1] === 'flip')) {
					result.flipoffset = polyCoordinates(result, coords.slice(), {
						x: corner.x === 'left' ? 'right' : corner.x === 'right' ? 'left' : 'center',
						y: corner.y === 'top' ? 'bottom' : corner.y === 'bottom' ? 'top' : 'center'
					});

					result.flipoffset.left -= result.offset.left;
					result.flipoffset.top -= result.offset.top;
				}
			}

			result.width = result.height = 0;
		break;
	}

	// Add image position to offset coordinates
	result.offset.left += imageOffset.left;
	result.offset.top += imageOffset.top;

	return result;
};




// Tip coordinates calculator
function calculateTip(corner, width, height)
{	
	var width2 = Math.ceil(width / 2), height2 = Math.ceil(height / 2),

	// Define tip coordinates in terms of height and width values
	tips = {
		bottomright:	[[0,0],				[width,height],		[width,0]],
		bottomleft:		[[0,0],				[width,0],				[0,height]],
		topright:		[[0,height],		[width,0],				[width,height]],
		topleft:			[[0,0],				[0,height],				[width,height]],
		topcenter:		[[0,height],		[width2,0],				[width,height]],
		bottomcenter:	[[0,0],				[width,0],				[width2,height]],
		rightcenter:	[[0,0],				[width,height2],		[0,height]],
		leftcenter:		[[width,0],			[width,height],		[0,height2]]
	};

	// Set common side shapes
	tips.lefttop = tips.bottomright; tips.righttop = tips.bottomleft;
	tips.leftbottom = tips.topright; tips.rightbottom = tips.topleft;

	return tips[ corner.string() ];
}


function Tip(qTip, command)
{
	var self = this,
		opts = qTip.options.style.tip,
		elems = qTip.elements,
		tooltip = elems.tooltip,
		cache = { top: 0, left: 0 },
		size = {
			width: opts.width,
			height: opts.height
		},
		color = { },
		border = opts.border || 0,
		namespace = '.qtip-tip',
		hasCanvas = !!($('<canvas />')[0] || {}).getContext;

	self.corner = NULL;
	self.mimic = NULL;
	self.border = border;
	self.offset = opts.offset;
	self.size = size;

	// Add new option checks for the plugin
	qTip.checks.tip = {
		'^position.my|style.tip.(corner|mimic|border)$': function() {
			// Make sure a tip can be drawn
			if(!self.init()) {
				self.destroy();
			}

			// Reposition the tooltip
			qTip.reposition();
		},
		'^style.tip.(height|width)$': function() {
			// Re-set dimensions and redraw the tip
			size = {
				width: opts.width,
				height: opts.height
			};
			self.create();
			self.update();

			// Reposition the tooltip
			qTip.reposition();
		},
		'^content.title.text|style.(classes|widget)$': function() {
			if(elems.tip) {
				self.update();
			}
		}
	};

	function reposition(event, api, pos, viewport) {
		if(!elems.tip) { return; }

		var newCorner = self.corner.clone(),
			adjust = pos.adjusted,
			method = qTip.options.position.adjust.method.split(' '),
			horizontal = method[0],
			vertical = method[1] || method[0],
			shift = { left: FALSE, top: FALSE, x: 0, y: 0 },
			offset, css = {}, props;

		// Make sure our tip position isn't fixed e.g. doesn't adjust with viewport
		if(self.corner.fixed !== TRUE) {
			// Horizontal - Shift or flip method
			if(horizontal === 'shift' && newCorner.precedance === 'x' && adjust.left && newCorner.y !== 'center') {
				newCorner.precedance = newCorner.precedance === 'x' ? 'y' : 'x';
			}
			else if(horizontal === 'flip' && adjust.left){
				newCorner.x = newCorner.x === 'center' ? (adjust.left > 0 ? 'left' : 'right') : (newCorner.x === 'left' ? 'right' : 'left');
			}

			// Vertical - Shift or flip method
			if(vertical === 'shift' && newCorner.precedance === 'y' && adjust.top && newCorner.x !== 'center') {
				newCorner.precedance = newCorner.precedance === 'y' ? 'x' : 'y';
			}
			else if(vertical === 'flip' && adjust.top) {
				newCorner.y = newCorner.y === 'center' ? (adjust.top > 0 ? 'top' : 'bottom') : (newCorner.y === 'top' ? 'bottom' : 'top');
			}

			// Update and redraw the tip if needed (check cached details of last drawn tip)
			if(newCorner.string() !== cache.corner.string() && (cache.top !== adjust.top || cache.left !== adjust.left)) {
				self.update(newCorner, FALSE);
			}
		}

		// Setup tip offset properties
		offset = self.position(newCorner, adjust);
		if(offset.right !== undefined) { offset.left = -offset.right; }
		if(offset.bottom !== undefined) { offset.top = -offset.bottom; }
		offset.user = Math.max(0, opts.offset);

		// Viewport "shift" specific adjustments
		if(shift.left = (horizontal === 'shift' && !!adjust.left)) {
			if(newCorner.x === 'center') {
				css['margin-left'] = shift.x = offset['margin-left'] - adjust.left;
			}
			else {
				props = offset.right !== undefined ?
					[ adjust.left, -offset.left ] : [ -adjust.left, offset.left ];

				if( (shift.x = Math.max(props[0], props[1])) > props[0] ) {
					pos.left -= adjust.left;
					shift.left = FALSE;
				}
				
				css[ offset.right !== undefined ? 'right' : 'left' ] = shift.x;
			}
		}
		if(shift.top = (vertical === 'shift' && !!adjust.top)) {
			if(newCorner.y === 'center') {
				css['margin-top'] = shift.y = offset['margin-top'] - adjust.top;
			}
			else {
				props = offset.bottom !== undefined ?
					[ adjust.top, -offset.top ] : [ -adjust.top, offset.top ];

				if( (shift.y = Math.max(props[0], props[1])) > props[0] ) {
					pos.top -= adjust.top;
					shift.top = FALSE;
				}

				css[ offset.bottom !== undefined ? 'bottom' : 'top' ] = shift.y;
			}
		}

		/*
		 * If the tip is adjusted in both dimensions, or in a
		 * direction that would cause it to be anywhere but the
		 * outer border, hide it!
		 */
		elems.tip.css(css).toggle(
			!((shift.x && shift.y) || (newCorner.x === 'center' && shift.y) || (newCorner.y === 'center' && shift.x))
		);

		// Adjust position to accomodate tip dimensions
		pos.left -= offset.left.charAt ? offset.user : horizontal !== 'shift' || shift.top || !shift.left && !shift.top ? offset.left : 0;
		pos.top -= offset.top.charAt ? offset.user : vertical !== 'shift' || shift.left || !shift.left && !shift.top ? offset.top : 0;

		// Cache details
		cache.left = adjust.left; cache.top = adjust.top;
		cache.corner = newCorner.clone();
	}

	/* border width calculator */
	function borderWidth(corner, side, backup) {
		side = !side ? corner[corner.precedance] : side;
		
		var isFluid = tooltip.hasClass(fluidClass),
			isTitleTop = elems.titlebar && corner.y === 'top',
			elem = isTitleTop ? elems.titlebar : elems.content,
			css = 'border-' + side + '-width',
			val;

		// Grab the border-width value (add fluid class if needed)
		tooltip.addClass(fluidClass);
		val = parseInt(elem.css(css), 10);
		val = (backup ? val || parseInt(tooltip.css(css), 10) : val) || 0;
		tooltip.toggleClass(fluidClass, isFluid);

		return val;
	}

	function borderRadius(corner) {
		var isTitleTop = elems.titlebar && corner.y === 'top',
			elem = isTitleTop ? elems.titlebar : elems.content,
			moz = $.browser.mozilla,
			prefix = moz ? '-moz-' : $.browser.webkit ? '-webkit-' : '',
			side = corner.y + (moz ? '' : '-') + corner.x,
			css = prefix + (moz ? 'border-radius-' + side : 'border-' + side + '-radius');

		return parseInt(elem.css(css), 10) || parseInt(tooltip.css(css), 10) || 0;
	}

	function calculateSize(corner) {
		var y = corner.precedance === 'y',
			width = size [ y ? 'width' : 'height' ],
			height = size [ y ? 'height' : 'width' ],
			isCenter = corner.string().indexOf('center') > -1,
			base = width * (isCenter ? 0.5 : 1),
			pow = Math.pow,
			round = Math.round,
			bigHyp, ratio, result,

		smallHyp = Math.sqrt( pow(base, 2) + pow(height, 2) ),
		
		hyp = [
			(border / base) * smallHyp, (border / height) * smallHyp
		];
		hyp[2] = Math.sqrt( pow(hyp[0], 2) - pow(border, 2) );
		hyp[3] = Math.sqrt( pow(hyp[1], 2) - pow(border, 2) );

		bigHyp = smallHyp + hyp[2] + hyp[3] + (isCenter ? 0 : hyp[0]);
		ratio = bigHyp / smallHyp;

		result = [ round(ratio * height), round(ratio * width) ];
		return { height: result[ y ? 0 : 1 ], width: result[ y ? 1 : 0 ] };
	}

	$.extend(self, {
		init: function()
		{
			var enabled = self.detectCorner() && (hasCanvas || $.browser.msie);

			// Determine tip corner and type
			if(enabled) {
				// Create a new tip and draw it
				self.create();
				self.update();

				// Bind update events
				tooltip.unbind(namespace).bind('tooltipmove'+namespace, reposition);
			}
			
			return enabled;
		},

		detectCorner: function()
		{
			var corner = opts.corner,
				posOptions = qTip.options.position,
				at = posOptions.at,
				my = posOptions.my.string ? posOptions.my.string() : posOptions.my;

			// Detect corner and mimic properties
			if(corner === FALSE || (my === FALSE && at === FALSE)) {
				return FALSE;
			}
			else {
				if(corner === TRUE) {
					self.corner = new PLUGINS.Corner(my);
				}
				else if(!corner.string) {
					self.corner = new PLUGINS.Corner(corner);
					self.corner.fixed = TRUE;
				}
			}

			return self.corner.string() !== 'centercenter';
		},

		detectColours: function(actual) {
			var i, fill, border,
				tip = elems.tip.css('cssText', ''),
				corner = actual || self.corner,
				precedance = corner[ corner.precedance ],

				borderSide = 'border-' + precedance + '-color',
				borderSideCamel = 'border' + precedance.charAt(0) + precedance.substr(1) + 'Color',

				invalid = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,
				backgroundColor = 'background-color',
				transparent = 'transparent',
				important = ' !important',

				bodyBorder = $(document.body).css('color'),
				contentColour = qTip.elements.content.css('color'),

				useTitle = elems.titlebar && (corner.y === 'top' || (corner.y === 'center' && tip.position().top + (size.height / 2) + opts.offset < elems.titlebar.outerHeight(1))),
				colorElem = useTitle ? elems.titlebar : elems.content;

			// Apply the fluid class so we can see our CSS values properly
			tooltip.addClass(fluidClass);

			// Detect tip colours from CSS styles
			color.fill = fill = tip.css(backgroundColor);
			color.border = border = tip[0].style[ borderSideCamel ] || tip.css(borderSide) || tooltip.css(borderSide);

			// Make sure colours are valid
			if(!fill || invalid.test(fill)) {
				color.fill = colorElem.css(backgroundColor) || transparent;
				if(invalid.test(color.fill)) {
					color.fill = tooltip.css(backgroundColor) || fill;
				}
			}
			if(!border || invalid.test(border) || border === bodyBorder) {
				color.border = colorElem.css(borderSide) || transparent;
				if(invalid.test(color.border)) {
					color.border = border;
				}
			}

			// Reset background and border colours
			$('*', tip).add(tip).css('cssText', backgroundColor+':'+transparent+important+';border:0'+important+';');

			// Remove fluid class
			tooltip.removeClass(fluidClass);
		},

		create: function()
		{
			var width = size.width,
				height = size.height,
				vml;

			// Remove previous tip element if present
			if(elems.tip) { elems.tip.remove(); }

			// Create tip element and prepend to the tooltip
			elems.tip = $('<div />', { 'class': 'ui-tooltip-tip' }).css({ width: width, height: height }).prependTo(tooltip);

			// Create tip drawing element(s)
			if(hasCanvas) {
				// save() as soon as we create the canvas element so FF2 doesn't bork on our first restore()!
				$('<canvas />').appendTo(elems.tip)[0].getContext('2d').save();
			}
			else {
				vml = '<vml:shape coordorigin="0,0" style="display:inline-block; position:absolute; behavior:url(#default#VML);"></vml:shape>';
				elems.tip.html(vml + vml);

				// Prevent mousing down on the tip since it causes problems with .live() handling in IE due to VML
				$('*', elems.tip).bind('click mousedown', function(event) { event.stopPropagation(); });
			}
		},

		update: function(corner, position)
		{
			var tip = elems.tip,
				inner = tip.children(),
				width = size.width,
				height = size.height,
				regular = 'px solid ',
				transparent = 'px dashed transparent', // Dashed IE6 border-transparency hack. Awesome!
				mimic = opts.mimic,
				round = Math.round,
				precedance, context, coords, translate, newSize;

			// Re-determine tip if not already set
			if(!corner) { corner = cache.corner || self.corner; }

			// Use corner property if we detect an invalid mimic value
			if(mimic === FALSE) { mimic = corner; }

			// Otherwise inherit mimic properties from the corner object as necessary
			else {
				mimic = new PLUGINS.Corner(mimic);
				mimic.precedance = corner.precedance;

				if(mimic.x === 'inherit') { mimic.x = corner.x; }
				else if(mimic.y === 'inherit') { mimic.y = corner.y; }
				else if(mimic.x === mimic.y) {
					mimic[ corner.precedance ] = corner[ corner.precedance ];
				}
			}
			precedance = mimic.precedance;

			// Update our colours
			self.detectColours(corner);

			// Detect border width, taking into account colours
			if(color.border !== 'transparent' && color.border !== '#123456') {
				// Grab border width
				border = borderWidth(corner, NULL, TRUE);

				// If border width isn't zero, use border color as fill (1.0 style tips)
				if(opts.border === 0 && border > 0) { color.fill = color.border; }

				// Set border width (use detected border width if opts.border is true)
				self.border = border = opts.border !== TRUE ? opts.border : border;
			}

			// Border colour was invalid, set border to zero
			else { self.border = border = 0; }

			// Calculate coordinates
			coords = calculateTip(mimic, width , height);

			// Determine tip size
			self.size = newSize = calculateSize(corner);
			tip.css(newSize);

			// Calculate tip translation
			if(corner.precedance === 'y') {
				translate = [
					round(mimic.x === 'left' ? border : mimic.x === 'right' ? newSize.width - width - border : (newSize.width - width) / 2),
					round(mimic.y === 'top' ?  newSize.height - height : 0)
				];
			}
			else {
				translate = [
					round(mimic.x === 'left' ? newSize.width - width : 0),
					round(mimic.y === 'top' ? border : mimic.y === 'bottom' ? newSize.height - height - border : (newSize.height - height) / 2)
				];
			}

			// Canvas drawing implementation
			if(hasCanvas) {
				// Set the canvas size using calculated size
				inner.attr(newSize);
				
				// Grab canvas context and clear/save it
				context = inner[0].getContext('2d');
				context.restore(); context.save();
				context.clearRect(0,0,3000,3000);
				
				// Translate origin
				context.translate(translate[0], translate[1]);
				
				// Draw the tip
				context.beginPath();
				context.moveTo(coords[0][0], coords[0][1]);
				context.lineTo(coords[1][0], coords[1][1]);
				context.lineTo(coords[2][0], coords[2][1]);
				context.closePath();
				context.fillStyle = color.fill;
				context.strokeStyle = color.border;
				context.lineWidth = border * 2;
				context.lineJoin = 'miter';
				context.miterLimit = 100;
				if(border) { context.stroke(); }
				context.fill();
			}

			// VML (IE Proprietary implementation)
			else {
				// Setup coordinates string
				coords = 'm' + coords[0][0] + ',' + coords[0][1] + ' l' + coords[1][0] +
					',' + coords[1][1] + ' ' + coords[2][0] + ',' + coords[2][1] + ' xe';

				// Setup VML-specific offset for pixel-perfection
				translate[2] = border && /^(r|b)/i.test(corner.string()) ?
					parseFloat($.browser.version, 10) === 8 ? 2 : 1 : 0;

				// Set initial CSS
				inner.css({
					antialias: ''+(mimic.string().indexOf('center') > -1),
					left: translate[0] - (translate[2] * Number(precedance === 'x')),
					top: translate[1] - (translate[2] * Number(precedance === 'y')),
					width: width + border,
					height: height + border
				})
				.each(function(i) {
					var $this = $(this);

					// Set shape specific attributes
					$this[ $this.prop ? 'prop' : 'attr' ]({
						coordsize: (width+border) + ' ' + (height+border),
						path: coords,
						fillcolor: color.fill,
						filled: !!i,
						stroked: !!!i
					})
					.css({ display: border || i ? 'block' : 'none' });

					// Check if border is enabled and add stroke element
					if(!i && $this.html() === '') {
						$this.html(
							'<vml:stroke weight="'+(border*2)+'px" color="'+color.border+'" miterlimit="1000" joinstyle="miter" ' +
							' style="behavior:url(#default#VML); display:inline-block;" />'
						);
					}
				});
			}

			// Position if needed
			if(position !== FALSE) { self.position(corner); }
		},

		// Tip positioning method
		position: function(corner)
		{
			var tip = elems.tip,
				position = {},
				userOffset = Math.max(0, opts.offset),
				precedance, dimensions, corners;

			// Return if tips are disabled or tip is not yet rendered
			if(opts.corner === FALSE || !tip) { return FALSE; }

			// Inherit corner if not provided
			corner = corner || self.corner;
			precedance = corner.precedance;

			// Determine which tip dimension to use for adjustment
			dimensions = calculateSize(corner);

			// Setup corners and offset array
			corners = [ corner.x, corner.y ];
			if(precedance === 'x') { corners.reverse(); }

			// Calculate tip position
			$.each(corners, function(i, side) {
				var b, br;

				if(side === 'center') {
					b = precedance === 'y' ? 'left' : 'top';
					position[ b ] = '50%';
					position['margin-' + b] = -Math.round(dimensions[ precedance === 'y' ? 'width' : 'height' ] / 2) + userOffset;
				}
				else {
					b = borderWidth(corner, side, TRUE);
					br = borderRadius(corner);
					
					position[ side ] = i ?
						border ? borderWidth(corner, side) : 0 : 
						userOffset + (br > b ? br : 0);
				}
			});

			// Adjust for tip dimensions
			position[ corner[precedance] ] -= dimensions[ precedance === 'x' ? 'width' : 'height' ];

			// Set and return new position
			tip.css({ top: '', bottom: '', left: '', right: '', margin: '' }).css(position);
			return position;
		},
		
		destroy: function()
		{
			// Remov tip and bound events
			if(elems.tip) { elems.tip.remove(); }
			tooltip.unbind(namespace);
		}
	});

	cache.corner = new PLUGINS.Corner( self.init() );
}

PLUGINS.tip = function(api)
{
	var self = api.plugins.tip;
	
	return 'object' === typeof self ? self : (api.plugins.tip = new Tip(api));
};

// Initialize tip on render
PLUGINS.tip.initialize = 'render';

// Setup plugin sanitization options
PLUGINS.tip.sanitize = function(options)
{
	var style = options.style, opts;
	if(style && 'tip' in style) {
		opts = options.style.tip;
		if(typeof opts !== 'object'){ options.style.tip = { corner: opts }; }
		if(!(/string|boolean/i).test(typeof opts.corner)) { opts.corner = TRUE; }
		if(typeof opts.width !== 'number'){ delete opts.width; }
		if(typeof opts.height !== 'number'){ delete opts.height; }
		if(typeof opts.border !== 'number' && opts.border !== TRUE){ delete opts.border; }
		if(typeof opts.offset !== 'number'){ delete opts.offset; }
	}
};

// Extend original qTip defaults
$.extend(TRUE, QTIP.defaults, {
	style: {
		tip: {
			corner: TRUE,
			mimic: FALSE,
			width: 6,
			height: 6,
			border: TRUE,
			offset: 0
		}
	}
});




PLUGINS.svg = function(svg, corner)
{
	var doc = $(document),
		elem = svg[0],
		result = {
			width: 0, height: 0,
			offset: { top: 1e10, left: 1e10 }
		},
		box, mtx, root, point, tPoint;

	if (elem.getBBox && elem.parentNode) {
		box = elem.getBBox();
		mtx = elem.getScreenCTM();
		root = elem.farthestViewportElement || elem;

		// Return if no method is found
		if(!root.createSVGPoint) { return result; }

		// Create our point var
		point = root.createSVGPoint();

		// Adjust top and left
		point.x = box.x;
		point.y = box.y;
		tPoint = point.matrixTransform(mtx);
		result.offset.left = tPoint.x;
		result.offset.top = tPoint.y;

		// Adjust width and height
		point.x += box.width;
		point.y += box.height;
		tPoint = point.matrixTransform(mtx);
		result.width = tPoint.x - result.offset.left;
		result.height = tPoint.y - result.offset.top;

		// Adjust by scroll offset
		result.offset.left += doc.scrollLeft();
		result.offset.top += doc.scrollTop();
	}

	return result;
};




function Modal(api)
{
	var self = this,
		options = api.options.show.modal,
		elems = api.elements,
		tooltip = elems.tooltip,
		overlaySelector = '#qtip-overlay',
		globalNamespace = '.qtipmodal',
		namespace = globalNamespace + api.id,
		attr = 'is-modal-qtip',
		docBody = $(document.body),
		overlay;

	// Setup option set checks
	api.checks.modal = {
		'^show.modal.(on|blur)$': function() {
			// Initialise
			self.init();
			
			// Show the modal if not visible already and tooltip is visible
			elems.overlay.toggle( tooltip.is(':visible') );
		}
	};

	$.extend(self, {
		init: function()
		{
			// If modal is disabled... return
			if(!options.on) { return self; }

			// Create the overlay if needed
			overlay = self.create();

			// Add unique attribute so we can grab modal tooltips easily via a selector
			tooltip.attr(attr, TRUE)

			// Set z-index
			.css('z-index', PLUGINS.modal.zindex + $(selector+'['+attr+']').length)
			
			// Remove previous bound events in globalNamespace
			.unbind(globalNamespace).unbind(namespace)

			// Apply our show/hide/focus modal events
			.bind('tooltipshow'+globalNamespace+' tooltiphide'+globalNamespace, function(event, api, duration) {
				var oEvent = event.originalEvent;

				// Make sure mouseout doesn't trigger a hide when showing the modal and mousing onto backdrop
				if(oEvent && event.type === 'tooltiphide' && /mouse(leave|enter)/.test(oEvent.type) && $(oEvent.relatedTarget).closest(overlay[0]).length) {
					try { event.preventDefault(); } catch(e) {}
				}
				else if(!oEvent || (oEvent && !oEvent.solo)) {
					self[ event.type.replace('tooltip', '') ](event, duration);
				}
			})

			// Adjust modal z-index on tooltip focus
			.bind('tooltipfocus'+globalNamespace, function(event) {
				// If focus was cancelled before it reearch us, don't do anything
				if(event.isDefaultPrevented()) { return; }

				var qtips = $(selector).filter('['+attr+']'),

				// Keep the modal's lower than other, regular qtips
				newIndex = PLUGINS.modal.zindex + qtips.length,
				curIndex = parseInt(tooltip[0].style.zIndex, 10);

				// Set overlay z-index
				overlay[0].style.zIndex = newIndex - 1;

				// Reduce modal z-index's and keep them properly ordered
				qtips.each(function() {
					if(this.style.zIndex > curIndex) {
						this.style.zIndex -= 1;
					}
				});

				// Fire blur event for focused tooltip
				qtips.end().filter('.' + focusClass).qtip('blur', event.originalEvent);

				// Set the new z-index
				tooltip.addClass(focusClass)[0].style.zIndex = newIndex;

				// Prevent default handling
				try { event.preventDefault(); } catch(e) {}
			})

			// Focus any other visible modals when this one hides
			.bind('tooltiphide'+globalNamespace, function(event) {
				$('[' + attr + ']').filter(':visible').not(tooltip).last().qtip('focus', event);
			});

			// Apply keyboard "Escape key" close handler
			if(options.escape) {
				$(window).unbind(namespace).bind('keydown'+namespace, function(event) {
					if(event.keyCode === 27 && tooltip.hasClass(focusClass)) {
						api.hide(event);
					}
				});
			}

			// Apply click handler for blur option
			if(options.blur) {
				elems.overlay.unbind(namespace).bind('click'+namespace, function(event) {
					if(tooltip.hasClass(focusClass)) { api.hide(event); }
				});
			}

			return self;
		},

		create: function()
		{
			var elem = $(overlaySelector);

			// Return if overlay is already rendered
			if(elem.length) {
				// Modal overlay should always be below all tooltips if possible
				return (elems.overlay = elem.insertAfter( $(selector).last() ));
			}

			// Create document overlay
			overlay = elems.overlay = $('<div />', {
				id: overlaySelector.substr(1),
				html: '<div></div>',
				mousedown: function() { return FALSE; }
			})
			.insertAfter( $(selector).last() );
            //modified by wuxiumei --------------begin-----------------//
			// Update position on window resize or scroll
			$(window).unbind(globalNamespace).bind('resize'+globalNamespace, function() {
				overlay.css({
					height: $(document).height(),
					width: $(document).width()
				});
			})
			.triggerHandler('resize');

			return overlay;
		},

		toggle: function(event, state, duration)
		{
			// Make sure default event hasn't been prevented
			if(event && event.isDefaultPrevented()) { return self; }

			var effect = options.effect,
				type = state ? 'show': 'hide',
				visible = overlay.is(':visible'),
				modals = $('[' + attr + ']').filter(':visible').not(tooltip),
				zindex;

			// Create our overlay if it isn't present already
			if(!overlay) { overlay = self.create(); }

			// Prevent modal from conflicting with show.solo, and don't hide backdrop is other modals are visible
			if((overlay.is(':animated') && visible === state) || (!state && modals.length)) { return self; }

			// State specific...
			if(state) {
				// Set position
				overlay.css({ left: 0, top: 0 });

				// Toggle backdrop cursor style on show
				overlay.toggleClass('blurs', options.blur);

				// Make sure we can't focus anything outside the tooltip
				docBody.bind('focusin'+namespace, function(event) {
					var target = $(event.target),
						container = target.closest('.qtip'),

					// Determine if input container target is above this
					targetOnTop = container.length < 1 ? FALSE : 
						(parseInt(container[0].style.zIndex, 10) > parseInt(tooltip[0].style.zIndex, 10)); 

					// If we're showing a modal, but focus has landed on an input below
					// this modal, divert focus to the first visible input in this modal
					if(!targetOnTop && ($(event.target).closest(selector)[0] !== tooltip[0])) {
						tooltip.find('input:visible').filter(':first').focus();
					}
				});
			}
			else {
				// Undelegate focus handler
				docBody.undelegate('*', 'focusin'+namespace);
			}

			// Stop all animations
			overlay.stop(TRUE, FALSE);

			// Use custom function if provided
			if($.isFunction(effect)) {
				effect.call(overlay, state);
			}

			// If no effect type is supplied, use a simple toggle
			else if(effect === FALSE) {
				overlay[ type ]();
			}

			// Use basic fade function
			else {
				overlay.fadeTo( parseInt(duration, 10) || 90, state ? 1 : 0, function() {
					if(!state) { $(this).hide(); }
				});
			}

			// Reset position on hide
			if(!state) {
				overlay.queue(function(next) {
					overlay.css({ left: '', top: '' });
					next();
				});
			}

			return self;
		},

		show: function(event, duration) { return self.toggle(event, TRUE, duration); },
		hide: function(event, duration) { return self.toggle(event, FALSE, duration); },

		destroy: function()
		{
			var delBlanket = overlay;

			if(delBlanket) {
				// Check if any other modal tooltips are present
				delBlanket = $('[' + attr + ']').not(tooltip).length < 1;

				// Remove overlay if needed
				if(delBlanket) {
					elems.overlay.remove();
					$(window).unbind(globalNamespace);
				}
				else {
					elems.overlay.unbind(globalNamespace+api.id);
				}

				// Undelegate focus handler
				docBody.undelegate('*', 'focusin'+namespace);
			}

			// Remove bound events
			return tooltip.removeAttr(attr).unbind(globalNamespace);
		}
	});

	self.init();
}

PLUGINS.modal = function(api) {
	var self = api.plugins.modal;

	return 'object' === typeof self ? self : (api.plugins.modal = new Modal(api));
};

// Plugin needs to be initialized on render
PLUGINS.modal.initialize = 'render';

// Setup sanitiztion rules
PLUGINS.modal.sanitize = function(opts) {
	if(opts.show) { 
		if(typeof opts.show.modal !== 'object') { opts.show.modal = { on: !!opts.show.modal }; }
		else if(typeof opts.show.modal.on === 'undefined') { opts.show.modal.on = TRUE; }
	}
};

// Base z-index for all modal tooltips (use qTip core z-index as a base)
PLUGINS.modal.zindex = QTIP.zindex + 1000;

// Extend original api defaults
$.extend(TRUE, QTIP.defaults, {
	show: {
		modal: {
			on: FALSE,
			effect: TRUE,
			blur: TRUE,
			escape: TRUE
		}
	}
});




/* 
 * BGIFrame adaption (http://plugins.jquery.com/project/bgiframe)
 * Special thanks to Brandon Aaron
 */
function BGIFrame(api)
{
	var self = this,
		elems = api.elements,
		tooltip = elems.tooltip,
		namespace = '.bgiframe-' + api.id;

	$.extend(self, {
		init: function()
		{
			// Create the BGIFrame element
			elems.bgiframe = $('<iframe class="ui-tooltip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';" ' +
				' style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); ' +
					'-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>');

			// Append the new element to the tooltip
			elems.bgiframe.appendTo(tooltip);

			// Update BGIFrame on tooltip move
			tooltip.bind('tooltipmove'+namespace, self.adjust);
		},

		adjust: function()
		{
			var dimensions = api.get('dimensions'), // Determine current tooltip dimensions
				plugin = api.plugins.tip,
				tip = elems.tip,
				tipAdjust, offset;

			// Adjust border offset
			offset = parseInt(tooltip.css('border-left-width'), 10) || 0;
			offset = { left: -offset, top: -offset };

			// Adjust for tips plugin
			if(plugin && tip) {
				tipAdjust = (plugin.corner.precedance === 'x') ? ['width', 'left'] : ['height', 'top'];
				offset[ tipAdjust[1] ] -= tip[ tipAdjust[0] ]();
			}

			// Update bgiframe
			elems.bgiframe.css(offset).css(dimensions);
		},

		destroy: function()
		{
			// Remove iframe
			elems.bgiframe.remove();

			// Remove bound events
			tooltip.unbind(namespace);
		}
	});

	self.init();
}

PLUGINS.bgiframe = function(api)
{
	var browser = $.browser,
		self = api.plugins.bgiframe;
	
		// Proceed only if the browser is IE6 and offending elements are present
		if($('select, object').length < 1 || !(browser.msie && (''+browser.version).charAt(0) === '6')) {
		return FALSE;
	}

	return 'object' === typeof self ? self : (api.plugins.bgiframe = new BGIFrame(api));
};

// Plugin needs to be initialized on render
PLUGINS.bgiframe.initialize = 'render';





}(jQuery, window));

/**
 * 占文档流的tip插件
 *
 * @module ptip
 * @author wuxiumei
 * @requires 
 */
;(function($) {
	/**
	 * 参数说明：
	 * id：创建tip的id，若不指定，默认从0开始自增长
	 * uitooltip：样式前缀
	 * target：目标对象，tip插在这个对象的后面
	 * content.text tip的内容，可以是字符串、jquery对象或函数（有字符或jquery对象返回）
	 * content.title.text
	 */
	
    //定义全局变量
	var PTIP ={
		nextid:0	
	};
	PTIP.defaults ={
			id:'ptip-id',
            uitooltip:'ui-appendtip',
            target:  $('html'),
            triggerBy: null,
            content: {
	            text: '',
	            title: {
	                text:false,
	                button: false
	             },
				show: {
	              event: 'click'
	            } 
           },
          style:{
			  classes:''
          } 
	 };
	$.fn.pTip=function(opts) {
    	ops = $.extend(PTIP.defaults, opts);
	   //return this.each(function(i) {
    	api = init.call(this, opts.id, opts);
	   //})
      };
       
       
   /*
    * 构造方法
    * options.button 是否有关闭按钮
    * options.target 插入位置
    */
   function appendTip(id, options){
	   self.elements = elements = {
			   tooltip:null,
			   titlebar:null,
			   button:null,
			   title :null,
			   content:null
			   };
	   id = !id || id === false || id.length < 1 ? 'ptip-id-'+(PTIP.nextid) : id;
	   self.id = id;
	   self.options = options;
	   //样式显示前缀
	   var uitooltip = options.uitooltip;
	   var tooltipID = id;
	   var ptipToken = "ptip";
	   if(options.triggerBy && options.triggerBy.jquery){
		  // options.triggerBy.live('click',function(event){
			      var $to = options.target;
			      if(!self.elements.tooltip){
				      var $tip = createTip(options);
				      self.elements.tooltip = $tip ;
				      $to.html($tip);
				      $tip.show();
			     } 
	   }
	   
	 //创建关闭按钮
	 function createButton()
		{
		    var button = options.content.title.button,
				isString = typeof button === 'string',
				close = isString ? button : '关闭';

			if(elements.button) { elements.button.remove(); }

			// Use custom button if one was supplied by user, else use default用户提供的jquery对象
			if(button.jquery) {
				elements.button = button;
			}
			else {
				elements.button = $('<a />', {
					'class': uitooltip + '-close',
					'title': close,
					'aria-label': close
				})
				.prepend(
					$('<span />', {
						'html': '&times;'
					})
				);
			}

			// Create button and setup attributes
			 return elements.button.appendTo(elements.titlebar);
			// Redraw the tooltip when we're done
			//self.redraw();
		}
	 //创建标题栏
	 function createTitle()
		{
			var tid = self.id +'-title';

			// Destroy previous title element, if present
			if(elements.titlebar) { removeTitle(); }

			// Create title bar and title elements
			self.elements.titlebar = $('<div />', {
				'class': uitooltip + '-titlebar'
			})
			.append(
				elements.title = $('<div />', {
					'id': tid,
					'class': uitooltip + '-title'
				})
			)
			.insertBefore(elements.content);
            // Button-specific events
			/*.delegate('.ui-tooltip-close', 'mouseover mouseout', function(event){
				$(this).toggleClass('ui-state-hover', event.type === 'mouseover');
			});*/

			// Create button if enabled
			if(options.content.title.button) {
				//创建button并绑定事件
				var $close = createButton();
				$close.click(function(event) {
					$(event.target).closest('.'+ptipToken)
					.hide(); 
					return false;
				}); 
			}
		}
	 
	 function removeTitle()
		{
			if(elements.title) {
				elements.titlebar.remove();
				elements.titlebar = elements.title = elements.button = null;
			}
		}
	 
	 function createTip(options){
		elements.tooltip = $('<div/>', {
			//'id': tooltipID,
			'class': ptipToken +' '+ uitooltip + '-tip '+ uitooltip+'-pos'
		})
		.data('ptip', self)
		.append(
			// Create content element
			elements.content = $('<div />', {
				'class': uitooltip + '-content',
				'id': tooltipID + '-content'
			})
		);
		createTitle();
		addContent(options);
		return elements.tooltip;
	};
	
	function addContent(options){
		var elem = elements.content;
		// Use function to parse content
		if($.isFunction(options.content.text)) {
			options.content.text = options.content.text.call(window);
		}

		// Append new content if its a DOM array and show it if hidden
		if(options.content.text.jquery && options.content.text.length > 0) {
			elem.empty().append(options.content.text.css({ display: 'block' }));
		}

		// Content is a regular string, insert the new content
		else { elem.html(options.content.text); }
		
	}
   
   }
   
   function init(id,ops){
	   obj = new appendTip(id,ops);
	   $.data(this, 'ptip', obj);
       return obj;
	   
   }
  
   
   
})(jQuery);
/**
 * 分享组件
 *
 * @module pg
 * @submodule share component
 * @author wuxiumei
 * @requires jquery.qtip jquery.ptip jquery.jtemplate
 * @params
 *  必传参数：
 *  content: 分享的内容
 *  url ：分享来源
 *  target：分享弹框显示所在jquery对象
 *  triggerBy：触发分享的jquery对象
 *  kaixin.title 分享的标题，仅开心网的特殊参数
 *  weiboAppKey:微博来源的认证码
 *  可选参数
 *  addURLContent: 含来源链接的分享内容
 *  images：分享中需显示的图片，目前仅支持添加一个图片链接。
 *           由于对方产品的分享接口不全支持图片，仅新浪、豆瓣、搜狐、网易、qq能显示
 *           人人网的图片是从来源网址自动解析的。
 *  type: tip的类型,有'append'、'pop'两个取值，
 *  	  'append'为占文档流的弹框，'pop'为不占文档流的弹框，默认为'append'
 *  position：若tip为pop，此参数为有效，默认为'position': {'my': 'top left','at': 'bottom right'}
 *  不需传递参数：
 *  des ：分享到的产品名，如163，sina
 */
 (function() {
     var S = function(tplId){
	  this.shareTplId = tplId;
	  this.defaultOps={
				'des':'',
				'content':'',
				'addURLContent':'',
				'url': location.href,
				'images':'',
				'target':null,
				'triggerBy':null,
				'kaixin':{
				  'title':''
				},
				'wangyiSource': encodeURIComponent('盘古搜索'),
				'weiboAppKey':{
					'qq':'',
					'sina':'',
					'wangyi':'',
					'sohu':'',
					'yidong139':''
				  },
				 'type':'append',
				 'position': {
					   'my': 'top left',// Use the corner...
					   'at': 'bottom right' // ...and opposite corner
					}
			  };
	}
	 
	 
	 S.prototype = { 
		init_content: function(tplURL,json){
			 $('<div id = '+this.shareTplId+'></div>')
			 .appendTo($('body'))
			 .hide()
             .setTemplateURL(tplURL)
    		 .processTemplate(json);
	   },
	   //跨子域通信,模板需在chinaso.com域名下,默认的跨越文件路径为http://www.chinaso.com/static/pg_cd_proxy.html
	   init_cd_content: function(tplURL,data,cdURL){
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
		    	$('<div id = '+tplId+'></div>').html(data)
		    	.appendTo($('body'))
			    .hide();
			    $('#'+tplId).processTemplate(data);
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
        bind_share_content: function(opts){
		   var $temp = $('#'+this.shareTplId);
		   var $tpl = $temp.clone();
		   return this._bind_content(opts,$tpl);
		},
		_bind_content: function(opts,$tpl){
			   var _this = this;
				$tpl.find('a').unbind('click').bind('click',opts,function(event){
					eventObj = event.srcElement ? event.srcElement : event.target;
					 var des = $(eventObj).attr('des');
					 event.data.des = des;
					 _this._share_to(event.data);
					 return false;
				 });
				return $tpl;
			},
		share: function (opts){
			var defaultOps = this.defaultOps;
			opts = $.extend(defaultOps, opts);
			if(opts.type=='append'){
				this.invoke_appendtip(opts);
			}else if(opts.type=='pop'){
				this.invoke_poptip(opts);
			}		
		},
		invoke_appendtip:function (opts){
			//加载了jquery.ptip.js
		  if($('body').pTip&&$.isFunction($('body').pTip)){
			$('body').pTip({
					  uitooltip:'ui-appendtip',
					  target:opts.target,
					  triggerBy: opts.triggerBy,
					  content: {
					  text:  this.bind_share_content(opts),
					  title: {
						  text: '',
						  button: true
					  }
					}
				 })
		   }
		},
	 invoke_poptip:function(opts){
	  var _this = this;
	  var $temp = $('#'+_this.shareTplId);//.clone(true);
	  var $tpl = null;
	  if($.browser.msie&&($.browser.version==='6.0'||$.browser.version==='7.0')){
		  pclone = $temp[0].cloneNode(true);
		  $tpl = $(pclone);
	  }else{
		  $tpl = $temp.clone(); 
	  }
	  //加载了jquery.qip.js
	  if(opts.triggerBy.qtip&&$.isFunction(opts.triggerBy.qtip)){
	  	//opts.triggerBy.removeData('qtip');
		opts.triggerBy.each(function(){
			$(this).qtip({
		           content: {
				   text:  _this._bind_content(opts,$tpl), 
				   title: {
					  text:'&nbsp;',
					  button: true
				   }
				},
				overwrite: false,
				position: opts.position,
				show: {
				   event: 'click', // Don't specify a show event...
				   ready: true, // ... but show the tooltip when ready
				   solo: true
				},
				hide: false, // Don't specify a hide event either!
				style: {
				   classes: 'chinaso-ui-tooltip ui-tooltip-shadow ui-tooltip-light'
				}
			 });
		})
	  }
	},
	invoke_modaltip:function (opts){
		//加载了jquery.qip.js
	  if(opts.triggerBy.qtip&&$.isFunction(opts.triggerBy.qtip)){
		 opts.triggerBy
		 .qtip({
		  id: 'modal', // Since we're only creating one modal, give it an ID so we can style it
		  content: {
			 text: this.bind_share_content(opts),
			 title: {
				text: true,
				button: true
			 }
		  },
		  position: {
			 my: 'center', // ...at the center of the viewport
			 at: 'center',
			 target: $(window)
		  },
		  show: {
			 event: 'click', // Show it on click...
			 solo: true, // ...and hide all other tooltips...
			 modal: true // ...and make it modal
		  },
		  hide: false,
		  style: {
		  classes:'ui-tooltip-light ui-tooltip-rounded'
		  }
	   });
	  }
	},
/**
  * @param des
  * @param title
  * @param content
  * @param fromUrl 分享来源网址
  * @param 
  * @return
  * 
  * 备注：此方法不包含记录点击log逻辑
  */
  _share_to:function (params){
		var des = params.des;
		var imgURL = params.images;
		var content = params.content;
		var title = params.kaixin.title;
		var addURLContent = params.addURLContent;
		var url = params.url;//来源网址
		if(!params.addURLContent||$.trim(params.addURLContent)<1){
			addURLContent = content;
		}
		var s = screen;
		var d = document;
		var e = encodeURIComponent;
		var f = "";//收藏URL
		var p = "";//收藏的参数
		if (des == 'sk139') {
			//不能带图，url自动添加到内容上
			f = "http://shequ.10086.cn/share/share.php";
			p = "?title=" + e(content)+
				  '&url=' + e(url);
		} else if (des == 't.sina') {
			//url自动添加到内容上,图片不宜过大，否则新浪不分享
			f = "http://v.t.sina.com.cn/share/share.php";
			p = '?title=' + e(content) + 
				'&url=' + e(url)+
				'&pic=' + e(imgURL)+
				'&appkey='+params.weiboAppKey.sina;
		} else if (des == 'kaixin') {
			//f = "http://www.kaixin001.com/repaste/share.php";
			f="http://www.kaixin001.com/rest/records.php";
			//能携带图片,开心网分享参数中含有标题和内容，url自动添加到内容上
			p = '?url=' + e(url)  +
				'&title=' + e(title) +
				'&content=' + e(content)+
				'&pic='+e(imgURL)+"&style=11";
		} else if (des == 'douban') {
			//点击分享的内容会链接到url所在的地址
			f = "http://www.douban.com/recommend/";
			p = '?url=' + e(url) +
				'&title=' + e(content)+
				'&image=' + e(imgURL);
		}else if (des == 'renren') {
			//不支持图片的参数，从url参数网站自动解析图片，生成的title也会自动生成到此url的链接
			f = "http://share.renren.com/share/buttonshare/post/1004";
			p = '?url=' + e(url)  +
				'&title=' + e(title) +
				'&content='+ e(addURLContent) +
				'&pic='+ e(imgURL);
		}else if (des == 't.sohu') {
			//搜狐的title参数为显示的主要内容，内容后面会自动带上url参数
			f = "http://t.sohu.com/third/post.jsp";
			p = '?content=utf-8'+
				'&url=' + e(url) +
				'&title=' + e(content)+
				'&pic=' + e(imgURL) +
				'&appkey='+params.weiboAppKey.sohu;
		}else if (des == 't.wangyi') {
			f = "http://t.163.com/article/user/checkLogin.do";
			//网易显示内容为info，不会自动带上url参数，根据source的文字自动识别来源网址，这里source 为盘古搜索
			p = '?info='+ e(addURLContent) +
				//'&source=%E7%9B%98%E5%8F%A4%E6%90%9C%E7%B4%A2'+
				'&source='+ params.wangyiSource +
				'&images=' + e(imgURL) + 
				'&link=' + e(url)+//此参数貌似没用
				'&appkey=' + params.weiboAppKey.wangyi;
		}else if (des == 't.qq') {
			//腾讯微博通过appkey来识别来源网站,title参数为显示的主要内容，内容后面会自动带上url参数
			f = "http://v.t.qq.com/share/share.php";
			p = '?title=' + e(content) +
				'&url=' + e(url) + 
				'&site='+ e(url) +
				'&pic=' + e(imgURL) +
				'&appkey=' + params.weiboAppKey.qq ;
		}else {
			alert("error in invoking share_to()");
		}   
		window.open(f + p,"_blank", 
				['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join(''));
	}
	};
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.shareComponent= new S("PgShareTpl");
	 
  })();