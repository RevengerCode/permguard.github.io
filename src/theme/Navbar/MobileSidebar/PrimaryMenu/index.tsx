import React, { type ReactNode } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import { SocialLinks } from "@site/src/components/layout/Header/SocialLinks";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();

  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems().filter(
    (el) => el.type !== "docsVersionDropdown",
  );

  return (
    <>
      <ul className="menu__list">
        {items.map((item, i) => (
          <NavbarItem
            mobile
            {...item}
            onClick={() => mobileSidebar.toggle()}
            key={i}
          />
        ))}
      </ul>
      <div className="mt-auto mb-0 mx-auto [&>a]:text-white [&>a]:hover:text-fuchsia-500!">
        <NavbarItem
          items={[]}
          dropdownItemsBefore={[]}
          dropdownItemsAfter={[]}
          position="right"
          type="docsVersionDropdown"
        />
      </div>
      <div className="flex gap-6 justify-center items-center p-6 pb-2 mb-2">
        <SocialLinks disabledHover />
      </div>
    </>
  );
}
