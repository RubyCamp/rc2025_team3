# db/migrate/YYYYMMDDHHMMSS_change_reviews_table.rb
class RenameOnsenToPhotoSpotInReviews < ActiveRecord::Migration[8.0]
  def up
    # 古い外部キーを削除
    remove_foreign_key :reviews, :onsens

    # カラム名を変更
    rename_column :reviews, :onsen_id, :photo_spot_id

    # 不整合なデータを修正または削除
    # 例：存在しないphoto_spot_idを持つレビューを削除する場合
    Review.where('photo_spot_id NOT IN (SELECT id FROM photo_spots)').destroy_all

    # 新しい外部キー制約を追加
    add_foreign_key :reviews, :photo_spots
  end

  def down
    # ロールバック時に実行される処理
    remove_foreign_key :reviews, :photo_spots
    rename_column :reviews, :photo_spot_id, :onsen_id
    add_foreign_key :reviews, :onsens
  end
end
