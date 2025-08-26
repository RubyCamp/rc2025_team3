class Admin::PhotoSpotsController < ApplicationController
  def index
    @photo_spots = PhotoSpot.all
  end
end
