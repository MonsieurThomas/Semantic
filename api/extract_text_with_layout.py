from pdfminer.layout import LAParams, LTTextBox, LTTextLine, LTChar
from pdfminer.high_level import extract_pages
from pdfminer.converter import PDFPageAggregator
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage

def extract_text_with_layout(filepath):
    rsrcmgr = PDFResourceManager()
    laparams = LAParams(line_margin=0.5)  # Augmentez line_margin pour améliorer la détection des paragraphes
    device = PDFPageAggregator(rsrcmgr, laparams=laparams)
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    extracted_text = ""

    for page in PDFPage.get_pages(open(filepath, 'rb')):
        interpreter.process_page(page)
        layout = device.get_result()
        for lobj in layout:
            if isinstance(lobj, LTTextBox):
                previous_bottom = None
                paragraph_text = ""
                font_size = 0  # Initialisez font_size en dehors de la boucle des lignes
                
                for line in lobj:
                    if isinstance(line, LTTextLine):
                        text = line.get_text().strip()  # Supprimez les espaces en début et fin de ligne
                        for char in line:
                            if isinstance(char, LTChar):
                                font_size = max(font_size, char.size)

                        # Vérifiez l'écart vertical pour détecter un nouveau paragraphe
                        if previous_bottom is not None and (previous_bottom - line.y0) > 10:  # Seuil d'écart vertical ajusté
                            # Finalisez le paragraphe précédent
                            if paragraph_text:  # Assurez-vous que paragraph_text n'est pas vide
                                if font_size > 12:
                                    extracted_text += f"<h2>{paragraph_text.strip()}</h2>\n"  # Nettoyez et ajoutez le paragraphe
                                else:
                                    extracted_text += f"<p>{paragraph_text.strip()}</p>\n"
                                paragraph_text = ""  # Réinitialisez paragraph_text pour le nouveau paragraphe

                        paragraph_text += text + " "  # Ajoutez le texte de la ligne au paragraphe en cours
                        previous_bottom = line.y0

                # Ajoutez le dernier paragraphe du LTTextBox
                if paragraph_text:  # Vérifiez si paragraph_text contient du texte
                    if font_size > 12:
                        extracted_text += f"<h2>{paragraph_text.strip()}</h2>\n"
                    else:
                        extracted_text += f"<p>{paragraph_text.strip()}</p>\n"

    return extracted_text
