/* eslint-disable no-console */
import jp from 'jsonpath';
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

const mapObject = (json, obj) => {
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
                formatted = val.map(inner => v.$formatting(inner));
              } else {
                formatted = v.$formatting(val);
              }
              val = formatted;
            }
            if (v.$return) {
              finalVal = v.$return(val);
            } else {
              finalVal = val;
            }
            if ((v.$default || isNumber(v.$default)) && !finalVal) {
              if (isFunc(v.$default)) {
                finalVal = v.$default(json);
              } else {
                finalVal = v.$default;
              }
            }
            if (v.$disable && isFunc(v.$disable) && v.$disable(finalVal)) {
              return [k, null];
            }
            return [k, finalVal];
          }
          //otherwise treat as nested object
          return [k, mapObject(json, v)];
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

const mapArray = (json, arr) => {
  return arr.map(v => mapObject(json, v));
};

const mapJson = (json, template) => {
  // console.log(template);
  if (typeof template === 'function') {
    return template(json);
  }
  if (Array.isArray(template)) {
    // console.log(mapArray(json, template));
    return mapArray(json, template);
  }
  // console.log(mapObject(json, template));
  return mapObject(json, template);
};

export const useMapper = (json, template) => {
  return mapJson(json, template);
};

export default mapJson;
