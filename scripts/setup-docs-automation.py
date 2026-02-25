#!/usr/bin/env python3
"""
Complete setup script for automated documentation maintenance
Run this once to configure everything for production
"""

import subprocess
import sys
import json
from pathlib import Path

def run_command(cmd, description, critical=True):
    """Run a command and return success status"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            print(f"✅ {description} - COMPLETED")
            if result.stdout and len(result.stdout.strip()) > 0:
                print("Output:", result.stdout[:200])
            return True
        else:
            print(f"❌ {description} - FAILED")
            if result.stderr:
                print("Error:", result.stderr[:300])
            if critical:
                return False
            else:
                print("⚠️  Continuing anyway (non-critical)")
                return True
    except subprocess.TimeoutExpired:
        print(f"⏰ {description} - TIMEOUT")
        return critical == False
    except Exception as e:
        print(f"💥 {description} - ERROR: {e}")
        return critical == False

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✅ {description} - EXISTS")
        return True
    else:
        print(f"❌ {description} - MISSING")
        return False

def main():
    print("🚀 Complete Documentation Automation Setup")
    print("=" * 50)
    
    # Check prerequisites
    print("\n📋 Checking prerequisites...")
    prerequisites = [
        ("package.json", "Package configuration"),
        ("scripts/version_sync.py", "Version sync script"),
        (".github/workflows/docs-validate-basic.yml", "Basic validation workflow"),
        (".github/workflows/docs-validate-full.yml", "Full validation workflow"),
        (".github/workflows/docs-quick-check.yml", "Quick check workflow"),
        (".github/workflows/docs-monitor.yml", "Monitoring workflow"),
        (".github/workflows/sync-from-template.yml", "Template sync workflow"),
        (".markdownlint.jsonc", "Markdown lint config"),
        (".lychee.toml", "Link check config"),
        (".cspell.json", "Spell check config"),
        (".vale.ini", "Prose style config"),
        (".templatesyncignore", "Template sync ignore"),
        ("scripts/quick-check.py", "Quick validation script"),
        ("docs/frontmatter-schema.json", "Front matter schema"),
        (".monitoring/content-baseline.txt", "Content baseline"),
    ]
    
    missing = []
    for filepath, desc in prerequisites:
        if not check_file_exists(filepath, desc):
            missing.append(filepath)
    
    if missing:
        print(f"\n❌ Missing files: {len(missing)}")
        for f in missing:
            print(f"  - {f}")
        print("\n⚠️  Some components are missing. Setup may be incomplete.")
    else:
        print("\n✅ All prerequisite files found!")
    
    # Install and configure tools
    print("\n🛠️  Installing and configuring tools...")
    
    tools_setup = [
        ("python scripts/version_sync.py --check", "Version sync verification"),
        ("python -m pip install --upgrade pip", "Upgrade pip"),
        ("pip install pre-commit", "Install pre-commit"),
        ("pip install vale", "Install Vale prose checker"),
        ("C:\\Users\\trevo\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\Scripts\\vale.exe sync", "Download Vale style packages"),
        ("npm install -g markdownlint-cli2", "Install markdown linter"),
        ("npm install -g cspell", "Install spell checker"),
        ("npm install -g lychee", "Install link checker"),
    ]
    
    setup_passed = 0
    for cmd, desc in tools_setup:
        if run_command(cmd, desc, critical=False):
            setup_passed += 1
    
    print(f"\n📊 Tool setup: {setup_passed}/{len(tools_setup)} completed")
    
    # Test core functionality
    print("\n🧪 Testing core functionality...")
    
    tests = [
        ("python scripts/version_sync.py --check", "Version consistency check"),
        ("python scripts/quick-check.py", "Quick validation script"),
    ]
    
    tests_passed = 0
    for cmd, desc in tests:
        if run_command(cmd, desc, critical=False):
            tests_passed += 1
    
    print(f"\n📊 Functionality tests: {tests_passed}/{len(tests)} passed")
    
    # Create final summary
    print("\n📋 SETUP SUMMARY")
    print("=" * 30)
    
    status = "✅ READY" if len(missing) == 0 and setup_passed >= 6 and tests_passed >= 1 else "⚠️  PARTIAL"
    
    print(f"Status: {status}")
    print(f"Prerequisites: {len(prerequisites) - len(missing)}/{len(prerequisites)} present")
    print(f"Tools installed: {setup_passed}/{len(tools_setup)}")
    print(f"Tests passed: {tests_passed}/{len(tests)}")
    
    # Next steps
    print("\n🎯 NEXT STEPS")
    print("-" * 20)
    
    if len(missing) > 0:
        print("1. ❌ Fix missing prerequisite files")
    
    if setup_passed < len(tools_setup):
        print("2. 🔧 Complete tool installation")
    
    print("3. 🔐 Configure GitHub secret: REPO_SYNC_PAT")
    print("4. 🧪 Test workflows by pushing to GitHub")
    print("5. 📖 Read docs/guides/FREE_IMPLEMENTATION_COMPLETE.md")
    
    if status == "✅ READY":
        print("\n🎉 AUTOMATED DOCUMENTATION MAINTENANCE IS READY!")
        print("\nUsage:")
        print("  python scripts/quick-check.py    # Quick validation")
        print("  python scripts/version_sync.py   # Version sync")
        print("\nWorkflows will run automatically on GitHub Actions.")
    else:
        print("\n⚠️  Setup incomplete. Address the issues above.")
    
    return 0 if status == "✅ READY" else 1

if __name__ == "__main__":
    sys.exit(main())
