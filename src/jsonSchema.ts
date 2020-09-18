import Ajv from 'ajv';
import { appendErrors, Resolver, transformToNestObject } from 'react-hook-form';
import type { ErrorObject, Options, ValidateFunction } from 'ajv';
import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
import type {
  FieldError,
  FieldErrors,
  ResolverError,
  ResolverSuccess,
} from 'react-hook-form/dist/types/form';

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;

const parseErrorSchema = <TFieldValues extends Record<string, any>>(
  validationError: Array<ErrorObject> | null | undefined,
  validateAllFieldCriteria: boolean,
): FieldErrors<TFieldValues> =>
  Array.isArray(validationError)
    ? validationError.reduce(
        (
          previous: FieldErrors<TFieldValues>,
          { dataPath, keyword, message },
        ) => {
          const path = dataPath.replace(/^\./, '');
          return {
            ...previous,
            ...(path
              ? previous[path] && validateAllFieldCriteria
                ? {
                    [path]: appendErrors(
                      path,
                      validateAllFieldCriteria,
                      previous as Record<string, any>,
                      keyword,
                      message,
                    ),
                  }
                : {
                    [path]:
                      previous[path] ||
                      ({
                        type: keyword,
                        message,
                        ...(validateAllFieldCriteria
                          ? {
                              types: { [keyword]: message || true },
                            }
                          : {}),
                      } as FieldError),
                  }
              : {}),
          };
        },
        {},
      )
    : {};

export interface JsonSchemaOptions {
  ajvOptions?: Omit<
    Options,
    'allErrors' | 'async' | 'validateSchema' | 'transpile'
  >;
}

export const jsonSchemaResolver = <TFieldValues extends Record<string, any>>(
  validationSchema: JSONSchema,
  options: JsonSchemaOptions = {},
): Resolver<TFieldValues> => {
  if (!validationSchema || typeof validationSchema !== 'object') {
    throw new Error('Invalid AJV schema or validation function');
  }

  let allErrors = false;
  let validate: ValidateFunction | undefined;

  const getValidator = (
    validateAllFieldCriteria: boolean,
  ): ValidateFunction => {
    // compile only if necessary. otherwise return the memoized validation function
    if (!validate || allErrors !== validateAllFieldCriteria) {
      allErrors = validateAllFieldCriteria;
      validate = new Ajv({
        ...options.ajvOptions,
        async: false,
        allErrors,
        validateSchema: true,
        transpile: undefined,
      }).compile(validationSchema);
    }

    return validate;
  };

  // compile the validator right away so there is an exception if the schema is invalid
  getValidator(allErrors);

  return async (data, _, validateAllFieldCriteria = allErrors) => {
    const validate = getValidator(validateAllFieldCriteria);
    const valid = validate(data) as boolean;
    const errors = validate.errors;

    return valid
      ? ({
          values: data,
          errors: {},
        } as ResolverSuccess<TFieldValues>)
      : ({
          values: {},
          errors: transformToNestObject(
            parseErrorSchema<TFieldValues>(errors, validateAllFieldCriteria),
          ),
        } as ResolverError<TFieldValues>);
  };
};
