import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardSqlService } from '../dashboard-sql.service';
import { Empleado } from '../model/empleado.model';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  @Input() allEmp: string[];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  autoCompleteList: any[];
  eForm: FormGroup;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();

  constructor(public dsqls: DashboardSqlService, private fb: FormBuilder) {}

  createForm() {
    this.eForm = this.fb.group({
      Empleado: '',
    });
  }

  ngOnInit() {
    this.myControl.valueChanges.subscribe((userInput) => {
      this.autoCompleteExpenseList(userInput);
    });

    this.createForm();
  }

  private autoCompleteExpenseList(input) {
    let categoryList = this.filterCategoryList(input);
    this.autoCompleteList = categoryList;
  }

  filterCategoryList(val) {
    var categoryList = [];
    if (val === '' || val === null) {
      return [];
    }
    return this.allEmp.filter(this.subStr(val));
  }

  subStr = (val) => (emplea) => {
    emplea = emplea.toLowerCase();
    val = val.toLowerCase();
    if (emplea.includes(val)) {
      return true;
    } else {
      return false;
    }
  };

  displayFn(emp: Empleado) {
    let k = emp ? emp.nombre : emp;
    return k;
  }

  filterPostList(event) {
    var emps = event.source.value;
    if (!emps) {
      this.dsqls.searchOption = [];
    } else {
      this.dsqls.searchOption.push(emps);
      this.onSelectedOption.emit(this.dsqls.searchOption);
    }
    this.focusOnPlaceInput();
  }

  removeOption(option) {
    let index = this.dsqls.searchOption.indexOf(option);
    if (index >= 0) this.dsqls.searchOption.splice(index, 1);
    this.focusOnPlaceInput();

    this.onSelectedOption.emit(this.dsqls.searchOption);
  }

  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }
}
