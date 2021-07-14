<div align="center">
    <p align="center">
        <a href="https://react-hook-form.com" title="React Hook Form - Simple React forms validation">
            <img src="https://raw.githubusercontent.com/bluebill1049/react-hook-form/master/docs/logo.png" alt="React Hook Form Logo - React hook custom hook for form validation" />
        </a>
    </p>
</div>

<p align="center">Performant, flexible and extensible forms with easy to use validation.</p>

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/@hookform/resolvers.svg?style=for-the-badge)](https://www.npmjs.com/package/@hookform/resolvers)
[![npm](https://img.shields.io/npm/dt/@hookform/resolvers.svg?style=for-the-badge)](https://www.npmjs.com/package/@hookform/resolvers)
[![npm](https://img.shields.io/bundlephobia/minzip/@hookform/resolvers?style=for-the-badge)](https://bundlephobia.com/result?p=@hookform/resolvers)

</div>

## Install

    $ npm install @hookform/resolvers

## Links

- [React-hook-form validation resolver documentation ](https://react-hook-form.com/api/useform/#validationResolver)

## API

`resolver(schema: object, schemaOptions?: object, resolverOptions: { mode: 'async' | 'sync' })`

|                 | type     | Required | Description                                   |
| --------------- | -------- | -------- | --------------------------------------------- |
| schema          | `object` | ✓        | validation schema                             |
| schemaOptions   | `object` |          | validation library schema options             |
| resolverOptions | `object` |          | resolver options, `async` is the default mode |

## Quickstart

### [Yup](https://github.com/jquense/yup)

Dead simple Object schema validation.

[![npm](https://img.shields.io/bundlephobia/minzip/yup?style=for-the-badge)](https://bundlephobia.com/result?p=yup)

```typescript jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required(),
});

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      <input type="number" {...register('age')} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Zod](https://github.com/vriad/zod)

TypeScript-first schema validation with static type inference

[![npm](https://img.shields.io/bundlephobia/minzip/zod?style=for-the-badge)](https://bundlephobia.com/result?p=zod)

> ⚠️ Example below uses the `valueAsNumber`, which requires `react-hook-form` v6.12.0 (released Nov 28, 2020) or later.

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().nonempty({ message: 'Required' }),
  age: z.number().min(10),
});

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      {errors.name?.message && <p>{errors.name?.message}</p>}
      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age?.message && <p>{errors.age?.message}</p>}
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Superstruct](https://github.com/ianstormtaylor/superstruct)

A simple and composable way to validate data in JavaScript (or TypeScript).

[![npm](https://img.shields.io/bundlephobia/minzip/superstruct?style=for-the-badge)](https://bundlephobia.com/result?p=superstruct)

```typescript jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { object, string, number } from 'superstruct';

const schema = object({
  name: string(),
  age: number(),
});

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: superstructResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      <input type="number" {...register('age', { valueAsNumber: true })} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Joi](https://github.com/sideway/joi)

The most powerful data validation library for JS.

[![npm](https://img.shields.io/bundlephobia/minzip/joi?style=for-the-badge)](https://bundlephobia.com/result?p=joi)

```typescript jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const schema = Joi.object({
  username: Joi.string().required(),
});

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: joiResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      <input type="number" {...register('age')} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Vest](https://github.com/ealush/vest)

Vest 🦺 Declarative Validation Testing.

[![npm](https://img.shields.io/bundlephobia/minzip/vest?style=for-the-badge)](https://bundlephobia.com/result?p=vest)

```typescript jsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { vestResolver } from '@hookform/resolvers/vest';
import vest, { test, enforce } from 'vest';

const validationSuite = vest.create((data = {}) => {
  test('username', 'Username is required', () => {
    enforce(data.username).isNotEmpty();
  });

  test('username', 'Must be longer than 3 chars', () => {
    enforce(data.username).longerThan(3);
  });

  test('password', 'Password is required', () => {
    enforce(data.password).isNotEmpty();
  });

  test('password', 'Password must be at least 5 chars', () => {
    enforce(data.password).longerThanOrEquals(5);
  });

  test('password', 'Password must contain a digit', () => {
    enforce(data.password).matches(/[0-9]/);
  });

  test('password', 'Password must contain a symbol', () => {
    enforce(data.password).matches(/[^A-Za-z0-9]/);
  });
});

const App = () => {
  const { register, handleSubmit, errors } = useForm({
    resolver: vestResolver(validationSuite),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('username')} />
      <input type="password" {...register('password')} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Class Validator](https://github.com/typestack/class-validator)

Decorator-based property validation for classes.

[![npm](https://img.shields.io/bundlephobia/minzip/class-validator?style=for-the-badge)](https://bundlephobia.com/result?p=class-validator)

> ⚠️ Remember to add these options to your `tsconfig.json`!

```
"strictPropertyInitialization": false,
"experimentalDecorators": true
```

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { Length, Min, IsEmail } from 'class-validator';

class User {
  @Length(2, 30)
  username: string;

  @Min(18)
  age: number;

  @IsEmail()
  email: string;
}

const resolver = classValidatorResolver(User);

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({ resolver });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input type="text" {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}

      <input type="text" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age && <span>{errors.age.message}</span>}

      <input type="submit" value="Submit" />
    </form>
  );
};

export default App;
```

### [io-ts](https://github.com/gcanti/io-ts)

Validate your data with powerful decoders.

[![npm](https://img.shields.io/bundlephobia/minzip/io-ts?style=for-the-badge)](https://bundlephobia.com/result?p=io-ts)

```typescript jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { ioTsResolver } from '@hookform/resolvers/io-ts';
import t from 'io-ts';
// you don't have to use io-ts-types but it's very useful
import tt from 'io-ts-types';

const schema = t.type({
  username: t.string,
  age: tt.NumberFromString,
});

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: ioTsResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('username')} />
      <input type="number" {...register('age')} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [Nope](https://github.com/bvego/nope-validator)

A small, simple, and fast JS validator

[![npm](https://img.shields.io/bundlephobia/minzip/nope-validator?style=for-the-badge)](https://bundlephobia.com/result?p=nope-validator)

```typescript jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { nopeResolver } from '@hookform/resolvers/nope';
import Nope from 'nope-validator';

const schema = Nope.object().shape({
  name: Nope.string().required(),
  age: Nope.number().required(),
});

const App = () => {
  const { register, handleSubmit } = useForm({
    resolver: nopeResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      <input type="number" {...register('age')} />
      <input type="submit" />
    </form>
  );
};

export default App;
```

### [computed-types](https://github.com/neuledge/computed-types)

TypeScript-first schema validation with static type inference

[![npm](https://img.shields.io/bundlephobia/minzip/computed-types?style=for-the-badge)](https://bundlephobia.com/result?p=computed-types)

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { computedTypesResolver } from '@hookform/resolvers/computed-types';
import Schema, { number, string } from 'computed-types';

const schema = Schema({
  username: string.min(1).error('username field is required'),
  password: string.min(1).error('password field is required'),
  password: number,
});

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: computedTypesResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input {...register('name')} />
      {errors.name?.message && <p>{errors.name?.message}</p>}
      <input type="number" {...register('age', { valueAsNumber: true })} />
      {errors.age?.message && <p>{errors.age?.message}</p>}
      <input type="submit" />
    </form>
  );
};

export default App;
```

## Backers

Thanks goes to all our backers! [[Become a backer](https://opencollective.com/react-hook-form#backer)].

<a href="https://opencollective.com/react-hook-form#backers">
    <img src="https://opencollective.com/react-hook-form/backers.svg?width=950" />
</a>

## Organizations

Thanks goes to these wonderful organizations! [[Contribute](https://opencollective.com/react-hook-form/contribute)].

<a href="https://github.com/react-hook-form/react-hook-form/graphs/contributors">
    <img src="https://opencollective.com/react-hook-form/organizations.svg?width=950" />
</a>

## Contributors

Thanks goes to these wonderful people! [[Become a contributor](CONTRIBUTING.md)].

<a href="https://github.com/react-hook-form/react-hook-form/graphs/contributors">
    <img src="https://opencollective.com/react-hook-form/contributors.svg?width=950" />
</a>
