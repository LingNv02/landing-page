async function _sd_main(arg) {
  const options = {
    viewName: arg?.viewName,
    query: arg?.query,
    userPrompt: arg?.userPrompt,
  };
  console.log("callAiSif.js _sd_main options", options);
  const content = await call_ai(arg?.userPrompt, options);
  return content;
}
