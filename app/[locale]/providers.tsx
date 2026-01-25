"use client";

import { FastSearchProvider } from "@/components/wrappers/FastSearch";
import { I18nProviderClient } from "@/locales/client";
import { PropsWithChildren } from "react";
import { ThemeProviders } from "./themeprovider";

export const Providers = (props: PropsWithChildren<{ locale: string }>) => {
  return (
    <I18nProviderClient locale={props.locale}>
      <ThemeProviders>
        <FastSearchProvider>{props.children}</FastSearchProvider>
      </ThemeProviders>
    </I18nProviderClient>
  );
};
