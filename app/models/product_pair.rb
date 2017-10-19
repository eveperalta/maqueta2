class ProductPair
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_accessor :piso, :muro

  validates_presence_of :piso, :muro

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value) if value.instance_of?(Product)
    end
  end

  def persisted?
    false
  end

end