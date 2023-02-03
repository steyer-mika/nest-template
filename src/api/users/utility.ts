import * as bcrypt from 'bcrypt';

import config from '@/config';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = config().auth.salt;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};
