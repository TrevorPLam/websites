---
name: debug-github-actions
description: Guide for debugging failing GitHub Actions workflows. Use this when asked to debug failing CI workflows or investigate pipeline issues.
---

To debug failing GitHub Actions workflows:

1. **List recent workflow runs**

   ```bash
   gh run list --limit 10
   ```

   Look for failed runs and note their IDs

2. **Get AI summary of failures**

   ```bash
   gh run view <run-id> --json | summarize_job_log_failures
   ```

   This provides AI-powered analysis of what went wrong

3. **Get detailed job logs**

   ```bash
   gh run view <run-id> --log
   ```

   Or for specific job:

   ```bash
   gh run view <run-id> --job <job-id> --log
   ```

4. **Common failure patterns**

   **Build failures:**
   - Check TypeScript errors: `pnpm typecheck`
   - Verify dependencies: `pnpm install`
   - Check environment variables

   **Test failures:**
   - Run tests locally: `pnpm test`
   - Check test configuration
   - Verify test environment setup

   **Deploy failures:**
   - Check Vercel configuration
   - Verify build output
   - Check environment variables

5. **Reproduce failure locally**

   ```bash
   # Use act to run GitHub Actions locally
   act -j <job-name>
   ```

6. **Check workflow syntax**

   ```bash
   # Validate workflow files
   gh workflow list
   yamllint .github/workflows/*.yml
   ```

7. **Investigate specific errors**

   **Permission errors:**
   - Check repo settings > Actions > General
   - Verify workflow permissions
   - Check token permissions

   **Timeout errors:**
   - Increase timeout in workflow
   - Optimize build process
   - Check resource usage

   **Cache issues:**
   - Clear cache: `gh cache list`
   - Delete corrupted cache
   - Update cache keys

8. **Fix and verify**
   - Make necessary changes
   - Test locally first
   - Push fix and monitor new run

9. **Monitor fix**
   ```bash
   gh run watch <run-id>
   ```

**Debugging Tools:**

- `gh run view` - Detailed run information
- `gh run list` - Recent workflow history
- `gh workflow view` - Workflow configuration
- `act` - Local GitHub Actions runner

**Prevention Strategies:**

- Use workflow templates
- Implement proper error handling
- Add comprehensive logging
- Test changes in feature branches
- Use environment-specific configurations

**Multi-repo workflows:**

- Check cross-repo permissions
- Verify PAT token scopes
- Test repository connections
- Monitor rate limits
