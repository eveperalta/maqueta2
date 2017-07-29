class Product
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_accessor :nombre, :sku, :img_url, :descripcion, :rend_caja, :precio, :tipo, :rotar

  validates_presence_of :nombre, :sku, :img_url, :descripcion, :rend_caja, :precio, :tipo

  def initialize(attributes = {})
    @rotar = false
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def persisted?
    false
  end

  def sku=(new_sku)
    @sku = new_sku.strip
  end

  def nombre=(new_nombre)
    @nombre = new_nombre.strip
  end

  def img_url=(new_img_url)
    @img_url = new_img_url.strip
  end

  def descripcion=(new_descripcion)
    @descripcion = new_descripcion.strip.split[0...5].join(" ") if new_descripcion.present?
  end

  def rend_caja=(new_rend_caja)
    @rend_caja = new_rend_caja.strip.split[0...6].join(" ") if new_rend_caja.present?
  end

  def precio=(new_precio)
    @precio = new_precio.to_i
  end

  def tipo=(new_tipo)
    if new_tipo =~ /muro/i
      @tipo = :muro
    elsif new_tipo =~ /piso/i
      @tipo = :piso
    else
      @tipo = nil
    end
  end
end