import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { Path } from "th-ng-commons";

export interface Person {
  id: string;
  name: string;
  lastname: string;
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

  constructor(private toastr: ToastrService) {
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
        { id: "1", name: "Mary", lastname: "rodriguez" },
        { id: "2", name: "Shelley", lastname: "rodriguez" },
        { id: "3", name: "Igor", lastname: "rodriguez" },
        { id: "4", name: "John", lastname: "rodriguez" },
        { id: "5", name: "Samuel", lastname: "rodriguez" },
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
    if (typeof words !== "string" && words.length < 3) return;
    const isAlreadyChosen = this.isAlreadyChosen(words);
    if (isAlreadyChosen) {
      this.duplicatePersonToast();
      return;
    }

    this.initCreatePerson();

    // this.assign(words);
  }

  initCreatePerson() {}

  // When autocomplete input personSelected event
  personSelected(event) {
    const value = event.option.value;
    this.assign(value);
  }

  assign(person: Person) {
    const isAlreadyChosen = this.isAlreadyChosen(this.displayFn(person));
    if (isAlreadyChosen) {
      this.duplicatePersonToast();
      return;
    }
    this.chosen.push(person);
    this.personCtrl.setValue("");
  }

  private isAlreadyChosen(words: string) {
    if (this.chosen.length === 0) return false;
    const matches = this.options.filter((person) =>
      this.areFullNamesEquals(words, person)
    );
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
