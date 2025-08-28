import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="form-map"
export default class extends Controller {
  static targets = ["container", "latitudeInput", "longitudeInput"]

  connect() {
    this.currentMarker = null;

    // 地図の初期化
    this.map = L.map(this.containerTarget).setView([35.468, 133.0483], 11.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // フォームに初期値があればピンを立てる
    if (this.hasLatitudeInputTarget && this.hasLongitudeInputTarget && this.latitudeInputTarget.value && this.longitudeInputTarget.value) {
      this.updateMarkerAndInputs(this.latitudeInputTarget.value, this.longitudeInputTarget.value);
    }

    // マップクリック時のイベントリスナー
    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.updateMarkerAndInputs(lat, lng);
    });
  }

  // マーカーを更新し、フォームの値を自動入力
  updateMarkerAndInputs(lat, lng) {
    this.removeMarker(); // 既存のピンを削除

    const latlng = [lat, lng];
    this.currentMarker = L.marker(latlng).addTo(this.map)
      .bindPopup(`緯度: ${lat.toFixed(5)}<br>経度: ${lng.toFixed(5)}`)
      .openPopup();

    this.map.setView(latlng, this.map.getZoom());
    this.latitudeInputTarget.value = lat.toFixed(5);
    this.longitudeInputTarget.value = lng.toFixed(5);
  }

  // 既存のピンを削除する
  removeMarker() {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
  }

  // フォームの入力値からマーカーを更新
  updateMarkerFromInput() {
    const lat = parseFloat(this.latitudeInputTarget.value);
    const lng = parseFloat(this.longitudeInputTarget.value);

    // 有効な数値であることを確認
    if (!isNaN(lat) && !isNaN(lng)) {
      this.updateMarkerAndInputs(lat, lng);
    }
  }

  /**
   * 現在地を取得し、地図とフォームを更新する
   */
  locate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateMarkerAndInputs(lat, lng);
        },
        (error) => {
          console.error("現在地の取得に失敗しました: ", error);
          alert("現在地の取得に失敗しました。ブラウザの設定をご確認ください。");
        }
      );
    } else {
      alert("お使いのブラウザは現在地の取得に対応していません。");
    }
  }

  // 切断時の処理
  disconnect() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}