const path = require("path");
const fs = require("fs").promises;

async function _sd_main(arg) {
  const promptPath = path.join(__dirname, "../system_prompt.txt");

  let fileSystemPrompt = "";
  try {
    fileSystemPrompt = (await fs.readFile(promptPath, "utf-8")).trim();
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to read the system prompt file.");
    }
  }

  const options = {
    viewName: arg?.viewName,
    query: arg?.query,
    userPrompt: arg?.userPrompt,
    systemPrompt: fileSystemPrompt || arg?.systemPrompt,
  };

  return call_ai(arg?.userPrompt, options);
}
