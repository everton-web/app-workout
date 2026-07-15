-- Correção do trigger de novo usuário.
-- Sintoma: cadastro falha com "Database error saving new user".
-- Causa: função SECURITY DEFINER sem search_path -> INSERT em user_preferences falhava.
-- Rode este trecho no SQL Editor do Supabase.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
