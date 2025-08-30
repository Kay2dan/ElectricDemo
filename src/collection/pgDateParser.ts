/**
 * Why three functions?
 * ElectricSQL applies parsers by Postgres column TYPE, not by column name.
 * We cover the three date-like Postgres types that can appear in your schema:
 * - 'timestamptz'  (timestamp with time zone)
 * - 'timestamp'    (timestamp without time zone)
 * - 'date'         (calendar date only)
 * Each needs slightly different handling to avoid timezone drift and parsing pitfalls.
 */

/**
 * Parse Postgres 'timestamptz' (timestamp with time zone).
 * These strings include an explicit timezone offset or 'Z'.
 * JS Date understands ISO-8601 with TZ, so we safely construct Date directly.
 */
export function parseTimestamptz(date: string): Date {
  return new Date(date);
}

/**
 * Parse Postgres 'timestamp' (without time zone).
 * These often come as 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DDTHH:mm:ss' with no TZ.
 * If no timezone is present, we treat it as UTC to avoid local-time skew.
 * - Normalize space to 'T' so it's ISO-like.
 * - If no TZ is detected, append 'Z' (UTC) before constructing the Date.
 */
export function parseTimestamp(date: string): Date {
  const t = date.includes('T') ? date : date.replace(' ', 'T');
  const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}$/.test(t);
  return new Date(hasTZ ? t : t + 'Z');
}

/**
 * Parse Postgres 'date' (calendar-only, no time component).
 * JS Date('YYYY-MM-DD') is interpreted as UTC midnight for that calendar date.
 * Constructing Date directly preserves consistent behavior across environments.
 */
export function parseDateOnly(date: string): Date {
  return new Date(date);
}

/**
 * Shared ElectricSQL parser object keyed by Postgres type name.
 * Use in shapeOptions: { parser: pgDateParser }
 */
export const pgDateParser = {
  timestamptz: parseTimestamptz,
  timestamp: parseTimestamp,
  date: parseDateOnly,
};
