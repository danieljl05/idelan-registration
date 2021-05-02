import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { ChartistModule } from "ng-chartist";
import { UserComponent } from "./user/user.component";
import { SharedModule } from "../shared/shared.module";
import {
  DialogUserCreation,
  RegistryComponent,
} from "./registry/registry.component";
import { MeetingComponent } from "./meeting/meeting.component";
import { ThousandsPipe } from "../pipes/thousand.pipe";

@NgModule({
  imports: [
    RouterModule.forChild(DashboardRoutes),
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ChartistModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    RegistryComponent,
    MeetingComponent,
    DialogUserCreation,
    ThousandsPipe
  ],
  entryComponents: [DialogUserCreation],
})
export class DashboardModule {}
