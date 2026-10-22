# Claymorphic Redesign - Fix Slate Colors for BayFlow
# Run with: powershell -ExecutionPolicy Bypass -File fix-colors.ps1

$ErrorActionPreference = "Stop"

$REPO_ROOT = "d:/hack/bayflow/src"
$REPO_ROOT = Resolve-Path $REPO_ROOT

$Files = @(
    "app/(customer)/book/page.tsx",
    "app/(customer)/dashboard/page.tsx",
    "app/(customer)/page.tsx",
    "app/(pos)/sa/page.tsx",
    "app/(pos)/qc/page.tsx",
    "app/(pos)/owner/page.tsx",
    "app/(pos)/parts/page.tsx",
    "app/(pos)/technician/page.tsx",
    "app/(pos)/layout.tsx",
    "app/layout.tsx",
    "app/globals.css",
    "components/customer/estimate-card.tsx",
    "components/customer/shop-card.tsx",
    "components/customer/status-timeline.tsx",
    "components/layout/notification-bell.tsx",
    "components/layout/shop-switcher.tsx",
    "components/layout/sidebar.tsx",
    "components/layout/topbar.tsx",
    "components/ui/clay-avatar.tsx",
    "components/ui/clay-badge.tsx",
    "components/ui/clay-button.tsx",
    "components/ui/clay-card.tsx",
    "components/ui/clay-input.tsx",
    "components/ui/clay-modal.tsx"
)

$Replacements = @(
    @("bg-slate-900", "bg-[#1a1714]"),
    @("bg-slate-800", "bg-[#2a2420]"),
    @("bg-slate-700", "bg-[#3a3028]"),
    @("bg-slate-600", "bg-[#4a433a]"),
    @("bg-slate-500", "bg-[#5a4f45]"),
    @("bg-slate-400", "bg-[#6b6258]"),
    @("bg-slate-300", "bg-[#d4ccc0]"),
    @("bg-slate-200", "bg-[#e8e2d4]"),
    @("bg-slate-100", "bg-[#f0ebe2]"),
    @("bg-slate-50", "bg-[#fdfbf7]"),
    @("bg-white", "bg-[#fefaf5]"),
    @("border-white", "border-[#fdfbf7]"),
    @("text-slate-800", "text-[#2d3748]"),
    @("text-slate-700", "text-[#4a433a]"),
    @("text-slate-600", "text-[#6b6258]"),
    @("text-slate-500", "text-[#9a9186]"),
    @("text-slate-400", "text-[#b8aea5]"),
    @("text-slate-300", "text-[#c4baa8]"),
    @("text-slate-200", "text-[#d4ccc0]"),
    @("text-slate-100", "text-[#e8e2d4]"),
    @("text-white", "text-[#fdfbf7]"),
    @("dark:bg-slate-800", "dark:bg-[#2a2420]"),
    @("dark:bg-slate-700", "dark:bg-[#3a3028]"),
    @("dark:bg-slate-600", "dark:bg-[#4a433a]"),
    @("dark:bg-slate-500", "dark:bg-[#5a4f45]"),
    @("dark:bg-slate-200", "dark:bg-[#e8e2d4]"),
    @("dark:border-slate-200", "dark:border-[#3a332c]"),
    @("dark:text-slate-200", "dark:text-[#c4baa8]"),
    @("dark:text-slate-300", "dark:text-[#a89988]"),
    @("dark:text-slate-400", "dark:text-[#8a7f75]"),
    @("dark:text-slate-500", "dark:text-[#7a6f65]"),
    @("dark:text-slate-600", "dark:text-[#6b6258]"),
    @("dark:text-slate-700", "dark:text-[#4a433a]"),
    @("dark:text-slate-800", "dark:text-[#2d3748]"),
    @("focus-visible:ring-slate-200", "focus-visible:ring-[#e2ddd0]"),
    @("bg-[#f8fafc]", "bg-[#fdfbf7]"),
    @("background: #f8fafc", "background: #fdfbf7"),
    @("background: #f1f5f9", "background: #f4f1ea"),
    @("rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.25)"),
    @("rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.15)"),
    @("rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.08)"),
    @("rgba(0, 0, 0, 0.3)", "rgba(30, 25, 20, 0.2)"),
    @("rgba(0, 0, 0, 0.2)", "rgba(40, 35, 25, 0.12)"),
    @("hover:bg-slate-100", "hover:bg-[#e8e2d4]"),
    @("border-slate-200", "border-[#e2ddd0]"),
    @("border-slate-300", "border-[#ddd0bc]")
)

$TotalChanged = 0
foreach ($file in $Files) {
    $fullPath = Join-Path $REPO_ROOT $file
    if (-Not (Test-Path $fullPath)) { continue }

    $content = Get-Content $fullPath -Raw
    $changed = $false
    $count = 0

    foreach ($rep in $Replacements) {
        $from = $rep[0]
        $to = $rep[1]
        if ($content.IndexOf($from) -ge 0) {
            $newContent = $content -replace [regex]::Escape($from), $to
            if ($newContent -ne $content) {
                $content = $newContent
                $changed = $true
                $count++
            }
        }
    }

    if ($changed) {
        $content | Set-Content $fullPath -Force
        Write-Host "CHANGED: $file"
        Write-Host "  $count replacements" -ForegroundColor Green
        $TotalChanged++
    }
}

Write-Host ""
Write-Host "Total files changed: $TotalChanged" -ForegroundColor Yellow
Write-Host "Done."
