const trimmedPassword = "ChocolateCake@2019";
const hasLetter = /[A-Za-z]/.test(trimmedPassword);
const hasNumber = /\d/.test(trimmedPassword);
const isLongEnough = trimmedPassword.length >= 8;
const isValid = hasLetter && hasNumber && isLongEnough;
console.log("hasLetter:", hasLetter);
console.log("hasNumber:", hasNumber);
console.log("isLongEnough:", isLongEnough);
console.log("isValid:", isValid);
