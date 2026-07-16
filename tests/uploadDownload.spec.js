const ExcelJs = require("exceljs");
const { test, expect } = require("@playwright/test");
let fruitName = "Mango";

async function writeExcelTest(
  SheetName,
  searchText,
  newValue,
  change,
  filePath,
) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(SheetName);
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(
    output.row + change.rowChange,
    output.column + change.columnChange,
  );
  cell.value = newValue;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      // console.log(cell.value);
      if (cell.value === searchText) {
        console.log(
          "Found " +
            searchText +
            " at Row: " +
            rowNumber +
            ", Column: " +
            colNumber,
        );
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

test("Upload and Download file test", async ({ page }) => {
  const textSearch = "Mango";
  const updatedValue = 350;
  await page.goto(
    "https://rahulshettyacademy.com/upload-download-test/index.html",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#downloadButton").click();
  const download = await downloadPromise;
  // Save file
  const filePath = "/Users/gaurav/Downloads/download.xlsx";
  await download.saveAs(filePath);
  await writeExcelTest(
    "Sheet1",
    textSearch,
    updatedValue,
    { rowChange: 0, columnChange: 2 },
    filePath,
  );
  await page.locator("#fileinput").click();
  await page.locator("#fileinput").setInputFiles(filePath);
  const textLocator = await page.getByText(textSearch);
  const desiredRow = await page.getByRole("row").filter({ has: textLocator });
  await expect(desiredRow).toContainText(updatedValue.toString());
});
