const queue = [
  { date: '20260706', video: 'cozy desk sticker scene.mp4', status: 'Ready', action: 'Publish at 8:00 PM' },
  { date: '20260706', video: 'mini garden room.mp4', status: 'Caption ready', action: 'Waiting in queue' },
  { date: '20260707', video: 'rainy window corner.mp4', status: 'Draft', action: 'Generate caption' },
  { date: '20260708', video: 'blue shelf scene.mp4', status: 'Scheduled', action: 'Monitor status' }
];

const queueRows = document.querySelector('#queueRows');
const captionText = document.querySelector('#captionText');
const videoName = document.querySelector('#videoName');
const activityLog = document.querySelector('#activityLog');

function renderQueue() {
  queueRows.innerHTML = queue.map((item, index) => `
    <tr data-index="${index}">
      <td>${item.date}</td>
      <td>${item.video}</td>
      <td><span class="state">${item.status}</span></td>
      <td>${item.action}</td>
    </tr>
  `).join('');
}

function buildCaption(name) {
  return `ASMR | Scene Sticker - ${name}. #stickers #DIY #satisfying #asmr #scenestickers`;
}

function setActivity(payload) {
  activityLog.textContent = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
}

function refreshCaption() {
  captionText.value = buildCaption(videoName.value.trim() || 'untitled video');
}

queueRows.addEventListener('click', (event) => {
  const row = event.target.closest('tr');
  if (!row) return;
  const item = queue[Number(row.dataset.index)];
  videoName.value = item.video.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  refreshCaption();
  setActivity({
    selected_video: item.video,
    date_folder: item.date,
    status: item.status,
    next_action: item.action
  });
});

document.querySelector('#refreshQueue').addEventListener('click', () => {
  renderQueue();
  setActivity('Queue refreshed. The oldest ready video remains first in the publishing order.');
});

document.querySelector('#generateCaption').addEventListener('click', () => {
  refreshCaption();
  setActivity({ caption: captionText.value });
});

document.querySelector('#runDemo').addEventListener('click', () => {
  setActivity({
    workflow: 'Sandbox publishing preview',
    login_kit: 'OAuth account authorization completed in sandbox testing.',
    creator_info_query: 'Creator privacy options and max video duration checked.',
    video_init: 'Publish ID and upload URL requested through Content Posting API.',
    upload_status: 'Video chunks are uploaded and status is tracked before marking the item complete.'
  });
});

renderQueue();
refreshCaption();
