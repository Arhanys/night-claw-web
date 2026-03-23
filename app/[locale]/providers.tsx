"use client";

import { FastSearchProvider } from "@/components/wrappers/FastSearch";
import { I18nProviderClient } from "@/locales/client";
import { PropsWithChildren } from "react";
import { ThemeProviders } from "./themeprovider";
import { SessionProvider } from "next-auth/react";

export const Providers = (props: PropsWithChildren<{ locale: string }>) => {
  return (
    <SessionProvider>
      <I18nProviderClient locale={props.locale}>
        <ThemeProviders>
          <FastSearchProvider>{props.children}</FastSearchProvider>
        </ThemeProviders>
      </I18nProviderClient>
    </SessionProvider>
  );
};
