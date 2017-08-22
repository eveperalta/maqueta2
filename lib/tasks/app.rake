namespace :app do

	desc "Agregar una nueva categoria."
	task :add_category, [:sodimac_id, :nombre, :tipo, :img, :alt_txt] => [:environment] do |t, args|
		cat_obj = Category.new(
			sodimac_id: args[:sodimac_id],
			nombre: args[:nombre],
			tipo: args[:tipo],
			img: args[:img],
			alt_txt: args[:alt_txt]
			)

		if cat_obj.save
			puts "Categoria agregada exitosamente id: #{cat_obj.id}"
		else
			puts "Ha ocurrido un problema en agregar la categoria"
			puts cat_obj.errors.messages
		end
	end

	desc "Elimina una categoria por su ID de sodimac. Se eliminan tambien todos los productos asociados a esa categoria"
	task :remove_category, [:sodimac_id] => [:environment] do |t, args|
		Rails.logger.level = Logger::DEBUG
		cat_obj = Category.find_by(sodimac_id: args[:sodimac_id].strip)

		if !cat_obj.nil?
			# Borrar los productos asociados a la categoria
			cat_obj.products.delete_all
			# Borrar categoria
			cat_obj.delete
			puts "Categoria eliminada exitosamente."
		else
			puts "La categoria ingresada '#{args[:sodimac_id]}' no existe en el sistema."
		end
	end
end
