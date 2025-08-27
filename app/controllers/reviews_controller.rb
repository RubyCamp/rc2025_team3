class ReviewsController < ApplicationController
  before_action :set_photo_spot
  def new
    @review = @photo_spot.reviews.build
  end

  def create
    @review = @photo_spot.reviews.build(review_params)
    if @review.save
      redirect_to photo_spot_path(@photo_spot), notice: t("flash.review_created")
    else
      @reviews = @photo_spot.reviews.order(created_at: :desc)
      render "photo_spots/show", status: :unprocessable_entity
    end
  end

  private

    def set_photo_spot
      @photo_spot = PhotoSpot.find(params[:photo_spot_id])
    end

    def review_params
      params.require(:review).permit(:rating, :comment, images: [])
    end
end
