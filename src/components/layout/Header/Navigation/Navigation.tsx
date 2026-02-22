import { ComponentType, SVGProps } from "react";
import { NavLink } from "./NavLink";
import { LinkLikeNavbarItemProps } from "@theme/NavbarItem";

export interface NavigationSublink {
  name: string;
  external?: boolean;
  href: string;
  description?: string;
  wide?: boolean;
  footerLink?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export type INavLink = LinkLikeNavbarItemProps & { docId: string };

type INavigation = INavLink[];

export const NAVIGATION: INavigation = [
  {
    type: "doc",
    docId: "developers/getting-started/intro-to-permguard",
    position: "left",
    label: "Developers",
  },
  {
    type: "doc",
    docId: "command-line/command-line",
    position: "left",
    label: "Command-Line",
  },
  {
    type: "doc",
    docId: "control-plane/control-plane",
    position: "left",
    label: "Control Plane",
  },
  {
    type: "doc",
    docId: "data-plane/data-plane",
    position: "left",
    label: "Data Plane",
  },
  {
    type: "doc",
    docId: "trust-plane/trust-plane",
    position: "left",
    label: "Trust Plane",
  },
  {
    type: "doc",
    docId: "learn/learn",
    position: "left",
    label: "Learn",
  },
];

export const Navigation = () => {
  return (
    <nav
      className="flex-1 hidden min-[997px]:flex px-1.5 lg:px-3 max-w-[675px]"
      role="navigation"
    >
      <ul className="gap-1.25 w-full justify-between flex">
        {NAVIGATION.map((el) => (
          <li key={el.docId}>
            <NavLink {...el} />
          </li>
        ))}
      </ul>
    </nav>
  );
};
