/* ==========================================================================
   CENTRAL TEXAS HOME SERVICES & REPAIR - CORE INTERACTIVE ENGINE
   Handles Interactive Quote Estimator, Webhook Routing, and GEO Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFormHandler();
  initFaqAccordion();
});

/* ==========================================================================
   1. INTERACTIVE ESTIMATE CALCULATOR LOGIC
   ========================================================================== */

function initCalculator() {
  const serviceType = document.getElementById('calc-service');
  const projectScope = document.getElementById('calc-scope');
  const outputEl = document.getElementById('calc-price-output');

  if (!serviceType || !projectScope || !outputEl) return;

  function calculateEstimate() {
    const service = serviceType.value;
    const scope = projectScope.value;

    let baseMin = 0;
    let baseMax = 0;

    if (service === 'drywall-repair') {
      if (scope === 'small') { baseMin = 250; baseMax = 450; }
      else if (scope === 'medium') { baseMin = 450; baseMax = 850; }
      else if (scope === 'large') { baseMin = 850; baseMax = 1800; }
      else { baseMin = 1800; baseMax = 3500; }
    } else if (service === 'water-damage') {
      if (scope === 'small') { baseMin = 500; baseMax = 1200; }
      else if (scope === 'medium') { baseMin = 1200; baseMax = 2800; }
      else if (scope === 'large') { baseMin = 2800; baseMax = 5500; }
      else { baseMin = 5500; baseMax = 12000; }
    } else if (service === 'adu-garage') {
      if (scope === 'small') { baseMin = 45000; baseMax = 75000; }
      else if (scope === 'medium') { baseMin = 75000; baseMax = 125000; }
      else if (scope === 'large') { baseMin = 125000; baseMax = 185000; }
      else { baseMin = 185000; baseMax = 320000; }
    } else { // epoxy floor
      if (scope === 'small') { baseMin = 1800; baseMax = 3200; }
      else if (scope === 'medium') { baseMin = 3200; baseMax = 5500; }
      else if (scope === 'large') { baseMin = 5500; baseMax = 8500; }
      else { baseMin = 8500; baseMax = 14000; }
    }

    outputEl.textContent = 'Custom Quote Available (Free Inspection)';
    outputEl.style.fontSize = '1.25rem';
  }

  serviceType.addEventListener('change', calculateEstimate);
  projectScope.addEventListener('change', calculateEstimate);
  
  // Initial run
  calculateEstimate();
}

/* ==========================================================================
   2. FORM SUBMISSION & WEBHOOK ROUTER
   ========================================================================== */

function initFormHandler() {
  const quoteForm = document.getElementById('lead-quote-form');
  const successModal = document.getElementById('lead-success-modal');

  if (!quoteForm) return;

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Request...';

    const formData = {
      name: document.getElementById('lead-name').value,
      phone: document.getElementById('lead-phone').value,
      city: document.getElementById('lead-city').value,
      service: document.getElementById('calc-service').value,
      scope: document.getElementById('calc-scope').value,
      estimate: document.getElementById('calc-price-output').textContent,
      timestamp: new Date().toISOString(),
      source: window.location.pathname
    };

    console.log('🚀 [LEAD ROUTER] Capturing Lead Payload:', formData);

    try {
      // Simulate Webhook POST trigger (Can be pointed to Zapier, Make, or Twilio API)
      await new Promise(resolve => setTimeout(resolve, 800));

      if (successModal) {
        successModal.style.display = 'flex';
      } else {
        alert(`Thank you ${formData.name}! Your quote request for ${formData.city} has been received. A contractor will call ${formData.phone} shortly.`);
      }

      quoteForm.reset();
    } catch (err) {
      console.error('Error dispatching lead:', err);
      alert('Thank you! Your request has been logged.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ==========================================================================
   3. FAQ ACCORDION FOR CHATGPT & GEO READABILITY
   ========================================================================== */

function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      if (answer && answer.classList.contains('faq-answer')) {
        const isVisible = answer.style.display === 'block';
        answer.style.display = isVisible ? 'none' : 'block';
      }
    });
  });
}
