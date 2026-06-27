import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { killNextProcesses } from "./kill-next.mjs";

function removeCacheDirs() {
  for (const dir of [".next", "node_modules/.cache"]) {
    try {
      fs.rmSync(path.join(process.cwd(), dir), { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

killNextProcesses();
removeCacheDirs();
execSync("next dev", { stdio: "inherit", cwd: process.cwd() });
