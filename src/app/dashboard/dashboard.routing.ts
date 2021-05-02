import { Routes } from "@angular/router";

import { UserComponent } from "./user/user.component";
import { RegistryComponent } from "./registry/registry.component";
import { MeetingComponent } from "./meeting/meeting.component";

export const DashboardRoutes: Routes = [
  { path: "meetings", component: MeetingComponent },
  { path: "meetings/registry", component: RegistryComponent },
  { path: "users", component: UserComponent },
];
