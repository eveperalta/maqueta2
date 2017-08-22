class Category < ActiveRecord::Base
	CATEGORIES = [
		{nombre: 'Ceramica Marmolada', sodimac_id: 'cat4850117', tipo: :muro, img: 'ceramicaMarmol.jpg', alt_txt: 'Elegir Papel'},
		{nombre: 'Ceramica Lisa', sodimac_id: 'cat4850116', tipo: :muro, img: 'muros.jpg', alt_txt: 'Elegir Cerámicas'},
		{nombre: 'Porcelanato', sodimac_id: 'scat991120', tipo: :muro, img: 'porcelanato.jpg', alt_txt: 'Elegir Porcelanato'},
		{nombre: 'Papel Mural', sodimac_id: 'scat358517', tipo: :muro, img: 'papel.jpg', alt_txt: 'Elegir Papel Mural'},
		{nombre: 'Flotante', sodimac_id: 'scat552404', tipo: :piso, img: 'flotante.png', alt_txt: 'Elegir Flotante'},
		{nombre: 'Madera', sodimac_id: 'scat552357', tipo: :piso, img: 'madera.jpg', alt_txt: 'Elegir Madera'},
		{nombre: 'Porcelanato', sodimac_id: 'scat991120', tipo: :piso, img: 'porcelanato.jpg', alt_txt: 'Elegir Porcelanato'},
		{nombre: 'Vinilico', sodimac_id: 'cat2880013', tipo: :piso, img: 'vinilico.jpg', alt_txt: 'Elegir Vinilico'},
	]
	API_TIME_TO_USE = 6
	TIPOS = [:piso, :muro]

  validates_presence_of :sodimac_id, :nombre, :tipo, :img, :alt_txt
	has_many :products, class_name: "Product", foreign_key: :categoria_id, dependent: :delete_all

	def timeToUseApi()
		today = DateTime.current.in_time_zone
		if !self.last_api_used.nil?
			if ((today - self.last_api_used) / 3600).round >= API_TIME_TO_USE
				return true
			else
				return false
			end
		else
			return true
		end
	end

	def sodimac_id=(new_sodimac_id)
		self[:sodimac_id] = new_sodimac_id.strip if new_sodimac_id.present?
	end

	def nombre=(new_nombre)
		self[:nombre] = new_nombre.strip.titleize if new_nombre.present?
	end

	def tipo=(new_tipo)
		if new_tipo.present?
			new_tipo = new_tipo.to_sym
			if TIPOS.include?(new_tipo)
				self[:tipo] = new_tipo
			end
		end
	end

	def alt_txt=(new_alt_txt)
		self[:alt_txt] = new_alt_txt.strip if new_alt_txt.present?
	end
end
