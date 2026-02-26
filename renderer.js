const rootDirInput = document.getElementById('rootDir');
const notionLink = document.getElementById('notionLink');
const obsidianVaultPathInput = document.getElementById('obsidianVaultPath');
const browseBtn = document.getElementById('browse');
const browseVaultBtn = document.getElementById('browseVault');
const saveRootBtn = document.getElementById('saveRoot');
const saveVaultBtn = document.getElementById('saveVault');

window.anchorlink.getSettings().then(settings => {
  rootDirInput.value = settings.rootDir || '';
  obsidianVaultPathInput.value = settings.obsidianVaultPath || '';
});

browseBtn.addEventListener('click', async () => {
  const dir = await window.anchorlink.selectDirectory();
  if (dir) rootDirInput.value = dir;
});

browseVaultBtn.addEventListener('click', async () => {
  const dir = await window.anchorlink.selectDirectory();
  if (dir) obsidianVaultPathInput.value = dir;
});

function showSaved(btn) {
  const original = btn.textContent;
  btn.textContent = '已保存 ✓';
  btn.classList.add('saved');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('saved');
  }, 2000);
}

saveRootBtn.addEventListener('click', async () => {
  const current = await window.anchorlink.getSettings();
  await window.anchorlink.saveSettings({
    ...current,
    rootDir: rootDirInput.value.trim(),
  });
  showSaved(saveRootBtn);
});

notionLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.anchorlink.openExternal('https://2sumlab.notion.site/');
});

saveVaultBtn.addEventListener('click', async () => {
  const current = await window.anchorlink.getSettings();
  await window.anchorlink.saveSettings({
    ...current,
    obsidianVaultPath: obsidianVaultPathInput.value.trim(),
  });
  showSaved(saveVaultBtn);
});
