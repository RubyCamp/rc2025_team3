class PhotoSpotTag < ApplicationRecord
  belongs_to :photo_spot
  belongs_to :tag
end
