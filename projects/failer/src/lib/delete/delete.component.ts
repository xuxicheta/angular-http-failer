import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'lib-delete',
  templateUrl: './delete.component.svg',
  styleUrls: ['./delete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DeleteComponent implements OnInit {
  @HostBinding('attr.role') role = 'button';

  constructor() { }

  ngOnInit() {
  }

}
