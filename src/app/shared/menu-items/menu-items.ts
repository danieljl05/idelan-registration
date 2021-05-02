import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: "meetings", type: "link", name: "Encuentros", icon: "today" },
  { state: "users", type: "link", name: "Miembros", icon: "person" },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
