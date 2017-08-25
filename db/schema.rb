# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170825015051) do

  create_table "categories", force: :cascade do |t|
    t.string   "sodimac_id",    null: false
    t.string   "nombre",        null: false
    t.string   "tipo",          null: false
    t.string   "img",           null: false
    t.string   "alt_txt",       null: false
    t.datetime "last_api_used"
  end

  create_table "config", force: :cascade do |t|
    t.string  "nombre_config", null: false
    t.integer "tienda_id"
  end

  create_table "cron", force: :cascade do |t|
    t.integer  "category_id",   null: false
    t.text     "last_error"
    t.datetime "last_start_at"
    t.datetime "last_end_at"
  end

  create_table "product", force: :cascade do |t|
    t.string  "nombre",                       null: false
    t.string  "sku",                          null: false
    t.string  "img_url",                      null: false
    t.string  "descripcion",                  null: false
    t.string  "rend_caja",                    null: false
    t.integer "precio",                       null: false
    t.string  "tipo",                         null: false
    t.string  "rotar"
    t.integer "cantidad"
    t.integer "categoria_id"
    t.string  "superficie"
    t.boolean "valido",       default: false, null: false
  end

  create_table "tiendas", force: :cascade do |t|
    t.string "numero", null: false
    t.string "nombre", null: false
  end

end
