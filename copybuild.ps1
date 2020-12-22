param (
  [string]$target
)

$target = $target + "\node_modules\jsonpath-mapper"

If (-not (Test-Path $target)) {
  New-Item $target -ItemType Directory
}

If (-not (Test-Path ($target + "\dist"))) {
  New-Item ($target + "\dist") -ItemType Directory
}

npm run build
Copy-Item -Path .\package.json -Destination $target
Copy-Item -Path .\package-lock.json -Destination $target
Copy-Item -Path .\dist -Filter *.* -Destination $target -Recurse -Force
