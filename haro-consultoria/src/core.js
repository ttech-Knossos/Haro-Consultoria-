export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validPhone(value) { return typeof value === 'string' && /^55[1-9]\d[2-9]\d{7,8}$/.test(value); }
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validateLead(data, services) {
  const errors = {};
  for (const [key,min,max,label] of [['name',2,80,'seu nome'],['business',2,100,'o nome ou tipo do negócio'],['message',10,1000,'o que você precisa (entre 10 e 1.000 caracteres)']]) {
    const value = typeof data[key] === 'string' ? data[key].trim() : '';
    if(value.length < min || value.length > max) errors[key] = `Informe ${label}.`;
  }
  if (!['nao-sei',...services.map(s => s.id)].includes(data.service)) errors.service = 'Selecione um serviço ou a opção “Ainda não sei”.';
  return errors;
}
export function whatsappUrl(phone, data, services) {
  if (!validPhone(phone)) throw new Error('O WhatsApp da Haro ainda não está disponível. Tente novamente mais tarde.');
  if (Object.keys(validateLead(data, services)).length) throw new Error('Revise os campos do formulário.');
  const service = services.find(s => s.id === data.service)?.title || 'Ainda não sei — preciso de orientação';
  const text = `Olá, Haro! Gostaria de pedir um orçamento.\n\nNome: ${data.name.trim()}\nNegócio: ${data.business.trim()}\nInteresse: ${service}\n\nO que preciso:\n${data.message.trim()}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
