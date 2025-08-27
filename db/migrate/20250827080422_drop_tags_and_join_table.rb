class DropTagsAndJoinTable < ActiveRecord::Migration[8.0]
  def change
    drop_table :tags
    drop_table :photo_spot_tags
  end
end
