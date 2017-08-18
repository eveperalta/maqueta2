class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
    	t.string :sodimac_id, null: false
    	t.string :nombre, null: false
    	t.string :tipo, null: false
    	t.string :img, null: false
    	t.string :alt_txt, null: false
    end

    Category::CATEGORIES.each do |cat|
    	Category.create(cat)
    end

  end
end
