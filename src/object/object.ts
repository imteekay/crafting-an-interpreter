type ObjectType = string;
type type = () => ObjectType;
type inspect = () => string;

interface Object {
  type: type;
  inspect: inspect;
}

enum ObjectTypes {
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
}

export class Integer implements Object {
  value: number;

  type() {
    return ObjectTypes.INTEGER;
  }

  inspect() {
    return this.value.toString();
  }
}

export class Boolean implements Object {
  value: boolean;

  type() {
    return ObjectTypes.BOOLEAN;
  }

  inspect() {
    return this.value.toString();
  }
}

export class Null implements Object {
  type() {
    return ObjectTypes.NULL;
  }

  inspect() {
    return 'null';
  }
}
