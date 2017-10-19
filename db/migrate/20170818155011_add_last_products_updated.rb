class AddLastProductsUpdated < ActiveRecord::Migration
  def change
  	add_column :categories, :last_api_used, :datetime, null: true
  end
end
