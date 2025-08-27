class AddLocationAndTagsToPhotoSpots < ActiveRecord::Migration[8.0]
  def change
    # 緯度（latitude）と経度（longitude）を追加
    add_column :photo_spots, :latitude, :decimal, precision: 10, scale: 7
    add_column :photo_spots, :longitude, :decimal, precision: 10, scale: 7

    # タグ名（複数保持）を追加
    # このカラムは、カンマ区切りなどの文字列としてタグを保存します。
    # 複数保持には、配列型(array)やjsonb型も利用できますが、string型が最もシンプルです。
    add_column :photo_spots, :tags, :string
  end
end
