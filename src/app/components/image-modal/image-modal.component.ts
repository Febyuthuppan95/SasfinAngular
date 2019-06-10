import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class NgbdModalContent {
  @Input() srcImage;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-modal-component',
  template: ''
})
export class ImageModalComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  sourceImage = '';

  ngOnInit() {
  }

  open(sourceImage: string) {
    this.sourceImage = sourceImage;
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.srcImage = sourceImage;
  }
}
