// User API (in-memory). Seeds once from public/server/user.json via fetch
// Adds simple token issuing/validation in memory for demo use.

const memory = {
  seeded: false,
  users: [],
  tokens: new Map() // token -> { userId, expiresAt|null }
};

async function ensureSeeded() {
  if (!memory.seeded) {
    let users = [];
    try {
      const res = await fetch('/server/user.json');
      if (res && res.ok) {
        try {
          users = await res.json();
        } catch {}
      }
    } catch {}
    memory.users = Array.isArray(users) ? users : [];
    memory.seeded = true;
  }
  return { users: memory.users };
}

export async function getUsers() {
  const { users } = await ensureSeeded();
  return users.slice();
}

export async function createUser(newUser) {
  const { users } = await ensureSeeded();
  const nextId = users.length > 0 ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1 : 1;
  const user = {
    id: nextId,
    username: String(newUser.username || '').trim(),
    name: String(newUser.name || '').trim() || newUser.username,
  };
  if (!user.username) throw new Error('username이 필요합니다.');
  if (users.some((u) => u.username === user.username)) throw new Error('이미 존재하는 username 입니다.');
  memory.users = [...users, user];
  return user;
}

export async function deleteUser(id) {
  const { users } = await ensureSeeded();
  memory.users = users.filter((u) => String(u.id) !== String(id));
  return { ok: true };
}

// -----------------------------
// Token helpers (demo only)
// -----------------------------
function randomToken() {
  try {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function isExpired(record) {
  return record && typeof record.expiresAt === 'number' && Date.now() > record.expiresAt;
}

export async function login(username, options = {}) {
  const { users } = await ensureSeeded();
  const user = users.find((u) => u.username === String(username).trim());
  if (!user) throw new Error('존재하지 않는 사용자입니다.');

  const token = randomToken();
  const ttlMs = typeof options.ttlMs === 'number' && options.ttlMs > 0 ? options.ttlMs : null;
  const record = { userId: user.id, expiresAt: ttlMs ? Date.now() + ttlMs : null };
  memory.tokens.set(token, record);
  return { token, user };
}

export async function logout(token) {
  memory.tokens.delete(String(token));
  return { ok: true };
}

export async function getCurrentUser(token) {
  await ensureSeeded();
  const rec = memory.tokens.get(String(token));
  if (!rec) return null;
  if (isExpired(rec)) {
    memory.tokens.delete(String(token));
    return null;
  }
  return memory.users.find((u) => String(u.id) === String(rec.userId)) || null;
}


