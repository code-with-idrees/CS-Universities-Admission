$data = Import-Csv .\institutions_csrankings.csv
Write-Host "Total universities:" $data.Count
$regions = $data | ForEach-Object { $_.region } | Sort-Object -Unique
Write-Host "Unique regions:" $regions.Count
$regions
$countries = $data | ForEach-Object { $_.countryabbrv } | Sort-Object -Unique
Write-Host "Unique countries:" $countries.Count
