import {validateLead,whatsappUrl,validPhone} from './core.js';
const menu = document.querySelector('#main-menu');
document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu?.open){menu.open=false; menu.querySelector('summary').focus();}});
document.addEventListener('click',event=>{if(menu?.open && !menu.contains(event.target)) menu.open=false;});
const form = document.querySelector('#quote-form');
if(form) {
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('button[type="submit"]');
  try {
    const response = await fetch('./content.json');
    if(!response.ok) throw Error('Não foi possível carregar o formulário. Atualize a página e tente novamente.');
    const content = await response.json();
    const selected = new URLSearchParams(location.search).get('servico');
    if(content.services.some(s=>s.id===selected)) form.elements.service.value=selected;
    if(!validPhone(content.whatsapp)) {
      status.textContent='Nosso canal de orçamento está sendo preparado. Volte em breve para conversar com a Haro.';
    } else {
      submit.disabled=false;
      form.addEventListener('submit',event=>{
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const errors = validateLead(data,content.services);
        for(const name of ['name','business','service','message']) {
          form.elements[name].setAttribute('aria-invalid',String(Boolean(errors[name])));
          document.querySelector(`#${name}-error`).textContent = errors[name] || '';
        }
        const first=Object.keys(errors)[0];
        if(first) {status.textContent='Revise os campos indicados antes de continuar.';form.elements[first].focus();return;}
        try {location.assign(whatsappUrl(content.whatsapp,data,content.services));}
        catch(error) {status.textContent=error.message;}
      });
    }
  } catch(error) {status.textContent='Não foi possível preparar o formulário. Atualize a página e tente novamente.';}
  // Prevent native submission even when initialization fails or WhatsApp is missing.
  form.addEventListener('submit',event=>event.preventDefault());
}
