import { EvalObject } from 'object/object';

type EnvironmentTypeKey = string;
type EnvironmentTypeValue = EvalObject;
type EnvironmentType = Map<EnvironmentTypeKey, EnvironmentTypeValue>;

export class Environment {
  store: EnvironmentType;

  constructor() {
    this.store = new Map<EnvironmentTypeKey, EnvironmentTypeValue>();
  }

  get(name: EnvironmentTypeKey) {
    const has = this.store.has(name);
    const value = this.store.get(name);
    return { has, value };
  }

  set(name: EnvironmentTypeKey, value: EnvironmentTypeValue) {
    this.store.set(name, value);
    return value;
  }
}