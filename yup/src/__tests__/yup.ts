/* eslint-disable no-console, @typescript-eslint/ban-ts-comment */
import * as yup from 'yup';
import { yupResolver } from '..';

const schema = yup.object({
  username: yup.string().matches(/^\w+$/).min(3).max(30).required(),
  password: yup
    .string()
    .matches(/^[a-zA-Z0-9]{3,30}/)
    .required(),
  repeatPassword: yup.ref('password'),
  accessToken: yup.string(),
  birthYear: yup.number().min(1900).max(2013),
  email: yup.string().email(),
  tags: yup.array(yup.string()),
  enabled: yup.boolean(),
});

describe('yupResolver', () => {
  it('should return values from yupResolver when validation pass', async () => {
    const data: yup.InferType<typeof schema> = {
      username: 'Doe',
      password: 'Password123',
      repeatPassword: 'Password123',
      birthYear: 2000,
      email: 'john@doe.com',
      tags: ['tag1', 'tag2'],
      enabled: true,
      accessToken: 'accessToken',
    };

    const schemaSpy = jest.spyOn(schema, 'validate');
    const schemaSyncSpy = jest.spyOn(schema, 'validateSync');

    const result = await yupResolver(schema)(data);

    expect(schemaSpy).toHaveBeenCalledTimes(1);
    expect(schemaSyncSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ errors: {}, values: data });
  });

  it('should return values from yupResolver with `mode: sync` when validation pass', async () => {
    const data: yup.InferType<typeof schema> = {
      username: 'Doe',
      password: 'Password123',
      repeatPassword: 'Password123',
      birthYear: 2000,
      email: 'john@doe.com',
      tags: ['tag1', 'tag2'],
      enabled: true,
      accessToken: 'accessToken',
    };

    const schemaSpy = jest.spyOn(schema, 'validateSync');
    const schemaAsyncSpy = jest.spyOn(schema, 'validate');

    const result = await yupResolver(schema, undefined, { mode: 'sync' })(data);

    expect(schemaSpy).toHaveBeenCalledTimes(1);
    expect(schemaAsyncSpy).not.toHaveBeenCalled();
    expect(result).toEqual({ errors: {}, values: data });
  });

  it('should return a single error from yupResolver when validation fails', async () => {
    const data = {
      password: '___',
      email: '',
      birthYear: 'birthYear',
    };

    const result = await yupResolver(schema)(data);

    expect(result).toMatchSnapshot();
  });

  it('should return a single error from yupResolver with `mode: sync` when validation fails', async () => {
    const data = {
      password: '___',
      email: '',
      birthYear: 'birthYear',
    };

    const schemaSpy = jest.spyOn(schema, 'validateSync');
    const schemaAsyncSpy = jest.spyOn(schema, 'validate');

    const result = await yupResolver(schema, undefined, { mode: 'sync' })(data);

    expect(schemaSpy).toHaveBeenCalledTimes(1);
    expect(schemaAsyncSpy).not.toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it('should return all the errors from yupResolver when validation fails with `validateAllFieldCriteria` set to true', async () => {
    const data = {
      password: '___',
      email: '',
      birthYear: 'birthYear',
    };

    const result = await yupResolver(schema)(data, undefined, true);

    expect(result).toMatchSnapshot();
  });

  it('should return an error from yupResolver when validation fails and pass down the yup context', async () => {
    const data = { name: 'eric' };
    const context = { min: true };
    const schemaWithContext = yup.object({
      name: yup
        .string()
        .required()
        .when('$min', (min: boolean, schema: yup.StringSchema) => {
          return min ? schema.min(6) : schema;
        }),
    });

    const schemaSpyValidate = jest.spyOn(schemaWithContext, 'validate');

    const result = await yupResolver(schemaWithContext)(data, context);
    expect(schemaSpyValidate).toHaveBeenCalledTimes(1);
    expect(schemaSpyValidate).toHaveBeenCalledWith(
      data,
      expect.objectContaining({
        abortEarly: false,
        context,
      }),
    );
    expect(result).toMatchSnapshot();
  });

  it('should return an error result if inner yup validation error has no path', async () => {
    const yupSchema = yup.object({
      name: yup.string().required(),
    });

    jest.spyOn(yupSchema, 'validate').mockRejectedValueOnce({
      inner: [{ message: 'error1', type: 'required' }],
    });

    const result = await yupResolver(yupSchema)({ name: '' });
    expect(result).toMatchSnapshot();
  });

  it('should show a warning log if yup context is used instead only on dev environment', async () => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn);
    process.env.NODE_ENV = 'development';

    await yupResolver(yup.object(), { context: { noContext: true } })({});
    expect(console.warn).toHaveBeenCalledWith(
      "You should not used the yup options context. Please, use the 'useForm' context object instead",
    );
    process.env.NODE_ENV = 'test';
  });

  it('should not show a warning log if yup context is used instead only on production environment', async () => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn);
    process.env.NODE_ENV = 'production';

    await yupResolver(yup.object(), { context: { noContext: true } })({});
    expect(console.warn).not.toHaveBeenCalled();
    process.env.NODE_ENV = 'test';
  });

  it('should return correct error message with using yup.test', async () => {
    const result = await yupResolver(
      yup
        .object({
          name: yup.string(),
          email: yup.string(),
        })
        .test(
          'name',
          'Email or name are required',
          (value) => !!(value && (value.name || value.email)),
        ),
    )({ name: '', email: '' });

    expect(result).toMatchSnapshot();
  });
});