class API
	# Codigos de pisos de la API.
	CATEGORIES = [
		'scat102690',
		'scat552404',
		'scat991120',
		'cat2880013',
		'scat552357',
		'scat880433'
	]

	SKUS = [
		'1862715',
		'1862642',
		'1862707',
		'1862723',
		'1862634',
		'1862626',
		'2684357',
		'3010341',
		'3179702',

		'2771667',
		'2771640',
		'1182005',
		'2850397',

		'2815915',
		'2052121',
		'2667363',
		'2840111',
		'2931184',
		'2931176',
		'2931192',


		'1592459',
		'1592327',
		'1592599',
		'1592548',
		'1592513',
		'1592432',
		'1592483',



		'FLOTANTE',
		'2666901',
		'2666898',
		'2666928',
		'266691X',
		'1280171',

		'MADERA',
		'2123568',
		'2123584',
		'2123592',
		#'1116983',
		'1181777',
		'2011778',
		'2279657',
		#'2011751',
		'1194364',
		'1181785',

		'VINILICO',
		'2756137',
		'2756129',
		'2346842',
		'212548X',
		'2346834',
		'2829088'
		#'2829096'

	]

	TIENDA_NUM = 96
	CUB_AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNTA5NiIsIm5hbWUiOiJTb2RpbWFjIiwiYWRtaW4iOnRydWV9.7VC7h-JaOIE1s70MsFjheZcZNox8LjpwdwcERoge6kw'

	def self.getProductsByCategory(params)
		# A REVISAR:
		# Cambiar el get_params[:categoria_id] de array a string, en caso de que no se quiera obtener todos los productos de todas las categorias.
		# get_params = {categoria_id: [params[:categoria_id]]}
		category_obj = Category.find_by(sodimac_id: params[:categoria_id], tipo: params[:category_type])
		numero_tienda = Config.getNumeroTienda
		response = {products: nil, source: nil, category_obj: category_obj}

		if !numero_tienda.nil?
			if !category_obj.nil?
				products = []	
				if !params[:from_cron].nil? && params[:from_cron]
					# Aqui entra cuando el llamado se realiza desde el cron.
					products = getProductsFromApi(
						numero_tienda: numero_tienda,
						category_obj: category_obj,
						)

					if products.size != 0
						if category_obj.products.where(valido: true).size == 0
							# Cuando la BD no tiene guardados productos con la categoria entrante,
							# se ingresan todos a la BD.
							insertProductsToBD(products, category_obj)
						else
							# Cuando en la BD ya hay productos guardados con la categoria entrante.
							# Invalidar todos los productos de la categoria para dejar marcados los posibles productos que ya no deberia existir en la BD (posiblemente porque ya no esta en la API).
							Product.where(categoria_id: category_obj.id).update_all(valido: false)

							new_products_to_bd = []
							products.each do |product_api|
								product_obj = Product.find_by(tipo: category_obj.tipo, sku: product_api.sku)

								if !product_obj.nil?
									# Si ya esta en la BD, se actualiza solo su precio y se vuelve a dejar como valido.
									product_obj.precio = product_api.precio
									product_obj.valido = true
									product_obj.save
								else
									# Si no esta en la BD, se agrega al array de productos nuevos a agregar (new_products_to_bd) para insertarlos mas tarde.
									new_products_to_bd << product_api
								end
							end

							# Agregar los nuevos productos a la BD, solo si hay.
							insertProductsToBD(new_products_to_bd, category_obj) if new_products_to_bd.size != 0

							category_obj.last_api_used = DateTime.current.in_time_zone
							category_obj.save
						end # category_obj.products.size == 0
					end # products.size != 0
				else
					# Aqui entra cuando se llama desde la pagina, solo se traen los productos de la BD.
					products = Product.where(categoria_id: category_obj.id).where(valido: true)

					if products.size == 0
						response[:source] = :api
						# CASO NO IDEAL (deberia haber un problema con el cron), cuando no hay productos en la BD viniendo desde pagina.
						products = getProductsFromApi(
							numero_tienda: numero_tienda,
							category_obj: category_obj,
						)
						# Se agregan a la BD.
						insertProductsToBD(products, category_obj)
					else
						response[:source] = :no_api
					end
				end # end if cron

				response[:products] = products
				return response
			else
				return nil
			end
		else
			return nil
		end
	end

	def self.insertProductsToBD(products, category_obj)
		# Insertar los nuevos.
		Product.bulk_insert do |worker|
			products.each do |product|
				worker.add(product.attributes.except("id"))
			end
		end

    # Setear la fecha/hora (ahora) de la insercion.
		category_obj.last_api_used = DateTime.current.in_time_zone
		category_obj.save
	end

	def self.getProductsFromApi(options)
		products = []
		# products_failed = []
		offset = 0
		# Traer cada (limit) productos.
		limit = 100
		pass = true
		tries = 0

		puts "USA API"
		# EMPIEZA USO DE API.
		while pass
			connection = HTTP.get("http://api-car.azurewebsites.net:80/Categories/CL/#{options[:numero_tienda]}/#{options[:category_obj].sodimac_id}?orderBy=2&%24offset=#{offset}&%24limit=#{limit}")
			products_api_url = JSON.parse(connection.to_s)

			# if products_api_url["products"].nil?
			# 	byebug
			# end

			if !products_api_url["products"].nil?
				puts "OFFSET -> #{offset} | PRODUCTOS -> #{products_api_url["products"].size}"
				products_api_url["products"].each do |product|
                                        mejor_imagen = product["multimedia"].first["url"]
                                        product["multimedia"].each do |mm|
                                           if mm["url"].end_with? "_17"
                                               mejor_imagen = mm["url"]
                                           end
                                        end
                                        product["multimedia"].each do |mm|
                                           if mm["url"].end_with? "_01"
                                               mejor_imagen = mm["url"]
                                           end
                                        end
                                        mejor_imagen = mejor_imagen + "?wid=2000"
					product_obj = Product.new(
						nombre: product["name"],
						sku: product["sku"],
						img_url: mejor_imagen,
						descripcion: getDescriptionFromApi(product),
						precio: product["price"]["normal"],
						tipo: options[:category_obj].tipo,
						categoria_id: options[:category_obj].id
						)
					# Realizar llamado de la ficha tecnica del producto.
					ficha_api_url = JSON.parse(HTTP.get("http://api-car.azurewebsites.net/Products/CL/#{options[:numero_tienda]}/#{product_obj.sku}/Sheet"))

					if ficha_api_url.kind_of?(Array)
						# Si el llamado devuelve un array es porque no hubo un problema con el llamado
						# Se recorre la lista de atributos del producto hasta encontrar el de "rendimiento por caja"
						ficha_api_url[0]["attributes"].each do |attr|
							if attr["name"] =~ /rendimiento/i
								product_obj.rend_caja = attr["value"]
								break
							end
						end
					end

					# Si el producto cumple las validaciones de la clase, se incluye.
					if product_obj.valid?
						product_obj.valido = true
						products << product_obj
					# else
						# products_failed << product_obj
					end
				end # each product

				# Si aun quedan productos por traer (si la cantidad de productos obtenidos es el limit),
				# se le suma "limit" al "offset" y se vuelva a usar la api.
				if products_api_url["products"].size == limit
					offset += limit
				else
					# No deberian quedar mas productos debido que la cantidad de productos obtenidos es menor que el limit.
					pass = false
				end

			else
				# No se encontraron productos.
				pass = false
			end # products_api_url["products"].size != 0
		end # while(pass)
		# TERMINO USO DE API.

		return products
	end

	def self.getFichaProductoBySku(sku, tipo)
		if sku.present?
			numero_tienda = Config.getNumeroTienda
			# ficha_producto_api = JSON.parse(HTTP.get("http://api-car.azurewebsites.net/Products/CL/#{numero_tienda}/#{sku}").to_s)
			product_obj = Product.find_by(sku: sku)

			if !product_obj.nil?
				# product_obj = Product.new(
				# 	nombre: ficha_producto_api[0]["name"],
				# 	sku: ficha_producto_api[0]["sku"],
				# 	img_url: ficha_producto_api[0]["multimedia"].first["url"],
				# 	descripcion: getDescriptionFromApi(ficha_producto_api[0]),
				# 	precio: ficha_producto_api[0]["price"]["normal"],
				# 	tipo: tipo,
				# 	rend_caja: '-'
				# )

				if product_obj.valid?
					return product_obj
				else
					return nil
				end

			else
				return nil
			end
		else
			return nil
		end
	end

	def self.sendToImpresion(items, user_data)
		numero_tienda = Config.getNumeroTienda
		productos = []

		items.each do |item|
			product_obj = Product.find_by(sku: item[1][:sku])
			# Validar los productos (solo cantidad y presencia de sku).
			# product_obj = Product.new(
			# 	nombre: "--",
			# 	sku: item[:sku],
			# 	img_url: '--',
			# 	descripcion: '--',
			# 	precio: 0,
			# 	cantidad: item[:cantidad],
			# 	tipo: item[:tipo],
			# 	rend_caja: '1 m2'
			# )

			if !product_obj.nil? && product_obj.valid?
				productos << {sku: product_obj.sku, cantidad: product_obj.cantidad}
			else
				# Si alguno de los productos falla, se detiene.
				return nil
			end
		end

		# Realiza el request POST.
		impresion_res = HTTP.post("https://apiapp.pechera.p.azurewebsites.net:443/v1/Cotizacion/CL/#{numero_tienda}", json: {usuario: {email: user_data[:email], nombre: user_data[:nombre], rut: user_data[:rut]}, productos: productos})


		if impresion_res.code == 200
			# Bien
			return impresion_res.to_s
		else
			# Mal
			return nil
		end
	end

	def self.sendToCubicador(data)
		cub_res = HTTP.auth(CUB_AUTH).post("http://apisos.ubq.cl/materiales/", json: {piso: data[:piso].downcase, superficie: data[:superficie], m2: data[:m2].to_f, sku: data[:sku]})

		if cub_res.code == 200
			# Todo ok, solo se devuelve la cantidad de cajas.
			return (data[:m2].to_f / JSON.parse(cub_res.to_s)["piso"]["rendimiento"].gsub(/\r\n/,"").to_f).ceil
		else
			# Mal.
			return nil
		end
		
	end

	def self.getDescriptionFromApi(product_api_data)
		description = nil
		if product_api_data["name"].present?
			description = product_api_data["name"]
		elsif product_api_data["shortName"].present?
			description = product_api_data["shortName"]
		end
		return description
	end

end
