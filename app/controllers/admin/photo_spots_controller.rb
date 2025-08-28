class Admin::PhotoSpotsController < ApplicationController
  before_action :set_photo_spot, only: %i[ show edit update destroy ]

  def index
    @photo_spots = PhotoSpot.all
  end

  def new
    @photo_spot = PhotoSpot.new
  end

  # POST /photo_spots or /photo_spots.json
  def create
    @photo_spot = PhotoSpot.new(photo_spot_params)

    respond_to do |format|
      if @photo_spot.save
        format.html { redirect_to admin_photo_spot_path(@photo_spot), notice: "PhotoSpot was successfully created." }
        format.json { render :show, status: :created, location: @photo_spot }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @photo_spot.errors, status: :unprocessable_entity }
      end
    end
  end


  def show
  end

  def edit
  end

  def update
    # チェックされた画像を削除
    if params.dig(:photo_spot, :remove_image_ids)
      images_to_purge = @photo_spot.images.where(id: params[:photo_spot][:remove_image_ids])
      images_to_purge.each(&:purge)
    end

    # 更新用のパラメータを取得し、画像とそれ以外に分離
    update_params = photo_spot_params.dup
    new_images = update_params.delete(:images)
    new_images&.reject!(&:blank?)

    # まず画像以外の属性を更新
    if @photo_spot.update(update_params)
      # 新しい画像があれば追加で添付
      if new_images.present?
        @photo_spot.images.attach(new_images)
      end
      redirect_to admin_photo_spot_url(@photo_spot), notice: "Photo spot was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @photo_spot.destroy!

    respond_to do |format|
      format.html { redirect_to admin_photo_spots_path, status: :see_other, notice: "PhotoSpot was successfully destroyed." }
      format.json { head :no_content }
    end
  end

private

  def set_photo_spot
      @photo_spot = PhotoSpot.find(params.expect(:id))
  end

  def photo_spot_params
    params.require(:photo_spot).permit(:name, :address, :detail, :parking_flag, :tags, { images: [] },
    :latitude, :longitude, :timestart, :timeend, :season,)
  end
end
