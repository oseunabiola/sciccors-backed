module.exports = {
  logger: function logger(error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
    console.log(new Date().toISOString(), "|", JSON.parse(JSON.stringify(error)));
  },
};
