import Joi from 'joi';

export const create = {
  body: Joi.object().keys({
    // file: Joi.object().required(),
  }),
};
