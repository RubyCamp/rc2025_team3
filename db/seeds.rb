# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

tag1 = Tag.find_or_create_by!(name: "海")
tag2 = Tag.find_or_create_by!(name: "花")

photo_spot1 = PhotoSpot.find_or_create_by!(name: "多古鼻", address: "松江市島根町多古", parking_flag: 1, detail: "海が見えます．崖が怖いです．")
photo_spot2 = PhotoSpot.find_or_create_by!(name: "由志園", address: "松江市八束町波入", parking_flag: 1, detail: "牡丹が綺麗です．")

PhotoSpotTag.create(photo_spot_id: photo_spot1, tag_id: tag1)
PhotoSpotTag.create(photo_spot_id: photo_spot2, tag_id: tag2)
