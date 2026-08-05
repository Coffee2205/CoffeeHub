import { spawnSync } from "node:child_process";

const session = "coffeehub07e-final";
function browser(...args) {
  const result = spawnSync("npx.cmd", ["--no-install", "agent-browser", "--session", session, ...args], { encoding: "utf8", shell: true });
  if (result.status !== 0) throw new Error(`Browser command failed: ${args[0]}\n${result.stderr}`);
  return result.stdout.trim();
}

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;
if (!email || !password) throw new Error("Missing Admin E2E credentials.");

const baseUrl = "http://localhost:3131";
const fixturePath = "C:\\tmp\\coffeehub-admin-preview-desktop.png";
const altText = `Avatar kiểm thử development CoffeeHub ${Date.now()}`;

browser("open", `${baseUrl}/login`);
if (browser("get", "url").includes("/login")) {
  browser("fill", "input[name=email]", email);
  browser("fill", "input[name=password]", password);
  browser("click", "button[type=submit]");
  browser("wait", "2000");
}
console.log(`LOGIN_URL=${browser("get", "url")}`);

browser("open", `${baseUrl}/admin/profile`);
browser("wait", "1000");
browser("upload", "input[name=file]", fixturePath);
browser("fill", "input[name=altText]", altText);
browser("eval", "document.querySelector('input[name=file]').form.requestSubmit()");
browser("wait", "2000");
console.log(`ADMIN_IMAGE_COUNT=${browser("eval", "document.images.length")}`);
console.log(`ADMIN_OVERLAY=${browser("eval", "Boolean(document.querySelector('[data-nextjs-dialog]'))")}`);

for (const [width, height, label] of [[1440, 1000, "DESKTOP"], [390, 844, "MOBILE"]]) {
  browser("set", "viewport", String(width), String(height));
  for (const [path, route] of [["/", "HOME"], ["/about", "ABOUT"]]) {
    browser("open", `${baseUrl}${path}`);
    browser("wait", "1000");
    console.log(`${route}_${label}_IMAGE_COUNT=${browser("eval", "document.images.length")}`);
    console.log(`${route}_${label}_OVERFLOW=${browser("eval", "document.documentElement.scrollWidth-document.documentElement.clientWidth")}`);
    console.log(`${route}_${label}_OVERLAY=${browser("eval", "Boolean(document.querySelector('[data-nextjs-dialog]'))")}`);
    browser("screenshot", `C:\\tmp\\coffeehub-07e-${route.toLowerCase()}-${label.toLowerCase()}.png`, "--full");
  }
}

browser("open", `${baseUrl}/admin/profile`);
browser("wait", "1000");
browser("eval", "window.confirm=function(){return true}");
browser("find", "role", "button", "click", "--name", "Xóa avatar");
browser("wait", "1500");
console.log(`DELETE_SUCCESS=${browser("eval", "document.body.innerText.includes('Avatar đã được xóa.')")}`);
console.log(`DELETE_IMAGE_COUNT=${browser("eval", "document.images.length")}`);
console.log(`DELETE_OVERLAY=${browser("eval", "Boolean(document.querySelector('[data-nextjs-dialog]'))")}`);
browser("close");
