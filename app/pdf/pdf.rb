class Pdf < Prawn::Document
  require "open-uri"
  include ActionView::Helpers::NumberHelper

  # CONFIGURACION DE TEXTOS
  TEXT_CONFIG = {inline_format: true, align: :justify, size: 14, style: :normal}
  TEXT_TITLE_CONFIG = {align: :justify, valign: :center, size: 28, style: :bold}
  TEXT_SUBTITLE_CONFIG = {align: :justify, size: 16, style: :bold}
  NO_MESSAGE = "No hay datos suficientes para esta sección."
  TEXT_INDENT = 25
  PADDING = 15
  HEADER_FOOTER_HEIGHT = 80

  SODIMAC_LOGO_PATH = Rails.root.join('app', 'assets', 'images', 'Sodimac_Homecenter_large.png')
  INDENT_TYPE1 = 55

  def initialize(options = {})
    super( :margin => [0,0,0,0])
    @right_limit = bounds.right - INDENT_TYPE1

    # Agregar fuentes predeterminadas externas.
    font_families.update("Custom" => {
      bold: Rails.root.join('app', 'assets', 'fonts', 'miso-bold.ttf'),
    #   # bold_italic: Rails.root.join('app', 'assets', 'fonts', 'SourceSansPro-Italic.ttf'),
    #   # italic: Rails.root.join('app', 'assets', 'fonts', 'RobotoCondensed-LightItalic.ttf'),
      normal: Rails.root.join('app', 'assets', 'fonts', 'miso-light.ttf')
      })

    font "Custom"

    header
    footer
    intro
    muros_y_pisos_section(options[:pisos], :pisos)
    muros_y_pisos_section(options[:muros], :muros)
    final
  end

  def header(indent_bonus = 0)
    bounding_box([bounds.left - indent_bonus, bounds.top], width: bounds.right, height: HEADER_FOOTER_HEIGHT) do
      img_obj = nil
      float{
        img_obj = image(open(SODIMAC_LOGO_PATH), height: HEADER_FOOTER_HEIGHT, position: :left)
      }
      indent(img_obj.scaled_width + 20) do 
        text("Pisos & Muros", TEXT_TITLE_CONFIG)
      end
    end
  end

  def intro
    move_down 45
    bounding_box([bounds.left, cursor], width: @right_limit) do
      indent(INDENT_TYPE1) do
        text("Estimado cliente:", TEXT_CONFIG)
        text("Te enviamos un recordatorio de la experiencia Pisos & Muros en tu tienda Sodimac Favorita, estas fueron tus selecciones:", TEXT_CONFIG)
      end
    end
    move_down 20
  end

  def muros_y_pisos_section(data, section_type)
    bounding_height = 65
    
    indent(INDENT_TYPE1) do
      muros_title = section_type.to_s.upcase
      muros_title_h = height_of(muros_title)

      # Revisar si queda espacio en la pagina actual para escribir el titulo de 'muros' y la primera fila de los muros.
      checkPageSkip(bounding_height + muros_title_h, false, INDENT_TYPE1)
      
      # Titulo de muros.
      text(muros_title)

      data.each do |d|
        # Revisar si la fila con los datos del muro o piso cabe en la pagina actual.
        checkPageSkip(bounding_height, false, INDENT_TYPE1)

        bounding_box([bounds.left, cursor], width: @right_limit, height: bounding_height) do
          img_obj = nil
          float{
            img_obj = image(open(d.img_url), height: bounding_height, position: :left, vposition: :center)
          }

          bounding_box([img_obj.scaled_width + 30, cursor - 10], width: bounds.width, height: bounding_height) do
            # indent(img_obj.scaled_width + 30) do
              # w = width_of("Descripcion: ")
              # text_box("Descripcion: ", width: bounds.width - (INDENT_TYPE1 + img_obj.scaled_width),overflow: :shrink_to_fit, min_font_size: 3, single_line: true)

              # descripcion_text = " DescripcionDescripcionDescripcionDescripcionDescripnsaxasxaqwsqwsqwsqwsqwssqsqwsqwxaas"
              # text_box(descripcion_text, at: [w,cursor] , width: bounds.width - (INDENT_TYPE1 + img_obj.scaled_width + 30), align: :left,overflow: :shrink_to_fit, min_font_size: 3)
              # h = height_of(descripcion_text)

              # precio_text = "Precio: "
              # height_text = height_of(precio_text)
              # text_box(precio_text, at: [0, cursor - height_text], width: bounds.width - (INDENT_TYPE1 + img_obj.scaled_width), align: :left,overflow: :shrink_to_fit, min_font_size: 3)

              # sku_text = "SKU: "
              # height_text = height_of(sku_text)
              # text_box(sku_text, at: [0, cursor - height_text], width: bounds.width - (INDENT_TYPE1 + img_obj.scaled_width), align: :left,overflow: :shrink_to_fit, min_font_size: 3)
              text("Descripción: #{d.descripcion}", TEXT_CONFIG)
              text("Precio: $ #{number_to_currency(d.precio, precision: 0)}", TEXT_CONFIG)
              text("SKU: #{d.sku}", TEXT_CONFIG)
            end
          # end
        end
      end
    end
    move_down 20
  end

  def footer
    float{
      bounding_box([bounds.left, bounds.bottom + HEADER_FOOTER_HEIGHT], width: bounds.right, height: HEADER_FOOTER_HEIGHT) do
          image(SODIMAC_LOGO_PATH, height: HEADER_FOOTER_HEIGHT, position: :right)
      end
    }
  end

  def final
    final_text = "Gracias por preferirnos!"
    final_text_height = height_of(final_text, TEXT_CONFIG)

    indent(INDENT_TYPE1) do
      checkPageSkip(final_text_height, false, INDENT_TYPE1)
    end

    bounding_box([bounds.left, cursor], width: @right_limit) do
      indent(INDENT_TYPE1) do
        text(final_text, TEXT_CONFIG)
      end
    end
  end

  ##############################################################################
  #########################     Funciones Secundarias     ######################
  ##############################################################################

  private
    # Funcion que verifica si el contenido a dibujar en el pdf (texto, graficos, etc)
    # ocupara dentro de la pagina actual. Recibe como parametro la altura de todos los elementos a dibujar (pdf_points)
    # y se resta con la posicion del cursor del pdf.
    def checkPageSkip(pdf_points, only_check = false, indent_bonus = 0)
      # Si el contenido a dibujar sobrepasa la pagina actual, se hace un salto de pagina y dibuja el header.
      if (cursor - HEADER_FOOTER_HEIGHT) - pdf_points < 0
        if !only_check
          start_new_page()
          header(indent_bonus)
          footer
        end
        return true
      else
        return false
      end
    end

    # Devuelve la diferencia de meses entre las fechas de vigencia de propieades entregada.
    def monthsDifference
      dates = formatDates
      ((dates[:start_date] - dates[:end_date]).to_i / 30).to_i
    end

    # Devuelve las fechas de vigencia de las propiedades como objetos de fecha.
    def formatDates
      dates = @dates.split('-')
      return {start_date: Date.parse(dates[0]), end_date: Date.parse(dates[1])}
    end

    def drawFakeData(space_points, png_path, title, type, offer_title, graph_options = {})
      # SOLO CONTAR EL ESPACIO DEL IMAGEN
      checkPageSkip(space_points)

      # TITULO OFERTA / DEMANDA
      if offer_title.present?
        if type == :oferta
          drawOfferTitle(offer_title)
        else
          drawDemandTitle(offer_title)
        end
      end

      # TITULO
      if title.present?
        drawSubTitle(title, type, true, true, true)
      end

      height = graph_options[:height] ? graph_options[:height] : GRAPH_POS[:height]
      position = graph_options[:position] ? graph_options[:position] : :left
      padding = graph_options[:padding] ? graph_options[:padding] : PADDING * 2
      indent_amount = graph_options[:indent] ? graph_options[:indent] : TEXT_INDENT

      # IMAGEN PLACEHOLDER
      indent indent_amount do
        pad_bottom(padding) do
          image png_path, {height: height, position: position}
        end
      end
    end

    def removeTildes(str)
      tildes = {'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u'}
      str = str.gsub(/[áéíóúÁÉÍÓÚ]/, tildes)
      str
    end

    def drawTitle(title)
      if !title.nil?
        drawHeader
        # Titulo formateado, ayuda para los vinculos del indice.
        format_offer_title = removeTildes(title.downcase)
        add_dest format_offer_title, dest_xyz(bounds.absolute_left, y)
        # OFERTA TITULO
        pad(PADDING) do
          text title, TEXT_TITLE_CONFIG
        end
        # @index[:oferta][:page] = page_number
        # @index[:oferta][:title] = title
        # @index[:oferta][:format_title] = format_offer_title
      end
    end

    # Dibujar los subtitulos de los distintos graficos.
    def drawSubTitle(sub_title, not_sub = true, to_index = true, fake = false)
      # Agregar punto de destino a este modulo para los enlaces del indice.
      add_dest removeTildes(sub_title.downcase), dest_xyz(bounds.absolute_left, y)
      # Agregar la seccion al array para usarlo en el indice.
      # addContentToIndex(sub_title, mode, fake) if to_index
      # Dibujar el subtitulo.
      pad(PADDING) do
        text sub_title, TEXT_SUBTITLE_CONFIG
      end
      @num_subtitle += 1 if not_sub
    end

    def drawText(legend, no_padding = false, indent_amount = TEXT_INDENT, padding = PADDING)
      if no_padding
        indent indent_amount do
          text legend, TEXT_CONFIG
        end

      else
        pad_bottom(padding) do
          indent indent_amount do
            text legend, TEXT_CONFIG
          end 
        end 
      end
    end # END drawText

    def getTotalHeight(parts)
      space_points = 0

      # Se calcula la altura para...
      parts.each do |part|
        case part[:type]
          # Subtitulos
          when :sub_title
            space_points += height_of(part[:content], TEXT_SUBTITLE_CONFIG) + PADDING * 2
            
          # Textos (con identacion)
          when :text
            indent_amount = part[:indent].nil? ? TEXT_INDENT : part[:indent]
            # puts "text indent_amount: #{indent_amount}".purple

            indent indent_amount do 
              space_points += height_of(part[:content], TEXT_CONFIG)

              if !part[:padding].nil?
                # Si el texto tiene un padding distinto.
                space_points += part[:padding]

              else
                # Se usa el padding por defecto, solo si el texto no es unico en la seccion (part[:not_last])
                space_points += PADDING if part[:not_last].nil?
              end
            end # END indent

          # Graficos (ultimos y no ultimos)
          when :graph
            if !part[:middle_graph].nil?
              # puts "GRAPH".purple
              space_points += GRAPH_POS[:height] + PADDING
            else
              # puts "LAST GRAPH".purple
              space_points += GRAPH_POS[:height] + PADDING * 2
            end

          # Titulo (Oferta o Demanda)
          when :title
            if !part[:content].nil?
              # puts "OFFER TITLE HEIGHT".purple
              space_points += height_of(part[:content], TEXT_TITLE_CONFIG) + PADDING * 2

            else
              # puts "NO OFFER TITLE HEIGHT".purple
              
            end
            
          else
          
        end
      end # END PARTS.EACH

      return space_points
    end

    def getOfferTitleHeight(offer_title)
      return height_of(offer_title, TEXT_TITLE_CONFIG) + PADDING * 2
    end

end