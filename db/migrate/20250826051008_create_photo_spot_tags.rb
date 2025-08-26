class CreatePhotoSpotTags < ActiveRecord::Migration[8.0]
  def change
    create_table :photo_spot_tags do |t|
      t.bigint :photo_spot_id
      t.bigint :tag_id
      t.timestamps
    end
  end
end
