let notificationsList = [];

async function fetchNotifications() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await axios.get('http://localhost:5000/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    });

    notificationsList = response.data;
    updateBadge();
    archiveReadNotifications();
  } catch (err) {
    console.error('Erreur notifications:', err);
  }
}

function updateBadge() {
  const unread = notificationsList.filter(n => !n.isRead).length;
  const badge = document.getElementById('notification-badge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'inline' : 'none';
  }
}

async function markAsRead(id) {
  const token = localStorage.getItem('token');
  try {
    await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotifications();
  } catch (err) {
    console.error('Erreur mark as read:', err);
  }
}

function archiveReadNotifications() {
  const read = notificationsList.filter(n => n.isRead);
  localStorage.setItem('archivedNotifications', JSON.stringify(read));
}


setInterval(fetchNotifications, 30000);


fetchNotifications();