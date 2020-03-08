param (
  [string]$target
)

$target = $target + "\node_modules\jsonpath-mapper"

If (-not (Test-Path $target)) {
  New-Item $target -ItemType Directory
}

If (-not (Test-Path ($target + "\lib"))) {
  New-Item ($target + "\lib") -ItemType Directory
}

npm run build
Copy-Item -Path .\package.json -Destination $target
Copy-Item -Path .\package-lock.json -Destination $target
Copy-Item -Path .\lib\jsonpath-mapper.js -Destination ($target + "\lib")
Copy-Item -Path .\lib\jsonpath-mapper.js.map -Destination ($target + "\lib")
