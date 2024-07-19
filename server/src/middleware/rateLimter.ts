import { IncomingMessage } from "http";

// NOTE: Acess origin doesn't accept any request except for ${I_TRUST} origin

let requestLogs: { [key: string]: number[] } = {};

const MAX_REQ = 30;
const TIME_FRAME = 60 * 100; // 60 seconds in milliseconds

const cleanupRequestLogs = () => {
  const now = Date.now();
  Object.keys(requestLogs).forEach((ip) => {
    requestLogs[ip] = requestLogs[ip].filter(
      (reqTime) => now - reqTime < TIME_FRAME,
    );
    if (requestLogs[ip].length === 0) {
      // console.log(requestLogs[ip], "Deleted");
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
  return true;
  // console.log(`Request from ${ip}: ${requestLogs[ip].length}`);
};
