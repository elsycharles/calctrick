import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { OfflineGuide } from "@/components/OfflineGuide";

describe("OfflineGuide", () => {
  it("opens installation instructions and closes them", async () => {
    const user = userEvent.setup();
    render(<OfflineGuide />);

    await user.click(screen.getByRole("button", { name: "Works offline" }));

    expect(screen.getByRole("dialog", { name: "Keep CalcTrick ready anywhere" })).toBeVisible();
    expect(screen.getByText("iPhone or iPad")).toBeVisible();
    expect(screen.getByText("Android")).toBeVisible();
    expect(screen.getByText("Computer")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Close offline guide" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
