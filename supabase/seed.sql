-- Dados de exemplo para o Supabase LOCAL (rodado por "supabase db reset").
insert into public.testimonials (name, relation, message, language, consent, status) values
  ('Maria das Graças', 'Vizinha de vovó Ana', '(Exemplo) Dona Ana nunca deixava ninguém sair da casa dela sem um prato de comida e uma palavra de carinho.', 'pt', true, 'approved'),
  ('Lucía Fernández', 'Voluntaria', '(Ejemplo) Participar en la distribución de carne me enseñó lo que significa servir con alegría.', 'es', true, 'approved'),
  ('José Carlos', null, '(Exemplo pendente) Este depoimento aparece apenas no /admin até ser aprovado.', 'pt', true, 'pending');
