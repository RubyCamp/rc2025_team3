class PhotoSpot < ApplicationRecord
  has_many :photo_spot_tags, dependent: :destroy
  has_many :tags, through: :photo_spot_tags
  has_many_attached :images

  scope :search_by_keyword, ->(keyword) {
    where("name LIKE :keyword OR detail LIKE :keyword", keyword: "%#{keyword}%") if keyword.present?
  }
end
