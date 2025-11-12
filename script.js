// Data Storage
let users = [];
let messages = [];
let content = [];
let currentUser = null;
let messageRecipient = null;

// Initialize with demo data
function initDemoData() {
    users = [
        { id: 1, name: 'Aditya', email: 'business@demo.com', password: 'demo', type: 'business', bio: 'Marketing Agency' },
        { id: 2, name: 'Anushka', email: 'creator@demo.com', password: 'demo', type: 'creator', bio: 'Video Editor & Photographer' },
        { id: 3, name: 'Mike User', email: 'user@demo.com', password: 'demo', type: 'user', bio: '' }
    ];

    messages = [
        { id: 1, from: 1, to: 2, text: 'Hi Anushka! We need a promotional video for our new product launch.', time: new Date().toLocaleString() }
    ];

    content = [
        { id: 1, creatorId: 2, businessId: 1, title: 'Product Launch Video', description: 'Exciting promo for new product', type: 'video', views: 150, date: new Date().toLocaleDateString() }
    ];
}

initDemoData();

// Account type change handler
document.getElementById('accountType').addEventListener('change', function () {
    const bioField = document.getElementById('bioField');
    if (this.value === 'creator' || this.value === 'business') {
        bioField.style.display = 'block';
    } else {
        bioField.style.display = 'none';
    }
});

// File input display
document.getElementById('contentFile').addEventListener('change', function () {
    const fileName = this.files[0]?.name || '';
    document.getElementById('fileName').textContent = fileName;
});

// Auth Functions
function toggleAuth() {
    document.getElementById('loginForm').classList.toggle('hidden');
    document.getElementById('registerForm').classList.toggle('hidden');
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const type = document.getElementById('accountType').value;
    const bio = document.getElementById('regBio').value;

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        type,
        bio
    };

    users.push(newUser);
    alert('Registration successful! Please login.');
    toggleAuth();
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        showMainApp();
    } else {
        alert('Invalid credentials. Try demo accounts:\nbusiness@demo.com / demo\ncreator@demo.com / demo\nuser@demo.com / demo');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userBadge').textContent = currentUser.type.toUpperCase();
    document.getElementById('userBadge').className = `badge ${currentUser.type}`;

    // Show appropriate dashboard
    document.getElementById('businessDashboard').classList.add('hidden');
    document.getElementById('creatorDashboard').classList.add('hidden');
    document.getElementById('userDashboard').classList.add('hidden');

    if (currentUser.type === 'business') {
        document.getElementById('businessDashboard').classList.remove('hidden');
        loadCreators();
        loadBusinessMessages();
        loadBusinessContent();
    } else if (currentUser.type === 'creator') {
        document.getElementById('creatorDashboard').classList.remove('hidden');
        loadCreatorMessages();
        loadMyContent();
        loadBusinessList();
    } else {
        document.getElementById('userDashboard').classList.remove('hidden');
        loadAllContent();
    }
}

// Tab switching
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    event.target.classList.add('active');

    const tabMap = {
        'creators': 'creatorsTab',
        'messages': 'messagesTab',
        'content': 'contentTab',
        'creator-messages': 'creatorMessagesTab',
        'upload': 'uploadTab',
        'my-content': 'myContentTab'
    };

    document.getElementById(tabMap[tabName]).classList.add('active');
}

// Business Functions
function loadCreators() {
    const creators = users.filter(u => u.type === 'creator');
    const html = creators.map(creator => `
                <div class="creator-card">
                    <h4>${creator.name}</h4>
                    <p>${creator.bio}</p>
                    <button class="btn-hire" onclick="openMessageModal(${creator.id})">Hire & Message</button>
                </div>
            `).join('');
    document.getElementById('creatorsList').innerHTML = html || '<p>No creators available</p>';
}

function loadBusinessMessages() {
    const myMessages = messages.filter(m => m.from === currentUser.id || m.to === currentUser.id);
    const html = myMessages.map(msg => {
        const sender = users.find(u => u.id === msg.from);
        return `
                    <div class="message">
                        <div class="message-header">
                            <span>From: ${sender?.name}</span>
                        </div>
                        <div class="message-body">${msg.text}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
    }).join('');
    document.getElementById('businessMessages').innerHTML = html || '<p>No messages yet</p>';
}

function loadBusinessContent() {
    const myContent = content.filter(c => c.businessId === currentUser.id);
    const html = myContent.map(c => {
        const creator = users.find(u => u.id === c.creatorId);
        return `
                    <div class="content-card">
                        <div class="content-media">${c.type === 'video' ? '🎥' : '📷'} ${c.type.toUpperCase()}</div>
                        <div class="content-info">
                            <h4>${c.title}</h4>
                            <p>${c.description}</p>
                            <div class="content-meta">
                                <span>By: ${creator?.name}</span>
                                <span>👁 ${c.views} views</span>
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('businessContent').innerHTML = html || '<p>No content yet</p>';
}

// Creator Functions
function loadCreatorMessages() {
    const myMessages = messages.filter(m => m.to === currentUser.id);
    const html = myMessages.map(msg => {
        const sender = users.find(u => u.id === msg.from);
        return `
                    <div class="message">
                        <div class="message-header">
                            <span>Job Request from: ${sender?.name}</span>
                        </div>
                        <div class="message-body">${msg.text}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
    }).join('');
    document.getElementById('creatorMessages').innerHTML = html || '<p>No job requests yet</p>';
}

function loadBusinessList() {
    const businesses = users.filter(u => u.type === 'business');
    const select = document.getElementById('selectBusiness');
    select.innerHTML = '<option value="">Personal Content</option>' +
        businesses.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
}

function uploadContent() {
    const title = document.getElementById('contentTitle').value;
    const desc = document.getElementById('contentDesc').value;
    const type = document.getElementById('contentType').value;
    const businessId = document.getElementById('selectBusiness').value;
    const file = document.getElementById('contentFile').files[0];

    if (!title || !desc) {
        alert('Please fill in all fields');
        return;
    }

    const newContent = {
        id: content.length + 1,
        creatorId: currentUser.id,
        businessId: businessId ? parseInt(businessId) : null,
        title,
        description: desc,
        type,
        views: 0,
        date: new Date().toLocaleDateString()
    };

    content.push(newContent);
    alert('Content uploaded successfully!');

    // Reset form
    document.getElementById('contentTitle').value = '';
    document.getElementById('contentDesc').value = '';
    document.getElementById('contentFile').value = '';
    document.getElementById('fileName').textContent = '';

    loadMyContent();
}

function loadMyContent() {
    const myContent = content.filter(c => c.creatorId === currentUser.id);
    const html = myContent.map(c => {
        const business = c.businessId ? users.find(u => u.id === c.businessId) : null;
        return `
                    <div class="content-card">
                        <div class="content-media">${c.type === 'video' ? '🎥' : '📷'} ${c.type.toUpperCase()}</div>
                        <div class="content-info">
                            <h4>${c.title}</h4>
                            <p>${c.description}</p>
                            <div class="content-meta">
                                <span>${business ? `For: ${business.name}` : 'Personal'}</span>
                                <span>👁 ${c.views} views</span>
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('myContent').innerHTML = html || '<p>No content uploaded yet</p>';
}

// User Functions
function loadAllContent() {
    const html = content.map(c => {
        const creator = users.find(u => u.id === c.creatorId);
        return `
                    <div class="content-card">
                        <div class="content-media">${c.type === 'video' ? '🎥' : '📷'} ${c.type.toUpperCase()}</div>
                        <div class="content-info">
                            <h4>${c.title}</h4>
                            <p>${c.description}</p>
                            <div class="content-meta">
                                <span>By: ${creator?.name}</span>
                                <span>👁 ${c.views} views</span>
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
    document.getElementById('userContent').innerHTML = html || '<p>No content available</p>';
}

// Message Functions
function openMessageModal(creatorId) {
    const creator = users.find(u => u.id === creatorId);
    messageRecipient = creator;
    document.getElementById('recipientName').textContent = creator.name;
    document.getElementById('messageModal').classList.add('active');
}

function closeModal() {
    document.getElementById('messageModal').classList.remove('active');
    document.getElementById('messageText').value = '';
}

function sendMessage() {
    const text = document.getElementById('messageText').value;

    if (!text) {
        alert('Please enter a message');
        return;
    }

    const newMessage = {
        id: messages.length + 1,
        from: currentUser.id,
        to: messageRecipient.id,
        text,
        time: new Date().toLocaleString()
    };

    messages.push(newMessage);
    alert('Message sent successfully!');
    closeModal();
    loadBusinessMessages();
}