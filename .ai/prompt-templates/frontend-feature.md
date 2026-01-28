# Frontend Feature Template

When creating a new feature for this Next.js marketing website:

1. **Create feature directory**: `features/[feature-name]/`
2. **Structure**:
   - `index.ts` - Public exports
   - `components/` - Feature-specific React components
   - `lib/` - Feature-specific utilities and logic
   - `api/` - API routes if needed (or use app/api/)

3. **Component Guidelines**:
   - Prefer Server Components
   - Use Client Components only for interactivity
   - Export from index.ts for clean imports

4. **Example**:
```typescript
// features/my-feature/index.ts
export { MyFeatureComponent } from './components/MyFeatureComponent';
export { useMyFeature } from './lib/useMyFeature';

// features/my-feature/components/MyFeatureComponent.tsx
'use client'; // Only if needed
export function MyFeatureComponent() { ... }
```
