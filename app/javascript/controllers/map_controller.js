import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="map"
export default class extends Controller {
  // 新しいターゲットを追加しました
  static targets = ["container", "latitudeInput", "longitudeInput"]
  static values = { photo_spots: Array }

  connect() {
    this.currentMarker = null;
    this.photo_spots = this._parsePhotoSpotsData();

    this.map = L.map(this.containerTarget).setView([35.468, 133.0483], 11.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const photo_spotIcon = L.icon({
      iconUrl: '/photo_spot.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.photo_spots.forEach(photo_spot => {
      L.marker([photo_spot.geo_lat, photo_spot.geo_lng], { icon: photo_spotIcon })
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

  disconnect() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // --- 新しく追加したメソッド ---

  // マーカーを更新し、マップの中心を移動するメソッド
  updateMarker(lat, lng) {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    const latlng = [lat, lng];
    this.currentMarker = L.marker(latlng).addTo(this.map);
    this.map.setView(latlng, this.map.getZoom()); // 既存のズームレベルでビューを更新
  }

  // フォームの入力値からマーカーを更新するメソッド
  updateMarkerFromInput() {
    const lat = parseFloat(this.latitudeInputTarget.value);
    const lng = parseFloat(this.longitudeInputTarget.value);

    // 有効な数値であることを確認
    if (!isNaN(lat) && !isNaN(lng)) {
      this.updateMarker(lat, lng);
    }
  }

  // === プライベートメソッド（内部処理用） ===

  _parsePhotoSpotsData() {
    try {
      const rawData = this.element.dataset.mapPhotoSpots || "[]";
      return JSON.parse(rawData);
    } catch (error) {
      console.warn("写真スポットデータのパースに失敗:", error);
      return [];
    }
  }
}