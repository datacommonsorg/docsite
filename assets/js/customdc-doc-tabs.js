const tabGroups = document.querySelectorAll('.gcp-tab-group');

tabGroups.forEach(group => {
  const headers = group.querySelectorAll('.gcp-tab-headers li');
  const contents = group.querySelectorAll('.gcp-tab-content > div');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      headers.forEach(h => h.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      header.classList.add('active');
      contents[index].classList.add('active');
    });
  });
});
