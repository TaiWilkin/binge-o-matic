import { spawn } from "child_process";

const args = ["start"];
const opts = { stdio: "inherit", cwd: "client", shell: true };

spawn("npm", args, opts);
