class AddParkingCountToPhotoSpots < ActiveRecord::Migration[8.0]
  def change
    add_column :photo_spots, :parking_count, :integer
  end
end
