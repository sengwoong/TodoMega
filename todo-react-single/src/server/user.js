// User API (in-memory). Seeds once from public/server/user.json via fetch

const memory = {
  seeded: false,
  users: []
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


