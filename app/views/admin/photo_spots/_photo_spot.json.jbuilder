json.extract! photo_spot, :id, :name, :detail, :parking_flag, :created_at, :updated_at
json.url photo_spot_url(photo_spot, format: :json)
