import { describe, expect, it } from "vitest";
import { emit } from "./test-host.js";

describe("optional literal header", () => {
  it("should not send optional header with literal type by default when omitted", async () => {
    const code = `
      import "@typespec/http";
      using Http;
      @service(#{ title: "Repro" })
      @server("{endpoint}", "", { endpoint?: url = "http://localhost:3000" })
      namespace Repro;

      @get op read(@header("Range-Unit") rangeUnit?: "items"): void;
    `;
    const outputs = await emit(code);
    const operationsFile = Object.entries(outputs).find(([k]) =>
      k.includes("Operations.ts"),
    )?.[1];
    expect(operationsFile).toBeDefined();
    expect(operationsFile).not.toContain('?? "items"');
    expect(operationsFile).toContain("options?.rangeUnit");
  });

  it("should still emit default for required header with literal type", async () => {
    const code = `
      import "@typespec/http";
      using Http;
      @service(#{ title: "Repro" })
      @server("{endpoint}", "", { endpoint?: url = "http://localhost:3000" })
      namespace Repro;

      @get op read(@header("Range-Unit") rangeUnit: "items"): void;
    `;
    const outputs = await emit(code);
    const operationsFile = Object.entries(outputs).find(([k]) =>
      k.includes("Operations.ts"),
    )?.[1];
    expect(operationsFile).toBeDefined();
    expect(operationsFile).toContain('?? "items"');
  });

  it("should still emit default for optional header with explicit default value", async () => {
    const code = `
      import "@typespec/http";
      using Http;
      @service(#{ title: "Repro" })
      @server("{endpoint}", "", { endpoint?: url = "http://localhost:3000" })
      namespace Repro;

      @get op read(@header("Range-Unit") rangeUnit?: "items" = "items"): void;
    `;
    const outputs = await emit(code);
    const operationsFile = Object.entries(outputs).find(([k]) =>
      k.includes("Operations.ts"),
    )?.[1];
    expect(operationsFile).toBeDefined();
    expect(operationsFile).toContain('?? "items"');
  });
});
