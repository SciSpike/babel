const pause = require('../pause');

const delay = 10;

function dec(target, name, descriptor) {
  expect(target).toBeTruthy();
  expect(typeof name).toBe("string");
  expect(typeof descriptor).toBe("object");

  target.decoratedProps = (target.decoratedProps || []).concat([name]);

  let value = descriptor.value;
  return {
    enumerable: name.indexOf('enum') !== -1,
    configurable: name.indexOf('conf') !== -1,
    writable: name.indexOf('write') !== -1,
    value: async function(...args){
      await pause(delay + 10);
      return '__' + (await value.apply(this, args)) + '__';
    },
  };
}

class Example {
  @dec
  async enumconfwrite() {
    await pause(delay);
    return 1;
  }

  @dec
  async enumconf() {
    await pause(delay);
    return 2;
  }

  @dec
  async enumwrite() {
    await pause(delay);
    return 3;
  }

  @dec
  async enum() {
    await pause(delay);
    return 4;
  }

  @dec
  async confwrite() {
    await pause(delay);
    return 5;
  }

  @dec
  async conf() {
    await pause(delay);
    return 6;
  }

  @dec
  async write() {
    await pause(delay);
    return 7;
  }

  @dec
  async _() {
    await pause(delay);
    return 8;
  }
}

expect(Example.prototype).toHaveProperty('decoratedProps');
expect(Example.prototype.decoratedProps).toEqual([
  "enumconfwrite",
  "enumconf",
  "enumwrite",
  "enum",
  "confwrite",
  "conf",
  "write",
  "_",
]);

async function test() {
  const inst = new Example();

  const descs = Object.getOwnPropertyDescriptors(Example.prototype);

  expect(descs.enumconfwrite.enumerable).toBeTruthy();
  expect(descs.enumconfwrite.writable).toBeTruthy();
  expect(descs.enumconfwrite.configurable).toBeTruthy();
  expect(await inst.enumconfwrite()).toBe("__1__");

  expect(descs.enumconf.enumerable).toBeTruthy();
  expect(descs.enumconf.writable).toBe(false);
  expect(descs.enumconf.configurable).toBeTruthy();
  expect(await inst.enumconf()).toBe("__2__");

  expect(descs.enumwrite.enumerable).toBeTruthy();
  expect(descs.enumwrite.writable).toBeTruthy();
  expect(descs.enumwrite.configurable).toBe(false);
  expect(await inst.enumwrite()).toBe("__3__");

  expect(descs.enum.enumerable).toBeTruthy();
  expect(descs.enum.writable).toBe(false);
  expect(descs.enum.configurable).toBe(false);
  expect(await inst.enum()).toBe("__4__");

  expect(descs.confwrite.enumerable).toBe(false);
  expect(descs.confwrite.writable).toBeTruthy();
  expect(descs.confwrite.configurable).toBeTruthy();
  expect(await inst.confwrite()).toBe("__5__");

  expect(descs.conf.enumerable).toBe(false);
  expect(descs.conf.writable).toBe(false);
  expect(descs.conf.configurable).toBeTruthy();
  expect(await inst.conf()).toBe("__6__");

  expect(descs.write.enumerable).toBe(false);
  expect(descs.write.writable).toBeTruthy();
  expect(descs.write.configurable).toBe(false);
  expect(await inst.write()).toBe("__7__");

  expect(descs._.enumerable).toBe(false);
  expect(descs._.writable).toBe(false);
  expect(descs._.configurable).toBe(false);
  expect(await inst._()).toBe("__8__");
}

test();
