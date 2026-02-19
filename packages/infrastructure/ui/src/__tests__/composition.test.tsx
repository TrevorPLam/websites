/**
 * @file packages/infrastructure/ui/src/__tests__/composition.test.tsx
 * Tests for: slots, render-props, HOCs, context, provider utilities
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Slot,
  SlotProvider,
  useSlot,
  useSlots,
  hasSlot,
} from '../composition/slots';
import {
  callRenderProp,
  callRenderPropVoid,
  mergeRenderProps,
} from '../composition/render-props';
import {
  withDefaults,
  withInjectedProps,
  withCondition,
  composeHOCs,
  getDisplayName,
} from '../composition/hocs';
import {
  createStrictContext,
  createOptionalContext,
  createContextWithDefault,
} from '../composition/context';
import { composeProviders, ProviderStack, createProvider } from '../composition/provider';

// ─── Slot tests ───────────────────────────────────────────────────────────────

describe('SlotProvider + useSlot', () => {
  function Host({ children }: { children: React.ReactNode }) {
    return (
      <SlotProvider>
        {children}
        <Inner />
      </SlotProvider>
    );
  }

  function Inner() {
    const header = useSlot('header');
    const body = useSlot('body');
    const missing = useSlot('missing');
    return (
      <div>
        <div data-testid="header-slot">{header ?? 'no-header'}</div>
        <div data-testid="body-slot">{body ?? 'no-body'}</div>
        <div data-testid="missing-slot">{missing ?? 'no-missing'}</div>
      </div>
    );
  }

  it('distributes Slot children into named slots', () => {
    render(
      <Host>
        <Slot name="header"><span>My Header</span></Slot>
        <Slot name="body"><span>My Body</span></Slot>
      </Host>
    );
    expect(screen.getByTestId('header-slot').textContent).toBe('My Header');
    expect(screen.getByTestId('body-slot').textContent).toBe('My Body');
  });

  it('renders fallback when slot is not provided', () => {
    render(<Host><Slot name="header"><span>H</span></Slot></Host>);
    expect(screen.getByTestId('missing-slot').textContent).toBe('no-missing');
  });

  it('hasSlot returns true when slot is present', () => {
    function Inspector() {
      const slots = useSlots();
      return <div data-testid="result">{hasSlot('header', slots) ? 'yes' : 'no'}</div>;
    }
    render(
      <SlotProvider>
        <Slot name="header"><span>H</span></Slot>
        <Inspector />
      </SlotProvider>
    );
    expect(screen.getByTestId('result').textContent).toBe('yes');
  });
});

// ─── Render-prop tests ────────────────────────────────────────────────────────

describe('callRenderProp', () => {
  it('returns a static node', () => {
    const node = callRenderProp(<span>hello</span>, undefined as unknown as void);
    expect(node).toBeTruthy();
  });

  it('calls a function render prop', () => {
    const fn = (x: number) => <span>{x * 2}</span>;
    const result = callRenderProp(fn, 5);
    const { container } = render(<>{result}</>);
    expect(container.textContent).toBe('10');
  });

  it('returns null for undefined', () => {
    expect(callRenderProp(undefined, undefined as unknown as void)).toBeNull();
  });
});

describe('callRenderPropVoid', () => {
  it('calls a no-arg render function', () => {
    const { container } = render(<>{callRenderPropVoid(() => <span>hi</span>)}</>);
    expect(container.textContent).toBe('hi');
  });
});

describe('mergeRenderProps', () => {
  it('uses override when provided', () => {
    const merged = mergeRenderProps(<span>fallback</span>, <span>override</span>);
    const { container } = render(<>{merged}</>);
    expect(container.textContent).toBe('override');
  });

  it('uses fallback when override is undefined', () => {
    const merged = mergeRenderProps<void>(<span>fallback</span>, undefined);
    const { container } = render(<>{merged}</>);
    expect(container.textContent).toBe('fallback');
  });
});

// ─── HOC tests ────────────────────────────────────────────────────────────────

describe('withDefaults', () => {
  interface BtnProps { variant?: string; label?: string }
  function Btn({ variant = 'default', label = '' }: BtnProps) {
    return <button data-variant={variant}>{label}</button>;
  }

  it('injects default props', () => {
    const BtnWithDefaults = withDefaults(Btn, { variant: 'primary' });
    render(<BtnWithDefaults />);
    expect(screen.getByRole('button').getAttribute('data-variant')).toBe('primary');
  });

  it('allows consumer to override injected defaults', () => {
    const BtnWithDefaults = withDefaults(Btn, { variant: 'primary' });
    render(<BtnWithDefaults variant="ghost" />);
    expect(screen.getByRole('button').getAttribute('data-variant')).toBe('ghost');
  });
});

describe('withCondition', () => {
  function Panel() {
    return <div data-testid="panel">visible</div>;
  }

  it('renders when condition is true', () => {
    const Guarded = withCondition(Panel, () => true);
    render(<Guarded />);
    expect(screen.getByTestId('panel')).toBeTruthy();
  });

  it('renders null when condition is false', () => {
    const Guarded = withCondition(Panel, () => false);
    render(<Guarded />);
    expect(screen.queryByTestId('panel')).toBeNull();
  });
});

describe('composeHOCs', () => {
  it('applies HOCs left-to-right (outermost first)', () => {
    interface P { value?: string }
    function Base({ value }: P) { return <span>{value}</span>; }

    // A (outer) appends '-A' to value prop before passing down
    const A = (C: React.ComponentType<P>) => {
      function WithA(p: P) { return <C value={(p.value ?? '') + '-A'} />; }
      return WithA;
    };
    // B (inner) appends 'B' to value prop before passing down
    const B = (C: React.ComponentType<P>) => {
      function WithB(p: P) { return <C value={(p.value ?? '') + 'B'} />; }
      return WithB;
    };

    // composeHOCs(A, B) = A(B(Base))
    // Render: A gets no value → passes '-A' to B → B passes '-AB' to Base
    const Composed = composeHOCs(A, B)(Base);
    const { container } = render(<Composed />);
    expect(container.textContent).toBe('-AB');
  });

  it('single HOC in compose works as direct application', () => {
    interface P { value?: string }
    function Base({ value }: P) { return <span>{value ?? 'none'}</span>; }
    const WithX = (C: React.ComponentType<P>) => {
      function X(p: P) { return <C value="X" {...p} />; }
      return X;
    };
    const Composed = composeHOCs(WithX)(Base);
    const { container } = render(<Composed />);
    expect(container.textContent).toBe('X');
  });
});

describe('getDisplayName', () => {
  it('returns displayName when set', () => {
    function MyComp() { return null; }
    MyComp.displayName = 'CustomName';
    expect(getDisplayName(MyComp)).toBe('CustomName');
  });

  it('returns function name as fallback', () => {
    function AnotherComp() { return null; }
    expect(getDisplayName(AnotherComp)).toBe('AnotherComp');
  });
});

// ─── Context tests ────────────────────────────────────────────────────────────

describe('createStrictContext', () => {
  it('provides and consumes values', () => {
    const [Ctx, useCtx] = createStrictContext<{ name: string }>('TestCtx');
    function Consumer() {
      const { name } = useCtx();
      return <span>{name}</span>;
    }
    render(<Ctx.Provider value={{ name: 'hello' }}><Consumer /></Ctx.Provider>);
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('throws when used outside provider', () => {
    const [, useCtx] = createStrictContext<{ name: string }>('BrokenCtx');
    function Consumer() { useCtx(); return null; }
    expect(() => render(<Consumer />)).toThrow('BrokenCtx');
  });
});

describe('createContextWithDefault', () => {
  it('returns default without provider', () => {
    const [, useCtx] = createContextWithDefault<string>('DefCtx', 'default-value');
    function Consumer() {
      return <span>{useCtx()}</span>;
    }
    render(<Consumer />);
    expect(screen.getByText('default-value')).toBeTruthy();
  });
});

// ─── Provider tests ───────────────────────────────────────────────────────────

describe('composeProviders', () => {
  const CtxA = React.createContext('a-default');
  const CtxB = React.createContext('b-default');

  function ProvA({ children }: { children: React.ReactNode }) {
    return <CtxA.Provider value="a-provided">{children}</CtxA.Provider>;
  }
  function ProvB({ children }: { children: React.ReactNode }) {
    return <CtxB.Provider value="b-provided">{children}</CtxB.Provider>;
  }

  it('stacks providers correctly', () => {
    const Composed = composeProviders(ProvA, ProvB);
    function Consumer() {
      const a = React.useContext(CtxA);
      const b = React.useContext(CtxB);
      return <span>{a}-{b}</span>;
    }
    render(<Composed><Consumer /></Composed>);
    expect(screen.getByText('a-provided-b-provided')).toBeTruthy();
  });
});

describe('ProviderStack', () => {
  const CtxC = React.createContext('c-default');

  function ProvC({ children }: { children: React.ReactNode }) {
    return <CtxC.Provider value="c-provided">{children}</CtxC.Provider>;
  }

  it('renders children within all providers', () => {
    function Consumer() {
      return <span>{React.useContext(CtxC)}</span>;
    }
    render(
      <ProviderStack providers={[ProvC]}>
        <Consumer />
      </ProviderStack>
    );
    expect(screen.getByText('c-provided')).toBeTruthy();
  });
});

describe('createProvider', () => {
  it('creates a typed provider from a context', () => {
    const Ctx = React.createContext('initial');
    const TypedProvider = createProvider(Ctx);
    function Consumer() { return <span>{React.useContext(Ctx)}</span>; }
    render(<TypedProvider value="typed-value"><Consumer /></TypedProvider>);
    expect(screen.getByText('typed-value')).toBeTruthy();
  });
});
