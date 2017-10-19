class Cron < ActiveRecord::Base
	self.table_name = :cron

	belongs_to :category, class_name: "Category", foreign_key: :category_id
end
