/**
 * Log estruturado (JSON por linha) para o CloudWatch Logs Insights filtrar por requestId.
 */
export function logInfo(
  message: string,
  requestId: string,
  extra?: Record<string, unknown>
): void {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...extra,
    })
  );
}

export function logError(
  message: string,
  requestId: string,
  extra?: Record<string, unknown>
): void {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...extra,
    })
  );
}
