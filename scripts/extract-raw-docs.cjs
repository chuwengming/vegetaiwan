const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const RAW_DIR = path.resolve(__dirname, "../knowledges/vegenews/raw");
const OUT_DIR = path.resolve(__dirname, "../knowledges/vegenews/_extract");

function extractDocx(filePath) {
  const dest = path.join(OUT_DIR, path.basename(filePath) + "_docx");
  fs.mkdirSync(dest, { recursive: true });
  const zipCopy = path.join(dest, "file.zip");
  fs.copyFileSync(filePath, zipCopy);
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipCopy}' -DestinationPath '${dest}' -Force"`,
    { stdio: "pipe" }
  );
  const xml = fs.readFileSync(path.join(dest, "word", "document.xml"), "utf8");
  return xmlToText(xml);
}

function xmlToText(xml) {
  return xml
    .replace(/<w:tab[^>]*\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractDocViaWord(filePath) {
  const script = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("${filePath.replace(/\\/g, "\\\\")}")
$text = $doc.Content.Text
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
$text
`;
  try {
    return execSync(`powershell -NoProfile -Command "${script.replace(/"/g, '\\"')}"`, {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

async function extractPdf(filePath) {
  try {
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text?.trim() || "";
  } catch {
    return "";
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(RAW_DIR).filter((f) => !f.startsWith("."));

  for (const file of files) {
    const filePath = path.join(RAW_DIR, file);
    const ext = path.extname(file).toLowerCase();
    let text = "";

    console.log(`\n=== ${file} ===`);

    if (ext === ".docx") {
      text = extractDocx(filePath);
    } else if (ext === ".doc") {
      text = extractDocViaWord(filePath) || "";
    } else if (ext === ".pdf") {
      text = await extractPdf(filePath);
    }

    const outFile = path.join(OUT_DIR, file + ".txt");
    fs.writeFileSync(outFile, text, "utf8");
    console.log(`chars: ${text.length}`);
    console.log(text.slice(0, 500));
  }
}

main().catch(console.error);
