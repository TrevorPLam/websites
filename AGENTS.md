# Agent Entry Point (Concise)

## Commands
- **Start/Work/Task**: follow workflow below.
- **Review**: jump to “PR requirements.”
- **Security**: read `.repo/policy/SECURITY_BASELINE.md`, create HITL, stop.
- **Help**: see “Next steps.”

## Workflow (3-pass)
1. **Read first**: `.repo/tasks/TODO.md` → `.repo/repo.manifest.yaml` → `.repo/agents/QUICK_REFERENCE.md`.
2. **Plan**: pick change type, list actions/risks/files, mark `<UNKNOWN>` (HITL), ADR if crossing boundaries.
3. **Change**: apply edits, follow patterns, include filepaths in notes.
4. **Verify**: run tests from manifest, show evidence, update required logs if non-doc.

## Testing
- Use manifest commands only (no guessing): `make lint`, `make test`, `make verify`.

## Project Structure
- **app/** routes (Next.js App Router), **components/** reusable UI, **lib/** utilities.
- **.repo/tasks/** for TODO/BACKLOG/ARCHIVE (single active task).

## Tech Stack (versions)
- Backend: **Django 4.2**, **Python 3.11**.
- Frontend: **React 18**, **TypeScript**.

## Code Style (examples)
```ts
export const Widget: React.FC = () => {
  const { data } = useQuery({ queryKey: ['widget'], queryFn: fetchWidget });
  return <div>{data?.name}</div>;
};
```
```py
class ClientViewSet(FirmScopedMixin, viewsets.ModelViewSet):
    queryset = Client.objects.all()
```
- Functional components, React Query for data, React Hook Form for forms.
- **Never** wrap imports in try/catch.

## Git Workflow
- Keep scope small; one change type per PR.
- Run `make lint` before commit.
- Commit with clear message; PR must include what/why/filepaths/verification/risks/rollback.

## Boundaries (Never Do)
- No secrets or `.env` commits.
- No UNKNOWN work (mark `<UNKNOWN>` → HITL → stop).
- No cross-boundary imports without ADR.
- No risky changes without HITL.

## PR Requirements
- Read `.repo/agents/checklists/pr-review.md`, `.repo/templates/PR_TEMPLATE.md`,
  `.repo/policy/QUALITY_GATES.md`, `.repo/policy/HITL.md`.

## Next Steps
1. Read `.repo/tasks/TODO.md`.
2. Read `.repo/repo.manifest.yaml`.
3. Read `.repo/agents/QUICK_REFERENCE.md`.
