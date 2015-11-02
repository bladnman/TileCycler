
var PSU = {};

/**
 *	 U T I L I T Y   F U N C T I O N S
 */
PSU.isNullOrEmpty           = function (object) {
	return PSU.isNoE(object);
};
PSU.isA                     = function (object) {
	// Simple function to denote if an object is
	// not null or empty
	return ! PSU.isNoE(object);
};
PSU.isNoE                   = function (object) {
	// UNDEFINED
	if (typeof object === 'undefined') {
		return true;
	}

	// NULL
	if (object === null) {
		return true;
	}

	// MULTIPLE arguments
	// use isAnyNoE(...)
	if ( arguments.length > 1 ) {
		return PSU.isAnyNoE.apply(this, arguments);
	}

	// SINGLE argument
	else {
		// ARRAY: test for empty
		if ( PSU.isArray(object) ) {

			// not items
			if (object.length < 1) {
				return true;
			}

			// 1 item, but it is null
			if (object.length === 1 && PSU.isNoE(object[0]) ) {
				return true; // only element is empty
			}

			// not empty
			return false;
		}

		// (jquery special) HAS 'jquery' value
		if ( object.jquery && object.length < 1 ) {
			return true;
		}

		// STRING value test
		return PSU.getStringValue(object) === '';
	}
};
PSU.isAnyNoE                = function () {
	// no args
	if (typeof arguments === 'undefined') {
		return true;
	}

	// SEND ANY NUMBER OF ARGS
	// each will be tested for isNoE
	// if any are (true) then we we return true
	for (var x = 0; x < arguments.length; x++) {
		if (PSU.isNoE(arguments[x])) {
			return true;
		}
	}

	return false;
};

PSU.getStringValue          = function (object) {

	// string
	if ( PSU.isString(object) ) {
		return object;
	}

	// null or empty
	if (typeof object === 'undefined' || object === null) {
		return '';
	}

	try {
		return object.toString();
	} catch (e) {
		return '';
	}
};
PSU.getBooleanValue         = function (object) {
	// boolean
	if ( PSU.isBoolean(object) ) {
		return object;
	}

	var stringValue				= PSU.getStringValue(object).toLowerCase();
	switch (stringValue) {
		case 'true':
			return true;
		case 't':
			return true;
		case '1':
			return true;
		case 'yes':
			return true;
		case 'y':
			return true;
		case 'checked':
			return true;
		case 'selected':
			return true;
		case 'on':
			return true;

		default:
			return false;
	}
};
PSU.getFloatValue           = function (value) {
	if (PSU.isNoE(value)) {
		return 0.0;
	}

	else {

		var floatValue = 0.0;
		try {
			floatValue		= parseFloat(value);
			if (isNaN(floatValue)) {
				floatValue	= 0.0;
			}
		} catch (ex) { }

		return floatValue;
	}
};
PSU.getIntValue             = function (value) {
	if (PSU.isNoE(value)) {
		return 0;
	}

	else {

		var intValue 		= 0;
		try {
			intValue		= parseInt(value);
			if (isNaN(intValue)) {
				intValue	= 0;
			}
		} catch (ex) {}

		return Math.floor(intValue);
	}
};
PSU.getIntValueByRounding   = function (value) {
	if (PSU.isNoE(value)) {
		return 0;
	}

	else {

		var intValue = 0;
		try {
			intValue		= Math.round(value);

			if (isNaN(intValue)) {
				intValue	= 0;
			}
		} catch (ex) { }

		return intValue;
	}
};
PSU.getArrayValue           = function (value, delim) {
	// array
	if ( PSU.isArray(value) ) {
		return value;
	}

	// nothing
	if ( value === null || value === '' ) {
		return null;
	}

	if ( PSU.isString(value) && PSU.isA(delim) ) {
		return value.split(delim);
	}

	// other
	return [value];
};
PSU.getVal                  = function (item, field) {
	/**
	 * This is a helper function to get a value from an object
	 * that will use the 'Ember' get() mechanism if available or
	 * do a direct map if not. It should allow tests here to be
	 * written agnostic of the implementation. It can also be
	 * extended for other types in the future.
	 *
	 * @param item
	 * @param field
	 * @returns {*}
	 */
	if ( !item || !field ) {
		return null;
	}

	if ( item.get ) {
		return item.get(field);
	}

	return item[field];
};
PSU.setVal                  = function (item, field, value) {
  /**
   * This is a helper function to set a value from an object
   * that will use the 'Ember' set() mechanism if available or
   * do a direct set if not. It should allow tests here to be
   * written agnostic of the implementation. It can also be
   * extended for other types in the future.
   *
   * @param item
   * @param field
   * @returns {*}
   */
  if ( !item || !field ) {
    return;
  }

  if ( item.set ) {
    item.set(field, value);
  }

  else {
    item[field] = value;
  }
};
PSU.setValAndDirty          = function (object, attributeKey, value) {
	/**
	 *  Ember-specific function
	 *
	 *  This function will dirty the attribute in question
	 *  and update to new value safely such that any change --
	 *  even to the same value as it started with -- will produce
	 *  a message of change to observers
	 */
	if ( PSU.isNoE(object) || PSU.isNoE(attributeKey) ) {
		return;
	}

	if ( !object.set || !object.get ) {
		return;
	}

	if ( !Ember || !Ember.changeProperties ) {
		return;
	}

	var currentVal    = object.get(attributeKey);
	var dirtyVal      = (currentVal === null) ? true : null;

	Ember.changeProperties(function() {
		object.set(attributeKey, dirtyVal);   // first dirty it
		object.set(attributeKey, value);      // then set it
	});

};
PSU.random                  = function (max, min) {
	max 			= parseInt(max);
	min 			= parseInt(min);

	if (isNaN(max)) {
		max = 10;
	}
	if (isNaN(min)) {
		min = 0;
	}

	if (min > max) {
		var t = min;
		min = max;
		max = t;
	}

	return Math.floor(Math.random() * ((max+1) - min)) + min;
};
PSU.flipIsHeads             = function () {
	var r = PSU.random(1);
	return r === 1;
};
PSU.roll                    = function (sided) {
	return PSU.random(Math.max(1, sided), 1);
};
PSU.fLeft                   = function (string, delim) {
	if( PSU.isNoE(string) || PSU.isNoE(delim)) {
		return '';
	}

	string						= PSU.getStringValue(string);
	delim						= PSU.getStringValue(delim);

	var theSpot					= string.indexOf(delim);
	if (theSpot > -1) {
		return string.substring(0, theSpot);
	}
	return '';
};
PSU.fLeftBack               = function (string, delim) {
	if( PSU.isNoE(string) || PSU.isNoE(delim)) {
		return '';
	}

	string						= PSU.getStringValue(string);
	delim						= PSU.getStringValue(delim);

	var theSpot					= string.lastIndexOf(delim);
	if (theSpot > -1) {
		return string.substring(0, theSpot);
	}
	return '';
};
PSU.fRight                  = function (string, delim) {
	if( PSU.isNoE(string) || PSU.isNoE(delim)) {
		return '';
	}

	string						= PSU.getStringValue(string);
	delim						= PSU.getStringValue(delim);

	var theSpot					= string.indexOf(delim);
	if (theSpot > -1) {
		return string.substring(theSpot + delim.length, string.length);
	}

	return '';
};
PSU.fRightBack              = function (string, delim) {

	if( PSU.isNoE(string) || PSU.isNoE(delim)) {
		return '';
	}

	string						= PSU.getStringValue(string);
	delim						= PSU.getStringValue(delim);

	var theSpot					= string.lastIndexOf(delim);
	if (theSpot > -1) {
		return string.substring(theSpot + delim.length, string.length);
	}

	return '';
};
PSU.fBetween                = function (string, delimLeft, delimRight) {
	return PSU.fLeft(PSU.fRight(string, delimLeft), delimRight);
};
PSU.fBetweenOuter           = function (string, delimLeft, delimRight) {
	return PSU.fLeftBack(PSU.fRight(string, delimLeft), delimRight);
};
PSU.replaceFor              = function (string, lookFor, replaceWith) {
	if ( typeof string === 'undefined' ) {
		return null;
	}
	if ( string === null ) {
		return null;
	}
	if ( string === '' ) {
		return '';
	}
	if ( typeof string !== 'string' ) {
		return null;
	}

	// bad lookfor
	if ( PSU.isNoE(lookFor) ) {
		return string;
	}

	// bad replaceWith
	if ( PSU.isNoE(replaceWith) ) {
		replaceWith				= '';
	}


	if ( lookFor === replaceWith ) {
		return string;
	}

	var inText 		= string,
		outText 		= '',
		holdText 	= '',
		foundCount 	= 0,
		theSpot		= -1;
	while (inText.indexOf(lookFor) > -1) {
		foundCount++;
		theSpot  = inText.indexOf(lookFor);

		if (outText.length > 0 || foundCount > 1) {
			outText += replaceWith + inText.substring(0, theSpot);
		}
		else {
			outText = inText.substring(0,theSpot);
		}

		holdText 	= inText.substring(theSpot+lookFor.length,inText.length);
		inText  		= holdText;
	}
	if (foundCount > 0) {
		outText  += replaceWith + inText;
	}

	else {
		outText = inText;
	}
	return outText;
};
PSU.contains                = function (string, substr, caseInsensitive) {
	if (PSU.isNoE(substr)) {
		return false;
	}

	if (typeof string === 'string') {
		if (caseInsensitive) {
			return string.toLowerCase().indexOf(substr.toLowerCase()) > -1;
		}

		else {
			return string.indexOf(substr) > -1;
		}

	}

	return false;
};
PSU.endsWith                = function (string, lookFor, caseInsensitive) {
	if ( PSU.isNoE(string) || PSU.isNoE(lookFor) || ! PSU.isString(string) ) {
		return false;
	}

	if (caseInsensitive) {
		return string.toLowerCase().slice(-lookFor.length) === lookFor.toLowerCase();
	}


	return string.slice(-lookFor.length) === lookFor;
};
PSU.startsWith              = function (string, lookFor, caseInsensitive) {
	if ( PSU.isNoE(string) || PSU.isNoE(lookFor) ) {
		return false;
	}

	if (caseInsensitive) {
		return string.toLowerCase().slice(0, lookFor.length) === lookFor.toLowerCase();
	}

	return string.slice(0, lookFor.length) === lookFor;
};
PSU.returnDecimalPlaces     = function (value, decimalsToReturn) {
	if ( value === null ) {
		return null;
	}
	decimalsToReturn    = decimalsToReturn || 0;

	// 'toFixed' rounds, we are avoiding that by adding another digit of precision
	var fixedValue      = value.toFixed(++decimalsToReturn);

	// then dropping that digit
	var ret             = fixedValue.slice(0, fixedValue.length-1);

	// and the leading '+' is to convert back to a number
	return +ret; // convert to number
};
PSU.breath                  = function (thenExecute) {
	var forMillsOrNull			= 10;
	/**
	 Odd interface. This will breath for a few mills by default,
	 or allow you to send in the mills to breath for.

	 This can be called like this:
	 breath(function)
	 - or -
	 breath(mils, function)
	 - or -
	 breath(function, mils)

	 This function will figure out which you mean.
	 */

	var argsArray 				= [].slice.apply(arguments);

	if ( argsArray.length < 1 ) {
		return;
	}

	if ( argsArray.length === 1 ) {
		thenExecute				= argsArray[0];
	}

	else if ( argsArray.length === 2 ) {
		forMillsOrNull			= argsArray[0];
		thenExecute				= argsArray[1];
	}

	// get the parms straightened out
	// this allows for (func,int) and (int,func)
	if ( PSU.isFunction(forMillsOrNull) ) {
		var tmp = thenExecute || null;
		thenExecute		= forMillsOrNull;
		forMillsOrNull	= tmp;
	}

	// bail -- we have NO FUNCTIONS
	if ( ! PSU.isFunction(thenExecute) && ! PSU.isFunction(forMillsOrNull) ) {
		return null;
	}

	var breathForMills				= forMillsOrNull || 10;
	if ( ! PSU.isNoE(thenExecute) ) {

		// if the timeout is 0 then execute immediately
		if ( breathForMills < 1 ) {
			thenExecute();
		}

		else {
			return setTimeout(thenExecute, breathForMills);
		}
	}

	return null;
};
PSU.merge                   = function (root) {

	if (arguments.length < 1) {
		return null;
	}
	root		= root || {};

	// GO THROUGH EACH OBJECT SENT TO US
	// starting at 1 to skip 'root'
	for ( var i = 1; i < arguments.length; i++ ) {

		var objectToTakeFrom	= arguments[i];

		// ONLY WORK ARRAYS AND OBJECTS
		if ( PSU.isObject(objectToTakeFrom) || PSU.isArray(objectToTakeFrom) ) {
			// GET THE PROPERTIES FROM THIS OBJECT
			for ( var key in objectToTakeFrom ) {

				// IF THIS PROPERTY IS OWNED BY THIS OBJECT
				if ( objectToTakeFrom.hasOwnProperty(key)) {

					var propertyToMerge	= objectToTakeFrom[key];
					var propertyOnRoot	= root[key] || null;

					// ROOT DOES NOT HAVE THIS OBJECT - move it over entirely
					// allow null value to be moved over
					if ( propertyOnRoot === null || propertyToMerge === null || typeof propertyToMerge !== 'object') {
						root[key] = propertyToMerge;
					}

					// NON-OBJECT & ARRAY -- overwrite entirely
					else if ( PSU.isArray(propertyToMerge) || typeof propertyToMerge !== 'object') {
						root[key] = propertyToMerge;
					}

					// EMPTY OBJECT
					// odd scenario where if given an empty object {} we were skipping it all
					else if ( typeof propertyToMerge === 'object' && Object.keys(propertyToMerge).length < 1) {
						root[key] = propertyToMerge;
					}

					// ROOT ALREADY HAS A PROPERTY WITH THIS NAME
					// deep merge to maintain as much data as possible
					else {
						root[key] = PSU.merge(propertyOnRoot, propertyToMerge);
					}
				}
			}
		}

	}
	return root;
};
PSU.extendClass             = function (ChildClass, ParentClass) {
	if ( ! ChildClass ) {
		return null;
	}

	if ( ! ParentClass ) {
		return ChildClass;
	}


	var _super 							= new ParentClass();
	ChildClass.prototype 				= _super;
	//noinspection JSUnusedGlobalSymbols
	ChildClass.prototype.constructor 	= ChildClass;		// jshint ignore:line
	ChildClass.prototype._super 		= _super;
	return ChildClass;
};
PSU.getURLParamValue        = function (name) {

	if ( ! window  || ! window.location || ! window.location.href || PSU.isNoE(name) ) {
		return null;
	}

	name            = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS      = "[\\?&]"+name+"=([^&#]*)";
	var regex       = new RegExp( regexS, "i" );    // i - case insensitive (always at this point)
	var results     = regex.exec(window.location.href);
	return (results === null) ? "" : results[1];
};
PSU.getNextIntDivisibleBy       = function(startVal, divisibleBy) {
	// must send INTs, and divisibleBy cannot be 0
	if ( ! PSU.isInt(startVal) || ! PSU.isInt(divisibleBy) || divisibleBy === 0  ) {
		return null;
	}

	var lower = Math.floor(startVal / divisibleBy);
	var upper = (lower+1) * divisibleBy;

	return (lower >= startVal) ? lower : upper;
};

/**
 *	 T Y P E   T E S T S
 */
PSU.isArray                 = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Array]';
};
PSU.isString                = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object String]';
};
PSU.isDate                  = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Date]';
};
PSU.isNumber                = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Number]';
};
PSU.isRegExp                = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object RegExp]';
};
PSU.isBoolean               = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Boolean]';
};
PSU.isInt                   = function (obj) {
	return PSU.isNumber(obj) && obj % 1 === 0;
};
PSU.isFunction              = function (obj) {
	return Object.prototype.toString.call( obj ) === '[object Function]';
};
PSU.isObject                = function (obj) {
	// Null and Undefined are also objects in JavaScript
	// when we are asking if this is an Object
	// we mean to say
	if ( typeof obj === 'undefined' || obj === null) {
		return false;
	}
	return Object.prototype.toString.call( obj ) === '[object Object]';
};
PSU.isJquery                = function (obj) {
	if ( PSU.isNoE(obj) ) {
		return false;
	}
	return (obj.jquery !== undefined);
};


/**
 *  A R R A Y   U T I L S
 */
PSU.arrayIndexOf            = function(array, element) {
	if ( PSU.isNoE(array) || PSU.isNoE(element) ) {
		return -1;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i] === element) {
			return i;
		}
	}
	return -1;
};
PSU.arrayContains           = function(array, element) {
	return PSU.arrayIndexOf(array, element) > -1;
};
PSU.arrayPopElement         = function(array, element) {
	if ( PSU.isNoE(array) || PSU.isNoE(element) ) {
		return null;
	}
	var index 		= array.indexOf(element);
	if (index > -1) {
		var newArray 	= array.splice(index, 1);
		if ( newArray.length === 1 ) {
			return newArray[0];
		}
		return null;
	}
	return null;
};
PSU.arrayPopFirstElement    = function(array) {
	if ( PSU.isNoE(array) ) {
		return null;
	}
	return array.splice(0, 1)[0];
};
PSU.arrayPopLastElement     = function(array) {
	if ( PSU.isNoE(array) ) {
		return null;
	}
	return array.pop();
};
PSU.arrayPushUnique         = function(array, element) {
	if ( typeof array === 'undefined' || PSU.isNoE(element) ) {
		return;
	}
	if ( ! array.contains(element) ) {
		array.push(element);
	}
};
PSU.arrayRotateFirstToLast  = function(array) {
	if ( PSU.isNoE(array) ) {
		return null;
	}
	var firstElem = PSU.arrayPopFirstElement(array);
	array.push(firstElem);
	return array;
};
PSU.arrayRandomItem         = function(array) {
	if ( PSU.isNoE(array) ) {
		return null;
	}
	var roll = PSU.roll( array.length );
	return array[roll - 1];
};
PSU.arrayCopy               = function(array) {
  if ( array === null || (typeof array === undefined) ) {
    return null;
  }

  var copy = [];
  for (var i=0; i < array.length; i++) {
    copy.push(array[i]);
  }
  return copy;
};

/**
 *  D A T E   U T I L S
 */
PSU.now                         = function () {
  return new Date();
};
PSU.nowTime                     = function () {
  return (new Date()).getTime();
};
PSU.dateFromISO                 = function (str) {
	if ( ! str ) {
		return null;
	}
	if ( PSU.isDate(str) ) {
		return str;
	}
	if ( ! str.length || str.length < 1 ) {
		return null;
	}
	str = str.split(/\D/);
	return new Date(str[0], --str[1]||'', str[2]||'', str[3]||'', str[4]||'', str[5]||'', str[6]||'');
};
PSU.secondsDiff                 = function (startDate, endDate) {
	try {
		return Math.max(0, Math.floor((endDate-startDate) / 1000));
	} catch (e) {}

	return 0;
};
PSU.secondsFromDate							= function (date) {
	try {
		return PSU.getIntValue(date.getTime() / 1000);
	} catch (e) {}

	return null;
};
PSU.secondsFromTimecode         = function (timecode) {
	if ( !timecode ) {
		return null;
	}
	/**
	 * TIMECODE INFO
	 *
	 * Timecodes are multi-part time values
	 *    ex: 01:02:03:04
	 *
	 * Format
	 *    hrs:min:sec:frames
	 *
	 */
	try {
		var parts = timecode.split(':');

		// timecode without frames
		if ( parts.length === 3 ) {
			parts.push('00');
		}

		if ( parts.length === 4 ) {
			return (parts[0] * 60 * 60) + (parts[1] * 60) + (parts[2] * 1);
		}
	} catch (ex) {}

	return null;
};
PSU.yearsFromSeconds            = function(seconds) {
	return (PSU.getIntValue(seconds) / 31536000);
};
PSU.timecodeFromSeconds         = function (inSeconds, includeFrames) {
	var seconds = inSeconds;
	if ( seconds === null ) {
		return null;
	}
	/**
	 * TIMECODE INFO
	 *
	 * Timecodes are multi-part time values
	 *    ex: 01:02:03:04
	 *
	 * Format
	 *    hrs:min:sec:frames
	 *
	 */
	try {

		var hours = Math.floor(seconds / (60*60));
		seconds   = seconds - (hours * 60 * 60);

		var mins  = Math.floor(seconds / 60);
		seconds   = Math.floor(seconds - (mins * 60));

		// addLeadZero
		var alz = function (value) {
			value = value || 0;
			return ( value < 10 ) ? ('0' + value) : value;
		};

		var outString = alz(hours)    + ':' +
										alz(mins)     + ':' +
										alz(seconds);
		if ( includeFrames ) {
			outString   += ":00";
		}

		return outString;
	} catch (ex) {}

	return null;
};
PSU.absDateFromDate             = function (date) {
	if( PSU.isNoE(date) ) {
		return null;
	}

	var newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};
PSU.dateByAddingDaysToDate      = function (date, daysToAdd) {
	if( PSU.isNoE(date)) {
		return null;
	}
	var newDate = new Date(date);
	newDate.setDate(newDate.getDate() + daysToAdd);
	return newDate;
};
PSU.dateByAddingHoursToDate     = function (date, hours) {
	return PSU.dateByAddingSecondsToDate(date, hours * 60 * 60);
};
PSU.dateByAddingMinutesToDate   = function (date, minutes) {
	return PSU.dateByAddingSecondsToDate(date, minutes * 60);
};
PSU.dateByAddingSecondsToDate   = function (date, seconds) {
	if( PSU.isNoE(date) ||  ! PSU.isDate(date)) {
		return null;
	}
	return new Date(date.getTime() + seconds * 1000);
};
PSU.dateFromYMD							    = function (ymdString) {

	var year        = PSU.fLeft(ymdString, "-");
	var month       = PSU.fBetween(ymdString, "-", "-");
	var day         = PSU.fRightBack(ymdString, "-");

	// bail
	if (year === "" || month === "" || day === "") {
		return null;
	}

	return new Date(year, month - 1, day);
};
PSU.isDateAfterOrEqualToDate    = function (thisDate, thatDate) {
	return ! PSU.isDateBeforeDate(thisDate, thatDate);
};
PSU.isDateBeforeOrEqualToDate   = function (thisDate, thatDate) {
	return ! PSU.isDateAfterDate(thisDate, thatDate);
};
PSU.isDateBeforeDate            = function (thisDate, thatDate) {
	if (PSU.isNoE(thisDate) || PSU.isNoE(thatDate)) {
		return false;
	}
	return thisDate.getTime() < thatDate.getTime();
};
PSU.isDateAfterDate             = function (thisDate, thatDate) {
	if (PSU.isNoE(thisDate) || PSU.isNoE(thatDate)) {
		return false;
	}
	return thisDate.getTime() > thatDate.getTime();
};
PSU.isDateBetweenDates          = function (dateInQuestion, earlierDate, laterDate) {
	if (PSU.isNoE(dateInQuestion) || PSU.isNoE(earlierDate) || PSU.isNoE(laterDate)) {
		return false;
	}
	return  PSU.isDateAfterOrEqualToDate(dateInQuestion, earlierDate) && PSU.isDateBeforeOrEqualToDate(dateInQuestion, laterDate);
};
PSU.getMinutesUntilNextMinuteDivisibleBy = function(divisibleBy) {
	var currentMinute             = (new Date()).getMinutes();

	// we want this value aligned to the x-minute point on a clock
	var nextMinutesToRefresh      = PSU.getNextIntDivisibleBy(currentMinute, divisibleBy);

	// minutes - must be within an hour
	if ( nextMinutesToRefresh > 60 ) {
		return divisibleBy;
	}

	return nextMinutesToRefresh - currentMinute;
};


export default PSU;
