class CreateConfigs < ActiveRecord::Migration
  def change
    create_table :config do |t|
    	t.string :nombre_config, null: false
    	t.integer :tienda_id, null: true
    end
  end
end
