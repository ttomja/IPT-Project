function isPositiveNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0;
}

function isZeroOrPositiveNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : value;
}

module.exports = {
  isPositiveNumber,
  isZeroOrPositiveNumber,
  normalizeString,
};
