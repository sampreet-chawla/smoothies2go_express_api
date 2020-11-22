// The White List Array are urls allowed to make API requests in production mode
// IN dev mode "npm run dev" any source can make a request
var whitelist = ["https://smoothies2go.netlify.app/", "http://localhost:3000/"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
