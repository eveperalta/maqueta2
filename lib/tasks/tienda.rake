namespace :tienda do
	desc "Pobla la tabla de tiendas, con los numeros de tienda y nombres que tiene Sodimac."
	task :llenar_tiendas => :environment do
		tiendas = [
			{numero: 96, nombre: "Tobalaba"},
			{numero: 738, nombre: "Dominico"}
		]

		Config.setTiendaInitConfig

		tiendas.each do |t|
			tienda_obj = Tienda.find_by(numero: t[:numero])

			if tienda_obj.nil?
				# La tienda no existe, se agrega a la BD.
				tienda_obj = Tienda.new(t)

				if tienda_obj.save
					puts "Tienda '#{tienda_obj.nombre}' agregada a la BD exitosamente."
				else
					puts "FALLO ingreso de tienda '#{tienda_obj.nombre}'"
				end
			else
				# La tienda ya existe en la BD, se actualizan sus campos.
				tienda_obj.nombre = t[:nombre]

				if tienda_obj.save
					puts "Tienda '#{tienda_obj.nombre}' actualizada en la BD exitosamente."
				else
					puts "FALLO actualizacion de tienda '#{tienda_obj.nombre}'"
				end

			end
		end

		Config.resetTiendaConfig
	end

	desc "Se asigna la tienda de Sodimac dado su numero."
	task :set_tienda, [:num_tienda] => [:environment] do |t, args|
		tienda_obj = Tienda.find_by(numero: args[:num_tienda])

		if !tienda_obj.nil?
			config_obj = Config.getTiendaConfig

			# Verificar si es necesario inicializar la configuracion de las tiendas de la app.
			if config_obj.nil?
				puts "Falta iniciar la configuracion inicial de las tiendas en la APP..."
				Config.setTiendaInitConfig
				config_obj = Config.getTiendaConfig
			end

			# Setear el id de la tienda ingresada a la app.
			config_obj.tienda_id = tienda_obj.id

			if config_obj.save
				puts "Asignacion de tienda hecha sin problemas. La tienda asignada es '#{config_obj.tienda.nombre}', numero: '#{config_obj.tienda.numero}'"
			else
				puts "Algo fallo en la asignacion de la tienda de la APP."
			end

		else
			puts "El numero de tienda ingresado no se encuentra en la BD."
		end
	end

	desc "Quita la asosiacion de la tienda de la APP."
	task :reset_config => :environment do
		config_obj = Config.getTiendaConfig

		if config_obj.nil?
			puts "No habia configuracion inicial de tienda... inicializando"
			Config.setTiendaInitConfig
		else
			config_obj.tienda_id = nil
			config_obj.save
			puts "Reset de configuracion de tienda hecho exitosamente."
		end
		
	end

	task :set_tienda, [:num_tienda, :nombre_tienda] => [:environment] do |t, args|
		tienda_obj = Tienda.new(t)


	end

end
