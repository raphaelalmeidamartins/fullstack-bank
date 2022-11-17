import * as Joi from 'joi';
import BadRequestError from '../../../../utils/errors/BadRequestError';
import IValidatorFunction from '../types/IValidatorFunction';

function generateValidatorFunction<Body>(
  schema: Joi.Schema
): IValidatorFunction<Body> {
  return (data: Body) => {
    const { error, value } = schema.validate(data);
    if (error) {
      const message = error.details[0].message.replace(/[[\]0-9]{3}/, '');
      throw new BadRequestError(message);
    }
    return value as Body;
  };
}

export default generateValidatorFunction;
