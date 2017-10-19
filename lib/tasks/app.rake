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

		if cat_obj.valid?
			if Category.find_by(sodimac_id: cat_obj.sodimac_id, tipo: cat_obj.tipo).nil?
				cat_obj.save
				puts "Categoria agregada exitosamente id: #{cat_obj.id}"
			else
				puts "La categoria ingresada ya existe."
			end
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
			cat_obj.destroy
			puts "Categoria eliminada exitosamente."
		else
			puts "La categoria ingresada '#{args[:sodimac_id]}' no existe en el sistema."
		end
	end

	desc "Task description"
	task :run_cron_job => :environment do
		Rails.logger.level = Logger::DEBUG
		crons = Cron.all

		crons.each do |cron|
			puts "Actualizando #{cron.category.nombre} | #{cron.category.sodimac_id}"
			# Se marca la hora/fecha de comienzo.
			cron.last_start_at = DateTime.current.in_time_zone
			# Obtener la categoria.
			category_obj = cron.category

			begin
				# Usar la API para poblar la tabla productos.
				API.getProductsByCategory(categoria_id: category_obj.sodimac_id,category_type: category_obj.tipo,from_cron: true)
				# Si no hubo errores, se setea este campo en nulo.
				cron.last_error = nil
			rescue StandardError => e
				# Si hubo algun error en el uso de la API o en la BD,
				# se guarda el error.
				cron.last_error = e
				puts e
				puts e.backtrace
			end

			# Se marca la hora/fecha de termino y se actualiza.
			cron.last_end_at = DateTime.current.in_time_zone
			cron.save
		end
	end

	desc "Task description"
	task :clear_products, [:sodimac_id, :tipo] => [:environment] do |t, args|
		Rails.logger.level = Logger::DEBUG
		if !args[:sodimac_id].nil? && !args[:tipo].nil?
			category_obj = Category.where(sodimac_id: args[:sodimac_id].strip).where(tipo: args[:tipo].strip)
		else
			category_obj = Category.all
		end

		category_obj.each do |cat|
			# Borrar los productos asociados a la categoria
			cat.products.delete_all
		end
	end	

end
