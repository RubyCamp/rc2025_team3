class CreatePhotoSpots < ActiveRecord::Migration[8.0]
  def change
    create_table :photo_spots do |t|
      t.string :name
      t.string :address
      t.text :detail
      t.integer :parking_flag
      t.timestamps
    end
  end
end
