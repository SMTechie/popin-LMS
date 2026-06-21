"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowAnon = exports.ALLOW_ANON_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ALLOW_ANON_KEY = "allow_anon";
const AllowAnon = () => (0, common_1.SetMetadata)(exports.ALLOW_ANON_KEY, true);
exports.AllowAnon = AllowAnon;
//# sourceMappingURL=allow-anon.decorator.js.map