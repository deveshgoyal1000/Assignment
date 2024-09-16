const decodeValue = (value, base) => {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let decodedValue = BigInt(0);
    const chars = value.toUpperCase().split('').reverse();

    for (let i = 0; i < chars.length; i++) {
        const digit = digits.indexOf(chars[i]);
        if (digit === -1 || digit >= base) {
            throw new Error(`Invalid character '${chars[i]}' for base ${base}`);
        }
        decodedValue += BigInt(digit) * BigInt(base ** i);
    }
    return decodedValue;
};

const lagrangeInterpolation = (xValues, yValues) => {
    const n = xValues.length;

    const calculateLagrangeBasis = (x, j) => {
        let result = BigInt(1);
        for (let i = 0; i < n; i++) {
            if (i !== j) {
                result *= BigInt(x - xValues[i]);
                result /= BigInt(xValues[j] - xValues[i]);
            }
        }
        return result;
    };

    const findPolynomialValueAt = (x) => {
        let result = BigInt(0);
        for (let j = 0; j < n; j++) {
            result += yValues[j] * calculateLagrangeBasis(x, j);
        }
        return result;
    };

    return (x) => findPolynomialValueAt(x);
};

const getRoots = (json) => {
    const keys = json.keys;
    const n = keys.n;
    const k = keys.k;

    const xValues = [];
    const yValues = [];

    for (let i = 1; i <= n; i++) {
        if (json[i]) {
            const { base, value } = json[i];
            try {
                const decodedValue = decodeValue(value, parseInt(base, 10));
                xValues.push(i);
                yValues.push(decodedValue);
            } catch (e) {
                throw new Error(`Error decoding value ${value} with base ${base}: ${e.message}`);
            }
        }
    }

    if (xValues.length < k) {
        throw new Error('Not enough roots provided.');
    }

    return { xValues, yValues };
};

const findConstantTerm = (json) => {
    const { xValues, yValues } = getRoots(json);
    const interpolate = lagrangeInterpolation(xValues, yValues);
    return interpolate(0).toString();
};

const jsonInput = {
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
};

const constantTerm = findConstantTerm(jsonInput);
console.log("The constant term c is:", constantTerm);
