# Makefile for your-dedicated-marketer (Next.js Marketing Website)
# Meta-commentary:
# - Current Status: Next.js App Router with TypeScript, Tailwind CSS
# - Reasoning: Keep verification steps explicit and centralized for deterministic local runs.
# - Assumption: Node.js 20+ and npm 10+ are available
SHELL := /bin/bash
.ONESHELL:

Q := @
ifneq ($(V),1)
Q := @
else
Q :=
endif

.PHONY: setup lint test test-e2e typecheck dev build verify check-governance

setup:
	$(Q)echo "=== INSTALLING DEPENDENCIES ==="
	$(Q)npm ci --legacy-peer-deps
	$(Q)echo "=== SETUP COMPLETE ==="

lint:
	$(Q)echo "=== LINTING ==="
	$(Q)npm run lint
	$(Q)echo "=== LINT COMPLETE ==="

test:
	$(Q)echo "=== RUNNING TESTS ==="
	$(Q)npm run test
	$(Q)echo "=== TESTS COMPLETE ==="

test-e2e:
	$(Q)echo "=== RUNNING E2E TESTS ==="
	$(Q)npm run test:e2e
	$(Q)echo "=== E2E TESTS COMPLETE ==="

typecheck:
	$(Q)echo "=== TYPE CHECKING ==="
	$(Q)npm run type-check
	$(Q)echo "=== TYPE CHECK COMPLETE ==="

dev:
	$(Q)echo "=== STARTING DEV SERVER ==="
	$(Q)npm run dev

build:
	$(Q)echo "=== BUILDING ==="
	$(Q)npm run build
	$(Q)echo "=== BUILD COMPLETE ==="

verify: lint typecheck test
	$(Q)echo "=== VERIFICATION COMPLETE ==="

check-governance:
	$(Q)set +e
	governance_status=0
	$(Q)echo "=== GOVERNANCE VERIFICATION ==="
	$(Q)chmod +x scripts/governance-verify.sh
	$(Q)./scripts/governance-verify.sh
	governance_status=$$?
	$(Q)echo "=== SUMMARY ==="
	$(Q)if [ $$governance_status -eq 0 ]; then echo "GOVERNANCE VERIFICATION: PASS"; else echo "GOVERNANCE VERIFICATION: FAIL"; fi
	$(Q)exit $$governance_status

ci: verify
