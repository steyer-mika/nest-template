/**
 * Regular expression to validate a password.
 *
 * The password must meet the following criteria:
 * - At least one digit (`\d`)
 * - At least one lowercase letter (`[a-z]`)
 * - At least one uppercase letter (`[A-Z]`)
 * - At least one special character from the set (!@#$%&*())
 * - Minimum length of 8 characters
 */
export const passwordRegex =
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

/**
 * Regular expression to validate time in 24-hour format (HH:mm).
 *
 * The time must be:
 * - Hours: Between `00` and `24`
 * - Minutes: Between `00` and `59`
 */
export const timeRegex = /^((0[0-9])|(1[0-9])|(2[0-4])):[0-5][0-9]$/;

/**
 * Regular expression to validate a date in the format YYYY-MM-DD.
 *
 * The date must meet the following criteria:
 * - Year: Exactly 4 digits
 * - Month: Between `01` and `12`
 * - Day: Between `01` and `31` (valid day range per month not enforced)
 */
export const dateRegex =
  /[0-9]{4}-((1[0-2])|(0[1-9]))-(([1-2][0-9])|(0[1-9])|(3[0-1]))/;
