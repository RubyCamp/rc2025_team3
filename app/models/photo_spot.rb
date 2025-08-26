class PhotoSpot < ApplicationRecord
  has_many :photo_spot_tags, dependent: :destroy
  has_many :tags, through: :photo_spot_tags
end
