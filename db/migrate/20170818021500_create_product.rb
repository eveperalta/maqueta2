class CreateProduct < ActiveRecord::Migration
  def change
    create_table :product do |t|
    	t.string :nombre, null: false
    	t.string :sku, null: false
    	t.string :img_url, null: false
    	t.string :descripcion, null: false
    	t.string :rend_caja, null: false
    	t.integer :precio, null: false
    	t.string :tipo, null: false
    	t.string :rotar, null: true
    	t.integer :cantidad, null: true
    	t.integer :categoria_id, null: true
    	t.string :superficie, null: true
    	t.boolean :valido, null: false, default: false
    end

    add_foreign_key :product, :categories, column: :categoria_id
  end
end
