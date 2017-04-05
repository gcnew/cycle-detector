"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function go(x, stack, path, replacer) {
    if (x == null || typeof x !== 'object') {
        return undefined;
    }
    stack.push(x);
    if (Array.isArray(x)) {
        for (var i = 0; i < x.length; ++i) {
            var e = x[i];
            var elemPath = path + '[' + i + ']';
            if (stack.indexOf(e) !== -1) {
                if (!replacer) {
                    return elemPath;
                }
                x[i] = replacer(elemPath);
                continue;
            }
            var res = go(e, stack, elemPath, replacer);
            if (res) {
                return res;
            }
        }
    }
    else {
        for (var _i = 0, _a = Object.keys(x); _i < _a.length; _i++) {
            var key = _a[_i];
            var val = x[key];
            var valPath = path + (/^[_$a-z][_$a-z0-9]*$/i.test(key)
                ? '.' + key
                : '[' + JSON.stringify(+key || key) + ']');
            if (stack.indexOf(val) !== -1) {
                if (!replacer) {
                    return valPath;
                }
                x[key] = replacer(valPath);
                continue;
            }
            var res = go(val, stack, valPath, replacer);
            if (res) {
                return res;
            }
        }
    }
    stack.pop();
    return undefined;
}
function detectCycles(x) {
    return go(x, [], 'root');
}
exports.detectCycles = detectCycles;
function replaceCycles(x, replacer) {
    return (go(x, [], 'root', replacer), x);
}
exports.replaceCycles = replaceCycles;
function applyReplacer(x, replacer) {
    if (x == null || typeof x !== 'object') {
        return x;
    }
    if (Array.isArray(x)) {
        for (var i = 0; i < x.length; ++i) {
            x[i] = applyReplacer(replacer(i, x[i]), replacer);
        }
    }
    else {
        for (var _i = 0, _a = Object.keys(x); _i < _a.length; _i++) {
            var key = _a[_i];
            x[key] = applyReplacer(replacer(key, x[key]), replacer);
        }
    }
    return x;
}
exports.applyReplacer = applyReplacer;
