class CreateCrons < ActiveRecord::Migration
  def change
    create_table :cron do |t|
    	t.integer  :category_id, null: false
    	t.text :last_error, null: true
    	t.datetime :last_start_at, null: true
    	t.datetime :last_end_at, null: true
    end

    cats = Category.all
    cats.each do |c|
    	Cron.create(category_id: c.id)
    end
  end
end
