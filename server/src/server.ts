import { IncomingMessage, ServerResponse } from "http";
import {
  certificate,
  etctra,
  gallery,
  portfolio,
  root,
  technologies,
} from "./views";
import { isPathExist, mapPathToView } from "./urlController";
import { requestHandler } from "./middleware/rateLimter";
import { resSchema } from "./middleware/accessControl";

const http = require("http");

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const handler = requestHandler(req);
    if (handler) {
      mapPathToView("/", root);
      mapPathToView("/dev", technologies);
      mapPathToView("/etc", etctra);
      mapPathToView("/cert", certificate);
      mapPathToView("/code", gallery);
      mapPathToView("/self", portfolio);
      isPathExist(req.url as string, res, req); // if the request path not in defined routes
    } else {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 1);
      resSchema(res, req, {
        status: 429,
        msg: `<p>Rate limit exceded Refresh after ${date}</p>`,
      });
    }
  },
);

// Start the server
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
