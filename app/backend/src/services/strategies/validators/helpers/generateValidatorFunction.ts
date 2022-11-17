import * as Joi from 'joi';
import IValidatorFunction from '../types/IValidatorFunction';

function generateValidatorFunction<Body>(
  schema: Joi.Schema
): IValidatorFunction<Body> {
  return (data: Body) => {
    const { error, value } = schema.validate(data);
    if (error) {
      error.message = error.details[0].message.replace(/[[\]0-9]{3}/, '');
      throw error;
    }
    return value as Body;
  };
}

export default generateValidatorFunction;
