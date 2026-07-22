import type { ZodType } from "zod";
import { invalidConfiguration } from "../domain/errors";

export type ConfigurationDefinition<TValue> = Readonly<{
  code: string;
  schema: ZodType<TValue>;
}>;

export class ConfigurationRegistry {
  readonly #definitions = new Map<string, ConfigurationDefinition<unknown>>();

  constructor(definitions: readonly ConfigurationDefinition<unknown>[] = []) {
    for (const definition of definitions) this.register(definition);
  }

  register<TValue>(definition: ConfigurationDefinition<TValue>) {
    const code = definition.code.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(code)) throw invalidConfiguration({ code: definition.code });
    if (this.#definitions.has(code)) throw invalidConfiguration({ code, reason: "DUPLICATE_REGISTRATION" });
    this.#definitions.set(code, Object.freeze({ ...definition, code }));
    return this;
  }

  has(code: string) {
    return this.#definitions.has(code.trim().toUpperCase());
  }

  parse<TValue>(code: string, value: unknown): TValue {
    const normalized = code.trim().toUpperCase();
    const definition = this.#definitions.get(normalized);
    if (!definition) throw invalidConfiguration({ code: normalized, reason: "UNREGISTERED_CODE" });
    return definition.schema.parse(value) as TValue;
  }

  codes() {
    return Object.freeze([...this.#definitions.keys()]);
  }
}
