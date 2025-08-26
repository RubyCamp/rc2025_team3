class Admin::PhotoSpotsController < ApplicationController
  def index
    @photo_spots = PhotoSpot.all
  end

  def new
    @photo_spot = PhotoSpot.new
  end
end
