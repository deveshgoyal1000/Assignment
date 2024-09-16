const LagrangeInterpolation = (xValues, yValues) => {
    const n = xValues.length;

    const calculateLagrangeBasis = (x, j) => {
        let result = 1;
        for (let i = 0; i < n; i++) {
            if (i !== j) {
                result *= (x - xValues[i]) / (xValues[j] - xValues[i]);
            }
        }
        return result;
    };

    const findPolynomialValueAt = (x) => {
        let result = 0;
        for (let j = 0; j < n; j++) {
            result += yValues[j] * calculateLagrangeBasis(x, j);
        }
        return result;
    };

    return (x) => findPolynomialValueAt(x);
};

const decodeValue = (value, base) => parseInt(value, base);

const getRoots = (json) => {
    const { n, k } = json.keys;

    const xValues = [];
    const yValues = [];

    for (let i = 1; i <= n; i++) {
        if (json[i]) {
            const { base, value } = json[i];
            const decodedValue = decodeValue(value, parseInt(base, 10));
            xValues.push(i);
            yValues.push(decodedValue);
        }
    }

    if (xValues.length < k) {
        throw new Error('Not enough roots provided.');
    }

    return { xValues, yValues };
};

const findConstantTerm = (json) => {
    const { xValues, yValues } = getRoots(json);
    const interpolate = LagrangeInterpolation(xValues, yValues);
    return interpolate(0);
};

const jsonInput = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const constantTerm = findConstantTerm(jsonInput);
console.log("Constant Term:", constantTerm);
