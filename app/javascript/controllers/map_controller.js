import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="map"
export default class extends Controller {
  // ターゲット名を変更しました
  static targets = ["container", "latitudeInput", "longitudeInput"]
  static values = { photo_spots: Array }

  connect() {
    this.currentMarker = null;
    this.photo_spots = this._parsePhotoSpotsData();

    // 地図の初期化
    this.map = L.map(this.containerTarget).setView([35.468, 133.0483], 11.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // 既存のスポットのマーカーを設置
    const photo_spotIcon = L.icon({
      iconUrl: '/onsen.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
    this.photo_spots.forEach(photo_spot => {
      // プロパティ名を変更しました
      L.marker([photo_spot.latitude, photo_spot.longitude], { icon: photo_spotIcon })
        .addTo(this.map)
        .bindPopup(photo_spot.name);
    });

    // フォームに初期値があればピンを立てる
    if (this.latitudeInputTarget.value && this.longitudeInputTarget.value) {
      this.updateMarker(this.latitudeInputTarget.value, this.longitudeInputTarget.value);
    }

    // マップクリック時のイベントリスナー
    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng);
      // テキストボックスの値を更新
      this.latitudeInputTarget.value = lat.toFixed(5);
      this.longitudeInputTarget.value = lng.toFixed(5);
    });
  }

  // マーカーを更新し、マップの中心を移動する
  updateMarker(lat, lng) {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    const latlng = [lat, lng];
    this.currentMarker = L.marker(latlng).addTo(this.map);
    this.map.setView(latlng, this.map.getZoom());
  }

  // フォームの入力値からマーカーを更新する
  updateMarkerFromInput() {
    const lat = parseFloat(this.latitudeInputTarget.value);
    const lng = parseFloat(this.longitudeInputTarget.value);

    if (!isNaN(lat) && !isNaN(lng)) {
      this.updateMarker(lat, lng);
    }
  }

  // 現在地を取得するメソッドを追加
  locate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updateMarker(lat, lng);
          this.latitudeInputTarget.value = lat.toFixed(5);
          this.longitudeInputTarget.value = lng.toFixed(5);
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

  // === プライベートメソッド（内部処理用） ===

  _parsePhotoSpotsData() {
    try {
      const rawData = this.element.dataset.mapPhotoSpots || "[]";
      // パース後のデータが{id:..., name:..., geo_lat:..., geo_lng:...}のような構造であれば
      // 必要に応じてキーをリマップする必要があります
      return JSON.parse(rawData);
    } catch (error) {
      console.warn("写真スポットデータのパースに失敗:", error);
      return [];
    }
  }
}