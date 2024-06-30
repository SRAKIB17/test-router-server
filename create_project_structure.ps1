# Define the project structure
$projectStructure = @(
    "app_project\",
    "app_project\public\",
    "app_project\public\example.png",
    "app_project\page\",
    "app_project\page\[param]\",
    "app_project\page\[param]\index.ts",
    "app_project\page\index.ts",
    "app_project\page\middleware.ts",
    "app_project\src\",
    "app_project\src\index.ts",
    "app_project\src\utils\",
    "app_project\src\utils\router.ts",
    "app_project\src\utils\serveStatic.ts",
    "app_project\src\utils\types.ts",
    "app_project\.env",
    "app_project\npm_package_name.config.js"
)

# Create directories and files
foreach ($item in $projectStructure) {
    if ($item.EndsWith("\")) {
        New-Item -ItemType Directory -Force -Path $item
    } else {
        New-Item -ItemType File -Force -Path $item
    }
}

Write-Output "Project structure created successfully!"
