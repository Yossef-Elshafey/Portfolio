import { IncomingMessage, ServerResponse } from "http";
import { resSchema } from "./middleware/accessControl";

enum STATUS {
  good = 1,
  notGood = 0,
}
const link = (href: string, innerText: string) => {
  return `<a href=${href} target=_blank>${innerText}</a>`;
};

export function root(res: ServerResponse, req: IncomingMessage) {
  const myStatus = STATUS.notGood;
  resSchema(res, req, {
    msg: myStatus
      ? "<h2>Yossef is fine thx for asking about me</h2>"
      : "<h2>Yossef is not fine thx for asking about me</h2>",
    status: 200,
  });
}

export function technologies(res: ServerResponse, req: IncomingMessage) {
  const techno = {
    python: ["Django", "Django Rest Framework"],
    javascript: ["typescript", "nodejs", "react"],
    css: ["css", "tailwind"],
  };

  const htRes = `
  <h2>Worked with Technologies</h2>
  <p>${techno.python.map((tec) => tec)}</p>
  <p>${techno.javascript.map((tec) => tec)}</p>
  <p>${techno.css.map((tec) => tec)}</p>
  `;

  resSchema(res, req, {
    msg: htRes,
    status: 200,
  });
}

export function etctra(res: ServerResponse, req: IncomingMessage) {
  const infos = {
    proj: "Pycurl",
    code: "Yossef-Elshafey/PyCurl",
    learn: ["nestjs", "bash", "discrete math"],
  };
  const htRes = `
  <h2>Some infos you don't care about</h2>
  <p>i always have project no one cares about except me</p> 
  <a href=https://github.com/${infos.code} target=_blank>${infos.proj}</a>
  <p>Currently Learnning ${infos.learn.join(" - ")}</p>
  `;
  resSchema(res, req, {
    msg: htRes,
    status: 200,
  });
}

export function certificate(res: ServerResponse, req: IncomingMessage) {
  const rootUrl = "https://www.coursera.org/account/accomplishments/verify/";
  const cert = {
    root: rootUrl,
    code: [
      ["3F8KN3M7E5QU", "Basics of React"],
      ["FJYQ6UT6JKE4", "Advanced React"],
      ["G7B3CBPRSQ5Y", "Python"],
      ["8U2RCXWU6WD5", "Databases & SQL"],
      ["FSSYBGBQTFPL", "Django"],
      ["GJAUKCP5MDYM", "Django rest framework"],
    ],
  };

  const htRes = `<h2>Certificates, Still on going though</h2>${cert.code.map((ind) => link(rootUrl + ind[0], ind[1]))}`;

  resSchema(res, req, {
    msg: JSON.stringify(htRes),
    status: 200,
  });
}

export function gallery(res: ServerResponse, req: IncomingMessage) {
  const gal = {
    root: "https://github.com/Yossef-Elshafey/",
    repoName: [
      "tickets-api",
      "cinema-app",
      "countries-api",
      "multi-manager",
      "prac-2",
    ],
  };

  const htRes = `
  <h2>(Front + backend)end projects </h2>
  ${gal.repoName.map((ind) => link(gal.root + ind, ind))}
  `;
  resSchema(res, req, {
    msg: htRes,
    status: 200,
  });
}

export function portfolio(res: ServerResponse, req: IncomingMessage) {
  const repo = "https://github.com/Yossef-Elshafey/Portfolio";
  const htRes = `
  <h2>Every thing in this Portfolio is built from scratch (frontend + webserver)</h2>
  <a href=${repo} target=_blank>Code</a>
`;
  resSchema(res, req, {
    msg: htRes,
    status: 200,
  });
}
