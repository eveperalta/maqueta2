# Se verifica si la tabla existe en cada verificacion para que no tenga problemas al correr las migraciones.
# Verificar que este la config de tiendas.
if ActiveRecord::Base.connection.table_exists?(Config.table_name)
	Config.setTiendaInitConfig
end
# Verificar que la app tengan las tiendas iniciales cargadas.
if ActiveRecord::Base.connection.table_exists?(Tienda.table_name)
	Tienda.initTiendas
end
# Verificar que la app tengan las categorias iniciales cargadas.
if ActiveRecord::Base.connection.table_exists?(Category.table_name)
	Category.initCategories
end