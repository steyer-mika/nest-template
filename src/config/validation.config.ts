import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common';

const validationConfig: ValidationPipeOptions = {
  whitelist: true,
  exceptionFactory: (errors) => {
    const errorDictionary: { [key: string]: string[] } = {};

    errors.forEach((x) => {
      errorDictionary[x.property] = Object.values(x.constraints);
    });

    throw new UnprocessableEntityException(errorDictionary);
  },
};

export default validationConfig;
