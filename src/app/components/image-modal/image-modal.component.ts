import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageModalOptions } from 'src/app/models/ImageModalOptions';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class NgbdModalContent {
  @Input() srcImage;
  @Input() options;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-modal-component',
  template: ''
})
export class ImageModalComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  sourceImage = '';
  size = '.modal-md';

  ngOnInit() {
  }

  open(sourceImage: string, options: ImageModalOptions) {
    this.sourceImage = sourceImage;
    this.size = options.width;

    const modalRef = this.modalService.open(NgbdModalContent, { centered: true });
    modalRef.componentInstance.options = options;
    modalRef.componentInstance.srcImage = sourceImage;
  }
}
