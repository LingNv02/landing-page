const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "../sdscript/callAiSif.js"), "utf8");

async function invoke(arg) {
  let invocation;
  const sandbox = {
    require,
    __dirname: path.join(__dirname, "../sdscript"),
    console,
    call_ai: async (userPrompt, options) => {
      invocation = { userPrompt, options };
      return "ok";
    },
  };
  vm.runInNewContext(`${source}\nthis.main = _sd_main;`, sandbox);
  const result = await sandbox.main(arg);
  return { result, invocation };
}

(async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "system-prompt-"));
  const customPrompt = path.join(tempDir, "prompt.txt");
  fs.writeFileSync(customPrompt, "  Custom prompt  \n");

  const custom = await invoke({ filePath: customPrompt, userPrompt: "Hello" });
  assert.strictEqual(custom.result, "ok");
  assert.strictEqual(custom.invocation.options.systemPrompt, "Custom prompt");

  const fallback = await invoke({
    filePath: path.join(tempDir, "missing.txt"),
    systemPrompt: "Fallback prompt",
  });
  assert.strictEqual(fallback.invocation.options.systemPrompt, "Fallback prompt");

  const noArgument = await invoke();
  assert.strictEqual(noArgument.invocation.userPrompt, undefined);

  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("callAiSif tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
