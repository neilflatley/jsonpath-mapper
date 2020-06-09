/* eslint-disable no-console */
import fromEntries from 'fromentries';
import {
  isArray,
  isFunc,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  jpath,
  tryMultiple,
} from './util';

const formatResult = (value, $formatting, $root) =>
  isObject($formatting)
    ? mapObject(value, $formatting, $root)
    : $formatting(value, $root);

const mapObject = (json, obj, $root) => {
  return fromEntries(
    // For each key value entry in the object, evaluate each entry
    // and make the mapping from the provided json according to the
    // supplied object template that follows a few simple principles
    Object.entries(obj)
      .map(([k, v]) => {
        if (!v) return [k, v];

        // evaluate a given string as a jsonpath expression
        if (isString(v)) {
          return [k, jpath(v, json)];
        }

        // execute a given function
        if (isFunc(v)) {
          return [k, v(json)];
        }

        // evaluate all the array strings as jsonpath
        // and then return the first match
        if (isArray(v)) {
          return [k, tryMultiple(json, v)];
        }

        // if typeof Object, this could be a template object
        // look for reserved key $path and it can be combined with
        // any of $formatting, $return, $default, $disable
        // if not we will treat as plain object and call self recursively
        if (isObject(v)) {
          // store results from various stages of the evaluations
          // eventually reducing this to a finalVal
          let val, formatted, finalVal;
          if (v.$path) {
            // evaluate a given string as a jsonpath expression
            if (isString(v.$path)) {
              val = jpath(v.$path, json);
            }
            if (isArray(v.$path)) {
              val = tryMultiple(json, v.$path);
            }
            if (v.$formatting && !isNullOrUndefined(val)) {
              if (isArray(val)) {
                formatted = val.map(inner =>
                  formatResult(inner, v.$formatting, $root)
                );
              } else {
                formatted = formatResult(val, v.$formatting, $root);
              }
              val = formatted;
            }
            if (v.$return) {
              finalVal = formatResult(val, v.$return, $root);
            } else {
              finalVal = val;
            }
            if (
              (v.$default || isNumber(v.$default)) &&
              isNullOrUndefined(finalVal)
            ) {
              if (isFunc(v.$default)) {
                finalVal = v.$default(json, $root);
              } else {
                finalVal = v.$default;
              }
            }
            if (
              v.$disable &&
              isFunc(v.$disable) &&
              v.$disable(finalVal, $root)
            ) {
              return [k, null];
            }
            return [k, finalVal];
          }
          //otherwise treat as nested object
          return [k, mapObject(json, v, $root)];
        }

        return [k, v];
      })
      .filter(([, v]) => v !== null)
  );
};

const mapArray = (json, arr, $root) => {
  return arr.map(v => mapObject(json, v, $root));
};

const mapJson = (json, template) => {
  const $root = json;
  // console.log(template);
  if (typeof template === 'function') {
    return template(json);
  }
  if (Array.isArray(template)) {
    // console.log(mapArray(json, template));
    return mapArray(json, template, $root);
  }
  // console.log(mapObject(json, template));
  return mapObject(json, template, $root);
};

export const useMapper = (json, template) => {
  return mapJson(json, template);
};

export default mapJson;
