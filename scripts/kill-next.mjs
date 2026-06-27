import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

/** next dev / next start プロセスを停止（.next 破損防止） */
export function killNextProcesses() {
  if (process.platform === "win32") {
    try {
      execSync(
        "powershell -NoProfile -Command \"Get-CimInstance Win32_Process -Filter \\\"Name='node.exe'\\\" | Where-Object { $_.CommandLine -match 'next dev|next\\\\dist\\\\bin\\\\next|next start|start-server\\\\.js' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }\"",
        { stdio: "ignore" },
      );
    } catch {
      // 既に停止済み
    }
    return;
  }

  try {
    execSync("pkill -f 'next dev|next start' || true", { stdio: "ignore", shell: true });
  } catch {
    // 既に停止済み
  }
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  killNextProcesses();
}
