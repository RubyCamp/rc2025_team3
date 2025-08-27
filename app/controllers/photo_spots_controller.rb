class PhotoSpotsController < ApplicationController
  before_action :set_photo_spot, only: %i[ show ]
  def index
    @photo_spots = PhotoSpot.all
    @photo_spots = @photo_spots.search_by_keyword(params[:q]) if params[:q].present?
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
