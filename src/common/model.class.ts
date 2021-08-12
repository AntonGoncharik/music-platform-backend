export class Model {
  constructor(
    obj: any,
    objDef: any,
    modelName: string,
    ignoreRequired: boolean,
  ) {
    Object.keys(objDef).forEach((key) => {
      let handledValue = obj[key];

      if (handledValue === undefined) {
        if (ignoreRequired) {
          return;
        }

        if (objDef[key].default) {
          this[key] = objDef[key].default;
          return;
        }

        if (!objDef[key].required) {
          this[key] = null;
          return;
        }
      }

      if (obj[key] === null) {
        this[key] = null;
        return;
      }

      handledValue = this.convertFromString(
        handledValue,
        key,
        objDef[key].type,
      );

      if (
        typeof handledValue !== objDef[key].type &&
        objDef[key].nullable !== true
      ) {
        throw new Error(
          `${modelName}Model prop ${key} expected ${
            objDef[key].type
          } but got ${typeof handledValue} value ${handledValue}`,
        );
      }

      this[key] = handledValue;
    });

    if (Object.values(this).length === 0 && !ignoreRequired) {
      throw new Error(
        `${modelName}Model this.obj quantity is 0, obj from constructor ${JSON.stringify(
          Object.keys(obj),
        )} may not be supported or empty`,
      );
    }
  }

  convertFromString(prop, key, type) {
    if (type === 'number' && typeof prop === 'string') {
      const number = +prop;

      if (!Number.isNaN(number)) {
        return number;
      }
    }

    if (type === 'bool' && typeof prop === 'string') {
      if (prop === 'true') {
        this[key] = true;
        return true;
      }
      if (prop === 'false') {
        this[key] = false;
        return false;
      }
    }

    return prop;
  }
}
