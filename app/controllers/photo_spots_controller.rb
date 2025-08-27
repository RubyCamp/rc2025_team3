class PhotoSpotsController < ApplicationController
  before_action :set_photo_spot, only: %i[ show ]
  def index
    @photo_spots = PhotoSpot.all
    @photo_spots = PhotoSpot.apply_text_search(@photo_spots, params[:q])
    @photo_spots = PhotoSpot.apply_tag_search(@photo_spots, params[:tags])
  end

  def show
    @photo_spot = PhotoSpot.find(params[:id])
    @reviews = @photo_spot.reviews.order(created_at: :desc)
  end

  private
    def set_photo_spot
      @photo_spot = PhotoSpot.find(params[:id])
    end
end
