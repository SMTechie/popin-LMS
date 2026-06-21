"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdMiddleware = void 0;
const uuid_1 = require("uuid");
class RequestIdMiddleware {
    use(req, res, next) {
        const existing = req.headers["x-request-id"];
        const requestId = existing || (0, uuid_1.v4)();
        req.headers["x-request-id"] = requestId;
        res.setHeader("x-request-id", requestId);
        next();
    }
}
exports.RequestIdMiddleware = RequestIdMiddleware;
//# sourceMappingURL=request-id.middleware.js.map