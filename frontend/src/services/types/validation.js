export class DataValidationRule {
    constructor(name, description, validator, errorMessage) {
        this.name = name;
        this.description = description;
        this.validator = validator;
        this.errorMessage = errorMessage;
    }
    async validate(data) {
        const isValid = await this.validator(data);
        if (!isValid) {
            throw new Error(this.errorMessage);
        }
    }
}
export class RangeValidationRule extends DataValidationRule {
    constructor(field, min, max, errorMessage) {
        super(`range_${field}`, `Validates that ${field} is between ${min} and ${max}`, async (data) => {
            const value = data[field];
            return value >= min && value <= max;
        }, errorMessage || `${field} must be between ${min} and ${max}`);
    }
}
export class RequiredFieldValidationRule extends DataValidationRule {
    constructor(field, errorMessage) {
        super(`required_${field}`, `Validates that ${field} is present and not null/undefined`, async (data) => {
            return data[field] != null;
        }, errorMessage || `${field} is required`);
    }
}
export class TypeValidationRule extends DataValidationRule {
    constructor(field, type, errorMessage) {
        super(`type_${field}`, `Validates that ${field} is of type ${type}`, async (data) => {
            return typeof data[field] === type;
        }, errorMessage || `${field} must be of type ${type}`);
    }
}
export class ArrayValidationRule extends DataValidationRule {
    constructor(field, minLength, maxLength, errorMessage) {
        super(`array_${field}`, `Validates that ${field} is an array with length between ${minLength} and ${maxLength}`, async (data) => {
            const value = data[field];
            return Array.isArray(value) && value.length >= minLength && value.length <= maxLength;
        }, errorMessage || `${field} must be an array with length between ${minLength} and ${maxLength}`);
    }
}
export class DateValidationRule extends DataValidationRule {
    constructor(field, minDate, maxDate, errorMessage) {
        super(`date_${field}`, `Validates that ${field} is a valid date${minDate ? ` after ${minDate}` : ''}${maxDate ? ` before ${maxDate}` : ''}`, async (data) => {
            const value = new Date(data[field]);
            if (isNaN(value.getTime()))
                return false;
            if (minDate && value < minDate)
                return false;
            if (maxDate && value > maxDate)
                return false;
            return true;
        }, errorMessage ||
            `${field} must be a valid date${minDate ? ` after ${minDate}` : ''}${maxDate ? ` before ${maxDate}` : ''}`);
    }
}
export class EnumValidationRule extends DataValidationRule {
    constructor(field, allowedValues, errorMessage) {
        super(`enum_${field}`, `Validates that ${field} is one of the allowed values: ${allowedValues.join(', ')}`, async (data) => {
            return allowedValues.includes(data[field]);
        }, errorMessage || `${field} must be one of: ${allowedValues.join(', ')}`);
    }
}
export class PatternValidationRule extends DataValidationRule {
    constructor(field, pattern, errorMessage) {
        super(`pattern_${field}`, `Validates that ${field} matches the pattern ${pattern}`, async (data) => {
            return pattern.test(data[field]);
        }, errorMessage || `${field} must match the pattern ${pattern}`);
    }
}
export class CustomValidationRule extends DataValidationRule {
    constructor(name, description, validator, errorMessage) {
        super(name, description, validator, errorMessage);
    }
}
