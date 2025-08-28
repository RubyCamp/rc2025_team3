class Review < ApplicationRecord
  belongs_to :photo_spot

  has_many_attached :images

  validates :rating, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 5 }

  validates :images,
    content_type: [ "image/jpeg", "image/png", "image/gif" ], # 許可ファイル形式
    size: { less_than: 3.megabytes },                       # 1枚あたり3MB未満
    limit: { max: 10 }                                       # 最大10枚まで
end
