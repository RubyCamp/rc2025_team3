import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="index-map"
export default class extends Controller {
  static targets = ["container"]
  static values = { photoSpots: Array }

  connect() {
    console.log(this.photoSpotsValue)

    // 地図の初期化
    this.map = L.map(this.containerTarget).setView([35.474, 133.050], 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)

    // フォトスポットのマーカー
    this.photoSpotsValue.forEach(photo_spot => {
      if (photo_spot.latitude && photo_spot.longitude) {
        const marker = L.marker([photo_spot.latitude, photo_spot.longitude])
          .addTo(this.map)
          .bindPopup(photo_spot.name)

        // マーカークリック時に対応カードをハイライト
        marker.on("click", () => {
          this.highlight(null, photo_spot.id)
        })
      }
    })

    // イベントリスナーを登録
    this.map.on("locationfound", this._onLocationFound.bind(this))
    this.map.on("locationerror", this._onLocationError.bind(this))

    // 初回ロード時にも現在地を取得
    this.locate()
  }

  locate() {
    if (navigator.geolocation) {
      this.map.locate({ setView: true, maxZoom: 16 })
    } else {
      alert("お使いのブラウザは現在地の取得に対応していません。")
    }
  }

  _onLocationFound(e) {
    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    L.marker(e.latlng, { icon: redIcon })
      .addTo(this.map)
      .bindPopup("現在地")
      .openPopup()
  }

  _onLocationError(e) {
    alert("現在地を取得できませんでした: " + e.message)
  }

  highlight(event, spotId = null) {
    // イベントから spotId を取得
    const targetSpotId = spotId || event?.currentTarget.dataset.spotId
    console.log("ハイライト対象ID:", targetSpotId)

    // 既存ハイライトを削除
    document.querySelectorAll("[data-spot-id]").forEach(el => {
      el.classList.remove("ring-2", "ring-blue-500", "bg-blue-50", "animate-pulse")
    })

    // 対象カードを取得
    const card = document.querySelector(`[data-spot-id='${targetSpotId}']`)
    console.log("見つかったカード:", card)

    if (card) {
      card.classList.add("ring-2", "ring-blue-500", "bg-blue-50", "animate-pulse")
      card.scrollIntoView({ behavior: "smooth", block: "center" })
      setTimeout(() => card.classList.remove("animate-pulse"), 2000)
    }
  }


  disconnect() {
    if (this.map) {
      this.map.off("locationfound")
      this.map.off("locationerror")
      this.map.remove()
      this.map = null
    }
  }
}