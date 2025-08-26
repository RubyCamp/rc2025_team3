class Tag < ApplicationRecord
  has_many :photo_spot_tags, dependent: :destroy
  has_many :photo_spot, through: :photo_spot_tags
end
