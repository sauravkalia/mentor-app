import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mentee',
  templateUrl: './mentee.component.html',
  styleUrls: ['./mentee.component.scss']
})
export class MenteeComponent implements OnInit {

  mentees = [{ id: 1, name: 'John', subject: 'Skating' },
  { id: 2, name: 'Mark', subject: 'Boxing' },
   { id: 3, name: 'Adam', subject: 'Karate' }, ];

  constructor() { }

  ngOnInit() {
  }
  onStore(id) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.mentees.length; i++) {
      if (id === this.mentees[i].id) {
        console.log(this.mentees[i].name);
      }
    }

  }

}
