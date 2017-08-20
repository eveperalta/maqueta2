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

	has_many :products, class_name: "Product", foreign_key: :categoria_id

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
end
