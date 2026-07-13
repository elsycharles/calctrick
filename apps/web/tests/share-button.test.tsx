import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ShareButton } from "@/components/ShareButton";

afterEach(() => {
  vi.restoreAllMocks();
  setNavigatorProperty("share", undefined);
  setNavigatorProperty("canShare", undefined);
  setNavigatorProperty("clipboard", undefined);
});

describe("ShareButton", () => {
  it("opens the native share sheet when it is available", async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    setNavigatorProperty("share", share);
    setNavigatorProperty("canShare", vi.fn(() => true));
    window.history.replaceState(null, "", "/?a=24&op=mul&b=25");

    render(<ShareButton expression="24 × 25" />);
    await user.click(screen.getByRole("button", { name: "Share calculation" }));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "24 × 25 made easier with CalcTrick",
        url: "http://localhost:3000/?a=24&op=mul&b=25",
      }),
    );
    expect(screen.getByRole("button", { name: "Share calculation" })).toHaveTextContent(
      "Shared",
    );
  });

  it("copies the URL when native sharing fails", async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockRejectedValue(new Error("Sharing is unavailable"));
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorProperty("share", share);
    setNavigatorProperty("clipboard", { writeText });
    window.history.replaceState(null, "", "/?a=38&op=add&b=27");

    render(<ShareButton expression="38 + 27" />);
    await user.click(screen.getByRole("button", { name: "Share calculation" }));

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("http://localhost:3000/?a=38&op=add&b=27"),
    );
    expect(screen.getByRole("button", { name: "Share calculation" })).toHaveTextContent(
      "Link copied",
    );
  });

  it("shows the URL when automatic sharing and copying are blocked", async () => {
    const user = userEvent.setup();
    setNavigatorProperty("clipboard", undefined);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => false),
    });
    window.history.replaceState(null, "", "/?a=85&op=div&b=5");

    render(<ShareButton expression="85 ÷ 5" />);
    await user.click(screen.getByRole("button", { name: "Share calculation" }));

    expect(await screen.findByRole("dialog", { name: "Copy calculation link" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Calculation link" })).toHaveValue(
      "http://localhost:3000/?a=85&op=div&b=5",
    );
  });
});

function setNavigatorProperty(name: "share" | "canShare" | "clipboard", value: unknown) {
  Object.defineProperty(navigator, name, {
    configurable: true,
    value,
  });
}
