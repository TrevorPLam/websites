# PowerShell script to update remaining 2- tasks with code snippets
Write-Host "Updating remaining 2- tasks with code snippets..." -ForegroundColor Green

try {
    node scripts/update-tasks-with-code-snippets.js
    Write-Host "Task updates complete!" -ForegroundColor Green
} catch {
    Write-Host "Error running task updates: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
