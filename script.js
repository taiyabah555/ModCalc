
// =====================================
// ModCalc - Modular Arithmetic Engine
// =====================================

// Get HTML elements
const dividendInput = document.getElementById("dividend");
const modulusInput = document.getElementById("modulus");
const calculateBtn = document.getElementById("calculateBtn");

const resultSection = document.getElementById("resultSection");
const resultDisplay = document.getElementById("result");
const quotientDisplay = document.getElementById("quotient");
const equationDisplay = document.getElementById("equation");
const errorMessage = document.getElementById("errorMessage");


// =====================================
// Mathematical Modulo Function
// =====================================

function calculateModulo(a, n) {

    // JavaScript BigInt modulo
    let remainder = a % n;

    // Ensure remainder is always non-negative
    remainder = (remainder + n) % n;

    // Calculate the corresponding floor quotient
    const quotient = (a - remainder) / n;

    return {
        remainder: remainder,
        quotient: quotient
    };
}


// =====================================
// Main Calculator
// =====================================

function calculate() {

    // Get input values
    const aValue = dividendInput.value.trim();
    const nValue = modulusInput.value.trim();

    // Clear previous messages
    errorMessage.textContent = "";
    resultSection.hidden = true;

    // Validate empty inputs
    if (aValue === "" || nValue === "") {
        errorMessage.textContent = "Please enter both numbers.";
        return;
    }

    // Validate integer format
    const integerPattern = /^[+-]?\d+$/;

    if (!integerPattern.test(aValue) || !integerPattern.test(nValue)) {
        errorMessage.textContent = "Please enter valid integers only.";
        return;
    }

    // Convert to BigInt
    const a = BigInt(aValue);
    const n = BigInt(nValue);

    // Modulus must be positive
    if (n <= 0n) {
        errorMessage.textContent = "Modulus must be greater than zero.";
        return;
    }

    // Perform calculation
    const answer = calculateModulo(a, n);

    // Display remainder
    resultDisplay.textContent = answer.remainder.toString();

    // Display quotient
    quotientDisplay.textContent =
        `Quotient = ${answer.quotient}`;

    // Display mathematical equation
    equationDisplay.textContent =
        `${a} = ${n} × ${answer.quotient} + ${answer.remainder}`;

    // Show result section
    resultSection.hidden = false;
}


// =====================================
// Event Listeners
// =====================================

// Calculate button
calculateBtn.addEventListener("click", calculate);

// Press Enter to calculate
[dividendInput, modulusInput].forEach(input => {
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            calculate();
        }
    });
});
