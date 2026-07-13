import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CalculatorApp } from "@/components/CalculatorApp";

describe("CalculatorApp", () => {
  it("solves a calculation, reveals all steps, and reloads it from history", async () => {
    const user = userEvent.setup();
    render(<CalculatorApp />);

    await user.click(screen.getByRole("button", { name: "Solve" }));

    expect(await screen.findByRole("heading", { name: /easier routes?$/i })).toBeVisible();
    expect(screen.getAllByText("600").length).toBeGreaterThan(0);
    expect(screen.queryByText("Divide one factor.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "detailed" }));
    expect(screen.getAllByText("Divide one factor.").length).toBeGreaterThan(0);

    const historyButton = await screen.findByRole("button", { name: "Load 24 × 25" });
    const firstInput = screen.getByRole("spinbutton", { name: "First number" });
    await user.clear(firstInput);
    await user.type(firstInput, "38");

    await user.click(historyButton);

    expect(firstInput).toHaveValue(24);
    expect(screen.getByRole("spinbutton", { name: "Second number" })).toHaveValue(25);
    expect(screen.getByRole("button", { name: "Select multiplication" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("heading", { name: /easier routes?$/i })).not.toBeInTheDocument();
  });

  it("rejects division by zero without showing results", async () => {
    const user = userEvent.setup();
    render(<CalculatorApp />);

    await user.click(screen.getByRole("button", { name: "Select division" }));
    const secondInput = screen.getByRole("spinbutton", { name: "Second number" });
    await user.clear(secondInput);
    await user.type(secondInput, "0");
    await user.click(screen.getByRole("button", { name: "Solve" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Division by zero is not defined.");
    expect(screen.queryByRole("heading", { name: /easier routes?$/i })).not.toBeInTheDocument();
  });

  it("uses one global mode control for every trick card", async () => {
    const user = userEvent.setup();
    render(<CalculatorApp />);

    await user.click(screen.getByRole("button", { name: "Solve" }));
    const modeGroup = await screen.findByRole("group", { name: "Explanation detail" });

    expect(within(modeGroup).getByRole("button", { name: "quick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(within(modeGroup).getByRole("button", { name: "detailed" }));
    expect(within(modeGroup).getByRole("button", { name: "detailed" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getAllByRole("list").length).toBeGreaterThan(1);
  });

  it("loads and solves a calculation from a shareable URL", async () => {
    window.history.replaceState(null, "", "/?a=38&op=add&b=27");

    render(<CalculatorApp />);

    expect(await screen.findByRole("spinbutton", { name: "First number" })).toHaveValue(38);
    expect(screen.getByRole("spinbutton", { name: "Second number" })).toHaveValue(27);
    expect(screen.getByRole("button", { name: "Select addition" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await screen.findByRole("heading", { name: /easier routes?$/i })).toBeVisible();
    expect(screen.getByRole("button", { name: "Share calculation" })).toBeVisible();
  });
});
