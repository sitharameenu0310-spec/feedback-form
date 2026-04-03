// Replace this with your Google Apps Script Web App URL after deployment
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxbYnr5S570gVElsDr2qaYoqCFRC0I2LpYC0O4hbW2JF9CUqT9EOlcHtuok87P6h_LX/exec"
const form = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMessage');
const errorMsg = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressContainer = document.getElementById('progressContainer');

const totalPages = 2;

function updateProgressBar(page) {
    const progress = (page / totalPages) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = `Page ${page} of ${totalPages}`;
}

// Page Navigation
function nextPage(currentPage) {
    const currentDiv = document.getElementById('page' + currentPage);
    const nextDiv = document.getElementById('page' + (currentPage + 1));

    // Validate current page fields
    const inputs = currentDiv.querySelectorAll('input[required]:not([type="checkbox"]), select[required], textarea[required]');
    let allValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            allValid = false;
            input.reportValidity();
        }
    });

    // Custom validation for trainer_effectiveness checkbox group (it's on page 2)
    if (currentPage === 2) {
        const checkboxes = currentDiv.querySelectorAll('input[name="trainer_effectiveness"]');
        if (checkboxes.length > 0) {
            const isChecked = Array.from(checkboxes).some(cb => cb.checked);
            const errorMsg = document.getElementById('trainer_effectiveness_error');
            if (!isChecked) {
                allValid = false;
                if (errorMsg) errorMsg.style.display = 'flex';
                checkboxes[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                if (errorMsg) errorMsg.style.display = 'none';
            }
        }
    }


    if (allValid && nextDiv) {
        currentDiv.classList.remove('active');
        nextDiv.classList.add('active');
        window.scrollTo(0, 0);
        updateProgressBar(currentPage + 1);
    }
}

function prevPage(currentPage) {
    const currentDiv = document.getElementById('page' + currentPage);
    const prevDiv = document.getElementById('page' + (currentPage - 1));

    if (prevDiv) {
        currentDiv.classList.remove('active');
        prevDiv.classList.add('active');
        window.scrollTo(0, 0);
        updateProgressBar(currentPage - 1);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        alert("Please set up your Google Apps Script URL in script.js first!");
        return;
    }

    // Update UI state
    submitBtn.disabled = true;
    const backBtn = document.querySelector('.form-page.active .back-btn');
    const clearBtn = document.querySelector('.form-page.active .clear-btn');
    if (backBtn) backBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;

    submitBtn.classList.add('loading');
    submitBtn.textContent = "Processing...";

    const formData = new FormData(form);

    // Format trainer_effectiveness checkboxes (join multiple values with commas)
    const effectivenessValues = formData.getAll('trainer_effectiveness');
    if (effectivenessValues.length > 0) {
        formData.delete('trainer_effectiveness');
        formData.append('trainer_effectiveness', effectivenessValues.join(', '));
    }


    // Add current timestamp
    formData.append('timestamp', new Date().toLocaleString());

    try {
        // Convert FormData to URLSearchParams for better compatibility with Apps Script e.parameter
        const params = new URLSearchParams();
        for (const [key, value] of formData) {
            params.append(key, value);
        }

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: params,
            mode: 'no-cors'
        });

        showStatus('success');
        form.reset();

        // Reset to first page
        document.querySelectorAll('.form-page').forEach(page => page.classList.remove('active'));
        document.getElementById('page1').classList.add('active');
        updateProgressBar(1);

    } catch (error) {
        console.error('Error!', error.message);
        showStatus('error');
    } finally {
        submitBtn.disabled = false;
        const backBtn = document.querySelector('.form-page.active .back-btn');
        const clearBtn = document.querySelector('.form-page.active .clear-btn');
        if (backBtn) backBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;

        submitBtn.classList.remove('loading');
        submitBtn.textContent = "Submit";
    }
});

function showStatus(status) {
    form.classList.add('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');

    // Reset submit button state
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.textContent = "Submit";

    if (status === 'success') {
        successMsg.classList.remove('hidden');
        errorMsg.classList.add('hidden');
    } else {
        errorMsg.classList.remove('hidden');
        successMsg.classList.add('hidden');
    }
}

function resetForm() {
    form.classList.remove('hidden');
    if (progressContainer) progressContainer.classList.remove('hidden');
    successMsg.classList.add('hidden');
    errorMsg.classList.add('hidden');
    window.scrollTo(0, 0);
}

function clearForm() {
    if (confirm("This will clear all your answers. Are you sure?")) {
        form.reset();
        window.scrollTo(0, 0);
    }
}

function toggleForm() {
    form.classList.remove('hidden');
    if (progressContainer) progressContainer.classList.remove('hidden');
    errorMsg.classList.add('hidden');
}

// Exhibition Conditional Logic
const wizklubDayYes = document.getElementById('wizklub_day_yes');
const wizklubDayNo = document.getElementById('wizklub_day_no');
const wizklubDayYet = document.getElementById('wizklub_day_yet');
const containerQ3 = document.getElementById('container_q3');
const containerQ4 = document.getElementById('container_q4');
const containerQ5 = document.getElementById('container_q5');

function toggleExhibitionQuestions() {
    if (!containerQ3 || !containerQ4 || !containerQ5) return;
    const containerQ2 = document.getElementById('container_q2');

    const show = (wizklubDayYes && wizklubDayYes.checked) || (wizklubDayNo && wizklubDayNo.checked);

    if (show) {
        if (containerQ2) containerQ2.classList.remove('hidden');
        containerQ3.classList.remove('hidden');
        containerQ4.classList.remove('hidden');
        containerQ5.classList.remove('hidden');
    } else {
        if (containerQ2) containerQ2.classList.add('hidden');
        containerQ3.classList.add('hidden');
        containerQ4.classList.add('hidden');
        containerQ5.classList.add('hidden');
    }

    // Toggle required attribute for inputs within these containers
    const containersToToggle = [containerQ3, containerQ4, containerQ5];
    if (containerQ2) containersToToggle.push(containerQ2);

    containersToToggle.forEach(container => {
        const inputs = container.querySelectorAll('input[type="radio"], textarea');
        inputs.forEach(input => {
            if (input.tagName.toLowerCase() === 'textarea') {
                input.required = show;
            } else if (input.type === 'radio') {
                // For radio groups, only the first one needs 'required' in the original HTML
                // We'll set it for the first radio of each name group found in the container
                const name = input.name;
                const firstOfName = container.querySelector(`input[name="${name}"]`);
                if (input === firstOfName) {
                    input.required = show;
                }
            }
        });
    });
}

if (wizklubDayYes && wizklubDayNo) {
    wizklubDayYes.addEventListener('change', toggleExhibitionQuestions);
    wizklubDayNo.addEventListener('change', toggleExhibitionQuestions);
    if (wizklubDayYet) wizklubDayYet.addEventListener('change', toggleExhibitionQuestions);
}

// Initial progress
updateProgressBar(1);
toggleExhibitionQuestions();

// Searchable Dropdown Logic
function initSearchableDropdown() {
    const searchInput = document.getElementById('branch_search');
    const resultsContainer = document.getElementById('branch_results');
    const hiddenSelect = document.getElementById('branch');
    const options = Array.from(hiddenSelect.options).filter(opt => opt.value !== "");

    function renderResults(filteredOptions) {
        resultsContainer.innerHTML = '';
        if (filteredOptions.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No schools found</div>';
            return;
        }

        filteredOptions.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.textContent = opt.text;
            if (opt.selected) item.classList.add('selected');

            item.onclick = () => {
                hiddenSelect.value = opt.value;
                searchInput.value = opt.text;
                resultsContainer.classList.add('hidden');

                // Trigger change event if needed
                hiddenSelect.dispatchEvent(new Event('change'));
            };
            resultsContainer.appendChild(item);
        });
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        resultsContainer.classList.remove('hidden');

        const filtered = options.filter(opt =>
            opt.text.toLowerCase().includes(query)
        );
        renderResults(filtered);
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value === '') {
            renderResults(options);
        }
        resultsContainer.classList.remove('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
}

// Initialize on load
initSearchableDropdown();

// Update form reset and clear logic to re-apply toggle and search reset
const originalResetForm = resetForm;
resetForm = function () {
    originalResetForm();
    toggleExhibitionQuestions();
    document.getElementById('branch_search').value = '';
};

const originalClearForm = clearForm;
clearForm = function () {
    if (confirm("This will clear all your answers. Are you sure?")) {
        form.reset();
        window.scrollTo(0, 0);
        toggleExhibitionQuestions();
        document.getElementById('branch_search').value = '';
    }
};
