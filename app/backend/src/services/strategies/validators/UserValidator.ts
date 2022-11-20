import * as Joi from 'joi';
import { IUserLogin, IUserRegister } from '../../../database/models/User';
import generateValidatorFunction from './helpers/generateValidatorFunction';
import IValidatorFunction from './types/IValidatorFunction';

const REQUIRED_MSG = 'Todos os campos precisam ser preenchidos.';
const USERNAME_LENGTH_MSG =
  'O nome de usuário precisa ter no mínimo 3 caracteres.';
const PASSWORD_PATTERN_MSG =
  'A senha precisa ter pelo menos 8 caracteres, um número e uma letra maiúscula.';

class UserValidator {
  static login = generateValidatorFunction(
    Joi.object({
      username: Joi.string().required().messages({
        'string.empty': REQUIRED_MSG,
        'string.base': REQUIRED_MSG,
        'any.required': REQUIRED_MSG,
      }),
      password: Joi.string().required().messages({
        'string.empty': REQUIRED_MSG,
        'string.base': REQUIRED_MSG,
        'any.required': REQUIRED_MSG,
      }),
    }).messages({
      'object.unknown':
        'O corpo da requisição contém campos que não são permitidos.',
    })
  ) as IValidatorFunction<IUserLogin>;

  static register = generateValidatorFunction(
    Joi.object({
      username: Joi.string().min(3).required().messages({
        'any.required': REQUIRED_MSG,
        'string.empty': REQUIRED_MSG,
        'string.base': REQUIRED_MSG,
        'string.min': USERNAME_LENGTH_MSG,
      }),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[A-Z]).{8,}$/)
        .required()
        .messages({
          'any.required': REQUIRED_MSG,
          'string.empty': REQUIRED_MSG,
          'string.base': REQUIRED_MSG,
          'string.pattern.base': PASSWORD_PATTERN_MSG,
        }),
    }).messages({
      'object.unknown':
        'O corpo da requisição contém campos que não são permitidos.',
    })
  ) as IValidatorFunction<IUserRegister>;
}

export default UserValidator;
