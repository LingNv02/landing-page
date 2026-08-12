async function _sd_main(arg) {
  const options = {
    viewName: arg?.viewName,
    query: arg?.query,
    userPrompt: arg?.userPrompt,
    hit: 8,
  };

  const content = await call_ai(arg?.userPrompt, options);
  return content;
}
