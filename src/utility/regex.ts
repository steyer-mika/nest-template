export const passwordRegex =
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

export const mongooseId = /^[0-9a-fA-F]{24}$/;

export const timeRegex = /^((0[0-9])|(1[0-9])|(2[0-4])):[0-5][0-9]$/;

export const dateRegex =
  /[0-9]{4}-((1[0-2])|(0[1-9]))-(([1-2][0-9])|(0[1-9])|(3[0-1]))/;
