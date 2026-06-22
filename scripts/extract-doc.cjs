const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const docPath = path.resolve(
  __dirname,
  "../knowledges/vegenews/raw/台灣「蔬食新生活運動」.doc"
);
const outPath = path.resolve(
  __dirname,
  "../knowledges/vegenews/_extract/台灣「蔬食新生活運動」.doc.txt"
);

const psScript = path.resolve(__dirname, "_extract-doc.ps1");
fs.writeFileSync(
  psScript,
  `
$path = ${JSON.stringify(docPath)}
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($path)
$text = $doc.Content.Text
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
$text | Out-File -FilePath ${JSON.stringify(outPath)} -Encoding utf8
Write-Output $text.Length
`,
  "utf8"
);

try {
  const len = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psScript}"`, {
    encoding: "utf8",
  });
  console.log("doc chars:", len.trim());
} catch (e) {
  console.error(e.message);
}
