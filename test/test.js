
const { isUndefined: noErrors, strictEqual: equals } = require('chai').assert;
const { detectCycles, applyReplacer } = require('..');


describe('detectCycles', () => {
    it('no errors on primitives', () => {
        noErrors(detectCycles(null));
        noErrors(detectCycles(undefined));

        noErrors(detectCycles(1));
        noErrors(detectCycles([]));
        noErrors(detectCycles({}));
        noErrors(detectCycles('hello'));

        noErrors(detectCycles([1, 2, 3, { key: 5, value: 'string' }]));
    });

    it('finds object circularities', () => {
        const a = { key: 'key' };

        a.value = a;
        equals(detectCycles(a), 'root.value');

        a.value = { 0: a };
        equals(detectCycles(a), 'root.value["0"]');

        a.value = { 1: a };
        equals(detectCycles(a), 'root.value[1]');

        a.value = { "deep": { value: a} };
        equals(detectCycles(a), 'root.value.deep.value');

        a.value = { "not id key": { $: { _: { '*': { value: a } } } } };
        equals(detectCycles(a), 'root.value["not id key"].$._["*"].value');
    });

    it('finds array circularities', () => {
        const a = [1, 2, 3];

        a[3] = a;
        equals(detectCycles(a), 'root[3]');

        a[3] = [a];
        equals(detectCycles(a), 'root[3][0]');

        a[3] = [, a];
        equals(detectCycles(a), 'root[3][1]');

        a[3] = [[a]];
        equals(detectCycles(a), 'root[3][0][0]');
    });

    it('finds mixed circularities', () => {
        const a = [1, 2, 3];

        a[3] = { 'mixed': a };
        equals(detectCycles(a), 'root[3].mixed');

        a[3] = { mixed: [a] };
        equals(detectCycles(a), 'root[3].mixed[0]');
    });
});

describe('applyReplacer', () => {
    it('should just work', () => {
        equals(
            JSON.stringify(
                applyReplacer(
                    {
                        prim: 1,
                        prim2: true,
                        prim3: 'hello',

                        array: [1, 2, 3],
                        object: { k: 'key', v: 'val' },

                        $$cache: { toJSON() { throw 'I\'m getting called' } },
                        skipArray: [ '$$skip', 'me', '$$skip' ]
                    },

                    (key, value) => /^\$\$/.test(key) || value === '$$skip' ? undefined : value
                )
            ),

            '{"prim":1,"prim2":true,"prim3":"hello","array":[1,2,3],"object":{"k":"key","v":"val"},"skipArray":[null,"me",null]}'
        );
    });
});
