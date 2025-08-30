import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  if (params.has("table"))
    params.set("table", normalizeTable(params.get("table")!));

  mergeAndSetColumns(params);

  params.set("source_id", process.env.ELECTRIC_SOURCE_ID!);
  params.set("secret", process.env.ELECTRIC_SECRET!);

  const electricUrl = `https://api.electric-sql.cloud/v1/shape?${params}`;

  const response = await fetch(electricUrl, {
    headers: {
      "Accept-Encoding": "identity",
    },
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

function quotePgIdent(ident: string): string {
  if (ident.startsWith('"') && ident.endsWith('"')) return ident;
  if (/^[a-z_][a-z0-9_]*$/.test(ident)) return ident;
  return `"${ident}"`;
}

function normalizeTable(input: string): string {
  const raw = input.trim();
  const parts = raw.split(".");
  const qualified = parts.length === 1 ? ["public", parts[0]] : parts;
  return qualified.map((p) => quotePgIdent(p)).join(".");
}

function mergeAndSetColumns(params: URLSearchParams): void {
  const columnsParams = [
    ...params.getAll("columns"),
    ...params.getAll("columns[]"),
  ];
  if (columnsParams.length === 0) return;

  const rawCols = columnsParams.flatMap((v) => v.split(","));
  const cleaned = rawCols.map((s) => s.trim()).filter(Boolean);
  const quoted = cleaned.map((col) => quotePgIdent(col));
  params.set("columns", quoted.join(","));
}
