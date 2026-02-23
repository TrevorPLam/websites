# zod-documentation.md


## Overview

Zod is a TypeScript-first validation library that provides schema definition with static type inference. It enables you to define schemas that can validate data, from simple strings to complex nested objects, while maintaining type safety throughout your application.

## Key Features

### Core Capabilities

- **TypeScript-first**: Full static type inference from schemas
- **Zero dependencies**: 2kb core bundle (gzipped)
- **Immutable API**: Methods return new instances
- **Runtime validation**: Parse and validate untrusted data
- **Error handling**: Comprehensive error reporting with ZodError
- **Async support**: Async refinements and transforms

### Advanced Features

- **Custom refinements**: Add custom validation logic
- **Transforms**: Convert data during validation
- **JSON Schema**: Built-in JSON Schema conversion
- **Recursive schemas**: Support for circular references
- **Discriminated unions**: Type-safe union handling

## Installation

### npm Installation

```bash
npm install zod
```

### JSR Installation

```bash
npx jsr add @zod/zod
```

### Requirements

Zod is tested against TypeScript v5.5 and later. Older versions may work but are not officially supported. You must enable strict mode in your `tsconfig.json` for best results.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Basic Usage

### Defining a Schema

```typescript
import * as z from 'zod';

const User = z.object({
  username: z.string(),
  email: z.string().email(),
  age: z.number().positive(),
  isActive: z.boolean().default(true),
});
```

### Parsing Data

```typescript
// Parse and validate data
const userData = {
  username: 'john_doe',
  email: 'john@example.com',
  age: 25,
  isActive: true,
};

const user = User.parse(userData);
// => { username: string; email: string; age: number; isActive: boolean }
```

### Safe Parsing

```typescript
// Safe parsing without throwing errors
const result = User.safeParse({
  username: 'john_doe',
  email: 'invalid-email',
  age: -5,
});

if (!result.success) {
  console.log(result.error.issues);
  // => Array of validation issues
} else {
  console.log(result.data);
  // => Validated and typed data
}
```

### Async Parsing

```typescript
const AsyncUser = User.extend({
  id: z.string().refine(
    async (id) => {
      // Async validation (e.g., database lookup)
      return await validateUserId(id);
    },
    {
      message: 'Invalid user ID',
    }
  ),
});

const result = await AsyncUser.parseAsync(userData);
```

## Type Inference

### Basic Type Inference

```typescript
const User = z.object({
  username: z.string(),
  age: z.number(),
});

// Extract inferred type
type User = z.infer<typeof User>;
// => { username: string; age: number }

// Use in your code
const user: User = {
  username: 'john_doe',
  age: 25,
};
```

### Input vs Output Types

```typescript
// Transform schema (input and output types differ)
const StringToLength = z.string().transform((val) => val.length);

type Input = z.input<typeof StringToLength>; // => string
type Output = z.output<typeof StringToLength>; // => number
```

## Schema Types

### Primitives

```typescript
// String
const Name = z.string();

// Number
const Age = z.number();

// Integer
const Count = z.number().int();

// Positive number
const Price = z.number().positive();

// Boolean
const IsActive = z.boolean();

// Date
const CreatedAt = z.date();

// BigInt
const LargeNumber = z.bigint();
```

### String Formats

```typescript
// Email
const Email = z.string().email();

// URL
const Website = z.string().url();

// UUID
const Id = z.string().uuid();

// ISO datetime
const DateTime = z.string().datetime();

// ISO date
const DateOnly = z.string().date();

// ISO time
const TimeOnly = z.string().time();

// IPv4 address
const IPv4 = z.string().ip({ version: 'v4' });

// IPv6 address
const IPv6 = z.string().ip({ version: 'v6' });

// MAC address
const MacAddress = z.string().mac();

// JWT
const Token = z.string().jwt();

// Hash (SHA-256, MD5, etc.)
const Hash = z.string().hash('sha256');
```

### Literals

```typescript
// String literal
const Status = z.literal('active' | 'inactive');

// Number literal
const Priority = z.literal(1 | 2 | 3);

// Boolean literal
const Flag = z.literal(true);
```

### Enums

```typescript
// Native enum
const Direction = z.enum(['north', 'south', 'east', 'west']);

// With extraction
type Direction = z.infer<typeof Direction>;

// Exclude values
const CardinalDirection = Direction.exclude(['north', 'south']);

// Extract values
const NorthSouth = Direction.extract(['north', 'south']);
```

### Optionals and Nullables

```typescript
// Optional property
const User = z.object({
  name: z.string(),
  age: z.number().optional(),
});

// Nullable property
const Description = z.string().nullable();

// Nullish (null or undefined)
const Metadata = z.string().nullish();
```

### Objects

```typescript
// Basic object
const Person = z.object({
  name: z.string(),
  age: z.number(),
});

// Strict object (no extra keys)
const StrictPerson = z
  .object({
    name: z.string(),
    age: z.number(),
  })
  .strict();

// Loose object (allow extra keys)
const LoosePerson = z
  .object({
    name: z.string(),
    age: z.number(),
  })
  .passthrough();

// Partial object
const PartialPerson = Person.partial();

// Required fields
const RequiredPerson = Person.required(['name']);

// Extend object
const Employee = Person.extend({
  employeeId: z.string(),
  department: z.string(),
});

// Pick specific fields
const PersonName = Person.pick(['name']);

// Omit specific fields
const PersonAge = Person.omit(['age']);
```

### Arrays and Tuples

```typescript
// Array of strings
const Names = z.array(z.string());
// or
const Names = z.string().array();

// Non-empty array
const NonEmptyNames = Names.nonempty();

// Tuple
const Point = z.tuple([z.number(), z.number()]);

// Variable length tuple
const FlexiblePoint = z.tuple([z.number(), z.number()]).rest(z.number());
```

### Unions and Intersections

```typescript
// Union
const StringOrNumber = z.union([z.string(), z.number()]);
// or
const StringOrNumber = z.string().or(z.number());

// Discriminated union
const Success = z.object({
  status: z.literal('success'),
  data: z.any(),
});

const Error = z.object({
  status: z.literal('error'),
  message: z.string(),
});

const Result = z.discriminatedUnion('status', [Success, Error]);

// Intersection
const NameAndAge = z.intersection(z.object({ name: z.string() }), z.object({ age: z.number() }));
```

### Records

```typescript
// Record with string keys and number values
const Scores = z.record(z.string(), z.number());

// Partial record
const PartialScores = z.partialRecord(z.string(), z.number());

// Loose record
const LooseScores = z.looseRecord(z.string(), z.number());
```

### Maps and Sets

```typescript
// Map
const UserMap = z.map(
  z.string(),
  z.object({
    name: z.string(),
    age: z.number(),
  })
);

// Set
const TagSet = z.set(z.string());
```

## Advanced Validation

### Refinements

```typescript
// Custom validation
const Password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain uppercase letter',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain lowercase letter',
  })
  .refine((val) => /\d/.test(val), {
    message: 'Password must contain number',
  });

// Async refinement
const UniqueEmail = z
  .string()
  .email()
  .refine(
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    },
    {
      message: 'Email already exists',
    }
  );
```

### Super Refinements

```typescript
// Advanced refinement with multiple issues
const Username = z.string().superRefine((val, ctx) => {
  if (val.length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 3,
      type: 'string',
      inclusive: true,
      message: 'Username too short',
    });
  }

  if (val.length > 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 20,
      type: 'string',
      inclusive: true,
      message: 'Username too long',
    });
  }

  return z.NEVER;
});
```

### Transforms

```typescript
// Transform string to number
const StringToNumber = z.string().transform((val) => {
  const num = parseFloat(val);
  if (isNaN(num)) {
    throw new Error('Invalid number');
  }
  return num;
});

// Transform with validation
const UppercaseString = z
  .string()
  .transform((val) => val.toUpperCase())
  .refine((val) => val.length >= 3, {
    message: 'String too short after transformation',
  });

// Async transform
const FetchUser = z
  .string()
  .uuid()
  .transform(async (id) => {
    const user = await fetchUser(id);
    return user;
  });
```

### Defaults and Pre-faults

```typescript
// Default values
const UserWithDefaults = z.object({
  name: z.string(),
  age: z.number().default(18),
  isActive: z.boolean().default(true),
});

// Pre-fault (default for undefined only)
const UserWithPrefaults = z.object({
  name: z.string(),
  age: z.number().prefault(18),
  isActive: z.boolean().prefault(true),
});
```

## Error Handling

### ZodError Structure

```typescript
try {
  User.parse(invalidData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.issues);
    // => Array of ZodIssue objects

    error.issues.forEach((issue) => {
      console.log(issue.code); // "invalid_type", "too_small", etc.
      console.log(issue.path); // ["username", "age"]
      console.log(issue.message); // Human-readable error
    });
  }
}
```

### Custom Error Messages

```typescript
const CustomString = z
  .string({
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.too_small) {
        return { message: 'Too short, minimum length is 3' };
      }
      return { message: ctx.defaultError };
    },
  })
  .min(3);
```

### Error Path Customization

```typescript
const PasswordForm = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error will be on confirmPassword field
  });
```

## Recursive Schemas

### Basic Recursive Types

```typescript
// Category with subcategories
const Category: z.ZodType<{
  id: string;
  name: string;
  subcategories: Category[];
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    subcategories: z.array(z.lazy(() => Category)),
  })
);
```

### Circular References

```typescript
// Node with parent reference
interface Node {
  id: string;
  value: string;
  parent?: Node;
  children: Node[];
}

const NodeSchema: z.ZodType<Node> = z.lazy(() =>
  z.object({
    id: z.string(),
    value: z.string(),
    parent: z.optional(z.lazy(() => NodeSchema)),
    children: z.array(z.lazy(() => NodeSchema)),
  })
);
```

## JSON Schema Integration

### Generate JSON Schema

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const jsonSchema = UserSchema.toJSONSchema();
// => JSON Schema object
```

### Parse from JSON Schema

```typescript
// Convert JSON Schema back to Zod schema
const parsedSchema = z.fromJsonSchema(jsonSchema);
```

## Custom Types

### Branded Types

```typescript
// Create a branded type
const PositiveNumber = z.number().positive().brand('PositiveNumber');

// Use the branded type
type PositiveNumber = z.infer<typeof PositiveNumber>;

// Function that requires branded type
function processNumber(num: PositiveNumber) {
  return num * 2;
}
```

### Custom Validation

```typescript
// Custom validator
const CustomDate = z.custom<Date>((val) => {
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  throw new Error('Invalid date');
});
```

## Performance Considerations

### Schema Reuse

```typescript
// Reuse schemas efficiently
const BaseUser = z.object({
  name: z.string(),
  email: z.string().email(),
});

const CreateUser = BaseUser.extend({
  password: z.string().min(8),
});

const UpdateUser = BaseUser.partial();
```

### Lazy Evaluation

```typescript
// Use lazy for expensive validations
const ExpensiveValidation = z.string().refine(async (val) => {
  // Only run if previous validations pass
  return await expensiveCheck(val);
});
```

## Best Practices

### Schema Organization

```typescript
// Separate schemas into logical modules
const userSchemas = {
  create: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  }),

  update: z
    .object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    })
    .partial(),

  public: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }),
};

type CreateUser = z.infer<typeof userSchemas.create>;
type UpdateUser = z.infer<typeof userSchemas.update>;
type PublicUser = z.infer<typeof userSchemas.public>;
```

### Error Handling Patterns

```typescript
// Centralized error handling
class ValidationError extends Error {
  constructor(
    public issues: z.ZodIssue[],
    message?: string
  ) {
    super(message || 'Validation failed');
  }
}

function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.issues);
  }
  return result.data;
}

// Usage
const user = validate(UserSchema, userInput);
```

### API Validation

```typescript
// Express middleware example
import { Request, Response, NextFunction } from 'express';

function validateBody<T>(schema: z.ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = validate(schema, req.body);
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.issues,
        });
      }
      next(error);
    }
  };
}

// Usage
app.post('/users', validateBody(CreateUserSchema), (req, res) => {
  // req.body is now typed as CreateUser
  res.json({ success: true });
});
```

## Integration Examples

### Next.js API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = CreateUserSchema.parse(body);

    // Process user creation
    const createdUser = await createUser(user);

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Database Validation

```typescript
// Database entity validation
const UserEntity = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(120),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type-safe database operations
async function createUser(userData: unknown) {
  const user = UserEntity.parse(userData);

  // Database insertion
  const result = await db.insert(users).values(user);
  return result;
}
```

### Form Validation

```typescript
// React form validation with Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(18, "Must be at least 18"),
});

type FormData = z.infer<typeof formSchema>;

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="number" {...register("age")} />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Advanced Patterns

### Conditional Validation

```typescript
// Conditional schema based on input
const DynamicSchema = z
  .object({
    type: z.enum(['user', 'admin']),
    username: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'user') {
        return data.username !== undefined;
      }
      return data.permissions !== undefined;
    },
    {
      message: 'Invalid schema for type',
      path: ['type'],
    }
  );
```

### Pipeline Validation

```typescript
// Multi-step validation pipeline
const validateUser = (data: unknown) => {
  const steps = [
    z.object({ name: z.string() }),
    z.object({ email: z.string().email() }),
    z.object({ age: z.number().positive() }),
  ];

  let validated = data;
  for (const schema of steps) {
    const result = schema.safeParse(validated);
    if (!result.success) {
      return result;
    }
    validated = result.data;
  }

  return { success: true, data: validated };
};
```

### Schema Composition

```typescript
// Composable schema builder
const createSchema = <T extends z.ZodRawShape>(shape: T) => z.object(shape);

const withTimestamps = <T extends z.ZodType<any>>(schema: T) =>
  schema.extend({
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  });

const withSoftDelete = <T extends z.ZodType<any>>(schema: T) =>
  schema.extend({
    deletedAt: z.date().optional(),
    isDeleted: z.boolean().default(false),
  });

// Usage
const BaseUser = createSchema({
  name: z.string(),
  email: z.string().email(),
});

const TimestampedUser = withTimestamps(BaseUser);
const FullUser = withSoftDelete(TimestampedUser);
```

## Testing with Zod

### Unit Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('User schema validation', () => {
  it('should validate valid user data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    };

    expect(() => UserSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      age: 25,
    };

    expect(() => UserSchema.parse(invalidData)).toThrow();
  });

  it('should provide correct error messages', () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      age: 25,
    };

    const result = UserSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({
        code: 'too_small',
        path: ['name'],
      })
    );
  });
});
```

### Mock Data Generation

```typescript
// Generate mock data for testing
const generateMockUser = (): z.infer<typeof UserSchema> => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  age: faker.datatype.number({ min: 18, max: 65 }),
  isActive: faker.datatype.boolean(),
});

// Generate array of mock users
const generateMockUsers = (count: number) =>
  Array.from({ length: count }, () => generateMockUser());
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official Resources

- [Zod Documentation](https://zod.dev/) - Official documentation and guides
- [Zod API Reference](https://zod.dev/api) - Complete API documentation
- [Zod Basics](https://zod.dev/basics) - Basic usage guide
- [Zod GitHub](https://github.com/colinhacks/zod) - Source code and issues
- [Zod JSR](https://jsr.io/@zod/zod) - JSR package registry

### Community Resources

- [Zod Discord](https://discord.gg/5rjHQ4m) - Community Discord server
- [Zod Examples](https://github.com/colinhacks/zod/tree/main/examples) - Example implementations
- [Zod Issues](https://github.com/colinhacks/zod/issues) - Bug reports and feature requests

### Integration Resources

- [React Hook Form Zod Resolver](https://github.com/react-hook-form/resolvers) - Form validation integration
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs with Zod
- [Fastify Type Provider](https://github.com/fastify/fastify-type-provider-zod) - Fastify integration
- [Express Zod Middleware](https://github.com/sindresorhus/express-zod-middleware) - Express middleware

### Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript documentation
- [JSON Schema Specification](https://json-schema.org/) - JSON Schema standard
- [Form Validation Best Practices](https://www.w3.org/WAI/WCAG21/Understanding/validation.html) - Accessibility guidelines


## Implementation

[Add content here]