const express = require("express");
const helmet = require("helmet");
const uniqueHash = require("unique-hash").default;
const cors = require("cors");
const ApiError = require("./utils/api-error");
const { logger } = require("./utils/logger");

const app = express();

const ALLOWED_ID_ALIAS_CHAR_LENGTH = 20;

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.disable("x-powered-by");
app.disable("etag");

app.use(cors());

app.post("/api/v1/scissors", (req, res, next) => {
  try {
    const url = req.body.url || "";
    let alias = req.body.alias || "";

    alias = alias ? uniqueHash(alias, { format: "kebabCase" }) : alias;

    if (!url) throw ApiError.badRequest("URL to shorten is required");
    if (alias.length > ALLOWED_ID_ALIAS_CHAR_LENGTH)
      throw ApiError.badRequest(
        "Alias not allowed. Please choose an alias of 20 characters or below."
      );

    const uniqueId = uniqueHash(url, { format: "string" });

    const shortenedURL = alias
      ? req.get("origin") + "/" + alias
      : req.get("origin") + "/" + uniqueId;

    // Persist URL

    return res.json({
      message: "scissors responding",
      success: true,
      data: { id: uniqueId, shortenedURL },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/:uniqueId", async (req, res, next) => {
  try {
    const uniqueId = req.params.uniqueId;
    if (!uniqueId) throw ApiError.badRequest("Unique identifier is required");
    if (uniqueId.length > ALLOWED_ID_ALIAS_CHAR_LENGTH)
      throw ApiError.badRequest("Invalid shortened URL");

    // Increment hit counter for this url

    res.json({ success: true, uniqueId });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(ApiError.notFound("Resource not found"));
});

app.use((err, req, res, next) => {
  logger(err);
  let message;
  if (err instanceof ApiError) {
    message = err.message;
  } else {
    message = "Oops! Something went wrong. Please try again later.";
  }
  return res.status(err.code || 500).send({
    success: false,
    message,
    data: {},
  });
});

app.listen(PORT, () => console.log("Server is running on port " + PORT));
