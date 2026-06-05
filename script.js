const FORMSPREE_ENDPOINT="https://formspree.io/f/xojzvzdn";
const products=[
{id:"cookie-classic",category:"cookies",name:"Classic Chocolate Chip",price:369,note:"Box of 6 — 50g each"},
{id:"cookie-walnut",category:"cookies",name:"Chocolate Walnut",price:399,note:"Box of 6 — 50g each"},
{id:"cookie-espresso",category:"cookies",name:"Espresso Chocolate",price:369,note:"Box of 6 — 50g each"},
{id:"cookie-red-velvet",category:"cookies",name:"Red Velvet Cream Cheese",price:429,note:"Box of 6 — 50g each",badge:"New"},
{id:"cookie-assorted",category:"cookies",name:"Assorted Box",price:399,note:"Mixed flavors, box of 6"},
{id:"rolls-4-classic",category:"rolls",name:"Classic Cream Cheese",price:420,note:"Box of 4"},
{id:"rolls-4-strawberry",category:"rolls",name:"Strawberry Cheesecake",price:549,note:"Box of 4"},
{id:"rolls-4-assorted",category:"rolls",name:"Assorted Box",price:519,note:"2 Classic + 2 Strawberry"},
{id:"rolls-6-classic",category:"rolls",name:"Classic Cream Cheese",price:649,note:"Box of 6"},
{id:"rolls-6-strawberry",category:"rolls",name:"Strawberry Cheesecake",price:779,note:"Box of 6"},
{id:"rolls-6-assorted",category:"rolls",name:"Assorted Box",price:739,note:"3 Classic + 3 Strawberry"},
{id:"cupcakes-4",category:"cupcakes",name:"Banana Cupcakes",price:360,note:"Box of 4"},
{id:"cupcakes-6",category:"cupcakes",name:"Banana Cupcakes",price:520,note:"Box of 6"}
];
const grids={cookies:document.querySelector("#cookies-grid"),rolls:document.querySelector("#rolls-grid"),cupcakes:document.querySelector("#cupcakes-grid")};
const peso=new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0});
function productCard(product){const badge=product.badge?`<span class="badge">${product.badge}</span>`:"";return `<article class="product-card" data-product-id="${product.id}"><div class="product-top"><div><div class="product-name">${product.name}${badge}</div><small>${product.note}</small></div><div class="price">${peso.format(product.price)}</div></div><div class="qty-control"><button type="button" aria-label="Decrease ${product.name}" data-action="decrease">−</button><input type="number" min="0" value="0" inputmode="numeric" aria-label="${product.name} quantity"/><button type="button" aria-label="Increase ${product.name}" data-action="increase">+</button></div></article>`}
products.forEach(p=>grids[p.category].insertAdjacentHTML("beforeend",productCard(p)));
const summaryEl=document.querySelector("#order-summary"),totalEl=document.querySelector("#order-total"),summaryField=document.querySelector("#order-summary-field"),totalField=document.querySelector("#order-total-field"),form=document.querySelector("#order-form"),submitBtn=document.querySelector("#submit-btn"),statusEl=document.querySelector("#form-status"),fulfillment=document.querySelector("#fulfillment"),deliveryAddressWrap=document.querySelector("#delivery-address-wrap");
function getSelections(){return products.map(p=>{const card=document.querySelector(`[data-product-id="${p.id}"]`);const qty=Number(card.querySelector("input").value||0);return {...p,qty,subtotal:qty*p.price}}).filter(i=>i.qty>0)}
function updateSummary(){const selections=getSelections();const total=selections.reduce((s,i)=>s+i.subtotal,0);summaryEl.innerHTML=!selections.length?`<div class="summary-empty">No boxes selected yet.</div>`:selections.map(i=>`<div class="summary-item"><span>${i.qty} × ${i.name}<br><small>${i.note}</small></span><strong>${peso.format(i.subtotal)}</strong></div>`).join("");totalEl.textContent=peso.format(total);summaryField.value=selections.map(i=>`${i.qty} x ${i.name} (${i.note}) — ${peso.format(i.subtotal)}`).join("\n")||"No items selected";totalField.value=peso.format(total)}
document.addEventListener("click",e=>{const button=e.target.closest("button[data-action]");if(!button)return;const input=button.closest(".product-card").querySelector("input");const current=Number(input.value||0);if(button.dataset.action==="increase")input.value=current+1;if(button.dataset.action==="decrease")input.value=Math.max(0,current-1);updateSummary()});
document.addEventListener("input",e=>{if(e.target.closest(".qty-control"))updateSummary()});
fulfillment.addEventListener("change",()=>{deliveryAddressWrap.classList.toggle("hidden",fulfillment.value!=="Delivery")});
form.addEventListener("submit",async e=>{e.preventDefault();updateSummary();statusEl.textContent="";statusEl.className="";if(!getSelections().length){statusEl.textContent="Choose at least one box before submitting.";statusEl.className="error";return}if(!form.checkValidity()){statusEl.textContent="Please complete the required fields.";statusEl.className="error";form.reportValidity();return}submitBtn.disabled=true;submitBtn.textContent="Sending...";try{const formData=new FormData(form);const response=await fetch(FORMSPREE_ENDPOINT,{method:"POST",body:formData,headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Submission failed");form.reset();document.querySelectorAll(".qty-control input").forEach(input=>input.value=0);deliveryAddressWrap.classList.add("hidden");updateSummary();statusEl.textContent="Order sent. We’ll review your slot and message you for confirmation.";statusEl.className="success"}catch(err){statusEl.textContent="Something went wrong. Please try again or message Crumb & Quill directly.";statusEl.className="error"}finally{submitBtn.disabled=false;submitBtn.textContent="Submit order"}});
updateSummary();
