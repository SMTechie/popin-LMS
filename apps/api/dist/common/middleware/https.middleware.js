"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsEnforceMiddleware = void 0;
class HttpsEnforceMiddleware {
    use(req, res, next) {
        if (process.env.NODE_ENV !== "production")
            return next();
        const proto = (req.headers["x-forwarded-proto"] || req.protocol);
        if (proto !== "https") {
            return res.status(400).json({ message: "HTTPS required" });
        }
        next();
    }
}
exports.HttpsEnforceMiddleware = HttpsEnforceMiddleware;
//# sourceMappingURL=https.middleware.js.map