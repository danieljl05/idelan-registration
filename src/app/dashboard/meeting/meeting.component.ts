import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, MatPaginator } from "@angular/material";
import { Path } from "th-ng-commons";

@Component({
  selector: "app-meeting",
  templateUrl: "./meeting.component.html",
  styleUrls: ["./meeting.component.css"],
})
export class MeetingComponent implements OnInit {
  ready: boolean;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["position", "date", "actions"];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {
    this.ready = false;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.initData([
      {
        position: 1,
        date: "May 2021",
        id: "asdasdasdasdad",
      },
      {
        position: 2,
        date: "Jul 2021",
        id: "lslsllsls",
      },
      {
        position: 3,
        date: "Ago 2021",
        id: "lslsllsls",
      },
    ]);
  }

  initData(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.ready = true;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  print(id) {}

  public get lPath(): Path[] {
    return [{ isActive: true, label: "Encuentros", url: "" }];
  }
}
