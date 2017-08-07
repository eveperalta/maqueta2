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
    if new_rend_caja.present?
      m2 = new_rend_caja.scan(/[0-9]+\.[0-9]+/).first
      m2_val = nil

      if !m2.nil?
        # Los x.xxxx 
        m2_val = m2.to_f.round(2)
      else
        m2 = new_rend_caja.scan(/[0-9]+/).first
        if !m2.nil?
          # Cuando les falta el decimal, ejem 1215 => 1.215
          m2_val = (m2[0] + "." + m2[1..m2.size - 1]).to_f.round(2)
        end
      end

      if !m2_val.nil?
        @rend_caja = "#{m2_val} m2"
      end
    end
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