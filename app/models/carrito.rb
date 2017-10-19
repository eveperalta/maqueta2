class Carrito
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_writer :items
  attr_accessor :total, :email
  validates_presence_of :items

  def initialize(attributes = {})
    @items = []
    @total = 0
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def items
    @items || false
  end

  def persisted?
    false
  end

  def calculateTotal
    total = 0
    @items.each do |item|
      total = item.precio.to_i
    end
    @total = total
  end

  def items=(new_item)
    @items << new_item if new_item.instance_of?(Product)
  end

end