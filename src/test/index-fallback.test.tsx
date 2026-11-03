import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { I18nProvider } from "@/i18n/I18nContext";
import Index from "@/pages/Index";

// jsdom has no WebGL, so the page must fall back to the flat map instead of the 3D globe.
describe("Index without WebGL", () => {
  it("shows the flat map, the intro and lets a marker open the details", async () => {
    render(<I18nProvider><Index /></I18nProvider>);
    const map = screen.getByTestId("flat-map");
    expect(screen.getByText(/interactive 3D globe of \d+ pyramids/i)).toBeInTheDocument();
    const markers = within(map).getAllByRole("button");
    expect(markers.length).toBeGreaterThan(10);
    fireEvent.click(markers[0]);
    expect(await screen.findAllByText(markers[0].getAttribute("title")!)).not.toHaveLength(0);
  });

  it("has a panel toggle for small screens", () => {
    render(<I18nProvider><Index /></I18nProvider>);
    const toggle = screen.getByRole("button", { name: /filters & list/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
