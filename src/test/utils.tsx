import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "violet",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
