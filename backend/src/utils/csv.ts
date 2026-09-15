/**
 * RFC4180-style CSV field escaping. Wraps a field in double quotes whenever
 * it contains a comma, quote, or newline (doubling any internal quotes) so
 * free-text values — product/customer names, review comments, etc. — can't
 * shift columns the way the Newsletter export's unescaped join() does.
 */
function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCsvField).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCsvField).join(","));
  }
  return lines.join("\r\n");
}

export function sendCsv(res: import("express").Response, filename: string, csv: string) {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  // UTF-8 BOM so Excel (Windows) doesn't mangle non-ASCII characters (₹, Marathi text, etc.).
  res.send(`﻿${csv}`);
}
