#!/usr/bin/env python3
"""
Quick documentation validation script
Run this manually before commits to avoid pre-commit hook issues
"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd, description):
    """Run a command and return success status"""
    print(f"\n🔍 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print(f"✅ {description} - PASSED")
            return True
        else:
            print(f"❌ {description} - FAILED")
            if result.stdout:
                print("STDOUT:", result.stdout[:500])
            if result.stderr:
                print("STDERR:", result.stderr[:500])
            return False
    except subprocess.TimeoutExpired:
        print(f"⏰ {description} - TIMEOUT (30s)")
        return False
    except Exception as e:
        print(f"💥 {description} - ERROR: {e}")
        return False

def main():
    print("🚀 Quick Documentation Validation")
    print("=" * 40)
    
    checks = [
        ("python scripts/version_sync.py --check", "Version Consistency Check"),
        ("markdownlint-cli2 docs/guides/*.md --noConfig", "Markdown Lint (Guides Only)"),
        ("cspell docs/guides/ --no-summary --quiet", "Spell Check (Docs Only)"),
    ]
    
    passed = 0
    total = len(checks)
    
    for cmd, desc in checks:
        if run_command(cmd, desc):
            passed += 1
    
    print(f"\n📊 Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All checks passed! Ready to commit.")
        return 0
    else:
        print("⚠️  Some checks failed. Review and fix before committing.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
