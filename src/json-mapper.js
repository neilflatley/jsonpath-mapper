/* eslint-disable no-console */
import jp from 'simple-jsonpath';
import fromEntries from 'fromentries';

export const jpath = (query, json) => {
  const result = jp.query(json, `$${query.startsWith('.') ? '' : '.'}${query}`);
  if (
    result.length > 1 ||
    (query.match(/\[.*?\]/) && !query.match(/\[[0-9]\]/))
  )
    return result;
  return result[0];
};

const isArray = val => Array.isArray(val);
const isFunc = val => typeof val === 'function';
const isNumber = val => typeof val === 'number';
const isObject = val => typeof val === 'object';
const isString = val => typeof val === 'string';

const tryMultiple = (json, arr) => {
  const result = findMultiple(json, arr).filter(r => isNumber(r) || r);
  return result.length > 0 && result[0];
};

const findMultiple = (json, arr) => {
  const results = arr.map(inner => {
    // evaluate any value supplied as string
    if (isString(inner)) {
      return jpath(inner, json);
    }
    // if typeof func
    return inner(json);
  });
  return results;
};

const formatResult = (value, $formatting, $root) =>
  isObject($formatting)
    ? mapObject(value, $formatting, $root)
    : $formatting(value, $root);

const mapObject = (json, obj, $root) => {
  return fromEntries(
    Object.entries(obj)
      .map(([k, v]) => {
        if (!v) return [k, v];
        // if typeof Array evaluate all the options
        // and then return the first match
        if (isArray(v)) {
          return [k, tryMultiple(json, v)];
        }
        // if typeof Object,
        // if we've defined '$path' and $formatting or $default
        // if not we will treat as plain object and call self recursively
        if (isObject(v)) {
          // do we have $path or $formatting?
          let val, formatted, finalVal;
          if (v.$path) {
            if (isString(v.$path)) {
              val = jpath(v.$path, json);
            }
            if (isArray(v.$path)) {
              val = tryMultiple(json, v.$path);
            }
            if (v.$formatting && (isNumber(val) || val)) {
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
            if ((v.$default || isNumber(v.$default)) && !finalVal) {
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

        if (isString(v)) {
          return [k, jpath(v, json)];
        }
        if (isFunc(v)) {
          return [k, v(json)];
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
