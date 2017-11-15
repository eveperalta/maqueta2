namespace :prueab do
	desc "Task description"
	task :prueba => :environment do
		pdf = Pdf.new()
    pdf.render_file(Rails.root.join('tmp', 'prueba.pdf'))
		# PdfMailer.pdf_email('criss.acv@gmail.com', Rails.root.join('public', 'prueba.pdf')).deliver
	end
end
