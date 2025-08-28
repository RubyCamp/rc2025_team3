import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["countInput"]

  connect() {
    this.updateInputState()
  }

  toggle(event) {
    this.updateInputState()
  }

  updateInputState() {
    const selected = this.element.querySelector("input[name='photo_spot[parking_flag]']:checked")
    if (selected && selected.value === "1") {
      this.countInputTarget.disabled = false
      this.countInputTarget.classList.remove("bg-gray-200", "text-gray-500")
      this.countInputTarget.classList.add("bg-white", "text-black")
    } else {
      this.countInputTarget.disabled = true
      this.countInputTarget.value = ""
      this.countInputTarget.classList.remove("bg-white", "text-black")
      this.countInputTarget.classList.add("bg-gray-200", "text-gray-500")
    }
  }
}
