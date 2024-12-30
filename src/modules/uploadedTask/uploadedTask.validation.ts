import Joi from 'joi';
import { objectId } from '../../validations';

// Constants
import { AVAILABLE_FORTATTERS } from './uploadedTask.constants';

export const createValidation = Joi.object({
  body: Joi.object().keys({
    formatter: Joi.number()
      .required()
      .valid(...Object.keys(AVAILABLE_FORTATTERS).map(Number)),
  }),
});

export const statusValidation = Joi.object({
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
});

export const formattedDataValidation = Joi.object({
  query: Joi.object().keys({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    row: Joi.number().optional(),
    column: Joi.number().optional(),
  }),

  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
});

export const dataErrorsValidation = Joi.object({
  query: Joi.object().keys({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    row: Joi.number().optional(),
    column: Joi.number().optional(),
  }),
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
});
