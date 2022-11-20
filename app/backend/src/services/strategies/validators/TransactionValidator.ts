import * as Joi from 'joi';
import { ITransactionRegister } from '../../../database/models/Transactions';
import generateValidatorFunction from './helpers/generateValidatorFunction';
import IValidatorFunction from './types/IValidatorFunction';

const REQUIRED_MSG = 'Todos os campos precisam ser preenchidos.';
const VALUE_MSG =
  'O valor da transação precisa ser um valor numérico positivo';

class TransactionValidator {
  static register = generateValidatorFunction(
    Joi.object({
      username: Joi.string().required().messages({
        'any.required': REQUIRED_MSG,
        'string.empty': REQUIRED_MSG,
        'string.base': REQUIRED_MSG,
      }),
      value: Joi.number().positive().required().messages({
        'any.required': REQUIRED_MSG,
        'number.base': VALUE_MSG,
        'number.positive': VALUE_MSG,
      }),
    }).messages({
      'object.unknown':
        'O corpo da requisição contém campos que não são permitidos.',
    })
  ) as IValidatorFunction<ITransactionRegister>;
}

export default TransactionValidator;
