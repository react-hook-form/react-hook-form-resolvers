import { appendErrors } from 'react-hook-form';
import { ValidationError, ValidateFunction } from 'ajv';

type FieldValues = Record<string, any>;

const parseErrorSchema = (
  validationError: ValidationError,
  validateAllFieldCriteria: boolean,
) =>
  Array.isArray(validationError.errors)
    ? validationError.errors.reduce(
        (
          previous: FieldValues,
          { dataPath, message = '', params, propertyName = '' },
        ) => {
          const path =
            dataPath.replace(/\//g, '.').replace(/^\./, '') || propertyName;
          return {
            ...previous,
            ...(path
              ? previous[path] && validateAllFieldCriteria
                ? {
                    [path]: appendErrors(
                      path,
                      validateAllFieldCriteria,
                      previous,
                      '',
                      message,
                    ),
                  }
                : {
                    [path]: previous[path] || {
                      message,
                      params,
                      ...(validateAllFieldCriteria
                        ? {
                            types: {
                              ['']: message || true,
                            },
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

interface schema {
  validate: ValidateFunction;
}

export const ajvResolver = (validationSchema: schema | ValidateFunction) => {
  const validate =
    typeof (validationSchema as schema)?.validate === 'function'
      ? (validationSchema as schema).validate
      : typeof validationSchema === 'function'
      ? validationSchema
      : undefined;

  if (!validate) {
    throw new Error('Invalid AJV validate function');
  }

  return async (data: any, _: any = {}, validateAllFieldCriteria = false) => {
    try {
      await validate(data);
      return { values: data, errors: {} };
    } catch (e) {
      return {
        values: {},
        errors: parseErrorSchema(e, validateAllFieldCriteria),
      };
    }
  };
};
