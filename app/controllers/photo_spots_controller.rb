class PhotoSpotsController < ApplicationController
  def index
    @photo_spots = PhotoSpot.all
    @photo_spots = @photo_spots.search_by_keyword(params[:q]) if params[:q].present?
  end
end
