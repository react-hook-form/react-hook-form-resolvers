import * as Ajv from 'ajv';
import { ajvResolver } from './ajv';

const schema = {
  $async: true,
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
  describe('using Ajv.compile', () => {
    let validate: any;

    beforeEach(() => {
      validate = new Ajv({ allErrors: true, coerceTypes: true }).compile(
        schema,
      );
    });

    it('should get values', async () => {
      const data = {
        name: 'jimmy',
        age: '24',
        email: 'jimmy@jimmy.com',
        hobbies: ['tennis'],
      };

      expect(await ajvResolver(validate)(data)).toEqual({
        errors: {},
        values: data,
      });
    });

    it('should get errors for array fields', async () => {
      const data = {
        name: 'jimmy',
        age: 24,
        email: 'jimmy@jimmy.com',
        hobbies: [
          {
            description: '',
          },
        ],
      };
      expect(await ajvResolver(validate)(data)).toMatchSnapshot();
    });

    it('should get errors for top level properties', async () => {
      const data = {
        name: 24,
        age: 'jimmy',
        email: 'jimmyjimmy.com',
        hobbies: [
          {
            description: 'Tennis',
          },
        ],
      };

      expect(await ajvResolver(validate)(data)).toMatchSnapshot();
    });

    it('should return empty object when validate pass', async () => {
      expect(
        await ajvResolver({
          validate: () => new Promise((resolve) => resolve()) as any,
        })({}),
      ).toEqual({ errors: {}, values: {} });
    });
  });

  describe('using Ajv.validate', () => {
    let validate: any;

    beforeEach(() => {
      const ajv = new Ajv({ allErrors: true, coerceTypes: true });
      validate = (data: any) => ajv.validate(schema, data);
    });

    it('should get values', async () => {
      const data = {
        name: 'jimmy',
        age: '24',
        email: 'jimmy@jimmy.com',
        hobbies: ['tennis'],
      };

      expect(await ajvResolver(validate)(data)).toEqual({
        errors: {},
        values: data,
      });
    });

    it('should get errors for array fields', async () => {
      const data = {
        name: 'jimmy',
        age: 24,
        email: 'jimmy@jimmy.com',
        hobbies: [
          {
            description: '',
          },
        ],
      };
      expect(await ajvResolver(validate)(data)).toMatchSnapshot();
    });

    it('should get errors for top level properties', async () => {
      const data = {
        name: 24,
        age: 'jimmy',
        email: 'jimmyjimmy.com',
        hobbies: [
          {
            description: 'Tennis',
          },
        ],
      };

      expect(await ajvResolver(validate)(data)).toMatchSnapshot();
    });

    it('should return empty object when validate pass', async () => {
      expect(
        await ajvResolver({
          validate: () => new Promise((resolve) => resolve()) as any,
        })({}),
      ).toEqual({ errors: {}, values: {} });
    });
  });
});
