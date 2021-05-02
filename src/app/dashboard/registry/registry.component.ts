import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Path } from "th-ng-commons";
import { v4 as uuidv4 } from "uuid";

export interface Person {
  lastname: string;
  name: string;
  cc: string;
  id: string;
}

@Component({
  selector: "app-registry",
  templateUrl: "./registry.component.html",
  styleUrls: ["./registry.component.css"],
})
export class RegistryComponent implements OnInit {
  filteredOptions: Observable<Person[]>;
  personCtrl = new FormControl();
  ready: boolean;

  chosen: Person[];
  options: Person[];

  constructor(public dialog: MatDialog, private toastr: ToastrService) {
    this.ready = false;
  }

  async ngOnInit() {
    await this.initData();
    this.ready = true;
    this.filteredOptions = this.personCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  initData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.options = [
        { id: "1", cc: "1", name: "Mary", lastname: "rodriguez" },
        { id: "2", cc: "2", name: "Shelley", lastname: "rodriguez" },
        { id: "3", cc: "3", name: "Igor", lastname: "rodriguez" },
        { id: "4", cc: "4", name: "John", lastname: "rodriguez" },
        { id: "5", cc: "5", name: "Samuel", lastname: "rodriguez" },
      ];
      this.chosen = [];
      resolve();
    });
  }

  private _filter(search: string): Person[] {
    const filteredOpts = {};
    const words = search.toLowerCase();
    for (const word of words.split(" ")) {
      // It searchs by name and lastname in lowecase for each value that the user writes
      const matches = this.options.filter((person) => {
        return this.belongsToNameOrLastname(word, person);
      });
      // It saves unique values
      for (const match of matches) {
        filteredOpts[match.id] = match;
      }
    }

    return Object.values(filteredOpts);
  }

  // When textbox enter event
  addNewAssitant() {
    const words = this.personCtrl.value;
    if (typeof words !== "string") return;
    if (words.length < 3) return;
    const isAlreadyChosen = this.isAlreadyChosen(words);
    if (isAlreadyChosen) {
      this.duplicatePersonToast();
      return;
    }

    this.initCreatePerson(words);
  }

  initCreatePerson(value: string): void {
    let name = value;
    let lastname = "";
    const words = value.split(" ");
    if (words.length === 3) {
      name = words[0];
      lastname = words[1] + " " + words[2];
    } else if (words.length === 4) {
      name = words[0] + " " + words[1];
      lastname = words[2] + " " + words[3];
    } else {
      name = words[0];
      lastname = words[1];
    }

    const dialogRef = this.dialog.open(DialogUserCreation, {
      data: { name, lastname, id: uuidv4() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assign(result);
      }
    });
  }

  // When autocomplete input personSelected event
  personSelected(event) {
    const value = event.option.value;
    this.assign(value);
  }

  assign(person: Person) {
    const isAlreadyChosen = this.isAlreadyChosen(this.displayFn(person), person.cc);
    if (isAlreadyChosen) {
      this.duplicatePersonToast();
      return;
    }
    this.chosen.push(person);
    this.personCtrl.setValue("");
  }

  private isAlreadyChosen(words: string, cc: string = undefined) {
    if (this.chosen.length === 0) return false;
    const matches = this.chosen.filter((person) => {
      const areFullNamesEquals = this.areFullNamesEquals(words, person);
      let isDuplicatedCC = false;
      if (cc) isDuplicatedCC = cc == person.cc;
      return areFullNamesEquals || isDuplicatedCC;
    });
    return matches.length > 0;
  }

  displayFn(person: Person): string {
    return person && person.id ? person.name + " " + person.lastname : "";
  }

  // It compares two strings and returns true if "value" contains "search"
  private includes(search, value) {
    return value.toLowerCase().includes(search.toLowerCase());
  }

  // It validates if the word is contained by the person
  private belongsToNameOrLastname(word, person: Person) {
    return (
      this.includes(word, person.name) || this.includes(word, person.lastname)
    );
  }

  private areFullNamesEquals(fullname, person: Person) {
    return fullname.toLowerCase() === this.displayFn(person).toLowerCase();
  }

  remove(index: number) {
    this.chosen.splice(index, 1);
  }

  duplicatePersonToast() {
    this.toastr.warning("Persona duplicada");
  }

  public get lPath(): Path[] {
    return [{ isActive: true, label: "Registro", url: "" }];
  }
}

@Component({
  selector: "dialog-user-creation-example",
  templateUrl: "dialog-user-creation-example.html",
})
export class DialogUserCreation {
  constructor(
    public dialogRef: MatDialogRef<DialogUserCreation>,
    @Inject(MAT_DIALOG_DATA) public data: Person,
    private toastr: ToastrService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    const hasCC = this.data.cc && this.data.cc.length > 0;
    const hasName = this.data.name && this.data.name.length > 0;
    const hasLastname = this.data.lastname && this.data.lastname.length > 0;
    if (hasCC && hasName && hasLastname) {
      this.dialogRef.close(this.data);
    } else {
      this.toastr.error("Por favor llena todos los datos");
    }
  }
}
