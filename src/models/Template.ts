export type Path = string | string[];

export type MappingElement<S> = Path | ResultFormatter<S> | MapperFunctions<S>;

// type WireFunctionArg<S, K extends keyof S> = S[K];

export type WireFunction<S> = (scopedJson: S | any, root: S) => any;
export type ResultFormatter<S> = WireFunction<S> | MapperFunctions<S>;
export type DefaultFunction<S> = WireFunction<S> | string | number;
export type DisableFunction<S> = (resolvedJson: S | any, root: S) => boolean;


export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Deferred<T> = {
  [P in keyof T]: Promise<T[P]>;
};
export type PureJsFunction<S> = (json: S) => any;


export interface MapperFunctions<S> {
  $path: string | string[];
  $formatting?: ResultFormatter<S>;
  $return?: ResultFormatter<S>;
  $default?: DefaultFunction<S>;
  $disable?: DisableFunction<S>;
};

interface MappingTemplate<S> {
  [key: string]: MappingElement<S>;
};

export default MappingTemplate;
