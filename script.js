
// =====================================
// ModCalc - Modular Arithmetic Engine
// =====================================

// Get HTML elements
const operationInput = document.getElementById("operation");
const dividendInput = document.getElementById("dividend");
const secondNumberInput = document.getElementById("secondNumber");
const secondNumberGroup = document.getElementById("secondNumberGroup");
const modulusInput = document.getElementById("modulus");
const calculateBtn = document.getElementById("calculateBtn");

const resultSection = document.getElementById("resultSection");
const resultDisplay = document.getElementById("result");
const stepsDisplay = document.getElementById("steps");
const quotientDisplay = document.getElementById("quotient");
const errorMessage = document.getElementById("errorMessage");


// =====================================
// Mathematical Modulo Function
// =====================================

function calculateModulo(a, n) {
    let remainder = a % n;

    // Ensure non-negative remainder
    remainder = (remainder + n) % n;

    // Calculate floor quotient
    const quotient = (a - remainder) / n;

    return {
        remainder,
        quotient
    };
}


// =====================================
// Extended Euclidean Algorithm
// =====================================

function extendedGCD(a, b) {
    if (b === 0n) {
        return {
            gcd: a,
            x: 1n,
            y: 0n
        };
    }

    const result = extendedGCD(b, a % b);

    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x - (a / b) * result.y
    };
}



// =====================================
// Extended Euclidean Algorithm
// =====================================

function extendedGCD(a, b) {
    if (b === 0n) {
        return {
            gcd: a,
            x: 1n,
            y: 0n
        };
    }

    const result = extendedGCD(b, a % b);

    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x - (a / b) * result.y
    };
}



// =====================================
// Update Interface Based on Operation
// =====================================

function updateInterface() {
    const operation = operationInput.value;

    // Second number is not needed for basic modulo
    secondNumberGroup.hidden = operation === "modulo";

    // Update button text
    const buttonLabels = {
        modulo: "Calculate Modulo",
        addition: "Calculate Addition",
        subtraction: "Calculate Subtraction",
        multiplication: "Calculate Multiplication",
        exponentiation: "Calculate Exponentiation",
        inverse: "Calculate Modular Inverse"
    };

    calculateBtn.textContent = buttonLabels[operation];

    // Clear previous results
    resultSection.hidden = true;
    errorMessage.textContent = "";
}


// =====================================
// Main Calculator
// =====================================

function calculate() {

    const operation = operationInput.value;

    const aValue = dividendInput.value.trim();
    const bValue = secondNumberInput.value.trim();
    const nValue = modulusInput.value.trim();

    // Clear previous messages
    errorMessage.textContent = "";
    resultSection.hidden = true;

    // Validate first number and modulus
    if (aValue === "" || nValue === "") {
        errorMessage.textContent = "Please enter the first number and modulus.";
        return;
    }

    // Validate integer format
    const integerPattern = /^[+-]?\d+$/;

    if (!integerPattern.test(aValue) || !integerPattern.test(nValue)) {
        errorMessage.textContent = "Please enter valid integers only.";
        return;
    }

    // Validate second number when required
    if (operation !== "modulo" && !integerPattern.test(bValue)) {
        errorMessage.textContent = "Please enter a valid second integer.";
        return;
    }

    // Convert to BigInt
    const a = BigInt(aValue);
    const n = BigInt(nValue);

    const b = operation !== "modulo"
        ? BigInt(bValue)
        : null;

    // Modulus must be positive
    if (n <= 0n) {
        errorMessage.textContent = "Modulus must be greater than zero.";
        return;
    }

    // Perform selected operation
    let expression;
    let value;

    switch (operation) {

        case "modulo":
            expression = a;
            value = a;
            break;

        case "addition":
            expression = a + b;
            value = expression;
            break;

        case "subtraction":
            expression = a - b;
            value = expression;
            break;

        case "exponentiation":
            if (b < 0n) {
                errorMessage.textContent = "Exponent must be a non-negative integer.";
                return;
            }

            expression = a ** b;
            value = expression;
            break;

        case "inverse": {
            const result = extendedGCD(a, n);

            if (result.gcd !== 1n) {
                errorMessage.textContent =
                    "Modular inverse does not exist. The number and modulus must be coprime.";
                return;
            }

            expression = a;
            value = (result.x % n + n) % n;
            break;
        }

        default:
            errorMessage.textContent = "Please select a valid operation.";
            return;
    }

    // Calculate modulo
    const answer = calculateModulo(value, n);

    // Display result
    resultDisplay.textContent = answer.remainder.toString();

    // Display calculation details
    // =====================================
    // Generate Step-by-Step Explanation
    // =====================================

    const steps = [];

    if (operation === "modulo") {
        steps.push(`Start with: ${a} mod ${n}`);
    } else if (operation === "addition") {
        steps.push(`Add the numbers: ${a} + ${b} = ${expression}`);
    } else if (operation === "subtraction") {
        steps.push(`Subtract the numbers: ${a} - ${b} = ${expression}`);
    } else if (operation === "multiplication") {
        steps.push(`Multiply the numbers: ${a} × ${b} = ${expression}`);
    } else if (operation === "exponentiation") {
        steps.push(`Raise the base to the power: ${a}^${b} = ${expression}`);
    } else if (operation === "inverse") {
        const inverseResult = extendedGCD(a, n);

        steps.push(`Find the GCD of ${a} and ${n}: GCD = ${inverseResult.gcd}`);

        steps.push(`Since the GCD is 1, the modular inverse exists.`);

        steps.push(`The coefficient of ${a} is ${inverseResult.x}.`);

        steps.push(`Normalize the coefficient: ${a}⁻¹ mod ${n} = ${value}`);
    }

    if (operation !== "inverse") {
        steps.push(
            `Divide using the modulus: ${expression} = ${n} × ${answer.quotient} + ${answer.remainder}`
        );

        steps.push(
            `Take the non-negative remainder: ${expression} mod ${n} = ${answer.remainder}`
        );
    }

    // Display steps safely
    stepsDisplay.replaceChildren();

    steps.forEach((step, index) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${index + 1}. ${step}`;
        stepsDisplay.appendChild(paragraph);
    });

    // Display original operation
    let operationEquation;

    switch (operation) {
        case "modulo":
            operationEquation = `${a} mod ${n}`;
            break;

        case "addition":
            operationEquation = `(${a} + ${b}) mod ${n}`;
            break;

        case "subtraction":
            operationEquation = `(${a} - ${b}) mod ${n}`;
            break;

        case "multiplication":
            operationEquation = `(${a} × ${b}) mod ${n}`;
            break;
    }

    

    // Show resultS
    resultSection.hidden = false;
}


// =====================================
// Event Listeners
// =====================================

// Update interface when operation changes
operationInput.addEventListener("change", updateInterface);

// Calculate button
calculateBtn.addEventListener("click", calculate);

// Press Enter to calculate
[
    dividendInput,
    secondNumberInput,
    modulusInput
].forEach(input => {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            calculate();
        }
    });
});


// Initialize interface
updateInterface();
