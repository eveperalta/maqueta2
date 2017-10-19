class CreateTiendas < ActiveRecord::Migration
  def change
    create_table :tiendas do |t|
    	t.string :numero, null: false
    	t.string :nombre, null: false
    end
  end
end
