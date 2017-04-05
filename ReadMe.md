
Cycle Detector
==============

## Usage

```js
import { detectCycles } from 'cycle-detector'

const a = {};
a.cycle = a;

// `detectCycles` returns the `undefined` if no cycle is detected
detectCycles({ tag: 'just', value: 'maybe?' }); // undefined

// .. or the path to the cycle
detectCycles(a); // root.cycle
```

## `applyReplacer`

`applyReplacer` is the other exported function. It assists in debugging `JSON.stringify` replacers by applying the replacer onto the provided object. **NOTE: the object is mutated in-place!**

```js
import { applyReplacer } from 'cycle-detector'

applyReplacer(
    {
        $$cache: { toJSON() { throw 'I\'m getting called' } },
        skipArray: [ '$$skip', 'me', '$$skip' ]
    },

    (key, value) => /^\$\$/.test(key) || value === '$$skip' ? undefined : value
); // { '$$cache': undefined, skipArray: [ undefined, 'me', undefined ] }
```
