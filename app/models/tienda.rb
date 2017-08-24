class Tienda < ActiveRecord::Base
  validates_presence_of :numero, :nombre

  def nombre=(new_nombre)
  	self[:nombre] = new_nombre.strip.capitalize if new_nombre.present?
  end

  def numero=(new_numero)
  	self[:numero] = new_numero.to_i if new_numero.present?
  end

end
