
$path = "C:\\Users\\chuwe\\Downloads\\Vegetaiwan\\knowledges\\vegenews\\raw\\台灣「蔬食新生活運動」.doc"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($path)
$text = $doc.Content.Text
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
$text | Out-File -FilePath "C:\\Users\\chuwe\\Downloads\\Vegetaiwan\\knowledges\\vegenews\\_extract\\台灣「蔬食新生活運動」.doc.txt" -Encoding utf8
Write-Output $text.Length
