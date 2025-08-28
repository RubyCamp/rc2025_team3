import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ["container"]
  static values = { onsens: Array }

  connect() {
    this.currentMarker = null;
    this.onsens = this._parseOnsensData();
    console.log(this.onsens);

    this.map = L.map(this.containerTarget).setView([35.468, 133.0483], 11.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const onsenIcon = L.icon({
      iconUrl: '/onsen.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.onsens.forEach(onsen => {
      L.marker([onsen.geo_lat, onsen.geo_lng], { icon: onsenIcon })
        .addTo(this.map)
        .bindPopup(onsen.name);
    });
    this.map.on('click', (e) => {
      const latlng = e.latlng;

      // 既存のピンがあれば削除
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      // 新しいピンを立てて保存
      this.currentMarker = L.marker(latlng)
        .addTo(this.map)
        .bindPopup(`
      📍 ピンを立てました<br>
      緯度: ${latlng.lat.toFixed(5)}<br>
      経度: ${latlng.lng.toFixed(5)}
    `)
        .openPopup();
    });

  }

  disconnect() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // === プライベートメソッド（内部処理用） ===

  /**
   * HTML要素から温泉データを取得・パース
   * @returns {Array} 温泉データの配列
   */
  _parseOnsensData() {
    try {
      const rawData = this.element.dataset.mapOnsens || "[]";
      return JSON.parse(rawData);
    } catch (error) {
      console.warn("温泉データのパースに失敗:", error);
      return [];
    }
  }
}
