export interface PasswordRule {
  label: string;
  test: (v: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Password must have 8 characters', test: (v) => v.length >= 8 },
  { label: 'Password must one upper case', test: (v) => /[A-Z]/.test(v) },
  { label: 'Password must one special character', test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];
