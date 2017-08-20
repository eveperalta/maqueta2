class ProductApiJob < ActiveJob::Base
  queue_as :default

  def perform(products, category_obj, today)
  	# Borrar de la BD los productos pasados.
  	Product.delete_all(categoria_id: category_obj.id)
  	# Insertar los nuevos.
    products.each do |product|
    	product.save
    end
    # Setear la fecha/hora (ahora) de la insercion.
    category_obj.last_api_used = today
    category_obj.save
  end
end
