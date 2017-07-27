class Config < ActiveRecord::Base
	self.table_name = 'config'
	belongs_to :tienda, class_name: "Tienda", foreign_key: :tienda_id
	TIENDA_CONFIG_NAME = 'tienda'

	def self.setTiendaInitConfig
		config_tienda = self.find_by(nombre_config: TIENDA_CONFIG_NAME)
		if config_tienda.nil?
			config_tienda = self.new(nombre_config: TIENDA_CONFIG_NAME)

			if config_tienda.save
				puts "Configuracion inicial de tiendas en la APP seteado!"
			else
				puts "Fallo en setear la configuracion inicial de tiendas de la APP"
			end
		end
	end

	def self.getTiendaConfig
		return self.find_by(nombre_config: TIENDA_CONFIG_NAME)
	end

	def self.checkTiendaConfig
		return self.exists?(nombre_config: TIENDA_CONFIG_NAME, tienda_id: nil)
	end
end
