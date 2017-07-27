class AddTiendaIdForeignKey < ActiveRecord::Migration
  def change
		add_foreign_key :config, :tiendas, column: :tienda_id
  end
end
