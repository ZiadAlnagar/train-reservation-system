/*! jQuery UI - v1.12.1 - 2021-05-16
* http://jqueryui.com
* Includes: widget.js, form-reset-mixin.js, keycode.js, labels.js, unique-id.js, widgets/button.js, widgets/checkboxradio.js, widgets/controlgroup.js, widgets/mouse.js, widgets/slider.js, widgets/tabs.js, effect.js, effects/effect-fade.js, effects/effect-slide.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.ui = $.ui || {};

var version = $.ui.version = "1.12.1";


/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/



var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

var widget = $.widget;




// Support: IE8 Only
// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
// with a string, so we need to find the proper form.
var form = $.fn.form = function() {
	return typeof this[ 0 ].form === "string" ? this.closest( "form" ) : $( this[ 0 ].form );
};


/*!
 * jQuery UI Form Reset Mixin 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Form Reset Mixin
//>>group: Core
//>>description: Refresh input widgets when their form is reset
//>>docs: http://api.jqueryui.com/form-reset-mixin/



var formResetMixin = $.ui.formResetMixin = {
	_formResetHandler: function() {
		var form = $( this );

		// Wait for the form reset to actually happen before refreshing
		setTimeout( function() {
			var instances = form.data( "ui-form-reset-instances" );
			$.each( instances, function() {
				this.refresh();
			} );
		} );
	},

	_bindFormResetHandler: function() {
		this.form = this.element.form();
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" ) || [];
		if ( !instances.length ) {

			// We don't use _on() here because we use a single event handler per form
			this.form.on( "reset.ui-form-reset", this._formResetHandler );
		}
		instances.push( this );
		this.form.data( "ui-form-reset-instances", instances );
	},

	_unbindFormResetHandler: function() {
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" );
		instances.splice( $.inArray( this, instances ), 1 );
		if ( instances.length ) {
			this.form.data( "ui-form-reset-instances", instances );
		} else {
			this.form
				.removeData( "ui-form-reset-instances" )
				.off( "reset.ui-form-reset" );
		}
	}
};


/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


var keycode = $.ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
};




// Internal use only
var escapeSelector = $.ui.escapeSelector = ( function() {
	var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
	return function( selector ) {
		return selector.replace( selectorEscape, "\\$1" );
	};
} )();


/*!
 * jQuery UI Labels 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: labels
//>>group: Core
//>>description: Find all the labels associated with a given input
//>>docs: http://api.jqueryui.com/labels/



var labels = $.fn.labels = function() {
	var ancestor, selector, id, labels, ancestors;

	// Check control.labels first
	if ( this[ 0 ].labels && this[ 0 ].labels.length ) {
		return this.pushStack( this[ 0 ].labels );
	}

	// Support: IE <= 11, FF <= 37, Android <= 2.3 only
	// Above browsers do not support control.labels. Everything below is to support them
	// as well as document fragments. control.labels does not work on document fragments
	labels = this.eq( 0 ).parents( "label" );

	// Look for the label based on the id
	id = this.attr( "id" );
	if ( id ) {

		// We don't search against the document in case the element
		// is disconnected from the DOM
		ancestor = this.eq( 0 ).parents().last();

		// Get a full set of top level ancestors
		ancestors = ancestor.add( ancestor.length ? ancestor.siblings() : this.siblings() );

		// Create a selector for the label based on the id
		selector = "label[for='" + $.ui.escapeSelector( id ) + "']";

		labels = labels.add( ancestors.find( selector ).addBack( selector ) );

	}

	// Return whatever we have found for labels
	return this.pushStack( labels );
};


/*!
 * jQuery UI Unique ID 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/



var uniqueId = $.fn.extend( {
	uniqueId: ( function() {
		var uuid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			} );
		};
	} )(),

	removeUniqueId: function() {
		return this.each( function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		} );
	}
} );


/*!
 * jQuery UI Controlgroup 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Controlgroup
//>>group: Widgets
//>>description: Visually groups form control widgets
//>>docs: http://api.jqueryui.com/controlgroup/
//>>demos: http://jqueryui.com/controlgroup/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/controlgroup.css
//>>css.theme: ../../themes/base/theme.css


var controlgroupCornerRegex = /ui-corner-([a-z]){2,6}/g;

var widgetsControlgroup = $.widget( "ui.controlgroup", {
	version: "1.12.1",
	defaultElement: "<div>",
	options: {
		direction: "horizontal",
		disabled: null,
		onlyVisible: true,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"controlgroupLabel": ".ui-controlgroup-label",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select",
			"spinner": ".ui-spinner-input"
		}
	},

	_create: function() {
		this._enhance();
	},

	// To support the enhanced option in jQuery Mobile, we isolate DOM manipulation
	_enhance: function() {
		this.element.attr( "role", "toolbar" );
		this.refresh();
	},

	_destroy: function() {
		this._callChildMethod( "destroy" );
		this.childWidgets.removeData( "ui-controlgroup-data" );
		this.element.removeAttr( "role" );
		if ( this.options.items.controlgroupLabel ) {
			this.element
				.find( this.options.items.controlgroupLabel )
				.find( ".ui-controlgroup-label-contents" )
				.contents().unwrap();
		}
	},

	_initWidgets: function() {
		var that = this,
			childWidgets = [];

		// First we iterate over each of the items options
		$.each( this.options.items, function( widget, selector ) {
			var labels;
			var options = {};

			// Make sure the widget has a selector set
			if ( !selector ) {
				return;
			}

			if ( widget === "controlgroupLabel" ) {
				labels = that.element.find( selector );
				labels.each( function() {
					var element = $( this );

					if ( element.children( ".ui-controlgroup-label-contents" ).length ) {
						return;
					}
					element.contents()
						.wrapAll( "<span class='ui-controlgroup-label-contents'></span>" );
				} );
				that._addClass( labels, null, "ui-widget ui-widget-content ui-state-default" );
				childWidgets = childWidgets.concat( labels.get() );
				return;
			}

			// Make sure the widget actually exists
			if ( !$.fn[ widget ] ) {
				return;
			}

			// We assume everything is in the middle to start because we can't determine
			// first / last elements until all enhancments are done.
			if ( that[ "_" + widget + "Options" ] ) {
				options = that[ "_" + widget + "Options" ]( "middle" );
			} else {
				options = { classes: {} };
			}

			// Find instances of this widget inside controlgroup and init them
			that.element
				.find( selector )
				.each( function() {
					var element = $( this );
					var instance = element[ widget ]( "instance" );

					// We need to clone the default options for this type of widget to avoid
					// polluting the variable options which has a wider scope than a single widget.
					var instanceOptions = $.widget.extend( {}, options );

					// If the button is the child of a spinner ignore it
					// TODO: Find a more generic solution
					if ( widget === "button" && element.parent( ".ui-spinner" ).length ) {
						return;
					}

					// Create the widget if it doesn't exist
					if ( !instance ) {
						instance = element[ widget ]()[ widget ]( "instance" );
					}
					if ( instance ) {
						instanceOptions.classes =
							that._resolveClassesValues( instanceOptions.classes, instance );
					}
					element[ widget ]( instanceOptions );

					// Store an instance of the controlgroup to be able to reference
					// from the outermost element for changing options and refresh
					var widgetElement = element[ widget ]( "widget" );
					$.data( widgetElement[ 0 ], "ui-controlgroup-data",
						instance ? instance : element[ widget ]( "instance" ) );

					childWidgets.push( widgetElement[ 0 ] );
				} );
		} );

		this.childWidgets = $( $.unique( childWidgets ) );
		this._addClass( this.childWidgets, "ui-controlgroup-item" );
	},

	_callChildMethod: function( method ) {
		this.childWidgets.each( function() {
			var element = $( this ),
				data = element.data( "ui-controlgroup-data" );
			if ( data && data[ method ] ) {
				data[ method ]();
			}
		} );
	},

	_updateCornerClass: function( element, position ) {
		var remove = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all";
		var add = this._buildSimpleOptions( position, "label" ).classes.label;

		this._removeClass( element, null, remove );
		this._addClass( element, null, add );
	},

	_buildSimpleOptions: function( position, key ) {
		var direction = this.options.direction === "vertical";
		var result = {
			classes: {}
		};
		result.classes[ key ] = {
			"middle": "",
			"first": "ui-corner-" + ( direction ? "top" : "left" ),
			"last": "ui-corner-" + ( direction ? "bottom" : "right" ),
			"only": "ui-corner-all"
		}[ position ];

		return result;
	},

	_spinnerOptions: function( position ) {
		var options = this._buildSimpleOptions( position, "ui-spinner" );

		options.classes[ "ui-spinner-up" ] = "";
		options.classes[ "ui-spinner-down" ] = "";

		return options;
	},

	_buttonOptions: function( position ) {
		return this._buildSimpleOptions( position, "ui-button" );
	},

	_checkboxradioOptions: function( position ) {
		return this._buildSimpleOptions( position, "ui-checkboxradio-label" );
	},

	_selectmenuOptions: function( position ) {
		var direction = this.options.direction === "vertical";
		return {
			width: direction ? "auto" : false,
			classes: {
				middle: {
					"ui-selectmenu-button-open": "",
					"ui-selectmenu-button-closed": ""
				},
				first: {
					"ui-selectmenu-button-open": "ui-corner-" + ( direction ? "top" : "tl" ),
					"ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "top" : "left" )
				},
				last: {
					"ui-selectmenu-button-open": direction ? "" : "ui-corner-tr",
					"ui-selectmenu-button-closed": "ui-corner-" + ( direction ? "bottom" : "right" )
				},
				only: {
					"ui-selectmenu-button-open": "ui-corner-top",
					"ui-selectmenu-button-closed": "ui-corner-all"
				}

			}[ position ]
		};
	},

	_resolveClassesValues: function( classes, instance ) {
		var result = {};
		$.each( classes, function( key ) {
			var current = instance.options.classes[ key ] || "";
			current = $.trim( current.replace( controlgroupCornerRegex, "" ) );
			result[ key ] = ( current + " " + classes[ key ] ).replace( /\s+/g, " " );
		} );
		return result;
	},

	_setOption: function( key, value ) {
		if ( key === "direction" ) {
			this._removeClass( "ui-controlgroup-" + this.options.direction );
		}

		this._super( key, value );
		if ( key === "disabled" ) {
			this._callChildMethod( value ? "disable" : "enable" );
			return;
		}

		this.refresh();
	},

	refresh: function() {
		var children,
			that = this;

		this._addClass( "ui-controlgroup ui-controlgroup-" + this.options.direction );

		if ( this.options.direction === "horizontal" ) {
			this._addClass( null, "ui-helper-clearfix" );
		}
		this._initWidgets();

		children = this.childWidgets;

		// We filter here because we need to track all childWidgets not just the visible ones
		if ( this.options.onlyVisible ) {
			children = children.filter( ":visible" );
		}

		if ( children.length ) {

			// We do this last because we need to make sure all enhancment is done
			// before determining first and last
			$.each( [ "first", "last" ], function( index, value ) {
				var instance = children[ value ]().data( "ui-controlgroup-data" );

				if ( instance && that[ "_" + instance.widgetName + "Options" ] ) {
					var options = that[ "_" + instance.widgetName + "Options" ](
						children.length === 1 ? "only" : value
					);
					options.classes = that._resolveClassesValues( options.classes, instance );
					instance.element[ instance.widgetName ]( options );
				} else {
					that._updateCornerClass( children[ value ](), value );
				}
			} );

			// Finally call the refresh method on each of the child widgets.
			this._callChildMethod( "refresh" );
		}
	}
} );

/*!
 * jQuery UI Checkboxradio 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Checkboxradio
//>>group: Widgets
//>>description: Enhances a form with multiple themeable checkboxes or radio buttons.
//>>docs: http://api.jqueryui.com/checkboxradio/
//>>demos: http://jqueryui.com/checkboxradio/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.structure: ../../themes/base/checkboxradio.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.checkboxradio", [ $.ui.formResetMixin, {
	version: "1.12.1",
	options: {
		disabled: null,
		label: null,
		icon: true,
		classes: {
			"ui-checkboxradio-label": "ui-corner-all",
			"ui-checkboxradio-icon": "ui-corner-all"
		}
	},

	_getCreateOptions: function() {
		var disabled, labels;
		var that = this;
		var options = this._super() || {};

		// We read the type here, because it makes more sense to throw a element type error first,
		// rather then the error for lack of a label. Often if its the wrong type, it
		// won't have a label (e.g. calling on a div, btn, etc)
		this._readType();

		labels = this.element.labels();

		// If there are multiple labels, use the last one
		this.label = $( labels[ labels.length - 1 ] );
		if ( !this.label.length ) {
			$.error( "No label found for checkboxradio widget" );
		}

		this.originalLabel = "";

		// We need to get the label text but this may also need to make sure it does not contain the
		// input itself.
		this.label.contents().not( this.element[ 0 ] ).each( function() {

			// The label contents could be text, html, or a mix. We concat each element to get a
			// string representation of the label, without the input as part of it.
			that.originalLabel += this.nodeType === 3 ? $( this ).text() : this.outerHTML;
		} );

		// Set the label option if we found label text
		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}
		return options;
	},

	_create: function() {
		var checked = this.element[ 0 ].checked;

		this._bindFormResetHandler();

		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled;
		}

		this._setOption( "disabled", this.options.disabled );
		this._addClass( "ui-checkboxradio", "ui-helper-hidden-accessible" );
		this._addClass( this.label, "ui-checkboxradio-label", "ui-button ui-widget" );

		if ( this.type === "radio" ) {
			this._addClass( this.label, "ui-checkboxradio-radio-label" );
		}

		if ( this.options.label && this.options.label !== this.originalLabel ) {
			this._updateLabel();
		} else if ( this.originalLabel ) {
			this.options.label = this.originalLabel;
		}

		this._enhance();

		if ( checked ) {
			this._addClass( this.label, "ui-checkboxradio-checked", "ui-state-active" );
			if ( this.icon ) {
				this._addClass( this.icon, null, "ui-state-hover" );
			}
		}

		this._on( {
			change: "_toggleClasses",
			focus: function() {
				this._addClass( this.label, null, "ui-state-focus ui-visual-focus" );
			},
			blur: function() {
				this._removeClass( this.label, null, "ui-state-focus ui-visual-focus" );
			}
		} );
	},

	_readType: function() {
		var nodeName = this.element[ 0 ].nodeName.toLowerCase();
		this.type = this.element[ 0 ].type;
		if ( nodeName !== "input" || !/radio|checkbox/.test( this.type ) ) {
			$.error( "Can't create checkboxradio on element.nodeName=" + nodeName +
				" and element.type=" + this.type );
		}
	},

	// Support jQuery Mobile enhanced option
	_enhance: function() {
		this._updateIcon( this.element[ 0 ].checked );
	},

	widget: function() {
		return this.label;
	},

	_getRadioGroup: function() {
		var group;
		var name = this.element[ 0 ].name;
		var nameSelector = "input[name='" + $.ui.escapeSelector( name ) + "']";

		if ( !name ) {
			return $( [] );
		}

		if ( this.form.length ) {
			group = $( this.form[ 0 ].elements ).filter( nameSelector );
		} else {

			// Not inside a form, check all inputs that also are not inside a form
			group = $( nameSelector ).filter( function() {
				return $( this ).form().length === 0;
			} );
		}

		return group.not( this.element );
	},

	_toggleClasses: function() {
		var checked = this.element[ 0 ].checked;
		this._toggleClass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );

		if ( this.options.icon && this.type === "checkbox" ) {
			this._toggleClass( this.icon, null, "ui-icon-check ui-state-checked", checked )
				._toggleClass( this.icon, null, "ui-icon-blank", !checked );
		}

		if ( this.type === "radio" ) {
			this._getRadioGroup()
				.each( function() {
					var instance = $( this ).checkboxradio( "instance" );

					if ( instance ) {
						instance._removeClass( instance.label,
							"ui-checkboxradio-checked", "ui-state-active" );
					}
				} );
		}
	},

	_destroy: function() {
		this._unbindFormResetHandler();

		if ( this.icon ) {
			this.icon.remove();
			this.iconSpace.remove();
		}
	},

	_setOption: function( key, value ) {

		// We don't allow the value to be set to nothing
		if ( key === "label" && !value ) {
			return;
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this._toggleClass( this.label, null, "ui-state-disabled", value );
			this.element[ 0 ].disabled = value;

			// Don't refresh when setting disabled
			return;
		}
		this.refresh();
	},

	_updateIcon: function( checked ) {
		var toAdd = "ui-icon ui-icon-background ";

		if ( this.options.icon ) {
			if ( !this.icon ) {
				this.icon = $( "<span>" );
				this.iconSpace = $( "<span> </span>" );
				this._addClass( this.iconSpace, "ui-checkboxradio-icon-space" );
			}

			if ( this.type === "checkbox" ) {
				toAdd += checked ? "ui-icon-check ui-state-checked" : "ui-icon-blank";
				this._removeClass( this.icon, null, checked ? "ui-icon-blank" : "ui-icon-check" );
			} else {
				toAdd += "ui-icon-blank";
			}
			this._addClass( this.icon, "ui-checkboxradio-icon", toAdd );
			if ( !checked ) {
				this._removeClass( this.icon, null, "ui-icon-check ui-state-checked" );
			}
			this.icon.prependTo( this.label ).after( this.iconSpace );
		} else if ( this.icon !== undefined ) {
			this.icon.remove();
			this.iconSpace.remove();
			delete this.icon;
		}
	},

	_updateLabel: function() {

		// Remove the contents of the label ( minus the icon, icon space, and input )
		var contents = this.label.contents().not( this.element[ 0 ] );
		if ( this.icon ) {
			contents = contents.not( this.icon[ 0 ] );
		}
		if ( this.iconSpace ) {
			contents = contents.not( this.iconSpace[ 0 ] );
		}
		contents.remove();

		this.label.append( this.options.label );
	},

	refresh: function() {
		var checked = this.element[ 0 ].checked,
			isDisabled = this.element[ 0 ].disabled;

		this._updateIcon( checked );
		this._toggleClass( this.label, "ui-checkboxradio-checked", "ui-state-active", checked );
		if ( this.options.label !== null ) {
			this._updateLabel();
		}

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { "disabled": isDisabled } );
		}
	}

} ] );

var widgetsCheckboxradio = $.ui.checkboxradio;


/*!
 * jQuery UI Button 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Button
//>>group: Widgets
//>>description: Enhances a form with themeable buttons.
//>>docs: http://api.jqueryui.com/button/
//>>demos: http://jqueryui.com/button/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/button.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.button", {
	version: "1.12.1",
	defaultElement: "<button>",
	options: {
		classes: {
			"ui-button": "ui-corner-all"
		},
		disabled: null,
		icon: null,
		iconPosition: "beginning",
		label: null,
		showLabel: true
	},

	_getCreateOptions: function() {
		var disabled,

			// This is to support cases like in jQuery Mobile where the base widget does have
			// an implementation of _getCreateOptions
			options = this._super() || {};

		this.isInput = this.element.is( "input" );

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		this.originalLabel = this.isInput ? this.element.val() : this.element.html();
		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_create: function() {
		if ( !this.option.showLabel & !this.options.icon ) {
			this.options.showLabel = true;
		}

		// We have to check the option again here even though we did in _getCreateOptions,
		// because null may have been passed on init which would override what was set in
		// _getCreateOptions
		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled || false;
		}

		this.hasTitle = !!this.element.attr( "title" );

		// Check to see if the label needs to be set or if its already correct
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			if ( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}
		this._addClass( "ui-button", "ui-widget" );
		this._setOption( "disabled", this.options.disabled );
		this._enhance();

		if ( this.element.is( "a" ) ) {
			this._on( {
				"keyup": function( event ) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						event.preventDefault();

						// Support: PhantomJS <= 1.9, IE 8 Only
						// If a native click is available use it so we actually cause navigation
						// otherwise just trigger a click event
						if ( this.element[ 0 ].click ) {
							this.element[ 0 ].click();
						} else {
							this.element.trigger( "click" );
						}
					}
				}
			} );
		}
	},

	_enhance: function() {
		if ( !this.element.is( "button" ) ) {
			this.element.attr( "role", "button" );
		}

		if ( this.options.icon ) {
			this._updateIcon( "icon", this.options.icon );
			this._updateTooltip();
		}
	},

	_updateTooltip: function() {
		this.title = this.element.attr( "title" );

		if ( !this.options.showLabel && !this.title ) {
			this.element.attr( "title", this.options.label );
		}
	},

	_updateIcon: function( option, value ) {
		var icon = option !== "iconPosition",
			position = icon ? this.options.iconPosition : value,
			displayBlock = position === "top" || position === "bottom";

		// Create icon
		if ( !this.icon ) {
			this.icon = $( "<span>" );

			this._addClass( this.icon, "ui-button-icon", "ui-icon" );

			if ( !this.options.showLabel ) {
				this._addClass( "ui-button-icon-only" );
			}
		} else if ( icon ) {

			// If we are updating the icon remove the old icon class
			this._removeClass( this.icon, null, this.options.icon );
		}

		// If we are updating the icon add the new icon class
		if ( icon ) {
			this._addClass( this.icon, null, value );
		}

		this._attachIcon( position );

		// If the icon is on top or bottom we need to add the ui-widget-icon-block class and remove
		// the iconSpace if there is one.
		if ( displayBlock ) {
			this._addClass( this.icon, null, "ui-widget-icon-block" );
			if ( this.iconSpace ) {
				this.iconSpace.remove();
			}
		} else {

			// Position is beginning or end so remove the ui-widget-icon-block class and add the
			// space if it does not exist
			if ( !this.iconSpace ) {
				this.iconSpace = $( "<span> </span>" );
				this._addClass( this.iconSpace, "ui-button-icon-space" );
			}
			this._removeClass( this.icon, null, "ui-wiget-icon-block" );
			this._attachIconSpace( position );
		}
	},

	_destroy: function() {
		this.element.removeAttr( "role" );

		if ( this.icon ) {
			this.icon.remove();
		}
		if ( this.iconSpace ) {
			this.iconSpace.remove();
		}
		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_attachIconSpace: function( iconPosition ) {
		this.icon[ /^(?:end|bottom)/.test( iconPosition ) ? "before" : "after" ]( this.iconSpace );
	},

	_attachIcon: function( iconPosition ) {
		this.element[ /^(?:end|bottom)/.test( iconPosition ) ? "append" : "prepend" ]( this.icon );
	},

	_setOptions: function( options ) {
		var newShowLabel = options.showLabel === undefined ?
				this.options.showLabel :
				options.showLabel,
			newIcon = options.icon === undefined ? this.options.icon : options.icon;

		if ( !newShowLabel && !newIcon ) {
			options.showLabel = true;
		}
		this._super( options );
	},

	_setOption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value ) {
				this._updateIcon( key, value );
			} else if ( this.icon ) {
				this.icon.remove();
				if ( this.iconSpace ) {
					this.iconSpace.remove();
				}
			}
		}

		if ( key === "iconPosition" ) {
			this._updateIcon( key, value );
		}

		// Make sure we can't end up with a button that has neither text nor icon
		if ( key === "showLabel" ) {
				this._toggleClass( "ui-button-icon-only", null, !value );
				this._updateTooltip();
		}

		if ( key === "label" ) {
			if ( this.isInput ) {
				this.element.val( value );
			} else {

				// If there is an icon, append it, else nothing then append the value
				// this avoids removal of the icon when setting label text
				this.element.html( value );
				if ( this.icon ) {
					this._attachIcon( this.options.iconPosition );
					this._attachIconSpace( this.options.iconPosition );
				}
			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this._toggleClass( null, "ui-state-disabled", value );
			this.element[ 0 ].disabled = value;
			if ( value ) {
				this.element.blur();
			}
		}
	},

	refresh: function() {

		// Make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isDisabled = this.element.is( "input, button" ) ?
			this.element[ 0 ].disabled : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { disabled: isDisabled } );
		}

		this._updateTooltip();
	}
} );

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// Text and Icons options
	$.widget( "ui.button", $.ui.button, {
		options: {
			text: true,
			icons: {
				primary: null,
				secondary: null
			}
		},

		_create: function() {
			if ( this.options.showLabel && !this.options.text ) {
				this.options.showLabel = this.options.text;
			}
			if ( !this.options.showLabel && this.options.text ) {
				this.options.text = this.options.showLabel;
			}
			if ( !this.options.icon && ( this.options.icons.primary ||
					this.options.icons.secondary ) ) {
				if ( this.options.icons.primary ) {
					this.options.icon = this.options.icons.primary;
				} else {
					this.options.icon = this.options.icons.secondary;
					this.options.iconPosition = "end";
				}
			} else if ( this.options.icon ) {
				this.options.icons.primary = this.options.icon;
			}
			this._super();
		},

		_setOption: function( key, value ) {
			if ( key === "text" ) {
				this._super( "showLabel", value );
				return;
			}
			if ( key === "showLabel" ) {
				this.options.text = value;
			}
			if ( key === "icon" ) {
				this.options.icons.primary = value;
			}
			if ( key === "icons" ) {
				if ( value.primary ) {
					this._super( "icon", value.primary );
					this._super( "iconPosition", "beginning" );
				} else if ( value.secondary ) {
					this._super( "icon", value.secondary );
					this._super( "iconPosition", "end" );
				}
			}
			this._superApply( arguments );
		}
	} );

	$.fn.button = ( function( orig ) {
		return function() {
			if ( !this.length || ( this.length && this[ 0 ].tagName !== "INPUT" ) ||
					( this.length && this[ 0 ].tagName === "INPUT" && (
						this.attr( "type" ) !== "checkbox" && this.attr( "type" ) !== "radio"
					) ) ) {
				return orig.apply( this, arguments );
			}
			if ( !$.ui.checkboxradio ) {
				$.error( "Checkboxradio widget missing" );
			}
			if ( arguments.length === 0 ) {
				return this.checkboxradio( {
					"icon": false
				} );
			}
			return this.checkboxradio.apply( this, arguments );
		};
	} )( $.fn.button );

	$.fn.buttonset = function() {
		if ( !$.ui.controlgroup ) {
			$.error( "Controlgroup widget missing" );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" && arguments[ 2 ] ) {
			return this.controlgroup.apply( this,
				[ arguments[ 0 ], "items.button", arguments[ 2 ] ] );
		}
		if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" ) {
			return this.controlgroup.apply( this, [ arguments[ 0 ], "items.button" ] );
		}
		if ( typeof arguments[ 0 ] === "object" && arguments[ 0 ].items ) {
			arguments[ 0 ].items = {
				button: arguments[ 0 ].items
			};
		}
		return this.controlgroup.apply( this, arguments );
	};
}

var widgetsButton = $.ui.button;




// This file is deprecated
var ie = $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

/*!
 * jQuery UI Mouse 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/



var mouseHandled = false;
$( document ).on( "mouseup", function() {
	mouseHandled = false;
} );

var widgetsMouse = $.widget( "ui.mouse", {
	version: "1.12.1",
	options: {
		cancel: "input, textarea, button, select, option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.on( "mousedown." + this.widgetName, function( event ) {
				return that._mouseDown( event );
			} )
			.on( "click." + this.widgetName, function( event ) {
				if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
					$.removeData( event.target, that.widgetName + ".preventClickEvent" );
					event.stopImmediatePropagation();
					return false;
				}
			} );

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.off( "." + this.widgetName );
		if ( this._mouseMoveDelegate ) {
			this.document
				.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.off( "mouseup." + this.widgetName, this._mouseUpDelegate );
		}
	},

	_mouseDown: function( event ) {

		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// We may have missed mouseup (out of window)
		( this._mouseStarted && this._mouseUp( event ) );

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = ( event.which === 1 ),

			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
				$( event.target ).closest( this.options.cancel ).length : false );
		if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if ( !this.mouseDelayMet ) {
			this._mouseDelayTimer = setTimeout( function() {
				that.mouseDelayMet = true;
			}, this.options.delay );
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted = ( this._mouseStart( event ) !== false );
			if ( !this._mouseStarted ) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
			$.removeData( event.target, this.widgetName + ".preventClickEvent" );
		}

		// These delegates are required to keep context
		this._mouseMoveDelegate = function( event ) {
			return that._mouseMove( event );
		};
		this._mouseUpDelegate = function( event ) {
			return that._mouseUp( event );
		};

		this.document
			.on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.on( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function( event ) {

		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {

			// IE mouseup check - mouseup happened when mouse was out of window
			if ( $.ui.ie && ( !document.documentMode || document.documentMode < 9 ) &&
					!event.button ) {
				return this._mouseUp( event );

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {

				// Support: Safari <=8 - 9
				// Safari sets which to 0 if you press any of the following keys
				// during a drag (#14461)
				if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
						event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
					this.ignoreMissingWhich = true;
				} else if ( !this.ignoreMissingWhich ) {
					return this._mouseUp( event );
				}
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if ( this._mouseStarted ) {
			this._mouseDrag( event );
			return event.preventDefault();
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted =
				( this._mouseStart( this._mouseDownEvent, event ) !== false );
			( this._mouseStarted ? this._mouseDrag( event ) : this._mouseUp( event ) );
		}

		return !this._mouseStarted;
	},

	_mouseUp: function( event ) {
		this.document
			.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.off( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if ( this._mouseStarted ) {
			this._mouseStarted = false;

			if ( event.target === this._mouseDownEvent.target ) {
				$.data( event.target, this.widgetName + ".preventClickEvent", true );
			}

			this._mouseStop( event );
		}

		if ( this._mouseDelayTimer ) {
			clearTimeout( this._mouseDelayTimer );
			delete this._mouseDelayTimer;
		}

		this.ignoreMissingWhich = false;
		mouseHandled = false;
		event.preventDefault();
	},

	_mouseDistanceMet: function( event ) {
		return ( Math.max(
				Math.abs( this._mouseDownEvent.pageX - event.pageX ),
				Math.abs( this._mouseDownEvent.pageY - event.pageY )
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function( /* event */ ) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function( /* event */ ) {},
	_mouseDrag: function( /* event */ ) {},
	_mouseStop: function( /* event */ ) {},
	_mouseCapture: function( /* event */ ) { return true; }
} );


/*!
 * jQuery UI Slider 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Slider
//>>group: Widgets
//>>description: Displays a flexible slider with ranges and accessibility via keyboard.
//>>docs: http://api.jqueryui.com/slider/
//>>demos: http://jqueryui.com/slider/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/slider.css
//>>css.theme: ../../themes/base/theme.css



var widgetsSlider = $.widget( "ui.slider", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "slide",

	options: {
		animate: false,
		classes: {
			"ui-slider": "ui-corner-all",
			"ui-slider-handle": "ui-corner-all",

			// Note: ui-widget-header isn't the most fittingly semantic framework class for this
			// element, but worked best visually with a variety of themes
			"ui-slider-range": "ui-corner-all ui-widget-header"
		},
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null,

		// Callbacks
		change: null,
		slide: null,
		start: null,
		stop: null
	},

	// Number of pages in a slider
	// (how many times can you page up/down to go through the whole range)
	numPages: 5,

	_create: function() {
		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();
		this._calculateNewMax();

		this._addClass( "ui-slider ui-slider-" + this.orientation,
			"ui-widget ui-widget-content" );

		this._refresh();

		this._animateOff = false;
	},

	_refresh: function() {
		this._createRange();
		this._createHandles();
		this._setupEvents();
		this._refreshValue();
	},

	_createHandles: function() {
		var i, handleCount,
			options = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ),
			handle = "<span tabindex='0'></span>",
			handles = [];

		handleCount = ( options.values && options.values.length ) || 1;

		if ( existingHandles.length > handleCount ) {
			existingHandles.slice( handleCount ).remove();
			existingHandles = existingHandles.slice( 0, handleCount );
		}

		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this._addClass( this.handles, "ui-slider-handle", "ui-state-default" );

		this.handle = this.handles.eq( 0 );

		this.handles.each( function( i ) {
			$( this )
				.data( "ui-slider-handle-index", i )
				.attr( "tabIndex", 0 );
		} );
	},

	_createRange: function() {
		var options = this.options;

		if ( options.range ) {
			if ( options.range === true ) {
				if ( !options.values ) {
					options.values = [ this._valueMin(), this._valueMin() ];
				} else if ( options.values.length && options.values.length !== 2 ) {
					options.values = [ options.values[ 0 ], options.values[ 0 ] ];
				} else if ( $.isArray( options.values ) ) {
					options.values = options.values.slice( 0 );
				}
			}

			if ( !this.range || !this.range.length ) {
				this.range = $( "<div>" )
					.appendTo( this.element );

				this._addClass( this.range, "ui-slider-range" );
			} else {
				this._removeClass( this.range, "ui-slider-range-min ui-slider-range-max" );

				// Handle range switching from true to min/max
				this.range.css( {
					"left": "",
					"bottom": ""
				} );
			}
			if ( options.range === "min" || options.range === "max" ) {
				this._addClass( this.range, "ui-slider-range-" + options.range );
			}
		} else {
			if ( this.range ) {
				this.range.remove();
			}
			this.range = null;
		}
	},

	_setupEvents: function() {
		this._off( this.handles );
		this._on( this.handles, this._handleEvents );
		this._hoverable( this.handles );
		this._focusable( this.handles );
	},

	_destroy: function() {
		this.handles.remove();
		if ( this.range ) {
			this.range.remove();
		}

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		this.handles.each( function( i ) {
			var thisDistance = Math.abs( normValue - that.values( i ) );
			if ( ( distance > thisDistance ) ||
				( distance === thisDistance &&
					( i === that._lastChangedValue || that.values( i ) === o.min ) ) ) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		} );

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		this._addClass( closestHandle, null, "ui-state-active" );
		closestHandle.trigger( "focus" );

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css( "borderTopWidth" ), 10 ) || 0 ) -
				( parseInt( closestHandle.css( "borderBottomWidth" ), 10 ) || 0 ) +
				( parseInt( closestHandle.css( "marginTop" ), 10 ) || 0 )
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this._removeClass( this.handles, null, "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left -
				( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top -
				( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_uiHash: function( index, value, values ) {
		var uiHash = {
			handle: this.handles[ index ],
			handleIndex: index,
			value: value !== undefined ? value : this.value()
		};

		if ( this._hasMultipleValues() ) {
			uiHash.value = value !== undefined ? value : this.values( index );
			uiHash.values = values || this.values();
		}

		return uiHash;
	},

	_hasMultipleValues: function() {
		return this.options.values && this.options.values.length;
	},

	_start: function( event, index ) {
		return this._trigger( "start", event, this._uiHash( index ) );
	},

	_slide: function( event, index, newVal ) {
		var allowed, otherVal,
			currentValue = this.value(),
			newValues = this.values();

		if ( this._hasMultipleValues() ) {
			otherVal = this.values( index ? 0 : 1 );
			currentValue = this.values( index );

			if ( this.options.values.length === 2 && this.options.range === true ) {
				newVal =  index === 0 ? Math.min( otherVal, newVal ) : Math.max( otherVal, newVal );
			}

			newValues[ index ] = newVal;
		}

		if ( newVal === currentValue ) {
			return;
		}

		allowed = this._trigger( "slide", event, this._uiHash( index, newVal, newValues ) );

		// A slide can be canceled by returning false from the slide callback
		if ( allowed === false ) {
			return;
		}

		if ( this._hasMultipleValues() ) {
			this.values( index, newVal );
		} else {
			this.value( newVal );
		}
	},

	_stop: function( event, index ) {
		this._trigger( "stop", event, this._uiHash( index ) );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {

			//store the last changed value index for reference when handles overlap
			this._lastChangedValue = index;
			this._trigger( "change", event, this._uiHash( index ) );
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this._hasMultipleValues() ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( key === "range" && this.options.range === true ) {
			if ( value === "min" ) {
				this.options.value = this._values( 0 );
				this.options.values = null;
			} else if ( value === "max" ) {
				this.options.value = this._values( this.options.values.length - 1 );
				this.options.values = null;
			}
		}

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		this._super( key, value );

		switch ( key ) {
			case "orientation":
				this._detectOrientation();
				this._removeClass( "ui-slider-horizontal ui-slider-vertical" )
					._addClass( "ui-slider-" + this.orientation );
				this._refreshValue();
				if ( this.options.range ) {
					this._refreshRange( value );
				}

				// Reset positioning from previous orientation
				this.handles.css( value === "horizontal" ? "bottom" : "left", "" );
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();

				// Start from the last handle to prevent unreachable handles (#9046)
				for ( i = valsLength - 1; i >= 0; i-- ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "step":
			case "min":
			case "max":
				this._animateOff = true;
				this._calculateNewMax();
				this._refreshValue();
				this._animateOff = false;
				break;
			case "range":
				this._animateOff = true;
				this._refresh();
				this._animateOff = false;
				break;
		}
	},

	_setOptionDisabled: function( value ) {
		this._super( value );

		this._toggleClass( null, "ui-state-disabled", !!value );
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else if ( this._hasMultipleValues() ) {

			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i += 1 ) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		} else {
			return [];
		}
	},

	// Returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = ( val - this._valueMin() ) % step,
			alignValue = val - valModStep;

		if ( Math.abs( valModStep ) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed( 5 ) );
	},

	_calculateNewMax: function() {
		var max = this.options.max,
			min = this._valueMin(),
			step = this.options.step,
			aboveMin = Math.round( ( max - min ) / step ) * step;
		max = aboveMin + min;
		if ( max > this.options.max ) {

			//If max is not divisible by step, rounding off may increase its value
			max -= step;
		}
		this.max = parseFloat( max.toFixed( this._precision() ) );
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.max;
	},

	_refreshRange: function( orientation ) {
		if ( orientation === "vertical" ) {
			this.range.css( { "width": "", "left": "" } );
		}
		if ( orientation === "horizontal" ) {
			this.range.css( { "height": "", "bottom": "" } );
		}
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this._hasMultipleValues() ) {
			this.handles.each( function( i ) {
				valPercent = ( that.values( i ) - that._valueMin() ) / ( that._valueMax() -
					that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								left: valPercent + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								width: ( valPercent - lastValPercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
								bottom: ( valPercent ) + "%"
							}, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( {
								height: ( valPercent - lastValPercent ) + "%"
							}, {
								queue: false,
								duration: o.animate
							} );
						}
					}
				}
				lastValPercent = valPercent;
			} );
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: valPercent + "%"
				}, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					width: ( 100 - valPercent ) + "%"
				}, o.animate );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: valPercent + "%"
				}, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( {
					height: ( 100 - valPercent ) + "%"
				}, o.animate );
			}
		}
	},

	_handleEvents: {
		keydown: function( event ) {
			var allowed, curVal, newVal, step,
				index = $( event.target ).data( "ui-slider-handle-index" );

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_UP:
				case $.ui.keyCode.PAGE_DOWN:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					event.preventDefault();
					if ( !this._keySliding ) {
						this._keySliding = true;
						this._addClass( $( event.target ), null, "ui-state-active" );
						allowed = this._start( event, index );
						if ( allowed === false ) {
							return;
						}
					}
					break;
			}

			step = this.options.step;
			if ( this._hasMultipleValues() ) {
				curVal = newVal = this.values( index );
			} else {
				curVal = newVal = this.value();
			}

			switch ( event.keyCode ) {
				case $.ui.keyCode.HOME:
					newVal = this._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = this._valueMax();
					break;
				case $.ui.keyCode.PAGE_UP:
					newVal = this._trimAlignValue(
						curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
					);
					break;
				case $.ui.keyCode.PAGE_DOWN:
					newVal = this._trimAlignValue(
						curVal - ( ( this._valueMax() - this._valueMin() ) / this.numPages ) );
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					if ( curVal === this._valueMax() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal + step );
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if ( curVal === this._valueMin() ) {
						return;
					}
					newVal = this._trimAlignValue( curVal - step );
					break;
			}

			this._slide( event, index, newVal );
		},
		keyup: function( event ) {
			var index = $( event.target ).data( "ui-slider-handle-index" );

			if ( this._keySliding ) {
				this._keySliding = false;
				this._stop( event, index );
				this._change( event, index );
				this._removeClass( $( event.target ), null, "ui-state-active" );
			}
		}
	}
} );



var safeActiveElement = $.ui.safeActiveElement = function( document ) {
	var activeElement;

	// Support: IE 9 only
	// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
	try {
		activeElement = document.activeElement;
	} catch ( error ) {
		activeElement = document.body;
	}

	// Support: IE 9 - 11 only
	// IE may return null instead of an element
	// Interestingly, this only seems to occur when NOT in an iframe
	if ( !activeElement ) {
		activeElement = document.body;
	}

	// Support: IE 11 only
	// IE11 returns a seemingly empty object in some cases when accessing
	// document.activeElement from an <iframe>
	if ( !activeElement.nodeName ) {
		activeElement = document.body;
	}

	return activeElement;
};


/*!
 * jQuery UI Tabs 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Tabs
//>>group: Widgets
//>>description: Transforms a set of container elements into a tab structure.
//>>docs: http://api.jqueryui.com/tabs/
//>>demos: http://jqueryui.com/tabs/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/tabs.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.tabs", {
	version: "1.12.1",
	delay: 300,
	options: {
		active: null,
		classes: {
			"ui-tabs": "ui-corner-all",
			"ui-tabs-nav": "ui-corner-all",
			"ui-tabs-panel": "ui-corner-bottom",
			"ui-tabs-tab": "ui-corner-top"
		},
		collapsible: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// Callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_isLocal: ( function() {
		var rhash = /#.*$/;

		return function( anchor ) {
			var anchorUrl, locationUrl;

			anchorUrl = anchor.href.replace( rhash, "" );
			locationUrl = location.href.replace( rhash, "" );

			// Decoding may throw an error if the URL isn't UTF-8 (#9518)
			try {
				anchorUrl = decodeURIComponent( anchorUrl );
			} catch ( error ) {}
			try {
				locationUrl = decodeURIComponent( locationUrl );
			} catch ( error ) {}

			return anchor.hash.length > 1 && anchorUrl === locationUrl;
		};
	} )(),

	_create: function() {
		var that = this,
			options = this.options;

		this.running = false;

		this._addClass( "ui-tabs", "ui-widget ui-widget-content" );
		this._toggleClass( "ui-tabs-collapsible", null, options.collapsible );

		this._processTabs();
		options.active = this._initialActive();

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				} )
			) ).sort();
		}

		// Check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findActive( options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_initialActive: function() {
		var active = this.options.active,
			collapsible = this.options.collapsible,
			locationHash = location.hash.substring( 1 );

		if ( active === null ) {

			// check the fragment identifier in the URL
			if ( locationHash ) {
				this.tabs.each( function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationHash ) {
						active = i;
						return false;
					}
				} );
			}

			// Check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// No active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// Handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = collapsible ? false : 0;
			}
		}

		// Don't allow collapsible: false and active: false
		if ( !collapsible && active === false && this.anchors.length ) {
			active = 0;
		}

		return active;
	},

	_getCreateEventData: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getPanelForTab( this.active )
		};
	},

	_tabKeydown: function( event ) {
		var focusedTab = $( $.ui.safeActiveElement( this.document[ 0 ] ) ).closest( "li" ),
			selectedIndex = this.tabs.index( focusedTab ),
			goingForward = true;

		if ( this._handlePageNav( event ) ) {
			return;
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.RIGHT:
		case $.ui.keyCode.DOWN:
			selectedIndex++;
			break;
		case $.ui.keyCode.UP:
		case $.ui.keyCode.LEFT:
			goingForward = false;
			selectedIndex--;
			break;
		case $.ui.keyCode.END:
			selectedIndex = this.anchors.length - 1;
			break;
		case $.ui.keyCode.HOME:
			selectedIndex = 0;
			break;
		case $.ui.keyCode.SPACE:

			// Activate only, no collapsing
			event.preventDefault();
			clearTimeout( this.activating );
			this._activate( selectedIndex );
			return;
		case $.ui.keyCode.ENTER:

			// Toggle (cancel delayed activation, allow collapsing)
			event.preventDefault();
			clearTimeout( this.activating );

			// Determine if we should collapse or activate
			this._activate( selectedIndex === this.options.active ? false : selectedIndex );
			return;
		default:
			return;
		}

		// Focus the appropriate tab, based on which key was pressed
		event.preventDefault();
		clearTimeout( this.activating );
		selectedIndex = this._focusNextTab( selectedIndex, goingForward );

		// Navigating with control/command key will prevent automatic activation
		if ( !event.ctrlKey && !event.metaKey ) {

			// Update aria-selected immediately so that AT think the tab is already selected.
			// Otherwise AT may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedTab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedIndex ).attr( "aria-selected", "true" );

			this.activating = this._delay( function() {
				this.option( "active", selectedIndex );
			}, this.delay );
		}
	},

	_panelKeydown: function( event ) {
		if ( this._handlePageNav( event ) ) {
			return;
		}

		// Ctrl+up moves focus to the current tab
		if ( event.ctrlKey && event.keyCode === $.ui.keyCode.UP ) {
			event.preventDefault();
			this.active.trigger( "focus" );
		}
	},

	// Alt+page up/down moves focus to the previous/next tab (and activates)
	_handlePageNav: function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ) {
			this._activate( this._focusNextTab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ) {
			this._activate( this._focusNextTab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findNextTab: function( index, goingForward ) {
		var lastTabIndex = this.tabs.length - 1;

		function constrain() {
			if ( index > lastTabIndex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lastTabIndex;
			}
			return index;
		}

		while ( $.inArray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingForward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusNextTab: function( index, goingForward ) {
		index = this._findNextTab( index, goingForward );
		this.tabs.eq( index ).trigger( "focus" );
		return index;
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {

			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		this._super( key, value );

		if ( key === "collapsible" ) {
			this._toggleClass( "ui-tabs-collapsible", null, value );

			// Setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "heightStyle" ) {
			this._setupHeightStyle( value );
		}
	},

	_sanitizeSelector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// Get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		} );

		this._processTabs();

		// Was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();

		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {

			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();

			// activate previous tab
			} else {
				this._activate( this._findNextTab( Math.max( 0, options.active - 1 ), false ) );
			}

		// was active, active tab still exists
		} else {

			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setOptionDisabled( this.options.disabled );
		this._setupEvents( this.options.event );
		this._setupHeightStyle( this.options.heightStyle );

		this.tabs.not( this.active ).attr( {
			"aria-selected": "false",
			"aria-expanded": "false",
			tabIndex: -1
		} );
		this.panels.not( this._getPanelForTab( this.active ) )
			.hide()
			.attr( {
				"aria-hidden": "true"
			} );

		// Make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active
				.attr( {
					"aria-selected": "true",
					"aria-expanded": "true",
					tabIndex: 0
				} );
			this._addClass( this.active, "ui-tabs-active", "ui-state-active" );
			this._getPanelForTab( this.active )
				.show()
				.attr( {
					"aria-hidden": "false"
				} );
		}
	},

	_processTabs: function() {
		var that = this,
			prevTabs = this.tabs,
			prevAnchors = this.anchors,
			prevPanels = this.panels;

		this.tablist = this._getList().attr( "role", "tablist" );
		this._addClass( this.tablist, "ui-tabs-nav",
			"ui-helper-reset ui-helper-clearfix ui-widget-header" );

		// Prevent users from focusing disabled tabs via click
		this.tablist
			.on( "mousedown" + this.eventNamespace, "> li", function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventDefault();
				}
			} )

			// Support: IE <9
			// Preventing the default action in mousedown doesn't prevent IE
			// from focusing the element, so if the anchor gets focused, blur.
			// We don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.on( "focus" + this.eventNamespace, ".ui-tabs-anchor", function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			} );

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.attr( {
				role: "tab",
				tabIndex: -1
			} );
		this._addClass( this.tabs, "ui-tabs-tab", "ui-state-default" );

		this.anchors = this.tabs.map( function() {
			return $( "a", this )[ 0 ];
		} )
			.attr( {
				role: "presentation",
				tabIndex: -1
			} );
		this._addClass( this.anchors, "ui-tabs-anchor" );

		this.panels = $();

		this.anchors.each( function( i, anchor ) {
			var selector, panel, panelId,
				anchorId = $( anchor ).uniqueId().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalAriaControls = tab.attr( "aria-controls" );

			// Inline tab
			if ( that._isLocal( anchor ) ) {
				selector = anchor.hash;
				panelId = selector.substring( 1 );
				panel = that.element.find( that._sanitizeSelector( selector ) );

			// remote tab
			} else {

				// If the tab doesn't already have aria-controls,
				// generate an id by using a throw-away element
				panelId = tab.attr( "aria-controls" ) || $( {} ).uniqueId()[ 0 ].id;
				selector = "#" + panelId;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createPanel( panelId );
					panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length ) {
				that.panels = that.panels.add( panel );
			}
			if ( originalAriaControls ) {
				tab.data( "ui-tabs-aria-controls", originalAriaControls );
			}
			tab.attr( {
				"aria-controls": panelId,
				"aria-labelledby": anchorId
			} );
			panel.attr( "aria-labelledby", anchorId );
		} );

		this.panels.attr( "role", "tabpanel" );
		this._addClass( this.panels, "ui-tabs-panel", "ui-widget-content" );

		// Avoid memory leaks (#10056)
		if ( prevTabs ) {
			this._off( prevTabs.not( this.tabs ) );
			this._off( prevAnchors.not( this.anchors ) );
			this._off( prevPanels.not( this.panels ) );
		}
	},

	// Allow overriding how to find the list for rare usage scenarios (#7715)
	_getList: function() {
		return this.tablist || this.element.find( "ol, ul" ).eq( 0 );
	},

	_createPanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.data( "ui-tabs-destroy", true );
	},

	_setOptionDisabled: function( disabled ) {
		var currentItem, li, i;

		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// Disable tabs
		for ( i = 0; ( li = this.tabs[ i ] ); i++ ) {
			currentItem = $( li );
			if ( disabled === true || $.inArray( i, disabled ) !== -1 ) {
				currentItem.attr( "aria-disabled", "true" );
				this._addClass( currentItem, null, "ui-state-disabled" );
			} else {
				currentItem.removeAttr( "aria-disabled" );
				this._removeClass( currentItem, null, "ui-state-disabled" );
			}
		}

		this.options.disabled = disabled;

		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null,
			disabled === true );
	},

	_setupEvents: function( event ) {
		var events = {};
		if ( event ) {
			$.each( event.split( " " ), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			} );
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );

		// Always prevent the default action, even when disabled
		this._on( true, this.anchors, {
			click: function( event ) {
				event.preventDefault();
			}
		} );
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabKeydown" } );
		this._on( this.panels, { keydown: "_panelKeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupHeightStyle: function( heightStyle ) {
		var maxHeight,
			parent = this.element.parent();

		if ( heightStyle === "fill" ) {
			maxHeight = parent.height();
			maxHeight -= this.element.outerHeight() - this.element.height();

			this.element.siblings( ":visible" ).each( function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			} );

			this.element.children().not( this.panels ).each( function() {
				maxHeight -= $( this ).outerHeight( true );
			} );

			this.panels.each( function() {
				$( this ).height( Math.max( 0, maxHeight -
					$( this ).innerHeight() + $( this ).height() ) );
			} )
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.panels.each( function() {
				maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
			} ).height( maxHeight );
		}
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currentTarget ),
			tab = anchor.closest( "li" ),
			clickedIsActive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : this._getPanelForTab( tab ),
			toHide = !active.length ? $() : this._getPanelForTab( active ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : tab,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||

				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||

				// can't switch durning an animation
				this.running ||

				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||

				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedIsActive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			$.error( "jQuery UI Tabs: Mismatching fragment identifier." );
		}

		if ( toShow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventData );
	},

	// Handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			that._addClass( eventData.newTab.closest( "li" ), "ui-tabs-active", "ui-state-active" );

			if ( toShow.length && that.options.show ) {
				that._show( toShow, that.options.show, complete );
			} else {
				toShow.show();
				complete();
			}
		}

		// Start out by hiding, then showing, then completing
		if ( toHide.length && this.options.hide ) {
			this._hide( toHide, this.options.hide, function() {
				that._removeClass( eventData.oldTab.closest( "li" ),
					"ui-tabs-active", "ui-state-active" );
				show();
			} );
		} else {
			this._removeClass( eventData.oldTab.closest( "li" ),
				"ui-tabs-active", "ui-state-active" );
			toHide.hide();
			show();
		}

		toHide.attr( "aria-hidden", "true" );
		eventData.oldTab.attr( {
			"aria-selected": "false",
			"aria-expanded": "false"
		} );

		// If we're switching tabs, remove the old tab from the tab order.
		// If we're opening from collapsed state, remove the previous tab from the tab order.
		// If we're collapsing, then keep the collapsing tab in the tab order.
		if ( toShow.length && toHide.length ) {
			eventData.oldTab.attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.tabs.filter( function() {
				return $( this ).attr( "tabIndex" ) === 0;
			} )
				.attr( "tabIndex", -1 );
		}

		toShow.attr( "aria-hidden", "false" );
		eventData.newTab.attr( {
			"aria-selected": "true",
			"aria-expanded": "true",
			tabIndex: 0
		} );
	},

	_activate: function( index ) {
		var anchor,
			active = this._findActive( index );

		// Trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// Trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventHandler( {
			target: anchor,
			currentTarget: anchor,
			preventDefault: $.noop
		} );
	},

	_findActive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getIndex: function( index ) {

		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" +
				$.ui.escapeSelector( index ) + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.tablist
			.removeAttr( "role" )
			.off( this.eventNamespace );

		this.anchors
			.removeAttr( "role tabIndex" )
			.removeUniqueId();

		this.tabs.add( this.panels ).each( function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeAttr( "role tabIndex " +
					"aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded" );
			}
		} );

		this.tabs.each( function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li
					.attr( "aria-controls", prev )
					.removeData( "ui-tabs-aria-controls" );
			} else {
				li.removeAttr( "aria-controls" );
			}
		} );

		this.panels.show();

		if ( this.options.heightStyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				} );
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				} );
			}
		}
		this._setOptionDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setOptionDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getPanelForTab( tab ),
			eventData = {
				tab: tab,
				panel: panel
			},
			complete = function( jqXHR, status ) {
				if ( status === "abort" ) {
					that.panels.stop( false, true );
				}

				that._removeClass( tab, "ui-tabs-loading" );
				panel.removeAttr( "aria-busy" );

				if ( jqXHR === that.xhr ) {
					delete that.xhr;
				}
			};

		// Not remote
		if ( this._isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxSettings( anchor, event, eventData ) );

		// Support: jQuery <1.8
		// jQuery <1.8 returns false if the request is canceled in beforeSend,
		// but as of 1.8, $.ajax() always returns a jqXHR object.
		if ( this.xhr && this.xhr.statusText !== "canceled" ) {
			this._addClass( tab, "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.done( function( response, status, jqXHR ) {

					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout( function() {
						panel.html( response );
						that._trigger( "load", event, eventData );

						complete( jqXHR, status );
					}, 1 );
				} )
				.fail( function( jqXHR, status ) {

					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout( function() {
						complete( jqXHR, status );
					}, 1 );
				} );
		}
	},

	_ajaxSettings: function( anchor, event, eventData ) {
		var that = this;
		return {

			// Support: IE <11 only
			// Strip any hash that exists to prevent errors with the Ajax request
			url: anchor.attr( "href" ).replace( /#.*$/, "" ),
			beforeSend: function( jqXHR, settings ) {
				return that._trigger( "beforeLoad", event,
					$.extend( { jqXHR: jqXHR, ajaxSettings: settings }, eventData ) );
			}
		};
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
} );

// DEPRECATED
// TODO: Switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for ui-tab class (now ui-tabs-tab)
	$.widget( "ui.tabs", $.ui.tabs, {
		_processTabs: function() {
			this._superApply( arguments );
			this._addClass( this.tabs, "ui-tab" );
		}
	} );
}

var widgetsTabs = $.ui.tabs;


/*!
 * jQuery UI Effects 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Effects Core
//>>group: Effects
// jscs:disable maximumLineLength
//>>description: Extends the internal jQuery effects. Includes morphing and easing. Required by all other effects.
// jscs:enable maximumLineLength
//>>docs: http://api.jqueryui.com/category/effects-core/
//>>demos: http://jqueryui.com/effect/



var dataSpace = "ui-effects-",
	dataSpaceStyle = "ui-effects-style",
	dataSpaceAnimated = "ui-effects-animated",

	// Create a local jQuery because jQuery Color relies on it and the
	// global may not exist with AMD and a custom build (#10199)
	jQuery = $;

$.effects = {
	effect: {}
};

/*!
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Wed Jan 16 08:47:09 2013 -0600
 */
( function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor " +
		"borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

	// Plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,

	// A set of RE's that can match strings and generate color tuples.
	stringParsers = [ {
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {

			// This regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {

			// This regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		} ],

	// JQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// Element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// Colors = jQuery.Color.names
	colors,

	// Local aliases of functions called often
	each = jQuery.each;

// Determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// Define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
} );

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return ( allowEmpty || !prop.def ) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {

		// We add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return ( value + type.mod ) % type.mod;
	}

	// For now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// If this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// Exit each( stringParsers ) here because we matched
			return false;
		}
	} );

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// If this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// Named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// More than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			} );
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				} );
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// If the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// If the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// This is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					} );

					// Everything defined but alpha?
					if ( inst[ cache ] &&
							jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {

						// Use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				} );
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if ( isCache ) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				} );
			}
			return same;
		} );
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		} );
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// If null, don't override start value
			if ( endValue === null ) {
				return;
			}

			// If null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		} );
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {

		// If we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		} ) );
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			} );

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// Catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			} );

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// Default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		} ).join( "" );
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
} );
color.fn.parse.prototype = color.fn;

// Hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + ( q - p ) * h * 6;
	}
	if ( h * 2 < 1 ) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + ( q - p ) * ( ( 2 / 3 ) - h ) * 6;
	}
	return p;
}

spaces.hsla.to = function( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	// Chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
	// otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
	if ( diff === 0 ) {
		s = 0;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round( h ) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};

each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// Makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// Generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		} );

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// Makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {

		// Alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	} );
} );

// Add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
	var hooks = hook.split( " " );
	each( hooks, function( i, hook ) {
		jQuery.cssHooks[ hook ] = {
			set: function( elem, value ) {
				var parsed, curElem,
					backgroundColor = "";

				if ( value !== "transparent" && ( jQuery.type( value ) !== "string" ||
						( parsed = stringParse( value ) ) ) ) {
					value = color( parsed || value );
					if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
						curElem = hook === "backgroundColor" ? elem.parentNode : elem;
						while (
							( backgroundColor === "" || backgroundColor === "transparent" ) &&
							curElem && curElem.style
						) {
							try {
								backgroundColor = jQuery.css( curElem, "backgroundColor" );
								curElem = curElem.parentNode;
							} catch ( e ) {
							}
						}

						value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
							backgroundColor :
							"_default" );
					}

					value = value.toRgbaString();
				}
				try {
					elem.style[ hook ] = value;
				} catch ( e ) {

					// Wrapped to prevent IE from throwing errors on "invalid" values like
					// 'auto' or 'inherit'
				}
			}
		};
		jQuery.fx.step[ hook ] = function( fx ) {
			if ( !fx.colorInit ) {
				fx.start = color( fx.elem, hook );
				fx.end = color( fx.end );
				fx.colorInit = true;
			}
			jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
		};
	} );

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		} );
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {

	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

} )( jQuery );

/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
( function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

$.each(
	[ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ],
	function( _, prop ) {
		$.fx.step[ prop ] = function( fx ) {
			if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
				jQuery.style( fx.elem, prop, fx.end );
				fx.setAttr = true;
			}
		};
	}
);

function getElementStyles( elem ) {
	var key, len,
		style = elem.ownerDocument.defaultView ?
			elem.ownerDocument.defaultView.getComputedStyle( elem, null ) :
			elem.currentStyle,
		styles = {};

	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				styles[ $.camelCase( key ) ] = style[ key ];
			}
		}

	// Support: Opera, IE <9
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				styles[ key ] = style[ key ];
			}
		}
	}

	return styles;
}

function styleDifference( oldStyle, newStyle ) {
	var diff = {},
		name, value;

	for ( name in newStyle ) {
		value = newStyle[ name ];
		if ( oldStyle[ name ] !== value ) {
			if ( !shorthandStyles[ name ] ) {
				if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

// Support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

$.effects.animateClass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseClass = animated.attr( "class" ) || "",
			applyClassChange,
			allAnimations = o.children ? animated.find( "*" ).addBack() : animated;

		// Map the animated objects to store the original styles.
		allAnimations = allAnimations.map( function() {
			var el = $( this );
			return {
				el: el,
				start: getElementStyles( this )
			};
		} );

		// Apply class change
		applyClassChange = function() {
			$.each( classAnimationActions, function( i, action ) {
				if ( value[ action ] ) {
					animated[ action + "Class" ]( value[ action ] );
				}
			} );
		};
		applyClassChange();

		// Map all animated objects again - calculate new styles and diff
		allAnimations = allAnimations.map( function() {
			this.end = getElementStyles( this.el[ 0 ] );
			this.diff = styleDifference( this.start, this.end );
			return this;
		} );

		// Apply original class
		animated.attr( "class", baseClass );

		// Map all animated objects again - this time collecting a promise
		allAnimations = allAnimations.map( function() {
			var styleInfo = this,
				dfd = $.Deferred(),
				opts = $.extend( {}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleInfo );
					}
				} );

			this.el.animate( this.diff, opts );
			return dfd.promise();
		} );

		// Once all animations have completed:
		$.when.apply( $, allAnimations.get() ).done( function() {

			// Set the final class
			applyClassChange();

			// For each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function( key ) {
					el.css( key, "" );
				} );
			} );

			// This is guarnteed to be there if you use jQuery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		} );
	} );
};

$.fn.extend( {
	addClass: ( function( orig ) {
		return function( classNames, speed, easing, callback ) {
			return speed ?
				$.effects.animateClass.call( this,
					{ add: classNames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.addClass ),

	removeClass: ( function( orig ) {
		return function( classNames, speed, easing, callback ) {
			return arguments.length > 1 ?
				$.effects.animateClass.call( this,
					{ remove: classNames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.removeClass ),

	toggleClass: ( function( orig ) {
		return function( classNames, force, speed, easing, callback ) {
			if ( typeof force === "boolean" || force === undefined ) {
				if ( !speed ) {

					// Without speed parameter
					return orig.apply( this, arguments );
				} else {
					return $.effects.animateClass.call( this,
						( force ? { add: classNames } : { remove: classNames } ),
						speed, easing, callback );
				}
			} else {

				// Without force parameter
				return $.effects.animateClass.call( this,
					{ toggle: classNames }, force, speed, easing );
			}
		};
	} )( $.fn.toggleClass ),

	switchClass: function( remove, add, speed, easing, callback ) {
		return $.effects.animateClass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
} );

} )();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

( function() {

if ( $.expr && $.expr.filters && $.expr.filters.animated ) {
	$.expr.filters.animated = ( function( orig ) {
		return function( elem ) {
			return !!$( elem ).data( dataSpaceAnimated ) || orig( elem );
		};
	} )( $.expr.filters.animated );
}

if ( $.uiBackCompat !== false ) {
	$.extend( $.effects, {

		// Saves a set of properties in a data storage
		save: function( element, set ) {
			var i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
				}
			}
		},

		// Restores a set of previously saved properties from a data storage
		restore: function( element, set ) {
			var val, i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					val = element.data( dataSpace + set[ i ] );
					element.css( set[ i ], val );
				}
			}
		},

		setMode: function( el, mode ) {
			if ( mode === "toggle" ) {
				mode = el.is( ":hidden" ) ? "show" : "hide";
			}
			return mode;
		},

		// Wraps the element around a wrapper that copies position properties
		createWrapper: function( element ) {

			// If the element is already wrapped, return it
			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				return element.parent();
			}

			// Wrap the element
			var props = {
					width: element.outerWidth( true ),
					height: element.outerHeight( true ),
					"float": element.css( "float" )
				},
				wrapper = $( "<div></div>" )
					.addClass( "ui-effects-wrapper" )
					.css( {
						fontSize: "100%",
						background: "transparent",
						border: "none",
						margin: 0,
						padding: 0
					} ),

				// Store the size in case width/height are defined in % - Fixes #5245
				size = {
					width: element.width(),
					height: element.height()
				},
				active = document.activeElement;

			// Support: Firefox
			// Firefox incorrectly exposes anonymous content
			// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
			try {
				active.id;
			} catch ( e ) {
				active = document.body;
			}

			element.wrap( wrapper );

			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).trigger( "focus" );
			}

			// Hotfix for jQuery 1.4 since some change in wrap() seems to actually
			// lose the reference to the wrapped element
			wrapper = element.parent();

			// Transfer positioning properties to the wrapper
			if ( element.css( "position" ) === "static" ) {
				wrapper.css( { position: "relative" } );
				element.css( { position: "relative" } );
			} else {
				$.extend( props, {
					position: element.css( "position" ),
					zIndex: element.css( "z-index" )
				} );
				$.each( [ "top", "left", "bottom", "right" ], function( i, pos ) {
					props[ pos ] = element.css( pos );
					if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
						props[ pos ] = "auto";
					}
				} );
				element.css( {
					position: "relative",
					top: 0,
					left: 0,
					right: "auto",
					bottom: "auto"
				} );
			}
			element.css( size );

			return wrapper.css( props ).show();
		},

		removeWrapper: function( element ) {
			var active = document.activeElement;

			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				element.parent().replaceWith( element );

				// Fixes #7595 - Elements lose focus when wrapped.
				if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
					$( active ).trigger( "focus" );
				}
			}

			return element;
		}
	} );
}

$.extend( $.effects, {
	version: "1.12.1",

	define: function( name, mode, effect ) {
		if ( !effect ) {
			effect = mode;
			mode = "effect";
		}

		$.effects.effect[ name ] = effect;
		$.effects.effect[ name ].mode = mode;

		return effect;
	},

	scaledDimensions: function( element, percent, direction ) {
		if ( percent === 0 ) {
			return {
				height: 0,
				width: 0,
				outerHeight: 0,
				outerWidth: 0
			};
		}

		var x = direction !== "horizontal" ? ( ( percent || 100 ) / 100 ) : 1,
			y = direction !== "vertical" ? ( ( percent || 100 ) / 100 ) : 1;

		return {
			height: element.height() * y,
			width: element.width() * x,
			outerHeight: element.outerHeight() * y,
			outerWidth: element.outerWidth() * x
		};

	},

	clipToBox: function( animation ) {
		return {
			width: animation.clip.right - animation.clip.left,
			height: animation.clip.bottom - animation.clip.top,
			left: animation.clip.left,
			top: animation.clip.top
		};
	},

	// Injects recently queued functions to be first in line (after "inprogress")
	unshift: function( element, queueLength, count ) {
		var queue = element.queue();

		if ( queueLength > 1 ) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queueLength, count ) ) );
		}
		element.dequeue();
	},

	saveStyle: function( element ) {
		element.data( dataSpaceStyle, element[ 0 ].style.cssText );
	},

	restoreStyle: function( element ) {
		element[ 0 ].style.cssText = element.data( dataSpaceStyle ) || "";
		element.removeData( dataSpaceStyle );
	},

	mode: function( element, mode ) {
		var hidden = element.is( ":hidden" );

		if ( mode === "toggle" ) {
			mode = hidden ? "show" : "hide";
		}
		if ( hidden ? mode === "hide" : mode === "show" ) {
			mode = "none";
		}
		return mode;
	},

	// Translates a [top,left] array into a baseline value
	getBaseline: function( origin, original ) {
		var y, x;

		switch ( origin[ 0 ] ) {
		case "top":
			y = 0;
			break;
		case "middle":
			y = 0.5;
			break;
		case "bottom":
			y = 1;
			break;
		default:
			y = origin[ 0 ] / original.height;
		}

		switch ( origin[ 1 ] ) {
		case "left":
			x = 0;
			break;
		case "center":
			x = 0.5;
			break;
		case "right":
			x = 1;
			break;
		default:
			x = origin[ 1 ] / original.width;
		}

		return {
			x: x,
			y: y
		};
	},

	// Creates a placeholder element so that the original element can be made absolute
	createPlaceholder: function( element ) {
		var placeholder,
			cssPosition = element.css( "position" ),
			position = element.position();

		// Lock in margins first to account for form elements, which
		// will change margin if you explicitly set height
		// see: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// Support: Safari
		element.css( {
			marginTop: element.css( "marginTop" ),
			marginBottom: element.css( "marginBottom" ),
			marginLeft: element.css( "marginLeft" ),
			marginRight: element.css( "marginRight" )
		} )
		.outerWidth( element.outerWidth() )
		.outerHeight( element.outerHeight() );

		if ( /^(static|relative)/.test( cssPosition ) ) {
			cssPosition = "absolute";

			placeholder = $( "<" + element[ 0 ].nodeName + ">" ).insertAfter( element ).css( {

				// Convert inline to inline block to account for inline elements
				// that turn to inline block based on content (like img)
				display: /^(inline|ruby)/.test( element.css( "display" ) ) ?
					"inline-block" :
					"block",
				visibility: "hidden",

				// Margins need to be set to account for margin collapse
				marginTop: element.css( "marginTop" ),
				marginBottom: element.css( "marginBottom" ),
				marginLeft: element.css( "marginLeft" ),
				marginRight: element.css( "marginRight" ),
				"float": element.css( "float" )
			} )
			.outerWidth( element.outerWidth() )
			.outerHeight( element.outerHeight() )
			.addClass( "ui-effects-placeholder" );

			element.data( dataSpace + "placeholder", placeholder );
		}

		element.css( {
			position: cssPosition,
			left: position.left,
			top: position.top
		} );

		return placeholder;
	},

	removePlaceholder: function( element ) {
		var dataKey = dataSpace + "placeholder",
				placeholder = element.data( dataKey );

		if ( placeholder ) {
			placeholder.remove();
			element.removeData( dataKey );
		}
	},

	// Removes a placeholder if it exists and restores
	// properties that were modified during placeholder creation
	cleanUp: function( element ) {
		$.effects.restoreStyle( element );
		$.effects.removePlaceholder( element );
	},

	setTransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssUnit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		} );
		return value;
	}
} );

// Return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

	// Allow passing all options as the first parameter
	if ( $.isPlainObject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// Convert to an object
	effect = { effect: effect };

	// Catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// Catch (effect, callback)
	if ( $.isFunction( options ) ) {
		callback = options;
		speed = null;
		options = {};
	}

	// Catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// Catch (effect, options, callback)
	if ( $.isFunction( speed ) ) {
		callback = speed;
		speed = null;
	}

	// Add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardAnimationOption( option ) {

	// Valid standard speeds (nothing, number, named speed)
	if ( !option || typeof option === "number" || $.fx.speeds[ option ] ) {
		return true;
	}

	// Invalid strings - treat as "normal" speed
	if ( typeof option === "string" && !$.effects.effect[ option ] ) {
		return true;
	}

	// Complete callback
	if ( $.isFunction( option ) ) {
		return true;
	}

	// Options hash (but not naming an effect)
	if ( typeof option === "object" && !option.effect ) {
		return true;
	}

	// Didn't match any standard API
	return false;
}

$.fn.extend( {
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizeArguments.apply( this, arguments ),
			effectMethod = $.effects.effect[ args.effect ],
			defaultMode = effectMethod.mode,
			queue = args.queue,
			queueName = queue || "fx",
			complete = args.complete,
			mode = args.mode,
			modes = [],
			prefilter = function( next ) {
				var el = $( this ),
					normalizedMode = $.effects.mode( el, mode ) || defaultMode;

				// Sentinel for duck-punching the :animated psuedo-selector
				el.data( dataSpaceAnimated, true );

				// Save effect mode for later use,
				// we can't just call $.effects.mode again later,
				// as the .show() below destroys the initial state
				modes.push( normalizedMode );

				// See $.uiBackCompat inside of run() for removal of defaultMode in 1.13
				if ( defaultMode && ( normalizedMode === "show" ||
						( normalizedMode === defaultMode && normalizedMode === "hide" ) ) ) {
					el.show();
				}

				if ( !defaultMode || normalizedMode !== "none" ) {
					$.effects.saveStyle( el );
				}

				if ( $.isFunction( next ) ) {
					next();
				}
			};

		if ( $.fx.off || !effectMethod ) {

			// Delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, complete );
			} else {
				return this.each( function() {
					if ( complete ) {
						complete.call( this );
					}
				} );
			}
		}

		function run( next ) {
			var elem = $( this );

			function cleanup() {
				elem.removeData( dataSpaceAnimated );

				$.effects.cleanUp( elem );

				if ( args.mode === "hide" ) {
					elem.hide();
				}

				done();
			}

			function done() {
				if ( $.isFunction( complete ) ) {
					complete.call( elem[ 0 ] );
				}

				if ( $.isFunction( next ) ) {
					next();
				}
			}

			// Override mode option on a per element basis,
			// as toggle can be either show or hide depending on element state
			args.mode = modes.shift();

			if ( $.uiBackCompat !== false && !defaultMode ) {
				if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {

					// Call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectMethod.call( elem[ 0 ], args, done );
				}
			} else {
				if ( args.mode === "none" ) {

					// Call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectMethod.call( elem[ 0 ], args, cleanup );
				}
			}
		}

		// Run prefilter on all elements first to ensure that
		// any showing or hiding happens before placeholder creation,
		// which ensures that any layout changes are correctly captured.
		return queue === false ?
			this.each( prefilter ).each( run ) :
			this.queue( queueName, prefilter ).queue( queueName, run );
	},

	show: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "show";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.show ),

	hide: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "hide";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.hide ),

	toggle: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) || typeof option === "boolean" ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "toggle";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.toggle ),

	cssUnit: function( key ) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexOf( unit ) > 0 ) {
				val = [ parseFloat( style ), unit ];
			}
		} );
		return val;
	},

	cssClip: function( clipObj ) {
		if ( clipObj ) {
			return this.css( "clip", "rect(" + clipObj.top + "px " + clipObj.right + "px " +
				clipObj.bottom + "px " + clipObj.left + "px)" );
		}
		return parseClip( this.css( "clip" ), this );
	},

	transfer: function( options, done ) {
		var element = $( this ),
			target = $( options.to ),
			targetFixed = target.css( "position" ) === "fixed",
			body = $( "body" ),
			fixTop = targetFixed ? body.scrollTop() : 0,
			fixLeft = targetFixed ? body.scrollLeft() : 0,
			endPosition = target.offset(),
			animation = {
				top: endPosition.top - fixTop,
				left: endPosition.left - fixLeft,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = element.offset(),
			transfer = $( "<div class='ui-effects-transfer'></div>" )
				.appendTo( "body" )
				.addClass( options.className )
				.css( {
					top: startPosition.top - fixTop,
					left: startPosition.left - fixLeft,
					height: element.innerHeight(),
					width: element.innerWidth(),
					position: targetFixed ? "fixed" : "absolute"
				} )
				.animate( animation, options.duration, options.easing, function() {
					transfer.remove();
					if ( $.isFunction( done ) ) {
						done();
					}
				} );
	}
} );

function parseClip( str, element ) {
		var outerWidth = element.outerWidth(),
			outerHeight = element.outerHeight(),
			clipRegex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
			values = clipRegex.exec( str ) || [ "", 0, outerWidth, outerHeight, 0 ];

		return {
			top: parseFloat( values[ 1 ] ) || 0,
			right: values[ 2 ] === "auto" ? outerWidth : parseFloat( values[ 2 ] ),
			bottom: values[ 3 ] === "auto" ? outerHeight : parseFloat( values[ 3 ] ),
			left: parseFloat( values[ 4 ] ) || 0
		};
}

$.fx.step.clip = function( fx ) {
	if ( !fx.clipInit ) {
		fx.start = $( fx.elem ).cssClip();
		if ( typeof fx.end === "string" ) {
			fx.end = parseClip( fx.end, fx.elem );
		}
		fx.clipInit = true;
	}

	$( fx.elem ).cssClip( {
		top: fx.pos * ( fx.end.top - fx.start.top ) + fx.start.top,
		right: fx.pos * ( fx.end.right - fx.start.right ) + fx.start.right,
		bottom: fx.pos * ( fx.end.bottom - fx.start.bottom ) + fx.start.bottom,
		left: fx.pos * ( fx.end.left - fx.start.left ) + fx.start.left
	} );
};

} )();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

( function() {

// Based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
	baseEasings[ name ] = function( p ) {
		return Math.pow( p, i + 2 );
	};
} );

$.extend( baseEasings, {
	Sine: function( p ) {
		return 1 - Math.cos( p * Math.PI / 2 );
	},
	Circ: function( p ) {
		return 1 - Math.sqrt( 1 - p * p );
	},
	Elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-Math.pow( 2, 8 * ( p - 1 ) ) * Math.sin( ( ( p - 1 ) * 80 - 7.5 ) * Math.PI / 15 );
	},
	Back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	Bounce: function( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
} );

$.each( baseEasings, function( name, easeIn ) {
	$.easing[ "easeIn" + name ] = easeIn;
	$.easing[ "easeOut" + name ] = function( p ) {
		return 1 - easeIn( 1 - p );
	};
	$.easing[ "easeInOut" + name ] = function( p ) {
		return p < 0.5 ?
			easeIn( p * 2 ) / 2 :
			1 - easeIn( p * -2 + 2 ) / 2;
	};
} );

} )();

var effect = $.effects;


/*!
 * jQuery UI Effects Fade 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Fade Effect
//>>group: Effects
//>>description: Fades the element.
//>>docs: http://api.jqueryui.com/fade-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectFade = $.effects.define( "fade", "toggle", function( options, done ) {
	var show = options.mode === "show";

	$( this )
		.css( "opacity", show ? 0 : 1 )
		.animate( {
			opacity: show ? 1 : 0
		}, {
			queue: false,
			duration: options.duration,
			easing: options.easing,
			complete: done
		} );
} );


/*!
 * jQuery UI Effects Slide 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Slide Effect
//>>group: Effects
//>>description: Slides an element in and out of the viewport.
//>>docs: http://api.jqueryui.com/slide-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectSlide = $.effects.define( "slide", "show", function( options, done ) {
	var startClip, startRef,
		element = $( this ),
		map = {
			up: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		mode = options.mode,
		direction = options.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positiveMotion = ( direction === "up" || direction === "left" ),
		distance = options.distance ||
			element[ ref === "top" ? "outerHeight" : "outerWidth" ]( true ),
		animation = {};

	$.effects.createPlaceholder( element );

	startClip = element.cssClip();
	startRef = element.position()[ ref ];

	// Define hide animation
	animation[ ref ] = ( positiveMotion ? -1 : 1 ) * distance + startRef;
	animation.clip = element.cssClip();
	animation.clip[ map[ direction ][ 1 ] ] = animation.clip[ map[ direction ][ 0 ] ];

	// Reverse the animation if we're showing
	if ( mode === "show" ) {
		element.cssClip( animation.clip );
		element.css( ref, animation[ ref ] );
		animation.clip = startClip;
		animation[ ref ] = startRef;
	}

	// Actually animate
	element.animate( animation, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );




}));