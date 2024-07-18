import { IncomingMessage, ServerResponse } from "http";
import { resSchema } from "./middleware/accessControl";

type View = (res: ServerResponse, req: IncomingMessage) => void;
const mapper: Map<string, View> = new Map();

export function mapPathToView(path: string, view: View) {
  mapper.set(path, view);
}

export function isPathExist(
  reqPath: string,
  res: ServerResponse,
  req: IncomingMessage,
) {
  const paths = Array.from(mapper.keys());
  const exist = Boolean(mapper.get(reqPath));

  if (!exist) {
    resSchema(res, req, {
      status: 200,
      msg: `Bad command from a bad user\nValid are\ncd\n${Array.from(paths).join("\n")}`,
    });
    return;
  }

  mapper.get(reqPath)?.(res, req);
  return;
}
