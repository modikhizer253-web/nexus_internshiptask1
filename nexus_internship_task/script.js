// Global variables
let currentUser = null;
let balance = 5000;
let transactions = [
    { amount: 1000, sender: 'Investor A', receiver: 'You', status: 'Completed' },
    { amount: 500, sender: 'You', receiver: 'Entrepreneur B', status: 'Pending' }
];
let inCall = false;
let audioOn = true;
let videoOn = true;
let docStatus = 'Draft';
let sigPad;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showSection('login');
    generateCalendar();
    sigPad = new SignaturePad(document.getElementById('signature-pad'));
    updateTransactions();
    // Dark mode toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const icon = document.querySelector('#theme-toggle i');
        icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
    });
});

// Routing: Show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'dashboard') {
        document.getElementById('tooltip').style.display = 'block';
        setTimeout(() => document.getElementById('tooltip').style.display = 'none', 5000);
    }
}

// Login with password strength and 2FA
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const strength = password.length > 6 ? (password.length > 10 ? 'strong' : 'medium') : 'weak';
    if (strength === 'weak') {
        alert('Password too weak! Make it stronger.');
        return;
    }
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('otp-section').style.display = 'block';
});

function verifyOTP() {
    const otp = document.getElementById('otp').value;
    if (otp === '1234') { // Mock OTP
        currentUser = 'User';
        document.getElementById('greeting').innerHTML = `<i class="fas fa-user"></i> Welcome back, ${currentUser}!`;
        showSection('dashboard');
    } else {
        alert('Invalid OTP!');
    }
}

function logout() {
    currentUser = null;
    showSection('login');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('otp-section').style.display = 'none';
}

// Password meter
document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = password.length > 6 ? (password.length > 10 ? 'strong' : 'medium') : 'weak';
    const meter = document.querySelector('#password-meter div');
    meter.style.width = strength === 'strong' ? '100%' : strength === 'medium' ? '50%' : '20%';
    meter.style.background = strength === 'strong' ? 'green' : strength === 'medium' ? 'yellow' : 'red';
});

// Calendar mock
function generateCalendar() {
    const grid = document.getElementById('calendar-grid');
    for (let i = 1; i <= 31; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        day.onclick = () => {
            const title = prompt('Add meeting title:');
            if (title) {
                day.innerHTML += `<br><small>${title}</small>`;
                day.style.background = '#27ae60';
                day.style.color = 'white';
            }
        };
        grid.appendChild(day);
    }
}

// Video Call
function startCall() {
    inCall = true;
    document.getElementById('call-ui').style.display = 'none';
    document.getElementById('in-call').style.display = 'block';
}

function endCall() {
    inCall = false;
    document.getElementById('call-ui').style.display = 'block';
    document.getElementById('in-call').style.display = 'none';
}

function toggleAudio() {
    audioOn = !audioOn;
    alert(audioOn ? 'Audio on!' : 'Audio off!');
}

function toggleVideo() {
    videoOn = !videoOn;
    alert(videoOn ? 'Video on!' : 'Video off!');
}

function shareScreen() {
    alert('Screen sharing started (mock)!');
}

// Document Chamber
document.getElementById('doc-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('doc-preview').innerHTML = `<i class="fas fa-file-pdf"></i> Preview: ${file.name} (PDF mock)`;
    }
});

function clearSignature() {
    sigPad.clear();
}

function signDocument() {
    if (sigPad.isEmpty()) {
        alert('Please sign first!');
    } else {
        docStatus = 'Signed';
        document.getElementById('doc-status').textContent = docStatus;
        document.getElementById('doc-status').classList.add('signed');
        alert('Document signed! 🎉');
    }
}

// Payments
function deposit() {
    balance += 500;
    updateBalance();
}

function withdraw() {
    if (balance >= 500) {
        balance -= 500;
        updateBalance();
    } else {
        alert('Insufficient balance!');
    }
}

function transfer() {
    const amount = prompt('Enter transfer amount:');
    if (amount && parseInt(amount) <= balance) {
        balance -= parseInt(amount);
        transactions.push({ amount: parseInt(amount), sender: 'You', receiver: 'Recipient', status: 'Completed' });
        updateBalance();
        updateTransactions();
    } else {
        alert('Invalid amount!');
    }
}

function updateBalance() {
    document.getElementById('balance').textContent = balance;
    document.getElementById('pay-balance').textContent = balance;
}

function updateTransactions() {
    const tbody = document.querySelector('#transactions tbody');
    tbody.innerHTML = '';
    transactions.forEach(t => {
        const row = `<tr><td>$${t.amount}</td><td>${t.sender}</td><td>${t.receiver}</td><td>${t.status}</td></tr>`;
        tbody.innerHTML += row;
    });
}