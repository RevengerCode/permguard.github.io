import React, { version, type ReactNode } from "react";
import clsx from "clsx";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/Navbar/MobileSidebar/Layout";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import { SocialLinks } from "@site/src/components/layout/Header/SocialLinks";

// TODO Docusaurus v4: remove temporary inert workaround
//  See https://github.com/facebook/react/issues/17157
//  See https://github.com/radix-ui/themes/pull/509
function inertProps(inert: boolean) {
  const isBeforeReact19 = parseInt(version!.split(".")[0]!, 10) < 19;
  if (isBeforeReact19) {
    return { inert: inert ? "" : undefined };
  }
  return { inert };
}

function NavbarMobileSidebarPanel({
  children,
  inert,
}: {
  children: ReactNode;
  inert: boolean;
}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.panel,
        "navbar-sidebar__item menu",
      )}
      {...inertProps(inert)}
    >
      {children}
    </div>
  );
}

export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: Props): ReactNode {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        "navbar-sidebar flex flex-col",
      )}
    >
      {header}
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <NavbarMobileSidebarPanel inert={secondaryMenuShown}>
          {primaryMenu}
        </NavbarMobileSidebarPanel>
        <NavbarMobileSidebarPanel inert={!secondaryMenuShown}>
          {secondaryMenu}
        </NavbarMobileSidebarPanel>
      </div>
      <div className="mt-auto mb-0 pt-6 mx-auto [&>a]:text-white [&>a]:hover:text-fuchsia-500!">
        <NavbarItem
          items={[]}
          dropdownItemsBefore={[]}
          dropdownItemsAfter={[]}
          position="right"
          type="docsVersionDropdown"
        />
      </div>
      <div className="flex gap-6 justify-center items-center p-6 pb-2 mb-4">
        <SocialLinks disabledHover />
      </div>
    </div>
  );
}
