import json
import sys
import zipfile
from datetime import datetime, timedelta
from xml.etree import ElementTree as ET

sys.stdout.reconfigure(encoding="utf-8")

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships", "p": "http://schemas.openxmlformats.org/package/2006/relationships"}

def column_index(reference):
    letters = "".join(character for character in reference if character.isalpha())
    result = 0
    for letter in letters:
        result = result * 26 + ord(letter.upper()) - 64
    return result - 1

def read_cell(cell, shared):
    kind = cell.get("t")
    if kind == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//m:t", NS))
    value = cell.findtext("m:v", default="", namespaces=NS)
    if kind == "s" and value:
        return shared[int(value)]
    if kind == "b":
        return value == "1"
    return value

def main(path, sheet_name):
    with zipfile.ZipFile(path) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = ["".join(node.text or "" for node in item.findall(".//m:t", NS)) for item in root.findall("m:si", NS)]
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {item.get("Id"): item.get("Target") for item in relationships.findall("p:Relationship", NS)}
        sheet = next((item for item in workbook.findall("m:sheets/m:sheet", NS) if item.get("name") == sheet_name), None)
        if sheet is None:
            raise ValueError(f"Missing worksheet: {sheet_name}")
        target = targets[sheet.get(f"{{{NS['r']}}}id")].lstrip("/")
        sheet_path = target if target.startswith("xl/") else f"xl/{target}"
        root = ET.fromstring(archive.read(sheet_path))
        matrix = []
        for row in root.findall("m:sheetData/m:row", NS):
            cells = {}
            for cell in row.findall("m:c", NS):
                cells[column_index(cell.get("r", "A1"))] = read_cell(cell, shared)
            if cells:
                matrix.append([cells.get(index, "") for index in range(max(cells) + 1)])
        if not matrix:
            raise ValueError("Worksheet is empty")
        headers = [str(value).strip() for value in matrix[0]]
        records = []
        for values in matrix[1:]:
            record = {header: values[index] if index < len(values) else "" for index, header in enumerate(headers) if header}
            date_value = record.get("Ngày")
            if date_value:
                try:
                    record["Ngày"] = (datetime(1899, 12, 30) + timedelta(days=float(date_value))).date().isoformat()
                except (TypeError, ValueError):
                    pass
            records.append(record)
        print(json.dumps({"sheet": sheet_name, "headers": headers, "rows": records}, ensure_ascii=False))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: parse-study-plan-xlsx.py <xlsx> <sheet>")
    main(sys.argv[1], sys.argv[2])
