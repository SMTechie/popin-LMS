"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectPluginRegistry = void 0;
const objective_plugin_1 = require("./objective.plugin");
const numeric_plugin_1 = require("./numeric.plugin");
class SubjectPluginRegistry {
    plugins = [new numeric_plugin_1.NumericMarkingPlugin(), new objective_plugin_1.ObjectiveMarkingPlugin()];
    register(plugin) { this.plugins.push(plugin); }
    resolve(subject, questionType) {
        return this.plugins.find((plugin) => plugin.subjects.some((item) => item.toLowerCase() === subject.toLowerCase()) && plugin.supports(questionType))
            || this.plugins.find((plugin) => plugin.supports(questionType));
    }
    describe() { return this.plugins.map(({ key, subjects }) => ({ key, subjects })); }
}
exports.SubjectPluginRegistry = SubjectPluginRegistry;
//# sourceMappingURL=registry.js.map