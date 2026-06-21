import { ObjectiveMarkingPlugin } from "./objective.plugin";
import { NumericMarkingPlugin } from "./numeric.plugin";
import { SubjectMarkingPlugin } from "./types";

export class SubjectPluginRegistry {
  private plugins: SubjectMarkingPlugin[] = [new NumericMarkingPlugin(), new ObjectiveMarkingPlugin()];
  register(plugin: SubjectMarkingPlugin) { this.plugins.push(plugin); }
  resolve(subject: string, questionType: string) {
    return this.plugins.find((plugin) => plugin.subjects.some((item) => item.toLowerCase() === subject.toLowerCase()) && plugin.supports(questionType))
      || this.plugins.find((plugin) => plugin.supports(questionType));
  }
  describe() { return this.plugins.map(({ key, subjects }) => ({ key, subjects })); }
}
