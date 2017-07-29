class CreateConfigs < ActiveRecord::Migration
  def change
    create_table :config do |t|
    	t.string :nombre_config, null: false
    	t.integer :tienda_id, null: true
    end

    Config.create(nombre_config: Config::TIENDA_CONFIG_NAME, tienda_id: nil)
  end
end
