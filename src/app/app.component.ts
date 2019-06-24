import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ['name', 'lastname', 'birthdate', 'age', 'dead'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  public user = [];
  public client = {
    name: '',
    lastname: '',
    birthdate: null
  }
  maxDate = new Date();
  public agePromediCostum = 0;
  public agePromedi ;
  
  constructor(public db:AngularFireDatabase,private _snackBar: MatSnackBar){
    this.db.list('/users').valueChanges().subscribe(user => {
      const ELEMENT_DATA: PeriodicElement[] = [];
      this.user = user;
      this.agePromediCostum  = 0;
      for (let i = 0; i < this.user.length; i++) {
        ELEMENT_DATA .push(this.user[i])
        this.user[i]['dead'] = new Date().getFullYear()  - (this.user[i].age - 74);
        this.agePromediCostum += this.user[i].age
        this.agePromedi = Math.round(this.agePromediCostum /this.user.length);
      }
      console.log(this.user)
      this.dataSource =  new MatTableDataSource(ELEMENT_DATA);
    })
  }

  createUser(){
    if (this.client.name == '' || this.client.lastname == ''  || this.client.birthdate == null ) {
      this._snackBar.open('Completar todos los campos' , 'OK', {
        duration: 5000,
      });
    }else {
      var birthdate = this.client.birthdate;
      var ageCustom = new Date().getFullYear() - birthdate.getFullYear();
      this.db.list('/users').push({
        'name': this.client.name,
        'lastname':this.client.lastname,
        'age':ageCustom,
        'birthdate':birthdate.getDate() + '/' + (birthdate.getMonth()+1)+ '/' + birthdate.getFullYear()
      })
      this._snackBar.open('Creaste al Cliente ' + this.client.name  , 'OK', {
        duration: 3000,
      });
      this.client = {
        name: '',
        lastname: '',
        birthdate: null
      }
    }
   
    
  }
}
