class PdfMailer < ApplicationMailer

	def pdf_email(email, pdf_path)
		attachments['experiencia.pdf'] = File.read(pdf_path)
  	mail_gun_stat = mail(from: ENV['username'], to: email, subject: 'Prueba de email app maqueta')
  	puts "email stat"
  	puts mail_gun_stat
	end
end
