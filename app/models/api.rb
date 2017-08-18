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
		get_params = {categoria_id: [params[:categoria_id]]}
		numero_tienda = Config.getNumeroTienda

		if !numero_tienda.nil?
			if get_params[:categoria_id].size != 0
				products = []
				products_failed = []
				offset = 0
				# Traer cada (limit) productos.
				limit = 100

				# Recorrer el o los codigos de piso.
				get_params[:categoria_id].each do |categoria_id|
					pass = true
					# Para traer todos productos, hay que variar cada (limit) el offset de la URL hasta encontrar menos productos que el (limit).
					while pass
						products_api_url = JSON.parse(HTTP.get("http://api-car.azurewebsites.net:80/Categories/CL/#{numero_tienda}/#{categoria_id}?orderBy=2&%24offset=#{offset}&%24limit=#{limit}").to_s)

						# puts "OFFSET -> #{offset} | PRODUCTOS -> #{products_api_url["products"].size}"
						if products_api_url["products"].size != 0
							products_api_url["products"].each do |product|
								product_obj = Product.new(
									nombre: product["name"],
									sku: product["sku"],
									img_url: product["multimedia"].first["url"],
									descripcion: getDescriptionFromApi(product),
									precio: product["price"]["normal"],
									tipo: params[:category_type],
									categoria: params[:category_name]
									)
								# Realizar llamado de la ficha tecnica del producto.
								ficha_api_url = JSON.parse(HTTP.get("http://api-car.azurewebsites.net/Products/CL/#{numero_tienda}/#{product_obj.sku}/Sheet"))

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
									products << product_obj
								else
									products_failed << product_obj
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
				end # each categoria_id

				# puts "FINAL #{products.size} productos"
				# puts "FALLARON #{products_failed.size} productos"

				return products
			else
				return nil
			end
		else
			return nil
		end

	end

	def self.getFichaProductoBySku(sku, tipo)
		if sku.present?
			numero_tienda = Config.getNumeroTienda
			ficha_producto_api = JSON.parse(HTTP.get("http://api-car.azurewebsites.net/Products/CL/#{numero_tienda}/#{sku}").to_s)

			if ficha_producto_api.kind_of?(Array)
				product_obj = Product.new(
					nombre: ficha_producto_api[0]["name"],
					sku: ficha_producto_api[0]["sku"],
					img_url: ficha_producto_api[0]["multimedia"].first["url"],
					descripcion: getDescriptionFromApi(ficha_producto_api[0]),
					precio: ficha_producto_api[0]["price"]["normal"],
					tipo: tipo,
					rend_caja: '-'
				)

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
			# Validar los productos (solo cantidad y presencia de sku).
			product_obj = Product.new(
				nombre: "--",
				sku: item[:sku],
				img_url: '--',
				descripcion: '--',
				precio: 0,
				cantidad: item[:cantidad],
				tipo: item[:tipo],
				rend_caja: '1 m2'
			)

			if product_obj.valid?
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
		cub_res = HTTP.auth(CUB_AUTH).post("http://apisos.ubq.cl/materiales/", json: {piso: data[:piso], superficie: data[:superficie], m2: data[:m2].to_f, sku: data[:sku]})

		if cub_res.code == 200
			# Todo ok, solo se devuelve la cantidad de cajas.
			return JSON.parse(cub_res.to_s)["piso"]["cantidad"]
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
