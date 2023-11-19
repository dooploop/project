module.exports = {
  name: "assets",
  version: 1,
  actions: {
    upload: {
      handler(context) {
        console.log("params", context.params);
        console.log("context.meta.$multipart", context.meta.$multipart);
      }
    }
  }
};
