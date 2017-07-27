class CreateConfigs < ActiveRecord::Migration
  def change
    create_table :config do |t|
    	t.integer :tienda_id, null: true
    end
  end
end
