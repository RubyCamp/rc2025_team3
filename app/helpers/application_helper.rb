module ApplicationHelper
  def navigation_links(current_path)
    if current_path.start_with?("/admin")
      admin_navigation_links(current_path)
    else
      public_navigation_links(current_path)
    end
  end

  private

  # @return [Array<Hash>] 公開サイト用ナビゲーションリンク
  def public_navigation_links(current_path)
    create_navigation_link_set([
      { path: "/", label: t("views.navigation.search"), aria_label: "検索・地図", current_check: -> { current_path == "/" } },
      { path: "/admin", label: t("views.navigation.admin"), aria_label: "管理画面", current_check: -> { false } }
    ])
  end

  # @return [Array<Hash>] 管理サイト用ナビゲーションリンク
  def admin_navigation_links(current_path)
    create_navigation_link_set([
      { path: "/admin", label: t("views.navigation.onsen_management"), aria_label: "温泉管理", current_check: -> { current_path.start_with?("/admin/onsens") } },
      { path: "/", label: t("views.navigation.public_site"), aria_label: "公開サイト", current_check: -> { false } }
    ])
  end

  # ナビゲーションリンクセットを生成する共通メソッド
  # @param link_configs [Array<Hash>] リンク設定の配列
  # @return [Array<Hash>] ナビゲーションリンクの配列
  def create_navigation_link_set(link_configs)
    link_configs.map do |config|
      {
        path: config[:path],
        label: config[:label],
        aria_label: config[:aria_label],
        current: config[:current_check].call
      }
    end
  end
end
