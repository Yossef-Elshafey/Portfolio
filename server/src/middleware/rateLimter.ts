import { IncomingMessage, ServerResponse } from "http";

let requestLogs: { [key: string]: number[] } = {};

const MAX_REQ = 30;
const TIME_FRAME = 60 * 1000; // 60 seconds in milliseconds

const cleanupRequestLogs = () => {
  const now = Date.now();
  Object.keys(requestLogs).forEach((ip) => {
    requestLogs[ip] = requestLogs[ip].filter(
      (timestamp) => now - timestamp < TIME_FRAME,
    );
    if (requestLogs[ip].length === 0) {
      delete requestLogs[ip];
    }
  });
};

setInterval(cleanupRequestLogs, TIME_FRAME);

export const requestHandler = (req: IncomingMessage) => {
  const now = Date.now();
  let ip = req.socket.remoteAddress || "unknown";

  if (!requestLogs[ip]) {
    requestLogs[ip] = [];
  }

  requestLogs[ip] = requestLogs[ip].filter(
    (timestamp) => now - timestamp < TIME_FRAME,
  );

  requestLogs[ip].push(now);

  if (requestLogs[ip].length > MAX_REQ) {
    return false;
  }
  console.log(`Request from ${ip}: ${requestLogs[ip].length}`);
  return true;
};
