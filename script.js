// Clean buyers object and autocomplete logic
const buyers = {
  "D105060": {
    code: "D105060",
    name: "MAHENDRA GOVIND GAVALI",
    mobile: "9836839948",
    status: "Inactive",
    subscription: "Unsubscribed",
    plan: "NA",
    state: "Maharashtra",
    city: "Pune",
    portal: "Inactive"
  },
  "D104985": {
    code: "D104985",
    name: "VISHNU PRATAP SINGH",
    mobile: "9226911819",
    status: "Active",
    subscription: "Subscribed",
    plan: "Premium",
    state: "Uttar Pradesh",
    city: "Lucknow",
    portal: "Active"
  },
  "D104990": {
    code: "D104990",
    name: "RAJEEV GUPTA",
    mobile: "7878787850",
    status: "Active",
    subscription: "Subscribed",
    plan: "Basic",
    state: "Gujarat",
    city: "Ahmedabad",
    portal: "Active"
  },
  "D104625": {
    code: "D104625",
    name: "NIRMAL CHAND JAIN",
    mobile: "8866550088",
    status: "Inactive",
    subscription: "Unsubscribed",
    plan: "NA",
    state: "Delhi",
    city: "Delhi",
    portal: "Active"
  }
};

const srList = [
  { id: "S-1883", name: "Sanil Bangole" },
  { id: "S-2819", name: "Ami Rami" },
  { id: "S-0151", name: "Imran Mansuri" },
  { id: "S-0055", name: "Swapnil Yadav" },
  { id: "S-0090", name: "A Ali" }
];

const mappingHistory = JSON.parse(localStorage.getItem('mappingHistory') || '[]');

// Static mapping history for D104985 (VISHNU PRATAP SINGH)
const staticHistory = [
  {
    date: '2024-06-10T10:00:00',
    dealerCode: 'D104985',
    buyerName: 'VISHNU PRATAP SINGH',
    state: 'Uttar Pradesh',
    srCode: 'S-1883 (Sanil Bangole)',
    initiatedBy: 'Admin',
    approverName: 'Vinit Parekh',
    reason: 'Initial mapping',
    proofName: 'approval1.pdf',
    proofURL: '#'
  },
  {
    date: '2024-06-15T14:30:00',
    dealerCode: 'D104985',
    buyerName: 'VISHNU PRATAP SINGH',
    state: 'Uttar Pradesh',
    srCode: 'S-2819 (Ami Rami)',
    initiatedBy: 'Admin',
    approverName: 'Rupesh Gawade',
    reason: 'Updated mapping',
    proofName: 'approval2.pdf',
    proofURL: '#'
  },
  {
    date: '2024-06-20T09:45:00',
    dealerCode: 'D104985',
    buyerName: 'VISHNU PRATAP SINGH',
    state: 'Uttar Pradesh',
    srCode: 'S-0090 (A Ali)',
    initiatedBy: 'Admin',
    approverName: 'Vinit Parekh',
    reason: 'Latest mapping to A Ali',
    proofName: 'approval3.pdf',
    proofURL: '#'
  }
];

// Mapping from dealer code to default SR ID
const dealerToSR = {
  'D104985': 'S-0090', // VISHNU PRATAP SINGH -> A Ali
  'D105060': 'S-1883' // MAHENDRA GOVIND GAVALI -> Sanil Bangole
};

function formatDateToDDMMMYYYY_HHmmss(dateStr) {
  if (!dateStr) return '';
  let d = new Date(dateStr);
  if (isNaN(d)) {
    // Try to parse as 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DDTHH:mm:ss'
    const parts = dateStr.split(/[-T :]/);
    if (parts.length >= 6) {
      d = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        Number(parts[3]),
        Number(parts[4]),
        Number(parts[5])
      );
    } else if (parts.length >= 3) {
      d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
  }
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  let displayHour = hours % 12;
  displayHour = displayHour ? displayHour : 12; // the hour '0' should be '12'
  return `${day}-${month}-${year} ${displayHour}:${minutes}:${seconds} ${ampm}`;
}

function showBuyerDetails(buyer) {
  // Left: Buyer Details
  document.getElementById('buyerDetailsCard').innerHTML = `
    <div class="details-row"><div><strong>Dealer Code:</strong> <span>${buyer.code}</span></div></div>
    <div class="details-row"><div><strong>Dealer Name:</strong> <span>${buyer.name}</span></div></div>
    <div class="details-row"><div><strong>Mobile No.:</strong> <span>${buyer.mobile}</span></div></div>
    <div class="details-row"><div><strong>Current Status:</strong> <span>${buyer.status}</span></div></div>
    <div class="details-row"><div><strong>Subscription:</strong> <span>${buyer.subscription}</span></div></div>
    <div class="details-row"><div><strong>Plan Name:</strong> <span>${buyer.plan}</span></div></div>
    <div class="details-row"><div><strong>State:</strong> <span>${buyer.state}</span></div></div>
    <div class="details-row"><div><strong>City:</strong> <span>${buyer.city}</span></div></div>
    <div class="details-row"><div><strong>Portal Access:</strong> <span>${buyer.portal}</span></div></div>
  `;
  // Right: SR Details
  updateSRDetailsCard();
  document.getElementById('buyerDetails').classList.remove('hidden');
}

function updateSRDetailsCard() {
  const srInput = document.getElementById('srCode');
  const srDetailsCard = document.getElementById('srDetailsCard');
  let srId = srInput.dataset.srid || '';
  let sr = srList.find(s => s.id === srId);
  if (sr) {
    srDetailsCard.innerHTML = `
      <div class="details-row"><div><strong>SR Code:</strong> <span>${sr.id}</span></div></div>
      <div class="details-row"><div><strong>SR Name:</strong> <span>${sr.name}</span></div></div>
    `;
  } else {
    srDetailsCard.innerHTML = '<div style="color:#888;">No SR selected</div>';
  }
}

// Update SR card when SR changes
const srInputElem = document.getElementById('srCode');
srInputElem.addEventListener('input', updateSRDetailsCard);
srInputElem.addEventListener('blur', function() { setTimeout(updateSRDetailsCard, 100); });

function clearBuyerDetails() {
  document.getElementById('buyerDetailsCard').innerHTML = '';
  document.getElementById('srDetailsCard').innerHTML = '';
  document.getElementById('buyerDetails').classList.add('hidden');
}

// --- Autocomplete for Dealer Code ---
const dealerInput = document.getElementById('dealerCode');
const dealerList = document.getElementById('dealerCodeList');
const selectedBuyerName = document.getElementById('selectedBuyerName');
const clearDealerBtn = document.getElementById('clearDealerBtn');

function setDealerSelected(code) {
  dealerInput.value = code;
  dealerInput.disabled = true;
  selectedBuyerName.textContent = code + ' (' + buyers[code].name + ')';
  selectedBuyerName.style.display = 'flex';
  clearDealerBtn.style.display = 'block';
  dealerList.classList.remove('active');
  dealerInput.parentElement.classList.add('has-selection');
  // If dealer is mapped to a default SR, auto-select that SR
  if (dealerToSR[code]) {
    const mappedSR = srList.find(sr => sr.id === dealerToSR[code]);
    if (mappedSR) {
      srInput.value = mappedSR.id + ' (' + mappedSR.name + ')';
      srInput.dataset.srid = mappedSR.id;
      updateSRDetailsCard();
    }
  }
}

function clearDealerSelection() {
  dealerInput.value = '';
  dealerInput.disabled = false;
  selectedBuyerName.textContent = '';
  selectedBuyerName.style.display = 'none';
  clearDealerBtn.style.display = 'none';
  clearBuyerDetails();
  dealerInput.parentElement.classList.remove('has-selection');
}

clearDealerBtn.addEventListener('click', clearDealerSelection);

dealerInput.addEventListener('input', function() {
  const val = dealerInput.value.trim().toUpperCase();
  dealerList.innerHTML = '';
  selectedBuyerName.textContent = '';
  selectedBuyerName.style.display = 'none';
  clearDealerBtn.style.display = 'none';
  if (!val) {
    dealerList.classList.remove('active');
    return;
  }
  const matches = Object.keys(buyers).filter(code => code.includes(val) || buyers[code].name.toUpperCase().includes(val));
  if (matches.length) {
    dealerList.classList.add('active');
    matches.forEach(code => {
      const div = document.createElement('div');
      div.textContent = code + ' - ' + buyers[code].name;
      div.dataset.code = code;
      div.addEventListener('mousedown', function(e) {
        setDealerSelected(code);
      });
      dealerList.appendChild(div);
    });
    // If input matches a code exactly, show name
    if (buyers[val]) {
      // Optionally, auto-select if exact match
      // setDealerSelected(val);
    }
  } else {
    dealerList.classList.remove('active');
  }
  renderHistory();
});

dealerInput.addEventListener('focus', function() {
  if (!dealerInput.disabled) dealerInput.dispatchEvent(new Event('input'));
});
dealerInput.addEventListener('blur', function() {
  setTimeout(() => dealerList.classList.remove('active'), 150);
});

dealerInput.addEventListener('change', function() {
  const val = dealerInput.value.trim().toUpperCase();
  if (buyers[val]) {
    setDealerSelected(val);
  } else {
    selectedBuyerName.textContent = '';
    selectedBuyerName.style.display = 'none';
    clearDealerBtn.style.display = 'none';
  }
  renderHistory();
});

document.getElementById('searchBtn').addEventListener('click', function() {
  let code = dealerInput.value.trim().toUpperCase();
  if (dealerInput.disabled) {
    code = dealerInput.value.trim().toUpperCase();
  }
  if (buyers[code]) {
    showBuyerDetails(buyers[code]);
    setDealerSelected(code);
  } else {
    clearBuyerDetails();
    clearDealerSelection();
    alert('No buyer found for this Dealer Code.');
  }
  renderHistory();
});

// --- Autocomplete for SR Code ---
const srInput = document.getElementById('srCode');
const srListDiv = document.getElementById('srCodeList');

srInput.addEventListener('input', function() {
  const val = srInput.value.trim().toUpperCase();
  srListDiv.innerHTML = '';
  if (!val) {
    srListDiv.classList.remove('active');
    return;
  }
  const matches = srList.filter(sr => sr.id.toUpperCase().includes(val) || sr.name.toUpperCase().includes(val));
  if (matches.length) {
    srListDiv.classList.add('active');
    matches.forEach(sr => {
      const div = document.createElement('div');
      div.textContent = sr.id + ' (' + sr.name + ')';
      div.dataset.code = sr.id;
      div.addEventListener('mousedown', function(e) {
        srInput.value = sr.id + ' (' + sr.name + ')';
        srInput.dataset.srid = sr.id;
        srListDiv.classList.remove('active');
      });
      srListDiv.appendChild(div);
    });
  } else {
    srListDiv.classList.remove('active');
  }
});
srInput.addEventListener('focus', function() {
  srInput.dispatchEvent(new Event('input'));
});
srInput.addEventListener('blur', function() {
  setTimeout(() => srListDiv.classList.remove('active'), 150);
});

// Keyboard navigation for SR code autocomplete
let srIdx = -1;
srInput.addEventListener('keydown', function(e) {
  const items = srListDiv.querySelectorAll('div');
  if (!srListDiv.classList.contains('active') || !items.length) return;
  if (e.key === 'ArrowDown') {
    srIdx = (srIdx + 1) % items.length;
    items.forEach((el, i) => el.classList.toggle('active', i === srIdx));
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    srIdx = (srIdx - 1 + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle('active', i === srIdx));
    e.preventDefault();
  } else if (e.key === 'Enter') {
    if (srIdx >= 0 && items[srIdx]) {
      srInput.value = items[srIdx].textContent;
      srInput.dataset.srid = items[srIdx].dataset.code;
      srListDiv.classList.remove('active');
      srIdx = -1;
      e.preventDefault();
    }
  }
});
srInput.addEventListener('input', () => { srIdx = -1; });

// --- Update form submission to use selected values ---
document.getElementById('mappingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Validate buyer details are shown
  if (document.getElementById('buyerDetails').classList.contains('hidden')) {
    alert('Please search and select a valid Dealer Code.');
    return;
  }
  // Validate Dealer Code
  let dealerCode = dealerInput.value.trim().toUpperCase();
  if (!dealerInput.disabled || !buyers[dealerCode]) {
    alert('Please select a valid Dealer Code from the list.');
    return;
  }
  // Validate SR Code
  let srCode = srInput.value.trim();
  let srId = srInput.dataset.srid || '';
  if (!srCode || !srId) {
    // Try to match input to SR list
    const match = srList.find(sr => srCode === (sr.id + ' (' + sr.name + ')') || srCode === sr.id || srCode === sr.name);
    if (match) {
      srId = match.id;
      srCode = match.id + ' (' + match.name + ')';
    } else {
      alert('SR Code is required. Please select from the list.');
      return;
    }
  }
  // Validate Reason
  const reason = document.getElementById('reason').value.trim();
  if (!reason) {
    alert('Reason is required.');
    return;
  }
  // Validate Approver Name
  const approver = document.getElementById('approverName').value;
  if (!approver) {
    alert('Approver Name is required.');
    return;
  }
  // Validate file
  const proofInput = document.getElementById('proof');
  if (!proofInput.files.length) {
    alert('Please upload proof (approval mail).');
    return;
  }
  const file = proofInput.files[0];
  // Simulate upload and approval
  const now = new Date();
  const dateStr = formatDateToDDMMMYYYY_HHmmss(now);
  const buyer = buyers[dealerCode];
  // For demo, use static user names
  const initiatedBy = "Shrutika Sagewekar";
  // Save file as URL (for demo, not real upload)
  const proofURL = URL.createObjectURL(file);

  // Add to history
  mappingHistory.unshift({
    date: dateStr,
    dealerCode,
    buyerName: buyer.name,
    srCode: srCode,
    initiatedBy,
    approverName: approver,
    reason,
    proofName: file.name,
    proofURL
  });
  localStorage.setItem('mappingHistory', JSON.stringify(mappingHistory));
  renderHistory();

  // Reset form
  document.getElementById('mappingForm').reset();
  clearBuyerDetails();
  srInput.dataset.srid = '';
  clearDealerSelection();
  alert('Mapping submitted successfully!');
});

function renderHistory() {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = '';
  let dealerCode = dealerInput.value.trim().toUpperCase();
  if (!buyers[dealerCode]) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#888;">No mappings yet.</td></tr>';
    return;
  }
  let filteredHistory = mappingHistory;
  // If D104985, show static + dynamic
  if (dealerCode === 'D104985') {
    filteredHistory = [...staticHistory, ...mappingHistory.filter(row => row.dealerCode === dealerCode)];
  } else {
    filteredHistory = mappingHistory.filter(row => row.dealerCode === dealerCode);
  }
  if (!filteredHistory.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#888;">No mappings yet.</td></tr>';
    return;
  }
  filteredHistory.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDateToDDMMMYYYY_HHmmss(row.date)}</td>
      <td>${row.dealerCode}</td>
      <td>${row.buyerName}</td>
      <td>${buyers[row.dealerCode] ? buyers[row.dealerCode].state : row.state || ''}</td>
      <td>${row.srCode}</td>
      <td>${row.initiatedBy}</td>
      <td>${row.approverName || row.approvedBy || ''}</td>
      <td>${row.reason}</td>
      <td><a href="${row.proofURL}" target="_blank">${row.proofName}</a></td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate SR Code dropdown on load
function populateSRDropdown() {
  const srSelect = document.getElementById('srCode');
  srSelect.innerHTML = '<option value="">Select SR</option>' + srList.map(sr => `<option value="${sr.id}">${sr.id} (${sr.name})</option>`).join('');
}

// On load
populateSRDropdown();
renderHistory(); 