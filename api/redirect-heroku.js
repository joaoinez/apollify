// module.exports = function(req, res, next) {
//   const host = req.headers.host;
//   const url = req.url;
//   const env = process.env.NODE_ENV || "development";
//   const domain = process.env.DOMAIN || "localhost:3000";

//   if (env === "production" && host !== domain) {
//     res.writeHead(301, { Location: "https://" + domain + url });
//     return res.end();
//   }

//   return next();
// };
