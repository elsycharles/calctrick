import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { OfflineGuide } from "@/components/OfflineGuide";

describe("OfflineGuide", () => {
  it("opens installation instructions and closes them", async () => {
    const user = userEvent.setup();
    const { container } = render(<OfflineGuide />);

    await user.click(screen.getByRole("button", { name: "Works offline" }));

    const dialog = screen.getByRole("dialog", { name: "Keep CalcTrick ready anywhere" });
    expect(dialog).toBeVisible();
    expect(container).not.toContainElement(dialog);
    expect(screen.getByRole("button", { name: "iPhone" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Android" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Computer" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Android" }));
    expect(screen.getByText("On Android")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
