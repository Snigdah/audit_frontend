export interface PasswordPolicyRequest {
  minLength: number;
  minUppercase: number;
  minLowercase: number;
  minDigit: number;
  minSpecialChar: number;
  passwordChangeIntervalDays: number;
  passwordReuseLimit: number;
  requireAlphanumeric: boolean;
  requireSpecialChar: boolean;
  requireUniqueEmail: boolean;
  allowConcurrentLogin: boolean;
  enableTwoFactor: boolean;
  allowUsernameInPassword: boolean;
}

export class PasswordPolicyModel implements PasswordPolicyRequest {
  minLength: number;
  minUppercase: number;
  minLowercase: number;
  minDigit: number;
  minSpecialChar: number;
  passwordChangeIntervalDays: number;
  passwordReuseLimit: number;
  requireAlphanumeric: boolean;
  requireSpecialChar: boolean;
  requireUniqueEmail: boolean;
  allowConcurrentLogin: boolean;
  enableTwoFactor: boolean;
  allowUsernameInPassword: boolean;

  constructor(data: PasswordPolicyRequest) {
    this.minLength = data.minLength;
    this.minUppercase = data.minUppercase;
    this.minLowercase = data.minLowercase;
    this.minDigit = data.minDigit;
    this.minSpecialChar = data.minSpecialChar;
    this.passwordChangeIntervalDays = data.passwordChangeIntervalDays;
    this.passwordReuseLimit = data.passwordReuseLimit;
    this.requireAlphanumeric = data.requireAlphanumeric;
    this.requireSpecialChar = data.requireSpecialChar;
    this.requireUniqueEmail = data.requireUniqueEmail;
    this.allowConcurrentLogin = data.allowConcurrentLogin;
    this.enableTwoFactor = data.enableTwoFactor;
    this.allowUsernameInPassword = data.allowUsernameInPassword;
  }

  // Optional: Add a method to get the request payload
  toRequest(): PasswordPolicyRequest {
    return {
      minLength: this.minLength,
      minUppercase: this.minUppercase,
      minLowercase: this.minLowercase,
      minDigit: this.minDigit,
      minSpecialChar: this.minSpecialChar,
      passwordChangeIntervalDays: this.passwordChangeIntervalDays,
      passwordReuseLimit: this.passwordReuseLimit,
      requireAlphanumeric: this.requireAlphanumeric,
      requireSpecialChar: this.requireSpecialChar,
      requireUniqueEmail: this.requireUniqueEmail,
      allowConcurrentLogin: this.allowConcurrentLogin,
      enableTwoFactor: this.enableTwoFactor,
      allowUsernameInPassword: this.allowUsernameInPassword,
    };
  }
}
