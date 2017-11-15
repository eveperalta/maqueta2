class PdfMailer < ApplicationMailer

	def pdf_email(email, pdf_path)
		  attachments['experiencia.pdf'] = File.read(pdf_path)
		  
		  mail_gun_stat = mail(to: email, subject: 'Prueba de email app maqueta')
		  #mail(to: email, subject: "Prueba de email app maqueta")
	end
end
