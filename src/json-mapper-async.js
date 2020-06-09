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

const formatResult = async (value, $formatting, $root) =>
  isObject($formatting)
    ? await mapObject(value, $formatting, $root)
    : await $formatting(value, $root);

const mapObject = async (json, obj, $root) => {
  const results = await Promise.all(
    // For each key value entry in the object, evaluate each entry
    // and make the mapping from the provided json according to the
    // supplied object template that follows a few simple principles
    Object.entries(obj).map(async ([k, v]) => {
      if (!v) return [k, v];

      // evaluate a given string as a jsonpath expression
      if (isString(v)) {
        return [k, jpath(v, json)];
      }

      // execute a given function
      if (isFunc(v)) {
        return [k, await v(json)];
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
              formatted = await Promise.all(
                val.map(
                  async inner => await formatResult(inner, v.$formatting, $root)
                )
              );
            } else {
              formatted = await formatResult(val, v.$formatting, $root);
            }
            val = formatted;
          }
          if (v.$return) {
            finalVal = await formatResult(val, v.$return, $root);
          } else {
            finalVal = val;
          }
          if (
            (v.$default || isNumber(v.$default)) &&
            isNullOrUndefined(finalVal)
          ) {
            if (isFunc(v.$default)) {
              finalVal = await v.$default(json, $root);
            } else {
              finalVal = v.$default;
            }
          }
          if (
            v.$disable &&
            isFunc(v.$disable) &&
            (await v.$disable(finalVal, $root))
          ) {
            return [k, null];
          }
          return [k, finalVal];
        }
        //otherwise treat as nested object
        return [k, await mapObject(json, v, $root)];
      }

      return [k, v];
    })
  );

  return fromEntries(results.filter(([, v]) => v !== null));
};

const mapArray = async (json, arr, $root) => {
  return await arr.map(async v => await mapObject(json, v, $root));
};

const mapJson = async (json, template) => {
  const $root = json;
  // console.log(template);
  if (typeof template === 'function') {
    return await template(json);
  }
  if (Array.isArray(template)) {
    // console.log(mapArray(json, template));
    return await mapArray(json, template, $root);
  }
  // console.log(mapObject(json, template));
  return await mapObject(json, template, $root);
};

export const useMapper = async (json, template) => {
  return await mapJson(json, template);
};

export default mapJson;
