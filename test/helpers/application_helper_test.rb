require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "navigation_links for public path" do
    links = navigation_links("/")
    assert_equal 2, links.length

    search_link = links.find { |link| link[:path] == "/" }
    assert_not_nil search_link
    assert search_link[:current]
  end

  test "navigation_links for admin path" do
    links = navigation_links("/admin")
    assert_equal 2, links.length
    admin_link = links.find { |link| link[:path] == "/admin" }
    assert_not_nil admin_link
    assert admin_link[:current]
  end

  test "create_navigation_link_set" do
    configs = [
      { path: "/test", label: "Test", aria_label: "Test Label", current_check: -> { true } },
      { path: "/other", label: "Other", aria_label: "Other Label", current_check: -> { false } }
    ]

    links = create_navigation_link_set(configs)
    assert_equal 2, links.length
    assert links.first[:current]
    assert_not links.last[:current]
  end
end
