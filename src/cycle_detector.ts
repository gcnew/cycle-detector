
export { detectCycles, applyReplacer }

function detectCyclesGo(x: any, stack: any[], path: string): string|undefined {
    if (x == null || typeof x !== 'object') {
        return undefined;
    }

    stack.push(x);
    if (Array.isArray(x)) {
        for (let i = 0; i < x.length; ++i) {
            const e = x[i];
            const elemPath = path + '[' + i + ']';

            if (stack.indexOf(e) !== -1) {
                return elemPath;
            }

            const res = detectCyclesGo(e, stack, elemPath);
            if (res) {
                return res;
            }
        }
    } else {
        for (const key of Object.keys(x)) {
            const val = x[key];
            const valPath = path + (/^[_$a-z][_$a-z0-9]*$/i.test(key)
                    ? '.' + key
                    : '[' + JSON.stringify(+key || key) + ']');

            if (stack.indexOf(val) !== -1) {
                return valPath;
            }

            const res = detectCyclesGo(val, stack, valPath);
            if (res) {
                return res;
            }
        }
    }
    stack.pop();

    return undefined;
}

function detectCycles(x: any) {
    return detectCyclesGo(x, [], 'root');
}

function applyReplacer(x: any, replacer: (key: string|number, value: any) => any) {
    if (x == null || typeof x !== 'object') {
        return x;
    }

    if (Array.isArray(x)) {
        for (let i = 0; i < x.length; ++i) {
            x[i] = applyReplacer(replacer(i, x[i]), replacer);
        }
    } else {
        for (const key of Object.keys(x)) {
            x[key] = applyReplacer(replacer(key, x[key]), replacer);
        }
    }

    return x;
}
