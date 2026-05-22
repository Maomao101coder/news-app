// ===== DATA =====
const USERS = [
  { id: 1, name: "Alex Chen",    handle: "alexchen",  avatar: "A", gradient: "gradient-2", bio: "📸 Photographer & traveler" },
  { id: 2, name: "Sara Kim",     handle: "sarakim",   avatar: "S", gradient: "gradient-3", bio: "🎨 Designer at heart" },
  { id: 3, name: "Jake Morris",  handle: "jakemo",    avatar: "J", gradient: "gradient-4", bio: "💻 Full-stack dev" },
  { id: 4, name: "Luna Reyes",   handle: "lunareyes", avatar: "L", gradient: "gradient-5", bio: "🌙 Night owl & writer" },
  { id: 5, name: "Ryu Park",     handle: "ryupark",   avatar: "R", gradient: "gradient-6", bio: "🎮 Gamer & streamer" },
];

const SEED_POSTS = [
  { id: 1, userId: 1, content: "Just captured the most breathtaking sunset I've ever seen 🌅 Nature never ceases to amaze me. #Photography #GoldenHour", likes: 142, comments: [], shares: 23, time: "2m ago", liked: false, bookmarked: false },
  { id: 2, userId: 2, content: "Finished my latest UI design project! Obsessed with the glassmorphism trend right now ✨ The future of design is HERE. #UIDesign #Glassmorphism #Creative", likes: 89, comments: [], shares: 14, time: "15m ago", liked: false, bookmarked: false },
  { id: 3, userId: 3, content: "Hot take: Dark mode isn't just a preference — it's a lifestyle. ☕🌙 Who else writes their best code at midnight? #DevLife #DarkMode", likes: 234, comments: [], shares: 67, time: "1h ago", liked: false, bookmarked: false },
  { id: 4, userId: 4, content: "Sometimes all you need is a quiet evening, a good book, and a cup of tea. ☕ Slowing down is the new productivity. #Mindfulness #Cozy", likes: 178, comments: [], shares: 31, time: "3h ago", liked: false, bookmarked: false },
  { id: 5, userId: 5, content: "Just hit 1000 subscribers on my gaming channel! 🎮🎉 Thank you all SO much. We're just getting started — epic content incoming! #Gaming #Milestone #Streaming", likes: 512, comments: [], shares: 95, time: "5h ago", liked: false, bookmarked: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "like",    icon: "❤️", iconBg: "rgba(252,92,156,0.15)", user: "Alex Chen",   text: "liked your post about sunset photography", time: "2m ago",  unread: true  },
  { id: 2, type: "follow",  icon: "👤", iconBg: "rgba(124,92,252,0.15)", user: "Luna Reyes",  text: "started following you",                   time: "10m ago", unread: true  },
  { id: 3, type: "comment", icon: "💬", iconBg: "rgba(92,240,252,0.15)", user: "Jake Morris", text: "commented on your post: \"So true! 🙌\"",  time: "1h ago",  unread: true  },
  { id: 4, type: "share",   icon: "🔁", iconBg: "rgba(92,252,160,0.15)", user: "Sara Kim",    text: "shared your post with 24 people",          time: "3h ago",  unread: false },
  { id: 5, type: "like",    icon: "❤️", iconBg: "rgba(252,92,156,0.15)", user: "Ryu Park",    text: "liked your comment on Jake's post",       time: "5h ago",  unread: false },
];

const CONVERSATIONS = [
  { id: 1, userId: 1, preview: "Wow that photo is stunning! 😍",        time: "2m",  messages: [
    { text: "Hey! Loved your latest post!", sent: false },
    { text: "Thanks so much! It took forever to get that angle right 😅", sent: true },
    { text: "Wow that photo is stunning! 😍", sent: false },
  ]},
  { id: 2, userId: 2, preview: "Can we collab on that design project?", time: "1h",  messages: [
    { text: "Hey Sara, I saw your glassmorphism work!", sent: true },
    { text: "Thanks! It was super fun to build 🎨", sent: false },
    { text: "Can we collab on that design project?", sent: false },
  ]},
  { id: 3, userId: 3, preview: "Midnight coding session? Count me in 🌙", time: "3h", messages: [
    { text: "Dark mode gang forever 🌙", sent: true },
    { text: "FACTS. Nothing better than coding at 2am lol", sent: false },
    { text: "Midnight coding session? Count me in 🌙", sent: true },
  ]},
];

const TRENDING = [
  { tag: "#WebDev",      count: "12.4K posts" },
  { tag: "#Photography", count: "9.1K posts"  },
  { tag: "#DarkMode",    count: "7.8K posts"  },
  { tag: "#UIDesign",    count: "6.2K posts"  },
  { tag: "#Gaming",      count: "5.5K posts"  },
];

// ===== STATE =====
let posts = [...SEED_POSTS];
let nextPostId = posts.length + 1;
let activeConvoId = null;
let activePostIdForModal = null;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderFeed();
  renderProfileFeed();
  renderWhoToFollow();
  renderTrendingWidget();
  renderNotifications();
  renderConversations();
  renderTrendingTags();
  renderSuggestions();
  updatePostCount();
});

// ===== NAVIGATION =====
function showPage(page, el, isMobile = false) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");

  if (isMobile) {
    document.querySelectorAll(".mobile-nav-item").forEach(i => i.classList.remove("active"));
  } else {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
  }
  el.classList.add("active");
  return false;
}

// ===== FEED =====
function renderFeed(filter = null) {
  const feed = document.getElementById("feed");
  const list = filter ? posts.filter(p => p.content.toLowerCase().includes(filter.toLowerCase())) : posts;
  feed.innerHTML = list.length
    ? list.map(postHTML).join("")
    : `<div style="text-align:center;padding:3rem;color:var(--text-muted)">No posts found</div>`;
}

function postHTML(post) {
  const user = USERS.find(u => u.id === post.userId) || { name: "Maomao", handle: "maomao", avatar: "M", gradient: "gradient-1" };
  const content = post.content.replace(/#(\w+)/g, '<span class="post-tag">#$1</span>');
  return `
    <article class="post-card" id="post-${post.id}">
      <div class="post-header">
        <div class="avatar avatar-md ${user.gradient}" onclick="showPage('profile', document.getElementById('nav-profile'))">${user.avatar}</div>
        <div class="post-user-info">
          <div class="post-author">${user.name}</div>
          <div class="post-meta">@${user.handle} · ${post.time}</div>
        </div>
        <button class="icon-btn post-menu" title="More">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
      <div class="post-content">${content}</div>
      <div class="post-actions">
        <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})" id="like-btn-${post.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span id="like-count-${post.id}">${post.likes}</span>
        </button>
        <button class="action-btn comment-btn" onclick="openModal(${post.id})">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${post.comments.length}</span>
        </button>
        <button class="action-btn share-btn" onclick="sharePost(${post.id})">
          <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          <span id="share-count-${post.id}">${post.shares}</span>
        </button>
        <button class="action-btn bookmark-btn" onclick="toggleBookmark(${post.id})" id="bookmark-btn-${post.id}" style="margin-left:auto">
          <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" ${post.bookmarked ? 'fill="var(--orange)" stroke="var(--orange)"' : ''}/></svg>
        </button>
      </div>
    </article>`;
}

function createPost() {
  const input = document.getElementById("postInput");
  const text = input.innerText.trim();
  if (!text) { input.style.borderColor = "var(--pink)"; setTimeout(() => input.style.borderColor = "", 800); return; }
  const newPost = { id: nextPostId++, userId: 0, content: text, likes: 0, comments: [], shares: 0, time: "Just now", liked: false, bookmarked: false };
  posts.unshift(newPost);
  input.innerText = "";
  renderFeed();
  renderProfileFeed();
  updatePostCount();
}

function insertEmoji() {
  const emojis = ["😊","🔥","✨","❤️","🎉","💡","🚀","🌙","👀","💻"];
  const e = emojis[Math.floor(Math.random() * emojis.length)];
  const input = document.getElementById("postInput");
  input.focus();
  document.execCommand("insertText", false, " " + e + " ");
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  const btn = document.getElementById("like-btn-" + id);
  const count = document.getElementById("like-count-" + id);
  if (btn) { btn.classList.toggle("liked", post.liked); btn.style.transform = "scale(1.2)"; setTimeout(() => btn.style.transform = "", 150); }
  if (count) count.textContent = post.likes;
}

function toggleBookmark(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.bookmarked = !post.bookmarked;
  renderFeed(); renderProfileFeed();
}

function sharePost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.shares++;
  const el = document.getElementById("share-count-" + id);
  if (el) el.textContent = post.shares;
  showToast("Post shared! 🔁");
}

function updatePostCount() {
  const myPosts = posts.filter(p => p.userId === 0);
  const el = document.getElementById("postCount");
  if (el) el.textContent = myPosts.length;
}

// ===== PROFILE FEED =====
function renderProfileFeed() {
  const el = document.getElementById("profileFeed");
  if (!el) return;
  el.innerHTML = posts.map(postHTML).join("") || `<div style="text-align:center;padding:3rem;color:var(--text-muted)">No posts yet</div>`;
}

function switchProfileTab(tab, btn) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const el = document.getElementById("profileFeed");
  if (tab === "posts") renderProfileFeed();
  else if (tab === "media") el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted)">📸 No media yet</div>`;
  else if (tab === "likes") {
    const liked = posts.filter(p => p.liked);
    el.innerHTML = liked.length ? liked.map(postHTML).join("") : `<div style="text-align:center;padding:3rem;color:var(--text-muted)">No liked posts yet</div>`;
  }
}

// ===== MODAL =====
function openModal(postId) {
  activePostIdForModal = postId;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const user = USERS.find(u => u.id === post.userId) || { name: "Maomao", handle: "maomao", avatar: "M", gradient: "gradient-1" };
  const content = post.content.replace(/#(\w+)/g, '<span class="post-tag">#$1</span>');
  document.getElementById("modalContent").innerHTML = `
    <div style="padding:1.5rem 1.5rem 1rem">
      <div class="post-header">
        <div class="avatar avatar-md ${user.gradient}">${user.avatar}</div>
        <div class="post-user-info">
          <div class="post-author">${user.name}</div>
          <div class="post-meta">@${user.handle} · ${post.time}</div>
        </div>
      </div>
      <div class="post-content">${content}</div>
      <div class="post-actions" style="border-top:1px solid var(--border);padding-top:0.75rem">
        <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id}); document.getElementById('modal-like-count').textContent=posts.find(p=>p.id===${post.id}).likes">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span id="modal-like-count">${post.likes}</span>
        </button>
        <button class="action-btn comment-btn"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> ${post.comments.length}</button>
      </div>
    </div>`;
  renderComments();
  document.getElementById("modalOverlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  activePostIdForModal = null;
}

function renderComments() {
  const post = posts.find(p => p.id === activePostIdForModal);
  if (!post) return;
  const el = document.getElementById("commentsSection");
  el.innerHTML = post.comments.length
    ? post.comments.map(c => `
        <div class="comment-item">
          <div class="avatar avatar-sm gradient-1">M</div>
          <div>
            <div class="comment-author">Maomao <span class="comment-time">${c.time}</span></div>
            <div class="comment-text">${c.text}</div>
          </div>
        </div>`).join("")
    : `<div style="padding:1rem 0;text-align:center;color:var(--text-muted);font-size:0.85rem">No comments yet. Be the first! 💬</div>`;
}

function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (!text || activePostIdForModal === null) return;
  const post = posts.find(p => p.id === activePostIdForModal);
  if (!post) return;
  post.comments.push({ text, time: "Just now" });
  input.value = "";
  renderComments();
  renderFeed(); renderProfileFeed();
}

// ===== NOTIFICATIONS =====
function renderNotifications() {
  const el = document.getElementById("notificationsList");
  el.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}" id="notif-${n.id}">
      <div class="notif-icon" style="background:${n.iconBg}">${n.icon}</div>
      <div class="notif-body">
        <p><strong>${n.user}</strong> ${n.text}</p>
        <small>${n.time}</small>
      </div>
      ${n.unread ? '<div class="notif-unread-dot"></div>' : ''}
    </div>`).join("");
}

function markAllRead() {
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifications();
  document.querySelector(".badge").style.display = "none";
  showToast("All notifications marked as read ✓");
}

// ===== MESSAGES =====
function renderConversations() {
  const el = document.getElementById("conversationsList");
  el.innerHTML = CONVERSATIONS.map(c => {
    const user = USERS.find(u => u.id === c.userId);
    return `
      <div class="conversation-item ${activeConvoId === c.id ? 'active' : ''}" onclick="openConversation(${c.id})">
        <div class="avatar avatar-md ${user.gradient}">${user.avatar}</div>
        <div class="convo-info">
          <div class="convo-name">${user.name}<span class="convo-time">${c.time}</span></div>
          <div class="convo-preview">${c.preview}</div>
        </div>
      </div>`;
  }).join("");
}

function openConversation(id) {
  activeConvoId = id;
  const convo = CONVERSATIONS.find(c => c.id === id);
  const user = USERS.find(u => u.id === convo.userId);
  renderConversations();
  const panel = document.getElementById("chatPanel");
  panel.innerHTML = `
    <div class="chat-header">
      <div class="avatar avatar-md ${user.gradient}">${user.avatar}</div>
      <div>
        <div style="font-weight:600">${user.name}</div>
        <div style="font-size:0.75rem;color:var(--green)">● Online</div>
      </div>
    </div>
    <div class="chat-messages" id="chatMessages">
      ${convo.messages.map(m => `<div class="bubble ${m.sent ? 'sent' : 'received'}">${m.text}</div>`).join("")}
    </div>
    <div class="chat-input-row">
      <input class="chat-input" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter') sendMessage(${id})" />
      <button class="btn-primary btn-sm" onclick="sendMessage(${id})">Send</button>
    </div>`;
  const msgs = document.getElementById("chatMessages");
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function sendMessage(convoId) {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  const convo = CONVERSATIONS.find(c => c.id === convoId);
  convo.messages.push({ text, sent: true });
  convo.preview = text;
  input.value = "";
  const msgs = document.getElementById("chatMessages");
  const bubble = document.createElement("div");
  bubble.className = "bubble sent";
  bubble.textContent = text;
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
  renderConversations();
  setTimeout(() => autoReply(convoId), 1200);
}

function autoReply(convoId) {
  const replies = ["That's awesome! 🙌", "Totally agree! 😄", "Haha love it 😂", "Let's catch up soon!", "💯 facts", "No way! 😮"];
  const text = replies[Math.floor(Math.random() * replies.length)];
  const convo = CONVERSATIONS.find(c => c.id === convoId);
  convo.messages.push({ text, sent: false });
  convo.preview = text;
  const msgs = document.getElementById("chatMessages");
  if (msgs) {
    const bubble = document.createElement("div");
    bubble.className = "bubble received";
    bubble.textContent = text;
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
  }
  renderConversations();
}

// ===== EXPLORE =====
function renderTrendingTags() {
  document.getElementById("trendingTags").innerHTML = TRENDING.map(t =>
    `<div class="tag-chip" onclick="filterExplore('${t.tag}')">${t.tag}<br><small style="color:var(--text-muted);font-size:0.7rem">${t.count}</small></div>`
  ).join("");
}

function renderSuggestions() {
  document.getElementById("suggestionsGrid").innerHTML = USERS.map(u => `
    <div class="suggestion-card">
      <div class="avatar avatar-lg ${u.gradient}">${u.avatar}</div>
      <div class="user-name">${u.name}</div>
      <div class="user-handle">@${u.handle}</div>
      <p>${u.bio}</p>
      <button class="follow-btn" onclick="handleFollow(this, '${u.name}')">Follow</button>
    </div>`).join("");
}

function filterExplore(query) {
  document.getElementById("exploreSearch").value = query;
}

function handleFollow(btn, name) {
  const isFollowing = btn.textContent === "Following";
  btn.textContent = isFollowing ? "Follow" : "Following";
  btn.style.background = isFollowing ? "" : "var(--bg-hover)";
  if (!isFollowing) showToast(`You followed ${name}! 🎉`);
}

// ===== RIGHT WIDGETS =====
function renderWhoToFollow() {
  document.getElementById("whoToFollow").innerHTML = USERS.slice(0, 3).map(u => `
    <div class="who-item">
      <div class="avatar avatar-sm ${u.gradient}">${u.avatar}</div>
      <div class="who-info">
        <div class="who-name">${u.name}</div>
        <div class="who-handle">@${u.handle}</div>
      </div>
      <button class="follow-btn" style="font-size:0.75rem;padding:0.3rem 0.8rem" onclick="handleFollow(this,'${u.name}')">Follow</button>
    </div>`).join("");
}

function renderTrendingWidget() {
  document.getElementById("trendingWidget").innerHTML = TRENDING.map(t => `
    <div class="trending-item">
      <div class="tag">${t.tag}</div>
      <div class="count">${t.count}</div>
    </div>`).join("");
}

// ===== TOAST =====
function showToast(msg) {
  const old = document.getElementById("toast");
  if (old) old.remove();
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: "fixed", bottom: "5rem", left: "50%", transform: "translateX(-50%) translateY(20px)",
    background: "var(--bg-card)", border: "1px solid var(--border)",
    color: "var(--text-primary)", padding: "0.75rem 1.5rem",
    borderRadius: "var(--radius-full)", fontSize: "0.88rem", fontWeight: "500",
    boxShadow: "var(--shadow-card)", zIndex: "200",
    transition: "all 0.3s ease", opacity: "0"
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = "1"; toast.style.transform = "translateX(-50%) translateY(0)"; });
  setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(-50%) translateY(20px)"; setTimeout(() => toast.remove(), 300); }, 2500);
}
