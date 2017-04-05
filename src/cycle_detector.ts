
export { detectCycles, replaceCycles, applyReplacer }

function go(x: any, stack: any[], path: string, replacer?: (path: string) => string): string|undefined {
    if (x == null || typeof x !== 'object') {
        return undefined;
    }

    stack.push(x);
    if (Array.isArray(x)) {
        for (let i = 0; i < x.length; ++i) {
            const e = x[i];
            const elemPath = path + '[' + i + ']';

            if (stack.indexOf(e) !== -1) {
                if (!replacer) {
                    return elemPath;
                }

                x[i] = replacer(elemPath);
                continue;
            }

            const res = go(e, stack, elemPath, replacer);
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
                if (!replacer) {
                    return valPath;
                }

                x[key] = replacer(valPath);
                continue;
            }

            const res = go(val, stack, valPath, replacer);
            if (res) {
                return res;
            }
        }
    }
    stack.pop();

    return undefined;
}

function detectCycles(x: any) {
    return go(x, [], 'root');
}

function replaceCycles(x: any, replacer: (path: string) => string) {
    return (go(x, [], 'root', replacer), x);
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
