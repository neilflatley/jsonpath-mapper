/* eslint-disable no-console */
import jp from 'jsonpath';

export const jpath = (query, json) => {
  const result = jp.query(json, `$.${query}`);
  if (
    result.length > 1 ||
    (query.match(/\[.*?\]/) && !query.match(/\[[0-9]\]/))
  )
    return result;
  return result[0];
};

const tryMultiple = (json, arr) => {
  const result = findMultiple(json, arr).filter(r => r);
  return result.length > 0 && result[0];
};

const findMultiple = (json, arr) => {
  const results = arr.map(inner => {
    // evaluate any value supplied as string
    if (typeof inner === 'string') {
      return jpath(inner, json);
    }
    // if typeof func
    return inner(json);
  });
  return results;
};

const mapObject = (json, obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (!v) return [k, v];
      // if typeof Array evaluate all the options
      // and then return the first match
      if (Array.isArray(v)) {
        return [k, tryMultiple(json, v)];
      }
      // if typeof Object,
      // if we've defined '$path' and $formatting or $default
      // if not we will treat as plain object and call self recursively
      if (typeof v === 'object') {
        // do we have $path or $formatting?
        let val, formatted;
        if (v.$path) {
          if (typeof v.$path === 'string') {
            val = jpath(v.$path, json);
          }
          if (Array.isArray(v.$path)) {
            val = tryMultiple(json, v.$path);
          }
          if (v.$formatting) {
            if (Array.isArray(val || json)) {
              formatted = (val || json).map(inner => v.$formatting(inner));
            }
            return [k, formatted || v.$formatting(val || json)];
          } else {
            if (v.$default && !val) {
              if (typeof v.$default === 'function') {
                return [k, v.$default(json)];
              }
              return [k, v.$default];
            }
            return [k, val];
          }
        }
        //otherwise treat as nested object
        return [k, mapObject(json, v)];
      }

      if (typeof v === 'string') {
        return [k, jpath(v, json)];
      }
      if (typeof v === 'function') {
        return [k, v(json)];
      }
      return [k, v];
    })
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
