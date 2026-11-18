// Checks that every local file referenced by an HTML page (href/src) exists.
// Runs in CI so a typo like "assets/profle.svg" fails the build instead of
// shipping a broken image to the live site.
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";

const SITE_DIR = path.resolve("site");

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return htmlFiles(full);
      return e.name.endsWith(".html") ? [full] : [];
    }),
  );
  return files.flat();
}

function isLocal(ref) {
  return !/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(ref);
}

let broken = 0;

for (const file of await htmlFiles(SITE_DIR)) {
  // Strip HTML comments so commented-out links aren't checked.
  const html = (await readFile(file, "utf8")).replace(/<!--[\s\S]*?-->/g, "");
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs.filter(isLocal)) {
    const clean = ref.split(/[?#]/)[0];
    const target = clean.startsWith("/")
      ? path.join(SITE_DIR, clean)
      : path.join(path.dirname(file), clean);
    try {
      await access(target);
    } catch {
      console.error(`✗ ${path.relative(SITE_DIR, file)} → "${ref}" not found`);
      broken++;
    }
  }
}

if (broken) {
  console.error(`\n${broken} broken link(s).`);
  process.exit(1);
}
console.log("✓ All local links and images exist.");
