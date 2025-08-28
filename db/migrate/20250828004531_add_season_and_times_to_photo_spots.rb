class AddSeasonAndTimesToPhotoSpots < ActiveRecord::Migration[8.0]
  def change
    add_column :photo_spots, :season, :string
    add_column :photo_spots, :timestart, :time
    add_column :photo_spots, :timeend, :time
  end
end
