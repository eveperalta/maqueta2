class Tienda < ActiveRecord::Base
	TIENDAS = [
		{numero: 96, nombre: "Tobalaba"},
		{numero: 738, nombre: "Dominico"}
	]
  validates_presence_of :numero, :nombre

  def nombre=(new_nombre)
  	self[:nombre] = new_nombre.strip.capitalize if new_nombre.present?
  end

  def numero=(new_numero)
  	self[:numero] = new_numero.to_i if new_numero.present?
  end

  def self.initTiendas
  	if self.all.size == 0
  		puts "No hay tiendas, cargando..."
  		TIENDAS.each do |t|
  			tienda_obj = self.create(t)
  			if tienda_obj.present?
  				puts "Tienda '#{tienda_obj.nombre}' agregada exitosamente, ID: #{tienda_obj.id}"
  			else
  				puts "Fallo tienda '#{tienda_obj.nombre}'"
  				puts tienda_obj.errors.messages
  			end
  		end
  	end
  end

end
