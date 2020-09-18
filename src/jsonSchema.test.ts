import { JSONSchema, jsonSchemaResolver } from './jsonSchema';

const schema: JSONSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '[a-zA-Z]',
      minLength: 3,
    },
    age: {
      type: 'integer',
      minimum: 0,
    },
    email: {
      type: 'string',
      format: 'email',
    },
    hobbies: {
      type: 'array',
      minItems: 1,
      items: {
        properties: {
          description: {
            type: 'string',
            minLength: 3,
          },
        },
        required: ['description'],
      },
    },
  },
  required: ['name', 'age', 'email', 'hobbies'],
};

describe('ajvResolver', () => {
  it('should get values when there is no error', async () => {
    const data = {
      name: 'jimmy',
      age: 24,
      email: 'jimmy@jimmy.com',
      hobbies: [
        {
          description: 'tennis',
        },
      ],
    };
    expect(await jsonSchemaResolver(schema)(data)).toEqual({
      values: data,
      errors: {},
    });
  });

  it('should get errors on invalid data', async () => {
    const data = {
      name: 'jimmy',
      age: '24',
      email: 'jimmy@jimmy.com',
      hobbies: [
        {
          description: 'tennis',
        },
        {
          description: 'ab',
        },
      ],
    };

    expect(
      await jsonSchemaResolver(schema, {})(data, undefined, true),
    ).toMatchSnapshot();
  });

  it('should throw when an invalid schema object is provided', async () => {
    expect(() => {
      jsonSchemaResolver(
        {
          ...schema,
          type: 'o' as any,
        },
        { ajvOptions: {} },
      );
    }).toThrowErrorMatchingSnapshot();
  });

  it('should throw when an invalid schema param is provided to ajv', async () => {
    expect(() => {
      jsonSchemaResolver(jsonSchemaResolver as any);
    }).toThrowErrorMatchingSnapshot();
  });
});
