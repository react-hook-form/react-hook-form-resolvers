import {
  appendErrors,
  transformToNestObject,
  Resolver,
  FieldValues,
} from 'react-hook-form';
import Joi from '@hapi/joi';
import convertArrayToPathName from './utils/convertArrayToPathName';

const parseErrorSchema = (
  error: Joi.ValidationError,
  validateAllFieldCriteria: boolean,
) =>
  Array.isArray(error.details)
    ? error.details.reduce(
        (previous: Record<string, any>, { path, message = '', type }) => {
          const currentPath = convertArrayToPathName(path);

          return {
            ...previous,
            ...(path
              ? previous[currentPath] && validateAllFieldCriteria
                ? {
                    [currentPath]: appendErrors(
                      currentPath,
                      validateAllFieldCriteria,
                      previous,
                      type,
                      message,
                    ),
                  }
                : {
                    [currentPath]: previous[currentPath] || {
                      message,
                      type,
                      ...(validateAllFieldCriteria
                        ? {
                            types: { [type]: message || true },
                          }
                        : {}),
                    },
                  }
              : {}),
          };
        },
        {},
      )
    : [];

export const joiResolver = <TFieldValues extends FieldValues>(
  schema: Joi.Schema,
  options: Joi.AsyncValidationOptions = {
    abortEarly: false,
  },
): Resolver<TFieldValues> => async (
  values,
  _,
  validateAllFieldCriteria = false,
) => {
  try {
    return {
      values: await schema.validateAsync(values, {
        ...options,
      }),
      errors: {},
    };
  } catch (e) {
    return {
      values: {},
      errors: transformToNestObject(
        parseErrorSchema(e, validateAllFieldCriteria),
      ),
    };
  }
};
