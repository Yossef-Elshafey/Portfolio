const container = document.getElementById("container") as HTMLDivElement;
const creds: string[] = [];
const localKey: "credentials" = "credentials";

// overflow-y container is always viewed from the bottom
function alwaysOnBottom() {
  container.scrollTop = container.scrollHeight;
}

function errorHappend(errText = "hey you, add value", fontsize = false) {
  const span = document.createElement("span");
  span.innerHTML = errText;
  if (fontsize) {
    span.style.fontSize = "1rem";
  }
  span.classList.add("red-error");
  return span;
}

// some info display after (login, previously logged in)
function guide() {
  const p = document.createElement("p");
  p.innerHTML = "Now you wanna know how this thing works<br/>";
  p.innerHTML += "unfortunately me too<br/>";
  p.innerHTML +=
    "but for now what i can say just type <span class='red-error'>cd /error</span> then press enter<br/>";
  p.innerHTML +=
    "this triggers an http call to my web server some where in the universe<br/>";
  p.innerHTML += "you gonna get the commands you need<br/>";

  p.innerHTML += "Thx for you visit<br/>";

  p.classList.add("guide");
  p.classList.add("typing-anim");
  return p;
}

// Login begin
//
// for non logged in users
function* genLoginInp() {
  yield container.appendChild(createLogInput("User"));
  yield container.appendChild(createLogInput("Password"));
}

const createLogInput = (hint: string) => {
  /*
   * ${Hint} : Text display next to prompt determine which value should be added
   */
  const div = document.createElement("div");
  const inpFor = document.createElement("span");
  const input = document.createElement("input");

  // remove the error element if there were one
  input.onchange = () => {
    if (input.value.length !== 0) {
      const errorElement = document.querySelector(".red-error");
      if (errorElement) {
        container.removeChild(errorElement);
      }
    }
  };

  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      const value = input.value;
      if (value.length === 0) {
        // display error element
        container.appendChild(errorHappend());
      } else {
        // add the values to creds array which going to be stored in local storage
        // no authentication process just for the vipe and check for previously logged in users
        creds.push(value);
        input.disabled = true;
      }
    }
  };

  inpFor.innerHTML = `${hint} >> `;
  input.classList.add("command");
  input.type = "text";
  if (hint.toLowerCase() === "password") {
    input.type = "password";
  }

  div.id = "login";
  div.appendChild(inpFor);
  div.appendChild(input);
  return div;
};

const loginManager = () => {
  // get the in order values of generator function (genLoginInp)
  // credentials check then add values to localStorage
  const generator = genLoginInp();
  generator.next();
  const handler = setInterval(() => {
    if (creds[0]) {
      // once creds[0] which is ( username )
      // generate the next input ( password )
      generator.next();
    }

    if (creds[1]) {
      window.localStorage.setItem(localKey, JSON.stringify(creds));
      clearInterval(handler); //
    }
  }, 500);
};

// Login end

// Req, Res begin
async function call(path: string, cd: string) {
  try {
    const url = "http://127.0.0.1:3000";
    const res = await fetch(`${url}${path}`);
    if (res.ok) {
      const holders = document.querySelectorAll(".command");

      holders.forEach((holder) => {
        if (holder instanceof HTMLInputElement) holder.disabled = true;
      });

      if (cd.toLowerCase() !== "cd") {
        container.append(errorHappend("write cd buddy it gives a vipe", true));
      }
      askForPrompt();
    }
    return await res.text();
  } catch {
    container.append(
      errorHappend("Be a polite user add valid path or execute cd /error"),
    );
    askForPrompt();
  }
}

function askForPrompt() {
  const div = document.createElement("div");
  const input = document.createElement("input");
  const span = document.createElement("span");

  input.onkeydown = async (e) => {
    if (e.key === "Enter") {
      if (input.value.length === 0) {
        container.appendChild(errorHappend());
      } else {
        const value = input.value.split(" ");
        const res = await call(value[value.length - 1], value[0]);
        div.innerHTML = ` ${value[value.length - 1]} ${res} `;
        alwaysOnBottom();
      }
    }
  };

  input.classList.add("command");
  span.innerHTML = ">> ";
  div.appendChild(span);
  div.appendChild(input);
  div.classList.add("sender");
  container.appendChild(div);
  input.focus();
}

// Req, Res end

document.addEventListener("DOMContentLoaded", function () {
  loginManager();
  const handler = setInterval(() => {
    if (window.localStorage.getItem(localKey)) {
      const loginDiv = document.getElementById("login");
      if (loginDiv) {
        container.removeChild(loginDiv);
      }
      container.appendChild(guide());
      askForPrompt();
      clearInterval(handler); //
    }
  }, 500);
});
