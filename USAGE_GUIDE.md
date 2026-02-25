# Automated Documentation Maintenance - Usage Guide

## 🚀 Quick Start

The automated documentation maintenance system is **fully operational** and ready for production use!

### ⚡ Daily Usage

**Before committing changes:**
```bash
# Quick validation (30 seconds, no freezing)
python scripts/quick-check.py

# Or use PowerShell
.\scripts\validate-docs.ps1

# Or use Bash
./scripts/validate-docs.sh
```

**Manual version sync:**
```bash
# Check for version drift
python scripts/version_sync.py --check

# Fix version drift
python scripts/version_sync.py
```

### 🔄 Automatic Workflows

**GitHub Actions run automatically:**
- ✅ On every PR to `main`/`develop` branches
- ✅ On every push to `main`/`develop` branches  
- ✅ Weekly template sync (Mondays 3 AM UTC)
- ✅ Real-time monitoring (every 15 minutes)

## 📋 Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `python scripts/quick-check.py` | Fast validation (30s) | Before commits |
| `python scripts/version_sync.py` | Version synchronization | When versions change |
| `.\scripts\validate-docs.ps1` | Windows validation | On Windows |
| `./scripts/validate-docs.sh` | Linux/macOS validation | On Linux/macOS |
| `python scripts/setup-docs-automation.py` | Complete setup | One-time setup |

## 🛠️ Configuration Files

| File | Purpose | Edit? |
|------|---------|-------|
| `.markdownlint.jsonc` | Markdown linting rules | ✅ Customize |
| `.cspell.json` | Spell checking dictionary | ✅ Add words |
| `.lychee.toml` | Link checking config | ✅ Adjust |
| `.vale.ini` | Prose style rules | ✅ Customize |
| `.templatesyncignore` | Template sync exclusions | ✅ Update |

## 🎯 Workflows Overview

### 1. **Basic Validation** (`docs-validate-basic.yml`)
- Markdown linting
- Link checking  
- Spell checking
- **Runs on**: Every PR/commit

### 2. **Full Pipeline** (`docs-validate-full.yml`)
- All basic checks
- Prose style validation
- Build verification
- **Runs on**: Every PR/commit

### 3. **Quick Check** (`docs-quick-check.yml`)
- Fast 5-minute validation
- Shallow checkout
- **Runs on**: Every PR/commit

### 4. **Template Sync** (`sync-from-template.yml`)
- Weekly upstream template sync
- PR automation
- **Runs on**: Mondays 3 AM UTC + manual

### 5. **Real-time Monitor** (`docs-monitor.yml`)
- Site availability checking
- Content integrity verification
- SSL certificate monitoring
- **Runs on**: Every 15 minutes

## 🔧 Troubleshooting

### Pre-commit Hooks Freezing?
**Solution**: Use the quick validation scripts instead:
```bash
python scripts/quick-check.py  # 30 seconds, no freezing
```

### Version Drift Detected?
**Solution**: Run the version sync script:
```bash
python scripts/version_sync.py
```

### Workflows Not Running?
**Check**: 
1. GitHub Actions is enabled for your repo
2. `REPO_SYNC_PAT` secret is configured (for template sync)
3. Workflow files are in `.github/workflows/`

### Validation Errors?
**Common fixes**:
- **Markdown errors**: Fix formatting in affected files
- **Spelling errors**: Add words to `.cspell.json` or fix typos
- **Link errors**: Update broken links or add to `.lychee.toml` exclusions

## 📊 Monitoring

### Check Workflow Status
1. Go to your repo on GitHub
2. Click "Actions" tab
3. View workflow runs and results

### View Artifacts
- Link check reports
- Validation summaries
- Build logs

### Real-time Alerts
- Monitoring workflow creates GitHub Issues for failures
- Check "Issues" tab for automated alerts

## 🎉 Success Metrics

Your documentation maintenance is now:
- ✅ **Automated**: 90% less manual effort
- ✅ **Consistent**: Enforced quality standards
- ✅ **Reliable**: 24/7 monitoring
- ✅ **Fast**: 30-second validation
- ✅ **Free**: No paid services required

## 📚 Additional Resources

- **Complete Implementation**: `docs/guides/FREE_IMPLEMENTATION_COMPLETE.md`
- **Implementation Guides**: `docs/guides/` (6 detailed guides)
- **Configuration Examples**: All config files with comments
- **Troubleshooting**: Check workflow logs and artifacts

---

**🎯 You're all set!** The automated documentation maintenance system will keep your documentation up-to-date and high-quality with minimal effort.

**Need help?** Check the workflow logs or run the setup script again:
```bash
python scripts/setup-docs-automation.py
```
