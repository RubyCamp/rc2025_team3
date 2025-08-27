class PhotoSpot < ApplicationRecord
  has_many :reviews, dependent: :destroy
  has_many_attached :images

  # scope :search_by_keyword, ->(keyword) {
  #   where("name LIKE :keyword OR detail LIKE :keyword", keyword: "%#{keyword}%") if keyword.present?
  # }

  # scope :search_by_tag, ->(tag) {
  #   where("tag_id LIKE :tag", tag: "%#{tag}%") if tag.present?
  # }

  # テキスト検索：名前・説明文の部分一致検索
  #
  # @param scope [ActiveRecord::Relation] 検索対象スコープ
  # @param query [String, nil] 検索クエリ
  # @return [ActiveRecord::Relation] 絞り込み後のスコープ
  def self.apply_text_search(scope, query)
    return scope unless query.present?

    q = query.strip
    scope.where("name ILIKE :q OR detail ILIKE :q", q: "%#{q}%")
  end

  # タグ検索：カンマ区切りタグのOR条件検索
  #
  # @param scope [ActiveRecord::Relation] 検索対象スコープ
  # @param tags_param [String, nil] カンマ区切りタグ文字列
  # @return [ActiveRecord::Relation] 絞り込み後のスコープ
  def self.apply_tag_search(scope, tags_param)
    return scope unless tags_param.present?

    tags = tags_param.split(",").map(&:strip).reject(&:blank?)
    return scope unless tags.any?

    tag_query = tags.map { |_t| "tags ILIKE ?" }.join(" OR ")
    tag_values = tags.map { |t| "%#{t}%" }
    scope.where(tag_query, *tag_values)
  end
end
