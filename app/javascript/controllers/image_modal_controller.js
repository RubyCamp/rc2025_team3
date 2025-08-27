import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modal", "image", "prevBtn", "nextBtn"];
  static values = {
    images: Array,
    index: Number
  };

  connect() {
    console.log("ImageModalController connected!");
  }

  // モーダルを開く
  open(event) {
    this.imagesValue = JSON.parse(event.currentTarget.dataset.imageModalImagesValue);
    this.indexValue = parseInt(event.currentTarget.dataset.imageModalIndexValue);
    this.showImage(this.indexValue);
    this.modalTarget.classList.remove("hidden");
    this.updateNavigationButtons();
  }

  // モーダルを閉じる
  close() {
    this.modalTarget.classList.add("hidden");
  }

  // 次の画像へ
  next() {
    this.indexValue = (this.indexValue + 1) % this.imagesValue.length;
    this.showImage(this.indexValue);
  }

  // 前の画像へ
  previous() {
    this.indexValue = (this.indexValue - 1 + this.imagesValue.length) % this.imagesValue.length;
    this.showImage(this.indexValue);
  }

  // 指定されたインデックスの画像を表示
  showImage(index) {
    this.imageTarget.src = this.imagesValue[index];
  }

  // 矢印ボタンの表示/非表示を更新
  updateNavigationButtons() {
    const isSingleImage = this.imagesValue.length <= 1;
    this.prevBtnTarget.classList.toggle("hidden", isSingleImage);
    this.nextBtnTarget.classList.toggle("hidden", isSingleImage);
  }
}