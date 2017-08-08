class Product
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming
  MAX_WORDS_IN_DESC = 5

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
    if new_descripcion.present?
      # Quitar espacios innecesarios de la descripcion entrante.
      new_descripcion = new_descripcion.strip
      # descripcion_arr => arreglo que guarda cada palabra que se asignara en la @descripcion.
      descripcion_arr = []

      # Intentar obtener la parte de las dimensiones en la descripcion entrante.
      desc_dim = new_descripcion.scan(/[0-9]+\s*x\s*[0-9]+/i).first
      if !desc_dim.nil?
        desc_dim = desc_dim.gsub(/\s/, "").downcase
      else
        # No se pudo obtener las dimensiones, se intentara armar la descripcion de todas formas.
        desc_dim = nil
      end

      pass = false
      # Separar la descripcion por ' ' y recorrer palabra por palabra.
      new_descripcion.split.each do |word|
        # Revisar si hay suficientes palabras en el arreglo descripcion_arr.
        if descripcion_arr.size != MAX_WORDS_IN_DESC
          if !desc_dim.nil?
            # Si la palabra es la dimension (desc_dim), no se agregara al array de palabras descripcion_arr.
            if desc_dim =~ /#{word}/
              pass = true
            else
              if !pass
                descripcion_arr << word
              else
                # Se agrega la dimension y la palabra actual (deberia ser cm o m2) al descripcion_arr.
                descripcion_arr << desc_dim
                descripcion_arr << word
                # Se hace el cambio para que se agreguen todas las palabras que siguen al array.
                pass = false
              end
            end
          else
            # desc_dim = nil
            descripcion_arr << word
          end
        else
          # Se corta el each ya que hay suficientes palabras en descripcion_arr.
          break
        end
      end
      
      @descripcion = descripcion_arr.join(" ") + "."
    end
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