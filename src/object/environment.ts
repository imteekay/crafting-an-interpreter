import { EvalObject } from 'object/object';

type EnvironmentTypeKey = string;
type EnvironmentTypeValue = EvalObject | null | undefined;
type EnvironmentType = Map<EnvironmentTypeKey, EnvironmentTypeValue>;

export class Environment {
  store: EnvironmentType;
  outer?: Environment;

  constructor(outer?: Environment) {
    this.store = new Map<EnvironmentTypeKey, EnvironmentTypeValue>();
    this.outer = outer;
  }

  get(name: EnvironmentTypeKey) {
    const has = this.store.has(name);
    const value = this.store.get(name);

    if (!has && this.outer) {
      const has = this.outer.store.has(name);
      const value = this.outer.store.get(name);
      return { has, value };
    }

    return { has, value };
  }

  set(name: EnvironmentTypeKey, value: EnvironmentTypeValue) {
    this.store.set(name, value);
    return value;
  }
}
