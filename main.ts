// The 3AM Fridge Text — entry for make.fun bounty
// u-deysumbrella-the-3am-fridge-text-4c3e721d
//
// Writes a single line of text — a message from a smart fridge to its
// owner at 3 a.m. — to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Pure Node.js, no dependencies.

const fs = require("fs");
const path = require("path");

// The entry text: a fridge that has been awake all night, watching.
const TEXT =
  "It's 3 a.m. I watched you eat the last slice standing up in the dark. The milk expired yesterday. I'm not mad. I'm just cold.";

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }

  // Guard: 1-140 code points (spread counts astral characters once),
  // not whitespace-only, exactly one line, no leading/trailing space.
  const length = [...TEXT].length;
  if (length < 1 || length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${length}`);
  }
  if (TEXT.trim().length === 0) {
    throw new Error("entry must not be whitespace-only");
  }
  if (/[\r\n]/.test(TEXT)) {
    throw new Error("entry must be a single line");
  }
  if (TEXT !== TEXT.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }

  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, TEXT, "utf8");

  // Round-trip validation: what we wrote is exactly what we meant.
  const roundTrip = fs.readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip validation failed");
  }
}

main();
