import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import * as _ from 'lodash';
import { Student } from "../model/student.model";
import { StudentService } from "../services/student/student.service";

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {
  editForm: FormGroup;
  student: Student;
  submitted = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private studentService: StudentService) { }

  ngOnInit() {
    let rollno = localStorage.getItem("editRollNo");
    if (!rollno) {
      alert("Roll no is not valid.")
      // this.router.navigate(['list-student']); TODO this is breaking test suit
      return;
    }

    this.editForm = this.formBuilder.group({
      rollno: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      name: ['', Validators.required],
      degree: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.studentService.getStudentByRollNo(rollno.toString())
      .subscribe(result => {
        let temp = _.pick(result, ["rollno", "name", "degree", "city"]); //data.students
        this.editForm.setValue(temp);
      }, error => {
        alert(`Oops, something went wrong.`)
      });
  }
  get formControls() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    this.studentService.editStudent(this.editForm.value)
      //      .pipe(first())
      .subscribe(
        data => {
          console.log(`student saved: ${data}`);
          this.router.navigate(['list-student']);
        },
        error => {
          alert(`Oops, something went wrong.`)
        });
  }

}
