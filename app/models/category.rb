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
end
