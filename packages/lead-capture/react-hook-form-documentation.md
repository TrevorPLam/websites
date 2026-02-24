# react-hook-form-documentation.md

## Overview

React Hook Form is a performant, flexible, and extensible form library for React applications. It provides hooks-based form management with minimal re-renders, excellent performance characteristics, and seamless integration with existing HTML form elements.

## Core Features

- **Performance**: Isolates re-renders at the component level
- **Minimal Re-renders**: Only re-renders when form state changes
- **HTML Standard**: Works with native HTML form elements
- **Super Light**: Small bundle size with zero dependencies
- **TypeScript Support**: First-class TypeScript integration
- **Adoptable**: Easy migration from existing forms

## Installation

```bash
# npm
npm install react-hook-form

# yarn
yarn add react-hook-form

# TypeScript support included
npm install @types/react-hook-form
```

## Basic Usage

### Simple Form Example

```tsx
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" {...register('firstName', { required: 'First name is required' })} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" {...register('lastName', { required: 'Last name is required' })} />
        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={() => reset()}>
        Reset
      </button>
    </form>
  );
}
```

## Advanced Patterns

### Controlled Components

```tsx
import { useForm, Controller } from 'react-hook-form';
import { Select } from 'antd';

function ControlledForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Please select a country' }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <Select
              {...field}
              options={[
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
              ]}
              placeholder="Select a country"
            />
            {error && <p>{error.message}</p>}
          </div>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Custom Hooks

```tsx
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

function useCustomForm(defaultValues?: any) {
  const methods = useForm({
    defaultValues,
    mode: 'onChange',
  });

  // Auto-save functionality
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem('formData', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  return methods;
}

function AutoSaveForm() {
  const methods = useCustomForm({
    firstName: '',
    lastName: '',
  });

  return <form onSubmit={methods.handleSubmit(onSubmit)}>{/* Form fields */}</form>;
}
```

### Dynamic Forms

```tsx
import { useForm, useFieldArray } from 'react-hook-form';

function DynamicForm() {
  const { control, handleSubmit, register } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'users',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`users.${index}.name`)} placeholder="Name" />
          <input {...register(`users.${index}.email`)} placeholder="Email" />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', email: '' })}>
        Add User
      </button>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Validation Strategies

### Built-in Validation

```tsx
const { register } = useForm();

register('fieldName', {
  required: 'This field is required',
  minLength: {
    value: 3,
    message: 'Must be at least 3 characters',
  },
  maxLength: {
    value: 20,
    message: 'Must be less than 20 characters',
  },
  pattern: {
    value: /^[A-Za-z]+$/i,
    message: 'Only letters allowed',
  },
  validate: (value) => value === 'admin' || 'Not authorized',
});
```

### Schema Validation with Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function SchemaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Async Validation

```tsx
const { register } = useForm();

register('username', {
  validate: async (value) => {
    if (value.length < 3) return 'Username too short';

    try {
      const response = await fetch(`/api/check-username/${value}`);
      const data = await response.json();
      return data.available || 'Username already taken';
    } catch {
      return 'Failed to validate username';
    }
  },
});
```

## Form State Management

### Watching Values

```tsx
function WatchForm() {
  const { watch, register } = useForm();

  const watchedValues = watch();
  const specificValue = watch('fieldName');

  useEffect(() => {
    console.log('Form changed:', watchedValues);
  }, [watchedValues]);

  return (
    <form>
      <input {...register('fieldName')} />
      <p>Current value: {specificValue}</p>
    </form>
  );
}
```

### Reset and Set Values

```tsx
function ResetForm() {
  const { reset, setValue, getValues } = useForm();

  const handleReset = () => {
    reset({
      firstName: '',
      lastName: '',
      email: '',
    });
  };

  const handleSetValue = () => {
    setValue('firstName', 'John');
    setValue('lastName', 'Doe');
  };

  const handleGetValues = () => {
    const values = getValues();
    console.log('Current values:', values);
  };

  return (
    <form>
      {/* Form fields */}
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      <button type="button" onClick={handleSetValue}>
        Set Values
      </button>
      <button type="button" onClick={handleGetValues}>
        Get Values
      </button>
    </form>
  );
}
```

### Error Handling

```tsx
function ErrorHandlingForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitForm(data);
    } catch (error) {
      if (error.response?.data?.field) {
        setError(error.response.data.field, {
          message: error.response.data.message,
        });
      }
    }
  };

  const handleClearErrors = () => {
    clearErrors('fieldName');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fieldName')} />
      {errors.fieldName && (
        <p>
          {errors.fieldName.message}
          <button type="button" onClick={handleClearErrors}>
            Clear
          </button>
        </p>
      )}

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
```

## Integration Patterns

### With React Context

```tsx
const FormContext = createContext();

function FormProvider({ children }) {
  const methods = useForm();
  return <FormContext.Provider value={methods}>{children}</FormContext.Provider>;
}

function useFormData() {
  return useContext(FormContext);
}

function FormField({ name, label, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormData();

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...register(name)} {...props} />
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
}

// Usage
function App() {
  return (
    <FormProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField name="firstName" label="First Name" />
        <FormField name="lastName" label="Last Name" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

### With UI Libraries

#### Material-UI Integration

```tsx
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

function MaterialUIForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Email"
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
```

#### Ant Design Integration

```tsx
import { Form, Input, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';

function AntDesignForm() {
  const { control, handleSubmit } = useForm();

  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email is required' }}
        render={({ field, fieldState: { error } }) => (
          <Form.Item validateStatus={error ? 'error' : ''} help={error?.message}>
            <Input {...field} placeholder="Email" />
          </Form.Item>
        )}
      />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## Performance Optimization

### Memoization Strategies

```tsx
import { memo } from 'react';

const MemoizedFormField = memo(({ name, register, error }) => (
  <div>
    <input {...register(name)} />
    {error && <p>{error.message}</p>}
  </div>
));

function OptimizedForm() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <form>
      <MemoizedFormField name="firstName" register={register} error={errors.firstName} />
    </form>
  );
}
```

### Lazy Validation

```tsx
const { register } = useForm({
  mode: 'onBlur', // Validate on blur instead of on change
  delayError: 500, // Debounce error display
});

register('fieldName', {
  validate: debounce(async (value) => {
    // Expensive validation logic
    return await validateField(value);
  }, 500),
});
```

## Testing with React Hook Form

### Unit Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyForm } from './MyForm';

describe('MyForm', () => {
  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<MyForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      email: 'john@example.com',
    });
  });

  it('should show validation errors', async () => {
    render(<MyForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
import { renderHook, act } from '@testing-library/react';
import { useForm } from 'react-hook-form';

describe('useForm', () => {
  it('should handle form submission', async () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.setValue('testField', 'testValue');
    });

    expect(result.current.getValues('testField')).toBe('testValue');
  });
});
```

## Best Practices

### 1. Use TypeScript for Type Safety

```tsx
type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const { register } = useForm<LoginForm>();
```

### 2. Validate on Blur for Better UX

```tsx
const { register } = useForm({
  mode: 'onBlur',
});
```

### 3. Use Controlled Components for Complex UI

```tsx
<Controller
  name="complexField"
  control={control}
  render={({ field }) => <ComplexComponent {...field} />}
/>
```

### 4. Implement Proper Error Handling

```tsx
const { setError } = useForm();

try {
  await submitForm(data);
} catch (error) {
  setError('root.serverError', {
    message: 'Server error occurred',
  });
}
```

### 5. Optimize Performance

```tsx
const { control } = useForm({
  shouldUnregister: false, // Keep form values in memory
  reValidateMode: 'onChange', // Re-validate on change
});
```

## Common Pitfalls

### 1. Not Registering Fields

```tsx
// ❌ Missing register
<input name="field" />

// ✅ Proper registration
<input {...register('field')} />
```

### 2. Mixing Controlled and Uncontrolled

```tsx
// ❌ Don't mix patterns
<input value={value} {...register('field')} />

// ✅ Use Controller for controlled components
<Controller name="field" control={control} render={({ field }) => <input {...field} />} />
```

### 3. Not Handling Form State

```tsx
// ❌ Not checking form state
const { register } = useForm();

// ✅ Use form state for better UX
const {
  register,
  formState: { isSubmitting },
} = useForm();

<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>;
```

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [React Hook Form Official Documentation](https://react-hook-form.com/)
- [React Hook Form API Reference](https://react-hook-form.com/api/)
- [React Hook Form Examples](https://react-hook-form.com/get-started)
- [Zod Resolver Documentation](https://github.com/react-hook-form/resolvers)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/)

## Implementation

[Add content here]
