require("dotenv").config();

const { HIDDEN_URI } = process.env;

module.exports = [
  "NoMAGuild", "No Mummy Allowed Guild", // Namimng
  8192, 3, // Limits (supply, perwallet)
  "", // URL for Metadata starts empty
  HIDDEN_URI // URL for hidden metadata
];