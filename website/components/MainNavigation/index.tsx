import { flex } from "@/styled-system/patterns";
import { Item } from "./Item";

export const MainNavigation = () => {
  return (
    <nav
      className={flex({
        flex: "1 1 auto",
        direction: "column",
      })}
    >
      <h2>Main Navigation</h2>
      <ul>
        <Item text="Menu 1" href="#" />
        <Item text="Menu 2" href="#" />
        <Item text="Menu 3" href="#" />
      </ul>
    </nav>
  );
};
