class MainController < ApplicationController
	around_filter :protect_request, only: [:products_by_category, :carrito_add, :set_background, :carrito_send, :set_tienda]
	
	CATEGORIES_TYPES = {
		muro: 'muro',
		piso: 'piso'
	}
	PDF_TEMP_FILE = Rails.root.join('tmp', 'prueba.pdf')

	def index
		render action: :index
	end

	def espacio
		carrito = Carrito.new
		# carrito.items << ProductPair.new(piso: Product.new(sku: "1"), muro: Product.new(sku: "2"))
		# carrito.items << ProductPair.new(piso: Product.new(sku: "3"), muro: Product.new(sku: "4"))
		render action: :espacio, locals: {categories_types: CATEGORIES_TYPES, carrito: carrito, categories: Category.all}
	end

	def products_by_category
		if params[:category_type].present?
			if params[:category_id].present?
				res = API.getProductsByCategory(categoria_id: params[:category_id], category_type: params[:category_type], category_name: params[:category_name])

				# category_obj = Category.select(:nombre).find_by(sodimac_id: params[:category_id], tipo: params[:category_type])

				if !res.nil?
					html_item_arr = []
					res[:products].each_with_index do |item, index|
						html_item_arr << render_to_string(partial: 'carousel_items', formats: [:html], layout: false, locals: {item: item, type: Product.new, index: index, category: res[:category_obj]})
					end

					render json: {
						carousel_items: html_item_arr,
						carousel_type: params[:category_type],
						source: res[:source],
						last_updated_at: res[:category_obj].last_api_used
					}
				else
					# Hubo un error al obtener los productos de la categoria.
					render json: {msg: "Hubo un error en obtener los productos de la categoria '#{params[:category_id]}'"}, status: :unprocessable_entity	
				end		
			else
				# No hay id de categoria.
				render json: {msg: "El servidor no recibió el id de la categoria."}, status: :unprocessable_entity
			end
		else
			# No hay tipo de categoria.
			render json: {msg: "El servidor no recibió el tipo de la categoria."}, status: :unprocessable_entity
		end
	end

	def carrito_add
		if !params[:product].nil?
			product_obj = Product.getProductBySku(params[:product][:sku], {cantidad: params[:product][:cantidad]})

			if !product_obj.nil?
				carrito_obj = Carrito.new
				carrito_obj.items << product_obj
				carrito_obj.calculateTotal

				render json: {
					carrito_item: render_to_string(partial: 'carrito_form', formats: [:html], layout: false, locals: {carrito: carrito_obj}),
					item_sku: product_obj.sku,
					precio_total_item: carrito_obj.total
				}
			else
				render json: {msg: "Hubo problemas en encontrar el producto en la BD."}, status: :unprocessable_entity
			end
		else
			render json: {msg: "Hubo problemas en enviar los datos del producto al servidor"}, status: :unprocessable_entity
		end
	end

	def carrito_send
		if !params[:items].nil?
			if params[:email].present?
				# Verificar el formato del email ingresado.
				if params[:email] =~ /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/
					pdf_options = {pisos: [], muros: []}

					# Recorrer los pisos y muros para obtener su ficha y asi poder generar el PDF.
					params[:items].each do |item|
						product_obj = API.getFichaProductoBySku(item[1][:sku], item[1][:tipo])
						if !product_obj.nil?
							if product_obj.tipo == "piso"
								pdf_options[:pisos] << product_obj
							elsif product_obj.tipo == "muro"
								pdf_options[:muros] << product_obj
							end
						end
					end

					# Crear PDF.
					pdf = Pdf.new(pdf_options)

					# Guardar el archivo PDF en local.
			    pdf.render_file(PDF_TEMP_FILE.to_s)

			    # Enviar el email con el PDF.
					PdfMailer.pdf_email(params[:email], PDF_TEMP_FILE.to_s).deliver_later

					render json: {msg: "Email enviado a #{params[:email]} con el pdf generado exitosamente.", home_url: espacio_path}
					
				else
					render json: {msg: "El formato del email ingresado no es válido."}, status: :unprocessable_entity
				end
			else
				render json: {msg: "No hay email."}, status: :unprocessable_entity
			end
		else
			render json: {msg: "El carrito de compras esta vacio."}, status: :unprocessable_entity
		end
	end

	def set_background
		if params[:category_type].present?
			if params[:product_sku].present?
				product_obj = API.getFichaProductoBySku(params[:product_sku], params[:category_type])

				# Verificar que el objeto tenga la imagen a setear.
				if product_obj.img_url.present?
					# Correr el comando para setear la imagen.
					res = system("wallpaper #{product_obj.img_url}")
					
					if res
						render json: {msg: "Imagen de producto seteada exitosamente."}
					else
						render json: {msg: "Hubo un problema en setear la imagen."}, status: :unprocessable_entity
					end
				end
			else
				render json: {msg: "No llego el sku del producto al servidor."}, status: :unprocessable_entity
			end
		else
			render json: {msg: "No llego el tipo de producto al servidor."}, status: :unprocessable_entity
		end
	end

	def set_tienda
		tienda_obj = Tienda.find_by(numero: params[:config][:tienda_id])

		if !tienda_obj.nil?
			config_obj = Config.getTiendaConfig
			config_obj.tienda_id = tienda_obj.id

			if config_obj.save
				render json: {msg: "Tienda ingresada exitosamente", tienda_config: Config.checkTiendaConfig}
			else
				render json: {msg: "Hubo un problema en guardar la tienda seleccionada."}, status: :unprocessable_entity
			end

		else
			render json: {msg: "La tienda ingresada no existe en la BD."}, status: :unprocessable_entity
		end
	end

	def impresion_send
		if !params[:items].nil?
			if params[:nombre].present?
				# Verificar el formato del email ingresado.
				if params[:email] =~ /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/
					# Veriicar el rut ingresado.
					if RUT::validar(params[:rut])
						res = API.sendToImpresion(params[:items], {nombre: params[:nombre], email: params[:email], rut: params[:rut]})

						if !res.nil?
							# OK.
							render json: {msg: "Solicitud de impresion enviada exitosamente.", ticket: res}
						else
							# Hubo un error al mandar el request de impresion.
							render json: {msg: "Hubo un problema en mandar la solicitud de impresion."}, status: :unprocessable_entity
						end
					else
						render json: {msg: "Rut invalido."}, status: :unprocessable_entity
					end
				else
					render json: {msg: "Email invalido."}, status: :unprocessable_entity
				end
			else
				render json: {msg: "No hay nombre."}, status: :unprocessable_entity
			end
		else
			render json: {msg: "El carrito de compras esta vacio."}, status: :unprocessable_entity
		end
	end

	def cubicador_send
		res = API.sendToCubicador(params[:cubicador])
		if !res.nil?
			# OK.
			render json: {msg: "Solicitud del cubicador realizada exitosamente.", cantidad: res}
		else
			render json: {msg: "Hubo un problema con el cubicador."}, status: :unprocessable_entity
		end
	end

	def protect_request
		begin
			yield
		rescue StandardError => e
			puts e
			puts e.backtrace
			render json: {msg: "Ha ocurrido un error con el request."}, status: :unprocessable_entity
		end
	end	

end
