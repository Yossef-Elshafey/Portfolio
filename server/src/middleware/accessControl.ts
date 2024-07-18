import { IncomingMessage, ServerResponse } from "http";
interface ResponseSchema {
  status?: number;
  msg?: string;
}

/*
 * Cors implementation through { Access-Control-Allow-Origin }
 
 * {I_TRUST} Define signle trusted server speaks with me
 
 * * * * * *
 * Local Test
 * change the port sends the request then,
 * Who are you should be returned
 * * * * * *
 * { isTrusted = true } for devel
 */

const I_TRUST = "http://127.0.0.1:8080";

export function resSchema(
  res: ServerResponse,
  req: IncomingMessage,
  schema: ResponseSchema,
) {
  const isTrusted = req.headers.origin === I_TRUST;

  if (isTrusted) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = schema.status!;
    res.setHeader("Access-Control-Allow-Origin", `${I_TRUST}`);
    res.end(schema.msg);
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 403;
    res.end("Who are you ?");
  }
}
