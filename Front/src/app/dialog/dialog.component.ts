import { Component, EventEmitter, Inject, Output, type OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  @Output() actionClicked = new EventEmitter<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void { }

  actionClick(){
    this.actionClicked.emit();
  }

}
